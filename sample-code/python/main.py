# Copyright 2022 Google LLC
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


# This is a minimal starting app for receiving and sending Pub/Sub messages from
# and to the Next 2024 Pinball game, and is used in the Pinball Python Codelab.


# Receiving messages via push subscriptions does not require knowing where they
# come from. Sending message back does requiring identifying the topic to use.
PROJECT_ID = "backlogged-dev"
TOPIC_ID = "pinball-reactions"

import base64   # Used to decode Pub/Sub message data
import json     # Used to flatten dicts to strings
import os       # Used to determine the server port to listen on

from flask import Flask, request    # Python web framework

from google.cloud import pubsub_v1 as pubsub    # For publishing messages


app = Flask(__name__)   # Instantiate the web server


@app.route('/', methods=["POST"])   # Receive Pub/Sub push messages (HTTP POST to "/")
def receive_push_messages():
    # Pub/Sub push subscriptions deliver messages through regular HTTP POST
    # requests, with a JSON body.
    request_body = request.get_json(silent=True)    # Returns None if not JSON

    # This app is intended only to receive Pub/Sub push messages. Reject any
    # HTTP POST request that is not a properly formed Pub/Sub push message.
    if request_body is None:
        print("ERROR: Not JSON")                # Log the issue
        return "Unsupported Media Type", 415    # Non-2XX notifies error to the sender

    if not isinstance(request_body, dict) or "message" not in request_body:
        print("ERROR: Not PubSub")  # Log the issue
        return "Bad Request", 400   # Non-2XX notifies error to the sender

    # The request_body seems to a properly formed Pub/Sub message. The message
    # itself is a field called "message".
    message = request_body["message"]

    # The data portion of the message is base64-encoded. Decode it.
    data = message.get("data", "")                  # Empty string if missing
    body = base64.b64decode(data).decode("utf-8")   # b64decode returns bytes

    # Log the decoded data to check if it was correctly received.
    print(f"DEBUG: decoded data = '{body}'")

    # The body can be any string. For the Pinball game, the body will always
    # be a JSON string, usually containing several data fields.

    # There are a number of other fields in the message that can convey
    # information, some of which are essential to understanding the Pinball
    # event.
    
    # See https://cloud.google.com/pubsub/docs for more information on
    # the structure and contents of Pub/Sub messages in general.
    
    # See the end of the codelab for specifications of the Pinball message format.

    # Determine whether you want the send a message back to the Pinball machine.
    # For most events you will not want to do this to avoid spamming the
    # machine. You will be given suggestions of events worth responding to,
    # such as a completed game with a new high score, or longest duration.

    if False:   # replace with condition that should trigger a response
        result = send_response(
            reaction_type="DisplayMessage",
            machine_id="GBL:1",
            data={"MessageKey": "LUCKY"}
        )
        print(f"Result of sending message is {result}.")

    # Acknowledge the message to prevent retries.
    return "OK", 200


# Your code can also send messages to the Pinball machine that affect what it is
# displaying. This function is not triggered in response to an incoming event,
# but is called when processing an incoming message that calls for a response.
# For example, when a game with a new high score ends.
def send_response(reaction_type="valid reaction", machine_id="valid ID", data=""):
    # return False    # You will be replacing this function body with a working one
    print("Target Project ID: "+PROJECT_ID)
    print("Topic ID: "+TOPIC_ID)

    publisher = pubsub.PublisherClient()
    topic_path = f"projects/{PROJECT_ID}/topics/{TOPIC_ID}"

    message_data = json.dumps(data).encode("utf-8")
    message = {
        "data": message_data,
        "attributes": {
            "PinballReactionType": reaction_type,
            "MachineId": machine_id
        } 
    }

    try: 
        future = publisher.publish(topic_path, message['data'], **message['attributes'])
        message_id = future.result()
        print(f"Message {message_id} published successfully")
    except Exception as e:
        print(f"Error publishing message: {str(e)}")

# Cloud Run and other platforms will often run this program as a module in a
# preferred web server application. If this file is run as a stand-alone
# application, it needs to start its own web server.
if __name__ == '__main__':
    server_port = os.environ.get('PORT', '8080')
    app.run(debug=False, port=server_port, host='0.0.0.0')
