import {FG_BLUE, RESET} from "./utils";
import {Content, ContentAsset, ContentData, Links, Translations} from "./models";

export type LocalessClientOptions = {
  /**
   * A fully qualified domain name with protocol (http/https) and port.
   *
   * Example: https://my-localess.web.app
   */
  origin: string;
  /**
   * Localess space ID can be found in the Localess Space settings
   */
  spaceId: string;
  /**
   * Localess API token can be found in the Localess Space settings
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

export type LinksFetchParams = {
  /**
   * Content Kind. FOLDER or DOCUMENT. If not provided, it will return all.
   * @example 'DOCUMENT'
   */
  kind?: 'DOCUMENT' | 'FOLDER';
  /**
   * Content parent slug.
   * @example 'legal/policy'
   */
  parentSlug?: string;
  /**
   * If **true**, exclude all sub slugs, otherwise include all content under current selected **parent slug**.
   * @example false
   */
  excludeChildren?: boolean;
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

export interface LocalessClient {
  /**
   * Get all links
   * @param params{LinksFetchParams} - Fetch parameters
   * @returns {Promise<Links>}
   */
  getLinks(params?: LinksFetchParams): Promise<Links>;

  /**
   * Get content by SLUG
   * @param slug{string} - Content SLUG
   * @param params{ContentFetchParams} - Fetch parameters
   * @returns {Promise<Content>}
   */
  getContentBySlug<T extends ContentData = ContentData>(slug: string, params?: ContentFetchParams): Promise<Content<T>>;

  /**
   * Get content by ID
   * @param id{string} - Content ID
   * @param params{ContentFetchParams} - Fetch parameters
   * @returns {Promise<Content>}
   */
  getContentById<T extends ContentData = ContentData>(id: string, params?: ContentFetchParams): Promise<Content<T>>;

  /**
   * Get translations for the given locale
   * @param locale{string} - Locale identifier (ISO 639-1)
   */
  getTranslations(locale: string): Promise<Translations>;

  syncScriptUrl(): string

  assetLink(asset: ContentAsset | string): string
}

const LOG_GROUP = `${FG_BLUE}[Localess:Client]${RESET}`

/**
 * Create a Localess API Client
 * @param {LocalessClientOptions} options connection details
 */
export function localessClient(options: LocalessClientOptions): LocalessClient {
  if (options.debug) {
    console.log(LOG_GROUP, 'Client Options : ', options);
  }
  const fetchOptions: RequestInit = {
    redirect: 'follow',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Localess-Agent': 'Localess-JS-Client',
      'X-Localess-Agent-Version': '0.6.0'
    }
  };

  // Cache for storing API responses
  const cache = new Map<string, any>();

  return {

    async getLinks(params?: LinksFetchParams): Promise<Links> {
      if (options.debug) {
        console.log(LOG_GROUP, 'getLinks() params : ' + params);
      }
      let kind = '';
      if (params?.kind) {
        kind = `&kind=${params.kind}`;
      }
      let parentSlug = '';
      if (params?.parentSlug) {
        parentSlug = `&parentSlug=${params.parentSlug}`;
      }
      let excludeChildren = '';
      if (params?.excludeChildren) {
        excludeChildren = `&excludeChildren=${params.excludeChildren}`;
      }
      let url = `${options.origin}/api/v1/spaces/${options.spaceId}/links?token=${options.token}${kind}${parentSlug}${excludeChildren}`;
      if (options.debug) {
        console.log(LOG_GROUP, 'getLinks fetch url : ', url);
      }

      // Check if response is in cache
      if (cache.has(url)) {
        if (options.debug) {
          console.log(LOG_GROUP, 'getLinks cache hit');
        }
        return cache.get(url) as Links;
      }

      try {
        const response = await fetch(url, fetchOptions)
        if (options.debug) {
          console.log(LOG_GROUP, 'getLinks status : ', response.status);
        }
        const data = await response.json();

        // Store response in cache
        cache.set(url, data);

        return data as Links;
      } catch (error) {
        console.error(LOG_GROUP, 'getLinks error : ', error);
        return {} as Links;
      }
    },

    async getContentBySlug<T extends ContentData = ContentData>(slug: string, params?: ContentFetchParams): Promise<Content<T>> {
      if (options.debug) {
        console.log(LOG_GROUP, 'getContentBySlug() slug : ', slug);
        console.log(LOG_GROUP, 'getContentBySlug() params : ', params);
      }
      let version = '';
      // Options
      if (options?.version && options.version == 'draft') {
        version = `&version=${options.version}`;
      }
      // Params
      if (params?.version && params.version == 'draft') {
        version = `&version=${params.version}`;
      }
      const locale = params?.locale ? `&locale=${params.locale}` : '';
      let url = `${options.origin}/api/v1/spaces/${options.spaceId}/contents/slugs/${slug}?token=${options.token}${version}${locale}`;
      if (options.debug) {
        console.log(LOG_GROUP, 'getContentBySlug fetch url : ', url);
      }

      // Check if response is in cache
      if (cache.has(url)) {
        if (options.debug) {
          console.log(LOG_GROUP, 'getContentBySlug cache hit');
        }
        return cache.get(url) as Content<T>;
      }

      try {
        const response = await fetch(url, fetchOptions)
        if (options.debug) {
          console.log(LOG_GROUP, 'getContentBySlug status : ', response.status);
        }
        const data = await response.json();

        // Store response in cache
        cache.set(url, data);

        return data as Content<T>;
      } catch (error: any) {
        console.error(LOG_GROUP, 'getContentBySlug error : ', error);
        return {} as Content<T>;
      }
    },

    async getContentById<T extends ContentData = ContentData>(id: string, params?: ContentFetchParams): Promise<Content<T>> {
      if (options.debug) {
        console.log(LOG_GROUP, 'getContentById() id : ', id);
        console.log(LOG_GROUP, 'getContentById() params : ', params);
      }
      let version = '';
      // Options
      if (options?.version && options.version == 'draft') {
        version = `&version=${options.version}`;
      }
      // Params
      if (params?.version && params.version == 'draft') {
        version = `&version=${params.version}`;
      }
      const locale = params?.locale ? `&locale=${params.locale}` : '';
      let url = `${options.origin}/api/v1/spaces/${options.spaceId}/contents/${id}?token=${options.token}${version}${locale}`;
      if (options.debug) {
        console.log(LOG_GROUP, 'getContentById fetch url : ', url);
      }

      // Check if response is in cache
      if (cache.has(url)) {
        if (options.debug) {
          console.log(LOG_GROUP, 'getContentById cache hit');
        }
        return cache.get(url) as Content<T>;
      }

      try {
        const response = await fetch(url, fetchOptions)
        if (options.debug) {
          console.log(LOG_GROUP, 'getContentById status : ', response.status);
        }
        const data = await response.json();

        // Store response in cache
        cache.set(url, data);

        return data as Content<T>;
      } catch (error: any) {
        console.error(LOG_GROUP, 'getContentById error : ', error);
        return {} as Content<T>;
      }
    },

    async getTranslations(locale: string): Promise<Translations> {
      if (options.debug) {
        console.log(LOG_GROUP, 'getTranslations() locale : ', locale);
      }
      let url = `${options.origin}/api/v1/spaces/${options.spaceId}/translations/${locale}?token=${options.token}`;
      if (options.debug) {
        console.log(LOG_GROUP, 'getTranslations fetch url : ', url);
      }

      // Check if response is in cache
      if (cache.has(url)) {
        if (options.debug) {
          console.log(LOG_GROUP, 'getTranslations cache hit');
        }
        return cache.get(url) as Translations;
      }

      try {
        const response = await fetch(url, fetchOptions)
        if (options.debug) {
          console.log(LOG_GROUP, 'getTranslations status : ', response.status);
        }
        const data = await response.json();

        // Store response in cache
        cache.set(url, data);

        return data as Translations;
      } catch (error: any) {
        console.error(LOG_GROUP, 'getTranslations error : ', error);
        return {} as Translations;
      }
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
