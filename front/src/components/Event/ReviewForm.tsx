import { useState } from "react";
import { StyledEditableProfile } from "../Misc/CustomStyles.tsx";
import { Control, TextArea, UnderwaveHeader } from "../../utilities/Functions.tsx";
import Grid from "../Misc/Grid.tsx";
import { useAuth } from "../../Hooks.ts";
import { useAtom } from "jotai";
import { user } from "../../store.ts";
import { useParams, useSearchParams } from "react-router-dom";
import { postRequest, requestAndToast } from "../../api/APITemplate.ts";
import { Review } from "../../../../api/Database/Model/Review.ts";
import { toast } from "react-toastify";
import { Rating } from "@smastrom/react-rating";
import '@smastrom/react-rating/style.css'
import { Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom"
import { Method} from "../../utilities/Types.tsx";

function ReviewForm() {
  useAuth(1);
  const [u] = useAtom(user);
  const params = useParams();
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0.5);
  const [sp] = useSearchParams();
  const loc = useLocation();
  const navigate = useNavigate();


  async function postReview() {
    const path = u.type === 2 ? `/venue/rate/${params.eventId}/${sp.get("artistId")}` : `/artist/rate/${params.eventId}/${sp.get("venueId")}`;
    const a = await requestAndToast<Review>(Method.POST, path, { description: reviewText, score: rating });
    if(a.isSuccess()) {
      navigate(-1);
    }
  }


  return (
    <StyledEditableProfile>
      <Grid header="Review">
        <div>
          <UnderwaveHeader header={`Reviewing: ${loc.state.name}`} as={"h3"}/>
          <UnderwaveHeader header={`For event: ${loc.state.eventName}`} as={"h3"}/>
          <hr/>
        <TextArea
          className="mb-3"
          header="Review"
          notes={`The review will be shown only to other venues and the artist in question and is not meant to be
          a review of performance but rather a review of how it was working with the artist before and during the event`}
          as={"h3"}
          state={reviewText}
          setState={setReviewText} />
          <br/>
          <UnderwaveHeader
            header={"Rating"}
            as={"h3"}
            notes={`The star-rating will be shown only to other venues and the artist in question and is not meant to be 
            an indication of performance but rather an indication of how it was working with the artist before and during the event`}
          />
        <Rating
          isRequired
          halfFillMode="svg"
          value={rating}
          items={5}
          onChange={setRating}
          style={{maxWidth: "30%"}}
        />
          <br/>
          <Button onClick={async () => postReview()}>Submit review</Button>
        </div>
      </Grid>
    </StyledEditableProfile>
  )
}

export { ReviewForm };