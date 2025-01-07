import {ContentData} from "./models";

export function llEditable(content: ContentData ) {
  return {
    'data-ll-id': content._id,
    'data-ll-schema': content.schema,
  }
}
