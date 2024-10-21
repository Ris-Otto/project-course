import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {logout} from "../../api/auth.ts";
import {user} from "../../store.ts";
import { useAtom } from "jotai";


export function LogoutButton() {

    const navigate = useNavigate();
    const [, setU] = useAtom(user)
    async function Logout() {
        const res = await logout();
        if(res.isSuccess()) {
            setU(null);
            navigate("/login");
        }
    }

    return <Button onClick={Logout}>
        Logout
    </Button>
}