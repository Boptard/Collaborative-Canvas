# Product Requirements Document (PRD) — CollabCanvas

## 1. Introduction

### 1.1 Goal
CollabCanvas is a next-generation real-time collaborative design tool inspired by Figma, with a core focus on integrating a powerful AI agent capable of manipulating the canvas via natural language commands (co-creative design).

### 1.2 Target Audience
Digital product designers, design teams, and developers needing a shared, high-performance canvas environment for rapid prototyping and ideation.

### 1.3 Technology Stack
- **Front-end:** React  
- **Backend/Database:** Firebase Firestore (or similar highly scalable NoSQL database for real-time synchronization)  
- **Authentication:** Google OAuth  
- **AI Agent:** Gemini API with Function Calling

## 2. Minimum Viable Product (MVP) Requirements (Checkpoint 1)
The focus of the MVP is establishing a solid, high-performance, and resilient collaborative foundation.

### 2.1 MVP Feature List
| ID    | Feature Category        | Description                                                           | Priority |
|-------|-------------------------|------------------------------------------------------------------------|----------|
| MVP.1 | Canvas Core             | Basic canvas with Pan/Zoom functionality.                              | Must Have |
| MVP.2 | Object Creation         | Ability to create Rectangle and Circle shapes.                         | Must Have |
| MVP.3 | Object Default State    | New objects appear at a fixed size at the center of the current viewport. | Must Have |
| MVP.4 | Object Interaction      | Ability to move and resize existing objects.                           | Must Have |
| MVP.5 | Data Synchronization    | Real-time sync between 2+ concurrent users.                            | Must Have |
| MVP.6 | Cursor Presence         | Multiplayer cursors visible in real-time.                              | Must Have |
| MVP.7 | Presence Awareness      | Clear visibility of who is online, displayed as a color-coded username tag attached to the user's cursor. | Must Have |
| MVP.8 | Authentication          | Formal user authentication using Google OAuth.                         | Must Have |
| MVP.9 | Persistence             | Canvas state persists across disconnections/reconnections (e.g., refresh mid-edit). | Must Have |
| MVP.10| Deployment              | Deployed and publicly accessible for testing.                          | Must Have |

### 2.2 MVP Technical Specifications

**Data Model — Single Canvas JSON Document**  
The entire canvas state (including all objects) will be stored in a single Firestore document. This simplifies sync logic for the MVP but requires careful management to ensure the ms sync target is met for frequent updates.

**Sync Model — Continuous State Update**  
Object state is updated continuously (e.g., 60 FPS) while a user is interacting with it (dragging, resizing).

**Conflict Resolution — First-User-Lock (Move/Resize)**  
The first user to begin moving or resizing an object gains temporary control (lock). Other users cannot move the object until the first user releases the mouse button (action completion). The system will use a "last write wins" approach for simultaneous, non-locked changes (e.g., color change).

**Performance Targets**  
- **Frame Rate:** Maintain 60 FPS during all interactions (pan, zoom, object manipulation).  
- **Sync Latency (Objects):** Sync object changes across users in ms.  
- **Sync Latency (Cursors):** Sync cursor positions in ms.

**Scalability Targets**  
- **Object Count:** Support 500+ simple objects without FPS drops.  
- **Concurrent Users:** Support 5+ concurrent users without performance degradation.

## 3. Core Collaborative Canvas Features (Post-MVP)
Once the MVP foundation is solid, the following features will be implemented to complete the core canvas experience.
- Shape Types: Add support for Lines and Text Layers with basic formatting (font size, bold/italic).
- Object Manipulation: Implement Rotate functionality for all shapes.
- Layer Management: Add basic layer operations: Duplicate and Delete objects.
- Selection: Enable selection for both single objects and multiple objects (via Shift-click or Drag-to-select).
- Styling: Basic styling options: solid colors, border color/thickness.

## 4. The AI Feature Roadmap (Post-MVP Priority)
The core competitive advantage is the AI agent that uses Function Calling to manipulate the canvas state. This requires defining a robust Canvas API (functions) that the AI agent can call based on the user's natural language prompt.

### 4.1 AI Capability Categories
#### 4.1.1 Creation Commands
The agent should be able to create new objects based on type, position, and initial styling.
- Example: "Create a red circle at position 100, 200"
- Example: "Add a text layer that says 'Hello World'"
- Example: "Make a 200x300 rectangle"

#### 4.1.2 Manipulation Commands
The agent should be able to modify the state of existing, selected, or named elements.
- Example: "Move the blue rectangle to the center"
- Example: "Resize the circle to be twice as big"
- Example: "Rotate the text 45 degrees"

#### 4.1.3 Layout Commands
The agent should be able to apply spatial transformations to groups of elements.
- Example: "Arrange these shapes in a horizontal row"
- Example: "Create a grid of squares"
- Example: "Space these elements evenly"

#### 4.1.4 Complex / Component Generation Commands
These commands require the AI to generate a sequence of multiple simple shapes and text layers, grouped together to form a common UI component. This will be the highest-value AI feature.
- Example: "Create a login form with username and password fields"
- Example: "Build a navigation bar with 4 menu items"
- Example: "Make a card layout with title, image, and description"

## 5. Success Metrics
| Metric                | Target | Notes |
|----------------------|--------|-------|
| Performance (Sync)   | ms latency for object updates | Core technical gate for MVP; must be maintained under load. |
| Performance (FPS)    |  FPS maintained | Core user experience gate. |
| Stability (Auth)     |  success rate for Google OAuth | Users must be able to sign in reliably. |
| AI Adoption          |  of new canvas objects are AI-generated (Post-MVP) | Measure success/utility of AI integration. |
| User Flow            | Seamless transitions between creation, interaction, and collaboration | Measured by successful completion of all MVP testing scenarios. |

## 6. Testing Scenarios (MVP Focus)
We will use the following scenarios to test the robustness of the real-time sync foundation:

1. **Concurrent Interaction** — Two users simultaneously edit different objects (e.g., User A moves a Circle, User B resizes a Rectangle) to confirm FPS is maintained and changes sync in ms.  
2. **Conflict Resolution** — User A begins dragging Object X. User B immediately tries to drag Object X. Confirm that the First-User-Lock prevents User B's action and that User A's continuous movement is the only data streamed.  
3. **State Persistence** — One user refreshes the browser mid-edit. Confirm that the canvas state (including the last completed action) is saved and successfully reloaded upon reconnection.  
4. **Load Test** — Multiple shapes are created and moved rapidly by a single user to test the sync performance and FPS stability.
