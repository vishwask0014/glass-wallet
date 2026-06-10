'use client';

import { FormEvent, useState, useTransition } from 'react';
import { Eye, EyeOff, LoaderCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Button from '@/app/Components/common/Button';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('salt@yopmail.com');
  const [password, setPassword] = useState('salt');
  const [showPassword, setShowPassword] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setFeedback(data.message || 'Something went wrong while signing in.');
        return;
      }

      setFeedback(data.message || 'Signed in successfully.');
      startTransition(() => {
        router.push('/dashboard');
      });
    } catch {
      setFeedback('Unable to connect right now. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
      <div>
        <label
          htmlFor="email"
          className="theme-text mb-2.5 block text-[0.96rem] font-semibold tracking-[-0.01em]"
        >
          Email
        </label>
        <input
          type="email"
          placeholder="Enter your email"
          id="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="theme-text mb-2.5 block text-[0.96rem] font-semibold tracking-[-0.01em]"
        >
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            id="password"
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

      <Button
        type="submit"
        className="w-full gap-2 py-3.5"
        disabled={isSubmitting || isPending}
      >
        {isSubmitting || isPending ? (
          <LoaderCircle size={16} className="animate-spin" />
        ) : null}
        {isSubmitting ? 'Signing in' : isPending ? 'Opening dashboard' : 'Sign in'}
      </Button>
    </form>
  );
}
