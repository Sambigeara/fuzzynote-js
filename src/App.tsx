import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
//import { IndexeddbPersistence } from "y-indexeddb";
//import QuillCursors from 'quill-cursors'
//import { Quill } from 'react-quill';
//import MagicUrl from 'quill-magic-url'
import "react-quill/dist/quill.snow.css";
import { useEffect, useMemo, useState } from "react";
import { Listitem } from "./components/Listitem";
import { Navbar } from "./components/Navbar";
import { Search } from "./components/Search";
//import useKeyPress from "./lib/utils";
import "./App.css";

//Quill.register('modules/cursors', QuillCursors)
//Quill.register('modules/magicUrl', MagicUrl)

function App() {
  //const isCtrl: boolean = useKeyPress('Control');
  const ydoc = useMemo(() => new Y.Doc(), []);
  //new IndexeddbPersistence('listitemIds', ydoc)
  //const yarray: Y.Array<string> = useMemo(() => ydoc.getArray("listitemIds"), [ydoc]);
  //const ymap: Y.Map<Y.Text> = useMemo(() => ydoc.getMap("listitemYtexts"), [ydoc]);
  const yarray: Y.Array<Y.Text> = useMemo(() => ydoc.getArray("listitemIds"), [ydoc]);

  useEffect(() => {
    const provider = new WebrtcProvider("fuzzynote testtt", ydoc);
    return () => {
      provider.destroy();
      ydoc.destroy();
    };
  }, [ydoc]);

  const [currentX, setCurrentX] = useState(0);
  const [currentY, setCurrentY] = useState(-1);
  const [searchGroups, setSearchGroups] = useState([""]);

  //const [keyArray, setKeyArray] = useState<string[]>([]);
  //const [textMap, setTextMap] = useState(new Map<string, string>());
  const [textArray, setTextArray] = useState<string[]>([]);

  //yarray.observe((e: any, transaction: any) => {
    ////console.log({e});
    ////console.log({transaction});
    //console.log(transaction.local);
    ////console.log(e.path);
    ////console.log({transaction});
    //////console.log({yarray});
    //////console.log(transaction.origin);
    //////setKeyArray(yarray.toArray());
  //});

  useEffect(() => {
    yarray.observeDeep(() => {
      //setKeyArray(yarray.toArray());
      setTextArray(yarray.toArray().map(t => t.toString()));
    });
    //ymap.observeDeep((events: any, transaction: any) => {
      ////debugger;
      //console.log({events});
      ////console.log({transaction});
      ////if (transaction.local) return;
      ////console.log(ymap.toJSON());
      //const n = new Map<string, string>();
      //for (const k of yarray.toArray()) {
        //n.set(k, (ymap.get(k) as any).toString())
      //}
      ////console.log({n});
      //setTextMap(n);
    //});
  //}, [yarray, ymap]);
  }, [yarray]);

  //const [opCnt, setOpCnt] = useState(0);
  //useEffect(() => {
    //ymap.observeDeep(() => {
      ////const n = new Map<string, string>();
      ////for (const k of yarray.toArray()) {
        ////n.set(k, (ymap.get(k) as any).toString())
      ////}
      //////console.log({n});
      ////setTextMap(n);
      //setOpCnt(opCnt+1);
    //});
  //}, [ymap, opCnt]);

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
    const key = Date.now().toLocaleString(); // TODO a better unique name generator
    //yarray.insert(idx + 1, [key]);
    //ymap.set(key, new Y.Text(getSearchString()));
    //const t = ydoc.getText(key);
    //t.insert(0, getSearchString());
    yarray.insert(idx + 1, [new Y.Text(getSearchString())]);

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

  //const updateText = (key: string) => (text: string) => {
  //const updateText = (key: string) => (text: any, delta: any, source: any, editor: any) => {
  const updateText = (idx: number) => (text: any, delta: any, source: any, editor: any) => {
    //debugger;
    //console.log({text});
    //console.log(delta.ops);
    //console.log(editor.getText());
    //setTextMap(new Map(textMap.set(key, text)));
    //ymap.set(key, new Y.Text(editor.getText()));
    //if (source === "user") return;
    ydoc.transact(() => {
      //const t = ymap.get(key) as Y.Text;
      const t = yarray.get(idx);
      t.applyDelta(delta.ops);
      //setTextMap(new Map(textMap.set(key, editor.getText())));
      //ymap.set(key, new Y.Text(editor.getText()));
    });
    //ydoc.getText(key).applyDelta(delta.ops);
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

  //const textWithoutSearch = (text: string): string => {
    //return text;
    //// TODO
    ////const search = getSearchString();
    ////return text.startsWith(search) ? text.slice(search.length) : text;
  //};
  
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
            {textArray.map((n, i) => (
              <Listitem
                key={n}
                offsetX={currentX}
                //text={(ydoc.get(n) as any).toString()}
                text={n.toString()}
                createListitemFn={createListitem(i)}
                deleteListitemFn={deleteListItem(i)}
                //updateTextFn={updateText(n)}
                updateTextFn={updateText(i)}
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
          //<div id="listitems">
            //{yarray.map((n, i) => (
              //<Listitem
                //key={n}
                //offsetX={currentX}
                //text={(ymap.get(n) as any).toString()}
                //createListitemFn={createListitem(i)}
                //deleteListitemFn={deleteListItem(i)}
                //updateTextFn={updateText(n)}
                //arrowUpFn={navigate(i, "up")}
                //arrowDownFn={navigate(i, "down")}
                //isActive={currentY === i}
              ///>
            //))}
          //</div>
          //<div id="listitems">
            //{[...ymap.keys()].map((n, i) => (
              //<Listitem
                //key={n}
                //offsetX={currentX}
                //text={(ymap.get(n) as any).toString()}
                //createListitemFn={createListitem(i)}
                //deleteListitemFn={deleteListItem(i)}
                //updateTextFn={updateText(n)}
                //arrowUpFn={navigate(i, "up")}
                //arrowDownFn={navigate(i, "down")}
                //isActive={currentY === i}
              ///>
            //))}
          //</div>
}

export default App;
