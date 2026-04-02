import { configureStore } from "@reduxjs/toolkit";
import StatementsReducer from "./StatementsSlice";

export const appStore = configureStore({
    reducer : {
        statementsSlice : StatementsReducer
    }
});

export type RootState = ReturnType<typeof appStore.getState>;
export type AppDispatch = typeof appStore.dispatch;