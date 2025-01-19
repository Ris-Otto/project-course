import { Outlet, useNavigate } from "react-router-dom";
// @deno-types="npm:@types/react"
import { useEffect } from "react";
import { checkToken } from "../api/auth.ts";
import { useAtom } from "jotai";
import { user } from "../store.ts";
import NavMenu from "../Navigation/NavMenu.tsx";
import { Menu } from "./Misc/Menu.tsx";

export function Auth() {
  const navigate = useNavigate();
  const [_, setU] = useAtom(user);
  useEffect(() => {
    const check = async () => {
      const res = await checkToken();
      if (res.isSuccess()) {
        //Successful, set the user state from the data received
        setU(res.response);
      } else {
        //If the authentication failed, redirect to the login page with a state containing the path
        //the user tried accessing
        if (!RequiresAuth(globalThis.location.pathname)) {
          return;
        }
        setU(null);
        navigate("/login");
      }
    };
    check();
  }, []);

  return (
    <>
      <NavMenu />
      <Menu />
      <Outlet />
    </>
  );
}

function RequiresAuth(path: string) {
  return (
    !path.includes("/home") &&
    !path.includes("/register") &&
    !path.includes("/public")
  );
}
