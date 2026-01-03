import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { AlertCircle } from 'lucide-react';

export const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    try {
      const success = await signup(name, email, password, phone);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('An account with this email already exists.');
      }
    } catch (err) {
      setError('Failed to create account. Please try again.');
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
        <h1 className="text-3xl font-normal mb-4">Create Account</h1>
        
        {error && (
          <div className="mb-4 p-3 border border-red-400 rounded bg-red-50 flex gap-3 items-start">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Your name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="First and last name"
            className="bg-white"
          />
          <Input
            label="Mobile number"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Mobile number"
            className="bg-white"
          />
          <Input
            label="Email"
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
            placeholder="At least 6 characters"
            className="bg-white"
          />
          <p className="text-xs text-gray-500">Passwords must be at least 6 characters.</p>

          <Button 
            type="submit" 
            className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-black border border-[#fcd200] shadow-sm font-normal"
            isLoading={isLoading}
          >
            Continue
          </Button>
        </form>

        <div className="mt-6 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Already have an account?</span>
          </div>
        </div>

        <Link to="/login" className="mt-4 block">
          <Button variant="outline" className="w-full shadow-sm bg-gray-50 hover:bg-gray-100 border-gray-300 text-black font-normal">
            Sign in
          </Button>
        </Link>
      </div>
    </div>
  );
};
