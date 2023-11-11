import 'reflect-metadata';

export const  WHEAT = 'wheat'

export function Wheat(){
  return function (target: Function){

    Reflect.defineMetadata(WHEAT, true, target);
  }
}