import { legacy_createStore as createStore, combineReducers } from 'redux';
import { CollApsedReducer } from './reducers/CollapsedReducer';
import { LoadingReducer } from './reducers/LoadingReducer';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
const reducer = combineReducers({
    CollApsedReducer,
    LoadingReducer
});

const persistConfig = {
    key: 'root',
    storage,
};
const persistedReducer = persistReducer(persistConfig, reducer);
const store = createStore(persistedReducer);
let persistor = persistStore(store);
// const persistor = persistStore(store)
export {
    store, persistor
};