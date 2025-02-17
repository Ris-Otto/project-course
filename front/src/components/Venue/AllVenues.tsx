import Grid from "../Misc/Grid.tsx"
import { useAuth } from "../../Hooks.ts";
import { Filter } from "../../utilities/Types.tsx";
import { useState } from "react";
import { ListFilter } from "../Misc/Filter.tsx";
import { ListWrapper } from "../Misc/CustomStyles.tsx";
import { useRequest } from "../../Hooks.ts";
import paths from "../../../../Shared/paths.ts";
import { Loading } from "../../utilities/Loading.tsx";
import { Venue } from "../../../../api/Database/Model/Venue.ts";
import { ObservableListItem } from "../Misc/ObservableListItem.tsx";
import { venueFollowing, refetchFollowedVenues } from "../../store.ts";
import { useAtom } from "jotai";
import { followVenue, unfollowVenue } from "../../api/Common.ts";

function AllVenues() {
  useAuth(-1);
  const [filters, setFilters] = useState<Filter>({
    name: {
      value: "",
      label: "Genre",
      type: "text"
    },
    location: {
      value: "",
      label: "Location",
      type: "text"
    }
  });

  const [, setRefetch] = useAtom(refetchFollowedVenues)

  const venues = useRequest<Venue[]>(paths.venue.all);

  if (!venues.response) return <div>Error</div>;

  if (venues.isLoading) return <Loading />;

  if (venues.isError)
    return <div style={{ marginTop: "60px" }}>{venues.isError}</div>;


  return (
    <Grid narrowColumnIndex={0} header={"Venues"}>
      <ListFilter filters={filters} setFilters={setFilters} />
      <ListWrapper>
        <div className="row-wrap-start" >
          {venues.response.map((a, idx) =>
            <ObservableListItem
              item={a}
              key={idx}
              refetchAtom={venueFollowing}
              setRefetch={setRefetch}
              navigatePath={"/venues/public?venueId"}
              follow={followVenue}
              unfollow={unfollowVenue}
            />
          )}
        </div>
      </ListWrapper>
    </Grid>
  )
}

export {AllVenues}