import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Role } from '../types';
import { AlertCircle, Zap } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('user');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password, role);
      if (success) {
        navigate(role === 'admin' ? '/admin' : '/dashboard');
      } else {
        setError(role === 'admin' 
          ? 'Invalid Admin Credentials. Please check your email and password.' 
          : 'Invalid login details. Password must be at least 6 characters.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-8">
      <Link to="/" className="mb-6">
        <div className="flex items-center">
          <span className="text-3xl font-bold tracking-tight text-black">Ravi<span className="text-[#febd69]">Mart</span></span>
          <span className="text-[#febd69] text-xs self-end mb-1">.in</span>
        </div>
      </Link>

      <div className="w-full max-w-[350px] border border-gray-300 rounded-lg p-6 shadow-sm">
        <h1 className="text-3xl font-normal mb-4">Sign in</h1>
        
        {error && (
          <div className="mb-4 p-3 border border-red-400 rounded bg-red-50 flex gap-3 items-start">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <h4 className="font-bold text-red-800">There was a problem</h4>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email or mobile phone number"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white"
          />
          <Input
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-white"
          />

          <div className="flex gap-4 mb-2">
             <label className="flex items-center text-sm gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="role" 
                  checked={role === 'user'} 
                  onChange={() => setRole('user')}
                  className="accent-[#febd69]"
                />
                Customer
             </label>
             <label className="flex items-center text-sm gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="role" 
                  checked={role === 'admin'} 
                  onChange={() => setRole('admin')}
                  className="accent-[#febd69]"
                />
                Admin
             </label>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-black border border-[#fcd200] shadow-sm font-normal"
            isLoading={isLoading}
          >
            Sign in
          </Button>
        </form>

        <p className="text-xs text-gray-600 mt-4">
          By continuing, you agree to RaviMart's <span className="text-blue-600 cursor-pointer hover:underline">Conditions of Use</span> and <span className="text-blue-600 cursor-pointer hover:underline">Privacy Notice</span>.
        </p>

        <div className="mt-6 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">New to RaviMart?</span>
          </div>
        </div>

        <Link to="/signup" className="mt-4 block">
          <Button variant="outline" className="w-full shadow-sm bg-gray-50 hover:bg-gray-100 border-gray-300 text-black font-normal">
            Create your RaviMart account
          </Button>
        </Link>
      </div>
      
      {role === 'admin' && (
         <div className="mt-8 p-4 bg-gray-100 rounded-lg text-xs text-gray-500 max-w-[350px]">
            <p className="font-bold mb-1">Demo Admin Credentials:</p>
            <p>Email: admin@ravimart.com</p>
            <p>Password: admin123</p>
         </div>
      )}
    </div>
  );
};
