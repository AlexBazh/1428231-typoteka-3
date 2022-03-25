'use strict';

const {
  getRandomInt,
  shuffle
} = require(`../../utils`);

const {ExitCode} = require(`../../constants`);

const fs = require(`fs`).promises;
const chalk = require(`chalk`);

const DEFAULT_COUNT = 1;
const FILE_NAME = `mocks.json`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_SENTENCES_PATH = `./data/sentences.txt`;

const StartDateOfPublish = 3 * 30 * 24 * 60 * 60 * 1000;

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\n`);
  } catch (error) {
    console.error(chalk.red(`Can't read the file on ${filePath}`));
    return [];
  }
};

const generatePosts = (count, titles, categories, sentences) => (
  Array(count).fill({}).map(() => ({
    title: titles[getRandomInt(0, titles.length - 1)],
    createdDate: new Date(getRandomInt(Date.now() - StartDateOfPublish, Date.now())),
    announce: shuffle(sentences).slice(1, 5).join(` `),
    fullText: shuffle(sentences).slice(1, getRandomInt(1, sentences.length - 1)).join(` `),
    сategory: [categories[getRandomInt(0, categories.length - 1)]],
  }))
);

module.exports = {
  name: `--generate`,
  async run(args) {
    const titles = await readContent(FILE_TITLES_PATH);
    const сategory = await readContent(FILE_CATEGORIES_PATH);
    const sentences = await readContent(FILE_SENTENCES_PATH);

    const [count] = args;
    const countPosts = Number.parseInt(count, 10) || DEFAULT_COUNT;
    if (countPosts > 1000) {
      console.error(chalk.red(`Post cannot be more than 1000`));
      process.exit(ExitCode.error);
    }
    const content = JSON.stringify(generatePosts(countPosts, titles, сategory, sentences));
    try {
      await fs.writeFile(FILE_NAME, content);
      console.info(chalk.green(`Successfully wrote to the file.`));
    } catch (error) {
      console.error(chalk.red(`Can't write to the file...`));
      process.exit(ExitCode.error);
    }
  }
};
