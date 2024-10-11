// @deno-types="npm:@types/react"
import { useEffect } from "react";
import {StyledRegister} from "./Register.styled.ts";
import { useAtom } from "jotai";
import {email, password} from "../../store.ts";
import {postRequest} from "../../api/APITemplate.ts";
import {User} from "../../../../api/Database/Model/User.ts";
import {BaseRegisterForm} from "./Register.tsx";

export default function VenueRegistration() {
    useEffect(() => {
        console.log("Band")
    }, [])

    const [mail, ] = useAtom(email);
    const [pw, ] = useAtom(password);

    async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const register = await postRequest<User, {mail: string, pw: string}>("/venue/register", {
            mail,
            pw
            /*more shit idk*/
        });
        if(register.isSuccess()) {
            return;
        }
    }

    return <StyledRegister>
        <BaseRegisterForm onSubmit={handleRegister} title={"Register a venue"} >

        </BaseRegisterForm>
    </StyledRegister>
}