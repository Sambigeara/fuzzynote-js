import * as Y from 'yjs'
import { QuillBinding } from 'y-quill'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useEffect, useState } from 'react';
import './Listitem.css';

export function Listitem(props: {ytext: Y.Text}) {
  const [value, setValue] = useState(props.ytext.toString());
  const [editorRef, setEditorRef] = useState<ReactQuill | null>(null);

  // A Yjs document holds the shared data
  useEffect(() => {
    if (!editorRef) return;
    new QuillBinding(props.ytext, editorRef.getEditor())
  }, [editorRef, props.ytext]);

  return (
    <div className="listitem">
      <ReactQuill
        ref={(el: any) => (setEditorRef(el))}
        theme="snow"
        value={value}
        onChange={setValue}
        modules={{
          //cursors: true,
          toolbar: false,
          history: {
            // Local undo shouldn't undo changes
            // from remote users
            userOnly: true
          }
        }}
      />
    </div>
  );
}
