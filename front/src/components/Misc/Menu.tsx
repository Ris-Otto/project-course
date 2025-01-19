import { useAtom } from "jotai";
import { user, open } from "../../store.ts";
import { styled } from "styled-components";
import { Link } from "react-router-dom";

export const StyledMenu = styled.nav<{ open: boolean }>`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.orange};

  max-height: 100vh;
  align-content: center;
  text-align: left;
  padding: 6rem 2rem 2rem 2rem;
  position: fixed;
  top: 0%;
  left: 0%;
  transition: transform 0.3s ease-in-out;
  transform: ${({ open }) => (open ? "translateY(0)" : "translateY(-100%)")};
  z-index: 9;
  border-radius: 0px 0px 15px 0px;

  @media (max-width: ${({ theme }) => theme.mobile}) {
    width: 100%;
  }

  @media (max-height: ${({ theme }) => theme.mobile}) {
    width: 100%;
  }

  @media (min-width: ${({ theme }) => theme.laptop}) {
    justify-content: center;
  }

  a {
    font-size: 2rem;
    text-transform: uppercase;
    padding: 0.5rem;
    font-weight: bold;
    letter-spacing: 0.5rem;
    color: ${({ theme }) => theme.menuText};
    text-decoration: none;
    transition: color 0.3s linear;

    @media (max-width: ${({ theme }) => theme.mobile}) {
      font-size: 1.5rem;
      padding: 0.75rem 0;
      text-align: center;
    }
    @media (min-width: ${({ theme }) => theme.mobileL}) {
      margin-left: 2.5rem;
      padding-right: 2.5rem;
    }

    &:hover {
      color: ${({ theme }) => theme.menuHover};
      text-decoration: none;
    }
  }
`;

export function Menu() {
  const [u, _] = useAtom(user);
  const [o, setO] = useAtom(open);

  const tabIndex = o ? 0 : -1;

  const hide = () => {
    setO(false);
  };
  const reset = () => {};

  if (!u) return null;
  return (
    <StyledMenu open={o} aria-hidden={!o}>
      <>
        <Link to="/events" tabIndex={tabIndex} onClick={hide}>
          Events
        </Link>
        <Link to={`/artists`} tabIndex={tabIndex} onClick={hide}>
          Artists
        </Link>
      </>
      {
        //Links to content specific for an admin
        u.type === 2 ? (
          <>
            <Link to="/events/create" tabIndex={tabIndex} onClick={hide}>
              Create event
            </Link>
          </>
        ) : null
      }
    </StyledMenu>
  );
}
