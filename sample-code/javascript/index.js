const express = require('express');
const bodyParser = require('body-parser');
const { PubSub } = require('@google-cloud/pubsub');

const app = express();
app.use(bodyParser.json());

// Helpful constants for this function
const PROJECT_ID = "backlogged-dev";
const TOPIC_ID = "pinball-reactions";
const DISPLAY_MESSAGE = "DisplayMessage";
const EVENT_TYPE = "PinballEventType";
const EMOJI = "Emoji";

const pubSubClient = new PubSub({ projectId: PROJECT_ID });


// The Pub/Sub message will be sent directly to the root
// of the server.  This function defines how the server will
// process and respond to the message.
app.post('/', (req, res) => {
  const pushMessage = req.body;

  // The push message comes in as a JSON string.
  // Pinball events are always Pub/Sub messages stored
  // in the `message` member of the wrapper message/

  if (!pushMessage || !pushMessage.message) {
    console.error('ERROR: Not a valid Pub/Sub message'); // Log an issue processing this POST
    return res.status(400).send("Bad Request"); // Return a 400 to indicate an error
  }

  const message = pushMessage.message;

  // message.data contains the 'payload' of the message we care about.
  // It is a JSON string encoded in base64 by Pub/Sub
  const data = Buffer.from(pushMessage.message.data, 'base64').toString('utf-8');

  // See https://cloud.google.com/pubsub/docs for more information on
  // the structure and contents of Pub/Sub messages in general.

  // Log the decoded message data  
  console.log(`DEBUG: decoded data = '${data}'`);


  // Process the decoded JSON data as needed
  try {
    const messageData = JSON.parse(data);
    // ... your message processing logic here ...



    // Here, you can make a decision about whether to send a response

    // If this condition is true, send a message back for EVERY event
    if (false) {
      sendResponse(DISPLAY_MESSAGE, "GBL:1", { MessageKey: "LUCKY", HexColor: "#EA8600" });
    }
    // If the message is a 'SlingshotHit' event
    // then send a burst of 'wood' emoji
    // or a message "I'm feeling Lucky"

    if (message.attributes && message.attributes[EVENT_TYPE] == "SlingshotHit") {
      if (messageData.SlingshotName == "slingR") {
        sendResponse(EMOJI, "GBL:1", { EmojiName: "wood" });
      } else {
        sendResponse(DISPLAY_MESSAGE, "GBL:1", {MessageKey: "LUCKY", HexColor: "#FFFFFF"});
      }
    }
    // Try sending the following emoji:
    // beaver, call_me, clown, cool, heart, moai, popper,
    // smile, think, thumbs_up, wood

    // Or experiment with different messages!
    //        { "GREAT_JOB", "Great job!" },
    //        { "WAY_TO_GO", "Way to go!" },
    //        { "SQUASH_BUGS", "Squash those bugs!" },
    //        { "MERGE", "No merge conflicts!" },
    //        { "LUCKY", "I'm feeling lucky!" },
    //        { "ACHIEVEMENT", "Achievement unlocked!" },
    //        { "SHIP", "Ship it!" },

  } catch (error) {
    console.error('Error processing message data:', error);
  }

  res.status(200).send('OK'); // Acknowledge receipt
});


async function sendResponse(reactionType, machineId, data) {

  console.log('Target Project ID:', PROJECT_ID);
  console.log('Topic ID:', TOPIC_ID);

  const message = {
    data: Buffer.from(JSON.stringify(data)),
    attributes: {
      PinballReactionType: reactionType,
      MachineId: machineId
    }
  };

  console.log('Message Data:', message);

  const topicPath = `projects/${PROJECT_ID}/topics/${TOPIC_ID}`;


  try {
    const messageId = await pubSubClient.topic(topicPath).publishMessage(message);
    console.log(`Message ${messageId} published successfully.`);
  } catch (error) {
    console.error(`Error publishing message: ${error.message}`);

  }
}

// Start a web server in order to respond to the pub/sub message
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});