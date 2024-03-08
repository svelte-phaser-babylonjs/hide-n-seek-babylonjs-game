import { Control } from "babylonjs-gui";

export const useFont = (fontStyleName: string, control: Control) => {
    document.fonts.load(fontStyleName).then(() => {  // start loading font
        document.fonts.ready.then(() => {
            console.log('Fonts Ready');  // all fonts is ready
            control.fontFamily = fontStyleName.split(' ')[1];
        });
    });
}