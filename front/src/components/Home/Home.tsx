import { events } from "../../store.ts";
import { useAtom } from "jotai";


export default function Home() {

    const [myEvents, setMyEvents] = useAtom(events);

    return (
        <div>
            {/*
                Show events
            */}
        </div>
    )
}