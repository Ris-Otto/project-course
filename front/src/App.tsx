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
import ArtistProfilePublic from "./components/User/Artist.tsx";
import { EventPage } from "./components/Misc/Event.tsx";
import { Suspended } from "./utilities/Loading.tsx";
import VenueProfilePublic from "./components/User/Venue.tsx";

const theme = new Theme();

const router = createBrowserRouter(
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
      <Route
        path="profile"
        element={
          <Suspended>
            <UserProfile />
          </Suspended>
        }
      />
      <Route path="artist" element={<ArtistProfilePublic />} />
      <Route path="venue" element={<VenueProfilePublic />} />
      <Route
        path="events"
        element={
          <Suspended>
            <EventPage />
          </Suspended>
        }
      />
    </Route>,
  ),
);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <ToastContainer />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
