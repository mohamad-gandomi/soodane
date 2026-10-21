import React from 'react';

export function MarkdownContent({ content }: { content: string }) {
  if (!content) return null;

  const blocks = content.trim().split(/\n\s*\n/);

  return (
    <>
      {blocks.map((block, bIdx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // H3 heading
        if (trimmed.startsWith('### ')) {
          return <h3 key={bIdx}>{trimmed.replace(/^###\s+/, '')}</h3>;
        }

        // Blockquote
        if (trimmed.startsWith('> ')) {
          const text = trimmed
            .split('\n')
            .map((l) => l.replace(/^>\s*/, ''))
            .join(' ');
          return <blockquote key={bIdx}>{parseInline(text)}</blockquote>;
        }

        // Bullet list
        const lines = trimmed.split('\n');
        if (lines.length > 0 && lines.every((l) => /^\s*[-*•]\s+/.test(l))) {
          const items = lines.map((l) => l.replace(/^\s*[-*•]\s+/, ''));
          return (
            <ul key={bIdx}>
              {items.map((item, i) => (
                <li key={i}>{parseInline(item)}</li>
              ))}
            </ul>
          );
        }

        // Numbered list
        if (lines.length > 0 && lines.every((l) => /^\s*(\d+|[۰-۹]+)[\.\)]\s+/.test(l))) {
          const items = lines.map((l) => l.replace(/^\s*(\d+|[۰-۹]+)[\.\)]\s+/, ''));
          return (
            <ol key={bIdx}>
              {items.map((item, i) => (
                <li key={i}>{parseInline(item)}</li>
              ))}
            </ol>
          );
        }

        // Paragraph
        return <p key={bIdx}>{parseInline(trimmed)}</p>;
      })}
    </>
  );
}

function parseInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(<strong key={match.index}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith('*') && token.endsWith('*')) {
      parts.push(<em key={match.index}>{token.slice(1, -1)}</em>);
    } else if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(<code key={match.index}>{token.slice(1, -1)}</code>);
    }
    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}
