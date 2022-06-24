import { PDFExtract } from 'pdf.js-extract';
import { Parser } from 'json2csv';
import fs from 'fs';

interface OperationRow {
  buy_sell: string;
  operationDate: string;
  marketType: string;
  specification: string;
  title: string;
  quantity: string;
  adjustmentPrice: string;
  operationAdjustmentPrice: string;
}

export async function execute(
  verbose: boolean = false,
  path: string,
) {
  const operations: OperationRow[] = [];
  const data = await new PDFExtract().extract(path, {})

  data.pages.map((it) => {
    if (verbose) {
      const document = it.content.map((it) => it.str)
      console.table(document)
    }
    it.content.map((item, index) => {
      if (item.str === '1-BOVESPA') {
        const titleSpecification = it.content[index - 3].str
        if (titleSpecification === '01/00') {
          const titleTypeFirstIndex = index - 5;
          let titleNumberOfWords = 1
          if (it.content[titleTypeFirstIndex - 1].str === ' ') titleNumberOfWords = 2
          if (it.content[titleTypeFirstIndex - 3].str === ' ') titleNumberOfWords = 3
          let titleName = ""
          let titleLastIndex;

          switch (titleNumberOfWords) {
            case 1:
              titleName = it.content[titleTypeFirstIndex].str
              titleLastIndex = titleTypeFirstIndex
              break;
            case 2:
              titleName = it.content[titleTypeFirstIndex - 2].str + it.content[titleTypeFirstIndex - 1].str + it.content[titleTypeFirstIndex].str
              titleLastIndex = titleTypeFirstIndex - 2
              break
            case 3:
              titleName = it.content[titleTypeFirstIndex - 4].str + it.content[titleTypeFirstIndex - 3].str + it.content[titleTypeFirstIndex - 2].str + it.content[titleTypeFirstIndex - 1].str + it.content[titleTypeFirstIndex].str
              titleLastIndex = titleTypeFirstIndex - 4
              break;
            default:
              titleLastIndex = titleTypeFirstIndex
          }

          const csvLine = {
            buy_sell: it.content[index - 1].str,
            operationDate: it.content[6].str,
            marketType: it.content[index - 2].str,
            specification: it.content[index - 4].str,
            title: titleName,
            quantity: parseFloat(it.content[titleLastIndex - 1].str).toFixed(2),
            adjustmentPrice: parseReal(it.content[titleLastIndex - 5].str),
            operationAdjustmentPrice: parseReal(it.content[titleLastIndex - 2].str),
          }

          if (verbose) {
            console.table(csvLine)
          }

          operations.push(csvLine)
        } else {
          const titleFirstIndex = index - 4;
          let numWords = 1
          if (it.content[titleFirstIndex - 1].str === ' ') numWords = 2
          if (it.content[titleFirstIndex - 3].str === ' ') numWords = 3
          let titulo = ""
          let titleLastIndex;

          switch (numWords) {
            case 1:
              titulo = it.content[titleFirstIndex].str
              titleLastIndex = titleFirstIndex
              break;
            case 2:
              titulo = it.content[titleFirstIndex - 2].str + it.content[titleFirstIndex - 1].str + it.content[titleFirstIndex].str
              titleLastIndex = titleFirstIndex - 2
              break
            case 3:
              titulo = it.content[titleFirstIndex - 4].str + it.content[titleFirstIndex - 3].str + it.content[titleFirstIndex - 2].str + it.content[titleFirstIndex - 1].str + it.content[titleFirstIndex].str
              titleLastIndex = titleFirstIndex - 4
              break;

            default:
              titleLastIndex = titleFirstIndex
          }

          const csvLine = {
            buy_sell: it.content[index - 1].str,
            operationDate: it.content[6].str,
            marketType: it.content[index - 2].str,
            specification: it.content[index - 3].str,
            title: titulo,
            quantity: (parseFloat(it.content[titleLastIndex - 1].str).toFixed(2)),
            adjustmentPrice: parseReal(it.content[titleLastIndex - 5].str),
            operationAdjustmentPrice: parseReal(it.content[titleLastIndex - 2].str),
          }

          if (verbose) {
            console.table(csvLine)
          }

          operations.push(csvLine)
        }
      }
    })
  })

  try {
    const parser = new Parser({fields: ['buy_sell', 'operationDate', 'marketType', 'specification', 'title', 'quantity', 'adjustmentPrice', 'operationAdjustmentPrice']});
    const csv = parser.parse(operations);

    if (verbose) console.log(csv);
    
    fs.writeFile('out.csv', csv, function(err) {
      if (err) throw err;
      console.log('file saved!');
    });
  } catch (err) {
    console.error(err);
  }
}

function parseReal(value: string) {
  return value.replace(/,/, '.')
}