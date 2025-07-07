import React, { useState } from 'react';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  maxLength?: number;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  placeholder = 'Write your description in markdown...',
  rows = 8,
  required = false,
  maxLength,
}) => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Simple markdown to HTML converter for preview
  const markdownToHtml = (markdown: string) => {
    return (
      markdown
        // Headers
        .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
        .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-6 mb-3">$1</h2>')
        .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
        // Bold and italic
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
        // Links
        .replace(
          /\[([^\]]+)\]\(([^)]+)\)/g,
          '<a href="$2" class="text-green-600 hover:text-green-700 underline" target="_blank" rel="noopener noreferrer">$1</a>'
        )
        // Line breaks
        .replace(/\n\n/g, '</p><p class="mb-4">')
        // Lists
        .replace(/^\* (.*$)/gim, '<li class="ml-4">• $1</li>')
        // Wrap in paragraphs
        .replace(/^(.+)$/gim, '<p class="mb-4">$1</p>')
        // Clean up empty paragraphs
        .replace(/<p class="mb-4"><\/p>/g, '')
    );
  };

  const toolbarButtons = [
    { label: 'Bold', action: () => insertMarkdown('**', '**'), shortcut: 'Ctrl+B' },
    { label: 'Italic', action: () => insertMarkdown('*', '*'), shortcut: 'Ctrl+I' },
    { label: 'Link', action: () => insertMarkdown('[', '](url)'), shortcut: 'Ctrl+K' },
    { label: 'H1', action: () => insertMarkdown('# ', ''), shortcut: null },
    { label: 'H2', action: () => insertMarkdown('## ', ''), shortcut: null },
    { label: 'H3', action: () => insertMarkdown('### ', ''), shortcut: null },
    { label: 'List', action: () => insertMarkdown('* ', ''), shortcut: null },
  ];

  const insertMarkdown = (before: string, after: string) => {
    const textarea = document.getElementById('markdown-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText =
      value.substring(0, start) + before + selectedText + after + value.substring(end);

    onChange(newText);

    // Set cursor position after insertion
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      );
    }, 0);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Full Description {required && '*'}
          {maxLength && (
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
              ({value.length}/{maxLength})
            </span>
          )}
        </label>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setIsPreviewMode(false)}
            className={`px-3 py-1 text-xs rounded ${
              !isPreviewMode
                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Write
          </button>
          <button
            type="button"
            onClick={() => setIsPreviewMode(true)}
            className={`px-3 py-1 text-xs rounded ${
              isPreviewMode
                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Preview
          </button>
        </div>
      </div>

      {!isPreviewMode && (
        <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
          {/* Toolbar */}
          <div className="flex flex-wrap gap-1 p-2 bg-gray-50 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600">
            {toolbarButtons.map((button, index) => (
              <button
                key={index}
                type="button"
                onClick={button.action}
                className="px-2 py-1 text-xs bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors"
                title={button.shortcut || button.label}
              >
                {button.label}
              </button>
            ))}
          </div>

          {/* Editor */}
          <textarea
            id="markdown-editor"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={rows}
            required={required}
            maxLength={maxLength}
            className="w-full px-4 py-3 border-0 focus:ring-0 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
            placeholder={placeholder}
          />
        </div>
      )}

      {isPreviewMode && (
        <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-700 min-h-[200px]">
          {value ? (
            <div
              className="prose prose-sm max-w-none dark:prose-invert text-gray-900 dark:text-white"
              dangerouslySetInnerHTML={{ __html: markdownToHtml(value) }}
            />
          ) : (
            <p className="text-gray-500 dark:text-gray-400 italic">Nothing to preview yet...</p>
          )}
        </div>
      )}

      <div className="text-xs text-gray-500 dark:text-gray-400">
        <p className="mb-1">Supports markdown formatting:</p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <span>**bold** or *italic*</span>
          <span>[link](url)</span>
          <span># H1, ## H2, ### H3</span>
          <span>* bullet lists</span>
        </div>
      </div>
    </div>
  );
};

export default MarkdownEditor;
