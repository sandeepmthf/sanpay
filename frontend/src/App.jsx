import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { SendMoney } from './pages/SendMoney';
import { NetworkGraph } from './pages/NetworkGraph';
import { TransactionStatus } from './pages/TransactionStatus';
import { History } from './pages/History';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-brand-500 selection:text-white">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/send" element={<SendMoney />} />
          <Route path="/network" element={<NetworkGraph />} />
          <Route path="/status/:id" element={<TransactionStatus />} />
          <Route path="/history" element={<History />} />
        </Routes>
        <Navbar />
      </div>
    </Router>
  );
}

export default App;
