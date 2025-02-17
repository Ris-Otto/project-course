import {ListFilter} from "../Misc/Filter.tsx";
import { useState } from "react";
import {Filter, PictureProps} from "../../utilities/Types.tsx";
import Grid from "../Misc/Grid.tsx";
import {ListWrapper, StyledListBox} from "../Misc/CustomStyles.tsx";
import { useAuth, useImageDimensions, useRequest } from "../../Hooks.ts";
import {Artist} from "../../../../api/Database/Model/Artist.ts";
import paths from "../../../../Shared/paths.ts";
import {Loading} from "../../utilities/Loading.tsx";
import {useNavigate} from "react-router-dom";
import {useMemo} from "react";
//@ts-ignore bah
import cd from "../../resources/Images-Assets/cd+cover.png";
import {FollowHeartSmall} from "../Misc/MiscComponents.tsx";
import { artistFollowing, refetchFollowedArtists } from "../../store.ts";
import { useAtom } from "jotai";
import {followArtist, unfollowArtist} from "../../api/Common.ts";
import { ProfilePicture } from "../Misc/ProfilePicture.tsx";
import { ObservableListItem } from "../Misc/ObservableListItem.tsx";


function AllArtists() {
    useAuth(-1);
    const [filters, setFilters] = useState<Filter>({
        genre: {
            value: "",
            label: "Genre",
            type: "text"
        },
        name: {
            value: "",
            label: "Name",
            type: "text"
        }
    });

    const [, setRefetch] = useAtom(refetchFollowedArtists)

    const artists = useRequest<Artist[]>(paths.artist.all);

    if (!artists.response) return <div>Error</div>;

    if (artists.isLoading) return <Loading />;

    if (artists.isError)
        return <div style={{ marginTop: "60px" }}>{artists.isError}</div>;


    return (
      <Grid narrowColumnIndex={0} header={"Artists"}>
        <ListFilter filters={filters} setFilters={setFilters}/>
        <ListWrapper>
          <div className="row-wrap-start" >
            {artists.response.map((a, idx) =>
              <ObservableListItem
                item={a}
                key={idx}
                refetchAtom={artistFollowing}
                setRefetch={setRefetch}
                navigatePath={"/artists/public?artistId"}
                follow={followArtist}
                unfollow={unfollowArtist}
              />
            )}
          </div>
        </ListWrapper>
      </Grid>
    )
}

function ArtistInList({artist}: {artist: Artist}) {
    const { dimensions, handleImageLoad } = useImageDimensions(
        globalThis.innerHeight / 5,
    );
    const [af,] = useAtom(artistFollowing)
    const isFollowing = useMemo(() => {
        return 1 === af.filter((a) => a.id === artist.id).length;
    }, [af]);
    const [, setRefetch] = useAtom(refetchFollowedArtists)
    const p = useMemo(() => dimensions.width * 0.12, [dimensions]);
    const navigate = useNavigate();

    return (
      <StyledListBox
        minwidth={`${dimensions.width}px`}
        padding={String(p)}
        className="m-3"
      >
        <FollowHeartSmall setRefetch={setRefetch} id={artist.id} follow={followArtist} unfollow={unfollowArtist} followed={isFollowing} />
          <div style={{cursor: "pointer"}} onClick={() => navigate(`/artists/public?artistId=${artist.id}`)}>
            <ProfilePicture
              item={artist}
              dimensions={dimensions}
              handleImageLoad={handleImageLoad}
              showName={true}
            />
            <div
              className="description mt-3 mb-3"
              style={{ maxWidth: `${dimensions.width}px` }}
            >
              {artist.Bio?.description ? artist.Bio.description : "No description"}
            </div>
          </div>
      </StyledListBox>
    )
}

type ArtistPictureProps = {
    artist: Artist
} & PictureProps

function ArtistPicture({artist, image, dimensions, handleImageLoad}: ArtistPictureProps) {

    return (
        <div className="picture">
            <h4 className="picture-name">{artist.name}</h4>
            <img
                onLoad={handleImageLoad}
                style={{
                    borderRadius: "10px",
                    width: `${dimensions.width}px`,
                    height: `${dimensions.height}px`,
                }}
                onError={({ currentTarget }) => {
                    currentTarget.onerror = null; // prevents looping
                    currentTarget.src = cd;
                }}
                src={image.href}
                alt={"Poster"}
            />
        </div>
    )
}

export {AllArtists, ArtistInList}