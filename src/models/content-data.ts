import {ContentAsset} from "./content-asset";
import {ContentLink} from "./content-link";
import {ContentRichText} from "./content-rich-text";
import {ContentReference} from "./content-reference";

/**
 * ContentData defined Object to connect all possible root Schemas.
 */
export type ContentData = {
  /**
   * Unique identifier of a component in a content.
   */
  _id: string;
  /**
   * Unique identifier for the Schema object.
   */
  schema: string;
  /**
   * Other Schema specific fields
   */
  [key: string]: any | string | string[] | number | boolean | ContentAsset | ContentAsset[] | ContentLink | ContentReference | ContentReference[] | ContentRichText | ContentData | ContentData[] | undefined;
};
