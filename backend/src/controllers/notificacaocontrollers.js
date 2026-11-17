//const Sequelize = require('sequelize')
const funcionario = require('../models/funcionario')
const notificacao = require("../models/notificacao");
const { Op } = require("sequelize")
const controllers = {};

controllers.notificacao_list = async (req, res) => {
    let bol = false
    const lis = await notificacao
        .findAll({
            order: [
                ['id', 'ASC'],
            ],
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

controllers.notificacao_list_web = async (req, res) => {
    let bol = false
    const lis = await notificacao
        .findAll({
            order: [
                ['id', 'ASC'],
            ],
            include: { model: funcionario }
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

controllers.notificacao_create = async (req, res) => {
    const { designacao, funcionarioId } = req.body;
    let bol = false
    const lis = await notificacao
        .create({
            designacao: designacao,
            funcionarioId: funcionarioId
        })
        .then((data) => {
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

controllers.notificacao_create_web = async (req, res) => {
    const { designacao, funcionarioId } = req.body;
    let bol = false
    const lis = await notificacao
        .create({
            designacao: designacao,
            funcionarioId: funcionarioId
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

controllers.notificacao_list_by_funcionario = async (req, res) => {
    const { id } = req.params;
    let bol = false
    const lis = await notificacao
        .findAll({
            order: [
                ['id', 'ASC'],
            ],
            where: { funcionarioId: id },
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

controllers.notificacao_list_by_funcionario_web = async (req, res) => {
    const { id } = req.params;
    let bol = false
    const lis = await notificacao
        .findAll({
            order: [
                ['id', 'ASC'],
            ],
            where: { funcionarioId: id },
            include: { model: funcionario }
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

controllers.notificacao_detail = async (req, res) => {
    const { id } = req.params;
    let bol = false
    const lis = await notificacao
        .findAll({
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
    if (bol === true) {
        res.status(200).json({ success: bol, data: lis });
    } else {
        res.status(500).json({ success: false, data: lis })
    }
};

controllers.notificacao_detail_web = async (req, res) => {
    const { id } = req.params;
    let bol = false
    const lis = await notificacao
        .findAll({
            where: { id: id },
            include: { model: funcionario }
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

controllers.notificacao_list_novas = async (req, res) => {
    const { data } = req.query;
    let bol = false
    const lis = await notificacao
        .findAll({
            order: [
                ['id', 'DESC'],
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