import paths from "../../../../Shared/paths.ts";
import { FanProfile } from "../../../../Shared/Types.ts";
import { ArtistList } from "./Artist.tsx";
import { StyledProfile } from "./StyledProfile.tsx";
import { wrapPromise } from "../../Hooks.ts";
import { getRequest } from "../../api/APITemplate.ts";
import { SuspenseConsumer } from "../../utilities/Types.tsx";
import PageHeader from "../Misc/PageHeader.tsx";
import { VenueList } from "./Venue.tsx";
import { useAuth } from "../Auth.tsx";
import { useState } from "react";

let user: SuspenseConsumer<FanProfile>;
export function UserProfile() {
  useAuth();
  const [r, setr] = useState(false);
  if (!user) {
    try {
      user = wrapPromise(getRequest<FanProfile>(paths.user.self));
      setr(true);
    } catch {}
  }

  return (
    <StyledProfile id="component-margin" className="top-level-component">
      <PageHeader header={user.read().response.name} className={"mb-3"} />
      <h3>Artists</h3>
      <ArtistList artists={user.read().response.Artists} followed />
      <h3>Venues</h3>
      <VenueList venues={user.read().response.Venues} followed />
    </StyledProfile>
  );
}
