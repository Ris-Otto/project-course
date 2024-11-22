import { Button, Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { NavMenuProfile } from "../components/Login/Logout.tsx";
import { useNavigate } from "react-router-dom";

//TODO add privileges functionality
export function NavMenu() {
  const navigate = useNavigate();
  return (
    <Navbar className="bg-body-tertiary" data-bs-theme="dark" sticky="top">
      <Container className="container-min-height-min-content">
        <Button
          style={{
            background: "transparent",
            border: "none",
            fontSize: 0,
          }}
          onClick={() => navigate("/home")}
        >
          <Navbar.Brand className="mr-3">
            Logo ???
          </Navbar.Brand>
        </Button>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link className="m-3" href="/artist/all">Artists</Nav.Link>
            <NavDropdown className="m-3" title="Stuff" id="basic-nav-dropdown">
              <NavDropdown.Item href="/terms">Terms and so on</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <NavMenuProfile />
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavMenu;
