const getControlDate = () => {
  const now = new Date()

  const padZero = (num) => num.toString().padStart(2, '0')

  const day = padZero(now.getDate())
  const month = padZero(now.getMonth() + 1)
  const year = now.getFullYear()
  const hours = padZero(now.getHours())
  const minutes = padZero(now.getMinutes())
  const seconds = padZero(now.getSeconds())

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
}

module.exports = {
  getControlDate
}
