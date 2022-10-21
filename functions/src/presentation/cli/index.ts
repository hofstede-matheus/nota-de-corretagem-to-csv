#!/usr/bin/env node
import * as yargs from "yargs";
import * as fs from 'fs';
import * as BrokerageNoteToCsv from '../../services/BrokerageNoteToCsv'

async function main() {
  const options = await yargs
    .usage("Usage: -f <path>")
    .option("v", { alias: "verbose", describe: "Log all parsing process", type: "boolean", default: false })
    .option("f", { alias: "file", describe: "Path to file", type: "string", demandOption: true })
    .argv;

  const result = await BrokerageNoteToCsv.execute(options.f, options.v)
  fs.writeFile('out.csv', result, function(err) {
    if (err) throw err;
    console.log('file saved!');
  });
}

main()