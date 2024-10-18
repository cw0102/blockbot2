type BBStorageSaveFunction = (key: string, value: string) => boolean;
type BBStorageLoadFunction = (key: string) => string;

export interface BBStorage {
  save: BBStorageSaveFunction;
  load: BBStorageLoadFunction;
}
