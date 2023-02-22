import supertest from 'supertest';
import { publish } from '../src/pubsub';
import { createDocument, getDocument } from '../src/firestore';
import { app, server } from '../src/index';
import createBody from './data/create-body';
import completeReport from './data/report';
import { TaskStatus } from '../src/boufin';

const api = supertest(app);
jest.mock('../src/pubsub', () => ({ publish: jest.fn().mockResolvedValue('token') }));
jest.mock('../src/firestore', () => ({
  createDocument: jest.fn(),
  getDocument: jest.fn().mockResolvedValue({
    completed: true,
    report: {
      docId: 'token'
    }
  })
}));

describe('Api requests works on correct values', () => {
  test('Post request on /create path', async () => {
    const response = await api.post('/create').send(createBody);

    expect(publish).toHaveBeenCalledTimes(1);
    expect(createDocument).toHaveBeenCalledTimes(1);
    expect(response.status).toEqual(202);
    expect(response.body).toEqual({
      taskStatusCode: 202,
      taskStatus: TaskStatus.QUEUED,
      docId: 'token'
    });
  });
  test('Get request on /report/:reportId path', async () => {
    const response = await api.get(`/report/${completeReport.docId}`);

    expect(getDocument).toHaveBeenCalledTimes(1);
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      taskStatusCode: 200,
      taskStatus: TaskStatus.COMPLETED,
      results: {
        docId: 'token'
      }
    });
  });
  afterAll(() => {
    server.close();
  });
});
