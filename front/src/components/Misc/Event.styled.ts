import { styled } from "styled-components";

const StyledEvent = styled.div`

  text-align: left;
  display: flex;
  flex-direction: row;

`;

const Strong = styled.strong`
  color: ${({ theme }) => theme.teal};
`;

export { Strong, StyledEvent };
