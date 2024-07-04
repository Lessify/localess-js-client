import {ProxyAgent} from 'proxy-agent';
import fetch, {FetchError, RequestInit} from 'node-fetch';
import {Content, ContentAsset, Links, Translations} from "./models";
import {FG_BLUE, proxyURIFromEnv, RESET} from "./utils";

export * from './models';

export type LocalessClientOptions = {
  /**
   * A fully qualified domain name with protocol (http/https) and port.
   *
   * Example: https://my-localess.web.app
   */
  origin: string;
  /**
   * Localess space ID, cna be found in the Localess Space settings
   */
  spaceId: string;
  /**
   * Localess API token, can be found in the Localess Space settings
   */
  token: string;
  /**
   * Content version to fetch, leave empty for 'published' or 'draft' for the latest draft
   */
  version?: 'draft' | string;
  /**
   * Enable debug mode
   */
  debug?: boolean;
}

export type ContentFetchParams = {
  /**
   * Content version to fetch, leave empty for 'published' or 'draft' for the latest draft.
   * Overrides the version set in the client options.
   */
  version?: 'draft' | string;
  /**
   * Locale identifier (ISO 639-1) to fetch content in, leave empty for default locale.
   *
   * Example: en
   */
  locale?: string;
}

const LOG_GROUP = `${FG_BLUE}[Localess:Client]${RESET}`

export function localessClient(options: LocalessClientOptions) {
  if (options.debug) {
    console.log(LOG_GROUP, 'Client Options :', options);
  }
  const fetchOptions: RequestInit = {
    redirect: 'follow',
  };
  if (proxyURIFromEnv()) {
    if (options.debug) {
      console.log(LOG_GROUP, 'Proxy Agent Enabled');
    }
    fetchOptions.agent = new ProxyAgent();
  }

  return {

    /**
     * Get all links
     * @returns {Promise<Links>}
     */
    async getLinks(): Promise<Links> {
      if (options.debug) {
        console.log(LOG_GROUP, 'getLinks()');
      }
      let url = `${options.origin}/api/v1/spaces/${options.spaceId}/links?token=${options.token}`;
      if (options.debug) {
        console.log(LOG_GROUP, 'getLinks fetch url :', url);
      }
      try {
        const response = await fetch(url, fetchOptions)
        if (options.debug) {
          console.log(LOG_GROUP, 'getLinks status :', response.status);
        }
        const data = await response.json();
        return data as Links;
      } catch (error){
        console.error(LOG_GROUP, 'getLinks error :', error);
        return {} as Links;
      }
    },

    /**
     * Get content by SLUG
     * @param slug{string} - Content SLUG
     * @param params{ContentFetchParams} - Fetch parameters
     * @returns {Promise<Content>}
     */
    async getContentBySlug(slug: string, params?: ContentFetchParams): Promise<Content> {
      if (options.debug) {
        console.log(LOG_GROUP, 'getContentBySlug() slug :', slug);
      }
      let version = '';
      if (options.version && options.version == 'draft') {
        version = `&version=${options.version}`;
      }
      if (params?.version && params.version == 'draft') {
        version = `&version=${params.version}`;
      }
      const locale = params?.locale ? `&locale=${params.locale}` : '';
      let url = `${options.origin}/api/v1/spaces/${options.spaceId}/contents/slugs/${slug}?token=${options.token}${version}${locale}`;
      if (options.debug) {
        console.log(LOG_GROUP, 'getContentBySlug fetch url :', url);
      }
      try {
        const response = await fetch(url, fetchOptions)
        if (options.debug) {
          console.log(LOG_GROUP, 'getContentBySlug status :', response.status);
        }
        const data = await response.json();
        return data as Content;
      } catch (error){
        console.error(LOG_GROUP, 'getContentBySlug error type :', typeof error);
        console.error(LOG_GROUP, 'getContentBySlug error :', error);
        return {} as Content;
      }
    },

    /**
     * Get content by ID
     * @param id{string} - Content ID
     * @param params{ContentFetchParams} - Fetch parameters
     * @returns {Promise<Content>}
     */
    async getContentById(id: string, params?: ContentFetchParams): Promise<Content> {
      if (options.debug) {
        console.log(LOG_GROUP, 'getContentById() id :', id);
      }
      let version = '';
      if (options.version && options.version == 'draft') {
        version = `&version=${options.version}`;
      }
      if (params?.version && params.version == 'draft') {
        version = `&version=${params.version}`;
      }
      const locale = params?.locale ? `&locale=${params.locale}` : '';
      let url = `${options.origin}/api/v1/spaces/${options.spaceId}/contents/${id}?token=${options.token}${version}${locale}`;
      if (options.debug) {
        console.log(LOG_GROUP, 'getContentById fetch url :', url);
      }
      const response = await fetch(url, fetchOptions)
      if (options.debug) {
        console.log(LOG_GROUP, 'getContentById status :', response.status);
      }
      const data = await response.json();
      return data as Content;
    },

    /**
     * Get translations for the given locale
     * @param locale{string} - Locale identifier (ISO 639-1)
     */
    async getTranslations(locale: string): Promise<Translations> {
      if (options.debug) {
        console.log(LOG_GROUP, 'getTranslations()');
      }
      let url = `${options.origin}/api/v1/spaces/${options.spaceId}/translations/${locale}`;
      if (options.debug) {
        console.log(LOG_GROUP, 'getTranslations fetch url :', url);
      }
      const response = await fetch(url, fetchOptions)
      if (options.debug) {
        console.log(LOG_GROUP, 'getTranslations status :', response.status);
      }
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
