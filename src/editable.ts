export type ContentDataSkeleton = {_id: string, schema: string};

export function llEditable(content: ContentDataSkeleton ) {
  return {
    'data-ll-id': content._id
  }
}
