import { styled } from "styled-components";
import type {Theme} from "../../theme.ts";

const StyledListBox = styled.div<
    { minwidth?: string; padding?: string; backgroundcolor?: string }
>`
  background-color: ${({ backgroundcolor, theme }) => backgroundcolor ? backgroundcolor : theme.darkCream};
  box-shadow: ${({ theme }) => theme.darkCream};
  border-radius: 15px;
  padding: ${({ padding }) => (padding ? padding : "5")}px;
  color: black;
    min-width: ${({ minwidth }) => (minwidth ? minwidth : "min-content")};
`;


const ListWrapper = styled.div`
    .row-wrap-sb {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        min-width: max-content;
        vertical-align: middle;
        flex-wrap: wrap;
    }
    
    .row-wrap-start {
        display: flex;
        flex-direction: row;
        justify-content: start;
        min-width: min-content;
        flex-wrap: wrap;
    }

    .follow-heart-right {
        text-align: right;
        margin-right: 5px;
        margin-top: 5px;
        justify-items: right;
    }
`

const StyledEditableProfile = styled.div<{ theme: Theme }>`
  /*idk*/
  justify-items: left;
  justify-content: left;
  justify-self: left;
  text-align: right;
  display: flex;
  flex-direction: row;
  color: ${({ theme }) => theme.redBrown};

  .profile {
    background-color: ${({ theme }) => theme.darkCream};
    border-radius: 15px;
  }

  .btn-primary,
  .btn-success {
    background-color: ${({ theme }) => theme.darkCream};
    border-color: ${({ theme }) => theme.darkCream};
    color: ${({ theme }) => theme.brownText};
    &:focus {
      box-shadow: ${({ theme }) => theme.darkCream2};
        background-color: ${({ theme }) => theme.darkCream};
        border-color: ${({ theme }) => theme.darkCream};
    }

    &:disabled {
      color: black !important;
    }

    &:hover {
      background-color: ${({ theme }) => theme.darkCream2};
      border-color: ${({ theme }) => theme.darkCream2} !important;
    }

    &:active {
      background-color: ${({ theme }) => theme.darkCream};
      border-color: ${({ theme }) => theme.darkCream};
      --bs-btn-active-color: ${({ theme }) => theme.brownText};
      --bs-btn-active-bg: ${({ theme }) => theme.darkCream2} !important;
      --bs-btn-active-border-color: ${({ theme }) => theme.darkCream} !important;
        color: ${({ theme }) => theme.brownText};
    }
      
    &:after {
      background-color: ${({ theme }) => theme.darkCream};
      border-color: ${({ theme }) => theme.darkCream};
      color: ${({ theme }) => theme.brownText};
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
    flex-wrap: wrap;
  }

  .silly-row-start {
    display: flex;
    flex-direction: row;
    justify-content: start;
    min-width: min-content;
    flex-wrap: wrap;
  }

  .silly-row-start-nowrap {
      display: flex;
      flex-direction: row;
      justify-content: start;
      min-width: min-content;
      flex-wrap: nowrap;
  }

  .silly-row-end {
    display: flex;
    flex-direction: row;
    justify-content: end;
    min-width: min-content;
  }

  .silly-row-sb {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    min-width: min-content;
    vertical-align: middle;
    flex-wrap: wrap;
  }

  .silly-row-sb-nowrap {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    min-width: max-content;
    vertical-align: middle;
    flex-wrap: nowrap;
  }

  .silly-row-se-wrap {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    min-width: min-content;
    vertical-align: middle;
    flex-wrap: wrap;
  }
  .silly-row-se-nowrap {
      display: flex;
      flex-direction: row;
      justify-content: space-evenly;
      min-width: min-content;
      vertical-align: middle;
      flex-wrap: nowrap;
  }

  .silly-row-se {
      display: flex;
      flex-direction: row;
      justify-content: space-evenly;
      min-width: min-content;
      vertical-align: middle;
  }

  .silly-column-sb {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    vertical-align: middle;
  }

  .silly-row-sb-nowrap {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    min-width: min-content;
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

const Divider = styled.div`
    border-left: 1px solid black;
    padding-left: 50px;
`

const Row = styled.div<{ flexwrap?: string, justifycontent?: string}>`
    display: flex;
    flex-direction: row;
    justify-content: ${({ justifycontent }) => (justifycontent ? justifycontent : "space-evenly")};
    min-width: min-content;
    vertical-align: middle;
    flex-wrap: ${({ flexwrap }) => (flexwrap ? flexwrap : "")};
`

const FlexCol = styled.div<{ flexwrap?: string, justifycontent?: string}>`
    display: flex;
    flex-direction: column;
    justify-content: ${({ justifycontent }) => (justifycontent ? justifycontent : "space-evenly")};
    vertical-align: baseline;
    flex-wrap: ${({ flexwrap }) => (flexwrap ? flexwrap : "")};
    
`

export { StyledListBox, ListWrapper, StyledEditableProfile, Divider, Row, FlexCol };


