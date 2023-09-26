import { CAMERA, DEFAULT_VIEW_MATRIX } from './consts'
import { newWorker } from './createWorker.mjs'
import { webglInitialize } from './webglInitialize'
import {
  getProjectionMatrix,
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

export const main = async (
  canvas: HTMLCanvasElement,
  spinner: HTMLElement,
  splatDataSrc: string
) => {
  const url = new URL(splatDataSrc)
  const response = await fetch(url, {
    mode: 'cors', // no-cors, *cors, same-origin
    credentials: 'omit', // include, *same-origin, omit
  })

  if (!response.ok) {
    throw new Error(`fetch failed: ${response.status}`)
  }
  if (response.body === null) {
    throw new Error('response.body is null')
  }
  const carousel = true

  const jumpDelta = 0
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

  worker.addEventListener('message', (e: MessageEvent<Message>) => {
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
  })

  let startX: number | undefined
  let startY: number | undefined
  let down: 1 | 2 | false | undefined

  const frame = () => {
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
      spinner.style.display = 'none'
      gl.uniformMatrix4fv(u_view, false, actualViewMatrix)
      ext.drawArraysInstancedANGLE(gl.TRIANGLE_FAN, 0, 4, vertexCount)
    } else {
      gl.clear(gl.COLOR_BUFFER_BIT)
      spinner.style.display = 'block'
      start = Date.now() + 2000
    }

    requestAnimationFrame(frame)
  }
  requestAnimationFrame(frame)

  let bytesRead = 0
  let lastVertexCount = -1

  for (;;) {
    const { done, value } = await reader.read()
    if (done) break

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
