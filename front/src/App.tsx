import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Login from "./components/Login/Login.tsx";
import { UserSession } from "./components/UserSession.tsx";
import { Register } from "./components/Register/Register.tsx";
import { ThemeProvider } from "styled-components";
import { Home } from "./components/Home/Home.tsx";
import ArtistRegistration from "./components/Register/ArtistRegistration.tsx";
import VenueRegistration from "./components/Register/VenueRegistration.tsx";
import { Theme } from "./theme.ts";
import { GlobalStyles } from "./global.ts";
import { UserProfile } from "./components/User/UserProfile.tsx";
import {
  ArtistProfile,
} from "./components/Artist/Artist.tsx";
import { AllEvents, EventPage } from "./components/Event/Event.tsx";
import { Suspended } from "./utilities/Loading.tsx";
import { VenueProfile } from "./components/Venue/Venue.tsx";
import { CreateEvent } from "./components/Event/CreateEvent.tsx";
import 'react-toastify/dist/ReactToastify.css'
import VenueProfilePublic from "./components/Venue/VenuePublic.tsx";
import {AllArtists} from "./components/Artist/AllArtists.tsx";
import paths from "../../Shared/paths.ts";
import {EditableProfileBase} from "./components/Misc/EditableProfileBase.tsx";
import { AllVenues } from "./components/Venue/AllVenues.tsx";
import ArtistProfilePublic from "./components/Artist/ArtistPublic.tsx";
import { ReviewForm } from "./components/Event/ReviewForm.tsx";

const theme = new Theme();

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path={"/"} element={<UserSession />}>
      <Route path="login" element={<Login />} />
      <Route path="register">
        <Route path="" element={<Register />} />
        <Route path="artist" element={<ArtistRegistration />} />
        <Route path="venue" element={<VenueRegistration />} />
      </Route>
      <Route
        path=""
        element={<Home />}
      />
      <Route path="users">
        <Route path="profile" element={<UserProfile />} />
      </Route>
      <Route path="artists">
        <Route path="" element={<AllArtists />} />
        <Route path="public" element={<ArtistProfilePublic />} />
        <Route path="profile" element={<EditableProfileBase Profile={ArtistProfile} requestPath={paths.artist.self} accessType={1} />} />
      </Route>
      <Route path="venues">
        <Route path="" element={<AllVenues />} />
        <Route path="public" element={<VenueProfilePublic />} />
        <Route path="profile" element={<EditableProfileBase Profile={VenueProfile} requestPath={paths.venue.self} accessType={2} /> } />
      </Route>

      <Route path="events">
        <Route
          path=""
          element={
            <Suspended>
              <AllEvents />
            </Suspended>
          }
        />
        <Route
          path=":eventId"
          element={
            <Suspended>
              <EventPage />
            </Suspended>
          }
        />
        <Route path="review/:eventId" element={<ReviewForm />} />


        <Route path="create" element={<CreateEvent />} />
      </Route>
    </Route>,
  ),
);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <ToastContainer autoClose={6000} closeOnClick/>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
