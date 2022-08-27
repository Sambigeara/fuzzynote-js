import * as Y from "yjs";

export class PartialQuillBinding {
  type: Y.Text;
  quill: any;
  search: string;
  //doc: Y.Doc
  doc: any;

  _typeObserver: (event: any, transaction: any) => void;
  _quillObserver: (
    delta: any,
    oldContents: any,
    source: string,
    origin: any
  ) => void;

  constructor(type: Y.Text, quill: any, search: string) {
    this.type = type;
    this.quill = quill;
    this.search = search;
    this.doc = type.doc;

    this._typeObserver = (event: any, transaction: any) => {
      if (transaction.origin === this) return;
      quill.updateContents(event.delta, this);
    };
    this.type.observe(this._typeObserver);

    this._quillObserver = (delta: any, _oldContents: any, source: any) => {
      if (source === this) return;
      this.doc.transact(() => {
        let ops: any = [];
        const curString = this.type.toString();
        if (search.length > 0 && curString.startsWith(search)) {
          ops = [{ retain: search.length }, ...delta.ops];
        } else {
          ops = delta.ops;
        }
        this.doc.transact(() => {
          this.type.applyDelta(ops);
        });
      }, this);
    };
    this.quill.on("text-change", this._quillObserver);

    let text = this.type.toString();
    if (text.startsWith(search)) {
      text = text.slice(search.length);
    }
    this.quill.setText(text, this);
  }

  destroy() {
    this.type.unobserve(this._typeObserver);
    this.quill.off("text-change", this._quillObserver);
  }
}
