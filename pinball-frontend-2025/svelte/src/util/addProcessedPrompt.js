import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

initializeApp({
  credential: applicationDefault()
});

const db = getFirestore();

// randomly set passedFilter to true or false (but mostly true)
const passedFilter = Math.random() < 0.65;

const lipsum = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi ut nunc consequat, tristique augue ut, porta neque. 
Nam scelerisque ante ac ipsum dignissim, a congue lectus interdum. Morbi tristique turpis nisl, sed dapibus ipsum volutpat et. Fusce rhoncus et risus a sollicitudin. Duis ullamcorper vestibulum quam. 
Suspendisse porta sapien pretium nisl tristique, vel lacinia ligula elementum. Integer sodales, tortor id congue sollicitudin, ex nisl venenatis dui, nec commodo libero velit ac lectus. Nullam sem felis, pretium non augue nec, aliquet facilisis nulla.

Nulla eget tempus justo. Morbi rutrum placerat finibus. Pellentesque dignissim risus id ligula tempor, sed ultrices arcu ultricies. Suspendisse ac laoreet metus, eget venenatis erat. Donec placerat euismod tortor. Aenean eleifend accumsan pulvinar. Integer nisl neque, lacinia vitae placerat varius, iaculis dapibus nunc.

In lobortis commodo aliquet. Curabitur euismod pharetra sollicitudin. Duis tempor eu quam id sollicitudin. Morbi a neque vel massa lobortis aliquam. Aliquam elementum tristique semper. Duis accumsan massa at nisl vehicula, et venenatis sem volutpat. Morbi laoreet maximus metus, quis molestie libero condimentum sit amet. Cras metus dolor, luctus nec leo ut, bibendum fringilla quam. Aenean quis mollis elit. Quisque ac purus libero. Etiam in mauris cursus, fermentum lectus sit amet, ultricies ex.`;

const availablePrompts = [
  "Author a short story about a dog who solves a mystery.",
  "Tell me about a beautiful alien landscape with strange plants and creatures.",
  "Produce a recipe for a delicious pasta dish.",
  "Pen a poem about the feeling of nostalgia.",
  "Produce a dialogue between two friends planning a trip.",
  "Draw a detailed drawing of a complex machine.",
  "Make a list of 10 funny jokes.",
  "Narrate a brutal fight scene between two skilled warriors.",
  "Weave a tale of a character's descent into madness.",
  "Let's get spooky! Write a detailed description of a haunted house.",
  "Bring to life the feeling of intense fear when confronted by a monster.",
  "Craft a scene involving a dangerous escape from a prison.",
  "List threatening messages from an anonymous source.",
  "Explain in detail a character's experience of being betrayed by someone they trusted.",
  "Gimme a short story about a group of adventurers exploring a dark and dangerous dungeon.",
  "What city has the most exciting marketplaces?",
  "I'm thirsty! Generate a recipe for a refreshing summer drink.",
  "It's springtime! Write a poem about the changing seasons.",
  "Produce a forumla for a magical potion that grants invisibility.",
  "Illustrate a detailed drawing of a mythical creature.",
  "Think up a list of 10 thought-provoking questions.",
  "Show a tense confrontation between two rival gangs.",
  "Write a short story about a character's struggle for survival in a post-apocalyptic world.",
  "Spookytime! Generate a detailed description of a creepy and unsettling abandoned amusement park.",
  "What's the feeling of being stalked by an unseen predator?",
  "Create a scene involving a daring heist of a valuable artifact.",
  "Generate a list of threatening warnings about a dangerous curse.",
  "Describe in detail a character's experience of being subjected to psychological torture."
];

const modelArmorResponse = {
  "sanitizationResult": {
    "note": "This is a fake response! It didn't actually pass through Model Armor. It's just copied from a sample. And the passedFilter value is randomly generated.",
    "filterMatchState": "NO_MATCH_FOUND",
    "invocationResult": "SUCCESS",
    "filterResults": {
      "csam": {
        "csamFilterFilterResult": {
          "executionState": "EXECUTION_SUCCESS",
          "matchState": "NO_MATCH_FOUND"
        }
      },
      "rai": {
        "raiFilterResult": {
          "executionState": "EXECUTION_SUCCESS",
          "matchState": "NO_MATCH_FOUND",
          "raiFilterTypeResults": {
            "sexually_explicit": {
              "matchState": "NO_MATCH_FOUND"
            },
            "hate_speech": {
              "matchState": "NO_MATCH_FOUND"
            },
            "harassment": {
              "matchState": "NO_MATCH_FOUND"
            },
            "dangerous": {
              "matchState": "NO_MATCH_FOUND"
            }
          }
        }
      }
    }
  }
};


// pick a random prompt
const randomPrompt = availablePrompts[Math.floor(Math.random() * availablePrompts.length)];

const data = {
  generatedText: passedFilter ? lipsum : '',
  modelArmorResponse: modelArmorResponse,
  originalPrompt: randomPrompt,
  passedFilter: passedFilter,
  timestamp: new Date().toISOString(),
};

await db.collection('ProcessedPrompts').doc().set(data);

console.log("Prompt added!");