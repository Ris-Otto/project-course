import { StyledRegister } from "./Register.styled.ts";
import {
  DefaultReducer,
  useReducerAtom,
  venueRegisterAtom,
} from "../../store.ts";
import { postRequest } from "../../api/APITemplate.ts";
import { User } from "../../../../api/Database/Model/User.ts";
import { BaseRegisterForm } from "./Register.tsx";
import { Form, InputGroup } from "react-bootstrap";
import { useEffect, useState } from "react";

export default function VenueRegistration() {
  const [venue, dispatch] = useReducerAtom(venueRegisterAtom, DefaultReducer);
  const [confirm, setConfirm] = useState("");
  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const register = await postRequest<User>("/auth/register/venue", venue);
    if (register.isSuccess()) {
      dispatch({ payload: "", type: "all" });
      return;
    }
  }

  useEffect(() => {
    console.log(venue);
  }, [venue]);

  return (
    <StyledRegister className="top-level-component">
      <div className="container" style={{ marginTop: "10vh" }}>
        <BaseRegisterForm
          onSubmit={handleRegister}
          title={"Register a venue"}
          atom={venueRegisterAtom}
          confirmPassword={confirm}
          setConfirmPassword={setConfirm}
        >
          <InputGroup className="mb-3">
            <InputGroup.Text>Business ID</InputGroup.Text>
            <Form.Control
              type="text"
              value={venue.businessId}
              onChange={(e: { target: { value: any } }) => {
                dispatch({ payload: e.target.value, type: "businessId" });
              }}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Address</InputGroup.Text>
            <Form.Control
              type="text"
              value={venue.address}
              onChange={(e: { target: { value: any } }) => {
                dispatch({ payload: e.target.value, type: "address" });
              }}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Zip code</InputGroup.Text>
            <Form.Control
              type="text"
              value={venue.zip}
              onChange={(e: { target: { value: any } }) => {
                dispatch({ payload: e.target.value, type: "zip" });
              }}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>City</InputGroup.Text>
            <Form.Control
              type="text"
              value={venue.city}
              onChange={(e: { target: { value: any } }) => {
                dispatch({ payload: e.target.value, type: "city" });
              }}
            />
          </InputGroup>
        </BaseRegisterForm>
      </div>
    </StyledRegister>
  );
}
