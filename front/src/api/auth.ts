import paths from "../../../Shared/paths.ts";
import {postRequest} from "./APITemplate.ts";
import {UserPayload} from "../../../Shared/Types.ts";


export const checkToken = async () => {
    return await postRequest<UserPayload>(paths.auth);
}