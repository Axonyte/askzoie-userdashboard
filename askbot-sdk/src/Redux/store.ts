import { configureStore } from "@reduxjs/toolkit";
import GlobalVars from "./slices/GlobalVars";
import MessageSlice from "./slices/MessageSlice";

export const makeStore = () => {
    return configureStore({
        reducer: {
            GlobalVars: GlobalVars,
            MessageSlice: MessageSlice,
        },
    });
};

// Infer the type of makeStore
// export type AppStore = ReturnType<typeof store>;
// Infer the `RootState` and `AppDispatch` types from the store itself

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
