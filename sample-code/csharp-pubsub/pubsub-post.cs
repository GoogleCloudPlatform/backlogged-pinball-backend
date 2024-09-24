// Copyright 2024 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// Simple method to post a PubSub event from an old version of Unity
IEnumerator PostMessage(PinballEvent message)
{
    var messages = JObject.FromObject(new
    {
        messages = new JObject[]
        {
            JObject.FromObject(message.GetMessage())
        }
    });

    var content = JObject.FromObject(messages).ToString();
    var rawContent = Encoding.UTF8.GetBytes(content);

    UnityWebRequest client = new UnityWebRequest(PUB_SUB_POST_URL, "POST");

    client.SetRequestHeader("Authorization", "Bearer " + accessToken);
    client.SetRequestHeader("Content-Type", "application/json; charset=utf-8");
    client.uploadHandler = new UploadHandlerRaw(rawContent);
    client.downloadHandler = new DownloadHandlerBuffer();

    yield return client.Send();

    if (client.isError)
    {
        Multimorphic.P3App.Logging.Logger.LogError("Error posting pubsub message: " + client.error);
    }
    else
    {
        var response = client.downloadHandler.text;
        Multimorphic.P3App.Logging.Logger.Log("PubSub Message Posted: " + response);
    }
}
