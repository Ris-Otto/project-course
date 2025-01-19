import type Event from "../../../../api/Database/Model/Event.ts";
import { styled } from "styled-components";
import { Col, Row } from "react-bootstrap";
import { IoTimeSharp } from "react-icons/io5";
import { useState } from "react";
import { ExtractHoursMinutes } from "../../utilities/Functions.tsx";
import { createSearchParams, useNavigate } from "react-router-dom";
import type { Theme } from "../../theme.ts";

const StyledEventCalendar = styled.div<{ theme: Theme }>`
  .calendar-date {
    text-align: center;
    color: #432;
    background-color: ${({ theme }) => theme.cream};
    font-size: 24px;
    border-radius: 10px 0px 0px 10px;
  }

  .calendar-info {
    text-align: center;
    color: #432;
    background-color: #b3e6ff;
    border-radius: 0px 10px 10px 0px;
  }

  .event-in-calendar {
    min-height: min-content !important;
    min-width: 150%;
    cursor: pointer;
  }

  .event-calendar {
    background-color: ${({ theme }) => theme.cream};
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
  const [date] = useState(() => new Date(event.start));
  const [start] = useState(() => ExtractHoursMinutes(new Date(event.start)));
  const [end] = useState(() => ExtractHoursMinutes(new Date(event.end)));
  const navigate = useNavigate();
  return (
    <Row
      className="event-in-calendar"
      onClick={() =>
        navigate({
          pathname: `/events/${String(event.id)}`,
        })
      }
    >
      <Col xs={3} md={2} style={{ padding: "0px" }}>
        <CalendarDate date={date} />
      </Col>
      <Col xs={12} md={6} style={{ padding: "0px" }}>
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
  return (
    <div className="calendar-info">
      {event.name}
      <br />
      <IoTimeSharp />
      {start} - {end}
      <br />
      {event.Venue.address}
    </div>
  );
}

function CalendarDate({ date }: { date: Date }) {
  const [month] = useState(() =>
    date.toLocaleString(undefined, { month: "short" }),
  );
  const [day] = useState(() =>
    date.toLocaleString(undefined, { day: "2-digit" }),
  );
  return (
    <div className="calendar-date">
      {month}
      <br />
      <strong>{day}</strong>
    </div>
  );
}

export { EventCalendar, EventInCalendar };
