/**
 * 单层数据 merge TODO 多层、target 多个等
 * @param {object} source 
 * @param target 
 * @param keys 
 */
export const merge = <OssOptions>(
  source: OssOptions, 
  target: { [key: string]: any }, 
  keys?: string[]
) => {
  if (!keys) keys = Object.keys(target);
  keys.forEach(key => {
    if (target[key]) source[key] = target[key];
  });

  return source;
};