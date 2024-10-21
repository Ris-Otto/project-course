import {StyledRegister} from "./Register.styled.ts";
import {DefaultReducer, useReducerAtom, venueRegisterAtom} from "../../store.ts";
import {postRequest} from "../../api/APITemplate.ts";
import {User} from "../../../../api/Database/Model/User.ts";
import {BaseRegisterForm} from "./Register.tsx";
import { InputGroup, Form } from "react-bootstrap";
import { useEffect} from "react";

export default function VenueRegistration() {
    const [user, dispatch] = useReducerAtom(venueRegisterAtom, DefaultReducer);
    async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const register = await postRequest<User>("/auth/venue/register", {
            user
        });
        if(register.isSuccess()) {
            dispatch({payload: "", type: "all"});
            return;
        }
    }

    useEffect(() => {
        console.log(user);
    }, [user]);

    return (
        <StyledRegister className="top-level-component">
            <div className="container" style={{marginTop: "10vh"}}>
                <BaseRegisterForm onSubmit={handleRegister} title={"Register a venue"} atom={venueRegisterAtom} >
                    <InputGroup className="mb-3">
                        <InputGroup.Text>Business ID</InputGroup.Text>
                        <Form.Control
                            type="text"
                            value={user.businessId}
                            onChange={(e) => {
                                dispatch({payload: e.target.value, type: "businessId"});
                            }}/>
                    </InputGroup>
                    <InputGroup className="mb-3">
                        <InputGroup.Text>Address</InputGroup.Text>
                        <Form.Control
                            type="text"
                            value={user.address}
                            onChange={(e) => {
                                dispatch({payload: e.target.value, type: "address"})
                            }}/>
                    </InputGroup>
                    <InputGroup className="mb-3">
                        <InputGroup.Text>Zip code</InputGroup.Text>
                        <Form.Control
                            type="text"
                            value={user.zip}
                            onChange={(e) => {
                                dispatch({payload: e.target.value, type: "zip"})
                            }}/>
                    </InputGroup>
                    <InputGroup className="mb-3">
                        <InputGroup.Text>City</InputGroup.Text>
                        <Form.Control
                            type="text"
                            value={user.city}
                            onChange={(e) => {
                                dispatch({payload: e.target.value, type: "city"})
                            }}/>
                    </InputGroup>
                </BaseRegisterForm>
            </div>
        </StyledRegister>
    )
}