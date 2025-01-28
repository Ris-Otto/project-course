// @deno-types="npm:@types/react"
import React, { useEffect, useState, useMemo } from "react";
import { getRequest, postRequest } from "../../api/APITemplate.ts";
import paths from "../../../../Shared/paths.ts";
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import {
  Row,
  Col,
  Button,
  Tab,
  Tabs,
  Container,
  FormControl,
} from "react-bootstrap";
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
import { StyledArtistProfile, StyledListBox } from "./StyledProfile.tsx";
import { useAtom } from "jotai";
import { user } from "../../store.ts";
import { GoArrowLeft } from "react-icons/go";
import type { Venue } from "../../../../api/Database/Model/Venue.ts";
import Grid from "../Misc/Grid.tsx";
import { Loading } from "../../utilities/Loading.tsx";
import { StyledVenueProfile } from "./StyledProfile.tsx";
import {
  cfl,
  Control,
  TextArea,
  UnderwaveHeader,
} from "../../utilities/Functions.tsx";
import { Theme } from "../../theme.ts";
import cd from "../../resources/Images-Assets/cd+cover.png";
import { logout } from "../../api/auth.ts";
import { ObjectEntries } from "../../utilities/Types.tsx";

export default function VenueProfilePublic() {
  const [sp] = useSearchParams();
  const [a, setA] = useState<Venue>();

  const [u, _] = useAtom(user);
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
      style={{ textAlign: "left" }}
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
type PageState = "profile" | "events" | "posts" | "account" | "settings";
const PageStates: PageState[] = [
  "profile",
  "events",
  "posts",
  "account",
  "settings",
] as const;

export function VenueProfile() {
  const [a, setA] = useState<Venue>();
  const [pageState, setPageState] = useState<PageState>("profile");
  const [subState, setSubState] = useState<"view" | "edit" | "add">("view");
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    async function getData() {
      const data = await getRequest<Venue>(`${paths.venue.self}`);
      if (data.isSuccess()) {
        setA(data.response);
      }
    }
    getData();
  }, []);

  if (!a) return <Loading />;

  return (
    <StyledVenueProfile>
      <div style={{ textAlign: "right" }}>
        <Grid header={a.name} narrowColumnIndex={0} wideColumnIndex={1}>
          <div
            style={{
              borderRight: "1px solid black",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              minHeight: "min-content",
            }}
          >
            {PageStates.map((s, i) => {
              return (
                <Button
                  key={i}
                  className={
                    pageState === s ? "selected-page-state mb-3" : "mb-3"
                  }
                  onClick={() => setPageState(s)}
                  disabled={pageState === s}
                >
                  {cfl(s)}
                </Button>
              );
            })}
            <Button style={{ marginTop: "10vh" }} onClick={() => logout()}>
              Sign out
            </Button>
          </div>
          <VenueViewProfile venue={a} edit={edit} setEdit={setEdit} />
        </Grid>
      </div>
    </StyledVenueProfile>
  );
}

export function VenueViewProfile({
  venue,
  edit,
  setEdit,
}: {
  venue: Venue;
  edit;
  setEdit;
}) {
  const openingHours = {
    mon: { from: "18:00", to: "01:00", closed: true },
    tue: { from: "18:00", to: "01:00", closed: false },
    wed: { from: "18:00", to: "01:00", closed: false },
    thu: { from: "19:00", to: "02:00", closed: false },
    fri: { from: "20:00", to: "03:00", closed: false },
    sat: { from: "20:00", to: "04:00", closed: false },
    sun: { from: "16:00", to: "23:00", closed: false },
  };
  const t = useMemo(() => new Theme(), []);
  const [dimensions, setDimensions] = useState({ height: 100, width: 100 });

  const [name, sname] = useState(() => venue.name);
  const [addr, saddr] = useState(() => venue.address);
  const [zip, szip] = useState(() => venue.zip);
  const [city, scity] = useState(() => venue.city);
  const [hrs, shrs] = useState(() => openingHours);

  const handleImageLoad = (e) => {
    const { naturalHeight, naturalWidth } = e.target;
    const ratio = naturalWidth / naturalHeight;
    const maxHeight = globalThis.innerHeight / 8;
    setDimensions({ height: maxHeight, width: maxHeight * ratio });
  };
  return (
    <Row>
      <Grid>
        <h2>Profile</h2>
        <div style={{ textAlign: "right" }}>
          {edit ? (
            <>
              <Button
                style={{
                  backgroundColor: t.teal,
                  color: "#fff",
                }}
                onClick={() => setEdit(false)}
              >
                Cancel
              </Button>
              <Button
                style={{
                  backgroundColor: t.teal,
                  color: "#fff",
                }}
              >
                Save
              </Button>
            </>
          ) : (
            <Button
              style={{
                backgroundColor: t.teal,
                color: "#fff",
              }}
              onClick={() => setEdit(true)}
            >
              Edit
            </Button>
          )}
        </div>
      </Grid>

      <div className="profile">
        <Grid>
          <Col>
            <div className="silly-row-sb">
              <img
                src={cd}
                alt={"Profile picture"}
                style={{
                  width: `${dimensions.width}px`,
                  height: `${dimensions.height}px`,
                  marginRight: "10%",
                }}
                onLoad={handleImageLoad}
              />

              <Control
                header={"Venue name"}
                state={name}
                color={t.redBrown}
                setState={edit ? sname : undefined}
              />
            </div>

            <Control
              header={"Street address"}
              state={addr}
              color={t.redBrown}
              setState={edit ? saddr : undefined}
            />
            <div className="silly-row-sb">
              <Control
                header={"Postal/ZIP-code"}
                state={zip}
                color={t.redBrown}
                setState={edit ? szip : undefined}
              />
              <Control
                header={"City"}
                state={city}
                color={t.redBrown}
                setState={edit ? scity : undefined}
              />
            </div>
            <div style={{ alignItems: "center" }}>
              <UnderwaveHeader
                as="h2"
                header={"Opening hours"}
                color={t.redBrown}
              />
              {ObjectEntries(hrs).map(([k, v], i) => {
                return (
                  <Grid
                    key={i}
                    margin="0px"
                    cPadding="0px"
                    padding="0px"
                    gap="0px"
                  >
                    <div
                      style={{
                        textAlign: "left",
                      }}
                    >
                      {cfl(k)}
                    </div>
                    <div className="silly-row-sb">
                      {!v.closed ? (
                        <>
                          <Control state={v.from} />
                          <div
                            style={{
                              marginRight: "10px",
                              marginLeft: "10px",
                            }}
                          >
                            -
                          </div>
                          <Control state={v.to} />
                        </>
                      ) : (
                        <div
                          style={{
                            marginRight: "10px",
                            marginLeft: "10px",
                            marginBottom: "10px",
                          }}
                        >
                          Closed
                        </div>
                      )}
                    </div>
                    <div></div>
                  </Grid>
                );
              })}
            </div>
          </Col>
          <Col>
            <TextArea
              header="Bio"
              as="h2"
              state={venue.Bio?.description ? venue.Bio.description : ""}
              color={t.redBrown}
            />
            <Control />
          </Col>
        </Grid>
      </div>
    </Row>
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
            pathname: `/venues/public`,
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
          hidden={!u}
          onMouseEnter={() => setFState("filled")}
          onMouseLeave={() => setFState("empty")}
          onClick={async () => await FollowVenue()}
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
