export abstract class FlashLightCommon {
	public isOn: boolean = false;

	public toggle(arg: any): void {
		if(this.isOn === false) {
			this.on(arg);
		} else if(this.isOn === true) {
			this.off();
		}
	}

	protected checkAvailability(): void {
		if (!this.isAvailable()) {
			throw new Error("A flashlight is not available on this device. " +
				"Check for availability with isAvailable().");
		}
	}

	public abstract on(arg: any): void;
	public abstract off(): void;
	public abstract isAvailable(): boolean;
}
