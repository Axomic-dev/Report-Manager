import express from 'express';
import bodyParser from 'body-parser';
import { Request as Req, Response as Res } from 'express';
import { PORT } from './config';
import { CredentialsPlus, CredentialsPremium, MessageCreate, PubsubRequest } from './interfaces';
import { DocumentTier } from './boufin';
import standardChoice from './choice/standard';
import plusChoice from './choice/plus';
import premiumChoice from './choice/premium';
import { publish } from './pubsub';
import { getDocument } from './firestore';

const app = express();

app.use(bodyParser.json());
app.post('/create', async (req: Req, res: Res) => {
  const response = { docId: '' };
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
  } catch (error) {
    console.error(error);
  }
  res.status(200).send(response);
});
app.get('/report/:docId([0-9a-fA-F]{64})', async (req: Req, res: Res) => {
  const { docId } = req.params;
  const response = { complete: false, results: {} };
  try {
    const report = await getDocument(docId);
    response.complete = true;
    response.results = report;
  } catch (error) {
    console.error(error);
  }
  res.status(200).send(response);
});

app.listen(PORT);
