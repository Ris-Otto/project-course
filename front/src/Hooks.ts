// @deno-types="@types/react"
import {
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { getRequest } from "./api/APITemplate.ts";
import { artistFollowing, refetchFollowedArtists, user } from "./store.ts";
import { checkToken } from "./api/auth.ts";
import { Artist } from "../../api/Database/Model/Artist.ts";

/**
 * @param {*} ref the reffered component
 * @param {*} handler handler function
 */
export const useOnClickOutside = (
  ref: MutableRefObject<HTMLDivElement>,
  handler: (event: { target: HTMLDivElement }) => void,
) => {
  useEffect(() => {
    const listener = (event: { target: any }) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
    };
  }, [ref, handler]);
};

export function useImageDimensions(maxHeight?: number) {
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });

  const handleImageLoad = (e: any) => {
    const { naturalHeight, naturalWidth } = e.target;

    if (naturalWidth > naturalHeight) {
      const ratio = naturalWidth / naturalHeight;
      const height = maxHeight ? maxHeight : globalThis.innerHeight / 8;
      setDimensions({ height: height, width: height * ratio });
    } else {
      const ratio = naturalHeight / naturalWidth;
      const height = maxHeight ? maxHeight : globalThis.innerHeight / 8;
      setDimensions({ height: height, width: height * ratio });
    }
  };

  return { dimensions, handleImageLoad };
}

export function useRequest<T>(
  path: string,
): {
  response: T | null;
  isLoading: boolean;
  isError: string | null;
  refetch: () => void;
} {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState<string | null>(null);
  const [response, setResponse] = useState<T | null>(null);
  const [fetch, setFetch] = useState(false);
  function refetch() {
    setFetch((s) => !s);
  }

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const res = await getRequest<T>(path);
    if (res.isSuccess()) {
      setResponse(res.response);
    } else {
      setIsError(res.message);
    }
    setIsLoading(false);
  }, [fetch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { response, isLoading, isError, refetch };
}

export function useAuth(accessType?: number) {
  const [_, setU] = useAtom(user);
  const navigate = useNavigate();
  useEffect(() => {
    const check: () => void = async () => {
      const res = await checkToken();
      if (res.isSuccess()) {
        //Successful, set the user state from the data received
        setU(res.response);
        if (accessType && res.response.type < accessType) {
          navigate("/");
        }
      } else {
        setU(null);
        //If the authentication failed, redirect to the login page with a state containing the path
        navigate("/");
      }
    };
    check();
  }, []);
}

export function useArtistRefetch() {
  const [_, refetchArtists] = useAtom(refetchFollowedArtists);

  return { refetchArtists, artistFollowing };
}

export function useIsFollowingArtist(artist: Artist) {
  const [af] = useAtom(artistFollowing);
  const isFollowing = useMemo(() => {
    return 1 === af.filter((a) => a.id === artist.id).length;
  }, [af]);

  return isFollowing;
}
