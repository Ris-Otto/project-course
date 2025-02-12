import {StateHandler, UnderwaveEnumeration} from "../../utilities/Types.tsx";
import type { SubState } from "./Venue.tsx";
import { Venue } from "../../../../api/Database/Model/Venue.ts";
//@deno-types="npm:@types/react"
import { useState, useMemo, useEffect } from "react";
import Grid from "../Misc/Grid.tsx";
import cd from "../../resources/Images-Assets/cd+cover.png";
import {Control, Radio, TextArea, UnderwaveHeader} from "../../utilities/Functions.tsx";
import {useImageDimensions} from "../../Hooks.ts";
import {Theme} from "../../theme.ts";
import {Col} from "react-bootstrap";
import Select, { type MultiValue } from "react-select";
import { toast } from "react-toastify";
import {EditButton} from "../User/StyledProfile.tsx";
import AsyncSelect from 'react-select/async'
import {postRequest} from "../../api/APITemplate.ts";
import paths from "../../../../Shared/paths.ts";
import { Artist } from "../../../../api/Database/Model/Artist.ts";
import { Button} from "react-bootstrap";
import { LiaTrashAltSolid } from "react-icons/lia";

declare type SearchArtist = {
  value: string; label: string;
}


const locs = {
  0: "My venue",
  1: "Other location",
};

const locsEnum: UnderwaveEnumeration<number, string> = {
  entries: locs,
  enumName: "Location",
};

const paymentMethods = [
  { value: 0b000, label: "Free" },
  { value: 0b001, label: "Cash" },
  { value: 0b010, label: "Digital wallet" },
  { value: 0b100, label: "Card" },
];

export function AddEvent({
  venue,
  subState,
  setSubState,
}: {
  venue: Venue;
  subState: SubState;
  setSubState: StateHandler<SubState>;
}) {
  const { dimensions, handleImageLoad } = useImageDimensions(
      globalThis.innerHeight / 4,
  );
  const t = useMemo(() => new Theme(), []);

  const [name, sname] = useState("");
  const [selectedArtist, setSelectedArtist] = useState<SearchArtist>();
  const [addedArtists, setAddedArtists] = useState<SearchArtist[]>([]);
  const [cost, scost] = useState(0);
  const [pm, spm] = useState(-1);
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());
  const [bio, sbio] = useState("");
  const [image, setImage] = useState("");
  const [addr, saddr] = useState(venue.address);
  const [city, scity] = useState(venue.city);
  const [zip, szip] = useState(venue.zip);
  const [capacity, scapacity] = useState(0);
  const [type, stype] = useState("");
  const [tags, stags] = useState("");
  const [publish, spublish] = useState(false);
  const [timeout, stimeout] = useState(0);

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
    spm(bits);
  }

  function searchArtists(inputValue: string, callback: (options: SearchArtist[]) => void) {
    return postRequest<SearchArtist[]>(paths.artist.search, { searchValue: inputValue })
        .then(response => response.response)
        .then(data => callback(data));
  }

  const urlPattern = useMemo(
      () =>
          /[-a-zA-Z0-9@:%._+~#=]{1,256}.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&\/=]*)/,
      [],
  );

  const [loc, setLoc] = useState(0);

  async function submit(publish?: boolean): Promise<boolean> {
    if(pm <= 0 && cost !== 0) {
      toast.warn("Please choose a valid payment method")
      return false;
    }
    if(pm !== 0 && cost <= 0) {
      toast.warn("Please enter a valid price")
      return false;
    }


    return true;
  }

  return (

      <div style={{textAlign: "right"}} className={"mb-3"}>
        {/*TODO fix styling with page header*/}
        <EditButton onClick={() => setSubState("view")}>
          Cancel
        </EditButton>
        <EditButton onClick={async () => {
          const s = await submit();
          if(s)
            setSubState("view")
        }}>
          Create
        </EditButton>
        <EditButton onClick={async () => {
          const s = await submit(true);
          if(s)
            setSubState("view")
        }}>
          Create and publish
        </EditButton>

      <div className="profile mt-3">
        <Grid>
          <Col>
            <Grid
                margin="0px"
                cPadding="10px"
                padding="0px"
                gap="0px"
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
                <div className="silly-row-sb">
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
            <div>
              <div className="mt-3">
                <UnderwaveHeader header="Pricing (€)" color={t.redBrown} />
                <Control state={cost} setState={scost} />

                <UnderwaveHeader header="Payment methods" color={t.redBrown} />
                <Select
                    className="mt-3 mb-3"
                    options={paymentMethods}
                    isMulti
                    defaultValue={{value: 0b000, label: "Free"}}
                    onChange={(e) => {
                      handleSetPricingType(e);
                    }}
                />
                <div className={"silly-row-start"}>
                  <div style={{marginRight: "10px"}}>
                    <UnderwaveHeader header="Artists" color={t.redBrown} />
                    <AsyncSelect
                        value={selectedArtist}
                        className="mt-3"
                        loadOptions={debounceApiCall(searchArtists, 200)}
                        onChange={(e) => {
                          setSelectedArtist(e as SearchArtist | null)
                        }}
                        cacheOptions
                        isClearable
                        placeholder="Search artists"
                    />
                    <EditButton
                      style={{textAlign: "center"}}
                      onClick={() => {
                        if(addedArtists.includes(selectedArtist)) {
                          return;
                        }
                        setAddedArtists(s => [selectedArtist, ...s])
                      }}
                    >
                      Add
                    </EditButton>
                    <EditButton style={{textAlign: "center"}} onClick={() => {}}>Add manually</EditButton>
                  </div>
                  <div className={"silly-column-sb"} style={{marginLeft: "20px"}}>
                    <UnderwaveHeader header="Added" color={t.redBrown}/>
                    <div style={{minWidth: "120%",maxHeight: "100%", minHeight: "70%", overflowY: "auto", overflowX: "visible"}}>
                      {addedArtists.map((a, i) => {
                        return (
                            <div
                                 key={i}
                            >
                              {a.label}
                              <Button
                                  onClick={() => {
                                    setAddedArtists(s => s.filter(item => s.indexOf(item) !== i))
                                  }}
                              >
                                <LiaTrashAltSolid size={30} />
                              </Button>
                            </div>)
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Grid>
      </div>
      </div>
  );
}

{/*<Control
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
              ) : null}*/}

function debounceApiCall(
    func: (
        ...args: [
          string,
          (options: OptionsOrGroups<unknown, GroupBase<unknown>>) => void
        ]
    ) => void,
    wait: number
) {
  let timeout: ReturnType<typeof setInterval> | null;
  return function executedFunction(
      ...args: [
        string,
        (options: OptionsOrGroups<unknown, GroupBase<unknown>>) => void
      ]
  ) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
