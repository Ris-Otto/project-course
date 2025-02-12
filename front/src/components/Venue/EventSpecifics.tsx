import {SearchArtist} from "./AddEvent.tsx";
import Grid from "../Misc/Grid.tsx";
import {
    Control,
    debounceApiCall,
    handleSetPricingType,
    Radio,
    TextArea,
    UnderwaveHeader
} from "../../utilities/Functions.tsx";
import { locsEnum, paymentMethods} from "../../utilities/Types.tsx";
import {EditButton} from "../User/StyledProfile.tsx";

import cd from "../../resources/Images-Assets/cd+cover.png";
import {Theme} from "../../theme.ts";
import {Col} from "react-bootstrap";
import Select from "react-select";
import {FormCheck} from "react-bootstrap";
import {Button} from "react-bootstrap";
import {LiaTrashAltSolid} from "react-icons/lia";
import { StateHandler } from "../../utilities/Types.tsx";
import AsyncSelect from "react-select/async";

type EventSpecificsProps = {
    dimensions,
    handleImageLoad: (e: any) => void,
    name: string,
    t: typeof Theme,
    image: string,
    setImage: StateHandler<string>,
    sname: StateHandler<string>,
    start: Date,
    setStart,
    end: Date,
    setEnd,
    loc,
    setLoc,
    addr,
    saddr: StateHandler<string>,
    city,
    scity: StateHandler<string>,
    zip,
    szip: StateHandler<string>,
    sage: StateHandler<number>,
    age: number,
    bio: string,
    sbio: StateHandler<string>,
    cost: number,
    scost: StateHandler<number>,
    spm: StateHandler<number>,
    selectedArtist: SearchArtist,
    searchArtists: (inputValue: string, callback: (options: SearchArtist[]) => void) => Promise<void>,
    setSelectedArtist: StateHandler<SearchArtist>,
    addedArtists: SearchArtist[],
    setAddedArtists: StateHandler<SearchArtist[]>,
    setShow: StateHandler<boolean>,
}

export function EventSpecifics({
    dimensions,
    handleImageLoad,
    name,
    t,
    sname,
    image,
    setImage,
    start,
    setStart,
    end,
    setEnd,
    loc,
    setLoc,
    addr,
    saddr,
    city,
    scity,
    zip,
    szip,
    sage,
    age,
    bio,
    sbio,
    cost,
    scost,
    spm,
    selectedArtist,
    searchArtists,
    setSelectedArtist,
    addedArtists,
    setAddedArtists,
    setShow
}: EventSpecificsProps
) {
    return <div className="profile mt-3">
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
                    <UnderwaveHeader header="Age restriction (18+)" color={t.redBrown}/>
                    <FormCheck style={{color: t.redBrown}} onChange={() => {
                        sage(a => !a)
                    }} checked={age}/>
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
                        <UnderwaveHeader header="Pricing (€)" color={t.redBrown}/>
                        <Control state={cost} setState={scost}/>

                        <UnderwaveHeader header="Payment methods" color={t.redBrown}/>
                        <Select
                            className="mt-3 mb-3"
                            options={paymentMethods}
                            isMulti
                            defaultValue={{value: 0b000, label: "Free"}}
                            onChange={(e) => {
                                handleSetPricingType(e, spm);
                            }}
                        />
                        <div className={"silly-row-start"}>
                            <div style={{marginRight: "10px"}}>
                                <UnderwaveHeader header="Artists" color={t.redBrown}/>
                                <AsyncSelect
                                    key={`my_unique_select_key__${selectedArtist?.value || ''}`}
                                    value={selectedArtist?.value || ''}
                                    className="mt-3"
                                    loadOptions={debounceApiCall(searchArtists, 200)}
                                    onChange={(e) => {
                                        const a = e as SearchArtist;
                                        setSelectedArtist(a);
                                        if (addedArtists.includes(a) || a === null) {
                                            return;
                                        }
                                        setAddedArtists(s => [a, ...s])
                                    }}
                                    cacheOptions
                                    isClearable
                                    placeholder="Search artists"
                                />
                                <UnderwaveHeader header="OR" color={t.redBrown}/>
                                <EditButton style={{textAlign: "center"}} onClick={() => {
                                    setShow(true)
                                }}>Add manually</EditButton>
                            </div>
                            <div className={"silly-column-sb"}>
                                <UnderwaveHeader header="Added" color={t.redBrown}/>
                                <div className={"mt-3"} style={{
                                    minWidth: "120%",
                                    maxHeight: "100%",
                                    minHeight: "70%",
                                    overflowY: "auto",
                                    overflowX: "visible"
                                }}>
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
                                                    <LiaTrashAltSolid size={30}/>
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
    </div>;
}