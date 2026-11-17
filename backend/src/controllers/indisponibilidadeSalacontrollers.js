const indisponibilidadeSala = require("../models/indisponibilidadeSala");
const indisponibilidade = require('../models/indisponibilidade')
const sala = require('../models/sala')
const reserva = require('../models/reserva')
const notificacao = require('../models/notificacao')
const receber = require('../models/receber')
const { Op } = require("sequelize")
const controllers = {};

controllers.indisponibilidadeSala_list = async (req, res) => {
    let bol = false
    const lis = await indisponibilidadeSala
        .findAll({
            order: [
                ['id', 'ASC'],
            ],
            where: { salaId: { [Op.not]: null } }
        })
        .then(function (data) {
            bol = true
            return data;
        })
        .catch((err) => {
            return err;
        });
    if (bol === true) {
        res.status(200).json({ success: bol, data: lis });
    } else {
        res.status(500).json({ success: false, data: lis })
    }
};

controllers.indisponibilidadeSala_list_web = async (req, res) => {
    let bol = false
    const lis = await indisponibilidadeSala
        .findAll({
            order: [
                ['id', 'ASC'],
            ],
            where: { salaId: { [Op.not]: null } },
            include: { model: indisponibilidade }
        })
        .then(function (data) {
            bol = true
            return data;
        })
        .catch((err) => {
            return err;
        });
    res.json({ success: bol, data: lis });
};

controllers.indisponibilidadeSala_create = async (req, res) => {
    const { salaId, indisponibilidadeId, dataInicio, dataFim, funcionarioId, motivo } = req.body;
    let bol = false
    const lis = await indisponibilidadeSala
        .create({
            salaId: salaId,
            indisponibilidadeId: indisponibilidadeId,
        })
        .then((data) => {
            bol = true
            return data;
        })
        .catch((err) => {
            return err;
        });
    if (bol) {
        bol = false
        const reservas = await reserva
            .findAll(
                {
                    where: {
                        ativa: true,
                        salaId: salaId,
                        [Op.and]: [
                            {
                                data: {
                                    [Op.gte]: dataInicio
                                }
                            },
                            {
                                data: {
                                    [Op.lte]: dataFim
                                }
                            }
                        ]
                    }
                }
            )
            .then((data) => {
                bol = true
                return data;
            })
            .catch((err) => {
                return err;
            });
        reservas.map((data) => {
            reserva
                .update({
                    ativa: false
                },
                    {
                        where: { id: data.id, ativa: true }
                    });
            notificacao.create({
                designacao: 'A reserva com início às ' + data.horainicio + ' e término às ' + data.horafim + ' no dia ' + data.data + ' foi cancelada por indisponibilidade da sala. Motivo: ' + motivo,
                funcionarioId: funcionarioId
            }).then(res => {
                receber.create({
                    funcionarioId: data.funcionarioId,
                    notificacaoId: res.id
                })
            })

        })
    }
    res.json({ success: bol, data: lis });
};

controllers.indisponibilidadeSala_create_by_polo = async (req, res) => {
    const { poloId, indisponibilidadeId, dataInicio, dataFim, funcionarioId, motivo } = req.body;
    let bol = false
    const encontrar = await sala
        .findAll({
            where: { poloId: poloId, apagada: false }
        })
        .then((data) => {
            bol = true
            return data;
        })
        .catch((err) => {
            return err;
        });
    if (bol && encontrar.length > 0) {
        encontrar.map(data => {
            indisponibilidadeSala
                .create({
                    salaId: data.id,
                    indisponibilidadeId: indisponibilidadeId,
                })
                .then(async () => {
                    bol = true
                    const reservas = await reserva
                        .findAll(
                            {
                                where: {
                                    ativa: true,
                                    salaId: data.id,
                                    [Op.and]: [
                                        {
                                            data: {
                                                [Op.gte]: dataInicio
                                            }
                                        },
                                        {
                                            data: {
                                                [Op.lte]: dataFim
                                            }
                                        }
                                    ]
                                }
                            }
                        )
                        .then((data) => {
                            bol = true
                            return data;
                        })
                        .catch((err) => {
                            return err;
                        });
                    reservas.map((data) => {
                        reserva
                            .update({
                                ativa: false
                            },
                                {
                                    where: { id: data.id, ativa: true }
                                });
                        notificacao.create({
                            designacao: 'A reserva com início às ' + data.horainicio + ' e término às ' + data.horafim + ' no dia ' + data.data + ' foi cancelada por indisponibilidade da sala. Motivo: ' + motivo,
                            funcionarioId: funcionarioId
                        }).then(res => {
                            receber.create({
                                funcionarioId: data.funcionarioId,
                                notificacaoId: res.id
                            })
                        })
                    })
                })
                .catch(() => {
                    bol = false
                });
        })
        res.json({ success: true, data: { msg: 'Encontrou' } });
    } else {
        res.json({ success: false, data: { msg: 'Não encontrou' } });
    }
};

controllers.indisponibilidadeSala_list_by_sala = async (req, res) => {
    const { id } = req.params;
    let bol = false
    const lis = await indisponibilidadeSala
        .findAll({
            order: [
                ['id', 'ASC'],
            ],
            where: { salaId: id },
        })
        .then(function (data) {
            bol = true
            return data;
        })
        .catch((err) => {
            return err;
        });
    if (bol === true) {
        res.status(200).json({ success: bol, data: lis });
    } else {
        res.status(500).json({ success: false, data: lis })
    }
};

controllers.indisponibilidadeSala_list_by_sala_web = async (req, res) => {
    const { id } = req.params;
    let bol = false
    const lis = await indisponibilidadeSala
        .findAll({
            order: [
                ['id', 'ASC'],
            ],
            where: { salaId: id },
            include: { model: indisponibilidade }
        })
        .then(function (data) {
            bol = true
            return data;
        })
        .catch((err) => {
            return err;
        });

    res.json({ success: bol, data: lis });
};

controllers.indisponibilidadeSala_list_by_sala_desc = async (req, res) => {
    const { id } = req.params;
    let bol = false
    const lis = await indisponibilidadeSala
        .findAll({
            order: [
                ['id', 'DESC'],
            ],
            where: { salaId: id },
            include: { model: indisponibilidade }
        })
        .then(function (data) {
            bol = true
            return data;
        })
        .catch((err) => {
            return err;
        });
    if (bol === true) {
        res.status(200).json({ success: bol, data: lis });
    } else {
        res.status(500).json({ success: false, data: lis })
    }
};

controllers.indisponibilidadeSala_list_by_sala_desc_web = async (req, res) => {
    const { id } = req.params;
    let bol = false
    const lis = await indisponibilidadeSala
        .findAll({
            order: [
                ['id', 'DESC'],
            ],
            where: { salaId: id },
            include: { model: indisponibilidade }
        })
        .then(function (data) {
            bol = true
            return data;
        })
        .catch((err) => {
            return err;
        });

    res.json({ success: bol, data: lis });
};

controllers.indisponibilidadeSala_list_by_indisponibilidade = async (req, res) => {
    const { id } = req.params;
    let bol = false
    const lis = await indisponibilidadeSala
        .findAll({
            order: [
                ['id', 'ASC'],
            ],
            where: { indisponibilidadeId: id/*, salaId: { [Op.not]: null }*/ },
            //include: { all: true }
        })
        .then(function (data) {
            bol = true
            return data;
        })
        .catch((err) => {
            return err;
        });
    if (bol === true) {
        res.status(200).json({ success: bol, data: lis });
    } else {
        res.status(500).json({ success: false, data: lis })
    }
};

controllers.indisponibilidadeSala_list_by_indisponibilidade_web = async (req, res) => {
    const { id } = req.params;
    let bol = false
    const lis = await indisponibilidadeSala
        .findAll({
            order: [
                ['id', 'ASC'],
            ],
            where: { indisponibilidadeId: id/*, salaId: { [Op.not]: null }*/ },
            include: { model: indisponibilidade }
        })
        .then(function (data) {
            bol = true
            return data;
        })
        .catch((err) => {
            return err;
        });

    res.json({ success: bol, data: lis });
};

controllers.indisponibilidadeSala_list_by_indisponibilidade_desc = async (req, res) => {
    const { id } = req.params;
    let bol = false
    const lis = await indisponibilidadeSala
        .findAll({
            order: [
                ['id', 'DESC'],
            ],
            where: { indisponibilidadeId: id/*, salaId: { [Op.not]: null }*/ },
            //include: { all: true }
        })
        .then(function (data) {
            bol = true
            return data;
        })
        .catch((err) => {
            return err;
        });
    if (bol === true) {
        res.status(200).json({ success: bol, data: lis });
    } else {
        res.status(500).json({ success: false, data: lis })
    }
};

controllers.indisponibilidadeSala_list_by_indisponibilidade_desc_web = async (req, res) => {
    const { id } = req.params;
    let bol = false
    const lis = await indisponibilidadeSala
        .findAll({
            order: [
                ['id', 'DESC'],
            ],
            where: { indisponibilidadeId: id/*, salaId: { [Op.not]: null }*/ },
            include: { model: indisponibilidade }
        })
        .then(function (data) {
            bol = true
            return data;
        })
        .catch((err) => {
            return err;
        });

    res.json({ success: bol, data: lis });
};

controllers.indisponibilidadeSala_detail = async (req, res) => {
    const { id } = req.params;
    let bol = false
    const lis = await indisponibilidadeSala
        .findOne({
            where: { id: id },
            //include: { all: true }
        })
        .then((data) => {
            bol = true
            return data;
        })
        .catch((err) => {
            return err;
        });
    if (lis === null || lis.length === 0 || bol !== true) {
        res.status(400).json({ success: bol, data: { msg: 'Não encontrou' } });
    } else {
        res.status(200).json({ success: bol, data: lis })
    }
};

controllers.indisponibilidadeSala_detail_web = async (req, res) => {
    const { id } = req.params;
    let bol = false
    const lis = await indisponibilidadeSala
        .findOne({
            where: { id: id/*, salaId: { [Op.not]: null }*/ },
            include: { model: indisponibilidade }
        })
        .then((data) => {
            bol = true
            return data;
        })
        .catch((err) => {
            return err;
        });
    res.json({ success: bol, data: lis });
};

controllers.indisponibilidadeSala_list_by_sala_tablet = async (req, res) => {
    const { data, sala } = req.query;
    let bol = false
    const lis = await indisponibilidadeSala
        .findAll({
            attributes: ['id'],
            order: [
                ['id', 'DESC'],
            ],
            where: {
                salaId: sala,
                ultimaModificacao: {
                    [Op.gt]: data
                },
            },
            include: [{ model: indisponibilidade, attributes: ['dataInicio', 'dataFim', 'motivo'] }]
        })
        .then(function (data) {
            bol = true
            return data;
        })
        .catch((err) => {
            return err;
        });
    if (bol === true) {
        res.status(200).json({ success: bol, horaServer: formatDate(), data: lis });
    } else {
        res.status(500).json({ success: false, horaServer: formatDate(), data: lis })
    }
};

function formatTimeOnly() {
    let d = new Date()
    d.setTime(d.getTime() + (d.getTimezoneOffset() * 60000) + (3600000 * 1));
    let hour = d.getHours(),
        min = d.getMinutes(),
        sec = d.getSeconds()

    if (hour < 10)
        hour = '0' + hour;
    if (min < 10)
        min = '0' + min;
    if (sec < 10)
        sec = '0' + sec;
    return [hour, min, sec].join(":")
}

function formatDateOnly() {
    let d = new Date();
    d.setDate(d.getDate());
    let month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
}

function formatDate() {
    let d = new Date()
    d.setTime(d.getTime() + (d.getTimezoneOffset() * 60000) + (3600000 * 1));
    let month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear(),
        hour = d.getHours(),
        min = d.getMinutes(),
        sec = d.getSeconds()

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;
    if (hour < 10)
        hour = '0' + hour;
    if (min < 10)
        min = '0' + min;
    if (sec < 10)
        sec = '0' + sec;
    return [[year, month, day].join('-'), [hour, min, sec].join(':')].join(' ');
}

module.exports = controllers