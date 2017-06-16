"use strict";
var flashlight_common_1 = require("./flashlight.common");
var platform_1 = require("platform");
var application_1 = require("application");
var FlashLight = (function (_super) {
    __extends(FlashLight, _super);
    function FlashLight() {
        var _this = _super.call(this) || this;
        if (FlashLight.instance) {
            throw new Error('Error: Instance failed: Use FlashLight.getInstance() instead of new.');
        }
        _this.init();
        FlashLight.instance = _this;
        return _this;
    }
    Object.defineProperty(FlashLight.prototype, "hasCamera2API", {
        get: function () {
            var sdkVersion = platform_1.device.sdkVersion.replace('(ios)', '').replace('android', '');
            return parseInt(sdkVersion) > 20;
        },
        enumerable: true,
        configurable: true
    });
    FlashLight.getInstance = function () {
        return FlashLight.instance;
    };
    FlashLight.prototype.isAvailable = function () {
        var packageManager = application_1.android.currentContext.getPackageManager();
        return packageManager.hasSystemFeature(android.content.pm.PackageManager.FEATURE_CAMERA_FLASH);
    };
    FlashLight.prototype.on = function (arg) {
        this.checkAvailability();
        if (this.hasCamera2API) {
            this.cameraManager.setTorchMode(this.camera, true);
        }
        else {
            this.parameters.setFlashMode(this.camera.Parameters.FLASH_MODE_TORCH);
            this.camera.setParameters(this.parameters);
        }
    };
    FlashLight.prototype.off = function () {
        if (this.hasCamera2API) {
            this.cameraManager.setTorchMode(this.camera, false);
        }
        else {
            this.parameters.setFlashMode(this.camera.Parameters.FLASH_MODE_OFF);
            this.camera.setParameters(this.parameters);
            this.camera.stopPreview();
            this.camera.release();
        }
    };
    FlashLight.prototype.init = function () {
        if (this.hasCamera2API && !this.cameraManager) {
            this.appContext = application_1.android.context;
            this.cameraManager = this.appContext.getSystemService(android.content.Context.CAMERA_SERVICE);
            this.camera = this.cameraManager.getCameraIdList()[0];
        }
        else if (!this.camera) {
            this.camera = android.hardware.Camera.open(0);
            this.parameters = this.camera.getParameters();
        }
    };
    return FlashLight;
}(flashlight_common_1.FlashLightCommon));
FlashLight.instance = new FlashLight();
exports.FlashLight = FlashLight;
//# sourceMappingURL=flashlight.android.js.map