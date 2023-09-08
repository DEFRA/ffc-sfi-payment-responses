module.exports = (sequelize, DataTypes) => {
  return sequelize.define('impsBatchNumber', {
    impsBatchNumberId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    invoiceNumber: DataTypes.STRING,
    trader: DataTypes.STRING,
    frn: DataTypes.BIGINT,
    batch: DataTypes.STRING,
    batchNumber: DataTypes.STRING
  },
  {
    tableName: 'impsBatchNumbers',
    freezeTableName: true,
    timestamps: false
  })
}
