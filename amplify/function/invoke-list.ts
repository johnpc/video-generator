import { Schema } from "../data/resource";
import {
  BedrockRuntimeClient,
  ListAsyncInvokesCommand,
} from "@aws-sdk/client-bedrock-runtime";

const bedrock = new BedrockRuntimeClient();
export const handler: Schema["listInvokes"]["functionHandler"] = async (
  input
) => {
  console.log("Invoking image list", input);
  const listAsyncInvokesCommand = new ListAsyncInvokesCommand({});
  const listAsyncInvokesResponse = await bedrock.send(listAsyncInvokesCommand);
  if (!listAsyncInvokesResponse.asyncInvokeSummaries) {
    return { invokes: [] };
  }

  const invokes = listAsyncInvokesResponse.asyncInvokeSummaries.map((item) => {
    return {
      status: item.status as string,
      failureMessage: item.failureMessage as string,
      submitTime: item.submitTime!.toLocaleString(),
      lastUpdateTime: item.lastModifiedTime?.toLocaleString(),
    };
  });

  return {
    invokes,
  };
};
