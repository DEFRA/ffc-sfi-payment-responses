const isReturnFile = (filename) => {
  if (/^.*Return File.*\.csv$/.test(filename)) {
    return true
  }
  if (/^GENESISPayConf.*\.gni$/.test(filename)) {
    return true
  }
  if (/^FCAP.*RPA.*\.dat$/.test(filename)) {
    return true
  }
  if (/^RET_IMPS.*\.INT$/.test(filename)) {
    return true
  }
  return false
}

module.exports = isReturnFile
