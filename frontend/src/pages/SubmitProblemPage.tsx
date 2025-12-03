import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/useAppDispatch';
import { problemApi, technologyApi } from '../services/api';
import { Button } from '../components/ui/Button';
import { Label } from '../components/ui/Label';
import { Textarea } from '../components/ui/Textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Alert, AlertDescription } from '../components/ui/Alert';
import { TokenPurchaseModal } from '../components/TokenPurchaseModal';
import { 
  Upload,
  X,
  Plus,
  Loader2,
  FileText,
  Image,
  Code,
  AlertCircle,
  CheckCircle2,
  Coins,
  ChevronRight,
  Search
} from 'lucide-react';
import { cn } from '../lib/utils';
import type { Technology } from '../types';

const FILE_ICONS: Record<string, React.ReactNode> = {
  'image': <Image className="h-4 w-4" />,
  'text': <FileText className="h-4 w-4" />,
  'application/pdf': <FileText className="h-4 w-4" />,
  'application/json': <Code className="h-4 w-4" />,
  'default': <FileText className="h-4 w-4" />,
};

const getFileIcon = (mimeType: string) => {
  if (mimeType.startsWith('image/')) return FILE_ICONS['image'];
  if (mimeType.startsWith('text/')) return FILE_ICONS['text'];
  return FILE_ICONS[mimeType] || FILE_ICONS['default'];
};

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const SubmitProblemPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [problemStatement, setProblemStatement] = useState('');
  const [errorDescription, setErrorDescription] = useState('');
  const [selectedTechnologies, setSelectedTechnologies] = useState<Technology[]>([]);
  const [customTech, setCustomTech] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);

  // Technology state
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [visibleTechCount, setVisibleTechCount] = useState(10);
  const [techSearch, setTechSearch] = useState('');
  const [isLoadingTech, setIsLoadingTech] = useState(true);

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [calculatedFee, setCalculatedFee] = useState(5);
  const [draftId, setDraftId] = useState<number | null>(null);

  // Load technologies
  useEffect(() => {
    const loadTechnologies = async () => {
      try {
        const response = await technologyApi.list();
        setTechnologies(response.data.technologies || []);
      } catch (err) {
        console.error('Failed to load technologies:', err);
      } finally {
        setIsLoadingTech(false);
      }
    };
    loadTechnologies();
  }, []);

  // Calculate submission fee based on content
  useEffect(() => {
    let fee = 5; // Base fee

    // Add based on problem statement length
    if (problemStatement.length > 500) fee += 1;
    if (problemStatement.length > 1000) fee += 1;

    // Add based on error description length
    if (errorDescription.length > 500) fee += 1;
    if (errorDescription.length > 1000) fee += 1;

    // Add based on attachments (max 2 extra)
    fee += Math.min(attachments.length, 2);

    setCalculatedFee(Math.min(fee, 10)); // Cap at 10
  }, [problemStatement, errorDescription, attachments]);

  // Filter technologies based on search
  const filteredTechnologies = technologies.filter(tech =>
    tech.name.toLowerCase().includes(techSearch.toLowerCase())
  );

  const visibleTechnologies = filteredTechnologies.slice(0, visibleTechCount);
  const hasMoreTech = filteredTechnologies.length > visibleTechCount;

  const handleTechToggle = (tech: Technology) => {
    setSelectedTechnologies(prev => {
      const isSelected = prev.some(t => t.id === tech.id);
      if (isSelected) {
        return prev.filter(t => t.id !== tech.id);
      }
      return [...prev, tech];
    });
  };

  const handleAddCustomTech = () => {
    if (!customTech.trim()) return;
    
    // Add as a pseudo-technology with negative ID
    const customTechnology: Technology = {
      id: -Date.now(), // Negative ID for custom
      name: customTech.trim(),
      slug: customTech.trim().toLowerCase().replace(/\s+/g, '-'),
      icon_url: null,
    };
    
    setSelectedTechnologies(prev => [...prev, customTechnology]);
    setCustomTech('');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    for (const file of files) {
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        setError(`File "${file.name}" is too large. Maximum size is 10MB.`);
        return;
      }
    }
    
    setAttachments(prev => [...prev, ...files]);
    setError(null);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveDraft = async () => {
    if (!problemStatement.trim()) {
      setError('Please enter a problem statement before saving.');
      return;
    }

    setIsSavingDraft(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('problem_statement', problemStatement);
      formData.append('error_description', errorDescription);
      formData.append('technologies', JSON.stringify(selectedTechnologies.map(t => ({
        id: t.id > 0 ? t.id : null,
        is_custom: t.id < 0,
        custom_name: t.id < 0 ? t.name : null,
      }))));
      
      attachments.forEach((file, index) => {
        formData.append(`attachments[${index}]`, file);
      });

      if (draftId) {
        await problemApi.updateDraft(draftId, formData);
      } else {
        const response = await problemApi.saveDraft(formData);
        setDraftId(response.data.problem.id);
      }

      // Show success briefly
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save draft');
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handleSubmit = async () => {
    if (!problemStatement.trim()) {
      setError('Please describe your problem.');
      return;
    }

    if (selectedTechnologies.length === 0) {
      setError('Please select at least one technology.');
      return;
    }

    // Check token balance
    if ((user?.tokens_balance || 0) < calculatedFee) {
      setShowTokenModal(true);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('problem_statement', problemStatement);
      formData.append('error_description', errorDescription);
      formData.append('technologies', JSON.stringify(selectedTechnologies.map(t => ({
        id: t.id > 0 ? t.id : null,
        is_custom: t.id < 0,
        custom_name: t.id < 0 ? t.name : null,
      }))));
      
      attachments.forEach((file, index) => {
        formData.append(`attachments[${index}]`, file);
      });

      await problemApi.submit(formData);
      
      // Navigate to the problem status page or dashboard
      navigate('/dashboard', { 
        state: { message: 'Problem submitted successfully! We\'ll notify you when a consultant is matched.' }
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit problem');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = problemStatement.trim().length >= 20 && selectedTechnologies.length > 0;

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Submit a Problem</h1>
          <p className="text-muted-foreground">
            Describe your issue and we'll match you with the right expert
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-8">
          {/* Problem Statement */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What's the problem?</CardTitle>
              <CardDescription>
                Give a brief summary of what you're trying to solve
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="e.g., My React app crashes when I try to fetch data from the API..."
                value={problemStatement}
                onChange={(e) => setProblemStatement(e.target.value)}
                rows={3}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground mt-2">
                {problemStatement.length} characters (minimum 20)
              </p>
            </CardContent>
          </Card>

          {/* Error Description */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Additional Details</CardTitle>
              <CardDescription>
                Paste error messages, AI responses, or write more context
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Paste your error message, stack trace, or any relevant details here..."
                value={errorDescription}
                onChange={(e) => setErrorDescription(e.target.value)}
                rows={6}
                className="resize-none font-mono text-sm"
              />
              
              {/* File Upload */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Attachments</Label>
                <div 
                  className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Images, PDFs, code files (max 10MB each)
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,.pdf,.txt,.js,.ts,.py,.php,.html,.css,.json,.yaml,.yml"
                  className="hidden"
                  onChange={handleFileSelect}
                />
                
                {/* Attached Files List */}
                {attachments.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {attachments.map((file, index) => (
                      <div 
                        key={index}
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border"
                      >
                        <div className="text-muted-foreground">
                          {getFileIcon(file.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{file.name}</p>
                          <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(index)}
                          className="p-1 hover:bg-destructive/10 rounded text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Technology Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Technologies Used</CardTitle>
              <CardDescription>
                Select the technologies relevant to your problem
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search technologies..."
                  value={techSearch}
                  onChange={(e) => setTechSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Tech Pills */}
              {isLoadingTech ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap gap-2">
                    {visibleTechnologies.map((tech) => {
                      const isSelected = selectedTechnologies.some(t => t.id === tech.id);
                      return (
                        <button
                          key={tech.id}
                          type="button"
                          onClick={() => handleTechToggle(tech)}
                          className={cn(
                            "px-4 py-2 rounded-full text-sm font-medium transition-all",
                            isSelected
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {isSelected && <CheckCircle2 className="inline-block h-4 w-4 mr-1" />}
                          {tech.name}
                        </button>
                      );
                    })}
                  </div>

                  {hasMoreTech && (
                    <button
                      type="button"
                      onClick={() => setVisibleTechCount(prev => prev + 10)}
                      className="text-sm text-primary hover:underline"
                    >
                      Load more technologies
                    </button>
                  )}

                  {/* Custom Technology Input */}
                  <div className="flex gap-2 mt-4">
                    <input
                      type="text"
                      placeholder="Add custom technology..."
                      value={customTech}
                      onChange={(e) => setCustomTech(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddCustomTech()}
                      className="flex-1 px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddCustomTech}
                      disabled={!customTech.trim()}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Selected Technologies */}
                  {selectedTechnologies.length > 0 && (
                    <div className="pt-4 border-t">
                      <Label className="text-sm font-medium mb-2 block">
                        Selected ({selectedTechnologies.length})
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {selectedTechnologies.map((tech) => (
                          <span
                            key={tech.id}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                          >
                            {tech.name}
                            <button
                              type="button"
                              onClick={() => handleTechToggle(tech)}
                              className="hover:bg-primary/20 rounded-full p-0.5"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Submission Fee & Actions */}
          <Card className="bg-muted/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">Submission Fee</p>
                  <div className="flex items-center gap-2">
                    <Coins className="h-5 w-5 text-primary" />
                    <span className="text-2xl font-bold">{calculatedFee}</span>
                    <span className="text-muted-foreground">tokens</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Fee scales based on content (5-10 tokens)
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Your Balance</p>
                  <div className="flex items-center gap-2 justify-end">
                    <Coins className="h-5 w-5 text-muted-foreground" />
                    <span className={cn(
                      "text-2xl font-bold",
                      (user?.tokens_balance || 0) < calculatedFee ? "text-destructive" : ""
                    )}>
                      {user?.tokens_balance || 0}
                    </span>
                  </div>
                  {(user?.tokens_balance || 0) < calculatedFee && (
                    <p className="text-xs text-destructive mt-1">
                      Insufficient tokens
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleSaveDraft}
                  disabled={isSavingDraft || !problemStatement.trim()}
                  className="flex-1"
                >
                  {isSavingDraft ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <FileText className="h-4 w-4 mr-2" />
                  )}
                  Save Draft
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !isFormValid}
                  className="flex-1"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <ChevronRight className="h-4 w-4 mr-2" />
                  )}
                  Submit Problem
                </Button>
              </div>

              <p className="text-xs text-center text-muted-foreground mt-4">
                Drafts are saved for 2 weeks. Submission fee covers consultant review time.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Token Purchase Modal */}
      <TokenPurchaseModal
        isOpen={showTokenModal}
        onClose={() => setShowTokenModal(false)}
        requiredTokens={calculatedFee}
        onPurchaseComplete={() => {
          setShowTokenModal(false);
          // Optionally refresh user data or retry submission
        }}
      />
    </div>
  );
};

