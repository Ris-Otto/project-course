import {Filter} from "../../utilities/Types.tsx";
import {useMemo} from "react";

export function ListFilter({filters, setFilters}: {filters: Filter, setFilters: (filter: Filter) => void}) {

  const keys = useMemo(() => Object.keys(filters), [filters]);

  return (
      <div className="mt-3 mb-3" style={{ display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        textAlign: "left",
        verticalAlign: "center", }}>
        {keys.map((k, i) => {
          const v = filters[k];
          switch (v.type) {
            case "checkbox":
              return (
                  <div key={i}>
                    <input
                        id={v.label}
                        className="mb-3"
                        value={v.value}
                        type="checkbox"
                        onChange={(e) => {
                          setFilters({
                            ...filters,
                            [k]: {
                              ...v,
                              value: e.target.value,
                            },
                          })
                        }}
                    />
                    <label style={{marginLeft: "2%"}} htmlFor={v.label}>{v.label}</label>
                  </div>
              )
            case "text":
              return (
                <input
                  key={i}
                  className="mb-3"
                  value={v.value}
                  placeholder={v.label}
                  type="text"
                  onChange={(e) => {
                    setFilters({
                      ...filters,
                      [k]: {
                        ...v,
                        value: e.target.value,
                      },
                    })
                  }
                  }
                />
              )
            default:
              return null;
          }
        })}
      </div>
  )
}