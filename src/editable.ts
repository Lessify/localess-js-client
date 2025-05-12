import {ContentDataSchema} from "./models";

export function llEditable(content: ContentDataSchema ) {
  return {
    'data-ll-id': content._id,
    'data-ll-schema': content._schema || content.schema,
  }
}

export function llEditableField(fieldName: string ) {
  return {
    'data-ll-field': fieldName,
  }
}
