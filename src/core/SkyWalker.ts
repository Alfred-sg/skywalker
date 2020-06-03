import Context from './Context';
import TaskWalker from './TaskWalker';
import buildPlugin from './buildinPlugins/build';
import ossPlugin from './buildinPlugins/oss';
import { Task } from './types';

class SkyWalker {
  context: Context;
  plugins: { [name: string]: Task };

  constructor(){
    this.context = new Context();
    this.context.apis = {
      registerPlugin: this.registerPlugin,
    };

    this.registerPlugin('build', buildPlugin);
    this.registerPlugin('oss', ossPlugin);
  }

  registerPlugin(name: string, plugin: Task){
    if (plugin && typeof name == 'string'){
      this.plugins[name] = plugin;
    } else if (typeof name != 'string'){
      this.plugins[plugin.name] = plugin;
    };
  }

  run(){
    return new TaskWalker(this.context.stages.map(stage => {
      const plugin = this.plugins[stage.name];
      return plugin.run;
    })).run(this.context);
  }
}

export default SkyWalker;
