import {Form, Button, Row, InputGroup, Col, Container} from "react-bootstrap";
import {postRequest} from "../../api/APITemplate.ts";
import { User } from "../../../../api/Database/Model/User.ts";
import { Link } from "react-router-dom";
import {StyledRegister} from "./Register.styled.ts";
import { useAtom } from "jotai";
import { email, password } from "../../store.ts";
import {ReactNode} from "react";
import Paths from "../../../../Shared/paths.ts";


export function Register() {
    const [mail, setMail ] = useAtom(email);
    const [pw,setPw ] = useAtom(password);
    async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const register = await postRequest<User, {email: string, password: string}>(Paths.user.register, {
            email: mail,
            password: pw
        });
        if(register.isSuccess()) {
            setPw("");
            setMail("");
        }
    }

    return (
        <StyledRegister className="top-level-component">
            <Container className="component-margin">
                <Row>
                    <Col>
                        <Link to="/register/band" className="link-button">I represent a band</Link>
                    </Col>
                    <Col>
                        <Link to="/register/venue" className="link-button">I represent a venue</Link>
                    </Col>
                </Row>
                <BaseRegisterForm onSubmit={handleRegister} title={"Create an account"} />
            </Container>
        </StyledRegister>
    )
}

declare interface BaseRegisterProps {
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
    title: string;
    children?: ReactNode;
}

export function BaseRegisterForm(props: BaseRegisterProps) {

    const [mail, setMail] = useAtom(email);
    const [pw, setPw] = useAtom(password);

    return (
        <Form className="mt-3" onSubmit={props.onSubmit}>
            <h2>{props.title}</h2>
            <InputGroup className="mb-3">
                <InputGroup.Text>Email</InputGroup.Text>
                <Form.Control type="email" placeholder="Email" value={mail} onChange={(e) => setMail(e.target.value)}/>
            </InputGroup>
            <InputGroup className="mb-3">
                <InputGroup.Text>Password</InputGroup.Text>
                <Form.Control type="password" placeholder="Password" value={pw} onChange={(e) => setPw(e.target.value)}/>
            </InputGroup>
            {props.children}
            <Button className="mt-3 register-btn" type="submit">LOG IN</Button>
        </Form>
    )
}