// @ts-types="npm:@types/react"
import { useEffect, useMemo, ReactNode, useState } from "react";
import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import { postRequest } from "../../api/APITemplate.ts";
import { Link } from "react-router-dom";
import { StyledRegister } from "./Register.styled.ts";
import {
  DefaultAction,
  DefaultReducer,
  useReducerAtom,
  userRegisterAtom,
} from "../../store.ts";
import Paths from "../../../../Shared/paths.ts";
import { UserType } from "../../../../Shared/Types.ts";
import type { StateHandler } from "../../utilities/Types.tsx";
//@ts-ignore import shit idk
import vinyl_turquoise from "../../resources/Images-Assets/vinyyli_turkoosi_dripping.svg";
import { toast } from "react-toastify";
import { emailPattern } from "../../utilities/Regex.ts";
import { useNavigate } from "react-router-dom";

export function Register() {
  const [user, dispatch] = useReducerAtom(userRegisterAtom, DefaultReducer);
  const [cPw, setCPw] = useState("");
  const [validated, setValidated] = useState(false);
  const path = useMemo(
    () => globalThis.location.pathname,
    [globalThis.location.pathname],
  );
  const navigate = useNavigate()
  const [regPath, setRegPath] = useState<string>(Paths.user.register);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setValidated(false);
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget;
    if (form.checkValidity()) {
      await handleRegister()
    }

    setValidated(true);
  };

  useEffect(() => {
    if (path.includes("venue")) {
      setRegPath(Paths.venue.register);
      return;
    }
    if (path.includes("artist")) {
      setRegPath(Paths.artist.register);
      return;
    }
    setRegPath(Paths.user.register);

    return () => {
      dispatch({ type: "all", payload: "" });
      setCPw("");
      setValidated(false);
    }
  }, [path]);
  async function handleRegister() {
    const register = await postRequest<UserType>(regPath, user);
    if (register.isSuccess()) {
      dispatch({ payload: "", type: "all" });
      navigate("/");
    } else {
      setCPw("");
      dispatch({ payload: "", type: "password" });
      toast.warning("Something went wrong");
    }
  }

  return (
    <div>
      <StyledRegister className="top-level-component">
        <Row className="container" style={{ marginTop: "10vh" }}>
          <Col xs={12} md={8}>
            <Row>
              <Col>
                <Link to="/register/artist" className="nav-link">
                  I represent a band
                </Link>
              </Col>
            </Row>
            <Row>
              <Col>
                <Link to="/register/venue" className="nav-link">
                  I represent a venue
                </Link>
              </Col>
            </Row>
            <BaseRegisterForm
              onSubmit={handleSubmit}
              title={"Create an account"}
              user={user}
              dispatch={dispatch}
              confirmPassword={cPw}
              setConfirmPassword={setCPw}
              validated={validated}
            />
          </Col>
        </Row>
      </StyledRegister>
      <div className="vinyl-container">
        <img className="sign-up-vinyl" src={vinyl_turquoise} alt="vinyl" />
      </div>
    </div>
  );
}

declare interface BaseRegisterProps<T extends Record<string, string | number>> {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  title: string;
  children?: ReactNode;
  user: T;
  dispatch: (action: DefaultAction<T>) => void
  confirmPassword: string;
  setConfirmPassword: StateHandler<string>;
  validated: boolean;
}

export function BaseRegisterForm<T extends Record<string, string>>(
  props: BaseRegisterProps<T>,
) {
  const { user, dispatch } = props;

  return (
    <Form className="mt-3" onSubmit={props.onSubmit} noValidate validated={props.validated}>
      <h2 style={{ textAlign: "left" }}>{props.title}</h2>
      <InputGroup className="mb-3">
        <InputGroup.Text id={"email"}>Email</InputGroup.Text>
        <Form.Control
          type="email"
          placeholder="finland@hefe.fi"
          value={user.email}
          onChange={(e: { target: { value: string } }) =>
            dispatch({ payload: e.target.value, type: "email" })
          }
          pattern={emailPattern.source}
          required
          aria-describedby={"email"}
        />
        <Form.Control.Feedback type="invalid" style={{color: "#B44819"}}>
          An email is required.
        </Form.Control.Feedback>
      </InputGroup>
      <InputGroup className="mb-3">
        <InputGroup.Text id={"display-name"}>Display name</InputGroup.Text>
        <Form.Control
          type="text"
          placeholder="Finland hefe"
          value={user.name}
          onChange={(e: { target: { value: string } }) =>
            dispatch({ payload: e.target.value, type: "name" })
          }
          aria-describedby={"display-name"}
          required
          pattern={/[A-Za-z0-9_\s\-]+/.source}
          isValid={false}
        />
        <Form.Control.Feedback type="invalid" style={{color: "#B44819"}}>
          A display name is required.
        </Form.Control.Feedback>
      </InputGroup>
      <InputGroup className="mb-3">
        <InputGroup.Text id={"password"}>Password</InputGroup.Text>
        <Form.Control
          type="password"
          value={user.password}
          onChange={(e: { target: { value: string } }) =>
            dispatch({ payload: e.target.value, type: "password" })
          }
          pattern={"(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"}
          aria-describedby={"password"}
          required
          isValid={false}
          isInvalid={false}
        />
        <Form.Control.Feedback type="invalid" style={{color: "#B44819"}}>
          Your password should contain at least 8 characters, a capital (uppercase) letter and a number
        </Form.Control.Feedback>
      </InputGroup>
      <InputGroup className="mb-3">
        <InputGroup.Text id={"confirm-password"}>Confirm password</InputGroup.Text>
        <Form.Control
          type="password"
          required
          value={props.confirmPassword}
          onChange={(e: { target: { value: string } }) =>
            props.setConfirmPassword(e.target.value)
          }
          pattern={user.password}
          aria-describedby={"confirm-password"}
          isInvalid={false}
          isValid={false}
        />
        <Form.Control.Feedback type="invalid" style={{color: "#B44819"}}>
          Your passwords should match
        </Form.Control.Feedback>
      </InputGroup>
      {props.children}
      <Button className="mt-3 register-btn" type="submit">
        Sign up
      </Button>
      <div className="mt-3">
        Already have an account?{" "}
        <Link to={"/login"} className="nav-link">
          Sign in here
        </Link>
      </div>
    </Form>
  );
}
