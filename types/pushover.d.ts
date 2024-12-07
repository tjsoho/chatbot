declare module 'pushover-notifications' {
  interface PushoverConfig {
    user: string;
    token: string;
  }

  interface PushoverMessage {
    message: string;
    title?: string;
    sound?: string;
    priority?: number;
    url?: string;
    url_title?: string;
    timestamp?: number;
    device?: string;
    html?: number;
    monospace?: number;
  }

  interface PushoverResponse {
    status: number;
    request: string;
    receipt?: string;
  }

  class Push {
    constructor(config: PushoverConfig);
    send(
      message: PushoverMessage,
      callback?: (error: Error | null, result: PushoverResponse) => void
    ): void;
  }

  export = Push;
} 