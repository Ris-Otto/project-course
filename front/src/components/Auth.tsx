import { Outlet } from "react-router-dom";
// @deno-types="npm:@types/react"
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";

export function Auth() {
    const navigate = useNavigate();
    useEffect(() => {
        const check = async () => {
            /*const res = await checkToken();
            if (res.success) {
                //Successful, set the user state from the data received
                const data = res.data;
                setUser(data);
            } else {
                //If the authentication failed, redirect to the login page with a state containing the path
                //the user tried accessing
                navigate("/login", { state: { from: globalThis.location } });
            }*/
        };
        check();
    })
    return <Outlet />
}