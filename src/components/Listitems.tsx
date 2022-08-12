import * as Y from 'yjs'
import { WebrtcProvider } from 'y-webrtc'
import QuillCursors from 'quill-cursors'
import { QuillBinding } from 'y-quill'
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useEffect, useState } from 'react';
import './Listitems.css';

Quill.register('modules/cursors', QuillCursors)

//function Listitem(props: {text: Y.Text}) {
function Listitem(props: {text: string}) {
  //const [listitemValue, setListitemValue] = useState(props.text.toString());
  const [listitemValue, setListitemValue] = useState(props.text);
  const [editorRef, setEditorRef] = useState(null);

  // A Yjs document holds the shared data
  useEffect(() => {
    if (!editorRef) return;
    const ydoc = new Y.Doc();
    //const provider = new WebrtcProvider(props.text.toString(), ydoc);
    const provider = new WebrtcProvider(props.text, ydoc);
    let ytext = ydoc.getText(props.text);
    // "Bind" the quill editor to a Yjs text type.
    const binding = new QuillBinding(ytext, (editorRef as ReactQuill).getEditor(), provider.awareness)
    return () => {
      if (provider) {
        provider.disconnect();
        ydoc.destroy();
      }
    };
  }, [editorRef]);

  //useEffect(() => {
    //props.text.observeDeep(() => {
      //console.log("POW");
      //setListitemValue(props.text.toString());
    //});
    //return () => (props.text.unobserveDeep(()=>{}));
  //});

  return (
    <div className="listitem">
      <ReactQuill
        ref={(el: any) => (setEditorRef(el))}
        theme="snow"
        value={listitemValue}
        onChange={setListitemValue}
        modules={{
          cursors: true,
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
        //ref={(el: any) => (editorRef = el)}
}

//export function Listitems(props: {items: Y.Array<Y.Text>}) {
export function Listitems(props: {items: string[]}) {
  return (
    <div className="listitems">
      {props.items.map((i) => <Listitem key={i.toString()}
                                        text={i} />)}
    </div>
  );
}
