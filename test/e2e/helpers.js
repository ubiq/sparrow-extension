const path = require('path');
const sinon = require('sinon');
const BigNumber = require('bignumber.js');
const mockttp = require('mockttp');
const createStaticServer = require('../../development/create-static-server');
const {
  createSegmentServer,
} = require('../../development/lib/create-segment-server');
const { setupMocking } = require('../../development/mock-e2e');
const enLocaleMessages = require('../../app/_locales/en/messages.json');
const Ganache = require('./ganache');
const FixtureServer = require('./fixture-server');
const { buildWebDriver } = require('./webdriver');
const { ensureXServerIsRunning } = require('./x-server');

const tinyDelayMs = 200;
const regularDelayMs = tinyDelayMs * 2;
const largeDelayMs = regularDelayMs * 2;
const dappPort = 8080;

const convertToHexValue = (val) => `0x${new BigNumber(val, 10).toString(16)}`;

async function withFixtures(options, testSuite) {
  const {
    dapp,
    fixtures,
    ganacheOptions,
    driverOptions,
    mockSegment,
    title,
    failOnConsoleError = true,
    dappPath = undefined,
    testSpecificMock = function () {
      // do nothing.
    },
  } = options;
  const fixtureServer = new FixtureServer();
  const ganacheServer = new Ganache();
  let secondaryGanacheServer;
  let dappServer;
  let segmentServer;
  let segmentStub;
  let mockServer;

  let webDriver;
  let failed = false;
  try {
    await ganacheServer.start(ganacheOptions);
    if (ganacheOptions?.concurrent) {
      const { port, chainId } = ganacheOptions.concurrent;
      secondaryGanacheServer = new Ganache();
      await secondaryGanacheServer.start({
        blockTime: 2,
        chain: { chainId },
        port,
        vmErrorsOnRPCResponse: false,
      });
    }
    await fixtureServer.start();
    await fixtureServer.loadState(path.join(__dirname, 'fixtures', fixtures));
    if (dapp) {
      let dappDirectory;
      if (dappPath) {
        dappDirectory = path.resolve(__dirname, dappPath);
      } else {
        dappDirectory = path.resolve(
          __dirname,
          '..',
          '..',
          'node_modules',
          '@metamask',
          'test-dapp',
          'dist',
        );
      }
      dappServer = createStaticServer(dappDirectory);
      dappServer.listen(dappPort);
      await new Promise((resolve, reject) => {
        dappServer.on('listening', resolve);
        dappServer.on('error', reject);
      });
    }
    if (mockSegment) {
      segmentStub = sinon.stub();
      segmentServer = createSegmentServer((_request, response, events) => {
        for (const event of events) {
          segmentStub(event);
        }
        response.statusCode = 200;
        response.end();
      });
      await segmentServer.start(9090);
    }
    const https = await mockttp.generateCACertificate();
    mockServer = mockttp.getLocal({ https });
    setupMocking(mockServer, testSpecificMock);
    await mockServer.start(8000);
    if (
      process.env.SELENIUM_BROWSER === 'chrome' &&
      process.env.CI === 'true'
    ) {
      await ensureXServerIsRunning();
    }
    const { driver } = await buildWebDriver(driverOptions);
    webDriver = driver;

    await testSuite({
      driver,
      segmentStub,
      mockServer,
    });

    if (process.env.SELENIUM_BROWSER === 'chrome') {
      const errors = await driver.checkBrowserForConsoleErrors(driver);
      if (errors.length) {
        const errorReports = errors.map((err) => err.message);
        const errorMessage = `Errors found in browser console:\n${errorReports.join(
          '\n',
        )}`;
        if (failOnConsoleError) {
          throw new Error(errorMessage);
        } else {
          console.error(new Error(errorMessage));
        }
      }
    }
  } catch (error) {
    failed = true;
    if (webDriver) {
      try {
        await webDriver.verboseReportOnFailure(title);
      } catch (verboseReportError) {
        console.error(verboseReportError);
      }
    }
    throw error;
  } finally {
    if (!failed || process.env.E2E_LEAVE_RUNNING !== 'true') {
      await fixtureServer.stop();
      await ganacheServer.quit();
      if (ganacheOptions?.concurrent) {
        await secondaryGanacheServer.quit();
      }
      if (webDriver) {
        await webDriver.quit();
      }
      if (dappServer && dappServer.listening) {
        await new Promise((resolve, reject) => {
          dappServer.close((error) => {
            if (error) {
              return reject(error);
            }
            return resolve();
          });
        });
      }
      if (segmentServer) {
        await segmentServer.stop();
      }
      if (mockServer) {
        await mockServer.stop();
      }
    }
  }
}

/**
 * @param {*} driver - selinium driver
 * @param {*} handlesCount - total count of windows that should be loaded
 * @returns handles - an object with window handles, properties in object represent windows:
 *            1. extension: metamask extension window
 *            2. dapp: test-app window
 *            3. popup: metsmask extension popup window
 */
const getWindowHandles = async (driver, handlesCount) => {
  await driver.waitUntilXWindowHandles(handlesCount);
  const windowHandles = await driver.getAllWindowHandles();

  const extension = windowHandles[0];
  const dapp = await driver.switchToWindowWithTitle(
    'E2E Test Dapp',
    windowHandles,
  );
  const popup = windowHandles.find(
    (handle) => handle !== extension && handle !== dapp,
  );
  return { extension, dapp, popup };
};

const connectDappWithExtensionPopup = async (driver) => {
  await driver.openNewPage(`http://127.0.0.1:${dappPort}/`);
  await driver.delay(regularDelayMs);
  await driver.clickElement({ text: 'Connect', tag: 'button' });
  await driver.delay(regularDelayMs);

  const windowHandles = await getWindowHandles(driver, 3);

  // open extension popup and confirm connect
  await driver.switchToWindow(windowHandles.popup);
  await driver.delay(largeDelayMs);
  await driver.clickElement({ text: 'Next', tag: 'button' });
  await driver.clickElement({ text: 'Connect', tag: 'button' });

  // send from dapp
  await driver.waitUntilXWindowHandles(2);
  await driver.switchToWindow(windowHandles.dapp);
  await driver.delay(regularDelayMs);
};

const completeImportSRPOnboardingFlow = async (
  driver,
  seedPhrase,
  password,
) => {
  if (process.env.ONBOARDING_V2 === '1') {
    // welcome
    await driver.clickElement('[data-testid="onboarding-import-wallet"]');

    // metrics
    await driver.clickElement('[data-testid="metametrics-no-thanks"]');

    // import with recovery phrase
    await driver.fill('[data-testid="import-srp-text"]', seedPhrase);
    await driver.clickElement('[data-testid="import-srp-confirm"]');

    // create password
    await driver.fill('[data-testid="create-password-new"]', password);
    await driver.fill('[data-testid="create-password-confirm"]', password);
    await driver.clickElement('[data-testid="create-password-terms"]');
    await driver.clickElement('[data-testid="create-password-import"]');

    // complete
    await driver.clickElement('[data-testid="onboarding-complete-done"]');

    // pin extension
    await driver.clickElement('[data-testid="pin-extension-next"]');
    await driver.clickElement('[data-testid="pin-extension-done"]');
  } else {
    // clicks the continue button on the welcome screen
    await driver.findElement('.welcome-page__header');
    await driver.clickElement({
      text: enLocaleMessages.getStarted.message,
      tag: 'button',
    });

    // clicks the "Import Wallet" option
    await driver.clickElement({ text: 'Import wallet', tag: 'button' });

    // clicks the "No thanks" option on the metametrics opt-in screen
    await driver.clickElement('.btn-secondary');

    // Import Secret Recovery Phrase
    await driver.fill(
      'input[placeholder="Enter your Secret Recovery Phrase"]',
      seedPhrase,
    );

    await driver.fill('#password', password);
    await driver.fill('#confirm-password', password);

    await driver.clickElement(
      '[data-testid="create-new-vault__terms-checkbox"]',
    );

    await driver.clickElement({ text: 'Import', tag: 'button' });

    // clicks through the success screen
    await driver.findElement({ text: 'Congratulations', tag: 'div' });
    await driver.clickElement({
      text: enLocaleMessages.endOfFlowMessage10.message,
      tag: 'button',
    });
  }
};

module.exports = {
  getWindowHandles,
  convertToHexValue,
  tinyDelayMs,
  regularDelayMs,
  largeDelayMs,
  withFixtures,
  connectDappWithExtensionPopup,
  completeImportSRPOnboardingFlow,
};
