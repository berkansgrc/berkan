"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { 
  TextBold, TextItalic, Link2, Image as ImageIcon, 
  QuoteDown, HambergerMenu, Code, ArrowRotateLeft as Undo, ArrowRotateRight as Redo 
} from "iconsax-react";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt('Görsel (ImgBB vb.) URL adresini girin:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL:', previousUrl);
    
    if (url === null) return;
    
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 bg-surface border-b border-border/50 rounded-t-2xl">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`p-2 rounded-xl transition-colors ${editor.isActive('bold') ? 'bg-primary/20 text-primary' : 'hover:bg-muted text-muted-foreground'}`}
        title="Kalın (Ctrl+B)"
      >
        <TextBold className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`p-2 rounded-xl transition-colors ${editor.isActive('italic') ? 'bg-primary/20 text-primary' : 'hover:bg-muted text-muted-foreground'}`}
        title="İtalik (Ctrl+I)"
      >
        <TextItalic className="w-5 h-5" />
      </button>
      
      <div className="w-px h-6 bg-border/50 mx-1" />
      
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded-xl transition-colors font-bold ${editor.isActive('heading', { level: 2 }) ? 'bg-primary/20 text-primary' : 'hover:bg-muted text-muted-foreground'}`}
        title="Başlık 2"
      >
        H2
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`p-2 rounded-xl transition-colors font-bold ${editor.isActive('heading', { level: 3 }) ? 'bg-primary/20 text-primary' : 'hover:bg-muted text-muted-foreground'}`}
        title="Başlık 3"
      >
        H3
      </button>

      <div className="w-px h-6 bg-border/50 mx-1" />

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded-xl transition-colors ${editor.isActive('bulletList') ? 'bg-primary/20 text-primary' : 'hover:bg-muted text-muted-foreground'}`}
        title="Madde İşaretli Liste"
      >
        <HambergerMenu className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded-xl transition-colors ${editor.isActive('blockquote') ? 'bg-primary/20 text-primary' : 'hover:bg-muted text-muted-foreground'}`}
        title="Alıntı"
      >
        <QuoteDown className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`p-2 rounded-xl transition-colors ${editor.isActive('codeBlock') ? 'bg-primary/20 text-primary' : 'hover:bg-muted text-muted-foreground'}`}
        title="Kod Bloğu"
      >
        <Code className="w-5 h-5" />
      </button>

      <div className="w-px h-6 bg-border/50 mx-1" />

      <button
        type="button"
        onClick={setLink}
        className={`p-2 rounded-xl transition-colors ${editor.isActive('link') ? 'bg-primary/20 text-primary' : 'hover:bg-muted text-muted-foreground'}`}
        title="Bağlantı (Link) Ekle"
      >
        <Link2 className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={addImage}
        className="p-2 rounded-xl hover:bg-muted text-muted-foreground transition-colors"
        title="Görsel (Resim) Ekle"
      >
        <ImageIcon className="w-5 h-5" />
      </button>

      <div className="flex-1" />

      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        className="p-2 rounded-xl hover:bg-muted text-muted-foreground transition-colors disabled:opacity-50"
        title="Geri Al (Ctrl+Z)"
      >
        <Undo className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        className="p-2 rounded-xl hover:bg-muted text-muted-foreground transition-colors disabled:opacity-50"
        title="İleri Al (Ctrl+Y)"
      >
        <Redo className="w-5 h-5" />
      </button>
    </div>
  );
};

export default function RichTextEditor({ content, onChange, placeholder = "Yazmaya başlayın..." }: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3, 4],
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline decoration-primary/30 underline-offset-4',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-xl border border-border/50 max-h-[500px] object-cover mx-auto my-6',
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-p:text-foreground/80 prose-headings:text-foreground prose-a:text-primary max-w-none focus:outline-none min-h-[300px] p-6 text-lg leading-relaxed',
      },
    },
    immediatelyRender: false,
  });

  return (
    <div className="border border-border/50 rounded-2xl bg-card overflow-hidden focus-within:border-primary/50 transition-colors shadow-sm">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
