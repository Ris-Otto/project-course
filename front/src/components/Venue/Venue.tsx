// @deno-types="npm:@types/react"
import React, {SyntheticEvent, useEffect, useMemo, useState} from "react";
import {getRequest, postRequest} from "../../api/APITemplate.ts";
import paths from "../../../../Shared/paths.ts";
import {createSearchParams, useNavigate, useSearchParams,} from "react-router-dom";
import {Button, Col, Container, Row, Tab, Tabs} from "react-bootstrap";
import {IoImageOutline, IoLocationSharp, IoNewspaperSharp} from "react-icons/io5";
import {
  LiaCalendarWeekSolid,
  LiaClock,
  LiaEnvelope,
  LiaHeart,
  LiaHeartSolid,
  LiaPencilAltSolid,
  LiaPhoneAltSolid,
  LiaPlusSolid,
  LiaSave,
  LiaShareAltSquareSolid,
  LiaTrashAltSolid,
} from "react-icons/lia";
import {GiTicket} from "react-icons/gi";
import {Strong} from "../Event/Event.styled.ts";
import {EventCalendar, StyledHoverEvent} from "../Event/EventCalendar.tsx";
import {Circle, EditButton, StyledArtistProfile, StyledListBox, StyledVenueProfile} from "../User/StyledProfile.tsx";
import {useAtom} from "jotai";
import {user} from "../../store.ts";
import {GoArrowLeft} from "react-icons/go";
import type {Venue} from "../../../../api/Database/Model/Venue.ts";
import Grid from "../Misc/Grid.tsx";
import {Loading} from "../../utilities/Loading.tsx";
import {
  cfl,
  Control,
  DynamicListForm,
  TextArea,
  ToCurrencySymbol,
  UnderwaveHeader,
} from "../../utilities/Functions.tsx";
import {Theme} from "../../theme.ts";
//@ts-ignore bah
import cd from "../../resources/Images-Assets/cd+cover.png";
import {logout} from "../../api/auth.ts";
import {ObjectEntries, type StateHandler} from "../../utilities/Types.tsx";
import Event from "../../../../api/Database/Model/Event.ts";

import {useImageDimensions, useRequest} from "../../Hooks.ts";
import {EditEvent} from "./EditEvent.tsx";
import {AddEvent} from "./AddEvent.tsx";
import {useAuth} from "../Auth.tsx";
import {Hours} from "../../../../Shared/Types.ts";
import {Bio} from "../../../../api/Database/Model/Bio.ts";
import {toast} from "react-toastify";
import { GoUpload } from "react-icons/go";

export default function VenueProfilePublic() {
  const [sp] = useSearchParams();
  const navigate = useNavigate();


  const venue = useRequest<Venue>(`venue/public/${sp.get("venueId")}`);

  if (!venue.response) return <div>Error</div>;

  if (venue.isLoading) return <Loading />;

  if (venue.isError)
    return <div style={{ marginTop: "60px" }}>{venue.isError}</div>;

  return (
    <StyledArtistProfile
      className="top-level-component"
      style={{ textAlign: "left" }}
    >
      {/*@ts-ignore bah*/}
      <GoArrowLeft onClick={() => navigate(-1)} className="back-arrow-3" />
      <Container>
        {venue.response ? (
          <Grid header={venue.response.name}>
            <VenueLeft venue={venue.response} />
            <VenueMiddle venue={venue.response} />
            <VenueRight venue={venue.response} />
          </Grid>
        ) :
        null}
      </Container>
    </StyledArtistProfile>
  );
}
export type PageState = "profile" | "events" | "account" | "settings";
export const PageStates: PageState[] = [
  "profile",
  "events",
  /* "account",
  "settings", */
] as const;

export type SubState = "view" | "edit" | "add";

export function VenueProfile() {
  const [pageState, setPageState] = useState<PageState>("profile");
  const [subState, setSubState] = useState<SubState>("view");
  useAuth(2);

  const request = useRequest<Venue>(paths.venue.self);

  useEffect(() => {
    return () => {
      setSubState("view");
      setPageState("profile");
    };
  }, []);
  if (!request.response) return <div>Error</div>;

  if (request.isLoading) return <Loading />;

  if (request.isError)
    return <div style={{ marginTop: "60px" }}>{request.isError}</div>;

  function updateSubState(subState: SubState, refetch?: boolean) {
    setSubState(subState)
    if(refetch) {
      request.refetch();
    }
  }

  return (
    <StyledVenueProfile>
      <div style={{ textAlign: "right" }}>
        <Grid
          header={request.response.name}
          narrowColumnIndex={0}
          wideColumnIndex={1}
        >
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
                venue={request.response}
                subState={subState}
                updateSubState={updateSubState}
              />
            ) : pageState === "events" ? (
              <VenueEvents
                subState={subState}
                venue={request.response}
                updateSubState={updateSubState}
              />
            ) : null}
          </div>
        </Grid>
      </div>
    </StyledVenueProfile>
  );
}

export function VenueEvents({
  venue,
  subState,
  updateSubState
}: {
  venue: Venue;
  subState: SubState;
  updateSubState: (subState: SubState, refetch?: boolean) => void
}) {
  const add = useMemo(() => subState === "add", [subState]);
  const edit = useMemo(() => subState === "edit", [subState]);
  const [events, sevents] = useState(venue.Events);
  const [publishedEvents, setpublishedEvents] = useState<Event[]>(venue.Events.filter(a => a.published))
  const [unpublishedEvents, setunpublishedEvents] = useState<Event[]>(venue.Events.filter(a => !a.published))
  const [pastEvents, setpastEvents] = useState<Event[]>(venue.Events.filter(a => new Date(a.end) < new Date()));
  const [upcomingEvents, setupcomingEvents] = useState<Event[]>(() => venue.Events.filter(a => new Date(a.start) > new Date()));
  const [currentEvent, setCurrentEvent] = useState<Event>();
  const t = useMemo(() => new Theme(), []);

  return (
    <>
      <div className="silly-row-sb">
        <h2 style={{textDecoration: "underline"}}>
          {add ? "Create event" : edit ? "Edit event" : "Events"}
        </h2>
        <div>
          {!add && !edit ? (
            <EditButton onClick={() => updateSubState("add")}>
              New Event
              <LiaPlusSolid size={25} style={{ marginLeft: "5px" }} />
            </EditButton>
          ): null}
        </div>
      </div>
      {subState === "view" ? (
        <>
          <UnderwaveHeader as="h2" header={"Upcoming"} color={t.redBrown} />
          <div className="silly-row-start">
            {upcomingEvents.map((a, i) =>
              <div key={i} style={{margin: "2%"}}>
                <VenueEvent
                    event={a}
                    setCurrentEvent={setCurrentEvent}
                    updateSubState={updateSubState}
                />
              </div>
            )}
          </div>
          <UnderwaveHeader as="h2" header={"Past"} color={t.redBrown}/>
          <div className="silly-row-start">
            {pastEvents.map((a, i) => (
                <div key={i} style={{ margin: "2%" }}>
                  <VenueEvent
                      event={a}
                      setCurrentEvent={setCurrentEvent}
                      updateSubState={updateSubState}
                  />
                </div>
            ))}
          </div>
        </>
      ) : subState === "add" ? (
        <AddEvent venue={venue} updateSubState={updateSubState} />
      ) : subState === "edit" ? (
        <EditEvent event={currentEvent!} updateSubState={updateSubState}/>
      ) : null}
    </>
  );
}

export function VenueEvent({
  event,
  updateSubState,
  setCurrentEvent,
}: {
  event: Event;
  updateSubState: (subState: SubState, refetch?: boolean) => void;
  setCurrentEvent?: React.Dispatch<React.SetStateAction<Event | undefined>>;
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
    globalThis.innerHeight / 5,
  );
  const p = useMemo(() => dimensions.width * 0.12, [dimensions]);

  async function publishEvent() {
    const ret = await postRequest(`${paths.venue.event.publish}/${event.id}`);
    if(ret.isSuccess()) {
      toast.success("Event published");
      updateSubState("view", true)
    } else {
      toast.error("Event failed to publish");
    }
  }

  return (
    <StyledHoverEvent
      style={{
        minWidth: `${dimensions.width}px`,
      }}
      padding={String(p)}
    >
      {setCurrentEvent ? (
        <div style={{ textAlign: "right" }}>
          {!event.published ? (
              <Button onClick={() => publishEvent()}>
                Publish
                <GoUpload size={20}/>
              </Button>
          ): null}
          <Button
            onClick={() => {
              setCurrentEvent(event);
              updateSubState("edit");
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
  onImageLoad: (e: SyntheticEvent<HTMLImageElement>) => void;
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
        onError={({ currentTarget }) => {
          currentTarget.onerror = null; // prevents looping
          currentTarget.src = cd;
        }}
        src={cd}
      />
    </div>
  );
}

const openingHours: Hours = {
  mon: {from: "", to: ""},
  tue: {from: "", to: ""},
  wed: {from: "", to: ""},
  thu: {from: "", to: ""},
  fri: {from: "", to: ""},
  sat: {from: "", to: ""},
  sun: {from: "", to: ""},
}
function handleInitializeHours(venue: Venue) {
  const hours = venue.OpeningHour;
  if(!hours) return openingHours;
  return {
    mon: { from: hours.monStart, to: hours.monEnd },
    tue: { from: hours.tueStart, to: hours.tueEnd },
    wed: { from: hours.wedStart, to: hours.wedEnd },
    thu: { from: hours.thuStart, to: hours.thuEnd },
    fri: { from: hours.friStart, to: hours.friEnd },
    sat: { from: hours.satStart, to: hours.satEnd },
    sun: { from: hours.sunStart, to: hours.sunEnd },
  }
}

export function VenueViewProfile({
  venue,
    subState,
  updateSubState
}: {
  venue: Venue;
  subState: SubState;
  updateSubState: (subState: SubState, refetch?: boolean) => void;
}) {

  const t = useMemo(() => new Theme(), []);

  const [name, sname] = useState(() => venue.name);
  const [addr, saddr] = useState(() => venue.address);
  const [zip, szip] = useState(() => venue.zip);
  const [city, scity] = useState(() => venue.city);
  const [hrs, shrs] = useState<Hours>(() => {
    return handleInitializeHours(venue)
  });
  const [phone, sphone] = useState(() => venue.phone);
  const [email, semail] = useState(() => venue.email);
  const [bio, sbio] = useState(() => (venue.Bio ? venue.Bio.description : ""));
  const [links, slinks] = useState< {url: string}>(() => {
    return venue.Bio?.Links ? venue.Bio.Links : [];
  } )

  const [images, setImages] = useState<{ image_link: string }[]>(() => {
    const media = venue.Bio?.Media;
    if(!media || media.length === 0) {
      return [];
    }
    return media.map((a) => { return { image_link: a.href }})
  });

  const edit = useMemo(() => subState === "edit", [subState]);

  function handleOhrs(
    key: keyof Hours,
    value: string,
    fromto: "from" | "to",
  ) {
    //baller shit
    const temp = {
      ...hrs,
      [key]: {
        ...hrs[key],
        [fromto]: value,
      },
    };
    shrs(temp);
  }

  function reset() {
    sname(venue.name);
    saddr(venue.address);
    szip(venue.zip);
    scity(venue.city);
    shrs((a) => {
      return handleInitializeHours(venue);
    });
    sphone(venue.phone);
    semail(venue.email);
    sbio((a) => (venue.Bio ? venue.Bio.description : ""));
    slinks((a) => {
      return venue.Bio?.Links ? venue.Bio.Links : [];
    } )

    setImages((a) => {
      const media = venue.Bio?.Media;
      if(!media || media.length === 0) {
        return [];
      }
      return media.map((a) => { return { image_link: a.href }})
    });
  }

  const { dimensions, handleImageLoad } = useImageDimensions();

  async function submit() {
    //Submit venue-specific details
    // name, addr, zip, city, hrs, phone
    const venueUpdate = await postRequest<Venue>(paths.venue.update, { name, addr, zip, city, hrs, phone });
    //Submit bio-specific details
    // media, links, description
    const media = images.filter(a => a.image_link.length > 0)
    const urls = links.filter(a => a.url.length > 0)
    const bioUpdate = await postRequest<Bio>(paths.venue.bio.update, { media, urls, bio });

    if(venueUpdate.isSuccess()) {
      toast.success("Venue details successfully updated")
    } else {
      toast.error("Venue details failed to update")
    }
    if(bioUpdate.isSuccess()) {
      toast.success("Bio details successfully updated")
    } else {
      toast.error("Bio details failed to update")
    }
  }

  useEffect(() => {
    return () => {
      updateSubState("view");
    };
  }, []);
  return (
    <>
      <div className="silly-row-sb">
        <h2 style={{textDecoration: "underline"}}>Profile</h2>
        <div style={{ textAlign: "right" }}>
          {edit ? (
            <>
              <EditButton onClick={() => {
                reset();
                updateSubState("view")
              }}>
                Cancel
              </EditButton>
              <EditButton
                onClick={async () => {
                  await submit();
                  updateSubState("view", true);
                }}
              >
                Save
                <LiaSave size={20} />
              </EditButton>
            </>
          ) : (
            <>
              <EditButton onClick={() => updateSubState("edit")}>
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
                    </div>
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
                   alt="image link"
                  />
                );
              })}
            </div>
            {edit ? (
              <DynamicListForm
                name={"images"}
                array={images}
                setArray={setImages}
                template={{ image_link: "" }}
                pattern={
                  //URL regex-pattern
                  /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/
                }
              />
            ) : null}
            <div className="mt-3">
              <UnderwaveHeader header="Links" as="h2" color={t.redBrown} />
              {edit ? (<DynamicListForm
                  disabled={!edit}
                  array={links}
                  name={"links"}
                  setArray={slinks}
                  pattern={/[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/}
                  template={{ url: "" }}
              />): (
                  <>
                    {links.map((a, i) => {return <Control key={i} state={a.url} disabled/>})}
                  </>
              )}
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
