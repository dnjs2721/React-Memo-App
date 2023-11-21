import React from 'react';
import './App.css';
import Navigation from "./components/Navigation";
import NoteList from "./components/NoteList";

function App() {
  return (
    <div className="app">
        <Navigation></Navigation>
        <NoteList></NoteList>
    </div>
  );
}

export default App;
