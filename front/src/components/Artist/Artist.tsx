// @deno-types="npm:@types/react"
import { useMemo, useState } from "react";
import { postFileRequest, postRequest } from "../../api/APITemplate.ts";
import { Button } from "react-bootstrap";
import { LiaEnvelope, LiaPencilAltSolid, LiaTrashAltSolid } from "react-icons/lia";
import type { Artist } from "../../../../api/Database/Model/Artist.ts";
import { PageState, StateHandler, SubState } from "../../utilities/Types.tsx";
import Grid from "../Misc/Grid.tsx";
import { Control, DynamicListForm, TextArea, UnderwaveHeader } from "../../utilities/Functions.tsx";
import { EditableProfileHeaders, EditableProfileMenu } from "../Misc/EditableProfileBase.tsx";
//@ts-ignore bah
import cd from "../../resources/Images-Assets/cd+cover.png";
import { useImageDimensions } from "../../Hooks.ts";
import { Theme } from "../../theme.ts";
import { FlexCol, Row } from "../Misc/CustomStyles.tsx";
import { Link } from "../../../../api/Database/Model/Link.ts";
import { urlPattern } from "../../utilities/Regex.ts";
import { Media } from "../../../../api/Database/Model/Media.ts";
import { ProfilePicture } from "../Misc/ProfilePicture.tsx";
import paths from "../../../../Shared/paths.ts";
import { toast } from "react-toastify";
import Event from "../../../../api/Database/Model/Event.ts";
import ReactImageUploading, { ImageListType } from "react-images-uploading";
import { ExportInterface } from "react-images-uploading/dist/typings.d.ts";

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
          <EditableProfileMenu pageState={pageState} setPageState={setPageState} updateSubState={updateSubState} />
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
  const [images, setImages] = useState<Media[]>(artist.Bio?.Media ? artist.Bio.Media :[]);
  const [links, setLinks] = useState<Link[]>(artist.Bio?.Links ? artist.Bio.Links : []);

  async function submit() {
    const data = {
      name: name,
      email: email,
      bio: bio,
      members: members,
      genre: genre,
      images: images,
      links: links
    }

    const res = await postRequest<Artist>(paths.artist.update, data);

    const posterRes = await postFileRequest("/artist/bio/update/poster", { poster: poster[0].file });

    if(res.isSuccess()) {
      toast.success("Profile updated");
    } else {
      toast.error("Error updating profile");
    }
  }
  function reset() {
    setName(artist.name);
    setEmail(artist.email);
    setBio(artist.Bio ? artist.Bio.description : "");
    setMembers(artist.Members);
    setGenre(artist.genre);
    setPoster([{ data_url: artist.poster }]);
    setImages(artist.Bio?.Media ? artist.Bio.Media :[]);
    setLinks(artist.Bio?.Links ? artist.Bio.Links : []);
  }

  const edit = useMemo(() => subState === "edit", [subState]);

  const onChange = (imageList: ImageListType, addUpdateIndex: number) => {
    // data for submit
    console.log(imageList, addUpdateIndex);
    setPoster(imageList);
  };

  return (
    <>
    <EditableProfileHeaders subState={subState} updateSubState={updateSubState} submit={submit} reset={reset} />
      <div className="profile">
        <Grid>
          <FlexCol>
            <div className="silly-row-start">
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
                state={name}
                color={t.redBrown}
                setState={edit ? setName : undefined}
              />

            </div>
            <Row justifycontent="start">
            <FlexCol>
              <DynamicListForm
                requiredKeys={["name"]}
                array={members}
                header={"Members"}
                as="h3"
                color={t.redBrown}
                pattern={/.+/}
                setArray={setMembers}
                template={{ name: ""}}
                disabled={!edit}
              />
              <Control
                className="mt-3"
                header={"Sample"}
                as="h3" state={""}
                setState={undefined}
                color={t.redBrown}
              />
              <DynamicListForm
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
          </FlexCol>
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
            <UnderwaveHeader header="Images" as="h3" color={t.redBrown} disabled={!edit} />
            <div style={{display: "flex", justifyContent: "left"}}>
            <div style={{overflowX: "auto", width:"30vw", display: "inline-block", whiteSpace:"nowrap"}}  className="mt-3">
              {[0,1,2,3,4,5,6,7].map((i) => {
                return <ArtistImage image={{href: cd}} key={i}/>
              })}
            </div>
            </div>
          </FlexCol>
        </Grid>
      </div>
    </>
  )
}

function ArtistImage({image}:{image: Partial<Media>}) {
  return <img className="p-3" src={image.href} alt={"Image"} style={{width: "140px", height: "140px"}}/>
}

function ArtistEvents({ artist, subState, updateSubState }: { artist: Artist, subState: SubState, updateSubState: (subState: SubState, refetch?: boolean) => void }) {
  const [pastEvents, setpastEvents] = useState<Event[]>(artist.Events.filter(a => new Date(a.end) < new Date()));
  const [upcomingEvents, setupcomingEvents] = useState<Event[]>(() => artist.Events.filter(a => new Date(a.start) > new Date()));
  const [currentEvent, setCurrentEvent] = useState<Event>();
  const t = useMemo(() => new Theme(), []);

  return (<div>

  </div>);
}

