import {h64} from 'xxhashjs';

export type selectorFunction = (...args: any) => any;
const hashFunction = (foo: selectorFunction, identifier: string): string => {
  return h64(foo.name + foo.toString() + identifier, 0xABCD).toString(16);
};
let selectorStorage: Record<string, selectorFunction> = {};
export const registerSelector = (selector: selectorFunction, identifier = '') => {
  const hash = hashFunction(selector, identifier);
  if (selectorStorage.hasOwnProperty(hash)) {
    throw new Error(`Duplicate wselector identified. \
    The selector: '${selector.name}' already exists.\
     If you didn't register this selector a naming collision has occurred.\
      To fix this error call the registerSelector with the second argument as an identifier to the selector`);
  }
  selectorStorage[hash] = selector;
  (selector as selectorFunction & { hash: string }).hash = hash;
};
export const getSelectorByHash = (hash: string): selectorFunction => selectorStorage[hash];
export const getSelectorHash = (selector: selectorFunction): string => (selector as selectorFunction & { hash: string }).hash;
export const resetSelectorStorage = () => selectorStorage = {};
