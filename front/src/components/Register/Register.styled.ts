import {styled} from 'styled-components';

export const StyledRegister = styled.div`
    display: flex;
    justify-content: center;
    flex-flow: row wrap;
    background: ${({theme}) => theme.background};
    color: ${({theme}) => theme.text};
    font-size: 1rem;
    overflow-x: auto;

    .row {
        justify-content: center;
    }

    .form {
        width: 50vw;
        @media only screen and (max-width: 1024px) {
            width: 80vw;
        }
    }

    h2 {
        text-align: center;
        flex-basis: 100%;
        margin-bottom: 1rem;
    }

    .link-button {
        margin: 5px;
        background: none !important;
        border: none;
        padding: 0 !important;
        color: ${({theme}) => theme.darkYellow};
        text-decoration: underline;
        cursor: pointer;
    }
    
    .register-btn {
        text-align: left;
    }
`;