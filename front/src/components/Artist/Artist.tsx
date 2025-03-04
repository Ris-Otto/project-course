// @deno-types="npm:@types/react"
import { useMemo, useState } from "react";
import { getImage, postFileRequest, postRequest } from "../../api/APITemplate.ts";
import { Button, Col } from "react-bootstrap";
import { LiaEnvelope, LiaPencilAltSolid, LiaTrashAltSolid } from "react-icons/lia";
import type { Artist } from "../../../../api/Database/Model/Artist.ts";
import { PageState, StateHandler, SubState } from "../../utilities/Types.tsx";
import Grid from "../Misc/Grid.tsx";
import { Control, DynamicListForm, TextArea, UnderwaveHeader } from "../../utilities/Functions.tsx";
import { EditableProfileHeaders, EditableProfileMenu } from "../Misc/EditableProfileBase.tsx";
//@ts-ignore bah

import { useImageDimensions } from "../../Hooks.ts";
import { Theme } from "../../theme.ts";
import { FlexCol, ListWrapper, Row } from "../Misc/CustomStyles.tsx";
import { Link } from "../../../../api/Database/Model/Link.ts";
import { urlPattern } from "../../utilities/Regex.ts";
import { Media } from "../../../../api/Database/Model/Media.ts";
import { ProfilePicture } from "../Misc/ProfilePicture.tsx";
import paths from "../../../../Shared/paths.ts";
import { toast } from "react-toastify";
import Event from "../../../../api/Database/Model/Event.ts";
import ReactImageUploading, { ImageListType } from "react-images-uploading";
import { ExportInterface } from "react-images-uploading/dist/typings.d.ts";
import { VenueEvent } from "../Venue/Venue.tsx";
import { Posts } from "../Misc/Posts.tsx";
import { SingleImage } from "../Misc/CreatePost.tsx";
import { ProfileImages } from "../Misc/ProfileImages.tsx";

declare type ArtistProfileProps = {
  value: Artist;
  subState: SubState;
  updateSubState: (subState: SubState, refetch?: boolean) => void;
  pageState: PageState;
  setPageState: StateHandler<PageState>;
}

export function ArtistProfile({value, subState, updateSubState, setPageState, pageState}: ArtistProfileProps) {
  return (
    <Grid
      header={value.name}
      narrowColumnIndex={0}
      wideColumnIndex={1}
    >
      <EditableProfileMenu pageState={pageState} setPageState={setPageState} updateSubState={updateSubState} states={"artist"} />
      <div style={{ borderLeft: "1px solid black", paddingLeft: "50px" }}>
        {pageState === "profile" ? (
          <ArtistViewProfile
              artist={value}
              subState={subState}
              updateSubState={updateSubState}
          />
        ) : pageState === "events" ? (
          <ArtistEvents
              subState={subState}
              artist={value}
              updateSubState={updateSubState}
          />
        ) : pageState === "posts" ? (
          <Posts updateSubState={updateSubState} subState={subState} />
        ) : null}
      </div>
    </Grid>

  );
}

function ArtistViewProfile({ artist, subState, updateSubState }: { artist: Artist, subState: SubState, updateSubState: (subState: SubState, refetch?: boolean) => void }) {
  const { dimensions, handleImageLoad } = useImageDimensions();
  const t = useMemo(() => new Theme(), []);
  const [name, setName] = useState(artist.name);
  const [email, setEmail] = useState(artist.email);
  const [bio, setBio] = useState(artist.Bio ? artist.Bio.description : "");
  const [members, setMembers] = useState(artist.Members);
  const [genre, setGenre] = useState(artist.genre);
  const [poster, setPoster] = useState<ImageListType>([{ data_url: artist.poster }])
  const [images, setImages] = useState<ImageListType>(
    artist.Bio?.Media ?
    artist.Bio.Media.map(a => {
      return { data_url: getImage(a.href), internalised: true }
    }) :
    []
  );
  const [sample, setSample] = useState(artist.Bio?.Links?.filter(a => a.sample))
  const [links, setLinks] = useState<Link[]>(artist.Bio?.Links ? artist.Bio.Links : []);

  function checkBio() {
    let update = false;
    if(bio !== artist.Bio?.description) {
      update = true;
    }
    const artistLinks = artist.Bio?.Links;
    if(!artistLinks && links.length > 0) return true;

    for (let i = 0; i < links.length; i++) {
      if(artistLinks.find(l => l.url !== links[i].url)) {
        update = true;
        break;
      }
    }
    return update;
  }

  function checkArtist() {
    let update = false;
    if(name !== artist.name) {
      update = true;
    }
    if(genre !== artist.address) {
      update = true;
    }

    if(members.find(a => a.id === undefined)) {
      update = true;
    }
    if(bio !== artist.Bio?.description) {
      update = true;
    }
    const artistLinks = artist.Bio?.Links;
    if(!artistLinks && links.length > 0) return true;

    for (let i = 0; i < links.length; i++) {
      if(artistLinks.find(l => l.url !== links[i].url)) {
        update = true;
        break;
      }
    }

    return update;
  }

  async function submit() {
    let updated = false;
    if(checkArtist()) {
      const data = {
        name: name,
        email: email,
        bio: bio,
        members: members.filter(m => m.name.length > 0),
        genre: genre,
        links: links.filter(l => l.url.length > 0)
      }
      const res = await postRequest<Artist>(paths.artist.update, data);
      if(res.isSuccess()) {
        toast.success("Profile updated");
      } else {
        toast.error("Error updating profile");
      }
      updated = true;
    }


    if(poster[0].file) {
      const posterRes = await postFileRequest("/artist/bio/update/poster", { poster: poster[0].file });
      if(posterRes.isSuccess()) {
        toast.success("Picture updated")
      }
      updated = true;
    }

    if(images.length > 0) {
      const imagesWillBeUpdated = images.find(image => !image.internalised);
      const imgs = images.map((image) => image.internalised ? image.data_url : image.file);
      const imagesRes = await postFileRequest(`/artist/media/upload`, { media: imgs });
      if(!imagesWillBeUpdated) return updated;
      if(imagesRes.isSuccess()) {
        toast.success("Images updated")
      } else {
        toast.error("Failed to update images", { autoClose: false })
      }
      updated = true;
    }

    console.log(updated);
    return updated;
  }
  function reset() {
    setName(artist.name);
    setEmail(artist.email);
    setBio(artist.Bio ? artist.Bio.description : "");
    setMembers(artist.Members);
    setGenre(artist.genre);
    setPoster([{ data_url: artist.poster }]);
    setImages(artist.Bio?.Media ?
      artist.Bio.Media.map(a => {
        return { data_url: getImage(a.href), internalised: true }
      }) :
      []);
    setLinks(artist.Bio?.Links ? artist.Bio.Links : []);
  }

  const edit = useMemo(() => subState === "edit", [subState]);

  const onChange = (imageList: ImageListType, _addUpdateIndex: number) => {
    // data for submit
    setPoster(imageList);
  };

  const onImagesChange = (imageList: ImageListType) => {
    setImages(imageList);
  }

  return (
    <>
    <EditableProfileHeaders subState={subState} updateSubState={updateSubState} submit={submit} reset={reset} />
      <div className="profile" style={{textAlign: "left"}}>
        <Grid>
          <Col>
            <Row justifycontent={"start"}>
              {/*@ts-ignore bah*/}
              <ReactImageUploading
                value={poster}
                onChange={onChange}
                maxNumber={1}
                dataURLKey="data_url"
              >
                {({
                  imageList,
                  onImageUpload,
                  onImageUpdate,
                  onImageRemove,
                  isDragging,
                  dragProps,
                  }: ExportInterface) => (
                  // write your building UI
                  <div className="upload__image-wrapper">
                    {(edit && poster.length === 0) ? (
                      <>
                        <Button
                          style={isDragging ? { color: 'red' } : undefined}
                          onClick={onImageUpload}
                          {...dragProps}
                        >
                          Click or Drop here
                        </Button>
                        &nbsp;
                      </>
                    ): null}
                    {imageList.map((image, index) => (
                      <div key={index} className="image-item">
                        <ProfilePicture item={artist} image={image.data_url} dimensions={dimensions} handleImageLoad={handleImageLoad} />
                        {edit ? (
                          <div style={{textAlign: "center"}}>
                            <Button onClick={() => onImageUpdate(index)}><LiaPencilAltSolid /></Button>
                            <Button onClick={() => onImageRemove(index)}><LiaTrashAltSolid/></Button>
                          </div>
                        ): null}
                      </div>
                    ))}
                  </div>
                )}
              </ReactImageUploading>
              <Control
                as={"h3"}
                header={"Artist name"}
                className={"m-3"}
                state={name}
                color={t.redBrown}
                setState={edit ? setName : undefined}
              />
            </Row>
            <Row justifycontent="start">
            <FlexCol>
              <DynamicListForm
                requiredKeys={["name"]}
                array={members}
                header={"Members"}
                as="h3"
                color={t.redBrown}
                pattern={/.+/}
                //@ts-ignore bah
                setArray={setMembers}
                template={{ name: "", role: "" }}
                disabled={!edit}
              />
              <Control
                header={"Sample"}
                as={"h3"}
                state={sample}
                setState={edit ? setSample : undefined}
                pattern={urlPattern}
                color={t.redBrown}
              />
              <DynamicListForm
                requiredKeys={["url"]}
                header={"Links"}
                as="h3"
                color={t.redBrown}
                array={links}
                setArray={setLinks}
                pattern={urlPattern}
                template={{ url: "" }}
                disabled={!edit}
              />
            </FlexCol>
            </Row>
          </Col>

          <FlexCol>

            <Control
              header="Genre"
              as="h3"
              state={genre}
              setState={edit ? setGenre : undefined}
              color={t.redBrown}
            />

            <TextArea
              header="Bio"
              as="h3"
              state={bio}
              setState={edit ? setBio : undefined}
              color={t.redBrown}
            />

            <div className="mt-3">
              <UnderwaveHeader
                header="Contact"
                as="h3"
                color={t.redBrown}
                disabled={!edit}
              />
              <Row justifycontent="start">
                <LiaEnvelope
                  size={45}
                  style={{ marginBottom: "5px", color: edit ? t.redBrown : "grey" }} />
                <Control
                  state={email}
                  setState={edit ? setEmail : undefined}
                />
              </Row>
            </div>
            <div style={{overflowX: "auto", maxWidth: "50%", whiteSpace:"nowrap"}}>
            <UnderwaveHeader header="Images" as="h3" color={t.redBrown} disabled={!edit} />
              {/*@ts-ignore bah*/}
              <br/>
              <ProfileImages edit={edit} images={images} onImagesChange={onImagesChange} />
            </div>
          </FlexCol>
        </Grid>
      </div>
    </>
  )
}

export function ArtistImage({image}:{image: Partial<Media>}) {
  return <a target="_blank" href={image.href}><img className="p-3" src={image.href} alt={"Image"} style={{width: "140px", height: "140px"}}/></a>
}

function ArtistEvents({ artist, updateSubState }: { artist: Artist, subState: SubState, updateSubState: (subState: SubState, refetch?: boolean) => void }) {
  const [pastEvents, _setpastEvents] = useState<Event[]>(artist.Events.filter(a => new Date(a.end) < new Date()));
  const [upcomingEvents, _setupcomingEvents] = useState<Event[]>(() => artist.Events.filter(a => new Date(a.start) > new Date()));
  const [_currentEvent, setCurrentEvent] = useState<Event>();
  const t = useMemo(() => new Theme(), []);

  return (
    <ListWrapper>
      <UnderwaveHeader as="h3" header={"Upcoming events"} color={t.redBrown} />
      <div className="row-wrap-start m-3">
      {upcomingEvents.map((a, idx) =>
        <div key={idx} style={{margin: "2%"}}>
        <VenueEvent event={a} updateSubState={updateSubState} setCurrentEvent={setCurrentEvent} viewable showName />
        </div>
      )}
      </div>
      <UnderwaveHeader as="h3" header={"Past events"} color={t.redBrown} />
      <div className="row-wrap-start m-3">
      {pastEvents.map((a, idx) =>
        <div key={idx} style={{margin: "2%"}}>
        <VenueEvent key={idx} event={a} updateSubState={updateSubState} setCurrentEvent={setCurrentEvent} viewable showName />
        </div>
      )}
      </div>
  </ListWrapper>
  );
}

