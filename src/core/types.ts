import Context from './Context';

export interface Branch {
  current?: boolean,
  name: string,
  env?: string,
  version?: string,
};

export type Env = 'dev' | 'test' | 'pre' | 'prod';

export interface ContextOptions {
  env?: Env;
  cwd?: string;
  configFileName?: string;
  strategy?: string;
};

export type Task = ((ctx: typeof Context) => void) | ((ctx: typeof Context) => Promise<any>);