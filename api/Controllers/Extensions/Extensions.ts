import { Media } from "../../Database/Model/Media.ts";
import { Artist, Role } from "../../Database/Model/Artist.ts";
import { Venue } from "../../Database/Model/Venue.ts";
import Event from "../../Database/Model/Event.ts";
import { Post } from "../../Database/Model/Post.ts";
import readFileSync = Deno.readFileSync;
import { ModelStatic } from "npm:sequelize";
import { Bio } from "../../Database/Model/Bio.ts";
import { NotFound, Ok } from "../../../Shared/Result.ts";
import { Link } from "../../Database/Model/Link.ts";
import { Member } from "../../Database/Model/Member.ts";

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
  files: any,
  poster?: boolean,
) {
  if (typeof files === "string" || !files) {
    return;
  }

  if (Array.isArray(files)) {
    for (const file of files) {
      if (typeof file === "string") {
        continue;
      }

      const [name, extension] = file.name.split(".");
      await Media.upsert({
        BioId: bioId,
        internal: true,
        href: `${name}-${id}.${extension}`,
        poster: poster ? poster : null,
      });
    }
    return;
  }
  if (typeof files === "string") {
    return;
  }
  const [name, extension] = files.name.split(".");
  await Media.upsert({
    BioId: bioId,
    internal: true,
    href: `${name}-${id}.${extension}`,
    poster: poster ? poster : null,
  });
}

export async function deleteMedia(
  files: any,
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

type BioModel = Artist | Venue | Post | Event;

export async function updateImages<T extends ModelStatic<BioModel>>(
  model: T,
  files: Array<File> | Array<string> | File | string,
  modelId: string | number,
  options?: {
    parentModelId?: string;
    isPoster?: boolean;
  },
) {
  const modelInstance = await model.findByPk(modelId, {
    include: [Bio],
  });

  if (!modelInstance) {
    return NotFound(null, `Entry with id ${modelId} doesn't exist`);
  }
  let bio: Bio | null;
  if (!modelInstance.Bio) {
    bio = await Bio.create({});
    await modelInstance.addBio(bio);
  } else {
    bio = modelInstance.Bio;
  }

  const fileId = options?.parentModelId
    ? options.parentModelId
    : String(modelId);

  await upsertMedia(fileId, bio!.id, files, options?.isPoster);

  if (options?.isPoster) {
    return Ok();
  }

  const allMedia = await modelInstance.Bio.getMedia();

  await deleteMedia(
    files,
    allMedia,
    fileId,
    bio!.id,
  );

  return Ok();
}

export async function updateLinks(
  bioId: number,
  newLinks: Link[],
  oldLinks: Link[],
) {
  for (const link of newLinks) {
    await Link.upsert({
      BioId: bioId,
      url: link.url,
      sample: link.sample,
    });
  }

  for (const link of oldLinks) {
    if (link.sample) continue;
    let remove = true;
    for (const dlink of newLinks) {
      if (link.url === dlink.url) {
        remove = false;
      }
    }
    if (remove) {
      Link.destroy({
        where: {
          id: link.id,
        },
      });
    }
  }
}

export async function updateMembers(oldMembers, newMembers, artistId) {
  for (const member of newMembers) {
    const [inserted] = await Member.upsert(
      {
        name: member.name,
        id: member.id,
      },
    );
    await Role.upsert({
      MemberId: inserted.id,
      ArtistId: artistId,
      role: member.role,
    });
  }

  for (const member of oldMembers) {
    let remove = true;
    for (const newMember of newMembers) {
      if (member.name === newMember.name) {
        remove = false;
        break;
      }
    }
    if (remove) {
      await Role.destroy({
        where: {
          id: member.Role.id,
          ArtistId: artistId,
          MemberId: member.id,
        },
      });
    }
  }
}
