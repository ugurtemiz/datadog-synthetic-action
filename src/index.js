import { getInput, setFailed } from '@actions/core'
import { HttpClient } from '@actions/http-client'

function getClient (apiKey, applicationKey) {
  const header = {
    headers: {
      'DD-API-KEY': apiKey,
      'Content-Type': 'application/json',
    },
  }

  if (applicationKey)
    header.headers['DD-APPLICATION-KEY'] = applicationKey

  return new HttpClient('dd-http-client', [], header)
}

async function getAllTests (http, apiURL) {
  const res = await http.get(
    `${ apiURL }/api/v1/synthetics/test`,
  )

  if (
    res.message.statusCode === undefined
    || res.message.statusCode >= 400
  )
    throw new Error(`HTTP request failed: ${ res.message.statusMessage }`)

  const body = await res.readBody()
  return JSON.parse(body)
}

async function setNewStatus (http, apiURL, newStatus, id) {
  const res = await http.put(
    `${ apiURL }/api/v1/synthetics/tests/${ id }/status`,
    `{"new_status": "${ newStatus }"}`,
  )

  if (
    res.message.statusCode === undefined
  || res.message.statusCode >= 400
  )
    throw new Error(`HTTP request failed: ${ res.message.statusMessage }`)
}

async function run () {
  try {
    const apiKey = getInput('datadog-api-key')
    const applicationKey = getInput('datadog-application-key')
    const apiURL = getInput('api-url')
    const newStatus = getInput('new-status')
    const tags = getInput('tags') ? getInput('tags').split(',') : []
    let publicIDs = getInput('public-ids') ? getInput('public-ids').split(',') : []

    if (!publicIDs.length && !tags.length)
      throw new Error('At least public-ids or tags should be fileed as parameter.')

    const http = getClient(apiKey, applicationKey)

    if (tags.length) {
      const body = await getAllTests(http, apiURL)
      const filteredTests = body.tests.filter(test => tags.every(i => test.tags.includes(i)))
      publicIDs = filteredTests.map(test => test.public_id)
      console.log(`Public IDs: ${ publicIDs }`)
    }

    for (const id of publicIDs)
      setNewStatus(http, apiURL, newStatus, id)


  } catch (error) {
    setFailed(error.message)
  }
}

run()
