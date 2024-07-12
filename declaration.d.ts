declare module 'react-excel-renderer';
declare module 'react-file-viewer';
declare module 'react-json-viewer';
declare module '*.module.css';
declare module '@emotion/react';
declare module 'human-crypto-keys';
declare module 'secrets.js';
declare module 'multer';
declare module 'formidable';
declare module 'pdf-parse';
declare module 'file-saver';
declare module 'mp3-duration';
declare module 'bcrypt';
declare module 'validator';
declare module 'useragent';
declare module 'react-icons/fi';
declare module '@mind-elixir/export-xmind';
declare module 'mind-elixir-react';
declare module '@mind-elixir/node-menu';

// ppt2svg.d.ts

declare class Ppt2Svg {
    constructor(svgId: string, svgWidth: number, svgHeight: number);
    drawPptx(pptxObj: any, pageIdx: number): void;
    svgNode(): SVGSVGElement;
    resetSize(svgWidth: number, svgHeight: number): void;
    setMode(mode: string): string;
    // 添加其他方法和属性的声明
}

declare const d3: {
    select: (selector: string | Element) => D3Element;
};

declare class D3Element {
    attr(key: string, value?: string | number): string | D3Element;
    style(key: string, value?: string | number): string | D3Element;
    text(value?: string): string | D3Element;
    append(tag: string): D3Element;
    node(): Element;
    html(value?: string): string | D3Element;
}

// ppt2canvas.d.ts

declare class Ppt2Canvas {
    constructor(canvas: string | HTMLCanvasElement, imageCrossOrigin?: string);
    drawPptx(pptxObj: any, pageIdx: number): Promise<void>;
    getCanvas(): HTMLCanvasElement;
    resetSize(width: number, height: number): void;
    setTemplateHandle(templateHandle: (type: string, obj: any, ctx: CanvasRenderingContext2D) => Promise<void>): void;
    // 添加其他方法和属性的声明
}

interface Window {
    Ppt2Svg: class;
    geometryPaths(property: unknown): void;
}
  

