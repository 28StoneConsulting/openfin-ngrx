import {registerSelector, getSelectorByHash, getSelectorHash, resetSelectorStorage} from '../lib/selector-manager';

describe('selector manager', () => {
  let mockSelector;
  beforeEach(() => {
    mockSelector = (state) => state.data;
    registerSelector(mockSelector);
  });

  afterEach(() => resetSelectorStorage());

  it('should add hash prop on selector', () => {
    expect((mockSelector as any).hash).toEqual(jasmine.any(String));
  });

  it('should return different hash for different selector name', () => {
    const hash = getSelectorHash(mockSelector);
    const mockSelector2 = (state) => state.data;
    registerSelector(mockSelector2);
    const hash2 = getSelectorHash(mockSelector2);
    expect(hash).not.toBe(hash2);
  });

  it('should return different hash for different selector', () => {
    const hash = getSelectorHash(mockSelector);
    mockSelector = (state) => state.data2;
    registerSelector(mockSelector);
    const hash2 = getSelectorHash(mockSelector);
    expect(hash).not.toBe(hash2);
  });

  it('should get selector by hash', () => {
    const hash = getSelectorHash(mockSelector);
    expect(getSelectorByHash(hash)).toBe(mockSelector);
  });

  it('should throw if the same selector register twice', () => {
    mockSelector = (state) => state.data;
    expect(() => registerSelector(mockSelector)).toThrow();
  });

  it('should not throw if the same selector register twice but different identifier', () => {
    mockSelector = (state) => state.data;
    expect(() => registerSelector(mockSelector, 'identifier')).not.toThrow();
  });
});
