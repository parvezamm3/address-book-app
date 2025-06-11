# Address Book Application

A full-stack web application for managing addresses, built with a React frontend, Flask backend, and SQLite database.

## Features

- Add new addresses with detailed information (name, postcode, prefecture, city, street, apartment, phone, email)
- View all saved addresses in a table format on the homepage
- Delete existing addresses
- Persistent storage using SQLite

## Technologies Used

- **Frontend:** React.js, React Router
- **Backend:** Flask (Python), Flask-CORS
- **Database:** SQLite3
- **Package Managers:** npm (Node.js), pip (Python)

## Prerequisites

Ensure you have the following installed on your Windows machine:

- **Python 3.8+**: [Download from python.org](https://www.python.org/downloads/). (Check "Add Python to PATH" during installation)
- **Node.js & npm**: [Download LTS from nodejs.org](https://nodejs.org/). (npm is included)
- **(Recommended) Git**: [Download from git-scm.com](https://git-scm.com/)

## Setup and Running the Application

Follow these steps to run the application locally.

### 1. Clone the Repository

If using Git:

```sh
git clone https://github.com/parvezamm3/address-book-app.git
cd address-book-app
```

If you have local files, navigate to the `address-book-app` root directory.

### 2. Backend Setup (Flask & SQLite)

Navigate to the backend directory:

```sh
cd backend
```

#### a. Create and Activate a Python Virtual Environment

```sh
python -m venv venv
.\venv\Scripts\activate  # On Windows PowerShell/CMD
```

#### b. Install Python Dependencies

```sh
pip install -r requirements.txt
```

Ensure `requirements.txt` includes `Flask` and `Flask-CORS`.

#### c. Initialize the Database

```sh
flask --app app init-db
```

This creates `instance/addresses.db` and sets up the schema.

**Note:** If you change `backend/schema.sql`, re-initialize the database:

1. Stop the Flask server (`Ctrl+C`)
2. Delete `backend/instance/addresses.db`
3. Run `flask --app app init-db` again

Alternatively, use a SQLite GUI (e.g., "DB Browser for SQLite") to alter tables without losing data.

#### d. Start the Flask Backend Server

```sh
flask --app app run
```

The backend runs at [http://127.0.0.1:5000/](http://127.0.0.1:5000/).

### 3. Frontend Setup (React)

Open a new terminal and navigate to the frontend directory:

```sh
cd ..      # Go back to address-book-app root if needed
cd frontend
```

#### a. Install Node.js Dependencies

```sh
npm install
```

#### b. Start the React Development Server

```sh
npm start
```

The React app opens at [http://localhost:3000/](http://localhost:3000/).

## Using the Application

- **Homepage (`/`)**: Displays all saved addresses in a table.
- **Create New Address**: Click the button to go to the creation form (`/create`).
- **Create Address Page (`/create`)**: Fill out the form and submit. You’ll be redirected to the homepage, and the new address will appear.
- **Delete Button**: Each address row has a "Delete" button to remove it from the database.
