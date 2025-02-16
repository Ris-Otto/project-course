import { Link, useNavigate } from "react-router-dom";
// @ts-types="npm:@types/react"
import React, { useEffect, useState } from "react";
import { postRequest } from "../../api/APITemplate.ts";
import { StyledLogin } from "./Login.styled.ts";
import { Button, Form, Row, Col } from "react-bootstrap";
import paths from "../../../../Shared/paths.ts";
import { useAtom } from "jotai";
import type { UserPayload } from "../../../../Shared/Types.ts";
import { user } from "../../store.ts";
// @ts-types="npm:@types/react-icons"
import { GoArrowLeft } from "react-icons/go";
//@ts-ignore import shit idk
import vinyl_brown from "../../resources/Images-Assets/vinyyli_ruskea_dripping.svg";

function LoginForm({ userType, path }: { userType: number; path: string }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [, setU] = useAtom(user);


  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const requestBody = { email, password, type: userType };
    const response = await postRequest<UserPayload>(path, requestBody);
    if (response.isSuccess()) {
      setU(response.response);
      navigate("/");
    }
    setPassword("");
  }

  useEffect(() => {
    return () => {
      setPassword("");
      setEmail("");
    };
  }, []);

  return (
    <div>
      <Row className="container" style={{ marginTop: "10vh" }}>
        <Col xs={10} md={8}>
          <Form onSubmit={handleLogin}>
            <h2>Sign in to your account</h2>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e: React.ChangeEvent<{ value: string }>) => {
                  setEmail(e.target.value);
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e: React.ChangeEvent<{ value: string }>) =>
                  setPassword(e.target.value)
                }
              />
            </Form.Group>
            <Button type="submit" className="mt-3">
              Sign in
            </Button>
            <div className="mt-3">
              Don't have an account?{" "}
              <Link to={"/register"} className="page-link">
                Create an account
              </Link>
            </div>
          </Form>
        </Col>
      </Row>
    </div>
  );
}

function Login() {
  const [type, setType] = useState<number>(-1);
  const [loginPath, setLoginPath] = useState<string>(paths.user.login);

  return (
    <div className="top-level-component" style={{ marginTop: "10vh" }}>
      {type < 0 ? (
        <Col xs={1} md={8}>
          <Button
            className="mb-3"
            onClick={() => {
              setType(0);
              setLoginPath(paths.user.login);
            }}
          >
            User login
          </Button>
          <br />
          {/*Apply distinct style*/}
          <Button
            onClick={() => {
              setType(1);
              setLoginPath(paths.artist.login);
            }}
          >
            I am/represent an artist
          </Button>
          {/*Apply distinct style*/}
          <Button
            onClick={() => {
              setType(2);
              setLoginPath(paths.venue.login);
            }}
          >
            I represent a venue
          </Button>
        </Col>
      ) : (
        <StyledLogin>
          {/* Uhh custom style class i guess */}
          <div onClick={() => setType(-1)}>
            <GoArrowLeft className="back-arrow-3" />
          </div>
          <LoginForm userType={type} path={loginPath} />
        </StyledLogin>
      )}
      <div className="vinyl-container">
        <img className="sign-up-vinyl" src={vinyl_brown} alt="vinyl" />
      </div>
    </div>
  );
}

export default Login;
