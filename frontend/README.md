# Payment Roster Frontend

A React application for managing payment rosters, built with Vite.

## Features

- User authentication (login/register)
- Payment management (add, view, update, delete payments)
- Role-based access (admin/employee)
- Responsive dashboard with statistics
- Integration with Render backend API

## Development

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the frontend directory: `cd frontend`
3. Install dependencies: `npm install`
4. Copy environment variables: `cp .env.example .env`
5. Update `.env` with your API base URL (defaults to Render backend)
6. Start development server: `npm run dev`

### Environment Variables

Create a `.env` file in the frontend directory:

```
VITE_API_BASE_URL=https://your-render-backend-url.onrender.com
```

If not set, it defaults to the Render backend URL.

## Deployment

### Vercel

1. Connect your GitHub repository to Vercel
2. Add environment variable: `VITE_API_BASE_URL=https://your-render-backend-url.onrender.com`
3. Deploy

### Netlify

1. Connect your GitHub repository to Netlify
2. Add environment variable in build settings: `VITE_API_BASE_URL=https://your-render-backend-url.onrender.com`
3. Deploy

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Technologies

- React 19
- Vite
- Axios for API calls
- Tailwind CSS for styling
- React Router for navigation
