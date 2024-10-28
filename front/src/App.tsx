import { createBrowserRouter, Route, createRoutesFromElements, RouterProvider } from "react-router-dom"
import { ToastContainer } from 'react-toastify';
import Login from "./components/Login/Login.tsx";
import { Auth } from "./components/Auth.tsx";
import { Register } from "./components/Register/Register.tsx";
import { ThemeProvider } from "styled-components";
import Home from "./components/Home/Home.tsx";
import ArtistRegistration from "./components/Register/ArtistRegistration.tsx";
import VenueRegistration from "./components/Register/VenueRegistration.tsx";
import {DarkTheme} from "./theme.ts";
import {GlobalStyles} from "./global.ts";
import DesignTest from "./Test.tsx";
import {UserProfile} from "./components/User/UserProfile.tsx";
import ArtistProfilePublic from "./components/User/Artist.tsx";

const theme = new DarkTheme();

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path={"/"} element={<Auth />}>
            <Route path="login" element={<Login />}/>
            <Route path="register" element={<Register />}/>
            <Route path="register/band" element={<ArtistRegistration />}/>
            <Route path="register/venue" element={<VenueRegistration />}/>
            <Route path="home" element={<Home />}/>
            <Route path="test" element={<DesignTest />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="artist" element={<ArtistProfilePublic />} />
        </Route>
    )
)

function App() {


    return (
        <ThemeProvider theme={theme}>
            <GlobalStyles />
            <ToastContainer />
            <RouterProvider router={router} />
        </ThemeProvider>
    )
}

export default App
