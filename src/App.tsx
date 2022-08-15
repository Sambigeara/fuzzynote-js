import * as Y from 'yjs'
import { WebrtcProvider } from 'y-webrtc'
//import QuillCursors from 'quill-cursors'
//import { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useEffect, useState } from 'react';
import { Listitem } from "./components/Listitem"
import { Navbar } from "./components/Navbar"
import { Search } from "./components/Search"
import './App.css';

//Quill.register('modules/cursors', QuillCursors)

const ydoc = new Y.Doc();

function App() {
  const [listitems, setListitems] = useState<string[]>([]);

  useEffect(() => {
    const provider = new WebrtcProvider('fuzzynote testtt', ydoc);
    const yarray: Y.Array<string> = ydoc.getArray('listitems');
    yarray.observeDeep(() => {
        setListitems(yarray.toArray());
    });
    return () => {
      if (provider) {
        provider.destroy();
        //ydoc.destroy();
      }
    };
  }, []);

  const createItem = (() => {
    const now = Date.now().toLocaleString();
    // generate random ListItems on button click
    setListitems([...listitems, ...[...Array(5).keys()].map(x => x + ' ' + now)]);
  });

  const generateNewListitem = ((k: string, t: string) => {
    const newText = ydoc.getText(k);
    newText.insert(0, t);
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
