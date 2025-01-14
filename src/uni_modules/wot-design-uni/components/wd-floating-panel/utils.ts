const DAMP = 0.2 // 阻尼系数

export const ease = (y: number, min: number, max: number) => {
  const absDistance = Math.abs(y)

  if (absDistance > max) {
    return -(max + (absDistance - max) * DAMP)
  }

  if (absDistance < min) {
    return -(min - (min - absDistance) * DAMP)
  }

  return y
}
