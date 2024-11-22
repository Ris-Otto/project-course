import { NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../api/auth.ts";
import { user } from "../../store.ts";
import { useAtom } from "jotai";
// @deno-types="npm:@types/react"
import { useCallback } from "react";

export function NavMenuProfile() {
  const navigate = useNavigate();
  const [u, setU] = useAtom(user);

  const hideSignIn = useCallback(
    () => globalThis.location.pathname === "/login",
    [globalThis.location.pathname],
  );

  async function Logout() {
    const res = await logout();
    if (res.isSuccess()) {
      setU(null);
      navigate("/login");
    }
  }

  return (
    <>
      {u
        ? (
          <div>
            Logged in as:
            <NavDropdown title={u.name}>
              <NavDropdown.Item onClick={() => navigate("/profile")}>
                Profile
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => Logout()}>
                Sign out
              </NavDropdown.Item>
            </NavDropdown>
          </div>
        )
        : <Link hidden={hideSignIn()} to={"/login"}>Sign in</Link>}
    </>
  );
}
