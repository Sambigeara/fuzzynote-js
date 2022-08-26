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
  const yarray: Y.Array<Y.Text> = useMemo(() => ydoc.getArray("listitemTexts"), [ydoc]);
  //new IndexeddbPersistence('listitemIds', ydoc)

  const [listitems, setListitems] = useState<string[]>([]);

  const hash = useMemo(() => crypto.randomUUID(), []);

  useEffect(() => {
    yarray.observeDeep((events: any, transaction: any) => {
      if (transaction.origin === hash) return;
      setListitems(yarray.toArray().map(t => t.toString()));
    });
  }, [yarray, hash]);

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

  const getSearchString = (): string => {
    const prefix = searchGroups.join(" ").trim();
    return prefix + (prefix.length > 0 ? " " : "");
  };

  const createListitem = (idx: number) => () => {
    ydoc.transact(() => {
      //const newName = crypto.randomUUID();
      const newText = new Y.Text(getSearchString());

      //ymap.set(newName, newText);
      //yarray.insert(idx + 1, [newName]);
      yarray.insert(idx + 1, [newText]);
    });

    setCurrentX(-1);
    setCurrentY(idx + 1);
  };

  const deleteListItem = (idx: number) => (goToPrevious: boolean) => {
    const newX = goToPrevious ? -1 : 0; // TODO maintain offset for ctrl-d
    const newY = goToPrevious ? idx - 1 : idx;
    ydoc.transact(() => {
      yarray.delete(idx);
    });

    setCurrentX(newX);
    setCurrentY(newY < yarray.length ? newY : yarray.length - 1);
  };

  const updateListitem = (idx: number) => (delta: any, oldContents: any, source: string) => {
    if (source !== "user") return;
    const ytext = yarray.get(idx);
    ydoc.transact(() => {
      const search = getSearchString();
      let ops = []
      if (ytext.toString().startsWith(search)) {
        ops = [{retain: getSearchString().length}, ...delta.ops]
      } else {
        ops = delta.ops
      }
      ytext.applyDelta(ops);
    }, hash);
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

  const textWithoutSearch = (text: string): string => {
    //return text;
    // TODO
    const search = getSearchString();
    return text.startsWith(search) ? text.slice(search.length) : text;
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
            {listitems.map((t, i) => (
              <Listitem
                //key={n}
                key={i}
                offsetX={currentX}
                //ytext={ymap.get(n) ?? new Y.Text()} // TODO ensure never undefined
                //text={(ymap.get(n) ?? new Y.Text()).toString()} // TODO ensure never undefined
                //text={t} // TODO ensure never undefined
                text={textWithoutSearch(t)} // TODO ensure never undefined
                createListitemFn={createListitem(i)}
                deleteListitemFn={deleteListItem(i)}
                updateListitemFn={updateListitem(i)}
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
