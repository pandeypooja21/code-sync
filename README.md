# ⚡SynapseCode - AI Assisted Code Editor with Real-Time Collaboration

## Overview

SynapseCode is a lightweight, AI-assisted code editor designed to empower developers with real-time multi-user collaboration and advanced AI-driven features. Built with a secure and intuitive workspace, SynapseCode not only supports live code editing and file management but also enhances productivity with AI-powered linting, auto-completion, documentation generation, and syntax correction.

## Problem Statement

Modern software development demands rapid collaboration and high-quality code. Developers need tools that:
- **Seamlessly enable real-time editing:** Multiple users can work simultaneously without conflicts.
- **Provide intelligent code suggestions and error corrections:** Minimize bugs and speed up coding.
- **Ensure organized workspace management:** Support both private and public workspaces with clear file/folder hierarchies.
- **Automatically synchronize code, files, and user interactions:** Eliminate manual saving and reduce merge conflicts.

SynapseCode meets these needs by integrating advanced AI capabilities with robust real-time collaboration, empowering teams to write, review, and maintain high-quality code efficiently.

## Solution Architecture

### Core Infrastructure

#### 1. Authentication & Database
- **Firebase Authentication & Realtime Database:**  
  - **Sign-Up/Login:** Users can register using Google or email with OTP verification.  
  - **Password Management:** Secure options for password reset and change.  
  - **Realtime Sync:** All code, files, and collaboration events are synchronized instantly using Firebase's Realtime Database and snapshot listeners. This ensures that every edit, file change, or chat message is reflected in real time across all user sessions. 🔄

#### 2. AI Integration
- **Google Gemini API:**  
  - **AI-Powered Suggestions:** Offers smart code completions and linting to assist with coding—without relying on context-aware processing. 🤖  
  - **Auto-Documentation:** Automatically generates documentation comments for complex functions to improve code readability. 📚  
  - **Code Correction:** Detects syntax errors on the fly and suggests automated fixes. 🛠️
- **AI Chatbot:**  
  - An integrated chatbot allows users to ask coding-related questions, receive help, and brainstorm ideas interactively. 💬

#### 3. Code Editor & UI
- **Monaco Editor:**  
  - **Customization:** Supports multiple programming languages with customizable themes, adjustable font sizes, syntax highlighting, and collapsible code sections. 🎨  
- **Collapsible Navigation Panel:**  
  - **File Management:** Users can create, rename, delete, and drag-and-drop reorder files and folders in real-time.  
  - **Recursive Implementation:** The navigation panel is built using a recursion technique that efficiently renders nested folder structures. This recursive approach makes it easy to display and manage complex, deeply nested file hierarchies. 🗂️
- **Collaborative Features:**  
  - **Live Cursor Tracking:** Displays each collaborator's cursor and avatar using Firebase realtime updates. 👥  
  - **Chat Integration:** Provides an in-workspace chat feature where members can discuss code, share snippets, and receive messages in real time. 💬  
  - **Workspace Invitations:** Users can invite others to join public workspaces; join/exit events and invitation responses are updated live. 🔔

## Tech Stack

| Component              | Technology                                              |
|------------------------|---------------------------------------------------------|
| **Frontend**           | Next.js 15, Shadcn UI, Tailwind CSS                     |
| **Code Editor**        | Monaco Editor                                           |
| **Realtime Backend**   | Firebase Realtime Database & Firestore                  |
| **AI Services**        | Google Gemini API                                       |
| **Authentication**     | Firebase Authentication (Google & Email/OTP)            |
| **Language**           | JavaScript                                              |

## Implementation Details

### 🔐 Authentication & User Management
- **User Sign-Up/Login:**  
  - **Google OAuth & Email/OTP:** Users have the flexibility to register using Google accounts or via email with OTP verification.  
  - **Password Management:** Features include password resets and updates, ensuring secure access.

### 🚀 Real-Time Collaboration
- **Live Synchronization:**  
  - **Firebase Realtime Database:** Utilized for instant synchronization of code changes, file updates, and user presence (such as live cursor positions and chat messages).  
  - **Snapshot Listeners:** Firebase snapshot listeners continuously monitor changes in the database, ensuring that every update (whether it’s a code edit, a file reordering, or a chat message) is immediately reflected across all connected clients. 🔄
- **Collaborative Workspace:**  
  - **Invitations & Notifications:** Workspace members can send invites, and new joiners are added in real time.  
  - **Integrated Chat & Presence:** An in-built chat system allows team members to communicate instantly, while live cursor tracking displays the real-time location of each collaborator's cursor.  
- **Autosave Feature:**  
  - All code edits are automatically saved to the Firebase database, reducing the risk of data loss and ensuring seamless recovery of work.

### 📝 Code Editor Features
- **Monaco Editor Integration:**  
  - **Multi-Language Support:** Enables syntax highlighting and code editing for multiple programming languages.  
  - **Customizable UI:** Users can change themes, adjust font sizes, and collapse/expand code sections as needed.
- **File Navigation Panel:**  
  - **Recursive Rendering:** The file and folder navigation panel uses a recursive algorithm to display nested directories efficiently. This allows for dynamic creation, renaming, deletion, and reordering (via drag-and-drop) of files and folders, with every change synced in real time. 🗂️  
  - **Real-Time Updates:** Changes to the file system are reflected immediately across all users in the workspace, ensuring consistent project structure.

### 🤖 AI-Driven Enhancements
- **Code Suggestions & Linting:**  
  - Integrated with the Google Gemini API, SynapseCode delivers smart code completions and real-time error detection along with recommended fixes.  
- **Auto-Documentation & Code Correction:**  
  - AI-generated documentation is available for complex functions, helping to maintain clear and well-documented code.  
  - Real-time code correction detects syntax errors as you type, automatically suggesting fixes to streamline development.  
- **AI Chatbot:**  
  - An interactive AI chatbot is embedded within the editor, offering instant help, brainstorming ideas, and generating documentation on demand.

## Installation & Setup

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/Abhi13-02/Haxplore.git
   cd Haxplore
