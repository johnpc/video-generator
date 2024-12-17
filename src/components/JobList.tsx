import { Schema } from "../../amplify/data/resource";
import { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/api";
const client = generateClient<Schema>();

export const JobList = () => {
  const [jobs, setJobs] = useState<Schema["Invoke"]["type"][]>([]);
  useEffect(() => {
    const fetchVideos = async () => {
      const response = await client.queries.listInvokes({});
      const invokes = response.data?.invokes;
      if (!invokes) {
        // alert("FAILED! See console logs");
        // console.error(response);
        return;
      }
      setJobs(invokes.filter((invoke) => invoke.status !== "Completed"));
    };
    fetchVideos();
  }, []);
  return (
    <>
      <>{jobs.length} incomplete jobs</>
      {jobs.map((job) => {
        return (
          <>
            <li key={job.submitTime}>{job.status} {job.failureMessage} {job.submitTime}</li>
          </>
        );
      })}
    </>
  );
};
