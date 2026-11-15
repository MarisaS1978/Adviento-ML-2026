import React, { useState, useEffect } from 'react';
import {
  X,
  ExternalLink,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  BookOpen,
} from 'lucide-react';
import { AdventDay } from '../data/adventDays';
import { DataPrepLab } from './labs/DataPrepLab';
import { RegressionLab } from './labs/RegressionLab';
import { ClassificationLab } from './labs/ClassificationLab';
import { ModelsAndClusteringLab } from './labs/ModelsAndClusteringLab';
import { PipelineWorkflowLab } from './labs/PipelineWorkflowLab';

interface DayModalProps {
  day: AdventDay;
  isCompleted: boolean;
  onToggleComplete: (dayNum: number, completed: boolean) => void;
  onClose: () => void;
  onNavigate: (dayNum: number) => void;
}

const renderLab = (day: AdventDay) => {
  if (day.day <= 6) return <DataPrepLab labType={day.labType} />;
  if (day.day <= 9) return <RegressionLab labType={day.labType} />;
  if (day.day <= 12) return <ClassificationLab labType={day.labType} />;
  if (day.day <= 18) return <ModelsAndClusteringLab labType={day.labType} />;
  return <PipelineWorkflowLab labType={day.labType} />;
};

export const DayModal: React.FC<DayModalProps> = ({
  day,
  isCompleted,
  onToggleComplete,
  onClose,
  onNavigate,
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    setSelectedOption(null);
    setCopiedCode(false);
  }, [day.day]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleSelectOption = (idx: number) => {
    setSelectedOption(idx);
    if (idx === day.quiz.correctIndex && !isCompleted) {
      onToggleComplete(day.day, true);
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(day.codeSnippet);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 1800);
    } catch {
      // Clipboard blocked silently ignored
    }
  };

  const isAnswerCorrect = selectedOption === day.quiz.correctIndex;

  const weekAccentMap = {
    1: { bar: 'bg-emerald-600', dayText: 'text-emerald-700', headerBg: 'bg-emerald-50/40' },
    2: { bar: 'bg-rose-600', dayText: 'text-rose-700', headerBg: 'bg-rose-50/40' },
    3: { bar: 'bg-sky-600', dayText: 'text-sky-700', headerBg: 'bg-sky-50/40' },
    4: { bar: 'bg-amber-600', dayText: 'text-amber-700', headerBg: 'bg-amber-50/45' },
  }[day.week];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 backdrop-blur-xs p-2 sm:p-6 overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-day-title"
    >
      <div
        className="w-full max-w-4xl bg-white rounded-xl border border-slate-200 shadow-2xl overflow-hidden my-auto max-h-[94dvh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`h-1.5 w-full shrink-0 ${weekAccentMap.bar}`} />
        {/* Top Modal Header */}
        <div className={`px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-200 flex items-start justify-between gap-3 ${weekAccentMap.headerBg}`}>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 font-medium">
              <span className={`font-mono tabular-nums font-semibold ${weekAccentMap.dayText}`}>
                Día {String(day.day).padStart(2, '0')}
              </span>
              <span aria-hidden="true">·</span>
              <span>{day.claseLabel}</span>
              <span aria-hidden="true">·</span>
              <span>{day.topic}</span>
              {isCompleted && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Completado
                  </span>
                </>
              )}
            </div>
            <h2
              id="modal-day-title"
              className="text-xl sm:text-2xl font-semibold text-slate-950 tracking-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {day.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar ventana"
            className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-200/60 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto overflow-x-hidden space-y-5 sm:space-y-6">
          {/* Concept & Notebooks */}
          <div className="grid lg:grid-cols-3 gap-5 sm:gap-6">
            <div className="lg:col-span-2 min-w-0 space-y-3">
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">{day.conceptSummary}</p>
              <p className="text-xs sm:text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-lg p-3">
                <strong className="font-semibold text-slate-900">Idea clave:</strong> {day.keyTakeaway}
              </p>
            </div>

            <div className="min-w-0 bg-slate-50 border border-slate-200 rounded-lg p-4 flex flex-col justify-between gap-3">
              <div>
                <div className="text-xs font-medium text-slate-500">Cuaderno base del curso</div>
                <div className="text-sm font-semibold text-slate-900 mt-1 flex items-start gap-2">
                  <BookOpen className="w-4 h-4 shrink-0 mt-0.5 text-emerald-700" />
                  <span>{day.notebookTitle}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 pt-2 border-t border-slate-200">
                <a
                  href={day.colabUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors"
                >
                  <span>Abrir en Google Colab</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                </a>
                <a
                  href={day.notebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium bg-white border border-slate-200 text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <span>Ver cuaderno en GitHub</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                </a>
              </div>
            </div>
          </div>

          {/* Interactive Lab Stage */}
          <section className="min-w-0 border border-slate-200 rounded-xl p-3.5 sm:p-5 bg-slate-50/50 space-y-3">
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-slate-900">{day.labTitle}</h3>
              <p className="text-xs text-slate-600">{day.labInstruction}</p>
            </div>
            <div className="min-w-0">{renderLab(day)}</div>
          </section>

          {/* Python / Scikit-Learn Snippet + Classmate Quiz */}
          <div className="grid lg:grid-cols-2 gap-5 sm:gap-6 items-start">
            <div className="min-w-0 w-full border border-slate-200 rounded-xl overflow-hidden bg-slate-950 text-slate-100">
              <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-2">
                <span className="text-xs font-mono text-slate-300 truncate">Python · Scikit-Learn</span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors shrink-0"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copiado' : 'Copiar'}</span>
                </button>
              </div>
              <pre className="p-3.5 sm:p-4 text-xs font-mono leading-relaxed overflow-x-auto text-slate-100 max-w-full">
                <code>{day.codeSnippet}</code>
              </pre>
            </div>

            <div className="min-w-0 w-full border border-slate-200 rounded-xl p-4 bg-white space-y-3">
              <div className="text-xs font-semibold text-red-800">Reto del día para completar</div>
              <p className="text-sm font-medium text-slate-900 leading-snug">{day.quiz.prompt}</p>
              <div className="space-y-2">
                {day.quiz.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === day.quiz.correctIndex;
                  let btnClass = 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50';
                  if (selectedOption !== null) {
                    if (isCorrect) {
                      btnClass = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-medium';
                    } else if (isSelected && !isCorrect) {
                      btnClass = 'bg-red-50 border-red-300 text-red-900';
                    }
                  }
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full text-left px-3 py-2.5 text-xs rounded-lg border transition-colors ${btnClass}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              {selectedOption !== null && (
                <div
                  className={`p-3 rounded-lg text-xs leading-relaxed ${
                    isAnswerCorrect ? 'bg-emerald-50 text-emerald-950 border border-emerald-200' : 'bg-amber-50 text-amber-950 border border-amber-200'
                  }`}
                >
                  <strong className="font-semibold">
                    {isAnswerCorrect ? '¡Correcto! ' : 'Revisa este punto: '}
                  </strong>
                  {day.quiz.explanation}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Controls */}
        <div className="px-4 sm:px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <div className="grid grid-cols-2 sm:flex items-center gap-2">
            <button
              type="button"
              disabled={day.day <= 1}
              onClick={() => onNavigate(day.day - 1)}
              className="inline-flex items-center justify-center gap-1 px-3 py-2 sm:py-1.5 text-xs font-medium bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 shrink-0" />
              <span>Día anterior</span>
            </button>
            <button
              type="button"
              disabled={day.day >= 24}
              onClick={() => onNavigate(day.day + 1)}
              className="inline-flex items-center justify-center gap-1 px-3 py-2 sm:py-1.5 text-xs font-medium bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition-colors"
            >
              <span>Siguiente día</span>
              <ChevronRight className="w-4 h-4 shrink-0" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => onToggleComplete(day.day, !isCompleted)}
            className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg transition-colors ${
              isCompleted
                ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{isCompleted ? 'Día completado' : 'Marcar como completado'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
