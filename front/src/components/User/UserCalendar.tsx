import { artistFollowing, eventInterest, user, venueFollowing } from "../../store.ts";
import { useAtom } from "jotai";
import { useMemo } from "react";
import Calendar from 'react-calendar'
import { useRequest } from "../../Hooks.ts";
import Event from "../../../../api/Database/Model/Event.ts";
import paths from "../../../../Shared/paths.ts";
import { Resolve } from "../../utilities/Functions.tsx";



function UserCalendar() {
  const [u, ] = useAtom(user);
  const blockRequest = useMemo(() => !u || u.type !== 0, [u])
  const [af, ] = useAtom(artistFollowing);
  const [vf, ] = useAtom(venueFollowing);
  const [ge, ] = useAtom(eventInterest);
  const { isLoading, isError, response, refetch } = useRequest<Event[]>(paths.user.goingOrInterested, blockRequest);

  return (
    <Resolve isLoading={isLoading} isError={isError} response={response}>
      
    </Resolve>
  )
}


function CalendarInNavbar() {

}