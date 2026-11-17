import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import allowedOrigins from "../../config/AllowedOrigins";
import authService from "../../views/auth.service";
import authHeader from "../../views/auth-header";
export default function SalasRegistar() {
  const [currentUser, setCurrentUser] = useState("");
  const [nome, setNome] = useState("");
  const [dataNascimento, setdataNascimento] = useState("");
  const inputRef = useRef(null);
  const [profileImg, setProfileImg] = useState(null);
  const [previewProfileImage, setpreviewProfileImage] = useState("");
  const [defaultImg] = useState(allowedOrigins + "profileImg.svg");
  const [endereco, setEndereco] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cargo, setCargo] = useState("");
  const [dataMax, setDataMax] = useState("");
  const [polo, setPolo] = useState([]);
  const [cargoList, setCargoList] = useState([]);
  const [poloList, setPoloList] = useState([]);
  const [checkedState, setCheckedState] = useState(
    new Array(poloList.length).fill(false)
  );
  const navigate = useNavigate();

  function AssociarUserPolo(id) {
    for (var i = 0; i < polo.length; i++) {
      const urlUSER_POLO = allowedOrigins + "associar/create";
      const datapostUSER_POLO = {
        poloId: polo[i],
        funcionarioId: id,
      };
      axios
        .post(urlUSER_POLO, datapostUSER_POLO, { headers: authHeader() })
        .then((res) => {
          if (res.data.success) {
            Swal.fire(
              "Registado!",
              "O utilizador foi registado com sucesso!",
              "success"
            );
            navigate("/ListarUtilizadores");
          } else if (
            !res.data.success &&
            (res.data.message == "Token indisponível." ||
              res.data.message == "O token não é válido.")
          ) {
            localStorage.setItem("Expirou", "1");
            authService.logout();
            window.location.reload(true);
          } else {
            Swal.fire("Erro", "Falha ao associar polo ao utilizador", "error");
          }
        })
        .catch(() => {
          Swal.fire("Erro", "Falha no servidor", "error");
        });
    }
  }
  function CreateUser() {
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
    } else if (password == "") {
      Swal.fire(
        "Campo obrigatório",
        "Por favor preencha o campo do palavra passe",
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
          if (
            !res.data.success &&
            (res.data.message == "Token indisponível." ||
              res.data.message == "O token não é válido.")
          ) {
            localStorage.setItem("Expirou", "1");
            authService.logout();
            window.location.reload(true);
          } else {
            const urlUSER = allowedOrigins + "funcionario/create";
            const datapostUSER = {
              nome: nome,
              nascimento: dataNascimento,
              email: email,
              telemovel: phone,
              endereco: endereco,
              pass: password,
              acessoId: cargo,
              fotografia: res.data.filename,
            };
            axios
              .post(urlUSER, datapostUSER, { headers: authHeader() })
              .then((res) => {
                if (res.data.success) {
                  const data = res.data.data;
                  AssociarUserPolo(data.id);
                } else if (
                  !res.data.success &&
                  (res.data.message == "Token indisponível." ||
                    res.data.message == "O token não é válido.")
                ) {
                  localStorage.setItem("Expirou", "1");
                  authService.logout();
                  window.location.reload(true);
                } else {
                  Swal.fire("Erro", "Falha ao registar o utilizador", "error");
                }
              })
              .catch(() => {
                Swal.fire("Erro", "Falha no servidor", "error");
              });
          }
        });
      } else {
        const urlUSER = allowedOrigins + "funcionario/create";
        const datapostUSER = {
          nome: nome,
          nascimento: dataNascimento,
          email: email,
          telemovel: phone,
          endereco: endereco,
          pass: password,
          acessoId: cargo,
        };
        axios
          .post(urlUSER, datapostUSER, { headers: authHeader() })
          .then((res) => {
            if (res.data.success) {
              const data = res.data.data;
              AssociarUserPolo(data.id);
            } else if (
              !res.data.success &&
              (res.data.message == "Token indisponível." ||
                res.data.message == "O token não é válido.")
            ) {
              localStorage.setItem("Expirou", "1");
              authService.logout();
              window.location.reload(true);
            } else {
              if ("email must be unique" == res.data.data.errors[0].message) {
                Swal.fire(
                  "Erro",
                  "Falha ao registar o utilizador, o email que introduziu já existe na base de dados",
                  "error"
                );
              } else if (
                "Validation isNumeric on telemovel failed" ==
                res.data.data.errors[0].message
              ) {
                Swal.fire(
                  "Erro",
                  "Falha ao registar o utilizador, o número de telemóvel que introduziu não é válido",
                  "error"
                );
              } else {
                Swal.fire("Erro", "Falha ao registar o utilizador", "error");
              }
            }
          })
          .catch(() => {
            Swal.fire("Erro", "Falha no servidor", "error");
          });
      }
    }
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
  function LoadCargos() {
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
    setDataMax(today);
  }
  function GetCurrentUser() {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }

  useEffect(() => {
    GetCurrentUser();
    LoadPolos();
    LoadCargos();
    Dates();
  }, []);
  function handleSubmit(e) {
    e.preventDefault();
  }
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
      <h1 className="mb-4">Registar Utilizador</h1>

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
                      alt="profileImg"
                      width="130.631"
                      height="125.631"
                      className="border"
                      style={{ borderRadius: "50%" }}
                    />
                  ) : (
                    <img
                      src={defaultImg}
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
              <label htmlFor="password">
                Palavra passe
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
                id="password"
                type="password"
                className="form-control "
                placeholder="Password"
                value={password}
                onChange={(value) => setPassword(value.target.value)}
                style={{ borderBottom: "1px solid grey" }}
              />
            </div>

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
                      className=" mr-2"
                      type="checkbox"
                      id={`Polo com o id: ${data.id}`}
                      value={data.id}
                      checked={checkedState[index]}
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
              title="Confirmar"
              className="btn btn-outline-primary mr-1"
              onClick={() => CreateUser()}
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
            <Link
              className="btn btn-outline-secondary ml-1"
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
