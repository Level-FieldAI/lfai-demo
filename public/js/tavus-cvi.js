/**
 * Tavus CVI Player Integration
 * This script handles the initialization and management of the Tavus CVI player
 */

(async function() {
    // IMPORTANT: Replace with your actual CVI ID from Tavus
    const cviId = 'p9291e275923'; // <-- REPLACE THIS!
    
    // Configuration options for the CVI player
    const playerConfig = {
        container: 'cvi-player-container',
        cviId: cviId,
        transparentBackground: true,
        autoplay: true,
        loop: true,
        controls: false,
        mute: true, // Often needed for autoplay to work
        width: '100%',
        height: '100%'
    };

    /**
     * Function to load the Tavus SDK dynamically
     * @returns {Promise} Promise that resolves with the Tavus SDK
     */
    function loadTavusSDK() {
        return new Promise((resolve, reject) => {
            // Check if Tavus SDK is already loaded
            if (window.Tavus) {
                return resolve(window.Tavus);
            }

            // Create script element to load the SDK
            const script = document.createElement('script');
            script.src = 'https://cdn.tavus.io/sdk/tavus-sdk.js'; // Verify this is the correct SDK URL
            script.async = true;
            
            script.onload = () => {
                if (window.Tavus) {
                    resolve(window.Tavus);
                } else {
                    reject(new Error('Tavus SDK loaded but not available on window object'));
                }
            };
            
            script.onerror = () => {
                reject(new Error('Failed to load Tavus SDK'));
            };
            
            document.head.appendChild(script);
        });
    }

    /**
     * Update loading indicator with message
     * @param {string} message - Message to display
     * @param {boolean} isError - Whether this is an error message
     */
    function updateLoadingIndicator(message, isError = false) {
        const loadingIndicator = document.getElementById('custom-loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.textContent = message;
            if (isError) {
                loadingIndicator.classList.add('cvi-error');
            }
        }
    }

    /**
     * Hide loading indicator
     */
    function hideLoadingIndicator() {
        const loadingIndicator = document.getElementById('custom-loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }
    }

    /**
     * Validate CVI ID
     * @param {string} id - CVI ID to validate
     * @returns {boolean} Whether the ID is valid
     */
    function validateCviId(id) {
        return id && id !== 'YOUR_ACTUAL_TAVUS_VIDEO_ID' && id.length > 0;
    }

    // Main initialization function
    try {
        // Validate CVI ID before proceeding
        if (!validateCviId(cviId)) {
            throw new Error('Please replace YOUR_ACTUAL_TAVUS_VIDEO_ID with your actual Tavus CVI ID');
        }

        updateLoadingIndicator('Loading Tavus SDK...');

        // Load the Tavus SDK
        const Tavus = await loadTavusSDK();
        
        updateLoadingIndicator('Initializing CVI Player...');

        // Initialize the CVI player
        const player = new Tavus.Player(playerConfig);

        // Set up event listeners
        player.on('ready', () => {
            console.log('CVI player is ready');
            hideLoadingIndicator();
            
            // Add ready class for styling
            const container = document.getElementById('cvi-player-container');
            if (container) {
                container.classList.add('cvi-ready');
            }
        });

        player.on('error', (error) => {
            console.error('CVI player error:', error);
            updateLoadingIndicator('Error loading CVI player. Please check your CVI ID.', true);
        });

        player.on('play', () => {
            console.log('CVI player started playing');
        });

        player.on('pause', () => {
            console.log('CVI player paused');
        });

        player.on('ended', () => {
            console.log('CVI player ended');
        });

        // Store player reference globally for debugging/control
        window.cviPlayer = player;

    } catch (error) {
        console.error('Failed to initialize CVI Player:', error);
        updateLoadingIndicator(
            error.message.includes('YOUR_ACTUAL_TAVUS_VIDEO_ID') 
                ? 'Please configure your Tavus CVI ID' 
                : 'Error initializing CVI player', 
            true
        );
    }
})();

/**
 * Utility functions for external control (optional)
 */
window.TavusCVIUtils = {
    /**
     * Play the CVI player
     */
    play: function() {
        if (window.cviPlayer && typeof window.cviPlayer.play === 'function') {
            window.cviPlayer.play();
        }
    },

    /**
     * Pause the CVI player
     */
    pause: function() {
        if (window.cviPlayer && typeof window.cviPlayer.pause === 'function') {
            window.cviPlayer.pause();
        }
    },

    /**
     * Get player status
     */
    getStatus: function() {
        return window.cviPlayer ? 'initialized' : 'not initialized';
    }
};