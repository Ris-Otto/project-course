import paths from "../../../../Shared/paths.ts";
import { FanProfile } from "../../../../Shared/Types.ts";
import { ArtistList } from "../Artist/Artist.tsx";
import { StyledProfile } from "./StyledProfile.tsx";
import { useRequest } from "../../Hooks.ts";
import PageHeader from "../Misc/PageHeader.tsx";
import { useAuth } from "../Auth.tsx";
import { Loading } from "../../utilities/Loading.tsx";
import {VenueList} from "../Venue/VenuePublic.tsx";

export function UserProfile() {
  useAuth();
  const { response, isLoading, isError } = useRequest<FanProfile>(
    paths.user.self,
  );

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <div style={{ marginTop: "60px" }}>{isError}</div>;
  }

  return (
    <StyledProfile id="component-margin" className="top-level-component">
      <PageHeader header={response!.name} className={"mb-3"} />
      <h3>Artists</h3>
      <ArtistList artists={response!.Artists} followed />
      <h3>Venues</h3>
      <VenueList venues={response!.Venues} followed />
    </StyledProfile>
  );
}
