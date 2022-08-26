import * as Y from "yjs";

export class PartialQuillBinding {
  type: Y.Text;
  quill: any;
  search: string;
  //doc: Y.Doc
  doc: any;

  _typeObserver: (event: any, transaction: any) => void;
  _quillObserver: (delta: any, oldContents: any, source: string, origin: any) => void;

  constructor(type: Y.Text, quill: any, search: string) {
    this.type = type;
    this.quill = quill;
    this.search = search;
    this.doc = type.doc;

    this._typeObserver = (_event: any, transaction: any) => {
      if (transaction.origin === this)
        return;
      this.quill.setText(this.textWithoutSearch(this.type.toString()));
      // TODO add prefix
      //quill.updateContents(event.delta, this);
    };
    this.type.observe(this._typeObserver);

    this._quillObserver = (delta: any, _oldContents: any, source: string, _origin: any) => {
      if (source !== "user")
        return;
      //if (origin === this) return;
      this.doc.transact(() => {
        let ops = [];
        if (this.type.toString().startsWith(search)) {
          ops = [{ retain: search.length }, ...delta.ops];
        } else {
          ops = delta.ops;
        }
        this.type.applyDelta(ops);
      }, this);
    };
    this.quill.on('text-change', this._quillObserver);
    this.quill.setText(this.type.toString(), this);
  }

  textWithoutSearch = (text: string): string => {
    return text.startsWith(this.search) ? text.slice(this.search.length) : text;
  };

  destroy() {
    this.type.unobserve(this._typeObserver);
    this.quill.off('text-change', this._quillObserver);
  }
}
