import { StyledRegister } from "./Register.styled.ts";
import {
  artistRegisterAtom,
  DefaultReducer,
  useReducerAtom,
} from "../../store.ts";
import { BaseRegisterForm } from "./Register.tsx";
import { postRequest } from "../../api/APITemplate.ts";
import { User } from "../../../../api/Database/Model/User.ts";
//@deno-types=npm:@types/react
import { useState } from "react";

export default function ArtistRegistration() {
  const [user, dispatch] = useReducerAtom(artistRegisterAtom, DefaultReducer);
  const [confirm, setConfirm] = useState("");
  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const register = await postRequest<User>("/band/register", user);
    if (register.isSuccess()) {
      dispatch({ payload: "", type: "all" });
      return;
    }
  }

  return (
    <StyledRegister className="top-level-component">
      <div className="container" style={{ marginTop: "10vh" }}>
        <BaseRegisterForm
          onSubmit={handleRegister}
          title={"Register an artist"}
          atom={artistRegisterAtom}
          confirmPassword={confirm}
          setConfirmPassword={setConfirm}
        />
      </div>
    </StyledRegister>
  );
}
