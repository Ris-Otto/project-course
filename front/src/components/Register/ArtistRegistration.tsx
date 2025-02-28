import { StyledRegister } from "./Register.styled.ts";
import {
  artistRegisterAtom,
  DefaultReducer,
  useReducerAtom,
} from "../../store.ts";
import { BaseRegisterForm } from "./Register.tsx";
import { postRequest } from "../../api/APITemplate.ts";
//@deno-types=npm:@types/react
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Artist } from "../../../../api/Database/Model/Artist.ts";

export default function ArtistRegistration() {
  const [user, dispatch] = useReducerAtom(artistRegisterAtom, DefaultReducer);
  const [confirm, setConfirm] = useState("");
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate();
  async function handleRegister() {
    const register = await postRequest<Artist>("/band/register", user);
    if (register.isSuccess()) {
      dispatch({ payload: "", type: "all" });
      navigate("/");
    } else {
      setConfirm("");
      dispatch({ payload: "", type: "password" });
      toast.warning("Something went wrong");
    }
  }
  useEffect(() => { return () => {
    dispatch({ payload: "", type: "all" });
    setConfirm("");
    setValidated(false);
  } }, [])

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

  return (
    <StyledRegister className="top-level-component">
      <div className="container" style={{ marginTop: "10vh" }}>
        <BaseRegisterForm
          onSubmit={handleSubmit}
          title={"Register an artist"}
          user={user}
          dispatch={dispatch}
          confirmPassword={confirm}
          setConfirmPassword={setConfirm}
          validated={validated}
        />
      </div>
    </StyledRegister>
  );
}
