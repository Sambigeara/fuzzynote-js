import * as Y from "yjs";
//import { QuillBinding } from "y-quill";
import Quill from "quill";
//import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useCallback, useEffect, useState, useRef } from "react";
import "./Listitem.css";
import { PartialQuillBinding } from "../lib/PartialQuillBinding";

export function Listitem(props: {
  ytext: Y.Text;
  searchString: string,
  offsetX: number;
  isActive: boolean;
  createListitemFn: any;
  deleteListitemFn: any;
  arrowUpFn: any;
  arrowDownFn: any;
}) {

  const reactQuillRef: any = useRef(null);
  const quill: any = useRef(null);
  useEffect(() => {
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
    //const binding = new QuillBinding(props.ytext, quill.current);
    const binding = new PartialQuillBinding(props.ytext, quill.current, props.searchString);

    // Prevent Enter handling (unsure how to do this otherwise as it appears that we can't override `Enter`
    // https://github.com/quilljs/quill/issues/2423
    // https://github.com/zenoamaro/react-quill/issues/369
    // https://stackoverflow.com/questions/32495936/quill-js-how-to-prevent-newline-entry-on-enter-to-submit-the-input
    // If issues with this approach, could monitor for newlines and post-process
    const keyboard = quill.current.getModule("keyboard");
    keyboard.bindings["Enter"] = null;
    keyboard.bindings["13"] = null;

    return () => {
      binding.destroy();
      //quill.off("editor-change", emptyHandler);
      //current.removeEventListener('keydown', emptyHandler)
    };
  }, [props.ytext, props.searchString]);

  const [isEmpty, setIsEmpty] = useState(true);
  useEffect(() => {
    const handleKeyDown = (e: any) => {
      if (e.key === "Enter") {
        e.preventDefault();
        props.createListitemFn();
      } else if (isEmpty && e.key === "Backspace") {
        props.deleteListitemFn(true);
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
    };

    const cur = reactQuillRef.current;
    cur.addEventListener('keydown', handleKeyDown);
    return () => {
      cur.removeEventListener('keydown', handleKeyDown);
    };
  }, [props, isEmpty]); // TODO destructure props

  useEffect(() => {
    if (props.isActive) {
      quill.current.focus();
      // go to end of selection if props.offsetX === -1
      const newOffsetX =
        props.offsetX >= 0 ? props.offsetX : quill.current.getLength() - 1;
      quill.current.setSelection(newOffsetX, 0);
    }
  }, [props.isActive, props.offsetX]);

  useEffect(() => {
    const emptyHandler = () => {
        quill.current.getText().trim().length === 0 ? setIsEmpty(true) : setIsEmpty(false);
    };

    const cur = reactQuillRef.current
    cur.addEventListener('keyup', emptyHandler)
    return () => {
      cur.removeEventListener('keyup', emptyHandler)
    };
  }, []);

  return (
    <div className="listitem">
      <div ref={reactQuillRef}>
      </div>
    </div>
  );
}
