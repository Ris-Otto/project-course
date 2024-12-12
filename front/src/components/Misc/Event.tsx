import {
  useNavigate,
  useSearchParams,
  useLocation,
  createSearchParams,
} from "react-router-dom";
import Event from "../../../../api/Database/Model/Event.ts";
import { getRequest } from "../../api/APITemplate.ts";
import paths from "../../../../Shared/paths.ts";
import { SuspenseConsumer } from "../../utilities/Types.ts";
import { wrapPromise } from "../../Hooks.ts";
import { GoArrowLeft } from "react-icons/go";
import {
  PricingTypeToString,
  ToCurrencySymbol,
} from "../../utilities/Functions.ts";
import { Strong, StyledEvent } from "./Event.styled.ts";
import { Container } from "react-bootstrap";
import PageHeader from "./PageHeader.tsx";

let event: SuspenseConsumer<Event> | null;
function EventPage() {
  const navigate = useNavigate();
  const [sp] = useSearchParams();

  if (!event) {
    event = wrapPromise(
      getRequest<Event>(`${paths.event.get}/${sp.get("eventId")}`),
    );
  }

  return (
    <StyledEvent
      id="component-margin"
      className={"top-level-component"}
      style={{ marginTop: "60px" }}
    >
      {/* <pre>{JSON.stringify(event.read(), null, 4)}</pre> */}
      {/*@ts-ignore cba*/}
      <GoArrowLeft onClick={() => navigate(-1)} className="back-arrow-3" />
      <br />
      <RenderEvent event={event.read().response} />
    </StyledEvent>
  );
}

function RenderEvent({ event }: { event: Event }) {
  const navigate = useNavigate();
  return (
    <Container>
      <PageHeader header={event.name} />
      <h3>
        Price:{" "}
        {`${event.Pricing.amount}${ToCurrencySymbol(
          event.Pricing.currency,
        )}, ${PricingTypeToString(event.Pricing.type)}`}
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
                    pathname: `/artist`,
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
            pathname: `/venue`,
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
    </Container>
  );
}

export { EventPage, RenderEvent };
