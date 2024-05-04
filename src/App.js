import "./App.css";
import Dashboard from "./Components/Dashboard";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
function App() {
  return (
    <>
      <Navbar expand="lg" bg="dark" variant="dark" className="custom-navbar">
        <Container>
          <Navbar.Brand href="#">Navbar</Navbar.Brand>
        </Container>
      </Navbar>
      <div className="App">
        <Dashboard />
      </div>
    </>
  );
}

export default App;
