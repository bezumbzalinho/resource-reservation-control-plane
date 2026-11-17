const Sequelize = require("sequelize");
const sequelize = require("../config/database");
const funcionario = require("./funcionario")

const indisponibilidade = sequelize.define('indisponibilidade', {
    dataInicio: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        validate: {
            isDate: true,
        }
    },
    dataFim: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        validate: {
            isDate: true,
        }
    },
    motivo: {
        type: Sequelize.STRING,
        allowNull: false
    },
    funcionarioId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: funcionario,
            key: "id",
        }
    }
},
    {
        timestamps: true,
        createdAt: false,
        updatedAt: "ultimaModificacao",
        freezeTableName: true,
    });

indisponibilidade.belongsTo(funcionario)
funcionario.hasMany(indisponibilidade)

module.exports = indisponibilidade