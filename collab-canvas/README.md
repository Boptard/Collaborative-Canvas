# CollabCanvas

A real-time collaborative design tool with AI capabilities (MVP)

## Setup

1. **Clone and install dependencies:**
```bash
cd collab-canvas
npm install
```

2. **Set up Firebase:**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create a new project
   - Enable Authentication with Google provider
   - Create a Firestore database
   - Get your Firebase configuration from Project Settings

3. **Configure environment variables:**
   - Copy `.env.example` to `.env`
   - Fill in your Firebase configuration values

4. **Set up Firestore Security Rules:**

In Firebase Console > Firestore > Rules, add:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /canvases/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

5. **Run the development server:**
```bash
npm start
```

## Features (MVP)

- ✅ Canvas with pan/zoom functionality (60 FPS)
- ✅ Create rectangles and circles
- ✅ Move and resize objects
- ✅ Real-time collaboration
- ✅ Multiplayer cursors with presence awareness
- ✅ Google OAuth authentication
- ✅ State persistence across sessions
- ✅ Performance monitoring

## Controls

- **V** - Select tool
- **R** - Rectangle tool
- **O** - Circle tool
- **Mouse Wheel** - Zoom in/out
- **Click + Drag** - Pan canvas or move objects

## Performance Targets

- 60 FPS during all interactions
- <50ms sync latency for object updates
- Support for 500+ objects
- Support for 5+ concurrent users

## Deployment

Build for production:
```bash
npm run build
```

Deploy to your hosting service of choice (Vercel, Netlify, Firebase Hosting, etc.)