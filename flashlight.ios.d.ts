import { FlashLightCommon } from './flashlight.common';
export declare class FlashLight extends FlashLightCommon {
    private static instance;
    constructor();
    static getInstance(): FlashLight;
    isAvailable(): boolean;
    on(arg: any): void;
    off(): void;
}
