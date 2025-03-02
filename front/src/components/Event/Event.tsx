import {createSearchParams, useNavigate, useParams} from "react-router-dom";
import Event from "../../../../api/Database/Model/Event.ts";
import { getRequest, postRequest } from "../../api/APITemplate.ts";
import paths from "../../../../Shared/paths.ts";
import {Filter, ObjectEntries, paymentMethods} from "../../utilities/Types.tsx";
import { ExtractHoursMinutes, resolveBitmask, ToCurrencySymbol, UnderwaveHeader } from "../../utilities/Functions.tsx";
import {Strong} from "./Event.styled.ts";
import Grid from "../Misc/Grid.tsx";
import {EventCalendar} from "./EventCalendar.tsx";
// @deno-types="@types/react"
import {useEffect, useState, useMemo} from "react";
import { useAuth, useRequest } from "../../Hooks.ts";
import {Loading} from "../../utilities/Loading.tsx";
import {ListFilter} from "../Misc/Filter.tsx";
import {useAtom} from "jotai";
import { refetchFollowedArtists, user } from "../../store.ts";
import Fuse from "fuse.js";
import {Button} from "react-bootstrap"
import { SimpleObservableListItem } from "../Misc/ObservableListItem.tsx";
import { Row } from "../Misc/CustomStyles.tsx"
import { IoLocationSharp } from "react-icons/io5"
import { Theme } from "../../theme.ts";
import { useImageDimensions} from "../../Hooks.ts";
import { EventPicture } from "../Venue/Venue.tsx";


function EventPage() {
  useAuth(-1);
  const eventId = useParams<{ eventId?: string }>();

  const { response, isLoading, isError } = useRequest<Event>(
    `${paths.event.get}/${eventId.eventId}`,
  );

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <div style={{ marginTop: "60px" }}>{isError}</div>;
  }

  if (!response) {
    return <div style={{ marginTop: "60px" }}>Errors occured</div>;
  }
  return (
    <>
      {/*@ts-ignore cba*/}
      <Grid header={response.name}>
        <RenderEvent event={response} />
      </Grid>
    </>
  );
}

export function AllEvents() {
  const [list, setList] = useState<Event[]>();
  const [filteredList, setFilteredList] = useState<Event[]>([]);
  const [filters, setFilters] = useState<Filter>({
    name: { value: "", label: "Search by name", type: "text" },
    address: { value: "", label: "Address", type: "text" },
    age: { value: false, label: "Age restriction (18+) ", type: "checkbox" },
  } as const);

  useEffect(() => {
    async function getData() {
      const a = await getRequest<Event[]>(`${paths.event.all}`);
      if (a.isSuccess()) {
        const upcoming = a.response.filter(b => new Date(b.start) > new Date() && b.published);
        setList(upcoming);
        setFilteredList(upcoming);
      }
    }
    getData();
  }, []);

  function fuseText<T extends object>(list: T[], key: keyof Filter) {
    const fuse = new Fuse(list, {
      keys: [String(key)],
    });
    return fuse.search(String(filters[key].value))
  }

  function onFilter() {
    for (const [k, v] of ObjectEntries(filters)) {
      switch (k) {
        case "age":
          if (v.value) {
            setFilteredList((s) => s.filter((a) => !!a.age));
            return;
          } else {
            setFilteredList(list ? list : []);
          }
          break;
        case "name":
          if (v.value !== "") {
            setTimeout(() => {
              setFilteredList(fuseText(filteredList, "name").map((a) => a.item)
              );
            }, 200);
            return;
          }
          break;
        case "address":
          if (v.value !== "") {
            setTimeout(() => {
              setFilteredList(fuseText(filteredList, "address").map((a) => a.item));
            }, 0);
            return;
          }
          break;
        default:
          break;
      }
    }
    setFilteredList(list ? list : []);
  }

  return (
    <>
      {list ? (
        <Grid header={"Events"} wideColumnIndex={1}>
          <ListFilter filters={filters} setFilters={setFilters} onFilter={onFilter}/>
          <div style={{ textAlign: "center" }}>
            <EventCalendar events={filteredList} />
          </div>
          <div></div>
        </Grid>
      ) : null}
    </>
  );
}

function RenderEvent({ event }: { event: Event }) {
  const [u,] = useAtom(user);
  const navigate = useNavigate();
  const { dimensions, handleImageLoad } = useImageDimensions(globalThis.innerHeight/ 2);

  const start = useMemo(
    () => ExtractHoursMinutes(new Date(event.start)),
    [event],
  );
  const end = useMemo(() => ExtractHoursMinutes(new Date(event.end)), [event]);
  const t = useMemo(() => new Theme(), [])
  return (
    <>
      <UnderwaveHeader header={`Price:
          ${event.Pricing.amount}
          ${ToCurrencySymbol(
            event.Pricing.currency,
          )}, ${resolveBitmask(event.Pricing.type, paymentMethods)}
        `}
         as={"h3"}
      />
      <UnderwaveHeader header={`@${event.Venue.name}, ${event.Venue.address}, ${event.Venue.zip} ${event.Venue.city}`} as={"h3"} />
      <UnderwaveHeader header={`${new Date(event.start).toDateString()} ${start} - ${end}`} as={"h3"}/>
      <hr />
      {/*
        POSTER POSTER POSTER POSTER POSTER POSTER
        POSTER POSTER POSTER POSTER POSTER POSTER
        POSTER POSTER POSTER POSTER POSTER POSTER
        POSTER POSTER POSTER POSTER POSTER POSTER
        POSTER POSTER POSTER POSTER POSTER POSTER
       */}
      <EventPicture image={event.poster} onImageLoad={handleImageLoad} dimensions={dimensions} name={""} />

      <UnderwaveHeader header={"Artists"} as={"h3"} color={t.orange} />
      <Row justifycontent={"start"} flexwrap={"wrap"} >
      {event.Artists?.map((a, idx) => {
        return (

            <SimpleObservableListItem key={idx} item={a} navigatePath={"/artists/public?artistId"}>
              <>
              {u && u.type === 2 && event.Venue.id === u.id ? (
                <Button onClick={() => navigate(
                  {
                    pathname: `/events/review/${event.id}`,
                    search: createSearchParams({
                      artistId: a.id,
                    }).toString()
                  },
                  {
                    state: {
                      name: a.name,
                      eventName: event.name
                    },
                  }
                )}
                >
                  Review
                </Button>
              ): null}
              </>
            </SimpleObservableListItem>

        );
      })}
      </Row>
      <UnderwaveHeader header={"Venue"} as={"h3"} color={t.orange}/>
      <Row justifycontent={"start"} flexwrap={"wrap"}>
      <SimpleObservableListItem item={event.Venue} navigatePath={"/venues/public?venueId"} >
        <>
          <IoLocationSharp />
          {event.Venue.address}
          {u && u.type === 1 && event.Artists.find(a => a.id === u.id) ? (
            <>
              <Button onClick={() => navigate(
                {
                  pathname: `/events/review/${event.id}`,
                  search: createSearchParams(
                    {
                      venueId: event.Venue.id,
                    }).toString()
                },
                {
                  state: {
                    name: event.Venue.name,
                    eventName: event.name
                  },
                })
              }>
                Review
              </Button>
              <br/>
            </>
          ): null}
        </>
      </SimpleObservableListItem>
      </Row>
      {u ? (
        <>
          {u.type === 0 ? (
            <EventInterest event={event} />
          ): u.type === 1 ? (
            <></>
          ): u.type === 2 ? (
            <></>
          ) : null}
        </>
      ): null}
    </>
  );
}

function EventInterest({ event }: { event: Event }) {
  return <>
    <button onClick={async () => {
      await postRequest<Event>(`user/events/${event.id}/show-interest`, {
        interest_level: 2,
      })
    }}>
      Going
    </button>
    <button onClick={async () => {
      await postRequest<Event>(`user/events/${event.id}/show-interest`, {
        interest_level: 1,
      })
    }}>
      interested
    </button>
    <button onClick={async () => {
      await postRequest<Event>(`user/events/${event.id}/show-interest`, {
        interest_level: 0,
      })
    }}>
      not going
    </button>
  </>

}

export { EventPage, RenderEvent };
