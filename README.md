# Podego Dashboard

A full-stack dashboard built with a **Next.js** frontend and a **Python backend**.

---

## Project Structure

```
project-root/
├── backend/        # Python backend (API)
│   ├── requirements.txt
│   ├── .env.example
├── frontend/       # Next.js + ShadCN dashboard
│   ├── package.json
└── README.md       # Setup & usage guide

```

---

## Backend Setup

### Prerequisites

- Python 3.9+
- `pip`
- (Recommended) Virtual environment support

### Steps

1. Navigate to the backend directory:

```bash
cd backend
```

2. Create and activate a virtual environment:

**Linux/macOS:**

```bash
python3 -m venv venv
source venv/bin/activate
```

**Windows:**

```bash
python -m venv venv
venv\Scripts\activate
```

3. Install required packages:

```bash
pip install -r requirements.txt
```

4. Create a `.env` file based on the example:

```bash
cp .env.example .env # Mac/Linux

copy .env.example .env # Windows
```

5. Fill in your Firebase credentials in a `.env`.

6. Run the backend server:
   In backend/ (`cd backend`)

```bash
uvicorn main.main:app --reload
```

---

## Frontend Setup

### Prerequisites

- Node.js 18+
- npm or yarn

### Steps

1. Navigate to the frontend directory (if in backend):

```bash
cd ../frontend
# if in root:
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and go to [http://localhost:3000](http://localhost:3000)

---

## Production Build

To build the frontend for production (when in /frontend):

```bash
npm run build
```

To run the built version:

```bash
npm start
```

---

## Environment Variables

The backend uses environment variables stored in a `.env` file.

You can find the required variables in the `.env.example` file:

```env
FIREBASE_API_KEY=your_api_key_here
FIREBASE_USER_EMAIL=your_email_here
FIREBASE_USER_PASSWORD=your_password_here
```

Make sure `.env` is listed in your `.gitignore`.

---
