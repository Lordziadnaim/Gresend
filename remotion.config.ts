import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
// WebGL sans GPU (serveur / CI) : SwiftShader.
Config.setChromiumOpenGlRenderer('swangle');
