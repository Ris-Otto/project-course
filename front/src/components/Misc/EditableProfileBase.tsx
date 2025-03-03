import {
    PageState,
    PageStates,
    StateHandler,
    SubState,
    VenuePageStates, ArtistPageStates,
} from "../../utilities/Types.tsx";
import { useAuth, useRequest } from "../../Hooks.ts";
import {Loading} from "../../utilities/Loading.tsx";
//deno-types="npm:@types/react;
import React, {useEffect, useState, useMemo} from "react";
import {cfl} from "../../utilities/Functions.tsx";
import {logout} from "../../api/auth.ts";
import {Button} from "react-bootstrap";
import {EditButton} from "../User/StyledProfile.tsx";
import { LiaPencilAltSolid, LiaSave } from "react-icons/lia";
import {StyledEditableProfile} from "./CustomStyles.tsx";
import { useLocation } from "react-router-dom";


export declare type EditableProfileBaseProps = {
    accessType: number;
    requestPath: string;
    Profile: React.ReactNode;
}

function EditableProfileBase<T>({accessType, requestPath, Profile}: EditableProfileBaseProps) {
    const loc = useLocation();
    const [pageState, setPageState] = useState<PageState>(() => loc.state?.pageState ? loc.state.pageState : "profile");
    const [subState, setSubState] = useState<SubState>(loc.state?.subState ? loc.state.subState : "view");
    useAuth(accessType);

    const request = useRequest<T>(requestPath);

    if (!request.response) return <div>Error</div>;

    if (request.isLoading) return <Loading />;

    if (request.isError)
        return <div style={{ marginTop: "60px" }}>{request.isError}</div>;

    function updateSubState(subState: SubState, refetch?: boolean) {
        setSubState(subState)
        if(refetch) {
            request.refetch();
        }
    }

    return (
        <StyledEditableProfile>
            {request.isError ? (
                <div style={{ position: "absolute", top:"45vh" }}>{request.isError}</div>
              )
              : request.isLoading ? (
                  <Loading />
                )
                : (!request.response) ? (
                  <div style={{ position: "absolute", top:"45vh", left:"50vh" }}>Error</div>
                ) : (
            <Profile
                value={request.response}
                subState={subState}
                updateSubState={updateSubState}
                pageState={pageState}
                setPageState={setPageState} />)}
        </StyledEditableProfile>
    )
}

declare type EditableProfileMenuProps = {
    pageState: PageState,
    setPageState: StateHandler<PageState>,
    updateSubState: (subState: SubState, refetch?: boolean) => void;
    states: "artist" | "venue";
}

function EditableProfileMenu({pageState, setPageState, updateSubState, states}: EditableProfileMenuProps) {
    const pageStates = useMemo(() => states === "venue" ? VenuePageStates : ArtistPageStates, [states]);
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                minHeight: "min-content",
                minWidth: "max-content",
                maxWidth: "max-content",
            }}
        >
            {pageStates.map((s, i) => {
                return (
                    <Button
                        key={i}
                        className={
                            pageState === s ? "selected-page-state mb-3" : "mb-3"
                        }
                        onClick={() => {
                            setPageState(s);
                            updateSubState("view");
                        }}
                        disabled={pageState === s}
                    >
                        {cfl(s)}
                    </Button>
                );
            })}
            <Button style={{ marginTop: "10vh" }} onClick={() => logout()}>
                Sign out
            </Button>
        </div>
    )
}

declare type EditableProfileHeadersProps = {
    reset: () => void;
    submit: () => Promise<any>;
    subState: SubState;
    updateSubState: (subState: SubState, refetch?: boolean) => void;
}

function EditableProfileHeaders({reset, submit, subState, updateSubState}: EditableProfileHeadersProps) {

    const edit = useMemo(() => subState === "edit", [subState]);
    return (
        <div className="silly-row-sb">
            <h2 style={{textDecoration: "underline"}}>Profile</h2>
            <div style={{ textAlign: "right" }}>
                {edit ? (
                    <>
                        <EditButton onClick={() => {
                            reset();
                            updateSubState("view")
                        }}>
                            Cancel
                        </EditButton>
                        <EditButton
                            onClick={async () => {
                                await submit();
                                updateSubState("view", true);
                            }}
                        >
                            Save
                            <LiaSave size={20} />
                        </EditButton>
                    </>
                ) : (
                    <>
                        <EditButton onClick={() => updateSubState("edit")}>
                            Edit
                            <LiaPencilAltSolid
                                size={20}
                                style={{ marginLeft: "5px", marginBottom: "2px" }}
                            />
                        </EditButton>
                    </>
                )}
            </div>
        </div>
    )
}

export { EditableProfileBase, EditableProfileMenu, EditableProfileHeaders };