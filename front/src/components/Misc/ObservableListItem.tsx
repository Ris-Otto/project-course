import { useImageDimensions } from "../../Hooks.ts";
import { StyledListBox } from "./CustomStyles.tsx";
import { FollowHeartSmall } from "./MiscComponents.tsx";
import { ProfilePicture } from "./ProfilePicture.tsx";
import { useAtom } from "jotai";
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PrimitiveAtom } from "jotai/vanilla/atom"
import { Media } from "../../../../api/Database/Model/Media.ts";

export type ObservableItem = {
  id: string;
  name: string;
  Bio?: {
    description?: string;
    Media?: Partial<Media>[];
  };
  poster?: string;
};

type SimpleObservableListItemProps<T extends ObservableItem> = {
  item: T;
  children?: React.ReactNode;
  navigatePath?: string;
}

type ObservableListItemProps<T extends ObservableItem> = {
  setRefetch?: (s: boolean | ((s: boolean) => boolean)) => void;
  refetchAtom?: PrimitiveAtom<T[]>;
  follow?: (id: string, callback: (s: boolean | ((s: boolean) => boolean)) => void) => Promise<boolean>;
  unfollow?: (id: string, callback: (s: boolean | ((s: boolean) => boolean)) => void) => Promise<boolean>;
} & SimpleObservableListItemProps<T>

function ObservableListItem<T extends ObservableItem>({ item, setRefetch, refetchAtom, navigatePath, follow, unfollow, children }: ObservableListItemProps<T> ) {
  const { dimensions, handleImageLoad } = useImageDimensions(
    globalThis.innerHeight / 5,
  );
  const [af,] = useAtom(refetchAtom)
  const isFollowing = useMemo(() => {
    return 1 === af.filter((a) => a.id === item.id).length;
  }, [af]);
  const p = useMemo(() => dimensions.height * 0.12, [dimensions]);
  const navigate = useNavigate();
  const img = useMemo(() => item.poster, [item])
  return (
    <StyledListBox
      minwidth={`${dimensions.height}px`}
      padding={String(p)}
      className="m-3"
    >
      <div className={"mb-3"}>
        <FollowHeartSmall setRefetch={setRefetch} id={item.id} follow={follow} unfollow={unfollow} followed={isFollowing} />
      </div>
      <div style={{cursor: "pointer"}} onClick={() => navigate(`${navigatePath}=${item.id}`)}>
        <ProfilePicture
          item={item}
          image={img}
          showName={true}
          dimensions={dimensions}
          handleImageLoad={handleImageLoad}
        />
      </div>
        <div
          className="description mt-3 mb-3"
          style={{ maxWidth: `${dimensions.height}px` }}
        >
          {item.Bio?.description ? item.Bio.description : "No description"}
        </div>
        {children}
    </StyledListBox>
  )
}

function SimpleObservableListItem<T extends ObservableItem>({item, navigatePath, children}: SimpleObservableListItemProps<T>) {

  const { dimensions, handleImageLoad } = useImageDimensions(
    globalThis.innerHeight / 5,
  );
  const p = useMemo(() => dimensions.height * 0.12, [dimensions]);
  const navigate = useNavigate();
  const img = useMemo(() => item.poster, [item])
  return (
    <StyledListBox
      minwidth={`${dimensions.height}px`}
      padding={String(p)}
      className="m-3"
    >
      <>
      <div style={{cursor: "pointer"}} onClick={() => navigate(`${navigatePath}=${item.id}`)}>
        <ProfilePicture
          item={item}
          image={img}
          showName={true}
          dimensions={dimensions}
          handleImageLoad={handleImageLoad}
        />
      </div>
        <div
          className="description mt-3 mb-3"
          style={{ maxWidth: `${dimensions.height}px` }}
        >
          {item.Bio?.description ? item.Bio.description : "No description"}
        </div>
        {children}
      </>
    </StyledListBox>
  )
}

export { ObservableListItem, SimpleObservableListItem };