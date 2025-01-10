import { createGlobalStyle } from "styled-components";
import { Theme } from "./theme.ts";

/**
 * Global styles for the application
 */
//A supplied theme is required here apparently
export const GlobalStyles = createGlobalStyle<{
  theme?: Theme;
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
        font-family: 'Nunito',sans-serif, bold, black !important;
    }

    body {
        align-items: center;
        background: ${({ theme }) => theme.cream};
        color: ${({ theme }) => theme.orange};
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

    .container {
        margin-bottom: 0;
    }

    .container-min-height-min-content {
        min-height: min-content !important;
    }

    .empty-button {
        background: transparent;
        border: none;
        font-size: 0;
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
            margin-top: 0;
            margin-bottom: 0;
        }
    }

    a {
        text-decoration: none;
        color: ${({ theme }) => theme.teal};

        &:hover {
            text-decoration: underline;
            color: ${({ theme }) => theme.darkTeal};
        }
    }

    .btn-primary, .btn-success, .btn-primary:disabled, .btn-success:disabled {
        background-color: ${({ theme }) => theme.teal};
        border-color: ${({ theme }) => theme.teal};
        color: ${({ theme }) => theme.text};

        &:focus {
            box-shadow: ${({ theme }) => theme.darkTeal};
        }

        &:hover {
            background-color: ${({ theme }) => theme.darkTeal};
            border-color: ${({ theme }) => theme.tealPressed} !important;
        }

        &:active {
            background-color: ${({ theme }) => theme.tealPressed};
            border-color: ${({ theme }) => theme.teal};
            --bs-btn-active-color: #fff;
            --bs-btn-active-bg: ${({ theme }) => theme.tealPressed} !important;
            --bs-btn-active-border-color: ${({ theme }) =>
              theme.teal} !important;
        }
    }

    .btn-outline-primary, .btn-outline-success, .btn-outline-primary:disabled, .btn-outline-success:disabled {
        border-color: ${({ theme }) => theme.teal};
        color: ${({ theme }) => theme.teal};
    }

    .btn-primary:hover, .btn-primary:focus, .btn-primary:active, .btn-primary.active, .open > .dropdown-toggle.btn-primary, .show > .dropdown-toggle.btn-primary,
    .btn-success:hover, .btn-success:focus, .btn-success:active, .btn-success.active, .open > .dropdown-toggle.btn-success, .show > .dropdown-toggle.btn-success {
        background-color: ${({ theme }) => theme.darkTeal};
        border-color: ${({ theme }) => theme.darkTeal};
    }

    .btn-outline-primary:hover, .btn-outline-primary:focus, .btn-outline-primary:active, .btn-outline-primary.active, .open > .dropdown-toggle.btn-outline-primary, .show > .dropdown-toggle.btn-outline-primary,
    .btn-outline-success:hover, .btn-outline-success:focus, .btn-outline-success:active, .btn-outline-success.active, .open > .dropdown-toggle.btn-outline-success, .show > .dropdown-toggle.btn-outline-success {
        background-color: ${({ theme }) => theme.darkTeal};
        border-color: ${({ theme }) => theme.darkTeal};
    }

    .nav-link {
        color: ${({ theme }) => theme.teal};
        background: none !important;
        border: none;
        padding: 0 !important;
        display: inline;

        &:hover {
            color: ${({ theme }) => theme.darkTeal};
        }
    }

    .page-link {
        color: ${({ theme }) => theme.orange};
        background: none !important;
        border: none;
        padding: 0 !important;
        display: inline;
        text-decoration-line: underline;

        &:hover {
            color: ${({ theme }) => theme.lightOrange};
            font-weight: bolder;
        }
    }

    .back-arrow-1, .back-arrow-2, .back-arrow-3 {
        cursor: pointer;
        color: ${({ theme }) => theme.teal};

        &:hover {
            color: ${({ theme }) => theme.darkTeal};
        }
    }

    .back-arrow-1 {
        font-size: 1em;
    }

    .back-arrow-2 {
        font-size: 2em;
    }

    .back-arrow-3 {
        font-size: 3em;
    }

    .navbar-body {
        color: ${({ theme }) => theme.lightOrange};
        background: ${({ theme }) => theme.orange};
        top: 0;
    }
    
    .h1, .h2, .h3, .h4, .h5 {
      font: 'Ranchers',serif
    }

    .sign-up-vinyl {
        width: 600px;
        @media (max-width: 800px) {
            width: 300px;
        }
    }

    .vinyl-container {
        z-index: -1;
        top: 2vh;
        right: 1vw;
        position: absolute;
        @media (max-width: 800px) {
            top: 1vh;
            right: 1vh;
        }
    }

    
`;
