import { Link } from "../../../../api/Database/Model/Link.ts";
import { FaFacebookSquare, FaInstagram, FaSoundcloud, FaSpotify, FaYoutube, FaLink } from "react-icons/fa";
import { IconType } from "react-icons";


declare type LinksProps<T> = {
  item: T
}
function Links<T extends { Bio?: { Links?: Link[]}}>({
  item
}: LinksProps<T>) {
  return (
    <>
      {item.Bio?.Links ? (
        item.Bio.Links.map((link, idx) => {
          const Element = ResolveLink(link);
          return <a style={{margin: "2%"}} href={link.url} key={idx}>
            <Element size={45} />
          </a>;
        })
      ): "No links yet"}
    </>
  )
}

const KNOWN = {
  YOUTUBE: "www.youtube.com",
  INSTAGRAM: "www.instagram.com",
  FACEBOOK: "www.facebook.com",
  SPOTIFY: "open.spotify.com",
  SOUNDCLOUD: "www.soundcloud.com",
} as const

function ResolveLink(link: Link): IconType {
  function classify(searchTerm: keyof typeof KNOWN) {
    return link.url.startsWith(`https://${searchTerm}`)
  }
  if( classify(KNOWN.YOUTUBE))
    return FaYoutube;
  if( classify(KNOWN.INSTAGRAM))
    return FaInstagram;
  if( classify(KNOWN.FACEBOOK))
    return FaFacebookSquare;
  if( classify(KNOWN.SPOTIFY))
    return FaSpotify
  if( classify(KNOWN.SOUNDCLOUD))
    return FaSoundcloud;
  return FaLink
}

export { Links };


