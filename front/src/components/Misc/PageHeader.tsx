import { styled } from "styled-components";
import type { CSSProperties } from "react";

const StyledHeader = styled.div`
  width: 100%;
  color: ${({ theme }) => theme.teal};
  justify-content: center;
    font-family: chorine-large, sans-serif;
    font-weight: 500;
    font-style: normal;
    font-size: 2rem;

    .separator {
    display: flex;
    align-items: center;
    text-align: center;
  }

  .separator::before,
  .separator::after {
    content: "";
    flex: 1;
    border: 2px solid ${({ theme }) => theme.teal};
  }

  .separator:not(:empty)::before {
    margin-right: 1em;
  }

  .separator:not(:empty)::after {
    margin-left: 1em;
  }
`;

type PageHeaderProps = { header: string; className?: string; color?: string };

export default function PageHeader({
  header,
  className,
  color,
}: PageHeaderProps) {
  const styleProps = (): CSSProperties => {
    return color
      ? {
          color: color,
          textAlign: "center",
          marginTop: "20px",
        }
      : {
          textAlign: "center",
          marginTop: "20px",
        };
  };

  return (
    <StyledHeader className={className} style={styleProps()}>
      <div className="separator">
        <h1>{header}</h1>
      </div>
    </StyledHeader>
  );
}

export function PageHeaderS({ header, className, color }: PageHeaderProps) {
  return <div></div>;
}
