import log from '../utils/log'
import { makePrintOptions, renderFromHtml } from '../chrome/pdf'
import AWS from 'aws-sdk'

const S3 = new AWS.S3()
const BUCKET = process.env.BUCKET||'stage-temp'
const ONE_WEEK = 7*24*60*60
const ONE_WEEK_MS = ONE_WEEK*1000
const MAX_BODY_LIMIT = 10*1024*1024

// process.env.LOGGING=true
// process.env.DEBUG=true

export default async function html2pdf(event, context, callback) {
  const queryStringParameters = event.queryStringParameters || {}
  const {
    key = '我是测试文件test.pdf',
    ...printParameters
  } = queryStringParameters
  const acceptType = event.headers&&event.headers['Accept'] || 'text/plain';
  let html = event.body || 'no content'
  const printOptions = makePrintOptions(printParameters)
  let data

  if (event.isBase64Encoded) {
    const buf = Buffer.from(html, 'base64')
    html = buf.toString('utf8')
  }

  log('Processing PDFification for', html, printOptions)

  const startTime = Date.now()

  data = await renderFromHtml(html, printOptions)

  log(`Chromium took ${Date.now() - startTime}ms to load HTML and render PDF.`)

  await S3.putObject({
    Body: Buffer.from(data, 'base64'),
    Bucket: BUCKET,
    ContentType: 'application/pdf',
    Key: key,
    ContentDisposition: `attachment; ${encodeURIComponent(key)}`,
    Expires: new Date(Date.now() + ONE_WEEK_MS) 
  }).promise()

  let signedUrl = await S3.getSignedUrl('getObject', {
    Bucket: BUCKET,
    Key: key,
    Expires: ONE_WEEK
  })

  let result = {
    statusCode: 200,
    body: signedUrl,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  }

  if (/application\/pdf/.test(acceptType)) {
    if (data.length < MAX_BODY_LIMIT) {
      result = {
        statusCode: 200,
        body: data,
        isBase64Encoded: true,
        headers: {
          'Content-Type': 'application/pdf',
        },
      }
    } else {
      result = {
        statusCode: 301,
        body: '',
        headers: {
          'location': signedUrl,
        },
      }
    }
  }

  return result
}