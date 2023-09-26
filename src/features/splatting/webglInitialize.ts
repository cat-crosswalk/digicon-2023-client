/**
 * Copyright (c) 2023 Kevin Kwok
 *
 * https://github.com/antimatter15/splat/blob/main/LICENSE
 */

import { CAMERA } from './consts'
import fragmentShaderSource from './fragmentShaderSource.frag?raw'
import vertexShaderSource from './vertexShaderSource.vert?raw'

import type { Matrix } from './webglUtils'

export const webglInitialize = (
  gl: WebGLRenderingContext,
  canvas: HTMLCanvasElement,
  projectionMatrix: Matrix,
  viewMatrix: Matrix,
  downsample: number
) => {
  const ext = gl.getExtension('ANGLE_instanced_arrays')
  if (ext === null) throw new Error('ANGLE_instanced_arrays is null')

  const vertexShader = gl.createShader(gl.VERTEX_SHADER)
  if (vertexShader === null) throw new Error('vertexShader is null')
  gl.shaderSource(vertexShader, vertexShaderSource)
  gl.compileShader(vertexShader)
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(vertexShader))
  }

  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
  if (fragmentShader === null) throw new Error('fragmentShader is null')
  gl.shaderSource(fragmentShader, fragmentShaderSource)
  gl.compileShader(fragmentShader)
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(fragmentShader))
  }

  const program = gl.createProgram()
  if (program === null) throw new Error('program is null')
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  gl.useProgram(program)

  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program))
  }

  gl.disable(gl.DEPTH_TEST) // Disable depth testing

  // Enable blending
  gl.enable(gl.BLEND)

  // Set blending function
  gl.blendFuncSeparate(
    gl.ONE_MINUS_DST_ALPHA,
    gl.ONE,
    gl.ONE_MINUS_DST_ALPHA,
    gl.ONE
  )

  // Set blending equation
  gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD)

  // projection
  const u_projection = gl.getUniformLocation(program, 'projection')
  gl.uniformMatrix4fv(u_projection, false, projectionMatrix)

  // viewport
  const u_viewport = gl.getUniformLocation(program, 'viewport')
  gl.uniform2fv(u_viewport, new Float32Array([canvas.width, canvas.height]))

  // focal
  const u_focal = gl.getUniformLocation(program, 'focal')
  gl.uniform2fv(
    u_focal,
    new Float32Array([CAMERA.fx / downsample, CAMERA.fy / downsample])
  )

  // view
  const u_view = gl.getUniformLocation(program, 'view')
  gl.uniformMatrix4fv(u_view, false, viewMatrix)

  // positions
  const triangleVertices = new Float32Array([-2, -2, 2, -2, 2, 2, -2, 2])
  const vertexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, triangleVertices, gl.STATIC_DRAW)
  const a_position = gl.getAttribLocation(program, 'position')
  gl.enableVertexAttribArray(a_position)
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 0, 0)

  // center
  const centerBuffer = gl.createBuffer()
  // gl.bindBuffer(gl.ARRAY_BUFFER, centerBuffer);
  // gl.bufferData(gl.ARRAY_BUFFER, center, gl.STATIC_DRAW);
  const a_center = gl.getAttribLocation(program, 'center')
  gl.enableVertexAttribArray(a_center)
  gl.bindBuffer(gl.ARRAY_BUFFER, centerBuffer)
  gl.vertexAttribPointer(a_center, 3, gl.FLOAT, false, 0, 0)
  ext.vertexAttribDivisorANGLE(a_center, 1) // Use the extension here

  // color
  const colorBuffer = gl.createBuffer()
  // gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  // gl.bufferData(gl.ARRAY_BUFFER, color, gl.STATIC_DRAW);
  const a_color = gl.getAttribLocation(program, 'color')
  gl.enableVertexAttribArray(a_color)
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
  gl.vertexAttribPointer(a_color, 4, gl.FLOAT, false, 0, 0)
  ext.vertexAttribDivisorANGLE(a_color, 1) // Use the extension here

  // cov
  const covABuffer = gl.createBuffer()
  const a_covA = gl.getAttribLocation(program, 'covA')
  gl.enableVertexAttribArray(a_covA)
  gl.bindBuffer(gl.ARRAY_BUFFER, covABuffer)
  gl.vertexAttribPointer(a_covA, 3, gl.FLOAT, false, 0, 0)
  ext.vertexAttribDivisorANGLE(a_covA, 1) // Use the extension here

  const covBBuffer = gl.createBuffer()
  const a_covB = gl.getAttribLocation(program, 'covB')
  gl.enableVertexAttribArray(a_covB)
  gl.bindBuffer(gl.ARRAY_BUFFER, covBBuffer)
  gl.vertexAttribPointer(a_covB, 3, gl.FLOAT, false, 0, 0)
  ext.vertexAttribDivisorANGLE(a_covB, 1) // Use the extension here

  return {
    ext,
    centerBuffer,
    colorBuffer,
    covABuffer,
    covBBuffer,
    u_view,
  }
}
