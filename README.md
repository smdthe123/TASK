# Task Planning Website

A dynamic task planning website with categorized task management, drag-and-drop functionality, and smooth animations.

## Features

- ✅ Task management with 4 customizable categories
- ✅ Drag-and-drop functionality between categories  
- ✅ Add, edit, and delete tasks with modal forms
- ✅ Priority levels (High, Medium, Low) with color coding
- ✅ Editable category names
- ✅ Dark navy theme with smooth animations
- ✅ Responsive design for mobile and desktop

## Free Deployment Options

### 1. Vercel (Recommended - Easiest)

1. **Push to GitHub:**
   - Create a new repository on GitHub
   - Push your code: `git add . && git commit -m "Initial commit" && git push`

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com) and sign up
   - Click "New Project" and import your GitHub repository
   - Vercel will automatically detect the configuration
   - Click "Deploy" - your app will be live in 2-3 minutes!

### 2. Netlify

1. **Build the project:**
   - Run `npm run build` locally
   - Upload the `dist` folder to Netlify

2. **Deploy:**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop your `dist` folder
   - Your app will be live instantly!

### 3. Railway

1. **Connect GitHub:**
   - Go to [railway.app](https://railway.app)
   - Connect your GitHub repository
   - Railway will automatically deploy your app

### 4. Render

1. **Create account:**
   - Go to [render.com](https://render.com)
   - Connect your GitHub repository
   - Select "Web Service" and it will auto-deploy

## Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open in browser:**
   - Navigate to `http://localhost:5000`

## Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS, Vite
- **Backend:** Express.js, Node.js
- **Storage:** In-memory (no database required)
- **UI Components:** Radix UI, shadcn/ui
- **Drag & Drop:** @dnd-kit
- **Forms:** React Hook Form with Zod validation

## Deployment Ready

The app is configured for easy deployment with:
- Static file serving
- Production build optimization
- Zero-config deployment to major platforms
- No database dependencies (uses in-memory storage)

Your task planning website will be live and ready to use in minutes!