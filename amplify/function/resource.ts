import { defineFunction } from "@aws-amplify/backend";
import dotenv from "dotenv";
dotenv.config();

export const videoGeneratorFunction = defineFunction({
  entry: "./video-generator.ts",
  runtime: 20,
  timeoutSeconds: 90,
  memoryMB: 1024,
});

export const videoListFunction = defineFunction({
  entry: "./video-list.ts",
  runtime: 20,
  timeoutSeconds: 90,
  memoryMB: 1024,
});

export const invokeListFunction = defineFunction({
  entry: "./invoke-list.ts",
  runtime: 20,
  timeoutSeconds: 90,
  memoryMB: 1024,
});
