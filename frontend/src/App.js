//imp
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Container } from "react-bootstrap";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from './screens/ProductScreen'
import { HashRouter as Router, Route, Routes } from 'react-router-dom'
//imd

function App() {
  return (
    <Router>
      <Header />
      <main className="py-3">
        <Container>
          <Routes>
            <Route path='/' element={<HomeScreen />} exact />
            
          </Routes>
          <Routes>
            <Route path='/product/:id' element={<ProductScreen />} />
          </Routes>
          
        </Container>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
