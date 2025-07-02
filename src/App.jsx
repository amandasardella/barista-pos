// import { useState } from 'react'
import './App.css'
import Orders from './components/Orders';  // Importa o componente corretamente


function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-800 p-4">
      <h1 className="text-3xl font-bold mb-6">Barista PoS</h1>
      <Orders />
    </div>
  )
}

export default App;
