import { defineStorage } from "@aws-amplify/backend";
import {
  videoGeneratorFunction,
  videoListFunction,
} from "../function/resource";

export const storage = defineStorage({
  name: "aiVideoGeneratorStorage",
  access: (allow) => ({
    "videos/*": [
      allow.authenticated.to(["read", "write"]),
      allow.guest.to(["read"]),
      allow.resource(videoGeneratorFunction).to(["read", "write"]),
      allow.resource(videoListFunction).to(["read"]),
    ],
  }),
});
