# Title

**Coffee Order Tracker**

## Description

This POS (Point of Sale) is a full-stack application designed to modernize and streamline the coffee order system in the workplace. Inspired by my real experience as a Barista Supervisor, this project replaces manual order tracking with a digital solution to improve speed, accuracy, and inventory management.
The **Coffee Order Tracker** allows baristas to register, view, and analyze beverage orders efficiently — saving time and enhancing workflow accuracy. This project demonstrates practical experience in designing, developing, and deploying real-world software using modern web technologies.

## Build with

## Installation & Setup

Follow these steps to set up and run the Coffee Order Tracker locally:

### Clone the repository

```
git clone https://github.com/your-github/barista-pos.git
cd barista-pos
```

### Install dependencies

Install the required packages for both backend and frontend:

Backend

```
cd server
npm install
```

Front end

```
cd ../
npm install
```

### Configure environment variables

Create a .env file inside the server directory with the following content:

```
MONGODB_URI=your_mongodb_connection_string
```

- You can get your MongoDB URI from [MongoDB Atlas](https://www.mongodb.com/products/platform#document)

### Start the back end server

```
cd server
node index.cjs
```

### Run the frontend

```
npm run dev
```

## Test the application

- Register a new coffee or tea order using the form

- Repeat or delete the last order to test CRUD features

- Check total orders by date in the “Total Orders” tab

- Export data to Excel to verify reporting
