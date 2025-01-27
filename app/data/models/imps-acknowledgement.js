module.exports = (sequelize, DataTypes) => {
  return sequelize.define('impsAcknowledgement', {
    impsAcknowledgementId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    batchNumber: DataTypes.STRING,
    invoiceNumber: DataTypes.STRING,
    frn: DataTypes.BIGINT,
    success: DataTypes.STRING,
    exported: DataTypes.DATE
  },
  {
    tableName: 'impsAcknowledgements',
    freezeTableName: true,
    timestamps: false
  })
}
