import { events } from "../../store.ts";
import { useAtom } from "jotai";
import { createSearchParams, useNavigate } from "react-router-dom";
import { getRequest } from "../../api/APITemplate.ts";
import paths from "../../../../Shared/paths.ts";
import { Event, SuspenseConsumer } from "../../utilities/Types.ts";
import { AgGridReact } from "ag-grid-react"; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css";
import {
  PricingTypeToString,
  ToCurrencySymbol,
} from "../../utilities/Functions.ts";
import { wrapPromise } from "../../Hooks.ts";

function pricingValueGetter(p: any) {
  const a = p.data.Pricing;
  return `${a.amount}${ToCurrencySymbol(a.currency)}, ${
    PricingTypeToString(a.type)
  }`;
}

let paginatedEvents: SuspenseConsumer<Event[]>;
export default function Home() {
  const navigate = useNavigate();
  const colDefs = [
    {
      headerName: "Event name",
      valueGetter: function (params: any) {
        return params.data.name;
      },
    },
    {
      headerName: "Venue name",
      valueGetter: function (params: any) {
        return params.data.Venue.name;
      },
    },

    {
      headerName: "Venue address",
      valueGetter: function (params: any) {
        return params.data.Venue.address;
      },
    },
    { headerName: "Pricing", valueGetter: pricingValueGetter },
    {
      valueGetter: function (params: any) {
        return params.data.id;
      },
      hide: true,
      suppressToolPanel: true,
    },
  ];

  if (!paginatedEvents) {
    paginatedEvents = wrapPromise(getRequest<Event[]>(paths.event.all));
  }

  return (
    <>
      <h3 style={{ textAlign: "left" }}>Events</h3>
      {paginatedEvents.read().response.length > 0
        ? (
          <div
            className="ag-theme-quartz"
            style={{ height: 500 }}
          >
            <AgGridReact
              onRowClicked={(row) =>
                navigate({
                  pathname: `/events`,
                  search: createSearchParams({
                    eventId: String(row.data!.id),
                  }).toString(),
                })}
              rowData={paginatedEvents.read().response}
              columnDefs={colDefs}
            />
          </div>
        )
        : null}
    </>
  );
}
