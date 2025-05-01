import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Sharepost from "./components/Sharepost";

import Createpost from "./pages/Createpost";
import Updatepost from "./pages/Updatepost";





export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
      
       
        <Route path="/updatepost/:postId" element={<Updatepost/>} />
        <Route path="/create" element={<Createpost/>} />
        <Route path="/share/:ShareId" element={<Sharepost/>} />


 

       

       

       
         
        
       
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
