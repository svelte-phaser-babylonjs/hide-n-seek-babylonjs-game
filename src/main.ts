import { HideNSickGameApp as App } from './HideNSickGameApp';
import './fonts.css';

console.log(`main.ts starting ${App.name}`);
window.addEventListener('DOMContentLoaded', () => {
    let canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
    let app = new App(canvas);

    window.addEventListener('resize', () => {
        app.engine.resize();
    });

    app.run();
});