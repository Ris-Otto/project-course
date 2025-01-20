//@deno-types=npm:@types/react
import React, { useMemo } from "react";
import { styled } from "styled-components";
import { GoArrowLeft } from "react-icons/go"; // Ensure you have react-icons installed
import { useNavigate } from "react-router-dom";
import PageHeader from "./PageHeader.tsx";

interface GridProps {
  children: React.ReactNode[]; // Expect an array of children
  header: string; // Add a header prop for the PageHeader
  headerColor?: string; // Optionally pass header color
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

const GridContent = styled.div<{ columns: number }>`
  grid-area: content; /* Place this in the defined content area */
  display: grid;
  grid-template-columns: repeat(${(props) => props.columns}, 1fr);
  gap: 0rem;
`;

const GridHeader = styled.div<{ columns: number }>`
  grid-area: header; /* Place this in the defined content area */
  display: grid;

  gap: 1rem;
`;

const GridColumn = styled.div`
  padding: 1rem;
`;

const Grid: React.FC<GridProps> = ({
  children,
  header,
  headerColor,
}: GridProps) => {
  const navigate = useNavigate();
  const childrenArray = useMemo(
    () => (Array.isArray(children) ? children : [children]),
    [children],
  );
  const columns = useMemo(
    () =>
      Math.min(
        Number.isNaN(childrenArray.length) ? 0 : childrenArray.length,
        3,
      ),
    [childrenArray],
  ); // Limit to a maximum of 3 columns

  return (
    <GridWrapper>
      <GridHeader columns={columns}>
        <PageHeader header={header} color={headerColor} />
      </GridHeader>
      <BackArrowColumn>
        <GoArrowLeft onClick={() => navigate(-1)} className="back-arrow-3" />
      </BackArrowColumn>

      <GridContent columns={columns}>
        {childrenArray.map((child, index) => (
          <GridColumn key={index}>{child}</GridColumn>
        ))}
      </GridContent>
    </GridWrapper>
  );
};

export default Grid;
