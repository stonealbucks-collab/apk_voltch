import React from 'react';
import { VOLTECH_LOGO_URL } from '../data/initialData';

interface HeaderProps {
  currentSectionTitle: string;
  activeFolio?: string;
  isHvSafe?: boolean;
  onBack?: () => void;
  showBack?: boolean;
  onOpenSearch?: () => void;
  onOpenNotifications?: () => void;
  unreadCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentSectionTitle,
  activeFolio = 'VD-20260702-004',
  isHvSafe = true,
  onBack,
  showBack = false,
  onOpenSearch,
  onOpenNotifications,
  unreadCount = 1,
}) => {
  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-surface-container-lowest/90 backdrop-blur-xl border-b border-surface-variant/30 shadow-[0_4px_20px_rgba(0,0,0,0.35)]">
      <div className="max-w-2xl mx-auto px-4 pt-2 pb-2.5 flex flex-col gap-1.5">
        {/* Main Row */}
        <div className="flex items-center justify-between gap-2">
          {/* Brand + Back + Folio */}
          <div className="flex items-center gap-2.5 min-w-0">
            {showBack && onBack && (
              <button
                onClick={onBack}
                aria-label="Volver atrás"
                className="w-10 h-10 min-w-[40px] rounded-lg bg-surface-container-high text-on-surface hover:text-primary flex items-center justify-center transition-colors active:scale-95"
              >
                <span className="material-symbols-outlined text-[22px]">arrow_back</span>
              </button>
            )}

            <div className="h-8 flex items-center shrink-0">
              <img
                src={VOLTECH_LOGO_URL}
                alt="Voltech Dynamics"
                className="h-7 w-auto object-contain"
              />
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-headline font-bold text-base text-on-surface uppercase tracking-tight leading-none truncate">
                  VOLTECH
                </span>
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-primary-container/20 text-primary-container font-semibold uppercase tracking-wider">
                  TALLER EV
                </span>
              </div>
              <span className="font-mono text-[11px] text-outline tracking-wider truncate">
                FOLIO: {activeFolio}
              </span>
            </div>
          </div>

          {/* Right Action Icons & Badges */}
          <div className="flex items-center gap-2 shrink-0">
            {/* OBD-II Connection Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded bg-surface-container-high">
              <span className="w-2 h-2 rounded-full bg-tertiary-container animate-pulse"></span>
              <span className="font-mono text-[11px] text-tertiary uppercase font-semibold">
                OBD-II LINKED
              </span>
            </div>

            {onOpenSearch && (
              <button
                onClick={onOpenSearch}
                aria-label="Buscar"
                className="w-9 h-9 rounded-lg bg-surface-container-high text-on-surface-variant hover:text-primary flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">search</span>
              </button>
            )}

            {onOpenNotifications && (
              <button
                onClick={onOpenNotifications}
                aria-label="Alertas de Seguridad"
                className="w-9 h-9 rounded-lg bg-surface-container-high text-on-surface-variant hover:text-error flex items-center justify-center transition-colors relative"
              >
                <span className="material-symbols-outlined text-[20px]">warning</span>
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error animate-ping"></span>
                )}
              </button>
            )}

            {/* Technician Avatar Chip */}
            <div
              className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-xs shadow-sm"
              title="Téc. Roberto Soto (Nivel 2)"
            >
              <span className="material-symbols-outlined text-[18px]">person</span>
            </div>
          </div>
        </div>

        {/* Sub-Header Row: Section Navigation & Safety Lock */}
        <div className="flex items-center justify-between pt-0.5 border-t border-surface-variant/20">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wide shrink-0">
              SECCIÓN //
            </span>
            <span className="font-headline text-sm font-semibold text-primary truncate leading-none">
              {currentSectionTitle}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface-container shrink-0">
            <span
              className={`material-symbols-outlined text-[13px] ${
                isHvSafe ? 'text-tertiary-container' : 'text-error animate-pulse'
              }`}
            >
              bolt
            </span>
            <span
              className={`font-mono text-[10px] uppercase tracking-wider font-semibold ${
                isHvSafe ? 'text-tertiary-container' : 'text-error'
              }`}
            >
              {isHvSafe ? 'HV ISOLATED (SAFE)' : '72V DC LIVE'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
