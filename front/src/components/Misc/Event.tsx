import { useSearchParams } from "react-router-dom";
import Event from "../../../../api/Database/Model/Event.ts";
import { getRequest } from "../../api/APITemplate.ts";
import paths from "../../../../Shared/paths.ts";
import { SuspenseConsumer } from "../../utilities/Types.ts";
import { wrapPromise } from "../../Hooks.ts";
import { Container } from "react-bootstrap";

let event: SuspenseConsumer<Event> | null;
export function EventPage() {
  const [sp] = useSearchParams();

  if (!event) {
    event = wrapPromise(getRequest<Event>(
      `${paths.event.get}/${sp.get("eventId")}`,
    ));
  }

  return (
    <div id="component-margin" className={"top-level-component"}>
      <div style={{ textAlign: "left" }}>
        <pre>{JSON.stringify(event.read(), null, 4)}</pre>
      </div>
    </div>
  );
}
