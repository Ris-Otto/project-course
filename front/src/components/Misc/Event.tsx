import { useSearchParams } from "react-router-dom";
import Event from "../../../../api/Database/Model/Event.ts"
import {getRequest} from "../../api/APITemplate.ts";
import { useState, useEffect } from "react";
import paths from "../../../../Shared/paths.ts";



export function EventPage() {
    const [sp,] = useSearchParams();

    const [a, setA] = useState<Event>();
    useEffect(() => {
        async function getData() {
            const id = sp.get("eventId");
            if(id !== null && id !== undefined ) {
                const data = await getRequest<Event>(`${paths.event.get}/${sp.get("eventId")}`);
                if(data.isSuccess()) {
                    setA(data.response);
                }
            }
        }
        getData();
    }, []);

    return (
        <div>
            {a ? (
                <div style={{textAlign: "left"}}>
                    <div>
                        <pre>{JSON.stringify(a, null, 4)}</pre>
                    </div>
                </div>
            ) : null}
        </div>
    )
}