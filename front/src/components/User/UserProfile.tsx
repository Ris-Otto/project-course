// @deno-types="npm:@types/react"
import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import {useNavigate, createSearchParams} from 'react-router-dom';
import {getRequest} from "../../api/APITemplate.ts";
import paths from "../../../../Shared/paths.ts";
import {FanProfile} from "../../../../Shared/Types.ts";
import {RenderArtist} from "./Artist.tsx";
import {StyledProfile} from "./StyledProfile.tsx";


export function UserProfile() {
    const navigate = useNavigate();
    const [a, setA] = useState<FanProfile>()

    useEffect(() => {
        async function getData() {
            if(!a) {
                const temp = await getRequest<FanProfile>(paths.user.self);
                if (temp.isSuccess()) {
                    setA(temp.response);}
            }
        }
        getData();
    }, []);

    return (
        <StyledProfile className="top-level-component">
            {a ? (
                <>
                    <h1 className={"mb-3"} style={{color: "yellow"}}>{a.name}</h1>
                    <h3>Following</h3>
                    <div className="artist-list">
                        {a.Artists.map((artist, idx) =>
                            <div
                                key={idx}
                                className="artist-box" onMouseDown={() => navigate({
                                pathname: `/artist`,
                                search: createSearchParams({
                                    id: artist.id
                                }).toString()})}
                            >
                                <RenderArtist
                                    artist={artist}
                                    as={"list"}
                                />
                            </div>
                        )}
                    </div>
                </>
            ) : null}
        </StyledProfile>
    )
}
