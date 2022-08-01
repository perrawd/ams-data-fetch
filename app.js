import axios from 'axios'

/**
 * Fetches data from specified API.
 *
 * @param {string} url The URL to fetch the data from.
 * @returns {object} Response object.
 */
 async function fetchData (url) {
  const response = await axios(url)
  return response.data.hits
}

/**
 * Variables for API calls.
 */
const languages = ['javascript', 'typescript']
const years = ['2017', '2018', '2019', '2020', '2021']
const quarterStart = ['-01-01', '-04-01', '-07-01', '-10-01']
const quarterEnd = ['-03-31', '-06-30', '-09-30', '-12-31']
const results = {}

/**
 * Make API calls.
 */
// Loop each language.
for (const language of languages) {
  results[language] = {}
  // Loop each year.
  for (const year of years) {
    results[language][String(year)] = 0
    // Loop each quarter.
    for (let quarter = 0; quarter < quarterEnd.length; quarter++) {
      // Data container.
      const data = []

      // Variables for API pagination.
      let pages = true
      let count = 0
      let offset = 0

      while (pages) {
        // Fetch data.
        const url = `${process.env.API_URL}/search?q=${language}&historical-from=${year}${quarterStart[quarter]}&historical-to=${year}${quarterEnd[quarter]}&limit=100&offset=${offset}&resdet=brief`
        const response = await fetchData(url)

        data.push(...response)

        // Increment count for next page.
        count++
        offset = (count * 100) + 1

        // If page contains less than 100 results, stop current iteration.
        if (response.length < 100) pages = false

        results[language][String(year)] += response.length
        console.log(`${response.length} documents in page ${count}, ${year} has been fetched. `)
      }
    }
    console.log(`Year: ${year} completed`)
  }
}

console.log('Script completed.')
console.log(results)
