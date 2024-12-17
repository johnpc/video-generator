import { getUrl } from "aws-amplify/storage";
import { Schema } from "../../amplify/data/resource";
import { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/api";
import {
  Grid,
  Card,
  View,
  Heading,
  Text,
  Loader,
  Alert
} from "@aws-amplify/ui-react";

const client = generateClient<Schema>();

export const VideoList = () => {
  const [videos, setVideos] = useState<
    (Schema["Video"]["type"] & { url: string })[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await client.queries.listVideos({});
        const videos = response.data?.videos;

        if (!videos) {
          setError("No videos found");
          return;
        }

        const filteredVideos = videos.filter((video) =>
          video.key.endsWith(".mp4")
        );

        const videosWithUrl = await Promise.all(
          filteredVideos.map(async (video) => {
            // @ts-expect-error getUrl definition doesn't include path when it should?
            const url = await getUrl({
              path: video.key,
              options: {
                accessLevel: "guest",
                expiresIn: 3600,
              },
            });
            return { ...video, url: url.url.toString() };
          })
        );

        videosWithUrl.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

        setVideos(videosWithUrl);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  if (loading) {
    return (
      <View textAlign="center" padding="2rem">
        <Loader size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <Alert variation="error">
        {error}
      </Alert>
    );
  }

  if (videos.length === 0) {
    return (
      <View textAlign="center" padding="2rem">
        <Text variation="primary">No videos found</Text>
      </View>
    );
  }

  return (
    <View padding="1rem">
      <Heading level={2} marginBottom="1rem">Videos</Heading>
      <Grid
        templateColumns={{ base: "1fr", medium: "1fr 1fr", large: "repeat(3, 1fr)" }}
        gap="1rem"
      >
        {videos.map((video) => (
          <Card key={video.key} padding="1rem">
            <video
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "4px",
              }}
              playsInline
              controls
              key={`video-${video.key}`}
              src={video.url}
            >
            </video>
            <View padding="0.5rem">
              <Text>
                Size: {(video.size / 1024 / 1024).toFixed(2)} MB
              </Text>
              <Text>
                Date: {new Date(video.date).toLocaleString()}
              </Text>
            </View>
          </Card>
        ))}
      </Grid>
    </View>
  );
};
