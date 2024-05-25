import {ProxyAgent} from 'proxy-agent';
import fetch, {RequestInit} from 'node-fetch';
import {proxyURIFromEnv} from "./utils";
import {Content, ContentAsset, Links, Translations} from "./models";

export * from './models';

export type LocalessClientOptions = {
  domain: string;
  version?: 'draft';
  location?: string;
  spaceId: string;
  token: string;
  secure?: boolean;
}

export function localessClient(options: LocalessClientOptions) {
  const fetchOptions: RequestInit = {
    redirect: 'follow',
  };
  if (proxyURIFromEnv()) {
    fetchOptions.agent = new ProxyAgent();
  }
  const host = `${options.secure ? 'https' : 'http'}://${options.domain}`;
  const version = options.version ? `&version=${options.version}` : '';
  const locale = options.location ? `&location=${options.location}` : '';
  return {

    async getLinks(): Promise<Links> {
      const response = await fetch(`${host}/api/v1/spaces/${options.spaceId}/links?token=${options.token}`, fetchOptions)
      const data = await response.json();
      return data as Links;
    },

    async getContentBySlug(slug: string): Promise<Content> {
      const response = await fetch(`${host}/api/v1/spaces/${options.spaceId}/contents/slugs/${slug}?token=${options.token}${version}${locale}`, fetchOptions)
      const data = await response.json();
      return data as Content;
    },

    async getContentById(id: string): Promise<Content> {
      const response = await fetch(`${host}/api/v1/spaces/${options.spaceId}/contents/${id}?token=${options.token}${version}${locale}`, fetchOptions)
      const data = await response.json();
      return data as Content;
    },

    async getTranslations(): Promise<Translations> {
      const response = await fetch(`${host}/api/v1/spaces/${options.spaceId}/translations/${locale || 'en'}`, fetchOptions)
      const data = await response.json();
      return data as Translations;
    },

    syncScriptUrl(): string {
      return `${host}/scripts/sync-v1.js`
    },

    assetLink(asset: ContentAsset | string): string {
      if (typeof asset === 'string') {
        return `${host}/api/v1/spaces/${options.spaceId}/assets/${asset}`;
      } else {
        return `${host}/api/v1/spaces/${options.spaceId}/assets/${asset.uri}`;
      }
    }
  }
}

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
