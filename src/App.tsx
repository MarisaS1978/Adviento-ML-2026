import React, { useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Lock,
  ArrowUpRight,
  ArrowUp,
  Share2,
  RotateCcw,
  BookOpen,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { ADVENT_DAYS, AdventDay, WEEK_NAMES, WeekNumber } from './data/adventDays';
import { DayModal } from './components/DayModal';
import { ShareModal } from './components/ShareModal';
import heroIllustration from './assets/images/hero_ml_advent_1794699924347.jpg';

const WEEK_THEMES: Record<
  WeekNumber,
  {
    numeral: string;
    cardHover: string;
    cardCompleted: string;
    bar: string;
    softBg: string;
    border: string;
    accentText: string;
  }
> = {
  1: {
    numeral: 'text-emerald-700',
    cardHover: 'hover:border-emerald-400 hover:bg-emerald-50/35',
    cardCompleted: 'bg-emerald-50/60 border-emerald-300 hover:border-emerald-500',
    bar: 'bg-emerald-600',
    softBg: 'bg-emerald-50/50',
    border: 'border-emerald-200',
    accentText: 'text-emerald-800',
  },
  2: {
    numeral: 'text-rose-700',
    cardHover: 'hover:border-rose-400 hover:bg-rose-50/35',
    cardCompleted: 'bg-rose-50/60 border-rose-300 hover:border-rose-500',
    bar: 'bg-rose-600',
    softBg: 'bg-rose-50/50',
    border: 'border-rose-200',
    accentText: 'text-rose-800',
  },
  3: {
    numeral: 'text-sky-700',
    cardHover: 'hover:border-sky-400 hover:bg-sky-50/35',
    cardCompleted: 'bg-sky-50/60 border-sky-300 hover:border-sky-500',
    bar: 'bg-sky-600',
    softBg: 'bg-sky-50/50',
    border: 'border-sky-200',
    accentText: 'text-sky-800',
  },
  4: {
    numeral: 'text-amber-700',
    cardHover: 'hover:border-amber-400 hover:bg-amber-50/40',
    cardCompleted: 'bg-amber-50/65 border-amber-300 hover:border-amber-500',
    bar: 'bg-amber-600',
    softBg: 'bg-amber-50/50',
    border: 'border-amber-200',
    accentText: 'text-amber-800',
  },
};

const STORAGE_KEY = 'adviento_ml_completed_v1';
const VINTABYTES_REPO_URL = 'https://github.com/VintaBytes/Ciencia-de-datos';
const REPO_URL =
  'https://github.com/VintaBytes/Ciencia-de-datos/blob/main/cursos/machine-learning-python2/README.md';

type FilterTab = 'all' | 'w1' | 'w2' | 'w3' | 'w4' | 'completed';
type CalendarMode = 'free' | 'advent';

export default function App() {
  const [completedDays, setCompletedDays] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Ignore storage errors
    }
    return [];
  });

  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [calendarMode, setCalendarMode] = useState<CalendarMode>('free');
  const [simulatedDecDay, setSimulatedDecDay] = useState<number>(() => {
    const now = new Date();
    return now.getMonth() === 11 ? Math.min(24, Math.max(1, now.getDate())) : 8;
  });
  const [activeDayNum, setActiveDayNum] = useState<number | null>(() => {
    if (typeof window !== 'undefined') {
      const param = new URLSearchParams(window.location.search).get('dia');
      const parsed = param ? Number(param) : NaN;
      if (parsed >= 1 && parsed <= 24) return parsed;
    }
    return null;
  });
  const [showShareModal, setShowShareModal] = useState(false);
  const [heroImgError, setHeroImgError] = useState(false);
  const [lockedNoticeDay, setLockedNoticeDay] = useState<number | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShowScrollTop(window.scrollY > 320);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completedDays));
    } catch {
      // Ignore storage errors
    }
  }, [completedDays]);

  const triggerCelebrationConfetti = useCallback((isGrandFinale: boolean) => {
    const colors = ['#047857', '#E11D48', '#D97706', '#0284C7', '#10B981', '#F59E0B'];

    confetti({
      particleCount: isGrandFinale ? 110 : 75,
      spread: isGrandFinale ? 95 : 70,
      origin: { y: 0.62 },
      colors,
      zIndex: 100,
      disableForReducedMotion: true,
    });

    if (isGrandFinale) {
      setTimeout(() => {
        confetti({
          particleCount: 65,
          angle: 60,
          spread: 60,
          origin: { x: 0.1, y: 0.65 },
          colors,
          zIndex: 100,
          disableForReducedMotion: true,
        });
        confetti({
          particleCount: 65,
          angle: 120,
          spread: 60,
          origin: { x: 0.9, y: 0.65 },
          colors,
          zIndex: 100,
          disableForReducedMotion: true,
        });
      }, 220);
    }
  }, []);

  const handleToggleComplete = (dayNum: number, completed: boolean) => {
    setCompletedDays((prev) => {
      if (completed) {
        if (prev.includes(dayNum)) return prev;
        const next = [...prev, dayNum].sort((a, b) => a - b);
        triggerCelebrationConfetti(next.length === ADVENT_DAYS.length);
        return next;
      }
      return prev.filter((d) => d !== dayNum);
    });
  };

  const nextRecommendedDay = useMemo(() => {
    const firstPending = ADVENT_DAYS.find((d) => !completedDays.includes(d.day));
    return firstPending ? firstPending.day : 1;
  }, [completedDays]);

  const filteredDays = useMemo(() => {
    return ADVENT_DAYS.filter((d) => {
      if (activeFilter === 'w1') return d.week === 1;
      if (activeFilter === 'w2') return d.week === 2;
      if (activeFilter === 'w3') return d.week === 3;
      if (activeFilter === 'w4') return d.week === 4;
      if (activeFilter === 'completed') return completedDays.includes(d.day);
      return true;
    });
  }, [activeFilter, completedDays]);

  const activeDay: AdventDay | null = useMemo(() => {
    if (activeDayNum === null) return null;
    return ADVENT_DAYS.find((d) => d.day === activeDayNum) ?? null;
  }, [activeDayNum]);

  const isDayLocked = (dayNum: number) => {
    if (calendarMode === 'free') return false;
    return dayNum > simulatedDecDay;
  };

  const handleCardClick = (dayNum: number) => {
    if (isDayLocked(dayNum)) {
      setLockedNoticeDay(dayNum);
      return;
    }
    setLockedNoticeDay(null);
    setActiveDayNum(dayNum);
  };

  const weekProgress = (week: WeekNumber) => {
    const daysInWeek = ADVENT_DAYS.filter((d) => d.week === week);
    const done = daysInWeek.filter((d) => completedDays.includes(d.day)).length;
    return { done, total: daysInWeek.length };
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 overflow-x-hidden">
      {/* Top Navigation Bar: Strict 3-zone contract */}
      <header className="sticky top-0 z-30 bg-[#F8FAFC]/95 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4 sm:gap-8">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#inicio"
            className="text-xl font-semibold tracking-tight text-slate-950 whitespace-nowrap shrink-0"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Adviento ML
          </a>

          {/* Zone 2: 4 concise single-line nav links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#calendario" className="hover:text-slate-950 transition-colors whitespace-nowrap shrink-0">
              Calendario
            </a>
            <a href="#ruta" className="hover:text-slate-950 transition-colors whitespace-nowrap shrink-0">
              Ruta del curso
            </a>
            <a href="#progreso" className="hover:text-slate-950 transition-colors whitespace-nowrap shrink-0">
              Progreso
            </a>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-950 transition-colors whitespace-nowrap shrink-0"
            >
              Repositorio
            </a>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => setShowShareModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-emerald-700 rounded-lg hover:bg-emerald-800 transition-colors whitespace-nowrap shrink-0"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Compartir</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 bg-gradient-to-b from-emerald-50/45 via-[#F8FAFC] to-rose-50/25">
        {/* Hero Split Section */}
        <section id="inicio" className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-10 pb-8">
          <div className="grid lg:grid-cols-12 gap-8 items-stretch">
            <div className="lg:col-span-6 min-w-0 flex flex-col justify-between py-2 space-y-6">
              <div className="space-y-4">
                <div className="text-xs font-medium text-emerald-800 flex flex-wrap items-center gap-2">
                  <span>Talento Tech · Comisión 26241</span>
                  <span aria-hidden="true">·</span>
                  <span>VintaBytes (Prof. Ariel Palazzesi)</span>
                  <span aria-hidden="true">·</span>
                  <span>Machine Learning con Python</span>
                </div>

                <h1
                  className="text-3xl sm:text-4xl lg:text-[42px] font-semibold text-slate-950 tracking-tight leading-[1.12] text-balance"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  24 días de laboratorios interactivos para dominar Machine Learning
                </h1>

                <p className="text-base text-slate-600 leading-relaxed max-w-xl">
                  Un calendario educativo diseñado para la Comisión 26241 sobre los cuadernos de{' '}
                  <a
                    href={VINTABYTES_REPO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-emerald-800 hover:underline"
                  >
                    VintaBytes
                  </a>{' '}
                  del profesor Ariel Palazzesi: desde la carga con Pandas y la prevención de Data Leakage hasta K-Means, Random Forest, Pipelines y el proyecto clínico final.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setCalendarMode('free');
                    setActiveDayNum(nextRecommendedDay);
                  }}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap"
                >
                  {completedDays.length === 0
                    ? 'Abrir Día 01'
                    : completedDays.length === 24
                    ? 'Repasar Día 01'
                    : `Continuar Día ${String(nextRecommendedDay).padStart(2, '0')}`}
                </button>

                <a
                  href={VINTABYTES_REPO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-700 hover:text-slate-950 underline underline-offset-4 whitespace-nowrap"
                >
                  <span>Repositorio VintaBytes</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="lg:col-span-6 min-w-0">
              <div className="h-full min-h-[260px] rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                {!heroImgError ? (
                  <img
                    src={heroIllustration}
                    alt="Escritorio de estudio invernal con bloques de calendario de adviento del 1 al 24 y cuaderno abierto con gráficos de dispersión y árboles de decisión"
                    referrerPolicy="no-referrer"
                    onError={() => setHeroImgError(true)}
                    className="w-full h-full lg:h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-slate-100 to-emerald-50 text-slate-700">
                    <CalendarIcon className="w-10 h-10 text-emerald-700 mb-3" />
                    <span className="text-sm font-semibold">Adviento ML · 24 Laboratorios</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 4-Column KPI Summary Strip below hero split */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-200">
            <div className="p-3.5 rounded-xl bg-white border border-slate-200">
              <div className="text-xs text-slate-600">Desafíos interactivos</div>
              <div className="text-2xl font-semibold font-mono tabular-nums text-rose-700 mt-1">24 días</div>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-slate-200">
              <div className="text-xs text-slate-600">Material de origen</div>
              <div className="text-2xl font-semibold font-mono tabular-nums text-sky-700 mt-1">15 cuadernos</div>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-slate-200">
              <div className="text-xs text-slate-600">Ejes del programa</div>
              <div className="text-2xl font-semibold font-mono tabular-nums text-amber-700 mt-1">4 semanas</div>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-slate-200">
              <div className="text-xs text-slate-600">Tu avance guardado</div>
              <div className="text-2xl font-semibold font-mono tabular-nums text-emerald-700 mt-1">
                {completedDays.length} / 24
              </div>
            </div>
          </div>
        </section>

        {/* Calendar Grid Section */}
        <section id="calendario" className="max-w-6xl mx-auto px-4 sm:px-6 py-10 border-t border-slate-200">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div>
              <h2
                className="text-2xl font-semibold text-slate-950 tracking-tight"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Calendario de Adviento
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Abre cada casillero para experimentar con el simulador y resolver el reto del día.
              </p>
            </div>

            {/* Mode Switcher */}
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <div className="flex flex-wrap sm:inline-flex gap-1 rounded-lg bg-slate-200/70 p-1 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    setCalendarMode('free');
                    setLockedNoticeDay(null);
                  }}
                  className={`flex-1 sm:flex-initial px-3 py-1.5 text-xs font-medium rounded-md transition-colors text-center ${
                    calendarMode === 'free' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-700 hover:text-slate-950'
                  }`}
                >
                  Acceso completo
                </button>
                <button
                  type="button"
                  onClick={() => setCalendarMode('advent')}
                  className={`flex-1 sm:flex-initial px-3 py-1.5 text-xs font-medium rounded-md transition-colors text-center ${
                    calendarMode === 'advent' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-700 hover:text-slate-950'
                  }`}
                >
                  Modo Adviento (Dic 1–24)
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Filters & Optional December Day Simulator */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg w-full md:w-auto">
              {[
                { id: 'all', label: 'Todos (24)' },
                { id: 'w1', label: 'Semana 1' },
                { id: 'w2', label: 'Semana 2' },
                { id: 'w3', label: 'Semana 3' },
                { id: 'w4', label: 'Semana 4' },
                { id: 'completed', label: `Completados (${completedDays.length})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFilter(tab.id as FilterTab)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    activeFilter === tab.id
                      ? 'bg-white text-slate-950 shadow-xs'
                      : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {calendarMode === 'advent' && (
              <div className="flex items-center justify-between sm:justify-start gap-3 bg-white border border-slate-200 rounded-lg px-3 py-2 w-full md:w-auto">
                <label htmlFor="dec-sim-range" className="text-xs font-medium text-slate-700 whitespace-nowrap">
                  Día de diciembre: <strong className="font-mono tabular-nums">{simulatedDecDay}</strong>
                </label>
                <input
                  id="dec-sim-range"
                  type="range"
                  min={1}
                  max={24}
                  value={simulatedDecDay}
                  onChange={(e) => setSimulatedDecDay(Number(e.target.value))}
                  className="w-28 sm:w-32 accent-red-700"
                />
              </div>
            )}
          </div>

          {lockedNoticeDay !== null && (
            <div className="mb-6 p-4 bg-white border border-slate-200 rounded-xl flex flex-wrap items-center justify-between gap-3 text-sm">
              <div className="text-slate-700">
                El <strong>Día {lockedNoticeDay}</strong> se habilita el {lockedNoticeDay} de diciembre en el modo calendario diario.
              </div>
              <button
                type="button"
                onClick={() => {
                  setCalendarMode('free');
                  setActiveDayNum(lockedNoticeDay);
                  setLockedNoticeDay(null);
                }}
                className="px-3 py-1.5 text-xs font-medium bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 whitespace-nowrap"
              >
                Activar acceso completo y abrir
              </button>
            </div>
          )}

          {filteredDays.length === 0 ? (
            <div className="p-10 text-center bg-white border border-slate-200 rounded-xl">
              <p className="text-sm text-slate-600">
                Todavía no completaste ningún día. Abre el Día 01 y responde el reto para registrar tu progreso.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredDays.map((item) => {
                const completed = completedDays.includes(item.day);
                const locked = isDayLocked(item.day);
                const theme = WEEK_THEMES[item.week];

                return (
                  <button
                    key={item.day}
                    type="button"
                    onClick={() => handleCardClick(item.day)}
                    className={`group text-left rounded-xl border overflow-hidden transition-all duration-150 flex flex-col justify-between min-h-[172px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 ${
                      locked
                        ? 'bg-slate-100/80 border-slate-200 text-slate-500 hover:bg-slate-100'
                        : completed
                        ? `${theme.cardCompleted} shadow-xs`
                        : `bg-white border-slate-200 ${theme.cardHover} hover:-translate-y-0.5 shadow-xs`
                    }`}
                  >
                    <div className={`h-1.5 w-full ${locked ? 'bg-slate-200' : theme.bar}`} />
                    <div className="p-5 flex-1 flex flex-col justify-between w-full">
                      <div className="flex items-start justify-between gap-2 w-full">
                        <span
                          className={`text-3xl font-semibold tabular-nums leading-none ${
                            locked ? 'text-slate-400' : theme.numeral
                          }`}
                          style={{ fontFamily: 'var(--font-display)' }}
                        >
                          {String(item.day).padStart(2, '0')}
                        </span>

                        <span
                          className={`inline-flex items-center gap-1 text-xs font-medium ${
                            locked
                              ? 'text-slate-500'
                              : completed
                              ? 'text-emerald-700 font-semibold'
                              : 'text-slate-500 group-hover:text-slate-900'
                          }`}
                        >
                          {locked ? (
                            <>
                              <Lock className="w-3.5 h-3.5" />
                              <span>Dic {item.day}</span>
                            </>
                          ) : completed ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Completado</span>
                            </>
                          ) : (
                            <span>Abrir</span>
                          )}
                        </span>
                      </div>

                      <div className="mt-4 space-y-1.5">
                        <h3 className="text-sm font-semibold text-slate-950 leading-snug group-hover:text-slate-900 transition-colors">
                          {item.title}
                        </h3>
                        <div className="text-xs text-slate-500 flex items-center gap-1.5">
                          <span className={locked ? '' : theme.accentText}>{item.claseLabel}</span>
                          <span aria-hidden="true">·</span>
                          <span className="truncate">{item.topic}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* Course Path Overview */}
        <section id="ruta" className="max-w-6xl mx-auto px-4 sm:px-6 py-10 border-t border-slate-200">
          <div className="mb-6">
            <h2
              className="text-2xl font-semibold text-slate-950 tracking-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Ruta del curso VintaBytes
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Los 24 días recorren en orden progresivo las clases y cuadernos de Python, Pandas y Scikit-Learn.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {([1, 2, 3, 4] as WeekNumber[]).map((w) => {
              const weekDays = ADVENT_DAYS.filter((d) => d.week === w);
              const theme = WEEK_THEMES[w];
              return (
                <div key={w} className={`p-5 bg-white border ${theme.border} rounded-xl space-y-3`}>
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
                    <h3 className={`text-base font-semibold ${theme.accentText}`}>{WEEK_NAMES[w]}</h3>
                    <span className="text-xs font-mono tabular-nums text-slate-500">
                      Días {String(weekDays[0].day).padStart(2, '0')}–{String(weekDays[weekDays.length - 1].day).padStart(2, '0')}
                    </span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {weekDays.map((d) => (
                      <li key={d.day} className="flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => handleCardClick(d.day)}
                          className="text-left hover:text-slate-950 hover:underline truncate"
                        >
                          <span className={`font-mono mr-2 tabular-nums font-medium ${theme.numeral}`}>
                            {String(d.day).padStart(2, '0')}.
                          </span>
                          {d.title}
                        </button>
                        <span className="text-slate-400 shrink-0">{d.claseLabel}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* Progress Tracker */}
        <section id="progreso" className="max-w-6xl mx-auto px-4 sm:px-6 py-10 border-t border-slate-200">
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2
                  className="text-xl font-semibold text-slate-950"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Tu progreso por semana
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Se guarda automáticamente en tu navegador mientras resuelves cada reto.
                </p>
              </div>
              {completedDays.length > 0 && (
                <button
                  type="button"
                  onClick={() => setCompletedDays([])}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reiniciar progreso
                </button>
              )}
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {([1, 2, 3, 4] as WeekNumber[]).map((w) => {
                const { done, total } = weekProgress(w);
                const pct = Math.round((done / total) * 100);
                const theme = WEEK_THEMES[w];
                return (
                  <div key={w} className={`p-4 ${theme.softBg} border ${theme.border} rounded-lg space-y-2`}>
                    <div className={`text-xs font-semibold ${theme.accentText}`}>{WEEK_NAMES[w]}</div>
                    <div className="flex justify-between text-xs font-mono tabular-nums text-slate-700">
                      <span>{done} / {total} días</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="h-2 bg-white/80 rounded-full overflow-hidden border border-slate-200/70">
                      <div
                        className={`h-full ${theme.bar} transition-all duration-300`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
        {/* Acknowledgments Section */}
        <section id="agradecimientos" className="max-w-6xl mx-auto px-4 sm:px-6 pb-12">
          <div className="bg-white border border-rose-200 rounded-xl overflow-hidden">
            <div className="h-1.5 w-full bg-gradient-to-r from-emerald-600 via-rose-600 to-amber-600" />
            <div className="p-6 sm:p-8 grid lg:grid-cols-3 gap-6 items-start">
              <div className="lg:col-span-2 space-y-3 min-w-0">
                <div className="text-xs font-medium text-rose-800 flex flex-wrap items-center gap-2">
                  <span>Comisión 26241</span>
                  <span aria-hidden="true">·</span>
                  <span>Talento Tech</span>
                  <span aria-hidden="true">·</span>
                  <span>Agradecimientos</span>
                </div>
                <h2
                  className="text-xl sm:text-2xl font-semibold text-slate-950 tracking-tight text-balance"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Gracias por compartir este recorrido de aprendizaje
                </h2>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                  Un agradecimiento especial al profesor <strong className="font-semibold text-slate-950">Ariel Palazzesi</strong>, creador de VintaBytes, por su enorme generosidad, claridad docente y por poner a disposición estos cuadernos abiertos; a nuestra tutora <strong className="font-semibold text-slate-950">Luciana</strong>, por su acompañamiento constante, paciencia y guía en cada clase; y a todos mis <strong className="font-semibold text-slate-950">compañeros y compañeras de la Comisión 26241</strong> por el entusiasmo, las preguntas y el aprendizaje compartido semana a semana.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 space-y-3 min-w-0">
                <div className="text-xs font-medium text-slate-600">Material oficial de VintaBytes</div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Explora todos los cuadernos, datasets y clases creados por Ariel Palazzesi directamente en GitHub.
                </p>
                <div className="flex flex-col gap-2 pt-1">
                  <a
                    href={VINTABYTES_REPO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors"
                  >
                    <span>Repositorio VintaBytes</span>
                    <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                  </a>
                  <a
                    href={REPO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium bg-white border border-slate-200 text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <span>Índice Machine Learning Python</span>
                    <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Quiet Editorial Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-600">
          <div className="flex items-start sm:items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5 sm:mt-0" />
            <span>
              Basado en el repositorio{' '}
              <a
                href={VINTABYTES_REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-slate-900 hover:underline"
              >
                VintaBytes · Ciencia de Datos con Python
              </a>{' '}
              del profesor Ariel Palazzesi · Comisión 26241 (Talento Tech).
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowShareModal(true)}
            className="font-medium text-emerald-700 hover:text-emerald-800 hover:underline shrink-0"
          >
            Compartir con la Comisión 26241
          </button>
        </div>
      </footer>

      {activeDay && (
        <DayModal
          day={activeDay}
          isCompleted={completedDays.includes(activeDay.day)}
          onToggleComplete={handleToggleComplete}
          onClose={() => setActiveDayNum(null)}
          onNavigate={(nextDay) => setActiveDayNum(nextDay)}
        />
      )}

      {showShareModal && (
        <ShareModal
          completedCount={completedDays.length}
          onClose={() => setShowShareModal(false)}
        />
      )}
      {showScrollTop && !activeDay && !showShareModal && (
        <button
          type="button"
          onClick={() => {
            const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
          }}
          aria-label="Volver al menú superior"
          className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2.5 text-xs font-medium bg-slate-900 text-white border border-slate-700 rounded-xl shadow-lg hover:bg-emerald-700 hover:border-emerald-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 whitespace-nowrap"
        >
          <ArrowUp className="w-4 h-4 shrink-0" />
          <span>Volver arriba</span>
        </button>
      )}
    </div>
  );
}
