/* eslint-disable */
const fs = require("fs/promises");
const path = require("path");
const OpenAI = require("openai");
const CACHE_FILE = path.join("src/translations/cacheWords/cache.json");

const FILE_EXTENSION = ".json";

const openai = new OpenAI({
  apiKey: "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",
  organization: "org-3JtdYfoxsj3LBRDcmYbTF61R",
});

const getDirectoryLocales = async (directory) => {
  let filenames = await fs.readdir(directory);

  // Only gets filenames with .json extension
  filenames = filenames.filter((filename) => filename.endsWith(FILE_EXTENSION));

  // Removes the extension from the filenames
  const locales = filenames.map((filename) =>
    filename.slice(0, filename.lastIndexOf(FILE_EXTENSION)),
  );
  return locales;
};

const getLocaleMessages = async (filepath) => {
  let messages = {};
  try {
    const fileContents = await fs.readFile(filepath, { encoding: 'utf8' });
    messages = JSON.parse(fileContents);
  } catch (e) {
    console.error("Error in getLocaleMessages:", e);
    if (e.code === 'ENOENT') {
      throw new Error("File not found: " + filepath);
    } else if (e instanceof SyntaxError) {
      throw new Error("Syntax error in JSON parsing for file: " + filepath);
    } else {
      throw e; // rethrow the error unchanged if it's not one we're specifically looking for
    }
  }
  return messages
}


const translateText = async (text, sourceLanguage, targetLanguage) => {
  try {
    console.log("Translating:", text);
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are highly capable translation bot, translating a software. This software is an all in one solution for educational organisations. So make sure to translate in that context. If you are translating in german make sure to use gender neutral language (so-called gendern). Users would be Benutzer*innen or teachers / educators would be Lehrende. Students would be Lernende. Never use the words Schüler, Studierende or Lehrer.`,
        },
        {
          role: "user",
          content: `Translate the following text from ${sourceLanguage} to ${targetLanguage}: ${text}`,
        },
      ],
    });

    if (
      response &&
      response.choices &&
      response.choices.length > 0 &&
      response.choices[0]?.message?.content
    ) {
      return response.choices[0]?.message?.content;
    } else {
      return "";
    }
  } catch (error) {
    console.error("Error translating text:", error);
    return "";
  }
};

const loadCache = async () => {
  try {
    const cacheData = await fs.readFile(CACHE_FILE);
    return JSON.parse(cacheData);
  } catch (error) {
    return {};
  }
};

const saveCache = async (cache) => {
  await fs.writeFile(CACHE_FILE, JSON.stringify(cache));
};

exports.localise = async (targetDirectory, sourceLanguage) => {
  const locales = await getDirectoryLocales(targetDirectory);

  if (!locales.includes(sourceLanguage)) {
    throw new Error("Source language file not found: " + sourceLanguage);
  }

  const sourceFilePath = path.join(
    targetDirectory,
    sourceLanguage + FILE_EXTENSION,
  );
  const messages = await getLocaleMessages(sourceFilePath);

  const cache = await loadCache();
  const translatedCache = cache[sourceLanguage] || {};

  let hasNewTranslations = false;

  for (let locale of locales) {
    if (locale === sourceLanguage) continue;

    const translatedMessages = {};

    for (let key in messages) {
      const value = messages[key];

      const cacheKey = `${sourceLanguage}-${locale}-${key}`;

      if (translatedCache[cacheKey]) {
        // Use cached translation

        translatedMessages[key] = translatedCache[cacheKey];
      } else {
        // Translate the message using the DeepL API
        const translatedValue = await translateText(
          value,
          sourceLanguage,
          locale,
        );

        translatedMessages[key] = translatedValue;

        // Store the translated message in the cache
        translatedCache[cacheKey] = translatedValue;
        hasNewTranslations = true;
      }
    }

    await fs.writeFile(
      path.join(targetDirectory, locale + FILE_EXTENSION),
      JSON.stringify(translatedMessages),
    );
  }

  if (hasNewTranslations) {
    cache[sourceLanguage] = translatedCache;
    await saveCache(cache);
    console.log("Translation completed and cache updated.");
  } else {
    console.log("No new messages to translate. Cache maintained.");
  }
};
