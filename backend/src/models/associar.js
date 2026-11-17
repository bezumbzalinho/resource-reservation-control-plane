const Sequelize = require("sequelize")
const sequelize = require("../config/database");
const polo = require('./polo')
const funcionario = require('./funcionario')

const associar = sequelize.define('associar', {
    datainicio: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        defaultValue: Sequelize.NOW,
        validate: {
            isDate: true
        }
    },
    datafim: {
        type: Sequelize.DATEONLY,
        allowNull: true,
        validate: {
            isDate: true
        }
    },
    poloId: {
        type: Sequelize.INTEGER,
        references: {
            model: polo,
            key: "id",
        },
        allowNull: false
    },
    funcionarioId: {
        type: Sequelize.INTEGER,
        references: {
            model: funcionario,
            key: "id",
        },
        allowNull: false
    },
},
    {
        timestamps: true,
        createdAt: false,
        updatedAt: "ultimaModificacao",
        freezeTableName: true
    });

associar.belongsTo(funcionario)
funcionario.hasMany(associar)
associar.belongsTo(polo)
polo.hasMany(associar)

module.exports = associar