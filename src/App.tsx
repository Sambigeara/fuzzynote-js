import * as Y from 'yjs'
import { WebrtcProvider } from 'y-webrtc'
import { QuillBinding } from 'y-quill'
//import QuillCursors from 'quill-cursors'
//import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import React, { useEffect, useState } from 'react';
import { Listitems } from "./components/Listitems"
import { Navbar } from "./components/Navbar"
import { Search } from "./components/Search"
import './App.css';

//Quill.register('modules/cursors', QuillCursors)

function App() {
  // A Yjs document holds the shared data
  //const ydoc = new Y.Doc();
  //const yarray: Y.Array<Y.Text> = ydoc.getArray('main')
  //const [baseList, setBaseList] = useState(yarray);
  //useEffect(() => {
    //yarray.observeDeep(() => {
      //setBaseList(yarray);
    //});
    ////return () => (yarray.unobserveDeep(()=>{;};));
  //});

  const fakeListitems = ["just some random note", "the quick brown fox was how a famous sentence started that I can't remember"];
  //baseList.push([new Y.Text("just some random note")])
  //baseList.push([new Y.Text("the quick brown fox was how a famous sentence started that I can't remember")])
  //yarray.push([new Y.Text("just some random note")])
  //yarray.push([new Y.Text("the quick brown fox was how a famous sentence started that I can't remember")])

  return (
    <div className="App">
      <Navbar />
      <div id="canvas">
        <div id="board">
          <Search />
          <Listitems items={fakeListitems}/>
        </div>
      </div>
    </div>
  );
          //<Listitems items={yarray}/>}
}

export default App;
