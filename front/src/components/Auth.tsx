import { Outlet, useNavigate } from "react-router-dom";
// @deno-types="npm:@types/react"
import React, { useEffect } from "react";
import { checkToken } from "../api/auth.ts";
import { useAtom } from "jotai";
import { open, user } from "../store.ts";
import NavMenu from "../Navigation/NavMenu.tsx";
import { Menu } from "./Misc/Menu.tsx";
import { useOnClickOutside } from "../Hooks.ts";

export function Auth() {
  const navigate = useNavigate();
  const [_, setU] = useAtom(user);
  const [, setOpen] = useAtom(open);
  const node = React.createRef<HTMLDivElement>();
  useOnClickOutside(node, () => {
    setOpen(false);
  });
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
    //check();
  }, []);

  return (
    <>
      <NavMenu />
      <div ref={node}>
        <Menu />
      </div>
      <Outlet />
    </>
  );
}

export function useAuth(accessType?: number) {
  const [u, setU] = useAtom(user);
  const navigate = useNavigate();
  useEffect(() => {
    const check: () => void = async () => {
      const res = await checkToken();
      if (res.isSuccess()) {
        //Successful, set the user state from the data received
        setU(res.response);
        if (accessType && res.response.type < accessType) {
          navigate("/home");
        }
      } else {
        setU(null);
        //If the authentication failed, redirect to the login page with a state containing the path
        navigate("/home");
      }
    };
    check();
  }, []);
}

function RequiresAuth(path: string) {
  return (
    !path.includes("/home") &&
    !path.includes("/register") &&
    !path.includes("/public") &&
    path !== "/events/"
  );
}
