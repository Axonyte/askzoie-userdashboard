import { JwtPayload } from 'jwt-decode'

type AuthStrategy = 'GOOGLE' | 'LOCAL'
export interface JwtUserPayload extends JwtPayload {
    userId: string
    name: string
    email: string
    accountStatus: string
    authStrategy: AuthStrategy[]
    exp: number
    iat: number
}
