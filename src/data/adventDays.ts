export type WeekNumber = 1 | 2 | 3 | 4;

export type LabType =
  | 'pandas-inspector'
  | 'nulls-imputation'
  | 'feature-engineering'
  | 'categorical-encoding'
  | 'feature-scaling'
  | 'train-test-leakage'
  | 'linear-regression-fit'
  | 'regression-metrics'
  | 'times-listed-comparison'
  | 'logistic-sigmoid'
  | 'confusion-matrix'
  | 'imbalanced-metrics'
  | 'knn-canvas'
  | 'knn-scaling'
  | 'decision-tree-depth'
  | 'random-forest-ensemble'
  | 'kmeans-stepper'
  | 'kmeans-real-datasets'
  | 'pre-entrega-checklist'
  | 'sklearn-pipeline'
  | 'gridsearch-heatmap'
  | 'joblib-serialization'
  | 'model-comparison'
  | 'clinical-final-project';

export interface QuizQuestion {
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface AdventDay {
  day: number;
  week: WeekNumber;
  weekLabel: string;
  claseLabel: string;
  topic: string;
  title: string;
  subtitle: string;
  notebookTitle: string;
  notebookUrl: string;
  colabUrl: string;
  labType: LabType;
  labTitle: string;
  labInstruction: string;
  conceptSummary: string;
  keyTakeaway: string;
  codeSnippet: string;
  quiz: QuizQuestion;
}

const REPO_BLOB = 'https://github.com/VintaBytes/Ciencia-de-datos/blob/main/cursos/machine-learning-python2';
const COLAB_BASE = 'https://colab.research.google.com/github/VintaBytes/Ciencia-de-datos/blob/main/cursos/machine-learning-python2';

export const WEEK_NAMES: Record<WeekNumber, string> = {
  1: 'Semana 1 · Datos y Preparación',
  2: 'Semana 2 · Regresión y Clasificación',
  3: 'Semana 3 · Vecinos, Árboles y Clustering',
  4: 'Semana 4 · Pipelines y Proyecto Final',
};

export const ADVENT_DAYS: AdventDay[] = [
  {
    day: 1,
    week: 1,
    weekLabel: WEEK_NAMES[1],
    claseLabel: 'Clase 01',
    topic: 'Ingesta de datos',
    title: 'Lectura de archivos con Pandas',
    subtitle: 'Cómo cargar datasets CSV en Google Colab sin romper delimitadores ni tipos de datos.',
    notebookTitle: 'Lectura de archivos con Pandas',
    notebookUrl: `${REPO_BLOB}/Clase01/Lectura_archivos_con_Pandas.ipynb`,
    colabUrl: `${COLAB_BASE}/Clase01/Lectura_archivos_con_Pandas.ipynb`,
    labType: 'pandas-inspector',
    labTitle: 'Inspector de lectura CSV (pd.read_csv)',
    labInstruction: 'Alterna el delimitador y el parámetro decimal para corregir la tabla importada.',
    conceptSummary:
      'Todo flujo de Machine Learning empieza cargando datos de forma confiable. Inspeccionar df.shape, df.info() y df.head() evita arrastrar columnas mal separadas o números leídos como texto.',
    keyTakeaway: 'Si un CSV europeo o bancario usa ";" y coma decimal, especificar sep=";" y decimal="," evita columnas object erróneas.',
    codeSnippet: `import pandas as pd

df = pd.read_csv("juegos_ml.csv", sep=",", encoding="utf-8")
print(df.shape)
df.info()
df.head(5)`,
    quiz: {
      prompt: 'Cargás un CSV y df.info() muestra todas las columnas juntas en una sola columna llamada "id;titulo;rating". ¿Qué parámetro faltó en pd.read_csv()?',
      options: [
        'sep=";" para indicar el delimitador real del archivo',
        'index_col=0 para borrar la primera fila',
        'dropna=True para limpiar espacios vacíos',
        'header=None para ocultar los títulos',
      ],
      correctIndex: 0,
      explanation: 'Por defecto pd.read_csv() asume comas (","). Cuando el archivo está separado por punto y coma, debemos pasar sep=";".',
    },
  },
  {
    day: 2,
    week: 1,
    weekLabel: WEEK_NAMES[1],
    claseLabel: 'Clase 04',
    topic: 'Limpieza de datos',
    title: 'Exploración y limpieza de valores nulos',
    subtitle: 'Detectar NaN, duplicados y valores atípicos antes de entrenar cualquier modelo.',
    notebookTitle: 'Exploración y limpieza de datos',
    notebookUrl: `${REPO_BLOB}/Clase04/Preparaci%C3%B3n_de_datos_para_Machine_Learning_exploraci%C3%B3n_y_limpieza.ipynb`,
    colabUrl: `${COLAB_BASE}/Clase04/Preparaci%C3%B3n_de_datos_para_Machine_Learning_exploraci%C3%B3n_y_limpieza.ipynb`,
    labType: 'nulls-imputation',
    labTitle: 'Simulador de imputación y outliers',
    labInstruction: 'Prueba distintas estrategias para tratar valores nulos y observa cómo cambia la media cuando hay un valor extremo.',
    conceptSummary:
      'Scikit-Learn falla ante valores NaN en la mayoría de sus estimadores. Elegir entre eliminar filas o imputar con media, mediana o moda depende de la presencia de outliers y de cuántos datos perderíamos.',
    keyTakeaway: 'Ante distribuciones asimétricas o con outliers extremos, la mediana es mucho más robusta que la media.',
    codeSnippet: `# Detectar nulos y duplicados
print(df.isna().sum())
df = df.drop_duplicates()

# Imputar con la mediana (robusta frente a outliers)
mediana_horas = df["horas_jugadas"].median()
df["horas_jugadas"] = df["horas_jugadas"].fillna(mediana_horas)`,
    quiz: {
      prompt: 'Tenés una columna de ingresos con 5% de nulos y algunos salarios altísimos (outliers). ¿Qué estrategia de imputación conserva el tamaño del dataset sin distorsionar el centro?',
      options: [
        'Imputar con la media aritmética',
        'Imputar con la mediana',
        'Rellenar todos los nulos con 0',
        'Eliminar toda la columna ingresos',
      ],
      correctIndex: 1,
      explanation: 'La mediana no se ve arrastrada por valores extremos aislados, a diferencia de la media.',
    },
  },
  {
    day: 3,
    week: 1,
    weekLabel: WEEK_NAMES[1],
    claseLabel: 'Clase 04',
    topic: 'Feature Engineering',
    title: 'Creación de variables derivadas',
    subtitle: 'Extraer señales útiles a partir de fechas, proporciones y combinaciones de columnas.',
    notebookTitle: 'Transformación de datos: el primer paso hacia el modelo',
    notebookUrl: `${REPO_BLOB}/Clase04/Transformacion_de_datos_el_primer_paso_hacia_el_modelo.ipynb`,
    colabUrl: `${COLAB_BASE}/Clase04/Transformacion_de_datos_el_primer_paso_hacia_el_modelo.ipynb`,
    labType: 'feature-engineering',
    labTitle: 'Constructor de variables derivadas',
    labInstruction: 'Activa nuevas variables calculadas y observa cómo mejora la correlación con la variable objetivo.',
    conceptSummary:
      'Los modelos lineales y basados en distancia no entienden cadenas de fecha ni relaciones implícitas. Convertir fechas en antigüedad o combinar conteos en ratios suele aportar más valor que cambiar de algoritmo.',
    keyTakeaway: 'Un buen Feature Engineering transforma datos crudos en señales directamente interpretables por el modelo.',
    codeSnippet: `df["fecha_lanzamiento"] = pd.to_datetime(df["fecha_lanzamiento"])
df["anio"] = df["fecha_lanzamiento"].dt.year
df["antiguedad"] = 2026 - df["anio"]
df["ratio_wishlist_plays"] = df["wishlist"] / (df["plays"] + 1)`,
    quiz: {
      prompt: '¿Por qué convertimos una columna de texto "2021-05-14" en columnas numéricas como "anio" o "antiguedad"?',
      options: [
        'Porque Pandas no permite guardar strings en memoria',
        'Porque los algoritmos necesitan representaciones numéricas con significado cuantitativo',
        'Para que el archivo CSV pese más megabytes',
        'Para eliminar automáticamente los valores faltantes',
      ],
      correctIndex: 1,
      explanation: 'Los modelos matemáticos operan sobre números. Extraer año, mes o antigüedad expone patrones temporales explícitos.',
    },
  },
  {
    day: 4,
    week: 1,
    weekLabel: WEEK_NAMES[1],
    claseLabel: 'Clase 04',
    topic: 'Codificación categórica',
    title: 'Label Encoding vs One-Hot Encoding',
    subtitle: 'Cómo traducir categorías a números sin inventar un orden jerárquico falso.',
    notebookTitle: 'Transformación de datos: el primer paso hacia el modelo',
    notebookUrl: `${REPO_BLOB}/Clase04/Transformacion_de_datos_el_primer_paso_hacia_el_modelo.ipynb`,
    colabUrl: `${COLAB_BASE}/Clase04/Transformacion_de_datos_el_primer_paso_hacia_el_modelo.ipynb`,
    labType: 'categorical-encoding',
    labTitle: 'Comparador Label vs One-Hot Encoding',
    labInstruction: 'Cambia entre ambos codificadores y verifica qué relación numérica interpreta el modelo entre categorías.',
    conceptSummary:
      'Si asignamos 0=RPG, 1=Indie, 2=Acción con Label Encoding, un modelo lineal o KNN creerá que Acción es el doble de Indie y que Indie está "en el medio". Para variables nominales sin orden real se usa One-Hot Encoding.',
    keyTakeaway: 'Usa One-Hot Encoding para categorías nominales (X) y reserva Label Encoding para el target o variables ordinales.',
    codeSnippet: `from sklearn.preprocessing import OneHotEncoder

encoder = OneHotEncoder(sparse_output=False, handle_unknown="ignore")
genero_encoded = encoder.fit_transform(df[["genero"]])`,
    quiz: {
      prompt: 'Querés codificar la variable predictora "Ciudad" (Buenos Aires, Córdoba, Rosario) para una Regresión Logística. ¿Qué técnica corresponde?',
      options: [
        'Label Encoding (0, 1, 2)',
        'One-Hot Encoding (columnas binarias 0/1 por ciudad)',
        'StandardScaler directamente sobre el texto',
        'Borrar la variable para no complicar el código',
      ],
      correctIndex: 1,
      explanation: 'Las ciudades no tienen un orden numérico natural; One-Hot Encoding evita que el modelo asuma que Rosario > Córdoba > Buenos Aires.',
    },
  },
  {
    day: 5,
    week: 1,
    weekLabel: WEEK_NAMES[1],
    claseLabel: 'Clase 04',
    topic: 'Escalamiento',
    title: 'Normalización vs Estandarización',
    subtitle: 'Poner todas las variables numéricas en escalas comparables con MinMaxScaler y StandardScaler.',
    notebookTitle: 'Transformación de datos: el primer paso hacia el modelo',
    notebookUrl: `${REPO_BLOB}/Clase04/Transformacion_de_datos_el_primer_paso_hacia_el_modelo.ipynb`,
    colabUrl: `${COLAB_BASE}/Clase04/Transformacion_de_datos_el_primer_paso_hacia_el_modelo.ipynb`,
    labType: 'feature-scaling',
    labTitle: 'Laboratorio de escaladores (MinMax vs Standard)',
    labInstruction: 'Alterna entre datos crudos, MinMaxScaler y StandardScaler para comparar cómo se alinean Edad y Salario.',
    conceptSummary:
      'MinMaxScaler comprime los valores al rango [0, 1], ideal cuando necesitamos cotas fijas. StandardScaler centra los datos en media 0 y desviación estándar 1, siendo mucho menos sensible a valores atípicos.',
    keyTakeaway: 'StandardScaler conserva mejor la geometría frente a outliers; MinMaxScaler acota estrictamente entre 0 y 1.',
    codeSnippet: `from sklearn.preprocessing import StandardScaler, MinMaxScaler

std_scaler = StandardScaler()
X_std = std_scaler.fit_transform(X_train[["edad", "salario"]])

mm_scaler = MinMaxScaler()
X_mm = mm_scaler.fit_transform(X_train[["edad", "salario"]])`,
    quiz: {
      prompt: '¿Qué transformación centra cada variable en media 0 y desviación estándar 1?',
      options: [
        'MinMaxScaler',
        'OneHotEncoder',
        'StandardScaler',
        'SimpleImputer',
      ],
      correctIndex: 2,
      explanation: 'StandardScaler calcula z = (x - μ) / σ, dejando la media en 0 y la desviación estándar en 1.',
    },
  },
  {
    day: 6,
    week: 1,
    weekLabel: WEEK_NAMES[1],
    claseLabel: 'Clase 05',
    topic: 'Partición y fuga de datos',
    title: 'División Train/Test y Data Leakage',
    subtitle: 'Separar entrenamiento y prueba antes de transformar para obtener métricas honestas.',
    notebookTitle: 'División y validación del dataset',
    notebookUrl: `${REPO_BLOB}/Clase05/Division_y_validacion_del_dataset.ipynb`,
    colabUrl: `${COLAB_BASE}/Clase05/Division_y_validacion_del_dataset.ipynb`,
    labType: 'train-test-leakage',
    labTitle: 'Detector de Data Leakage',
    labInstruction: 'Compara escalar antes del split (fuga de datos) contra escalar ajustando solo sobre Train.',
    conceptSummary:
      'Evaluar un modelo sobre los mismos datos con los que entrenó da una ilusión de perfección. Más sutil aún es el Data Leakage: si calculas medias o escaladores con todo el dataset antes de dividir, información del Test se filtra al entrenamiento.',
    keyTakeaway: 'Regla de oro: siempre split primero; fit_transform solo en X_train y únicamente transform en X_test.',
    codeSnippet: `from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)
scaler = StandardScaler()
X_train_sc = scaler.fit_transform(X_train)
X_test_sc = scaler.transform(X_test)  # ¡Solo transform!`,
    quiz: {
      prompt: '¿Cuál es el orden correcto para evitar Data Leakage al estandarizar tus variables?',
      options: [
        'Aplicar fit_transform a todo X, y luego hacer train_test_split',
        'Hacer train_test_split primero, fit_transform en X_train y transform en X_test',
        'Aplicar fit_transform por separado en X_train y en X_test',
        'Escalar únicamente y_test antes de predecir',
      ],
      correctIndex: 1,
      explanation: 'Los parámetros (media y desvío) deben aprenderse únicamente de X_train para no filtrar estadísticas de X_test.',
    },
  },
  {
    day: 7,
    week: 2,
    weekLabel: WEEK_NAMES[2],
    claseLabel: 'Clase 06',
    topic: 'Regresión supervisada',
    title: 'Regresión Lineal: recta de mejor ajuste',
    subtitle: 'Comprender pendiente, intercepto y residuos en el primer modelo supervisado.',
    notebookTitle: 'Regresión lineal y evaluación de modelos',
    notebookUrl: `${REPO_BLOB}/Clase06/cuaderno-05-regresion-lineal-y-evaluacion-del-modelo.ipynb`,
    colabUrl: `${COLAB_BASE}/Clase06/cuaderno-05-regresion-lineal-y-evaluacion-del-modelo.ipynb`,
    labType: 'linear-regression-fit',
    labTitle: 'Ajuste interactivo de Regresión Lineal',
    labInstruction: 'Mueve la pendiente (w) y el intercepto (b) para minimizar los residuos verticales y el error MSE.',
    conceptSummary:
      'La regresión lineal busca predecir un valor numérico continuo y = w·x + b minimizando la suma de los errores al cuadrado entre los valores reales y la recta estimada.',
    keyTakeaway: 'Cada segmento vertical entre un punto y la recta es un residuo (y - ŷ); OLS encuentra la recta que minimiza su cuadrado promedio.',
    codeSnippet: `from sklearn.linear_model import LinearRegression

modelo = LinearRegression()
modelo.fit(X_train, y_train)
print("Pendiente (coef_):", modelo.coef_)
print("Intercepto:", modelo.intercept_)
y_pred = modelo.predict(X_test)`,
    quiz: {
      prompt: 'En una regresión lineal y = 2.5x + 10, ¿qué representa el coeficiente 2.5?',
      options: [
        'El porcentaje de aciertos del modelo',
        'Cuánto cambia en promedio la predicción y por cada unidad que aumenta x',
        'La cantidad mínima de datos necesarios en Train',
        'El error cuadrático medio sobre el conjunto de prueba',
      ],
      correctIndex: 1,
      explanation: 'La pendiente (w = 2.5) indica la tasa de cambio esperada en la variable objetivo por cada incremento unitario en x.',
    },
  },
  {
    day: 8,
    week: 2,
    weekLabel: WEEK_NAMES[2],
    claseLabel: 'Clase 06',
    topic: 'Métricas de regresión',
    title: 'MAE, MSE, RMSE y R² en acción',
    subtitle: 'Cómo interpretar la magnitud del error y por qué MSE castiga fuerte los errores grandes.',
    notebookTitle: 'Regresión lineal y evaluación de modelos',
    notebookUrl: `${REPO_BLOB}/Clase06/cuaderno-05-regresion-lineal-y-evaluacion-del-modelo.ipynb`,
    colabUrl: `${COLAB_BASE}/Clase06/cuaderno-05-regresion-lineal-y-evaluacion-del-modelo.ipynb`,
    labType: 'regression-metrics',
    labTitle: 'Laboratorio de sensibilidad a outliers (MAE vs RMSE)',
    labInstruction: 'Activa o desplaza un punto atípico y observa la diferencia entre el crecimiento lineal del MAE y cuadrático del MSE/RMSE.',
    conceptSummary:
      'MAE mide el error absoluto promedio en las unidades originales. MSE eleva cada error al cuadrado (penalizando errores graves), RMSE devuelve la raíz cuadrada para volver a la escala original, y R² indica qué proporción de la varianza explica el modelo.',
    keyTakeaway: 'Cuando un error grande cuesta mucho más que varios errores pequeños, observa RMSE antes que solo MAE.',
    codeSnippet: `from sklearn.metrics import mean_absolute_error, root_mean_squared_error, r2_score

mae = mean_absolute_error(y_test, y_pred)
rmse = root_mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)`,
    quiz: {
      prompt: 'Si tu modelo comete un único error muy grande sobre un outlier, ¿qué métrica se dispara proporcionalmente más?',
      options: [
        'MAE (Mean Absolute Error)',
        'MSE (Mean Squared Error)',
        'Mediana de los residuos',
        'Número de filas en y_test',
      ],
      correctIndex: 1,
      explanation: 'Al elevar las diferencias al cuadrado, un error de 10 aporta 100 al MSE frente a solo 10 en MAE.',
    },
  },
  {
    day: 9,
    week: 2,
    weekLabel: WEEK_NAMES[2],
    claseLabel: 'Clase 06 (B)',
    topic: 'Diagnóstico del target',
    title: 'La venganza de Times Listed',
    subtitle: 'Por qué predecir Rating dio R² ≈ 0.24 mientras que Times Listed cambia drásticamente el ajuste.',
    notebookTitle: 'Regresión lineal y evaluación de modelos II - "La venganza de Times Listed"',
    notebookUrl: `${REPO_BLOB}/Clase06/cuaderno-05b-regresion-times-listed.ipynb`,
    colabUrl: `${COLAB_BASE}/Clase06/cuaderno-05b-regresion-times-listed.ipynb`,
    labType: 'times-listed-comparison',
    labTitle: 'Comparador Rating vs Times Listed',
    labInstruction: 'Cambia la variable objetivo entre Rating y Times Listed para analizar por qué las variables explicativas funcionan distinto.',
    conceptSummary:
      'En el cuaderno de videojuegos vimos un hallazgo clave: un modelo lineal no puede explicar bien una variable (Rating, R² ≈ 0.24) si sus features disponibles no guardan relación lineal con ella, pero al cambiar el target a Times Listed la señal lineal de Plays y Wishlist eleva el R².',
    keyTakeaway: 'Un R² bajo no siempre significa "mal código": muchas veces indica que el fenómeno es no lineal o faltan variables explicativas.',
    codeSnippet: `# Experimento A: Target = Rating -> R2 ≈ 0.2375
# Experimento B: Target = Times Listed -> Mayor capacidad explicativa
X = df[["Plays", "Playing", "Backlogs", "Wishlist"]]
y = df["Times Listed"]`,
    quiz: {
      prompt: 'Al predecir "Rating" obtuvimos R² ≈ 0.24, pero al predecir "Times Listed" con métricas de interacción obtuvimos un R² mucho mayor. ¿Qué enseña esto?',
      options: [
        'Que LinearRegression tiene un bug con números decimales',
        'Que la capacidad explicativa depende de si las features realmente contienen señal lineal respecto al target elegido',
        'Que siempre hay que cambiar el target hasta obtener R² = 1.0',
        'Que Rating no debería tener valores entre 1 y 5',
      ],
      correctIndex: 1,
      explanation: 'La calidad subjetiva (Rating) depende de factores no presentes en conteos de uso; en cambio Times Listed sí está fuertemente acoplado a Wishlist y Backlogs.',
    },
  },
  {
    day: 10,
    week: 2,
    weekLabel: WEEK_NAMES[2],
    claseLabel: 'Clase 07',
    topic: 'Clasificación binaria',
    title: 'Regresión Logística y función Sigmoide',
    subtitle: 'De predecir "cuánto" a estimar probabilidades entre 0 y 1 para decidir entre dos clases.',
    notebookTitle: 'Regresión Logística y Métricas de Evaluación',
    notebookUrl: `${REPO_BLOB}/Clase07/cuaderno_06_regresion_logistica_y_evaluacion_del_modelo_corregido.ipynb`,
    colabUrl: `${COLAB_BASE}/Clase07/cuaderno_06_regresion_logistica_y_evaluacion_del_modelo_corregido.ipynb`,
    labType: 'logistic-sigmoid',
    labTitle: 'Explorador de curva Sigmoide y Umbral',
    labInstruction: 'Ajusta el umbral de decisión (0.10 a 0.90) y la pendiente para ver qué casos pasan a clasificarse como Clase 1.',
    conceptSummary:
      'Aunque lleva "regresión" en el nombre, la Regresión Logística resuelve problemas de clasificación. Aplica la función sigmoide σ(z) = 1 / (1 + e⁻ᶻ) para devolver probabilidades entre 0 y 1, que luego comparamos contra un umbral (por defecto 0.5).',
    keyTakeaway: 'predict_proba() entrega probabilidades continuas; el umbral (threshold) define el punto de corte según el costo de cada error.',
    codeSnippet: `from sklearn.linear_model import LogisticRegression

clf = LogisticRegression(max_iter=1000)
clf.fit(X_train_sc, y_train)
probs = clf.predict_proba(X_test_sc)[:, 1]
preds_umbral_035 = (probs >= 0.35).astype(int)`,
    quiz: {
      prompt: '¿Qué salida produce clf.predict_proba(X_test) en una Regresión Logística binaria?',
      options: [
        'Únicamente ceros y unos sin decimales',
        'Las probabilidades estimadas para cada clase (sumando 1 por fila)',
        'El valor de R² de cada observación',
        'Los nombres de las columnas más importantes',
      ],
      correctIndex: 1,
      explanation: 'predict_proba devuelve un arreglo con P(clase=0) y P(clase=1), permitiéndote ajustar el umbral de decisión manualmente.',
    },
  },
  {
    day: 11,
    week: 2,
    weekLabel: WEEK_NAMES[2],
    claseLabel: 'Clase 07',
    topic: 'Evaluación de clasificación',
    title: 'Matriz de Confusión: TP, FP, TN y FN',
    subtitle: 'Desarmar los aciertos y los dos tipos distintos de error que puede cometer un clasificador.',
    notebookTitle: 'Regresión Logística y Métricas de Evaluación',
    notebookUrl: `${REPO_BLOB}/Clase07/cuaderno_06_regresion_logistica_y_evaluacion_del_modelo_corregido.ipynb`,
    colabUrl: `${COLAB_BASE}/Clase07/cuaderno_06_regresion_logistica_y_evaluacion_del_modelo_corregido.ipynb`,
    labType: 'confusion-matrix',
    labTitle: 'Matriz de Confusión interactiva',
    labInstruction: 'Mueve el umbral de decisión en un caso clínico y analiza el intercambio entre Falsos Positivos y Falsos Negativos.',
    conceptSummary:
      'No todos los errores cuestan lo mismo. En diagnóstico médico, un Falso Negativo (no detectar a alguien enfermo) suele ser mucho más grave que un Falso Positivo (pedir un estudio adicional).',
    keyTakeaway: 'La matriz de confusión separa Verdaderos Positivos (TP), Verdaderos Negativos (TN), Falsos Positivos (FP) y Falsos Negativos (FN).',
    codeSnippet: `from sklearn.metrics import confusion_matrix, ConfusionMatrixDisplay

cm = confusion_matrix(y_test, y_pred)
# [[TN, FP],
#  [FN, TP]]
print(cm)`,
    quiz: {
      prompt: 'En un filtro de fraude bancario, la clase positiva (1) es "Fraude". Si una transacción legítima es bloqueada erróneamente como fraude, ¿qué tipo de error es?',
      options: [
        'Verdadero Positivo (TP)',
        'Falso Positivo (FP)',
        'Falso Negativo (FN)',
        'Verdadero Negativo (TN)',
      ],
      correctIndex: 1,
      explanation: 'El modelo predijo positivo (Fraude), pero la realidad era negativa (Legítima): es un Falso Positivo (Error Tipo I).',
    },
  },
  {
    day: 12,
    week: 2,
    weekLabel: WEEK_NAMES[2],
    claseLabel: 'Clase 07',
    topic: 'Métricas de clasificación',
    title: 'Accuracy, Precision, Recall y F1-Score',
    subtitle: 'Por qué el Accuracy engaña en clases desbalanceadas y cuándo priorizar Precision o Recall.',
    notebookTitle: 'Regresión Logística y Métricas de Evaluación',
    notebookUrl: `${REPO_BLOB}/Clase07/cuaderno_06_regresion_logistica_y_evaluacion_del_modelo_corregido.ipynb`,
    colabUrl: `${COLAB_BASE}/Clase07/cuaderno_06_regresion_logistica_y_evaluacion_del_modelo_corregido.ipynb`,
    labType: 'imbalanced-metrics',
    labTitle: 'Simulador de la trampa del Accuracy',
    labInstruction: 'Alterna entre un dataset balanceado (50/50) y uno desbalanceado (95/5) para ver cómo un modelo inútil logra 95% de Accuracy.',
    conceptSummary:
      'Precision = TP / (TP + FP) mide qué tan confiables son tus alarmas positivas. Recall = TP / (TP + FN) mide cuántos positivos reales lograste capturar. F1-Score es la media armónica que exige equilibrio entre ambos.',
    keyTakeaway: 'Con 95% de casos negativos, predecir siempre "0" da 95% de Accuracy pero 0% de Recall. Nunca mires Accuracy aislado.',
    codeSnippet: `from sklearn.metrics import classification_report

print(classification_report(y_test, y_pred))`,
    quiz: {
      prompt: 'Estás entrenando un detector de incendios forestales (clase 1 = Fuego). No querés que se escape ningún incendio real. ¿Qué métrica debes maximizar prioritariamente?',
      options: [
        'Recall (Sensibilidad)',
        'Specificity únicamente',
        'R² ajustado',
        'Accuracy global sin mirar la matriz',
      ],
      correctIndex: 0,
      explanation: 'Maximizar Recall minimiza los Falsos Negativos (incendios reales sin detectar).',
    },
  },
  {
    day: 13,
    week: 3,
    weekLabel: WEEK_NAMES[3],
    claseLabel: 'Clase 08',
    topic: 'Clasificación por cercanía',
    title: 'KNN: K-Nearest Neighbors',
    subtitle: 'Clasificar por votación de los k vecinos más cercanos y el efecto de elegir k.',
    notebookTitle: 'Clasificación con KNN (K-Nearest Neighbors)',
    notebookUrl: `${REPO_BLOB}/Clase08/Cuaderno07_Clasificacion_con_KNN_(K_Nearest_Neighbors).ipynb`,
    colabUrl: `${COLAB_BASE}/Clase08/Cuaderno07_Clasificacion_con_KNN_(K_Nearest_Neighbors).ipynb`,
    labType: 'knn-canvas',
    labTitle: 'Lienzo interactivo de votación KNN',
    labInstruction: 'Haz clic en cualquier punto del plano para ubicar una nueva observación y cambia el valor de k (1 a 15).',
    conceptSummary:
      'KNN es un algoritmo basado en instancias: no ajusta una ecuación global, sino que guarda los datos de entrenamiento y clasifica cada nuevo punto según la mayoría de sus k vecinos más próximos en distancia euclidiana.',
    keyTakeaway: 'Un k muy pequeño (k=1) vuelve el modelo hipersensible al ruido; un k muy grande suaviza en exceso la frontera.',
    codeSnippet: `from sklearn.neighbors import KNeighborsClassifier

knn = KNeighborsClassifier(n_neighbors=5)
knn.fit(X_train_sc, y_train)
y_pred = knn.predict(X_test_sc)`,
    quiz: {
      prompt: '¿Qué suele ocurrir cuando elegimos k = 1 en K-Nearest Neighbors?',
      options: [
        'El modelo ignora todos los puntos de entrenamiento',
        'Aumenta el riesgo de sobreajuste (overfitting) por sensibilidad al ruido local',
        'Siempre predice la clase mayoritaria global',
        'Deja de necesitar cálculo de distancias',
      ],
      correctIndex: 1,
      explanation: 'Con k=1, un solo punto atípico o mal etiquetado crea una isla de decisión errónea a su alrededor.',
    },
  },
  {
    day: 14,
    week: 3,
    weekLabel: WEEK_NAMES[3],
    claseLabel: 'Clase 08',
    topic: 'Escalamiento en distancias',
    title: '¿Por qué KNN exige escalar variables?',
    subtitle: 'Cuando una variable en miles aplasta por completo a una variable medida en unidades.',
    notebookTitle: 'Clasificación con KNN (K-Nearest Neighbors)',
    notebookUrl: `${REPO_BLOB}/Clase08/Cuaderno07_Clasificacion_con_KNN_(K_Nearest_Neighbors).ipynb`,
    colabUrl: `${COLAB_BASE}/Clase08/Cuaderno07_Clasificacion_con_KNN_(K_Nearest_Neighbors).ipynb`,
    labType: 'knn-scaling',
    labTitle: 'Impacto de la escala en distancias KNN',
    labInstruction: 'Alterna entre "Datos sin escalar" y "Con StandardScaler" para ver cómo cambian los vecinos más cercanos.',
    conceptSummary:
      'En la distancia euclidiana √((Δedad)² + (Δsalario)²), una diferencia de $5.000 en salario equivale a 25.000.000 en el cuadrado, mientras 10 años de edad aportan apenas 100. Sin escalar, KNN prácticamente ignora la edad.',
    keyTakeaway: 'Todo algoritmo basado en distancias (KNN, K-Means, SVM) requiere estandarización previa de sus variables numéricas.',
    codeSnippet: `# Sin escalar: Salario ($50,000 - $52,000) domina sobre Edad (25 - 55)
# Solución: Pipeline con StandardScaler antes de KNN
from sklearn.pipeline import make_pipeline
modelo_knn = make_pipeline(StandardScaler(), KNeighborsClassifier(n_neighbors=5))`,
    quiz: {
      prompt: 'Tenés dos features: "Edad" (18 a 70) y "Ingreso anual" (500.000 a 9.000.000). Si entrenás KNN sin escalar, ¿qué pasa?',
      options: [
        'La distancia queda dominada casi por completo por Ingreso anual',
        'KNN escala automáticamente todas las variables internas',
        'La Edad pesa más por tener números más chicos',
        'El algoritmo se convierte en un Árbol de Decisión',
      ],
      correctIndex: 0,
      explanation: 'Las diferencias absolutas en millones dominan la suma de cuadrados de la distancia euclidiana.',
    },
  },
  {
    day: 15,
    week: 3,
    weekLabel: WEEK_NAMES[3],
    claseLabel: 'Clase 09',
    topic: 'Modelos basados en árboles',
    title: 'Árboles de Decisión y Sobreajuste',
    subtitle: 'Reglas si-entonces, profundidad máxima (max_depth) y curva Train vs Validación.',
    notebookTitle: 'Árboles de Decisión y Random Forest',
    notebookUrl: `${REPO_BLOB}/Clase09/Cuaderno08_%C3%81rboles_de_Decisi%C3%B3n_y_Random_Forest.ipynb`,
    colabUrl: `${COLAB_BASE}/Clase09/Cuaderno08_%C3%81rboles_de_Decisi%C3%B3n_y_Random_Forest.ipynb`,
    labType: 'decision-tree-depth',
    labTitle: 'Control de profundidad max_depth',
    labInstruction: 'Desliza max_depth de 1 a 12 para identificar las zonas de Subajuste (Underfitting), Punto Óptimo y Sobreajuste (Overfitting).',
    conceptSummary:
      'Un Árbol de Decisión divide los datos mediante preguntas secuenciales buscando reducir la impureza (Gini o Entropía). Si no limitamos su profundidad, memorizará cada ejemplo de Train (100% en Train, pobre generalización en Test).',
    keyTakeaway: 'Controlar hiperparámetros como max_depth y min_samples_leaf evita que el árbol memorice el ruido.',
    codeSnippet: `from sklearn.tree import DecisionTreeClassifier

arbol = DecisionTreeClassifier(max_depth=4, min_samples_leaf=5, random_state=42)
arbol.fit(X_train, y_train)`,
    quiz: {
      prompt: 'Un árbol sin límite de profundidad logra 99.8% de accuracy en Train y 66% en Test. ¿Qué está ocurriendo?',
      options: [
        'Underfitting (subajuste)',
        'Overfitting (sobreajuste)',
        'Data Leakage perfecto',
        'Falta de One-Hot Encoding en y_test',
      ],
      correctIndex: 1,
      explanation: 'La gran brecha entre un Train casi perfecto y un Test bajo es el síntoma clásico de Overfitting.',
    },
  },
  {
    day: 16,
    week: 3,
    weekLabel: WEEK_NAMES[3],
    claseLabel: 'Clase 09',
    topic: 'Ensambles de árboles',
    title: 'Random Forest e importancia de variables',
    subtitle: 'Combinar cientos de árboles diversos para reducir la varianza y medir qué features importan.',
    notebookTitle: 'Árboles de Decisión y Random Forest',
    notebookUrl: `${REPO_BLOB}/Clase09/Cuaderno08_%C3%81rboles_de_Decisi%C3%B3n_y_Random_Forest.ipynb`,
    colabUrl: `${COLAB_BASE}/Clase09/Cuaderno08_%C3%81rboles_de_Decisi%C3%B3n_y_Random_Forest.ipynb`,
    labType: 'random-forest-ensemble',
    labTitle: 'Simulador de ensamble Random Forest',
    labInstruction: 'Cambia la cantidad de árboles (n_estimators) y observa la votación mayoritaria y el ranking de feature_importances_.',
    conceptSummary:
      'Random Forest entrena múltiples árboles sobre submuestras aleatorias de filas y columnas (bagging + aleatoriedad de features). Al promediar o votar entre muchos árboles no correlacionados, reduce drásticamente el sobreajuste respecto a un árbol único.',
    keyTakeaway: 'Además de mejorar la estabilidad, feature_importances_ nos ayuda a interpretar qué variables guiaron las particiones.',
    codeSnippet: `from sklearn.ensemble import RandomForestClassifier

rf = RandomForestClassifier(n_estimators=100, max_depth=6, random_state=42)
rf.fit(X_train, y_train)
importancias = pd.Series(rf.feature_importances_, index=X.columns)`,
    quiz: {
      prompt: '¿Cuál es la ventaja principal de Random Forest frente a un único Árbol de Decisión profundo?',
      options: [
        'No requiere dividir en Train y Test',
        'Reduce la varianza y el sobreajuste al combinar múltiples árboles entrenados con aleatoriedad',
        'Garantiza 100% de accuracy en cualquier dataset',
        'Funciona únicamente para aprendizaje no supervisado',
      ],
      correctIndex: 1,
      explanation: 'Promediar o votar entre árboles diversos cancela errores individuales y estabiliza las predicciones.',
    },
  },
  {
    day: 17,
    week: 3,
    weekLabel: WEEK_NAMES[3],
    claseLabel: 'Clase 11 (A)',
    topic: 'Aprendizaje no supervisado',
    title: 'K-Means con datos sintéticos',
    subtitle: 'Cómo descubre grupos el algoritmo iterativo de centroides cuando no hay etiquetas y.',
    notebookTitle: 'Cuaderno A · Introducción al clustering con datos sintéticos',
    notebookUrl: `${REPO_BLOB}/Clase11/Cuaderno09A_K_Means_DatosSinteticos.ipynb`,
    colabUrl: `${COLAB_BASE}/Clase11/Cuaderno09A_K_Means_DatosSinteticos.ipynb`,
    labType: 'kmeans-stepper',
    labTitle: 'Simulador paso a paso de K-Means',
    labInstruction: 'Elige K y ejecuta paso a paso "Asignar puntos" y "Recalcular centroides" hasta converger.',
    conceptSummary:
      'En aprendizaje no supervisado no tenemos variable objetivo y. K-Means inicializa K centroides y alterna dos pasos: 1) asignar cada punto al centroide más cercano, y 2) mover cada centroide al promedio de sus puntos asignados.',
    keyTakeaway: 'Al igual que KNN, K-Means usa distancias euclidianas: recuerda escalar tus variables antes de agrupar.',
    codeSnippet: `from sklearn.cluster import KMeans

kmeans = KMeans(n_clusters=3, n_init="auto", random_state=42)
clusters = kmeans.fit_predict(X_scaled)
print("Inercia:", kmeans.inertia_)`,
    quiz: {
      prompt: 'En K-Means, ¿qué ocurre durante el paso de actualización de centroides?',
      options: [
        'Se eliminan los puntos más lejanos del gráfico',
        'Cada centroide se mueve a la posición promedio (media) de los puntos asignados a su clúster',
        'Se cambia el valor de K automáticamente',
        'Se comparan las etiquetas predichas contra y_test',
      ],
      correctIndex: 1,
      explanation: 'Cada centroide se recalcula como el baricentro de las observaciones pertenecientes a ese grupo hasta que ya no cambia.',
    },
  },
  {
    day: 18,
    week: 3,
    weekLabel: WEEK_NAMES[3],
    claseLabel: 'Clase 11 (B-C)',
    topic: 'Clustering en datos reales',
    title: 'K-Means en Pingüinos y Consumidores',
    subtitle: 'Cuando el clustering separa especies con claridad… y cuando los grupos reales se solapan.',
    notebookTitle: 'Cuaderno B y C · K-Means con Pingüinos y Consumidores',
    notebookUrl: `${REPO_BLOB}/Clase11/Cuaderno09B_K_Means_Pinguinos.ipynb`,
    colabUrl: `${COLAB_BASE}/Clase11/Cuaderno09B_K_Means_Pinguinos.ipynb`,
    labType: 'kmeans-real-datasets',
    labTitle: 'Explorador de límites del clustering',
    labInstruction: 'Alterna entre el dataset de Pingüinos de Palmer y el de Consumidores para observar separación vs solapamiento.',
    conceptSummary:
      'Con datos sintéticos o medidas morfológicas claras (como especies de pingüinos), K-Means recupera grupos nítidos. Pero en datos reales de comportamiento de consumidores, las fronteras suelen ser difusas y K-Means fuerza cortes geométricos esféricos.',
    keyTakeaway: 'El clustering es una herramienta de exploración: siempre interpreta los clústeres en contexto y valida sus limitaciones.',
    codeSnippet: `# Cuaderno 09B / 09C: Evaluar silueta e interpretar centroides
from sklearn.metrics import silhouette_score

score = silhouette_score(X_scaled, clusters)
print(f"Silhouette Score: {score:.3f}")`,
    quiz: {
      prompt: '¿Qué limitación habitual aparece al aplicar K-Means sobre datos reales de consumidores frente a datos sintéticos ideales?',
      options: [
        'K-Means solo acepta 2 filas como máximo',
        'Los grupos reales suelen solaparse y no tener forma esférica perfecta',
        'K-Means requiere obligatoriamente etiquetas y conocidas',
        'No se puede graficar en Python',
      ],
      correctIndex: 1,
      explanation: 'K-Means asume clústeres convexos y de tamaño similar; en datos humanos reales los segmentos suelen superponerse.',
    },
  },
  {
    day: 19,
    week: 4,
    weekLabel: WEEK_NAMES[4],
    claseLabel: 'Clase 07 · Lab',
    topic: 'Metodología de proyecto',
    title: 'Pre-Entrega Lab: orden antes de modelar',
    subtitle: 'Estructurar selección, análisis exploratorio, limpieza, transformación y split sin errores.',
    notebookTitle: 'Cuaderno Pre-Entrega Lab',
    notebookUrl: `${REPO_BLOB}/Clase07/Cuaderno_Pre_EntregaLab.ipynb`,
    colabUrl: `${COLAB_BASE}/Clase07/Cuaderno_Pre_EntregaLab.ipynb`,
    labType: 'pre-entrega-checklist',
    labTitle: 'Secuenciador del flujo pre-modelado',
    labInstruction: 'Ordena correctamente las 5 etapas previas al entrenamiento evitando introducir fuga de datos.',
    conceptSummary:
      'Antes de probar diez algoritmos distintos, un proyecto sólido de Machine Learning define qué quiere predecir, audita calidad y sesgos en los datos, limpia inconsistencias, divide Train/Test y recién después ajusta transformadores.',
    keyTakeaway: 'Cada decisión de limpieza o filtrado de columnas debe justificarse pensando en qué datos existirán al momento de predecir.',
    codeSnippet: `# Flujo base de Pre-Entrega:
# 1. Definir problema y variable target
# 2. EDA + tipos + nulos + duplicados
# 3. Train/Test Split (stratify si es clasificación)
# 4. Preprocesamiento aprendido en Train`,
    quiz: {
      prompt: 'En la etapa de preparación de la Pre-Entrega, ¿por qué conviene documentar por qué eliminamos o imputamos una columna?',
      options: [
        'Para que el notebook tenga más líneas de texto',
        'Porque cada transformación cambia la población y puede introducir sesgos o fuga de datos',
        'Porque Scikit-Learn rechaza notebooks sin comentarios Markdown',
        'Para aumentar artificialmente el R²',
      ],
      correctIndex: 1,
      explanation: 'Justificar decisiones asegura reproducibilidad y evita borrar señales válidas o filtrar información del futuro.',
    },
  },
  {
    day: 20,
    week: 4,
    weekLabel: WEEK_NAMES[4],
    claseLabel: 'Clase 12',
    topic: 'Arquitectura de flujos',
    title: 'Pipelines y ColumnTransformer',
    subtitle: 'Encapsular imputación, codificación, escalado y modelo en un único objeto limpio.',
    notebookTitle: 'Pipelines y GridSearchCV V2',
    notebookUrl: `${REPO_BLOB}/Clase12/cuaderno_10_pipelines_v2.ipynb`,
    colabUrl: `${COLAB_BASE}/Clase12/cuaderno_10_pipelines_v2.ipynb`,
    labType: 'sklearn-pipeline',
    labTitle: 'Simulador de flujo Pipeline',
    labInstruction: 'Alterna entre "Pasos sueltos" y "Pipeline + ColumnTransformer" para ver cómo viajan columnas numéricas y categóricas en CV.',
    conceptSummary:
      'Un Pipeline encadena transformadores y un estimador final en un solo objeto con .fit() y .predict(). Combinado con ColumnTransformer, aplica escalado solo a variables numéricas y One-Hot solo a categóricas sin riesgo de Data Leakage durante la validación cruzada.',
    keyTakeaway: 'Si haces cross_val_score sobre un Pipeline, Scikit-Learn re-ajusta el escalador limpiamente en cada fold.',
    codeSnippet: `from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer

prep = ColumnTransformer([
    ("num", Pipeline([("imp", SimpleImputer()), ("sc", StandardScaler())]), num_cols),
    ("cat", OneHotEncoder(handle_unknown="ignore"), cat_cols),
])
pipe = Pipeline([("prep", prep), ("clf", RandomForestClassifier())])`,
    quiz: {
      prompt: '¿Qué problema resuelve ColumnTransformer dentro de un Pipeline de Scikit-Learn?',
      options: [
        'Permite aplicar distintos preprocesamientos a columnas numéricas y categóricas sin mezclarlas',
        'Descarga automáticamente datasets de Kaggle',
        'Reemplaza la necesidad de dividir en Train y Test',
        'Convierte gráficos de Matplotlib en tablas HTML',
      ],
      correctIndex: 0,
      explanation: 'ColumnTransformer dirige cada subconjunto de columnas por su rama específica (ej. StandardScaler para numéricas, OneHotEncoder para categóricas).',
    },
  },
  {
    day: 21,
    week: 4,
    weekLabel: WEEK_NAMES[4],
    claseLabel: 'Clase 12',
    topic: 'Optimización sistemática',
    title: 'GridSearchCV y Validación Cruzada',
    subtitle: 'Buscar los mejores hiperparámetros evaluando cada combinación con K-Fold CV.',
    notebookTitle: 'Pipelines y GridSearchCV V2',
    notebookUrl: `${REPO_BLOB}/Clase12/cuaderno_10_pipelines_v2.ipynb`,
    colabUrl: `${COLAB_BASE}/Clase12/cuaderno_10_pipelines_v2.ipynb`,
    labType: 'gridsearch-heatmap',
    labTitle: 'Mapa de calor GridSearchCV (5-Fold)',
    labInstruction: 'Explora la grilla de hiperparámetros (max_depth × n_estimators) y encuentra la combinación óptima validada.',
    conceptSummary:
      'Probar hiperparámetros a mano sobre el mismo conjunto de Test termina sobreajustando al Test. GridSearchCV evalúa sistemáticamente cada combinación mediante validación cruzada (cv=5) únicamente dentro de Train, reservando Test intacto para el veredicto final.',
    keyTakeaway: 'GridSearchCV + Pipeline garantiza que ningún paso del preprocesamiento vea los folds de validación antes de tiempo.',
    codeSnippet: `from sklearn.model_selection import GridSearchCV

param_grid = {
    "clf__n_estimators": [50, 100, 200],
    "clf__max_depth": [3, 5, 8],
}
grid = GridSearchCV(pipe, param_grid, cv=5, scoring="f1")
grid.fit(X_train, y_train)
print(grid.best_params_, grid.best_score_)`,
    quiz: {
      prompt: 'Si tenemos 3 valores para max_depth, 4 para n_estimators y usamos cv=5 en GridSearchCV, ¿cuántos entrenamientos ejecuta en total?',
      options: [
        '12 entrenamientos',
        '60 entrenamientos (3 × 4 × 5 folds)',
        '7 entrenamientos',
        '5 entrenamientos en total',
      ],
      correctIndex: 1,
      explanation: 'Hay 3 × 4 = 12 combinaciones posibles, y cada una se entrena y evalúa 5 veces en validación cruzada (60 fits).',
    },
  },
  {
    day: 22,
    week: 4,
    weekLabel: WEEK_NAMES[4],
    claseLabel: 'Extra',
    topic: 'Persistencia y despliegue',
    title: 'Guardar y recuperar modelos entrenados',
    subtitle: 'Por qué debes serializar el Pipeline completo con joblib y no solo el estimador final.',
    notebookTitle: 'Guardar y recuperar un modelo entrenado en scikit-learn',
    notebookUrl: `${REPO_BLOB}/Extra/cuaderno-extra-guardar-y-recuperar-modelos.ipynb`,
    colabUrl: `${COLAB_BASE}/Extra/cuaderno-extra-guardar-y-recuperar-modelos.ipynb`,
    labType: 'joblib-serialization',
    labTitle: 'Simulador de inferencia: Solo Modelo vs Pipeline guardado',
    labInstruction: 'Envía un registro nuevo de producción al archivo guardado y comprueba por qué guardar solo el modelo falla.',
    conceptSummary:
      'Cuando llevas un modelo a producción (una API o app web), llegan datos crudos sin escalar ni codificar. Si guardaste solo el estimador final, no tendrás la media, desviación ni categorías aprendidas en Train. Guardando el Pipeline completo, una sola llamada .predict() transforma y predice.',
    keyTakeaway: 'Usa joblib.dump(mejor_pipeline, "modelo_completo.joblib") para mantener acoplado el preprocesamiento al modelo.',
    codeSnippet: `import joblib

# Guardar el pipeline completo (preprocesador + modelo)
joblib.dump(grid.best_estimator_, "pipeline_ml.joblib")

# Más tarde, en producción:
modelo_cargado = joblib.load("pipeline_ml.joblib")
prediccion = modelo_cargado.predict(nuevos_datos_crudos)`,
    quiz: {
      prompt: '¿Por qué es mejor guardar con joblib el Pipeline completo en lugar de guardar únicamente el clasificador entrenado?',
      options: [
        'Porque joblib no soporta guardar estimadores individuales',
        'Porque el Pipeline conserva los transformadores ya ajustados (escaladores, imputadores, encoders) para datos nuevos crudos',
        'Para que el archivo ocupe menos líneas de Python',
        'Para reentrenar automáticamente el modelo en cada predicción',
      ],
      correctIndex: 1,
      explanation: 'Los datos nuevos llegan en formato crudo; el Pipeline aplica exactamente las mismas medias y categorías aprendidas en Train.',
    },
  },
  {
    day: 23,
    week: 4,
    weekLabel: WEEK_NAMES[4],
    claseLabel: 'Clase 13',
    topic: 'Selección de modelos',
    title: 'Comparación y evaluación de modelos',
    subtitle: 'Elegir el ganador interpretando métricas, errores y necesidades reales del problema.',
    notebookTitle: 'Comparación y evaluación de modelos',
    notebookUrl: `${REPO_BLOB}/Clase13/cuaderno-11-evaluacion-de-modelos.ipynb`,
    colabUrl: `${COLAB_BASE}/Clase13/cuaderno-11-evaluacion-de-modelos.ipynb`,
    labType: 'model-comparison',
    labTitle: 'Mesa comparativa de modelos',
    labInstruction: 'Cambia el criterio del negocio (Máximo Recall clínico vs Máxima Precision vs Interpretabilidad) para analizar qué modelo conviene.',
    conceptSummary:
      'No existe un algoritmo universalmente mejor. Comparar Regresión Logística, KNN, Árbol de Decisión y Random Forest bajo un mismo protocolo de validación cruzada y analizar en qué casos falla cada uno nos permite decidir con criterio técnico y de dominio.',
    keyTakeaway: 'El mejor modelo es el que equilibra desempeño en la métrica clave del problema, estabilidad y simplicidad explicativa.',
    codeSnippet: `modelos = {
    "LogReg": pipe_lr,
    "KNN": pipe_knn,
    "RandomForest": pipe_rf,
}
for nombre, m in modelos.items():
    scores = cross_val_score(m, X_train, y_train, cv=5, scoring="f1")
    print(f"{nombre}: {scores.mean():.3f} ± {scores.std():.3f}")`,
    quiz: {
      prompt: 'El Modelo A tiene 0.88 de F1-score y es un ensamble complejo; el Modelo B (Regresión Logística) logra 0.87 de F1 y el equipo médico necesita explicar los factores de riesgo. ¿Qué decisión es más sensata?',
      options: [
        'Elegir siempre el que tenga 0.01 más sin importar el contexto',
        'Considerar seriamente el Modelo B por su interpretabilidad y desempeño prácticamente equivalente',
        'Entrenar sobre X_test para subir el puntaje',
        'Eliminar todas las métricas salvo Accuracy',
      ],
      correctIndex: 1,
      explanation: 'En contextos reales (como salud o finanzas), una mínima diferencia de 0.01 suele justificar elegir un modelo interpretable y simple de mantener.',
    },
  },
  {
    day: 24,
    week: 4,
    weekLabel: WEEK_NAMES[4],
    claseLabel: 'Clase 14 · Final',
    topic: 'Proyecto integrador clínico',
    title: 'Flujo completo sobre dataset clínico',
    subtitle: 'Integración de punta a punta: exploración, preparación, pipeline, validación y veredicto.',
    notebookTitle: 'Exploración y preparación de un dataset clínico',
    notebookUrl: `${REPO_BLOB}/Clase14/cuaderno-13-proyecto-final.ipynb`,
    colabUrl: `${COLAB_BASE}/Clase14/cuaderno-13-proyecto-final.ipynb`,
    labType: 'clinical-final-project',
    labTitle: 'Simulador End-to-End de Dataset Clínico',
    labInstruction: 'Configura el pipeline clínico completo (imputación, escalado, umbral de sensibilidad y modelo) y evalúa el desempeño en pacientes de prueba.',
    conceptSummary:
      'El proyecto final reúne todo el recorrido del curso sobre un caso clínico real: revisar calidad y balance de clases, dividir antes de transformar, armar un Pipeline reproducible, optimizar hiperparámetros pensando en Recall y comunicar conclusiones con rigor.',
    keyTakeaway: '¡Felicitaciones por completar los 24 días! Ya dominas el ciclo completo de Machine Learning con Python y Scikit-Learn.',
    codeSnippet: `# Flujo integrador final (Clase 14)
grid_clinico = GridSearchCV(
    pipeline_clinico,
    param_grid={"clf__max_depth": [4, 6], "clf__class_weight": ["balanced"]},
    cv=5,
    scoring="recall"
)
grid_clinico.fit(X_train, y_train)`,
    quiz: {
      prompt: 'En el proyecto clínico final, queremos detectar pacientes con alto riesgo evitando que casos reales queden sin diagnóstico. ¿Qué combinación refleja mejores prácticas?',
      options: [
        'Imputar todo antes del split, usar Accuracy y guardar solo el estimador',
        'Split estratificado primero, Pipeline con SimpleImputer + escalado, optimización con GridSearchCV priorizando Recall/F1',
        'Entrenar KNN con k=1 sin escalar variables clínicas',
        'Usar K-Means sin revisar las etiquetas disponibles',
      ],
      correctIndex: 1,
      explanation: 'Integra prevención de fuga de datos, preprocesamiento reproducible, validación cruzada y métrica alineada al costo clínico.',
    },
  },
];
