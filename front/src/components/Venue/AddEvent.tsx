import {SearchArtist, SubState} from "../../utilities/Types.tsx";
import {Venue} from "../../../../api/Database/Model/Venue.ts";
//@deno-types="npm:@types/react"
import {useMemo, useState} from "react";
import {Control} from "../../utilities/Functions.tsx";
import {useImageDimensions} from "../../Hooks.ts";
import {Theme} from "../../theme.ts";
import {toast} from "react-toastify";
import {EditButton} from "../User/StyledProfile.tsx";
import {postRequest} from "../../api/APITemplate.ts";
import paths from "../../../../Shared/paths.ts";
import {Button} from "react-bootstrap";
import Modal from 'react-bootstrap/Modal';
import Event from "../../../../api/Database/Model/Event.ts";
import {EventSpecifics} from "./EventSpecifics.tsx";

export function AddEvent({
  venue,
  updateSubState
}: {
  venue: Venue;
  updateSubState: (subState: SubState, refetch?: boolean) => void
}) {
  const { dimensions, handleImageLoad } = useImageDimensions(
      globalThis.innerHeight / 4,
  );
  const t = useMemo(() => new Theme(), []);

  const [name, sname] = useState("");
  const [selectedArtist, setSelectedArtist] = useState<SearchArtist>();
  const [nonArtist, setNonArtist] = useState<{ name: string, genre: string, description: string}>({ name: "", genre: "", description: ""})
  const [addedArtists, setAddedArtists] = useState<SearchArtist[]>([]);
  const [removedArtists, setRemovedArtists] = useState<SearchArtist[]>([]);
  const [artists, setArtists] = useState<SearchArtist[]>([]);
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
  const [age, sage] = useState(false);

  const [show, setShow] = useState(false);

  function searchArtists(inputValue: string, callback: (options: SearchArtist[]) => void) {
    return postRequest<SearchArtist[]>(paths.artist.search, { searchValue: inputValue })
        .then(response => response.response)
        .then(data => callback(data));
  }

  const [loc, setLoc] = useState(0);

  async function submit(publish?: boolean): Promise<boolean> {
    if(publish) {
      if(pm <= 0 && cost !== 0) {
        toast.warn("Please choose a valid payment method")
        return false;
      }
      if(pm !== 0 && cost <= 0) {
        toast.warn("Please enter a valid price")
        return false;
      }
    }

    const res = await postRequest<Event>(paths.venue.event.create, {
      name: name,
      start: start,
      end: end,
      bio: bio,
      poster: image,
      address: addr,
      city: city,
      zip: zip,
      capacity: capacity,
      artists: addedArtists.map(a => a.value),
      type: type,
      tags: tags,
      VenueId: venue.id,
      published: !!publish,
      amount: cost,
      age: age,
      paymentMethod: pm,
    })

    const ret = res.isSuccess();

    if(!ret) {
      toast("Something went wrong, please try again later");
    } else {
      toast("Event created");
    }
    return ret;
  }

  return (

      <div style={{textAlign: "right"}} className={"mb-3"}>
        <Modal contentClassName="underwave-modal" show={show}>
          <Modal.Header closeButton>
            <Modal.Title>Add artist</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Control color={t.redBrown} header="Name" state={nonArtist.name} onChange={(e) => {
              console.log(e.target.value)
              setNonArtist({...nonArtist, name: e.target.value})
            }} />
            <Control color={t.redBrown} header="Genre" state={nonArtist.genre} onChange={(e) => setNonArtist({...nonArtist, genre: e.target.value})} />
            <Control color={t.redBrown} header="Introduction/Bio" state={nonArtist.description} onChange={(e) => setNonArtist({...nonArtist, description: e.target.value})} />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShow(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setShow(false)}>
              Add
            </Button>
          </Modal.Footer>
        </Modal>
        {/*TODO fix styling with page header*/}
        <EditButton onClick={() => updateSubState("view")}>
          Cancel
        </EditButton>
        <EditButton onClick={async () => {
          const s = await submit();
          if(s)
            updateSubState("view", true)
        }}>
          Create
        </EditButton>
        <EditButton onClick={async () => {
          const s = await submit(true);
          if(s)
            updateSubState("view",true)
        }}>
          Create and publish
        </EditButton>

        <EventSpecifics
            dimensions={dimensions}
            handleImageLoad={handleImageLoad}
            name={name}
            t={t}
            sname={sname}
            setImage={setImage}
            image={image}
            start={start}
            setStart={setStart}
            end={end}
            setEnd={setEnd}
            loc={loc}
            setLoc={setLoc}
            addr={addr}
            saddr={saddr}
            city={city}
            scity={scity}
            zip={zip}
            szip={szip}
            sage={sage}
            age={age}
            bio={bio}
            sbio={sbio}
            cost={cost}
            scost={scost}
            spm={spm}
            selectedArtist={selectedArtist}
            searchArtists={searchArtists}
            setSelectedArtist={setSelectedArtist}
            addedArtists={addedArtists}
            setAddedArtists={setAddedArtists}
            setShow={setShow}
            artists={artists}
            setArtists={setArtists}
            removedArtists={removedArtists}
            setRemovedArtists={setRemovedArtists}
        />
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


