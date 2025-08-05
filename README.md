# 🛠️ Coliha Admin Panel

An isolated frontend application built to help administrators manage users and verify subscription renewal receipts submitted by clients.

This panel interfaces with the Coliha backend API and is **not publicly accessible** — it's strictly for admin operations.

---

### 👥 User Management

- View all users (with basic details like name, email, status, role)
- **Edit** user information (e.g., name, role, email)
- **Delete** users (frontend calls backend `DELETE /api/users/:id`)

### 📄 Receipt Management

- View all client-submitted **subscription renewal receipts**
- **Accept** or **Refuse** each receipt 
- On action:
  - Receipt status updated
  - User subscription status updated via backend

---

### ✅ Test Receipt Approval

- 🧪 To test receipt approval, send a POST request to `https://coliha-server.onrender.com/admin/accept-receipt` with `{ "username": "desired_username" }` in the body — it will mark that user's receipt as accepted.









