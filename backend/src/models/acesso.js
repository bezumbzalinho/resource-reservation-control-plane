const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const acesso = sequelize.define('acesso', {
    designacao: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: 'designacao'
    },
    sigla: {
        type: Sequelize.STRING,
        allowNull: true
    },
},
    {
        timestamps: true,
        createdAt: false,
        updatedAt: "ultimaModificacao",
        freezeTableName: true
    });

module.exports = acesso