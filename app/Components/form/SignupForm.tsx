'use client';

import { FormEvent, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Button from '@/app/Components/common/Button';

type SignupFormProps = {
  onSuccess?: () => void;
};

export default function SignupForm({ onSuccess }: SignupFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const submitHandle = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setFeedback(data.message || 'Something went wrong while creating the account.');
        return;
      }

      setFeedback(data.message || 'Account created successfully.');
      setName('');
      setEmail('');
      setPassword('');
      onSuccess?.();
    } catch {
      setFeedback('Server error. Please try again in a moment.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={submitHandle} className="space-y-5 sm:space-y-6">
      <div>
        <label
          htmlFor="name"
          className="theme-text mb-2.5 block text-[0.96rem] font-semibold tracking-[-0.01em]"
        >
          Full name
        </label>
        <input
          type="text"
          placeholder="Enter your name"
          id="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </div>

      <div>
        <label
          htmlFor="signup-email"
          className="theme-text mb-2.5 block text-[0.96rem] font-semibold tracking-[-0.01em]"
        >
          Email
        </label>
        <input
          type="email"
          placeholder="Enter your email"
          id="signup-email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>

      <div>
        <label
          htmlFor="signup-password"
          className="theme-text mb-2.5 block text-[0.96rem] font-semibold tracking-[-0.01em]"
        >
          Password
        </label>

        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Create a password"
            id="signup-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="pr-12"
          />

          <button
            type="button"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="theme-icon-button absolute inset-y-0 right-0 flex items-center px-4"
            onClick={() => setShowPassword((value) => !value)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {feedback ? (
        <div className="theme-surface-medium theme-text-muted rounded-[1.25rem] px-4 py-3 text-[0.95rem] leading-6">
          {feedback}
        </div>
      ) : null}

      <Button type="submit" className="w-full py-3.5" disabled={isLoading}>
        {isLoading ? 'Creating account' : 'Create account'}
      </Button>
    </form>
  );
}
