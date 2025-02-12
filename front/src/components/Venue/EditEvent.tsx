// @deno-types="@types/react";
import { useState, useMemo } from "react";
import { useImageDimensions } from "../../Hooks.ts";
import { Radio, Control, TextArea } from "../../utilities/Functions.tsx";
import { UnderwaveEnumeration } from "../../utilities/Types.tsx";
import Grid from "../Misc/Grid.tsx";
import { Col } from "react-bootstrap";
//@ts-ignore bah
import cd from "../../resources/Images-Assets/cd+cover.png";
import { Theme } from "../../theme.ts";
import Event from "../../../../api/Database/Model/Event.ts";

const locs = {
  0: "My venue",
  1: "Other location",
};

const locsEnum: UnderwaveEnumeration<number, string> = {
  entries: locs,
  enumName: "Location",
};

function EditEvent({ event }: { event: Event }) {
  const { dimensions, handleImageLoad } = useImageDimensions(
    globalThis.innerHeight / 4,
  );
  const t = useMemo(() => new Theme(), []);

  const [name, sname] = useState(() => event.name);
  const [addr, saddr] = useState(() => event.Venue.address);
  const [zip, szip] = useState(() => event.Venue.zip);
  const [city, scity] = useState(() => event.Venue.city);
  const [bio, sbio] = useState(() => (event.Bio ? event.Bio.description : ""));
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const [image, setImage] = useState(
    event.Bio?.Media[0]?.href ? event.Bio?.Media[0].href : "",
  );
  const [loc, setLoc] = useState(0);

  const urlPattern = useMemo(
    () =>
      /[-a-zA-Z0-9@:%._+~#=]{1,256}.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/,
    [],
  );

  return (
    <div className="profile">
      <Grid>
        <Col>
          <Grid
            margin="0px"
            cPadding="10px"
            padding="0px"
            gap="0px"
            narrowColumnIndex={0}
          >
            <div className="silly-row-start">
              <img
                src={cd}
                alt={"Event picture"}
                style={{
                  width: `${dimensions.width}px`,
                  height: `${dimensions.height}px`,
                  marginRight: "10%",
                }}
                onLoad={handleImageLoad}
              />
            </div>
            <div>
              <div className="silly-row-start">
                <Control
                  header={"Event name"}
                  state={name}
                  color={t.redBrown}
                  setState={sname}
                />
              </div>
              <div className="silly-row-sb-nowrap">
                <Control
                  header={"Start"}
                  color={t.redBrown}
                  state={start}
                  setState={setStart}
                  type="datetime-local"
                />
                <Control
                  header={"End"}
                  color={t.redBrown}
                  state={end}
                  setState={setEnd}
                  type="datetime-local"
                />
              </div>
            </div>
          </Grid>

          <Radio
            header={"Location"}
            state={loc}
            setState={setLoc}
            template={locsEnum}
            color={t.redBrown}
          />

          {/* <Control
            header={"Location"}
            state={addr}
            color={t.redBrown}
            setState={saddr}
          /> */}

          <div>
            <Control
              header={"Street address"}
              state={addr}
              color={t.redBrown}
              setState={saddr}
              disabled={loc === 0}
            />

            <div className="silly-row">
              <Control
                header={"City"}
                state={city}
                color={t.redBrown}
                setState={scity}
                disabled={loc === 0}
              />
              <Control
                header={"Zip/Postal code"}
                state={zip}
                color={t.redBrown}
                setState={szip}
                disabled={loc === 0}
              />
            </div>
          </div>
        </Col>
        <Col>
          <TextArea
            header="Bio"
            as="h2"
            state={bio}
            color={t.redBrown}
            setState={sbio}
          />
          <div className="mt-3 silly-column">
            <Control
              header="Poster"
              state={image}
              setState={setImage}
              pattern={
                //URL regex-pattern
                urlPattern.source
              }
              color={t.redBrown}
            />
            {image && urlPattern.test(image) ? (
              <img
                src={image}
                style={{
                  width: `${dimensions.width}px`,
                  height: `${dimensions.height}px`,
                  marginLeft: "2px",
                }}
              />
            ) : null}
          </div>
        </Col>
      </Grid>
    </div>
  );
}

export { EditEvent };
