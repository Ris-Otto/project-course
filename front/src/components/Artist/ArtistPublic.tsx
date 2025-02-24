import { useArtistRefetch, useAuth, useImageDimensions, useIsFollowingArtist, useRequest } from "../../Hooks.ts";
import type { Artist } from "../../../../api/Database/Model/Artist.ts";
import { getRequest } from "../../api/APITemplate.ts";
import { StyledArtistProfile } from "../User/StyledProfile.tsx";
import Grid from "../Misc/Grid.tsx";
import { FlexCol } from "../Misc/CustomStyles.tsx";
import { EventCalendar } from "../Event/EventCalendar.tsx";
import { ProfilePicture } from "../Misc/ProfilePicture.tsx";
import { FollowHeartButton } from "../Misc/MiscComponents.tsx";
import { followArtist, unfollowArtist } from "../../api/Common.ts";
import { useMemo } from "react";
import { useSearchParams} from "react-router-dom";
import { IoNewspaperSharp} from "react-icons/io5";
import { LiaShareAltSquareSolid, LiaEnvelope } from "react-icons/lia"
import { Tabs, Tab, Col, Row, Button } from "react-bootstrap";
import { Loading } from "../../utilities/Loading.tsx";

export default function ArtistProfilePublic() {
  useAuth(-1);
  const [sp] = useSearchParams();

  const artist = useRequest<Artist>(`artist/public/${sp.get("artistId")}`)

  if (!artist.response) return <div>Error</div>;

  if (artist.isLoading) return <Loading />;

  if (artist.isError)
    return <div style={{ marginTop: "60px" }}>{artist.isError}</div>;

  return (
    <StyledArtistProfile className="top-level-component">
      {artist.response ? (
        <Grid header={artist.response.name}>
          <ArtistLeft
            artist={artist.response}
          />
          <ArtistMiddle
            artist={artist.response}
          />
          <ArtistRight
            artist={artist.response}
          />
        </Grid>
      ) : null}
    </StyledArtistProfile>
  );
}

type ArtistProps = {
  artist: Artist;
};

function ArtistLeft({ artist }: ArtistProps) {

  const { refetchArtists } = useArtistRefetch();
  const isFollowing = useIsFollowingArtist(artist);
  const { dimensions, handleImageLoad } = useImageDimensions(
    globalThis.innerHeight / 3,
  );
  const img = useMemo(() => artist.poster, [artist]);

  return (
    <Col>
      <ProfilePicture
        item={artist}
        image={img}
        dimensions={dimensions}
        handleImageLoad={handleImageLoad}
      />
      <br />
      <div style={{ textAlign: "left", marginLeft: 30 }}>
        <Button
          style={{ marginRight: "10px" }}
          className="follow-share-button mb-3"
        >
          <LiaShareAltSquareSolid size={30} />
        </Button>
        <FollowHeartButton
          setRefetch={refetchArtists}
          id={artist.id}
          follow={followArtist}
          unfollow={unfollowArtist}
          followed={isFollowing}
        />
      </div>
      <a style={{ marginLeft: 30 }} href={`mailto:${artist.email}`}>
        <LiaEnvelope size={60} />
        {artist.email}
      </a>
    </Col>
  );
}

function ArtistMiddle(props: ArtistProps) {
  return (
    <Col>
      <h3>Members</h3>
      {props.artist.Members.map((m, idx) => {
        return (
          <Row key={idx}>
            <Col>{m.name}</Col>
          </Row>
        );
      })}
      <br />
      <h3 className="mb-3">About</h3>
      {props.artist.Bio ? (
        <div>{props.artist.Bio.description}</div>
      ) : (
        "Nothing to show"
      )}
    </Col>
  );
}

function ArtistRight(props: ArtistProps) {
  return (
    <FlexCol>
      <Row className="mb-3">
        <h1>Posts</h1>
        <IoNewspaperSharp size={300} />
      </Row>
      <Tabs fill>
        <Tab
          eventKey="upcoming"
          title="Upcoming performances"
          style={{ margin: "5px" }}
        >
          <EventCalendar
            events={props.artist.Events.filter(
              (a) => new Date(a.start) > new Date(),
            )}
          />
        </Tab>
        <Tab
          eventKey="past"
          title="Past performances"
          style={{ margin: "5px" }}
        >
          <EventCalendar
            events={props.artist.Events.filter(
              (a) => new Date(a.start) <= new Date(),
            )}
          />
        </Tab>
      </Tabs>

    </FlexCol>
  );
}