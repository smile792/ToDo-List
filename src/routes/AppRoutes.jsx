import { Navigate, Route, Routes } from "react-router-dom";
import { Login } from "../page/login/login";
import { useContext } from "react";
import { Context } from "../main";
import { useAuthState } from "react-firebase-hooks/auth";
import { privateRoutes, publicRoutes } from "./routes";

export const AppRoutes = () => {
  const { auth } = useContext(Context);
  const [user] = useAuthState(auth);
  return user ? (
    <Routes>
      {privateRoutes.map(({ path, Element }) => (
        <Route key={path} path={path} element={<Element />} />
      ))}
      <Route path="*" element={<Navigate to={"/"} />} replace />
    </Routes>
  ) : (
    <Routes>
      {publicRoutes.map(({ path, Element }) => (
        <Route key={path} path={path} element={<Element />} />
      ))}
      <Route path="*" element={<Navigate to={"/login"} />} replace />
    </Routes>
  );
};
