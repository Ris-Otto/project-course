import React, { useEffect, useState } from "react";
import { getRequest, postRequest } from "../../api/APITemplate.ts";
import paths from "../../../../Shared/paths.ts";
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Row, Col, Button, Tab, Tabs, Container } from "react-bootstrap";
import { IoImageOutline, IoNewspaperSharp } from "react-icons/io5";
import {
  LiaEnvelope,
  LiaHeart,
  LiaHeartSolid,
  LiaShareAltSquareSolid,
} from "react-icons/lia";
import type { Artist } from "../../../../api/Database/Model/Artist.ts";
import { Strong } from "../Misc/Event.styled.ts";
import PageHeader from "../Misc/PageHeader.tsx";
import { EventCalendar } from "../Misc/EventCalendar.tsx";
import { StyledArtistProfile } from "./StyledProfile.tsx";
import { useAtom } from "jotai";
import { user } from "../../store.ts";
import { GoArrowLeft } from "react-icons/go";
import type { Venue } from "../../../../api/Database/Model/Venue.ts";

export default function VenueProfilePublic() {
  const [sp] = useSearchParams();
  const [a, setA] = useState<Artist>();
  const navigate = useNavigate();
  useEffect(() => {
    async function getData() {
      const data = await getRequest<Artist>(
        `venue/public/${sp.get("venueId")}`,
      );
      if (data.isSuccess()) {
        setA(data.response);
      }
    }
    getData();
  }, []);

  return (
    <StyledArtistProfile
      className="top-level-component"
      style={{ marginTop: "60px", textAlign: "left" }}
    >
      {/*@ts-ignore bah*/}
      <GoArrowLeft onClick={() => navigate(-1)} className="back-arrow-3" />
      <Container>
        {a ? (
          <div style={{ textAlign: "left" }}>
            <div>
              <PageHeader header={a.name} className="mb-3" />
              <Row>
                <VenueLeft venue={a} />
                <VenueMiddle venue={a} />
                <VenueRight venue={a} />
              </Row>
            </div>
          </div>
        ) : null}
      </Container>
    </StyledArtistProfile>
  );
}

export function VenueProfile() {
  const [a, setA] = useState<Venue>();
  useEffect(() => {
    async function getData() {
      const data = await getRequest<Venue>(`${paths.artist.self}`);
      if (data.isSuccess()) {
        setA(data.response);
      }
    }
    getData();
  }, []);
}

export function VenueBox({ venue }: VenueProps) {
  const navigate = useNavigate();
  const [u, _] = useAtom(user);
  const [fState, setFState] = useState<"empty" | "filled">("empty");

  async function FollowVenue() {
    await postRequest(`/user/venue/follow/${venue.id}`);
  }
  return (
    <div className="artist-box">
      <Row hidden={!u} className="follow-heart-right">
        <Col
          xs={2}
          md={{ span: 2, offset: 10 }}
          onMouseEnter={() => setFState("filled")}
          onMouseLeave={() => setFState("empty")}
          onClick={async () => await FollowVenue()}
        >
          {fState === "empty" ? (
            <LiaHeart size={30} />
          ) : (
            <LiaHeartSolid size={30} />
          )}
        </Col>
      </Row>
      <Row
        onClick={() =>
          navigate({
            pathname: `/venue`,
            search: createSearchParams({
              venueId: venue.id,
            }).toString(),
          })
        }
      >
        <IoImageOutline size={200} />
        <br />
        <Strong>{venue.name}</Strong>
      </Row>
    </div>
  );
}

export function VenueList({ venues }: ListProps) {
  return (
    <div className="artist-list">
      {venues.map((a, i) => {
        return <VenueBox venue={a} key={i} />;
      })}
    </div>
  );
}

type ListProps = {
  venues: Venue[];
};

type VenueProps = {
  venue: Venue;
};

function VenueLeft(props: VenueProps) {
  const [u, _] = useAtom(user);
  const [fState, setFState] = useState<"empty" | "filled">("empty");

  async function FollowArtist() {
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
          hidden={!u}
          onMouseEnter={() => setFState("filled")}
          onMouseLeave={() => setFState("empty")}
          onClick={async () => await FollowArtist()}
          className="follow-share-button mb-3"
        >
          {fState === "empty" ? (
            <LiaHeart size={30} />
          ) : (
            <LiaHeartSolid size={30} />
          )}
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
      {props.venue.Bio ? (
        <div>{props.venue.Bio.description}</div>
      ) : (
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
          <Tab eventKey="past" title="Past events" style={{ margin: "5px" }}>
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

export function AllVenues() {}
