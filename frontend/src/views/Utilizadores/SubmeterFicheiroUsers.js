import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { saveAs } from "file-saver";
import axios from "axios";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import allowedOrigins from "../../config/AllowedOrigins";
import authHeader from "../../views/auth-header";
import authService from "../../views/auth.service";
export default function UtilizadoresSubmeterFicheiro() {
  const [fileUpload, setFileUpload] = useState(null);
  const [files, setFiles] = useState([]);

  const saveFile = () => {
    saveAs(
      allowedOrigins + "RegistoUtilizadores.xlsx",
      "Template_Registo_Utilizadores.xlsx"
    );
  };

  function UploadFile() {
    const formData = new FormData();
    formData.append("file", fileUpload);
    const uploadFile = allowedOrigins + "upload";
    axios
      .post(uploadFile, formData)
      .then((res) => {
        const fileName = res.data.filename;
        const BulkInsert = allowedOrigins + "readExcel/" + fileName;
        axios.post(BulkInsert, {}, { headers: authHeader() }).then((res) => {
          //console.log(res)
          if (res.data.success) {
            if (res.data.erros == res.data.linhasLidas) {
              Swal.fire(
                "Bulk Insert",
                "Falha na criação dos utilizadores, dados inválidos no ficheiro",
                "error"
              );
            } else if (res.data.erros >= 1) {
              Swal.fire(
                "Bulk Insert",
                "Utilizadores criados com sucesso. No entanto, houve " +
                res.data.erros +
                " utilizadores que não foram criados por causa de erros",
                "warning"
              );
            } else {
              Swal.fire({
                icon: "success",
                title: "Utilizadores criados com sucesso",
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
            Swal.fire("Erro", "Falha ao criar utilizadores", "error");
          }
          const DeleteFile = allowedOrigins + "unlink/" + fileName;
          axios.post(DeleteFile);
        });
      })
      .catch(() => {
        Swal.fire("Erro", "Falha ao carregar ficheiro no servidor", "error");
      });
  }

  const img = {
    width: "50px",
    height: "50px",
  };

  function Previews() {
    const { getRootProps, getInputProps } = useDropzone({
      accept: { "file/xlsx": [".xlsx"] },
      onDrop: (acceptedFiles) => {
        setFiles(
          acceptedFiles.map((file) =>
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            })
          )
        );
      },
    });

    useEffect(() => {
      setFileUpload(files[0]);
    }, [files, fileUpload]);

    const thumbs = files.map((file) => (
      <div key={file.name}>
        <div>
          <img
            className="mr-3"
            src={
              "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Microsoft_Office_Excel_%282019–present%29.svg/1101px-Microsoft_Office_Excel_%282019–present%29.svg.png"
            }
            style={img}
            onLoad={() => {
              URL.revokeObjectURL(file.preview);
            }}
          />
          {file.name}
        </div>
      </div>
    ));

    return (
      <div className="container-xxl  mx-5">
        <div className="row m-0 mb-5">
          <div className="col-12 p-0">
            <h1>Criação de Utilizadores em Bulk</h1>
          </div>
        </div>

        <div className="row m-0">
          <div className="col-12 p-0 m-0 d-flex justify-content-center">
            <div
              {...getRootProps({
                className: "col-xl-5 col-lg-7 col-md-8 col-sm-10 col-12",
                style: {
                  height: "280px",
                  border: "1px dashed grey",
                  borderRadius: "8px",
                },
              })}
            >
              <input {...getInputProps()} type="file" />
              <div className="d-flex justify-content-center mt-5">
                {!files.length && (
                  <img
                    src={allowedOrigins + "UploadFileImg.png"}
                    width="250px"
                  />
                )}
              </div>
              <div className="row m-0  mt-5">
                <div className="col-12 p-0 m-0 ">
                  <div className="col-12 d-flex justify-content-center">
                    {thumbs}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row m-0 mt-3 ">
          <div className="col-12 p-0 m-0 d-flex justify-content-center ">
            <div className="col-xl-2 col-sm-5 col-md-4 col-lg-3  p-0">
              <button
                className="btn btn-outline-info"
                title="Transferir Template"
                onClick={() => {
                  saveFile();
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-cloud-download"
                  viewBox="0 0 16 16"
                >
                  <path d="M4.406 1.342A5.53 5.53 0 0 1 8 0c2.69 0 4.923 2 5.166 4.579C14.758 4.804 16 6.137 16 7.773 16 9.569 14.502 11 12.687 11H10a.5.5 0 0 1 0-1h2.688C13.979 10 15 8.988 15 7.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 2.825 10.328 1 8 1a4.53 4.53 0 0 0-2.941 1.1c-.757.652-1.153 1.438-1.153 2.055v.448l-.445.049C2.064 4.805 1 5.952 1 7.318 1 8.785 2.23 10 3.781 10H6a.5.5 0 0 1 0 1H3.781C1.708 11 0 9.366 0 7.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383z" />
                  <path d="M7.646 15.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 14.293V5.5a.5.5 0 0 0-1 0v8.793l-2.146-2.147a.5.5 0 0 0-.708.708l3 3z" />
                </svg>
              </button>
            </div>
            <div className="col-xl-3 col-sm-5 col-md-4 col-lg-4 d-flex justify-content-end p-0 ">
              {files.length > 0 && (
                <div>
                  <button
                    className="btn btn-outline-primary mr-1"
                    title="Fazer Upload"
                    onClick={() => UploadFile()}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-cloud-upload"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.406 1.342A5.53 5.53 0 0 1 8 0c2.69 0 4.923 2 5.166 4.579C14.758 4.804 16 6.137 16 7.773 16 9.569 14.502 11 12.687 11H10a.5.5 0 0 1 0-1h2.688C13.979 10 15 8.988 15 7.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 2.825 10.328 1 8 1a4.53 4.53 0 0 0-2.941 1.1c-.757.652-1.153 1.438-1.153 2.055v.448l-.445.049C2.064 4.805 1 5.952 1 7.318 1 8.785 2.23 10 3.781 10H6a.5.5 0 0 1 0 1H3.781C1.708 11 0 9.366 0 7.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383z"
                      />
                      <path
                        fillRule="evenodd"
                        d="M7.646 4.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V14.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3z"
                      />
                    </svg>
                  </button>
                  <button
                    className="btn btn-outline-danger ml-1"
                    title="Eliminar"
                    onClick={(e) => {
                      setFiles([]);
                      e.preventDefault();
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-trash3 mb-1 mt-1 "
                      viewBox="0 0 16 16"
                    >
                      <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <Previews />;
}
