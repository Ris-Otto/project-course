import { useNavigate, createSearchParams, useParams } from "react-router-dom";
import Event from "../../../../api/Database/Model/Event.ts";
import { getRequest } from "../../api/APITemplate.ts";
import paths from "../../../../Shared/paths.ts";
import { ObjectEntries, paymentMethods } from "../../utilities/Types.tsx";
import {
  resolveBitmask,
  ToCurrencySymbol,
} from "../../utilities/Functions.tsx";
import { Strong } from "./Event.styled.ts";
import Grid from "../Misc/Grid.tsx";
import { EventCalendar } from "./EventCalendar.tsx";
// @deno-types="@types/react"
import { useEffect, useState } from "react";
import { useRequest } from "../../Hooks.ts";
import { Loading } from "../../utilities/Loading.tsx";

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

export type Filter = {
  [key: string]: {
    value: string | boolean | number;
    label: string;
    type: string;
  };
};

export function AllEvents() {
  const [list, setList] = useState<Event[]>();
  const [filteredList, setFilteredList] = useState<Event[]>([]);
  const [filters, setFilters] = useState<Filter>({
    age: { value: false, label: "Age restriction (18+) ", type: "checkbox" },
    name: { value: "", label: "Search by name", type: "text" },
    location: { value: "", label: "Location", type: "text" },
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

  useEffect(() => {
    for (const [k, v] of ObjectEntries(filters)) {
      switch (k) {
        case "age":
          if (v.value) {
            setFilteredList((s) => s.filter((a) => !!a.age));
            return;
          } else {
            setFilteredList(list);
          }
          break;
        case "name":
          if (v.value !== "") {
            setTimeout(() => {
              setFilteredList((s) =>
                s?.filter((a) => a.name.includes(v.value.trim())),
              );
            }, [200]);
            break;
          }
          break;
        default:
          break;
      }
    }
    setFilteredList(list);
  }, [filters]);

  return (
    <>
      {list ? (
        <Grid header={"Events"} wideColumnIndex={1}>
          <div className="mt-3 mb-3">
            <input
              className="mb-3"
              value={filters.name.value}
              placeholder={"Search"}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  name: {
                    ...filters.name,
                    value: e.target.value,
                  },
                })
              }
            />
            <br />
            <strong className="mb-3">Filters</strong>
            <hr />
            <label>{filters.age.label}</label>
            <input
              className="m-3"
              value={filters.age.value}
              type="checkbox"
              onChange={(e) => {
                console.log(e.target.checked);
                setFilters({
                  ...filters,
                  age: {
                    ...filters.age,
                    value: e.target.checked,
                  },
                });
              }}
            />
          </div>
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
    </>
  );
}

export { EventPage, RenderEvent };
