import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { SUPPORTED_SCRIPTS } from './constants';
import { codexEntries, CodexEntry } from './codexData';
// TECHATER Protocol: Using rigid, rule-based services instead of AI
import {
  transliterateText,
  getPhoneticGuide,
  getDefinitions,
  getHistoricalContext,
  getExamplePhrase,
  getResonanceAnalysis,
  getThematicTags,
  getIntelligentLanguageSelection
} from './services/rigidService';
import ScriptSelector from './components/ScriptSelector';
import MultiScriptSelector from './components/MultiScriptSelector';
import IconButton from './components/IconButton';
import Accordion from './components/Accordion';
import CodexBrowser from './components/CodexBrowser';

// --- THEME ICONS ---

const SwapIcon = () => (
    <svg xmlns="http://www.w.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 3h5v5" />
        <path d="M4 20L21 3" />
        <path d="M21 16v5h-5" />
        <path d="M15 15l6 6" />
        <path d="M4 4l5 5" />
    </svg>
);

const CopyIcon = () => (
    <svg xmlns="http://www.w.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

const SpinnerIcon = () => (
    <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const DiceIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"></circle>
        <circle cx="15.5" cy="8.5" r="1.5" fill="currentColor"></circle>
        <circle cx="8.5" cy="15.5" r="1.5" fill="currentColor"></circle>
        <circle cx="15.5" cy="15.5" r="1.5" fill="currentColor"></circle>
    </svg>
);

// --- CURSED GIFS ---
const SpinningSkullGif = () => (
  <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOw==" alt="Loading..." className="h-24 w-24" />
);

// --- TYPES ---
type ResonanceResult = {
  language: string;
  result: string;
};
type AppMode = 'codex' | 'live';

// --- HELPER COMPONENTS ---
const AnalysisContent: React.FC<{isLoading: boolean; content: string; isHtml?: boolean}> = ({ isLoading, content, isHtml }) => {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-4">
                <SpinnerIcon />
            </div>
        );
    }
    if (!content) return null;

    if (isHtml) {
         return <div className="prose prose-stone max-w-none font-garamond text-lg" dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }} />;
    }
    return <p className="font-garamond text-lg">{content}</p>;
};


// --- MAIN APP COMPONENT ---
const App = () => {
  const [appMode, setAppMode] = useState<AppMode>('codex');
  const [selectedCodexEntry, setSelectedCodexEntry] = useState(Object.keys(codexEntries)[0]);

  const [sourceText, setSourceText] = useState('Hello world');
  const [sourceScript, setSourceScript] = useState('English');
  const [targetScript, setTargetScript] = useState('Phoenician');
  const [transliteratedText, setTransliteratedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isCopied, setIsCopied] = useState(false);
  
  const [phoneticGuide, setPhoneticGuide] = useState('');
  const [definitions, setDefinitions] = useState('');
  const [historicalContext, setHistoricalContext] = useState('');
  const [isAnalysisLoading, setIsAnalysisLoading] = useState({
      phonetics: false,
      definitions: false,
      context: false,
  });

  const [resonanceLanguages, setResonanceLanguages] = useState<string[]>(['Basque', 'Sumerian Cuneiform']);
  const [resonanceResults, setResonanceResults] = useState<ResonanceResult[]>([]);
  const [thematicTags, setThematicTags] = useState<string[]>([]);
  const [isResonanceLoading, setIsResonanceLoading] = useState(false);
  const [isAutoSelectLoading, setIsAutoSelectLoading] = useState(false);
  
  const activeCodexEntry = useMemo(() => codexEntries[selectedCodexEntry], [selectedCodexEntry]);

  useEffect(() => {
    if (appMode === 'codex' && activeCodexEntry) {
      // Reset state when switching to codex mode or changing entry
      setError(null);
      setIsLoading(false);
      
      // Set source text and script from codex
      setSourceText(activeCodexEntry.sourceText);
      setSourceScript(activeCodexEntry.sourceScript);
      
      // Auto-load transliteration and analysis for the current target script
      const codexTransliteration = activeCodexEntry.transliterations[targetScript] || 'N/A in Codex';
      const codexAnalysis = activeCodexEntry.analysis[targetScript];
      
      setTransliteratedText(codexTransliteration);
      setPhoneticGuide(codexAnalysis?.phoneticGuide || 'N/A in Codex');
      setDefinitions(codexAnalysis?.definitions || 'N/A in Codex');
      setHistoricalContext(activeCodexEntry.analysis[Object.keys(activeCodexEntry.analysis)[0]]?.historicalContext || 'N/A in Codex');
      setResonanceResults(activeCodexEntry.resonance.results);
      setThematicTags(activeCodexEntry.resonance.thematicTags);
      
    } else {
      // Reset data when switching to live mode
      setTransliteratedText('');
      setPhoneticGuide('');
      setDefinitions('');
      setHistoricalContext('');
      setResonanceResults([]);
      setThematicTags([]);
    }
  }, [appMode, activeCodexEntry, targetScript]);


  const sourceScripts = useMemo(() => SUPPORTED_SCRIPTS.filter(s => !s.value.includes('Cuneiform') && !s.value.includes('Hieroglyphs') && !s.value.includes('Linear B') && !s.value.includes('Mayan')), []);
  const targetScripts = useMemo(() => SUPPORTED_SCRIPTS, []);
  
  const resonanceLanguageOptions = useMemo(() => 
    SUPPORTED_SCRIPTS.filter(s => [
      'Basque', 'Quechua', 'Igbo', 'Ainu', 'Zuni', 'Yolŋu Matha', 
      'Sumerian Cuneiform', 'Egyptian Hieroglyphs', 'Phoenician',
      'Vietnamese', 'Cherokee', 'Etruscan'
    ].includes(s.value)), []);

  
  const handleSwap = useCallback(() => {
    setSourceScript(targetScript);
    setTargetScript(sourceScript);
  }, [sourceScript, targetScript]);

  const handleCopy = useCallback(() => {
    if (transliteratedText) {
      navigator.clipboard.writeText(transliteratedText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  }, [transliteratedText]);

  const handleExamplePhrase = useCallback(async () => {
    setIsLoading(true);
    try {
      const phrase = await getExamplePhrase(sourceScript);
      setSourceText(phrase);
    } catch (e) {
      setError('Could not fetch an example phrase.');
    } finally {
      setIsLoading(false);
    }
  }, [sourceScript]);

  const handleTransliterate = useCallback(async () => {
    if (appMode !== 'live' || !sourceText.trim()) return;

    setIsLoading(true);
    setError(null);
    setTransliteratedText('');
    setResonanceResults([]);
    setThematicTags([]);
    setPhoneticGuide('');
    setDefinitions('');
    setHistoricalContext('');

    try {
      const result = await transliterateText(sourceText, sourceScript, targetScript);
      setTransliteratedText(result);

      if (result) {
        setIsAnalysisLoading({ phonetics: true, definitions: true, context: true });

        getPhoneticGuide(result, targetScript)
          .then(setPhoneticGuide)
          .catch(() => setPhoneticGuide('Could not retrieve phonetic guide.'))
          .finally(() => setIsAnalysisLoading(prev => ({...prev, phonetics: false})));
        
        getDefinitions(result, targetScript)
          .then(setDefinitions)
          .catch(() => setDefinitions('Could not retrieve lexicon.'))
          .finally(() => setIsAnalysisLoading(prev => ({...prev, definitions: false})));

        getHistoricalContext(sourceText, sourceScript)
          .then(setHistoricalContext)
          .catch(() => setHistoricalContext('Could not retrieve historical context.'))
          .finally(() => setIsAnalysisLoading(prev => ({...prev, context: false})));
      }

    } catch (e: any) {
      setError(e.message || 'An unknown error occurred during transliteration.');
    } finally {
      setIsLoading(false);
    }
  }, [appMode, sourceText, sourceScript, targetScript]);

  const handleResonanceAnalysis = useCallback(async () => {
    if (appMode !== 'live' || !sourceText.trim() || resonanceLanguages.length === 0) return;

    setIsResonanceLoading(true);
    setResonanceResults([]);
    setThematicTags([]);

    try {
      const promises = resonanceLanguages.map(lang => getResonanceAnalysis(sourceText, lang));
      const results = await Promise.all(promises);
      
      const formattedResults = results.map((res, i) => ({
        language: resonanceLanguages[i],
        result: res
      }));
      setResonanceResults(formattedResults);

      const allFoundWords = results.filter(r => r !== 'No significant resonance found in the echoes.');
      if (allFoundWords.length > 0) {
        const tags = await getThematicTags(allFoundWords);
        setThematicTags(tags);
      }
    } catch (e: any) {
      console.error("Resonance analysis failed", e);
    } finally {
      setIsResonanceLoading(false);
    }
  }, [appMode, sourceText, resonanceLanguages]);

  const handleAutoSelectLanguages = useCallback(async () => {
    if (appMode !== 'live' || !sourceText.trim()) return;
    setIsAutoSelectLoading(true);
    try {
        const selectedLangs = await getIntelligentLanguageSelection(sourceText, resonanceLanguageOptions);
        if (selectedLangs.length > 0) {
            setResonanceLanguages(selectedLangs);
        }
    } catch (e) {
        console.error("Auto-select failed", e);
    } finally {
        setIsAutoSelectLoading(false);
    }
  }, [appMode, sourceText, resonanceLanguageOptions]);

  const targetScriptDetails = useMemo(() => SUPPORTED_SCRIPTS.find(s => s.value === targetScript), [targetScript]);
  
  const isEngineBusy = isLoading || isResonanceLoading || isAutoSelectLoading;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="main-archive-panel">
          <header className="text-center mb-8 pb-4">
            <h1 className="text-6xl">Resonance Engine</h1>
            <p className="text-xl mt-2">Uncover the phonetic ghosts in the machine of language.</p>
            
            <div className="mt-6 p-2 box-bevel max-w-md mx-auto">
              <div className="flex justify-center items-center space-x-4">
                  <span className={`font-bold ${appMode === 'codex' ? 'text-yellow-300' : 'text-stone-400'}`}>Codex</span>
                  <label htmlFor="engine-toggle" className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" id="engine-toggle" className="sr-only peer" checked={appMode === 'live'} onChange={() => setAppMode(prev => prev === 'codex' ? 'live' : 'codex')} />
                      <div className="w-11 h-6 bg-stone-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-800"></div>
                  </label>
                  <span className={`font-bold ${appMode === 'live' ? 'text-yellow-300' : 'text-stone-400'}`}>Live Engine</span>
              </div>
              <p className="text-xs mt-2 font-garamond">{appMode === 'codex' ? 'Deterministic results from pre-computed data.' : 'Experimental AI analysis of custom text.'}</p>
            </div>
            
            <p className="text-2xl font-bold mt-4">+++TECHATER PROTOCOL ENGAGED+++ACCESSING ANCIENT FREQUENCIES+++RESONANCE ENGINE ONLINE+++</p>
          </header>

          <main className="space-y-8">
            <section className="manuscript-border p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                {appMode === 'codex' ? (
                  <div className="md:col-span-2">
                    <CodexBrowser selectedEntry={selectedCodexEntry} onSelect={setSelectedCodexEntry} />
                  </div>
                ) : (
                  <div className="md:col-span-2">
                    <label htmlFor="source-text" className="block text-sm font-bold mb-1">
                      Source Text (Live)
                    </label>
                    <div className="relative">
                      <textarea
                        id="source-text"
                        value={sourceText}
                        onChange={(e) => setSourceText(e.target.value)}
                        rows={3}
                        className="w-full p-2.5 text-lg font-garamond"
                        placeholder="Enter text to begin..."
                      />
                      <div className="absolute top-2 right-2">
                        <IconButton onClick={handleExamplePhrase} ariaLabel="Get random phrase" disabled={isLoading}>
                          <DiceIcon />
                        </IconButton>
                      </div>
                    </div>
                  </div>
                )}

                <ScriptSelector id="source-script" label="Source Script" scripts={sourceScripts} value={sourceScript} onChange={(e) => setSourceScript(e.target.value)} disabled={appMode === 'codex'} />
                <div className="flex items-center justify-center md:order-2">
                  <IconButton onClick={handleSwap} ariaLabel="Swap scripts" disabled={isLoading || appMode === 'codex'}>
                    <SwapIcon />
                  </IconButton>
                </div>
                <ScriptSelector id="target-script" label="Target Script" scripts={targetScripts} value={targetScript} onChange={(e) => setTargetScript(e.target.value)} />
              </div>

              {appMode === 'live' && (
                <div className="mt-6 text-center">
                  <button
                    onClick={handleTransliterate}
                    disabled={isEngineBusy || !sourceText.trim()}
                    className="text-2xl px-12 py-3"
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <SpinnerIcon /> <span className="ml-3">Transcribing Echoes...</span>
                      </span>
                    ) : (
                      'Transliterate'
                    )}
                  </button>
                </div>
              )}
            </section>

            { (isLoading || transliteratedText || error) && (
              <section className="manuscript-border p-6">
                <h2 className="text-3xl pb-2 mb-4">Result</h2>
                {error && <div className="text-red-700 bg-red-100 p-3 rounded-md font-garamond">{error}</div>}
                
                <div 
                  className={`box-inset p-4 min-h-[100px] text-3xl transition-opacity duration-500 ${isLoading ? 'opacity-50 blur-sm' : 'opacity-100 blur-0'}`}
                  style={{ direction: targetScriptDetails?.direction || 'ltr', fontFamily: 'sans-serif' }}
                >
                  {transliteratedText || <span className="text-stone-400">...</span>}
                </div>

                {!isLoading && transliteratedText && (
                  <div className="mt-4 border-t-4 border-double border-stone-500 pt-4 space-y-2">
                    <div className="flex justify-end">
                        <IconButton onClick={handleCopy} ariaLabel="Copy to clipboard">
                          {isCopied ? <CheckIcon /> : <CopyIcon />}
                        </IconButton>
                    </div>
                    <Accordion title="Phonetic Guide">
                        <AnalysisContent isLoading={isAnalysisLoading.phonetics} content={phoneticGuide} isHtml />
                    </Accordion>
                    <Accordion title="Lexicon">
                        <AnalysisContent isLoading={isAnalysisLoading.definitions} content={definitions} isHtml />
                    </Accordion>
                    <Accordion title="Scholar's Notes">
                        <AnalysisContent isLoading={isAnalysisLoading.context} content={historicalContext} />
                    </Accordion>
                  </div>
                )}
              </section>
            )}

            <section className="manuscript-border p-6">
              <Accordion title="Phonetic Resonance Analysis">
                <div className="pt-4 space-y-4">
                  <p className="font-garamond text-sm">Select languages to search for phonetic "echoes" of your source phrase. This is a speculative analysis to find similar-sounding words across linguistic families.</p>
                  
                  {appMode === 'live' ? (
                    <>
                      <MultiScriptSelector
                        id="resonance-langs"
                        label="Select Languages for Resonance Analysis"
                        scripts={resonanceLanguageOptions}
                        selectedScripts={resonanceLanguages}
                        onChange={setResonanceLanguages}
                        disabled={appMode === 'codex'}
                      />
                      <div className="text-center flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                          onClick={handleAutoSelectLanguages}
                          disabled={isEngineBusy || !sourceText.trim()}
                          className="text-xl px-8 py-2"
                        >
                          {isAutoSelectLoading ? (
                            <span className="flex items-center justify-center">
                              <SpinnerIcon /> <span className="ml-3">Consulting Oracle...</span>
                            </span>
                          ) : (
                            'Auto-Select Languages'
                          )}
                        </button>
                        <button
                          onClick={handleResonanceAnalysis}
                          disabled={isEngineBusy || !sourceText.trim()}
                          className="text-xl px-8 py-2"
                        >
                          {isResonanceLoading ? (
                            <span className="flex items-center justify-center">
                              <SpinnerIcon /> <span className="ml-3">Tuning Frequencies...</span>
                            </span>
                          ) : (
                            'Analyze Resonance'
                          )}
                        </button>
                      </div>
                    </>
                  ) : (
                     <div className="p-4 box-inset text-center">
                        <p className="font-garamond">Resonance analysis for this Codex entry is displayed below.</p>
                        <p className="text-sm font-garamond text-stone-400">Activate the Live Engine to analyze your own text.</p>
                    </div>
                  )}
                  
                  {isResonanceLoading && (
                    <div className="flex justify-center items-center py-8">
                      <SpinningSkullGif />
                    </div>
                  )}

                  { !isResonanceLoading && resonanceResults.length > 0 && (
                    <div className="space-y-4 pt-4">
                      {thematicTags.length > 0 && (
                        <div className="text-center">
                            <h4 className="text-lg">Archetypal Themes</h4>
                            <div className="flex flex-wrap justify-center gap-2 mt-1">
                              {thematicTags.map(tag => (
                                <span key={tag} className="box- bevel text-sm font-semibold px-2.5 py-0.5">{tag}</span>
                              ))}
                            </div>
                        </div>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {resonanceResults.map(({ language, result }) => (
                          <div key={language} className="box-bevel p-3">
                            <h4 className="text-lg">{SUPPORTED_SCRIPTS.find(s => s.value === language)?.label || language}</h4>
                            <ul className="list-disc list-inside font-garamond mt-1">
                              {result.split('\n').map(line => line.replace('* ', '')).map(item => (
                                <li key={item}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Accordion>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;