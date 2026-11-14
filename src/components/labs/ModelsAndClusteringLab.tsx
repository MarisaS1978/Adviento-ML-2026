import React, { useState } from 'react';
import { LabType } from '../../data/adventDays';
import { RotateCcw } from 'lucide-react';

interface Props {
  labType: LabType;
}

const KNN_POINTS = [
  { x: 22, y: 28, label: 0 }, { x: 30, y: 40, label: 0 }, { x: 18, y: 52, label: 0 },
  { x: 38, y: 32, label: 0 }, { x: 42, y: 50, label: 0 }, { x: 26, y: 65, label: 0 },
  { x: 48, y: 38, label: 1 }, { x: 64, y: 44, label: 1 }, { x: 72, y: 30, label: 1 },
  { x: 68, y: 62, label: 1 }, { x: 80, y: 54, label: 1 }, { x: 58, y: 74, label: 1 },
  { x: 78, y: 76, label: 1 }, { x: 45, y: 66, label: 0 }, { x: 54, y: 55, label: 1 },
];

const INITIAL_KMEANS_DATA = [
  { x: 20, y: 25 }, { x: 26, y: 30 }, { x: 18, y: 34 }, { x: 29, y: 22 },
  { x: 72, y: 24 }, { x: 78, y: 30 }, { x: 69, y: 35 }, { x: 82, y: 27 },
  { x: 48, y: 74 }, { x: 55, y: 78 }, { x: 44, y: 80 }, { x: 58, y: 70 },
];

const INITIAL_CENTROIDS = [
  { x: 35, y: 55 },
  { x: 65, y: 50 },
  { x: 50, y: 30 },
];

export const ModelsAndClusteringLab: React.FC<Props> = ({ labType }) => {
  // Day 13: KNN canvas
  const [queryPt, setQueryPt] = useState({ x: 50, y: 52 });
  const [kVal, setKVal] = useState<number>(3);

  // Day 14: KNN scaling
  const [scaled, setScaled] = useState<boolean>(false);

  // Day 15: Decision Tree depth
  const [maxDepth, setMaxDepth] = useState<number>(4);

  // Day 16: Random Forest estimators
  const [nEstimators, setNEstimators] = useState<number>(15);

  // Day 17: K-Means stepper
  const [centroids, setCentroids] = useState(INITIAL_CENTROIDS);
  const [assignments, setAssignments] = useState<number[]>(INITIAL_KMEANS_DATA.map(() => -1));
  const [stepCount, setStepCount] = useState<number>(0);

  // Day 18: Penguins vs Consumers
  const [realDataset, setRealDataset] = useState<'penguins' | 'consumers'>('penguins');

  if (labType === 'knn-canvas') {
    const withDist = KNN_POINTS.map((p, idx) => ({
      ...p,
      idx,
      dist: Math.hypot(p.x - queryPt.x, p.y - queryPt.y),
    })).sort((a, b) => a.dist - b.dist);

    const neighbors = withDist.slice(0, kVal);
    const radius = neighbors[neighbors.length - 1]?.dist ?? 10;
    const votes1 = neighbors.filter((n) => n.label === 1).length;
    const votes0 = kVal - votes1;
    const pred = votes1 > votes0 ? 1 : 0;

    const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = Math.max(8, Math.min(92, ((e.clientX - rect.left) / rect.width) * 100));
      const y = Math.max(8, Math.min(92, ((e.clientY - rect.top) / rect.height) * 100));
      setQueryPt({ x, y });
    };

    return (
      <div className="space-y-4">
        <div className="grid md:grid-cols-5 gap-4 items-center">
          <div className="md:col-span-3 bg-white border border-slate-200 rounded-lg p-2">
            <svg
              viewBox="0 0 100 100"
              onClick={handleSvgClick}
              className="w-full h-56 cursor-crosshair bg-slate-50 rounded"
              aria-label="Plano interactivo KNN"
            >
              <circle
                cx={queryPt.x}
                cy={queryPt.y}
                r={radius}
                fill="rgba(4, 120, 87, 0.08)"
                stroke="#047857"
                strokeWidth="0.6"
                strokeDasharray="2 1.5"
              />
              {neighbors.map((n) => (
                <line
                  key={n.idx}
                  x1={queryPt.x}
                  y1={queryPt.y}
                  x2={n.x}
                  y2={n.y}
                  stroke="#94A3B8"
                  strokeWidth="0.5"
                />
              ))}
              {KNN_POINTS.map((p, idx) => (
                <circle
                  key={idx}
                  cx={p.x}
                  cy={p.y}
                  r="2.4"
                  fill={p.label === 1 ? '#047857' : '#B91C1C'}
                />
              ))}
              <rect
                x={queryPt.x - 2.3}
                y={queryPt.y - 2.3}
                width="4.6"
                height="4.6"
                fill={pred === 1 ? '#047857' : '#B91C1C'}
                stroke="#0F172A"
                strokeWidth="0.9"
              />
            </svg>
          </div>

          <div className="md:col-span-2 space-y-3">
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <span>Vecinos (k)</span>
                <span className="font-mono tabular-nums">k = {kVal}</span>
              </div>
              <input
                type="range"
                min={1}
                max={15}
                step={2}
                value={kVal}
                onChange={(e) => setKVal(Number(e.target.value))}
                className="w-full accent-emerald-700"
              />
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5 text-xs font-mono tabular-nums">
              <div className="flex justify-between">
                <span className="text-emerald-800">Votos Clase Verde (1):</span>
                <strong>{votes1}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-red-800">Votos Clase Roja (0):</span>
                <strong>{votes0}</strong>
              </div>
              <div className="pt-2 border-t border-slate-200 font-sans font-semibold text-slate-900">
                Predicción: {pred === 1 ? 'Clase 1 (Verde)' : 'Clase 0 (Roja)'}
              </div>
            </div>
            <p className="text-xs text-slate-600">Haz clic dentro del plano para mover el punto de consulta.</p>
          </div>
        </div>
      </div>
    );
  }

  if (labType === 'knn-scaling') {
    // Query: Edad 30, Salario 1.200.000
    // Candidato A: Edad 31, Salario 1.450.000 (muy parecido en edad, 250k en salario)
    // Candidato B: Edad 62, Salario 1.210.000 (doble de edad, casi igual salario)
    const distRawA = Math.hypot(31 - 30, 1450000 - 1200000);
    const distRawB = Math.hypot(62 - 30, 1210000 - 1200000);

    const distScaledA = Math.hypot((31 - 30) / 12, (1450000 - 1200000) / 500000);
    const distScaledB = Math.hypot((62 - 30) / 12, (1210000 - 1200000) / 500000);

    const winner = scaled
      ? distScaledA < distScaledB ? 'Candidato A (Edad 31)' : 'Candidato B (Edad 62)'
      : distRawA < distRawB ? 'Candidato A (Edad 31)' : 'Candidato B (Edad 62)';

    return (
      <div className="space-y-4">
        <div className="inline-flex rounded-lg bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setScaled(false)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              !scaled ? 'bg-white text-red-800 shadow-sm' : 'text-slate-600'
            }`}
          >
            Sin escalar (pesos $)
          </button>
          <button
            type="button"
            onClick={() => setScaled(true)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              scaled ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600'
            }`}
          >
            Con StandardScaler
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-1">
            <div className="font-semibold text-slate-900">Candidato A · Edad 31 · $1.450.000</div>
            <div className="font-mono tabular-nums text-slate-700">
              Distancia al caso (Edad 30, $1.2M): <strong>{scaled ? distScaledA.toFixed(2) : Math.round(distRawA).toLocaleString('es-AR')}</strong>
            </div>
          </div>
          <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-1">
            <div className="font-semibold text-slate-900">Candidato B · Edad 62 · $1.210.000</div>
            <div className="font-mono tabular-nums text-slate-700">
              Distancia al caso (Edad 30, $1.2M): <strong>{scaled ? distScaledB.toFixed(2) : Math.round(distRawB).toLocaleString('es-AR')}</strong>
            </div>
          </div>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800">
          Vecino más cercano elegido: <strong>{winner}</strong> —{' '}
          {scaled
            ? 'Al estandarizar, la diferencia de 32 años de edad pesa como corresponde.'
            : 'Sin escalar, $10.000 de diferencia en salario dominan por completo sobre 32 años de edad.'}
        </div>
      </div>
    );
  }

  if (labType === 'decision-tree-depth') {
    const trainAcc = Math.min(0.99, 0.65 + maxDepth * 0.035);
    const valAcc =
      maxDepth <= 5 ? 0.63 + maxDepth * 0.052 : Math.max(0.68, 0.89 - (maxDepth - 5) * 0.032);
    const zone =
      maxDepth <= 2 ? 'Subajuste (Underfitting)' : maxDepth <= 6 ? 'Zona óptima de generalización' : 'Sobreajuste (Overfitting)';

    return (
      <div className="space-y-4">
        <div className="max-w-md">
          <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
            <span>Profundidad máxima (max_depth)</span>
            <span className="font-mono tabular-nums">{maxDepth} niveles</span>
          </div>
          <input
            type="range"
            min={1}
            max={12}
            step={1}
            value={maxDepth}
            onChange={(e) => setMaxDepth(Number(e.target.value))}
            className="w-full accent-emerald-700"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-white border border-slate-200 rounded-lg">
            <div className="text-xs text-slate-600">Accuracy Train</div>
            <div className="text-xl font-mono font-semibold tabular-nums text-slate-900 mt-1">
              {(trainAcc * 100).toFixed(1)}%
            </div>
          </div>
          <div className="p-3 bg-white border border-slate-200 rounded-lg">
            <div className="text-xs text-slate-600">Accuracy Test</div>
            <div className="text-xl font-mono font-semibold tabular-nums text-emerald-700 mt-1">
              {(valAcc * 100).toFixed(1)}%
            </div>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="text-xs text-slate-600">Diagnóstico</div>
            <div className="text-xs font-semibold text-slate-900 mt-2">{zone}</div>
          </div>
        </div>
      </div>
    );
  }

  if (labType === 'random-forest-ensemble') {
    const variance = (0.14 / Math.sqrt(nEstimators)).toFixed(3);
    const importances = [
      { name: 'Wishlist', pct: 38 },
      { name: 'Plays', pct: 29 },
      { name: 'Antiguedad', pct: 18 },
      { name: 'Genero_RPG', pct: 15 },
    ];

    return (
      <div className="space-y-4">
        <div className="max-w-md">
          <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
            <span>Cantidad de árboles (n_estimators)</span>
            <span className="font-mono tabular-nums">{nEstimators} árboles</span>
          </div>
          <input
            type="range"
            min={1}
            max={100}
            step={5}
            value={nEstimators}
            onChange={(e) => setNEstimators(Number(e.target.value))}
            className="w-full accent-emerald-700"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-2">
            <div className="text-xs font-semibold text-slate-900">Importancia de variables (feature_importances_)</div>
            {importances.map((f) => (
              <div key={f.name} className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span>{f.name}</span>
                  <span className="tabular-nums">{f.pct}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-700" style={{ width: `${f.pct}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex flex-col justify-between text-xs">
            <div>
              <div className="font-semibold text-slate-900">Estabilidad del ensamble</div>
              <p className="text-slate-600 mt-1 leading-relaxed">
                Cada árbol vota con una submuestra distinta. Al sumar árboles baja la varianza de las predicciones.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-200 font-mono tabular-nums">
              Desviación del error CV: ±{variance}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (labType === 'kmeans-stepper') {
    const clusterColors = ['#047857', '#B91C1C', '#1D4ED8'];

    const assignPoints = () => {
      const next = INITIAL_KMEANS_DATA.map((pt) => {
        let best = 0;
        let bestD = Infinity;
        centroids.forEach((c, idx) => {
          const d = Math.hypot(pt.x - c.x, pt.y - c.y);
          if (d < bestD) {
            bestD = d;
            best = idx;
          }
        });
        return best;
      });
      setAssignments(next);
      setStepCount((s) => s + 1);
    };

    const updateCentroids = () => {
      const next = centroids.map((c, idx) => {
        const members = INITIAL_KMEANS_DATA.filter((_, pIdx) => assignments[pIdx] === idx);
        if (members.length === 0) return c;
        return {
          x: members.reduce((a, b) => a + b.x, 0) / members.length,
          y: members.reduce((a, b) => a + b.y, 0) / members.length,
        };
      });
      setCentroids(next);
      setStepCount((s) => s + 1);
    };

    const resetKmeans = () => {
      setCentroids(INITIAL_CENTROIDS);
      setAssignments(INITIAL_KMEANS_DATA.map(() => -1));
      setStepCount(0);
    };

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={assignPoints}
            className="px-3 py-1.5 text-xs font-medium bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors"
          >
            1. Asignar al centroide cercano
          </button>
          <button
            type="button"
            onClick={updateCentroids}
            disabled={assignments[0] === -1}
            className="px-3 py-1.5 text-xs font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-40 transition-colors"
          >
            2. Recalcular centroides
          </button>
          <button
            type="button"
            onClick={resetKmeans}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium border border-slate-200 bg-white text-slate-700 rounded-lg hover:bg-slate-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reiniciar
          </button>
          <span className="text-xs font-mono tabular-nums text-slate-600 ml-auto">Pasos: {stepCount}</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-2">
          <svg viewBox="0 0 100 100" className="w-full h-52 bg-slate-50 rounded" aria-label="Simulador K-Means">
            {INITIAL_KMEANS_DATA.map((pt, i) => {
              const cIdx = assignments[i];
              return (
                <circle
                  key={i}
                  cx={pt.x}
                  cy={pt.y}
                  r="2.4"
                  fill={cIdx === -1 ? '#64748B' : clusterColors[cIdx]}
                />
              );
            })}
            {centroids.map((c, idx) => (
              <g key={idx} transform={`translate(${c.x}, ${c.y})`}>
                <rect x="-2.6" y="-2.6" width="5.2" height="5.2" fill={clusterColors[idx]} stroke="#0F172A" strokeWidth="0.9" />
              </g>
            ))}
          </svg>
        </div>
      </div>
    );
  }

  // Day 18: Penguins vs Consumers
  const isPenguins = realDataset === 'penguins';
  return (
    <div className="space-y-4">
      <div className="inline-flex rounded-lg bg-slate-100 p-1">
        <button
          type="button"
          onClick={() => setRealDataset('penguins')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
            isPenguins ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600'
          }`}
        >
          Cuaderno 09B · Pingüinos
        </button>
        <button
          type="button"
          onClick={() => setRealDataset('consumers')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
            !isPenguins ? 'bg-white text-amber-800 shadow-sm' : 'text-slate-600'
          }`}
        >
          Cuaderno 09C · Consumidores
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 items-center">
        <div className="bg-white border border-slate-200 rounded-lg p-3">
          <svg viewBox="0 0 100 70" className="w-full h-40 bg-slate-50 rounded">
            {isPenguins ? (
              <>
                <circle cx="22" cy="48" r="2.2" fill="#047857" />
                <circle cx="27" cy="52" r="2.2" fill="#047857" />
                <circle cx="19" cy="55" r="2.2" fill="#047857" />
                <circle cx="52" cy="24" r="2.2" fill="#1D4ED8" />
                <circle cx="57" cy="20" r="2.2" fill="#1D4ED8" />
                <circle cx="49" cy="28" r="2.2" fill="#1D4ED8" />
                <circle cx="78" cy="46" r="2.2" fill="#B91C1C" />
                <circle cx="82" cy="51" r="2.2" fill="#B91C1C" />
                <circle cx="74" cy="50" r="2.2" fill="#B91C1C" />
              </>
            ) : (
              <>
                <circle cx="38" cy="36" r="2.2" fill="#047857" />
                <circle cx="45" cy="39" r="2.2" fill="#1D4ED8" />
                <circle cx="42" cy="32" r="2.2" fill="#B91C1C" />
                <circle cx="51" cy="35" r="2.2" fill="#047857" />
                <circle cx="55" cy="42" r="2.2" fill="#1D4ED8" />
                <circle cx="48" cy="44" r="2.2" fill="#B91C1C" />
                <circle cx="60" cy="33" r="2.2" fill="#047857" />
                <circle cx="53" cy="29" r="2.2" fill="#1D4ED8" />
                <circle cx="44" cy="48" r="2.2" fill="#B91C1C" />
              </>
            )}
          </svg>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs text-slate-700">
          <div className="font-semibold text-slate-900">
            {isPenguins ? 'Silhouette Score ≈ 0.68 · Grupos claros' : 'Silhouette Score ≈ 0.27 · Alta superposición'}
          </div>
          <p className="leading-relaxed">
            {isPenguins
              ? 'Las medidas físicas de pico y aleta separan nítidamente a las especies; K-Means descubre grupos con mucho sentido biológico.'
              : 'En datos reales de consumidores, las personas comparten hábitos intermedios. K-Means corta el plano aunque no existan islas separadas.'}
          </p>
        </div>
      </div>
    </div>
  );
};
