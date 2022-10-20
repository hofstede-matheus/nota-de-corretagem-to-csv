import express from 'express'
import multer from 'multer'
import cors from 'cors'

import * as BrokerageNoteToCsv from '../../services/BrokerageNoteToCsv'
const app = express()
app.use(cors())
const PORT = 3001
const storage = multer.memoryStorage();
const upload = multer({ storage})

app.post('/', upload.single('pdf'), async (req: any, res: any) => {
  if (!req.file) return res.send('null').status(200);
  const result = await BrokerageNoteToCsv.execute(req.file.buffer, false)
  res.attachment('parsed.csv').send(result)
})

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})