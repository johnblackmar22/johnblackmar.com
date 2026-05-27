# LazyUncle Simplified

A streamlined gift management application that helps you keep track of gift recipients, important dates, and gift ideas. Never forget a birthday or special occasion again!

## Project Overview

LazyUncle Simplified is a streamlined version of the original LazyUncle application, built with simplicity and ease of use in mind. The application helps you manage gifts for all your important people by tracking recipients, gift details, and important occasions.

## Features

- **Simple Interface**: Easy-to-use interface for managing recipients and gifts
- **Recipient Management**: Store recipients with details like interests and relationships
- **Gift Tracking**: Record gifts with price, status, and occasion information
- **Dashboard View**: Quick view of upcoming gifts and important dates

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **UI Library**: Chakra UI for a beautiful interface
- **State Management**: Zustand for simple state management
- **Database & Authentication**: Firebase (Firestore & Auth)
- **Routing**: React Router v6

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone <repository-url>
   cd LazyUncle-Simplified
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Set up Firebase
   - Create a Firebase project
   - Enable Authentication and Firestore
   - Copy your Firebase configuration
   - Create a `.env` file based on the `src/firebase.env.example` template

4. Start the development server
   ```
   npm run dev
   ```

5. Open your browser and navigate to http://localhost:5173

## Project Status

This is a minimal, simplified version of the original LazyUncle application. Many features are still in development, including:

- Full authentication implementation
- Complete recipient and gift management
- Gift recommendations
- Date notifications and reminders

## License

This project is licensed under the MIT License.

## Acknowledgments

- Built using Vite, React, and TypeScript
- Styled with Chakra UI
- Firebase for backend functionality 