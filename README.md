# VoxSDK

VoxSDK is a comprehensive toolkit designed to facilitate easy integration of AI-driven speech recognition and synthesis into your applications. With a focus on simplicity and efficiency, VoxSDK offers a set of React hooks and utilities to seamlessly connect with AI services for voice interactions.

## Features

- `useListen`: A hook to capture and transcribe user speech in real-time.
- `useSpeak`: A hook for text-to-speech functionality, converting text responses into natural-sounding speech.
- `initSession`: Utility function to initialize the speech session with necessary configurations.
- `voxProvider`: A context provider to encapsulate the SDK's functionalities and make them accessible throughout your React application.

## Installation

Install VoxSDK using npm:

```bash
npm install voxsdk
```

Or using yarn:

```bash
yarn add voxsdk
```

## Usage

### Setting up the VoxProvider

Wrap your application with VoxProvider to make the SDK available throughout your app:

```jsx
import { VoxProvider } from 'voxsdk';

function App() {
  return (
    <VoxProvider>
      {/* Your app components go here */}
    </VoxProvider>
  );
}

export default App;
```
### Using useListen
Integrate speech-to-text functionality in your components:

```jsx
import { useListen } from 'voxsdk';

function MyComponent() {
  const { transcript, startListening, stopListening } = useListen();

  return (
    <div>
      <button onClick={startListening}>Start Listening</button>
      <button onClick={stopListening}>Stop Listening</button>
      <p>Transcript: {transcript}</p>
    </div>
  );
}

export default MyComponent;
```
### Using useSpeak
Implement text-to-speech in your application:

```jsx
import { useSpeak } from 'voxsdk';

function MyComponent() {
  const { speak } = useSpeak();

  const handleSpeak = () => {
    speak("Hello, welcome to VoxSDK!");
  };

  return (
    <button onClick={handleSpeak}>Speak</button>
  );
}

export default MyComponent;
```

### Initializing a Session
Configure and initiate your speech session:

```jsx
import { initSession } from 'voxsdk';

// Call this function at the start of your application
initSession({
  apiKey: "YOUR_API_KEY",
  region: "YOUR_REGION",
});
```

## Documentation

For detailed documentation and advanced usage, visit VoxSDK Documentation.

## Contributing

Contributions are welcome! Please read our Contributing Guide for more information.

## License

This project is licensed under the MIT License.