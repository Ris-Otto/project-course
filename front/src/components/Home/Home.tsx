import { useEffect } from "react";
import { events } from "../../store.ts";
import { useAtom } from "jotai";
import {getRequest} from "../../api/APITemplate.ts";
import paths from "../../../../Shared/paths.ts";
import { Event } from "../../utilities/Types.ts";


export default function Home() {

    const [myEvents, setMyEvents] = useAtom(events);

    useEffect(() => {
        const data = async () => {
            const allEvents = await getRequest<Event[]>(paths.user.events);
            if(allEvents.isSuccess()) {
                setMyEvents(allEvents.response);
                console.log("Hurra");
            }
        }
        data();
    }, []);

    return (
        <div>
            {/*
                Show events
            */}
        </div>
    )
}