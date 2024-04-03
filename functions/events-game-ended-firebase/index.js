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

const functions = require('@google-cloud/functions-framework');
const base64 = require('base-64');
const admin = require('firebase-admin');

admin.initializeApp(); // Initialize the Firebase Admin SDK
const db = admin.firestore(); // Get a reference to the Firestore database

functions.cloudEvent('events-game-ended-firebase', async cloudEvent => {
  const messageData = cloudEvent.data.message;
  const attributes = messageData.attributes;
  if (messageData.attributes && messageData.attributes.PinballEventType === 'GameEnded') {
    const base64Data = messageData.data;
    const decodedData = base64.decode(base64Data);
    const jsonData = JSON.parse(decodedData);

    const now = new Date;
    const utcTimestamp = Date.UTC(now.getUTCFullYear(),now.getUTCMonth(), now.getUTCDate() , 
          now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds())

    const mergedData = { 
      ...jsonData,
      ...messageData.attributes,
      utcTimestamp: utcTimestamp
    };

    console.log(mergedData);
    // Send to Firestore
    const collectionRef = db.collection('CompletedGames');
    const docRef = await collectionRef.add(mergedData); 
    console.log(`Document written with ID: ${docRef.id}`);
  } else {
    console.log('Message did not have the expected attribute. Skipping...');
  }
});