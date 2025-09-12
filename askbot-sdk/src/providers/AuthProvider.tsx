import AuthService from "@/services/AuthService";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, type FC, type ReactNode } from "react";

type AuthContextType = {
    isAuthenticated: boolean | undefined;
    isLoading: boolean;
    token?: string;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type Props = {
    children: ReactNode;
    initialToken?: string;
};
export const AuthProvider: FC<Props> = ({ children, initialToken }) => {
    const { isLoading, data: isAuthenticated } = useQuery({
        queryKey: ["verify-token"],
        queryFn: async () => {
            if (!initialToken) return false;
            try {
                await AuthService.verifyToken(initialToken);
                return true;
            } catch (error) {
                return false;
            }
        },
    });
    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                isLoading,
                token: initialToken,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
