import { GoogleAuth } from 'google-auth-library';
import axios from 'axios';

export async function sanitizeUserPrompt(text: string, template: string = 'strict') {
  try {
    const auth = new GoogleAuth();
    const client = await auth.getClient();
    const accessTokenObj = await client.getAccessToken();
    const accessToken = accessTokenObj.token;

    // Build the URL from configurable project ID, model ID, and location
    const project = 'backlogged-ai';
    const location = 'us-central1';

    const url = `https://modelarmor.${location}.rep.googleapis.com/v1/projects/${project}/locations/${location}/templates/${template}:sanitizeUserPrompt`;

    const response = await axios.post(
      url,
      { user_prompt_data: { text: text } },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );


    console.log(`Model Armor Response:\n${JSON.stringify(response.data, null, 2)}`);

    return response.data;
  } catch (error) {
    console.error('Error sanitizing user prompt:', error);
    throw error;
  }
}