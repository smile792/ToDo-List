import { useAuthState } from "react-firebase-hooks/auth";
import { Loader } from "@mantine/core";
import { Navbar } from "./module/Navbar/navbar.jsx";
import { BrowserRouter, HashRouter } from "react-router-dom";
import { AppRoutes } from "./routes/AppRoutes.jsx";
import { useContext } from "react";
import { Context } from "./main.jsx";
function App() {
  const { auth } = useContext(Context);
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return <Loader color="blue" />;
  }
  return (
    <HashRouter>
      <Navbar />
      <AppRoutes />
    </HashRouter>
  );
}

export default App;
