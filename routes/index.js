import express from 'express';
import https from 'node:https';
import { writeFile } from 'node:fs';
import { Buffer } from 'node:buffer';
import * as os from 'node:os';

const router = express.Router();

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
          console.log('The file has been saved!');
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
  const data = new Uint8Array(Buffer.from(architecture));
  writeFile('arch.md', data, (err) => {
    if (err) throw err;
    console.log('The os architecture markdown file has been saved!');
  }); 
});

export default router;
