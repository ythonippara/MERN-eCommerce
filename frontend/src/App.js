import React from 'react';
import { Container } from 'react-bootstrap'
// Exported as default, so no need for curly braces
import Header from './components/Header'
import Footer from './components/Footer'

const App = () => {
  return (
    <>
    <Header />
    <main className='py-3'>
      <Container>
        <h1>Welcome to ProShop</h1>
      </Container>
    </main>
    <Footer />
    </>
  );
}

export default App;
