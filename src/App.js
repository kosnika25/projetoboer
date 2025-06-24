import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './screens/Home';
import Login from './screens/Login';
import Contact from './screens/Contact';
import About from './screens/About';
import Register from './screens/Register';
import NavBar from './components/NavBar';
import Cadastroloja from './screens/Cadastro_loja';
import logo from './logo.webp';
import Painel from './screens/Painel.js';
import Brand from './screens/Brand.js';
import Product from './screens/Product';
import PublicLayout from './components/PublicLayout';
import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <NavBar />
        </header>
        <main className="App-main">
          <div className="container">
            <Routes>
              <Route element={<PublicLayout />} />
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
              <Route path="/cadastroloja" element={<Cadastroloja />}
              />

              <Route path="/painel" element={<Painel />}>
                <Route path="products" element={<Product />} />
                <Route path="brand" element={<Brand />} />
              </Route>

            </Routes>
            {/* Layout ADMIN (sem navbar, sem logo) */}

          </div>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;