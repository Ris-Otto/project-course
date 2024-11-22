import { Link, useNavigate } from "react-router-dom";
// @deno-types="npm:@types/react"
import { useState } from "react";
import { postRequest } from "../../api/APITemplate.ts";
import { StyledLogin } from "./Login.styled.ts";
import { Button, Form } from "react-bootstrap";
import Paths from "../../../../Shared/paths.ts";
import { useAtom } from "jotai";
import type { UserPayload } from "../../../../Shared/Types.ts";
import { user } from "../../store.ts";

function LoginForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [, setU] = useAtom(user);
  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const requestBody = { email, password };
    const response = await postRequest<UserPayload>(
      Paths.user.login,
      requestBody,
    );
    if (response.isSuccess()) {
      setEmail("");
      setU(response.response);
      navigate("/home");
    }
    setPassword("");
  }

  return (
    <StyledLogin className="top-level-component">
      <div className="container" style={{ marginTop: "10vh" }}>
        <Form onSubmit={handleLogin}>
          <h2>Login to your account</h2>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Button type="submit" className="mt-3 register-btn">Sign in</Button>
          <div className="mt-3">
            Don't have an account?{" "}
            <Link to={"/register"} className="nav-link">Create an account</Link>
          </div>
        </Form>
      </div>
    </StyledLogin>
  );
}

export default LoginForm;
