import * as Y from "yjs";
import { QuillBinding } from "y-quill";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useEffect, useState, useRef } from "react";
import "./Listitem.css";

export function Listitem(props: {
  //ytext: Y.Text;
  text: string,
  offsetX: number;
  isActive: boolean;
  createListitemFn: any;
  deleteListitemFn: any;
  updateTextFn: any;
  arrowUpFn: any;
  arrowDownFn: any;
}) {
  //const [value, setValue] = useState(props.ytext.toString());
  //const [value, setValue] = useState(props.text);
  const reactQuillRef = useRef<any>(null);

  const disableEnter = (editor: any) => {
    const keyboard = editor.getModule("keyboard");
    keyboard.bindings["Enter"] = null;
    keyboard.bindings["13"] = null;
  };

  // A Yjs document holds the shared data
  useEffect(() => {
    if (!reactQuillRef) return;
    //const editor = (reactQuillRef.current as ReactQuill).getEditor();
    const editor = reactQuillRef.current.getEditor();

    // Prevent Enter handling (unsure how to do this otherwise as it appears that we can't override `Enter`
    // https://github.com/quilljs/quill/issues/2423
    // https://github.com/zenoamaro/react-quill/issues/369
    // https://stackoverflow.com/questions/32495936/quill-js-how-to-prevent-newline-entry-on-enter-to-submit-the-input
    // If issues with this approach, could monitor for newlines and post-process
    disableEnter(editor);

    // need to bind before running focus check, otherwise Enter still has default behaviour
    //const binding = new QuillBinding(props.ytext, editor);

    if (props.isActive) {
      editor.focus();
      // go to end of selection if props.offsetX === -1
      const newOffsetX =
        props.offsetX >= 0 ? props.offsetX : editor.getLength() - 1;
      editor.setSelection(newOffsetX, 0);
    }

    return () => {
      //binding.destroy();
    };
  //}, [reactQuill, props.ytext, props.isActive, props.offsetX]);
  }, [props.isActive, props.offsetX]);

  const [isEmpty, setIsEmpty] = useState(true);
  useEffect(() => {
    if (!reactQuillRef) return;
    const editor = reactQuillRef.current.getEditor();
    editor.getText().trim().length === 0 ? setIsEmpty(true) : setIsEmpty(false);
  }, [reactQuillRef]);

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault();
      props.createListitemFn();
    //} else if (isEmpty && e.key === "Backspace") {
      //props.deleteListitemFn(true);
    } else if (e.key === "d" && e.ctrlKey) {
      e.preventDefault(); // otherwise first char of newly focused element is deleted
      props.deleteListitemFn(false);
    //} else if (e.key === "ArrowUp") {
      //e.preventDefault();
      //props.arrowUpFn();
    //} else if (e.key === "ArrowDown") {
      //e.preventDefault();
      //props.arrowDownFn();
    }
  };

  return (
    <div className="listitem">
      <ReactQuill
        ref={reactQuillRef}
        theme="snow"
        value={props.text}
        onChange={props.updateTextFn}
        onKeyDown={handleKeyDown}
        placeholder={"Type something..."}
        modules={{
          //cursors: true,
          toolbar: false,
          //magicUrl: true,
          history: {
            // Local undo shouldn't undo changes
            // from remote users
            userOnly: true,
          },
        }}
      />
    </div>
  );
}
