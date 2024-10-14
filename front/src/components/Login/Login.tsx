import { useNavigate,Link } from 'react-router-dom'
// @deno-types="npm:@types/react"
import { useState } from 'react';
import {postRequest} from "../../api/APITemplate.ts";
import { User } from "../../../../api/Database/Model/User.ts";
import { StyledLogin } from "./Login.styled.ts";
import { Form, Button } from "react-bootstrap";
import Paths from "../../../../Shared/paths.ts";
import type { UserPayload } from "../../../../Shared/Types.ts";

function LoginForm(){

    const navigate = useNavigate()

    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    async function handleLogin(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault()
        const requestBody = {email, password}
        const response = await postRequest<UserPayload>(Paths.login, requestBody)
        if(response.isSuccess()) {
            navigate("/home");
        }
    }

    return (
        <div className="container" style={{marginTop:"10vh"}}>
            <StyledLogin>
            <form onSubmit={handleLogin}>
                <h2>Login to your account</h2>
                <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                    <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                </Form.Group>
                <Button type="submit" className="btn btn-primary">LOG IN</Button>
                <p style={{marginTop:"2vh"}}>Don't have an account? <Link to={'/register'}>Create an account</Link></p>
            </form>
            </StyledLogin>
        </div>
    )
}

export default LoginForm