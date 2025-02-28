import { Outlet} from "react-router-dom";
// @deno-types="npm:@types/react"
import React, { useEffect } from "react";
import { useAtom } from "jotai";
import {
  open,
  artistFollowing,
  venueFollowing,
  refetchFollowedArtists,
  refetchFollowedVenues, user,
} from "../store.ts";
import NavMenu from "../Navigation/NavMenu.tsx";
import { Menu } from "./Misc/Menu.tsx";
import { useOnClickOutside, useRequest } from "../Hooks.ts";
import paths from "../../../Shared/paths.ts";
import { Artist } from "../../../api/Database/Model/Artist.ts";
import { Venue } from "../../../api/Database/Model/Venue.ts";

export function UserSession() {
  const [, setOpen] = useAtom(open);
  const node = React.createRef<HTMLDivElement>();
  const [u,] = useAtom(user);
  const [, setAF] = useAtom(artistFollowing);
  const [, setVF] = useAtom(venueFollowing);
  const [rfvenues] = useAtom(refetchFollowedVenues);
  const [rfartists] = useAtom(refetchFollowedArtists);
  useOnClickOutside(node, () => {
    setOpen(false);
  });

  /*if(!u || u.type !== 0) return <UserSessionOutlet ref={node} />*/
  const artists = useRequest<Artist[]>(paths.user.artists)
  const venues = useRequest<Venue[]>(paths.user.venues);

  useEffect(() => {
    if(!artists.isLoading &&  !artists.isError && artists.response) {
      setAF(artists.response);
    }

    if(!venues.isLoading &&  !venues.isError && venues.response) {
      setVF(venues.response);
    }
  }, [artists, venues]);

  useEffect(() => {
    artists.refetch();
  }, [rfartists])

  useEffect(() => {
    venues.refetch();
  }, [rfvenues])

  return <UserSessionOutlet ref={node} />;
}

function UserSessionOutlet({ref}: {ref: React.RefObject<HTMLDivElement>}){
  return (
    <>
      <NavMenu />
      <div ref={ref}>
        <Menu />
      </div>
      <Outlet />
    </>
  );
}
