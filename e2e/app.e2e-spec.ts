import { GlosujPage } from './app.po';

describe('glosuj App', () => {
  let page: GlosujPage;

  beforeEach(() => {
    page = new GlosujPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
