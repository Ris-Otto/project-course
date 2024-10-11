import {StyledRegister} from "./Register.styled.ts";
import { email, password } from "../../store.ts";
import { useAtom } from "jotai";
import {BaseRegisterForm} from "./Register.tsx";
import {postRequest} from "../../api/APITemplate.ts";
import {User} from "../../../../api/Database/Model/User.ts";

export default function BandRegistration() {


    const [mail, ] = useAtom(email);
    const [pw, ] = useAtom(password);

    async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const register = await postRequest<User, {mail: string, pw: string}>("/band/register", {
            mail,
            pw
            /*more shit idk*/
        });
        if(register.isSuccess()) {
            return;
        }
    }

    return (
    <StyledRegister>
        <BaseRegisterForm onSubmit={handleRegister} title={"Register a band"} />
    </StyledRegister>
    )
}