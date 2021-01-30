import 'dotenv/config';

import Queue from './lib/Queue';

function start() {
  Queue.processQueue();
  console.log('Queue ready!');
}

start();
