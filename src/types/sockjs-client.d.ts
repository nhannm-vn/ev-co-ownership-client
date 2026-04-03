declare module 'sockjs-client' {
  interface SockJSOptions {
    server?: string
    transports?: string[]
    sessionId?: number | (() => number)
    timeout?: number
    devel?: boolean
    debug?: boolean
    protocols_whitelist?: string[]
    rtt?: number
  }

  class SockJS {
    constructor(url: string, protocols?: string[], options?: SockJSOptions)
    protocol: string
    readyState: number
    url: string
    onopen: ((e: any) => void) | null
    onmessage: ((e: any) => void) | null
    onclose: ((e: any) => void) | null
    onerror: ((e: any) => void) | null
    send(data: string): void
    close(code?: number, reason?: string): void
  }

  export = SockJS
}











