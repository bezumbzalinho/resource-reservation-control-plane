const Sequelize = require("sequelize")
const sequelize = require("../config/database")
const funcionario = require("./funcionario")
const bcrypt = require('bcrypt')

const ativacao = sequelize.define('ativacao', {
    expericao: {
        type: 'TIMESTAMP WITHOUT TIME ZONE',
        allowNull: false,
        defaultValue: Sequelize.NOW,
        validate: {
            isDate: true
        }
    },
    usado: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    codativacao: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    funcionarioId: {
        type: Sequelize.INTEGER,
        references: {
            model: funcionario,
            key: "id",
        },
        allowNull: false,
    }
},
    {
        timestamps: true,
        createdAt: false,
        updatedAt: "ultimaModificacao",
        freezeTableName: true,
        hooks: {
            beforeCreate: async (ativ) => {
                if (ativ.codativacao) {
                    ativ.codativacao = bcrypt.hashSync(ativ.codativacao, 10)
                }
            }
        }
    });

ativacao.belongsTo(funcionario)
funcionario.hasMany(ativacao)

module.exports = ativacao