import React, { useEffect, useState } from "react";
import axios from "axios";

import { useNavigate, Link } from "react-router-dom";

import Swal from "sweetalert2/dist/sweetalert2.js";
import authHeader from "../../views/auth-header";
import authService from "../auth.service";

import "sweetalert2/src/sweetalert2.scss";
import allowedOrigins from "../../config/AllowedOrigins";
export default function SalasRegistar() {
  const [nomeSala, setNomeSala] = useState("");
  const [polo, setPolo] = useState(0);
  const [descricao, setDescricao] = useState("");
  const [capacidade, setCapacidade] = useState("");
  const [taxaAloc, setTaxaAloc] = useState("");
  const [TempLimpeza, setTempLimpeza] = useState(0);
  const [poloList, setPoloList] = useState([]);
  const navigate = useNavigate();
  function CreateSala() {
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
      const url = allowedOrigins + "sala/create";
      const datapost = {
        designacao: nomeSala,
        poloId: polo,
        descricao: descricao,
        capacidade: capacidade,
        alocacao: taxaAloc,
        tempolimpeza: TempLimpeza,
      };
      axios
        .post(url, datapost, { headers: authHeader() })
        .then((res) => {
          if (res.data.success) {
            Swal.fire({
              icon: "success",
              title: "A sala foi registada com sucesso!",
              showConfirmButton: false,
              timer: 1500,
            });
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
            Swal.fire("Erro", "Falha ao registar a sala", "error");
          }
        })
        .catch(() => {
          Swal.fire("Erro", "Falha no servidor", "error");
        });
    }
  }
  function LoadPolos() {
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
          Swal.fire("Erro", "Falha ao carregar informações dos polos", "error");
        }
      })
      .catch(() => {
        Swal.fire("Erro", "Falha no servidor", "error");
      });
  }
  useEffect(() => {
    LoadPolos();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
  }

  return (
    <div className="container-xxl mx-5">
      <h1 className="mb-4">Registar Sala</h1>
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
                style={{ borderBottom: "1px solid grey" }}
                value={nomeSala}
                onChange={(value) => setNomeSala(value.target.value)}
              />
            </div>

            <div className="form-group col-xl-9 col-md-9 col-sm-12 col-10">
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
              <select
                id="SelectPolo"
                className="form-control"
                style={{ borderBottom: "1px solid grey" }}
                value={polo}
                onChange={(value) => setPolo(value.target.value)}
              >
                <option default value="">
                  Polo
                </option>
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
                  min="0"
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
                  pattern="[0-100]{1}"
                  min="0"
                  step="5"
                  required
                  max="100"
                  maxLength={3}
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
                step="5"
                className="form-control "
                placeholder="0"
                style={{ borderBottom: "1px solid grey" }}
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

            <div className="row m-0 mb-3">
              <div className="col-xl-9 col-md-9 col-sm-12 col-10 d-flex justify-content-end ">
                <button
                  title="Confirmar"
                  className="btn btn-outline-primary mr-1"
                  onClick={() => CreateSala()}
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
