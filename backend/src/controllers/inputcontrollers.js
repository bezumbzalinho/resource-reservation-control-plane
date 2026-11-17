const xlsx = require('xlsx');
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey('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')
const funcionario = require('../models/funcionario')
const polo = require('../models/polo')
const associar = require('../models/associar')
const controllers = {}

controllers.funcionarios = async (req, res) => {

    const { fileName } = req.params

    const filePath = './src/assets/' + fileName;

    try {
        const workbook = xlsx.readFile(filePath);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];

        let posts = []
        let post = {};

        var erros = 0

        for (let cell in worksheet) {
            const cellAsString = cell.toString();

            if (cellAsString[1] !== 'r' && cellAsString[1] !== 'm' && cellAsString[1] > 2) {
                if (cellAsString[0] === 'A') {
                    post.nome = worksheet[cell].w;
                }
                else if (cellAsString[0] === 'B') {
                    post.nascimento = worksheet[cell].w;
                    //console.log(worksheet[cell])
                }
                else if (cellAsString[0] === 'C') {
                    post.email = worksheet[cell].w;
                }
                else if (cellAsString[0] === 'D') {
                    post.telemovel = worksheet[cell].w;
                }
                else if (cellAsString[0] === 'E') {
                    post.endereco = worksheet[cell].w;
                }
                else if (cellAsString[0] === 'F') {
                    post.acessoId = worksheet[cell].w;
                }
                else if (cellAsString[0] === 'G') {
                    post.polo = worksheet[cell].w;
                    posts.push(post);
                    post = {};
                }
            }
        }
        await Promise.all(posts.map(async (data) => {
            let bol = false
            const encontrar = await polo
                .findOne({
                    where: { designacao: data.polo }
                })
                .then(res => {
                    bol = true
                    return res
                }).catch(err => {
                    return err
                })
            //if (bol && encontrar) {
            //async () => {
            await funcionario
                .create({
                    nome: data.nome,
                    nascimento: data.nascimento,
                    email: data.email,
                    telemovel: data.telemovel,
                    endereco: data.endereco,
                    acessoId: data.acessoId
                })
                .then(async (res) => {
                    //console.log(res.dataValues.id)
                    await associar
                        .create({
                            poloId: encontrar !== null ? encontrar.dataValues.id : -1,
                            funcionarioId: res.dataValues.id
                        }).then(() => {
                            const msg = {
                                to: data.email,
                                from: 'boot.pint@gmail.com',
                                subject: 'Bem-vindo, ' + data.nome + '!',
                                text: 'Registo bem sucedido',
                                html: '<!DOCTYPE html><html lang="pt-PT"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"></head><body style="background-color: #e9ecef;"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td align="center" bgcolor="#e9ecef"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"><tr><td align="center" valign="top" style="padding: 36px 24px;"><a href="https://www.softinsa.pt/pt/" target="_blank" style="display: inline-block; font-family: Helvetica, Arial, sans-serif; font-size: 38px; text-decoration: none; color: white; font-weight: bold;">SOFTINSA</a></td></tr></table></td></tr><tr><td align="center" bgcolor="#e9ecef"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"><tr><td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: "Source Sans Pro", Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;"><h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px; text-align: center;">Seja bem vindo à nossa aplicação.</h1><h2 style="margin: 0; font-size: 28px; font-weight: 500; letter-spacing: -1px; line-height: 48px; text-align: center;">O seu registo foi criado com sucesso!</h2><h2 style="margin: 0; font-size: 28px; font-weight: 500; letter-spacing: -1px; line-height: 48px; text-align: center;">Foi criada a seguinte palavra-passe:</h2></td></tr></table></td></tr><tr><td align="center" bgcolor="#e9ecef"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"><tr><td align="left" bgcolor="#ffffff"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td align="center" bgcolor="#ffffff" style="padding: 12px;"><table border="0" cellpadding="0" cellspacing="0"><tr><td align="center" bgcolor="#1a82e2" style="border-radius: 6px;font-size: 16px; padding: 16px 36px; font-family: Helvetica, Arial, sans-serif; font-size: 18px; font-weight: bold; color: white;">1234Pass</td></tr></table></td></tr></table></td></tr><tr><td align="left" bgcolor="#ffffff" style="padding: 20px; font-family: "Source Sans Pro", Helvetica, Arial, sans-serif; font-size: 28px; line-height: 24px; border-bottom: 3px solid #d4dadf"><p style="margin: 0; text-align: center; font-size: 20px;">Obrigado!</p></td></tr></table></td></tr><tr><td align="center" bgcolor="#e9ecef" style="padding: 24px"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"><tr><td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: "Source Sans Pro", Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;"><p style="margin: 0;">Você recebeu este e-mail porque recebemos uma solicitação de registo na nossa aplicação.</p><p style="margin: 0;">Se você não solicitou este registo, pode excluir este e-mail com segurança.</p></td></tr></table></td></tr></table></body></html>'
                            }
                            sgMail.send(msg)
                        })

                        .catch(() => {
                            funcionario
                                .destroy({
                                    where: {
                                        id: res.dataValues.id
                                    }
                                })
                            throw new Error("Erro no associar")
                        })
                }).catch(() => {
                    erros = erros + 1
                    console.log('Erro na criação do fucionario em bulk')
                })
        }))
        //console.log(erros)
        res.json({ success: true, data: posts, erros: erros, linhasLidas: posts.length })
    }
    catch (e) {
        res.json({ success: false, data: [e] })
    }
}

module.exports = controllers