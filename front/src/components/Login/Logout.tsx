import { Button, NavDropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { logout } from "../../api/auth.ts";
import { user } from "../../store.ts";
import { useAtom } from "jotai";
// @deno-types="npm:@types/react"
import { useMemo } from "react";

export function NavMenuProfile() {
  const navigate = useNavigate();
  const [u, setU] = useAtom(user);

  const userTypes = ["users", "artists", "venues"];

  const hideSignIn = useMemo(
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
      {u ? (
        <div style={{ paddingRight: 50 }}>
          Logged in as:
          <NavDropdown title={u.name}>
            <NavDropdown.Item
              onClick={() => navigate(`${userTypes[u.type]}/profile`)}
            >
              Profile
            </NavDropdown.Item>
            <NavDropdown.Item onClick={() => Logout()}>
              Sign out
            </NavDropdown.Item>
          </NavDropdown>
        </div>
      ) : (
        <Button
          className="m-3"
          hidden={hideSignIn}
          onClick={() => navigate("/login")}
        >
          Sign in
        </Button>
      )}
    </>
  );
}
