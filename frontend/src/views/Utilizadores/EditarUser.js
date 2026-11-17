import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import allowedOrigins from "../../config/AllowedOrigins";
import authService from "../auth.service";
import authHeader from "../../views/auth-header";
export default function SalasRegistar() {
  const [currentUser, setCurrentUser] = useState("");
  const [nome, setNome] = useState("");
  const [dataNascimento, setdataNascimento] = useState("");
  const inputRef = useRef(null);
  const [OldprofileImg, setOldProfileImg] = useState("");
  const [profileImg, setProfileImg] = useState(null);
  const [previewProfileImage, setpreviewProfileImage] = useState(null);
  const [defaultImg] = useState(allowedOrigins + "profileImg.svg");
  const [endereco, setEndereco] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [estado, setEstado] = useState();
  const [dataMax, setDataMax] = useState("");
  const [cargo, setCargo] = useState("");
  const [polo, setPolo] = useState([]);
  var arr = [];
  const [cargoList, setCargoList] = useState([]);
  const [poloList, setPoloList] = useState([]);
  const [listReservasUser, setListReservasUser] = useState([]);
  const navigate = useNavigate();
  const { userID } = useParams();

  function GerUserReservas() {
    const GetReservas =
      allowedOrigins + "reserva/listbyfuncionariodescweb/" + userID;
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

  function UpdateUserPolo() {
    if (nome == "") {
      Swal.fire(
        "Campo obrigatório",
        "Por favor preencha o campo do nome",
        "warning"
      );
    } else if (dataNascimento == "") {
      Swal.fire(
        "Campo obrigatório",
        "Por favor preencha o campo da data de nascimento",
        "warning"
      );
    } else if (phone == "") {
      Swal.fire(
        "Campo obrigatório",
        "Por favor preencha o campo do telemóvel",
        "warning"
      );
    } else if (email == "") {
      Swal.fire(
        "Campo obrigatório",
        "Por favor preencha o campo do email",
        "warning"
      );
    } else if (cargo == "") {
      Swal.fire(
        "Campo obrigatório",
        "Por favor preencha o campo do cargo",
        "warning"
      );
    } else if (polo.length == 0) {
      Swal.fire(
        "Error",
        "O utilizador tem de estar sempre associado a pelo menos um polo",
        "error"
      );
    } else {
      for (var i = 0; i < polo.length; i++) {
        const urlUSER_POLO =
          allowedOrigins + "associar/createIfNotExists/" + userID;
        const datapostUSER_POLO = {
          poloId: polo[i],
        };
        axios
          .post(urlUSER_POLO, datapostUSER_POLO, { headers: authHeader() })
          .then((res) => {
            if (
              !res.data.success &&
              (res.data.message == "Token indisponível." ||
                res.data.message == "O token não é válido.")
            ) {
              localStorage.setItem("Expirou", "1");
              authService.logout();
              window.location.reload(true);
            } else if (!res.data.success) {
              Swal.fire(
                "Erro",
                "Falha ao associar polo ao utilizador",
                "error"
              );
            }
          })
          .catch(() => {
            Swal.fire("Erro", "Falha no servidor", "error");
          });
      }
      for (var j = 0; j < arr.length; j++) {
        const urlUSER_POLO =
          allowedOrigins + "associar/deleteIfExists/" + userID;
        const datapostUSER_POLO = {
          poloId: arr[j],
        };
        axios
          .post(urlUSER_POLO, datapostUSER_POLO, { headers: authHeader() })
          .then((res) => {
            if (
              !res.data.success &&
              (res.data.message == "Token indisponível." ||
                res.data.message == "O token não é válido.")
            ) {
              localStorage.setItem("Expirou", "1");
              authService.logout();
              window.location.reload(true);
            } else if (!res.data.success) {
              Swal.fire(
                "Erro",
                "Falha ao associar polo ao utilizador",
                "error"
              );
            }
          })
          .catch(() => {
            Swal.fire("Erro", "Falha no servidor", "error");
          });
      }
    }
  }
  function UpdateUser() {
    if (nome == "") {
      Swal.fire(
        "Campo obrigatório",
        "Por favor preencha o campo do nome",
        "warning"
      );
    } else if (dataNascimento == "") {
      Swal.fire(
        "Campo obrigatório",
        "Por favor preencha o campo da data de nascimento",
        "warning"
      );
    } else if (phone == "") {
      Swal.fire(
        "Campo obrigatório",
        "Por favor preencha o campo do telemóvel",
        "warning"
      );
    } else if (email == "") {
      Swal.fire(
        "Campo obrigatório",
        "Por favor preencha o campo do email",
        "warning"
      );
    } else if (cargo == "") {
      Swal.fire(
        "Campo obrigatório",
        "Por favor preencha o campo do cargo",
        "warning"
      );
    } else if (polo.length == 0) {
      Swal.fire(
        "Campo obrigatório",
        "Por favor preencha o campo do polo",
        "warning"
      );
    } else {
      if (profileImg != null) {
        const formData = new FormData();
        formData.append("file", profileImg);

        const uploadURL = allowedOrigins + "upload";

        axios.post(uploadURL, formData).then((res) => {
          const urlUSER = allowedOrigins + "funcionario/updateweb/" + userID;
          const datapostUSER = {
            nome: nome,
            nascimento: dataNascimento,
            email: email,
            telemovel: phone,
            endereco: endereco,
            acessoId: cargo,
            inativo: estado,
            fotografia: res.data.filename,
          };
          axios
            .put(urlUSER, datapostUSER, { headers: authHeader() })
            .then((res) => {
              if (res.data.success) {
                UpdateUserPolo();
                if (OldprofileImg !== "") {
                  const unlinkImg = allowedOrigins + "unlink/" + OldprofileImg;
                  axios.post(unlinkImg);
                }
                Swal.fire("Sucesso", "O utilizador foi atualizado!", "success");
                if (currentUser.id == userID) {
                  localStorage.setItem("AdminMudou", "1")
                  navigate("/Login");
                } else {
                  navigate("/ListarUtilizadores");
                }
              } else if (
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
                  "Error",
                  "Falha ao editar o utilizador, o email que introduziu já existe na base de dados",
                  "error"
                );
              } else if (
                "Validation isNumeric on telemovel failed" ==
                res.data.data.errors[0].message
              ) {
                Swal.fire(
                  "Error",
                  "Falha ao editar o utilizador, o número de telemóvel que introduziu não é válido",
                  "error"
                );
              } else {
                Swal.fire("Erro", "Falha ao editar o utilizador", "error");
              }
            })
            .catch(() => {
              Swal.fire("Erro", "Falha no servidor", "error");
            });
        });
      } else {
        const urlUSER = allowedOrigins + "funcionario/updateweb/" + userID;
        const datapostUSER = {
          nome: nome,
          nascimento: dataNascimento,
          email: email,
          telemovel: phone,
          endereco: endereco,
          acessoId: cargo,
          inativo: estado,
        };
        axios
          .put(urlUSER, datapostUSER, { headers: authHeader() })
          .then((res) => {
            if (res.data.success) {
              const data = res.data.data;
              UpdateUserPolo(data.id);
              Swal.fire("Sucesso", "O utilizador foi atualizado!", "success");
              navigate("/ListarUtilizadores");
            } else if (
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
                "Falha ao editar o utilizador, o email que introduziu já existe na base de dados",
                "error"
              );
            } else if (
              "Validation isNumeric on telemovel failed" ==
              res.data.data.errors[0].message
            ) {
              Swal.fire(
                "Error",
                "Falha ao editar o utilizador, o número de telemóvel que introduziu não é válido",
                "error"
              );
            } else {
              Swal.fire("Error", "Falha ao editar o utilizador", "error");
            }
          })
          .catch(() => {
            Swal.fire("Erro", "Falha no servidor", "error");
          });
      }
    }
  }
  function ChangeState() {
    setEstado(!estado);
    const UpdateState = allowedOrigins + "funcionario/updateState/" + userID;
    axios
      .put(UpdateState, { inativo: !estado }, { headers: authHeader() })
      .then((res) => {
        if (res.data.success) {
          if (res.data.data > 0 && !estado) {
            Swal.fire({
              icon: "success",
              title: "Utilizador inativado com sucesso",
              showConfirmButton: false,
              timer: 1500,
            });
          } else if (res.data.data > 0 && estado) {
            Swal.fire({
              icon: "success",
              title: "Utilizador ativado com sucesso",
              showConfirmButton: false,
              timer: 1500,
            });
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
          Swal.fire("Erro", "Falha ao alterar o estado do utilizador", "error");
        }
      })
      .catch(() => {
        Swal.fire("Erro", "Falha no servidor", "error");
      });
  }
  function CallChangeState() {
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
          ChangeState();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire({
            icon: "error",
            title: "O utilizador não foi inativado",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      });
    } else {
      ChangeState();
    }
  }
  function userDetails() {
    const urlUserDetail = allowedOrigins + "funcionario/getweb/" + userID;
    axios
      .get(urlUserDetail, { headers: authHeader() })
      .then((res) => {
        if (res.data.success) {
          const data = res.data.data;

          setEstado(data.inativo);
          setNome(data.nome);
          setdataNascimento(data.nascimento);
          if (data.fotografia != null || data.fotografia !== "") {
            setOldProfileImg(data.fotografia);
            setpreviewProfileImage(allowedOrigins + data.fotografia);
          }

          setEndereco(data.endereco);
          setPhone(data.telemovel);
          setEmail(data.email);

          setCargo(data.acessoId);
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
            "Falha ao carregar informações do utilizador",
            "error"
          );
        }
      })
      .catch(() => {
        Swal.fire("Erro", "Falha no servidor", "error");
      });
  }
  function PolosUser() {
    const urlUserPolo =
      allowedOrigins + "associar/listbyfuncionarioweb/" + userID;
    axios
      .get(urlUserPolo, { headers: authHeader() })
      .then((res) => {
        if (res.data.success) {
          const data = res.data.data;
          const array = [];
          for (var i = 0; i < data.length; i++) {
            array.push(data[i].poloId);
          }
          setPolo(array);
          arr = []
        } else if (
          !res.data.success &&
          (res.data.message == "Token indisponível." ||
            res.data.message == "O token não é válido.")
        ) {
          localStorage.setItem("Expirou", "1");
          authService.logout();
          window.location.reload(true);
        } else {
          Swal.fire("Erro", "Falha ao associar o utilizador ao polo", "error");
        }
      })
      .catch(() => {
        Swal.fire("Erro", "Falha no servidor", "error");
      });
  }
  function PoloList() {
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
  function CargosList() {
    const urlCargo = allowedOrigins + "acesso/listweb";
    axios
      .get(urlCargo, { headers: authHeader() })
      .then((res) => {
        if (res.data.success) {
          const data = res.data.data;
          setCargoList(data);
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
            "Falha ao carregar informações dos cargos",
            "error"
          );
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
    setDataMax(today);
  }
  function GetCurrentUsesr() {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }
  useEffect(() => {
    userDetails();
    PolosUser();
    PoloList();
    CargosList();
    Dates();
    GetCurrentUsesr();
  }, [userID]);

  function HandleChange(e, id) {
    if (e.target.checked) {
      setPolo([...polo, id]);
    } else {
      setPolo(
        polo.filter((value) => {
          return value != id;
        })
      );
    }
  }
  useEffect(() => {
    let checkBoxes = document.getElementsByName("checkbox");
    for (let i = 0; i < checkBoxes.length; i++) {
      checkBoxes[i].checked = false;
    }

    for (var i = 0; i < checkBoxes.length; i++) {
      for (var j = 0; j < polo.length; j++) {
        if (polo[j] == checkBoxes[i].value) {
          checkBoxes[i].checked = true;
        }
      }
    }
    let Unchecked_checkBoxes = document.getElementsByName("checkbox");
    for (var k = 0; k < Unchecked_checkBoxes.length; k++) {
      if (!Unchecked_checkBoxes[k].checked) {
        arr.push(Unchecked_checkBoxes[k].value);
      }
    }
  }, [polo, arr]);

  function handleSubmit(e) {
    e.preventDefault();
  }

  const handleClick = (e) => {
    inputRef.current.click();
    e.preventDefault();
  };
  const handleFileChange = (event) => {
    const fileObject = event.target.files && event.target.files[0];
    if (!fileObject) {
      return;
    }
    setpreviewProfileImage(URL.createObjectURL(event.target.files[0]));
    setProfileImg(event.target.files[0]);
  };

  return (
    <div className="container-xxl mx-5">
      <h1 className="mb-4">Editar Utilizador</h1>

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
              <h4 className="modal-title" id="ListaReservas">
                Lista de reservas do utilizador
              </h4>
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
                <h5 className="text-center">O utilizador que escolheu ainda não fez qualquer reserva</h5>
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

      <form onSubmit={(e) => handleSubmit(e)}>
        <div className="row m-0 mb-3 ">
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
          <div className="col-xl-3 col-md-6 col-sm-11 col-11">
            <p className="mb-0" style={{ color: "#9BA6B8", fontSize: "15px" }}>
              Campos obrigatórios
            </p>
          </div>
        </div>
        <div className="row m-0 mb-3">
          <div className="form-group col-xl-8 col-md-5 col-sm-7 col-9 p-0 mb-3">
            <div className="row m-0">
              <div className="col-12 d-flex p-0">
                <div
                  className="img-holder"
                  style={{ width: "200.631", height: "125.631" }}
                >
                  {previewProfileImage ? (
                    <img
                      src={previewProfileImage}
                      id="previewProfileImg"
                      alt="profileImg"
                      width="130.631"
                      height="125.631"
                      className="border"
                      style={{ borderRadius: "50%" }}
                      onError={(e) => {
                        e.target.src = `${allowedOrigins}profileImg.svg`;
                        console.clear()
                      }}
                    />
                  ) : (
                    <img
                      src={defaultImg}
                      id="profileImg"
                      alt="defaultImg"
                      width="130.631"
                      height="125.631"
                      className="border"
                      style={{ borderRadius: "50%" }}
                    />
                  )}
                </div>

                <div className="col-xl-2 col-lg-5 p-0 ml-3">
                  <div className="row m-0">
                    <label htmlFor="Fotografia">Fotografia </label>
                  </div>
                  <div className="row m-0">
                    <input
                      style={{ display: "none" }}
                      ref={inputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />

                    <button
                      className="p-0"
                      onClick={(e) => handleClick(e)}
                      style={{ border: "0px" }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="38.646"
                        height="36.293"
                        viewBox="0 0 38.646 36.293"
                      >
                        <g
                          id="Ellipse_346"
                          data-name="Ellipse 346"
                          transform="translate(0 0.347)"
                          fill="#fff"
                          stroke="#707070"
                          strokeWidth="1"
                        >
                          <ellipse
                            cx="19.201"
                            cy="17.918"
                            rx="19.201"
                            ry="17.918"
                            stroke="none"
                          />
                          <ellipse
                            cx="19.201"
                            cy="17.918"
                            rx="18.701"
                            ry="17.418"
                            fill="none"
                          />
                        </g>
                        <g
                          id="Component_337_1"
                          data-name="Component 337 – 1"
                          transform="translate(0.324)"
                        >
                          <path
                            id="Path_919"
                            data-name="Path 919"
                            d="M23.077,11.073H19.245v7.259H11.58v3.629h7.664V29.22h3.832V21.961h7.664V18.332H23.077ZM21.161,2C10.584,2,2,10.13,2,20.147s8.584,18.147,19.161,18.147,19.161-8.13,19.161-18.147S31.737,2,21.161,2Zm0,32.664c-8.45,0-15.328-6.515-15.328-14.517S12.711,5.629,21.161,5.629s15.328,6.515,15.328,14.517S29.61,34.664,21.161,34.664Z"
                            transform="translate(-2 -2)"
                            fill="#39639c"
                          />
                        </g>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="form-row  ">
          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
            <div className="form-group col-xl-8 col-lg-10 col-md-10 col-sm-11 col-10 p-0">
              <label htmlFor="Nomme">
                Nome
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
                id="Nomme"
                type="text"
                className="form-control "
                placeholder="Escreva o nome"
                style={{ borderBottom: "1px solid grey" }}
                value={nome}
                onChange={(value) => setNome(value.target.value)}
              />
            </div>

            <div className="form-group col-xl-8 col-lg-10 col-md-10 col-sm-11 col-10 p-0">
              <label htmlFor="NascimentoInput">
                Data de nascimento
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
                max={dataMax}
                id="NascimentoInput"
                type="date"
                placeholder="Data de nascimento"
                className="form-control text-left"
                value={dataNascimento}
                onChange={(value) => setdataNascimento(value.target.value)}
                style={{ borderBottom: "1px solid grey" }}
              />
            </div>

            <div className="form-group col-xl-8 col-lg-10 col-md-10 col-sm-11 col-10 p-0">
              <label htmlFor="EnderecoInput">Endereço</label>
              <input
                id="EnderecoInput"
                type="text"
                placeholder="Endereço"
                className="form-control"
                value={endereco}
                onChange={(value) => setEndereco(value.target.value)}
                style={{ borderBottom: "1px solid grey" }}
              />
            </div>

            <div className="form-group col-xl-8 col-lg-10 col-md-10 col-sm-11 col-10 p-0">
              <label htmlFor="TelemovelInput">
                Telemóvel
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
                id="TelemovelInput"
                type="number"
                placeholder="Número de telemóvel"
                className="form-control"
                value={phone}
                onChange={(value) => setPhone(value.target.value)}
                style={{ borderBottom: "1px solid grey" }}
              />
            </div>

            <div className="form-group col-xl-8 col-lg-10 col-md-10 col-sm-11 col-10 p-0">
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
                type="text"
                className="form-control "
                placeholder="FuncName@email.com"
                value={email}
                onChange={(value) => setEmail(value.target.value)}
                style={{ borderBottom: "1px solid grey" }}
              />
            </div>
          </div>

          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
            <div className="form-group col-xl-8 col-lg-10 col-md-10 col-sm-11 col-10 p-0">
              <label htmlFor="Cargo">
                Cargo
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
                id="Cargo"
                className="form-control"
                style={{ borderBottom: "1px solid grey" }}
                value={cargo}
                onChange={(value) => setCargo(value.target.value)}
              >
                <option disabled value="">
                  Cargo
                </option>
                {cargoList.map((data, index) => (
                  <option key={index} value={data.id}>
                    {data.designacao}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group col-xl-8 col-lg-10 col-md-10 col-sm-11 col-10 p-0">
              <label htmlFor="SelectPolo">
                Polo
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

              {poloList.map((data, index) => {
                return (
                  <div
                    key={index}
                    className="form-check col-xl-6 d-flex align-items-center m-0  p-0"
                  >
                    <input
                      name="checkbox"
                      className=" mr-2"
                      type="checkbox"
                      id={`Polo com o id: ${data.id}`}
                      value={data.id}
                      onChange={(e) => HandleChange(e, data.id)}
                    />
                    <label className="mt-1">{data.designacao}</label>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="row m-0 mb-3">
          <div className="col-xl-10 col-lg-10 col-md-10 col-sm-11 col-10 d-flex justify-content-end p-0  m-0">
            <button
              title="Confrimar"
              className="btn btn-outline-primary"
              onClick={() => UpdateUser()}
              type="submit"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="bi bi-check-circle mb-1 mt-1"
                viewBox="0 0 16 16"
              >
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z" />
              </svg>
            </button>
            <button
              className="btn btn-outline-info ml-2"
              title="Consultar Reservas"
              onClick={() => GerUserReservas()}
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
            {estado ? (
              <button
                title="Ativar"
                id="btnState"
                className="btn btn-outline-success mx-2"
                onClick={() => CallChangeState()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="bi bi-person-check"
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
                disabled={currentUser.id == userID}
                title="Inativar"
                id="btnState"
                className="btn btn-outline-danger mx-2"
                onClick={() => CallChangeState()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="bi bi-person-x"
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
            <Link
              className="btn btn-outline-secondary"
              to="/ListarUtilizadores"
              title="Cancelar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
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
      </form>
    </div>
  );
}
