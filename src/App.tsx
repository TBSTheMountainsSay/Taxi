import React from 'react';
import 'src/css/reset.scss';
import 'src/css/global.scss';
import './App.css';
import Application from './features/Application/Application';
import { YMaps } from '@pbe/react-yandex-maps';

function App() {
  return (
    <div className="App">
      <YMaps
        query={{
          load: 'package.full',
          apikey: '05f8d2ae-bd94-4329-b9f9-7351e2ec9627',
        }}
      >
        <Application />
      </YMaps>
    </div>
  );
}

export default App;
