import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import CustomersList from './components/CustomersList';
import Statement from './components/transactions/Statement';

const App = () => (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CustomersList />} />
        <Route path="/txns/:accountId" element={<Statement />} />
      </Routes>
    </BrowserRouter>
);

export default App;
