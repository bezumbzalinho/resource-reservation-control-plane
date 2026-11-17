import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import allowedOrigins from "../../config/AllowedOrigins";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import authHeader from "../../views/auth-header";
import authService from "../auth.service";
export default function SalasRegistar() {
  const [currentUser, setCurrentUser] = useState("");
  const [nomeSala, setNomeSala] = useState("");
  const [descricao, setDescricao] = useState("");
  const [polo, setPolo] = useState("");
  const [capacidade, setCapacidade] = useState("");
  const [taxaAloc, setTaxaAloc] = useState("");
  const [TempLimpeza, setTempLimpeza] = useState("");
  const [estadoLimpa, setEstadoLimpa] = useState(false);
  const [dataMin, setDataMin] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [motivo, setMotivo] = useState("");
  const { salaID } = useParams();
  const navigate = useNavigate();
  const [poloList, setPoloList] = useState([]);
  const [listaIndisponibilidadeSala, setListaIndisponibilidadeSala] = useState(
    []
  );

  function ListaIndisponibilidade() {
    const ListaIndisponibilidadeSalas =
      allowedOrigins + "indisponibilidadeSala/listbysaladescweb/" + salaID;
    axios
      .get(ListaIndisponibilidadeSalas, { headers: authHeader() })
      .then((res) => {
        if (res.data.success) {
          const data = res.data.data;
          setListaIndisponibilidadeSala(data);
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
            "Falha ao carregar lista de indisponibilidades da sala",
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
        "error"
      );
    } else if (dataInicio == "") {
      Swal.fire(
        "Campo obrigatório",
        "Por favor preencha o campo da data de início",
        "error"
      );
    } else if (dataFim == "") {
      Swal.fire(
        "Campo obrigatório",
        "Por favor preencha o campo da data fim",
        "error"
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
            const IndisponibilidadeSalaCreate =
              allowedOrigins + "indisponibilidadeSala/create";
            const datapostV2 = {
              salaId: salaID,
              indisponibilidadeId: indisponibilidadId,
              dataInicio: dataInicio,
              dataFim: dataFim,
              funcionarioId: currentUser.id,
              motivo: motivo,
            };
            axios
              .post(IndisponibilidadeSalaCreate, datapostV2, {
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
                    "Foi criada uma indisponibilidade para esta sala com sucesso!",
                    "success"
                  );
                }
              });
            document.getElementById("CloseModal").click();
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
              Swal.fire("Error", "Falha ao criar indisponibilidade", "error");
            }
          }
        })
        .catch(() => {
          Swal.fire("Erro", "Falha no servidor", "error");
        });
    }
  }

  function UpdateSala() {
    if (nomeSala == "") {
      Swal.fire(
        "Campo Obrigatório",
        "Por favor preencha o campo do nome",
        "warning"
      );
    } else if (polo == "") {
      Swal.fire(
        "Campo Obrigatório",
        "Por favor preencha o campo do polo",
        "warning"
      );
    } else if (capacidade == "") {
      Swal.fire(
        "Campo Obrigatório",
        "Por favor preencha o campo da capacidade",
        "warning"
      );
    } else if (taxaAloc == "") {
      Swal.fire(
        "Campo Obrigatório",
        "Por favor preencha o campo da taxa de alocação",
        "warning"
      );
    } else if (descricao == "") {
      Swal.fire(
        "Campo Obrigatório",
        "Por favor preencha o campo da descricao",
        "warning"
      );
    } else {
      const url = allowedOrigins + "sala/update/" + salaID;
      const datapost = {
        designacao: nomeSala,
        descricao: descricao,
        capacidade: capacidade,
        alocacao: taxaAloc,
        tempolimpeza: TempLimpeza,
        limpeza: estadoLimpa,
      };
      axios
        .put(url, datapost, { headers: authHeader() })
        .then((res) => {
          if (res.data.success) {
            Swal.fire("Sucesso", "A sala foi atualizada!", "success");
            navigate("/ListarSalas");
          } else if (
            !res.data.success &&
            (res.data.message == "Token indisponível." ||
              res.data.message == "O token não é válido.")
          ) {
            localStorage.setItem("Expirou", "1");
            authService.logout();
            window.location.reload(true);
          } else if (
            !res.data.succes &&
            res.data.data.errors[0].message ==
              "Validation max on alocacao failed"
          ) {
            Swal.fire(
              "Aviso",
              "O valor máximo que pode introduzir no campo taxa de alocação é 100",
              "warning"
            );
          } else {
            Swal.fire("Erro", "Falha ao atualizar a sala", "error");
          }
        })
        .catch(() => {
          Swal.fire("Erro", "Falha no servidor", "error");
        });
    }
  }

  function onDelete() {
    Swal.fire({
      title: "Tem a certeza que pretende eliminar a sala?",
      text: "Esta ação não poderá ser revertida",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.value) {
        sendDelete();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelado", "Sala não apagada", "warning");
      }
    });
  }

  function sendDelete() {
    const deleteBySala = allowedOrigins + "reserva/deletebysala/" + salaID;
    axios
      .put(deleteBySala, {}, { headers: authHeader() })
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
          const url = allowedOrigins + "sala/delete/" + salaID;
          axios
            .put(url, {}, { headers: authHeader() })
            .then((res) => {
              if (res.data.success) {
                Swal.fire(
                  "Eliminada!",
                  "A sala foi eliminada com sucesso!",
                  "success"
                );
                navigate("/ListarSalas");
              } else if (
                !res.data.success &&
                (res.data.message == "Token indisponível." ||
                  res.data.message == "O token não é válido.")
              ) {
                localStorage.setItem("Expirou", "1");
                authService.logout();
                window.location.reload(true);
              } else {
                Swal.fire("Erro", "Falha ao eliminar a sala", "error");
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
  }

  function LoadSala() {
    const url = allowedOrigins + "sala/getweb/" + salaID;
    axios
      .get(url, { headers: authHeader() })
      .then((res) => {
        if (res.data.success) {
          const data = res.data.data;
          setNomeSala(data.designacao);
          setPolo(data.poloId);
          setEstadoLimpa(data.estadolimp);
          setDescricao(data.descricao);
          setCapacidade(data.capacidade);
          setTaxaAloc(data.alocacao);
          setTempLimpeza(data.tempolimpeza);
        } else if (
          !res.data.success &&
          (res.data.message == "Token indisponível." ||
            res.data.message == "O token não é válido.")
        ) {
          localStorage.setItem("Expirou", "1");
          authService.logout();
          window.location.reload(true);
        } else {
          Swal.fire("Erro", "Falha ao carregar os dados da sala", "error");
        }
      })
      .catch(() => {
        Swal.fire("Erro", "Falha no servidor", "error");
      });
  }

  function LoadPolos() {
    const urlPolos = allowedOrigins + "polo/listweb";
    axios
      .get(urlPolos, { headers: authHeader() })
      .then((res) => {
        if (res.data.success) {
          const data = res.data.data;
          setPoloList(data);
        } else if (
          !res.data.success &&
          (res.data.message == "Token indisponível." ||
            res.data.message == "O token não é válido.")
        ) {
          localStorage.setItem("Expirou", "1");
          authService.logout();
          window.location.reload(true);
        } else {
          Swal.fire("Erro", "Falha ao carregar informações dos polos", "error");
        }
      })
      .catch(() => {
        Swal.fire("Erro", "Falha no servidor", "error");
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

  function GetCurrentUser() {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }

  useEffect(() => {
    GetCurrentUser();
    Dates();
    LoadSala();
    LoadPolos();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
  }

  return (
    <div className="container-xxl mx-5">
      <h1 className="mb-4">Editar Sala</h1>

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
              desta sala ou criar uma nova indisponibilidade
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
                Lista de Indisponibilidades da sala
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
              {listaIndisponibilidadeSala.length > 0 ? (
                listaIndisponibilidadeSala.map((data, index) => (
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
                  A sala que escolheu ainda não tem qualquer indisponibilidade
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
        <div className="row m-0 mb-3 ">
          <div style={{ width: "1.2%" }}>
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
          <div className="col-xl-3 col-md-6 col-sm-11 col-11">
            <p className="mb-0" style={{ color: "#9BA6B8", fontSize: "15px" }}>
              Campos obrigatórios
            </p>
          </div>
        </div>

        <div className="form-row  ">
          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
            <div className="form-group col-xl-9 col-md-9 col-sm-12 col-10">
              <label htmlFor="NommeSala">
                Nome da sala
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
                id="NommeSala"
                type="text"
                className="form-control "
                placeholder="Escreva o nome"
                // required
                style={{ borderBottom: "1px solid grey" }}
                value={nomeSala}
                onChange={(value) => setNomeSala(value.target.value)}
              />
            </div>

            <div className="form-group col-xl-9 col-md-9 col-sm-12 col-10">
              <label htmlFor="SelectPolo">
                Polo/Localização
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
              <select
                disabled
                id="SelectPolo"
                className="form-control"
                style={{ borderBottom: "1px solid grey" }}
                value={polo}
                onChange={(value) => setPolo(value.target.value)}
              >
                <option default>Polo</option>
                {poloList.map((data, index) => (
                  <option key={index} value={data.id}>
                    {data.designacao}
                  </option>
                ))}
              </select>
            </div>
            <div className="row m-0">
              <div className="form-group col-xl-4 col-md-9 col-sm-12 col-10">
                <label htmlFor="Capacidade">
                  Capacidade
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
                  id="Capacidade"
                  type="number"
                  min="1"
                  className="form-control "
                  placeholder="0"
                  style={{ borderBottom: "1px solid grey" }}
                  value={capacidade}
                  onChange={(value) => setCapacidade(value.target.value)}
                />
              </div>
              <div className="form-group col-xl-5 col-md-9 col-sm-12 col-10">
                <label htmlFor="TaxaAlocação">
                  Taxa de alocação (%)
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
                  id="TaxaAlocação"
                  type="number"
                  min="0"
                  className="form-control"
                  placeholder="0%"
                  style={{ borderBottom: "1px solid grey" }}
                  value={taxaAloc}
                  onChange={(value) => setTaxaAloc(value.target.value)}
                />
              </div>
            </div>
            <div className="form-group col-xl-9 col-md-9 col-sm-12 col-10 ">
              <label htmlFor="TempoLimpeza">
                Tempo para limpeza (em minutos)
              </label>
              <input
                id="TempoLimpeza"
                type="number"
                min="0"
                className="form-control "
                placeholder="0"
                style={{ borderBottom: "1px solid grey" }}
                value={TempLimpeza}
                onChange={(value) => setTempLimpeza(value.target.value)}
              />
            </div>
          </div>

          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
            <div className="form-group col-xl-9 col-md-9 col-sm-12 col-10 ">
              <label htmlFor="DescicaoInput ">
                Descrição da Sala
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

              <textarea
                id="DescicaoInput"
                type="text"
                rows="4"
                className="form-control"
                placeholder="Escreva aqui"
                style={{ borderBottom: "1px solid grey" }}
                value={descricao}
                onChange={(value) => setDescricao(value.target.value)}
              />
            </div>
            <div className="form-group col-xl-9 col-md-9 col-sm-12 col-10 ">
              <input
                className="mr-2"
                id="EstadoLimpeza"
                type="checkbox"
                checked={estadoLimpa}
                onChange={() => {
                  setEstadoLimpa(!estadoLimpa);
                }}
              />
              <label htmlFor="EstadoLimpeza">
                Limpa
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
            </div>
            <div className="row m-0 mb-3">
              <div className="col-xl-9 col-md-9 col-sm-12 col-10 d-flex justify-content-end ">
                <button
                  title="Confirmar"
                  className="btn btn-outline-primary mr-1"
                  onClick={() => UpdateSala()}
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
                  title="Indisponibilidades"
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
                  to="/ListarSalas"
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
