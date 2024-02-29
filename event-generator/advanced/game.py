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

import datetime
import json
import time
import uuid

from google.cloud import pubsub_v1 as pubsub


default_project_id = "backlogged-dev"
default_topic_id = "pinball-events"


class Game:
    def __init__(self, 
            project_id=default_project_id, 
            topic_id=default_topic_id, 
            game_id="generated", 
            machine_id=f"BL:{uuid.uuid4().hex}", 
            simulated = True,
            acceleration = 1.0  # How many times as fast as realtime play
        ):
        self.project_id = project_id
        self.topic_id = topic_id

        self.game_id = game_id
        self.machine_id = machine_id
        self.simulated = simulated

        self.publisher = pubsub.PublisherClient()
        self.topic_path = self.publisher.topic_path(project_id, topic_id)

        self.started_at = datetime.datetime.now()
        self.acceleration = acceleration


    def send_event(self, event_type, event_properties={}):
        if not "GameId" in event_properties:
            event_properties["GameId"] = self.game_id

        future = self.publisher.publish(
            self.topic_path,
            json.dumps(event_properties).encode("utf-8"),
            PinballEventType=event_type,
            MachineId=self.machine_id,
            Simulated=str(self.simulated),
            Timestamp=datetime.datetime.now().isoformat(),
        )
        return(future.result())
    
    def elapsed_ms(self):
        difference = datetime.datetime.now() - self.started_at
        return difference.total_seconds() * 1000
    

    def start(self):
        self.send_event("GameStarted")


    def end(self, score):
        game_length = datetime.datetime.now() - self.started_at
        self.send_event("GameEnded", {"TotalScore": score, "GameLengthMilliseconds": self.elapsed_ms()})


    def launch(self, count):
        self.send_event("BallLaunched", {
            "LaunchedBallCount": count,
            "IsMultiball": count > 1,
            "InGameTime": self.elapsed_ms()
        })


    def drain(self, count):
        self.send_event("BallDrained", {
            "DrainedBallCount": count,
            "IsMultiball": count > 1,
            "InGameTime": self.elapsed_ms()
        })


    def multiball(self, score):
        self.send_event("MultiballStarted", {
            "CurrentScore": score,
            "IsMultiball": count > 1,
            "InGameTime": self.elapsed_ms()
        })


    def target(self, name, point_value):
        self.send_event("TargetHit", {
            "TargetName": name,
            "PointValue": point_value,
        })
        

    def spinner(self, name, spins, point_value):
        self.send_event("TargetHit", {
            "TargetName": name,
            "TotalPointValue": point_value,
            "TotalSpins": spins,
        })
