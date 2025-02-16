import paths from "../../../../Shared/paths.ts";
import Event from "../../../../api/Database/Model/Event.ts";
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useAuth, useRequest } from "../../Hooks.ts";
import PageHeader from "../Misc/PageHeader.tsx";
import { useAtom } from "jotai";
import { user } from "../../store.ts";
import { Row, Col } from "react-bootstrap";
import { styled } from "styled-components";
import { EventCalendar } from "../Event/EventCalendar.tsx";
import Grid from "../Misc/Grid.tsx";
import { Loading } from "../../utilities/Loading.tsx";

const StyledHome = styled.div`
  background: ${({ theme }) => theme.cream} !important;
  border-radius: 10px;
  .col-pane {
    background-color: ${({ theme }) => theme.teal};
    border-radius: 15px;
    margin: 5%;
    color: black;
    text-align: center;
  }
`;

export function Home() {
  useAuth(-1);
  const [u, _] = useAtom(user);

  const { response, isLoading, isError } = useRequest<Event[]>(paths.event.all);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <div style={{ marginTop: "60px" }}>{isError}</div>;
  }

  if (!response) {
    return (
      <div style={{ marginTop: "60px" }}>
        You don't have access to this page
      </div>
    );
  }

  return (
    <StyledHome>
      {u ? (
        <Grid header="Home">
          <Col className="col-pane">
            <Row>
              <h2 style={{ padding: "5px" }}>
                Latest posts from artists you follow
              </h2>
            </Row>
            <Row>
              <Col>Nothing to show</Col>
            </Row>
          </Col>
          <Col>
            <Row className="col-pane">
              <Row>
                <h2 style={{ padding: "5px" }}>Similar to artists you like</h2>
              </Row>
              <Row>
                <Col>Nothing to show</Col>
              </Row>
            </Row>

            <Row className="col-pane">
              <PageHeader header="Upcoming events" color="black" />
              <Col
                className="col-pane"
                style={{
                  padding: "20px",
                  borderRadius: "15px",
                }}
              >
                <EventCalendar events={response} />
              </Col>
            </Row>
          </Col>
        </Grid>
      ) : (
        <Grid header={"Home"}>
          <Row
            className="col-pane"
            style={{ margin: "60px", justifyContent: "center" }}
          >
            <Col
              className="col-pane"
              style={{
                padding: "20px",
                borderRadius: "15px",
              }}
            >
              <EventCalendar events={response} />
            </Col>
          </Row>
        </Grid>
      )}
    </StyledHome>
  );
}
