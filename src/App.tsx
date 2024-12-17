import "@aws-amplify/ui-react/styles.css";
import { Amplify } from "aws-amplify";
import config from "../amplify_outputs.json";
import { Divider, useTheme } from "@aws-amplify/ui-react";
import { Header } from "./components/Header";
import { GenerateVideo } from "./components/GenerateVideo";
import { VideoList } from "./components/VideoList";
import { JobList } from "./components/JobList";
Amplify.configure(config);

function App() {
  const { tokens } = useTheme();
  return (
    <>
      <Header />
      <Divider
        style={{ visibility: "hidden" }}
        marginTop={tokens.space.small}
        marginBottom={tokens.space.small}
      />
      <JobList />
      <GenerateVideo />
      <VideoList />
    </>
  );
}

export default App;
