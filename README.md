# Enterprise Resource & Room Reservation Control Plane

A full-stack resource scheduling platform featuring a RESTful Node.js/Express API, a 12-entity PostgreSQL relational schema, transactional bulk data ingestion, and a React administrative dashboard deployed on Debian Linux.

## Repository Structure

```text
resource-reservation-control-plane/
├── README.md
├── backend/       # Node.js / Express REST API, Sequelize models, and JWT auth middleware
└── frontend/      # React administrative web dashboard
```

## System Components

- **Backend Control Plane (`backend/`):** Node.js and Express REST API secured with JWT authentication middleware and role-based access control.
- **Relational Data Layer:** 12-table PostgreSQL schema modeled via Sequelize ORM with foreign-key constraints and conflict-prevention rules.
- **Admin Web Dashboard (`frontend/`):** React interface for space parameterization, user management, capacity allocation, and utilization analytics.
- **Bulk Ingestion Pipeline:** Concurrent Excel/CSV import handler using `Promise.all` wrapped in database transactions to guarantee atomic rollback on validation errors.

## Tech Stack

- **Backend:** Node.js, Express, Sequelize ORM, JWT
- **Frontend:** React, JavaScript, HTML5/CSS3
- **Database & Hosting:** PostgreSQL, Debian Linux

## Setup & Deployment

```bash
# 1. Start the Backend API
cd backend
cp .env.example .env
npm install
npx sequelize-cli db:migrate
npm start

# 2. Start the React Control Plane
cd ../frontend
npm install
npm start
```
