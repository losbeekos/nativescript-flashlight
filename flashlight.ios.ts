import { FlashLightCommon } from './flashlight.common';
var device = AVCaptureDevice.defaultDeviceWithMediaType(AVMediaTypeVideo);

export class FlashLight extends FlashLightCommon {
	private static instance: FlashLight = new FlashLight();

	public constructor() {
		super();
		if(FlashLight.instance) {
			throw new Error('Error: Instance failed: Use FlashLight.getInstance() instead of new.');
		}

		FlashLight.instance = this;
	}

	static getInstance() {
		return FlashLight.instance;
	}

	public isAvailable(): boolean {
		return !!device;
	}

	public on(arg: any): void {
		this.checkAvailability();

		var intensity = AVCaptureMaxAvailableTorchLevel;
		if (arg && arg.intensity) {
			var requestedIntensity = arg.intensity;
			if (requestedIntensity > 0.0 && requestedIntensity < 1.0) {
				intensity = requestedIntensity;
			}
		}

		device.lockForConfiguration();
		device.setTorchModeOnWithLevelError(intensity);
		device.unlockForConfiguration();
	}

	public off(): void {
		device.lockForConfiguration();
		device.torchMode = AVCaptureTorchMode.Off;
		device.unlockForConfiguration();
	}
}
