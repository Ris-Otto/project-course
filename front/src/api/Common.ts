import { postRequest } from "./APITemplate.ts";
import type { Venue } from "../../../api/Database/Model/Venue.ts";
import type { Artist } from "../../../api/Database/Model/Artist.ts";

async function followVenue(
  venueId: string,
  updateCallback: (s: any | ((s: any) => void)) => void,
) {
  const res = await postRequest<Venue>(`/user/venues/follow/${venueId}`);
  if (res.isSuccess()) {
    updateCallback((s) => !s);
  }
}

async function unfollowVenue(
  venueId: string,
  updateCallback: (s: any | ((s: any) => void)) => void,
) {
  const res = await postRequest<Venue>(`/user/venues/unfollow/${venueId}`);
  if (res.isSuccess()) {
    updateCallback((s) => !s);
  }
}

async function followArtist(
  artistId: string,
  updateCallback: (s: any | ((s: any) => void)) => void,
) {
  const res = await postRequest<Artist>(`/user/artists/follow/${artistId}`);
  if (res.isSuccess()) {
    updateCallback((s) => !s);
  }
}

async function unfollowArtist(
  artistId: string,
  updateCallback: (s: any | ((s: any) => void)) => void,
) {
  const res = await postRequest<Artist>(`/user/artists/unfollow/${artistId}`);
  if (res.isSuccess()) {
    updateCallback((s) => !s);
  }
}

export { followArtist, followVenue, unfollowArtist, unfollowVenue };
