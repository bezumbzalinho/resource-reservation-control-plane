const indisponibilidadePolo = require("../models/indisponibilidadePolo");
const { Op } = require("sequelize")
const indisponibilidade = require('../models/indisponibilidade')
const controllers = {};

controllers.indisponibilidadePolo_list = async (req, res) => {
    let bol = false
    const lis = await indisponibilidadePolo
        .findAll({
            order: [
                ['id', 'ASC'],
            ],
            //where: { poloId: { [Op.not]: null } }
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

controllers.indisponibilidadePolo_list_web = async (req, res) => {
    let bol = false
    const lis = await indisponibilidadePolo
        .findAll({
            order: [
                ['id', 'ASC'],
            ],
            //where: { poloId: { [Op.not]: null } },
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

controllers.indisponibilidadePolo_create = async (req, res) => {
    const { indisponibilidadeId, poloId } = req.body;
    let bol = false
    const lis = await indisponibilidadePolo
        .create({
            indisponibilidadeId: indisponibilidadeId,
            poloId: poloId,
        })
        .then((data) => {
            bol = true
            return data;
        })
        .catch((err) => {
            return err;
        });
    /*if (bol === true) {

    }*/
    res.json({ success: bol, data: lis });
};

controllers.indisponibilidadePolo_list_by_polo = async (req, res) => {
    const { id } = req.params;
    let bol = false
    const lis = await indisponibilidadePolo
        .findAll({
            order: [
                ['id', 'ASC'],
            ],
            where: { poloId: id },
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

controllers.indisponibilidadePolo_list_by_polo_web = async (req, res) => {
    const { id } = req.params;
    let bol = false
    const lis = await indisponibilidadePolo
        .findAll({
            order: [
                ['id', 'ASC'],
            ],
            where: { poloId: id },
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


controllers.indisponibilidadePolo_list_by_polo_web_desc = async (req, res) => {
  const { id } = req.params;
  let bol = false;
  const lis = await indisponibilidadePolo
    .findAll({
      order: [["id", "DESC"]],
      where: { poloId: id },
      include: { model: indisponibilidade },
    })
    .then(function (data) {
      bol = true;
      return data;
    })
    .catch((err) => {
      return err;
    });
  res.json({ success: bol, data: lis });
};

controllers.indisponibilidadePolo_list_by_indisponibilidade = async (req, res) => {
    const { id } = req.params;
    let bol = false
    const lis = await indisponibilidadePolo
        .findAll({
            order: [
                ['id', 'ASC'],
            ],
            where: { indisponibilidadeId: id },
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

controllers.indisponibilidadePolo_list_by_indisponibilidade_web = async (req, res) => {
    const { id } = req.params;
    let bol = false
    const lis = await indisponibilidadePolo
        .findAll({
            order: [
                ['id', 'ASC'],
            ],
            where: { indisponibilidadeId: id },
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

controllers.indisponibilidadePolo_delete_by_polo = async (req, res) => {
    const { id } = req.params;
    let bol = false
    const lis = await indisponibilidadePolo
        .update(
            {
                poloId: null
            },
            {
                where: { poloId: id },
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

controllers.indisponibilidadePolo_detail = async (req, res) => {
    const { id } = req.params;
    let bol = false
    const lis = await indisponibilidadePolo
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

controllers.indisponibilidadePolo_detail_web = async (req, res) => {
    const { id } = req.params;
    let bol = false
    const lis = await indisponibilidadePolo
        .findOne({
            where: { id: id/*, poloId: { [Op.not]: null }*/ },
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

module.exports = controllers