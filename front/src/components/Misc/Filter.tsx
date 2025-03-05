import {Filter} from "../../utilities/Types.tsx";
//@deno-types="npm:@types/react"
import {useMemo, useEffect} from "react";
import {Button } from "react-bootstrap"

export function ListFilter({filters, setFilters, onFilter, reset}: {filters: Filter, setFilters: (filter: Filter) => void, onFilter?: () => void, reset?: () => void}) {

  const keys = useMemo(() => Object.keys(filters), [filters]);

  useEffect(() => {
    if(onFilter) onFilter()
  }, [])

  return (
      <div className="mt-3 mb-3" style={{ display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        textAlign: "left",
        verticalAlign: "center", }}>
        <h3>Filter</h3>
        <br/>
        <Button className={"mb-3"} onClick={reset}>Reset filters</Button>
        <Button className={"mb-3"} onClick={onFilter}>Filter</Button>
        <br/>
        {keys.map((k, i) => {
          const v = filters[k];
          switch (v.type) {
            case "checkbox":
              return (
                  <div key={i}>
                    <input
                        id={v.label}
                        className="mb-3"
                        //@ts-ignore bah
                        value={v.value}
                        type="checkbox"
                        onChange={() => {
                          setFilters({
                            ...filters,
                            [k]: {
                              ...v,
                              //ugh silly input-checkbox! *waves fist*
                              value: !v.value,
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
                  //@ts-ignore bah
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
            case "date":
              return (
                <div key={i}>
                  <label htmlFor={v.label}>{v.label}</label>
                  <br/>
                  <input
                    className="mb-3"
                    //@ts-ignore bah
                    value={v.value}
                    placeholder={v.label}
                    type="date"
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
                </div>
              )
            default:
              return null;
          }
        })}
      </div>
  )
}