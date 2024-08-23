import { register } from "@tokens-studio/sd-transforms";
import StyleDictionary from "style-dictionary";
import { makeSdTailwindConfig } from "sd-tailwindcss-transformer";

// Register transforms on the StyleDictionary object
register(StyleDictionary);

const sd = new StyleDictionary({
  type: "all",
  source: ["tokens/**/*.json"],
  platforms: {
    tailwind: {
      transformGroup: "tokens-studio",
      buildPath: "./",
      files: [
        {
          destination: "tailwind.config.js",
          format: "javascript/module",
          filter: (token) => token.type !== "composition",
          options: {
            showFileHeader: false,
            outputReferences: true,
          },
        },
      ],
    },
  },
});

// Generate Tailwind configuration
const tailwindConfig = makeSdTailwindConfig(sd);

// Write the configuration to a file
sd.extend({
  format: {
    "javascript/module": ({ dictionary, file, options }) => {
      return `module.exports = ${JSON.stringify(tailwindConfig, null, 2)}`;
    },
  },
});

await sd.cleanAllPlatforms();
await sd.buildAllPlatforms();
