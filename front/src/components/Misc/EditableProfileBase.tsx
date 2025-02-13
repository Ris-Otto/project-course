import {PageState, PageStates, StateHandler, SubState} from "../../utilities/Types.tsx";
import {useAuth} from "../Auth.tsx";
import {useRequest} from "../../Hooks.ts";
import {Loading} from "../../utilities/Loading.tsx";
//deno-types="npm:@types/react;
import React, {useEffect, useState, useMemo} from "react";
import {cfl} from "../../utilities/Functions.tsx";
import {logout} from "../../api/auth.ts";
import {Button} from "react-bootstrap";
import {EditButton} from "../User/StyledProfile.tsx";
import { LiaPencilAltSolid, LiaSave } from "react-icons/lia";
import {StyledEditableProfile} from "./CustomStyles.tsx";


export declare type EditableProfileBaseProps = {
    accessType: number;
    requestPath: string;
    Profile: React.ReactNode;
}

function EditableProfileBase<T>({accessType, requestPath, Profile}: EditableProfileBaseProps) {
    const [pageState, setPageState] = useState<PageState>("profile");
    const [subState, setSubState] = useState<SubState>("view");
    useAuth(accessType);

    const request = useRequest<T>(requestPath);

    useEffect(() => {
        return () => {
            setSubState("view");
            setPageState("profile");
        };
    }, []);
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
        <StyledEditableProfile >
            <Profile
                value={request.response}
                subState={subState}
                updateSubState={updateSubState}
                pageState={pageState}
                setPageState={setPageState} />
        </StyledEditableProfile>
    )
}

declare type EditableProfileMenuProps = { pageState: PageState, setPageState: StateHandler<PageState>, updateSubState: (subState: SubState, refetch?: boolean) => void }

function EditableProfileMenu({pageState, setPageState, updateSubState}: EditableProfileMenuProps) {
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
            {PageStates.map((s, i) => {
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