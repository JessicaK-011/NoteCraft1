import Placeholder from '@tiptap/extension-placeholder';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextAlign } from '@tiptap/extension-text-align';
import { Underline } from '@tiptap/extension-underline';
import { Highlight } from '@tiptap/extension-highlight';
import { Subscript } from '@tiptap/extension-subscript';
import { Superscript } from '@tiptap/extension-superscript';
import React, { useEffect } from 'react';
import EditorExtensions from './EditorExtensions';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

function TextEditor({ fileId }) {
  const notes = useQuery(api.notes.GetNotes, { fileId });

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Underline,
      Highlight.configure({ multicolor: false }),
      Subscript,
      Superscript,
      Placeholder.configure({ placeholder: 'Start taking your notes here...' }),
    ],
    editorProps: {
      attributes: {
        class: 'focus:outline-none h-screen p-5',
      },
    },
  });

  useEffect(() => {
    if (editor && notes !== undefined) {
      editor.commands.setContent(notes || ""); // Set empty content if notes are undefined
    }
  }, [notes, editor]);
  

  if (!editor) return null;

  return (
    <div>
      <EditorExtensions editor={editor} />
      <div className="overflow-scroll h-[88vh]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

export default TextEditor;

  