import { BaseLevelScene } from './BaseLevelScene.js';
import { LEVELS } from '../data/levels.js';

export class Level4Scene extends BaseLevelScene {
  constructor() {
    super('level4', LEVELS.level4, 4);
  }
}