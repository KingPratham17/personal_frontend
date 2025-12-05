import React, { useState } from 'react';
import { Save, Eye, ArrowRight, Sparkles } from 'lucide-react';
import { Button, Card, FormGroup } from '../common';
import { clausesAPI, documentsAPI } from '../../services/api';
import { extractPlaceholders } from '../../utils/formatters';

export function AIDocumentForm({ onSuccess, showNotification }) {
    const [step, setStep] = useState(1);
    const [docType, setDocType] = useState('');
    const [initialContext, setInitialContext] = useState('');
    const [generatedClauses, setGeneratedClauses] = useState([]);
    const [placeholders, setPlaceholders] = useState([]);
    const [placeholderValues, setPlaceholderValues] = useState({});
    const [documentName, setDocumentName] = useState('');
    const [generating, setGenerating] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    // AI Bulk Excel state
    const [aiExcelFile, setAiExcelFile] = useState(null);
    const [aiBulkLoading, setAiBulkLoading] = useState(false);

    const handleGenerateClauses = async (e) => {
        e.preventDefault();
        if (!docType) return showNotification('Please enter document type', 'error');

        let parsedContext = {};
        if (initialContext) {
            try {
                parsedContext = JSON.parse(initialContext);
            } catch (err) {
                return showNotification('Invalid JSON in initial context.', 'error');
            }
        }

        setGenerating(true);
        try {
            const res = await clausesAPI.generateAI({
                document_type: docType,
                category: docType,
                context: parsedContext
            });

            const clauses = res?.data?.data?.clauses;
            if (!Array.isArray(clauses) || clauses.length === 0) {
                throw new Error("AI did not return valid clauses.");
            }

            setGeneratedClauses(clauses);

            // Extract placeholders
            const foundPlaceholders = new Set();
            clauses.forEach(clause => {
                if (clause && typeof clause.content === 'string') {
                    const extracted = extractPlaceholders(clause.content);
                    extracted.forEach(p => foundPlaceholders.add(p));
                }
            });

            const placeholderArray = Array.from(foundPlaceholders);
            setPlaceholders(placeholderArray);

            const initialValues = {};
            placeholderArray.forEach(p => initialValues[p] = '');
            setPlaceholderValues(initialValues);
            setDocumentName(`${docType}_AI_${Date.now()}`);
            setStep(2);

            showNotification(`AI generated ${clauses.length} clauses. Fill ${placeholderArray.length} placeholders.`, 'success');
        } catch (err) {
            showNotification(`Failed to generate clauses: ${err.message}`, 'error');
        } finally {
            setGenerating(false);
        }
    };

    const handleSaveDocument = async (e) => {
        if (e) e.preventDefault();

        if (!documentName || !Array.isArray(generatedClauses) || generatedClauses.length === 0) {
            return showNotification('Missing document name or generated clauses.', 'error');
        }

        const finalClauses = generatedClauses.map(clause => {
            let filledContent = String(clause?.content || '');
            placeholders.forEach(placeholder => {
                const value = placeholderValues[placeholder] || `[${placeholder}]`;
                const escapedPlaceholder = placeholder.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                filledContent = filledContent.replace(new RegExp(`\\[${escapedPlaceholder}\\]`, 'g'), value);
            });
            return { ...clause, content: filledContent };
        });

        setShowPreview(false);
        setGenerating(true);

        try {
            await documentsAPI.generate({
                document_name: documentName,
                document_type: docType,
                content_json: { clauses: finalClauses },
                variables: placeholderValues
            });

            onSuccess?.();
            resetForm();
        } catch (err) {
            showNotification(`Failed to save: ${err.message || 'Server error'}`, 'error');
        } finally {
            setGenerating(false);
        }
    };

    const handlePreview = () => {
        if (!Array.isArray(generatedClauses) || generatedClauses.length === 0) {
            return showNotification("No AI clauses generated yet.", "error");
        }
        setShowPreview(true);
    };

    const handleAiBulkGenerate = async () => {
        try {
            if (!aiExcelFile) {
                return showNotification('Please upload an Excel file for AI bulk generation.', 'error');
            }
            if (!docType) {
                return showNotification('Please enter document type before AI bulk generation.', 'error');
            }

            setAiBulkLoading(true);
            showNotification('Starting AI bulk generation. Please wait...', 'info');

            const response = await documentsAPI.aiBulkGenerateFromExcel(docType, aiExcelFile);

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.download = `AI_Bulk_Documents_${Date.now()}.zip`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            showNotification('AI bulk documents generated successfully. ZIP downloaded.', 'success');
        } catch (error) {
            const msg = error?.response?.data?.message || error?.response?.data?.error || error.message || 'Failed to generate AI bulk documents';
            showNotification(msg, 'error');
        } finally {
            setAiBulkLoading(false);
        }
    };

    const resetForm = () => {
        setStep(1);
        setDocType('');
        setInitialContext('');
        setGeneratedClauses([]);
        setPlaceholders([]);
        setPlaceholderValues({});
        setDocumentName('');
        setAiExcelFile(null);
    };

    return (
        <>
            {step === 1 && (
                <Card title="⚡ Quick AI Generate - Step 1">
                    <form onSubmit={handleGenerateClauses}>
                        <FormGroup label="Document Type" required>
                            <input
                                type="text"
                                placeholder="e.g., offer_letter, nda"
                                value={docType}
                                onChange={(e) => setDocType(e.target.value)}
                                className="form-input"
                                required
                            />
                        </FormGroup>

                        <FormGroup label="Optional Initial Context (JSON format)">
                            <textarea
                                placeholder='e.g., {"company": "Acme Corp", "position": "Engineer"}'
                                value={initialContext}
                                onChange={(e) => setInitialContext(e.target.value)}
                                className="form-textarea"
                                rows="3"
                            />
                        </FormGroup>

                        <Button type="submit" variant="primary" loading={generating} icon={ArrowRight}>
                            Generate Clauses
                        </Button>
                    </form>

                    <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #e2e8f0' }}>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '1rem' }}>
                            🤖 AI Bulk Document Generation from Excel
                        </h3>
                        <p style={{ fontSize: '0.9rem', marginBottom: '1rem', color: '#64748b' }}>
                            Uses the same Document Type as above and row values from Excel as context for AI.
                        </p>

                        <input
                            id="aiExcelInput"
                            type="file"
                            accept=".xlsx,.xls"
                            style={{ display: 'none' }}
                            onChange={(e) => setAiExcelFile(e.target.files?.[0] || null)}
                        />

                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <Button
                                variant="secondary"
                                onClick={() => document.getElementById('aiExcelInput').click()}
                                disabled={aiBulkLoading}
                            >
                                {aiExcelFile ? 'Excel Uploaded ✔' : 'Choose Excel File'}
                            </Button>

                            <Button
                                variant="success"
                                onClick={handleAiBulkGenerate}
                                disabled={!aiExcelFile || aiBulkLoading}
                                loading={aiBulkLoading}
                            >
                                Generate AI PDFs from Excel
                            </Button>
                        </div>
                    </div>
                </Card>
            )}

            {step === 2 && (
                <Card
                    title={`⚡ Step 2: Fill Placeholders for "${docType}"`}
                    actions={
                        <Button variant="secondary" onClick={resetForm}>
                            Start Over
                        </Button>
                    }
                >
                    <form onSubmit={handleSaveDocument}>
                        <FormGroup label="Document Name" required>
                            <input
                                type="text"
                                value={documentName}
                                onChange={(e) => setDocumentName(e.target.value)}
                                className="form-input"
                                required
                            />
                        </FormGroup>

                        {placeholders.length > 0 && (
                            <>
                                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginTop: '1.5rem', marginBottom: '1rem' }}>
                                    Fill Placeholders ({placeholders.length})
                                </h3>
                                <div style={{ maxHeight: '400px', overflowY: 'auto', marginBottom: '1.5rem' }}>
                                    {placeholders.map(placeholder => (
                                        <FormGroup key={placeholder} label={placeholder} inline>
                                            <input
                                                type="text"
                                                className="form-input"
                                                value={placeholderValues[placeholder] || ''}
                                                onChange={(e) => setPlaceholderValues(prev => ({
                                                    ...prev,
                                                    [placeholder]: e.target.value
                                                }))}
                                                required
                                            />
                                        </FormGroup>
                                    ))}
                                </div>
                            </>
                        )}

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                            <Button type="button" variant="secondary" icon={Eye} onClick={handlePreview}>
                                Preview
                            </Button>
                            <Button type="submit" variant="success" icon={Save} loading={generating}>
                                Save Document
                            </Button>
                        </div>
                    </form>
                </Card>
            )}
        </>
    );
}
