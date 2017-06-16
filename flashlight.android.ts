import { FlashLightCommon } from './flashlight.common';
import { device } from 'platform';
import { android as androidApplication } from 'application';

export class FlashLight extends FlashLightCommon {
    private camera: any;
    private appContext: any;
    private cameraManager: any;
    private parameters: any;

    private static instance: FlashLight = new FlashLight();

    private get hasCamera2API(): boolean {
        let sdkVersion: string = device.sdkVersion.replace('(ios)', '').replace('android', '');
        return parseInt(sdkVersion) > 20;
    }

    public constructor() {
        super();
        if(FlashLight.instance) {
            throw new Error('Error: Instance failed: Use FlashLight.getInstance() instead of new.');
        }

        this.init();
        FlashLight.instance = this;
    }

    static getInstance() {
        return FlashLight.instance;
    }

    public isAvailable(): boolean {
        var packageManager = androidApplication.currentContext.getPackageManager();
        return packageManager.hasSystemFeature(android.content.pm.PackageManager.FEATURE_CAMERA_FLASH);
    }

    public on(arg: any): void {
        this.checkAvailability();

        if (this.hasCamera2API) {
            this.cameraManager.setTorchMode(this.camera, true);
        } else {
            this.parameters.setFlashMode(this.camera.Parameters.FLASH_MODE_TORCH);
            this.camera.setParameters(this.parameters);
        }
    }

    public off(): void {
        if (this.hasCamera2API) {
            this.cameraManager.setTorchMode(this.camera, false);
        } else {
            this.parameters.setFlashMode(this.camera.Parameters.FLASH_MODE_OFF);
            this.camera.setParameters(this.parameters);
            this.camera.stopPreview();
            this.camera.release();
        }
    }

    private init(): void {
        if (this.hasCamera2API && !this.cameraManager) {
            this.appContext = androidApplication.context;
            this.cameraManager = this.appContext.getSystemService((<any>android.content.Context).CAMERA_SERVICE);
            this.camera = this.cameraManager.getCameraIdList()[0];
        } else if(!this.camera) {
            this.camera = android.hardware.Camera.open(0);
            this.parameters = this.camera.getParameters();
        }
    }
}
