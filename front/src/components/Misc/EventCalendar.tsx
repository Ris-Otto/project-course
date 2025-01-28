import type Event from "../../../../api/Database/Model/Event.ts";
import { styled } from "styled-components";
import { Col, Row } from "react-bootstrap";
import { IoTimeSharp, IoLocationSharp } from "react-icons/io5";
// @deno-types="@types/react"
import { useState, useMemo } from "react";
import {
  ExtractHoursMinutes,
  ToCurrencySymbol,
  resolveBitmask,
} from "../../utilities/Functions.tsx";
import { createSearchParams, useNavigate } from "react-router-dom";
import type { Theme } from "../../theme.ts";
import { StateHandler, paymentMethods } from "../../utilities/Types.tsx";
import { Strong } from "./Event.styled.ts";
import { RenderEvent } from "./Event.tsx";

const StyledEventCalendar = styled.div<{ theme: Theme }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: rgb(228, 227, 210);
  padding: 20px;
  max-height: 80vh;
  overflow-x: visible;
  overflow-y: auto;
  border-radius: 10px 10px 10px 10px;

  .calendar-date {
    text-align: center;
    color: #432;
    background-color: ${({ theme }) => theme.teal};
    font-size: 24px;
    border-radius: 10px 0px 0px 10px;
    cursor: pointer;
    padding-left: 5%;
    border-left: 1px solid black;
    border-top: 1px solid black;
    border-bottom: 1px solid black;
    min-width: min-content !important;
  }

  .calendar-info {
    overflow: hidden;
    display: inline-block;
    text-align: left;
    color: #432;
    background-color: #b3e6ff;
    padding-left: 5%;
    border-radius: 0px 10px 10px 0px;
    cursor: pointer;
    min-width: 100%;
    max-height: 100%;
    white-space: nowrap;
    border-right: 1px solid black;
    border-top: 1px solid black;
    border-bottom: 1px solid black;
  }

  .event-in-calendar {
    min-height: min-content !important;
    max-height: min-content !important;
  }

  .event-calendar {
    flex-row: nowrap;
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
      {events.map((e, idx) => {
        return (
          <div className="mb-3" key={idx}>
            <EventInCalendar event={e} />
          </div>
        );
      })}
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
          isHovering={isHovering}
          setIsHovering={setIsHovering}
        />
      </Col>
      {isHovering ? (
        <div style={{ zIndex: 10 }}>
          <EventHover event={event} />
        </div>
      ) : null}
    </Row>
  );
}

function CalendarInfo({
  event,
  start,
  end,
  isHovering,
  setIsHovering,
}: {
  event: Event;
  start: string;
  end: string;
  isHovering: boolean;
  setIsHovering: StateHandler<boolean>;
}) {
  const handleMouseOver = () => {
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
      onMouseEnter={() => {
        handleMouseOver();
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

function EventHover({ event }: { event: Event }) {
  return (
    <div
      style={{
        position: "fixed",
        right: "30vw",
        border: "1px solid black",
        backgroundColor: "white",
        minWidth: "30vw",
      }}
    >
      <RenderHoverEvent event={event} />
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
    <>
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
    </>
  );
}

export { EventCalendar, EventInCalendar };
