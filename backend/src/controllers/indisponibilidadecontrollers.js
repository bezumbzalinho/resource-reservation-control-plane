//const Sequelize = require('sequelize')
const indisponibilidade = require("../models/indisponibilidade");
const controllers = {};

controllers.indisponibilidade_list = async (req, res) => {
    let bol = false
    const lis = await indisponibilidade
        .findAll({
            order: [
                ['id', 'ASC'],
            ]
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

controllers.indisponibilidade_list_web = async (req, res) => {
    let bol = false
    const lis = await indisponibilidade
        .findAll({
            order: [
                ['id', 'ASC'],
            ]
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

controllers.indisponibilidade_create = async (req, res) => {
    const { dataInicio, dataFim, motivo, funcionarioId } = req.body;
    let bol = false
    const lis = await indisponibilidade
        .create({
            dataInicio: dataInicio,
            dataFim: dataFim,
            motivo: motivo,
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

controllers.indisponibilidade_list_by_funcionario = async (req, res) => {
    const { id } = req.params;
    let bol = false
    const lis = await indisponibilidade
        .findAll({
            order: [
                ['id', 'ASC'],
            ],
            where: { funcionarioId: id },
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

controllers.indisponibilidade_list_by_funcionario_web = async (req, res) => {
    const { id } = req.params;
    let bol = false
    const lis = await indisponibilidade
        .findAll({
            order: [
                ['id', 'ASC'],
            ],
            where: { funcionarioId: id },
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

controllers.indisponibilidade_detail = async (req, res) => {
    const { id } = req.params;
    let bol = false
    const lis = await indisponibilidade
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
    if (lis === null || lis.length === 0 || bol !== true) {
        res.status(400).json({ success: bol, data: { msg: 'Não encontrou' } });
    } else {
        res.status(200).json({ success: bol, data: lis })
    }
};

controllers.indisponibilidade_detail_web = async (req, res) => {
    const { id } = req.params;
    let bol = false
    const lis = await indisponibilidade
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