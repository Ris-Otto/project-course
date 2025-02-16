import { LiaHeart, LiaHeartSolid, LiaEnvelope } from "react-icons/lia";
import { useState } from "react";
import { useAtom } from "jotai";
import { user } from "../../store.ts";
import { Row, Button, Col } from "react-bootstrap";

type FollowHeartProps = {
  setRefetch: (s: any | ((s: any) => void)) => void;
  id: string;
  followed?: boolean;
  follow: (id: string, callback: (s: any | ((s: any) => void)) => void) => Promise<void>;
  unfollow: (id: string, callback: (s: any | ((s: any) => void)) => void) => Promise<void>;
};

export function FollowHeartSmall({
  setRefetch,
  id,
  followed,
  follow,
  unfollow
}: FollowHeartProps) {
  const [fState, setFState] = useState(followed);
  const [u, _] = useAtom(user);
  function handleMouseOver() {
    setFState(!followed);
  }
  function handleMouseLeave() {
    setFState(followed);
  }
  return (
    <Row hidden={!u} className="follow-heart-right">
      <Col
        xs={2}
        md={{ span: 2, offset: 10 }}
        onMouseOver={() => handleMouseOver()}
        onMouseLeave={() => handleMouseLeave()}
        onClick={async () => {
          followed ? await unfollow(id, setRefetch) : await follow(id, setRefetch);
        }}
      >
        {fState ? (
          <LiaHeartSolid size={30} />
        ) : (
          <LiaHeart size={30} />
        )}
      </Col>
    </Row>
  );
}

export function FollowHeartButton({
  setRefetch,
  id,
  unfollow,
  follow,
  followed,
}: FollowHeartProps) {
  const [fState, setFState] = useState(followed);
  const [u,] = useAtom(user);
  function handleMouseOver() {
    setFState(!followed);
  }
  function handleMouseLeave() {
    setFState(followed);
  }
  return (
    <Button
      hidden={!u}
      onMouseEnter={handleMouseOver}
      onMouseLeave={handleMouseLeave}
      onClick={async () => followed ? await unfollow(id, setRefetch) : await follow(id, setRefetch)}
      className="follow-share-button mb-3"
    >
      {fState ? (
        <LiaHeartSolid size={30} />
      ) : (
        <LiaHeart size={30} />
      )}
      Follow
    </Button>
  );
}

export function EmailPlaceholder() {
  return (
    <span>
      <LiaEnvelope />
      mail@example.com
    </span>
  );
}
