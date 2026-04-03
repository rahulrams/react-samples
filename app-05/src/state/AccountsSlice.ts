import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import type { Account } from "../models/Account";

interface AccountsState {
    accounts: Account[];
}

const initialState: AccountsState = {
    "accounts": []
};

const apiUrl = "http://localhost:9999/customers";

export const addAccount = createAsyncThunk<Account, Account>(
    'AccountsSlice/addAccount',
    async (account, customerID) => {
        let data: Account;
        try {
            data = (await axios.post(`${apiUrl}/${customerID}/accounts`, account)).data;
        } catch (err) {
            throw new Error('Failed to save');
        }
        return data;
    }
);

export const updateAccount = createAsyncThunk<Account, Account>(
    'AccountsSlice/updateAccount',
    async (account) => {
        let data: Account;
        try {
            data = (await axios.put(`${apiUrl}/${customerID}/accounts/${account.id}`, account)).data;
        } catch (err) {
            throw new Error('Failed to save');
        }
        return data;
    }
);

export const deleteAccount = createAsyncThunk<Number, Number>(
    'AccountsSlice/deleteAccount',
    async (id) => {
        try {
            await axios.delete(`${apiUrl}/${customerID}/accounts/${id}`);
        } catch (err) {
            throw new Error('Failed to delete');
        }
        return id;
    }
);

const AccountsSlice = createSlice({
    name: "AccountsSlice",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(addAccount.pending, (state) => {
                state.inProgress = true;
                state.errMsg = undefined;
            })
            .addCase(addAccount.fulfilled, (state, action: PayloadAction<Account[]>) => {
                state.inProgress = false;
                state.accounts = action.payload;
            })
            .addCase(addAccount.rejected, (state, action) => {
                state.inProgress = false;
                state.errMsg = action.error.message || 'An error occurred';
            });
    }
});

const AccountsReducer = AccountsSlice.reducer;

export default AccountsReducer;