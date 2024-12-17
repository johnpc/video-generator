import { Schema } from "../data/resource";
import {
  BedrockRuntimeClient,
  StartAsyncInvokeCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { env } from "$amplify/env/video-generator";
const bedrock = new BedrockRuntimeClient({ region: "us-east-1" });

export const handler: Schema["generateVideo"]["functionHandler"] = async (
  input
) => {
  console.log("Invoking image generator", input);
  // Generate a unique filename
  const seed = Math.floor(Math.random() * 2147483647);

  const startAsyncInvokeCommand = new StartAsyncInvokeCommand({
    modelId: "amazon.nova-reel-v1:0",
    outputDataConfig: {
      s3OutputDataConfig: {
        s3Uri: `s3://${env.AI_VIDEO_GENERATOR_STORAGE_BUCKET_NAME}/videos/`,
      },
    },
    modelInput: {
      taskType: "TEXT_VIDEO",
      textToVideoParams: {
        text: input.arguments.prompt,
        // images: [], // "images": ImageSource[] (list containing a single ImageSource)
      },
      videoGenerationConfig: {
        durationSeconds: 6,
        fps: 24,
        dimension: "1280x720",
        seed: seed,
      },
    },
  });
  console.log({
    bucket: env.AI_VIDEO_GENERATOR_STORAGE_BUCKET_NAME,
    startAsyncInvokeCommand: JSON.stringify(startAsyncInvokeCommand, null, 2),
  });
  try {
    // Make the request
    const bedrockResponse = await bedrock.send(startAsyncInvokeCommand);
    console.log({ bedrockResponse: JSON.stringify(bedrockResponse, null, 2) });
    // Parse the response body
    if (!bedrockResponse.invocationArn) {
      throw new Error("Empty response from Bedrock");
    }
    return {
      jobArn: bedrockResponse.invocationArn,
    };
  } catch (error) {
    console.error("Error generating video:", error);
    throw error;
  }
};
