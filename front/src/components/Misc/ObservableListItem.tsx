import { useImageDimensions } from "../../Hooks.ts";
import { StyledListBox } from "./CustomStyles.tsx";
import { FollowHeartSmall } from "./MiscComponents.tsx";
import { ProfilePicture } from "./ProfilePicture.tsx";
import { useAtom } from "jotai";
import { useMemo } from "react";
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
};

type ObservableListItemProps<T extends ObservableItem> = {
  item: T;
  setRefetch: (s: boolean | ((s: boolean) => boolean)) => void;
  refetchAtom: PrimitiveAtom<T[]>;
  navigatePath?: string;
  follow: (id: string, callback: (s: boolean | ((s: boolean) => boolean)) => void) => Promise<boolean>;
  unfollow: (id: string, callback: (s: boolean | ((s: boolean) => boolean)) => void) => Promise<boolean>;
}

const def = { href: "", poster: true, }

function ObservableListItem<T extends ObservableItem>({ item, setRefetch, refetchAtom, navigatePath, follow, unfollow }: ObservableListItemProps<T> ) {
  const { dimensions, handleImageLoad } = useImageDimensions(
    globalThis.innerHeight / 5,
  );
  const [af,] = useAtom(refetchAtom)
  const isFollowing = useMemo(() => {
    return 1 === af.filter((a) => a.id === item.id).length;
  }, [af]);
  const p = useMemo(() => dimensions.width * 0.12, [dimensions]);
  const navigate = useNavigate();

  return (
    <StyledListBox
      minwidth={`${dimensions.width}px`}
      padding={String(p)}
      className="m-3"
    >
      <FollowHeartSmall setRefetch={setRefetch} id={item.id} follow={follow} unfollow={unfollow} followed={isFollowing} />
      <div style={{cursor: "pointer"}} onClick={() => navigate(`${navigatePath}=${item.id}`)}>
        <ProfilePicture
          item={item}
          showName={true}
          dimensions={dimensions}
          handleImageLoad={handleImageLoad}
        />
        <div
          className="description mt-3 mb-3"
          style={{ maxWidth: `${dimensions.width}px` }}
        >
          {item.Bio?.description ? item.Bio.description : "No description"}
        </div>
      </div>
    </StyledListBox>
  )
}

export { ObservableListItem };