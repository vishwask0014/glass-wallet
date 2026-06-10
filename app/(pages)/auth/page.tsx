'use client';

import { useState } from 'react';
import { LockKeyhole, Sparkles, Wallet } from 'lucide-react';
import LoginForm from '@/app/Components/form/LoginForm';
import SignupForm from '@/app/Components/form/SignupForm';
import classNames from 'classnames';

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

  return (
    <div className="page-shell py-6 sm:py-10">
      <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="glass-card-strong rounded-[2rem] p-6 sm:p-8 lg:p-10">
          <span className="section-kicker">
            <Sparkles size={14} />
            Secure AI money onboarding
          </span>

          <h1 className="theme-text mt-6 text-4xl font-semibold tracking-[-0.06em] sm:text-5xl">
            Connect your account and let AI start learning your spending habits.
          </h1>
          <p className="theme-text-muted mt-4 max-w-xl text-base leading-8">
            Your account is the starting point for habit learning, weekly and
            monthly plan building, and smarter savings or stock suggestions
            based on real behavior.
          </p>

          <div className="mt-8 grid gap-4">
            <div className="glass-card rounded-[1.6rem] p-5">
              <div className="flex items-start gap-4">
                <div className="icon-chip theme-text">
                  <LockKeyhole size={18} />
                </div>
                <div>
                  <p className="theme-text font-semibold">Private habit learning</p>
                  <p className="theme-text-muted mt-1 text-sm leading-7">
                    Your financial behavior is analyzed to build better plans,
                    while access and session handling stay protected.
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-[1.6rem] p-5">
              <div className="flex items-start gap-4">
                <div className="icon-chip theme-text">
                  <Wallet size={18} />
                </div>
                <div>
                  <p className="theme-text font-semibold">Fast path to planning</p>
                  <p className="theme-text-muted mt-1 text-sm leading-7">
                    New and returning users both land in the same AI workspace
                    for spending insights, budget planning, and suggestions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <div className="glass-card rounded-[2rem] p-4 sm:p-5">
          <div className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="theme-text-soft text-sm font-medium">
                  Account access
                </p>
                <h2 className="theme-text mt-1 text-3xl font-semibold tracking-[-0.05em]">
                  Enter your AI planner
                </h2>
              </div>

              <div className="theme-surface flex gap-2 rounded-full p-1.5">
                {[
                  { id: 'login', label: 'Sign in' },
                  { id: 'signup', label: 'Create account' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as 'login' | 'signup')}
                    className={classNames(
                      'rounded-full px-4 py-2 text-sm font-semibold',
                      activeTab === tab.id
                        ? 'theme-button-primary'
                        : 'theme-text-muted hover:opacity-95',
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="theme-surface mt-6 rounded-[1.7rem] p-5 sm:p-6">
              {activeTab === 'signup' ? <SignupForm /> : <LoginForm />}
            </div>

            <p className="theme-text-soft mt-5 text-sm leading-7">
              By continuing, you agree to the service terms and allow the app
              to learn from your spending history to create better plans and suggestions.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
