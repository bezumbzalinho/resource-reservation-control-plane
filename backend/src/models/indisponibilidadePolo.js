const Sequelize = require("sequelize");
const sequelize = require("../config/database");
const polo = require("./polo")
const indisponibilidade = require("./indisponibilidade")

const indisponibilidadePolo = sequelize.define('indisponibilidadePolo', {
    poloId: {
        type: Sequelize.INTEGER,
        references: {
            model: polo,
            key: "id",
        },
        allowNull: false
    },
    indisponibilidadeId: {
        type: Sequelize.INTEGER,
        references: {
            model: indisponibilidade,
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

indisponibilidadePolo.belongsTo(polo)
polo.hasMany(indisponibilidadePolo)
indisponibilidadePolo.belongsTo(indisponibilidade)
indisponibilidade.hasMany(indisponibilidadePolo)

module.exports = indisponibilidadePolo