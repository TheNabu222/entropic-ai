import React, { useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Upload, Camera, Image as ImageIcon, Loader, ScanEye } from 'lucide-react';
import { generateAiResponse } from '../utils/gemini';

interface ImageAnalyzerProps {
    apiKey: string;
}

export const ImageAnalyzer: React.FC<ImageAnalyzerProps> = ({ apiKey }) => {
    const [image, setImage] = useState<string | null>(null);
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
                setAnalysis(null); // Reset previous analysis
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAnalyze = async () => {
        if (!image || !apiKey) return;
        setIsAnalyzing(true);
        try {
            const prompt = "Analyze this image in detail. Extract any visible text (like items on a receipt or menu), describe the visual composition, and identify key objects. If it's a chart, explain the data.";
            const result = await generateAiResponse(apiKey, prompt, 'VISION', image);
            setAnalysis(result || "No result returned.");
        } catch (e: any) {
            setAnalysis(`Error: ${e.message}`);
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="h-full flex flex-col md:flex-row bg-neo-900 text-gray-200">
            {/* Left: Input Area */}
            <div className="w-full md:w-1/2 p-6 flex flex-col border-b md:border-b-0 md:border-r border-neo-800">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <ScanEye className="text-neo-accent" />
                    <span>Visual Intelligence</span>
                </h2>
                <p className="text-gray-400 mb-6 text-sm">
                    Upload receipts, menus, charts, or design mockups. Gemini 3 Pro will analyze them instantly.
                </p>

                <div 
                    className="flex-1 border-2 border-dashed border-neo-700 rounded-xl bg-neo-800/30 flex flex-col items-center justify-center p-8 hover:bg-neo-800/50 transition-colors cursor-pointer relative overflow-hidden"
                    onClick={() => fileInputRef.current?.click()}
                >
                    {image ? (
                        <img src={image} alt="Preview" className="max-w-full max-h-[400px] object-contain shadow-lg rounded" />
                    ) : (
                        <div className="text-center">
                            <Upload className="mx-auto h-12 w-12 text-gray-500 mb-4" />
                            <p className="text-lg font-medium text-gray-300">Drop an image here</p>
                            <p className="text-sm text-gray-500 mt-1">or click to browse</p>
                        </div>
                    )}
                    <input 
                        ref={fileInputRef}
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleFileChange} 
                    />
                </div>

                <div className="mt-6 flex justify-center gap-4">
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 bg-neo-800 hover:bg-neo-700 border border-neo-600 rounded text-sm flex items-center gap-2"
                    >
                        <ImageIcon size={16} />
                        Select Image
                    </button>
                    <button 
                        onClick={handleAnalyze}
                        disabled={!image || isAnalyzing}
                        className="px-6 py-2 bg-neo-500 hover:bg-neo-400 text-white font-medium rounded shadow-lg shadow-neo-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isAnalyzing ? <Loader size={16} className="animate-spin" /> : <ScanEye size={16} />}
                        Analyze with Gemini
                    </button>
                </div>
            </div>

            {/* Right: Analysis Results */}
            <div className="w-full md:w-1/2 p-6 bg-neo-800 overflow-y-auto">
                <h3 className="text-lg font-semibold mb-4 text-neo-accent">Analysis Results</h3>
                
                {isAnalyzing ? (
                    <div className="space-y-4 animate-pulse">
                        <div className="h-4 bg-neo-700 rounded w-3/4"></div>
                        <div className="h-4 bg-neo-700 rounded w-full"></div>
                        <div className="h-4 bg-neo-700 rounded w-5/6"></div>
                        <div className="h-32 bg-neo-700 rounded w-full mt-4 opacity-50"></div>
                    </div>
                ) : analysis ? (
                    <div className="prose prose-invert max-w-none">
                         <div className="whitespace-pre-wrap text-gray-300 text-sm leading-relaxed p-4 bg-neo-900 rounded border border-neo-700">
                            {analysis}
                         </div>
                    </div>
                ) : (
                    <div className="text-center text-gray-600 mt-20">
                        <p>Results will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};