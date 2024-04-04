import type { FullConfig } from "./types/Config";
import Ajv from "ajv";
import * as schemaConfig from "./schema/config.schema.json";
import * as fs from "fs";

const ajv = new Ajv();
const configSchema = ajv.compile<FullConfig>(schemaConfig);

export function loadConfig(): FullConfig {
  const configFile = JSON.parse(fs.readFileSync("config.json").toString());
  if (configSchema(configFile)) {
    return configFile;
  } else {
    throw Error("Invalid config.json configuration");
  }
}
