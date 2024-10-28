import { useEffect, useState } from 'react';
import {Artist, Member} from "../../../../api/Database/Model/User.ts";
import { Event } from "../../utilities/Types.ts"
import {getRequest} from "../../api/APITemplate.ts";
import paths from "../../../../Shared/paths.ts";
import { useSearchParams } from 'react-router-dom';

export default function ArtistProfilePublic() {

    const [sp,] = useSearchParams();
    const [a, setA] = useState<Artist>();
    useEffect(() => {
        async function getData() {
            const data = await getRequest<Artist>(`artist/public/${sp.get("id")}`);
            if(data.isSuccess()) {
                setA(data.response);
            }
        }
        getData();
    }, []);

    return <RenderArtist artist={a} as={"page"}/>
}

export function ArtistProfile() {
    const [a, setA] = useState<Artist>();
    useEffect(() => {
        async function getData() {
            const data = await getRequest<Artist>(`${paths.artist.self}`);
            if(data.isSuccess()) {
                setA(data.response);
            }
        }
        getData();
    }, []);
}

const iterate = (obj: Record<string, any>) => {
    const ret: any[] = [];
    Object.keys(obj).forEach(key => {

        ret.push(`${key}: ${obj[key]}`)

        if (typeof obj[key] === 'object' && obj[key] !== null) {
            iterate(obj[key])
        }
    })
    return ret;
}

export function RenderArtist({ artist, as }: { artist: Artist, as: "list" | "page" }) {
    return <>
        {as === "list" ? (
            <div>
                {artist ? (
                    <>
                        <strong style={{color: "yellow"}}>{artist.name}</strong>
                        <div>{artist.genre}</div>
                        <div>{artist.Members.map((mem: Member, idx) => <div key={idx}>{mem.name}, {mem.role}</div>)}</div>
                    </>
                ) : null}
            </div>) : (
                <div>
                    {artist ? (
                        <div style={{textAlign: "left"}}>
                            <div>
                                <pre>{JSON.stringify(artist, null, 4)}</pre>
                            </div>
                        </div>
                    ) : null}
                </div>
        )
        }
    </>
}