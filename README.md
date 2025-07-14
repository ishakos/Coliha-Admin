# 🛠️ Coliha Admin Panel (Frontend)

An isolated frontend application built to help administrators manage users and verify subscription renewal receipts submitted by clients.

This panel interfaces with the Coliha backend API and is **not publicly accessible** — it's strictly for admin operations.

---

## 🌐 Tech Stack

- **Next.js** 
- **Tailwind CSS** for styling
- **Axios** for API requests
- **JWT**-based token management (via sessionStorage)
- **React Router / Next.js routing** for protected pages
- **React Context** for global state (auth, etc.)

---

### 👥 User Management

- View all users (with basic details like name, email, status, role)
- **Edit** user information (e.g., name, role, email)
- **Delete** users (frontend calls backend `DELETE /api/users/:id`)

### 📄 Receipt Management

- View all client-submitted **subscription renewal receipts**
- **Accept** or **Refuse** each receipt with buttons
- On action:
  - Receipt status updated
  - User subscription status updated via backend

---

## 📁 Project Structure

admin/
├── app/ (routing)
├── components/
│ └── Dashboard/
│ ├── Dashboard.js 
│ ├── Orders.js 
│ ├── ErrorPage.js 
│ ├── Header.js
│ ├── Login.js 
├── context/
│ └── AuthContext.js 
├── hooks/
│ └── useRedirect.js
├── styles/
│ ├── globals.css 
│ └── page.module.css
├── firebase.js 
├── next.config.mjs 
├── .eslintrc.json 
├── .gitignore
├── jsconfig.json
├── package.json
├── README.md

---

🚀 Getting Started
git clone https://github.com/yourusername/Coliha-Admin.git
cd Coliha-Admin
npm install
npm run dev

⚠️ **Don't forget to set up Firebase!**  
Make sure you configure your `firebase.js` file with your project credentials. Without it, authentication or related features will not work properly.




