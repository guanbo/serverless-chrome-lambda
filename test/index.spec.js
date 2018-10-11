'use strict';

const APIGatewayService = require('./lib/apigateway');
const apigw = new APIGatewayService();
const fs = require('fs');

describe('API Gateway', () => {
  it('should ok', (done) => {
    const url = 'https://d8j7if2pjb.execute-api.cn-northwest-1.amazonaws.com.cn/dev/pdf?url=https://github.com/guanbo'
    apigw.download(url, 'test.pdf', (err, res)=>{
      res.should.have.status(200);
      done();
    });
  });

  it.only('should html to pdf', (done) => {
    const url = 'https://d8j7if2pjb.execute-api.cn-northwest-1.amazonaws.com.cn/dev/html2pdf';
    const html = "<!DOCTYPE html><html><head><style>img {margin: 5% 0;max-width: 100%;max-height: 100%;}</style></head><body><img src='https://stage.qingniu-chain.com/api/v1/Clouds/uploaded-test/download/a22d4e74-a949-43a4-8397-ab76bdf9a9a4.png'/></body></html>";
    apigw.post(url, html, (err, res)=>{
      res.should.have.status(200);
      fs.writeFileSync('test.pdf', res.body, {encoding: 'base64'});
      done();
    });
  });
});