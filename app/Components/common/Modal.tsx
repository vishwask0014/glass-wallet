'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
import classNames from 'classnames';

interface ModalProps {
  onClose: () => void;
  title: string;
  kicker?: string;
  children: ReactNode;
  widthSize?: 'small' | 'medium' | 'large' | 'xlarge';
}

export default function Modal({ onClose, title, kicker, children, widthSize = 'medium' }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Lock body scroll while open
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      style={{
        background: 'rgba(0,0,0,0.46)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className={classNames('glass-card-strong w-full rounded-t-[2rem] p-6 sm:rounded-[2rem] sm:p-8 max-h-[90vh] overflow-y-auto', widthSize === 'small' && 'sm:max-w-[640px]', widthSize === 'medium' && 'sm:max-w-[768px]', widthSize === 'large' && 'sm:max-w-[1024px]', widthSize === 'xlarge' && 'sm:max-w-[1280px]')}>
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            {kicker && <span className="section-kicker">{kicker}</span>}
            <h2
              id="modal-title"
              className="theme-text mt-3 text-2xl font-semibold tracking-[-0.04em] sm:text-3xl"
            >
              {title}
            </h2>
          </div>
          <button
            type="button"
            aria-label="Close modal"
            onClick={onClose}
            className="icon-chip theme-icon-button ml-4 mt-1 shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* Slot for any content */}
        {children}
      </div>
    </div>
  );
}
