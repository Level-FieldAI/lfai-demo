# Level-FieldAI - Digital Twin Demo with Tavus CVI

## 🚀 Features

This application demonstrates the Level-FieldAI Lab avatar technology using Tavus Conversational Video Interface:
- Custom Level-FieldAI branding and user interface
- Welcome screen with branded logo and "Start Conversation" button
- Hair check screen with audio and video device selection
- Video call interface powered by Daily.co
- Integration with Tavus API for conversation management
- "Managed by LFAI Lab" footer attribution


## 🛠 Getting Started
0. Clone the repository
```sh
git clone https://github.com/level-fieldai/tavus-avatar-demo.git
```

1. Install dependencies:
```sh
npm install
```

2. Create a `.env` file in the root directory and add your Tavus API key:
```
VITE_APP_TAVUS_API_KEY=your_api_key_here
```
You can create an API key at https://platform.tavus.io/

3. Start the development server:
```
npm run dev
```

4. Start your customizations:
- Add your own greetings and personality to the `src/constants/greetings.ts` file. Make sure to do in multiple languages.
- Modify the `index.html`  and `/public` folder to match your branding.
- Add your Tavus Avatar Persona ID and Replica ID variables to the `src/api/createConversation.ts` file.

## 📚 Learn More

- [Learn about Level-FieldAI](https://www.level-fieldai.com/)
- [Tavus Developer Documentation](https://docs.tavus.io/)
- [Tavus API Reference](https://docs.tavus.io/api-reference/)
- [Tavus Platform](https://platform.tavus.io/)
- [Daily React Reference](https://docs.daily.co/reference/daily-react)

## Powered By

This application is powered by Level-field technology and utilizes the Tavus Conversational Video Interface for avatar creation and management.
# cvi-video-demo
