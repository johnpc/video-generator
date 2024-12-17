import { Schema } from "../data/resource";
import { env } from "$amplify/env/video-list";
import { ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client();
export const handler: Schema["listVideos"]["functionHandler"] = async (
  input
) => {
  console.log("Invoking image list", input);
  const listObjectsCommand = new ListObjectsV2Command({
    Bucket: env.AI_VIDEO_GENERATOR_STORAGE_BUCKET_NAME,
    // Prefix: "videos",
  });
  const listObjectsResponse = await s3Client.send(listObjectsCommand);
  if (!listObjectsResponse.Contents) {
    return { videos: [] };
  }

  const videos = listObjectsResponse.Contents.map((item) => ({
    key: item.Key || "",
    size: item.Size || 0,
    date: item.LastModified?.toISOString() || new Date().toISOString(),
  }));

  return {
    videos: videos,
  };
};
