
import './App.css';
import { PersistGate } from 'redux-persist/integration/react';
import React,{ useEffect } from 'react';
import { store, persistor } from './redux/store';
import IndexRouter from './router/IndexRouter';
import { Provider } from 'react-redux';
import { useState } from 'react';

function App() {


    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <IndexRouter></IndexRouter>
            </PersistGate>
        </Provider>
        // <div className='aa'>
        //     <div className='bb'></div>
        // </div>
    );
}

export default App;
