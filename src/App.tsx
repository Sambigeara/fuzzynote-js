import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
//import { IndexeddbPersistence } from "y-indexeddb";
//import QuillCursors from 'quill-cursors'
import "react-quill/dist/quill.snow.css";
import { useEffect, useMemo, useState } from "react";
import { Listitem } from "./components/Listitem";
import { Navbar } from "./components/Navbar";
import { Search } from "./components/Search";
import "./App.css";

//Quill.register('modules/cursors', QuillCursors)

function App() {
  const ydoc = useMemo(() => new Y.Doc(), []);
  const yarray: Y.Array<string> = useMemo(
    () => ydoc.getArray("listitemTexts"),
    [ydoc]
  );
  const ymap: Y.Map<Y.Text> = useMemo(() => ydoc.getMap("listitemMap"), [ydoc]);
  //new IndexeddbPersistence('listitemIds', ydoc)

  useEffect(() => {
    const provider = new WebrtcProvider("fuzzynote testtt", ydoc);
    return () => {
      if (provider) {
        provider.destroy();
      }
      ydoc.destroy();
    };
  }, [ydoc]);

  const isMatch = (text: string) => {
    for (const s of searchGroups) {
      if (s.length > 0 && !text.includes(s)) return false;
    }
    return true;
  };

  const [searchGroups, setSearchGroups] = useState([""]);
  const [listitemNames, setListitemNames] = useState<string[]>([]);

  useEffect(() => {
    yarray.observe(() => {
      setListitemNames(yarray.toArray());
    });
  }, [yarray]);

  const [currentX, setCurrentX] = useState(0);
  const [currentY, setCurrentY] = useState(-1);
  const createListitem = (idx: number) => () => {
    const newName = crypto.randomUUID();
    //const ytext = ydoc.getText(newName);

    ydoc.transact(() => {
      const ytext = new Y.Text(getSearchString());
      ymap.set(newName, ytext);
      //ytext.insert(0, getSearchString());
      yarray.insert(idx + 1, [newName]);
    });

    setCurrentX(-1);
    setCurrentY(idx + 1);
  };

  const deleteListItem = (idx: number) => (goToPrevious: boolean) => {
    const newX = goToPrevious ? -1 : 0; // TODO maintain offset for ctrl-d
    const newY = goToPrevious ? idx - 1 : idx;

    ydoc.transact(() => {
      const key = yarray.get(idx);
      yarray.delete(idx);
      ymap.delete(key);
    });

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

  const getSearchString = (): string => {
    const prefix = searchGroups.join(" ").trim();
    return prefix + (prefix.length > 0 ? " " : "");
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
            {listitemNames.map((n, i) =>
              isMatch((ymap.get(n) ?? new Y.Text()).toString()) ? (
                <Listitem
                  key={n}
                  offsetX={currentX}
                  ytext={ymap.get(n) ?? new Y.Text()} // TODO ensure never undefined
                  searchString={getSearchString()}
                  createListitemFn={createListitem(i)}
                  deleteListitemFn={deleteListItem(i)}
                  arrowUpFn={navigate(i, "up")}
                  arrowDownFn={navigate(i, "down")}
                  isActive={currentY === i}
                />
              ) : null
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
