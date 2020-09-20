const readline = require('readline');
const fetch = require("node-fetch");
const fs = require('fs');
const { exit } = require('process');
var args = process.argv.slice(2)

const f2 = {};

const url_starlink_satelites = 'https://api.spacexdata.com/v4/starlink';

f2.getAllStarlinkSatelites = async () => {
  const response = await fetch(url_starlink_satelites);
  const json = await response.json();
  return json;
};

let starlinkSatelies = [];
let result = [];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const Months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const instruction = 'Enter Year/Month/Date to retrieve (e.g. 2020/05/ will retrieve starlink satelites launched in year 2020, May) \r\nQ and enter to exit'

f2.query = (data, datePattern) => {
  let date_parts = datePattern.split('/')
  let year = date_parts[0]
  let month = date_parts[1]
  let date = date_parts[2]
  
  result = [...data]

  result = result.filter((item) => {
    let launchDateParts = item.spaceTrack.LAUNCH_DATE.split('-');
    return ((launchDateParts[0] === year || year === '') 
      && (launchDateParts[1] === month || month === '')
      && (launchDateParts[2] === date || date === ''));
  });

  return result;
}

if (args.length === 1 && args[0] === 'interactive') {
  console.log('run interactive')
  rl.question('Query Starlink Satelites Launches. Press ENTER to continue', (answer) => {
    let result = f2.getAllStarlinkSatelites()
    console.log('Please wait...')
    result.then((data) => {
      starlinkSatelies = data
      
      console.log(`Data loaded. Number of Starlink Satelites Launched is ${starlinkSatelies.length}`)
      console.log(instruction)
  
      rl.on('line', (input) => {
        if (input.toUpperCase() === 'Q') {
          console.log(`Goodbye`)
          rl.close()
        } else {
          let date_parts = input.split('/')
          let year = date_parts[0]
          let month = date_parts[1]
          let date = date_parts[2]
            
          console.log(`Retrieving starlink satelite launches in ${year !== '' ? 'year ' + year :''} ${month !== '' ? Months[parseInt(month) - 1]:''} ${date !== '' ? date + 'th': ''}`)
  
          if (date_parts.length === 3) {
            result = f2.query(starlinkSatelies, input);
  
            console.log(`Found ${result.length} starlink satelite launches, saving to f2.json`)
  
            fs.writeFileSync('f2.json', JSON.stringify(result), null, 4);
            
            console.log(instruction)
          } else {
            console.log('Invalid Entry')
            console.log(instruction)
          }
  
        }
      });
    })
  });
}

module.exports = f2;