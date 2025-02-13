import { Button, Nav, Navbar } from "react-bootstrap";
import { NavMenuProfile } from "../components/Login/Logout.tsx";
import { useNavigate } from "react-router-dom";
import { IoMenu } from "react-icons/io5";
import { LiaCalendarWeekSolid } from "react-icons/lia";
//@ts-ignore import shit idk
import logo from "../resources/logo/simplified/underwave_logo_final_cream_simplified.svg";
import { useAtom } from "jotai";
import { open } from "../store.ts";

//TODO add privileges functionality
export function NavMenu() {
  const [_, setO] = useAtom(open);
  const navigate = useNavigate();
  return (
    <Navbar
      className="navbar-body fixed-top"
      style={{
        borderBottom: "1px solid black",
        borderRadius: "0px 0px 5px 5px",
      }}
    >
      <Button
        style={{
          background: "transparent",
          border: "none",
          fontSize: 0,
        }}
        onClick={() => setO((s) => !s)}
      >
        {/*@ts-ignore bah*/}
        <IoMenu size={60} style={{ marginLeft: 10, marginRight: 10 }} />
      </Button>

      <Button
        style={{
          background: "transparent",
          border: "none",
          fontSize: 0,
        }}
        onClick={() => navigate("/")}
      >
        <Navbar.Brand className="mr-3">
          <img src={logo} width={50} alt="Logo" />
        </Navbar.Brand>
      </Button>

      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto"></Nav>
        {/*@ts-ignore bah*/}
        <LiaCalendarWeekSolid size={50} style={{ marginRight: 10 }} />
        <NavMenuProfile />
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavMenu;
