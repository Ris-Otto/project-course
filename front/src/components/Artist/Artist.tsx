// @deno-types="npm:@types/react"
import { useEffect, useState, useMemo } from "react";
import { getRequest, postRequest } from "../../api/APITemplate.ts";
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Col, Button, Tab, Tabs } from "react-bootstrap";
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
import {StyledArtistProfile, StyledListBox} from "../User/StyledProfile.tsx";
import { useAtom } from "jotai";
import { user } from "../../store.ts";
import {PageState, StateHandler, SubState} from "../../utilities/Types.tsx";
import { FollowHeartButton } from "../Misc/MiscComponents.tsx";
import Grid from "../Misc/Grid.tsx";
import { Member } from "../../../../api/Database/Model/Member.ts";
import {compareArrays, Control, DynamicListForm, TextArea, UnderwaveHeader} from "../../utilities/Functions.tsx";
import {EditableProfileHeaders, EditableProfileMenu} from "../Misc/EditableProfileBase.tsx";
import cd from "../../resources/Images-Assets/cd+cover.png";
import { useImageDimensions} from "../../Hooks.ts";
import { Theme } from "../../theme.ts"
import { Row, FlexCol } from "../Misc/CustomStyles.tsx";
import {Link} from "../../../../api/Database/Model/Link.ts";
import {urlPattern} from "../../utilities/Regex.ts";
import {Media} from "../../../../api/Database/Model/Media.ts";
import { ProfilePicture } from "../Misc/ProfilePicture.tsx";


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

declare type ArtistProfileProps = {
  value: Artist;
  subState: SubState;
  updateSubState: (subState: SubState, refetch?: boolean) => void;
  pageState: PageState;
  setPageState: StateHandler<PageState>;

}

export function ArtistProfile({value, subState, updateSubState, setPageState, pageState}: ArtistProfileProps) {

  return (

        <Grid
            header={value.name}
            narrowColumnIndex={0}
            wideColumnIndex={1}
        >
          <EditableProfileMenu pageState={pageState} setPageState={setPageState} updateSubState={updateSubState} />
          <div style={{ borderLeft: "1px solid black", paddingLeft: "50px" }}>
            {pageState === "profile" ? (
                <ArtistViewProfile
                    artist={value}
                    subState={subState}
                    updateSubState={updateSubState}
                />
            ) : pageState === "events" ? (
                <ArtistEvents
                    subState={subState}
                    artist={value}
                    updateSubState={updateSubState}
                />
            ) : null}
          </div>
        </Grid>

  );
}

function ArtistViewProfile({ artist, subState, updateSubState }: { artist: Artist, subState: SubState, updateSubState: (subState: SubState, refetch?: boolean) => void }) {
  const { dimensions, handleImageLoad } = useImageDimensions();
  const t = useMemo(() => new Theme(), []);
  const [name, setName] = useState(artist.name);
  const [email, setEmail] = useState(artist.email);
  const [bio, setBio] = useState(artist.Bio ? artist.Bio.description : "");
  const [members, setMembers] = useState(artist.Members);
  const [genre, setGenre] = useState(artist.genre);
  const [poster, setPoster] = useState("")
  const [images, setImages] = useState<Media[]>(artist.Bio?.Media ? artist.Bio.Media :[]);
  const [links, setLinks] = useState<Link[]>(artist.Bio?.Links ? artist.Bio.Links : []);

  async function submit() {}
  function reset() {
    setName(artist.name);
    setEmail(artist.email);
    setBio(artist.Bio ? artist.Bio.description : "");
    setMembers(artist.Members);
    setGenre(artist.genre);
    setPoster("");
    setImages(artist.Bio?.Media ? artist.Bio.Media :[]);
    setLinks(artist.Bio?.Links ? artist.Bio.Links : []);
  }

  const edit = useMemo(() => subState === "edit", [subState]);

  return (
    <>
    <EditableProfileHeaders subState={subState} updateSubState={updateSubState} submit={submit} reset={reset} />
      <div className="profile">
        <Grid>
          <FlexCol>
            <div className="silly-row-start">
              <ProfilePicture image={cd} dimensions={dimensions} handleImageLoad={handleImageLoad} />
              <Control
                as={"h3"}
                header={"Artist name"}
                state={name}
                color={t.redBrown}
                setState={edit ? setName : undefined}
              />

            </div>
            <Row justifycontent="start">
            <FlexCol>
              <DynamicListForm
                requiredKeys={["name"]}
                array={members}
                header={"Members"}
                as="h3"
                color={t.redBrown}
                pattern={/.+/}
                setArray={setMembers}
                template={{ name: ""}}
                disabled={!edit}
              />
              <Control
                className="mt-3"
                header={"Sample"}
                as="h3" state={""}
                setState={undefined}
                color={t.redBrown}
              />
              <DynamicListForm
                header={"Links"}
                as="h3"
                color={t.redBrown}
                array={links}
                setArray={setLinks}
                pattern={urlPattern}
                template={{ url: "" }}
                disabled={!edit}
              />
            </FlexCol>
            </Row>
          </FlexCol>
          <FlexCol>
            <Control
              header="Genre"
              as="h3"
              state={genre}
              setState={edit ? setGenre : undefined}
              color={t.redBrown}
            />
            <TextArea
              header="Bio"
              as="h3"
              state={bio}
              setState={edit ? setBio : undefined}
              color={t.redBrown}
            />
            <div className="mt-3">
              <UnderwaveHeader
                header="Contact"
                as="h3"
                color={t.redBrown}
                disabled={!edit}
              />
              <Row justifycontent="start">
                <LiaEnvelope
                  size={45}
                  style={{ marginBottom: "5px", color: edit ? t.redBrown : "grey" }} />
                <Control
                  state={email}
                  setState={edit ? setEmail : undefined}
                />
              </Row>
            </div>
            <UnderwaveHeader header="Images" as="h3" color={t.redBrown} disabled={!edit} />
            <div style={{display: "flex", justifyContent: "left"}}>
            <div style={{overflowX: "auto", width:"30vw", display: "inline-block", whiteSpace:"nowrap"}}  className="mt-3">
              {[0,1,2,3,4,5,6,7].map((i, idx) => {
                return <ArtistImage image={{href: cd}} key={idx}/>
              })}
            </div>
            </div>
          </FlexCol>
        </Grid>
      </div>
    </>
  )
}

function ArtistImage({image}:{image: Partial<Media>}) {
  return <img className="p-3" src={image.href} alt={"Image"} style={{width: "140px", height: "140px"}}/>
}

function ArtistEvents({ artist, subState, updateSubState }: { artist: Artist, subState: SubState, updateSubState: (subState: SubState, refetch?: boolean) => void }) {
  return <div></div>;
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
      {/*<DynamicListForm
        header="Members"
        array={ms}
        setArray={setMs}
        pattern={/[A-Öa-ö]+/}
        template={{ name: "", role: "" }}
      />*/}
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
