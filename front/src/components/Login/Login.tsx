import { Link, useNavigate } from "react-router-dom";
// @ts-types="npm:@types/react"
import React, { useEffect, useState } from "react";
import { postRequest } from "../../api/APITemplate.ts";
import { StyledLogin } from "./Login.styled.ts";
import { Button, Form } from "react-bootstrap";
import paths from "../../../../Shared/paths.ts";
import { useAtom } from "jotai";
import type { UserPayload } from "../../../../Shared/Types.ts";
import { user } from "../../store.ts";
// @ts-types="npm:@types/react-icons"
import {GoArrowLeft} from "react-icons/go";

function LoginForm({userType}: {userType: number}) {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [, setU] = useAtom(user);


  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const requestBody = { email, password, type: userType };
    const response = await postRequest<UserPayload>(
      paths.user.login,
      requestBody,
    );
    if (response.isSuccess()) {
      setU(response.response);
      navigate("/home");
    }
    setPassword("");
  }

  useEffect(() => {
    return () => {
        setPassword("");
        setEmail("");
    }
  }, [])

  return (
    <div className="container" style={{ marginTop: "10vh" }}>
      <Form onSubmit={handleLogin}>
        <h2>Sign in to your account</h2>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e: React.ChangeEvent<{ value: string }>) => {setEmail(e.target.value)}}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e: React.ChangeEvent<{ value: string }>) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Button type="submit" className="mt-3 register-btn">Sign in</Button>
        <div className="mt-3">
          Don't have an account?{" "}
          <Link to={"/register"} className="nav-link">Create an account</Link>
        </div>
      </Form>
    </div>
  );
}

function Login() {
    const [type, setType] = useState<number>(-1);

    return (
        <div className="container" style={{ marginTop: "10vh" }}>
            {type < 0 ? (
                <>
                    <Button className="mb-3" onClick={() => setType(0)}>User login</Button>
                    <br/>
                    {/*Apply distinct style*/}
                    <Button onClick={() => setType(1)}>I am/represent an artist</Button>
                    {/*Apply distinct style*/}
                    <Button onClick={() => setType(2)}>I represent a venue</Button>
                    
                </>
            ) : (
                <StyledLogin className="top-level-component">
                    {/* Uhh custom style class i guess */}
                    <div onClick={() => setType(-1)}>
                    <GoArrowLeft style={{cursor: "pointer"}} color="#FFED00" size="3em" />
                    </div>
                    <LoginForm userType={type} />
                </StyledLogin>
            )}
        </div>
    )
}

export default Login;
 