import * as Y from 'yjs'
import { WebrtcProvider } from 'y-webrtc'
import { IndexeddbPersistence } from 'y-indexeddb'
//import QuillCursors from 'quill-cursors'
//import { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useEffect, useMemo, useState } from 'react';
import { Listitem } from "./components/Listitem"
import { Navbar } from "./components/Navbar"
import { Search } from "./components/Search"
import './App.css';

//Quill.register('modules/cursors', QuillCursors)

function App() {
  const ydoc = useMemo(() => new Y.Doc(), []);
  const roomName = 'listitems';
  new IndexeddbPersistence(roomName, ydoc)
  const yarray: Y.Array<string> = ydoc.getArray(roomName);

  const [listitems, setListitems] = useState<string[]>([]);

  yarray.observe(() => {
      setListitems(yarray.toArray());
  });

  useEffect(() => {
    const provider = new WebrtcProvider('fuzzynote testtt', ydoc);
    return () => {
      if (provider) {
        provider.destroy();
        ydoc.destroy();
      }
    };
  }, [ydoc]);

  const createItem = (() => {
    const now = Date.now().toLocaleString();

    // generate random ListItems on button click
    //yarray.push([...Array(10).keys()].map(x => x + ' ' + now));

    yarray.push([''])
  });

  const generateNewListitem = ((k: string, t: string) => {
    const newText = ydoc.getText(k);
    // fill with stub data for demo purposes
    if (!newText.length) {
      newText.insert(0, t);
    }
    return newText;
  });

  return (
    <div className="App">
      <Navbar />
      <div id="canvas">
        <div id="board">
          <Search />
          <button onClick={() => createItem()}>Add item</button>
          <div id="listitems">
            {listitems.map((t, i) => <Listitem key={i}
                                               ytext={generateNewListitem(i.toString(), t)} />)}
          </div>
        </div>
      </div>
    </div>
  );
          //<div id="listitems">
            //{yarray.map((i) => <div className="listitem" key={i}>{i}</div>)}
          //</div>
          //</div>
}

export default App;
