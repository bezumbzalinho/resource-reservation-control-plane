const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const polo = sequelize.define('polo', {
    designacao: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: 'nome',
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: 'email',
        validate: {
            isEmail: true
        }
    },
    telefone: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isNumeric: true
        }
    },
    endereco: {
        type: Sequelize.STRING,
        allowNull: false
    },
    apagado: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
    }
},
    {
        timestamps: true,
        createdAt: false,
        updatedAt: "ultimaModificacao",
        freezeTableName: true
    });

module.exports = polo