describe('Basic user flow for Website', () => {
  beforeEach(async () => {
    await page.goto('https://cse110-sp25.github.io/CSE110-Shop/', {
      waitUntil: 'networkidle0',
    });

    await page.evaluate(() => {
      localStorage.setItem('cart', '[]');
    });

    await page.reload({ waitUntil: 'networkidle0' });
    await page.waitForSelector('product-item');
  });

  it('Initial Home Page - Check for 20 product items', async () => {
    const numProducts = await page.$$eval('product-item', (prodItems) => {
      return prodItems.length;
    });

    expect(numProducts).toBe(20);
  });

  it('Make sure product items are populated', async () => {
    const prodItemsData = await page.$$eval('product-item', (prodItems) => {
      return prodItems.map((item) => item.data);
    });

    for (const item of prodItemsData) {
      expect(item.title).toBeTruthy();
      expect(item.price).toBeTruthy();
      expect(item.image).toBeTruthy();
    }
  }, 10000);

  it('Clicking the "Add to Cart" button should change button text', async () => {
    const product = await page.$('product-item');
    const shadowRoot = await product.getProperty('shadowRoot');
    const button = await shadowRoot.$('button');

    await button.click();

    const text = await button.evaluate((btn) => btn.innerText);

    expect(text).toBe('Remove from Cart');
  }, 10000);

  it('Checking number of items in cart on screen', async () => {
    await page.$$eval('product-item', (prodItems) => {
      prodItems.forEach((product) => {
        const button = product.shadowRoot.querySelector('button');
        if (button.innerText === 'Add to Cart') {
          button.click();
        }
      });
    });

    await page.waitForFunction(() => {
      return document.querySelector('#cart-count').innerText === '20';
    });

    const cartCount = await page.$eval('#cart-count', (el) => el.innerText);
    expect(cartCount).toBe('20');
  }, 10000);

  it('Checking number of items in cart on screen after reload', async () => {
    await page.$$eval('product-item', (prodItems) => {
      prodItems.forEach((product) => {
        const button = product.shadowRoot.querySelector('button');
        if (button.innerText === 'Add to Cart') {
          button.click();
        }
      });
    });

    await page.waitForFunction(() => {
      return document.querySelector('#cart-count').innerText === '20';
    });

    await page.reload({ waitUntil: 'networkidle0' });
    await page.waitForSelector('product-item');

    const buttonTexts = await page.$$eval('product-item', (prodItems) => {
      return prodItems.map((product) => {
        return product.shadowRoot.querySelector('button').innerText;
      });
    });

    for (const text of buttonTexts) {
      expect(text).toBe('Remove from Cart');
    }

    const cartCount = await page.$eval('#cart-count', (el) => el.innerText);
    expect(cartCount).toBe('20');
  }, 10000);

  it('Checking the localStorage to make sure cart is correct', async () => {
    await page.$$eval('product-item', (prodItems) => {
      prodItems.forEach((product) => {
        const button = product.shadowRoot.querySelector('button');
        if (button.innerText === 'Add to Cart') {
          button.click();
        }
      });
    });

    await page.waitForFunction(() => {
      return JSON.parse(localStorage.getItem('cart')).length === 20;
    });

    const cart = await page.evaluate(() => JSON.parse(localStorage.getItem('cart')));
    expect(cart.length).toBe(20);
  }, 10000);

  it('Checking number of items in cart on screen after removing from cart', async () => {
    await page.$$eval('product-item', (prodItems) => {
      prodItems.forEach((product) => {
        const button = product.shadowRoot.querySelector('button');
        if (button.innerText === 'Add to Cart') {
          button.click();
        }
      });
    });

    await page.waitForFunction(() => {
      return document.querySelector('#cart-count').innerText === '20';
    });

    await page.$$eval('product-item', (prodItems) => {
      prodItems.forEach((product) => {
        const button = product.shadowRoot.querySelector('button');
        if (button.innerText === 'Remove from Cart') {
          button.click();
        }
      });
    });

    await page.waitForFunction(() => {
      return document.querySelector('#cart-count').innerText === '0';
    });

    const cartCount = await page.$eval('#cart-count', (el) => el.innerText);
    expect(cartCount).toBe('0');
  }, 10000);

  it('Checking number of items in cart on screen after reload', async () => {
    await page.$$eval('product-item', (prodItems) => {
      prodItems.forEach((product) => {
        const button = product.shadowRoot.querySelector('button');
        if (button.innerText === 'Add to Cart') {
          button.click();
        }
      });
    });

    await page.waitForFunction(() => {
      return document.querySelector('#cart-count').innerText === '20';
    });

    await page.$$eval('product-item', (prodItems) => {
      prodItems.forEach((product) => {
        const button = product.shadowRoot.querySelector('button');
        if (button.innerText === 'Remove from Cart') {
          button.click();
        }
      });
    });

    await page.waitForFunction(() => {
      return document.querySelector('#cart-count').innerText === '0';
    });

    await page.reload({ waitUntil: 'networkidle0' });
    await page.waitForSelector('product-item');

    const buttonTexts = await page.$$eval('product-item', (prodItems) => {
      return prodItems.map((product) => {
        return product.shadowRoot.querySelector('button').innerText;
      });
    });

    for (const text of buttonTexts) {
      expect(text).toBe('Add to Cart');
    }

    const cartCount = await page.$eval('#cart-count', (el) => el.innerText);
    expect(cartCount).toBe('0');
  }, 10000);

  it('Checking the localStorage to make sure cart is correct', async () => {
    const cart = await page.evaluate(() => localStorage.getItem('cart'));
    expect(cart).toBe('[]');
  });
});