import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import allowedOrigins from "../../config/AllowedOrigins";
import authService from "../../views/auth.service";
import authHeader from "../../views/auth-header";
export default function SalasListar() {
  const [currentUser, setCurrentUser] = useState("");
  const [poloList, setPoloList] = useState([]);

  function loadList() {
    const url = allowedOrigins + "polo/listweb";
    axios
      .get(url, { headers: authHeader() })
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
          Swal.fire(
            "Error",
            "Falha ao carregar informações dos polos",
            "error"
          );
        }
      })
      .catch(() => {
        Swal.fire("Erro", "Falha no servidor", "error");
      });
  }

  function sendDelete(id) {
    const urlPolo_Funcionario = allowedOrigins + "associar/deletebypolo/" + id;
    axios
      .post(urlPolo_Funcionario, {}, { headers: authHeader() })
      .then((res) => {
        if (res.data.success) {
          const SalaByPoloId = allowedOrigins + "sala/deletebypolo/" + id;
          axios
            .put(SalaByPoloId, {}, { headers: authHeader() })
            .then((res) => {
              if (res.data.success) {
                const urlInactivateReserva =
                  allowedOrigins + "reserva/deletebypolo/" + id;
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
                      const url = allowedOrigins + "polo/delete/" + id;
                      axios
                        .put(url, {}, { headers: authHeader() })
                        .then((res) => {
                          if (res.data.success) {
                            Swal.fire(
                              "Eliminado!",
                              "O polo foi eliminado com sucesso!",
                              "success"
                            );
                            loadList();
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

  function onDelete(id) {
    Swal.fire({
      title: "Tem a certeza que pretende eliminar o polo?",
      text: "Esta ação não poderá ser revertida!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.value) {
        sendDelete(id);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelado", "Polo não eliminado", "error");
      }
    });
  }

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
    loadList();
  }, []);

  return (
    <div className="container-xxl  mx-5">
      <h1>Lista de Polos</h1>
      <div className="row m-0">
        <div className="col-12 p-0">
          <div className="card mt-3">
            <div
              className="card-body table-responsive p-0"
              style={{ height: "441px" }}
            >
              <table className="table table-head-fixed text-nowrap">
                <thead>
                  <tr>
                    <th className="border-bottom align-middle">POLO</th>
                    <th className="border-bottom align-middle">MORADA</th>
                    <th className="border-bottom align-middle">CONTACTO</th>
                    <th className="border-bottom align-middle">EMAIL</th>

                    <th className="border-bottom text-center align-middle"></th>
                  </tr>
                </thead>
                <tbody>
                  {poloList.map((data, index) => (
                    <tr key={index}>
                      <td className="border-bottom align-middle">
                        {data.designacao}
                      </td>
                      <td className="border-bottom align-middle">
                        {data.endereco}
                      </td>
                      <td className="border-bottom align-middle">
                        {data.telefone}
                      </td>
                      <td className="border-bottom  align-middle">
                        {data.email}
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
                              <li
                                className="mb-2"
                                style={{ display: "inline" }}
                              >
                                <Link
                                  style={{ textDecoration: "none" }}
                                  to={"/ListarPolos/EditPolo/" + data.id}
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
                                  className="btn btn-outline-danger"
                                  onClick={() => onDelete(data.id)}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    className="bi bi-trash3 mb-1"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
                                  </svg>
                                </button>
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
