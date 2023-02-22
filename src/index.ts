import express from 'express';
import bodyParser from 'body-parser';
import { Request as Req, Response as Res } from 'express';
import { PORT } from './config';
import { CredentialsPlus, CredentialsPremium, MessageCreate, PubsubRequest } from './interfaces';
import { DocumentTier, TaskStatus } from './boufin';
import standardChoice from './choice/standard';
import plusChoice from './choice/plus';
import premiumChoice from './choice/premium';
import { publish } from './pubsub';
import { createDocument, getDocument } from './firestore';

const app = express();

app.use(bodyParser.json());
app.post('/create', async (req: Req, res: Res) => {
  const response = { taskStatusCode: 400, taskStatus: TaskStatus.FAILED, docId: '' };
  try {
    const { tier, username, password } = req.body as MessageCreate;
    let result: PubsubRequest;
    if (tier === DocumentTier.STANDARD) {
      result = standardChoice(username, password);
    } else if (tier === DocumentTier.PLUS) {
      result = plusChoice(username as CredentialsPlus, password as CredentialsPlus);
    } else if (tier === DocumentTier.PREMIUM) {
      result = premiumChoice(username as CredentialsPremium, password as CredentialsPremium);
    } else {
      throw new Error('Document tier is not available, may not be implemented.');
    }
    response.docId = await publish(result);
    await createDocument(response.docId);
    response.taskStatusCode = 202;
    response.taskStatus = TaskStatus.QUEUED;
    res.status(200).send(response);
  } catch (error) {
    console.error(error);
    res.status(400).send(response);
  }
});
app.get('/report/:docId([0-9a-fA-F]{64})', async (req: Req, res: Res) => {
  const { docId } = req.params;
  const response = { taskStatusCode: 400, taskStatus: TaskStatus.FAILED, results: {} };
  try {
    const { completed, report } = await getDocument(docId);
    response.taskStatusCode = completed ? 200 : 202;
    response.taskStatus = completed ? TaskStatus.COMPLETED : TaskStatus.QUEUED;
    response.results = report;
    res.status(response.taskStatusCode).send(response);
  } catch (error) {
    console.error(error);
    res.status(400).send(response);
  }
});
app.listen(PORT);
