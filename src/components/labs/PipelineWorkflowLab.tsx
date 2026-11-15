import React, { useState } from 'react';
import { LabType } from '../../data/adventDays';
import { CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

interface Props {
  labType: LabType;
}

const PRE_STEPS = [
  { id: 'target', label: '1. Definir problema y variable objetivo' },
  { id: 'eda', label: '2. EDA, limpieza y tipos de columnas' },
  { id: 'split', label: '3. Dividir en Train y Test (stratify)' },
  { id: 'prep', label: '4. Ajustar escalado y encoding solo en Train' },
  { id: 'train', label: '5. Entrenar y evaluar el modelo' },
];

export const PipelineWorkflowLab: React.FC<Props> = ({ labType }) => {
  // Day 19: Checklist verification
  const [selectedOrder, setSelectedOrder] = useState<string[]>([]);

  // Day 20: Pipeline toggle
  const [usePipeline, setUsePipeline] = useState<boolean>(true);

  // Day 21: GridSearchCV
  const [selectedCell, setSelectedCell] = useState<{ depth: number; est: number; score: number }>({
    depth: 5,
    est: 100,
    score: 0.87,
  });

  // Day 22: Joblib serialization
  const [savedScope, setSavedScope] = useState<'estimator' | 'pipeline'>('estimator');

  // Day 23: Model comparison
  const [priority, setPriority] = useState<'recall' | 'precision' | 'explain'>('recall');

  // Day 24: Clinical End-to-End
  const [clinicalImpute, setClinicalImpute] = useState<'none' | 'median'>('median');
  const [clinicalBalanced, setClinicalBalanced] = useState<boolean>(true);

  if (labType === 'pre-entrega-checklist') {
    const toggleStep = (id: string) => {
      if (selectedOrder.includes(id)) {
        setSelectedOrder(selectedOrder.filter((x) => x !== id));
      } else {
        setSelectedOrder([...selectedOrder, id]);
      }
    };
    const isExact =
      selectedOrder.length === PRE_STEPS.length &&
      selectedOrder.every((id, idx) => id === PRE_STEPS[idx].id);

    return (
      <div className="space-y-4">
        <p className="text-xs text-slate-600">
          Haz clic en las etapas en el orden correcto para construir el flujo de Pre-Entrega sin Data Leakage:
        </p>
        <div className="flex flex-wrap gap-2">
          {[PRE_STEPS[2], PRE_STEPS[0], PRE_STEPS[4], PRE_STEPS[1], PRE_STEPS[3]].map((s) => {
            const idx = selectedOrder.indexOf(s.id);
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => toggleStep(s.id)}
                className={`px-3 py-2 text-xs font-medium text-left rounded-lg border transition-colors ${
                  idx !== -1
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                }`}
              >
                {idx !== -1 ? `[Paso ${idx + 1}] ` : ''}
                {s.label.slice(3)}
              </button>
            );
          })}
        </div>

        <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            {isExact ? (
              <>
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-700" />
                <span className="font-semibold text-emerald-900">Orden impecable: el split ocurre antes de ajustar transformadores.</span>
              </>
            ) : (
              <span className="text-slate-600">
                Seleccionados: {selectedOrder.length} / {PRE_STEPS.length}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => setSelectedOrder([])}
            className="text-slate-600 hover:text-slate-900 underline shrink-0"
          >
            Limpiar
          </button>
        </div>
      </div>
    );
  }

  if (labType === 'sklearn-pipeline') {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap sm:inline-flex gap-1 rounded-lg bg-slate-100 p-1 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setUsePipeline(false)}
            className={`flex-1 sm:flex-initial px-3 py-1.5 text-xs font-medium rounded-md transition-colors text-center ${
              !usePipeline ? 'bg-white text-red-800 shadow-sm' : 'text-slate-600'
            }`}
          >
            Pasos manuales sueltos
          </button>
          <button
            type="button"
            onClick={() => setUsePipeline(true)}
            className={`flex-1 sm:flex-initial px-3 py-1.5 text-xs font-medium rounded-md transition-colors text-center ${
              usePipeline ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600'
            }`}
          >
            Pipeline + ColumnTransformer
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 p-4 bg-white border border-slate-200 rounded-lg text-xs font-mono">
          <span className="px-2.5 py-1.5 bg-slate-100 rounded text-slate-800">X_train crudo</span>
          <ArrowRight className="w-4 h-4 text-slate-400" />
          <span className={`px-2.5 py-1.5 rounded ${usePipeline ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-amber-50 text-amber-900 border border-amber-200'}`}>
            ColumnTransformer (Num + Cat)
          </span>
          <ArrowRight className="w-4 h-4 text-slate-400" />
          <span className="px-2.5 py-1.5 bg-slate-100 rounded text-slate-800">RandomForest</span>
        </div>

        <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200">
          {usePipeline
            ? 'Durante cross_val_score(cv=5), Scikit-Learn ajusta el imputador y escalador únicamente con los 4 folds de entrenamiento en cada iteración.'
            : 'Sin Pipeline, es muy fácil olvidar pasar el X_test por el mismo OneHotEncoder o filtrar información de los folds de validación.'}
        </p>
      </div>
    );
  }

  if (labType === 'gridsearch-heatmap') {
    const depths = [2, 5, 8, 12];
    const estimators = [25, 50, 100, 200];
    const scores: Record<string, number> = {
      '2-25': 0.74, '2-50': 0.76, '2-100': 0.77, '2-200': 0.77,
      '5-25': 0.83, '5-50': 0.85, '5-100': 0.87, '5-200': 0.87,
      '8-25': 0.81, '8-50': 0.84, '8-100': 0.85, '8-200': 0.86,
      '12-25': 0.77, '12-50': 0.79, '12-100': 0.80, '12-200': 0.81,
    };

    return (
      <div className="space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-center text-xs font-mono tabular-nums border-collapse">
            <thead>
              <tr className="text-slate-600">
                <th className="p-2 text-left">max_depth \ n_est</th>
                {estimators.map((e) => (
                  <th key={e} className="p-2">n={e}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {depths.map((d) => (
                <tr key={d}>
                  <td className="p-2 text-left font-semibold text-slate-700">depth={d}</td>
                  {estimators.map((e) => {
                    const val = scores[`${d}-${e}`];
                    const isBest = d === 5 && e === 100;
                    const isSelected = selectedCell.depth === d && selectedCell.est === e;
                    return (
                      <td key={e} className="p-1">
                        <button
                          type="button"
                          onClick={() => setSelectedCell({ depth: d, est: e, score: val })}
                          className={`w-full py-2 rounded border transition-colors ${
                            isSelected ? 'border-slate-900 ring-1 ring-slate-900' : 'border-slate-200'
                          } ${
                            isBest
                              ? 'bg-emerald-700 text-white font-semibold'
                              : val >= 0.84
                              ? 'bg-emerald-100 text-emerald-950'
                              : 'bg-slate-50 text-slate-800'
                          }`}
                        >
                          {val.toFixed(2)}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 flex flex-wrap justify-between items-center gap-2">
          <span>
            Combinación seleccionada: <strong className="font-mono">max_depth={selectedCell.depth}, n_estimators={selectedCell.est}</strong>
          </span>
          <span className="font-mono font-semibold text-emerald-800">F1 CV = {selectedCell.score.toFixed(2)}</span>
        </div>
      </div>
    );
  }

  if (labType === 'joblib-serialization') {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap sm:inline-flex gap-1 rounded-lg bg-slate-100 p-1 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setSavedScope('estimator')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 text-xs font-medium rounded-md transition-colors text-center ${
              savedScope === 'estimator' ? 'bg-white text-red-800 shadow-sm' : 'text-slate-600'
            }`}
          >
            Guardar solo clf.joblib
          </button>
          <button
            type="button"
            onClick={() => setSavedScope('pipeline')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 text-xs font-medium rounded-md transition-colors text-center ${
              savedScope === 'pipeline' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600'
            }`}
          >
            Guardar pipeline_completo.joblib
          </button>
        </div>

        <div className="p-3 bg-white border border-slate-200 rounded-lg font-mono text-xs space-y-2">
          <div className="text-slate-500">Entrada nueva en producción:</div>
          <div className="text-slate-900">{`{"edad": 41, "ciudad": "Córdoba", "colesterol": null}`}</div>
          <div className={`pt-2 border-t border-slate-100 flex items-start gap-2 font-sans ${savedScope === 'pipeline' ? 'text-emerald-800' : 'text-red-800'}`}>
            {savedScope === 'pipeline' ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />}
            <span>
              {savedScope === 'pipeline'
                ? 'Éxito: El Pipeline imputa colesterol con la mediana de Train, aplica OneHotEncoder a "Córdoba", escala edad y devuelve la predicción.'
                : 'ValueError: could not convert string to float: "Córdoba" — El estimador suelto no sabe imputar nulos ni codificar categorías.'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (labType === 'model-comparison') {
    const models = [
      { name: 'Regresión Logística', recall: 0.79, precision: 0.84, f1: 0.81, interp: 'Alta (coeficientes)' },
      { name: 'KNN (k=7)', recall: 0.74, precision: 0.78, f1: 0.76, interp: 'Media (vecinos)' },
      { name: 'Árbol (depth=5)', recall: 0.82, precision: 0.75, f1: 0.78, interp: 'Alta (reglas claras)' },
      { name: 'Random Forest', recall: 0.89, precision: 0.83, f1: 0.86, interp: 'Media (importancias)' },
    ];

    const recommended =
      priority === 'recall' ? 'Random Forest' : priority === 'precision' ? 'Regresión Logística' : 'Regresión Logística';

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap sm:inline-flex gap-1 rounded-lg bg-slate-100 p-1 w-full sm:w-auto">
          {[
            { id: 'recall', label: 'Priorizar Recall' },
            { id: 'precision', label: 'Priorizar Precision' },
            { id: 'explain', label: 'Priorizar Interpretabilidad' },
          ].map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setPriority(opt.id as 'recall' | 'precision' | 'explain')}
              className={`flex-1 sm:flex-initial px-3 py-1.5 text-xs font-medium rounded-md transition-colors text-center ${
                priority === opt.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-lg bg-white">
          <table className="w-full text-left text-xs tabular-nums">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700">
              <tr>
                <th className="px-3 py-2">Modelo</th>
                <th className="px-3 py-2">Recall</th>
                <th className="px-3 py-2">Precision</th>
                <th className="px-3 py-2">F1-Score</th>
                <th className="px-3 py-2">Interpretabilidad</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {models.map((m) => (
                <tr key={m.name} className={m.name === recommended ? 'bg-emerald-50/70 font-semibold' : ''}>
                  <td className="px-3 py-2">{m.name}</td>
                  <td className="px-3 py-2 font-mono">{m.recall.toFixed(2)}</td>
                  <td className="px-3 py-2 font-mono">{m.precision.toFixed(2)}</td>
                  <td className="px-3 py-2 font-mono">{m.f1.toFixed(2)}</td>
                  <td className="px-3 py-2 text-slate-600">{m.interp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Day 24: Clinical Final Project
  const recallFinal = (clinicalImpute === 'median' ? 0.68 : 0.42) + (clinicalBalanced ? 0.19 : 0);
  const f1Final = (clinicalImpute === 'median' ? 0.65 : 0.44) + (clinicalBalanced ? 0.15 : 0);

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setClinicalImpute(clinicalImpute === 'median' ? 'none' : 'median')}
          className={`p-3 rounded-lg border text-left text-xs transition-colors ${
            clinicalImpute === 'median' ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-white border-slate-200 text-slate-800'
          }`}
        >
          <div className="font-semibold">SimpleImputer(strategy="median")</div>
          <div className="text-slate-600 mt-1">
            {clinicalImpute === 'median' ? 'Activo: recupera pacientes con análisis faltantes.' : 'Inactivo: descartando 30% de pacientes.'}
          </div>
        </button>

        <button
          type="button"
          onClick={() => setClinicalBalanced(!clinicalBalanced)}
          className={`p-3 rounded-lg border text-left text-xs transition-colors ${
            clinicalBalanced ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-white border-slate-200 text-slate-800'
          }`}
        >
          <div className="font-semibold">class_weight="balanced" + stratify=y</div>
          <div className="text-slate-600 mt-1">
            {clinicalBalanced ? 'Activo: pondera la clase clínica minoritaria.' : 'Inactivo: sesgo hacia pacientes sanos.'}
          </div>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-white border border-slate-200 rounded-lg">
          <div className="text-xs text-slate-600">Recall clínico en Test</div>
          <div className={`text-xl font-mono font-semibold tabular-nums mt-1 ${recallFinal >= 0.8 ? 'text-emerald-700' : 'text-amber-700'}`}>
            {(recallFinal * 100).toFixed(0)}%
          </div>
        </div>
        <div className="p-3 bg-white border border-slate-200 rounded-lg">
          <div className="text-xs text-slate-600">F1-Score global</div>
          <div className="text-xl font-mono font-semibold tabular-nums text-slate-900 mt-1">
            {(f1Final * 100).toFixed(0)}%
          </div>
        </div>
      </div>
    </div>
  );
};
