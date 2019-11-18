const { fork } = require('child_process');
const { join } = require('path');

const SCRIPT = join(__dirname, '../bin/index.js');

function run(opts = {}) {
  const { cwd } = opts;
  return new Promise(resolve => {
    const child = fork(SCRIPT, {
      cwd: cwd,
      env: {
        ...process.env
      },
    });
    child.on('message', args => {
      if (args.type === 'DONE') {
        resolve(child);
      }
    });
  });
};

run({ cwd: join(__dirname, '../example') })
.then(() => {
  console.log('All dev servers are started.');
})
.catch(e => {
  console.log(e);
});