import { useEffect, useRef, useState } from "react";
import "./Search.css";

function SearchGroup(props: {
  text: string;
  isActive: boolean;
  createListitemFn: any;
  updateSearchGroupFn: any;
  deleteSearchGroupFn: any;
  splitSearchGroupFn: any;
  arrowDownFn: any;
}) {
  const el: any = useRef(null);

  useEffect(() => {
    if (props.isActive) {
      el.current.focus();
    }
  });

  //const [inputText, setInputText] = useState(props.text);
  const handleChange = (e: any) => {
    if (e.currentTarget.textContent === "") {
      e.currentTarget.innerHTML = "";
    }
    //setInputText(e.target.value);
    //setInputText(e.currentTarget.textContent);
    //props.updateSearchGroupFn(e.target.value);
    props.updateSearchGroupFn(e.currentTarget.textContent);
  };

  const handleKeyDown = (e: any) => {
    const selection: Selection | null = document.getSelection();
    if (!selection) return;

    const offset = selection.anchorOffset;
    const text = e.target.textContent;
    const len = text.length;
    //const offset = e.target.selectionStart;
    //const text = e.target.value;

    if (e.key === "Enter") {
      e.preventDefault();
      props.createListitemFn();
    } else if (e.key === "Tab") {
      e.preventDefault();
      const leftText = text.slice(0, offset);
      const rightText = text.slice(offset);
      //setInputText(leftText);
      props.splitSearchGroupFn([leftText, rightText]);
    } else if (e.key === "d" && e.ctrlKey) {
      e.preventDefault(); // otherwise first char of newly focused element is deleted
      props.deleteSearchGroupFn();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      props.arrowDownFn();
    }
  };

  return (
    <div
      ref={el}
      className="searchgroup"
      onKeyDown={handleKeyDown}
      onInput={(e) => handleChange(e)}
      contentEditable
      //tabIndex={0}
    >
      {props.text}
    </div>

    //<input
    //ref={el}
    //type="text"
    //value={inputText}
    //onChange={handleChange}
    //onKeyDown={handleKeyDown}
    ///>
  );
}

export function Search(props: {
  activeSearch: boolean;
  searchGroups: string[];
  setSearchGroupsFn: any;
  createListitemFn: any;
  arrowDownFn: any;
}) {
  const [searchIdx, setSearchIdx] = useState(0);

  const updateSearchGroup = (idx: number) => (newText: string) => {
    props.setSearchGroupsFn((s: string[]) => {
      s[idx] = newText;
      return s;
    });
  };

  const deleteSearchGroup = (idx: number) => () => {
    props.setSearchGroupsFn((s: string[]) => {
      if (s.length === 1) {
        updateSearchGroup(idx)(s[0]);
        //return ['\u200B']; // because stupid contenteditable
      }
      return [...s.slice(0, idx), ...s.slice(idx + 1)];
    });
    setSearchIdx(searchIdx > 0 ? searchIdx - 1 : 0);
  };

  const splitSearchGroup = (idx: number) => (newItems: string[]) => {
    props.setSearchGroupsFn((s: string[]) => {
      return [...s.slice(0, idx), ...newItems, ...s.slice(idx + 1)];
    });
    setSearchIdx(searchIdx + 1);
  };

  return (
    <div id="search">
      <div id="searchgroups">
        {props.searchGroups.map((s, i) => (
          <SearchGroup
            text={s}
            key={i}
            isActive={props.activeSearch && searchIdx === i}
            createListitemFn={props.createListitemFn}
            updateSearchGroupFn={updateSearchGroup(i)}
            deleteSearchGroupFn={deleteSearchGroup(i)}
            splitSearchGroupFn={splitSearchGroup(i)}
            arrowDownFn={props.arrowDownFn}
          />
        ))}
      </div>
    </div>
  );
}
