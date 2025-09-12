import { JwtPayload } from 'jwt-decode'

export interface JwtUserPayload extends JwtPayload {
    userId: string
    name: string
    email: string
    accountStatus: string
    exp: number
    iat: number
}
