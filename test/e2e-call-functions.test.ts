import puppeteer, { Browser, Page } from "puppeteer";
import { spawn, ChildProcess, execSync } from "child_process";
import getPort from "get-port";
import portUsed from "tcp-port-used";

jest.setTimeout(20000);

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe("e2e: call functions", () => {
  let ganacheProcess: ChildProcess;
  let serverProcess: ChildProcess;
  let ganachePort: number;
  let eth95Port: number;
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    // 1. start ganache
    ganachePort = await getPort();
    process.env.E2E_GANACHE_PORT = ganachePort.toString();
    ganacheProcess = spawn(
      "ganache-cli",
      ["-d", "-p", ganachePort.toString()],
      { stdio: "inherit" },
    );
    await portUsed.waitUntilUsed(ganachePort, 200, 10000);

    // 2. compile and migrate with truffle
    execSync(
      "cd test/projects/truffle && truffle migrate --reset --network test",
      { stdio: "inherit", env: process.env },
    );

    // 3. launch eth95
    eth95Port = await getPort();
    serverProcess = spawn(
      "ts-node",
      [
        "./src/index.ts",
        "./test/projects/truffle/build/contracts",
        "-p",
        eth95Port.toString(),
      ],
      { stdio: "inherit" },
    );
    await portUsed.waitUntilUsed(eth95Port, 200, 10000);

    // 4. launch headless browser w/ puppeteer
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
    });
    await page.goto(`http://localhost:${eth95Port}`, {
      waitUntil: "networkidle2",
    });

    // 5. connect frontend to ganache node
    await page.select(".connect-options select", "Custom");
    await page.focus(".custom-node-url-input input");
    await page.keyboard.type(`http://localhost:${ganachePort}`);
    await page.$eval(".custom-node-connect", (btn) =>
      (btn as HTMLElement).click(),
    );
    await page.waitForFunction(
      `document.getElementsByClassName("status-provider")[0].innerText === "Connected"`,
    );
  });

  afterAll(async () => {
    await browser.close();
    serverProcess.kill("SIGINT");
    ganacheProcess.kill("SIGINT");
  });

  // 5. select contract
  // 6. select function
  // 7. fill out form
  // 8. submit tx
  // 9. observe log output

  test("check connection to ganache node", async () => {
    const providerStatus = await page.$eval(
      `.status-provider`,
      (el) => el.innerHTML,
    );
    const signerStatus = await page.$eval(
      `.status-signer`,
      (el) => el.innerHTML,
    );

    expect(providerStatus.trim()).toBe("Connected");
    expect(signerStatus.trim()).toBe("Connected");
  });
});
