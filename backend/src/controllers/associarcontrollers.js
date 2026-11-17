const Sequelize = require('sequelize')
const { Op } = require("sequelize")
const associar = require("../models/associar");
const controllers = {};

controllers.associar_list = async (req, res) => {
    let bol = false
    const lis = await associar
        .findAll({
            order: [
                ['id', 'ASC'],
            ],
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

controllers.associar_list_web = async (req, res) => {
    let bol = false
    const lis = await associar
        .findAll({
            order: [
                ['id', 'ASC'],
            ],
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

controllers.associar_create = async (req, res) => {
    const { poloId, funcionarioId } = req.body;
    let bol = false
    const lis = await associar
        .create({
            poloId: poloId,
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

controllers.associar_list_by_funcionario = async (req, res) => {
    const { id } = req.params;
    let bol = false
    const lis = await associar
        .findAll({
            order: [
                ['id', 'ASC'],
            ],
            where: { funcionarioId: id, datafim: { [Op.is]: null } },
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

controllers.associar_list_by_funcionario_web = async (req, res) => {
    const { id } = req.params;
    let bol = false
    const lis = await associar
        .findAll({
            order: [
                ['id', 'ASC'],
            ],
            where: { funcionarioId: id, datafim: { [Op.is]: null } },
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

controllers.associar_list_by_funcionario_desc = async (req, res) => {
    const { id } = req.params;
    let bol = false
    const lis = await associar
        .findAll({
            order: [
                ['id', 'DESC'],
            ],
            where: { funcionarioId: id, datafim: { [Op.not]: null } },
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

controllers.associar_list_by_funcionario_desc_web = async (req, res) => {
    const { id } = req.params;
    let bol = false
    const lis = await associar
        .findAll({
            order: [
                ['id', 'DESC'],
            ],
            where: { funcionarioId: id, datafim: { [Op.not]: null } },
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

controllers.associar_list_by_polo = async (req, res) => {
    const { id } = req.params;
    let bol = false
    const lis = await associar
        .findAll({
            order: [
                ['id', 'ASC'],
            ],
            where: { poloId: id, datafim: { [Op.not]: null } },
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

controllers.associar_list_by_polo_web = async (req, res) => {
    const { id } = req.params;
    let bol = false
    const lis = await associar
        .findAll({
            order: [
                ['id', 'ASC'],
            ],
            where: { poloId: id, datafim: { [Op.not]: null } },
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

controllers.associar_list_by_polo_desc = async (req, res) => {
    const { id } = req.params;
    let bol = false
    const lis = await associar
        .findAll({
            order: [
                ['id', 'DESC'],
            ],
            where: { poloId: id, datafim: { [Op.not]: null } },
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

controllers.associar_list_by_polo_desc_web = async (req, res) => {
    const { id } = req.params;
    let bol = false
    const lis = await associar
        .findAll({
            order: [
                ['id', 'DESC'],
            ],
            where: { poloId: id, datafim: { [Op.not]: null } },
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

controllers.associar_detail = async (req, res) => {
    const { id } = req.params;
    let bol = false
    const lis = await associar
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

controllers.associar_detail_web = async (req, res) => {
    const { id } = req.params;
    let bol = false
    const lis = await associar
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

controllers.associar_delete_by_polo = async (req, res) => {
    const { id } = req.params;
    let bol = false
    const lis = await associar
        .update(
            {
                datafim: formatDate(),
                //poloId: null
            },
            {
                where: { poloId: id },
            }
        )
        .then((data) => {
            bol = true
            return data;
        })
        .catch((err) => {
            return err;
        });
    res.json({ success: bol, data: lis });
};

controllers.associar_create_if_not_exists = async (req, res) => {
    const { userId } = req.params;
    const { poloId } = req.body;
    let bol = false
    const lis = await associar
        .findOne(
            {
                where: {
                    poloId: poloId,
                    funcionarioId: userId,
                    datafim: {
                        [Op.is]: null
                    }
                },
            }
        )
        .then((data) => {
            bol = true
            return data;
        })
        .catch((err) => {
            return err;
        });
    if (lis === null || (lis.length === 0 && bol === true)) {
        bol = false
        const data = await associar
            .create({
                poloId: poloId,
                funcionarioId: userId
            })
            .then(data => {
                bol = true
                return data
            })
            .catch(err => {
                return err
            })
        res.json({ success: bol, data: data });
    } else {
        res.json({ success: bol, data: lis });
    }
};

controllers.associar_delete_if_exists = async (req, res) => {
    const { userId } = req.params;
    const { poloId } = req.body;
    let bol = false;

    const data = await associar
        .update(
            {
                datafim: formatDate(),
            },
            {
                where: { funcionarioId: userId, poloId: poloId, datafim: null },
            }
        )
        .then((data) => {
            bol = true;
            return data;
        })
        .catch((err) => {
            return err;
        });
    res.json({ success: bol, data: data });
};

function formatDate() {
    let d = new Date();
    d.setDate(d.getDate());
    let month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
}

module.exports = controllers