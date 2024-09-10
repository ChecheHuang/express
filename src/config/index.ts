import { loadEnv } from '../utils/loadEnv'

loadEnv()
export const TOKEN_EXPIRE_TIME = 24 * 60 * 60
export const REFRESH_TOKEN_EXPIRE_TIME = 7 * 24 * 60 * 60
export const TOKEN_SECRET = process.env.TOKEN_SECRET || 'TOKEN_SECRET'
export const PORT = process.env.PORT || 8080
