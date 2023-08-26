import React from 'react';
import 'src/css/reset.scss';
import 'src/css/global.scss';
import './App.css';
import Application from './features/Application/Application';
import { YMaps } from '@pbe/react-yandex-maps';

function App() {
  return (
    <div className="App">
      <YMaps>
        <Application />
      </YMaps>
    </div>
  );
}

export default App;
