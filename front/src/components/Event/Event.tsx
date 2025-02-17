import {createSearchParams, useNavigate, useParams} from "react-router-dom";
import Event from "../../../../api/Database/Model/Event.ts";
import { getRequest, postRequest } from "../../api/APITemplate.ts";
import paths from "../../../../Shared/paths.ts";
import {Filter, ObjectEntries, paymentMethods} from "../../utilities/Types.tsx";
import {resolveBitmask, ToCurrencySymbol,} from "../../utilities/Functions.tsx";
import {Strong} from "./Event.styled.ts";
import Grid from "../Misc/Grid.tsx";
import {EventCalendar} from "./EventCalendar.tsx";
// @deno-types="@types/react"
import {useEffect, useState} from "react";
import {useRequest} from "../../Hooks.ts";
import {Loading} from "../../utilities/Loading.tsx";
import {ListFilter} from "../Misc/Filter.tsx";
import {useAtom} from "jotai";
import {user} from "../../store.ts";
import Fuse from "fuse.js";

function EventPage() {
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
        setList(a.response);
        setFilteredList(a.response);
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
  return (
    <>
      <h3>
        Price:{" "}
        {`${event.Pricing.amount}${ToCurrencySymbol(
          event.Pricing.currency,
        )}, ${resolveBitmask(event.Pricing.type, paymentMethods)}`}
      </h3>
      {/* Event shit */}
      {event.Artists?.map((a, idx) => {
        return (
          <div key={idx}>
            <p>
              <Strong
                style={{ cursor: "pointer" }}
                onClick={() =>
                  navigate({
                    pathname: `/artists/public`,
                    search: createSearchParams({
                      artistId: a.id,
                    }).toString(),
                  })
                }
              >
                {a.name}
              </Strong>
              <br />
              {a.genre}
            </p>
          </div>
        );
      })}
      <h4>Venue</h4>
      <Strong
        style={{ cursor: "pointer" }}
        onClick={() =>
          navigate({
            pathname: `/venues/public`,
            search: createSearchParams({
              venueId: event.Venue.id,
            }).toString(),
          })
        }
      >
        {event.Venue.name}
      </Strong>
      <br />
      <Strong>{event.Venue.address}</Strong>
      {/* Venue shit */}
      {u ? (
        <>
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
      ): null}
    </>
  );
}

export { EventPage, RenderEvent };
