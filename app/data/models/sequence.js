module.exports = (sequelize, DataTypes) => {
  const sequence = sequelize.define('sequence', {
    schemeId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: false },
    nextReturn: DataTypes.INTEGER
  },
  {
    tableName: 'sequences',
    freezeTableName: true,
    timestamps: false
  })
  sequence.associate = function (models) {
    sequence.belongsTo(models.scheme, {
      foreignKey: 'schemeId',
      as: 'scheme'
    })
  }
  return sequence
}
