import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import allowedOrigins from "../../config/AllowedOrigins";
import authService from "../../views/auth.service";
import authHeader from "../../views/auth-header";
export default function SalasRegistar() {
  const [currentUser, setCurrentUser] = useState("");

  const [nomePolo, setNomePolo] = useState("");
  const [morada, setMorada] = useState("");
  const [telefone, setTelefone] = useState("");
  const [Email, setEmail] = useState("");
  const [listaIndisponibilidadePolo, setListaIndisponibilidadePolo] = useState(
    []
  );
  const [dataMin, setDataMin] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [motivo, setMotivo] = useState("");

  const { poloID } = useParams();

  const navigate = useNavigate();

  function ListaIndisponibilidade() {
    const ListaIndisponibilidadePolos =
      allowedOrigins + "indisponibilidadePolo/listbypolodescweb/" + poloID;
    axios
      .get(ListaIndisponibilidadePolos, { headers: authHeader() })
      .then((res) => {
        if (res.data.success) {
          const data = res.data.data;
          setListaIndisponibilidadePolo(data);
        } else if (
          !res.data.success &&
          (res.data.message == "Token indisponível." ||
            res.data.message == "O token não é válido.")
        ) {
          localStorage.setItem("Expirou", "1");
          authService.logout();
          window.location.reload(true);
        } else {
          Swal.fire(
            "Erro",
            "Falha ao carregar lista de indisponibilidades do polo",
            "error"
          );
        }
      })
      .catch(() => {
        Swal.fire("Erro", "Falha no servidor", "error");
      });
  }

  function Indisponibilidade() {
    if (motivo.length == 0) {
      Swal.fire(
        "Campo obrigatório",
        "Por favor preencha o campo do motivo",
        "warning"
      );
    } else if (dataInicio == "") {
      Swal.fire(
        "Campo obrigatório",
        "Por favor preencha o campo da data de inicio",
        "warning"
      );
    } else if (dataFim == "") {
      Swal.fire(
        "Campo obrigatório",
        "Por favor preencha o campo da data de fim",
        "warning"
      );
    } else {
      const url = allowedOrigins + "indisponibilidade/create";
      const datapost = {
        dataInicio: dataInicio,
        dataFim: dataFim,
        motivo: motivo,
        funcionarioId: currentUser.id,
      };
      axios
        .post(url, datapost, { headers: authHeader() })
        .then((res) => {
          if (res.data.success) {
            const data = res.data.data;
            var indisponibilidadId = data.id;
            const IndisponibilidadePoloCreate =
              allowedOrigins + "indisponibilidadePolo/create";
            const datapostV2 = {
              poloId: poloID,
              indisponibilidadeId: indisponibilidadId,
            };
            axios
              .post(IndisponibilidadePoloCreate, datapostV2, {
                headers: authHeader(),
              })
              .then((res) => {
                if (
                  !res.data.success &&
                  (res.data.message == "Token indisponível." ||
                    res.data.message == "O token não é válido.")
                ) {
                  localStorage.setItem("Expirou", "1");
                  authService.logout();
                  window.location.reload(true);
                }
              });
            const indisponibilidadeSalaCreateByPolo =
              allowedOrigins + "indisponibilidadeSala/createbypolo";
            const datapostV3 = {
              poloId: poloID,
              indisponibilidadeId: indisponibilidadId,
              dataInicio: dataInicio,
              dataFim: dataFim,
              funcionarioId: currentUser.id,
              motivo: motivo,
            };
            axios
              .post(indisponibilidadeSalaCreateByPolo, datapostV3, {
                headers: authHeader(),
              })
              .then((res) => {
                if (
                  !res.data.success &&
                  (res.data.message == "Token indisponível." ||
                    res.data.message == "O token não é válido.")
                ) {
                  localStorage.setItem("Expirou", "1");
                  authService.logout();
                  window.location.reload(true);
                } else if (res.data.success) {
                  Swal.fire(
                    "Criada!",
                    "Foi criada uma indisponibilidade para este polo com sucesso!",
                    "success"
                  );
                }
              });
            document.getElementById("CloseModal").click();
          } else if (
            !res.data.success &&
            (res.data.message == "Token indisponível." ||
              res.data.message == "O token não é válido.")
          ) {
            localStorage.setItem("Expirou", "1");
            authService.logout();
            window.location.reload(true);
          } else {
            if (
              !res.data.success &&
              ("Validation isDate on dataInicio failed" ==
                res.data.data.errors[0].message ||
                "Validation isDate on dataFim failed" ==
                  res.data.data.errors[0].message)
            ) {
              Swal.fire(
                "Erro",
                "Falha ao criar indisponibilidade, os campos das datas devem estar preenchidos",
                "error"
              );
            } else {
              Swal.fire("Erro", "Falha ao criar indisponibilidade", "error");
            }
          }
        })
        .catch(() => {
          Swal.fire("Erro", "Falha no servidor", "error");
        });
    }
  }
  function UpdatePolo() {
    if (nomePolo == "") {
      Swal.fire(
        "Campo obrigatório",
        "Por favor preencha o campo do nome",
        "warning"
      );
    } else if (morada == "") {
      Swal.fire(
        "Campo obrigatório",
        "Por favor preencha o campo da morada",
        "warning"
      );
    } else if (telefone == "") {
      Swal.fire(
        "Campo obrigatório",
        "Por favor preencha o campo do telefone",
        "warning"
      );
    } else if (Email == "") {
      Swal.fire(
        "Campo obrigatório",
        "Por favor preencha o campo do email",
        "warning"
      );
    } else {
      const url = allowedOrigins + "polo/update/" + poloID;
      const datapost = {
        designacao: nomePolo,
        endereco: morada,
        telefone: telefone,
        email: Email,
      };
      axios
        .put(url, datapost, { headers: authHeader() })
        .then((res) => {
          if (res.data.success) {
            Swal.fire("Successo", "O polo foi atualizado!", "success");
            navigate("/ListarPolos");
          } else {
            if (
              !res.data.success &&
              (res.data.message == "Token indisponível." ||
                res.data.message == "O token não é válido.")
            ) {
              localStorage.setItem("Expirou", "1");
              authService.logout();
              window.location.reload(true);
            } else if (
              "email must be unique" == res.data.data.errors[0].message
            ) {
              Swal.fire(
                "Erro",
                "Falha ao registar o polo, o email que introduziu já existe na base de dados",
                "error"
              );
            } else if (
              "designacao must be unique" == res.data.data.errors[0].message
            ) {
              Swal.fire(
                "Erro",
                "Falha ao registar o polo, o nome que introduziu já existe na base de dados",
                "error"
              );
            } else if (
              "Validation isNumeric on telemovel failed" ==
              res.data.data.errors[0].message
            ) {
              Swal.fire(
                "Erro",
                "Falha ao registar o polo, o número de telemóvel que introduziu não é válido",
                "error"
              );
            } else {
              Swal.fire("Error", "Falha ao registar o polo", "error");
            }
          }
        })
        .catch(() => {
          Swal.fire("Erro", "Falha no servidor", "error");
        });
    }
  }
  function LoadPoloDetails() {
    const url = allowedOrigins + "polo/getweb/" + poloID;
    axios
      .get(url, { headers: authHeader() })
      .then((res) => {
        if (res.data.success) {
          const data = res.data.data;
          setNomePolo(data.designacao);
          setMorada(data.endereco);
          setTelefone(data.telefone);
          setEmail(data.email);
        } else if (
          !res.data.success &&
          (res.data.message == "Token indisponível." ||
            res.data.message == "O token não é válido.")
        ) {
          localStorage.setItem("Expirou", "1");
          authService.logout();
          window.location.reload(true);
        } else {
          Swal.fire("Erro", "Falha ao carregar informações do polo", "error");
        }
      })
      .catch(() => {
        Swal.fire("Erro", "Falha no servidor", "error");
      });
  }
  function sendDelete() {
    const urlPolo_Funcionario =
      allowedOrigins + "associar/deletebypolo/" + poloID;
    axios
      .post(urlPolo_Funcionario, {}, { headers: authHeader() })
      .then((res) => {
        if (res.data.success) {
          const SalaByPoloId = allowedOrigins + "sala/deletebypolo/" + poloID;
          axios
            .put(SalaByPoloId, {}, { headers: authHeader() })
            .then((res) => {
              if (res.data.success) {
                const urlInactivateReserva =
                  allowedOrigins + "reserva/deletebypolo/" + poloID;
                axios
                  .put(urlInactivateReserva, {}, { headers: authHeader() })
                  .then((res) => {
                    if (
                      !res.data.success &&
                      (res.data.message == "Token indisponível." ||
                        res.data.message == "O token não é válido.")
                    ) {
                      localStorage.setItem("Expirou", "1");
                      authService.logout();
                      window.location.reload(true);
                    } else {
                      const url = allowedOrigins + "polo/delete/" + poloID;
                      axios
                        .put(url, {}, { headers: authHeader() })
                        .then((res) => {
                          if (res.data.success) {
                            Swal.fire(
                              "Eliminado!",
                              "O polo foi eliminado com sucesso!",
                              "success"
                            );
                            navigate("/ListarPolos");
                          } else if (
                            !res.data.success &&
                            (res.data.message == "Token indisponível." ||
                              res.data.message == "O token não é válido.")
                          ) {
                            localStorage.setItem("Expirou", "1");
                            authService.logout();
                            window.location.reload(true);
                          } else {
                            Swal.fire(
                              "Erro",
                              "Falha ao eliminar o polo",
                              "error"
                            );
                          }
                        })
                        .catch(() => {
                          Swal.fire("Erro", "Falha no servidor", "error");
                        });
                    }
                  })
                  .catch(() => {
                    Swal.fire("Erro", "Falha no servidor", "error");
                  });
              } else if (
                !res.data.success &&
                (res.data.message == "Token indisponível." ||
                  res.data.message == "O token não é válido.")
              ) {
                localStorage.setItem("Expirou", "1");
                authService.logout();
                window.location.reload(true);
              } else {
                Swal.fire(
                  "Erro",
                  "Falha ao eliminar as salas do polo",
                  "error"
                );
              }
            })
            .catch(() => {
              Swal.fire("Erro", "Falha no servidor", "error");
            });
        } else if (
          !res.data.success &&
          (res.data.message == "Token indisponível." ||
            res.data.message == "O token não é válido.")
        ) {
          localStorage.setItem("Expirou", "1");
          authService.logout();
          window.location.reload(true);
        } else {
          Swal.fire(
            "Erro",
            "Falha ao desassociar os funcionários do polo",
            "error"
          );
        }
      });
  }
  function onDelete() {
    Swal.fire({
      title: "Tem a certeza que pretende eliminar o polo?",
      text: "Esta ação não poderá ser revertida!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.value) {
        sendDelete();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelado", "Polo não eliminado", "error");
      }
    });
  }
  function Dates() {
    var today = new Date();
    var ddmin = today.getDate();
    var mmmin = today.getMonth() + 1;
    var yyyymin = today.getFullYear();
    if (ddmin < 10) {
      ddmin = "0" + ddmin;
    }
    if (mmmin < 10) {
      mmmin = "0" + mmmin;
    }
    today = yyyymin + "-" + mmmin + "-" + ddmin;
    setDataMin(today);
  }
  function CurrentUser() {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }

  useEffect(() => {
    Dates();
    LoadPoloDetails();
    CurrentUser();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
  }

  return (
    <div className="container-xxl mx-5">
      <h1 className="mb-4">Editar Polo</h1>

      <div
        className="modal fade"
        id="Indisponibilidades"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="Indisponibilidades"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="Indisponibilidades">
                Indisponibilidades
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              Por favor escolha se pretende ver a lista de indisponibilidades
              deste polo ou criar uma nova indisponibilidade
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-info"
                data-toggle="modal"
                data-target="#ListarIndisponibilidades"
                onClick={() => ListaIndisponibilidade()}
              >
                Listar
              </button>
              <button
                type="button"
                className="btn btn-outline-primary"
                data-toggle="modal"
                data-target="#CriarIndisponibilidade"
              >
                Criar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="ListarIndisponibilidades"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="ListarIndisponibilidades"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="ListarIndisponibilidades">
                Lista de Indisponibilidades da polo
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {listaIndisponibilidadePolo.length > 0 ? (
                listaIndisponibilidadePolo.map((data, index) => (
                  <div className="row " key={index}>
                    <div className="row m-0 w-100 ">
                      <div className="col-xl-2 col-lg-2 col-4 font-weight-bold">
                        Data de Inicio:
                      </div>
                      <div className="col-8">
                        {data.indisponibilidade.dataInicio}
                      </div>
                    </div>
                    <div className="row m-0 w-100">
                      <div className="col-xl-2 col-lg-2 col-4 font-weight-bold">
                        Data de Fim:
                      </div>
                      <div className="col-8">
                        {data.indisponibilidade.dataFim}
                      </div>
                    </div>
                    <div className="row m-0 w-100 mb-4">
                      <div className="col-xl-2 col-lg-2 col-4 font-weight-bold">
                        Motivo:
                      </div>
                      <div className="col-8">
                        {data.indisponibilidade.motivo}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <h5 className="text-center">
                  O polo que escolheu ainda não tem qualquer indisponibilidade
                </h5>
              )}
            </div>
            <div className="modal-footer">
              <button
                id="CloseModal"
                type="button"
                className="btn btn-outline-secondary"
                data-dismiss="modal"
                title="Cancelar"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="19"
                  height="19"
                  fill="currentColor"
                  className="bi bi-x-circle mb-1 mt-1"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="CriarIndisponibilidade"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="CriarIndisponibilidade"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="CriarIndisponibilidade">
                Indiponibilidade
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="row m-0">
                  <div className="col-6 p-0">
                    <div className="form-group">
                      <label htmlFor="DataInicio">Data de inicio:</label>
                      <input
                        min={dataMin}
                        required
                        type="date"
                        id="DataInicio"
                        name="DataInicio"
                        value={dataInicio}
                        onChange={(value) => setDataInicio(value.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-6 ">
                    <div className="form-group">
                      <label htmlFor="birthdaytime">Data de fim:</label>
                      <input
                        min={dataInicio == "" ? dataMin : dataInicio}
                        required
                        type="date"
                        id="birthdaytime"
                        name="birthdaytime"
                        value={dataFim}
                        onChange={(value) => setDataFim(value.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <div className="form-group">
                      <label htmlFor="message-text" className="col-form-label">
                        Motivo:
                      </label>
                      <textarea
                        required
                        className="form-control"
                        id="message-text"
                        value={motivo}
                        onChange={(value) => setMotivo(value.target.value)}
                      ></textarea>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={() => Indisponibilidade()}
                title="Confirmar"
                data-dismiss="modal"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="19"
                  height="19"
                  fill="currentColor"
                  className="bi bi-check-circle mb-1 mt-1"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                  <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z" />
                </svg>
              </button>
              <button
                id="CloseModal"
                type="button"
                className="btn btn-outline-secondary"
                data-dismiss="modal"
                title="Cancelar"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="19"
                  height="19"
                  fill="currentColor"
                  className="bi bi-x-circle mb-1 mt-1"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={(e) => handleSubmit(e)}>
        <div className="row m-0 mb-4">
          <div style={{ width: "1.5%" }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              fill="currentColor"
              className="bi bi-exclamation-circle mb-1"
              viewBox="0 0 16 16"
            >
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
              <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z" />
            </svg>
          </div>
          <div className="col-xl-2 col-md-6 col-sm-11 col-11">
            <p className="mb-0" style={{ color: "#9BA6B8", fontSize: "15px" }}>
              Campos obrigatórios
            </p>
          </div>
        </div>

        <div className="form-row">
          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
            <div className="form-group col-xl-9 col-md-8 col-sm-10 col-10 p-0">
              <label htmlFor="NomePolo">
                Polo
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  fill="currentColor"
                  className="bi bi-exclamation-circle ml-1 mb-1 "
                  viewBox="0 0 16 16"
                >
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                  <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z" />
                </svg>
              </label>
              <input
                id="NomePolo"
                type="text"
                className="form-control "
                placeholder="Nome"
                style={{ borderBottom: "1px solid grey" }}
                value={nomePolo}
                onChange={(value) => setNomePolo(value.target.value)}
              />
            </div>

            <div className="form-group col-xl-9 col-md-8 col-sm-10 col-10 p-0">
              <label htmlFor="Morada">
                Morada
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  fill="currentColor"
                  className="bi bi-exclamation-circle ml-1 mb-1"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                  <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z" />
                </svg>
              </label>
              <input
                id="Morada"
                type="text"
                className="form-control "
                placeholder="Rua, número e andar"
                style={{ borderBottom: "1px solid grey" }}
                value={morada}
                onChange={(value) => setMorada(value.target.value)}
              />
            </div>
          </div>

          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
            <div className="form-group col-xl-9 col-md-8 col-sm-10 col-10 p-0">
              <label htmlFor="Email">
                Email
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  fill="currentColor"
                  className="bi bi-exclamation-circle ml-1 mb-1"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                  <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z" />
                </svg>
              </label>
              <input
                id="Email"
                type="email"
                className="form-control "
                placeholder="Email"
                style={{ borderBottom: "1px solid grey" }}
                value={Email}
                onChange={(value) => setEmail(value.target.value)}
              />
            </div>

            <div className="form-group col-xl-9 col-md-8 col-sm-10 col-10 p-0">
              <label htmlFor="Telefone">
                Telefone
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  fill="currentColor"
                  className="bi bi-exclamation-circle ml-1 mb-1 "
                  viewBox="0 0 16 16"
                >
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                  <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z" />
                </svg>
              </label>
              <input
                id="Telefone"
                type="number"
                className="form-control "
                placeholder="Número de telefone"
                style={{ borderBottom: "1px solid grey" }}
                value={telefone}
                onChange={(value) => setTelefone(value.target.value)}
              />
            </div>

            <div className="row m-0 mb-3">
              <div className=" col-xl-9 col-md-8 col-sm-10 col-10 d-flex justify-content-end p-0 m-0">
                <button
                  title="Confirmar"
                  className="btn btn-outline-primary mr-1"
                  onClick={() => UpdatePolo()}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="19"
                    height="19"
                    fill="currentColor"
                    className="bi bi-check-circle mb-1 mt-1"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                    <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z" />
                  </svg>
                </button>
                <button
                  title="Indisponibilizar"
                  type="button"
                  className="btn btn-outline-info mx-1"
                  data-toggle="modal"
                  data-target="#Indisponibilidades"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="19"
                    height="19"
                    fill="currentColor"
                    className="bi bi-dash-circle mb-1 mt-1"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                    <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z" />
                  </svg>
                </button>

                <button
                  title="Eliminar"
                  type="button"
                  className="btn btn-outline-danger mx-1"
                  onClick={() => onDelete()}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="19"
                    height="19"
                    fill="currentColor"
                    className="bi bi-trash3 mb-1 mt-1"
                    viewBox="0 0 16 16"
                  >
                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
                  </svg>
                </button>

                <Link
                  className="btn btn-outline-secondary ml-1"
                  to="/ListarPolos"
                  title="Cancelar"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="19"
                    height="19"
                    fill="currentColor"
                    className="bi bi-x-circle mb-1 mt-1"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
