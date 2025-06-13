# Level-FieldAI - Digital Twin Demo with Tavus CVI

## 🚀 Features

This application demonstrates the Level-FieldAI Lab avatar technology using Tavus Conversational Video Interface:
- Custom Level-FieldAI branding and user interface
- Welcome screen with branded logo and "Start Conversation" button
- **NEW: Tavus CVI Demo** - Direct integration with Tavus CVI player
- Hair check screen with audio and video device selection
- Video call interface powered by Daily.co
- Integration with Tavus API for conversation management
- "Managed by LFAI Lab" footer attribution

### 🎥 CVI Integration Features
- React component for easy integration (`TavusCVIPlayer`)
- Standalone HTML demo page
- Configurable player options (autoplay, loop, transparent background)
- Error handling and loading states
- Control functions (play, pause, status)
- Responsive design with mobile support


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

2.1. **Configure Tavus CVI ID** (for CVI demo):
Edit `src/config/tavus.ts` and replace the placeholder CVI ID with your actual Tavus CVI ID:
```typescript
export const TAVUS_CONFIG = {
  CVI_ID: "your_actual_cvi_id_here", // Replace this
  // ... other config
};
```

3. Start the development server:
```
npm run dev
```

4. Start your customizations:
- Add your own greetings and personality to the `src/constants/greetings.ts` file. Make sure to do in multiple languages.
- Modify the `index.html`  and `/public` folder to match your branding.
- Add your Tavus Avatar Persona ID and Replica ID variables to the `src/api/createConversation.ts` file.
## 🎥 CVI Demo Usage

### Quick Access Methods:
1. **Welcome Screen Button**: Click "Try Tavus CVI Demo" on the main welcome screen
2. **URL Parameter**: Add `?demo=cvi` to your URL (e.g., `http://localhost:5173/?demo=cvi`)
3. **Standalone Page**: Navigate to `/cvi-demo.html` for a standalone demo

### Testing Integration:
```bash
# Run integration test
node scripts/test-cvi-integration.js
```

For detailed CVI integration instructions, see [TAVUS_CVI_INTEGRATION.md](./TAVUS_CVI_INTEGRATION.md)
## 📚 Learn More

- [Learn about Level-FieldAI](https://www.level-fieldai.com/)
- [Tavus Developer Documentation](https://docs.tavus.io/)
- [Tavus API Reference](https://docs.tavus.io/api-reference/)
- [Tavus Platform](https://platform.tavus.io/)
- [Daily React Reference](https://docs.daily.co/reference/daily-react)

## Powered By

This application is powered by Level-field technology and utilizes the Tavus Conversational Video Interface for avatar creation and management.
# cvi-video-demo
