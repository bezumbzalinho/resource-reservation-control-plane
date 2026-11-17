const Sequelize = require("sequelize")
const sequelize = require("../config/database");
const polo = require("./polo");
//const codLimpeza = require('./limpeza')

const sala = sequelize.define('sala', {
    designacao: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    descricao: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    capacidade: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
            min: 1
        }
    },
    tempolimpeza: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0
        }
    },
    estadolimp: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false
    },
    alocacao: {
        type: Sequelize.DECIMAL,
        allowNull: false,
        validate: {
            max: 100
        }
    },
    apagada: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    poloId: {
        type: Sequelize.INTEGER,
        references: {
            model: polo,
            key: "id",
        },
        allowNull: false
    }
},
    {
        timestamps: true,
        createdAt: false,
        updatedAt: "ultimaModificacao",
        freezeTableName: true
    });

sala.belongsTo(polo)
polo.hasMany(sala)

module.exports = sala