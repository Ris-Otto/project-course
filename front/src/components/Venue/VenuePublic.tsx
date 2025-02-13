import type { Venue } from "../../../../api/Database/Model/Venue.ts";
import { useRequest } from "../../Hooks.ts";
import { Loading } from "../../utilities/Loading.tsx";
import { StyledArtistProfile, StyledListBox } from "../User/StyledProfile.tsx";
import Grid from "../Misc/Grid.tsx";
import { user } from "../../store.ts";
import { postRequest } from "../../api/APITemplate.ts";
import { Strong } from "../Event/Event.styled.ts";
import { EventCalendar } from "../Event/EventCalendar.tsx";
import {
    LiaEnvelope,
    LiaHeart,
    LiaHeartSolid,
    LiaShareAltSquareSolid,
} from "react-icons/lia";
import {
    IoImageOutline,
    IoNewspaperSharp,
} from "react-icons/io5";
import {
    GoArrowLeft,
} from "react-icons/go";
import {
    Button,
    Col,
    Container,
    Row,
    Tab,
    Tabs,
} from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useAtom } from "jotai";
import { createSearchParams } from "react-router-dom";

export default function VenueProfilePublic() {
    const [sp] = useSearchParams();
    const navigate = useNavigate();

    const venue = useRequest<Venue>(`venue/public/${sp.get("venueId")}`);

    if (!venue.response) return <div>Error</div>;

    if (venue.isLoading) return <Loading />;

    if (venue.isError) {
        return <div style={{ marginTop: "60px" }}>{venue.isError}</div>;
    }

    return (
        <StyledArtistProfile
            className="top-level-component"
            style={{ textAlign: "left" }}
        >
            {/*@ts-ignore bah*/}
            <GoArrowLeft
                onClick={() => navigate(-1)}
                className="back-arrow-3"
            />
            <Container>
                {venue.response
                    ? (
                        <Grid header={venue.response.name}>
                            <VenueLeft venue={venue.response} />
                            <VenueMiddle venue={venue.response} />
                            <VenueRight venue={venue.response} />
                        </Grid>
                    )
                    : null}
            </Container>
        </StyledArtistProfile>
    );
}

export function VenueBox({ venue, followed }: VenueBoxProps) {
    const navigate = useNavigate();
    const [u, _] = useAtom(user);
    const [fState, setFState] = useState<"empty" | "filled">("empty");

    async function FollowVenue() {
        await postRequest(`/user/venue/follow/${venue.id}`);
    }
    return (
        <StyledListBox>
            <Row hidden={!u || followed} className="follow-heart-right">
                <Col
                    xs={2}
                    md={{ span: 2, offset: 10 }}
                    onMouseEnter={() => setFState("filled")}
                    onMouseLeave={() => setFState("empty")}
                    onClick={async () => await FollowVenue()}
                >
                    {fState === "empty"
                        ? <LiaHeart size={30} />
                        : <LiaHeartSolid size={30} />}
                </Col>
            </Row>
            <Row
                onClick={() =>
                    navigate({
                        pathname: `/venues/public`,
                        search: createSearchParams({
                            venueId: venue.id,
                        }).toString(),
                    })}
            >
                <IoImageOutline size={200} />
                <br />
                <Strong>{venue.name}</Strong>
            </Row>
        </StyledListBox>
    );
}

export function VenueList({ venues, followed }: ListProps) {
    return (
        <div className="artist-list">
            {venues.map((a, i) => {
                return <VenueBox venue={a} key={i} followed={followed} />;
            })}
        </div>
    );
}

type ListProps = {
    venues: Venue[];
    followed?: boolean;
};
type VenueProps = {
    venue: Venue;
};
type VenueBoxProps = {
    venue: Venue;
    followed?: boolean;
};

function VenueLeft(props: VenueProps) {
    const [u, _] = useAtom(user);
    const [fState, setFState] = useState<"empty" | "filled">("empty");

    async function FollowVenue() {
        await postRequest(`/user/venues/follow/${props.venue.id}`);
    }
    return (
        <Col>
            <IoImageOutline size={350} />
            <br />
            <div style={{ textAlign: "left", marginLeft: 30 }}>
                <Button
                    style={{ marginRight: "10px" }}
                    className="follow-share-button mb-3"
                >
                    <LiaShareAltSquareSolid size={30} />
                </Button>
                <Button
                    hidden={!u || u.type !== 0}
                    onMouseEnter={() => setFState("filled")}
                    onMouseLeave={() => setFState("empty")}
                    onClick={async () => await FollowVenue()}
                    className="follow-share-button mb-3"
                >
                    {fState === "empty"
                        ? <LiaHeart size={30} />
                        : <LiaHeartSolid size={30} />}
                    Follow
                </Button>
            </div>
            <a style={{ marginLeft: 30 }} href={`mailto:${props.venue.email}`}>
                <LiaEnvelope size={60} />
                {props.venue.email}
            </a>
        </Col>
    );
}

function VenueMiddle(props: VenueProps) {
    return (
        <Col>
            <br />
            <h3 className="mb-3">About</h3>
            {props.venue.Bio ? <div>{props.venue.Bio.description}</div> : (
                "Nothing to show"
            )}
        </Col>
    );
}

function VenueRight(props: VenueProps) {
    return (
      <Col>
          <Row className="mb-3">
              <h1>Posts</h1>
              <IoNewspaperSharp size={300} />
          </Row>
          <Row>
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
      </Col>
    );
}
