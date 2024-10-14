import { createGlobalStyle } from "styled-components";
import { DarkTheme } from "./theme.ts";

/**
 * Global styles for the application
 */
//A supplied theme is required here apparently
export const GlobalStyles = createGlobalStyle<{
    theme?: DarkTheme ;
}>`
  html {
    margin: 0;
    padding: 0;
    height: 100%;
  }

  #root {
      max-width: 1280px;
      margin: 0 auto;
      padding: 2rem;
      text-align: center;
  }

  *, *::after, *::before {
    box-sizing: border-box;
    font-family: Arial, Helvetica, sans-serif;
  }

  body {
    align-items: center;
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    display: flex;
    min-height: 100vh;
    width: 100vw;
    justify-content: center;
    text-rendering: optimizeLegibility;
    transition: all 0.50s linear;
    overflow-x: hidden;
    
    @media (max-width: ${({ theme }) => theme.mobile}) {
      font-size: 1.5rem;
      text-align: center;
    }
  }

  #root {
    min-height: 100vh;
    min-width: 100vw;
  }

  #hamburger-icon {
    height: 0vh;
    @media (max-width: ${({ theme }) => theme.tablet}) {
      height: 10vh;
    }
  }

  .container {
    margin-bottom: 0;
  }

  .container-min-height-min-content {
    min-height: min-content !important;
  }
  
  .top-level-component {
    min-height: 100vh !important;
    align-items: start;
    justify-items: center;
    @media (max-width: ${({ theme }) => theme.tablet}) {
      min-height: 90vh !important;
    }
  }
  
  #component-margin {
    margin-top: 3rem;
    margin-bottom: 1rem;
    @media (max-width: ${({ theme }) => theme.tablet}) {
      margin-top: 0rem;
      margin-bottom: 0rem;
    }
  }
  
  a {
    text-decoration: none;
    color: ${({ theme }) => theme.lightGreen};
    &:hover {
      text-decoration: underline;
      color: ${({ theme }) => theme.lightGreenHover};
    }
  }
  
  .btn-primary, .btn-success, .btn-primary:disabled, .btn-success:disabled {
    background-color: ${({ theme }) => theme.yellow};
    border-color: ${({ theme }) => theme.darkYellow};
    color: ${({ theme }) => theme.darkText};
    &:focus {
      box-shadow: ${({ theme }) => theme.btnPrimaryFocusBoxShadow};
    }
  }

  .btn-outline-primary, .btn-outline-success, .btn-outline-primary:disabled, .btn-outline-success:disabled {
    border-color: ${({ theme }) => theme.lightGreen};
    color: ${({ theme }) => theme.lightGreen};
  }

  .btn-primary:hover, .btn-primary:focus, .btn-primary:active, .btn-primary.active, .open>.dropdown-toggle.btn-primary, .show>.dropdown-toggle.btn-primary,
  .btn-success:hover, .btn-success:focus, .btn-success:active, .btn-success.active, .open>.dropdown-toggle.btn-success, .show>.dropdown-toggle.btn-success {
    background-color: ${({ theme }) => theme.btnPrimaryHover};
    border-color: ${({ theme }) => theme.btnPrimaryHover};
  }

  .btn-outline-primary:hover, .btn-outline-primary:focus, .btn-outline-primary:active, .btn-outline-primary.active, .open>.dropdown-toggle.btn-outline-primary, .show>.dropdown-toggle.btn-outline-primary,
  .btn-outline-success:hover, .btn-outline-success:focus, .btn-outline-success:active, .btn-outline-success.active, .open>.dropdown-toggle.btn-outline-success, .show>.dropdown-toggle.btn-outline-success {
    background-color: ${({ theme }) => theme.lightGreen};
    border-color: ${({ theme }) => theme.lightGreen};
  }

  .nav-link {
    color: ${({ theme }) => theme.darkYellow};

    &:hover {
      color: ${({ theme }) => theme.lightGreen};
    }
  }
  `;