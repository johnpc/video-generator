import { Button, Input } from "@aws-amplify/ui-react";
import { Schema } from "../../amplify/data/resource";
import { ChangeEvent, useState } from "react";
import { generateClient } from "aws-amplify/api";
const client = generateClient<Schema>();

export const GenerateVideo = () => {
  const [prompt, setPrompt] = useState<string>("");
  const onGenerateVideo = async () => {
    if (!prompt) return;
    const response = await client.queries.generateVideo({
      prompt,
    });
    if (response.data?.jobArn) {
      alert("Video generation started! See you in about 5 minutes.");
    } else {
      alert("FAILED! See console logs");
      console.error(response);
    }
  };
  const onChangePrompt = (e: ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  };
  return (
    <>
      <Input
        placeholder="A video of Bilbo Baggins stabbing a Dragon"
        onChange={onChangePrompt}
      />
      <Button variation="primary" disabled={!prompt} onClick={onGenerateVideo}>
        Generate Video
      </Button>
    </>
  );
};
