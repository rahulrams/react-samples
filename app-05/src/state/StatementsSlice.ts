import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import type { Txn } from "../models/Txn";
import type { TxnsSummary } from "../models/TxnsSummary";

interface TxnsState {
    txns: Txn[];
    summary: TxnsSummary,
    inProgress?: boolean;
    errMsg?: string;
}

interface TxnPayLoadActionType {
    txn: Txn;
    summary: TxnsSummary;
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
const apiUrlAccounts = "http://localhost:9999/accounts";

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

export const addTxn = createAsyncThunk<TxnPayLoadActionType, Txn>(
    'StatementsSlice/addTxn',
    async (txn, { getState }) => {
        let data: Txn;

        let totalCredit = 0;
        let totalDebit = 0;
        let balance = 0;

        try {
            data = (await axios.post(apiUrl, txn)).data;
            
            const statementsSlice = getState().statementsSlice;
            totalCredit = statementsSlice.summary.totalCredit;
            totalDebit = statementsSlice.summary.totalDebit;

            if (data.txnType === "CREDIT") {
                totalCredit += data.amount;
            }
            else if (data.txnType === "DEBIT") {
                totalDebit += data.amount;
            }
            balance = totalCredit - totalDebit;
            await axios.patch(`${apiUrlAccounts}/${data.accountId}`, {balance: balance});

        } catch (err) {
            throw new Error('Failed to save');
        }
        return {
            txn: data, 
            summary: {
                totalCredit: totalCredit,
                totalDebit: totalDebit,
                balance: balance
            }
        };
    }
);

export const updateTxn = createAsyncThunk<TxnPayLoadActionType, Txn>(
    'StatementsSlice/updateTxn',
    async (txn, { dispatch, getState }) => {
        let data: Txn;

        let totalCredit = 0;
        let totalDebit = 0;
        let balance = 0;
        try {
            data = (await axios.put(`${apiUrl}/${txn.id}`, { ...txn, isEditable: undefined })).data;

            const statementsSlice = getState().statementsSlice;
            let txns = statementsSlice.txns;

            totalCredit = statementsSlice.summary.totalCredit;
            totalDebit = statementsSlice.summary.totalDebit;

            let index = txns.findIndex(({ id }) => id === data.id);
            if (index > -1) {
                //Remove the older values for credit/debit
                if (txns[index].txnType === "CREDIT") {
                    totalCredit -= txns[index].amount;
                }
                else if (txns[index].txnType === "DEBIT") {
                    totalDebit -= txns[index].amount;
                }

                //Add the new values for credit/debit
                if (data.txnType === "CREDIT") {
                    totalCredit += data.amount;
                }
                else if (data.txnType === "DEBIT") {
                    totalDebit += data.amount;
                }
                balance = totalCredit - totalDebit;
            }
            await axios.patch(`${apiUrlAccounts}/${data.accountId}`, {balance: balance});

        } catch (err) {
            throw new Error('Failed to save');
        }
        return {
            txn: data, 
            summary: {
                totalCredit: totalCredit,
                totalDebit: totalDebit,
                balance: balance
            }
        };
    }
);

export const deleteTxn = createAsyncThunk<TxnPayLoadActionType, Txn>(
    'StatementsSlice/deleteTxn',
    async (txn, { dispatch, getState }) => {
        let totalCredit = 0;
        let totalDebit = 0;
        let balance = 0;

        try {
            await axios.delete(apiUrl + "/" + txn.id);

            const statementsSlice = getState().statementsSlice;
            
            totalCredit = statementsSlice.summary.totalCredit;
            totalDebit = statementsSlice.summary.totalDebit;

            if (txn.txnType === "CREDIT") {
                totalCredit -= txn.amount;
            }
            else if (txn.txnType === "DEBIT") {
                totalDebit -= txn.amount;
            }
            balance = totalCredit - totalDebit;

            await axios.patch(`${apiUrlAccounts}/${txn.accountId}`, {balance: balance});

        } catch (err) {
            throw new Error('Failed to delete');
        }
        return{
            txn: txn, 
            summary: {
                totalCredit: totalCredit,
                totalDebit: totalDebit,
                balance: balance
            }
        };
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
            .addCase(addTxn.fulfilled, (state, action: PayloadAction<TxnPayLoadActionType>) => {
                state.inProgress = false;

                state.txns.push(action.payload.txn);
                state.summary = action.payload.summary;
            })
            .addCase(addTxn.rejected, (state, action) => {
                state.inProgress = false;
                state.errMsg = action.error.message || 'An error occurred';
            })
            .addCase(updateTxn.pending, (state) => {
                state.inProgress = true;
                state.errMsg = undefined;
            })
            .addCase(updateTxn.fulfilled, (state, action: PayloadAction<TxnPayLoadActionType>) => {
                state.inProgress = false;
                let index = state.txns.findIndex(({ id }) => id === action.payload.txn.id);
                if (index >= 0) {
                    //Updating the transaction record
                    state.txns[index] = action.payload.txn;
                    state.txns[index].isEditable = undefined;
                }
                state.summary = action.payload.summary;
            })
            .addCase(updateTxn.rejected, (state) => {
                state.inProgress = false;
                state.errMsg = action.error.message || 'An error occurred';
            })
            .addCase(deleteTxn.pending, (state) => {
                state.inProgress = true;
                state.errMsg = undefined;
            })
            .addCase(deleteTxn.fulfilled, (state, action: PayloadAction<TxnPayLoadActionType>) => {
                state.inProgress = false;

                let index = state.txns.findIndex(({ id }) => id === action.payload.txn.id);
                if (index >= 0) {
                    state.txns.splice(index, 1);
                }
                state.summary = action.payload.summary;
            })
            .addCase(deleteTxn.rejected, (state) => {
                state.inProgress = false;
                state.errMsg = action.error.message || 'An error occurred';
            });
    }
});

const StatementsReducer = StatementsSlice.reducer;

export const { setEdit, cancelEdit } = StatementsSlice.actions;
export default StatementsReducer;