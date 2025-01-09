export * from './models';
export * from './client';
export * from './editable';
export * from './sync';

export type EventToAppType = 'save' | 'publish' | 'input' | 'change' | 'enterSchema' | 'hoverSchema';
export type EventCallback = (event: EventToApp) => void;
export type EventToApp =
  { type: 'save' | 'publish' } |
  { type: 'input' | 'change'; data: any } |
  { type: 'enterSchema' | 'hoverSchema', id: string };
export interface LocalessSync {
  on: (
    event: EventToAppType | EventToAppType[],
    callback: EventCallback
  ) => void;
}

declare global {
  interface Window {
    localess?: LocalessSync;
  }
}
