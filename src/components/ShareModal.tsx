import React, { useState } from 'react';
import { X, Copy, Check, Share2 } from 'lucide-react';

interface ShareModalProps {
  completedCount: number;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ completedCount, onClose }) => {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedMsg, setCopiedMsg] = useState(false);

  const shareUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const groupMessage = `Hola equipo! Armé este Calendario de Adviento interactivo de Machine Learning con 24 mini-laboratorios y retos basados en los cuadernos de VintaBytes (Talento Tech). Llevo ${completedCount}/24 días completados. Pruébenlo acá: ${shareUrl}`;

  const copyText = async (text: string, which: 'url' | 'msg') => {
    try {
      await navigator.clipboard.writeText(text);
      if (which === 'url') {
        setCopiedUrl(true);
        setTimeout(() => setCopiedUrl(false), 1800);
      } else {
        setCopiedMsg(true);
        setTimeout(() => setCopiedMsg(false), 1800);
      }
    } catch {
      // Clipboard fallback ignored
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-xs p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
    >
      <div
        className="w-full max-w-lg bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-900">
            <Share2 className="w-4 h-4 text-emerald-700" />
            <h2 id="share-modal-title" className="text-base font-semibold">
              Compartir con tus compañeros
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="space-y-2">
            <label htmlFor="share-url-input" className="block text-xs font-medium text-slate-700">
              Enlace directo al calendario
            </label>
            <div className="flex gap-2">
              <input
                id="share-url-input"
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              />
              <button
                type="button"
                onClick={() => copyText(shareUrl, 'url')}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-800 whitespace-nowrap shrink-0"
              >
                {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedUrl ? 'Copiado' : 'Copiar link'}</span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="share-msg-textarea" className="block text-xs font-medium text-slate-700">
              Mensaje listo para Discord, Slack o WhatsApp del curso
            </label>
            <textarea
              id="share-msg-textarea"
              readOnly
              rows={4}
              value={groupMessage}
              className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 leading-relaxed resize-none"
            />
            <button
              type="button"
              onClick={() => copyText(groupMessage, 'msg')}
              className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-medium bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors"
            >
              {copiedMsg ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedMsg ? 'Mensaje copiado al portapapeles' : 'Copiar invitación para el grupo'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
