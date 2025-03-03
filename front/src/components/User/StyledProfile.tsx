import { styled } from "styled-components";
import { Button } from "react-bootstrap";
import type { Theme } from "../../theme.ts";

export const StyledProfile = styled.div<{ theme: Theme }>`
  /*idk*/
  justify-items: left;
  justify-content: left;
  justify-self: left;
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.redBrown};

  .follow-heart-right {
    text-align: right;
    margin-right: 5px;
    margin-top: 5px;
    justify-items: right;
  }

  .artist-list {
    min-width: 40%;
    display: flex;
    flex-direction: column;
    @media (min-width: 1024px) {
      flex-direction: row;
    }
  }
`;

export const StyledArtistProfile = styled.div<{ theme: Theme }>`
    color: ${({ theme }) => theme.redBrown};
  .artist-helmet {
    background-color: ${({ theme }) => theme.teal};
    color: ${({ theme }) => theme.cream};
  }

  .follow-share-button {
    background-color: ${({ theme }) => theme.lightOrange};
    border-color: ${({ theme }) => theme.lightOrange};
    color: ${({ theme }) => theme.text};

    &:focus {
      box-shadow: ${({ theme }) => theme.orange};
    }

    &:hover {
      background-color: ${({ theme }) => theme.orange};
      border-color: ${({ theme }) => theme.orange} !important;
    }

    &:active {
      background-color: ${({ theme }) => theme.darkOrange};
      border-color: ${({ theme }) => theme.darkOrange};
      --bs-btn-active-color: #fff;
      --bs-btn-active-bg: ${({ theme }) => theme.darkOrange} !important;
      --bs-btn-active-border-color: ${({ theme }) =>
        theme.darkOrange} !important;
    }
  }
`;

export const EditButton = styled(Button)`
  background-color: ${({ theme }) => theme.teal} !important;
  color: white !important;
`;

export const Circle = styled.div`
  height: 50px;
  width: 50px;
  text-align: center;
  border-radius: 50%;
  padding: 5px;
  display: flex;
  flex-direction: column;
  background-color: red;
  font-weight: bold;
  justify-content: center;
`;
