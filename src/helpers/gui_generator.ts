import { Button, Grid, Image, ImageBasedSlider, Rectangle, StackPanel, TextBlock } from "babylonjs-gui";
import { changeControlFont } from "./utils";

export async function rectangle(
    name: string,
    width: number,
    height: number,
    thickness: number,
    bgColor: string
): Promise<Rectangle> {
    const rectangle = new Rectangle(name);

    rectangle.width = width;
    rectangle.height = height;
    rectangle.thickness = thickness;
    rectangle.background = bgColor;

    return rectangle;
}

export async function simpleButton(
    name: string,
    text: string,
    fontSizePercentage: number,
    height: number,
    top: number,
    verticalAlign: number,
    disableObservable: boolean = false
): Promise<Button> {
    const btn = Button.CreateSimpleButton(name, text);

    btn.color = "white";
    changeControlFont('14px bongkar', btn);

    btn.height = height;
    btn.fontSizeInPixels = ((window.innerHeight + window.innerWidth) / 2) * fontSizePercentage;
    btn.thickness = 0;

    btn.top = top;

    btn.verticalAlignment = verticalAlign;

    if (!disableObservable) {
        btn.onPointerEnterObservable.add(() => {
            btn.color = "yellow";
        });

        btn.onPointerOutObservable.add(() => {
            btn.color = "white";
        });
    }

    return btn;
}

export async function image(
    name: string,
    textureUrl: string,
    width: number,
    height: number,
    top: number,
    left: number,
    horizontalAlignment: number,
    verticalAlign: number
): Promise<Image> {
    const image = new Image(name, textureUrl);

    image.width = width;
    image.height = height;
    image.top = top;
    image.left = left;

    image.stretch = Image.STRETCH_UNIFORM;

    image.horizontalAlignment = horizontalAlignment;
    image.verticalAlignment = verticalAlign;

    return image;
}

export async function imageButton(
    name: string,
    text: string,
    spriteUrl: string,
    fontSizePercentage: number,
    height: number,
    top: number,
    verticalAlign: number
): Promise<Button> {
    const btn = Button.CreateImageButton(name, text, spriteUrl);

    btn.color = "white";
    btn.background = "#9DC9B5";
    changeControlFont('14px bongkar', btn);

    btn.height = height;
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

export async function simpleSlider(
    name: string,
    text: string,
    defaultVol: number,
    grid: Grid,
    row: number,
    fontSizePercentage: number
): Promise<ImageBasedSlider> {
    const header = new TextBlock(name, text);
    header.color = "white";
    changeControlFont('14px bongkar', header);
    header.fontSizeInPixels = ((window.innerHeight + window.innerWidth) / 2) * fontSizePercentage * 0.4;
    header.textWrapping = true;
    grid.addControl(header, row, 0);

    const panel = new StackPanel();
    panel.width = window.innerWidth / 2 + "px";
    grid.addControl(panel, row, 1);

    const slider = new ImageBasedSlider(`${name}-slider`);
    slider.minimum = 0;
    slider.maximum = 100;
    slider.height = "50px";
    slider.width = window.innerWidth / 2 + "px";
    slider.backgroundImage = new Image(`${name}-slider-background`, "assets/textures/UI/backgroundImage.png");
    slider.backgroundImage.stretch = Image.STRETCH_EXTEND;
    slider.valueBarImage = new Image(`${name}-slider-valubar`, "assets/textures/UI/valueImage.png");
    slider.valueBarImage.stretch - Image.STRETCH_EXTEND;
    slider.value = defaultVol;

    panel.addControl(slider);

    return slider;
}