// import "./scrollbar.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AuthService from "./views/auth.service";
import Login from "./views/Login/login";
import SetupPassword from "./views/Login/SetupPassword";
import DashReservas from "./views/Dashboard/DashBoardReservas";
import LayoutDefault from "./views/layout";
import PoloADD from "./views/Polo/RegistarPolo";
import PoloList from "./views/Polo/ListarPolos";
import EditPolo from "./views/Polo/EditarPolo";
import ListSala from "./views/Salas/ListarSalas";
import EditSala from "./views/Salas/EditarSala";
import RegistarSala from "./views/Salas/ResgistarSala";
import Protected from "./views/protected";
import UserADD from "./views/Utilizadores/AdicionarUser";
import UserList from "./views/Utilizadores/ListarUtilizadores";
import UserEdit from "./views/Utilizadores/EditarUser";
import UserSubmitFile from "./views/Utilizadores/SubmeterFicheiroUsers";
import { useEffect, useState } from "react";



export default function App() {
  const [currentUser, setCurrentUser] = useState("");
  const [value, toggle] = useState(false);

  const refetch = () => {
    toggle((prev) => !prev);
  };

  function GetCurrentUser() {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    } else {
      setCurrentUser("");
    }
  }

  useEffect(() => {
    GetCurrentUser();
  }, [setCurrentUser, value]);

  return (
    <Router>
      <Routes>
        <Route
          path="/Login"
          element={<Login refetch={refetch} currentUser={currentUser} />}
        />
        <Route path="/SetupPassword" element={<SetupPassword refetch={refetch} />} />
        <Route element={<Protected />}>
          <Route path="/" element={<LayoutDefault refetch={refetch} />}>
            <Route index element={<DashReservas />} />

            <Route path="RegistarPolo" element={<PoloADD />} />
            <Route path="ListarPolos" element={<PoloList />} />
            <Route path="ListarPolos/EditPolo/:poloID" element={<EditPolo />} />

            <Route path="ListarSalas" element={<ListSala />} />
            <Route path="ListarSalas/EditSala/:salaID" element={<EditSala />} />
            <Route path="ResgistarSala" element={<RegistarSala />} />

            <Route path="AdicionarUser" element={<UserADD />} />
            <Route path="ListarUtilizadores" element={<UserList />} />
            <Route path="SubmeterFicheiroUsers" element={<UserSubmitFile />} />
            <Route
              path="ListarUtilizadores/UserEdit/:userID"
              element={<UserEdit />}
            />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}
