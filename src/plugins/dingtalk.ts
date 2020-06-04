import * as chalk from 'chalk';
const ChatBot = require('dingtalk-robot-sender');
import Context from '../core/Context';

/**
 * 发送钉钉消息
 */
export default async (ctx: Context, err: any) => { 
  const { env, gitBranch, appConfig } = ctx;
  if ( !appConfig ) return;
  
  const { 
    accessToken = '', 
    secret = '', 
    getTextContent = undefined,
  } = appConfig.dingtalk || {};

  if (!accessToken || !secret || !getTextContent) return;

  const robot = new ChatBot({
    baseUrl: 'https://oapi.dingtalk.com/robot/send',
    accessToken,
    // @ts-ignore
    secret,
  });

  const textContent = getTextContent({
    env,
    branch: gitBranch,
  }, err);

  if (textContent){
    robot[textContent.msgtype ? 'send' : 'link'](textContent)
      .then((res: { data: any }) => {
        const { data } = res;
        if (data && !!data.errcode){
          console.log(chalk.red(`send dingtalk message failed.\nERROR MESSAGE: ${data.errmsg}`));
        } else {
          console.log(chalk.blue(`send dingtalk message successed.`));
        }
      })
      .catch((err: any) => {
        console.log(chalk.red(`send dingtalk message failed.\nERROR MESSAGE: ${err.message}`));
      });
  };
}
