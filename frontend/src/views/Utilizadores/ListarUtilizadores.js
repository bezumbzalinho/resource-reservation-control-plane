import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import allowedOrigins from "../../config/AllowedOrigins";
import authHeader from "../../views/auth-header";
import authService from "../../views/auth.service";
export default function UtilizadoresListar() {
  const [currentUser, setCurrentUser] = useState("");
  const [UserList, setUserList] = useState([]);
  const [listReservasUser, setListReservasUser] = useState([]);

  function GerUserReservas(id) {
    const GetReservas =
      allowedOrigins + "reserva/listbyfuncionariodescweb/" + id;
    axios
      .get(GetReservas, { headers: authHeader() })
      .then((res) => {
        if (res.data.success) {
          const data = res.data.data;
          setListReservasUser(data);
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
            "Falha ao carregar as reservas dos utilizadores",
            "error"
          );
        }
      })
      .catch(() => {
        Swal.fire("Erro", "Falha no servidor", "error");
      });
  }

  function LoadUserPoloList() {
    const uList = allowedOrigins + "funcionario/listweb";
    axios
      .get(uList, { headers: authHeader() })
      .then((res) => {
        if (res.data.success) {
          const data = res.data.data;
          setUserList(data);
        } else if (
          !res.data.success &&
          (res.data.message == "Token indisponível." ||
            res.data.message == "O token não é válido.")
        ) {
          localStorage.setItem("Expirou", "1");
          authService.logout();
          window.location.reload(true);
        } else {
          Swal.fire("Erro", "Falha ao carregar os utilizadores", "error");
        }
      })
      .catch(() => {
        Swal.fire("Erro", "Falha no servidor", "error");
      });
  }

  function ChangeState(id, estado) {
    const state = !estado;
    const UpdateState = allowedOrigins + "funcionario/updateState/" + id;
    axios
      .put(UpdateState, { inativo: state }, { headers: authHeader() })
      .then((res) => {
        if (res.data.success) {
          if (res.data.data > 0 && state) {
            Swal.fire({
              icon: "success",
              title: "Utilizador inativado com sucesso",
              showConfirmButton: false,
              timer: 1500,
            });
            LoadUserPoloList();
          } else if (res.data.data > 0 && !state) {
            Swal.fire({
              icon: "success",
              title: "Utilizador ativado com sucesso",
              showConfirmButton: false,
              timer: 1500,
            });
            LoadUserPoloList();
          }
        } else if (
          !res.data.success &&
          (res.data.message == "Token indisponível." ||
            res.data.message == "O token não é válido.")
        ) {
          localStorage.setItem("Expirou", "1");
          authService.logout();
          window.location.reload(true);
        }
      })
      .catch(() => {
        Swal.fire("Erro", "Falha no servidor", "error");
      });
  }

  function CallChangeState(id, estado) {
    if (estado == false) {
      Swal.fire({
        title: "Tem a certeza que pretende inativar o utilizador?",
        text: "Todas as reservas associadas serão canceladas!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.value) {
          ChangeState(id, estado);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire("Cancelado", "O utilizador não foi inativado", "error");
        }
      });
    } else {
      ChangeState(id, estado);
    }
  }

  function Filtrar(event) {
    let tr = document.querySelectorAll("#myList tr");

    for (let i = 0; i < tr.length; i++) {
      tr[i].style.display = "none";
      const tdArray = tr[i].getElementsByTagName("td");
      for (let j = 0; j < tdArray.length - 1; j++) {
        const cellValue = tdArray[j];
        if (
          cellValue &&
          cellValue.innerHTML
            .toLowerCase()
            .indexOf(event.target.value.toLowerCase()) > -1
        ) {
          tr[i].style.display = "";
          break;
        }
      }
    }
  }

  function getCurrentUser() {
    LoadUserPoloList();
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }

  useEffect(() => {
    getCurrentUser();
  }, []);

  return (
    <div className="container-xxl  mx-5">
      <h1>Lista de Utilizadores</h1>

      <div
        className="modal fade"
        id="ListaReservas"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="ListaReservas"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="ListaReservas">
                Lista de reservas do utilizador
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
              {listReservasUser.length > 0 ? (
                listReservasUser.map((data, index) => (
                  <div className="row border-bottom border-dark" key={index}>
                    <div className="row m-0 w-100 ">
                      <div className="col-xl-2 col-lg-2 col-3 font-weight-bold">
                        Localização:
                      </div>
                      <div className="col-8">
                        {data.sala.designacao}, {data.sala.polo.designacao}
                      </div>
                    </div>

                    <div className="row m-0 w-100 mb-2">
                      <div className="col-xl-2 col-lg-2 col-3 font-weight-bold">
                        Data e hora:
                      </div>
                      <div className="col-4">
                        {data.data} | {data.horainicio.substring(0, 5)} -{" "}
                        {data.horafim.substring(0, 5)}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <h5 className="text-center">
                  O utilizador que escolheu ainda não fez qualquer reserva
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

      <div className="row m-0">
        <div className="col-12 p-0">
          <div className="row d-flex justify-content-center m-0">
            <div className="col-xl-3 col-lg-5 col-md-6 col-sm-8 col-12 p-0">
              <input
                type="search"
                className="form-control rounded"
                placeholder="Procurar"
                aria-label="Search"
                aria-describedby="search-addon"
                id="myInput"
                onChange={(e) => Filtrar(e)}
              />
            </div>
          </div>
          <div className="card mt-3">
            <div
              className="card-body table-responsive p-0"
              style={{ height: "75vh" }}
            >
              <table className="table table-head-fixed text-nowrap">
                <thead>
                  <tr>
                    <th className="border-bottom align-middle">IMAGEM</th>
                    <th className="border-bottom align-middle">NÚMERO</th>
                    <th
                      className="border-bottom align-middle"
                      style={{ width: "25%" }}
                    >
                      NOME
                    </th>
                    <th className="border-bottom align-middle">EMAIL</th>
                    <th className="border-bottom align-middle">CARGO</th>
                    <th className="border-bottom align-middle">ESTADO</th>
                    <th className="border-bottom text-center align-middle"></th>
                  </tr>
                </thead>
                <tbody id="myList">
                  {UserList.map((data, index) => (
                    <tr key={index}>
                      <td className="border-bottom align-middle ">
                        {data.fotografia ? (<img
                          src={allowedOrigins + data.fotografia}
                          alt="Perfil"
                          onError={(e) => {
                            e.target.src = `${allowedOrigins}profileImg.svg`;

                            console.clear();
                          }}
                          width="50"
                          height="50"
                          className="border"
                          style={{ borderRadius: "50%" }}
                        />) :
                          (<img
                            src={allowedOrigins + 'profileImg.svg'}
                            alt="Perfil"
                            width="50"
                            height="50"
                            className="border"
                            style={{ borderRadius: "50%" }}
                          />)}
                      </td>
                      <td className="border-bottom align-middle">{data.id}</td>
                      <td className="border-bottom align-middle">
                        {data.nome}
                      </td>
                      <td className="border-bottom align-middle">
                        {data.email}
                      </td>
                      <td className="border-bottom align-middle">
                        {data.acesso.designacao}
                      </td>

                      <td className="border-bottom  align-middle">
                        {data.inativo ? "Inativo" : "Ativo"}
                      </td>

                      <td className="border-bottom align-middle">
                        <div className="dropdown">
                          <button
                            className="btn"
                            type="button"
                            id="dropdownMenuButton"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              fill="currentColor"
                              className="bi bi-three-dots-vertical"
                              viewBox="0 0 16 16"
                            >
                              <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                            </svg>
                          </button>
                          <div
                            className="dropdown-menu"
                            aria-labelledby="dropdownMenuButton"
                          >
                            <ul
                              className="m-0 p-0 text-center"
                              style={{ listStyleType: "none" }}
                            >
                              <li className="" style={{ display: "inline" }}>
                                <Link
                                  style={{ textDecoration: "none" }}
                                  to={"/ListarUtilizadores/UserEdit/" + data.id}
                                >
                                  <button className="btn btn-outline-secondary">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      fill="currentColor"
                                      className="bi bi-gear mb-1"
                                      viewBox="0 0 16 16"
                                    >
                                      <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z" />
                                      <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z" />
                                    </svg>
                                  </button>
                                </Link>
                              </li>

                              <li
                                className="mx-2"
                                style={{ display: "inline" }}
                              >
                                <button
                                  className="btn btn-outline-info"
                                  title="Consultar Reservas"
                                  onClick={() => GerUserReservas(data.id)}
                                  data-toggle="modal"
                                  data-target="#ListaReservas"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    className="bi bi-eye mb-1"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                                  </svg>
                                </button>
                              </li>

                              <li className="" style={{ display: "inline" }}>
                                {data.inativo ? (
                                  <button
                                    title="Ativar"
                                    id="btnState"
                                    className="btn btn-outline-success"
                                    type="submit"
                                    onClick={() =>
                                      CallChangeState(data.id, data.inativo)
                                    }
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="17"
                                      height="17"
                                      fill="currentColor"
                                      className="bi bi-person-check mb-1"
                                      viewBox="0 0 16 16"
                                    >
                                      <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H1s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
                                      <path
                                        fillRule="evenodd"
                                        d="M15.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L12.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0z"
                                      />
                                    </svg>
                                  </button>
                                ) : (
                                  <button
                                    disabled={currentUser.id == data.id}
                                    title="Inativar"
                                    id="btnState"
                                    className="btn btn-outline-danger "
                                    type="submit"
                                    onClick={() =>
                                      CallChangeState(data.id, data.inativo)
                                    }
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="17"
                                      height="17"
                                      fill="currentColor"
                                      className="bi bi-person-x mb-1"
                                      viewBox="0 0 16 16"
                                    >
                                      <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H1s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
                                      <path
                                        fillRule="evenodd"
                                        d="M12.146 5.146a.5.5 0 0 1 .708 0L14 6.293l1.146-1.147a.5.5 0 0 1 .708.708L14.707 7l1.147 1.146a.5.5 0 0 1-.708.708L14 7.707l-1.146 1.147a.5.5 0 0 1-.708-.708L13.293 7l-1.147-1.146a.5.5 0 0 1 0-.708z"
                                      />
                                    </svg>
                                  </button>
                                )}
                              </li>
                            </ul>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
