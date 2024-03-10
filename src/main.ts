import { Game } from './Game';
import './fonts.css';

window.addEventListener('DOMContentLoaded', async () => {
    let canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;

    let app = new Game(canvas, /Android|webOS|iPhone|iPad|iPos|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

    window.addEventListener('resize', () => {
        app.engine.resize();
    });

    await app.run();
});