import { insertDocument, getDocuments } from "./DBConnection";

export const Read = (collection, filter) => {
  return getDocuments(collection, filter);
};
export const Write = (data, collection) => {
  insertDocument(data, collection);
};
