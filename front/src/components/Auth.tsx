import { Outlet } from "react-router-dom";
// @deno-types="npm:@types/react"
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {checkToken} from "../api/auth.ts";
import { useAtom } from "jotai";
import { user } from "../store.ts";

export function Auth() {
    const navigate = useNavigate();
    const [, setU] = useAtom(user);
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
                navigate("/login");
            }
        };
        check();
    }, [])
    return <Outlet />
}