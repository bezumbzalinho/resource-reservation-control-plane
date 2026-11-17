//const Sequelize = require('sequelize')
const acesso = require("../models/acesso");
const controllers = {};

controllers.acesso_list = async (req, res) => {
    let bol = false
    const lis = await acesso
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

controllers.acesso_list_web = async (req, res) => {
    let bol = false
    const lis = await acesso
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

    res.json({ success: bol, data: lis });
};

controllers.acesso_create = async (req, res) => {
    const { designacao, sigla } = req.body;
    let bol = false
    const lis = await acesso
        .create({
            designacao: designacao,
            sigla: sigla
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

controllers.acesso_update = async (req, res) => {
    const { id } = req.params;
    const { designacao, sigla } = req.body;
    let bol = false
    const lis = await acesso
        .update(
            {
                designacao: designacao,
                sigla: sigla
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

controllers.acesso_detail = async (req, res) => {
    const { id } = req.params;
    let bol = false
    const lis = await acesso
        .findOne({
            where: { id: id },
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

controllers.acesso_detail_web = async (req, res) => {
    const { id } = req.params;
    let bol = false
    const lis = await acesso
        .findOne({
            where: { id: id },
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

module.exports = controllers