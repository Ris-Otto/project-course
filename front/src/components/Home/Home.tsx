import { useEffect, useState } from "react";
import { events } from "../../store.ts";
import { useAtom } from "jotai";
import { useNavigate } from "react-router-dom";
import {getRequest} from "../../api/APITemplate.ts";
import paths from "../../../../Shared/paths.ts";
import { Event } from "../../utilities/Types.ts";
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css";
import {PricingTypeToString, ToCurrencySymbol} from "../../utilities/Functions.ts"; // Optional Theme applied to the Data Grid

function pricingValueGetter(p: any) {
    const a = p.data.Pricing;
    return `${a.amount}${ToCurrencySymbol(a.currency)}, ${PricingTypeToString(a.type)}`
}

export default function Home() {

    const navigate = useNavigate();
    const [myEvents, setMyEvents] = useAtom(events);
    const colDefs = [
        { headerName: "Event name", valueGetter: function (params: any) {
                return params.data.name
            }},
        { headerName: "Venue name",  valueGetter: function (params: any) {
                return params.data.Venue.name;
            } },

        { headerName: "Venue address",  valueGetter: function (params: any) {
                return params.data.Venue.address;
            } },
        { headerName: "Pricing",  valueGetter: pricingValueGetter },
        {
            valueGetter: function (params: any) {
                return params.data.id
            },
            hide: true,
            suppressToolPanel: true

        }
    ];

    useEffect(() => {
        const data = async () => {
            const allEvents = await getRequest<Event[]>(paths.user.events);
            if(allEvents.isSuccess()) {
                setMyEvents(allEvents.response);
            }
            console.log(await getRequest(paths.user.self))
        }
        data();
    }, []);

    return (
        <>
            <h3 style={{textAlign: "left"}}>Events</h3>
            {myEvents.length > 0 ? (
        <div
            className="ag-theme-quartz"
            style={{height: 500}}
        >
            <AgGridReact
                onRowClicked={(row) => navigate(`/events/${row.data!.id}`)}
                rowData={myEvents}
                columnDefs={colDefs}
            />
        </div>
            ): null}
        </>
    )
}