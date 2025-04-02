import { ContentData } from './content-data';
import {ContentMetadata} from "./content-metadata";
import {Links} from "./links";

/**
 * Content define shared object for all possible Content Types.
 */
export interface Content<T extends ContentData = ContentData> extends ContentMetadata {
  /**
   * Content Data
   */
  data?: T;
  /**
   * References of all links used in the content.
   */
  links?: Links
}
