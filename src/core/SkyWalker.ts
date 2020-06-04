import Context from './Context';
import TaskWalker from './TaskWalker';
import buildPlugin from '../plugins/build';
import ossPlugin from '../plugins/oss';
import dingtalkPlugin from '../plugins/dingtalk';
import tagPlugin from '../plugins/tag';
import { Task } from './types';

class SkyWalker {
  context: Context;
  plugins: Map<string, Task> = new Map();

  constructor(){
    this.context = new Context();
    this.context.apis = {
      registerPlugin: this.registerPlugin,
    };

    this.registerPlugin('build', buildPlugin);
    this.registerPlugin('oss', ossPlugin);
    this.registerPlugin('dingtalk', dingtalkPlugin);
    this.registerPlugin('tag', tagPlugin);
  }

  registerPlugin(name: string, plugin: Task){
    if (plugin && typeof name == 'string'){
      this.plugins.set(name, plugin);
    } else if (typeof name != 'string'){
      this.plugins.set(plugin.name, plugin);
    };
  }

  applyPlugin(name: string, options?: any){
    const plugin = this.plugins.get(name);
    if (!plugin) throw new Error(`plugin ${name} has not registered`);
    return plugin(this.context, options);
  }

  run(){
    const tasks = this.context.stages.map((stage: any) => {
      return this.applyPlugin(stage.name, stage.options);
    });
    return new TaskWalker(tasks, this.onSuccess, this.onFail).run(this.context);
  }

  onSuccess(){
    return this.send();
  }

  onFail(err: any){
    return this.send(err);
  }

  private send(data?: any){
    this.applyPlugin('dingtalk', data);
  }
}

export default SkyWalker;
