# ☕ Coffee Order Tracker

## Description

**Coffee Order Tracker** is a full-stack POS (Point of Sale) application designed to modernize and streamline the coffee order system in the workplace.
Inspired by my real experience as a **Barista Supervisor**, this project replaces manual order tracking with a digital solution to improve **speed**, **accuracy**, and **inventory management**.
The system allows baristas to **register**, **view**, and **analyze** beverage orders efficiently — saving time and enhancing workflow accuracy.
This project demonstrates practical experience in **designing**, **developing**, and **deploying** real-world software using modern web technologies.

---

## 🧩 Built With

### Frontend

- **React**
- **JavaScript**
- **TailwindCSS**: for responsive design
- **Axios**: for REST API requests

### Backend

- **Node.js** + **Express**: for building the RESTful API
- **MongoDB Atlas**: for cloud-based data storage

---

## ⚙️ Installation & Setup

Follow these steps to set up and run **Coffee Order Tracker** locally:

- ### 1 Clone the repository

```bash
git clone https://github.com/your-github/barista-pos.git
cd barista-pos
```

- ### 2 Install dependencies

Install the required packages for both backend and frontend:

**Backend**

```bash
cd server
npm install
```

**Frontend**

```bash
cd ../
npm install
```

---

- ### 3 Configure environment variables

Create a `.env` file inside the **server** directory with the following content:

```bash
MONGODB_URI=your_mongodb_connection_string
PORT=3001
```

💡 You can get your MongoDB URI from [MongoDB Atlas](https://www.mongodb.com/products/platform#document).

---

- ### 4 Start the backend server

```bash
cd server
node index.cjs
```

You should see:

```
✅ Connected to MongoDB
🚀 Server running on http://localhost:3001
```

---

- ### 5 Run the frontend

```bash
npm run dev
```

The app will be available at:

```
http://localhost:5173
```

## Test the Application

- Register a new coffee or tea order using the form
- Repeat or delete the last order to test CRUD functionality
- View total orders by date in the **“Total Orders”** tab
- Export order data to Excel to verify reporting

## Project Goals

- Build a **functional POS system** for real-world use
- Practice **full-stack development** using MERN technologies
- Demonstrate **problem-solving** applied to workflow automation
- Provide a **responsive and intuitive UI** for baristas

## License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

## Contact

**Amanda Sardella**  
Full-Stack Developer | Toronto, Canada  
🔗 [LinkedIn](https://linkedin.com/in/your-linkedin)  
💻 [GitHub](https://github.com/your-github)
