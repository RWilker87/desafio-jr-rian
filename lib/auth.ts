import { getAuthCookie } from './cookies';
import { verifyToken, JWTPayload } from './jwt';

export async function getCurrentUser(): Promise<JWTPayload | null> {
    const token = await getAuthCookie();

    if (!token) {
        return null;
    }

    return verifyToken(token);
}
