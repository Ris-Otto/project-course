import { Venue } from "../../Database/Model/Venue.ts";
import { Artist } from "../../Database/Model/Artist.ts";
import { Media } from "../../Database/Model/Media.ts";
import readFileSync = Deno.readFileSync;

async function addPoster<T extends Venue | Artist | Event>(
  model: T,
  media: Media[],
) {
}

export function getPoster<
  T extends { Bio?: { Media?: Media[] }; [index: string]: any },
>(model: T) {
  const poster = model.Bio?.Media?.find((m) => m.poster === true);
  if (poster) {
    return getImage(poster.href);
  }
}

export function getImage(imagePath: string) {
  const a = readFileSync(`./uploads/${imagePath}`);
  const b = btoa(String.fromCharCode.apply(null, a as unknown as number[]));
  return "data:image/png;base64," + b;
}

export function getModelWithPoster<
  T extends { Bio?: { Media?: Media[] }; [index: string]: any },
>(model: T) {
  return { ...model, poster: getPoster(model) };
}

export async function upsertMedia(
  id: string | number,
  bioId: number,
  file: any,
  poster?: boolean,
) {
  const [name, extension] = file.name.split(".");
  await Media.upsert({
    BioId: bioId,
    internal: true,
    href: `${name}-${id}.${extension}`,
    poster: poster ? poster : null,
  });
}
