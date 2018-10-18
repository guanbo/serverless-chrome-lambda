'use strict';

const AWS = require('aws-sdk');
const url = require('url');
const request = require('request');
const fs = require('fs');

class APIGatewayService {
  constructor(options={}) {
    this.region = options.region || process.env.AWS_REGION;
    this.accessKeyId = options.accessKeyId || process.env.AWS_ACCESS_KEY_ID;
    this.secretAccessKey = options.secretAccessKey || process.env.AWS_SECRET_ACCESS_KEY;
    let creds = new AWS.Credentials(this.accessKeyId, this.secretAccessKey);
    AWS.config.update({
      region: this.region,
      credentials: creds
    });
  }

  get(uri, cb) {
    AWS.config.credentials.get(err=>{
      if (err) throw err;

      const _url = url.parse(uri)
      const req = new AWS.HttpRequest(uri, this.region);
      req.method = 'GET';
      req.headers.host = _url.hostname;
      req.headers['Content-Type'] = 'application/json';

      let v4signer = new AWS.Signers.V4(req, 'execute-api', true);
      v4signer.addAuthorization(AWS.config.credentials, AWS.util.date.getDate());
      request.get(uri, {headers: req.headers, json: true, encoding: null}, cb);
    });
  }

  post(options, cb) {
    AWS.config.credentials.get(err=>{
      if (err) throw err;

      const _url = url.parse(options.uri)
      const req = new AWS.HttpRequest(options.uri, this.region);
      req.method = 'POST';
      req.headers = Object.assign(req.headers, options.headers);
      req.headers.host = _url.hostname;
      req.body = options.body;
      req.headers['Content-Length'] = req.body.length;

      let v4signer = new AWS.Signers.V4(req, 'execute-api', true);
      v4signer.addAuthorization(AWS.config.credentials, AWS.util.date.getDate());
      let encoding = req.headers['Accept'] === 'application/pdf'?null:'utf8';
      request.post(options.uri, {headers: req.headers, body: req.body, encoding: encoding}, cb);
    });
  }

  download(uri, filepath, cb) {
    AWS.config.credentials.get(err=>{
      if (err) throw err;

      const _url = url.parse(uri)
      const req = new AWS.HttpRequest(uri, this.region);
      req.method = 'GET';
      req.headers.host = _url.hostname;

      let v4signer = new AWS.Signers.V4(req, 'execute-api', true);
      v4signer.addAuthorization(AWS.config.credentials, AWS.util.date.getDate());
      this.getfile(uri, filepath, {headers: req.headers}, cb);
    });
  }

  getfile(uri, filepath, options, cb) {
    let r = request.get(uri, options);
    r.pause();
    r.on('response', (res)=>{
      if(res.statusCode === 200) {
        let fstream = fs.createWriteStream(filepath);
        fstream.on('finish', ()=>cb(null, r.response));
        r.pipe(fstream);
        r.resume();
      } else {
        cb(res.body, res);
      }
    });
    r.on('error', function (err) {
      cb(err, r.response);
    });
  }
}

module.exports = APIGatewayService;