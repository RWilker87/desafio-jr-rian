import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface JWTPayload {
    userId: string;
    email: string;
}

export function signToken(payload: JWTPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): JWTPayload | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
        console.log('[JWT] Token verificado com sucesso:', decoded.email);
        return decoded;
    } catch (error) {
        console.error('[JWT] Erro ao verificar token:', error instanceof Error ? error.message : error);
        return null;
    }
}
