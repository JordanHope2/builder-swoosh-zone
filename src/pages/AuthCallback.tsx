// src/pages/AuthCallback.tsx
import { useEffect, useState } from 'react';
import { supabaseClient } from '@/lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function AuthCallback() {
  const [msg, setMsg] = useState('Finalizing sign-in...');
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const { error } = await supabaseClient.auth.exchangeCodeForSession(window.location.href);
        if (error) throw error;
        setMsg('Signed in! Redirecting…');
        setTimeout(() => navigate('/jobs', { replace: true }), 500);
      } catch (e: any) {
        setMsg(`Sign-in error: ${e.message}`);
      }
    })();
  }, [navigate]);

  return <div className="p-6">{msg}</div>;
}
