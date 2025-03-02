// @deno-types="@types/react";
import { useState, useMemo } from "react";
import { useImageDimensions } from "../../Hooks.ts";
import {Control} from "../../utilities/Functions.tsx";
import { Theme } from "../../theme.ts";
import Event from "../../../../api/Database/Model/Event.ts";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { postFileRequest, postRequest } from "../../api/APITemplate.ts";
import paths from "../../../../Shared/paths.ts";
import { convertToDateTimeLocalString } from "../../utilities/Functions.tsx";
import { EventSpecifics } from "./EventSpecifics.tsx";
import {EditButton} from "../User/StyledProfile.tsx";
import { toast } from "react-toastify";
import {SearchArtist, SubState} from "../../utilities/Types.tsx";
import { ImageListType } from "npm:react-images-uploading@3.1.7";

function EditEvent({ event, updateSubState }: {
  event: Event,
  updateSubState: (subState: SubState, refetch?: boolean) => void
}) {
  const { dimensions, handleImageLoad } = useImageDimensions(
    globalThis.innerHeight / 4,
  );
  const t = useMemo(() => new Theme(), []);
  const [name, sname] = useState(() => event.name);
  const [selectedArtist, setSelectedArtist] = useState<SearchArtist>();
  const [nonArtist, setNonArtist] = useState<{ name: string, genre: string, description: string}>({ name: "", genre: "", description: ""})
  const [addedArtists, setAddedArtists] = useState<SearchArtist[]>(event.Artists.map(a => { return {value: a.id, label: a.name}}));
  const [removedArtists, setRemovedArtists] = useState<SearchArtist[]>([]);
  const [artists, setArtists] = useState<SearchArtist[]>(event.Artists.map(a => { return {value: a.id, label: a.name}}));
  const [addr, saddr] = useState(() => event.Venue.address);
  const [zip, szip] = useState(() => event.Venue.zip);
  const [city, scity] = useState(() => event.Venue.city);
  const [bio, sbio] = useState(() => (event.Bio ? event.Bio.description : ""));
  const [start, setStart] = useState(() => convertToDateTimeLocalString(new Date(event.start)));
  const [end, setEnd] = useState(() => convertToDateTimeLocalString(new Date(event.end)));
  const [published, setPublished] = useState(() => event.published);
  const [age, sage] = useState(() => event.age);
  const [cost, scost] = useState(() => event.Pricing?.amount ? event.Pricing.amount : 0);
  const [pm, spm] = useState(() => event.Pricing?.type ? event.Pricing.type : 0);
  const [capacity, scapacity] = useState(0);
  const [type, stype] = useState("");
  const [tags, stags] = useState("");

  const [image, setImage] = useState<ImageListType>(
    [{ data_url: event.poster }]
  );
  const [loc, setLoc] = useState(0);

  const [show, setShow] = useState(false);

  function searchArtists(inputValue: string, callback: (options: SearchArtist[]) => void) {
    return postRequest<SearchArtist[]>(paths.artist.search, { searchValue: inputValue })
        .then(response => response.response)
        .then(data => callback(data));
  }

  async function submit(): Promise<boolean> {

    if(pm <= 0 && cost !== 0) {
      toast.warn("Please choose a valid payment method")
      return false;
    }
    if(pm !== 0 && cost <= 0) {
      toast.warn("Please enter a valid price")
      return false;
    }

    const res = await postRequest<Event>(`${paths.venue.event.update}/${event.id}`, {
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
      published: published,
      amount: cost,
      age: age,
      paymentMethod: pm,
    })

    const ret = res.isSuccess();

    if(!ret) {
      toast("Something went wrong, please try again later");
    } else {
      toast("Event updated");
    }

    if(image[0].file) {
      const posterRes = await postFileRequest(`venue/event/update/${res.response.id}/poster`, { poster: image[0].file });
      if(posterRes.isSuccess()) {
        toast("Poster added")
      } else {
        toast.error("Something went wrong when adding event poster")
      }
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
            <Control
              color={t.redBrown}
              header="Name"
              state={nonArtist.name}
              onChange={(e) => setNonArtist({...nonArtist, name: e.target.value})} />
            <Control
              color={t.redBrown}
              header="Genre"
              state={nonArtist.genre}
              onChange={(e) => setNonArtist({...nonArtist, genre: e.target.value})} />
            <Control
              color={t.redBrown}
              header="Introduction/Bio"
              state={nonArtist.description}
              onChange={(e) => setNonArtist({...nonArtist, description: e.target.value})} />
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
          Save
        </EditButton>

        <EventSpecifics
          dimensions={dimensions}
          handleImageLoad={handleImageLoad}
          image={image}
          setImage={setImage}
          name={name}
          t={t}
          sname={sname}
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
          pm={pm}
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
          edit={true}
        />
      </div>
  );
}

export { EditEvent };
