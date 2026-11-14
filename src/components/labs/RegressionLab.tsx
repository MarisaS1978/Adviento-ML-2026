import React, { useState } from 'react';
import { LabType } from '../../data/adventDays';
import { RotateCcw } from 'lucide-react';

interface Props {
  labType: LabType;
}

const REG_POINTS = [
  { x: 1, y: 2.3 },
  { x: 2, y: 3.1 },
  { x: 3, y: 4.5 },
  { x: 4, y: 4.8 },
  { x: 5, y: 6.4 },
  { x: 6, y: 7.1 },
  { x: 7, y: 8.6 },
];

export const RegressionLab: React.FC<Props> = ({ labType }) => {
  // Day 7: Interactive linear regression fit
  const [slope, setSlope] = useState<number>(0.7);
  const [intercept, setIntercept] = useState<number>(1.8);

  // Day 8: Outliers impact on MAE vs RMSE
  const [outlierY, setOutlierY] = useState<number>(8.5);
  const [showOutlier, setShowOutlier] = useState<boolean>(true);

  // Day 9: Rating vs Times Listed
  const [targetCol, setTargetCol] = useState<'rating' | 'times_listed'>('rating');

  if (labType === 'linear-regression-fit') {
    const errors = REG_POINTS.map((p) => p.y - (slope * p.x + intercept));
    const mse = errors.reduce((acc, e) => acc + e * e, 0) / errors.length;
    const yMean = REG_POINTS.reduce((a, b) => a + b.y, 0) / REG_POINTS.length;
    const ssTot = REG_POINTS.reduce((a, p) => a + (p.y - yMean) ** 2, 0);
    const ssRes = errors.reduce((a, e) => a + e * e, 0);
    const r2 = 1 - ssRes / ssTot;

    const toSvgX = (x: number) => 40 + (x / 8) * 320;
    const toSvgY = (y: number) => 200 - (y / 10) * 170;

    return (
      <div className="space-y-4">
        <div className="grid md:grid-cols-5 gap-4 items-center">
          <div className="md:col-span-3 bg-white border border-slate-200 rounded-lg p-3">
            <svg viewBox="0 0 380 220" className="w-full h-auto" aria-label="Gráfico de regresión lineal">
              <line x1="40" y1="200" x2="360" y2="200" stroke="#CBD5E1" strokeWidth="1" />
              <line x1="40" y1="20" x2="40" y2="200" stroke="#CBD5E1" strokeWidth="1" />
              {REG_POINTS.map((p, idx) => {
                const yHat = slope * p.x + intercept;
                return (
                  <g key={idx}>
                    <line
                      x1={toSvgX(p.x)}
                      y1={toSvgY(p.y)}
                      x2={toSvgX(p.x)}
                      y2={toSvgY(yHat)}
                      stroke="#B91C1C"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                    <circle cx={toSvgX(p.x)} cy={toSvgY(p.y)} r="4.5" fill="#0F172A" />
                  </g>
                );
              })}
              <line
                x1={toSvgX(0)}
                y1={toSvgY(intercept)}
                x2={toSvgX(8)}
                y2={toSvgY(slope * 8 + intercept)}
                stroke="#047857"
                strokeWidth="2.5"
              />
              <text x="48" y="34" fontSize="11" fill="#475569" fontFamily="IBM Plex Mono">
                ŷ = {slope.toFixed(2)}x + {intercept.toFixed(2)}
              </text>
            </svg>
          </div>

          <div className="md:col-span-2 space-y-3">
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <span>Pendiente (w)</span>
                <span className="font-mono tabular-nums">{slope.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min={0.1}
                max={1.8}
                step={0.05}
                value={slope}
                onChange={(e) => setSlope(Number(e.target.value))}
                className="w-full accent-emerald-700"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <span>Intercepto (b)</span>
                <span className="font-mono tabular-nums">{intercept.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min={-1}
                max={4}
                step={0.1}
                value={intercept}
                onChange={(e) => setIntercept(Number(e.target.value))}
                className="w-full accent-emerald-700"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-[11px] text-slate-600">MSE</div>
                <div className="text-base font-mono font-semibold tabular-nums text-slate-900">{mse.toFixed(3)}</div>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-[11px] text-slate-600">R²</div>
                <div className={`text-base font-mono font-semibold tabular-nums ${r2 > 0.9 ? 'text-emerald-700' : 'text-slate-900'}`}>
                  {r2.toFixed(3)}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setSlope(1.05);
                setIntercept(1.06);
              }}
              className="w-full py-2 px-3 text-xs font-medium bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors"
            >
              Ajuste Óptimo (Mínimos Cuadrados)
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (labType === 'regression-metrics') {
    const base = [
      { y: 2.0, pred: 2.2 },
      { y: 3.5, pred: 3.3 },
      { y: 5.0, pred: 4.8 },
      { y: 6.0, pred: 6.2 },
      ...(showOutlier ? [{ y: outlierY, pred: 7.0 }] : []),
    ];
    const absErr = base.map((d) => Math.abs(d.y - d.pred));
    const sqErr = base.map((d) => (d.y - d.pred) ** 2);
    const mae = absErr.reduce((a, b) => a + b, 0) / base.length;
    const mse = sqErr.reduce((a, b) => a + b, 0) / base.length;
    const rmse = Math.sqrt(mse);

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setShowOutlier(!showOutlier)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              showOutlier ? 'bg-red-50 border-red-200 text-red-800' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            {showOutlier ? 'Outlier incluido en evaluación' : 'Outlier excluido'}
          </button>

          {showOutlier && (
            <div className="flex items-center gap-3 min-w-[240px]">
              <span className="text-xs font-medium text-slate-700 whitespace-nowrap">
                Valor real del outlier: <strong className="font-mono tabular-nums">{outlierY.toFixed(1)}</strong> (pred: 7.0)
              </span>
              <input
                type="range"
                min={7}
                max={20}
                step={0.5}
                value={outlierY}
                onChange={(e) => setOutlierY(Number(e.target.value))}
                className="w-32 accent-red-700"
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-white border border-slate-200 rounded-lg">
            <div className="text-xs text-slate-600">MAE (Lineal)</div>
            <div className="text-xl font-mono font-semibold tabular-nums text-slate-900 mt-1">{mae.toFixed(2)}</div>
            <div className="text-[11px] text-slate-500 mt-1">Promedia |y - ŷ|</div>
          </div>
          <div className="p-3 bg-white border border-slate-200 rounded-lg">
            <div className="text-xs text-slate-600">MSE (Cuadrático)</div>
            <div className="text-xl font-mono font-semibold tabular-nums text-red-700 mt-1">{mse.toFixed(2)}</div>
            <div className="text-[11px] text-slate-500 mt-1">Castiga fuerte desvíos</div>
          </div>
          <div className="p-3 bg-white border border-slate-200 rounded-lg">
            <div className="text-xs text-slate-600">RMSE (Misma escala)</div>
            <div className="text-xl font-mono font-semibold tabular-nums text-slate-900 mt-1">{rmse.toFixed(2)}</div>
            <div className="text-[11px] text-slate-500 mt-1">√MSE · RMSE ≥ MAE</div>
          </div>
        </div>
      </div>
    );
  }

  // Day 9: Times Listed vs Rating
  const isRating = targetCol === 'rating';
  const points = isRating
    ? [
        { x: 15, y: 3.1 }, { x: 25, y: 4.5 }, { x: 35, y: 2.9 }, { x: 45, y: 4.1 },
        { x: 55, y: 3.6 }, { x: 65, y: 4.8 }, { x: 75, y: 3.8 }, { x: 85, y: 4.2 },
      ]
    : [
        { x: 15, y: 1.4 }, { x: 25, y: 2.1 }, { x: 35, y: 2.7 }, { x: 45, y: 3.5 },
        { x: 55, y: 4.1 }, { x: 65, y: 4.9 }, { x: 75, y: 5.4 }, { x: 85, y: 6.1 },
      ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-lg bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setTargetCol('rating')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              isRating ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Target: Rating (R² ≈ 0.24)
          </button>
          <button
            type="button"
            onClick={() => setTargetCol('times_listed')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              !isRating ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Target: Times Listed (R² ≈ 0.94)
          </button>
        </div>

        <button
          type="button"
          onClick={() => setTargetCol('rating')}
          className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reiniciar
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4 items-center">
        <div className="bg-white border border-slate-200 rounded-lg p-3">
          <svg viewBox="0 0 300 170" className="w-full h-auto" aria-label="Comparación de dispersión por target">
            <line x1="35" y1="145" x2="280" y2="145" stroke="#CBD5E1" strokeWidth="1" />
            <line x1="35" y1="15" x2="35" y2="145" stroke="#CBD5E1" strokeWidth="1" />
            <line
              x1="45"
              y1={isRating ? 95 : 130}
              x2="265"
              y2={isRating ? 58 : 26}
              stroke={isRating ? '#B91C1C' : '#047857'}
              strokeWidth="2"
            />
            {points.map((pt, i) => (
              <circle
                key={i}
                cx={35 + (pt.x / 100) * 240}
                cy={145 - (pt.y / 7) * 125}
                r="4"
                fill="#0F172A"
              />
            ))}
            <text x="110" y="164" fontSize="10" fill="#64748B" fontFamily="IBM Plex Mono">
              Wishlist & Plays
            </text>
          </svg>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs text-slate-700">
          <div className="font-semibold text-slate-900">
            {isRating
              ? 'Cuaderno 05: Predecir Rating'
              : 'Cuaderno 05b: Predecir Times Listed'}
          </div>
          <p className="leading-relaxed">
            {isRating
              ? 'Juegos con pocas o muchas descargas pueden tener calificaciones altas o bajas. La nube dispersa explica por qué el modelo lineal apenas alcanza R² ≈ 0.2375.'
              : 'Al predecir cuántas veces fue listado un juego usando popularidad (Wishlist, Plays, Backlogs), la relación lineal aparece con nitidez y el R² sube drásticamente.'}
          </p>
        </div>
      </div>
    </div>
  );
};
