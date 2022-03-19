'use strict';

const http = require(`http`);
const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const { HttpCode } = require(`../../constants`);

const DEFAULT_PORT = 3000;
const FILENAME = `mocks.json`;

const sendResponse = (res, statusCode, message) => {
  const template = `
    <!Doctype html>
      <html lang="ru">
      <head>
        <title>With love from Node</title>
      </head>
      <body>${message}</body>
    </html>`.trim();
  res.writeHead(statusCode, {
    'Content-Type': `text/html; charset=UTF-8`,
  });
  res.end(template)
};

const onClientConnect = async (req, res) => {
  const notFoundMessage = `404 — Not Found`;

  switch (req.url) {
    case `/`:
      try {
        const FileContent = await fs.readFile(FILENAME);
        const mocks = JSON.parse(FileContent);
        const message = mocks.map((post) => `<li>${post.title}</li>`).join(` `);
        sendResponse(res, HttpCode.OK, `<ul>${message}</ul>`)
      } catch (error) {
        sendResponse(res, HttpCode.NOT_FOUND, notFoundMessage);
      }
      break;
  
    default:
      sendResponse(res, HttpCode.NOT_FOUND, notFoundMessage);
      break;
  }
};

module.exports = {
  name: `--server`,
  async run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    http.createServer(onClientConnect)
      .listen(port)
      .on(`listening`, (err) => {
        console.info(chalk.green(`Starting server on ${port}`));
      })
      .on(`error`, ({message}) => {
        console.error(chalk.red(`Connection error: ${message}`));
      })
  },
};
