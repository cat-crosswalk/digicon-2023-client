import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js'

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
  let reader: ReadableStreamDefaultReader<Uint8Array>
  try {
    const url = new URL(splatDataSrc)
    const response = await fetch(url, {
      mode: 'cors',
      credentials: 'omit',
      signal,
    })

    if (!response.ok) {
      throw new Error(`fetch failed: ${response.status}`)
    } else if (response.body === null) {
      throw new Error('response.body is null')
    }

    reader = response.body.getReader()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    if (e.name === 'AbortError') return
    throw e
  }

  canvas.width = canvasSize.width
  canvas.height = canvasSize.height

  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0xcccccc)

  const camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height)
  camera.position.set(0, 0, 10)
  scene.add(camera)

  const controls = new OrbitControls(camera, canvas)
  controls.update()

  // const cube = new THREE.Mesh(
  //   new THREE.BoxGeometry(2, 2, 2),
  //   new THREE.MeshNormalMaterial()
  // )
  // scene.add(cube)

  const renderer = new THREE.WebGLRenderer({ canvas })
  renderer.setSize(canvas.width, canvas.height)
  const render = () => {
    renderer.render(scene, camera)
    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)

  void (async () => {
    onLoadingChange(true)
    for (;;) {
      try {
        const { done, value } = await reader.read()
        if (done || value === undefined) {
          console.log('finish reading splat data!')
          onLoadingChange(false)
          break
        }

        // TODO: 多分pointsを適宜変更してneedUpdateを呼ぶ方が良い
        // NOTE: bufferは.splat形式になっている必要がある(position, scale, color, quaternionの組)
        const points = newPoints(value)
        scene.add(points)

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        if (e.name === 'AbortError') return
        throw e
      }
    }
  })()
}

const newPoints = (array: Uint8Array) => {
  const { positions, scales, colors, quaternions } = parseSplatAttrs(array)

  const geometry = new THREE.BufferGeometry()

  geometry.setFromPoints(positions.map(p => new THREE.Vector3(...p)))
  geometry.setAttribute(
    'scales',
    new THREE.Float32BufferAttribute(
      scales.flatMap(attr => [...attr]),
      3
    )
  )
  geometry.setAttribute(
    'color',
    new THREE.Uint8ClampedBufferAttribute(
      colors.flatMap(attr => [...attr]),
      4,
      true // enable normalization
    )
  )
  geometry.setAttribute(
    'quaternion',
    new THREE.Uint8ClampedBufferAttribute(
      quaternions.flatMap(attr => [...attr]),
      4
    )
  )

  const material = new THREE.PointsMaterial({
    size: 0.1,
    vertexColors: true,
    transparent: true,
  })
  // const material = new THREE.RawShaderMaterial({
  //   uniforms: {
  //   },
  //   vertexShader: `
  //     attribute vec3 position;
  //     attribute vec3 scales;
  //     attribute vec4 color;
  //     attribute vec4 quaternion;

  //     uniform mat4 modelViewMatrix;
  // 		uniform mat4 projectionMatrix;

  //     varying vec4 vColor;

  //     void main() {
  //       gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  //       gl_PointSize = scales.x; // TODO
  //     }
  //     `,
  //   fragmentShader: `
  //     precision mediump float;
  //     precision mediump int;

  //     varying vec4 vColor;

  //     void main() {
  //       gl_FragColor = vColor;
  //     }
  //     `,
  //   vertexColors: true,
  //   transparent: true,
  // })

  const points = new THREE.Points(geometry, material)

  return points
}

const parseSplatAttrs = (array: Uint8Array) => {
  const { buffer, length } = array

  // rowLength = position(4byte * 3)  + scale(4byte * 3) + color(1byte * 4) + quaternion(1byte * 4)
  const rowLength = 4 * 3 + 4 * 3 + 4 + 4
  const count = length / rowLength
  let offset = 0

  // position: x,y,z
  const positions = Array.from(
    { length: count },
    (_, i) => new Float32Array(buffer, i * rowLength + offset, 3).map(x => -x) // TODO: why flip?
  )
  offset += 4 * 3

  // scale: x,y,z
  const scales = Array.from(
    { length: count },
    (_, i) => new Float32Array(buffer, i * rowLength + offset, 3)
  )
  offset += 4 * 3

  //  color: r,g,b,a
  const colors = Array.from(
    { length: count },
    (_, i) => new Uint8ClampedArray(buffer, i * rowLength + offset, 4)
  )
  offset += 4

  // quaternion: x,y,z,w
  const quaternions = Array.from(
    { length: count },
    (_, i) => new Uint8ClampedArray(buffer, i * rowLength + offset, 4)
  )

  return { positions, scales, colors, quaternions }
}
