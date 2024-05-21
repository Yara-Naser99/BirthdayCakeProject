class AudioProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this._buffer = new Float32Array(this.bufferSize);
    }

    process(inputs, outputs, parameters) {
        const input = inputs[0];
        if (input.length > 0) {
            const channelData = input[0];
            let sum = 0;
            for (let i = 0; i < channelData.length; i++) {
                sum += channelData[i] * channelData[i];
            }
            const rms = Math.sqrt(sum / channelData.length);
            const average = rms * 1000; // Scale the RMS value

            this.port.postMessage(average);
        }
        return true;
    }
}

registerProcessor('audio-processor', AudioProcessor);