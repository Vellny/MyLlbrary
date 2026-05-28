import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import api from '../api';

/**
 * Halaman ini menangkap token dari social auth callback.
 * Backend redirect ke: /auth/callback?token=xxx
 * Lalu kita ambil token → fetch user → login
 */
export default function AuthCallback() {
    const [searchParams] = useSearchParams();
    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get('token');
        const error = searchParams.get('error');

        if (error) {
            navigate('/login?error=' + error);
            return;
        }

        if (!token) {
            navigate('/login?error=no_token');
            return;
        }

        // Simpan token dulu agar interceptor bisa pakai
        localStorage.setItem('auth_token', token);

        // Ambil data user dengan token baru
        api.get('/api/user')
            .then((res) => {
                login(res.data, token);
            })
            .catch(() => {
                localStorage.removeItem('auth_token');
                navigate('/login?error=auth_failed');
            });
    }, []);

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            flexDirection: 'column',
            gap: '1rem',
            color: '#fff',
            background: 'linear-gradient(135deg, #1a1a2e, #16213e)'
        }}>
            <div style={{
                width: 48,
                height: 48,
                border: '4px solid #6c63ff',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite'
            }} />
            <p>Memproses login, harap tunggu...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
