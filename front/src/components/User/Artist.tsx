import React, { useEffect, useState } from "react";
import { getRequest, postRequest } from "../../api/APITemplate.ts";
import paths from "../../../../Shared/paths.ts";
import { createSearchParams, useNavigate, useSearchParams } from "react-router-dom";
import { Row, Col, Button, Tab, Tabs, Container } from "react-bootstrap";
import { IoImageOutline, IoNewspaperSharp } from "react-icons/io5";
import { LiaEnvelope, LiaHeart, LiaHeartSolid, LiaShareAltSquareSolid } from "react-icons/lia";
import type { Artist } from "../../../../api/Database/Model/Artist.ts";
import {Strong} from "../Misc/Event.styled.ts";
import PageHeader from "../Misc/PageHeader.tsx";
import { EventCalendar } from "../Misc/EventCalendar.tsx";
import { StyledArtistProfile } from "./StyledProfile.tsx";
import { useAtom } from "jotai";
import { user } from "../../store.ts";
import { GoArrowLeft } from "react-icons/go";
import type { Venue } from "../../../../api/Database/Model/Venue.ts";

const ProfileContext = React.createContext({ artist: null, venue: null});

export function PublicProfile<T>({type, children}: {type: "artist" | "venue", children: React.ReactNode}) {
  const [sp] = useSearchParams();
  const [cv, setCV] = useState<{ artist: Artist | null, venue: Venue | null}>({ artist: null, venue: null});
  useEffect(() => {
    async function getData() {
      const data = await getRequest<T>(
        `${type}/public/${sp.get(`${type}Id`)}`,
      );
      if (data.isSuccess()) {

        setCV(type === "artist" ? { artist: data.response, venue: null} : { artist: null, venue: data.response} )
      }
    }
    getData();
  }, []);

  return (
    <ProfileContext.Provider value={cv}>
      {children}
    </ProfileContext.Provider>
  )
}

export default function ArtistProfilePublic() {
  const [sp] = useSearchParams();
  const [a, setA] = useState<Artist>();
  const navigate = useNavigate();
  useEffect(() => {
    async function getData() {
      const data = await getRequest<Artist>(
        `artist/public/${sp.get("artistId")}`,
      );
      if (data.isSuccess()) {
        setA(data.response);
      }
    }
    getData();
  }, []);

  return (
    <StyledArtistProfile className="top-level-component" style={{marginTop: "60px", textAlign: "left"}}>
      {/*@ts-ignore bah*/}
      <GoArrowLeft onClick={() => navigate(-1)} className="back-arrow-3" />
      <Container>
      {a
        ? (
          <div style={{ textAlign: "left" }}>
            <div>
              <PageHeader header={a.name} className="mb-3" />
              <Row>
                <ArtistLeft artist={a} />
                <ArtistMiddle artist={a} />
                <ArtistRight artist={a} />
              </Row>
            </div>
          </div>
        )
        : null}
        </Container>
    </StyledArtistProfile>
    
  );
}

export function ArtistProfile() {
  const [a, setA] = useState<Artist>();
  useEffect(() => {
    async function getData() {
      const data = await getRequest<Artist>(`${paths.artist.self}`);
      if (data.isSuccess()) {
        setA(data.response);
      }
    }
    getData();
  }, []);
}

export function ArtistBox({artist}: ArtistProps) {
  const navigate = useNavigate();
  const [u,_] = useAtom(user);
  const [fState, setFState] = useState<"empty" | "filled">("empty");

  async function FollowArtist() {
    await postRequest(`/user/artists/follow/${artist.id}`);
  }
  return (
    <div className="artist-box">
      <Row 
        hidden={!u}
        className="follow-heart-right"
      >
        <Col 
          xs={2}
          md={{ span: 2, offset: 10 }}
          onMouseEnter={() => setFState("filled")} 
          onMouseLeave={() => setFState("empty")} 
          onClick={async () => await FollowArtist()} 
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
            pathname: `/artist`,
            search: createSearchParams({
              artistId: artist.id,
            }).toString(),
          })}
      >
        <IoImageOutline size={200}/>
        <br/>
        <Strong>{artist.name}</Strong>
      </Row>
    </div>
  )
}

export function ArtistList({artists}: ListProps) {
  return (
    <div className="artist-list">
      {artists.map((a, i) => {
        return <ArtistBox artist={a} key={i} />
      })}
    </div>
)
}

type ListProps = {
    artists: Artist[];
}


type ArtistProps = {
  artist: Artist;
}

function ArtistLeft(props: ArtistProps) {
  const [u,_] = useAtom(user)
  const [fState, setFState] = useState<"empty" | "filled">("empty");

  async function FollowArtist() {
    await postRequest(`/user/artists/follow/${props.artist.id}`);
  }
  return (
    <Col>
      <IoImageOutline size={350} />
      <br/>
      <div style={{textAlign: "left",marginLeft: 30}}>
        <Button style={{marginRight: "10px"}} className="follow-share-button mb-3">
          <LiaShareAltSquareSolid size={30}/>
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
      <a style={{marginLeft: 30}}href={`mailto:${props.artist.email}`}><LiaEnvelope size={60} />{props.artist.email}</a>
      
    </Col>
  );
}

function ArtistMiddle(props: ArtistProps) {
  return (
    <Col>
      <h3>Members</h3>
      {props.artist.Members.map((m, idx) => {
        return <Row key={idx}>
          <Col>{m.name}</Col>
          <Col>{m.Roles.map((r) => {return r.MemberId === m.id ? r.description : null})}</Col>
        </Row>
      })}
      <br/>
      <h3 className="mb-3">About</h3>
      {props.artist.Bio ? (<div>{props.artist.Bio.description}</div>) : "Nothing to show"}
    </Col>
  )
}

function ArtistRight(props: ArtistProps) {
  return (
    <Col>
      <Row className="mb-3">
        <h1>Posts</h1>
        <IoNewspaperSharp size={300} />
      </Row>
      <Row>
        <Tabs fill>
          <Tab eventKey="upcoming" title="Upcoming performances" style={{margin: "5px"}}>
            <EventCalendar events={props.artist.Events.filter(a => new Date(a.start) > new Date())} />
          </Tab>
          <Tab eventKey="past" title="Past performances" style={{margin: "5px"}}>
            <EventCalendar events={props.artist.Events.filter(a => new Date(a.start) <= new Date())} />
          </Tab>
        </Tabs>
      </Row>
    </Col>
  )
}


export function AllArtists() {

}