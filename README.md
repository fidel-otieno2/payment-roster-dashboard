# Payment Roster Dashboard

This project is a full-stack Payment Roster Dashboard application with:

- Frontend: React + Tailwind CSS
- Backend: Node.js + Express
- Database: PostgreSQL

## Local Development

### Backend

1. Navigate to the backend folder:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with your database and JWT secrets:
   ```
   DB_USER=your_db_user
   DB_HOST=localhost
   DB_DATABASE=paymentroster
   DB_PASSWORD=your_db_password
   DB_PORT=5432
   JWT_SECRET=your_jwt_secret
   ```

4. Start the backend server:
   ```
   npm run dev
   ```

### Frontend

1. Navigate to the frontend folder:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with your API base URL:
   ```
   VITE_API_BASE_URL=http://localhost:4000/api
   ```

4. Start the frontend development server:
   ```
   npm run dev
   ```

## Deployment

### Frontend

- Deploy the frontend folder to Vercel.
- Set environment variable `VITE_API_BASE_URL` in Vercel to your backend API URL.

### Backend

- Deploy the backend folder to a Node.js hosting platform (e.g., Railway, Render).
- Set environment variables for database and JWT secrets.

## Notes

- Ensure your PostgreSQL database is accessible from your backend.
- Use secure environment variables for production.
- Backend API endpoints are prefixed with `/api`.

## License

MIT
