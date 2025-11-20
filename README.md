# My Reminder App

A cute pet-themed reminder application with AI pet growth features.

## Features

- Set reminders for various activities (watering plants, taking medicine, shopping, etc.)
- Cute pet that grows as you complete reminders
- Personalized AI pet with MBTI personality traits
- Supabase backend for data storage

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Build for production:
   ```bash
   npm run build
   ```

## Deployment

This app is configured for deployment on Vercel. Make sure to set the environment variables in your Vercel project settings.

## Technologies Used

- React 18
- Vite
- Supabase
- Konva.js
- React Router