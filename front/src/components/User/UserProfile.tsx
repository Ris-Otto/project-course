import paths from "../../../../Shared/paths.ts";
import { FanProfile } from "../../../../Shared/Types.ts";
import { StyledProfile } from "./StyledProfile.tsx";
import { useAuth, useRequest } from "../../Hooks.ts";
import PageHeader from "../Misc/PageHeader.tsx";
import { Loading } from "../../utilities/Loading.tsx";
import { artistFollowing, venueFollowing } from "../../store.ts";
import { useAtom } from "jotai";
import { ListWrapper } from "../Misc/CustomStyles.tsx";
import { ArtistInList } from "../Artist/AllArtists.tsx";
import { VenueInList } from "../Venue/VenuePublic.tsx";

export function UserProfile() {
  useAuth(0);
  const { response, isLoading, isError } = useRequest<FanProfile>(
    paths.user.self,
  );
  const [af] = useAtom(artistFollowing)
  const [vf] = useAtom(venueFollowing)

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
      <ListWrapper>
        <div className="row-wrap-start" >
          {af ? af.map((a, idx) =>
            <ArtistInList artist={a} key={idx}/>
          ): null}
        </div>
      </ListWrapper>
      <h3>Venues</h3>
      <ListWrapper>
        <div className="row-wrap-start" >
          {vf ? vf.map((a, idx) =>
            <VenueInList venue={a} key={idx}/>
          ): null}
        </div>
      </ListWrapper>
    </StyledProfile>
  );
}
