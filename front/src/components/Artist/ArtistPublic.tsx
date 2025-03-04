import { useArtistRefetch, useAuth, useImageDimensions, useIsFollowingArtist, useRequest } from "../../Hooks.ts";
import type { Artist } from "../../../../api/Database/Model/Artist.ts";
import { getImage } from "../../api/APITemplate.ts";
import { StyledArtistProfile } from "../User/StyledProfile.tsx";
import Grid from "../Misc/Grid.tsx";
import { FlexCol } from "../Misc/CustomStyles.tsx";
import { EventCalendar } from "../Event/EventCalendar.tsx";
import { ProfilePicture } from "../Misc/ProfilePicture.tsx";
import { FollowHeartButton } from "../Misc/MiscComponents.tsx";
import { followArtist, unfollowArtist } from "../../api/Common.ts";
import { useMemo, useContext } from "react";
import { useSearchParams} from "react-router-dom";
import { LiaShareAltSquareSolid, LiaEnvelope } from "react-icons/lia"
import { Tabs, Tab, Col, Row, Button } from "react-bootstrap";
import { Loading } from "../../utilities/Loading.tsx";
import { parseTextWithPossibleLineBreaks } from "../../utilities/Functions.tsx";
import { ViewableListPost } from "../Misc/Posts.tsx";
import { ArtistImage } from "./Artist.tsx";
import { ThemeContext } from "styled-components";
import { Links } from "../Misc/Links.tsx";


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
        <Grid header={artist.response.name} wideColumnIndex={1}>
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
    globalThis.outerHeight / 2.5,
  );
  const img = useMemo(() => artist.poster, [artist]);
  const theme = useContext(ThemeContext);
  return (
    <FlexCol>
      <ProfilePicture
        item={artist}
        image={img}
        dimensions={dimensions}
        handleImageLoad={handleImageLoad}
        border
      />
      <div
        className="mt-3 mb-3"
        style={{
          boxShadow: "0 0 10px 2px",
          borderRadius: "10px",
          padding: "5%",
          backgroundColor: theme.darkCream
        }}
      >
        <h3>Images</h3>
        <div
          style={{
            overflowX: "auto",
            maxWidth: `${dimensions.width *0.9}px`,
            display: "inline-block",
            whiteSpace:"nowrap",
          }}
        >
          {artist.Bio?.Media?.map((a, i) => {
            return <ArtistImage image={{href: getImage(a.href)}} key={i}/>
          })}
        </div>
      </div>
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
    </FlexCol>
  );
}

function ArtistMiddle(props: ArtistProps) {
  const theme = useContext(ThemeContext);
  return (
    <Col style={{boxShadow: "0 0 10px 2px", borderRadius: "10px", padding: "5%", backgroundColor: theme.darkCream}}>
      <h3>Members</h3>
      {props.artist.Members.map((m, idx) => {
        return (
          <Row key={idx}>
            <Col>{m.name} - {m.Role.role}</Col>
          </Row>
        );
      })}
      <br />
      <h3 className="mb-3">About</h3>
      <div style={{maxHeight: "50vh", overflowY: "auto", overflowX: "hidden"}}>
      {props.artist.Bio ? (
        parseTextWithPossibleLineBreaks(props.artist.Bio.description)
      ) : (
        "Nothing to show"
      )}
      </div>
      <div
        className={"mt-3"}
        style={{
          overflowX: "auto",
          display: "inline-block",
          width: "100%",
          maxWidth: "100%",
          whiteSpace:"nowrap",
        }}
      >
        <Links item={props.artist} />
      </div>
    </Col>
  );
}

function ArtistRight(props: ArtistProps) {
  const theme = useContext(ThemeContext);
  return (
    <FlexCol>
      <Row className="mb-3" style={{boxShadow: "0 0 10px 2px", borderRadius: "10px", padding: "2%", backgroundColor: theme.darkCream}}>
        <h3>Recent posts</h3>
        <div style={{maxHeight: "50vh", overflowY: "auto", overflowX: "hidden"}}>
        {props.artist.Posts?.map((a, idx) => {
          return (
            <div key={idx} style={{margin: "5%", overflowX: "visible", maxWidth: "90%"}}>
              <ViewableListPost post={a} />
            </div>
          )
        })}
        </div>
      </Row>
      <Row style={{boxShadow: "0 0 10px 2px", borderRadius: "10px", backgroundColor: theme.darkCream, minWidth: "107%"}}>
      <Tabs fill >
        <Tab
          eventKey="upcoming"
          title="Upcoming events"

        >
          <EventCalendar
            events={props.artist.Events.filter(
              (a) => new Date(a.start) > new Date(),
            )}
          />
        </Tab>
        <Tab
          eventKey="past"
          title="Past events"

        >
          <EventCalendar
            events={props.artist.Events.filter(
              (a) => new Date(a.start) <= new Date(),
            )}
          />
        </Tab>
      </Tabs>
      </Row>

    </FlexCol>
  );
}