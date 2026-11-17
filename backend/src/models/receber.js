const Sequelize = require("sequelize")
const sequelize = require("../config/database");
const notificacao = require('./notificacao')
const funcionario = require('./funcionario')

const receber = sequelize.define('receber', {
    lida: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    notificacaoId: {
        type: Sequelize.INTEGER,
        references: {
            model: notificacao,
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

receber.belongsTo(funcionario)
funcionario.hasMany(receber)
receber.belongsTo(notificacao)
notificacao.hasMany(receber)

module.exports = receber