module.exports = (sequelize, DataTypes) => {
  return sequelize.define('impsReturn', {
    impsReturnId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    trader: DataTypes.STRING,
    invoiceNumber: DataTypes.STRING,
    status: DataTypes.STRING,
    paymentReference: DataTypes.STRING,
    valueGBP: DataTypes.STRING,
    paymentType: DataTypes.STRING,
    dateSettled: DataTypes.STRING,
    valueEUR: DataTypes.STRING
  },
  {
    tableName: 'impsReturns',
    freezeTableName: true,
    timestamps: false
  })
}
