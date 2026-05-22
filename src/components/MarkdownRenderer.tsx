import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-invert max-w-none 
      prose-headings:text-white prose-headings:font-display prose-headings:tracking-tight 
      prose-p:text-gray-400 prose-p:leading-relaxed
      prose-a:text-pink-500 prose-a:no-underline hover:prose-a:underline
      prose-strong:text-white
      prose-ul:text-gray-400 prose-ol:text-gray-400
      prose-table:border prose-table:border-white/10 prose-th:bg-white/5 prose-th:p-4 prose-td:p-4
      prose-img:rounded-3xl prose-img:shadow-2xl prose-img:mx-auto prose-img:max-w-full
      prose-blockquote:border-l-pink-500 prose-blockquote:bg-pink-500/5 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:italic prose-blockquote:text-pink-100"
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
