import Router from "./router/Router";
import { BrowserRouter } from "react-router-dom";
import './App.css'
import 'toastr/build/toastr.min.css';

function App() {

  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  )
}

export default App
