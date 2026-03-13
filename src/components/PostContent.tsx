'use client';

interface PostContentProps {
  content: string;
}

export default function PostContent({ content }: PostContentProps) {
  // Simple markdown-like renderer
  function renderContent(text: string): string {
    return text
      // Headers
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      // Code blocks
      .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      // Inline code
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      // Bold
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      // Horizontal rule
      .replace(/^---$/gm, '<hr />')
      // Blockquote
      .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
      // Unordered list items
      .replace(/^[\*\-] (.+)$/gm, '<li>$1</li>')
      // Ordered list items
      .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
      // Wrap consecutive li elements in ul
      .replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`)
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      // Paragraphs (lines that aren't headers, lists, etc.)
      .replace(/^(?!<[hupbao]).+$/gm, (match) => {
        if (match.trim() === '') return '';
        return `<p>${match}</p>`;
      })
      // Remove extra blank lines
      .replace(/\n{3,}/g, '\n\n');
  }

  const html = renderContent(content);

  return (
    <div
      className="prose-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
