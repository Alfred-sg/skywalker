import Context from './Context';
import TaskWalker from './TaskWalker';
import { Task } from '../types';

class SkyWalker {
  context: any;
  plugins: { [name: string]: Task };

  constructor(){
    this.context = new Context();
    this.context.apis = {
      registerPlugin: this.registerPlugin,
    };
  }

  registerPlugin(name: string, plugin: Task){
    this.plugins[name] = plugin;
  }

  doCheck(){
    return new TaskWalker(this.context.stages.map(stage => {
      const plugin = this.plugins[stage.name];
      return plugin.check;
    })).run(this.context);
  }

  doTasks(){
    return new TaskWalker(this.context.stages.map(stage => {
      const plugin = this.plugins[stage.name];
      return plugin.run;
    })).run(this.context);
  }
}

export default SkyWalker;
