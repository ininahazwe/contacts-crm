import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Shield, Mail, Lock, AlertCircle } from 'lucide-react';
import { LoadingSpinner } from '../components/ui/Loading';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-peach/20 to-lime/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo et titre */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-dark rounded-3xl mb-4 shadow-card">
            <Shield className="w-10 h-10 text-primary-400" />
          </div>
          <h1 className="text-3xl font-bold text-dark mb-2">CRM Journalistique</h1>
          <p className="text-neutral-600">Gestion sécurisée de vos contacts</p>
        </div>

        {/* Carte de connexion */}
        <div className="card">
          <h2 className="text-2xl font-bold text-dark mb-6">Connexion</h2>

          {error && (
            <div className="mb-4 p-4 bg-secondary-50 border-2 border-secondary-200 rounded-2xl flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-secondary-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-secondary-700 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="input-group">
              <label htmlFor="email" className="label">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  style={{ paddingLeft: '3rem' }}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="password" className="label">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ paddingLeft: '3rem' }}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary w-full"
              style={{ 
                marginTop: '1rem',
                padding: '1rem 1.5rem',
                fontSize: '1rem',
                fontWeight: '700'
              }}
              disabled={loading}
            >
              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <LoadingSpinner size="sm" />
                  <span>Connexion...</span>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <Shield className="w-5 h-5" />
                  <span>Se connecter</span>
                </div>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-neutral-500 mt-6">
          Système sécurisé avec chiffrement de bout en bout
        </p>
      </div>
    </div>
  );
};