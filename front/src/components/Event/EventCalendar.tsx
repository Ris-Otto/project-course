import type Event from "../../../../api/Database/Model/Event.ts";
import {styled} from "styled-components";
import {Col, Row} from "react-bootstrap";
import {IoLocationSharp, IoTimeSharp} from "react-icons/io5";
// @deno-types="@types/react"
import {useMemo, useState} from "react";
import {ExtractHoursMinutes, resolveBitmask, ToCurrencySymbol,} from "../../utilities/Functions.tsx";
import {createSearchParams, useNavigate} from "react-router-dom";
import type {Theme} from "../../theme.ts";
import {paymentMethods, StateHandler} from "../../utilities/Types.tsx";
import {Strong} from "./Event.styled.ts";
import {VenueEvent} from "../Venue/Venue.tsx";
import {StyledListBox} from "../Misc/CustomStyles.tsx";

const StyledEventCalendar = styled.div<{ theme: Theme }>`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.darkCream};
  padding: 30px;
  max-height: 60vh;
  overflow-x: auto;
  overflow-y: auto;
  border-radius: 10px;

  .calendar-date {
    text-align: center;
    color: #432;
    background-color: ${({ theme }) => theme.teal};
    font-size: 24px;
    border-radius: 10px 0 0 10px;
    cursor: pointer;
    padding: 10%;
    border-left: 1px solid black;
    border-top: 1px solid black;
    border-bottom: 1px solid black;
    min-width: min-content;
    min-height: 100%;
  }

  .calendar-info {
    overflow: hidden;
    display: inline-block;
    text-align: left;
    color: #432;
    background-color: #b3e6ff;
    padding-left: 5%;
    border-radius: 0 10px 10px 0;
    cursor: pointer;
    min-width: 100%;
    min-height: 100%;
    white-space: nowrap;
    border-right: 1px solid black;
    border-top: 1px solid black;
    border-bottom: 1px solid black;
  }

  .event-in-calendar {
    min-height: 100% !important;
    max-height: max-content !important;
    position: relative;
  }

  .event-calendar {
    flex-wrap: nowrap;
  }

  .hover-event {
  }
`;

type EventCalendarProps = {
  events: Event[];
};
type EventInCalendarProps = {
  event: Event;
};

function EventCalendar({ events }: EventCalendarProps) {
  return (
    <StyledEventCalendar>
      {events.length > 0 ? (

      events.map((e, idx) => {
        return (
          <div className="mt-3" key={idx}>
            <EventInCalendar event={e} />
          </div>
        );
      })

      ): "Nothing to show"}
    </StyledEventCalendar>
  );
}

function EventInCalendar({ event }: EventInCalendarProps) {
  const [isHovering, setIsHovering] = useState(false);
  const date = useMemo(() => new Date(event.start), [event]);
  const start = useMemo(
    () => ExtractHoursMinutes(new Date(event.start)),
    [event],
  );
  const end = useMemo(() => ExtractHoursMinutes(new Date(event.end)), [event]);
  const [rect, setRect] = useState<DOMRect>();

  return (
    <Row className="event-in-calendar ">
      <Col xs={3} style={{ padding: "0px" }}>
        <CalendarDate date={date} event={event} />
      </Col>
      <Col xs={9} style={{ padding: "0px" }}>
        <CalendarInfo
          event={event}
          start={start}
          end={end}
          setIsHovering={setIsHovering}
          setRect={setRect}
        />
      </Col>
      {isHovering ? (
        <div style={{ zIndex: 10 }}>
          <EventHover event={event} rect={rect} />
        </div>
      ) : null}
    </Row>
  );
}

function CalendarInfo({
  event,
  start,
  end,
  setIsHovering,
  setRect
}: {
  event: Event;
  start: string;
  end: string;
  setIsHovering: StateHandler<boolean>;
  setRect: StateHandler<DOMRect|undefined>;
}) {

  const handleMouseOver = (e) => {
    const rect = e.target.getBoundingClientRect();
    setRect(rect);
    setIsHovering(true);
  };

  const handleMouseOut = () => {
    setIsHovering(false);
  };
  const navigate = useNavigate();
  return (
    <div
      className="calendar-info"
      onClick={() =>
        navigate({
          pathname: `/events/${String(event.id)}`,
        })
      }
      onMouseEnter={(e) => {
        handleMouseOver(e);
      }}
      onMouseLeave={() => {
        handleMouseOut();
      }}
    >
      {event.name}
      <br />
      <IoTimeSharp />
      {start} - {end}
      <br />
      <IoLocationSharp />
      {event.Venue.address}
    </div>
  );
}

function EventHover({ event, rect }: { event: Event, rect: DOMRect | undefined }) {
  const pos = useMemo(() => {
    if(!rect) return {x: 0, y: 0}
    if(rect.right + 200 > globalThis.innerWidth) {
      return {
        x: rect.right - rect.left*0.4 - 10,
        y: rect.top - rect.top/2,
      }
    }
    return {
      x: rect.right + 10,
      y: rect.top - rect.top/2,
    }
  }, [rect])
  return (
    <div
      style={{
        position: "fixed",
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        border: "1px solid black",
        borderRadius: "15px",
      }}
    >
      <VenueEvent event={event} updateSubState={(s,r) => {}} showName />
    </div>
  );
}

function CalendarDate({ date, event }: { date: Date; event: Event }) {
  const navigate = useNavigate();
  const month = useMemo(
    () => date.toLocaleString(undefined, { month: "short" }),
    [date],
  );
  const day = useMemo(
    () => date.toLocaleString(undefined, { day: "2-digit" }),
    [date],
  );
  return (
    <div
      className="calendar-date"
      onClick={() =>
        navigate({
          pathname: `/events/${String(event.id)}`,
        })
      }
    >
      {month}
      <br />
      <strong>{day}</strong>
    </div>
  );
}

function RenderHoverEvent({ event }: { event: Event }) {
  const navigate = useNavigate();
  return (
    <StyledListBox>
      <h3>
        Price:{" "}
        {`${event.Pricing.amount}${ToCurrencySymbol(
          event.Pricing.currency,
        )}, ${resolveBitmask(event.Pricing.type, paymentMethods)}`}
      </h3>
      {/* Event shit */}
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
    </StyledListBox>
  );
}

export { EventCalendar, EventInCalendar, RenderHoverEvent };
