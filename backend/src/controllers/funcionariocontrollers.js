const Sequelize = require('sequelize')
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey('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')
const funcionario = require("../models/funcionario");
const acesso = require("../models/acesso")
const bcrypt = require('bcrypt')
const { Op } = require("sequelize")
const reserva = require('../models/reserva')
const jwt = require('jsonwebtoken')
const { jwtSecret } = require('../config/token')
const controllers = {};

controllers.funcionario_list = async (req, res) => {
    let bol = false
    const lis = await funcionario
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

controllers.funcionario_list_web = async (req, res) => {
    let bol = false
    const lis = await funcionario
        .findAll({
            order: [
                ['id', 'ASC'],
            ],
            include: { model: acesso }
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

controllers.funcionario_UpdateState = async (req, res) => {
    const { id } = req.params;
    const { inativo } = req.body;
    let bol = false;
    const lis = await funcionario
        .update(
            {
                inativo: inativo,
            },
            {
                where: { id: id },
            }
        )
        .then((data) => {
            bol = true;
            return data;
        })
        .catch((err) => {
            return err;
        });
    if (inativo == true && lis[0] !== 0 && bol) {
        reserva
            .update(
                {
                    ativa: false
                },
                {
                    where: {
                        funcionarioId: id,
                        [Op.or]: [
                            {
                                data: {
                                    [Op.gt]: formatDate()
                                }
                            },
                            {
                                [Op.and]: [
                                    {
                                        data: {
                                            [Op.eq]: formatDate()
                                        }
                                    },
                                    {
                                        horainicio: {
                                            [Op.gte]: formatTimeOnly()
                                        }
                                    }
                                ]
                            },
                            {
                                [Op.and]: [
                                    {
                                        data: {
                                            [Op.eq]: formatDate()
                                        }
                                    },
                                    {
                                        horafim: {
                                            [Op.gte]: formatTimeOnly()
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                }
            )
    }
    res.json({ success: lis[0] == 0 ? false : bol, data: lis });
};

controllers.funcionario_create = async (req, res) => {
    const { nome, nascimento, email,
        telemovel, endereco, pass,
        fotografia, acessoId } = req.body;
    let bol = false
    const lis = await funcionario
        .create({
            nome: nome,
            nascimento: nascimento,
            email: email,
            telemovel: telemovel,
            endereco: endereco,
            pass: pass,
            fotografia: fotografia,
            acessoId: acessoId,
        })
        .then((data) => {
            bol = true
            return data;
        })
        .catch((err) => {
            return err;
        });
    if (bol === true) {
        const msg = {
            to: lis.email,
            from: 'boot.pint@gmail.com',
            subject: 'Bem-vindo, ' + nome + '!',
            text: 'Registo bem sucedido',
            html: '<!DOCTYPE html><html lang="pt-PT"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"></head><body style="background-color: #e9ecef;"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td align="center" bgcolor="#e9ecef"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"><tr><td align="center" valign="top" style="padding: 36px 24px;"><a href="https://www.softinsa.pt/pt/" target="_blank" style="display: inline-block; font-family: Helvetica, Arial, sans-serif; font-size: 38px; text-decoration: none; color: white; font-weight: bold;">SOFTINSA</a></td></tr></table></td></tr><tr><td align="center" bgcolor="#e9ecef"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"><tr><td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: "Source Sans Pro", Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;"><h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px; text-align: center;">Seja bem vindo à nossa aplicação.</h1><h2 style="margin: 0; font-size: 28px; font-weight: 500; letter-spacing: -1px; line-height: 48px; text-align: center;">O seu registo foi criado com sucesso!</h2><h2 style="margin: 0; font-size: 28px; font-weight: 500; letter-spacing: -1px; line-height: 48px; text-align: center;">Foi criada a seguinte palavra-passe:</h2></td></tr></table></td></tr><tr><td align="center" bgcolor="#e9ecef"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"><tr><td align="left" bgcolor="#ffffff"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td align="center" bgcolor="#ffffff" style="padding: 12px;"><table border="0" cellpadding="0" cellspacing="0"><tr><td align="center" bgcolor="#1a82e2" style="border-radius: 6px; color: white; font-family: Helvetica, Arial, sans-serif; font-size: 18px; font-weight: bold; padding: 16px 36px;">' + pass + '</td></tr></table></td></tr></table></td></tr><tr><td align="left" bgcolor="#ffffff" style="padding: 20px; font-family: "Source Sans Pro", Helvetica, Arial, sans-serif; font-size: 28px; line-height: 24px; border-bottom: 3px solid #d4dadf"><p style="margin: 0; text-align: center; font-size: 20px;">Obrigado!</p></td></tr></table></td></tr><tr><td align="center" bgcolor="#e9ecef" style="padding: 24px"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"><tr><td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: "Source Sans Pro", Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;"><p style="margin: 0;">Você recebeu este e-mail porque recebemos uma solicitação de registo na nossa aplicação.</p><p style="margin: 0;">Se você não solicitou este registo, pode excluir este e-mail com segurança.</p></td></tr></table></td></tr></table></body></html>'
        }
        sgMail.send(msg)
    }
    res.json({ success: bol, data: bol ? { id: lis.id, nome: lis.nome, nascimento: lis.nascimento, email: lis.email, endereco: lis.endereco, acessoId: lis.acessoId, fotografia: lis.fotografia } : lis });
};

controllers.funcionario_detail = async (req, res) => {
    const { id } = req.params;
    let bol = false
    const lis = await funcionario
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

controllers.funcionario_detail_web = async (req, res) => {
    const { id } = req.params;
    let bol = false;
    const lis = await funcionario
        .findOne({
            where: { id: id },
            include: { model: acesso },
        })
        .then((data) => {
            bol = true;
            return data;
        })
        .catch((err) => {
            return err;
        });
    res.json({ success: bol, data: lis });
};

controllers.funcionario_update_web = async (req, res) => {
    const { id } = req.params;
    const { nome, nascimento, email,
        telemovel, endereco,
        fotografia, acessoId, inativo } = req.body;
    let bol = false
    const lis = await funcionario
        .update(
            {
                nome: nome,
                nascimento: nascimento,
                email: email,
                telemovel: telemovel,
                endereco: endereco,
                fotografia: fotografia,
                acessoId: acessoId,
                inativo: inativo
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
    if (bol === true && inativo == "false" && lis[0] !== 0) {
        reserva
            .update(
                {
                    ativa: false
                },
                {
                    where: {
                        funcionarioId: id,
                        data: {
                            [Op.gte]: formatDate()
                        }
                    }
                }
            )
    }
    res.json({ success: lis[0] == 0 ? false : bol, data: lis[0] !== 0 ? { id: id, nome: nome, nascimento: nascimento, email: email, endereco: endereco, fotografia: fotografia } : lis });
};

controllers.funcionario_update = async (req, res) => {
    const { id } = req.params;
    const { telemovel, endereco } = req.body;
    let bol = false
    //const hash = bcrypt.hashSync(pass, 10)
    const lis = await funcionario
        .update(
            {
                telemovel: telemovel,
                endereco: endereco,
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
    if (bol !== true || lis[0] === 0) {
        res.status(400).json({ success: false, data: lis })
    } else {
        res.status(200).json({ success: true, data: { id: id, endereco: endereco, fotografia: fotografia } })
    }
};

controllers.funcionario_login_web = async (req, res) => {
    const { email, pass } = req.body

    if (pass === null || typeof pass === 'undefined' || email === null || typeof email === 'undefined') {
        res.json({
            success: false, message: 'Campos em branco'
        })
    } else {
        const user = await funcionario.findOne({ where: { email: email, acessoId: 1, inativo: false } })
            .then(data => {
                return data
            })
            .catch(err => {
                //console.log("Erro: " + err)
                return null
            })
        if (email && pass && user) {
            const isMatch = bcrypt.compareSync(pass, user.pass)
            if (req.body.email === user.email && isMatch) {
                funcionario.update(
                    {
                        ultimoacesso: Sequelize.NOW
                    },
                    {
                        where: { id: user.id, ultimoacesso: { [Op.ne]: null } },
                    }
                )
                let token = jwt.sign({ email: email }, jwtSecret, { expiresIn: '10h' });
                res.json({ success: true, message: 'Autenticação realizada com sucesso!', token: token, id: user.id, ultimoacesso: user.ultimoacesso });
            } else {
                res.json({ success: false, message: 'Dados de autenticação inválidos.' });
            }
        } else {
            res.json({ success: false, message: 'Erro no processo de autenticação.' })
        }
    }
}

controllers.funcionario_login = async (req, res) => {
    const { email, pass } = req.body

    if (pass === null || typeof pass === 'undefined' || email === null || typeof email === 'undefined') {
        res.status(403).json({
            success: false, message: 'Campos em branco'
        })
    } else {
        const user = await funcionario.findOne({ where: { email: email, inativo: false } })
            .then(data => {
                return data
            })
            .catch(err => {
                //console.log("Erro: " + err)
                return null
            })
        if (email && pass && user) {
            const isMatch = bcrypt.compareSync(pass, user.pass)
            if (req.body.email === user.email && isMatch) {
                funcionario.update(
                    {
                        ultimoacesso: Sequelize.NOW
                    },
                    {
                        where: {
                            id: user.id,
                            ultimoacesso: {
                                [Op.ne]: null
                            }
                        },
                    }
                )
                res.json({ success: true, message: 'Autenticação realizada com sucesso!', id: user.id, ultimoacesso: user.ultimoacesso });
            } else {
                res.status(403).json({ success: false, message: 'Dados de autenticação inválidos.' });
            }
        } else {
            res.status(400).json({ success: false, message: 'Erro no processo de autenticação. Tente de novo mais tarde.' })
        }
    }
}

controllers.funcionario_login_tablet = async (req, res) => {
    const { email, pass } = req.body

    if (pass === null || typeof pass === 'undefined' || email === null || typeof email === 'undefined') {
        res.status(403).json({
            success: false, message: 'Campos em branco'
        })
    } else {
        //console.log(email, pass)
        const user = await funcionario.findOne({ where: { email: email, acessoId: 1, inativo: false } })
            .then(data => {
                return data
            })
            .catch(err => {
                //console.log("Erro: " + err)
                return null
            })
        if (email && pass && user) {
            const isMatch = bcrypt.compareSync(pass, user.pass)
            if (req.body.email === user.email && isMatch) {
                funcionario.update(
                    {
                        ultimoacesso: Sequelize.NOW
                    },
                    {
                        where: {
                            id: user.id,
                            ultimoacesso: {
                                [Op.ne]: null
                            }
                        },
                    }
                )
                res.status(200).json({ success: true, message: 'Autenticação realizada com sucesso!', id: user.id, ultimoacesso: user.ultimoacesso });
            } else {
                res.status(403).json({ success: false, message: 'Dados de autenticação inválidos.' });
            }
        } else {
            res.status(400).json({ success: false, message: 'Erro no processo de autenticação.' })
        }
    }
}

controllers.funcionario_update_pass = async (req, res) => {
    const { id, pass } = req.body

    let bol = false
    const hash = bcrypt.hashSync(pass, 10)
    //console.log(hash)
    const lis = await funcionario
        .update(
            {
                ultimoacesso: Sequelize.NOW,
                pass: hash
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
    if (lis !== null && lis.length !== 0) {
        res.status(200).json({ success: lis[0] === 1 ? bol : false, data: bol ? lis[0] === 1 ? { id: id } : { msg: 'Algo correu mal' } : lis });
    } else {
        res.status(400).json({ success: false, data: { msg: 'Algo correu mal' } });
    }
};

controllers.funcionario_update_pass_web = async (req, res) => {
    const { id, pass } = req.body

    let bol = false
    const hash = bcrypt.hashSync(pass, 10)
    //console.log(hash)
    const lis = await funcionario
        .update(
            {
                ultimoacesso: Sequelize.NOW,
                pass: hash
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
    if (lis !== null && lis.length !== 0) {
        res.json({ success: lis[0] === 1 ? bol : false, data: bol ? lis[0] === 1 ? { id: id } : { msg: 'Algo correu mal' } : lis });
    } else {
        res.json({ success: false, data: { msg: 'Algo correu mal' } });
    }
};

controllers.funcionario_count = async (req, res) => {
    let bol = false
    const lis = await funcionario
        .count()
        .then((data) => {
            bol = true
            return data;
        })
        .catch((err) => {
            return err;
        });
    res.json({ success: bol, data: lis });
};

controllers.funcionario_get_ultimo_funcionario = async (req, res) => {
    let bol = false
    const lis = await funcionario
        .findOne({
            order: [
                ['id', 'DESC'],
            ],
        })
        .then((data) => {
            bol = true
            return data;
        })
        .catch((err) => {
            return err;
        });
    res.json({ success: lis == null ? false : bol, data: lis });
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

function formatDate() {
    let d = new Date()
    d.setDate(d.getDate())
    let month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

module.exports = controllers;
