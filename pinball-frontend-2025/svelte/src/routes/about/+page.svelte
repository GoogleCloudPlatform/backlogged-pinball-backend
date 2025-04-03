<header>
  <div class="cloud-logo"></div>
  <div class="how-it-works">
    <a href="/" class="text-3d box-3d" alt="Go back home">Back to Home</a>
  </div>
</header>

<main>
  <h1 class="text-3d">How It Works</h1>

  <div class="diagram-container">
    <img
      src="/img/diagram.png" 
      alt="Architecture Diagram"
    />
  </div>

  <h2>Key Points:</h2>
  <ol>
    <li>A player hits a prompt on the pinball machine and sends it to the Cloud Run service</li>
    <li>The custom API checks the prompt with Model Armor to make sure it doesn't contain any of the banned categories</li>
    <li>If the prompt is ok, it is forwarded on to Gemini and Vertex AI</li>
    <li>The results of the Model Armor (and Gemini / Vertex AI) are stored in Firestore for further analysis and live display</li>
    <li>Submit your own prompts to see them on the pinball machine! (Some prompts will pass this step, but get rejected by Model Armor on the pinball machine! Try prompt injection, PII, or scammy prompts!)</li>
  </ol>
</main>

<svelte:head>
  <style>
    body {
      background-image: url('/img/bg-color.svg');
    }
  </style>
  <title>About This Application</title>
</svelte:head>

<style>
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    margin: 0 20px;
  }

  main {
    width: 70%;
    margin: 0 auto;
    padding-bottom: 40px;
  }

  .how-it-works a {
    display: block;
    background-color: var(--google-blue);
    color: var(--white); 
    font-size: 18px;
    font-weight: 700;
    border-radius: 50vh;
    padding: 16px 32px;
    text-decoration: none; 
  }


  .cloud-logo {
    width: 50px;
    height: 40px;
    background-image: url('/img/cloud-logo.svg');
    background-size: contain;
    background-position: center center;
    background-repeat: no-repeat;
  }


  h1 {
    margin-bottom: 30px;
  }

  h2 {
    margin-top: 40px; 
    margin-bottom: 15px;
    font-size: 1.5em;
    color: #999; 
  }

  .diagram-container {
    text-align: center; 
    margin: 30px 0;
  }

  .diagram-container img {
    max-width: 100%; 
    height: auto; 
    border: 1px solid #ccc; 
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
    background-color: rgba(222,222,222,0.9); 
  }

  ol {
    padding-left: 40px; 
    line-height: 1.6; 
  }

  li {
    margin-bottom: 10px; 
    font-size: 1.1em;
  }
</style>