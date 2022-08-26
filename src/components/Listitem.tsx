import * as Y from "yjs";
import { QuillBinding } from "y-quill";
import Quill from "quill";
//import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useCallback, useEffect, useState, useRef } from "react";
import "./Listitem.css";

export function Listitem(props: {
  text: string;
  //ytext: Y.Text;
  offsetX: number;
  isActive: boolean;
  createListitemFn: any;
  deleteListitemFn: any;
  updateListitemFn: any;
  arrowUpFn: any;
  arrowDownFn: any;
}) {

  const [isEmpty, setIsEmpty] = useState(true);
  const handleKeyDown = useCallback((e: any) => {
    if (e.key === "Enter") {
      e.preventDefault();
      props.createListitemFn();
    //} else if (isEmpty && e.key === "Backspace") {
      //props.deleteListitemFn(true);
    } else if (e.key === "d" && e.ctrlKey) {
      e.preventDefault(); // otherwise first char of newly focused element is deleted
      props.deleteListitemFn(false);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      props.arrowUpFn();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      props.arrowDownFn();
    }
  }, [isEmpty, props]);

  useEffect(() => {
    if (!reactQuillRef.current) return;
    const quillElem = reactQuillRef.current
    quillElem.addEventListener('keydown', handleKeyDown)
    return () => {
      quillElem.removeEventListener('keydown', handleKeyDown)
    };
  }, [handleKeyDown]);

  const disableEnter = (editor: any) => {
    const keyboard = editor.getModule("keyboard");
    keyboard.bindings["Enter"] = null;
    keyboard.bindings["13"] = null;
  };

  const reactQuillRef: any = useRef(null);
  const quill: any = useRef(null);

  // A Yjs document holds the shared data
  useEffect(() => {
    if (!reactQuillRef.current) return;
    //const editor = reactQuillRef.current.getEditor();
    quill.current = new Quill(reactQuillRef.current, {
      modules: {
        //cursors: true,
        toolbar: false,
        history: {
          // Local undo shouldn't undo changes
          // from remote users
          userOnly: true,
        },
      },
      placeholder: 'Type something...',
      theme: 'snow' // 'bubble' is also great
    })

    // need to bind before running focus check, otherwise Enter still has default behaviour
    //const binding = new QuillBinding(props.ytext, quill);

    // Prevent Enter handling (unsure how to do this otherwise as it appears that we can't override `Enter`
    // https://github.com/quilljs/quill/issues/2423
    // https://github.com/zenoamaro/react-quill/issues/369
    // https://stackoverflow.com/questions/32495936/quill-js-how-to-prevent-newline-entry-on-enter-to-submit-the-input
    // If issues with this approach, could monitor for newlines and post-process
    disableEnter(quill.current);

    quill.current.on("text-change", props.updateListitemFn)

    return () => {
      //binding.destroy();
      //quill.off("editor-change", emptyHandler);
      //current.removeEventListener('keydown', emptyHandler)
      quill.current.off("text-change", props.updateListitemFn)
    };
  }, [props.updateListitemFn]);

  useEffect(() => {
    if (!quill.current) return;

    quill.current.setText(props.text);

    if (props.isActive) {
      quill.current.focus();
      // go to end of selection if props.offsetX === -1
      const newOffsetX =
        props.offsetX >= 0 ? props.offsetX : quill.current.getLength() - 1;
      quill.current.setSelection(newOffsetX, 0);
    }

    //const emptyHandler = () => {
        //console.log("empty handler: " + quill.getText().trim().length);
        //quill.getText().trim().length === 0 ? setIsEmpty(true) : setIsEmpty(false);
    //};

    //quill.on("editor-change", emptyHandler);
    //const current = reactQuillRef.current
    //current.addEventListener('keydown', emptyHandler)

    //return () => {
      //quill.off("editor-change", emptyHandler);
      //current.removeEventListener('keydown', emptyHandler)
    //};
  }, [props.text, props.isActive, props.offsetX]);

  return (
    <div className="listitem">
      <div ref={reactQuillRef}>
      </div>
    </div>
  );
      //<ReactQuill
        //ref={reactQuillRef}
        //theme="snow"
        ////value={value}
        //defaultValue={props.ytext.toDelta()}
        ////onChange={handleChange}
        ////onChange={handleChangeUncontrolled}
        //onKeyDown={handleKeyDown}
        //placeholder={"Type something..."}
        //modules={{
          ////cursors: true,
          //toolbar: false,
          //history: {
            //// Local undo shouldn't undo changes
            //// from remote users
            //userOnly: true,
          //},
        //}}
      ///>
}
