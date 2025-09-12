import { AxiosClient } from "@/utils/axios";

class AuthService {
    static verifyToken = async (token: string) => {
        // await AxiosClient.get('/auth/verify-token', {
        //     headers: {
        //         Authorization: `Bearer ${token}`,
        //     },
        // })
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, 1000);
        });
    }
}

export default AuthService;