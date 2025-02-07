// @deno-types="npm:@types/react"
import React, { useEffect, useState, useMemo } from "react";
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
  LiaPencilAltSolid,
  LiaPhoneAltSolid,
  LiaShareAltSquareSolid,
  LiaSave,
  LiaTrashAltSolid,
  LiaPlusSolid,
  LiaCalendarWeekSolid,
  LiaClock,
} from "react-icons/lia";
import { GiTicket } from "react-icons/gi";
import { IoLocationSharp } from "react-icons/io5";
import { Strong } from "../Event/Event.styled.ts";
import { EventCalendar } from "../Event/EventCalendar.tsx";
import { StyledArtistProfile, StyledListBox } from "./StyledProfile.tsx";
import { useAtom } from "jotai";
import { user } from "../../store.ts";
import { GoArrowLeft } from "react-icons/go";
import type { Venue } from "../../../../api/Database/Model/Venue.ts";
import Grid from "../Misc/Grid.tsx";
import { Loading } from "../../utilities/Loading.tsx";
import { StyledVenueProfile, EditButton, Circle } from "./StyledProfile.tsx";
import {
  cfl,
  Control,
  TextArea,
  UnderwaveHeader,
} from "../../utilities/Functions.tsx";
import { Theme } from "../../theme.ts";
//@ts-ignore bah
import cd from "../../resources/Images-Assets/cd+cover.png";
import { logout } from "../../api/auth.ts";
import { ObjectEntries, type StateHandler } from "../../utilities/Types.tsx";
import {
  DynamicListForm,
  ToCurrencySymbol,
} from "../../utilities/Functions.tsx";
import { StyledHoverEvent } from "../Event/EventCalendar.tsx";
import Event from "../../../../api/Database/Model/Event.ts";

import { useImageDimensions } from "../../Hooks.ts";
import { EditEvent } from "./Venue/EditEvent.tsx";
import { useAuth } from "../Auth.tsx";

export default function VenueProfilePublic() {
  const [sp] = useSearchParams();
  const [a, setA] = useState<Venue>();

  const [u, _] = useAtom(user);
  const navigate = useNavigate();
  useEffect(() => {
    async function getData() {
      const data = await getRequest<Venue>(`venue/public/${sp.get("venueId")}`);
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
          <Grid header={a.name}>
            <VenueLeft venue={a} />
            <VenueMiddle venue={a} />
            <VenueRight venue={a} />
          </Grid>
        ) : /* </div> */
        null}
      </Container>
    </StyledArtistProfile>
  );
}
type PageState = "profile" | "events" | "account" | "settings";
const PageStates: PageState[] = [
  "profile",
  "events",
  /* "account",
  "settings", */
] as const;

type SubState = "view" | "edit" | "add";

export function VenueProfile() {
  const [a, setA] = useState<Venue>();
  const [pageState, setPageState] = useState<PageState>("profile");
  const [subState, setSubState] = useState<SubState>("view");
  useAuth();

  useEffect(() => {
    async function getData() {
      const data = await getRequest<Venue>(`${paths.venue.self}`);
      if (data.isSuccess()) {
        setA(data.response);
      }
    }
    getData();

    return () => {
      setSubState("view");
      setPageState("profile");
    };
  }, []);

  if (!a) return <Loading />;

  return (
    <StyledVenueProfile>
      <div style={{ textAlign: "right" }}>
        <Grid header={a.name} narrowColumnIndex={0} wideColumnIndex={1}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              minHeight: "min-content",
              minWidth: "max-content",
              maxWidth: "max-content",
            }}
          >
            {PageStates.map((s, i) => {
              return (
                <Button
                  key={i}
                  className={
                    pageState === s ? "selected-page-state mb-3" : "mb-3"
                  }
                  onClick={() => {
                    setPageState(s);
                    setSubState("view");
                  }}
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
          <div style={{ borderLeft: "1px solid black", paddingLeft: "50px" }}>
            {pageState === "profile" ? (
              <VenueViewProfile
                venue={a}
                subState={subState}
                setSubState={setSubState}
              />
            ) : pageState === "events" ? (
              <VenueEvents
                venue={a}
                subState={subState}
                setSubState={setSubState}
              />
            ) : null}
          </div>
        </Grid>
      </div>
    </StyledVenueProfile>
  );
}

export function VenueAddEvent({
  venue,
  subState,
  setSubState,
}: {
  venue: Venue;
  subState: SubState;
  setSubState: StateHandler<SubState>;
}) {}

export function VenueEvents({
  venue,
  subState,
  setSubState,
}: {
  venue: Venue;
  subState: SubState;
  setSubState: StateHandler<SubState>;
}) {
  const add = useMemo(() => subState === "add", [subState]);
  const edit = useMemo(() => subState === "edit", [subState]);
  const [events, sevents] = useState(() => venue.Events);
  const [currentEvent, setCurrentEvent] = useState<Event>();
  return (
    <>
      <div className="silly-row-sb">
        <h2>
          {add ? "Create event" : edit ? "Edit event" : "Published events"}
        </h2>
        <div>
          {add ? (
            <>
              <EditButton onClick={() => setSubState("view")}>
                Cancel
              </EditButton>
              <EditButton onClick={() => setSubState("view")}>
                Create
              </EditButton>
            </>
          ) : edit ? (
            <>
              <EditButton onClick={() => setSubState("view")}>
                Cancel
              </EditButton>
              <EditButton onClick={() => setSubState("view")}>Save</EditButton>
            </>
          ) : (
            <EditButton onClick={() => setSubState("add")}>
              New Event
              <LiaPlusSolid size={25} style={{ marginLeft: "5px" }} />
            </EditButton>
          )}
        </div>
      </div>
      {subState === "view" ? (
        <div className="silly-row-start">
          {events.map((a, i) => (
            <div key={i} style={{ margin: "2%" }}>
              <VenueEvent
                event={a}
                setCurrentEvent={setCurrentEvent}
                setSubState={setSubState}
              />
            </div>
          ))}
        </div>
      ) : subState === "add" ? (
        <VenueAddEvent
          venue={venue}
          subState={subState}
          setSubState={setSubState}
        />
      ) : subState === "edit" ? (
        <EditEvent event={currentEvent!} />
      ) : null}
    </>
  );
}

export function VenueEvent({
  event,
  setCurrentEvent,
  setSubState,
}: {
  event: Event;
  setCurrentEvent?: React.Dispatch<React.SetStateAction<Event | undefined>>;
  setSubState?: React.Dispatch<React.SetStateAction<SubState>>;
}): React.ReactNode {
  const startTime = useMemo(() => {
    const time = new Date(event.start).toTimeString().split(" ")[0];
    const split = time.split(":");
    return `${split[0]}:${split[1]}`;
  }, [event]);
  const endTime = useMemo(() => {
    const time = new Date(event.end).toTimeString().split(" ")[0];
    const split = time.split(":");
    return `${split[0]}:${split[1]}`;
  }, [event]);
  const { dimensions, handleImageLoad } = useImageDimensions(
    globalThis.innerHeight / 6,
  );
  const p = useMemo(() => dimensions.width * 0.12, [dimensions]);

  return (
    <StyledHoverEvent
      style={{
        minWidth: `${dimensions.width}px`,
      }}
      padding={String(p)}
    >
      {setSubState && setCurrentEvent ? (
        <div style={{ textAlign: "right" }}>
          <Button
            onClick={() => {
              setCurrentEvent(event);
              setSubState("edit");
            }}
          >
            <LiaPencilAltSolid size={30} />
          </Button>
          <Button>
            <LiaTrashAltSolid size={30} />
          </Button>
        </div>
      ) : null}
      <div className="silly-column-sb" style={{ marginTop: "5%" }}>
        <EventPicture
          onImageLoad={handleImageLoad}
          dimensions={dimensions}
          name={event.name}
          age={!!event.age}
        />
        <div
          className="event-description mt-3 mb-3"
          style={{ maxWidth: `${dimensions.width}px` }}
        >
          {event.Bio.description}
        </div>
        <div>
          <LiaCalendarWeekSolid size={30} style={{ marginRight: "5px" }} />
          {new Date(event.start).toDateString()}
        </div>
        <div>
          <LiaClock size={30} style={{ marginRight: "5px" }} />
          {startTime} - {endTime}
        </div>
        <div>
          <GiTicket size={30} style={{ marginRight: "5px" }} />
          {event.Pricing.amount} {ToCurrencySymbol(event.Pricing.currency)}
        </div>
        <div>
          <IoLocationSharp size={30} style={{ marginRight: "5px" }} />
          {event.Venue.address}
        </div>
      </div>
    </StyledHoverEvent>
  );
}

function EventPicture({
  onImageLoad,
  dimensions,
  name,
  age,
}: {
  onImageLoad: (e) => void;
  dimensions: {
    width: number;
    height: number;
  };
  name: string;
  age?: boolean;
}) {
  return (
    <div className="event-picture">
      <h4 className="event-picture-name">{name}</h4>
      {age ? <Circle className="event-picture-age">18+</Circle> : null}
      <img
        onLoad={onImageLoad}
        style={{
          borderRadius: "10px",
          width: `${dimensions.width}px`,
          height: `${dimensions.height}px`,
        }}
        src="https://bzglfiles.s3.ca-central-1.amazonaws.com/u/394702/c29ca7919a7b7ee69407d46c2f0b8c3d1c1a2327/original/all-around-the-mic-website-version.png?response-content-type=image%2Fpng&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA2AEJH4L527DJJBYE%2F20250129%2Fca-central-1%2Fs3%2Faws4_request&X-Amz-Date=20250129T121026Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=6e376a9787d821fea41588e0c947d11428296b9f4997df560772e43d70c8ab42"
      />
    </div>
  );
}

export function VenueViewProfile({
  venue,
  setSubState,
  subState,
}: {
  venue: Venue;
  subState: SubState;
  setSubState: StateHandler<SubState>;
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

  const [name, sname] = useState(() => venue.name);
  const [addr, saddr] = useState(() => venue.address);
  const [zip, szip] = useState(() => venue.zip);
  const [city, scity] = useState(() => venue.city);
  const [hrs, shrs] = useState(() => openingHours);
  const [phone, sphone] = useState("");
  const [email, semail] = useState(() => venue.email);
  const [bio, sbio] = useState(() => (venue.Bio ? venue.Bio.description : ""));

  const edit = useMemo(() => subState === "edit", [subState]);

  function handleOhrs(
    key: keyof typeof hrs,
    value: string,
    fromto: "from" | "to",
  ) {
    const temp = {
      ...hrs,
      [key]: {
        ...hrs[key],
        [fromto]: value,
      },
    };
    shrs(temp);
  }

  const [images, setImages] = useState<{ image_link: string }[]>([]);

  const { dimensions, handleImageLoad } = useImageDimensions();

  async function submit() {}

  useEffect(() => {
    return () => {
      setSubState("view");
    };
  }, []);
  return (
    <>
      <div className="silly-row-sb">
        <h2>Profile</h2>
        <div style={{ textAlign: "right" }}>
          {edit ? (
            <>
              <EditButton onClick={() => setSubState("view")}>
                Cancel
              </EditButton>
              <EditButton
                onClick={() => {
                  setSubState("view");
                }}
              >
                Save
                <LiaSave size={20} />
              </EditButton>
            </>
          ) : (
            <>
              <EditButton onClick={() => setSubState("edit")}>
                Edit
                <LiaPencilAltSolid
                  size={20}
                  style={{ marginLeft: "5px", marginBottom: "2px" }}
                />
              </EditButton>
            </>
          )}
        </div>
      </div>

      <div className="profile">
        <Grid>
          <Col>
            <div className="silly-row-start">
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
            <div className="silly-row">
              <Control
                header={"Street address"}
                state={addr}
                color={t.redBrown}
                setState={edit ? saddr : undefined}
                className="m-3"
              />
            </div>
            <div className="silly-row-sb-wrap">
              <Control
                header={"Postal/ZIP-code"}
                state={zip}
                color={t.redBrown}
                setState={edit ? szip : undefined}
                className="m-3"
              />
              <Control
                header={"City"}
                state={city}
                color={t.redBrown}
                setState={edit ? scity : undefined}
                className="m-3"
              />
              <div></div>
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
                    <div className="silly-row-sb-wrap">
                      {!v.closed ? (
                        <>
                          <Control
                            state={v.from}
                            onChange={
                              edit
                                ? (e) => handleOhrs(k, e.target.value, "from")
                                : undefined
                            }
                          />
                          <div
                            style={{
                              marginRight: "10px",
                              marginLeft: "10px",
                            }}
                          >
                            -
                          </div>
                          <Control
                            state={v.to}
                            onChange={
                              edit
                                ? (e) => handleOhrs(k, e.target.value, "to")
                                : undefined
                            }
                          />
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
              state={bio}
              color={t.redBrown}
              setState={edit ? sbio : undefined}
            />
            <div className="mt-3">
              <UnderwaveHeader header="Contact" as="h2" color={t.redBrown} />
              <div className="silly-row">
                <LiaPhoneAltSolid size={40} />
                <Control
                  type="text"
                  state={phone}
                  setState={edit ? sphone : undefined}
                />
              </div>

              <div className="silly-row">
                <LiaEnvelope size={45} />
                <Control state={email} setState={edit ? semail : undefined} />
              </div>
            </div>
            <UnderwaveHeader header="Images" as="h2" color={t.redBrown} />
            <div className="mt-3 silly-row">
              {images.map((a, i) => {
                if (i === images.length - 1) return null;
                return (
                  <img
                    key={i}
                    src={a.image_link}
                    style={{
                      width: `${dimensions.width}px`,
                      height: `${dimensions.height}px`,
                      marginLeft: "2px",
                    }}
                  />
                );
              })}
            </div>
            {edit ? (
              <DynamicListForm
                array={images}
                setArray={setImages}
                template={{ image_link: "" }}
                pattern={
                  //URL regex-pattern
                  /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
                }
              />
            ) : null}
            <div className="mt-3">
              <UnderwaveHeader header="Links" as="h2" color={t.redBrown} />
            </div>
          </Col>
        </Grid>
      </div>
    </>
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
          hidden={!u || u.type !== 0}
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
