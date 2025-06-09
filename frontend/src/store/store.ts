/* Core */
import {
    applyMiddleware,
    type Action,
    type ThunkAction,
} from "@reduxjs/toolkit";
import {legacy_createStore as createStore} from "redux";
import {
    useDispatch as useReduxDispatch,
    useSelector as useReduxSelector,
    type TypedUseSelectorHook,
} from "react-redux";
import {persistReducer, persistStore} from "redux-persist";
import createSagaMiddleware from "redux-saga";
import storage from 'redux-persist/lib/storage';
import rootSaga from "./rootSagas";
import rootReducer from "./rootReducer";
import {tokenMiddleware} from "@/store/tokenMiddleware";

const persistConfig = {
    key: "kltn.2025",
    storage: storage,
};

const sagaMiddleware = createSagaMiddleware();

const persistedReducer = persistReducer(persistConfig, rootReducer);
const reduxStore = createStore(
    persistedReducer,
    applyMiddleware(sagaMiddleware, tokenMiddleware)
);
const persistor = persistStore(reduxStore);

sagaMiddleware.run(rootSaga);

export {persistor, reduxStore};
/* Types */
export type ReduxStore = typeof reduxStore;
export type ReduxState = ReturnType<typeof reduxStore.getState>;
export type ReduxDispatch = typeof reduxStore.dispatch;
export type ReduxThunkAction<ReturnType = void> = ThunkAction<
    ReturnType,
    ReduxState,
    unknown,
    Action
>;

export const useDispatch = () => useReduxDispatch<ReduxDispatch>();
export const useSelector: TypedUseSelectorHook<ReduxState> = useReduxSelector;
