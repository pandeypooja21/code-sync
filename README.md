## Sync-code - AI Assisted Code Editor with Real-Time Collaboration

## Overview

SyncCode is a lightweight, AI-assisted code editor designed to empower developers with real-time multi-user collaboration and advanced AI-driven features. Built with a secure and intuitive workspace, SyncCode not only supports live code editing and file management but also enhances productivity with AI-powered linting, auto-completion, documentation generation, and syntax correction.

## Problem Statement

Modern software development demands rapid collaboration and high-quality code. Developers need tools that:
- **Seamlessly enable real-time editing:** Multiple users can work simultaneously without conflicts.
- **Provide intelligent code suggestions and error corrections:** Minimize bugs and speed up coding.
- **Ensure organized workspace management:** Support both private and public workspaces with clear file/folder hierarchies.
- **Automatically synchronize code, files, and user interactions:** Eliminate manual saving and reduce merge conflicts.



### Core Infrastructure

#### 1. Secured by clerk
--**clerk and resender api**
🔄

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



