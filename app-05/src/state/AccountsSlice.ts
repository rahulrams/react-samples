import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import type { Account } from "../models/Account";

interface AccountsState {
    accounts: Account[];
    editMode: boolean;
    selected?: Account;
}

const initialState: AccountsState = {
    accounts: [],
    editMode: false
};

const apiUrl = "http://localhost:9999/accounts";

export const loadAccounts = createAsyncThunk<Customer[], void>(
    'AccountsSlice/loadAccounts',
    async () => {
        let data: Accounts[] = [];
        try {
            data = (await axios.get(apiUrl)).data;
        } catch (err) {
            throw new Error(`Failed to fetch accounts ${err}`);
        }
        return data;
    }
);

export const addAccount = createAsyncThunk<Account, Account>(
    'AccountsSlice/addAccount',
    async (account) => {
        let data: Account;
        try {
            data = (await axios.post(apiUrl, account)).data;
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
            data = (await axios.put(`${apiUrl}/${account.id}`, account)).data;
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
            await axios.delete(`${apiUrl}/${id}`);
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
        setAdd: (state) => {
            state.selected = undefined;
            state.editMode = true;
        },
        setEdit: (state, action: PayloadAction<Account>) => {
            state.selected = action.payload;
            state.editMode = true;
        },
        cancelEdit: (state) => {
            state.editMode = false;
            state.selected = undefined;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadAccounts.pending, (state) => {
                state.inProgress = true;
                state.errMsg = undefined;
            })
            .addCase(loadAccounts.fulfilled, (state, action: PayloadAction<Account>) => {
                state.inProgress = false;
                //Load accounts
                state.accounts = action.payload;
            })
            .addCase(loadAccounts.rejected, (state, action) => {
                state.inProgress = false;
                state.errMsg = action.error.message || 'An error occurred';
            })
            .addCase(addAccount.pending, (state) => {
                state.inProgress = true;
                state.errMsg = undefined;
            })
            .addCase(addAccount.fulfilled, (state, action: PayloadAction<Account>) => {
                state.inProgress = false;
                //Add account
                state.accounts.push(action.payload);
            })
            .addCase(addAccount.rejected, (state, action) => {
                state.inProgress = false;
                state.errMsg = action.error.message || 'An error occurred';
            })
            .addCase(updateAccount.pending, (state) => {
                state.inProgress = true;
                state.errMsg = undefined;
            })
            .addCase(updateAccount.fulfilled, (state, action: PayloadAction<Account>) => {
                state.inProgress = false;
                //Update account
                const index = state.accounts.findIndex(({ id }) => id === action.payload.id);
                if (index > -1) {
                    state.accounts[index] = action.payload;
                }
            })
            .addCase(updateAccount.rejected, (state, action) => {
                state.inProgress = false;
                state.errMsg = action.error.message || 'An error occurred';
            })
            .addCase(deleteAccount.pending, (state) => {
                state.inProgress = true;
                state.errMsg = undefined;
            })
            .addCase(deleteAccount.fulfilled, (state, action: PayloadAction<Number>) => {
                state.inProgress = false;
                //Delete account
                const index = state.accounts.findIndex(({ id }) => id === action.payload);
                if (index > -1) {
                    state.accounts.splice(index, 1);
                }
            })
            .addCase(deleteAccount.rejected, (state, action) => {
                state.inProgress = false;
                state.errMsg = action.error.message || 'An error occurred';
            });
    }
});

const AccountsReducer = AccountsSlice.reducer;

export const { setAdd, setEdit, cancelEdit } = AccountsSlice.actions;
export default AccountsReducer;