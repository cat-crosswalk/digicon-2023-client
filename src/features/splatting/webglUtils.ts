/**
 * Copyright (c) 2023 Kevin Kwok
 *
 * https://github.com/antimatter15/splat/blob/main/LICENSE
 */

import type { Camera } from './consts'

export type Matrix = number[]
export type ReadonlyMatrix = readonly number[]

export const getProjectionMatrix = (
  fx: number,
  fy: number,
  width: number,
  height: number
): Matrix => {
  const zNear = 0.2
  const zFar = 200

  return [
    [(2 * fx) / width, 0, 0, 0],
    [0, -(2 * fy) / height, 0, 0],
    [0, 0, zFar / (zFar - zNear), 1],
    [0, 0, -(zFar * zNear) / (zFar - zNear), 0],
  ].flat()
}

export const getViewMatrix = (camera: Camera): Matrix => {
  const R = camera.rotation.flat()
  const t = camera.position
  const camToWorld = [
    [R[0], R[1], R[2], 0],
    [R[3], R[4], R[5], 0],
    [R[6], R[7], R[8], 0],
    [
      -t[0] * R[0] - t[1] * R[3] - t[2] * R[6],
      -t[0] * R[1] - t[1] * R[4] - t[2] * R[7],
      -t[0] * R[2] - t[1] * R[5] - t[2] * R[8],
      1,
    ],
  ].flat()
  return camToWorld
}

export const multiply4 = (a: ReadonlyMatrix, b: ReadonlyMatrix): Matrix => {
  return [
    b[0] * a[0] + b[1] * a[4] + b[2] * a[8] + b[3] * a[12],
    b[0] * a[1] + b[1] * a[5] + b[2] * a[9] + b[3] * a[13],
    b[0] * a[2] + b[1] * a[6] + b[2] * a[10] + b[3] * a[14],
    b[0] * a[3] + b[1] * a[7] + b[2] * a[11] + b[3] * a[15],
    b[4] * a[0] + b[5] * a[4] + b[6] * a[8] + b[7] * a[12],
    b[4] * a[1] + b[5] * a[5] + b[6] * a[9] + b[7] * a[13],
    b[4] * a[2] + b[5] * a[6] + b[6] * a[10] + b[7] * a[14],
    b[4] * a[3] + b[5] * a[7] + b[6] * a[11] + b[7] * a[15],
    b[8] * a[0] + b[9] * a[4] + b[10] * a[8] + b[11] * a[12],
    b[8] * a[1] + b[9] * a[5] + b[10] * a[9] + b[11] * a[13],
    b[8] * a[2] + b[9] * a[6] + b[10] * a[10] + b[11] * a[14],
    b[8] * a[3] + b[9] * a[7] + b[10] * a[11] + b[11] * a[15],
    b[12] * a[0] + b[13] * a[4] + b[14] * a[8] + b[15] * a[12],
    b[12] * a[1] + b[13] * a[5] + b[14] * a[9] + b[15] * a[13],
    b[12] * a[2] + b[13] * a[6] + b[14] * a[10] + b[15] * a[14],
    b[12] * a[3] + b[13] * a[7] + b[14] * a[11] + b[15] * a[15],
  ]
}

export const invert4 = (a: ReadonlyMatrix): Matrix | null => {
  const b00 = a[0] * a[5] - a[1] * a[4]
  const b01 = a[0] * a[6] - a[2] * a[4]
  const b02 = a[0] * a[7] - a[3] * a[4]
  const b03 = a[1] * a[6] - a[2] * a[5]
  const b04 = a[1] * a[7] - a[3] * a[5]
  const b05 = a[2] * a[7] - a[3] * a[6]
  const b06 = a[8] * a[13] - a[9] * a[12]
  const b07 = a[8] * a[14] - a[10] * a[12]
  const b08 = a[8] * a[15] - a[11] * a[12]
  const b09 = a[9] * a[14] - a[10] * a[13]
  const b10 = a[9] * a[15] - a[11] * a[13]
  const b11 = a[10] * a[15] - a[11] * a[14]

  const det =
    b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06

  if (det === 0) return null

  return [
    (a[5] * b11 - a[6] * b10 + a[7] * b09) / det,
    (a[2] * b10 - a[1] * b11 - a[3] * b09) / det,
    (a[13] * b05 - a[14] * b04 + a[15] * b03) / det,
    (a[10] * b04 - a[9] * b05 - a[11] * b03) / det,
    (a[6] * b08 - a[4] * b11 - a[7] * b07) / det,
    (a[0] * b11 - a[2] * b08 + a[3] * b07) / det,
    (a[14] * b02 - a[12] * b05 - a[15] * b01) / det,
    (a[8] * b05 - a[10] * b02 + a[11] * b01) / det,
    (a[4] * b10 - a[5] * b08 + a[7] * b06) / det,
    (a[1] * b08 - a[0] * b10 - a[3] * b06) / det,
    (a[12] * b04 - a[13] * b02 + a[15] * b00) / det,
    (a[9] * b02 - a[8] * b04 - a[11] * b00) / det,
    (a[5] * b07 - a[4] * b09 - a[6] * b06) / det,
    (a[0] * b09 - a[1] * b07 + a[2] * b06) / det,
    (a[13] * b01 - a[12] * b03 - a[14] * b00) / det,
    (a[8] * b03 - a[9] * b01 + a[10] * b00) / det,
  ]
}

export const rotate4 = (
  a: ReadonlyMatrix,
  rad: number,
  x: number,
  y: number,
  z: number
): Matrix => {
  const len = Math.hypot(x, y, z)
  x /= len
  y /= len
  z /= len

  const s = Math.sin(rad)
  const c = Math.cos(rad)
  const t = 1 - c
  const b00 = x * x * t + c
  const b01 = y * x * t + z * s
  const b02 = z * x * t - y * s
  const b10 = x * y * t - z * s
  const b11 = y * y * t + c
  const b12 = z * y * t + x * s
  const b20 = x * z * t + y * s
  const b21 = y * z * t - x * s
  const b22 = z * z * t + c

  return [
    a[0] * b00 + a[4] * b01 + a[8] * b02,
    a[1] * b00 + a[5] * b01 + a[9] * b02,
    a[2] * b00 + a[6] * b01 + a[10] * b02,
    a[3] * b00 + a[7] * b01 + a[11] * b02,
    a[0] * b10 + a[4] * b11 + a[8] * b12,
    a[1] * b10 + a[5] * b11 + a[9] * b12,
    a[2] * b10 + a[6] * b11 + a[10] * b12,
    a[3] * b10 + a[7] * b11 + a[11] * b12,
    a[0] * b20 + a[4] * b21 + a[8] * b22,
    a[1] * b20 + a[5] * b21 + a[9] * b22,
    a[2] * b20 + a[6] * b21 + a[10] * b22,
    a[3] * b20 + a[7] * b21 + a[11] * b22,
    ...a.slice(12, 16),
  ]
}

export const translate4 = (
  a: ReadonlyMatrix,
  x: number,
  y: number,
  z: number
): Matrix => {
  return [
    ...a.slice(0, 12),
    a[0] * x + a[4] * y + a[8] * z + a[12],
    a[1] * x + a[5] * y + a[9] * z + a[13],
    a[2] * x + a[6] * y + a[10] * z + a[14],
    a[3] * x + a[7] * y + a[11] * z + a[15],
  ]
}
