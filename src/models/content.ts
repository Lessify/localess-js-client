import { ContentData } from './content-data';
import {ContentMetadata} from "./content-metadata";

/**
 * Content define shared object for all possible Content Types.
 */
export interface Content extends ContentMetadata {
  /**
   * Content Data
   */
  data?: ContentData;
}
