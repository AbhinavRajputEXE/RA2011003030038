import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import TrainList from './TrainList';
import TrainDetails from './TrainDetails';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<TrainList />} />
          <Route path="/train/:trainNumber" element={<TrainDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;