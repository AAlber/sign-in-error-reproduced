const { localise } = require("./src/server/functions/translate");

const targetDirectory = "./src/translations/";
const sourceLanguage = "en";

localise(targetDirectory, sourceLanguage)
  .then(() => {
    console.log("Translation complete! ✅");
  })
  .catch((error) => {
    console.error("A error occured:", error);
  });
