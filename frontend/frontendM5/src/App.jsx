import React from "react";
import SearchForm from "./components/SearchForm";
import "./App.css";
import tradeMeLogo from "./assets/trademe-logo-no-tagline.png";

const App = () => {
  return (
    <div className="App">
      <header className="header">
        <div className="header-content">
          <img src={tradeMeLogo} alt="Trade Me" className="logo" />
          <nav className="nav-links">
            <a href="#" className="nav-link">Watchlist</a>
            <a href="#" className="nav-link">Favourites</a>
            <a href="#" className="nav-link">Start a listing</a>
            <a href="#" className="nav-link">My Trade Me</a>
          </nav>
        </div>
      </header>
      <SearchForm />
    </div>
  );
};

export default App;
