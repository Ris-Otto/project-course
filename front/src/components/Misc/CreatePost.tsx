import { StateHandler } from "../../utilities/Types.tsx";
import { Control, TextArea } from "../../utilities/Functions.tsx";
import { useMemo, useEffect } from "react";
import { Button } from "react-bootstrap";
import ReactImageUploading from "react-images-uploading";
import { ImageListType } from "npm:react-images-uploading@3.1.7";
import { useImageDimensions } from "../../Hooks.ts";
import {
  LiaPencilAltSolid,
  LiaTrashAltSolid
} from "react-icons/lia"
import Grid from "./Grid.tsx";
import { Theme} from "../../theme.ts";
import { getImage} from "../../api/APITemplate.ts";


declare type CreatePostProps = {
  name: string;
  setName: StateHandler<string>;
  text: string;
  setText: StateHandler<string>;
  images: ImageListType;
  setImages: StateHandler<ImageListType>;
}
function CreatePost({
  name,
  setName,
  text,
  setText,
  images,
  setImages
}: CreatePostProps) {


  const onChange = (imageList: ImageListType, addUpdateIndex: number) => {
    setImages(imageList);
  };

  const t = useMemo(() => new Theme(), []);

  return (
    <div className={"profile"}>
    <Grid>
        <div className={"silly-column-sb"}>
          <Control state={name} setState={setName} header={"Name"} as={"h3"} color={t.redBrown}/>
          <TextArea state={text} setState={setText} header={"Text"} as={"h3"} color={t.redBrown}/>
        </div>
        {/*@ts-ignore bah*/}
      <div className={"silly-column-sb"}>
        <ReactImageUploading
          value={images}
          onChange={onChange}
          maxNumber={5}
          dataURLKey="data_url"
          multiple
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
              <Button
                style={isDragging ? { color: 'red' } : undefined}
                onClick={onImageUpload}
                {...dragProps}
              >
                Click or Drop images here
              </Button>
              <br/>
              {imageList.map((image, index) => {
                return <SingleImage index={index} image={image} key={index} onImageUpdate={onImageUpdate} onImageRemove={onImageRemove} edit />
              })}
            </div>
          )}
        </ReactImageUploading>
      </div>
    </Grid>
    </div>
  )
}

function SingleImage({image, onImageUpdate, onImageRemove, index, edit}) {
  const { dimensions, handleImageLoad } = useImageDimensions(globalThis.innerHeight / 6,);
  return (
    <div className="image-item mb-3">
      <img onLoad={handleImageLoad}
           style={{
             borderRadius: "10px",
             width: `${dimensions.width}px`,
             height: `${dimensions.height}px`,
           }}
           src={image.data_url}
           alt="picture" />
      <div hidden={!edit}>
        <Button onClick={() => onImageUpdate(index)}><LiaPencilAltSolid /></Button>
        <Button onClick={() => onImageRemove(index)}><LiaTrashAltSolid /></Button>
      </div>
    </div>
  );
}


export { CreatePost, SingleImage };