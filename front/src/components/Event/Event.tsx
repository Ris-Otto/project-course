import { createSearchParams, useNavigate, useParams } from "react-router-dom";
import Event from "../../../../api/Database/Model/Event.ts";
import { getRequest, postRequest } from "../../api/APITemplate.ts";
import paths from "../../../../Shared/paths.ts";
import { Filter, ObjectEntries, paymentMethods } from "../../utilities/Types.tsx";
import {
  ExtractHoursMinutes,
  parseTextWithPossibleLineBreaks,
  resolveBitmask,
  ToCurrencySymbol,
  UnderwaveHeader,
} from "../../utilities/Functions.tsx";
import Grid from "../Misc/Grid.tsx";
import { EventCalendar } from "./EventCalendar.tsx";
// @deno-types="@types/react"
import { useEffect, useMemo, useState } from "react";
import { useAuth, useImageDimensions, useRequest } from "../../Hooks.ts";
import { Loading } from "../../utilities/Loading.tsx";
import { ListFilter } from "../Misc/Filter.tsx";
import { useAtom } from "jotai";
import { user } from "../../store.ts";
import { IoCheckmark, IoLocationSharp } from "react-icons/io5";
import Fuse from "fuse.js";
import { Button } from "react-bootstrap";
import { SimpleObservableListItem } from "../Misc/ObservableListItem.tsx";
import { Row } from "../Misc/CustomStyles.tsx";
import { Theme } from "../../theme.ts";
import { EventPicture } from "../Venue/Venue.tsx";
import { EditButton } from "../User/StyledProfile.tsx";
import { EventInterest } from "../../../../api/Database/Model/EventInterest.ts";
import { Tabs, Tab } from "react-bootstrap";
import { MapWithPlaceholder } from "../Venue/VenuePublic.tsx";
import { OpenStreetMapProvider} from "leaflet-geosearch";
import { SearchResult } from "leaflet-geosearch/dist/providers/provider.d.ts";


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
  useAuth(-1);
  const [list, setList] = useState<Event[]>([]);
  const [filteredList, setFilteredList] = useState<Event[]>([]);
  const [filters, setFilters] = useState<Filter<Event>>({
    name: { value: "", label: "Search by name", type: "text" },
    start: { value: "", label: "Date", type: "date" },
    address: { value: "", label: "Address", type: "text" },
    genre: { value: "", label: "Genre", type: "text" },
    age: { value: false, label: "Age restriction (18+) ", type: "checkbox" },
  });
  const [offset, setOffset] = useState(0);

  async function getData() {
    const a = await getRequest<Event[]>(`${paths.event.all}?offset=${offset}`);
    if (a.isSuccess()) {
      const upcoming = a.response.filter(b => b);
      setList((prev) => [...prev, ...upcoming]);
      setFilteredList([...list, ...upcoming]);
      setOffset(prev => prev + upcoming.length);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  function fuseText<T extends object>(list: T[], key: keyof Filter) {
    const fuse = new Fuse(list, {
      keys: [String(key)],
      threshold: 0
    });
    return fuse.search(String(filters[key].value))
  }

  function fuseDate<T extends object>(list: T[]) {
    const fuse = new Fuse(list, {
      keys: ["start"],
      threshold: 0
    });
    console.log(fuse.search(new Date(filters["start"].value).toISOString().split("T")[0]))
    return fuse.search(new Date(filters["start"].value).toISOString().split("T")[0])
  }

  function fuseGenre<T extends object>(list: T[]) {
    const mapped = list.map((x) => {
      return {
        ...x,
        genre: x.Artists.map((a) => a.genre),
      };
    });
    const fuse = new Fuse(mapped, {
      keys: [{
        name: "genre",
      }],
      includeMatches: true,
    });
    return fuse.search(String(filters["genre"].value))
  }

  function reset() {
    setFilteredList(list);
    setFilters(
      {
        name: { value: "", label: "Search by name", type: "text" },
        start: { value: "", label: "Date", type: "date" },
        address: { value: "", label: "Address", type: "text" },
        genre: { value: "", label: "Genre", type: "text" },
        age: { value: false, label: "Age restriction (18+) ", type: "checkbox" },
      }
    )
  }

  function onFilter() {
    let finalFiltered: Event[] = list
    for (const [k, v] of ObjectEntries(filters)) {
      switch (k) {
        case "age":
          if (v.value) {
            finalFiltered = finalFiltered.filter((a) => !!a.age)
            //setFilteredList((s) => s.filter((a) => !!a.age));
          } else {
            setFilteredList(list ? list : []);
          }
          break;
        case "name":
          if (v.value !== "") {
            finalFiltered = fuseText(finalFiltered, "name").map((a) => a.item)
          }
          break;
        case "address":
          if (v.value !== "") {
            finalFiltered = fuseText(finalFiltered, "address").map((a) => a.item)
          }
          break;
        case "start":
          if (v.value !== "") {
            finalFiltered = fuseDate(finalFiltered).map((a) => a.item)
          }
          break;
        case "genre":
          if (v.value !== "") {
            finalFiltered = fuseGenre(finalFiltered).map((a) => a.item)
          }
          break;
        default:
          break;
      }
    }
    setFilteredList(finalFiltered);
  }

  return (
    <>
      {list ? (
        <Grid header={"Events"} wideColumnIndex={1}>
          <ListFilter filters={filters} setFilters={setFilters} onFilter={onFilter} reset={reset}/>
          <div style={{ textAlign: "center", maxHeight: "50vh" }}>
            <EventCalendar events={filteredList} />
            <Button className="mt-3" onClick={async () => {
              await getData();
            }}>Show more</Button>
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
  const { dimensions, handleImageLoad } = useImageDimensions(globalThis.innerHeight / 2);

  const poster = useMemo(() => event.Bio?.Media?.find(a => a.poster)?.href, [event]);

  const userInterest = useRequest<EventInterest>(`/user/interest/${event.id}`, !u);

  const start = useMemo(
    () => ExtractHoursMinutes(new Date(event.start)),
    [event],
  );
  const artistReview = useMemo(() => {
    const relevant = u && u.type === 1;
    const other = event.Artists.find(a => a.id === u?.id)
    const date = new Date(event.end) < new Date();
    return relevant && other && date;
  }, [u, event]);

  const venueReview = useMemo(() => {
    const relevant = u && u.type === 2;
    const other = event.Venue.id === u?.id;
    const date = new Date(event.end) < new Date();
    return relevant && other && date;
  }, [u, event])
  const end = useMemo(() => ExtractHoursMinutes(new Date(event.end)), [event]);
  const t = useMemo(() => new Theme(), [])
  const [map, setMap] = useState(false);
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

      <UnderwaveHeader header={`@${!event.location ? (event.Venue.name + ", ") : ""}${event.address}, ${event.zip} ${event.city}`} as={"h3"} />
      <Button className={"mb-3"} onClick={() => setMap(s => !s)}>
        { map ? "Hide" : "Show on map"}
      </Button>
      {map ? (
        <>
          <EventMap event={event} />
          <br/>
        </>
      ) : null}
      <UnderwaveHeader header={`${new Date(event.start).toDateString()} ${start} - ${end}`} as={"h3"}/>
      <hr />
          <>

            {u ? (
              <>
                {u.type === 0 ? (
                  <EventInterestButtons event={event} interest={userInterest.response} refetch={userInterest.refetch} />
                ): u.type === 1 ? (
                  <></>
                ): u.type === 2 ? (
                  <></>
                ) : null}
              </>
            ): null}
            <Grid>
              <EventPicture image={poster} onImageLoad={handleImageLoad} dimensions={dimensions} name={""} />
              {parseTextWithPossibleLineBreaks(event.Bio?.description ? event.Bio.description : "")}
            </Grid>
            <UnderwaveHeader header={"Artists"} as={"h3"} color={t.orange} />
            <Row justifycontent={"start"} flexwrap={"wrap"} >
              {event.Artists?.map((a, idx) => {
                return (
                  <SimpleObservableListItem key={idx} item={a} navigatePath={"/artists/public?artistId"}>
                    <>
                      {venueReview ? (
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
                  {artistReview ? (
                    <>
                      <br/>
                      <Button className={"mt-3"} onClick={() => navigate(
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

                    </>
                  ): null}
                </>
              </SimpleObservableListItem>
            </Row>
          </>
    </>
  );
}

function EventMap({ event }: { event: Event}) {
  const [results, setResults] = useState<SearchResult<any>[]>([]);
  const [render, setRender] = useState(false);
  const provider = new OpenStreetMapProvider();

  useEffect(() => {
    async function getMap() {
      const r = await provider.search({ query: `${event.address}, ${event.zip}` });
      if(r.length > 0) {
        setRender(true);
      }
      setResults(r);
    }
    getMap();
  }, [])

  return <>
  {render ? (<MapWithPlaceholder center={[results[0].y, results[0].x]} />) : null}

  </>

}

function EventInterestButtons({ event, interest, refetch }: { event: Event, interest: EventInterest | null, refetch }) {
  return (
    <>
      <EditButton disabled={interest ? interest.interest === 2 : false} onClick={async () => {
        await postRequest<Event>(`user/events/${event.id}/show-interest`, {
          interest_level: 2,
        }).then(() => refetch())
      }}>
        Going
        {interest && interest.interest === 2 ? (<IoCheckmark />) : null}
      </EditButton>
      <EditButton disabled={interest ? interest.interest === 1 : false} onClick={async () => {
        await postRequest<Event>(`user/events/${event.id}/show-interest`, {
          interest_level: 1,
        }).then(() => refetch())
      }}>
        Interested
        {interest && interest.interest === 1 ? (<IoCheckmark />) : null}
      </EditButton>
      <EditButton disabled={interest ? interest.interest === 0 : false} onClick={async () => {
        await postRequest<Event>(`user/events/${event.id}/show-interest`, {
          interest_level: 0,
        }).then(() => refetch())
      }}>
        Not going
        {interest && interest.interest === 0 ? (<IoCheckmark />) : null}
      </EditButton>
    </>
  )
}

export { EventPage, RenderEvent };
