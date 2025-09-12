import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type initGlobalVars = {
    botUI: boolean
    auth: {
        isLoading: boolean,
        isAuthenticated: boolean,
    }
};

const initialState: initGlobalVars = {
    botUI: false,
    auth: {
        isLoading: true,
        isAuthenticated: false,
    }
};

export const Slice = createSlice({
    name: "GlobalVars",
    initialState,
    reducers: {
        setBotUI: (state, action: PayloadAction<initGlobalVars["botUI"]>) => {
            state.botUI = action.payload
        },
        setAuth: (state, action: PayloadAction<initGlobalVars["auth"]>) => {
            state.auth = action.payload
        }
    },
});

// Action creators are generated for each case reducer function
export const GlobalVarsActions = Slice.actions;

export default Slice.reducer;
