import { useSearchParams, useNavigate } from "react-router-dom";
import Event from "../../../../api/Database/Model/Event.ts";
import { getRequest } from "../../api/APITemplate.ts";
import paths from "../../../../Shared/paths.ts";
import { SuspenseConsumer } from "../../utilities/Types.ts";
import { wrapPromise } from "../../Hooks.ts";
// @ts-types="npm:@types/react-icons"
import {GoArrowLeft} from "react-icons/go";
import { PricingTypeToString, ToCurrencySymbol } from "../../utilities/Functions.ts";

let event: SuspenseConsumer<Event> | null;
function EventPage() {
  const navigate = useNavigate();
  const [sp] = useSearchParams();

  if (!event) {
    event = wrapPromise(getRequest<Event>(
      `${paths.event.get}/${sp.get("eventId")}`,
    ));
  }

  return (
    <div id="component-margin" className={"top-level-component"}>
      <div style={{ textAlign: "left" }}>
        {/* <pre>{JSON.stringify(event.read(), null, 4)}</pre> */}
        <GoArrowLeft onClick={() => navigate("/home")}style={{cursor: "pointer"}} color="#FFED00" size="3em" />      
        <RenderEvent event={event.read().response} />
      </div>
    </div>
  );
}

function RenderEvent({event}: {event: Event}) {
  return (
    <div id="component-margin" style={{position: "absolute", left: "5%"}}>
      <h2>{event.name}</h2>
      <h3>Price: {`${event.Pricing.amount}${ToCurrencySymbol(event.Pricing.currency)}, ${
    PricingTypeToString(event.Pricing.type)
  }`}</h3>
      <p></p>
      {/* Event shit */}
      {event.Artists.map((a, idx) => {
        return (
          <div key={idx}>
          <p>
            <strong style={{color: "#FFED00"}}>
              {a.name}
            </strong> 
            <br/> 
            {a.genre} 
          </p>
          </div>
          
        )
      })}
      <h4>Venue</h4>
      <strong>{event.Venue.name}</strong>
      <br/>
      <strong>{event.Venue.address}</strong>
      {/* Venue shit */}
    </div>
  )
}

export { EventPage, RenderEvent };
