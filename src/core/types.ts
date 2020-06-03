import Context from './Context';

export interface Branch {
  current?: boolean,
  name: string,
  env?: string,
  version?: string,
};

export type Env = 'dev' | 'test' | 'pre' | 'prod';

export type NpmClient = 'npm' | 'cnpm' | 'tnpm' | 'yarn';

export interface ContextOptions {
  env?: Env;
  cwd?: string;
  configFileName?: string;
  strategy?: string;
  npmClient?: NpmClient;
};

export type Task = ((ctx: Context, options?: any) => any) | 
  ((ctx: Context, options?: any) => Promise<any>);
