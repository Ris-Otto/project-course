import { createSearchParams, useNavigate } from "react-router-dom";
import paths from "../../../../Shared/paths.ts";
import { FanProfile } from "../../../../Shared/Types.ts";
import { ArtistBox, ArtistList } from "./Artist.tsx";
import { StyledProfile } from "./StyledProfile.tsx";
import { wrapPromise } from "../../Hooks.ts";
import { Artist } from "../../../../api/Database/Model/Artist.ts";
import { getRequest } from "../../api/APITemplate.ts";
import { SuspenseConsumer } from "../../utilities/Types.ts";
import PageHeader from "../Misc/PageHeader.tsx";

let user: SuspenseConsumer<FanProfile>;
export function UserProfile() {
  if (!user) {
    user = wrapPromise(getRequest<FanProfile>(paths.user.self));
  }

  return (
    <StyledProfile id="component-margin" className="top-level-component" style={{marginTop: "60px"}}>
      <PageHeader header={user.read().response.name} className={"mb-3"} />
      <h3>Following</h3>
      {/* <div className="artist-list">
        {user.read().response.Artists.map((artist: Artist, idx: number) => (
          <div
            key={idx}
            onClick={() =>
              navigate({
                pathname: `/artist`,
                search: createSearchParams({
                  artistId: artist.id,
                }).toString(),
              })}
          >
            <ArtistBox
              artist={artist}
            />
          </div>
        ))}
      </div> */}
      <ArtistList artists={user.read().response.Artists} />
    </StyledProfile>
  );
}
