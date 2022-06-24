#!/usr/bin/env node
import yargs from "yargs";
import { execute } from './usecases/ClearBrokerageNoteToCsv'

async function main() {
  const options = await yargs
    .usage("Usage: -f <path>")
    .option("v", { alias: "verbose", describe: "Log all parsing process", type: "boolean" })
    .option("f", { alias: "file", describe: "Path to file", type: "string", demandOption: true })
    .argv;

  execute(options.v, options.f)
}

main()









