'use strict';

const AWS = require('aws-sdk');
const url = require('url');
const request = require('request');
const fs = require('fs');

class APIGatewayService {
  constructor(options={}) {
    this.accessKeyId = options.accessKeyId || process.env.AWS_ACCESS_KEY_ID;
    this.secretAccessKey = options.secretAccessKey || process.env.AWS_SECRET_ACCESS_KEY;
    this._options = {
      aws: {
        key: this.accessKeyId, 
        secret: this.secretAccessKey, 
        sign_version: 4, 
        service: 'execute-api'
      },
    };
  }

  get(uri, options={}, cb) {
    Object.assign(options, this._options);
    request.get(uri, options, cb);
  }

  post(uri, options={}, cb) {
    Object.assign(options, this._options);
    request.post(uri, options, cb);
  }

  put(uri , options={}, cb) {
    Object.assign(options, this._options);
    request.put(uri, options, cb);
  }

  del(uri, options={}, cb) {
    Object.assign(options, this._options);
    request.delete(uri, options, cb);
  }

  download(uri, filepath, options={}, cb) {
    // Object.assign(options, this._options);
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