import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { IndexeddbPersistence } from "y-indexeddb";
//import QuillCursors from 'quill-cursors'
//import { Quill } from 'react-quill';
import "react-quill/dist/quill.snow.css";
import { useEffect, useMemo, useState } from "react";
import { Listitem } from "./components/Listitem";
import { Navbar } from "./components/Navbar";
import { Search } from "./components/Search";
//import useKeyPress from "./lib/utils";
import "./App.css";

//Quill.register('modules/cursors', QuillCursors)

function App() {
  //const isCtrl: boolean = useKeyPress('Control');
  const ydoc = useMemo(() => new Y.Doc(), []);
  //new IndexeddbPersistence('listitemIds', ydoc)
  const yarray: Y.Array<string> = ydoc.getArray("listitemIds");

  const [listitemIds, setListitemIds] = useState<string[]>([]);

  yarray.observe(() => {
    setListitemIds(yarray.toArray());
  });

  useEffect(() => {
    const provider = new WebrtcProvider("fuzzynote testtt", ydoc);
    return () => {
      if (provider) {
        provider.destroy();
      }
      ydoc.destroy();
    };
  }, [ydoc]);

  const [currentX, setCurrentX] = useState(0);
  const [currentY, setCurrentY] = useState(-1);
  const [searchGroups, setSearchGroups] = useState([""]);

  // Just in case the child component forgets to prevent deletion of final search group
  useEffect(() => {
    if (!searchGroups.length) {
      setSearchGroups([""]);
    }
  }, [searchGroups.length]);

  const createListitem = (idx: number) => () => {
    const newName = Date.now().toLocaleString(); // TODO a better unique name generator
    const newText = ydoc.getText(newName);
    const prefix = searchGroups.join(" ").trim();
    newText.insert(0, prefix + (prefix.length > 0 ? " " : ""));
    yarray.insert(idx + 1, [newName]);
    setCurrentX(-1);
    setCurrentY(idx + 1);
  };

  const deleteListItem = (idx: number) => (goToPrevious: boolean) => {
    const newX = goToPrevious ? -1 : 0; // TODO maintain offset for ctrl-d
    const newY = goToPrevious ? idx - 1 : idx;
    // ctrl d
    //const newLocalX = localX === null ? 0 : localX.index;
    //props.deleteListitemFn(newLocalX, props.offsetY);
    yarray.delete(idx);
    setCurrentX(newX);
    setCurrentY(newY < yarray.length ? newY : yarray.length - 1);
  };

  const navigate = (idx: number, direction: "up" | "down") => () => {
    setCurrentY(
      direction === "up"
        ? idx >= 0
          ? idx - 1
          : 0
        : idx + 1 < yarray.length
        ? idx + 1
        : yarray.length - 1
    );
  };

  return (
    <div className="App">
      <Navbar />
      <div id="canvas">
        <div id="board">
          <Search
            activeSearch={currentY === -1} // if listitems are present and active, it'll override focus in this element
            searchGroups={searchGroups}
            setSearchGroupsFn={setSearchGroups}
            createListitemFn={createListitem(-1)}
            arrowDownFn={navigate(0, "down")}
          />
          <div id="listitems">
            {listitemIds.map((n, i) => (
              <Listitem
                key={n}
                offsetX={currentX}
                ytext={ydoc.getText(n)}
                createListitemFn={createListitem(i)}
                deleteListitemFn={deleteListItem(i)}
                arrowUpFn={navigate(i, "up")}
                arrowDownFn={navigate(i, "down")}
                isActive={currentY === i}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
