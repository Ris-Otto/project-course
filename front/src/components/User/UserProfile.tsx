import { createSearchParams, useNavigate } from "react-router-dom";
import paths from "../../../../Shared/paths.ts";
import { FanProfile } from "../../../../Shared/Types.ts";
import { RenderArtist } from "./Artist.tsx";
import { StyledProfile } from "./StyledProfile.tsx";
import { wrapPromise } from "../../Hooks.ts";
import { Artist } from "../../../../api/Database/Model/Artist.ts";
import { getRequest } from "../../api/APITemplate.ts";
import { SuspenseConsumer } from "../../utilities/Types.ts";

let user: SuspenseConsumer<FanProfile>;
export function UserProfile() {
  const navigate = useNavigate();
  if (!user) {
    user = wrapPromise(getRequest<FanProfile>(paths.user.self));
  }

  return (
    <StyledProfile id="component-margin" className="top-level-component">
      <h1 className={"mb-3"} style={{ color: "yellow" }}>
        {user.read().response.name}
      </h1>
      <h3>Following</h3>
      <div className="artist-list">
        {user.read().response.Artists.map((artist: Artist, idx: number) => (
          <div
            key={idx}
            className="artist-box"
            onMouseDown={() =>
              navigate({
                pathname: `/artist`,
                search: createSearchParams({
                  artistId: artist.id,
                }).toString(),
              })}
          >
            <RenderArtist
              artist={artist}
              as={"list"}
            />
          </div>
        ))}
      </div>
    </StyledProfile>
  );
}
