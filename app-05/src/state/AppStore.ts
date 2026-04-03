import { configureStore } from "@reduxjs/toolkit";
import StatementsReducer from "./StatementsSlice";
import AccountsReducer from "./AccountsSlice";
import CustomersReducer from "./CustomersSlice";

export const appStore = configureStore({
    reducer : {
        customersSlice: CustomersReducer,
        accountsSlice: AccountsReducer,
        statementsSlice : StatementsReducer
    }
});

export type RootState = ReturnType<typeof appStore.getState>;
export type AppDispatch = typeof appStore.dispatch;