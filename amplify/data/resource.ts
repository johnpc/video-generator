import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import {
  invokeListFunction,
  videoGeneratorFunction,
  videoListFunction,
} from "../function/resource";

const schema = a.schema({
  Video: a.customType({
    key: a.string().required(),
    size: a.integer().required(),
    date: a.string().required(),
  }),
  VideoList: a.customType({
    videos: a.ref("Video").required().array().required(),
  }),
  Invoke: a.customType({
    status: a.string().required(),
    submitTime: a.string().required(),
    lastUpdateTime: a.string(),
    failureMessage: a.string(),
  }),
  InvokeList: a.customType({
    invokes: a.ref("Invoke").required().array().required(),
  }),
  JobArn: a.customType({
    jobArn: a.string().required(),
  }),
  listInvokes: a
    .query()
    .arguments({
      ignoreMe: a.boolean(),
    })
    .returns(a.ref("InvokeList"))
    .handler(a.handler.function(invokeListFunction))
    .authorization((allow) => allow.guest()),

  listVideos: a
    .query()
    .arguments({
      ignoreMe: a.boolean(),
    })
    .returns(a.ref("VideoList"))
    .handler(a.handler.function(videoListFunction))
    .authorization((allow) => allow.guest()),
  generateVideo: a
    .query()
    .arguments({
      prompt: a.string().required(),
      referenceImage: a.string(),
    })
    .returns(a.ref("JobArn"))
    .handler(a.handler.function(videoGeneratorFunction))
    .authorization((allow) => allow.guest()),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "iam",
  },
});
