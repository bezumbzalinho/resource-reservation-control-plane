const Sequelize = require("sequelize");
const sequelize = require("../config/database");
const sala = require("./sala")
const indisponibilidade = require("./indisponibilidade")

const indisponibilidadeSala = sequelize.define('indisponibilidadeSala', {
    salaId: {
        type: Sequelize.INTEGER,
        references: {
            model: sala,
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

indisponibilidadeSala.belongsTo(indisponibilidade)
indisponibilidade.hasMany(indisponibilidadeSala)
indisponibilidadeSala.belongsTo(sala)
sala.hasMany(indisponibilidadeSala)

module.exports = indisponibilidadeSala