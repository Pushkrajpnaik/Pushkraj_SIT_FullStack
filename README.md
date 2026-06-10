# GraphInsight Processor

A professional, production-ready Full Stack application for hierarchical graph processing and visualization. Built for the SIT Full Stack Engineering Challenge.

## 🚀 Live Demo
- **Frontend**: [Vercel Deployment URL]
- **API**: [Render Deployment URL]

## 🛠 Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons
- **Backend**: Node.js, Express
- **Testing**: Jest, Supertest
- **Deployment**: Render (Backend), Vercel (Frontend)

## 📋 Features & Implementation
- **Robust Graph Engine**: Custom DFS/Kahn-based algorithm for cycle detection and tree construction.
- **Hierarchical Visualization**: Recursive tree rendering with depth calculation.
- **Strict Validation**: Edge format checking (`X->Y`), duplicate detection, and self-loop prevention.
- **Multi-Parent Handling**: Implements the "First Parent Wins" rule for diamond dependencies.
- **Comprehensive Summary**: Real-time stats on tree counts, cycles, and depth.

## ⚙️ API Specification
### `POST /api/graph`
**Request Body:**
```json
{
  "edges": ["A->B", "A->C", "B->D"]
}
```

**Response:**
```json
{
  "user_id": "pushkrajnaik_20051130",
  "email_id": "pushkraj.naik.btech2023@sitpune.edu.in",
  "enrollment_number": "23070122169",
  "hierarchies": [...],
  "invalid_entries": [...],
  "duplicate_edges": [...],
  "summary": { ... }
}
```

## 🏗 Setup & Installation
1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   ```

2. **Install Dependencies**:
   ```bash
   npm run install:all
   ```

3. **Run Backend (Dev)**:
   ```bash
   npm run dev:backend
   ```

4. **Run Frontend (Dev)**:
   ```bash
   npm run dev:frontend
   ```

5. **Run Tests**:
   ```bash
   npm test
   ```

## 🧪 Testing
The project includes unit tests for critical graph logic in `backend/tests/graph.test.js`. 
- Valid tree construction
- Cycle detection
- Invalid entry filtering
- Duplicate handling
- Multi-parent conflict resolution

## 👤 Identity
- **User ID**: pushkrajnaik_20051130
- **Email**: pushkraj.naik.btech2023@sitpune.edu.in
- **Enrollment**: 23070122169
