import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Login from "./components/Login/Login.tsx";
import { Auth } from "./components/Auth.tsx";
import { Register } from "./components/Register/Register.tsx";
import { ThemeProvider } from "styled-components";
import { Home } from "./components/Home/Home.tsx";
import ArtistRegistration from "./components/Register/ArtistRegistration.tsx";
import VenueRegistration from "./components/Register/VenueRegistration.tsx";
import { Theme } from "./theme.ts";
import { GlobalStyles } from "./global.ts";
import DesignTest from "./Test.tsx";
import { UserProfile } from "./components/User/UserProfile.tsx";
import ArtistProfilePublic, {
  ArtistProfile,
} from "./components/User/Artist.tsx";
import { EventPage } from "./components/Misc/Event.tsx";
import { Suspended } from "./utilities/Loading.tsx";
import VenueProfilePublic, { VenueProfile } from "./components/User/Venue.tsx";
import { CreateEvent } from "./components/Misc/CreateEvent.tsx";
import { Menu } from "./components/Misc/Menu.tsx";
//@deno-types=npm:@types/react
import { useState, useMemo } from "react";
import { NavMenu } from "../src/Navigation/NavMenu.tsx";
const theme = new Theme();

function App() {
  const router = useMemo(
    () =>
      createBrowserRouter(
        createRoutesFromElements(
          <Route path={"/"} element={<Auth />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="register/band" element={<ArtistRegistration />} />
            <Route path="register/venue" element={<VenueRegistration />} />
            <Route
              path="home"
              element={
                <Suspended>
                  <Home />
                </Suspended>
              }
            />
            <Route path="test" element={<DesignTest />} />
            <Route path="users">
              <Route
                path="profile"
                element={
                  <Suspended>
                    <UserProfile />
                  </Suspended>
                }
              />
            </Route>
            <Route path="artists">
              <Route path="" element={<div>artist list</div>} />
              <Route path="public" element={<ArtistProfilePublic />} />
              <Route path="profile" element={<ArtistProfile />} />
            </Route>
            <Route path="venues">
              <Route path="" element={<div>venue list</div>} />
              <Route path="public" element={<VenueProfilePublic />} />
              <Route path="profile" element={<VenueProfile />} />
            </Route>

            <Route path="events">
              <Route
                path=":eventId"
                element={
                  <Suspended>
                    <EventPage />
                  </Suspended>
                }
              />
              <Route path="create" element={<CreateEvent />} />
            </Route>
          </Route>,
        ),
      ),
    [],
  );
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <ToastContainer />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
