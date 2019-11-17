import * as shell from 'shelljs';// https://github.com/shelljs/shelljs
import { detect } from './utils/git';
// import { upload } from './utils/oss';

function publish() {
  const branch = detect();
  if (!branch) return;

  // const { env, version } = branch;

  shell.exec('cnpm run build');// cnpm

  // upload('', '');
}

publish();