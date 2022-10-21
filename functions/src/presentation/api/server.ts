import * as express from 'express'
// import * as multer from 'multer'
import * as cors from 'cors'

import * as BrokerageNoteToCsv from '../../services/BrokerageNoteToCsv'
import filesUpload from '../../middleware'
const app = express()
app.use(cors())
// const storage = multer.memoryStorage();
// const upload = multer({ storage})


app.post('/', filesUpload, async (req: any, res: any) => {
  console.table(req.files);
  if (!req.files[0]) return res.send('null').status(200);
  const result = await BrokerageNoteToCsv.execute(req.files[0].buffer, false)
  res.attachment('parsed.csv').send(result)
})

export default app

