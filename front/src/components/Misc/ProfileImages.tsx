import { SingleImage } from "./CreatePost.tsx";
import ReactImageUploading from "react-images-uploading";
import { ExportInterface} from "react-images-uploading/dist/typings.d.ts";
import { Button } from "react-bootstrap";
import { ImageListType } from "npm:react-images-uploading@3.1.7";
import { GoUpload } from "react-icons/go";



function ProfileImages({images, onImagesChange, edit}: { images: ImageListType, onImagesChange: Function, edit?: boolean }) {
  return (
      <ReactImageUploading
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
          <div>
            <Button

              hidden={!edit}
              style={isDragging ? { color: 'red', display:"flex" } : {display:"flex"}}
              onClick={onImageUpload}
              {...dragProps}
            >
              Click or drop here
            </Button>
              <div
                style={{
                  overflowX: "auto",
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "nowrap",
                }}
              >
            {imageList.map((image, index) => (
              <SingleImage index={index} image={image} onImageUpdate={onImageUpdate} onImageRemove={onImageRemove} key={index} edit={edit}/>
            ))}
            </div>

          </div>
        )}
      </ReactImageUploading>

  )
}

export { ProfileImages };