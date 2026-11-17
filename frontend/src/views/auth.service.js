import axios from "axios";
import "sweetalert2/src/sweetalert2.scss";
import allowedOrigins from "../config/AllowedOrigins";
class AuthService {
  login(email, password) {
    const LoginUrl = allowedOrigins + "funcionario/loginweb";
    const datapost = {
      email: email,
      pass: password,
    };
    return axios.post(LoginUrl, datapost).then(
      (res) => {
        if (res.data.token) {
          if (!res.data.ultimoacesso) {
            //console.log('não tenho ultimoacesso')
            localStorage.setItem("userId", res.data.id);
            localStorage.setItem("email", email);
            this.setPwdReset()
          } else {
            //console.log('tenho ultimoacesso')
            localStorage.setItem("user", JSON.stringify(res.data));
          }
          //console.log(res.data.ultimoacesso);
        }
        return res.data;
      },
      (reason) => {
        throw new Error("Utilizador inválido");
      }
    );
  }
  logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("reset");
  }
  setPwdReset() {
    localStorage.setItem("reset", "1");
  }
  getPwdReset() {
    return localStorage.getItem("reset");
  }
  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }
}
export default new AuthService();
