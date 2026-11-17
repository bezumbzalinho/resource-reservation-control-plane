const Sequelize = require("sequelize");
const sequelize = require("../config/database");
const acesso = require("./acesso")
const bcrypt = require('bcrypt')

const funcionario = sequelize.define('funcionario', {
    nome: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    nascimento: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        validate: {
            isDate: true
        }
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        },
        unique: 'email'
    },
    telemovel: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isNumeric: true
        }
    },
    endereco: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    pass: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '1234Pass'
    },
    ultimoacesso: {
        type: 'TIMESTAMP WITHOUT TIME ZONE',
        allowNull: true,
    },
    inativo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    fotografia: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    acessoId: {
        type: Sequelize.INTEGER,
        references: {
            model: acesso,
            key: "id",
        },
        allowNull: false
    }
},
    {
        timestamps: true,
        createdAt: false,
        updatedAt: "ultimaModificacao",
        freezeTableName: true,
        hooks: {
            beforeCreate: async (user) => {
                if (user.pass) {
                    user.pass = bcrypt.hashSync(user.pass, 10)
                }
            }
        }
    });


funcionario.belongsTo(acesso)
acesso.hasMany(funcionario)

module.exports = funcionario