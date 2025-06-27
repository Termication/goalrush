'use client';

import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { Button } from '@/components/ui/button';
import { Bold, Italic, Strikethrough, Code, Heading1, Heading2, Heading3, Pilcrow, List, ListOrdered, ImageIcon, Quote } from 'lucide-react';
import Heading from '@tiptap/extension-heading'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import ListItem from '@tiptap/extension-list-item'



// --- MenuBar Component ---
const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt('Enter the URL of the image:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const buttonClass = (type: string, options?: {}) => 
    `p-2 rounded-lg ${editor.isActive(type, options) ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`;

  return (
    <div className="flex flex-wrap items-center gap-2 border border-input rounded-t-md p-2 bg-background">
      <Button type="button" onClick={() => editor.chain().focus().toggleBold().run()} disabled={!editor.can().chain().focus().toggleBold().run()} variant="ghost" size="icon" className={buttonClass('bold')}><Bold className="h-4 w-4" /></Button>
      <Button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} disabled={!editor.can().chain().focus().toggleItalic().run()} variant="ghost" size="icon" className={buttonClass('italic')}><Italic className="h-4 w-4" /></Button>
      <Button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} disabled={!editor.can().chain().focus().toggleStrike().run()} variant="ghost" size="icon" className={buttonClass('strike')}><Strikethrough className="h-4 w-4" /></Button>
      <Button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} variant="ghost" size="icon" className={buttonClass('heading', { level: 1 })}><Heading1 className="h-4 w-4" /></Button>
      <Button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} variant="ghost" size="icon" className={buttonClass('heading', { level: 2 })}><Heading2 className="h-4 w-4" /></Button>
      <Button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} variant="ghost" size="icon" className={buttonClass('bulletList')}><List className="h-4 w-4" /></Button>
      <Button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} variant="ghost" size="icon" className={buttonClass('orderedList')}><ListOrdered className="h-4 w-4" /></Button>
      <Button type="button" onClick={addImage} variant="ghost" size="icon"><ImageIcon className="h-4 w-4" /></Button>
    </div>
  );
};

// RichTextEditor Component
interface RichTextEditorProps {
    content: string;
    onChange: (html: string) => void;
}

export const RichTextEditor = ({ content, onChange }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
      }),
      Heading.configure({
        levels: [1, 2, 3],
      }),
      BulletList,
      OrderedList,
      ListItem,
      Image.configure({ inline: false }),
    ],
    content: content,
    editorProps: {
      attributes: {
        // Enlarge the text box and apply typography styles via the `prose` class
        class: 'prose dark:prose-invert max-w-none prose-sm sm:prose-base p-4 focus:outline-none min-h-[400px]',
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  // Ensure the editor is initialized before rendering
  return (
    <div className="rounded-md border border-input bg-background">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};
