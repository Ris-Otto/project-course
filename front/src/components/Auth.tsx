import { Outlet,useNavigate } from "react-router-dom";
// @deno-types="npm:@types/react"
import {useEffect} from "react";
import { Button } from "react-bootstrap";
import {checkToken} from "../api/auth.ts";
import { useAtom } from "jotai";
import { user } from "../store.ts";
import {LogoutButton} from "./Login/Logout.tsx";

export function Auth() {
    const navigate = useNavigate();
    const [u, setU] = useAtom(user);
    useEffect(() => {
        const check = async () => {
            const res = await checkToken();
            if (res.isSuccess()) {
                //Successful, set the user state from the data received
                setU(res.response);
            } else {
                //If the authentication failed, redirect to the login page with a state containing the path
                //the user tried accessing
                setU(null);
                if(!RequiresAuth(globalThis.location.pathname)) {
                    return;
                }
                navigate("/login");
            }
        };
        check();
    }, [])

    return <>
        <Outlet />
        {u ? (
            <div>
                {!location.pathname.includes("profile") ? (
                    <div style={{top: "5%", right: "5%", position: "absolute"}}>
                        <Button onClick={() => navigate("/profile")}>Profile</Button>
                    </div>): null}
                <div style={{ bottom: "5%", right: "5%", position: "absolute"}}>
                    <LogoutButton />
                </div>
            </div>
            )
        : null}

    </>
}

function RequiresAuth(path: string) {
    return path != "/home" && !path.includes("/register");

}