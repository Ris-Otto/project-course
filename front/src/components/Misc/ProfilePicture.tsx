//@ts-ignore bah
import cd from "../../resources/Images-Assets/cd+cover.png";
import { ObservableItem } from "./ObservableListItem.tsx";
import { useMemo } from "react";

export declare type PictureProps = {

  dimensions: { width: number, height: number };
  handleImageLoad : (e: any) => void;
  item?: ObservableItem;
  showName?: boolean;
  image?: string;
}

function ProfilePicture({
  image,
  dimensions,
  handleImageLoad,
  item,
  showName
}: PictureProps) {

  const img = useMemo(() => image ? image : item?.Bio?.Media?.find(a => a.poster)?.href || "", [item, image]);
  return (
    <div className="picture">
      {showName? (<h4 className="picture-name">{item.name}</h4>): null}
    <img
      onLoad={handleImageLoad}
      onChange={handleImageLoad}
      style={{
        borderRadius: "10px",
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
      }}
      onError={({ currentTarget }) => {
        currentTarget.onerror = null; // prevents looping
        currentTarget.src = cd;
      }}
      src={img}
      alt={"Poster"}
    />
    </div>
  )
}

export { ProfilePicture };