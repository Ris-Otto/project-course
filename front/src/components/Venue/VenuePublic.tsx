import type { Venue } from "../../../../api/Database/Model/Venue.ts";
import { useAuth, useImageDimensions, useRequest } from "../../Hooks.ts";
import { Loading } from "../../utilities/Loading.tsx";
import { StyledArtistProfile } from "../User/StyledProfile.tsx";
import { StyledListBox } from "../Misc/CustomStyles.tsx";
import Grid from "../Misc/Grid.tsx";
import { refetchFollowedVenues, user, venueFollowing } from "../../store.ts";
import { getImage, postRequest } from "../../api/APITemplate.ts";
import { EventCalendar } from "../Event/EventCalendar.tsx";
import {
    LiaEnvelope,
    LiaHeart,
    LiaHeartSolid,
    LiaShareAltSquareSolid,
} from "react-icons/lia";
import {
    Button,
    Row,
    Tab,
    Tabs,
} from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMemo, useContext, useState, useEffect } from "react";
import { useAtom } from "jotai";
import { FollowHeartButton, FollowHeartSmall } from "../Misc/MiscComponents.tsx";
import { followVenue, unfollowVenue } from "../../api/Common.ts";
import { ProfilePicture } from "../Misc/ProfilePicture.tsx";
import { FlexCol} from "../Misc/CustomStyles.tsx";
import { parseTextWithPossibleLineBreaks } from "../../utilities/Functions.tsx";
import { ArtistImage } from "../Artist/Artist.tsx";
import { ThemeContext } from "styled-components";
import { MapContainer, TileLayer, useMap, Marker } from 'react-leaflet'
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { toast } from "react-toastify";



function MapComponent() {
  useMap();
  return null;
}

function MapPlaceholder() {
  return (
    <p>
      Map{' '}
      <noscript>You need to enable JavaScript to see this map.</noscript>
    </p>
  )
}

function MapWithPlaceholder({center}: { center?: [number, number]}) {

  return (
    <MapContainer
      /*@ts-ignore bah*/
      center={center}
      zoom={15}
      scrollWheelZoom={false}
      style={{zIndex: 1}}
      placeholder={<MapPlaceholder />}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={center}></Marker>
      <MapComponent />
    </MapContainer>
  )
}

export default function VenueProfilePublic() {
  useAuth(-1);
    const [sp] = useSearchParams();

    const venue = useRequest<Venue>(`venue/public/${sp.get("venueId")}`);

    if (!venue.response) return <div>Error</div>;

    if (venue.isLoading) return <Loading />;

    if (venue.isError) {
        return <div style={{ marginTop: "60px" }}>{venue.isError}</div>;
    }



    return (
        <StyledArtistProfile className="top-level-component">
          {venue.response
            ? (
              <Grid header={venue.response.name} wideColumnIndex={1}>
                <VenueLeft venue={venue.response} />
                <VenueMiddle venue={venue.response} />
                <VenueRight venue={venue.response} />
              </Grid>
            )
            : null}
        </StyledArtistProfile>
    );
}

type VenueProps = {
    venue: Venue;
};

function VenueLeft({ venue }: VenueProps) {
    const [vf] = useAtom(venueFollowing);
    const isFollowing = useMemo(() => 1 === vf.filter((a) => a.id === venue.id).length, [vf]);
    const [, setRefetch] = useAtom(refetchFollowedVenues);
  const { dimensions, handleImageLoad } = useImageDimensions(
    globalThis.outerHeight / 2.5,
  );
  const img = useMemo(() => venue.poster, [venue])
  const theme = useContext(ThemeContext);
  return (
    <FlexCol>
      <ProfilePicture
        item={venue}
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
            maxWidth: `${dimensions.width * 0.9}px`,
            display: "inline-block",
            whiteSpace:"nowrap",
          }}
        >
          {venue.Bio?.Media?.map((a, i) => {
            return <ArtistImage image={{href: getImage(a.href)}} key={i}/>
          })}
        </div>
      </div>
      <br />
        <div style={{ textAlign: "left", marginLeft: 30 }}>
          <Button
            style={{ marginRight: "10px" }}
            className="follow-share-button mb-3"
            onClick={async () => {
              await navigator.clipboard.writeText(String(globalThis.location));
              toast("Link copied to clipboard!");
            }}
          >
              <LiaShareAltSquareSolid size={30} />
          </Button>
          <FollowHeartButton setRefetch={setRefetch} id={venue.id} follow={followVenue} unfollow={unfollowVenue} followed={isFollowing} />
        </div>
        <a style={{ marginLeft: 30 }} href={`mailto:${venue.email}`}>
            <LiaEnvelope size={60} />
            {venue.email}
        </a>
    </FlexCol>
  );
}

function VenueMiddle(props: VenueProps) {
  const theme = useContext(ThemeContext);
  const [results, setResults] = useState<any>();
  const provider = new OpenStreetMapProvider();

  useEffect(() => {
    async function getMap() {
      const r = await provider.search({ query: `${props.venue.address}, ${props.venue.zip}` });
      setResults(r);
    }
    getMap();
  }, [])

  return (
    <>
      {results ? (
      <MapWithPlaceholder center={results[0] ? [results[0].y, results[0].x] : [60.45, 22.27]} />
      ): null}
      <br/>
      <FlexCol
        style={{
          boxShadow: "0 0 10px 2px",
          borderRadius: "10px",
          padding: "5%",
          backgroundColor: theme.darkCream
        }}
      >
        <br />
        <h3 className="mb-3">About</h3>
        <div style={{maxHeight: "50vh", overflowY: "auto", overflowX: "hidden"}}>
          {props.venue.Bio ? (
            parseTextWithPossibleLineBreaks(props.venue.Bio.description)
            ) : (
              "Nothing to show"
          )}
        </div>
      </FlexCol>
    </>
  );
}

function VenueRight(props: VenueProps) {
  const theme = useContext(ThemeContext);
    return (
      <FlexCol>
        <Row
          style={{
            boxShadow: "0 0 10px 2px",
            borderRadius: "10px",
            minWidth: "107%",
            backgroundColor: theme.darkCream
          }}
        >
          <Tabs fill>
            <Tab
              eventKey="upcoming"
              title="Upcoming events"
              style={{ margin: "5px" }}
            >
              <EventCalendar
                events={props.venue.Events.filter(
                  (a) => new Date(a.start) > new Date(),
                )}
              />
            </Tab>
            <Tab
              eventKey="past"
              title="Past events"
              style={{ margin: "5px" }}
            >
              <EventCalendar
                events={props.venue.Events.filter(
                  (a) => new Date(a.start) <= new Date(),
                )}
              />
            </Tab>
          </Tabs>
        </Row>
      </FlexCol>
    );
}

function VenueInList({venue}: {venue: Venue}) {
  const { dimensions, handleImageLoad } = useImageDimensions(
    globalThis.innerHeight / 5,
  );
  const [vf,] = useAtom(venueFollowing)
  const [, setRefetch] = useAtom(refetchFollowedVenues)
  const isFollowing = useMemo(() => 1 === vf.filter((a) => a.id === venue.id).length, [vf]);
  const p = useMemo(() => dimensions.width * 0.12, [dimensions]);
  const navigate = useNavigate();
  const img = useMemo(() => venue.poster, [venue])

  return (
    <StyledListBox
      minwidth={`${dimensions.width}px`}
      padding={String(p)}
      className="m-3"
    >
      <FollowHeartSmall setRefetch={setRefetch} id={venue.id} follow={followVenue} unfollow={unfollowVenue} followed={isFollowing} />
      <div onClick={() => navigate(`/venues/public?venueId=${venue.id}`)}>
        <ProfilePicture
          item={venue}
          image={img}
          dimensions={dimensions}
          handleImageLoad={handleImageLoad}
        />
        <div
          className="description mt-3 mb-3"
          style={{ maxWidth: `${dimensions.width}px` }}
        >
          {venue.Bio?.description ? venue.Bio.description : "No description"}
        </div>
      </div>
    </StyledListBox>
  )
}

export { VenueInList }
