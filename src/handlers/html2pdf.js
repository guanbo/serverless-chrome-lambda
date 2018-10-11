import log from '../utils/log'
import { makePrintOptions, renderFromHtml } from '../chrome/pdf'

process.env.LOGGING=true

export default async function html2pdf(event, context, callback) {
  const queryStringParameters = event.queryStringParameters || {}
  const {
    url = 'https://github.com/guanbo',
    ...printParameters
  } = queryStringParameters
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

  // TODO: handle cases where the response is > 10MB
  // with saving to S3 or something since API Gateway has a body limit of 10MB
  return {
    statusCode: 200,
    body: data,
    isBase64Encoded: true,
    headers: {
      'Content-Type': 'application/pdf',
    },
  }
}