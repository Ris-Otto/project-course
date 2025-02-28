import { createGlobalStyle } from "styled-components";
import { Theme } from "./theme.ts";

// noinspection CssUnresolvedCustomProperty
/**
 * Global styles for the application
 */
//A supplied theme is required here apparently
export const GlobalStyles = createGlobalStyle<{
  theme?: Theme;
}>`

    @font-face {
        font-family: chorine-large, futura-pt, futura-pt-bold;
        src: url("https://use.typekit.net/exs7viz.css");
        font-style: normal;
    }


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
        font-size: 1.25rem;
    }

    h1, h2, h4, h5, h6 {
        font-family: chorine-large, sans-serif;
        font-weight: 500;
        font-style: normal;
        font-size: 2rem;
    }

    h3 {
        font-family: futura-pt-bold, sans-serif;
    }

    div, span, p, a, button, input, label, select, textarea {
        font-family: futura-pt, sans-serif;
        font-weight: bold;
        font-style: normal;
        font-size: 1rem;
    }

    #override form-control:valid {
        color: black !important;
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

    .picture {
        position: relative;
    }

    .picture-name {
        position: absolute;
        color: white;
        background-color: rgba(0, 0, 0, 0.7);
        border-radius: 10px;
        padding: 1%;
    }

    .picture-age {
        position: absolute;
        right: -5%;
        top: -10%;
    }

    .description {
        color: ${({ theme }) => theme.brownText};
        overflow: hidden;
        height: calc(3 * var(--bs-body-font-size));
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
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

    .form-check-input {
        background-color: ${({ theme }) => theme.darkCream} !important;
        border-color: ${({ theme }) => theme.redBrown} !important;
        border-width: 2px;

        &:checked {
            background-color: ${({ theme }) => theme.redBrown} !important;
            color: ${({ theme }) => theme.redBrown} !important;
        }
    }

    .underwave-modal, .modal-content {
        background-color: ${({ theme }) => theme.darkCream} !important;
        color: ${({ theme }) => theme.redBrown} !important;
    }

    .btn-outline-primary, .btn-outline-success, .btn-outline-primary:disabled, .btn-outline-success:disabled {
        border-color: ${({ theme }) => theme.teal};
        color: ${({ theme }) => theme.teal};
    }

    .btn-danger {
        border-color: ${({ theme }) => theme.orange};
        background-color: ${({ theme }) => theme.orange};
    }

    .btn-danger:hover, .btn-danger:focus, .btn-danger:active {
        border-color: ${({ theme }) => theme.darkOrange};
        background-color: ${({ theme }) => theme.darkOrange};
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
