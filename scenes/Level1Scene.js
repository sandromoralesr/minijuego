import { BaseLevelScene } from './BaseLevelScene.js';
import { LEVELS } from '../data/levels.js';

export class Level1Scene extends BaseLevelScene {
  constructor() {
    super('level1', LEVELS.level1, 1);
  }
}