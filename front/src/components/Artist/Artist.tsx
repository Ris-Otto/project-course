// @deno-types="npm:@types/react"
import { useEffect, useState } from "react";
import { getRequest, postRequest } from "../../api/APITemplate.ts";
import paths from "../../../../Shared/paths.ts";
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Row, Col, Button, Tab, Tabs } from "react-bootstrap";
import { IoImageOutline, IoNewspaperSharp } from "react-icons/io5";
import {
  LiaEnvelope,
  LiaHeart,
  LiaHeartSolid,
  LiaShareAltSquareSolid,
} from "react-icons/lia";
import type { Artist } from "../../../../api/Database/Model/Artist.ts";
import { Strong } from "../Event/Event.styled.ts";
import { EventCalendar } from "../Event/EventCalendar.tsx";
import { StyledArtistProfile, StyledListBox } from "../User/StyledProfile.tsx";
import { useAtom } from "jotai";
import { user } from "../../store.ts";
import type { StateHandler } from "../../utilities/Types.tsx";
import { FollowHeartButton } from "../Misc/MiscComponents.tsx";
import Grid from "../Misc/Grid.tsx";
import { Member } from "../../../../api/Database/Model/Member.ts";
import { DynamicListForm, compareArrays } from "../../utilities/Functions.tsx";

export default function ArtistProfilePublic() {
  const [sp] = useSearchParams();
  const [a, setA] = useState<Artist>();
  const [followed, setFollowed] = useState(false);
  useEffect(() => {
    async function getData() {
      const data = await getRequest<Artist>(
        `artist/public/${sp.get("artistId")}`,
      );
      if (data.isSuccess()) {
        setA(data.response);
      }
      const following = await getRequest<Artist[]>(`user/artists/following`);
      if (following.isSuccess()) {
        const filtered = following.response.filter(
          (a) => a.id === data.response.id,
        );
        if (filtered.length === 1) {
          setFollowed(true);
        }
      }
    }
    getData();
  }, []);

  return (
    <StyledArtistProfile className="top-level-component">
      {a ? (
        <Grid header={a.name}>
          <ArtistLeft
            artist={a}
            followed={followed}
            setFollowed={setFollowed}
          />
          <ArtistMiddle
            artist={a}
            followed={followed}
            setFollowed={setFollowed}
          />
          <ArtistRight
            artist={a}
            followed={followed}
            setFollowed={setFollowed}
          />
        </Grid>
      ) : null}
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

  if (!a) {
    return null;
  }

  return (
    <Grid header={a.name}>
      <div>Create post</div>
      <ArtistMembers members={a.Members} />
      <div>Event invites</div>
    </Grid>
  );
}

export function ArtistMembers({ members }: { members: Member[] }) {
  const [ms, setMs] = useState(() =>
    members.map((m) => {
      return {
        name: m.name,
        role: m.Roles.find((r) => r.MemberId === m.id)?.description,
      };
    }),
  );

  const [ogMems] = useState(() => ms);

  async function submit() {
    console.log(compareArrays(ogMems, ms));
  }

  return (
    <div>
      <DynamicListForm
        header="Members"
        array={ms}
        setArray={setMs}
        pattern={/[A-Öa-ö]+/}
        template={{ name: "", role: "" }}
      />
      <Button onClick={submit}>Submit changes</Button>
    </div>
  );
}

export function ArtistBox({ artist, followed }: ArtistBoxProps) {
  const navigate = useNavigate();
  const [u, _] = useAtom(user);
  const [fState, setFState] = useState<"empty" | "filled">("empty");

  async function FollowArtist() {
    await postRequest(`/user/artists/follow/${artist.id}`);
  }
  return (
    <StyledListBox>
      <Row hidden={!u || followed} className="follow-heart-right">
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
            pathname: `/artists/public`,
            search: createSearchParams({
              artistId: artist.id,
            }).toString(),
          })
        }
      >
        <IoImageOutline size={200} />
        <br />
        <Strong>{artist.name}</Strong>
      </Row>
    </StyledListBox>
  );
}

export function ArtistList({ artists, followed }: ListProps) {
  return (
    <div className="artist-list">
      {artists.map((a, i) => {
        return <ArtistBox artist={a} key={i} followed={followed} />;
      })}
    </div>
  );
}

type ListProps = {
  artists: Artist[];
  followed?: boolean;
};

type ArtistProps = ArtistBoxProps & {
  setFollowed: StateHandler<boolean>;
};

type ArtistBoxProps = {
  artist: Artist;
  followed?: boolean;
};

function ArtistLeft(props: ArtistProps) {
  const [u, _] = useAtom(user);
  const [fState, setFState] = useState<"empty" | "filled">(() =>
    props.followed ? "filled" : "empty",
  );

  async function followUnfollowArtist() {
    const a = props.followed
      ? await postRequest(`/user/artists/unfollow/${props.artist.id}`)
      : await postRequest(`/user/artists/follow/${props.artist.id}`);
    if (a.isSuccess()) {
      props.setFollowed((a) => !a);
    }
  }

  useEffect(() => {
    setFState(() => (props.followed ? "filled" : "empty"));
  }, [props.followed]);
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
        <FollowHeartButton
          fState={fState}
          setFState={setFState}
          followArtist={followUnfollowArtist}
          followed={props.followed}
        />
      </div>
      <a style={{ marginLeft: 30 }} href={`mailto:${props.artist.email}`}>
        <LiaEnvelope size={60} />
        {props.artist.email}
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
            <Col>
              {m.Roles.map((r) => {
                return r.MemberId === m.id ? r.description : null;
              })}
            </Col>
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
    <Col>
      <Row className="mb-3">
        <h1>Posts</h1>
        <IoNewspaperSharp size={300} />
      </Row>
      <Row>
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
      </Row>
    </Col>
  );
}

export function AllArtists() {}
