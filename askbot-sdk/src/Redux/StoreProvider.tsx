import { Provider } from "react-redux";
import { type AppStore, makeStore } from "./store";
import { type ReactNode, useRef } from "react";

type StoreProviderType = { children: ReactNode };
const StoreProvider = ({ children }: StoreProviderType) => {
    const storeRef = useRef<AppStore>(null);
    if (!storeRef.current) storeRef.current = makeStore();
    return <Provider store={storeRef.current}>{children}</Provider>;
};

export default StoreProvider;
