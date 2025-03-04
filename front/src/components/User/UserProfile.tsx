import paths from "../../../../Shared/paths.ts";
import { FanProfile } from "../../../../Shared/Types.ts";
import { StyledProfile } from "./StyledProfile.tsx";
import { useAuth, useRequest } from "../../Hooks.ts";
import PageHeader from "../Misc/PageHeader.tsx";
import { Loading } from "../../utilities/Loading.tsx";
import { artistFollowing, refetchFollowedArtists, refetchFollowedVenues, venueFollowing } from "../../store.ts";
import { useAtom } from "jotai";
import { ListWrapper } from "../Misc/CustomStyles.tsx";
import { ArtistInList } from "../Artist/AllArtists.tsx";
import { VenueInList } from "../Venue/VenuePublic.tsx";
import { ObservableListItem } from "../Misc/ObservableListItem.tsx";
import { followArtist, followVenue, unfollowArtist, unfollowVenue } from "../../api/Common.ts";
import { UnderwaveHeader } from "../../utilities/Functions.tsx";

export function UserProfile() {
  useAuth(0);
  const { response, isLoading, isError } = useRequest<FanProfile>(
    paths.user.self,
  );
  const [af] = useAtom(artistFollowing)
  const [vf] = useAtom(venueFollowing)
  const [, setRefetchArtists] = useAtom(refetchFollowedArtists)
  const [, setRefetchVenues] = useAtom(refetchFollowedVenues)

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <div style={{ marginTop: "60px" }}>{isError}</div>;
  }

  return (
    <StyledProfile id="component-margin" className="top-level-component">
      <PageHeader header={response!.name} className={"mb-3"} />
        {af.length === 0 && vf.length === 0 ? (
          <UnderwaveHeader header={"You haven’t followed any bands or venues yet. Start exploring and follow your favorites!"} as={"h3"} />
        ) : (
          <>
            <h3>Artists</h3>
            <ListWrapper>
              <div className="row-wrap-start" >
                {af ? af.map((a, idx) =>
                  <ObservableListItem
                    key={idx}
                    item={a}
                    setRefetch={setRefetchArtists}
                    refetchAtom={artistFollowing}
                    follow={followArtist}
                    unfollow={unfollowArtist}
                    navigatePath={"/artists/public?artistId"}/>
                ): null}
              </div>
            </ListWrapper>
            <h3>Venues</h3>
            <ListWrapper>
              <div className="row-wrap-start" >
                {vf ? vf.map((a, idx) =>
                  <ObservableListItem
                    key={idx}
                    item={a}
                    setRefetch={setRefetchVenues}
                    refetchAtom={venueFollowing}
                    follow={followVenue}
                    unfollow={unfollowVenue}
                    navigatePath={"/venues/public?venueId"}/>
                ): null}
              </div>
            </ListWrapper>
          </>
        )}

    </StyledProfile>
  );
}
