module.exports = (sequelize, DataTypes) => {
  return sequelize.define('imps', {
    impsId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    invoiceNumber: DataTypes.STRING,
    frn: DataTypes.BIGINT,
    batch: DataTypes.STRING,
    batchNumber: DataTypes.INTEGER
  },
  {
    tableName: 'imps',
    freezeTableName: true,
    timestamps: false
  })
}
