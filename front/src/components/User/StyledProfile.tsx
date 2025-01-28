import { styled } from "styled-components";
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
  .artist-helmet {
    background-color: ${({ theme }) => theme.teal};
    color: ${({ theme }) => theme.cream};
  }

  .follow-share-button {
    background-color: ${({ theme }) => theme.orange};
    border-color: ${({ theme }) => theme.orange};
    color: ${({ theme }) => theme.text};

    &:focus {
      box-shadow: ${({ theme }) => theme.darkOrange};
    }

    &:hover {
      background-color: ${({ theme }) => theme.darkOrange};
      border-color: ${({ theme }) => theme.darkOrange} !important;
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

export const StyledListBox = styled.div<{ theme: Theme }>`
  margin-right: 40px;
  margin-bottom: 40px;
  border: 5px solid ${({ theme }) => theme.orange};
  background-color: white;
  cursor: pointer;
`;

export const StyledVenueProfile = styled.div<{ theme: Theme }>`
  /*idk*/
  justify-items: left;
  justify-content: left;
  justify-self: left;
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.redBrown};

  .profile {
    background-color: ${({ theme }) => theme.darkCream};
    border-radius: 15px;
  }

  .btn-primary,
  .btn-success,
  .btn-primary:disabled,
  .btn-success:disabled {
    background-color: ${({ theme }) => theme.darkCream};
    border-color: ${({ theme }) => theme.darkCream};
    color: ${({ theme }) => theme.brownText};
    &:focus {
      box-shadow: ${({ theme }) => theme.darkCream2};
    }

    &:hover {
      background-color: ${({ theme }) => theme.darkCream2};
      border-color: ${({ theme }) => theme.darkCream2} !important;
    }

    &:active {
      background-color: ${({ theme }) => theme.darkCream};
      border-color: ${({ theme }) => theme.darkCream};
      --bs-btn-active-color: #fff;
      --bs-btn-active-bg: ${({ theme }) => theme.darkCream2} !important;
      --bs-btn-active-border-color: ${({ theme }) =>
        theme.darkCream} !important;
    }
  }

  .selected-page-state {
    background-color: ${({ theme }) => theme.darkCream2} !important;
    box-shadow: ${({ theme }) => theme.darkCream} !important;
    border: 2px solid black !important;
  }

  .silly-row {
    display: flex;
    flex-direction: row;
    justify-content: center;
    min-width: min-content;
    max-width: max-content;
    vertical-align: middle;
  }

  .silly-row-sb {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    min-width: max-content;
    vertical-align: middle;
  }

  .btn,
  .btn-primary {
    text-align: left;
    background-color: ${({ theme }) => theme.darkCream};
    color: black;
    border-color: ${({ theme }) => theme.darkCream};
  }
`;
