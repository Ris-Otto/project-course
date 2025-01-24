//@deno-types=npm:@types/react
import React, { useMemo } from "react";
import { styled } from "styled-components";
import { GoArrowLeft } from "react-icons/go"; // Ensure you have react-icons installed
import { useNavigate } from "react-router-dom";
import PageHeader from "./PageHeader.tsx";

interface GridProps {
  children: React.ReactNode[] | React.ReactNode; // Expect an array of children
  header: string; // Add a header prop for the PageHeader
  headerColor?: string; // Optionally pass header color
  wideColumnIndex?: number; // Index of the column to be made wider
}

// Styled Components
const GridWrapper = styled.div`
  display: grid;
  grid-template-areas:
    "arrow header" /* Back arrow in the first column, content in the second column */
    "arrow content"; /* Ensure that the header will span the content column */
  grid-template-columns: auto 1fr; /* First column is auto-sized for the arrow, rest is the grid */
  gap: 1rem;
  width: 100%;
  margin: 1rem 0;
  margin-top: 60px;
  text-align: left;
`;

const BackArrowColumn = styled.div`
  grid-area: arrow; /* Place this in the defined arrow area */
  display: flex;
  align-items: flex-start; /* Align arrow to the top */
  justify-content: flex-start; /* Align arrow to the left */
  padding: 0.5rem;
  margin-top: 15px;
`;

const GridContent = styled.div<{ columns: string }>`
  grid-area: content; /* Place this in the defined content area */
  display: grid;
  grid-template-columns: ${(props) => props.columns};
  gap: 1rem;
`;

const GridHeader = styled.div`
  grid-area: header; /* Place this in the defined header area */
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0.5rem;
`;

const GridColumn = styled.div`
  padding: 1rem;
  min-width: fit-content;
`;

const Grid: React.FC<GridProps> = ({
  children,
  header,
  headerColor,
  wideColumnIndex,
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
        (_, index) => (index === wideColumnIndex ? "3fr" : "1fr"), // Make the specified column wider
      )
      .join(" ");
  }, [childrenArray, wideColumnIndex]);

  return (
    <GridWrapper>
      <GridHeader>
        <PageHeader header={header} color={headerColor} />
      </GridHeader>
      <BackArrowColumn>
        <GoArrowLeft onClick={() => navigate(-1)} className="back-arrow-3" />
      </BackArrowColumn>

      <GridContent columns={columnsTemplate}>
        {childrenArray.map((child, index) => (
          <GridColumn key={index}>{child}</GridColumn>
        ))}
      </GridContent>
    </GridWrapper>
  );
};

export default Grid;
