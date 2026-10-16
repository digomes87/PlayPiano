import { describe, expect, test, vi } from 'vitest';
import { Synth } from './synth';

type ContextState = 'suspended' | 'running' | 'interrupted' | 'closed';

const fakeContext = (state: ContextState) => {
  const source = { buffer: null, connect: vi.fn(), start: vi.fn() };
  return {
    state,
    resume: vi.fn(() => Promise.resolve()),
    createBuffer: vi.fn(() => ({})),
    createBufferSource: vi.fn(() => source),
    destination: {},
    source,
  };
};

const synthWith = (context: ReturnType<typeof fakeContext>) =>
  new Synth(() => context as unknown as AudioContext);

describe('Synth.unlock', () => {
  test('resumes a suspended context and plays a silent buffer', () => {
    const context = fakeContext('suspended');

    synthWith(context).unlock();

    expect(context.resume).toHaveBeenCalledOnce();
    expect(context.source.start).toHaveBeenCalledOnce();
  });

  test('resumes a context the system interrupted', () => {
    const context = fakeContext('interrupted');

    synthWith(context).unlock();

    expect(context.resume).toHaveBeenCalledOnce();
  });

  test('leaves a running context alone', () => {
    const context = fakeContext('running');

    synthWith(context).unlock();

    expect(context.resume).not.toHaveBeenCalled();
  });

  test('creates the context only once across unlocks', () => {
    const context = fakeContext('suspended');
    const factory = vi.fn(() => context as unknown as AudioContext);
    const synth = new Synth(factory);

    synth.unlock();
    synth.unlock();

    expect(factory).toHaveBeenCalledOnce();
  });

  test('a rejected resume does not throw; the next gesture retries', async () => {
    const context = fakeContext('suspended');
    context.resume.mockImplementationOnce(() => Promise.reject(new Error('not allowed')));
    const synth = synthWith(context);

    expect(() => synth.unlock()).not.toThrow();
    await Promise.resolve();
    synth.unlock();

    expect(context.resume).toHaveBeenCalledTimes(2);
  });

  test('without Web Audio support unlock does nothing', () => {
    expect(() => new Synth(() => null).unlock()).not.toThrow();
  });
});
