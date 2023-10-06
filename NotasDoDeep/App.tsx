import React from 'react';
import {store} from './src/state/store/store';
import {Provider} from 'react-redux';
import AppNavigation from './src/navigation/AppNavigation';

function App() {
  return (
    <Provider store={store}>
      <AppNavigation />
    </Provider>
  );
}

export default App;
