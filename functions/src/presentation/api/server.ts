import * as express from 'express'
import * as cors from 'cors'
import * as BrokerageNoteToCsv from '../../services/BrokerageNoteToCsv'
import filesUpload from './middleware/middleware'

const app = express()
app.use(cors())

app.post('/', filesUpload, async (req: any, res: any) => {
  if (!req.files[0]) return res.send('null').status(200);
  const result = await BrokerageNoteToCsv.execute(req.files[0].buffer, false)
  res.attachment('parsed.csv').send(result)
})

export default app

