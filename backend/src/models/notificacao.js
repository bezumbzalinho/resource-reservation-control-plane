const Sequelize = require("sequelize");
const sequelize = require("../config/database");
const funcionario = require("./funcionario")

const notificacao = sequelize.define('notificacao', {
    designacao: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    data: {
        type: 'TIMESTAMP WITHOUT TIME ZONE',
        allowNull: false,
        defaultValue: Sequelize.NOW
    },
    funcionarioId: {
        type: Sequelize.INTEGER,
        references: {
            model: funcionario,
            key: "id",
        },
        allowNull: true
    }
},
    {
        timestamps: true,
        createdAt: false,
        updatedAt: "ultimaModificacao",
        freezeTableName: true
    });

notificacao.belongsTo(funcionario)
funcionario.hasMany(notificacao)

module.exports = notificacao