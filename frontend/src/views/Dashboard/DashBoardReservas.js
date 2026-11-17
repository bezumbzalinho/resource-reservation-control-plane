import "../../App.css";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import Chart from "chart.js/auto";
import { Doughnut } from "react-chartjs-2";
import allowedOrigins from "../../config/AllowedOrigins";
import authService from "../auth.service";
import authHeader from "../../views/auth-header";
export default function DashBoardReservas() {
  const [currentUser, setCurrentUser] = useState("");
  const [
    TotalDeReservasAtivasDesdeSempre,
    setTotalDeReservasAtivasDesdeSempre,
  ] = useState("");
  const [reservasAtivasNoSistema, setReservasAtivasNoSistema] = useState("");
  const [ReservasAtivasTotais, setReservasAtivaTotais] = useState("");
  const [ReservaGetDay, setReservaGetDay] = useState(false);
  const [dataInicioRange, setDataInicioRange] = useState("");
  const [dataFimRange, setDataFimRange] = useState("");
  const [reservasTotais, setReservasTotais] = useState("");
  const [reservasAtivas, setReservasAtivas] = useState("");
  const [salaMaisReservada, setSalaMaisReservada] = useState("");
  const [designacaoSalaMaisReservada, setDesignacaoSalaMaisReservada] =
    useState("");
  const [poloDaSalaMaisReservada, setPoloDaSalaMaisReservada] = useState("");
  const [nColaboradores, setNColaboradores] = useState("");
  const [nSalas, setNSalas] = useState("");
  const [CountPolos, setCountPolos] = useState("");
  const [reservasList, setReservasList] = useState([]);
  const [ajuda, setAjuda] = useState(true);
  const [dataServer, setDataServer] = useState("");
  const [horaServer, setHoraServer] = useState("");
  function GetSalaDetails(sala) {
    const GetPolo = allowedOrigins + "sala/getweb/" + sala;
    axios
      .get(GetPolo, { headers: authHeader() })
      .then((res) => {
        if (res.data.success) {
          const data = res.data.data;

          setDesignacaoSalaMaisReservada(data.designacao);
          setPoloDaSalaMaisReservada(data.polo.designacao);
        } else if (
          !res.data.success &&
          (res.data.message == "Token indisponível." ||
            res.data.message == "O token não é válido.")
        ) {
          localStorage.setItem("Expirou", "1");
          authService.logout();
          window.location.reload(true);
        } else {
          Swal.fire("Erro", "Falha ao obter informações da sala", "error");
        }
      })
      .catch(() => {
        Swal.fire("Erro", "Falha no servidor", "error");
      });
  }
  function getSalaMaisReservada() {
    const GetSala = allowedOrigins + "reserva/getSalaMaisReservada";
    axios
      .get(GetSala, { headers: authHeader() })
      .then((res) => {
        if (res.data.success) {
          const data = res.data.data;
          if (data != null && data.count_ !== null) {
            GetSalaDetails(data.salaId);
            setSalaMaisReservada(data.count_);
          } else {
            setSalaMaisReservada(0);
          }
        } else if (
          !res.data.success &&
          (res.data.message == "Token indisponível." ||
            res.data.message == "O token não é válido.")
        ) {
          localStorage.setItem("Expirou", "1");
          authService.logout();
          window.location.reload(true);
        } else {
          //const data = res.data.data;
          setSalaMaisReservada(0);
        }
      })
      .catch((err) => {
        Swal.fire("Erro", "Falha no servidor", "error");
      });
  }
  function NumbPolos() {
    const GetNumbPolos = allowedOrigins + "polo/count";
    axios.get(GetNumbPolos, { headers: authHeader() }).then((res) => {
      if (res.data.success) {
        const data = res.data.data;
        setCountPolos(data);
      } else if (
        !res.data.success &&
        (res.data.message == "Token indisponível." ||
          res.data.message == "O token não é válido.")
      ) {
        localStorage.setItem("Expirou", "1");
        authService.logout();
        window.location.reload(true);
      }
    });
  }
  function NumbSalas() {
    const getNumSalas = allowedOrigins + "sala/count";
    axios
      .get(getNumSalas, { headers: authHeader() })
      .then((res) => {
        if (res.data.success) {
          const data = res.data.data;
          setNSalas(data);
        } else if (
          !res.data.success &&
          (res.data.message == "Token indisponível." ||
            res.data.message == "O token não é válido.")
        ) {
          localStorage.setItem("Expirou", "1");
          authService.logout();
          window.location.reload(true);
        } else {
          Swal.fire("Erro", "Falha ao obter o número de salas", "error");
        }
      })
      .catch(() => {
        Swal.fire("Erro", "Falha no servidor", "error");
      });
  }
  function NumColaboradores() {
    const NColaboradores = allowedOrigins + "funcionario/cont";
    axios.get(NColaboradores, { headers: authHeader() }).then((res) => {
      if (res.data.success) {
        const data = res.data.data;
        setNColaboradores(data);
      } else if (
        !res.data.success &&
        (res.data.message == "Token indisponível." ||
          res.data.message == "O token não é válido.")
      ) {
        localStorage.setItem("Expirou", "1");
        authService.logout();
        window.location.reload(true);
      }
    });
  }
  function ReservasAtivasToday() {
    const ReservasAtivasTdy = allowedOrigins + "reserva/countHoje";
    setReservasAtivasNoSistema("");
    axios.get(ReservasAtivasTdy, { headers: authHeader() }).then((res) => {
      if (res.data.success) {
        const data = res.data.data;
        setReservasAtivasNoSistema(data);
      } else if (
        !res.data.success &&
        (res.data.message == "Token indisponível." ||
          res.data.message == "O token não é válido.")
      ) {
        localStorage.setItem("Expirou", "1");
        authService.logout();
        window.location.reload(true);
      }
    });
    setReservaGetDay(true);
    const ReservasAtivas = allowedOrigins + "reserva/countAtivas";
    setReservasAtivaTotais("");
    axios.get(ReservasAtivas, { headers: authHeader() }).then((res) => {
      if (res.data.success) {
        const data = res.data.data;
        setReservasAtivaTotais(data);
        setTotalDeReservasAtivasDesdeSempre(data);
      } else if (
        !res.data.success &&
        (res.data.message == "Token indisponível." ||
          res.data.message == "O token não é válido.")
      ) {
        localStorage.setItem("Expirou", "1");
        authService.logout();
        window.location.reload(true);
      }
    });
  }
  function ReservasAtivasMes() {
    const ReservasAtivasTdy = allowedOrigins + "reserva/countMes";
    setReservasAtivasNoSistema("");
    axios.get(ReservasAtivasTdy, { headers: authHeader() }).then((res) => {
      if (res.data.success) {
        const data = res.data.data;
        setReservasAtivasNoSistema(data);
      } else if (
        !res.data.success &&
        (res.data.message == "Token indisponível." ||
          res.data.message == "O token não é válido.")
      ) {
        localStorage.setItem("Expirou", "1");
        authService.logout();
        window.location.reload(true);
      }
    });
    setReservaGetDay(false);
    const ReservasAtivas = allowedOrigins + "reserva/countAtivas";
    setReservasAtivaTotais("");
    axios.get(ReservasAtivas, { headers: authHeader() }).then((res) => {
      if (res.data.success) {
        const data = res.data.data;
        setReservasAtivaTotais(data);
      } else if (
        !res.data.success &&
        (res.data.message == "Token indisponível." ||
          res.data.message == "O token não é válido.")
      ) {
        localStorage.setItem("Expirou", "1");
        authService.logout();
        window.location.reload(true);
      }
    });
  }
  function GetReservasRange(e) {
    e.preventDefault();
    const RangeReservasTodas =
      allowedOrigins +
      "reserva/countInIntervalosTodas?dataInicio=" +
      dataInicioRange +
      "&dataFim=" +
      dataFimRange;
    const RangeReservasAtivas =
      allowedOrigins +
      "reserva/countInIntervalos?dataInicio=" +
      dataInicioRange +
      "&dataFim=" +
      dataFimRange;
    axios.get(RangeReservasTodas, { headers: authHeader() }).then((res) => {
      if (res.data.success) {
        const data = res.data.data;
        setReservasTotais(data);
      } else if (
        !res.data.success &&
        (res.data.message == "Token indisponível." ||
          res.data.message == "O token não é válido.")
      ) {
        localStorage.setItem("Expirou", "1");
        authService.logout();
        window.location.reload(true);
      }
    });
    axios.get(RangeReservasAtivas, { headers: authHeader() }).then((res) => {
      if (res.data.success) {
        const data = res.data.data;
        setReservasAtivas(data);
      } else if (
        !res.data.success &&
        (res.data.message == "Token indisponível." ||
          res.data.message == "O token não é válido.")
      ) {
        localStorage.setItem("Expirou", "1");
        authService.logout();
        window.location.reload(true);
      }
    });
  }
  function InativarReserva(id, estado) {
    const UpdateStateReservas = allowedOrigins + "reserva/updateStateweb/" + id;
    const state = !estado;
    //console.log(currentUser.id);
    const datapost = {
      funcionarioId: currentUser.id,
      ativa: state,
    };
    axios
      .put(UpdateStateReservas, datapost, { headers: authHeader() })
      .then((res) => {
        if (res.data.success) {
          Swal.fire({
            icon: "success",
            title: "Reserva cancelada com sucesso",
            showConfirmButton: false,
            timer: 1500,
          });
          ReservasAtuais();
        } else if (
          !res.data.success &&
          (res.data.message == "Token indisponível." ||
            res.data.message == "O token não é válido.")
        ) {
          localStorage.setItem("Expirou", "1");
          authService.logout();
          window.location.reload(true);
        } else {
          Swal.fire("Erro", "Falha ao inativar reserva", "error");
        }
      })
      .catch(() => {
        Swal.fire("Erro", "Falha no servidor", "error");
      });
  }
  function onInactivate(id, estado) {
    Swal.fire({
      title: "Tem a certeza?",
      text: "Esta ação não poderá ser revertida",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.value) {
        InativarReserva(id, estado);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelado", "A reserva não foi inativa", "error");
      }
    });
  }
  function ReservasAnteriores() {
    const ReservasPassadas = allowedOrigins + "reserva/listwebpassadas";
    axios
      .get(ReservasPassadas, { headers: authHeader() })
      .then((res) => {
        if (res.data.success) {
          const data = res.data.data;
          setReservasList(data);
          setDataServer(res.data.horaServer.substring(0, 10));
          setHoraServer(res.data.horaServer.substring(11, 19));
        } else if (
          !res.data.success &&
          (res.data.message == "Token indisponível." ||
            res.data.message == "O token não é válido.")
        ) {
          localStorage.setItem("Expirou", "1");
          authService.logout();
          window.location.reload(true);
        } else {
          Swal.fire({
            icon: "erro",
            title: "Falha ao carregar reservas",
            showConfirmButton: false,
            timer: 2000,
          });
        }
      })
      .catch(() => {
        Swal.fire("Erro", "Falha no servidor", "error");
      });
  }
  function ReservasAtuais() {
    const ReservasAtuais = allowedOrigins + "reserva/listwebfuturas";
    axios
      .get(ReservasAtuais, { headers: authHeader() })
      .then((res) => {
        //console.log(res);
        if (res.data.success) {
          const data = res.data.data;
          setReservasList(data);
          setDataServer(res.data.horaServer.substring(0, 10));
          setHoraServer(res.data.horaServer.substring(11, 19));
        } else if (
          !res.data.success &&
          (res.data.message == "Token indisponível." ||
            res.data.message == "O token não é válido.")
        ) {
          localStorage.setItem("Expirou", "1");
          authService.logout();
          window.location.reload(true);
        } else {
          Swal.fire({
            icon: "error",
            title: "Falha ao carregar reservas",
            showConfirmButton: false,
            timer: 1000,
          });
        }
      })
      .catch((err) => {
        //console.log(err);
        Swal.fire("Erro", "Falha no servidor", "error");
      });
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
  function ShowReservasPassadas() {
    ajuda ? setAjuda(!ajuda) : setAjuda(ajuda);
  }
  function ShowReservasAtuais() {
    ajuda ? setAjuda(ajuda) : setAjuda(!ajuda);
  }
  const Progress = ({ done, limit }) => {
    const [style, setStyle] = React.useState({});

    setTimeout(() => {
      const newStyle = {
        opacity: 1,
        width: `${limit}%`,
      };

      setStyle(newStyle);
    }, 200);

    return (
      <div className="progress">
        <div className="progress-done" style={style}>
          {done}
        </div>
      </div>
    );
  };

  function GetCurrentUser() {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    } else {
      setCurrentUser("");
    }
  }

  useEffect(() => {
    if (ajuda == true) {
      ReservasAtuais();
    } else {
      ReservasAnteriores();
    }
  }, [ajuda]);
  useEffect(() => {
    GetCurrentUser();
    ReservasAtivasToday();
    NumColaboradores();
    NumbPolos();
    getSalaMaisReservada();
    NumbSalas();
  }, []);
  return (
    <div className=" container-xxl mx-5">
      <h1 className="mb-4">Dashboard</h1>
      <div className="row ">
        <div className="col-xl-12 d-flex">
          <div className="w-100">
            <div className="row">
              <div className="col-xl-3 col-lg-6 col-md-6 col-12">
                <div
                  className="card"
                  style={{
                    height: "174px",
                    backgroundColor: "#354052",
                  }}
                >
                  <div className="card-body ">
                    <div className="row">
                      <div className="col p-0">
                        <h5 className="card-title text-white">
                          <strong>Colaboradores</strong>
                        </h5>
                      </div>

                      <div className="col-auto">
                        <div className="state">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="30"
                            height="30"
                            fill="currentColor"
                            className="bi bi-person text-white"
                            viewBox="0 0 16 16"
                          >
                            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="row  ">
                      <h1 className="mt-1 mb-3 text-white">{nColaboradores}</h1>
                    </div>
                    <div className="row mt-2 ">
                      <Link
                        to="ListarUtilizadores"
                        className="btn btn-sm btn-outline-light"
                      >
                        Mais informação
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-xl-3 col-lg-6 col-md-6 col-12">
                <div className="card" style={{ height: "174px" }}>
                  <div className="card-body">
                    <div className="row">
                      <div className="col mt-0">
                        <h5 className="card-title">
                          <strong>Reservas</strong>
                        </h5>
                      </div>

                      <div className="col-auto">
                        <div className="stat">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="30"
                            height="30"
                            fill="currentColor"
                            className="bi bi-calendar2-week"
                            viewBox="0 0 16 16"
                          >
                            <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM2 2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H2z" />
                            <path d="M2.5 4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V4zM11 7.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-5 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="row  ">
                      <h1 className="mt-1 mb-3">
                        {TotalDeReservasAtivasDesdeSempre}
                      </h1>
                    </div>
                    <div className="row mt-2 ">
                      <a
                        href="#reservas"
                        className="btn btn-sm btn-outline-dark"
                      >
                        Mais informação
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-6 col-md-6 col-12">
                <div
                  className="card"
                  style={{ height: "174px", backgroundColor: "#354052" }}
                >
                  <div className="card-body">
                    <div className="row">
                      <div className="col p-0">
                        <h5 className="card-title text-white">
                          <strong>Salas</strong>
                        </h5>
                      </div>

                      <div className="col-auto">
                        <div className="stat">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="30"
                            height="30"
                            fill="currentColor"
                            className="bi bi-door-open text-white"
                            viewBox="0 0 16 16"
                          >
                            <path d="M8.5 10c-.276 0-.5-.448-.5-1s.224-1 .5-1 .5.448.5 1-.224 1-.5 1z" />
                            <path d="M10.828.122A.5.5 0 0 1 11 .5V1h.5A1.5 1.5 0 0 1 13 2.5V15h1.5a.5.5 0 0 1 0 1h-13a.5.5 0 0 1 0-1H3V1.5a.5.5 0 0 1 .43-.495l7-1a.5.5 0 0 1 .398.117zM11.5 2H11v13h1V2.5a.5.5 0 0 0-.5-.5zM4 1.934V15h6V1.077l-6 .857z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="row  ">
                      <h1 className="mt-1 mb-3 text-white">{nSalas}</h1>
                    </div>
                    <div className="row mt-2 ">
                      <Link
                        to="ListarSalas"
                        className="btn btn-sm btn-outline-light"
                      >
                        Mais informação
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-xl-3 col-lg-6 col-md-6 col-12">
                <div className="card" style={{ height: "174px" }}>
                  <div className="card-body">
                    <div className="row ">
                      <div className="col p-0">
                        <h5 className="card-title">
                          <strong>Polos</strong>
                        </h5>
                      </div>

                      <div className="col-auto">
                        <div className="stat">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="30"
                            height="30"
                            fill="currentColor"
                            className="bi bi-house-door"
                            viewBox="0 0 16 16"
                          >
                            <path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146zM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4H2.5z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="row  ">
                      <h1 className="mt-1 mb-3">{CountPolos}</h1>
                    </div>
                    <div className="row mt-2 ">
                      <Link
                        to="ListarPolos"
                        className="btn btn-sm btn-outline-dark"
                      >
                        Mais informação
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr style={{ display: "none" }}></hr>
      <div className="row mt-3">
        <div className="col-xl-4 col-lg-6 col-md-6 col-12">
          <div className="card" style={{ minHeight: "288px" }}>
            <div className="card-body ">
              <div className="row ">
                <h5 className="font-weight-bold"># Reservas</h5>
              </div>
              <div className="row ">
                <div className="col-xl-3 col-sm-3 col-2">
                  <div className="row">
                    <button
                      title="Hoje"
                      className="btn btn-outline-dark"
                      onClick={() => ReservasAtivasToday()}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="19"
                        height="19"
                        fill="currentColor"
                        className="bi bi-calendar-check mb-1"
                        viewBox="0 0 16 16"
                      >
                        <path d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z" />
                        <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z" />
                      </svg>
                    </button>
                  </div>
                  <div className="row mt-2">
                    <button
                      title="Este Mês"
                      className="btn btn-outline-dark"
                      onClick={() => ReservasAtivasMes()}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="19"
                        height="19"
                        fill="currentColor"
                        className="bi bi-calendar3 mb-1"
                        viewBox="0 0 16 16"
                      >
                        <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857V3.857z" />
                        <path d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="col-8 col-sm-6 justify-content-center ">
                  <Doughnut
                    data={{
                      labels: ReservaGetDay
                        ? ["Hoje", "Totais"]
                        : ["Este mês", "Totais"],
                      datasets: [
                        {
                          data: ReservaGetDay
                            ? [
                              reservasAtivasNoSistema,
                              TotalDeReservasAtivasDesdeSempre,
                            ]
                            : [
                              reservasAtivasNoSistema,
                              TotalDeReservasAtivasDesdeSempre,
                            ],
                          backgroundColor: ["#354052", "lightgray"],
                        },
                      ],
                    }}
                    width={"170%"}
                    height={"170%"}
                    options={{ maintainAspectRatio: false }}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-12  mt-2 ">
                  <p className="text-center">
                    {ReservaGetDay
                      ? "Existem " +
                      reservasAtivasNoSistema +
                      " reservas para hoje"
                      : "Existem " +
                      reservasAtivasNoSistema +
                      " reservas para este mês"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-4 col-lg-6 col-md-6 col-12 ">
          <div className="card" style={{ minHeight: "288px" }}>
            <div className="card-body ">
              <div className="row ">
                <h5 className="font-weight-bold">Sala mais reservada </h5>
              </div>

              {salaMaisReservada > 0 ? (
                <div className="row d-flex justify-content-center">
                  <div className="col-12 col-sm-12 ">
                    <Doughnut
                      data={{
                        labels: ["Reservas da sala", "Total"],
                        datasets: [
                          {
                            data: [
                              salaMaisReservada,
                              TotalDeReservasAtivasDesdeSempre,
                            ],
                            backgroundColor: ["#354052", "lightgray"],
                          },
                        ],
                      }}
                      width={"170%"}
                      height={"170%"}
                      options={{ maintainAspectRatio: false }}
                    />
                  </div>
                  <div className="row mt-2">
                    <div className="col-12 ">
                      <p className="text-center">
                        {designacaoSalaMaisReservada} de{" "}
                        {poloDaSalaMaisReservada}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="row" style={{ minHeight: "200px" }}>
                  <div className="col-12 d-flex align-items-center justify-content-center">
                    <p>Não existem salas com mais de 0 reservas</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-xl-4 col-12">
          <div className="card" style={{ minHeight: "288px" }}>
            <div className="card-body ">
              <div className="row m-0">
                <h5 className="font-weight-bold">
                  Reservas por intervalo de datas
                </h5>
              </div>
              <form>
                <div className="row  align-items-center">
                  <div className="form-group col-xl-5 col-lg-4 col-md-8 col-sm-10 col-10  ">
                    <label htmlFor="DataInicio">Início</label>
                    <input
                      id="DataInicio"
                      type="date"
                      className="form-control "
                      required
                      style={{ borderBottom: "1px solid grey" }}
                      value={dataInicioRange}
                      onChange={(value) =>
                        setDataInicioRange(value.target.value)
                      }
                    />
                  </div>
                  <div className="form-group col-xl-5 col-lg-4 col-md-8 col-sm-10 col-10">
                    <label htmlFor="DataFim">Fim</label>
                    <input
                      id="DataFim"
                      type="date"
                      className="form-control "
                      required
                      style={{ borderBottom: "1px solid grey" }}
                      value={dataFimRange}
                      onChange={(value) => setDataFimRange(value.target.value)}
                    />
                  </div>
                  <button
                    className="btn btn-outline-dark btn-sm ml-1 mt-4"
                    onClick={(e) => GetReservasRange(e)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-search mb-1"
                      viewBox="0 0 16 16"
                    >
                      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                    </svg>
                  </button>
                </div>
              </form>
              <div className="row">
                <div className="col-6">
                  <p>Ativas</p>
                  <Progress
                    limit={(reservasAtivas / reservasTotais) * 100}
                    done={reservasAtivas}
                  />
                </div>
                <div className="col-6">
                  <p>Total</p>
                  <Progress
                    limit={reservasTotais == "" ? "0" : "100"}
                    done={reservasTotais}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row m-0">
        <div className="col-xl-12 p-0">
          <div className="row justify-content-center  mb-2 m-0">
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
          <div className="row justify-content-end  mb-2 m-0">
            <button
              className={
                ajuda
                  ? "btn btn-outline-dark rounded-pill btn-sm mr-1"
                  : "btn btn-dark rounded-pill btn-sm mr-1"
              }
              onClick={() => ShowReservasPassadas()}
            >
              RESERVAS ANTERIORES
            </button>

            <button
              className={
                !ajuda
                  ? "btn btn-outline-dark rounded-pill btn-sm ml-1"
                  : "btn btn-dark rounded-pill btn-sm ml-1"
              }
              onClick={() => ShowReservasAtuais()}
            >
              RESERVAS ATUAIS
            </button>
          </div>

          <div className="card" id="reservas">
            <div
              className="card-body table-responsive p-0"
              style={{ height: "387px" }}
            >
              <table className="table table-head-fixed text-nowrap">
                <thead>
                  <tr>
                    <th className="border-bottom align-middle">SALA</th>

                    <th className="border-bottom align-middle">REQUISITANTE</th>
                    <th className="border-bottom align-middle">
                      Nº REQUISITANTE
                    </th>
                    <th className="border-bottom align-middle">DATA</th>
                    <th className="border-bottom align-middle">HORA INÍCIO</th>
                    <th className="border-bottom align-middle">HORA FIM</th>
                    <th className="border-bottom align-middle">ESTADO</th>
                    <th className="border-bottom align-middle">POLO</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody id="myList">
                  {reservasList.map((data, index) => (
                    <tr key={index}>
                      <td className="border-bottom align-middle">
                        {data.sala.designacao}
                      </td>
                      <td className="border-bottom align-middle">
                        {data.funcionario.nome}
                      </td>
                      <td className="border-bottom align-middle">
                        {data.funcionario.id}
                      </td>
                      <td className="border-bottom align-middle">
                        {data.data}
                      </td>
                      <td className="border-bottom align-middle">
                        {data.horainicio.substring(0, 5)}
                      </td>
                      <td className="border-bottom align-middle">
                        {data.horafim.substring(0, 5)}
                      </td>
                      <td className="border-bottom align-middle">
                        {ajuda
                          ? data.data == dataServer
                            ? data.horafim > horaServer &&
                              data.horainicio <= horaServer
                              ? "A decorrer"
                              : "Programada"
                            : "Programada"
                          : data.ativa
                            ? "Terminada"
                            : "Cancelada"}
                      </td>
                      <td className="border-bottom align-middle">
                        {data.sala.polo.designacao}
                      </td>
                      <td className="border-bottom align-middle">
                        {ajuda && (
                          <button
                            title="Cancelar reserva"
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => onInactivate(data.id, data.ativa)}
                            disabled={!data.ativa}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-dash-circle mb-1 mt-1"
                              viewBox="0 0 16 16"
                            >
                              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                              <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z" />
                            </svg>
                          </button>
                        )}
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
