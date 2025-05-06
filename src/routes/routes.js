import { Login } from "../page/login/login";
import { Main } from "../page/main/main";

export const publicRoutes = [
  {
    path: "/login",
    Element: Login,
  },
];

export const privateRoutes = [
  {
    path: "/",
    Element: Main,
  },
];
