import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
  Stories,
  Footer,
  WelcomePage,
  About,
  Testimonial,
  Learn,
} from "./container";
import { Navbar } from "./components";
import SequentialRenderer from "./container/Scroll/scroll";
import "./App.scss";
// Assuming your SCSS file is named globalStyles.scss

// Assuming your SCSS file is named globalStyles.scss

const Layout = () => {
  return (
    <>
      <Navbar />
      <WelcomePage />
      <Stories />
      <Learn />
      <About />
      <Testimonial />
      <Footer />
    </>
  );
};

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Layout />} />
          <Route path="/actions" element={<SequentialRenderer />} />
          {/* Add more routes as needed */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
