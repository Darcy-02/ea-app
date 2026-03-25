# EmptyArt

A mini artwork social platform where users upload their artworks, discover other artists, and interact through likes, comments, bookmarks, and follows — like a simple Instagram for art.

## Tech Stack

**Frontend:** React 19, Vite, Tailwind CSS 4, React Router 7, Motion (Framer Motion), React Hot Toast  
**Backend:** Flask 3, Flask-SQLAlchemy, SQLite, PyJWT, Flask-CORS  
**Auth:** JWT-based (stored in localStorage)

## Project Structure

```
EmptyArt/
├── backend/           # Flask API server
│   ├── app.py         # App factory, CORS, blueprint registration
│   ├── database.py    # SQLAlchemy models (User, Upload, Reaction, Follow)
│   ├── helpers.py     # JWT token generation, auth decorators
│   ├── routes/
│   │   ├── auth.py    # Register, login, current user
│   │   ├── uploads.py # CRUD uploads, feed, user uploads
│   │   ├── reactions.py # Like, comment, bookmark toggles
│   │   ├── users.py   # Profiles, follow/unfollow, edit profile
│   │   └── admin.py   # Admin: manage uploads, reactions, users
│   ├── static/        # Uploaded images & API tester page
│   ├── instance/      # SQLite database file
│   ├── .env           # Backend environment variables
│   └── requirements.txt
├── frontend/          # React SPA
│   ├── src/
│   │   ├── App.jsx    # Routing & layout
│   │   ├── api.js     # Centralized fetch wrapper with auth
│   │   ├── components/
│   │   │   ├── Landing.jsx    # Login/signup page
│   │   │   ├── Feed.jsx       # Home feed (followed users' uploads)
│   │   │   ├── Explore.jsx    # Browse all artworks
│   │   │   ├── Profile.jsx    # User profile & upload grid
│   │   │   ├── Upload.jsx     # Drag-and-drop image upload
│   │   │   ├── Bookmarks.jsx  # Saved artworks
│   │   │   ├── PostDetail.jsx # Lightbox modal with comments
│   │   │   ├── AppNav.jsx     # Sidebar + mobile bottom nav
│   │   │   ├── AdminDashboard.jsx # Admin panel
│   │   │   └── ...
│   │   └── index.css
│   ├── .env           # Frontend environment variables
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- npm

### Backend Setup

```bash
cd backend

# Create and activate a virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
# Edit .env and set a strong SECRET_KEY for production
cp .env.example .env  # or edit the existing .env

# Run the server (creates the SQLite database automatically on first start)
python3 app.py
```

The API runs at **http://localhost:5000**. Visit it in your browser to use the built-in API tester.

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app runs at **http://localhost:5173**.

### Environment Variables

**backend/.env**

| Variable       | Description                      | Default                        |
| -------------- | -------------------------------- | ------------------------------ |
| `SECRET_KEY`   | JWT signing secret               | `dev-fallback-key`             |
| `DATABASE_URI` | SQLAlchemy database URI          | `sqlite:///emptyart.db`        |

**frontend/.env**

| Variable       | Description           | Default                  |
| -------------- | --------------------- | ------------------------ |
| `VITE_API_URL` | Backend API base URL  | `http://localhost:5000`  |

## Features

- **Auth** — Register, login, JWT-based session
- **Upload** — Drag-and-drop artwork uploads with title & description
- **Feed** — Personalized feed from followed users
- **Explore** — Browse all artworks in a grid
- **Profiles** — View/edit profile, avatar, bio, follower/following counts
- **Reactions** — Like, comment, and bookmark artworks
- **Follow System** — Follow/unfollow other users
- **Lightbox** — Full-size image modal with comment thread
- **Admin Panel** — Manage uploads, reactions, and user roles
- **Dark Mode** — Dark-first UI with Tailwind

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes in the relevant directory (`backend/` or `frontend/`)
4. Test your changes:
   ```bash
   # Frontend lint
   cd frontend && npm run lint

   # Frontend build check
   cd frontend && npm run build

   # Backend — verify imports
   cd backend && source .venv/bin/activate && python3 -c "from app import app; print('OK')"
   ```
5. Commit with a descriptive message: `git commit -m "feat: add artwork filters"`
6. Push and open a Pull Request

### Contribution Guidelines

- Keep backend routes in their respective blueprint files under `backend/routes/`
- Frontend components go in `frontend/src/components/`
- Use the centralized `api()` helper from `frontend/src/api.js` for all backend requests
- Don't hardcode `localhost:5000` — use the `VITE_API_URL` env var via `api.js`
- Test uploads and auth flows manually using the built-in API tester at `http://localhost:5000`

## License

This project is for educational purposes.
