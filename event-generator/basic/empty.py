# Copyright 2024 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.


import argparse
import json
import uuid

from google.cloud import pubsub_v1 as pubsub


default_project_id = "backlogged-dev"
default_topic_id = "pinball-events"

machine_id = f"BL:{uuid.uuid4().hex}"
simulated = True


def send_game_events(project_id, topic_id):
    publisher = pubsub.PublisherClient()
    topic_path = publisher.topic_path(project_id, topic_id)

    message = pubsub.PublisherMessage()

    message.data = json.dumps({"GameId": "123"}).encode("utf-8")

    message.attributes["PinballEventType"] = "GameStarted"
    message.attributes["MachineId"] = machine_id
    message.attributes["Simulated"] = str(simulated)
    message.attributes["Timestamp"] = datetime.datetime.now().isoformat()

    message.publish(topic_path)
    print("Done?")


print(f"Published messages to {topic_path}.")


def main():
    parser = argparse.ArgumentParser(
        description='Send events for an empty game.')
    parser.add_argument('--project_id', help='The Google Cloud project ID.', default=default_project_id)
    parser.add_argument('--topic_id', help='The Pub/Sub topic ID.', default=default_topic_id)

    args = parser.parse_args()

    send_game_events(args.project_id, args.topic_id)


if __name__ == '__main__':
    main()

