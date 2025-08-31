// src/pages/AuthCallback.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { supabaseClient } from '@/lib/supabaseClient';
import { errorMessage } from "app/client/lib/errors";

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
      } catch (e: unknown) {
        setMsg(`Sign-in error: ${errorMessage(e)}`);
      }
    })();
  }, [navigate]);

  return <div className="p-6">{msg}</div>;
}
