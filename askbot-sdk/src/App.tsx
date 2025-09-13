import type { FC } from "react";
import SimpleBot from "./Bots/SimpleBot";
import { AuthProvider } from "./providers/AuthProvider";
import QueryClientProviders from "./providers/QueryClientProviders";
import StoreProvider from "./Redux/StoreProvider";

type Props = {
    token?: string;
    botType: "SIMPLE_BOT";
};
const App: FC<Props> = ({ token, botType }) => {
    return (
        <StoreProvider>
            <QueryClientProviders>
                <AuthProvider initialToken={token}>
                    <SimpleBot />
                </AuthProvider>
            </QueryClientProviders>
        </StoreProvider>
    );
};

export default App;
