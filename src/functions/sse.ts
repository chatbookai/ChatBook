export class SSE {
    private INITIALIZING = -1;
    private CONNECTING = 0;
    private OPEN = 1;
    private CLOSED = 2;
  
    private url: string = '';
    private headers: Record<string, string> = {};
    private payload: string = '';
    private method: string = 'POST';
    private withCredentials: boolean = false;
  
    private FIELD_SEPARATOR = ':';
    private listeners: Record<string, Array<Function>> = {};
  
    private xhr: XMLHttpRequest | null = null;
    private readyState: number = this.INITIALIZING;
    private progress: number = 0;
    private chunk: string = '';
  
    constructor(url: string, options?: {
      headers?: Record<string, string>;
      payload?: string;
      method?: string;
      withCredentials?: boolean;
    }) {
      if (!(this instanceof SSE)) {
        return new SSE(url, options);
      }
  
      this.url = url;
  
      options = options || {};
      this.headers = options.headers || {};
      this.payload = options.payload !== undefined ? options.payload : '';
      this.method = options.method || (this.payload && 'POST') || 'GET';
      this.withCredentials = !!options.withCredentials;
    }
  
    addEventListener(type: string, listener: Function): void {
      if (this.listeners[type] === undefined) {
        this.listeners[type] = [];
      }
  
      if (this.listeners[type].indexOf(listener) === -1) {
        this.listeners[type].push(listener);
      }
    }
  
    removeEventListener(type: string, listener: Function): void {
      if (this.listeners[type] === undefined) {
        return;
      }
  
      const filtered = this.listeners[type].filter(element => element !== listener);
      if (filtered.length === 0) {
        delete this.listeners[type];
      } else {
        this.listeners[type] = filtered;
      }
    }
  
    dispatchEvent(e: CustomEvent): boolean {
      if (!e) {
        return true;
      }
  
      e.source = this;
  
      const onHandler = 'on' + e.type;
      if (this.hasOwnProperty(onHandler)) {
        (this as any)[onHandler].call(this, e);
        if (e.defaultPrevented) {
          return false;
        }
      }
  
      if (this.listeners[e.type]) {
        return this.listeners[e.type].every(callback => {
          callback(e);
          return !e.defaultPrevented;
        });
      }
  
      return true;
    }
  
    private _setReadyState(state: number): void {
      const event: any = new CustomEvent('readystatechange');
      event.readyState = state;
      this.readyState = state;
      this.dispatchEvent(event);
    }
  
    private _onStreamFailure(e: ProgressEvent): void {
      const event: any = new CustomEvent('error');
      event.data = (e.currentTarget as XMLHttpRequest).response;
      this.dispatchEvent(event);
      this.close();
    }
  
    private _onStreamAbort(e: ProgressEvent): void {
      this.dispatchEvent(new CustomEvent('abort'));
      this.close();
    }
  
    private _onStreamProgress(e: ProgressEvent): void {
      if (!this.xhr) {
        return;
      }
  
      if (this.xhr.status !== 200) {
        this._onStreamFailure(e);
        return;
      }
  
      if (this.readyState == this.CONNECTING) {
        this.dispatchEvent(new CustomEvent('open'));
        this._setReadyState(this.OPEN);
      }
  
      const data = this.xhr.responseText.substring(this.progress);
      this.progress += data.length;
      data.split(/(\r\n|\r|\n){2}/g).forEach(part => {
        if (part.trim().length === 0) {
          this.dispatchEvent(this._parseEventChunk(this.chunk.trim()));
          this.chunk = '';
        } else {
          this.chunk += part;
        }
      });
    }
  
    private _onStreamLoaded(e: ProgressEvent): void {
      this._onStreamProgress(e);
  
      // Parse the last chunk.
      this.dispatchEvent(this._parseEventChunk(this.chunk));
      this.chunk = '';
    }
  
    private _parseEventChunk(chunk: string): CustomEvent | null {
      if (!chunk || chunk.length === 0) {
        return null;
      }
  
      const e: { id: string | null, retry: string | null, data: string, event: string } = { id: null, retry: null, data: '', event: 'message' };
      chunk.split(/\n|\r\n|\r/).forEach(line => {
        line = line.trimRight();
        const index = line.indexOf(this.FIELD_SEPARATOR);
        if (index <= 0) {
          return;
        }
  
        const field = line.substring(0, index);
        if (!(field in e)) {
          return;
        }
  
        const value = line.substring(index + 1).trimLeft();
        if (field === 'data') {
          e[field] += value;
        } else {
          e[field] = value;
        }
      });
  
      const event: any = new CustomEvent(e.event);
      event.data = e.data;
      event.id = e.id;
      return event;
    }
  
    private _checkStreamClosed(): void {
      if (!this.xhr) {
        return;
      }
  
      if (this.xhr.readyState === XMLHttpRequest.DONE) {
        this._setReadyState(this.CLOSED);
        const event: any = new CustomEvent('end');
        event.data = this.xhr.responseText;
        this.dispatchEvent(event);
      }
    }
  
    stream(): void {
      this._setReadyState(this.CONNECTING);
  
      this.xhr = new XMLHttpRequest();
      this.xhr.addEventListener('progress', this._onStreamProgress.bind(this));
      this.xhr.addEventListener('load', this._onStreamLoaded.bind(this));
      this.xhr.addEventListener('readystatechange', this._checkStreamClosed.bind(this));
      this.xhr.addEventListener('error', this._onStreamFailure.bind(this));
      this.xhr.addEventListener('abort', this._onStreamAbort.bind(this));
      this.xhr.open(this.method, this.url);
      for (const header in this.headers) {
        this.xhr.setRequestHeader(header, this.headers[header]);
      }
      this.xhr.withCredentials = this.withCredentials;
      this.xhr.send(this.payload);
    }
  
    close(): void {
      if (this.readyState === this.CLOSED) {
        return;
      }
  
      this.xhr?.abort();
      this.xhr = null;
      this._setReadyState(this.CLOSED);
    }
  }
  
  /*
  const url = 'https://xxx/chat';
  const source = new SSE(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    },
    payload: JSON.stringify({ prompt: 'xxx' }),
  });
  source.addEventListener('message', (data: CustomEvent) => {
    console.log('chunk => ' + data.data);
  });
  source.addEventListener('end', () => {
    console.log('结束');
  });
  source.addEventListener('error', (err: CustomEvent) => {
    console.error('异常', err);
  });
  source.stream();
  */