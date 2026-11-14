import React, { useState } from 'react';
import { LabType } from '../../data/adventDays';

interface Props {
  labType: LabType;
}

const LOGISTIC_CASES = [
  { z: -3.1, actual: 0 },
  { z: -2.0, actual: 0 },
  { z: -1.1, actual: 0 },
  { z: -0.3, actual: 0 },
  { z: 0.2, actual: 1 },
  { z: 0.9, actual: 1 },
  { z: 1.7, actual: 1 },
  { z: 2.8, actual: 1 },
];

export const ClassificationLab: React.FC<Props> = ({ labType }) => {
  const [threshold, setThreshold] = useState<number>(0.5);
  const [steepness, setSteepness] = useState<number>(1.3);
  const [imbalanced, setImbalanced] = useState<boolean>(false);
  const [predictMajorityOnly, setPredictMajorityOnly] = useState<boolean>(true);

  if (labType === 'logistic-sigmoid') {
    const sigmoid = (z: number) => 1 / (1 + Math.exp(-steepness * z));
    const curvePoints = Array.from({ length: 41 }, (_, i) => {
      const z = -4 + i * 0.2;
      const p = sigmoid(z);
      return `${40 + ((z + 4) / 8) * 300},${170 - p * 140}`;
    }).join(' ');

    const thresholdY = 170 - threshold * 140;

    return (
      <div className="space-y-4">
        <div className="grid md:grid-cols-5 gap-4 items-center">
          <div className="md:col-span-3 bg-white border border-slate-200 rounded-lg p-3">
            <svg viewBox="0 0 370 195" className="w-full h-auto" aria-label="Curva Sigmoide y Umbral">
              <line x1="40" y1="170" x2="345" y2="170" stroke="#CBD5E1" strokeWidth="1" />
              <line x1="40" y1="25" x2="40" y2="170" stroke="#CBD5E1" strokeWidth="1" />
              <line
                x1="40"
                y1={thresholdY}
                x2="345"
                y2={thresholdY}
                stroke="#B91C1C"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <polyline fill="none" stroke="#047857" strokeWidth="2.5" points={curvePoints} />
              {LOGISTIC_CASES.map((c, idx) => {
                const prob = sigmoid(c.z);
                const pred = prob >= threshold ? 1 : 0;
                const cx = 40 + ((c.z + 4) / 8) * 300;
                const cy = 170 - prob * 140;
                return (
                  <circle
                    key={idx}
                    cx={cx}
                    cy={cy}
                    r="5"
                    fill={pred === 1 ? '#047857' : '#FFFFFF'}
                    stroke={pred === c.actual ? '#0F172A' : '#B91C1C'}
                    strokeWidth="2"
                  />
                );
              })}
              <text x="248" y={thresholdY - 5} fontSize="10" fill="#B91C1C" fontFamily="IBM Plex Mono">
                Umbral = {threshold.toFixed(2)}
              </text>
            </svg>
          </div>

          <div className="md:col-span-2 space-y-3">
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <span>Umbral de decisión</span>
                <span className="font-mono tabular-nums">{threshold.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min={0.1}
                max={0.9}
                step={0.05}
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="w-full accent-red-700"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <span>Peso (w)</span>
                <span className="font-mono tabular-nums">{steepness.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min={0.5}
                max={3.0}
                step={0.1}
                value={steepness}
                onChange={(e) => setSteepness(Number(e.target.value))}
                className="w-full accent-emerald-700"
              />
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700">
              Clasificados como Clase 1:{' '}
              <strong className="font-mono tabular-nums">
                {LOGISTIC_CASES.filter((c) => sigmoid(c.z) >= threshold).length} / {LOGISTIC_CASES.length}
              </strong>
              <p className="mt-1 text-slate-600">
                Bajar el umbral aumenta la sensibilidad (más positivos predichos), subirlo exige mayor certeza.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (labType === 'confusion-matrix') {
    const scores = [0.12, 0.19, 0.24, 0.33, 0.42, 0.56, 0.63, 0.78, 0.84, 0.92];
    const actuals = [0, 0, 0, 1, 0, 1, 0, 1, 1, 1];

    let tp = 0, fp = 0, tn = 0, fn = 0;
    scores.forEach((p, idx) => {
      const pred = p >= threshold ? 1 : 0;
      const act = actuals[idx];
      if (pred === 1 && act === 1) tp++;
      else if (pred === 1 && act === 0) fp++;
      else if (pred === 0 && act === 0) tn++;
      else fn++;
    });

    const precision = tp + fp === 0 ? 0 : tp / (tp + fp);
    const recall = tp + fn === 0 ? 0 : tp / (tp + fn);

    return (
      <div className="space-y-4">
        <div className="max-w-md">
          <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
            <span>Umbral clínico P(Positivo) ≥</span>
            <span className="font-mono tabular-nums">{threshold.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min={0.15}
            max={0.85}
            step={0.05}
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            className="w-full accent-emerald-700"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4 items-center">
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
              <div className="text-[11px] font-medium text-emerald-900">Verdadero Negativo (TN)</div>
              <div className="text-2xl font-mono font-semibold tabular-nums text-emerald-950 mt-1">{tn}</div>
            </div>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="text-[11px] font-medium text-amber-900">Falso Positivo (FP)</div>
              <div className="text-2xl font-mono font-semibold tabular-nums text-amber-950 mt-1">{fp}</div>
            </div>
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="text-[11px] font-medium text-red-900">Falso Negativo (FN)</div>
              <div className="text-2xl font-mono font-semibold tabular-nums text-red-950 mt-1">{fn}</div>
            </div>
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
              <div className="text-[11px] font-medium text-emerald-900">Verdadero Positivo (TP)</div>
              <div className="text-2xl font-mono font-semibold tabular-nums text-emerald-950 mt-1">{tp}</div>
            </div>
          </div>

          <div className="space-y-2 p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs">
            <div className="flex justify-between">
              <span className="text-slate-600">Precision (TP / (TP+FP))</span>
              <span className="font-mono font-semibold tabular-nums">{(precision * 100).toFixed(0)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Recall (TP / (TP+FN))</span>
              <span className="font-mono font-semibold tabular-nums">{(recall * 100).toFixed(0)}%</span>
            </div>
            <p className="text-slate-600 pt-2 border-t border-slate-200 leading-relaxed">
              Observa que bajar el umbral reduce los Falsos Negativos (sube Recall), pero a costa de aceptar más Falsos Positivos.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Day 12: Accuracy Trap in Imbalanced Datasets
  const neg = imbalanced ? 95 : 50;
  const pos = imbalanced ? 5 : 50;
  const tp = predictMajorityOnly ? 0 : Math.round(pos * 0.8);
  const fn = pos - tp;
  const tn = predictMajorityOnly ? neg : Math.round(neg * 0.9);
  const fp = neg - tn;

  const accuracy = (tp + tn) / (neg + pos);
  const precision = tp + fp === 0 ? 0 : tp / (tp + fp);
  const recall = tp + fn === 0 ? 0 : tp / (tp + fn);
  const f1 = precision + recall === 0 ? 0 : (2 * precision * recall) / (precision + recall);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-lg bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setImbalanced(false)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              !imbalanced ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            Dataset Balanceado (50 / 50)
          </button>
          <button
            type="button"
            onClick={() => setImbalanced(true)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              imbalanced ? 'bg-white text-red-800 shadow-sm' : 'text-slate-600'
            }`}
          >
            Desbalanceado (95 / 5)
          </button>
        </div>

        <button
          type="button"
          onClick={() => setPredictMajorityOnly(!predictMajorityOnly)}
          className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-800 hover:bg-slate-50"
        >
          {predictMajorityOnly ? 'Modelo ingenuo: predice todo "0"' : 'Modelo real (detecta clase 1)'}
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Accuracy', val: accuracy, warn: imbalanced && predictMajorityOnly },
          { label: 'Precision', val: precision, warn: false },
          { label: 'Recall', val: recall, warn: recall === 0 },
          { label: 'F1-Score', val: f1, warn: f1 === 0 },
        ].map((m) => (
          <div key={m.label} className="p-3 bg-white border border-slate-200 rounded-lg">
            <div className="text-xs text-slate-600">{m.label}</div>
            <div className={`text-xl font-mono font-semibold tabular-nums mt-1 ${m.warn ? 'text-red-700' : 'text-slate-900'}`}>
              {(m.val * 100).toFixed(0)}%
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200">
        {imbalanced && predictMajorityOnly
          ? 'Trampa clásica: el modelo predice siempre 0, logra 95% de Accuracy, pero su Recall y F1 en la clase minoritaria son 0%.'
          : 'Evaluar F1-Score y Recall revela inmediatamente si el modelo está detectando la clase positiva de interés.'}
      </p>
    </div>
  );
};
