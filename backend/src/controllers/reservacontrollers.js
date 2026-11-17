const reserva = require("../models/reserva");
const funcionario = require("../models/funcionario");
const { Op } = require("sequelize");
const sala = require("../models/sala");
const polo = require("../models/polo");
const indisponibilidadeSala = require("../models/indisponibilidadeSala");
const indisponibilidade = require("../models/indisponibilidade");
const notificacao = require("../models/notificacao");
const receber = require("../models/receber");
const Sequelize = require("sequelize");
const controllers = {};

controllers.reserva_list = async (req, res) => {
  let bol = false;
  const lis = await reserva
    .findAll({
      order: [["id", "ASC"]],
      //include: { all: true }
    })
    .then(function (data) {
      bol = true;
      return data;
    })
    .catch((err) => {
      return err;
    });
  if (bol === true) {
    res.status(200).json({ success: bol, data: lis });
  } else {
    res.status(500).json({ success: false, data: lis });
  }
};

controllers.reserva_list_web = async (req, res) => {
  let bol = false;
  const lis = await reserva
    .findAll({
      order: [["id", "ASC"]],
      //include: { all: true }
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

controllers.reserva_create = async (req, res) => {
  const { horainicio, horafim, data, salaId, funcionarioId } = req.body;
  let bol = false;
  const list = await funcionario
    .findOne({
      where: { id: funcionarioId, inativo: false },
    })
    .then((data) => {
      bol = true;
      return data;
    })
    .catch((err) => {
      return err;
    });
  if (!bol) {
    res.status(500).json({ success: false, data: { msg: "Ocorreu um erro na criação da reserva. Verifique todos os valores" } });
  } else if (list === null /* || (list.length === 0 && bol === true)*/) {
    res
      .status(403)
      .json({ success: false, data: { msg: "Utilizador inativo" } });
  } else {
    bol = false;

    const listSalas = await sala
      .findOne({
        where: {
          id: salaId,
          apagada: false,
        },
      })
      .then((data) => {
        bol = true;
        return data;
      })
      .catch((err) => {
        return err;
      });
    if (!bol) {
      res
        .status(500)
        .json({ success: false, data: { msg: "Erro no servidor" } });
    } else if (listSalas === null) {
      res
        .status(403)
        .json({ success: false, data: { msg: "Não existe essa sala" } });
    } else {
      bol = false;
      const listIndisponibilidades = await indisponibilidadeSala
        .findOne({
          where: {
            salaId: salaId,
            //'$indisponibilidadeSala.salaId$': salaId,
            [Op.and]: [
              {
                "$indisponibilidade.dataInicio$": {
                  [Op.lte]: data,
                },
              },
              {
                "$indisponibilidade.dataFim$": {
                  [Op.gte]: data,
                },
              },
            ],
          },
          include: { model: indisponibilidade, as: "indisponibilidade" },
        })
        .then((data) => {
          bol = true;
          return data;
        })
        .catch((err) => {
          return err;
        });
      if (!bol) {
        res
          .status(500)
          .json({ success: false, data: { msg: "Erro no servidor" } });
      } else if (listIndisponibilidades !== null) {
        res.status(403).json({
          success: false,
          data: { msg: "Há indisponibilidade nessa sala nessa data" },
        });
      } else {
        bol = false;
        const listReservas = await reserva
          .findOne({
            where: {
              salaId: salaId,
              ativa: true,
              [Op.and]: [
                {
                  data: data,
                },
                {
                  [Op.or]: [
                    {
                      [Op.and]: [
                        {
                          horafim: {
                            [Op.gte]: horafim,
                          },
                        },
                        {
                          horainicio: {
                            [Op.lte]: horafim,
                          },
                        },
                      ],
                    },
                    {
                      [Op.and]: [
                        {
                          horafim: {
                            [Op.gte]: recuarTempoLimpeza(
                              data + " " + horainicio,
                              listSalas.dataValues.tempolimpeza
                            ),
                          },
                        },
                        {
                          horainicio: {
                            [Op.lte]: horainicio,
                          },
                        },
                      ],
                    },
                    {
                      [Op.and]: [
                        {
                          horafim: {
                            [Op.lte]: horafim,
                          },
                        },
                        {
                          horainicio: {
                            [Op.gte]: horainicio,
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          })
          .then((data) => {
            bol = true;
            return data;
          })
          .catch((err) => {
            return err;
          });
        if (!bol) {
          res
            .status(500)
            .json({ success: false, data: { msg: "Erro no servidor" } });
        } else if (listReservas !== null) {
          res
            .status(403)
            .json({ success: false, data: { msg: "Há reservas sobrepostas" } });
        } else {
          const lis = await reserva
            .create({
              data: data,
              horainicio: horainicio,
              horafim: horafim,
              salaId: salaId,
              funcionarioId: funcionarioId,
            })
            .then((data) => {
              bol = true;
              return data;
            })
            .catch((err) => {
              return err;
            });
          if (bol === true) {
            /*notificacao.create({
                            designacao: 'Nova reserva com início às ' + horainicio + ' e término às ' + horafim + ' no dia ' + data + ' feita por ' + list.dataValues.nome,
                        })*/
            res.status(200).json({ success: bol, data: lis });
          } else {
            res.status(500).json({ success: false, data: lis });
          }
        }
      }
    }
  }
};

controllers.reserva_list_by_funcionario_novas = async (req, res) => {
  const { id, data } = req.query;
  let bol = false;
  const lis = await reserva
    .findAll({
      order: [["id", "ASC"]],
      where: {
        funcionarioId: id,
        ultimaModificacao: {
          [Op.gt]: data,
        },
      },
    })
    .then(function (data) {
      bol = true;
      return data;
    })
    .catch((err) => {
      return err;
    });
  if (bol === true) {
    res.status(200).json({ success: bol, horaServer: formatDate(), data: lis });
  } else {
    res
      .status(500)
      .json({ success: false, horaServer: formatDate(), data: lis });
  }
};

controllers.reserva_list_by_funcionario = async (req, res) => {
  const { id } = req.params;
  let bol = false;
  const lis = await reserva
    .findAll({
      order: [["id", "ASC"]],
      where: { funcionarioId: id },
      //include: { all: true }
    })
    .then(function (data) {
      bol = true;
      return data;
    })
    .catch((err) => {
      return err;
    });
  if (bol === true) {
    res.status(200).json({ success: bol, data: lis });
  } else {
    res.status(500).json({ success: false, data: lis });
  }
};

controllers.reserva_list_by_funcionario_web = async (req, res) => {
  const { id } = req.params;
  let bol = false;
  const lis = await reserva
    .findAll({
      order: [["id", "ASC"]],
      where: { funcionarioId: id },
      //include: { all: true }
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

controllers.reserva_list_by_funcionario_desc = async (req, res) => {
  const { id } = req.params;
  let bol = false;
  const lis = await reserva
    .findAll({
      order: [["id", "DESC"]],
      where: { funcionarioId: id },
      //include: { all: true }
    })
    .then(function (data) {
      bol = true;
      return data;
    })
    .catch((err) => {
      return err;
    });
  if (bol === true) {
    res.status(200).json({ success: bol, data: lis });
  } else {
    res.status(500).json({ success: false, data: lis });
  }
};

controllers.reserva_list_by_funcionario_desc_web = async (req, res) => {
  const { id } = req.params;
  let bol = false;
  const lis = await reserva
    .findAll({
      order: [["id", "DESC"]],
      where: { funcionarioId: id },
      include: [
        {
          model: sala,
          include: { model: polo },
        },
      ],
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

controllers.reserva_list_by_sala = async (req, res) => {
  const { id } = req.params;

  let bol = false;

  const lis = await reserva
    .findAll({
      where: { salaId: id },
    })
    .then(function (data) {
      bol = true;
      return data;
    })
    .catch((err) => {
      return err;
    });
  if (bol === true) {
    res.status(200).json({ success: bol, horaServer: formatDate(), data: lis });
  } else {
    res
      .status(500)
      .json({ success: false, horaServer: formatDate(), data: lis });
  }
};

controllers.reserva_list_by_sala_web = async (req, res) => {
  const { id } = req.params;

  let bol = false;

  const lis = await reserva
    .findAll({
      where: { salaId: id },
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

controllers.reserva_list_by_sala_novas = async (req, res) => {
  const { id, data } = req.query;

  let bol = false;

  const lis = await reserva
    .findAll({
      where: {
        salaId: id,
        ultimaModificacao: {
          [Op.gt]: data,
        },
      },
    })
    .then(function (data) {
      bol = true;
      return data;
    })
    .catch((err) => {
      return err;
    });
  if (bol === true) {
    res.status(200).json({ success: bol, horaServer: formatDate(), data: lis });
  } else {
    res
      .status(500)
      .json({ success: false, horaServer: formatDate(), data: lis });
  }
};

controllers.reserva_detail = async (req, res) => {
  const { id } = req.params;
  let bol = false;
  const lis = await reserva
    .findOne({
      where: { id: id },
    })
    .then((data) => {
      bol = true;
      return data;
    })
    .catch((err) => {
      return err;
    });

  if (bol === true) {
    res.status(200).json({ success: bol, horaServer: formatDate(), data: lis });
  } else {
    res
      .status(500)
      .json({ success: false, horaServer: formatDate(), data: lis });
  }
};

controllers.reserva_detail_web = async (req, res) => {
  const { id } = req.params;
  let bol = false;
  const lis = await reserva
    .findOne({
      where: { id: id },
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

controllers.reserva_update = async (req, res) => {
  const { id } = req.params;
  const { horainicio, horafim, ativa, data, funcionarioId } = req.body;
  let bol = false;
  const list = await funcionario
    .findOne({
      where: { id: funcionarioId, inativo: false },
    })
    .then((data) => {
      bol = true;
      return data;
    })
    .catch((err) => {
      return err;
    });
  if (!bol) {
    res.status(500).json({ success: false, data: { msg: "Erro no servidor" } });
  } else if (list === null /* || (list.length === 0 && bol === true)*/) {
    res
      .status(403)
      .json({ success: false, data: { msg: "Utilizador inativo" } });
  } else {
    if (ativa == "false") {
      bol = false;
      const lis = await reserva
        .update(
          {
            data: data,
            horainicio: horainicio,
            horafim: horafim,
            ativa: ativa,
          },
          {
            where: {
              id: id,
              ativa: true,
            },
          }
        )
        .then((data) => {
          bol = true;
          return data;
        })
        .catch((err) => {
          return err;
        });
      if (bol !== false) {
        if (lis[0] == 0) {
          res.status(400).json({ success: false, data: lis });
        } else {
          res.status(200).json({ success: bol, data: lis });
        }
      } else {
        res.status(500).json({ success: false, data: lis });
      }
    } else {
      bol = false;
      const listReservas = await reserva
        .findOne({
          where: {
            id: id,
            ativa: true,
          },
        })
        .then((data) => {
          bol = true;
          return data;
        })
        .catch((err) => {
          return err;
        });
      if (!bol) {
        res
          .status(500)
          .json({ success: false, data: { msg: "Erro no servidor" } });
      } else if (
        listReservas === null /* || (list.length === 0 && bol === true)*/
      ) {
        res.status(403).json({
          success: false,
          data: {
            msg: "Essa reserva já se encontra inativa, pelo que não pode reativar",
          },
        });
      } else {
        bol = false;

        const listSalas = await sala
          .findOne({
            where: {
              id: listReservas.dataValues.salaId,
              apagada: false,
            },
          })
          .then((data) => {
            bol = true;
            return data;
          })
          .catch((err) => {
            return err;
          });
        if (!bol) {
          res
            .status(500)
            .json({ success: false, data: { msg: "Erro no servidor" } });
        } else if (listSalas === null) {
          reserva.update(
            {
              ativa: false,
            },
            {
              where: {
                id: id,
                ativa: true,
              },
            }
          );
          res
            .status(403)
            .json({ success: false, data: { msg: "Não existe essa sala" } });
        } else {
          bol = false;
          const listIndisponibilidades = await indisponibilidadeSala
            .findOne({
              where: {
                salaId: listReservas.dataValues.salaId,
                //'$indisponibilidadeSala.salaId$': salaId,
                [Op.and]: [
                  {
                    "$indisponibilidade.dataInicio$": {
                      [Op.lte]: data,
                    },
                  },
                  {
                    "$indisponibilidade.dataFim$": {
                      [Op.gte]: data,
                    },
                  },
                ],
              },
              include: { model: indisponibilidade, as: "indisponibilidade" },
            })
            .then((data) => {
              bol = true;
              return data;
            })
            .catch((err) => {
              return err;
            });
          if (!bol) {
            res
              .status(500)
              .json({ success: false, data: { msg: "Erro no servidor" } });
          } else if (listIndisponibilidades !== null) {
            res.status(403).json({
              success: false,
              data: { msg: "Há indisponibilidade nessa sala nessa data" },
            });
          } else {
            bol = false;
            const listReservasBuscar = await reserva
              .findOne({
                where: {
                  salaId: listReservas.dataValues.salaId,
                  ativa: true,
                  [Op.and]: [
                    {
                      data: data,
                    },
                    {
                      [Op.or]: [
                        {
                          [Op.and]: [
                            {
                              horafim: {
                                [Op.gte]: horafim,
                              },
                            },
                            {
                              horainicio: {
                                [Op.lte]: horafim,
                              },
                            },
                          ],
                        },
                        {
                          [Op.and]: [
                            {
                              horafim: {
                                [Op.gte]: recuarTempoLimpeza(
                                  data + " " + horainicio,
                                  listSalas.dataValues.tempolimpeza
                                ),
                              },
                            },
                            {
                              horainicio: {
                                [Op.lte]: horainicio,
                              },
                            },
                          ],
                        },
                        {
                          [Op.and]: [
                            {
                              horafim: {
                                [Op.lte]: horafim,
                              },
                            },
                            {
                              horainicio: {
                                [Op.gte]: horainicio,
                              },
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              })
              .then((data) => {
                bol = true;
                return data;
              })
              .catch((err) => {
                return err;
              });
            if (!bol) {
              res
                .status(500)
                .json({ success: false, data: { msg: "Erro no servidor" } });
            } else if (listReservasBuscar !== null) {
              res.status(403).json({
                success: false,
                data: { msg: "Há reservas sobrepostas" },
              });
            } else {
              const lisNovaReservas = await reserva
                .update(
                  {
                    data: data,
                    horainicio: horainicio,
                    horafim: horafim,
                    ativa: ativa,
                  },
                  {
                    where: {
                      id: id,
                      ativa: true,
                    },
                  }
                )
                .then((data) => {
                  bol = true;
                  return data;
                })
                .catch((err) => {
                  return err;
                });
              if (bol !== false) {
                if (lisNovaReservas[0] == 0) {
                  res
                    .status(400)
                    .json({ success: false, data: lisNovaReservas });
                } else {
                  res.status(200).json({ success: bol, data: lisNovaReservas });
                }
              } else {
                res.status(500).json({ success: false, data: lisNovaReservas });
              }
            }
          }
        }
      }
    }
  }
};

controllers.reserva_UpdateState = async (req, res) => {
  const { id } = req.params;
  const { ativa } = req.body;
  let bol = false;
  const lis = await reserva
    .update(
      {
        ativa: ativa,
      },
      {
        where: {
          id: id,
          ativa: true,
        },
      }
    )
    .then((data) => {
      bol = true;
      return data;
    })
    .catch((err) => {
      return err;
    });
  if (bol !== false) {
    if (lis[0] == 0) {
      res.status(400).json({ success: false, data: lis });
    } else {
      res.status(200).json({ success: bol, data: lis });
    }
  } else {
    res.status(500).json({ success: false, data: lis });
  }
};

controllers.reserva_UpdateState_web = async (req, res) => {
  const { id } = req.params;
  const { ativa, funcionarioId } = req.body;
  let bol = false;
  const lis = await reserva
    .update(
      {
        ativa: ativa,
      },
      {
        where: {
          id: id,
          ativa: true,
        },
      }
    )
    .then((data) => {
      bol = true;
      return data;
    })
    .catch((err) => {
      return err;
    });
  if (lis[0] !== 0) {
    reserva
      .findOne({
        where: {
          id: id
        }
      }).then((data) => {
        notificacao
          .create({
            designacao: 'A reserva com início às ' + data.horainicio + ' e término às ' + data.horafim + ' no dia ' + data.data + ' foi cancelada por ordem do administrador.',
            funcionarioId: funcionarioId
          }).then(res => {
            receber.create({
              funcionarioId: data.funcionarioId,
              notificacaoId: res.id
            })
          })
      })
  }
  res.json({ success: lis[0] == 0 ? false : bol, data: lis });
};

controllers.reserva_list_web_passadas = async (req, res) => {
  let bol = false;
  const lis = await reserva
    .findAll({
      order: [["data", "DESC"]],
      include: [
        {
          model: funcionario,
        },
        {
          model: sala,
          include: { model: polo },
        },
      ],
      where: {
        salaId: { [Op.not]: null },
        [Op.or]: [
          {
            data: {
              [Op.lt]: formatDateOnly(),
            },
          },
          {
            [Op.and]: [
              {
                data: {
                  [Op.eq]: formatDateOnly(),
                },
              },
              {
                horafim: {
                  [Op.lt]: formatTimeOnly(),
                },
              },
            ],
          },
          {
            ativa: false,
          },
        ],
      },
    })
    .then(function (data) {
      bol = true;
      return data;
    })
    .catch((err) => {
      return err;
    });

  res.json({ success: bol, data: lis, horaServer: formatDate() });
};

controllers.reserva_list_web_futuras = async (req, res) => {
  let bol = false;
  const lis = await reserva
    .findAll({
      order: [["data", "ASC"]],
      where: {
        ativa: true,
        [Op.or]: [
          {
            data: {
              [Op.gt]: formatDateOnly(),
            },
          },
          {
            [Op.and]: [
              {
                data: {
                  [Op.eq]: formatDateOnly(),
                },
              },
              {
                horainicio: {
                  [Op.gte]: formatTimeOnly(),
                },
              },
            ],
          },
          {
            [Op.and]: [
              {
                data: {
                  [Op.eq]: formatDateOnly(),
                },
              },
              {
                horafim: {
                  [Op.gte]: formatTimeOnly(),
                },
              },
            ],
          },
        ],
      },
      include: [
        {
          model: funcionario,
        },
        {
          model: sala,
          include: { model: polo },
        },
      ],
    })
    .then(function (data) {
      bol = true;
      return data;
    })
    .catch((err) => {
      return err;
    });

  res.json({ success: bol, data: lis, horaServer: formatDate() });
};

controllers.reserva_delete_by_polo = async (req, res) => {
  const { id } = req.params;
  let bol = false;
  const encontrar = await reserva
    .findAll({
      where: {
        ativa: true,
        "$sala.poloId$": id,
        [Op.or]: [
          {
            data: {
              [Op.gt]: formatDateOnly(),
            },
          },
          {
            [Op.and]: [
              {
                data: {
                  [Op.eq]: formatDateOnly(),
                },
              },
              {
                horainicio: {
                  [Op.gte]: formatTimeOnly(),
                },
              },
            ],
          },
          {
            [Op.and]: [
              {
                data: {
                  [Op.eq]: formatDateOnly(),
                },
              },
              {
                horafim: {
                  [Op.gte]: formatTimeOnly(),
                },
              },
            ],
          },
        ],
      },
      include: { model: sala, as: "sala" },
    })
    .then((data) => {
      bol = true;
      return data;
    })
    .catch((err) => {
      return err;
    });
  if (bol && encontrar.length > 0) {
    encontrar.map((data) => {
      reserva.update(
        {
          ativa: false,
        },
        {
          where: { id: data.id, ativa: true },
        }
      );
    });
    res.json({ success: true, data: { msg: "Encontrou" } });
  } else {
    res.json({ success: false, data: { msg: "Não encontrou" } });
  }
};

controllers.reserva_delete_by_sala = async (req, res) => {
  const { id } = req.params;
  let bol = false;
  const encontrar = await reserva
    .findAll({
      where: {
        ativa: true,
        salaId: id,
        [Op.or]: [
          {
            data: {
              [Op.gt]: formatDateOnly(),
            },
          },
          {
            [Op.and]: [
              {
                data: {
                  [Op.eq]: formatDateOnly(),
                },
              },
              {
                horainicio: {
                  [Op.gte]: formatTimeOnly(),
                },
              },
            ],
          },
          {
            [Op.and]: [
              {
                data: {
                  [Op.eq]: formatDateOnly(),
                },
              },
              {
                horafim: {
                  [Op.gte]: formatTimeOnly(),
                },
              },
            ],
          },
        ],
      },
    })
    .then((data) => {
      bol = true;
      return data;
    })
    .catch((err) => {
      return err;
    });
  if (bol && encontrar.length > 0) {
    encontrar.map((data) => {
      reserva.update(
        {
          ativa: false,
        },
        {
          where: { id: data.id, ativa: true },
        }
      );
    });
    res.json({ success: true, data: { msg: "Encontrou" } });
  } else {
    res.json({ success: false, data: { msg: "Não encontrou" } });
  }
};

controllers.reserva_count_entre_intervalos = async (req, res) => {
  const { dataInicio, dataFim } = req.query;
  let bol = false;
  const lis = await reserva
    .count({
      where: {
        ativa: true,
        [Op.and]: [
          {
            data: {
              [Op.gte]: dataInicio,
            },
          },
          {
            data: {
              [Op.lte]: dataFim,
            },
          },
        ],
      },
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

controllers.reserva_count_entre_intervalos_todas = async (req, res) => {
  const { dataInicio, dataFim } = req.query;
  let bol = false;
  const lis = await reserva
    .count({
      where: {
        [Op.and]: [
          {
            data: {
              [Op.gte]: dataInicio,
            },
          },
          {
            data: {
              [Op.lte]: dataFim,
            },
          },
        ],
      },
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

controllers.reserva_count_ativas = async (req, res) => {
  let bol = false;
  const lis = await reserva
    .count({
      where: {
        ativa: true,
      },
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

controllers.reserva_count_todas = async (req, res) => {
  let bol = false;
  const lis = await reserva
    .count()
    .then((data) => {
      bol = true;
      return data;
    })
    .catch((err) => {
      return err;
    });
  res.json({ success: bol, data: lis });
};

controllers.reserva_count_hoje = async (req, res) => {
  let bol = false;
  const lis = await reserva
    .count({
      where: {
        ativa: true,
        data: formatDateOnly(),
      },
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

controllers.reserva_count_mes = async (req, res) => {
  let bol = false;
  const lis = await reserva
    .count({
      where: {
        ativa: true,
        [Op.and]: [
          {
            data: {
              [Op.gte]: formatDateOnlyFirstDay(),
            },
          },
          {
            data: {
              [Op.lte]: formatDateOnlyLastDay(),
            },
          },
        ],
      },
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

controllers.reserva_buscar_sala_mais_reservada = async (req, res) => {
  let bol = false;
  let array = []
  const listSalas = await sala
    .findAll({
      attributes: ['id'],
      where: {
        apagada: false,
      },
    })
    .then((data) => {
      bol = true;
      return data;
    })
    .catch((err) => {
      return err;
    });
  //console.log(listSalas[0].dataValues.id)
  listSalas.map(data => {
    array.push(`${data.dataValues.id}`)
  })
  if (bol && listSalas.length !== 0) {
    bol = false
    const lis = await reserva
      .findOne({
        attributes: [
          "salaId",
          [Sequelize.fn("COUNT", Sequelize.col("id")), "count_"],
        ],
        where: {
          ativa: true,
          salaId: {
            [Op.in]: array
          }
        },
        group: ["salaId"],
        order: Sequelize.literal("count_ DESC"),
      })
      .then((data) => {
        bol = true;
        return data;
      })
      .catch((err) => {
        return err;
      });
    res.json({ success: bol, data: lis });
  } else {
    res.json({ success: false, data: 0 });
  }
};

function formatDate() {
  let d = new Date();
  d.setTime(d.getTime() + d.getTimezoneOffset() * 60000 + 3600000 * 1);
  let month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear(),
    hour = d.getHours(),
    min = d.getMinutes(),
    sec = d.getSeconds();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;
  if (hour < 10) hour = "0" + hour;
  if (min < 10) min = "0" + min;
  if (sec < 10) sec = "0" + sec;
  return [[year, month, day].join("-"), [hour, min, sec].join(":")].join(" ");
}

function formatTimeOnly() {
  let d = new Date();
  d.setTime(d.getTime() + d.getTimezoneOffset() * 60000 + 3600000 * 1);
  let hour = d.getHours(),
    min = d.getMinutes(),
    sec = d.getSeconds();

  if (hour < 10) hour = "0" + hour;
  if (min < 10) min = "0" + min;
  if (sec < 10) sec = "0" + sec;
  return [hour, min, sec].join(":");
}

function formatDateOnly() {
  let d = new Date();

  d.setDate(d.getDate());
  let month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

function formatDateOnlyLastDay() {
  let d = new Date();

  d.setDate(d.getDate());
  const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0);

  let month = "" + (lastDay.getMonth() + 1),
    day = "" + lastDay.getDate(),
    year = lastDay.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

function formatDateOnlyFirstDay() {
  let d = new Date();

  d.setDate(d.getDate());
  const firstDay = new Date(d.getFullYear(), d.getMonth(), 1);

  let month = "" + (firstDay.getMonth() + 1),
    day = "" + firstDay.getDate(),
    year = firstDay.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

function recuarTempoLimpeza(horainicio, tempolimpeza) {
  let date = new Date(horainicio);
  date.setMinutes(date.getMinutes() - tempolimpeza);

  let hour = date.getHours(),
    min = date.getMinutes(),
    sec = date.getSeconds();

  if (hour < 10) hour = "0" + hour;
  if (min < 10) min = "0" + min;
  if (sec < 10) sec = "0" + sec;
  return [hour, min, sec].join(":");
}

module.exports = controllers;
