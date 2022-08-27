import { useEffect, useRef, useState } from "react";
import "./Search.css";

function SearchGroup(props: {
  text: string;
  isActive: boolean;
  offset: number;
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

      const selection = window.getSelection();
      if (selection) {
        let node = el.current;
        if (node.firstChild) node = node.firstChild;
        const r = document.createRange();
        try {
          r.setStart(node, props.offset);
          //r.setEnd(node, props.offset);
          selection.removeAllRanges();
          selection.addRange(r);
        } catch (e) {
          //console.log(e);
        }
      }
    }
  });

  const handleChange = (e: any) => {
    if (e.currentTarget.textContent === "") {
      e.currentTarget.innerHTML = "";
    }

    let offset = 0;
    const selection = document.getSelection();
    if (selection) {
      offset = selection.anchorOffset;
    }

    props.updateSearchGroupFn(e.currentTarget.textContent, offset);
  };

  const handleKeyDown = (e: any) => {
    const selection = window.getSelection();
    const offset = selection?.anchorOffset;
    const text = e.target.textContent;

    if (e.key === "Enter") {
      e.preventDefault();
      props.createListitemFn();
    } else if (e.key === "Tab") {
      e.preventDefault();
      const leftText = text.slice(0, offset);
      const rightText = text.slice(offset);
      props.splitSearchGroupFn([leftText, rightText]);
    } else if (e.key === "d" && e.ctrlKey) {
      e.preventDefault(); // otherwise first char of newly focused element is deleted
      props.deleteSearchGroupFn();
    } else if (e.key === "Backspace") {
      if (text.length === 0) {
        props.deleteSearchGroupFn();
        e.preventDefault();
      }
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
      suppressContentEditableWarning={true}
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
  const [offset, setOffset] = useState(0);

  const updateSearchGroup = (idx: number) => (newText: string, x?: number) => {
    props.setSearchGroupsFn((s: string[]) => {
      return [...s.slice(0, idx), newText, ...s.slice(idx + 1)];
    });
    if (x) setOffset(x);
  };

  const deleteSearchGroup = (idx: number) => () => {
    if (props.searchGroups.length > 1) {
      props.setSearchGroupsFn((s: string[]) => {
        return [...s.slice(0, idx), ...s.slice(idx + 1)];
      });
      let offset = 0;
      if (idx > 0) {
        offset = props.searchGroups[idx - 1].length;
      }
      setOffset(offset);
      setSearchIdx(searchIdx > 0 ? searchIdx - 1 : 0);
    } else {
      updateSearchGroup(0)("", 0);
    }
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
            key={i}
            text={s}
            isActive={props.activeSearch && searchIdx === i}
            offset={offset}
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
