import { Box } from '@chakra-ui/react';
import { Routes, Route } from 'react-router-dom';

import AdminDashBoard from './pages/AdminDashBoard.jsx';
import Inventory from './pages/Inventory.jsx';
import Navbar from './components/ui/Navbar.jsx';

function App() {
  return (
    <Box minH={"100vh"}>
      <Navbar />
      <Routes>
        <Route path="/" element={<AdminDashBoard />} />
        <Route path="/Inventory" element={<Inventory />} />
      </Routes>
    </Box>
  );
}

export default App
