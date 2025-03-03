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
  if (typeof file === "string") {
    return;
  }
  const [name, extension] = file.name.split(".");
  await Media.upsert({
    BioId: bioId,
    internal: true,
    href: `${name}-${id}.${extension}`,
    poster: poster ? poster : null,
  });
}

export async function deleteMedia(
  files: any[],
  media: Media[],
  id: string,
  bioId: number,
) {
  for (const m of media) {
    if (m.poster) continue;
    let remove = true;
    for (const file of files) {
      let fullName = "";
      if (typeof file === "string") {
        const temp = file.split("/");
        fullName = temp[temp.length - 1];
      } else {
        const [name, extension] = file.name.split(".");
        fullName = `${name}-${id}.${extension}`;
      }
      if (fullName === m.href) {
        remove = false;
      }
    }
    if (remove) {
      await Media.destroy({
        where: {
          href: m.href,
          bioId: bioId,
        },
      });
    }
  }
}
