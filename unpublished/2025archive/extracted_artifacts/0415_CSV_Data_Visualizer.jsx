import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Upload, FileText, Loader2 } from 'lucide-react';

const TRANSLATIONS = {
  "en-US": {
    "pageTitle": "CSV Data Visualizer",
    "instructionsText": "Upload your CSV file to get started. Then simply describe what you want to know in plain English: ask questions like \"What's the total revenue?\", request charts like \"Show me sales trends over time\", or create tables like \"List top 10 customers by order value\". We'll automatically answer the question, create charts, tables, etc. No formulas or coding required, just ask naturally and we'll handle the rest.",
    "sampleDataLink": "Don't have a CSV? Click here to download some sample data to try",
    "uploadText": "Drop CSV file here or click to upload",
    "dataPreviewTitle": "Data Preview (First 5 Rows)",
    "analysisRequestTitle": "Analysis Request",
    "analysisPlaceholder": "Describe the analysis you want to run...",
    "runAnalysisButton": "Run Analysis",
    "processingButton": "Processing...",
    "planningAnalysis": "Planning analysis",
    "calculatingResults": "Calculating results",
    "errorReadingFile": "Error reading CSV file: ",
    "errorUploadAndQuery": "Please upload a CSV file and enter an analysis query",
    "errorDuringAnalysis": "Error during analysis: ",
    "barChartDefault": "Bar Chart",
    "lineChartDefault": "Line Chart",
    "tableResultsTitle": "Table Results",
    "countResultDefault": "Count Result",
    "unknownVisualizationType": "Unknown visualization type: ",
    "claudePromptLanguage": "Please respond in ${locale} language"
  },
  /* LOCALE_PLACEHOLDER_START */
  "es-ES": {
    "pageTitle": "Visualizador de Datos CSV",
    "instructionsText": "Sube tu archivo CSV para comenzar. Luego simplemente describe lo que quieres saber en español simple: haz preguntas como \"¿Cuáles son los ingresos totales?\", solicita gráficos como \"Muéstrame las tendencias de ventas a lo largo del tiempo\", o crea tablas como \"Lista los 10 mejores clientes por valor de pedido\". Responderemos automáticamente la pregunta, crearemos gráficos, tablas, etc. No se requieren fórmulas ni codificación, solo pregunta naturalmente y nos encargaremos del resto.",
    "sampleDataLink": "¿No tienes un CSV? Haz clic aquí para descargar algunos datos de muestra para probar",
    "uploadText": "Arrastra el archivo CSV aquí o haz clic para subir",
    "dataPreviewTitle": "Vista Previa de Datos (Primeras 5 Filas)",
    "analysisRequestTitle": "Solicitud de Análisis",
    "analysisPlaceholder": "Describe el análisis que quieres ejecutar...",
    "runAnalysisButton": "Ejecutar Análisis",
    "processingButton": "Procesando...",
    "planningAnalysis": "Planificando análisis",
    "calculatingResults": "Calculando resultados",
    "errorReadingFile": "Error al leer el archivo CSV: ",
    "errorUploadAndQuery": "Por favor sube un archivo CSV e ingresa una consulta de análisis",
    "errorDuringAnalysis": "Error durante el análisis: ",
    "barChartDefault": "Gráfico de Barras",
    "lineChartDefault": "Gráfico de Líneas",
    "tableResultsTitle": "Resultados de Tabla",
    "countResultDefault": "Resultado de Conteo",
    "unknownVisualizationType": "Tipo de visualización desconocido: ",
    "claudePromptLanguage": "Por favor responde en idioma ${locale}"
  }
  /* LOCALE_PLACEHOLDER_END */
};

const appLocale = '{{APP_LOCALE}}';
const browserLocale = navigator.languages?.[0] || navigator.language || 'en-US';
const findMatchingLocale = (locale) => {
  if (TRANSLATIONS[locale]) return locale;
  const lang = locale.split('-')[0];
  const match = Object.keys(TRANSLATIONS).find(key => key.startsWith(lang + '-'));
  return match || 'en-US';
};
const locale = (appLocale !== '{{APP_LOCALE}}') ? findMatchingLocale(appLocale) : findMatchingLocale(browserLocale);
const t = (key) => TRANSLATIONS[locale]?.[key] || TRANSLATIONS['en-US'][key] || key;

const CSVDataVisualizer = () => {
  const [csvData, setCsvData] = useState(null);
  const [headers, setHeaders] = useState([]);
  const [displayData, setDisplayData] = useState([]);
  const [analysisQuery, setAnalysisQuery] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [error, setError] = useState('');

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const text = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsText(file);
      });

      // Parse CSV
      const lines = text.trim().split('\n');
      const parsedHeaders = lines[0].split(',').map(h => h.trim());
      setHeaders(parsedHeaders);

      // Parse first 5 rows for display
      const rows = [];
      for (let i = 1; i < Math.min(6, lines.length); i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const row = {};
        parsedHeaders.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        rows.push(row);
      }
      
      setDisplayData(rows);
      setCsvData(text);
      setAnalysisResult(null);
      setError('');
    } catch (err) {
      setError(t('errorReadingFile') + err.message);
    }
  };

  const runAnalysis = async () => {
    if (!csvData || !analysisQuery.trim()) {
      setError(t('errorUploadAndQuery'));
      return;
    }

    setIsLoading(true);
    setLoadingStatus(t('planningAnalysis'));
    setError('');

    try {
      // Get first 5 lines of CSV for the prompt
      const lines = csvData.trim().split('\n');
      const sampleData = lines.slice(0, 6).join('\n');

      const prompt = `Given this CSV data (first 5 rows shown):
${sampleData}

User's analysis request: "${analysisQuery}"

Write JavaScript code to perform this analysis. The code should:
1. Parse the full CSV data (available in variable 'csvData')
2. Perform the requested analysis
3. Output the result in the required format

Output format:
analysisResult = { 
  type: 'bar_chart' | 'line_chart' | 'table' | 'count', 
  data: <appropriate data structure>, 
  config: <optional configuration object> 
};

Data structure requirements by type:
- bar_chart: { labels: string[], values: number[], title?: string }
- line_chart: { labels: string[], values: number[], title?: string }
- table: { headers: string[], rows: any[][] }
- count: { value: number, label?: string }

Guidelines:
- Choose the most appropriate visualization type based on the analysis
- For numeric aggregations (sum, average, count), use 'count' type
- For comparisons between categories, use 'bar_chart'
- For trends over time, use 'line_chart'
- For detailed data inspection or pivot tables use 'table'
- Include meaningful labels and titles where appropriate
- Handle edge cases gracefully (empty data, missing values, etc.)

IMPORTANT: Return ONLY the JavaScript code. Do not include any markdown formatting, backticks, or explanations.

${t('claudePromptLanguage')}`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 16000,
          messages: [
            { 
              role: "user", 
              content: prompt
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const generatedCode = data.content[0].text;

      // Execute the generated code
      setLoadingStatus(t('calculatingResults'));
      
      // Create a function to safely execute the code
      const executeAnalysis = new Function('csvData', generatedCode + '\nreturn analysisResult;');
      const result = executeAnalysis(csvData);
      
      setAnalysisResult(result);
    } catch (err) {
      setError(t('errorDuringAnalysis') + err.message);
      console.error('Analysis error:', err);
    } finally {
      setIsLoading(false);
      setLoadingStatus('');
    }
  };

  const renderVisualization = () => {
    if (!analysisResult) return null;

    const { type, data } = analysisResult;

    switch (type) {
      case 'bar_chart':
        const barData = data.labels.map((label, index) => ({
          name: label,
          value: data.values[index]
        }));
        return (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">{data.title || t('barChartDefault')}</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );

      case 'line_chart':
        const lineData = data.labels.map((label, index) => ({
          name: label,
          value: data.values[index]
        }));
        return (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">{data.title || t('lineChartDefault')}</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );

      case 'table':
        return (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">{t('tableResultsTitle')}</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-blue-50">
                    {data.headers.map((header, index) => (
                      <th key={index} className="border border-gray-300 px-4 py-2 text-left font-semibold">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.rows.map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-gray-50">
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex} className="border border-gray-300 px-4 py-2">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'count':
        return (
          <div className="mt-6 text-center">
            <h3 className="text-xl font-semibold mb-4">{data.label || t('countResultDefault')}</h3>
            <div className="text-6xl font-bold text-blue-600">{data.value}</div>
          </div>
        );

      default:
        return <div className="mt-6 text-red-600">{t('unknownVisualizationType')}{type}</div>;
    }
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('pageTitle')}</h1>
        
        {/* Instructions */}
        <div className="mb-6 p-6 bg-blue-50 rounded-lg">
          <p className="text-gray-700 leading-relaxed">
            {t('instructionsText')}
          </p>
        </div>
        
        {/* Sample Data Link */}
        <div className="mb-4 text-center">
          <a 
            href="https://www.realtor.com/research/data" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 underline"
          >
            {t('sampleDataLink')}
          </a>
        </div>
        
        {/* File Upload */}
        <div className="mb-8">
          <label className="flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-lg appearance-none cursor-pointer hover:border-blue-400 focus:outline-none">
            <div className="flex flex-col items-center space-y-2">
              <Upload className="w-8 h-8 text-gray-400" />
              <span className="text-gray-600">{t('uploadText')}</span>
            </div>
            <input
              type="file"
              className="hidden"
              accept=".csv"
              onChange={handleFileUpload}
            />
          </label>
        </div>

        {/* Display first 5 rows */}
        {displayData.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              {t('dataPreviewTitle')}
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    {headers.map((header, index) => (
                      <th key={index} className="border border-gray-300 px-4 py-2 text-left font-semibold">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {displayData.map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-gray-50">
                      {headers.map((header, cellIndex) => (
                        <td key={cellIndex} className="border border-gray-300 px-4 py-2">
                          {row[header]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Analysis Input */}
        {csvData && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">{t('analysisRequestTitle')}</h2>
            <div className="flex gap-4">
              <input
                type="text"
                value={analysisQuery}
                onChange={(e) => setAnalysisQuery(e.target.value)}
                placeholder={t('analysisPlaceholder')}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <button
                onClick={runAnalysis}
                disabled={isLoading || !analysisQuery.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? t('processingButton') : t('runAnalysisButton')}
              </button>
            </div>
          </div>
        )}

        {/* Loading Spinner */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            <p className="mt-3 text-gray-600">{loadingStatus}</p>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Visualization */}
        {!isLoading && analysisResult && renderVisualization()}
      </div>
    </div>
  );
};

export default CSVDataVisualizer;