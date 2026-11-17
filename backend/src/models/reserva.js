const Sequelize = require("sequelize")
const sequelize = require("../config/database");
const sala = require('./sala')
const funcionario = require('./funcionario')

const reserva = sequelize.define('reserva', {
    data: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        validate: {
            isDate: true,
            isAfter: formatDate()
        }
    },
    horainicio: {
        type: Sequelize.TIME,
        allowNull: false
    },
    horafim: {
        type: Sequelize.TIME,
        allowNull: false
    },
    ativa: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    salaId: {
        type: Sequelize.INTEGER,
        references: {
            model: sala,
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
        freezeTableName: true,
        validate: {
            checkDiff() {
                if ((new Date(this.data + ' ' + this.horafim) - new Date(this.data + ' ' + this.horainicio)) / (1000 * 60) < 30) {
                    throw new Error("A datafim tem que ser pelo menos 30 min a mais");
                }
            }
        }
    });

function formatDate() {
    let d = new Date()
    d.setDate(d.getDate() - 1)
    let month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

reserva.belongsTo(sala)
sala.hasMany(reserva)
reserva.belongsTo(funcionario)
funcionario.hasMany(reserva)

module.exports = reserva