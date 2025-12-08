import { Jogo } from './scenes/Jogo.js';
import { LostScreen } from './scenes/LostScreen.js';
import { Menu } from './scenes/Menu.js';
import { Start } from './scenes/Start.js';
import { WonScreen } from './scenes/WonScreen.js';

const config = {
    type: Phaser.AUTO,
    title: 'GarbageMan',
    description: '',
    parent: 'game-container',
    width: 1280,
    height: 720,
    backgroundColor: '#000000',
    pixelArt: false,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { y: 0 }
        }
    },
    scene: [
        Start,
        Menu,
        Jogo,
        LostScreen,
        WonScreen
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
}

new Phaser.Game(config);
            