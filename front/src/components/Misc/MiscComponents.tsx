import { LiaHeart, LiaHeartSolid } from "react-icons/lia";
import type { StateHandler } from "../../utilities/Types.ts";
import { useAtom } from "jotai";
import { user } from "../../store.ts";
import { Row, Button, Col } from "react-bootstrap";

type FollowHeartProps = {
  fState: "empty" | "filled";
  setFState: StateHandler<"empty" | "filled">;
  followArtist: () => Promise<void>;
  followed?: boolean;
};

export function FollowHeartSmall({
  fState,
  setFState,
  followArtist,
  followed,
}: FollowHeartProps) {
  const [u, _] = useAtom(user);
  return (
    <Row hidden={!u || followed} className="follow-heart-right">
      <Col
        xs={2}
        md={{ span: 2, offset: 10 }}
        onMouseEnter={() => setFState("filled")}
        onMouseLeave={() => setFState("empty")}
        onClick={async () => await followArtist()}
      >
        {fState === "empty" ? (
          <LiaHeart size={30} />
        ) : (
          <LiaHeartSolid size={30} />
        )}
      </Col>
    </Row>
  );
}

export function FollowHeartButton({
  fState,
  setFState,
  followArtist,
  followed,
}: FollowHeartProps) {
  const [u, _] = useAtom(user);
  return (
    <Button
      hidden={!u}
      onMouseEnter={() => (followed ? setFState("empty") : setFState("filled"))}
      onMouseLeave={() => (followed ? setFState("filled") : setFState("empty"))}
      onClick={async () => await followArtist()}
      className="follow-share-button mb-3"
    >
      {fState === "empty" ? (
        <LiaHeart size={30} />
      ) : (
        <LiaHeartSolid size={30} />
      )}
      Follow
    </Button>
  );
}
