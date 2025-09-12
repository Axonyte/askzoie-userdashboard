import AuthService from "@/services/AuthService";
import type { BotProfile } from "@/types/bot";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, type FC, type ReactNode } from "react";

type AuthContextType = {
    isAuthenticated: boolean | undefined;
    isLoading: boolean;
    token?: string;
    botInfo?: BotProfile;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type Props = {
    children: ReactNode;
    initialToken?: string;
};
export const AuthProvider: FC<Props> = ({ children, initialToken }) => {
    const { isLoading, data } = useQuery({
        queryKey: ["verify-token"],
        queryFn: async () => {
            if (!initialToken) return false;
            try {
                const data = await AuthService.verifyToken(initialToken);
                return data;
            } catch (error) {
                return false;
            }
        },
    });

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated: !!data,
                isLoading,
                token: initialToken,
                botInfo: data,
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
