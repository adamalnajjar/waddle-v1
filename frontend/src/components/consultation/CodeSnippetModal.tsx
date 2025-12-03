import React, { useState } from 'react';
import { Modal, ModalFooter } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { Code, Copy, Check } from 'lucide-react';

interface CodeSnippetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (code: string, language: string) => void;
  isSubmitting?: boolean;
}

const LANGUAGE_OPTIONS = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'csharp', label: 'C#' },
  { value: 'cpp', label: 'C++' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'swift', label: 'Swift' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'sql', label: 'SQL' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'bash', label: 'Bash/Shell' },
  { value: 'json', label: 'JSON' },
  { value: 'yaml', label: 'YAML' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'plaintext', label: 'Plain Text' },
];

export const CodeSnippetModal: React.FC<CodeSnippetModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
}) => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [copied, setCopied] = useState(false);

  const handleSubmit = () => {
    if (!code.trim()) return;
    onSubmit(code.trim(), language);
    setCode('');
    setLanguage('javascript');
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setCode('');
    setLanguage('javascript');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Share Code Snippet"
      description="Share code with syntax highlighting"
      size="lg"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="h-4 w-4 text-muted-foreground" />
            <Select
              options={LANGUAGE_OPTIONS}
              value={language}
              onChange={(value) => setLanguage(value)}
              className="w-40"
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            disabled={!code.trim()}
          >
            {copied ? (
              <Check className="h-4 w-4 mr-1 text-green-500" />
            ) : (
              <Copy className="h-4 w-4 mr-1" />
            )}
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </div>

        <div className="relative">
          <Textarea
            placeholder="Paste your code here..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="font-mono text-sm min-h-[300px] bg-muted/50"
            spellCheck={false}
          />
          <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
            {code.length} characters
          </div>
        </div>

        {/* Preview */}
        {code.trim() && (
          <div className="border rounded-md overflow-hidden">
            <div className="bg-muted px-3 py-1.5 text-xs text-muted-foreground border-b flex items-center justify-between">
              <span>Preview</span>
              <span className="capitalize">{language}</span>
            </div>
            <pre className="p-4 text-sm overflow-x-auto bg-muted/30">
              <code className="font-mono whitespace-pre-wrap break-words">
                {code}
              </code>
            </pre>
          </div>
        )}
      </div>

      <ModalFooter>
        <Button variant="outline" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!code.trim() || isSubmitting}
          isLoading={isSubmitting}
        >
          <Code className="h-4 w-4 mr-2" />
          Share Code
        </Button>
      </ModalFooter>
    </Modal>
  );
};

