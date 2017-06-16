import { FlashLightCommon } from './flashlight.common';
export declare class FlashLight extends FlashLightCommon {
    private camera;
    private appContext;
    private cameraManager;
    private parameters;
    private static instance;
    private readonly hasCamera2API;
    constructor();
    static getInstance(): FlashLight;
    isAvailable(): boolean;
    on(arg: any): void;
    off(): void;
    private init();
}
