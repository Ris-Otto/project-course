import { useNavigate, createSearchParams, useParams } from "react-router-dom";
import Event from "../../../../api/Database/Model/Event.ts";
import { getRequest } from "../../api/APITemplate.ts";
import paths from "../../../../Shared/paths.ts";
import { paymentMethods, SuspenseConsumer } from "../../utilities/Types.tsx";
import { useWrapPromise, wrapPromise } from "../../Hooks.ts";
import {
  resolveBitmask,
  ToCurrencySymbol,
} from "../../utilities/Functions.tsx";
import { Strong, StyledEvent } from "./Event.styled.ts";
import Grid from "./Grid.tsx";
import { EventCalendar } from "./EventCalendar.tsx";
import { useEffect } from "react";
import Select from "react-select";
import { Searchable } from "./Searchable.tsx";

let event: SuspenseConsumer<Event> | null;
let events: SuspenseConsumer<Event[]> | null;
function EventPage() {
  const eventId = useParams<{ eventId?: string }>();

  if (!event) {
    event = wrapPromise(
      getRequest<Event>(`${paths.event.get}/${eventId.eventId}`),
    );
  }
  return (
    <>
      {/* <pre>{JSON.stringify(event.read(), null, 4)}</pre> */}
      {/*@ts-ignore cba*/}
      <Grid header={event.read().response.name}>
        <RenderEvent event={event.read().response} />
      </Grid>
    </>
  );
}

export function AllEvents() {
  if (!events || events.invalidate) {
    events = wrapPromise(getRequest<Event[]>(`${paths.event.all}`));
  }
  const options = events.read().response;

  return (
    <>
      <Grid header={"Events"} wideColumnIndex={1}>
        <Searchable array={options} />
        <EventCalendar events={options} />
        <div></div>
      </Grid>
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
      {event.Artists.map((a, idx) => {
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
