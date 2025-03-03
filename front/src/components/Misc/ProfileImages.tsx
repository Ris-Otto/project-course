import { SingleImage } from "./CreatePost.tsx";
import ReactImageUploading from "react-images-uploading";
import { ExportInterface} from "react-images-uploading/dist/typings.d.ts";
import { Button } from "react-bootstrap";
import { ImageListType } from "npm:react-images-uploading@3.1.7";



function ProfileImages({images, onImagesChange, edit}: { images: ImageListType, onImagesChange: Function, edit?: boolean }) {
  return (
    <>
      {/*@ts-ignore bah*/}
      <ReactImageUploading
        style={{overflowX: "auto", width:"30vw", display: "inline-block", whiteSpace:"nowrap"}}
        value={images}
        onChange={onImagesChange}
        maxNumber={20}
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
            {(edit) ? (
              <>
                <Button
                  style={isDragging ? { color: 'red' } : undefined}
                  onClick={onImageUpload}
                  {...dragProps}
                >
                  Click or Drop here
                </Button>
                <br/>
              </>
            ): null}
            {imageList.map((image, index) => (
              <SingleImage index={index} image={image} onImageUpdate={onImageUpdate} onImageRemove={onImageRemove} key={index} edit={edit}/>
            ))}
          </div>
        )}
      </ReactImageUploading>
    </>
  )
}

export { ProfileImages };