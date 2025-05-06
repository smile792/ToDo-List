import { Button } from "@mantine/core";
import { useContext } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import { Context } from "../../main";
import { signOut } from "firebase/auth";

export const Navbar = () => {
  const { auth } = useContext(Context);
  const [user] = useAuthState(auth);
  return (
    <div className="navbar">
      {user ? (
        <Button variant="filled" size="xs" onClick={() => signOut(auth)}>
          Выйти
        </Button>
      ) : (
        <Link to={"/login"}>
          <Button variant="filled" size="xs">
            Войти
          </Button>
        </Link>
      )}
    </div>
  );
};
