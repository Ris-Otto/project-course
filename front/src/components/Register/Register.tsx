// @ts-types="npm:@types/react"
import { useEffect, useMemo, ReactNode, useState } from "react";
import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import { postRequest } from "../../api/APITemplate.ts";
import { Link } from "react-router-dom";
import { StyledRegister } from "./Register.styled.ts";
import {
  DefaultReducer,
  useReducerAtom,
  userRegisterAtom,
} from "../../store.ts";
import Paths from "../../../../Shared/paths.ts";
import { UserType } from "../../../../Shared/Types.ts";
import type { PrimitiveAtom } from "jotai";
import type { StateHandler } from "../../utilities/Types.tsx";
//@ts-ignore import shit idk
import vinyl_turquoise from "../../resources/Images-Assets/vinyyli_turkoosi_dripping.svg";

export function Register() {
  const [user, dispatch] = useReducerAtom(userRegisterAtom, DefaultReducer);
  const [cPw, setCPw] = useState("");
  const path = useMemo(
    () => globalThis.location.pathname,
    [globalThis.location.pathname],
  );
  const [regPath, setRegPath] = useState(Paths.user.register);

  useEffect(() => {
    if (path.includes("venue")) {
      setRegPath(Paths.venue.register);
      return;
    }
    if (path.includes("artist")) {
      setRegPath(Paths.artist.register);
      return;
    }
    setRegPath(Paths.user.regiser);
  }, [path]);
  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (user.password !== cPw) return;
    const register = await postRequest<UserType>(regPath, user);
    if (register.isSuccess()) {
      dispatch({ payload: "", type: "all" });
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
              onSubmit={handleRegister}
              title={"Create an account"}
              atom={userRegisterAtom}
              confirmPassword={cPw}
              setConfirmPassword={setCPw}
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
  atom: PrimitiveAtom<T>;
  confirmPassword: string;
  setConfirmPassword: StateHandler<string>;
}

export function BaseRegisterForm<T extends Record<string, string | number>>(
  props: BaseRegisterProps<T>,
) {
  const [user, dispatch] = useReducerAtom(props.atom, DefaultReducer);

  return (
    <Form className="mt-3" onSubmit={props.onSubmit}>
      <h2 style={{ textAlign: "left" }}>{props.title}</h2>
      <InputGroup className="mb-3">
        <InputGroup.Text>Email</InputGroup.Text>
        <Form.Control
          type="email"
          placeholder="finland@hefe.fi"
          value={user.email}
          onChange={(e: { target: { value: string } }) =>
            dispatch({ payload: e.target.value, type: "email" })
          }
        />
      </InputGroup>
      <InputGroup className="mb-3">
        <InputGroup.Text>Display name</InputGroup.Text>
        <Form.Control
          type="text"
          placeholder="Finland hefe"
          value={user.name}
          onChange={(e: { target: { value: string } }) =>
            dispatch({ payload: e.target.value, type: "name" })
          }
        />
      </InputGroup>
      <InputGroup className="mb-3">
        <InputGroup.Text>Password</InputGroup.Text>
        <Form.Control
          type="password"
          value={user.password}
          onChange={(e: { target: { value: string } }) =>
            dispatch({ payload: e.target.value, type: "password" })
          }
        />
      </InputGroup>
      <InputGroup className="mb-3">
        <InputGroup.Text>Confirm password</InputGroup.Text>
        <Form.Control
          type="password"
          value={props.confirmPassword}
          onChange={(e: { target: { value: string } }) =>
            props.setConfirmPassword(e.target.value)
          }
        />
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
