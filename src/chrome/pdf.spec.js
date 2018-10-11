import { renderFromHtml } from './pdf'
import should from 'should'

describe('PDF', () => {
  let htmlstring = "<!DOCTYPE html><html><head><style>img {margin: 5% 0;max-width: 100%;max-height: 100%;}</style></head><body><img src='https://stage.qingniu-chain.com/api/v1/Clouds/uploaded-test/download/a22d4e74-a949-43a4-8397-ab76bdf9a9a4.png'/></body></html>";
  it('should render from htmlstring', async () => {
    const result = await renderFromHtml(htmlstring);

    result.should.have.be.String();
  });
});