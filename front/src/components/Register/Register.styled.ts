import { styled } from "styled-components";

export const StyledRegister = styled.div`
    overflow-x: auto;
    text-align: left;

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
    
    .register-btn {
        text-align: left;
    }
`;
