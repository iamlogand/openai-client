import { AxiosResponse } from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { Configuration, CreateCompletionResponse, OpenAIApi } from "openai";

const organization = process.env.OPEN_AI_ORG;
const apiKey = process.env.OPEN_AI_API_KEY;

const configuration = new Configuration({
  organization: organization,
  apiKey: apiKey,
});

const openai = new OpenAIApi(configuration);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const prompt = req.body.prompt;

    const response = (await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
    })) as AxiosResponse<CreateCompletionResponse>;

    res.status(200).json(response.data);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
