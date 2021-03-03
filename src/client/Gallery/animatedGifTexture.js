var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { BaseTexture } from "@babylonjs/core/Materials/Textures/baseTexture";
import { Constants } from "@babylonjs/core/Engines/constants";
import { PrecisionDate } from "@babylonjs/core/Misc/precisionDate";
import { EffectWrapper, EffectRenderer } from "@babylonjs/core/Materials/effectRenderer";
// Ensures Raw texture are included
import "@babylonjs/core/Engines/Extensions/engine.rawTexture";
// Import our Shader Config
import { AnimatedGifShaderConfiguration } from "./animatedGifTextureShader";
// Gifs external library to parse Gif datas
import { parseGIF, decompressFrames } from "Gifuct-js";
/**
 * This represents an animated Gif textures.
 * Yes... It is truly animating ;-)
 */
var AnimatedGifTexture = /** @class */ (function (_super) {
    __extends(AnimatedGifTexture, _super);
    /**
     * Instantiates an AnimatedGifTexture from the following parameters.
     *
     * @param url The location of the Gif
     * @param engine engine the texture will be used in
     * @param onLoad defines a callback to trigger once all ready.
     */
    function AnimatedGifTexture(url, engine, onLoad) {
        if (onLoad === void 0) { onLoad = null; }
        var _this = _super.call(this, engine) || this;
        _this._frames = null;
        _this._nextFrameIndex = 0;
        _this.name = url;
        _this._onLoad = onLoad;
        _this._createInternalTexture();
        _this._createRenderer();
        _this._createRenderLoopCallback();
        _this._loadGifTexture();
        return _this;
    }
    /**
     * Creates the internal texture used by the engine.
     */
    AnimatedGifTexture.prototype._createInternalTexture = function () {
        this._texture = this._engine.createRawTexture(null, 1, 1, Constants.TEXTUREFORMAT_RGBA, false, false, Constants.TEXTURE_BILINEAR_SAMPLINGMODE, null, Constants.TEXTURETYPE_UNSIGNED_INT);
        // Do not be ready before the data has been loaded
        this._texture.isReady = false;
        // Setups compatibility with gl1
        this.wrapU = Constants.TEXTURE_CLAMP_ADDRESSMODE;
        this.wrapV = Constants.TEXTURE_CLAMP_ADDRESSMODE;
        this.wrapR = Constants.TEXTURE_CLAMP_ADDRESSMODE;
        this.anisotropicFilteringLevel = 1;
    };
    /**
     * Create the renderer resources used to draw the Gif patches in the texture.
     */
    AnimatedGifTexture.prototype._createRenderer = function () {
        // Creates a wrapper around our custom shader
        this._patchEffectWrapper = new EffectWrapper(__assign(__assign({}, AnimatedGifShaderConfiguration), { engine: this._engine }));
        // Creates a dedicated fullscreen renderer for the frame blit
        this._patchEffectRenderer = new EffectRenderer(this._engine, {
            positions: [1, 1, 0, 1, 0, 0, 1, 0]
        });
    };
    /**
     * Creates the current render loop callback.
     */
    AnimatedGifTexture.prototype._createRenderLoopCallback = function () {
        var _this = this;
        this._renderLoopCallback = function () {
            _this._renderFrame();
        };
    };
    /**
     * Starts loading the Gif data.
     */
    AnimatedGifTexture.prototype._loadGifTexture = function () {
        var _this = this;
        // Defines what happens after we read the data from the url
        var callback = function (buffer) {
            _this._parseGifData(buffer);
            _this._createGifResources();
            // Start Rendering the sequence of frames
            _this._engine.runRenderLoop(_this._renderLoopCallback);
        };
        // Load the array buffer from the Gif file
        this._engine._loadFile(this.name, callback, undefined, undefined, true);
    };
    /**
     * Parses the Gif data and creates the associated frames.
     * @param buffer Defines the buffer containing the data
     */
    AnimatedGifTexture.prototype._parseGifData = function (buffer) {
        var gifData = parseGIF(buffer);
        this._frames = decompressFrames(gifData, true);
    };
    /**
     * Creates the GPU resources associated with the Gif file.
     * It will create the texture for each frame as well as our render target used
     * to hold the final Gif.
     */
    AnimatedGifTexture.prototype._createGifResources = function () {
        for (var _i = 0, _a = this._frames; _i < _a.length; _i++) {
            var frame = _a[_i];
            // Creates a dedicated texture for each frames
            // This only contains patched data for a portion of the image
            frame.texture = this._engine.createRawTexture(new Uint8Array(frame.patch.buffer), frame.dims.width, frame.dims.height, Constants.TEXTUREFORMAT_RGBA, false, true, Constants.TEXTURE_NEAREST_SAMPLINGMODE, null, Constants.TEXTURETYPE_UNSIGNED_INT);
            // As it only contains part of the image, we need to translate and scale
            // the rendering of the pacth to fit with the location data from the file
            var sx = frame.dims.width / this._frames[0].dims.width;
            var sy = frame.dims.height / this._frames[0].dims.height;
            var tx = frame.dims.left / this._frames[0].dims.width;
            // As we render from the bottom, the translation needs to be computed accordingly
            var ty = (this._frames[0].dims.height - (frame.dims.top + frame.dims.height)) / this._frames[0].dims.height;
            frame.worldMatrix = new Float32Array([
                sx, 0, tx,
                0, sy, ty,
                0, 0, 1,
            ]);
            // Ensures webgl 1 compat
            this._engine.updateTextureWrappingMode(frame.texture, Constants.TEXTURE_CLAMP_ADDRESSMODE, Constants.TEXTURE_CLAMP_ADDRESSMODE);
        }
        // Creates our main render target based on the Gif dimensions
        var renderTarget = this._engine.createRenderTargetTexture(this._frames[0].dims, {
            format: Constants.TEXTUREFORMAT_RGBA,
            generateDepthBuffer: false,
            generateMipMaps: false,
            generateStencilBuffer: false,
            samplingMode: Constants.TEXTURE_BILINEAR_SAMPLINGMODE,
            type: Constants.TEXTURETYPE_UNSIGNED_BYTE
        });
        // Release the extra resources from the current internal texture
        this._engine._releaseTexture(this._texture);
        // Swap our internal texture by our new render target one
        renderTarget._swapAndDie(this._texture);
        // And adapt its data
        this._engine.updateTextureWrappingMode(this._texture, Constants.TEXTURE_CLAMP_ADDRESSMODE, Constants.TEXTURE_CLAMP_ADDRESSMODE);
        this._texture.width = this._frames[0].dims.width;
        this._texture.height = this._frames[0].dims.height;
        this._texture.isReady = false;
    };
    /**
     * Render the current frame when all is ready.
     */
    AnimatedGifTexture.prototype._renderFrame = function () {
        // Keep the current frame as long as specified in the Gif data
        if (this._currentFrame && (PrecisionDate.Now - this._previousDate) < this._currentFrame.delay) {
            return;
        }
        // Replace the current frame
        this._currentFrame = this._frames[this._nextFrameIndex];
        // Patch the texture
        this._drawPatch();
        // Recall the current draw time for this frame.
        this._previousDate = PrecisionDate.Now;
        // Update the next frame index
        this._nextFrameIndex++;
        if (this._nextFrameIndex >= this._frames.length) {
            this._nextFrameIndex = 0;
        }
    };
    /**
     * Draw the patch texture on top of the previous one.
     */
    AnimatedGifTexture.prototype._drawPatch = function () {
        var _this = this;
        // The texture is only ready when we are able to render
        if (!this._patchEffectWrapper.effect.isReady()) {
            return;
        }
        // Get the current frame
        var frame = this._currentFrame;
        // Record the old viewport
        var oldViewPort = this._engine.currentViewport;
        // We need to apply our special inputes to the effect when it renders
        this._patchEffectWrapper.onApplyObservable.addOnce(function () {
            _this._patchEffectWrapper.effect.setMatrix3x3("world", frame.worldMatrix);
            _this._patchEffectWrapper.effect._bindTexture("textureSampler", frame.texture);
        });
        // Render the current Gif frame on top of the previous one
        this._patchEffectRenderer.render(this._patchEffectWrapper, this._texture);
        // Reset the old viewport
        this._engine.setViewport(oldViewPort);
        // We are now all ready to roll
        if (!this._texture.isReady) {
            this._texture.isReady = true;
            this._onLoad && this._onLoad();
        }
    };
    /**
     * Dispose the texture and release its associated resources.
     */
    AnimatedGifTexture.prototype.dispose = function () {
        // Stops the current Gif update loop
        this._engine.stopRenderLoop(this._renderLoopCallback);
        // Clear the render helpers
        this._patchEffectWrapper.dispose();
        this._patchEffectRenderer.dispose();
        // Clear the textures from the Gif
        for (var _i = 0, _a = this._frames; _i < _a.length; _i++) {
            var frame = _a[_i];
            frame.texture.dispose();
        }
        // Disposes the render target associated resources
        _super.prototype.dispose.call(this);
    };
    return AnimatedGifTexture;
}(BaseTexture));
export { AnimatedGifTexture };
//# sourceMappingURL=animatedGifTexture.js.map