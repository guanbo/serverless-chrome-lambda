import handler from './pdf'
import html2pdf from './html2pdf'
import fs from 'fs'
import {promisify} from 'util'

const writeFile = promisify(fs.writeFile);

describe.only('PDF', () => {
  it('should url to pdf', async () => {
    const testEvent = {
      queryStringParameters: { url: 'https://github.com/guanbo' },
    }

    const res = await handler(testEvent, {});

    res.should.have.status(200);
  });

  it.only('should html to pdf', async () => {
    const testEvent = {
      body: "<!DOCTYPE html><html><head><style>img {margin: 5% 0;max-width: 100%;max-height: 100%;}</style></head><body><img src='https://stage.qingniu-chain.com/api/v1/Clouds/uploaded-test/download/a22d4e74-a949-43a4-8397-ab76bdf9a9a4.png'/></body></html>"
    }

    const res = await html2pdf(testEvent, {});

    res.should.have.status(200);

    await writeFile('test.pdf', res.body, {encoding: 'base64'})
  });
});