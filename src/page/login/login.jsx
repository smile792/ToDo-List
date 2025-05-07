import { useContext } from "react";
import { Context } from "../../main";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export const Login = () => {
  const { auth } = useContext(Context);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    const { user } = await signInWithPopup(auth, provider);
  };
  return (
    <div className="login">
      <div>Выберите с помощью чего войти</div>
      <div className="google" onClick={login}>
        Google
      </div>
    </div>
  );
};
