import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, ArrowRight, RotateCcw } from 'lucide-react';
import { LabType } from '../../data/adventDays';

interface Props {
  labType: LabType;
}

export const DataPrepLab: React.FC<Props> = ({ labType }) => {
  // Day 1: Pandas CSV Inspector
  const [sep, setSep] = useState<',' | ';'>(',');
  const [decimal, setDecimal] = useState<'.' | ','>('.');

  // Day 2: Nulls & Outliers
  const [imputeStrategy, setImputeStrategy] = useState<'drop' | 'mean' | 'median'>('mean');
  const [includeOutlier, setIncludeOutlier] = useState<boolean>(true);

  // Day 3: Feature Engineering
  const [useAntiguedad, setUseAntiguedad] = useState(false);
  const [useRatioWishlist, setUseRatioWishlist] = useState(false);

  // Day 4: Categorical Encoding
  const [encodingMode, setEncodingMode] = useState<'label' | 'onehot'>('label');

  // Day 5: Feature Scaling
  const [scalerMode, setScalerMode] = useState<'raw' | 'minmax' | 'standard'>('raw');

  // Day 6: Train/Test Split & Leakage
  const [testSize, setTestSize] = useState<number>(20);
  const [leakageMode, setLeakageMode] = useState<'leaky' | 'clean'>('leaky');

  if (labType === 'pandas-inspector') {
    const isCorrect = sep === ';' && decimal === ',';
    const rawRows = [
      'titulo;genero;horas_promedio;rating',
      'Hades;Roguelike;42,5;4,8',
      'Celeste;Plataformas;18,0;4,7',
      'Hollow Knight;Metroidvania;54,2;4,9',
    ];

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <div>
              <span className="block text-xs font-medium text-slate-600 mb-1">Separador (sep)</span>
              <div className="inline-flex rounded-lg bg-slate-100 p-1">
                {([';', ','] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSep(s)}
                    className={`px-3 py-1.5 text-xs font-mono font-medium rounded-md transition-colors whitespace-nowrap ${
                      sep === s ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    sep="{s}"
                  </button>
                ))}
              </div>
            </div>
            <div>
              <span className="block text-xs font-medium text-slate-600 mb-1">Decimal</span>
              <div className="inline-flex rounded-lg bg-slate-100 p-1">
                {(['.', ','] as const).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDecimal(d)}
                    className={`px-3 py-1.5 text-xs font-mono font-medium rounded-md transition-colors whitespace-nowrap ${
                      decimal === d ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    decimal="{d}"
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className={`flex items-center gap-1.5 text-xs font-semibold ${isCorrect ? 'text-emerald-700' : 'text-amber-700'}`}>
            {isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            <span>{isCorrect ? '4 columnas · float64 listo para modelar' : 'Error de lectura: revisa separador o decimales'}</span>
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-lg bg-white">
          {sep === ',' ? (
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700">
                <tr>
                  <th className="px-3 py-2">titulo;genero;horas_promedio;rating (object)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {rawRows.slice(1).map((row, idx) => (
                  <tr key={idx}>
                    <td className="px-3 py-2">{row}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left text-xs font-mono tabular-nums">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700">
                <tr>
                  <th className="px-3 py-2">titulo (object)</th>
                  <th className="px-3 py-2">genero (object)</th>
                  <th className="px-3 py-2">
                    horas_promedio ({decimal === ',' ? 'float64' : 'object'})
                  </th>
                  <th className="px-3 py-2">
                    rating ({decimal === ',' ? 'float64' : 'object'})
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {[
                  ['Hades', 'Roguelike', decimal === ',' ? '42.5' : '"42,5"', decimal === ',' ? '4.8' : '"4,8"'],
                  ['Celeste', 'Plataformas', decimal === ',' ? '18.0' : '"18,0"', decimal === ',' ? '4.7' : '"4,7"'],
                  ['Hollow Knight', 'Metroidvania', decimal === ',' ? '54.2' : '"54,2"', decimal === ',' ? '4.9' : '"4,9"'],
                ].map((r, i) => (
                  <tr key={i}>
                    <td className="px-3 py-2">{r[0]}</td>
                    <td className="px-3 py-2">{r[1]}</td>
                    <td className={`px-3 py-2 ${decimal === '.' ? 'text-amber-700 font-semibold' : 'text-emerald-700'}`}>{r[2]}</td>
                    <td className={`px-3 py-2 ${decimal === '.' ? 'text-amber-700 font-semibold' : 'text-emerald-700'}`}>{r[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  }

  if (labType === 'nulls-imputation') {
    const baseValues = [12, 15, 14, 18, 16];
    const dataset = includeOutlier ? [...baseValues, 195] : [...baseValues, 17];
    const meanVal = dataset.reduce((a, b) => a + b, 0) / dataset.length;
    const sorted = [...dataset].sort((a, b) => a - b);
    const medianVal = (sorted[2] + sorted[3]) / 2;

    const imputedValue =
      imputeStrategy === 'drop' ? null : imputeStrategy === 'mean' ? meanVal : medianVal;

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <div className="flex flex-wrap sm:inline-flex gap-1 rounded-lg bg-slate-100 p-1 w-full sm:w-auto">
            {[
              { id: 'drop', label: 'Eliminar filas (dropna)' },
              { id: 'mean', label: 'Imputar Media' },
              { id: 'median', label: 'Imputar Mediana' },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setImputeStrategy(opt.id as 'drop' | 'mean' | 'median')}
                className={`flex-1 sm:flex-initial px-3 py-1.5 text-xs font-medium rounded-md transition-colors text-center ${
                  imputeStrategy === opt.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setIncludeOutlier(!includeOutlier)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              includeOutlier
                ? 'bg-red-50 border-red-200 text-red-800'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            {includeOutlier ? 'Outlier activo: 195h' : 'Sin outlier: 17h'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="text-xs text-slate-600">Filas útiles</div>
            <div className="text-lg font-semibold font-mono tabular-nums text-slate-900">
              {imputeStrategy === 'drop' ? '6 / 8' : '8 / 8'}
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="text-xs text-slate-600">Media resultante</div>
            <div className="text-lg font-semibold font-mono tabular-nums text-slate-900">
              {meanVal.toFixed(1)} h
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="text-xs text-slate-600">Valor imputado</div>
            <div className={`text-lg font-semibold font-mono tabular-nums ${imputeStrategy === 'median' ? 'text-emerald-700' : 'text-slate-900'}`}>
              {imputedValue === null ? 'Fila eliminada' : `${imputedValue.toFixed(1)} h`}
            </div>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
          {imputeStrategy === 'drop' &&
            'Eliminar filas reduce el dataset un 25%. Si los nulos aparecen en varias columnas, podrías quedarte sin datos suficientes.'}
          {imputeStrategy === 'mean' &&
            (includeOutlier
              ? '¡Cuidado! El único jugador con 195 horas arrastra la media a 45.0h, imputando un valor poco representativo para los 2 casos faltantes.'
              : 'Sin outliers extremos, la media (15.3h) representa bien al grupo.')}
          {imputeStrategy === 'median' &&
            'La mediana (15.5h) ignora el salto extremo de 195h y conserva todas las filas con un valor central realista.'}
        </div>
      </div>
    );
  }

  if (labType === 'feature-engineering') {
    const baseCorr = 0.31;
    const corr = baseCorr + (useAntiguedad ? 0.19 : 0) + (useRatioWishlist ? 0.28 : 0);

    return (
      <div className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setUseAntiguedad(!useAntiguedad)}
            className={`p-3 rounded-lg border text-left transition-colors ${
              useAntiguedad ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-1.5 text-xs font-semibold">
              <span className="font-mono break-all">+ antiguedad = 2026 - dt.year</span>
              <span className="shrink-0">{useAntiguedad ? 'Activa' : 'Agregar'}</span>
            </div>
            <p className="text-xs text-slate-600 mt-1">Transforma fecha de texto en años desde el lanzamiento.</p>
          </button>

          <button
            type="button"
            onClick={() => setUseRatioWishlist(!useRatioWishlist)}
            className={`p-3 rounded-lg border text-left transition-colors ${
              useRatioWishlist ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-1.5 text-xs font-semibold">
              <span className="font-mono break-all">+ ratio_deseo = wishlist / plays</span>
              <span className="shrink-0">{useRatioWishlist ? 'Activa' : 'Agregar'}</span>
            </div>
            <p className="text-xs text-slate-600 mt-1">Captura interés relativo independientemente del tamaño total.</p>
          </button>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-lg space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-slate-700">Correlación explicativa estimada con el target (R²)</span>
            <span className="font-mono font-semibold tabular-nums text-emerald-700">{corr.toFixed(2)}</span>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 transition-all duration-200"
              style={{ width: `${Math.round(corr * 100)}%` }}
            />
          </div>
          <p className="text-xs text-slate-600">
            Variables activas: <span className="font-mono">plays, genero{useAntiguedad ? ', antiguedad' : ''}{useRatioWishlist ? ', ratio_deseo' : ''}</span>
          </p>
        </div>
      </div>
    );
  }

  if (labType === 'categorical-encoding') {
    const categories = ['RPG', 'Indie', 'Acción'];
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap sm:inline-flex gap-1 rounded-lg bg-slate-100 p-1 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setEncodingMode('label')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 text-xs font-medium rounded-md transition-colors text-center ${
              encodingMode === 'label' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Label Encoding (orden falso)
          </button>
          <button
            type="button"
            onClick={() => setEncodingMode('onehot')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 text-xs font-medium rounded-md transition-colors text-center ${
              encodingMode === 'onehot' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            One-Hot Encoding (correcto)
          </button>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-lg bg-white">
          {encodingMode === 'label' ? (
            <table className="w-full text-left text-xs font-mono tabular-nums">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2">genero_original</th>
                  <th className="px-3 py-2">genero_encoded</th>
                  <th className="px-3 py-2">Riesgo matemático</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categories.map((cat, idx) => (
                  <tr key={cat}>
                    <td className="px-3 py-2">{cat}</td>
                    <td className="px-3 py-2 font-semibold text-amber-700">{idx}</td>
                    <td className="px-3 py-2 text-slate-600 font-sans">
                      {idx === 0 && 'Base 0'}
                      {idx === 1 && 'Parece el promedio entre RPG y Acción'}
                      {idx === 2 && 'Pesa el doble que Indie (2 > 1)'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left text-xs font-mono tabular-nums">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2">genero_original</th>
                  <th className="px-3 py-2">es_RPG</th>
                  <th className="px-3 py-2">es_Indie</th>
                  <th className="px-3 py-2">es_Accion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categories.map((cat, idx) => (
                  <tr key={cat}>
                    <td className="px-3 py-2">{cat}</td>
                    <td className="px-3 py-2 text-emerald-700 font-semibold">{idx === 0 ? 1 : 0}</td>
                    <td className="px-3 py-2 text-emerald-700 font-semibold">{idx === 1 ? 1 : 0}</td>
                    <td className="px-3 py-2 text-emerald-700 font-semibold">{idx === 2 ? 1 : 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  }

  if (labType === 'feature-scaling') {
    const samples = [
      { nombre: 'Ana', edad: 22, salario: 600000 },
      { nombre: 'Bruno', edad: 35, salario: 1800000 },
      { nombre: 'Carla', edad: 52, salario: 3200000 },
    ];
    const transform = (val: number, min: number, max: number, mean: number, std: number) => {
      if (scalerMode === 'raw') return val.toLocaleString('es-AR');
      if (scalerMode === 'minmax') return ((val - min) / (max - min)).toFixed(2);
      return ((val - mean) / std).toFixed(2);
    };

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap sm:inline-flex gap-1 rounded-lg bg-slate-100 p-1 w-full sm:w-auto">
          {[
            { id: 'raw', label: 'Datos crudos' },
            { id: 'minmax', label: 'MinMaxScaler [0, 1]' },
            { id: 'standard', label: 'StandardScaler (z-score)' },
          ].map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setScalerMode(m.id as 'raw' | 'minmax' | 'standard')}
              className={`flex-1 sm:flex-initial px-3 py-1.5 text-xs font-medium rounded-md transition-colors text-center ${
                scalerMode === m.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-lg bg-white">
          <table className="w-full text-left text-xs font-mono tabular-nums">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700">
              <tr>
                <th className="px-3 py-2">Persona</th>
                <th className="px-3 py-2">Edad</th>
                <th className="px-3 py-2">Salario ($)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {samples.map((s) => (
                <tr key={s.nombre}>
                  <td className="px-3 py-2 font-sans font-medium">{s.nombre}</td>
                  <td className="px-3 py-2 text-emerald-700 font-semibold">
                    {transform(s.edad, 22, 52, 36.33, 12.28)}
                  </td>
                  <td className="px-3 py-2 text-slate-900 font-semibold">
                    {transform(s.salario, 600000, 3200000, 1866667, 1062492)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-600">
          {scalerMode === 'raw' && 'Sin escalar, las diferencias de Salario son 100.000 veces más grandes que las de Edad.'}
          {scalerMode === 'minmax' && 'MinMaxScaler ubica ambas columnas estrictamente entre 0.00 y 1.00.'}
          {scalerMode === 'standard' && 'StandardScaler expresa cada dato en desviaciones estándar respecto a su media (μ=0, σ=1).'}
        </p>
      </div>
    );
  }

  // Day 6: Train/Test Split & Data Leakage
  const trainPct = 100 - testSize;
  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4 items-center">
        <div>
          <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
            <span>Proporción de Test (test_size)</span>
            <span className="font-mono tabular-nums">{(testSize / 100).toFixed(2)} ({testSize}%)</span>
          </div>
          <input
            type="range"
            min={10}
            max={40}
            step={5}
            value={testSize}
            onChange={(e) => setTestSize(Number(e.target.value))}
            className="w-full accent-emerald-700"
          />
          <div className="flex justify-between text-[11px] text-slate-500 mt-1 font-mono tabular-nums">
            <span>Train: {trainPct}%</span>
            <span>Test: {testSize}%</span>
          </div>
        </div>

        <div className="flex flex-wrap sm:inline-flex gap-1 rounded-lg bg-slate-100 p-1 w-full">
          <button
            type="button"
            onClick={() => setLeakageMode('leaky')}
            className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors text-center ${
              leakageMode === 'leaky' ? 'bg-white text-red-700 shadow-sm' : 'text-slate-600'
            }`}
          >
            Escalar antes del split
          </button>
          <button
            type="button"
            onClick={() => setLeakageMode('clean')}
            className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors text-center ${
              leakageMode === 'clean' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600'
            }`}
          >
            Split primero (correcto)
          </button>
        </div>
      </div>

      <div className="flex h-7 w-full rounded-lg overflow-hidden border border-slate-200 font-mono text-xs font-semibold">
        <div
          className="bg-emerald-700 text-white flex items-center justify-center transition-all duration-200"
          style={{ width: `${trainPct}%` }}
        >
          Train {trainPct}%
        </div>
        <div
          className="bg-slate-200 text-slate-800 flex items-center justify-center transition-all duration-200"
          style={{ width: `${testSize}%` }}
        >
          Test {testSize}%
        </div>
      </div>

      <div className={`p-3 rounded-lg border text-xs flex items-start gap-2.5 ${
        leakageMode === 'leaky' ? 'bg-red-50 border-red-200 text-red-900' : 'bg-emerald-50 border-emerald-200 text-emerald-950'
      }`}>
        {leakageMode === 'leaky' ? (
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-700" />
        ) : (
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-700" />
        )}
        <div className="space-y-1">
          <div className="font-semibold">
            {leakageMode === 'leaky'
              ? 'Data Leakage detectado · Métrica optimista falsa'
              : 'Flujo limpio sin fuga · Evaluación honesta'}
          </div>
          <p className="leading-relaxed">
            {leakageMode === 'leaky'
              ? 'Al calcular la media y desviación estándar usando todo el dataset antes de dividir, el conjunto de entrenamiento "espía" la distribución del futuro conjunto de prueba.'
              : 'train_test_split separa primero los datos. Luego StandardScaler().fit_transform(X_train) aprende únicamente del pasado y aplica transform(X_test).'}
          </p>
          <div className="font-mono text-[11px] flex items-center gap-1.5 pt-1 opacity-90">
            <span>{leakageMode === 'leaky' ? 'scaler.fit_transform(X)' : 'train_test_split(X, y)'}</span>
            <ArrowRight className="w-3 h-3" />
            <span>{leakageMode === 'leaky' ? 'train_test_split(X_sc)' : 'scaler.fit_transform(X_train)'}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => {
            setTestSize(20);
            setLeakageMode('clean');
          }}
          className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Restablecer recomendado
        </button>
      </div>
    </div>
  );
};
