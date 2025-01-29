import { useAtom } from "jotai";
import { user } from "../../store.ts";

import {
  TReduce,
  useObjReducer,
  DefaultAction,
} from "../../utilities/Reducer.ts";
import {
  type Pricing,
  type Bio,
  type StateHandler,
} from "../../utilities/Types.tsx";

import Select, { type MultiValue } from "react-select";

// @deno-types="npm:@types/react"
import { useState, useMemo } from "react";
import { Button, Form } from "react-bootstrap";
import { styled } from "styled-components";
import Grid from "../Misc/Grid.tsx";
import type { EventRead } from "../../../../api/Database/Model/Event.ts";
import {
  Check,
  Control,
  DynamicListForm,
  UnderwaveHeader,
  SetStateActionFactory,
} from "../../utilities/Functions.tsx";

const InitialPricing: Pricing = {
  id: -1,
  currency: "",
  type: 0,
  amount: 0,
};

const InitialBio: Bio = {
  id: -1,
  description: "",
};

const InitialEvent: EventRead = {
  id: -1,
  name: "",
  age: 0,
  start: new Date(),
  end: new Date(),
};

export function CreateEvent() {
  const [u, _] = useAtom(user);

  const pricing = useObjReducer(TReduce, InitialPricing);
  const event = useObjReducer(TReduce, InitialEvent);
  const bio = useObjReducer(TReduce, InitialBio);
  const [media, setMedia] = useState<string[]>([]);

  function submit(e) {
    e.preventDefault();
    const data = new FormData(e.target);
    console.log(data);
  }

  return (
    <Grid header={"Create event"}>
      {u?.type !== 2 ? (
        <>Access denied</>
      ) : (
        <>
          <Form onSubmit={submit}>
            <CreateEventForm
              event={event}
              pricing={pricing}
              bio={bio}
              media={media}
              setMedia={setMedia}
            />
            <Button className="mt-3" type="submit">
              Submit
            </Button>
          </Form>
        </>
      )}
      <></>
    </Grid>
  );
}

type EventFormProps = {
  event: DefaultAction<EventRead>;
  pricing: DefaultAction<Pricing>;
  bio: DefaultAction<Bio>;
  media: string[];
  setMedia: StateHandler<string[]>;
};

const StyledEventForm = styled.div``;

function CreateEventForm({
  event,
  pricing,
  bio,
  media,
  setMedia,
}: EventFormProps) {
  const paymentMethods = [
    { value: 0b000, label: "Free" },
    { value: 0b001, label: "Cash" },
    { value: 0b010, label: "Digital wallet" },
    { value: 0b100, label: "Card" },
  ];

  const eventFactory = useMemo(() => SetStateActionFactory(event), []);
  const bioFactory = useMemo(() => SetStateActionFactory(bio), []);
  const pricingFactory = useMemo(() => SetStateActionFactory(pricing), []);

  function handleSetPricingType(
    e: MultiValue<{
      value: number;
      label: string;
    }>,
  ) {
    let bits: number = 0b000;

    for (const bit of e) {
      bits = bits | bit.value;
    }
    pricing.set({ payload: bits, type: "type" });
  }

  return (
    <StyledEventForm>
      <h3>General</h3>
      <Control
        required
        header="Name"
        state={event.state.name}
        setState={eventFactory("name")}
        color="#774320"
      />
      <Control
        required
        type="date"
        header="Starts at"
        state={event.state.start}
        setState={eventFactory("start")}
      />
      <Control
        required
        type="date"
        header="Ends at"
        state={event.state.end}
        setState={eventFactory("end")}
      />
      <Check
        header="Age restriction (18+)"
        value={event.state.age}
        state={!!event.state.age}
        checked={!!event.state.age}
        setState={eventFactory("age")}
      />
      <Control
        header="Description"
        state={bio.state.description}
        setState={bioFactory("description")}
      />
      <DynamicListForm
        name={"media"}
        header="Media"
        notes="Link to any media you want to show in the event posting"
        as="h3"
        array={media}
        pattern={
          //URL regex-pattern
          /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
        }
        template={""}
        setArray={setMedia}
      />
      <h3>Pricing</h3>
      <Control
        type="number"
        header="Amount"
        state={pricing.state.amount}
        setState={pricingFactory("amount")}
      />
      <UnderwaveHeader header="Payment methods" />
      <Select
        className="mt-3 mb-3"
        options={paymentMethods}
        isMulti
        defaultValue={{ value: 0b000, label: "Free" }}
        onChange={(e) => {
          handleSetPricingType(e);
        }}
      />
    </StyledEventForm>
  );
}
