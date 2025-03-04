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
import { Post } from "../../../../api/Database/Model/Post.ts";
import { ViewableListPost } from "../Misc/Posts.tsx";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Resolve } from "../../utilities/Functions.tsx";

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
  const blockPostRequest = useMemo(() => (!u || u.type !== 0), [u])
  const { response, isLoading, isError } = useRequest<Event[]>(paths.event.all);
  const posts = useRequest<Post[]>("/user/artists/following/posts/recent", blockPostRequest);
  /*if (isLoading || (posts.isLoading && !blockPostRequest)) {
    return <Loading />;
  }

  if (isError || (posts.isError && !blockPostRequest)) {
    return <div style={{ marginTop: "60px" }}>{isError}</div>;
  }

  if (!response || (!posts.response && !blockPostRequest)) {
    return (
      <div style={{ marginTop: "60px" }}>
        You don't have access to this page
      </div>
    );
  }*/

  return (
    <Resolve isLoading={isLoading} isError={isError} response={response}>
      <StyledHome>
        {!blockPostRequest ? (
          <Grid header="Home" narrowColumnIndex={0}>

            <Col className="col-pane" >
              <Row>
                <h2 style={{ padding: "5px" }}>
                  Latest posts from artists you follow
                </h2>
              </Row>
              <Row style={{ margin: "5%", maxHeight: "50vh", overflowY: "auto"}}>
                <Col>
                  <Resolve isLoading={posts.isLoading} isError={posts.isError} response={posts.response}>
                  {posts.response?.map((a, idx) => {
                    return (
                      <div key={idx} style={{margin: "5%"}}>
                        <ViewableListPost post={a} />
                      </div>
                    )
                  })}
                  </Resolve>
                </Col>

              </Row>
            </Col>

            <Col>
              <Row className="col-pane" style={{maxHeight: "50vh", overflowY: "auto", overflowX: "hidden"}}>
                <Row>
                  <h2 style={{ padding: "5px" }}>Similar to artists you like</h2>
                </Row>
                <Row>
                  <Col>TBI</Col>
                </Row>
              </Row>

              <Row className="col-pane">
                <PageHeader header="Upcoming events" color="black" />
                <Col
                  className="col-pane"
                  style={{
                    padding: "20px",
                    borderRadius: "15px",
                    maxHeight: "50vh",
                    overflowY: "auto",
                    minWidth: "min-content"
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
    </Resolve>
  );
}
