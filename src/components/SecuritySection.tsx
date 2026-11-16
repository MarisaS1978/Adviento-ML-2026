import React, { useState } from 'react';
import { ShieldCheck, Lock, Download, Trash2, CheckCircle2 } from 'lucide-react';

interface SecuritySectionProps {
  completedDays: number[];
  onClearLocalData: () => void;
}

type FrameworkTab = 'soc2' | 'iso27001';

const SOC2_CONTROLS = [
  {
    code: 'CC6.1 · Seguridad',
    title: 'Arquitectura sin servidor ni base de datos',
    detail:
      'La aplicación corre 100% en tu navegador. No recolecta contraseñas, correos ni datos personales (PII), reduciendo al mínimo la superficie de ataque.',
  },
  {
    code: 'PI1.4 · Integridad de procesamiento',
    title: 'Validación estricta de estado y parámetros',
    detail:
      'El progreso guardado en almacenamiento local y los parámetros de URL (?dia=) se validan y sanean estrictamente como enteros válidos entre 1 y 24.',
  },
  {
    code: 'C1.1 · Confidencialidad',
    title: 'Cero rastreo y aislamiento de enlaces',
    detail:
      'Sin cookies de seguimiento ni analíticas de terceros. Todos los enlaces hacia GitHub y Google Colab incluyen rel="noopener noreferrer" y política strict-origin.',
  },
  {
    code: 'A1.2 · Disponibilidad',
    title: 'Resiliencia estática y respaldo local',
    detail:
      'Despliegue estático sin puntos únicos de falla de backend, con exportación directa de tu progreso en formato JSON.',
  },
];

const ISO27001_CONTROLS = [
  {
    code: 'Anexo A.8.24 · Criptografía',
    title: 'Transporte cifrado bajo HTTPS / TLS y HSTS',
    detail:
      'Configurada con Strict-Transport-Security y política de referencia estricta para proteger la integridad de los recursos cargados.',
  },
  {
    code: 'Anexo A.8.26 · Desarrollo seguro',
    title: 'Cabeceras CSP, no-sniff y Permissions-Policy',
    detail:
      'Política de Seguridad de Contenidos (CSP), bloqueo de MIME sniffing (nosniff) y deshabilitación explícita de cámara, micrófono y geolocalización.',
  },
  {
    code: 'Anexo A.5.34 · Privacidad y PII',
    title: 'Minimización de datos por diseño',
    detail:
      'Los avances educativos permanecen exclusivamente en el dispositivo del estudiante, evitando transferencias innecesarias de información.',
  },
  {
    code: 'Anexo A.8.10 · Eliminación y portabilidad',
    title: 'Control total sobre tus datos locales',
    detail:
      'Puedes exportar tu historial de aprendizaje o eliminar por completo los datos almacenados en tu navegador en un solo clic.',
  },
];

export const SecuritySection: React.FC<SecuritySectionProps> = ({
  completedDays,
  onClearLocalData,
}) => {
  const [activeTab, setActiveTab] = useState<FrameworkTab>('soc2');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const isHttpsOrLocal =
    typeof window !== 'undefined' &&
    (window.location.protocol === 'https:' ||
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1');

  const controls = activeTab === 'soc2' ? SOC2_CONTROLS : ISO27001_CONTROLS;

  const handleExportProgress = () => {
    const payload = {
      app: 'Adviento ML 2026 · Comisión 26241',
      exportedAt: new Date().toISOString(),
      completedDays,
      totalCompleted: completedDays.length,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'adviento-ml-progreso.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setFeedbackMsg('Respaldo JSON descargado correctamente.');
    setTimeout(() => setFeedbackMsg(null), 2600);
  };

  const handleDeleteData = () => {
    onClearLocalData();
    setFeedbackMsg('Datos locales eliminados del navegador.');
    setTimeout(() => setFeedbackMsg(null), 2600);
  };

  return (
    <section id="seguridad" className="max-w-6xl mx-auto px-4 sm:px-6 pb-12">
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="h-1.5 w-full bg-gradient-to-r from-sky-700 via-emerald-700 to-slate-800" />
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <div className="text-xs font-medium text-sky-800 flex flex-wrap items-center gap-2">
                <span>Seguridad y Privacidad</span>
                <span aria-hidden="true">·</span>
                <span>Alineación SOC 2</span>
                <span aria-hidden="true">·</span>
                <span>Controles ISO/IEC 27001</span>
              </div>
              <h2
                className="text-xl sm:text-2xl font-semibold text-slate-950 tracking-tight text-balance"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Buenas prácticas de seguridad, privacidad e integridad
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Arquitectura diseñada siguiendo criterios de <strong className="font-semibold text-slate-900">SOC 2</strong> y controles técnicos de <strong className="font-semibold text-slate-900">ISO/IEC 27001</strong> para proteger tu privacidad sin recolectar datos personales.
              </p>
            </div>

            <div className="flex flex-wrap sm:inline-flex gap-1 rounded-lg bg-slate-100 p-1 w-full lg:w-auto shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('soc2')}
                className={`flex-1 sm:flex-initial px-3.5 py-2 text-xs font-medium rounded-md transition-colors text-center ${
                  activeTab === 'soc2'
                    ? 'bg-white text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                Criterios SOC 2
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('iso27001')}
                className={`flex-1 sm:flex-initial px-3.5 py-2 text-xs font-medium rounded-md transition-colors text-center ${
                  activeTab === 'iso27001'
                    ? 'bg-white text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                Controles ISO/IEC 27001
              </button>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {controls.map((ctrl) => (
              <div
                key={ctrl.code}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 min-w-0"
              >
                <div className="flex items-center justify-between gap-2 text-xs font-mono text-sky-800 font-medium">
                  <span>{ctrl.code}</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                </div>
                <h3 className="text-sm font-semibold text-slate-950">{ctrl.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{ctrl.detail}</p>
              </div>
            ))}
          </div>

          {/* Verifiable Browser Security Status + Data Portability Controls */}
          <div className="pt-5 border-t border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-700">
              <span className="inline-flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>{isHttpsOrLocal ? 'Conexión segura activa' : 'Origen estándar'}</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>Cero cookies de rastreo · 0 bytes PII enviados</span>
              </span>
              <span className="inline-flex items-center gap-1.5 font-mono tabular-nums text-slate-600">
                CSP + Referrer-Policy + Sanitización 1..24
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleExportProgress}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-medium bg-white border border-slate-300 text-slate-800 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <Download className="w-3.5 h-3.5 shrink-0" />
                <span>Exportar progreso (.json)</span>
              </button>
              <button
                type="button"
                onClick={handleDeleteData}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-medium bg-white border border-rose-200 text-rose-800 rounded-lg hover:bg-rose-50 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5 shrink-0" />
                <span>Eliminar datos locales</span>
              </button>
            </div>
          </div>

          {feedbackMsg && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-900">
              {feedbackMsg}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
