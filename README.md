# VoxSDK

VoxSDK is a comprehensive toolkit designed to facilitate easy integration of AI-driven speech recognition and synthesis into your applications. With a focus on simplicity and efficiency, VoxSDK offers a set of React hooks and utilities to seamlessly connect with AI services for voice interactions.

## Features

- `VoxProvider`: A context provider to encapsulate the SDK's functionalities and make them accessible throughout your React application.
- `useListen`: A hook to capture and transcribe user speech in real-time.
- `useSpeak`: A hook for text-to-speech functionality, converting text responses into natural-sounding speech.

## Installation

Install VoxSDK using npm:

```bash
npm install vox-sdk
```

Or using yarn:

```bash
yarn add vox-sdk
```

# Setup

- To set up VoxSDK, you will need to generate a speech_key and region from the Azure Portal.

  1. Visit the Microsoft Azure Portal and [create a speech resource](https://portal.azure.com/#create/Microsoft.CognitiveServicesSpeechServices) to obtain your speech_key and region.

  1. [Learn more about text-to-speech and speech-to-text wiyh Microsoft Cognative Speech Services](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/index-speech-to-text).

- You will need to set up both the server and the client.

## Server Setup

- On your server, you will need to create a `GET` endpoint at `/token`.
- Using the `speech_key` and `region`, you will generate an authorization token from Microsoft's APIs.
- Set these values in the .env file as `SPEECH_KEY` and `SPEECH_REGION`.
- The `/token` endpoint should return the following response:.

  ```ts
    {
      token:string,
      region:string
    }
  ```

- Here's a sample implementation of the `/token` endpoint.
- This implementation ensures the token is refreshed every 9 minutes and generates a new token when the client requests a refresh.

  ```ts
  import express from "express";
  import "dotenv/config";
  import axios from "axios";

  let token = null; //iniatilly token will be null
  let lastTokenTimestamp = null;

  //Create .env file and add following values
  const speechKey = process.env.SPEECH_KEY;
  const speechRegion = process.env.SPEECH_REGION;

  // Get Token function fetches the token from Microsoft Api's
  const getToken = async () => {
    try {
      const headers = {
        headers: {
          "Ocp-Apim-Subscription-Key": speechKey,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      };

      const tokenResponse = await axios.post(`https://${speechRegion}.api.cognitive.microsoft.com/sts/v1.0/issueToken`, null, headers);

      token = tokenResponse.data;
      lastTokenTimestamp = Date.now();

      // Generally this token expires after 10 minutes of generation, so we will generate the token at every 9 minutes
      console.log("Token refreshed at:", new Date(lastTokenTimestamp).toLocaleString());
    } catch (error) {
      console.error("Error while getting token:", error);
    }
  };

  const scheduleTokenRefresh = () => {
    setInterval(async () => {
      try {
        await getToken();
      } catch (error) {
        console.error("Error while scheduling token refresh:", error);
      }
    }, 9 * 60 * 1000); // 9 minutes in milliseconds, token will be fetched at every 9 minutes
  };

  // Initial token generation
  getToken()
    .then(() => {
      scheduleTokenRefresh();
    })
    .catch((error) => {
      console.error("Error while generating initial token:", error);
    });

  // /token endpoint that will return token and region
  app.get("/token", async (req, res) => {
    try {
      res.setHeader("Content-Type", "application/json");

      // When client asks for refresh token
      const refreshTheToken = req.query?.refresh;

      if (!token || refreshTheToken) {
        await getToken();
      }

      res.send({
        token: token,
        region: speechRegion,
      });
    } catch (error) {
      console.error("Error while handling /token request:", error);
      res.status(500).send({ error: "An error occurred while processing your request." });
    }
  });

  app.listen(8080, () => console.log("Server running on port 8080"));
  ```

- For detailed documentation you can visit [sample app here](https://github.com/gautam6023/vox-sdk-test/blob/main/server/src/index.js).

### Setting up the Client

- Wrap your application with VoxProvider to make the SDK available throughout your app:

  ```tsx
  import { VoxProvider } from "vox-sdk";

  function App() {
    return <VoxProvider>{/* Your app components go here */}</VoxProvider>;
  }

  export default App;
  ```

- `VoxProvider` expects `config` object which includes,

  1. `baseUrl` : url to your backend. e.g. : `https://exampleapp.com`, Ensure that the `/token` route serves the token and region..

  2. `OnAuthRefresh` : A callback function that is invoked when any authentication error occurs or the token expires.

- Here's the implmentation of the above two step.

  ```tsx
  <VoxProvider
    config={{
      baseUrl: "https://exampleapp.com",
      onAuthRefresh: async () => {
        const { data } = await axios.get("https://exampleapp.com/token?refresh=true");
        return { token: data.token, region: data.region };
      },
    }}
  >
    <App />
  </VoxProvider>
  ```

- The `onAuthRefresh` callback will refresh the token and return it with the region.
- For more details you can visit here [sample app implementation](https://github.com/gautam6023/vox-sdk-test/blob/main/client/src/main.tsx)

# Usage

### Using useListen Hook

After setting up the Server and VoxProvider we are ready to use `useListen` and `useSpeak`.

Integrate speech-to-text functionality in your components:

```jsx
import { useListen } from "voxsdk";

function MyComponent() {
  const { answers, loading, startSpeechRecognition, stopSpeechRecognition } = useListen({
    onEndOfSpeech: () => {
      setText(answers.join(""));
    },
  });

  return (
    <div>
      <button disabled={loading} onClick={startSpeechRecognition}>
        Start Listening
      </button>
      <button onClick={stopSpeechRecognition}>Stop Listening</button>
      <p>Transcript: {answers.join("")}</p>
    </div>
  );
}

export default MyComponent;
```

#### `useListen` hook expects following parameters.

1. `automatedEnd` :

   - Expects a boolean value, default is `true`.
   - When the user finishes speaking, the hook will automatically start the speech-to-text conversion.
   - To listen continuously until the user clicks `stopSpeechRecognition`, pass `false`.

2. `delay` :

   - Expects a value in milliseconds.
   - This is the debounce duration for listening to the user.
   - The default is set to 2000ms.

3. `onEndOfSpeech` :

   - Expects a callback function that is invoked when speech ends.

#### `useListen` Hook Returns.

1. `startSpeechRecognition` : Function to start speech recognition.
2. `stopSpeechRecognition` : Function to stop speech recognition.
3. `answers` : Returns an array of strings containing all the transcribed text.
4. `answer` : The last transcribed text.
5. `recognizerRef` : An instance of `microsoft-cognitiveservices-speech-sdk`.

### Using useSpeak Hook

Implement text-to-speech in your application:

```tsx
import { useSpeak } from "voxsdk";

function MyComponent() {
  const { interruptSpeech, speak, hasAllSentencesBeenSpoken, isSpeaking, streamedSentences } = useSpeak({
    onEnd: () => {
      console.log("It worked");
    },
    shouldCallOnEnd: true,
    throttleDelay: 1000,
    voice: "", // AI Voice
  });

  return <button onClick={speak("Hey, how are you")}>Speak</button>;
}

export default MyComponent;
```

#### `useSpeak` hook expects following parameters.

1. `voice` :

   - Expects a string value.
   - Choose your preferred [AI voice from Microsoft Azure](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support?tabs=tts).

2. `throttleDelay` :

   - Expects a value in milliseconds.
   - This is the throttle duration for listening to the user.
   - The default is set to 2000ms.

3. `onEnd` :

   - Expects a callback function that is invoked when the AI speech ends.
   - To invoke this, set shouldCallOnEnd to true.

#### `useSpeak` Hook Returns.

1. `speak` :

   - Function to start text-to-speech recognition.
   - Expects a string argument to be converted to speech.

2. `interruptSpeech` :

   - Function to stop the AI speech.

3. `hasAllSentencesBeenSpoken` :

   - Returns a boolean value indicating if all sentences have been recognized.

4. `isSpeaking` :

   - Returns a boolean value indicating if the AI is speaking.

5. `streamedSentences` :

   - Returns an array of strings with all streamed sentences.

## Documentation

For detailed documentation and advanced usage, visit VoxSDK Documentation.

## Contributing

Contributions are welcome! Please read our Contributing Guide for more information.

## License

This project is licensed under the MIT License.
