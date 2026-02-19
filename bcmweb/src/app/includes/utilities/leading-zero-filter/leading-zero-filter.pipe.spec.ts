import { LeadingZeroFilterPipe } from './leading-zero-filter.pipe';

describe('LeadingZeroFilterPipe', () => {
  it('create an instance', () => {
    const pipe = new LeadingZeroFilterPipe();
    expect(pipe).toBeTruthy();
  });
});
