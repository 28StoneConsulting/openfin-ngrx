export interface MessageWithReplay<T> {
  replay: (...arg: any) => void;
  data: T;
}

export interface Message {
  data: any;
  senderId: number;
  messageId: number;
}
