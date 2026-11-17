//const Sequelize = require('sequelize')
const { Op } = require("sequelize")
const polo = require("../models/polo");
const controllers = {};

controllers.polo_list = async (req, res) => {
    let bol = false
    const lis = await polo
        .findAll({
            order: [
                ['id', 'ASC'],
            ],
            where: { apagado: { [Op.not]: true } }
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

controllers.polo_list_web = async (req, res) => {
    let bol = false
    const lis = await polo
        .findAll({
            order: [
                ['id', 'ASC'],
            ],
            where: { apagado: { [Op.not]: true } }
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

controllers.polo_create = async (req, res) => {
    const { designacao, email, telefone,
        endereco } = req.body;
    let bol = false
    const lis = await polo
        .create({
            designacao: designacao,
            email: email,
            telefone: telefone,
            endereco: endereco,
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

controllers.polo_delete = async (req, res) => {
    const { id } = req.params;
    let bol = false
    const lis = await polo
        .update(
            {
                apagado: true
            },
            {
                where: { id: id, apagado: { [Op.not]: true } },
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

controllers.polo_detail = async (req, res) => {
    const { id } = req.params;
    let bol = false
    const lis = await polo
        .findOne({
            where: { id: id, apagado: { [Op.not]: true } },
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
        if (lis === null) {
            res.status(400).json({ success: false, data: lis });
        } else {
            res.status(200).json({ success: bol, data: lis });
        }
    } else {
        res.status(500).json({ success: false, data: lis })
    }
};

controllers.polo_detail_web = async (req, res) => {
    const { id } = req.params;
    let bol = false
    const lis = await polo
        .findOne({
            where: { id: id, apagado: { [Op.not]: true } },
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

controllers.polo_update = async (req, res) => {
    const { id } = req.params;
    const { designacao, email, telefone,
        endereco } = req.body;
    let bol = false
    const lis = await polo
        .update(
            {
                designacao: designacao,
                email: email,
                telefone: telefone,
                endereco: endereco
            },
            {
                where: { id: id },
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

controllers.polo_list_novas = async (req, res) => {
    const { data } = req.query;
    let bol = false
    const lis = await polo
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

controllers.polos_count = async (req, res) => {
    let bol = false
    const lis = await polo
        .count({
            where: {
                apagado: false
            }
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