'use client';

import { Editor } from '@tinymce/tinymce-react';
import { useRef } from 'react';
import type { Editor as TinyMCEEditor } from 'tinymce';

// This is the RichTextEditor component powered by TinyMCE.
export const RichTextEditor = ({ content, onChange }: { content: string, onChange: (html: string) => void }) => {
  const editorRef = useRef<any>(null);

  // This function handles the image upload process.
  const imageUploadHandler = async (blobInfo: any) => {
    const formData = new FormData();
    formData.append('file', blobInfo.blob(), blobInfo.filename());

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Upload failed');
      }
      
      return json.data.secure_url;

    } catch (err: any) {
      console.error('Image upload failed:', err.message);
      return Promise.reject(`Image upload failed: ${err.message}`);
    }
  };

  return (
    <Editor
      apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY || 'YOUR_FALLBACK_API_KEY'}
      onInit={(_evt, editor) => editorRef.current = editor}
      initialValue={content}
      init={{
        height: 500,
        menubar: false,
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
          'insertdatetime', 'media', 'table', 'help', 'wordcount'
        ],
        toolbar: 'undo redo | blocks | ' +
          'bold italic forecolor backcolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | table image link modelquote | help',
        
        content_style: `
                  body { font-family:Helvetica,Arial,sans-serif; font-size:14px } 
                  img { border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); max-width: 100%; height: auto; }
                  blockquote.model-quote { border-left: 4px solid #4f46e5; margin: 1.5em 0; padding: 0.5em 1em; background-color: #f1f5f9; border-radius: 4px; } 
                  blockquote.model-quote footer { margin-top: 1em; font-style: italic; text-align: right;
                  
                  
                  table { border-collapse: collapse; width: 100%; min-width: 400px; margin: 1.5em 0; }
                  th, td { border: 1px solid #cbd5e1; padding: 12px; text-align: left; }
                  th { background-color: #f1f5f9; font-weight: bold;}
                `,

        table_default_attributes: {
          border: '0'
        },
        table_default_styles: {
          width: '100%',
        },

        images_upload_handler: imageUploadHandler,
        automatic_uploads: true,
        file_picker_types: 'image',
        
        setup: (editor: TinyMCEEditor) => {
            editor.on('blur', () => {
                const content = editor.getContent();
                onChange(content);
            });

            editor.ui.registry.addButton('modelquote', {
              icon: 'quote',
              tooltip: 'Insert model quote',
              onAction: () => {
                const quoteText = window.prompt("Enter the quote:");
                if (!quoteText) return;

                const author = window.prompt("Enter the author or source (optional):");
                
                const quoteHtml = `
                  <blockquote class="model-quote">
                    <p>${quoteText}</p>
                    ${author ? `<footer>— <cite>${author}</cite></footer>` : ''}
                  </blockquote>
                  <p></p> 
                `;
                
                editor.execCommand('mceInsertContent', false, quoteHtml);
              }
            });
        },
      }}
    />
  );
};
