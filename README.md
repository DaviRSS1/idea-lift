# 💡 IdeaLift

**IdeaLift** is a full-stack web application built for **study purposes**, developed to practice modern Next.js App Router architecture and full-stack development patterns.

This application allows companies to **manage projects**, **collect suggestions from team members**, and **organize their workforce** — all in one collaborative platform.

---

## 🌐 Live Demo

👉 https://idea-lift.vercel.app/

---

## 🚀 Features

### 📁 Project Management

- Create, edit and delete projects
- Upload project icons to Supabase Storage
- Set project visibility (public / private)
- Track project status (active, completed, archived, etc.)
- Project progress indicator

### 💡 Suggestions System

- Team members can submit suggestions on any project
- Upvote and downvote suggestions
- Score calculated in real time
- Suggestions sorted by most voted

### 🏢 Company Management

- Create your own company or request to join an existing one
- Owner can edit company info (name, domain, description, website, location)
- Manage team members and their roles
- Approve or reject join requests
- Role-based access control (owner / manager / employee)

### 👥 Members & Roles

- Three role levels: **Owner**, **Manager**, **Employee**
- Role-based permissions across the platform
- Add members directly by email
- Change member roles or remove them from the company

### 🔔 Notifications

- Real-time notifications for:
  - New suggestions on your projects
  - Join requests to your company (owner/manager)
  - New projects created in your company
  - Being added to a project
  - Join request approved
- Unread badge counter
- Dropdown notification panel in the header

### 🔍 Search

- Real-time project search with dropdown results
- Dedicated search results page
- Debounced input for performance

### 👤 Account

- Update profile name and photo
- Avatar upload to Supabase Storage
- Delete account with cascade cleanup

### 🔐 Authentication

- Google OAuth via NextAuth
- Protected routes
- Session-based access control
- Auto user creation on first sign-in

---

## 🧠 Concepts Practiced

This project was built to reinforce modern full-stack React and Next.js architecture:

- Next.js App Router (server and client components)
- Server Actions for mutations
- Parallel data fetching with `Promise.all`
- Role-based access control across server and client
- Supabase integration (Database + Auth + Storage)
- API Routes for client-side data fetching
- Optimistic UI updates
- Debounced search input
- Notification system with real-time badge
- Component separation (server wrapper + client interactivity)
- TypeScript throughout

---

## 🛠️ Built With

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (Database + Storage)
- NextAuth v5 (Google OAuth)
- React Hot Toast
- Lucide React / React Icons
- Vercel (Deployment)

---

## 🗄️ Database Structure

The backend is powered by **Supabase** with the following main tables:

- `users` — platform users
- `companies` — company profiles
- `company_members` — user-company relationships with roles
- `company_requests` — pending join requests
- `projects` — project records
- `project_members` — user-project relationships
- `projects_features` — project feature tags
- `suggestions` — suggestions submitted per project
- `suggestion_votes` — individual votes per suggestion
- `notifications` — in-app notification system

---

## 🎯 Purpose of the Project

This application was developed for **advanced Next.js and full-stack practice**, focusing on building a real-world, production-style collaborative platform.

The goal was to simulate a SaaS-level architecture while strengthening knowledge in:

- Server vs client component boundaries
- Full-stack data flow with Server Actions
- Permission systems without a dedicated auth library
- Scalable Supabase schema design
- Production deployment with Vercel

---

## 👤 Author

Developed by **Davi Reghim**

🔗 LinkedIn:
https://www.linkedin.com/in/davi-reghim-13b995272/

💻 GitHub:
https://github.com/DaviRSS1
