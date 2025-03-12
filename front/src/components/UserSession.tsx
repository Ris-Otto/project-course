import { Outlet} from "react-router-dom";
// @deno-types="npm:@types/react"
import React, { useEffect, useMemo } from "react";
import { useAtom } from "jotai";
import {
  open,
  artistFollowing,
  venueFollowing,
  refetchFollowedArtists,
  refetchFollowedVenues, user, eventInterest, refetchEventInterest,
} from "../store.ts";
import NavMenu from "../Navigation/NavMenu.tsx";
import { Menu } from "./Misc/Menu.tsx";
import { useOnClickOutside, useRequest } from "../Hooks.ts";
import paths from "../../../Shared/paths.ts";
import { Artist } from "../../../api/Database/Model/Artist.ts";
import { Venue } from "../../../api/Database/Model/Venue.ts";
import Event from "../../../api/Database/Model/Event.ts";

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

  const blockRequest = useMemo(() => !u || u.type !== 0, [u])

  const artists = useRequest<Artist[]>(paths.user.artists, blockRequest)
  const venues = useRequest<Venue[]>(paths.user.venues, blockRequest);

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

  return (
    <>
      <NavMenu />
      <div ref={node}>
        <Menu />
      </div>
      <Outlet />
    </>
  );
}
