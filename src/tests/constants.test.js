import { describe, it, expect } from 'vitest';
import { nextQuadrant } from '../constants';

describe('nextQuadrant utility function', () => {
  it('should cycle from "do" to "decide"', () => {
    expect(nextQuadrant('do')).toBe('decide');
  });

  it('should cycle from "decide" to "delegate"', () => {
    expect(nextQuadrant('decide')).toBe('delegate');
  });

  it('should cycle from "delegate" to "delete"', () => {
    expect(nextQuadrant('delegate')).toBe('delete');
  });

  it('should cycle from "delete" back to "do"', () => {
    expect(nextQuadrant('delete')).toBe('do');
  });
});
