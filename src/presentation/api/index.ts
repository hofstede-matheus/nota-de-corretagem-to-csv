import express from 'express'
import multer from 'multer'

import * as BrokerageNoteToCsv from '../../services/BrokerageNoteToCsv'
const app = express()
const PORT = 3001
const storage = multer.memoryStorage();
const upload = multer({ storage})

app.get('/', (req: any, res: any) => {
  res.send('Hello World!')
})

app.post('/', upload.single('pdf'), async (req: any, res: any) => {
  const result = await BrokerageNoteToCsv.execute(req.file.buffer, false)
  res.attachment('customers.csv').send(result)
})

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})