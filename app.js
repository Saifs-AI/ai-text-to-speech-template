new Vue({
    el: '#app',
    data: {
        textInput: '',
        selectedVoice: 'female',
        selectedLanguage: 'en-US',
        characterCount: 0,
        isProcessing: false,
        maxCharacters: 500
    },
    methods: {
        updateCharacterCount() {
            this.characterCount = this.textInput.length;
            if (this.characterCount > this.maxCharacters) {
                this.textInput = this.textInput.substring(0, this.maxCharacters);
                this.characterCount = this.maxCharacters;
            }
        },
        convertToSpeech() {
            if (!this.textInput || this.isProcessing) return;
            
            this.isProcessing = true;
            
            // Using the Web Speech API for demonstration
            const utterance = new SpeechSynthesisUtterance(this.textInput);
            utterance.lang = this.selectedLanguage;
            
            // Select voice based on gender preference
            const voices = speechSynthesis.getVoices();
            const preferredVoice = voices.find(voice => 
                voice.lang === this.selectedLanguage && 
                voice.name.toLowerCase().includes(this.selectedVoice)
            ) || voices.find(voice => voice.lang === this.selectedLanguage) || voices[0];
            
            utterance.voice = preferredVoice;
            
            utterance.onend = () => {
                this.isProcessing = false;
            };
            
            utterance.onerror = () => {
                this.isProcessing = false;
                alert('An error occurred while converting text to speech. Please try again.');
            };
            
            // Cancel any ongoing speech
            speechSynthesis.cancel();
            
            // Start speaking
            speechSynthesis.speak(utterance);
        }
    },
    mounted() {
        // Force voice list loading
        speechSynthesis.getVoices();
        
        // Handle dynamic voice loading in Chrome
        if ('onvoiceschanged' in speechSynthesis) {
            speechSynthesis.onvoiceschanged = () => {
                speechSynthesis.getVoices();
            };
        }
    }
}); 