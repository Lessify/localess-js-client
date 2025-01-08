import {ContentData} from "./models";

export * from './models';
export * from './client';
export * from './editable';
export * from './sync';

export type EventType = 'input' | 'save' | 'publish' | 'change';
export type EventCallback = (event: EventToApp) => void;
export type EventToApp = { type: 'save' | 'publish' } | { type: 'input' | 'change'; data: ContentData };
export interface LocalessSync {
  on: (
    event: EventType | EventType[],
    callback: EventCallback
  ) => void;
}

declare global {
  interface Window {
    localess?: LocalessSync;
  }
}
