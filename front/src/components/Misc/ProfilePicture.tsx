//@ts-ignore bah
import cd from "../../resources/Images-Assets/cd+cover.png";
import { Media } from "../../../../api/Database/Model/Media.ts";
import { ObservableItem } from "./ObservableListItem.tsx";

export declare type PictureProps = {
  image: Partial<Media>;
  dimensions: { width: number, height: number };
  handleImageLoad : (e: any) => void;
  item: ObservableItem;
  showName?: boolean;
}

function ProfilePicture({
  image,
  dimensions,
  handleImageLoad,
  item,
  showName
}: PictureProps) {
  return (
    <div className="picture">
      {showName? (<h4 className="picture-name">{item.name}</h4>): null}
    <img
      onLoad={handleImageLoad}
      style={{
        borderRadius: "10px",
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
      }}
      onError={({ currentTarget }) => {
        currentTarget.onerror = null; // prevents looping
        currentTarget.src = cd;
      }}
      src={image.href}
      alt={"Poster"}
    />
    </div>
  )
}

export { ProfilePicture };