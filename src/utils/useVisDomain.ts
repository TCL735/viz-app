export const extent = (dataArray: number[]): [number, number] | null => {
  if (!dataArray || !dataArray.length) {
    return null
  }

  let low = Infinity
  let high = -Infinity

  for (const num of dataArray) {
    if (num < low) {
      low = num
    }

    if (num > high) {
      high = num
    }
  }

  if (low === Infinity || high === -Infinity) {
    return null
  }

  return [low, high]
}
