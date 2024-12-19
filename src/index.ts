export * from './models';
export * from './client';
export * from './editable';
export * from './sync';

declare global {
  type EventType = 'input' | 'save' | 'publish' | 'change';
  type EventCallback = (event: EventToApp) => void;
  type EventToApp = { type: 'save' | 'publish' } | { type: 'input' | 'change'; data: any };

  interface LocalessSync {
    on: (
      event: EventType | EventType[],
      callback: EventCallback
    ) => void;
  }

  interface Window {
    localess?: LocalessSync;
  }
}
