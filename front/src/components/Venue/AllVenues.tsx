import Grid from "../Misc/Grid.tsx";
import { useAuth, useRequest } from "../../Hooks.ts";
import { Filter, ObjectEntries } from "../../utilities/Types.tsx";
//@deno-types="npm:@types/react"
import { useState } from "react";
import { ListFilter } from "../Misc/Filter.tsx";
import { ListWrapper } from "../Misc/CustomStyles.tsx";
import paths from "../../../../Shared/paths.ts";
import { Loading } from "../../utilities/Loading.tsx";
import { Venue } from "../../../../api/Database/Model/Venue.ts";
import { ObservableListItem } from "../Misc/ObservableListItem.tsx";
import { refetchFollowedVenues, venueFollowing } from "../../store.ts";
import { useAtom } from "jotai";
import { followVenue, unfollowVenue } from "../../api/Common.ts";
import Fuse from "fuse.js";
import { IoLocationSharp } from "react-icons/io5";

function AllVenues() {
  useAuth(-1);
  const [filters, setFilters] = useState<Filter>({
    name: {
      value: "",
      label: "Name",
      type: "text"
    },
    address: {
      value: "",
      label: "Address",
      type: "text"
    }
  });

  const [filteredList, setFilteredList] = useState<Venue[]>([]);

  function fuseText(list: Venue[], key: keyof (typeof filters)) {
    const fuse = new Fuse(list, {
      keys: [String(key)],
    });
    return fuse.search(String(filters[key].value))
  }

  function onFilter() {
    let finalFiltered: Venue[] = venues.response ? venues.response : [];
    for (const [k, v] of ObjectEntries(filters)) {
      switch (k) {
        case "name":
          if (v.value !== "") {
            finalFiltered = fuseText(finalFiltered, "name").map((a) => a.item)
          }
          break;
        case "address":
          if (v.value !== "") {
            finalFiltered = fuseText(finalFiltered, "address").map((a) => a.item)
          }
          break;
        default:
          break;
      }
    }
    setFilteredList(finalFiltered);
  }

  function reset() {
    setFilteredList(venues.response ? venues.response : []);
    setFilters({
      name: {
        value: "",
        label: "Name",
        type: "text"
      },
      address: {
        value: "",
        label: "Address",
        type: "text"
      }
    })
  }

  const [, setRefetch] = useAtom(refetchFollowedVenues)

  const venues = useRequest<Venue[]>(paths.venue.all);

  if (!venues.response) return <div>Error</div>;

  if (venues.isLoading) return <Loading />;

  if (venues.isError)
    return <div style={{ marginTop: "60px" }}>{venues.isError}</div>;

  return (
    <Grid narrowColumnIndex={0} header={"Venues"}>
      <ListFilter filters={filters} setFilters={setFilters} onFilter={onFilter} reset={reset} />
      <ListWrapper>
        <div className="row-wrap-start" >
          {filteredList.map((a, idx) =>
            <ObservableListItem
              item={a}
              key={idx}
              refetchAtom={venueFollowing}
              setRefetch={setRefetch}
              navigatePath={"/venues/public?venueId"}
              follow={followVenue}
              unfollow={unfollowVenue}
            >
              {a.address ? (
              <div>
                <IoLocationSharp size={30} style={{ marginRight: "5px" }} />
                {a.address}
              </div>
              ) : null}
            </ObservableListItem>
          )}
        </div>
      </ListWrapper>
    </Grid>
  )
}

export {AllVenues}