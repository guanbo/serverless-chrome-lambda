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

  describe('# html to pdf', () => {
    const options = {
      uri: 'https://d8j7if2pjb.execute-api.cn-northwest-1.amazonaws.com.cn/dev/html2pdf',
      headers: {
        'Content-Type': 'application/html'
      },
      body: "<!DOCTYPE html><html><head><style>img {margin: 5% 0;max-width: 100%;max-height: 100%;}</style></head><body><img src='https://stage.qingniu-chain.com/api/v1/Clouds/uploaded-test/download/a22d4e74-a949-43a4-8397-ab76bdf9a9a4.png'/></body></html>"
    }
    it('should ok', (done) => {
      const opts = Object.assign({}, options);
      opts.headers['Accept'] = 'text/plain; charset=utf-8'
      apigw.post(opts, (err, res)=>{
        res.should.have.status(200);
        res.body.should.startWith('https://stage-temp.s3.cn-northwest-1.amazonaws.com.cn');
        apigw.getfile(res.body, 's3.pdf', {}, (err, res)=>{
          done(err);
        });
      });
    });

    it('should accept application/pdf', (done) => {
      const opts = Object.assign({}, options);
      opts.headers['Accept'] = 'application/pdf';
      apigw.post(opts, (err, res)=>{
        res.should.have.status(200);
        fs.writeFileSync('test.pdf', res.body, {encoding: 'base64'});
        done();
      });
    });

    it('should accept application/pdf up to 10M', (done) => {
      const opts = Object.assign({}, options);
      opts.headers['Accept'] = '*';
      opts.body = "<!DOCTYPE html><html><head><style>img {margin: 5% 0;max-width: 100%;max-height: 100%;}</style></head><body><img src='https://stage.qingniu-chain.com/api/v1/Clouds/uploaded-test/download/45103d92-6726-43f1-856b-bce74573a449.jpg'/></body></html>"
      apigw.post(opts, (err, res)=>{
        res.should.have.status(200);
        res.body.should.startWith('https://stage-temp.s3.cn-northwest-1.amazonaws.com.cn');
        apigw.getfile(res.body, 's3to10m.pdf', {}, (err, res)=>{
          done(err);
        });
      });
    });
  });
});