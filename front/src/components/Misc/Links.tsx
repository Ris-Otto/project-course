import { Link } from "../../../../api/Database/Model/Link.ts";
import { FaFacebookSquare, FaInstagram, FaSoundcloud, FaSpotify, FaYoutube, FaLink } from "react-icons/fa";
import { IconType } from "react-icons";
import { StateHandler } from "../../utilities/Types.tsx";
import { useState, useMemo } from "react";


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
          return <SingleLink link={link} key={idx} />
        })
      ): "No links yet"}
    </>
  )
}

function SingleLink({link}: {link: Link}) {
  const [warn, setWarn] = useState(false);


  function warnClick(e: React.MouseEvent<HTMLAnchorElement>) {
    const ret = confirm(`This link goes to ${link.url} \nContinue?`);
    if(!ret) {
      e.preventDefault();
    }
    return ret
  }
  const Element = useMemo(() => ResolveLink(link, setWarn), [link]);
  if(link.sample) return null;
  if(warn) {
    return <a style={{margin: "2%"}} href={link.url} onClick={warnClick} rel="noopener noreferrer" target="_blank">
      <Element size={45} />
    </a>;
  } else {
    return <a style={{margin: "2%"}} href={link.url} rel="noopener noreferrer" target="_blank">
      <Element size={45} />
    </a>;
  }
}

const KNOWN = {
  YOUTUBE: "www.youtube.com",
  INSTAGRAM: "www.instagram.com",
  FACEBOOK: "www.facebook.com",
  SPOTIFY: "open.spotify.com",
  SOUNDCLOUD: "www.soundcloud.com",
} as const

function ResolveLink(link: Link, setWarn: StateHandler<boolean>): IconType {
  function classify(searchTerm: keyof typeof KNOWN) {
    return link.url.startsWith(`https://${searchTerm}`)
  }
  if(classify(KNOWN.YOUTUBE))
    return FaYoutube;
  if( classify(KNOWN.INSTAGRAM))
    return FaInstagram;
  if( classify(KNOWN.FACEBOOK))
    return FaFacebookSquare;
  if( classify(KNOWN.SPOTIFY))
    return FaSpotify
  if( classify(KNOWN.SOUNDCLOUD))
    return FaSoundcloud;
  setWarn(true);
  return FaLink
}

export { Links };


