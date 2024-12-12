import { createSearchParams, useNavigate } from "react-router-dom";
import { getRequest } from "../../api/APITemplate.ts";
import paths from "../../../../Shared/paths.ts";
import { SuspenseConsumer } from "../../utilities/Types.ts";
import Event from "../../../../api/Database/Model/Event.ts";
import { AgGridReact } from "ag-grid-react"; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css";
import {
  PricingTypeToString,
  ToCurrencySymbol,
} from "../../utilities/Functions.ts";
import { wrapPromise } from "../../Hooks.ts";
import { ColDef, ValueGetterParams } from "ag-grid-community";
import PageHeader from "../Misc/PageHeader.tsx";

function pricingValueGetter(p: ValueGetterParams<Event, Event>) {
  if (!p.data) {
    return "Not specified";
  }
  const a = p.data.Pricing;
  return `${a.amount}${ToCurrencySymbol(a.currency)}, ${
    PricingTypeToString(a.type)
  }`;
}

let paginatedEvents: SuspenseConsumer<Event[]>;
export default function Home() {
  const navigate = useNavigate();
  const colDefs: ColDef<Event>[] = [
    {
      headerName: "Event name",
      valueGetter: function (params: ValueGetterParams<Event, Event>) {
        return params.data?.name;
      },
    },
    {
      headerName: "Venue name",
      valueGetter: function (params: ValueGetterParams<Event, Event>) {
        return params.data?.Venue.name;
      },
    },

    {
      headerName: "Venue address",
      valueGetter: function (params: ValueGetterParams<Event, Event>) {
        return params.data?.Venue.address;
      },
    },
    { headerName: "Pricing", valueGetter: pricingValueGetter },
    {
      valueGetter: function (params: ValueGetterParams<Event, Event>) {
        return params.data?.id;
      },
      hide: true,
    },
  ];

  if (!paginatedEvents) {
    paginatedEvents = wrapPromise(getRequest<Event[]>(paths.event.all));
  }

  return (
    <div style={{marginTop:"60px"}}>
      <PageHeader header={"Events"} />
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
    </div>
  );
}
