import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { storage } from "./storage/resource";
import {
  videoGeneratorFunction,
  invokeListFunction,
  videoListFunction,
} from "./function/resource";
import { Function } from "aws-cdk-lib/aws-lambda";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Bucket, HttpMethods } from "aws-cdk-lib/aws-s3";

const backend = defineBackend({
  auth,
  data,
  storage,
  videoGeneratorFunction,
  videoListFunction,
  invokeListFunction,
});

const underlyingVideoGenFunction = backend.videoGeneratorFunction.resources
  .lambda as Function;
// "User: arn:aws:sts::566092841021:assumed-role/amplify-videogenerator-xs-videolistlambdaServiceRol-55R1hGaCr1L8/amplify-videogenerator-xss-videolistlambdaB0A0936E-9bJIYdur8Umx is not authorized to perform: s3:ListBucket on resource: \"arn:aws:s3:::amplify-videogenerator-xs-aivideogeneratorstorageb-riwmp5vogjgr\"
// because no identity-based policy allows the s3:ListBucket action"

const aiPolicyStatement = new PolicyStatement({
  effect: Effect.ALLOW,
  actions: [
    "bedrock:InvokeModel",
    "bedrock:ListAsyncInvokes",
    "bedrock:GetAsyncInvoke",
    "bedrock:StartAsyncInvoke",
    "bedrock:InvokeModelWithResponseStream",
    "bedrock:ListAsyncInvokes",
    "s3:PutObject",
    "s3:GetObject",
    "s3:ListBucket",
  ],
  resources: ["*"],
});
underlyingVideoGenFunction.addToRolePolicy(aiPolicyStatement);

const underlyingInvokeListFunction = backend.invokeListFunction.resources
  .lambda as Function;
underlyingInvokeListFunction.addToRolePolicy(aiPolicyStatement);

const underlyingVideoListFunction = backend.videoListFunction.resources
  .lambda as Function;
underlyingVideoListFunction.addToRolePolicy(aiPolicyStatement);

(backend.storage.resources.bucket as Bucket).addCorsRule({
  allowedMethods: [
    HttpMethods.GET,
    HttpMethods.POST,
    HttpMethods.PUT,
    HttpMethods.DELETE,
    HttpMethods.HEAD,
  ],
  allowedOrigins: ["*"],
  allowedHeaders: ["*"],
  exposedHeaders: ["ETag"],
});
