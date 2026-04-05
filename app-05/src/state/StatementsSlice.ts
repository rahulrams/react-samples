import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import type { Txn } from "../models/Txn";
import type { TxnsSummary } from "../models/TxnsSummary";

interface TxnsState {
    txns: Txn[];
    statement: TxnsSummary,
    inProgress?: boolean;
    errMsg?: string;
}

const initialState: TxnsState = {
    "txns": [],
    "summary": {
        "totalCredit": 0,
        "totalDebit": 0,
        "balance": 0,
    }
};

const apiUrl = "http://localhost:9999/txns";

export const loadTxns = createAsyncThunk<Txn[], void>(
    'StatementsSlice/loadTxns',
    async (accountId) => {
        let data: Txn[] = [];
        try {
            data = (await axios.get(`${apiUrl}?accountId=${accountId}`)).data;
        } catch (err) {
            throw new Error(`Failed to fetch statements ${err}`);
        }
        return data;
    }
);

export const addTxn = createAsyncThunk<Txn, Txn>(
    'StatementsSlice/addTxn',
    async (txn) => {
        let data: Txn;
        try {
            data = (await axios.post(apiUrl, txn)).data;
        } catch (err) {
            throw new Error('Failed to save');
        }
        return data;
    }
);

export const updateTxn = createAsyncThunk<Txn, Txn>(
    'StatementsSlice/updateTxn',
    async (txn) => {
        let data: Txn;
        try {
            data = (await axios.put(apiUrl + "/" + txn.id, { ...txn, isEditable: undefined })).data;
        } catch (err) {
            throw new Error('Failed to save');
        }
        return data;
    }
);

export const deleteTxn = createAsyncThunk<Number, Number>(
    'StatementsSlice/deleteTxn',
    async (id) => {
        try {
            await axios.delete(apiUrl + "/" + id);
        } catch (err) {
            throw new Error('Failed to delete');
        }
        return id;
    }
);

const StatementsSlice = createSlice({
    name: "StatementsSlice",
    initialState,
    reducers: {
        setEdit: (state, action: PayloadAction<Number>) => {
            let index = state.txns.findIndex(({ id }) => id === action.payload);
            if (index > -1) {
                state.txns[index].isEditable = true;
            }
        },
        cancelEdit: (state, action: PayloadAction<Number>) => {
            let index = state.txns.findIndex(({ id }) => id === action.payload);
            if (index > -1) {
                state.txns[index].isEditable = undefined;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadTxns.pending, (state) => {
                state.inProgress = true;
                state.errMsg = undefined;
            })
            .addCase(loadTxns.fulfilled, (state, action: PayloadAction<Txn[]>) => {
                state.inProgress = false;
                state.txns = action.payload;

                if (action.payload && action.payload.length > 0) {
                    const sumUp = (txns: Txn[], target: string) =>
                    txns
                        .filter((t) => t.txnType === target)
                        .map((t) => t.amount)
                        .reduce((num, sum) => sum + num, 0);

                    const tc = sumUp(action.payload, 'CREDIT');
                    const td = sumUp(action.payload, 'DEBIT');
                    state.summary = { totalCredit: tc, totalDebit: td, balance: tc - td };
                }
                else {
                    state.summary = { totalCredit: 0, totalDebit: 0, balance: 0 };
                }
            })
            .addCase(loadTxns.rejected, (state, action) => {
                state.inProgress = false;
                state.errMsg = action.error.message || 'An error occurred';
            })
            .addCase(addTxn.pending, (state) => {
                state.inProgress = true;
                state.errMsg = undefined;
            })
            .addCase(addTxn.fulfilled, (state, action: PayloadAction<Txn>) => {
                state.inProgress = false;
                
                state.txns.push(action.payload);
                if (action.payload.txnType === "CREDIT") {
                    state.summary.totalCredit += action.payload.amount;
                }
                else if (action.payload.txnType === "DEBIT") {
                    state.summary.totalDebit += action.payload.amount;
                }
                state.summary.balance = state.summary.totalCredit - state.summary.totalDebit;
            })
            .addCase(addTxn.rejected, (state, action) => {
                state.inProgress = false;
                state.errMsg = action.error.message || 'An error occurred';
            })
            .addCase(updateTxn.pending, (state) => {
                state.inProgress = true;
                state.errMsg = undefined;
            })
            .addCase(updateTxn.fulfilled, (state, action: PayloadAction<Txn>) => {
                state.inProgress = false;
                let index = state.txns.findIndex(({ id }) => id === action.payload.id);
                if (index > -1) {
                    //Remove the older values for credit/debit
                    if (state.txns[index].txnType === "CREDIT") {
                        state.summary.totalCredit -= state.txns[index].amount;
                    }
                    else if (state.txns[index].txnType === "DEBIT") {
                        state.summary.totalDebit -= state.txns[index].amount;
                    }

                    //Updating the transaction record
                    state.txns[index] = action.payload;
                    state.txns[index].isEditable = undefined;

                    //Add the new values for credit/debit
                    if (action.payload.txnType === "CREDIT") {
                        state.summary.totalCredit += action.payload.amount;
                    }
                    else if (action.payload.txnType === "DEBIT") {
                        state.summary.totalDebit += action.payload.amount;
                    }
                    state.summary.balance = state.summary.totalCredit - state.summary.totalDebit;
                }
            })
            .addCase(updateTxn.rejected, (state, action) => {
                state.inProgress = false;
                state.errMsg = action.error.message || 'An error occurred';
            })
            .addCase(deleteTxn.pending, (state) => {
                state.inProgress = true;
                state.errMsg = undefined;
            })
            .addCase(deleteTxn.fulfilled, (state, action: PayloadAction<Number>) => {
                state.inProgress = false;
                
                let index = state.txns.findIndex(({ id }) => id === action.payload);
                if (index > -1) {
                    if (state.txns[index].txnType === "CREDIT") {
                        state.summary.totalCredit -= state.txns[index].amount;
                    }
                    else if (state.txns[index].txnType === "DEBIT") {
                        state.summary.totalDebit -= state.txns[index].amount;
                    }
                    state.summary.balance = state.summary.totalCredit - state.summary.totalDebit;

                    state.txns.splice(index, 1);
                }
            })
            .addCase(deleteTxn.rejected, (state, action) => {
                state.inProgress = false;
                state.errMsg = action.error.message || 'An error occurred';
            });
    }
});

const StatementsReducer = StatementsSlice.reducer;

export const { setEdit, cancelEdit } = StatementsSlice.actions;
export default StatementsReducer;