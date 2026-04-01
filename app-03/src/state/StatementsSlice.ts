import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Txn } from "../models/Txn";
import type { TxnsSummary } from "../models/TxnsSummary";

interface TxnsState {
    txns: Txn[];
    statement: TxnsSummary,
    nextID: number
}

const initialState: TxnsState = {
    "txns": [
        {
            "id": 1,
            "header": "Salary",
            "txnDate": "2026-01-01",
            "txnType": "CREDIT",
            "amount": 4000
        },
        {
            "id": 2,
            "header": "Rent",
            "txnDate": "2026-01-01",
            "txnType": "DEBIT",
            "amount": 6000
        },
        {
            "id": 3,
            "header": "Fuel",
            "txnDate": "2026-01-01",
            "txnType": "DEBIT",
            "amount": 1000
        },
        {
            "id": 5,
            "header": "Salary",
            "txnDate": "2026-02-12",
            "txnType": "CREDIT",
            "amount": 8000
        }
    ],
    "summary": {
        "totalCredit": 12000,
        "totalDebit": 7000,
        "balance": 5000,
    },
    "nextID": 6
};


const StatementsSlice = createSlice({
    name: "StatementsSlice",
    initialState,
    reducers: {
        addTxn: (state, action: PayloadAction<Txn>) => {
            action.payload.id = state.nextID;
            state.txns.push(action.payload);
            state.nextID++;
            if (action.payload.txnType === "CREDIT") {
                state.summary.totalCredit += action.payload.amount;
            }
            else if (action.payload.txnType === "DEBIT") {
                state.summary.totalDebit += action.payload.amount;
            }
            state.summary.balance = state.summary.totalCredit - state.summary.totalDebit;
        },
        updateTxn: (state, action: PayloadAction<Txn>) => {
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
        },
        deleteTxn: (state, action: PayloadAction<Number>) => {
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
        },
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
    }
});

const StatementsReducer = StatementsSlice.reducer;

export const { addTxn, updateTxn, deleteTxn, setEdit, cancelEdit } = StatementsSlice.actions;
export default StatementsReducer;