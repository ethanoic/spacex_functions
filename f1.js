var args = process.argv.slice(2)

const launchpadId = args[0]

const fetch = require("node-fetch");
const fs = require('fs');

const function1 = {}

const url_one_launchpad = 'https://api.spacexdata.com/v4/launchpads/';
const url_launches = 'https://api.spacexdata.com/v4/launches/query';

const getLaunchpadById = async (id) => {

  const url = `${url_one_launchpad}${id}`
  const response = await fetch(url);
  const json = await response.json();

  return json;
};

const getFailedLaunchesByLaunchpadId = async (launchpadId) => {
  const url = `${url_launches}`
  const response = await fetch(url, {
    method: 'post',
    body: JSON.stringify({
      query: {  
        launchpad: launchpadId,
        failures: { "$not": { "$size": 0 } }
      },
      options: {
        select: {
          name: 1,
          failures: 1
        },
        sort: {
          date_utc: "desc"
        }
      }
    }),
    headers: { 
      'Content-Type': 'application/json' 
    },
  });
  const json = await response.json();

  return json.docs.map((item) => {
    return {
      name: item.name,
      failures: item.failures.map((failure)=>{
        return failure.reason
      })
    }
  });

};

function1.get = async (launchpadId) => {
  let launchpadResult = await getLaunchpadById(launchpadId);
  let result = {}
  result.launchpad = launchpadResult.name;
  
  let failuresResult = await getFailedLaunchesByLaunchpadId(launchpadId);
  result.all_failures = failuresResult;
  return result;
}

const get_and_save = async (launchpadId) => {
  let result = await function1.get(launchpadId)
  fs.writeFileSync('f1.json', JSON.stringify(result), null, 4);
}

var re = /[0-9A-Fa-f]{6}/g

if (launchpadId && re.test(launchpadId)) {
  console.log(`launchpadId ${launchpadId}`)
  get_and_save(launchpadId);
}

module.exports = function1;