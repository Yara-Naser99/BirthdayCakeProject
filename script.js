document.addEventListener("DOMContentLoaded", async () => {
    const candlesContainer = document.getElementById('candles');
    const pastelColors = ['#ffd1dc', '#ffddc1', '#fffcc1', '#c1ffd7', '#c1e1ff', '#dcc1ff'];
    const numberOfCandles = 28;
    const confettiColors = ['#ff0', '#f0f', '#0ff', '#ff6347', '#32cd32', '#1e90ff'];
    const numberOfConfetti = 100;

    // Add candles
    for (let i = 0; i < numberOfCandles; i++) {
        let candle = document.createElement('div');
        candle.classList.add('candle');
        candle.style.setProperty('--candle-color', pastelColors[i % pastelColors.length]);

        // Randomly position candles within the container
        const xPos = Math.random() * 90 + 5; // Ensuring the candle stays within the container
        const yPos = Math.random() * 60 + 20; // Ensuring the candle stays within the container

        candle.style.left = `${xPos}%`;
        candle.style.top = `${yPos}%`;

        candlesContainer.appendChild(candle);
    }

    // Add confetti
    const confettiContainer = document.getElementById('confetti-container');
    for (let i = 0; i < numberOfConfetti; i++) {
        let confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.setProperty('--confetti-color', confettiColors[i % confettiColors.length]);

        // Randomly position confetti
        const xPos = Math.random() * 100;
        const delay = Math.random() * 5; // Different start times

        confetti.style.left = `${xPos}%`;
        confetti.style.animationDelay = `${delay}s`;

        confettiContainer.appendChild(confetti);
    }

    // Audio detection with AudioWorklet
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            await audioContext.audioWorklet.addModule('audioProcessor.js');
            const microphone = audioContext.createMediaStreamSource(stream);
            const audioProcessor = new AudioWorkletNode(audioContext, 'audio-processor');

            microphone.connect(audioProcessor);
            audioProcessor.connect(audioContext.destination);

            audioProcessor.port.onmessage = (event) => {
                const average = event.data;
                console.log('Audio Level:', average); // Debugging line

                if (average == 0) { // Adjust threshold as needed
                    console.log('Blowing out candles!'); // Debugging line
                    blowOutCandles();
                }
            };
        } catch (err) {
            console.error('Error accessing microphone: ', err);
        }
    }
});

function blowOutCandles() {
    const candles = document.querySelectorAll('.candle');
    candles.forEach(candle => {
        candle.classList.add('blown-out');
    });
}