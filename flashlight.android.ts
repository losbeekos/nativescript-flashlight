import { FlashLightCommon } from './flashlight.common';
import { device } from 'platform';
import { android as androidApplication } from 'application';
import { isNullOrUndefined } from 'utils/types';

export class FlashLight extends FlashLightCommon {
    private camera: any;
    private appContext: any;
    private cameraManager: any;
    private parameters: any;

    private static instance: FlashLight;

    private get hasCamera2API(): boolean {
        let sdkVersion: string = device.sdkVersion.replace('(ios)', '').replace('android', '');
        return parseInt(sdkVersion) > 22;
    }

    public constructor() {
        super();
        if(!isNullOrUndefined(FlashLight.instance)) {
            throw new Error('Error: Instance failed: Use FlashLight.getInstance() instead of new.');
        }

        this.init();
        FlashLight.instance = this;
    }

    static getInstance() {
        if(isNullOrUndefined(FlashLight.instance)) {
            FlashLight.instance = new FlashLight();
        }
        return FlashLight.instance;
    }

    public isAvailable(): boolean {
        var packageManager = androidApplication.currentContext.getPackageManager();
        return packageManager.hasSystemFeature(android.content.pm.PackageManager.FEATURE_CAMERA_FLASH);
    }

    public on(arg: any): void {
        this.checkAvailability();

        if (this.hasCamera2API === true) {
            this.cameraManager.setTorchMode(this.camera, true);
        } else {
            this.parameters.setFlashMode(this.camera.Parameters.FLASH_MODE_TORCH);
            this.camera.setParameters(this.parameters);
        }
        this.isOn = true;
    }

    public off(): void {
        if (this.hasCamera2API === true) {
            this.cameraManager.setTorchMode(this.camera, false);
        } else {
            this.parameters.setFlashMode(this.camera.Parameters.FLASH_MODE_OFF);
            this.camera.setParameters(this.parameters);
            this.camera.stopPreview();
            this.camera.release();
        }
        this.isOn = false;
    }

    private init(): void {
        if (this.hasCamera2API === true && isNullOrUndefined(this.cameraManager)) {
            if(isNullOrUndefined(androidApplication)) {
                console.error('androidApplication is not instantiated, please call the init on a later moment');
                return;
            }
            this.appContext = androidApplication.context;
            this.cameraManager = this.appContext.getSystemService((<any>android.content.Context).CAMERA_SERVICE);
            this.camera = this.cameraManager.getCameraIdList()[0];
        } else if(isNullOrUndefined(this.camera)) {
            try {
                this.camera = android.hardware.Camera.open(0);
                this.parameters = this.camera.getParameters();
            } catch (exception) {
                console.error("camera exception", exception);
            }
        }
    }
}
