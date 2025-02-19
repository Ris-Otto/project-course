// @deno-types="npm:@types/react"
import React, {SyntheticEvent, useEffect, useMemo, useState} from "react";
import { postFileRequest, postRequest } from "../../api/APITemplate.ts";
import paths from "../../../../Shared/paths.ts";
import {Button, Col} from "react-bootstrap";
import {IoLocationSharp} from "react-icons/io5";
import {
  LiaCalendarWeekSolid,
  LiaClock,
  LiaEnvelope,
  LiaPencilAltSolid,
  LiaPhoneAltSolid,
  LiaPlusSolid,
  LiaTrashAltSolid,
} from "react-icons/lia";
import {GiTicket} from "react-icons/gi";
import {Circle, EditButton} from "../User/StyledProfile.tsx";
import {GoUpload} from "react-icons/go";
import type {Venue} from "../../../../api/Database/Model/Venue.ts";
import Grid from "../Misc/Grid.tsx";
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
import {ObjectEntries, PageState, StateHandler, SubState} from "../../utilities/Types.tsx";
import Event from "../../../../api/Database/Model/Event.ts";

import {useImageDimensions} from "../../Hooks.ts";
import {EditEvent} from "./EditEvent.tsx";
import {AddEvent} from "./AddEvent.tsx";
import {Hours} from "../../../../Shared/Types.ts";
import {Bio} from "../../../../api/Database/Model/Bio.ts";
import {toast} from "react-toastify";
import {Divider, FlexCol, StyledListBox} from "../Misc/CustomStyles.tsx";
import {Link} from "../../../../api/Database/Model/Link.ts";
import {EditableProfileHeaders, EditableProfileMenu} from "../Misc/EditableProfileBase.tsx";
import { ProfilePicture } from "../Misc/ProfilePicture.tsx";
import { urlPattern } from "../../utilities/Regex.ts";
import ReactImageUploading from "react-images-uploading";
import { ExportInterface } from "react-images-uploading/dist/typings";
import { ImageListType } from "npm:react-images-uploading@3.1.7";

declare type VenueProfileProps = {
  value: Venue;
  subState: SubState;
  updateSubState: (subState: SubState, refetch?: boolean) => void;
  pageState: PageState;
  setPageState: StateHandler<PageState>;

}

export function VenueProfile({value, subState, updateSubState, pageState, setPageState}: VenueProfileProps) {

  const [request,_] = useState({
    response: value,
  })

  return (

      <Grid
        header={request.response.name}
        narrowColumnIndex={0}
        wideColumnIndex={1}
      >
        <EditableProfileMenu pageState={pageState} setPageState={setPageState} updateSubState={updateSubState} />
        <Divider>
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
        </Divider>
      </Grid>

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
          <UnderwaveHeader as="h3" header={"Upcoming"} color={t.redBrown} />
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
          <UnderwaveHeader as="h3" header={"Past"} color={t.redBrown}/>
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
    <StyledListBox
      minwidth={`${dimensions.width}px`}
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
          className="description mt-3 mb-3"
          style={{ maxWidth: `${dimensions.width}px` }}
        >
          {event.Bio?.description ? event.Bio.description : "No description"}
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
          {event.address ? event.address : event.Venue.address}
        </div>
      </div>
    </StyledListBox>
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
    <div className="picture">
      <h4 className="picture-name">{name}</h4>
      {age ? <Circle className="picture-age">18+</Circle> : null}
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
        alt="event-picture"
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

  const [name, sname] = useState(venue.name);
  const [addr, saddr] = useState(venue.address);
  const [zip, szip] = useState(venue.zip);
  const [city, scity] = useState(venue.city);
  const [hrs, shrs] = useState<Hours>(() => {
    return handleInitializeHours(venue)
  });
  const [phone, sphone] = useState(venue.phone ? venue.phone : "");
  const [email, semail] = useState(venue.email);
  const [bio, sbio] = useState((venue.Bio?.description ? venue.Bio.description : ""));
  const [links, slinks] = useState<Link[]>(() => {
    return venue.Bio?.Links ? venue.Bio.Links : [];
  } )

  const [images, setImages] = useState<ImageListType>([]);

  const [poster, setPoster] = useState<ImageListType>(() => [{ data_url: venue.poster }]);

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
    shrs(handleInitializeHours(venue));
    sphone(venue.phone ? venue.phone : "");
    semail(venue.email);
    sbio((venue.Bio?.description ? venue.Bio.description : ""));
    slinks(venue.Bio?.Links ? venue.Bio.Links : []);
    setImages([]);
    setPoster([{ data_url: venue.poster }]);
  }

  const { dimensions, handleImageLoad } = useImageDimensions();
  console.log(dimensions);
  async function submit() {
    //Submit venue-specific details
    // name, addr, zip, city, hrs, phone
    const venueUpdate = await postRequest<Venue>(paths.venue.update, { name, addr, zip, city, hrs, phone });
    //Submit bio-specific details
    // media, links, description
    const media = images.filter(a => a.data_url.length > 0)
    const urls = links.filter(a => a.url.length > 0)
    const bioUpdate = await postRequest<Bio>(paths.venue.bio.update, { media, urls, bio, poster: { href: poster[0].data_url, poster: true} });

    //check if poster file has been updated
    if(poster[0].file) {
      const posterUpdate = await postFileRequest("/venue/bio/update/poster", { poster: poster[0].file });
    }
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

  const onChange = (imageList: ImageListType, addUpdateIndex: number) => {
    // data for submit
    console.log(imageList, addUpdateIndex);
    setPoster(imageList);
  };

  useEffect(() => {
    return () => {
      updateSubState("view");
    };
  }, []);
  return (
    <>
      <EditableProfileHeaders reset={reset} submit={submit} subState={subState} updateSubState={updateSubState} />
      <div className="profile">
        <Grid>
          <Col>
            <div className="silly-row-start">
              <div>
                {/*@ts-ignore bah*/}
                <ReactImageUploading
                  value={poster}
                  onChange={onChange}
                  maxNumber={1}
                  dataURLKey="data_url"
                >
                  {({
                      imageList,
                      onImageUpload,
                      onImageUpdate,
                      onImageRemove,
                      isDragging,
                      dragProps,
                    }: ExportInterface) => (
                    // write your building UI
                    <div className="upload__image-wrapper">
                      {(edit && poster.length === 0) ? (
                        <>
                      <Button
                        style={isDragging ? { color: 'red' } : undefined}
                        onClick={onImageUpload}
                        {...dragProps}
                      >
                        Click or Drop here
                      </Button>
                          &nbsp;
                        </>
                      ): null}
                      {imageList.map((image, index) => (
                        <div key={index} className="image-item">
                          <ProfilePicture item={venue} image={image.data_url} dimensions={dimensions} handleImageLoad={handleImageLoad} />
                          {edit ? (
                          <div style={{textAlign: "center"}}>
                            <Button onClick={() => onImageUpdate(index)}><LiaPencilAltSolid /></Button>
                            <Button onClick={() => onImageRemove(index)}><LiaTrashAltSolid/></Button>
                          </div>
                          ): null}
                        </div>
                      ))}
                    </div>
                  )}
                </ReactImageUploading>
              </div>
              <Control
                header={"Venue name"}
                as={"h3"}
                state={name}
                color={t.redBrown}
                setState={edit ? sname : undefined}
              />
            </div>
            <div className="silly-row">
              <Control
                header={"Street address"}
                as={"h3"}
                state={addr}
                color={t.redBrown}
                setState={edit ? saddr : undefined}
                className="m-3"
              />
            </div>
            <div className="silly-row-sb-wrap">
              <Control
                header={"Postal/ZIP-code"}
                as={"h3"}
                state={zip}
                color={t.redBrown}
                setState={edit ? szip : undefined}
                className="m-3"
              />
              <Control
                header={"City"}
                as={"h3"}
                state={city}
                color={t.redBrown}
                setState={edit ? scity : undefined}
                className="m-3"
              />
              <div></div>
            </div>
            <div style={{ alignItems: "center" }}>
              <UnderwaveHeader
                as="h3"
                header={"Opening hours"}
                color={t.redBrown}
                disabled={!edit}
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
                        color: edit ? t.redBrown : "grey"
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
                            color: edit ? t.redBrown : "grey"
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
              as="h3"
              state={bio}
              color={t.redBrown}
              setState={edit ? sbio : undefined}
            />
            <div className="mt-3">
              <UnderwaveHeader header="Contact" as="h3" color={t.redBrown} disabled={!edit} />
              <div className="silly-row">
                <FlexCol>
                  <LiaPhoneAltSolid size={45} style={{ color: edit ? t.redBrown : "grey" }} />
                  <LiaEnvelope size={45} style={{ color: edit ? t.redBrown : "grey" }} />
                </FlexCol>
                <FlexCol>
                  <Control
                    type="text"
                    state={phone}
                    setState={edit ? sphone : undefined}
                  />
                  <Control state={email} setState={edit ? semail : undefined} />
                </FlexCol>
              </div>
            </div>
            <DynamicListForm
              header={"Images"}
              as={"h3"}
              name={"images"}
              array={images}
              setArray={setImages}
              template={{ data_url: "" }}
              pattern={urlPattern}
              disabled={!edit}
              color={t.redBrown}
            />
            <DynamicListForm
                disabled={!edit}
                header={"Links"}
                as={"h3"}
                array={links}
                name={"links"}
                setArray={slinks}
                pattern={urlPattern}
                template={{ url: "" }}
                color={t.redBrown}
            />
          </Col>
        </Grid>
      </div>
    </>
  );
}
