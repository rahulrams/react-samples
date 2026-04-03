import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import type { Customer } from "../models/Customer";

interface CustomersState {
    customers: Customer[];
    inProgress?: boolean;
    errMsg?: string;
}

const initialState: CustomersState = {
    "customers": []
};

const apiUrl = "http://localhost:9999/customers";

export const loadCustomers = createAsyncThunk<Customer[], void>(
    'CustomersSlice/loadCustomers',
    async () => {
        let data: Customer[] = [];
        try {
            data = (await axios.get(apiUrl)).data;
        } catch (err) {
            throw new Error(`Failed to fetch statements ${err}`);
        }
        return data;
    }
);

export const addCustomer = createAsyncThunk<Customer, Customer>(
    'CustomersSlice/addCustomer',
    async (customer) => {
        let data: Customer;
        try {
            data = (await axios.post(apiUrl, customer)).data;
        } catch (err) {
            throw new Error('Failed to save');
        }
        return data;
    }
);

export const updateCustomer = createAsyncThunk<Customer, Customer>(
    'CustomersSlice/updateCustomer',
    async (customer) => {
        let data: Customer;
        try {
            data = (await axios.put(`${apiUrl}/${customer.id}`, customer)).data;
        } catch (err) {
            throw new Error('Failed to save');
        }
        return data;
    }
);

export const deleteCustomer = createAsyncThunk<Number, Number>(
    'CustomersSlice/deleteCustomer',
    async (id) => {
        try {
            await axios.delete(`${apiUrl}/${id}`);
        } catch (err) {
            throw new Error('Failed to delete');
        }
        return id;
    }
);

const CustomersSlice = createSlice({
    name: "CustomersSlice",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(loadCustomers.pending, (state) => {
                state.inProgress = true;
                state.errMsg = undefined;
            })
            .addCase(loadCustomers.fulfilled, (state, action: PayloadAction<Customer[]>) => {
                state.inProgress = false;
                state.customers = action.payload;
            })
            .addCase(loadCustomers.rejected, (state, action) => {
                state.inProgress = false;
                state.errMsg = action.error.message || 'An error occurred';
            })
            .addCase(addCustomer.pending, (state) => {
                state.inProgress = true;
                state.errMsg = undefined;
            })
            .addCase(addCustomer.fulfilled, (state, action: PayloadAction<Customer>) => {
                state.inProgress = false;
                state.customers.push(action.payload);
            })
            .addCase(addCustomer.rejected, (state, action) => {
                state.inProgress = false;
                state.errMsg = action.error.message || 'An error occurred';
            })
            .addCase(updateCustomer.pending, (state) => {
                state.inProgress = true;
                state.errMsg = undefined;
            })
            .addCase(updateCustomer.fulfilled, (state, action: PayloadAction<Customer>) => {
                state.inProgress = false;
                let index = state.customers.findIndex(({ id }) => id === action.payload.id);
                if(index >= 0) {
                    state.customers[index] = action.payload;
                }
            })
            .addCase(updateCustomer.rejected, (state, action) => {
                state.inProgress = false;
                state.errMsg = action.error.message || 'An error occurred';
            })
            .addCase(deleteCustomer.pending, (state) => {
                state.inProgress = true;
                state.errMsg = undefined;
            })
            .addCase(deleteCustomer.fulfilled, (state, action: PayloadAction<Number>) => {
                state.inProgress = false;
                let index = state.customers.findIndex(({ id }) => id === action.payload);
                if(index >= 0) {
                    state.customers.splice(index, 1);
                }
            })
            .addCase(deleteCustomer.rejected, (state, action) => {
                state.inProgress = false;
                state.errMsg = action.error.message || 'An error occurred';
            });
    }
});

const CustomersReducer = CustomersSlice.reducer;

export default CustomersReducer;