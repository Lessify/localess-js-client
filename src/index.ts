import {ProxyAgent} from 'proxy-agent';
import fetch, {RequestInit} from 'node-fetch';
import {Content, ContentAsset, Links, Translations} from "./models";

export * from './models';

export type LocalessClientOptions = {
  /**
   * A fully qualified domain name with protocol (http/https) and port.
   *
   * Example: https://localess-prod.web.app
   */
  origin: string;
  /**
   * Content version to fetch, leave empty for 'published' or 'draft' for the latest draft
   */
  version?: 'draft' | string;
  /**
   * Locale to fetch content in, leave empty for default locale
   *
   * Example: en
   */
  locale?: string;
  /**
   * Localess space ID, cna be found in the Localess Space settings
   */
  spaceId: string;
  /**
   * Localess API token, can be found in the Localess Space settings
   */
  token: string;
  /**
   * Enable debug mode
   */
  debug?: boolean;
}

export function localessClient(options: LocalessClientOptions) {
  if(options.debug) {
    console.log('Localess Client Options : ', options);
  }
  const fetchOptions: RequestInit = {
    redirect: 'follow',
  };
  if (proxyURIFromEnv()) {
    fetchOptions.agent = new ProxyAgent();
  }
  const version = options.version ? `&version=${options.version}` : '';
  const locale = options.locale ? `&locale=${options.locale}` : '';
  return {

    async getLinks(): Promise<Links> {
      if (options.debug) {
        console.log('getLinks()');
      }
      let url = `${options.origin}/api/v1/spaces/${options.spaceId}/links?token=${options.token}`;
      if (options.debug) {
        console.log('getLinks url : ', url);
      }
      const response = await fetch(url, fetchOptions)
      const data = await response.json();
      return data as Links;
    },

    async getContentBySlug(slug: string): Promise<Content> {
      if (options.debug) {
        console.log('getContentBySlug() slug : ', slug);
      }
      let url = `${options.origin}/api/v1/spaces/${options.spaceId}/contents/slugs/${slug}?token=${options.token}${version}${locale}`;
      if (options.debug) {
        console.log('getContentBySlug url : ', url);
      }
      const response = await fetch(url, fetchOptions)
      const data = await response.json();
      return data as Content;
    },

    async getContentById(id: string): Promise<Content> {
      if (options.debug) {
        console.log('getContentById() id : ', id);
      }
      let url = `${options.origin}/api/v1/spaces/${options.spaceId}/contents/${id}?token=${options.token}${version}${locale}`;
      if (options.debug) {
        console.log('getContentById url : ', url);
      }
      const response = await fetch(url, fetchOptions)
      const data = await response.json();
      return data as Content;
    },

    async getTranslations(): Promise<Translations> {
      if (options.debug) {
        console.log('getTranslations()');
      }
      let url = `${options.origin}/api/v1/spaces/${options.spaceId}/translations/${locale || 'en'}`;
      if (options.debug) {
        console.log('getTranslations url : ', url);
      }
      const response = await fetch(url, fetchOptions)
      const data = await response.json();
      return data as Translations;
    },

    syncScriptUrl(): string {
      return `${options.origin}/scripts/sync-v1.js`
    },

    assetLink(asset: ContentAsset | string): string {
      if (typeof asset === 'string') {
        return `${options.origin}/api/v1/spaces/${options.spaceId}/assets/${asset}`;
      } else {
        return `${options.origin}/api/v1/spaces/${options.spaceId}/assets/${asset.uri}`;
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

function proxyURIFromEnv(): string | undefined {
  return (
    process.env.HTTPS_PROXY ||
    process.env.https_proxy ||
    process.env.HTTP_PROXY ||
    process.env.http_proxy ||
    undefined
  );
}
