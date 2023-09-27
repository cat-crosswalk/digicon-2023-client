/**
 * Copyright (c) 2023 Kevin Kwok
 *
 * https://github.com/antimatter15/splat/blob/main/LICENSE
 */

import { trimNumber } from '@/utils/trimNumber'

import { CAMERA, CAMERAS, DEFAULT_VIEW_MATRIX } from './consts'
import { newWorker } from './createWorker.mjs'
import { webglInitialize } from './webglInitialize'
import {
  getProjectionMatrix,
  getViewMatrix,
  invert4,
  multiply4,
  rotate4,
  translate4,
} from './webglUtils'

import type { Matrix } from './webglUtils'

interface NotViewMessage {
  view?: never
}
interface NotPlyMessage {
  ply?: never
}
interface NotBufferMessage {
  buffer?: never
  vertexCount?: never
}
interface NotCovAMessage {
  covA?: never
  covB?: never
  center?: never
  color?: never
  viewProj?: never
}

interface ViewMessage extends NotPlyMessage, NotBufferMessage, NotCovAMessage {
  view: Matrix
}
interface PlyMessage extends NotViewMessage, NotBufferMessage, NotCovAMessage {
  ply: ArrayBufferLike
}
interface BufferMessage extends NotViewMessage, NotPlyMessage, NotCovAMessage {
  buffer: ArrayBufferLike
  vertexCount: number
}
interface CovAMessage extends NotViewMessage, NotPlyMessage, NotBufferMessage {
  covA: Float32Array
  covB: Float32Array
  center: Float32Array
  color: Float32Array
  viewProj: Matrix
}

const toNumber = (x: string | null | undefined): number | null => {
  if (x === null || x === undefined) return null
  const n = Number(x)
  return isNaN(n) ? null : n
}

type Message = ViewMessage | PlyMessage | BufferMessage | CovAMessage

interface ReadonlyRefObject<T> {
  readonly current: T
}

export const renderSplatting = async (
  canvas: HTMLCanvasElement,
  splatDataSrc: string,
  canvasSize: {
    width: number
    height: number
  },
  allowKeyboardControl: ReadonlyRefObject<boolean>,
  onLoadingChange: (loaded: boolean) => void,
  wantScreenshot: ReadonlyRefObject<EventTarget | null>,
  signal?: AbortSignal
) => {
  const url = new URL(splatDataSrc)
  let response: Response
  try {
    response = await fetch(url, {
      mode: 'cors', // no-cors, *cors, same-origin
      credentials: 'omit', // include, *same-origin, omit
      signal,
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    if (e.name === 'AbortError') return
    throw e
  }

  if (!response.ok) {
    throw new Error(`fetch failed: ${response.status}`)
  }
  if (response.body === null) {
    throw new Error('response.body is null')
  }
  let carousel = true

  let jumpDelta = 0
  let vertexCount = 0

  let start = 0

  let viewMatrix = [...DEFAULT_VIEW_MATRIX]

  const rowLength = 3 * 4 + 3 * 4 + 4 + 4
  const reader = response.body.getReader()
  let splatData = new Uint8Array(
    toNumber(response.headers.get('content-length')) ?? 0
  )

  const downsample =
    splatData.length / rowLength > 500000 ? 1 : 1 / window.devicePixelRatio

  const worker = newWorker()

  canvas.width = canvasSize.width / downsample
  canvas.height = canvasSize.height / downsample

  const projectionMatrix = getProjectionMatrix(
    CAMERA.fx / downsample,
    CAMERA.fy / downsample,
    canvas.width,
    canvas.height
  )

  const gl = canvas.getContext('webgl')
  if (gl === null) {
    throw new Error('webgl is null')
  }

  const { ext, centerBuffer, colorBuffer, covABuffer, covBBuffer, u_view } =
    webglInitialize(gl, canvas, projectionMatrix, viewMatrix, downsample)

  worker.addEventListener(
    'message',
    (e: MessageEvent<Message>) => {
      if (e.data.buffer !== undefined) {
        splatData = new Uint8Array(e.data.buffer)
        const blob = new Blob([splatData.buffer], {
          type: 'application/octet-stream',
        })
        const link = document.createElement('a')
        link.download = 'model.splat'
        link.href = URL.createObjectURL(blob)
        document.body.appendChild(link)
        link.click()
      } else if (e.data.covA !== undefined) {
        const { covA, covB, center, color } = e.data

        vertexCount = center.length / 3

        gl.bindBuffer(gl.ARRAY_BUFFER, centerBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, center, gl.DYNAMIC_DRAW)

        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, color, gl.DYNAMIC_DRAW)

        gl.bindBuffer(gl.ARRAY_BUFFER, covABuffer)
        gl.bufferData(gl.ARRAY_BUFFER, covA, gl.DYNAMIC_DRAW)

        gl.bindBuffer(gl.ARRAY_BUFFER, covBBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, covB, gl.DYNAMIC_DRAW)
      }
    },
    { signal }
  )

  const activeKeys = new Set<string>()

  window.addEventListener(
    'keydown',
    e => {
      if (!allowKeyboardControl.current) return
      if (document.activeElement !== canvas) return
      carousel = false

      if (!activeKeys.has(e.key)) {
        activeKeys.add(e.key)
      }
      if (/\d/.test(e.key)) {
        viewMatrix = getViewMatrix(CAMERAS[Number(e.key)])
      }

      switch (e.key) {
        case 'p':
          carousel = true
          break
      }
    },
    { signal }
  )
  window.addEventListener(
    'keyup',
    e => {
      activeKeys.delete(e.key)
    },
    { signal }
  )
  window.addEventListener(
    'blur',
    () => {
      activeKeys.clear()
    },
    { signal }
  )
  window.addEventListener(
    'wheel',
    e => {
      if (!allowKeyboardControl.current) return

      carousel = false
      e.preventDefault()
      const lineHeight = 10
      const scale =
        e.deltaMode === 1
          ? lineHeight
          : e.deltaMode === 2
          ? canvasSize.height
          : 1
      let inv = invert4(viewMatrix)
      if (inv === null) {
        throw new Error('inv is null')
      }
      if (e.shiftKey) {
        inv = translate4(
          inv,
          (e.deltaX * scale) / canvasSize.width,
          (e.deltaY * scale) / canvasSize.height,
          0
        )
      } else if (e.ctrlKey || e.metaKey) {
        const preY = inv[13]
        inv = translate4(
          inv,
          0,
          0,
          (-10 * (e.deltaY * scale)) / canvasSize.height
        )
        inv[13] = preY
      } else {
        const d = 4
        inv = translate4(inv, 0, 0, d)
        inv = rotate4(inv, -(e.deltaX * scale) / canvasSize.width, 0, 1, 0)
        inv = rotate4(inv, (e.deltaY * scale) / canvasSize.height, 1, 0, 0)
        inv = translate4(inv, 0, 0, -d)
      }

      const invinv = invert4(inv)
      if (invinv === null) {
        throw new Error('invinv is null')
      }
      viewMatrix = invinv
    },
    { passive: false, signal }
  )

  let startX: number | undefined
  let startY: number | undefined
  let down: 1 | 2 | false | undefined
  canvas.addEventListener(
    'mousedown',
    e => {
      carousel = false
      e.preventDefault()
      startX = e.clientX
      startY = e.clientY
      down = e.ctrlKey || e.metaKey ? 2 : 1
    },
    { signal }
  )
  canvas.addEventListener(
    'contextmenu',
    e => {
      carousel = false
      e.preventDefault()
      startX = e.clientX
      startY = e.clientY
      down = 2
    },
    { signal }
  )

  canvas.addEventListener(
    'mousemove',
    e => {
      e.preventDefault()
      if (startX === undefined || startY === undefined) {
        return
      }
      if (down === 1) {
        let inv = invert4(viewMatrix)
        if (inv === null) {
          throw new Error('inv is null')
        }
        const dx = (5 * (e.clientX - startX)) / canvasSize.width
        const dy = (5 * (e.clientY - startY)) / canvasSize.height
        const d = 4

        inv = translate4(inv, 0, 0, d)
        inv = rotate4(inv, dx, 0, 1, 0)
        inv = rotate4(inv, -dy, 1, 0, 0)
        inv = translate4(inv, 0, 0, -d)

        const invinv = invert4(inv)
        if (invinv === null) {
          throw new Error('invinv is null')
        }
        viewMatrix = invinv

        startX = e.clientX
        startY = e.clientY
      } else if (down === 2) {
        let inv = invert4(viewMatrix)
        if (inv === null) {
          throw new Error('inv is null')
        }
        const preY = inv[13]
        inv = translate4(
          inv,
          (-10 * (e.clientX - startX)) / canvasSize.width,
          0,
          (10 * (e.clientY - startY)) / canvasSize.height
        )
        inv[13] = preY
        const invinv = invert4(inv)
        if (invinv === null) {
          throw new Error('invinv is null')
        }
        viewMatrix = invinv

        startX = e.clientX
        startY = e.clientY
      }
    },
    { signal }
  )
  canvas.addEventListener(
    'mouseup',
    e => {
      e.preventDefault()
      startX = undefined
      startY = undefined
      down = undefined
    },
    { signal }
  )

  let altX = 0,
    altY = 0
  canvas.addEventListener(
    'touchstart',
    e => {
      e.preventDefault()
      if (e.touches.length === 1) {
        carousel = false
        startX = e.touches[0].clientX
        startY = e.touches[0].clientY
        down = 1
      } else if (e.touches.length === 2) {
        carousel = false
        startX = e.touches[0].clientX
        altX = e.touches[1].clientX
        startY = e.touches[0].clientY
        altY = e.touches[1].clientY
        down = 1
      }
    },
    { passive: false, signal }
  )
  canvas.addEventListener(
    'touchmove',
    e => {
      e.preventDefault()
      if (startX === undefined || startY === undefined) {
        return
      }
      if (e.touches.length === 1 && down !== undefined) {
        let inv = invert4(viewMatrix)
        if (inv === null) {
          throw new Error('inv is null')
        }
        const dx = (4 * (e.touches[0].clientX - startX)) / canvasSize.width
        const dy = (4 * (e.touches[0].clientY - startY)) / canvasSize.height
        const d = 4

        inv = translate4(inv, 0, 0, d)
        inv = rotate4(inv, dx, 0, 1, 0)
        inv = rotate4(inv, -dy, 1, 0, 0)
        inv = translate4(inv, 0, 0, -d)

        const invinv = invert4(inv)
        if (invinv === null) {
          throw new Error('invinv is null')
        }

        viewMatrix = invinv

        startX = e.touches[0].clientX
        startY = e.touches[0].clientY
      } else if (e.touches.length === 2) {
        const dtheta =
          Math.atan2(startY - altY, startX - altX) -
          Math.atan2(
            e.touches[0].clientY - e.touches[1].clientY,
            e.touches[0].clientX - e.touches[1].clientX
          )
        const dscale =
          Math.hypot(startX - altX, startY - altY) /
          Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
          )
        const dx =
          (e.touches[0].clientX + e.touches[1].clientX - (startX + altX)) / 2
        const dy =
          (e.touches[0].clientY + e.touches[1].clientY - (startY + altY)) / 2

        let inv = invert4(viewMatrix)
        if (inv === null) {
          throw new Error('inv is null')
        }

        inv = rotate4(inv, dtheta, 0, 0, 1)
        inv = translate4(inv, -dx / canvasSize.width, dy / canvasSize.height, 0)

        const preY = inv[13]
        inv = translate4(inv, 0, 0, 3 * (1 - dscale))
        inv[13] = preY

        const invinv = invert4(inv)
        if (invinv === null) {
          throw new Error('invinv is null')
        }
        viewMatrix = invinv

        startX = e.touches[0].clientX
        startY = e.touches[0].clientY
        altX = e.touches[1].clientX
        altY = e.touches[1].clientY
      }
    },
    { passive: false, signal }
  )
  canvas.addEventListener(
    'touchend',
    e => {
      e.preventDefault()
      startX = undefined
      startY = undefined
      down = undefined
    },
    { passive: false, signal }
  )

  const frame = () => {
    if (signal?.aborted === true) return

    viewMatrix = handleActiveKeys(activeKeys, viewMatrix)

    if (carousel) {
      let inv = invert4(DEFAULT_VIEW_MATRIX)
      if (inv === null) {
        throw new Error('inv is null')
      }

      const t = Math.sin((Date.now() - start) / 5000)
      inv = translate4(inv, 2.5 * t, 0, 6 * (1 - Math.cos(t)))
      inv = rotate4(inv, -0.6 * t, 0, 1, 0)

      const invinv = invert4(inv)
      if (invinv === null) {
        throw new Error('invinv is null')
      }

      viewMatrix = invinv
    }

    if (activeKeys.has(' ')) {
      jumpDelta += 0.05
    } else {
      jumpDelta -= 0.95
    }
    jumpDelta = trimNumber(0, 1)(jumpDelta)

    let inv2 = invert4(viewMatrix)
    if (inv2 === null) {
      throw new Error('inv2 is null')
    }
    inv2[13] -= jumpDelta
    inv2 = rotate4(inv2, -0.1 * jumpDelta, 1, 0, 0)

    const actualViewMatrix = invert4(inv2)
    if (actualViewMatrix === null) {
      throw new Error('actualViewMatrix is null')
    }

    const viewProj = multiply4(projectionMatrix, actualViewMatrix)
    worker.postMessage({ view: viewProj } satisfies ViewMessage)

    if (vertexCount > 0) {
      onLoadingChange(true)
      gl.uniformMatrix4fv(u_view, false, actualViewMatrix)
      ext.drawArraysInstancedANGLE(gl.TRIANGLE_FAN, 0, 4, vertexCount)
    } else {
      gl.clear(gl.COLOR_BUFFER_BIT)
      onLoadingChange(false)
      start = Date.now() + 2000
    }

    if (wantScreenshot.current !== null) {
      const blob = canvas.toDataURL('image/png')
      wantScreenshot.current.dispatchEvent(
        new CustomEvent('screenshot', { detail: blob })
      )
    }

    requestAnimationFrame(frame)
  }
  requestAnimationFrame(frame)

  let bytesRead = 0
  let lastVertexCount = -1

  for (;;) {
    if (signal?.aborted === true) {
      worker.terminate()
      return
    }
    let done: boolean, value: Uint8Array | undefined
    try {
      const result = await reader.read()
      done = result.done
      value = result.value
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      if (e.name === 'AbortError') return
      throw e
    }
    if (done || value === undefined) break

    splatData.set(value, bytesRead)
    bytesRead += value.length

    if (vertexCount > lastVertexCount) {
      worker.postMessage({
        buffer: splatData.buffer,
        vertexCount: Math.floor(bytesRead / rowLength),
      } satisfies BufferMessage)
      lastVertexCount = vertexCount
    }
  }

  worker.postMessage({
    buffer: splatData.buffer,
    vertexCount: Math.floor(bytesRead / rowLength),
  } satisfies BufferMessage)
}

const handleActiveKeys = (activeKeys: Set<string>, viewMatrix: Matrix) => {
  let inv = invert4(viewMatrix)
  if (inv === null) {
    throw new Error('inv is null')
  }
  if (activeKeys.has('ArrowUp')) {
    if (activeKeys.has('Shift')) {
      inv = translate4(inv, 0, -0.03, 0)
    } else {
      const preY = inv[13]
      inv = translate4(inv, 0, 0, 0.1)
      inv[13] = preY
    }
  }

  if (activeKeys.has('ArrowDown')) {
    if (activeKeys.has('Shift')) {
      inv = translate4(inv, 0, 0.03, 0)
    } else {
      const preY = inv[13]
      inv = translate4(inv, 0, 0, -0.1)
      inv[13] = preY
    }
  }

  if (activeKeys.has('ArrowLeft')) {
    inv = translate4(inv, -0.03, 0, 0)
  }
  if (activeKeys.has('ArrowRight')) {
    inv = translate4(inv, 0.03, 0, 0)
  }

  if (activeKeys.has('a')) {
    inv = rotate4(inv, -0.01, 0, 1, 0)
  }
  if (activeKeys.has('d')) {
    inv = rotate4(inv, 0.01, 0, 1, 0)
  }
  if (activeKeys.has('q')) {
    inv = rotate4(inv, 0.01, 0, 0, 1)
  }
  if (activeKeys.has('e')) {
    inv = rotate4(inv, -0.01, 0, 0, 1)
  }
  if (activeKeys.has('w')) {
    inv = rotate4(inv, 0.005, 1, 0, 0)
  }
  if (activeKeys.has('s')) {
    inv = rotate4(inv, -0.005, 1, 0, 0)
  }

  if (['j', 'k', 'l', 'i'].some(k => activeKeys.has(k))) {
    const d = 4
    inv = translate4(inv, 0, 0, d)
    inv = rotate4(
      inv,
      activeKeys.has('j') ? -0.05 : activeKeys.has('l') ? 0.05 : 0,
      0,
      1,
      0
    )
    inv = rotate4(
      inv,
      activeKeys.has('i') ? 0.05 : activeKeys.has('k') ? -0.05 : 0,
      1,
      0,
      0
    )
    inv = translate4(inv, 0, 0, -d)
  }

  const invinv = invert4(inv)
  if (invinv === null) {
    throw new Error('invinv is null')
  }

  return invinv
}
