type Listener = (event: any) => void

class SSE {
  INITIALIZING = -1
  CONNECTING = 0
  OPEN = 1
  CLOSED = 2
  url = ''
  headers: any = {}
  payload = ''
  method = 'GET'
  withCredentials = false
  FIELD_SEPARATOR = ':'
  listeners: any = {}
  xhr: XMLHttpRequest | null = null
  readyState = this.INITIALIZING
  progress = 0
  chunk = ''
  constructor(url: string, options: any) {
    this.url = url
    options = options || {}
    this.headers = options.headers || {}
    this.payload = options.payload !== undefined ? options.payload : ''
    this.method = options.method || (this.payload && 'POST') || 'GET'
    this.withCredentials = !!options.withCredentials
  }

  addEventListener(type: string, listener: Listener) {
    if (this.listeners[type] === undefined) {
      this.listeners[type] = []
    }
    if (this.listeners[type].indexOf(listener) === -1) {
      this.listeners[type].push(listener)
    }
  }

  removeEventListener(type: string, listener: Listener) {
    if (this.listeners[type] === undefined) {
      return
    }
    const filtered: Listener[] = []
    this.listeners[type].forEach(function (element: Listener) {
      if (element !== listener) {
        filtered.push(element)
      }
    })
    if (filtered.length === 0) {
      delete this.listeners[type]
    } else {
      this.listeners[type] = filtered
    }
  }
  dispatchEvent(e: any) {
    if (!e) {
      return true
    }
    e.source = this
    const onHandler = 'on' + e.type
    // eslint-disable-next-line no-prototype-builtins
    if (this.hasOwnProperty(onHandler)) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const _this: any = this
      _this[onHandler].call(this, e)
      if (e.defaultPrevented) {
        return false
      }
    }
    if (this.listeners[e.type]) {
      return this.listeners[e.type].every(function (callback: Listener) {
        callback(e)
        return !e.defaultPrevented
      })
    }
    return true
  }
  _setReadyState(state: number) {
    const event: any = new CustomEvent('readystatechange')
    event.readyState = state
    this.readyState = state
    this.dispatchEvent(event)
  }
  _onStreamFailure(e: any) {
    const event: any = new CustomEvent('error')
    event.data = e.currentTarget.response
    this.dispatchEvent(event)
    this.close()
  }
  _onStreamAbort(e: any) {
    this.dispatchEvent(new CustomEvent('abort'))
    this.close()
  }
  _onStreamProgress(e: any) {
    console.log('process:', Date.now())
    if (!this.xhr) {
      return
    }
    if (this.xhr.status !== 200) {
      this._onStreamFailure(e)
      return
    }
    if (this.readyState == this.CONNECTING) {
      this.dispatchEvent(new CustomEvent('open'))
      this._setReadyState(this.OPEN)
    }
    const data = this.xhr.responseText.substring(this.progress)
    this.progress += data.length
    data.split(/(\r\n|\r|\n){2}/g).forEach((part: string) => {
      if (part.trim().length === 0) {
        this.dispatchEvent(this._parseEventChunk(this.chunk.trim()))
        this.chunk = ''
      } else {
        this.chunk += part
      }
    })
  }
  _onStreamLoaded(e: any) {
    this._onStreamProgress(e)
    this.dispatchEvent(this._parseEventChunk(this.chunk))
    this.chunk = ''
  }
  _parseEventChunk(chunk: string) {
    if (!chunk || chunk.length === 0) {
      return null
    }
    const e: any = { id: null, retry: null, data: '', event: 'message' }
    chunk.split(/\n|\r\n|\r/).forEach((line: string) => {
      line = line.trimEnd()
      const index = line.indexOf(this.FIELD_SEPARATOR)
      if (index <= 0) {
        return
      }
      const field = line.substring(0, index)
      if (!(field in e)) {
        return
      }
      const value = line.substring(index + 1).trimStart()
      if (field === 'data') {
        e[field] += value
      } else {
        e[field] = value
      }
    })
    const event: any = new CustomEvent(e.event)
    event.data = e.data
    event.id = e.id
    return event
  }
  _checkStreamClosed() {
    if (!this.xhr) {
      return
    }
    if (this.xhr.readyState === XMLHttpRequest.DONE) {
      this._setReadyState(this.CLOSED)
    }
  }
  stream() {
    this._setReadyState(this.CONNECTING)
    this.xhr = new XMLHttpRequest()
    this.xhr.addEventListener('progress', this._onStreamProgress.bind(this))
    this.xhr.addEventListener('load', this._onStreamLoaded.bind(this))
    this.xhr.addEventListener('readystatechange', this._checkStreamClosed.bind(this))
    this.xhr.addEventListener('error', this._onStreamFailure.bind(this))
    this.xhr.addEventListener('abort', this._onStreamAbort.bind(this))
    this.xhr.open(this.method, this.url)
    for (const header in this.headers) {
      this.xhr.setRequestHeader(header, this.headers[header])
    }
    this.xhr.withCredentials = this.withCredentials
    this.xhr.send(this.payload)
  }

  close() {
    if (this.readyState === this.CLOSED) {
      return
    }
    this.xhr?.abort()
    this.xhr = null
    this._setReadyState(this.CLOSED)
  }
}

export default SSE
