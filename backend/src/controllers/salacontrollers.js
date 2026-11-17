//const Sequelize = require('sequelize')
const { Op } = require("sequelize")
const sala = require("../models/sala");
const polo = require('../models/polo')
const controllers = {};

controllers.sala_list = async (req, res) => {
    let bol = false
    const lis = await sala
        .findAll({
            order: [
                ['id', 'ASC'],
            ],
            where: { apagada: { [Op.not]: true } }
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

controllers.sala_list_web = async (req, res) => {
    let bol = false
    const lis = await sala
        .findAll({
            order: [
                ['id', 'ASC'],
            ],
            include: { model: polo },
            where: { apagada: { [Op.not]: true } }
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

controllers.sala_create = async (req, res) => {
    const { designacao, descricao, capacidade, tempolimpeza,
        alocacao, poloId } = req.body;
    let bol = false
    const lis = await sala
        .create({
            designacao: designacao,
            descricao: descricao,
            capacidade: capacidade,
            tempolimpeza: tempolimpeza,
            alocacao: alocacao,
            poloId: poloId
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

controllers.sala_list_by_polo = async (req, res) => {
    const { id } = req.params;
    let bol = false
    const lis = await sala
        .findAll({
            order: [
                ['id', 'ASC'],
            ],
            where: { poloId: id, apagada: { [Op.not]: true } },
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

controllers.sala_list_by_polo_web = async (req, res) => {
    const { id } = req.params;
    let bol = false
    const lis = await sala
        .findAll({
            order: [
                ['id', 'ASC'],
            ],
            where: { poloId: id, apagada: { [Op.not]: true } },
            //include: { all: true }
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

controllers.sala_detail = async (req, res) => {
    const { id } = req.params;
    let bol = false
    const lis = await sala
        .findOne({
            where: { id: id, apagada: { [Op.not]: true } },
        })
        .then((data) => {
            bol = true
            return data;
        })
        .catch((err) => {
            return err;
        });
    if (bol === true) {
        if (lis === null) {
            res.status(400).json({ success: false, data: lis });
        } else {
            res.status(200).json({ success: bol, data: lis });
        }
    } else {
        res.status(500).json({ success: false, data: lis })
    }
};

controllers.sala_detail_web = async (req, res) => {
    const { id } = req.params;
    let bol = false
    const lis = await sala
        .findOne({
            where: { id: id, apagada: { [Op.not]: true } },
            include: { model: polo }
        })
        .then((data) => {
            bol = true
            return data;
        })
        .catch((err) => {
            return err;
        });
    res.json({ success: lis ? bol : false, data: lis });
};

controllers.sala_delete = async (req, res) => {
    const { id } = req.params;
    let bol = false
    const lis = await sala
        .update(
            {
                apagada: true
            },
            {
                where: { id: id, apagada: { [Op.not]: true } },
            })
        .then((data) => {
            bol = true
            return data;
        })
        .catch((err) => {
            return err;
        });

    res.json({ success: lis[0] == 0 ? false : bol, data: lis });
};

controllers.sala_delete_by_polo = async (req, res) => {
    const { id } = req.params;
    let bol = false
    const lis = await sala
        .update(
            {
                apagada: true
            },
            {
                where: { poloId: id, apagada: { [Op.not]: true } },
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

controllers.sala_update = async (req, res) => {
    const { id } = req.params;
    const { designacao, capacidade, tempolimpeza, descricao,
        alocacao, limpeza } = req.body;
    let bol = false
    const lis = await sala
        .update(
            {
                designacao: designacao,
                capacidade: capacidade,
                tempolimpeza: tempolimpeza,
                alocacao: alocacao,
                descricao: descricao,
                estadolimp: limpeza
            },
            {
                where: { id: id, apagada: { [Op.not]: true } },
            }
        )
        .then((data) => {
            bol = true
            return data;
        })
        .catch((err) => {
            return err;
        });
    res.json({ success: lis[0] == 0 ? false : bol, data: lis });
};

controllers.sala_update_tablet = async (req, res) => {
    const { id } = req.params;
    const { designacao, capacidade, tempolimpeza,
        alocacao, limpeza } = req.body;
    let bol = false
    const lis = await sala
        .update(
            {
                designacao: designacao,
                capacidade: capacidade,
                tempolimpeza: tempolimpeza,
                alocacao: alocacao,
                estadolimp: limpeza
            },
            {
                where: { id: id, apagada: { [Op.not]: true } },
            }
        )
        .then((data) => {
            bol = true
            return data;
        })
        .catch((err) => {
            return err;
        });
    if (bol !== false) {
        if (lis[0] == 0) {
            res.status(400).json({ success: false, data: lis })
        } else {
            res.status(200).json({ success: bol, data: lis })
        }
    } else {
        res.status(500).json({ success: false, data: lis })
    }
};

controllers.sala_update_limpeza = async (req, res) => {
    const { id } = req.params;
    const { limpeza } = req.body;
    let bol = false
    const lis = await sala
        .update(
            {
                estadolimp: limpeza
            },
            {
                where: { id: id, apagada: { [Op.not]: true } },
            }
        )
        .then((data) => {
            bol = true
            return data;
        })
        .catch((err) => {
            return err;
        });
    if (bol !== false) {
        if (lis[0] == 0) {
            res.status(400).json({ success: false, data: lis })
        } else {
            res.status(200).json({ success: bol, data: lis })
        }
    } else {
        res.status(500).json({ success: false, data: lis })
    }
};

controllers.sala_list_novas = async (req, res) => {
    const { data } = req.query;
    let bol = false
    const lis = await sala
        .findAll({
            order: [
                ['id', 'ASC'],
            ],
            where: {
                ultimaModificacao: {
                    [Op.gt]: data
                },
            },
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

controllers.sala_count = async (req, res) => {
    let bol = false
    const lis = await sala
        .count({
            where: {
                apagada: false
            },
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