import {ContentDataSchema} from "./models";

export function llEditable(content: ContentDataSchema ) {
  return {
    'data-ll-id': content._id,
    'data-ll-schema': content.schema,
  }
}
