import { AxiosClient } from "@/utils/axios";

class AuthService {
    static verifyToken = async (token: string) => {
        try {
            AxiosClient.interceptors.request.use(
                (config) => {
                    if (token) {
                        config.headers["x-bot-profile"] = token
                    }
                    return config
                },
                (error) => {
                    return Promise.reject(error)
                }
            )

            const { data } = await AxiosClient.get('/bot/auth', {
                headers: {
                    "x-bot-profile": token,
                },
            });
            return data;
        } catch (error) {
            throw new Error("Invalid token");
        }
    }
}

export default AuthService;