import { Button } from "babylonjs-gui";
import { changeControlFont } from "./utils";

export async function simpleButton(name: string, text: string, fontSizePercentage: number, height: number, width: number, top: number, verticalAlign: number): Promise<Button> {
    const btn = Button.CreateSimpleButton(name, text);

    btn.color = "white";
    changeControlFont('14px bongkar', btn);

    btn.height = height;
    btn.width = width;
    btn.fontSizeInPixels = ((window.innerHeight + window.innerWidth) / 2) * fontSizePercentage;
    btn.thickness = 0;

    btn.top = top;

    btn.verticalAlignment = verticalAlign;

    btn.onPointerEnterObservable.add(() => {
        btn.color = "yellow";
    });

    btn.onPointerOutObservable.add(() => {
        btn.color = "white";
    });

    return btn;
}