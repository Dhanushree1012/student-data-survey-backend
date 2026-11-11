import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function AcceptInvitationPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { acceptInvitation, isLoading } = useAuth();
  const invitationId = searchParams.get('invitation_id');
  const started = useRef(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isLoading || started.current) return;
    if (!invitationId) {
      setError('The invitation link is missing its invitation reference.');
      return;
    }

    started.current = true;
    void acceptInvitation(invitationId)
      .then(() => navigate('/dashboard', { replace: true }))
      .catch((acceptError: unknown) => {
        console.error('Unable to accept the invitation.', acceptError);
        setError(acceptError instanceof Error ? acceptError.message : 'The invitation could not be accepted.');
      });
  }, [acceptInvitation, invitationId, isLoading, navigate]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <section className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-2xl font-bold text-slate-900">Accept your invitation</h1>
        {!error && <p role="status" className="mt-3 text-sm text-slate-600">Verifying your invitation and setting up your account…</p>}
        {error && (
          <div className="mt-4 space-y-3">
            <p role="alert" className="rounded-xl bg-rose-50 p-4 text-sm text-rose-800">{error}</p>
            <Link to="/login" className="inline-block text-sm font-medium text-cyan-700 underline">Return to sign in</Link>
          </div>
        )}
      </section>
    </main>
  );
}
