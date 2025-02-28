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
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function VenueRegistration() {
  const [venue, dispatch] = useReducerAtom(venueRegisterAtom, DefaultReducer);
  const [confirm, setConfirm] = useState("");
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate();
  async function handleRegister() {
    const register = await postRequest<User>("/auth/register/venue", venue);
    if (register.isSuccess()) {
      dispatch({ payload: "", type: "all" });
      navigate("/");
    } else {
      setConfirm("");
      dispatch({ payload: "", type: "password" });
      toast.warning("Something went wrong");
    }
  }

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

  useEffect(() => { return () => {
    dispatch({ payload: "", type: "all" });
    setConfirm("");
    setValidated(false);
  } }, [])

  return (
    <StyledRegister className="top-level-component">
      <div className="container" style={{ marginTop: "10vh" }}>
        <BaseRegisterForm
          onSubmit={handleSubmit}
          title={"Register a venue"}
          user={venue}
          dispatch={dispatch}
          confirmPassword={confirm}
          setConfirmPassword={setConfirm}
          validated={validated}
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
