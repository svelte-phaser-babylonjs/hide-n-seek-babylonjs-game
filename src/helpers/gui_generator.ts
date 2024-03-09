import { Button, TextBlock } from "babylonjs-gui";
import { changeControlFont } from "./utils";

export async function simpleButton(name: string, text: string, FONT_SIZE_PERCENTAGE: number, height: number, top: number, verticalAlign: number): Promise<Button> {
    const btn = Button.CreateSimpleButton(name, text);

    btn.color = "white";
    changeControlFont('14px bongkar', btn);

    btn.height = height;
    btn.fontSizeInPixels = ((window.innerHeight + window.innerWidth) / 2) * FONT_SIZE_PERCENTAGE;
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

export async function imageButton(name: string, text: string, spriteUrl: string, FONT_SIZE_PERCENTAGE: number, height: number, top: number, verticalAlign: number): Promise<Button> {
    const btn = Button.CreateImageButton(name, text, spriteUrl);

    btn.color = "white";
    btn.background = "#9DC9B5";
    changeControlFont('14px bongkar', btn);

    btn.height = height;
    btn.fontSizeInPixels = ((window.innerHeight + window.innerWidth) / 2) * FONT_SIZE_PERCENTAGE;
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

export async function simpleTextBlock(
    name: string,
    text: string,
    color: string,
    fontSize: number,
    height: number,
    top: number,
    verticalAlign: number
): Promise<TextBlock> {
    const textBlock = new TextBlock(name, text);

    textBlock.color = color;
    changeControlFont('14px bongkar', textBlock);

    textBlock.fontSizeInPixels = ((window.innerWidth + window.innerHeight) / 2) * fontSize;
    textBlock.height = height;
    textBlock.top = top;
    textBlock.verticalAlignment = verticalAlign;

    return textBlock;
}