# Conversations Manager

A standalone React application for managing and viewing conversations with user authentication and role-based access control.

## Features

### Core Features
- **User Authentication**: Secure login with JWT tokens
- **Role-Based Access Control**: Admin and user roles with different permissions
- **Conversation Management**: View, search, filter, and manage conversations
- **Real-time Updates**: Auto-refresh and real-time conversation monitoring
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS

### Authentication & Security
- JWT token-based authentication
- Automatic token refresh
- Secure password validation
- Session management
- Permission-based route protection

### Conversation Features
- List all conversations with pagination
- Search conversations by content
- Filter by status, date range, and other criteria
- Bulk operations (delete, export)
- Real-time status monitoring
- Detailed conversation analytics

### User Interface
- Modern, responsive design
- Dark/light theme support
- Toast notifications
- Loading states and error handling
- Accessible components using Radix UI

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **State Management**: React Context + Hooks
- **Build Tool**: Vite
- **Icons**: Lucide React

## Project Structure

```
src/
├── api/                 # API layer and HTTP client
├── components/          # Reusable UI components
│   └── ui/             # Base UI components
├── context/            # React contexts (Auth, etc.)
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── main.tsx           # Application entry point
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Navigate to the conversations app directory:
```bash
cd conversations-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Demo Credentials
- **Username**: admin
- **Password**: admin123

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_TITLE=Conversations Manager
```

### API Integration
The app is designed to work with a backend API. Currently, it includes mock implementations for development. To integrate with a real API:

1. Update the API base URL in the environment variables
2. Replace mock implementations in `src/api/` with real API calls
3. Adjust authentication flow as needed

## Features in Detail

### Authentication System
- Secure login with username/password
- JWT token storage and management
- Automatic token refresh
- Role-based permissions
- Session timeout handling

### Conversation Management
- Paginated conversation listing
- Advanced search and filtering
- Bulk operations
- Export functionality
- Real-time status updates

### User Interface
- Responsive sidebar navigation
- Dashboard with statistics
- Toast notifications for user feedback
- Loading states and error handling
- Accessible design patterns

## Development

### Adding New Pages
1. Create a new component in `src/pages/`
2. Add route in `src/App.tsx`
3. Update navigation in `src/components/Layout.tsx`

### Adding New API Endpoints
1. Define types in `src/types/`
2. Add API functions in `src/api/`
3. Create custom hooks in `src/hooks/`

### Styling Guidelines
- Use Tailwind CSS utility classes
- Follow existing component patterns
- Ensure responsive design
- Maintain accessibility standards

## Deployment

### Build for Production
```bash
npm run build
```

The built files will be in the `dist/` directory.

### Deployment Options
- **Static Hosting**: Netlify, Vercel, GitHub Pages
- **CDN**: AWS CloudFront, Azure CDN
- **Container**: Docker with nginx

## Security Considerations

- JWT tokens are stored securely
- API calls include proper authentication headers
- Route protection based on user permissions
- Input validation and sanitization
- HTTPS recommended for production

## Contributing

1. Follow the existing code style
2. Add TypeScript types for new features
3. Include proper error handling
4. Test responsive design
5. Update documentation as needed

## License

This project is part of the LFAI demo application.