//@deno-types=npm:@types/react
import React, { useMemo } from "react";
import { styled } from "styled-components";
import { GoArrowLeft } from "react-icons/go"; // Ensure you have react-icons installed
import { useNavigate } from "react-router-dom";
import PageHeader from "./PageHeader.tsx";

interface GridProps {
  children: React.ReactNode[] | React.ReactNode; // Expect an array of children
  header?: string; // Add a header prop for the PageHeader
  headerColor?: string; // Optionally pass header color
  wideColumnIndex?: number; // Index of the column to be made wider
  narrowColumnIndex?: number;
  narrowness?: string | "auto";
  headerStyle?: "small" | "large";
  gap?: string;
  margin?: string;
  padding?: string;
  cPadding?: string;
}

// Styled Components
const GridWrapper = styled.div<{
  header?: string;
  gap?: string;
  margin?: string;
  padding?: string;
}>`
  display: grid;
  grid-template-areas:
    "arrow header" /* Back arrow in the first column, content in the second column */
    "arrow content"; /* Ensure that the header will span the content column */
  grid-template-columns: ${(props) => (props.header ? "auto 1fr" : "auto 1fr")}; /* First column is auto-sized for the arrow, rest is the grid */
  gap: ${(props) => (props.gap ? props.gap : "1rem")};
  width: 100%;
  margin: ${(props) => (props.margin ? props.margin : "1rem 0")};
  margin-top: ${(props) => (props.header ? "60px" : "0px")};
  text-align: left;
`;

const BackArrowColumn = styled.div`
  grid-area: arrow; /* Place this in the defined arrow area */
  display: flex;
  align-items: flex-start; /* Align arrow to the top */
  justify-content: flex-start; /* Align arrow to the left */
  margin-top: 64%;
`;

const GridContent = styled.div<{ columns: string; gap?: string }>`
  grid-area: content; /* Place this in the defined content area */
  display: grid;
  grid-template-columns: ${(props) => props.columns};
  gap: ${(props) => (props.gap ? props.gap : "1rem")};
`;

const GridHeader = styled.div`
  grid-area: header; /* Place this in the defined header area */
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0.5rem;
`;

const GridColumn = styled.div<{ padding?: string }>`
  padding: ${(props) => (props.padding ? props.padding : "1rem")};
  min-width: min-content;
`;

const Grid: React.FC<GridProps> = ({
  children,
  header,
  headerColor,
  wideColumnIndex,
  narrowColumnIndex,
  narrowness = "auto",
  headerStyle,
  gap,
  margin,
  padding,
  cPadding,
}: GridProps) => {
  const navigate = useNavigate();

  const childrenArray = useMemo(
    () => (Array.isArray(children) ? children : [children]),
    [children],
  );

  const columnsTemplate = useMemo(() => {
    const totalColumns = childrenArray.length;
    return Array.from({ length: totalColumns })
      .map(
        (_, index) =>
          index === wideColumnIndex
            ? "2fr"
            : index === narrowColumnIndex
            ? narrowness
            : "1fr", // Make the specified column wider
      )
      .join(" ");
  }, [childrenArray, wideColumnIndex]);

  return (
    <GridWrapper margin={margin} gap={gap} padding={padding} header={header}>
      {header ? (
        <>
          <GridHeader>
            <PageHeader header={header} color={headerColor} />
          </GridHeader>
          <BackArrowColumn>
            <GoArrowLeft
              onClick={() => navigate(-1)}
              className="back-arrow-3"
            />
          </BackArrowColumn>
        </>
      ) : null}

      <GridContent columns={columnsTemplate} gap={gap}>
        {childrenArray.map((child, index) => (
          <GridColumn padding={cPadding} key={index}>
            {child}
          </GridColumn>
        ))}
      </GridContent>
    </GridWrapper>
  );
};

export default Grid;
