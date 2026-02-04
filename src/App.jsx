import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AddExpense from './pages/AddExpense';
import Friends from './pages/Friends';

function App() {
  return (
    <Routes>
    
      <Route path="/" element={<Dashboard />} />
      
     
      <Route path="/add" element={<AddExpense />} />
      <Route path="/friends" element={<Friends />} />
    </Routes>
  );
}

export default App;