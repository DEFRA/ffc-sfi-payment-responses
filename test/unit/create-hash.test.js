const { createHash } = require('../../app/create-hash')

let values

describe('create hash', () => {
  test('should create unique hash for SFI return messages', () => {
    values = 'SITI_SFIS000000200000002V0011000000002S250.002022-11-09PY1711007DAPFFCSITI_SFI Return File.csv'
    const result = createHash(values)
    expect(result).toEqual('e2c759e70bf25e1ffe152c4b70bba9b6')
  })

  test('should create unique hash for GENESIS return messages', () => {
    values = 'Genesis1098608AG003846211216.0020/07/2023B1892661DAPGENESISPayConf_23071 21211_SF01-012825.gni'
    const result = createHash(values)
    expect(result).toEqual('32507ddd91b3f6a0ca49549e7de2bc11')
  })

  test('should create unique hash for GLOS return messages', () => {
    values = 'GLOS1061727531102259241EWCO285-21-229720/06/20232137.91184806169260729DAPFCAP_sequence_RPA_20230621 21008.dat'
    const result = createHash(values)
    expect(result).toEqual('17663901d26a85a19de057e2d75253b3')
  })

  test('should create unique hash for IMPS return messages', () => {
    values = 'IMPS994204380225SCM/38022522-210-001P1848107115.45B20-JUN-230APRET_IMPS_AP_SF01-012674_GBP.INT'
    const result = createHash(values)
    expect(result).toEqual('c132264d0cbcf5aada6c3c5811407cca')
  })
})
