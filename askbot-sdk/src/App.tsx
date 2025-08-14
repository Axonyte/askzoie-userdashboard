import SimpleBot from "./Bots/SimpleBot";
import QueryClientProviders from "./providers/QueryClientProviders";
import StoreProvider from "./Redux/StoreProvider";

const App = () => {
    return (
        <StoreProvider>
            <QueryClientProviders>
                <SimpleBot />
            </QueryClientProviders>
        </StoreProvider>
    );
};

export default App;
