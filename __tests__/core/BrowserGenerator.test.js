const BrowserGenerator = require("../../core/BrowserGenerator");

describe('BrowserGenerator Tests', () => {
  it('should create and return one browser', async () => {
    const browser = await Promise.all(BrowserGenerator.generateBrowsers(1))

    expect(browser.length).toBe(1);

    browser.map(item => {
      expect(item.constructor.name).toBe('Browser');
    })

    browser.map(async browser => await browser.close())
  })

  it('should create and return three browsers', async () => {
    const browser = await Promise.all(BrowserGenerator.generateBrowsers(3))

    expect(browser.length).toBe(3);

    browser.map(item => {
      expect(item.constructor.name).toBe('Browser');
    })

    browser.map(async browser => await browser.close())
  })

  it('should close all connections', async () => {
    const browser = await Promise.all(BrowserGenerator.generateBrowsers(1))

    await Promise.all(BrowserGenerator.closeAll(browser));
  })
});