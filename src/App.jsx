// import { useState } from 'react'
import './App.css'
import Orders from './components/Orders';


function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-screen-lg mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">Barista PoS</h2>
        <Orders />
      </div>
    </div>
  );
}

export default App;
