document.addEventListener("DOMContentLoaded", () => {
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
    
    // Audio detection
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const analyser = audioContext.createAnalyser();
            const microphone = audioContext.createMediaStreamSource(stream);
            const scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);

            analyser.smoothingTimeConstant = 0.8;
            analyser.fftSize = 1024;

            microphone.connect(analyser);
            analyser.connect(scriptProcessor);
            scriptProcessor.connect(audioContext.destination);
            scriptProcessor.onaudioprocess = function() {
                const array = new Uint8Array(analyser.frequencyBinCount);
                analyser.getByteFrequencyData(array);
                const average = array.reduce((a, b) => a + b) / array.length;
                
                console.log('Audio Level:', average); // Debugging line

                if (average > 50) { // Adjust threshold as needed
                    console.log('Blowing out candles!'); // Debugging line
                    blowOutCandles();
                }
            };
        })
        .catch(err => console.error('Error accessing microphone: ', err));
    }
});

function blowOutCandles() {
    const flames = document.querySelectorAll('.candle:before');
    flames.forEach(flame => flame.style.display = 'none');
}
