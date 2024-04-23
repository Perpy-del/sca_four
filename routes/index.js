import express from 'express';
import https from 'node:https';
import { writeFile } from 'node:fs';
import { Buffer } from 'node:buffer';
import * as os from 'node:os';

const router = express.Router();

function formatTime(seconds) {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const remainingSeconds = seconds % 3600;

  return `${days} days ${hours} hours ${remainingSeconds} seconds`;
}

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });

  https
    .get('https://en.wikipedia.org/wiki/Tunde_Onakoya', response => {
      console.log('statusCode:', response.statusCode);
      console.log('headers:', response.headers);

      response.on('data', data => {
        // process.stdout.write(data);
        writeFile('public/tunde.html', data, err => {
          if (err) throw err;
        });
      });
    })
    .on('complete', () => {
      console.log('The file has been saved!');
    })
    .on('error', error => {
      console.log(error);
    })
    .on('close', () => {
      console.log('Connection has been closed!');
    });

  const architecture = os.arch();
  // const data = new Uint8Array(Buffer.from(architecture));
  const seconds = os.uptime();
  const exactTime = formatTime(seconds);
  const home = os.homedir();
  try {
    writeFile('public/arch.md', `The system architecture is ${architecture}, the system uptime is: ${exactTime} and the string path of the current user's home directory is ${home}`, (err) => {
      if (err) throw err;
      console.log('The os architecture markdown file has been saved!');
    });
  } catch (error) {
    console.error('An error occurred: ', error);
  }
});

export default router;
