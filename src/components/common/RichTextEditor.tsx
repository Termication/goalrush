'use client';

import { useRef } from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { Button } from '@/components/ui/button';
import {
  Bold, Italic, Strikethrough, Heading1, Heading2,
  List, ListOrdered, ImageIcon
} from 'lucide-react';

// --- MenuBar Component ---
const MenuBar = ({ editor }: { editor: Editor | null }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!editor) return null;

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();

      if (res.ok && json.success) {
        // secure_url to insert the image
        editor.chain().focus().setImage({ src: json.data.secure_url }).run();
      } else {
        throw new Error(json.error || 'Upload failed');
      }
    } catch (err: any) {
      console.error('Image upload failed:', err.message);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const buttonClass = (type: string, options?: {}) =>
    `p-2 rounded-lg ${editor.isActive(type, options) ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`;

  return (
    <div className="flex flex-wrap items-center gap-2 border border-input rounded-t-md p-2 bg-background">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <Button type="button" onClick={() => editor.chain().focus().toggleBold().run()} variant="ghost" size="icon" className={buttonClass('bold')}><Bold className="h-4 w-4" /></Button>
      <Button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} variant="ghost" size="icon" className={buttonClass('italic')}><Italic className="h-4 w-4" /></Button>
      <Button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} variant="ghost" size="icon" className={buttonClass('strike')}><Strikethrough className="h-4 w-4" /></Button>
      <Button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} variant="ghost" size="icon" className={buttonClass('heading', { level: 1 })}><Heading1 className="h-4 w-4" /></Button>
      <Button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} variant="ghost" size="icon" className={buttonClass('heading', { level: 2 })}><Heading2 className="h-4 w-4" /></Button>
      <Button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} variant="ghost" size="icon" className={buttonClass('bulletList')}><List className="h-4 w-4" /></Button>
      <Button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} variant="ghost" size="icon" className={buttonClass('orderedList')}><ListOrdered className="h-4 w-4" /></Button>
      <Button type="button" onClick={triggerFileSelect} variant="ghost" size="icon">
        <ImageIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};

// --- RichTextEditor Component ---
interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export const RichTextEditor = ({ content, onChange }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        
        heading: {
          levels: [1, 2],
        },
      }),
      Image.configure({ inline: false }),
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert max-w-none prose-sm sm:prose-base p-4 focus:outline-none min-h-[400px]',
      },
    },
    onUpdate({ editor }) {
      let html = editor.getHTML();

      // html = html.replace(/<p>(\s|&nbsp;)*<\/p>/g, '');

      onChange(html);
    }
      });

  return (
    <div className="rounded-md border border-input bg-background">
      <MenuBar editor={editor} />
      <EditorContent
        editor={editor}
        className="prose dark:prose-invert max-w-none prose-sm sm:prose-base p-4 focus:outline-none min-h-[400px] [&>*]:mb-4"
      />
    </div>
  );
};
