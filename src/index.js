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

async function run () {
  try {
    const apiKey = getInput('datadog-api-key')
    const applicationKey = getInput('datadog-application-key')
    const apiURL = getInput('api-url')
    const publicIDs = getInput('public-ids') ? getInput('public-ids').split(',') : []
    const tags = getInput('tags') ? getInput('tags').split(',') : []
    // const newStatus = getInput('new-status')

    if (!publicIDs.length && !tags.length)
      throw new Error('At least public-ids or tags should be fileed as parameter.')

    const http = getClient(apiKey, applicationKey)

    if (tags.length) {
      const res = await http.get(
        `${ apiURL }/api/v1/synthetics/tests`,
      )

      if (
        res.message.statusCode === undefined
				|| res.message.statusCode >= 400
      )
        throw new Error(`HTTP request failed: ${ res.message.statusMessage }`)

      const body = await res.readBody()
      const filteredTests = body.tests.filter(test => tags.every(i => test.tags.includes(i)))
      console.log(filteredTests)
    }

    // for (const id of publicIDs) {
    //   const res = await http.put(
    //     `${ apiURL }/api/v1/synthetics/tests/${ id }/status`,
    //     `{"new_status": "${ newStatus }"}`,
    //   )

    //   if (
    //     res.message.statusCode === undefined
    // 		|| res.message.statusCode >= 400
    //   )
    //     throw new Error(`HTTP request failed: ${ res.message.statusMessage }`)

    // }
  } catch (error) {
    setFailed(error.message)
  }
}

run()
