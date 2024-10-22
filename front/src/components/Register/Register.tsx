import {Form, Button, Row, InputGroup, Col} from "react-bootstrap";
import {postRequest} from "../../api/APITemplate.ts";
import { Link } from "react-router-dom";
import {StyledRegister} from "./Register.styled.ts";
import {DefaultReducer, userRegisterAtom, useReducerAtom} from "../../store.ts";
import {ReactNode } from "react";
import Paths from "../../../../Shared/paths.ts";
import {UserType} from "../../../../Shared/Types.ts";
import type { PrimitiveAtom } from "jotai";


export function Register() {

    const [user, dispatch] = useReducerAtom(userRegisterAtom, DefaultReducer);
    async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const register = await postRequest<UserType>(Paths.user.register, user);
        if(register.isSuccess()) {
            dispatch({payload: "", type: "all"});
        }
    }

    return (
        <StyledRegister className="top-level-component">
            <div className="container" style={{marginTop: "10vh"}}>
                <Row>
                    <Col>
                        <Link to="/register/band" className="nav-link">I represent a band</Link>
                    </Col>

                </Row>
                <Row>
                    <Col>
                        <Link to="/register/venue" className="nav-link">I represent a venue</Link>
                    </Col>
                </Row>
                <BaseRegisterForm onSubmit={handleRegister} title={"Create an account"} atom={userRegisterAtom} />
            </div>
        </StyledRegister>
)
}

declare interface BaseRegisterProps<T extends Record<string, string | number>> {
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
    title: string;
    children?: ReactNode;
    atom: PrimitiveAtom<T>;
}

export function BaseRegisterForm<T extends Record<string, string | number>>(props: BaseRegisterProps<T>) {
    const [user, dispatch] = useReducerAtom(props.atom, DefaultReducer);

    return (
        <Form className="mt-3" onSubmit={props.onSubmit}>
            <h2 style={{textAlign: "left"}}>{props.title}</h2>
            <InputGroup className="mb-3">
                <InputGroup.Text>Email</InputGroup.Text>
                <Form.Control
                    type="email"
                    placeholder="finland@hefe.fi"
                    value={user.email}
                    onChange={(e) => dispatch({payload: e.target.value, type: "email"})}/>
            </InputGroup>
            <InputGroup className="mb-3">
                <InputGroup.Text>Display name</InputGroup.Text>
                <Form.Control
                    type="text"
                    placeholder="Finland hefe"
                    value={user.name}
                    onChange={(e) => dispatch({payload: e.target.value, type: "name"})}/>
            </InputGroup>
            <InputGroup className="mb-3">
                <InputGroup.Text>Password</InputGroup.Text>
                <Form.Control
                    type="password"
                    value={user.password}
                    onChange={(e) => dispatch({payload: e.target.value, type: "password"})}/>
            </InputGroup>
            {props.children}
            <Button className="mt-3 register-btn" type="submit">Sign up</Button>
            <div className="mt-3">Already have an account?
                {" "}<Link to={'/login'} className="nav-link">Sign in here</Link>
            </div>
        </Form>
    )
}