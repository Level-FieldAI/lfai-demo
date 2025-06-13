/**
 * Tavus CVI Configuration
 * Update these values with your actual Tavus credentials and settings
 */

export const TAVUS_CONFIG = {
  // Replace with your actual CVI ID from Tavus
  CVI_ID: "cvi_b8e8b8b8-8b8b-8b8b-8b8b-8b8b8b8b8b8b",
  
  // Tavus SDK URL - verify this is correct
  SDK_URL: "https://cdn.tavus.io/sdk/tavus-sdk.js",
  
  // Default player configuration
  PLAYER_CONFIG: {
    transparentBackground: true,
    autoplay: true,
    loop: true,
    controls: false,
    mute: true,
    width: '100%',
    height: '100%'
  },
  
  // Error messages
  ERRORS: {
    INVALID_CVI_ID: 'Please configure a valid Tavus CVI ID',
    SDK_LOAD_FAILED: 'Failed to load Tavus SDK',
    PLAYER_INIT_FAILED: 'Failed to initialize CVI player',
    PLAYER_ERROR: 'CVI player encountered an error'
  }
};

/**
 * Validate CVI ID format
 * @param id - CVI ID to validate
 * @returns boolean indicating if ID is valid
 */
export const validateCviId = (id: string): boolean => {
  if (!id || typeof id !== 'string') return false;
  
  return id !== 'YOUR_ACTUAL_TAVUS_VIDEO_ID' && 
         id.length > 0 && 
         id.startsWith('cvi_');
};

/**
 * Get the current CVI ID
 * @returns string - Current CVI ID
 */
export const getCviId = (): string => {
  return TAVUS_CONFIG.CVI_ID;
};

/**
 * Update CVI ID (useful for dynamic configuration)
 * @param newId - New CVI ID to set
 */
export const setCviId = (newId: string): void => {
  if (validateCviId(newId)) {
    TAVUS_CONFIG.CVI_ID = newId;
  } else {
    throw new Error(TAVUS_CONFIG.ERRORS.INVALID_CVI_ID);
  }
};