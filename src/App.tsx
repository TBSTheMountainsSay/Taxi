import React from 'react';
import 'src/css/reset.scss';
import 'src/css/global.scss';
import './App.css';
import Application from './features/Application/Application';
import { YMaps } from '@pbe/react-yandex-maps';
import { SnackbarProvider } from 'notistack';

function App() {
  return (
    <div className="App">
      <SnackbarProvider>
        <YMaps
          query={{
            load: 'package.full',
            apikey: process.env.REACT_APP_TOKEN,
          }}
        >
          <Application />
        </YMaps>
      </SnackbarProvider>
    </div>
  );
}

export default App;
