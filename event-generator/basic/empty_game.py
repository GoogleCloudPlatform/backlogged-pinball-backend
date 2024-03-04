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
import datetime
import json
import time
import uuid

from google.cloud import pubsub_v1 as pubsub


default_project_id = "backlogged-dev"
default_topic_id = "pinball-events"

machine_id = f"BL:{uuid.uuid4().hex}"
simulated = True


def send_game_events(project_id=default_project_id, topic_id=default_topic_id, game_id="generated"):
    publisher = pubsub.PublisherClient()
    topic_path = publisher.topic_path(project_id, topic_id)

    # Start game
    data = json.dumps({"GameId": game_id}).encode("utf-8")

    future = publisher.publish(topic_path, data,
        PinballEventType="GameStarted",
        MachineId=machine_id,
        Simulated=str(simulated),
        Timestamp=datetime.datetime.now().isoformat(),
    )
    print(future.result())

    # Let the game last a *little* while, at least
    time.sleep(1)

    # End game
    data = json.dumps({"GameId": game_id, "TotalScore": 0, "GameLengthMillieconds": 1000}).encode("utf-8")

    future = publisher.publish(topic_path, data,
        PinballEventType="GameEnded",
        MachineId=machine_id,
        Simulated=str(simulated),
        Timestamp=datetime.datetime.now().isoformat(),
    )
    print(future.result())

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

