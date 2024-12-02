const canReturnFile = (filename) => {
    return /^(?!.*NO_RETURN_FILE).*$/.test(filename)
  }
  
  module.exports = {
    canReturnFile
  }
  