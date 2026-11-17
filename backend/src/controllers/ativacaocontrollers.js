const sgMail = require('@sendgrid/mail')
sgMail.setApiKey('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')
const { Op } = require("sequelize")
const ativacao = require("../models/ativacao")
const funcionario = require('../models/funcionario')
const bcrypt = require('bcrypt')
const controllers = {};

controllers.ativacao_list = async (req, res) => {
    let bol = false
    const lis = await ativacao
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

controllers.ativacao_list_web = async (req, res) => {
    let bol = false
    const lis = await ativacao
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

controllers.ativacao_create = async (req, res) => {
    const { email } = req.body;
    let bol = false

    const encontrar = await funcionario
        .findOne({
            where: { email: email, inativo: false }
        })
        .then(data => {
            bol = true
            return data
        })
        .catch(err => {
            return err
        })
    if (encontrar !== null && encontrar.length !== 0 && bol === true) {
        bol = false
        let timeObject = new Date()
        timeObject.setTime(timeObject.getTime() + (timeObject.getTimezoneOffset() * 60000) + (3600000 * 2))
        //console.log(timeObject)
        const data = await ativacao
            .findOne({
                where: {
                    funcionarioId: encontrar.id,
                    expericao: {
                        [Op.gte]: timeObject
                    },
                    usado: false
                }
            })
            .then((data) => {
                bol = true
                return data;
            })
            .catch((err) => {
                return err;
            });
        if (bol === false) {
            res.status(400).json({ success: false, data: { erro: 'Algo correu mal' } });
        }
        else if (data === null || (data.length === 0 && bol === true)) {
            const cod = makeCod(7)
            const lis = await ativacao
                .create({
                    expericao: GetExpericao().toISOString(),
                    codativacao: cod,
                    funcionarioId: encontrar.id,
                })
                .then((data) => {
                    bol = true
                    return data;
                })
                .catch((err) => {
                    bol = false
                    return err;
                });
            //console.log(__dirname.replace('controllers', 'views\''))
            if (bol === true) {
                const msg = {
                    to: email,
                    from: 'boot.pint@gmail.com',
                    subject: 'Email com o código de recuperação para alterar palavra-passe',
                    text: 'Email com o código de recuperação para alterar palavra-passe: ' + cod,
                    html: '<!DOCTYPE html><html lang="pt-PT"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"></head><body style="background-color: #e9ecef;"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td align="center" bgcolor="#e9ecef"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"><tr><td align="center" valign="top" style="padding: 36px 24px;"><a href="https://www.softinsa.pt/pt/" target="_blank" style="display: inline-block; font-family: Helvetica, Arial, sans-serif; font-size: 38px; text-decoration: none; color: white; font-weight: bold;">SOFTINSA</a></td></tr></table></td></tr><tr><td align="center" bgcolor="#e9ecef"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"><tr><td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: "Source Sans Pro", Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;"><h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px; text-align: center;">Solicitou a recuperação de palavra-passe.</h1><h2 style="margin: 0; font-size: 28px; font-weight: 500; letter-spacing: -1px; line-height: 48px; text-align: center;">Utilize este código nos próximos 20 minutos.</h2><h2 style="margin: 0; font-size: 28px; font-weight: 500; letter-spacing: -1px; line-height: 48px; text-align: center;">Código de recuperação:</h2></td></tr></table></td></tr><tr><td align="center" bgcolor="#e9ecef"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"><tr><td align="left" bgcolor="#ffffff"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td align="center" bgcolor="#ffffff" style="padding: 12px;"><table border="0" cellpadding="0" cellspacing="0"><tr><td align="center" bgcolor="#1a82e2" style="border-radius: 6px;font-size: 16px; padding: 16px 36px; font-family: Helvetica, Arial, sans-serif; font-size: 18px; font-weight: bold; color: white;">' + cod + '</td></tr></table></td></tr></table></td></tr><tr><td align="left" bgcolor="#ffffff" style="padding: 20px; font-family: "Source Sans Pro", Helvetica, Arial, sans-serif; font-size: 28px; line-height: 24px; border-bottom: 3px solid #d4dadf"><p style="margin: 0; text-align: center; font-size: 20px;">Obrigado!</p></td></tr></table></td></tr><tr><td align="center" bgcolor="#e9ecef" style="padding: 24px"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"><tr><td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: "Source Sans Pro", Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;"><p style="margin: 0;">Você recebeu este e-mail porque recebemos uma solicitação de recuperação de palavra-passe na nossa aplicação.</p><p style="margin: 0;">Se você não solicitou esta recuperação, pode excluir este e-mail com segurança.</p></td></tr></table></td></tr></table></body></html>'
                }
                sgMail.send(msg)
            }
            if (bol === true) {
                res.status(200).json({ success: bol, data: { funcionarioId: lis.funcionarioId, email: email } });
            } else {
                res.status(500).json({ success: false, data: lis })
            }
        } else {
            res.status(403).json({ success: false, data: { erro: 'Ainda existe um código ativo para este funcionário' } });
        }
    }
    else {
        res.status(403).json({ success: false, data: { erro: 'Esse email não se encontra registado' } });
    }
};

controllers.ativacao_create_web = async (req, res) => {
    const { email } = req.body;
    let bol = false

    const encontrar = await funcionario
        .findOne({
            where: { email: email, inativo: false, acessoId: 1 }
        })
        .then(data => {
            bol = true
            return data
        })
        .catch(err => {
            return err
        })
    if (encontrar !== null && encontrar.length !== 0 && bol === true) {
        bol = false
        let timeObject = new Date()
        timeObject.setTime(timeObject.getTime() + (timeObject.getTimezoneOffset() * 60000) + (3600000 * 2))
        //console.log(timeObject)
        const data = await ativacao
            .findOne({
                where: {
                    funcionarioId: encontrar.id,
                    expericao: {
                        [Op.gte]: timeObject
                    },
                    usado: false
                }
            })
            .then((data) => {
                bol = true
                return data;
            })
            .catch((err) => {
                return err;
            });
        if (bol === false) {
            res.json({ success: false, data: { erro: 'Algo correu mal' } });
        }
        else if (data === null || (data.length === 0 && bol === true)) {
            const cod = makeCod(7)
            const lis = await ativacao
                .create({
                    expericao: GetExpericao().toISOString(),
                    codativacao: cod,
                    funcionarioId: encontrar.id,
                })
                .then((data) => {
                    bol = true
                    return data;
                })
                .catch((err) => {
                    bol = false
                    return err;
                });
            //console.log(__dirname.replace('controllers', 'views\''))
            if (bol === true) {
                const msg = {
                    to: email,
                    from: 'boot.pint@gmail.com',
                    subject: 'Email com o código de recuperação para alterar palavra-passe',
                    text: 'Email com o código de recuperação para alterar palavra-passe: ' + cod,
                    html: '<!DOCTYPE html><html lang="pt-PT"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"></head><body style="background-color: #e9ecef;"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td align="center" bgcolor="#e9ecef"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"><tr><td align="center" valign="top" style="padding: 36px 24px;"><a href="https://www.softinsa.pt/pt/" target="_blank" style="display: inline-block; font-family: Helvetica, Arial, sans-serif; font-size: 38px; text-decoration: none; color: white; font-weight: bold;">SOFTINSA</a></td></tr></table></td></tr><tr><td align="center" bgcolor="#e9ecef"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"><tr><td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: "Source Sans Pro", Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;"><h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px; text-align: center;">Solicitou a recuperação de palavra-passe.</h1><h2 style="margin: 0; font-size: 28px; font-weight: 500; letter-spacing: -1px; line-height: 48px; text-align: center;">Utilize este código nos próximos 20 minutos.</h2><h2 style="margin: 0; font-size: 28px; font-weight: 500; letter-spacing: -1px; line-height: 48px; text-align: center;">Código de recuperação:</h2></td></tr></table></td></tr><tr><td align="center" bgcolor="#e9ecef"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"><tr><td align="left" bgcolor="#ffffff"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td align="center" bgcolor="#ffffff" style="padding: 12px;"><table border="0" cellpadding="0" cellspacing="0"><tr><td align="center" bgcolor="#1a82e2" style="border-radius: 6px;font-size: 16px; padding: 16px 36px; font-family: Helvetica, Arial, sans-serif; font-size: 18px; font-weight: bold; color: white;">' + cod + '</td></tr></table></td></tr></table></td></tr><tr><td align="left" bgcolor="#ffffff" style="padding: 20px; font-family: "Source Sans Pro", Helvetica, Arial, sans-serif; font-size: 28px; line-height: 24px; border-bottom: 3px solid #d4dadf"><p style="margin: 0; text-align: center; font-size: 20px;">Obrigado!</p></td></tr></table></td></tr><tr><td align="center" bgcolor="#e9ecef" style="padding: 24px"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"><tr><td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: "Source Sans Pro", Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;"><p style="margin: 0;">Você recebeu este e-mail porque recebemos uma solicitação de recuperação de palavra-passe na nossa aplicação.</p><p style="margin: 0;">Se você não solicitou esta recuperação, pode excluir este e-mail com segurança.</p></td></tr></table></td></tr></table></body></html>'
                }
                sgMail.send(msg)
            }
            if (bol === true) {
                res.status(200).json({ success: bol, data: { funcionarioId: lis.funcionarioId, email: email } });
            } else {
                res.json({ success: false, data: { erro: 'Algo correu mal no servidor. Tente novamente mais tarde' } })
            }
        } else {
            res.json({ success: false, data: { erro: 'Ainda existe um código ativo para este funcionário' } });
        }
    }
    else {
        res.json({ success: false, data: { erro: 'Esse email não se encontra registado ou está inativo ou não tem permissões' } });
    }
};

controllers.ativacao_list_funcionario = async (req, res) => {
    const { id } = req.params;
    let bol = false
    const lis = await ativacao
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

controllers.ativacao_list_funcionario_web = async (req, res) => {
    const { id } = req.params;
    let bol = false
    const lis = await ativacao
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

    res.json({ success: bol, data: lis });
};

controllers.ativacao_list_inv_funcionario = async (req, res) => {
    const { id } = req.params;
    let bol = false
    const lis = await ativacao
        .findAll({
            order: [
                ['id', 'DESC'],
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

controllers.ativacao_list_inv_funcionario_web = async (req, res) => {
    const { id } = req.params;
    let bol = false
    const lis = await ativacao
        .findAll({
            order: [
                ['id', 'DESC'],
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

    res.json({ success: bol, data: lis });
};

controllers.ativacao_update = async (req, res) => {
    const { funcionarioId, codativacao } = req.body;

    let timeObject = new Date()
    timeObject.setTime(timeObject.getTime() + (timeObject.getTimezoneOffset() * 60000) + (3600000 * 2))

    let bol = false
    const lis = await ativacao
        .findOne(
            {
                where: {
                    funcionarioId: funcionarioId,
                    expericao: {
                        [Op.gte]: timeObject
                    },
                    usado: false,
                }
            })
        .then((data) => {
            bol = true
            return data;
        })
        .catch((err) => {
            return err;
        });
    if (lis !== null && lis.length !== 0 && bol === true) {
        bol = false
        const isMatch = bcrypt.compareSync(codativacao, lis.codativacao)
        if (isMatch) {
            const data = await ativacao
                .update(
                    {
                        usado: true
                    },
                    {
                        where: { id: lis.id }
                    }
                )
                .then((data) => {
                    bol = true
                    return data;
                })
                .catch((err) => {
                    return err;
                });
            res.json({ success: bol, data: { msg: bol ? data[0] === 1 ? 'Sucesso' : 'Algo correu mal' : 'Algo correu mal' } })
        } else {
            res.status(403).json({ success: false, data: { msg: 'O código não está correto' } })
        }
    } else {
        res.status(400).json({ success: false, data: { msg: 'Esse código já não está disponível' } })
    }
};

controllers.ativacao_update_web = async (req, res) => {
    const { funcionarioId, codativacao } = req.body;

    let timeObject = new Date()
    timeObject.setTime(timeObject.getTime() + (timeObject.getTimezoneOffset() * 60000) + (3600000 * 2))

    let bol = false
    const lis = await ativacao
        .findOne(
            {
                where: {
                    funcionarioId: funcionarioId,
                    expericao: {
                        [Op.gte]: timeObject
                    },
                    usado: false,
                }
            })
        .then((data) => {
            bol = true
            return data;
        })
        .catch((err) => {
            return err;
        });
    if (lis !== null && lis.length !== 0 && bol === true) {
        bol = false
        const isMatch = bcrypt.compareSync(codativacao, lis.codativacao)
        if (isMatch) {
            const data = await ativacao
                .update(
                    {
                        usado: true
                    },
                    {
                        where: { id: lis.id }
                    }
                )
                .then((data) => {
                    bol = true
                    return data;
                })
                .catch((err) => {
                    return err;
                });
            res.json({ success: bol, data: { msg: bol ? data[0] === 1 ? 'Sucesso' : 'Algo correu mal' : 'Algo correu mal' } })
        } else {
            res.json({ success: false, data: { msg: 'O código não está correto' } })
        }
    } else {
        res.json({ success: false, data: { msg: 'Esse código já não está disponível' } })
    }
};

function makeCod(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function GetExpericao() {
    let timeObject = new Date()
    timeObject.setTime((timeObject.getTime() + 10000 * 120) + (timeObject.getTimezoneOffset() * 60000) + (3600000 * 2));

    return timeObject
}

module.exports = controllers