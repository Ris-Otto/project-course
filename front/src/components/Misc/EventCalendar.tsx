import type Event from "../../../../api/Database/Model/Event.ts";
import { styled } from "styled-components";
import { Col, Row } from "react-bootstrap";
import { IoTimeSharp, IoLocationSharp } from "react-icons/io5";
// @deno-types="@types/react"
import { useState, useMemo } from "react";
import { ExtractHoursMinutes } from "../../utilities/Functions.tsx";
import { useNavigate } from "react-router-dom";
import type { Theme } from "../../theme.ts";

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
  const date = useMemo(() => new Date(event.start), [event]);
  const start = useMemo(
    () => ExtractHoursMinutes(new Date(event.start)),
    [event],
  );
  const end = useMemo(() => ExtractHoursMinutes(new Date(event.end)), [event]);

  return (
    <Row className="event-in-calendar ">
      <Col xs={3} style={{ padding: "0px" }}>
        <CalendarDate date={date} />
      </Col>
      <Col xs={9} style={{ padding: "0px" }}>
        <CalendarInfo event={event} start={start} end={end} />
      </Col>
    </Row>
  );
}

function CalendarInfo({
  event,
  start,
  end,
}: {
  event: Event;
  start: string;
  end: string;
}) {
  const navigate = useNavigate();
  return (
    <div
      className="calendar-info"
      onClick={() =>
        navigate({
          pathname: `/events/${String(event.id)}`,
        })
      }
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

function CalendarDate({ date }: { date: Date }) {
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

export { EventCalendar, EventInCalendar };
