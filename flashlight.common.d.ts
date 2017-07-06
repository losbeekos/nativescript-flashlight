export declare abstract class FlashLightCommon {
    isOn: boolean;
    toggle(arg: any): void;
    protected checkAvailability(): void;
    abstract on(arg: any): void;
    abstract off(): void;
    abstract isAvailable(): boolean;
}
