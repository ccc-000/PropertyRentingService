import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Message from './components/message';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import './App.css';

function App () {
  return (
    <div>
    {/* <head>
      <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
    </head> */}
      <Message />
      <Routes>
        <Route index element={<Home />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='home/*' element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
