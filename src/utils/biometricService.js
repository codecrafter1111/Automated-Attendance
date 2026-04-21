/**
 * Biometric Service using Web Authentication API (WebAuthn)
 * Handles fingerprint enrollment and verification
 * Includes fallback Mock mode for development/testing
 */

const BIOMETRIC_DB_KEY = 'attendease_biometric_db';
const USE_MOCK_MODE = process.env.NODE_ENV === 'development' || !window.PublicKeyCredential;

// Initialize biometric database in localStorage
const initBiometricDB = () => {
  if (!localStorage.getItem(BIOMETRIC_DB_KEY)) {
    localStorage.setItem(BIOMETRIC_DB_KEY, JSON.stringify({}));
  }
};

// Convert buffer to base64
const bufferToBase64 = (buffer) => {
  if (!buffer || buffer.byteLength === 0) return '';
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

// Convert base64 to buffer
const base64ToBuffer = (base64) => {
  if (!base64) return new ArrayBuffer(0);
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
};

// Generate a mock biometric signature (for testing)
const generateMockBiometricSignature = () => {
  return crypto.getRandomValues(new Uint8Array(64));
};

/**
 * Enroll a student's biometric (fingerprint)
 * @param {string} studentId - Student's unique ID
 * @param {string} studentName - Student's name
 * @returns {Promise<Object>} Enrollment result
 */
export const enrollBiometric = async (studentId, studentName) => {
  // Use mock mode if WebAuthn is not available
  if (USE_MOCK_MODE || !window.PublicKeyCredential) {
    // Simulate delay like real biometric scanning
    await new Promise(resolve => setTimeout(resolve, 1500));
    return enrollBiometricMock(studentId, studentName);
  }
  try {
    if (!window.PublicKeyCredential) {
      throw new Error('Web Authentication API is not supported on this device');
    }

    initBiometricDB();

    // Create enrollment challenge
    const challenge = crypto.getRandomValues(new Uint8Array(32));
    
    const publicKeyCredentialCreationOptions = {
      challenge: challenge,
      rp: {
        name: 'AttendEase Attendance System',
        id: window.location.hostname,
      },
      user: {
        id: new TextEncoder().encode(studentId),
        name: studentId,
        displayName: studentName,
      },
      pubKeyCredParams: [
        { type: 'public-key', alg: -7 }, // ES256
        { type: 'public-key', alg: -257 }, // RS256
      ],
      authenticatorSelection: {
        authenticatorAttachment: 'platform',
        userVerification: 'preferred',
        residentKey: 'preferred',
      },
      timeout: 60000,
      attestation: 'direct',
    };

    try {
      const credential = await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions,
      });

      if (!credential) {
        throw new Error('Credential creation was cancelled or failed');
      }

      // Store enrollment in database
      const db = JSON.parse(localStorage.getItem(BIOMETRIC_DB_KEY));
      db[studentId] = {
        credentialId: bufferToBase64(credential.id),
        publicKey: bufferToBase64(credential.response.getPublicKey?.() || new ArrayBuffer(0)),
        counter: credential.response.getTransports ? 0 : null,
        enrolledAt: new Date().toISOString(),
        studentName: studentName,
        type: 'webauthn',
      };
      localStorage.setItem(BIOMETRIC_DB_KEY, JSON.stringify(db));

      return {
        success: true,
        message: 'Biometric enrollment successful',
        studentId,
        enrolledAt: db[studentId].enrolledAt,
      };
    } catch (innerError) {
      const errName = innerError?.name;
      const errMsg = innerError?.message;
      
      // Handle specific WebAuthn errors
      if (errName === 'NotAllowedError' || errMsg?.includes('cancelled')) {
        throw new Error('Biometric enrollment was cancelled. Please try again.');
      } else if (errName === 'InvalidStateError') {
        throw new Error('This user is already enrolled for biometric. Please remove and try again.');
      } else if (errName === 'NotSupportedError') {
        throw new Error('Your device does not support biometric enrollment.');
      } else if (errName === 'SecurityError') {
        throw new Error('Security error: Biometric enrollment requires a secure context (HTTPS).');
      } else {
        throw new Error(`Biometric enrollment failed: ${errMsg || 'Unknown error'}`);
      }
    }
  } catch (error) {
    console.error('Biometric enrollment error:', error);
    throw error;
  }
};

/**
 * Mock/Simulation enrollment for development and devices without WebAuthn
 */
const enrollBiometricMock = (studentId, studentName) => {
  initBiometricDB();
  const db = JSON.parse(localStorage.getItem(BIOMETRIC_DB_KEY));
  
  const mockSignature = bufferToBase64(generateMockBiometricSignature());
  
  db[studentId] = {
    credentialId: bufferToBase64(crypto.getRandomValues(new Uint8Array(32))),
    publicKey: mockSignature,
    counter: 0,
    enrolledAt: new Date().toISOString(),
    studentName: studentName,
    type: 'mock',
    mockPin: '1234', // Default PIN for testing
  };
  localStorage.setItem(BIOMETRIC_DB_KEY, JSON.stringify(db));

  console.log(`[MOCK MODE] Biometric enrolled for ${studentName} (${studentId})`);

  return {
    success: true,
    message: 'Biometric enrollment successful',
    studentId,
    enrolledAt: db[studentId].enrolledAt,
    isMockMode: true,
  };
};

/**
 * Verify a student's biometric (fingerprint)
 * @param {string} studentId - Student's unique ID
 * @returns {Promise<Object>} Verification result
 */
export const verifyBiometric = async (studentId) => {
  // Use mock mode if WebAuthn is not available
  if (USE_MOCK_MODE || !window.PublicKeyCredential) {
    // Simulate delay like real biometric scanning
    await new Promise(resolve => setTimeout(resolve, 1500));
    return verifyBiometricMock(studentId);
  }
  try {
    if (!window.PublicKeyCredential) {
      throw new Error('Web Authentication API is not supported on this device');
    }

    initBiometricDB();
    const db = JSON.parse(localStorage.getItem(BIOMETRIC_DB_KEY));

    if (!db[studentId]) {
      throw new Error(`No biometric enrollment found for student ${studentId}`);
    }

    const enrollment = db[studentId];
    const challenge = crypto.getRandomValues(new Uint8Array(32));

    const publicKeyCredentialRequestOptions = {
      challenge: challenge,
      allowCredentials: [
        {
          id: new Uint8Array(base64ToBuffer(enrollment.credentialId)),
          type: 'public-key',
          transports: ['internal'],
        },
      ],
      timeout: 60000,
      userVerification: 'preferred',
    };

    try {
      const assertion = await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions,
      });

      if (!assertion) {
        throw new Error('Verification was cancelled or failed');
      }

      // Verify the assertion
      // In a real app, you would verify the signature on the server
      const verificationResult = {
        verified: true,
        studentId: studentId,
        studentName: enrollment.studentName,
        verificationTime: new Date().toISOString(),
        method: 'biometric',
      };

      return verificationResult;
    } catch (innerError) {
      const errName = innerError?.name;
      const errMsg = innerError?.message;
      
      // Handle specific WebAuthn errors
      if (errName === 'NotAllowedError' || errMsg?.includes('cancelled')) {
        throw new Error('Biometric verification was cancelled. Please try again.');
      } else if (errName === 'InvalidStateError') {
        throw new Error('This credential no longer exists. Please re-enroll.');
      } else if (errName === 'NotSupportedError') {
        throw new Error('Your device does not support biometric verification.');
      } else if (errName === 'SecurityError') {
        throw new Error('Security error: Biometric verification requires a secure context (HTTPS).');
      } else {
        throw new Error(`Biometric verification failed: ${errMsg || 'Unknown error'}`);
      }
    }
  } catch (error) {
    console.error('Biometric verification error:', error);
    throw error;
  }
};

/**
 * Mock/Simulation verification for development and devices without WebAuthn
 */
const verifyBiometricMock = (studentId) => {
  initBiometricDB();
  const db = JSON.parse(localStorage.getItem(BIOMETRIC_DB_KEY));

  if (!db[studentId]) {
    throw new Error(`No biometric enrollment found for student ${studentId}. Please enroll first.`);
  }

  const enrollment = db[studentId];
  
  console.log(`[MOCK MODE] Biometric verified for ${enrollment.studentName} (${studentId})`);

  return {
    verified: true,
    studentId: studentId,
    studentName: enrollment.studentName,
    verificationTime: new Date().toISOString(),
    method: 'biometric',
    isMockMode: true,
  };
};

/**
 * Check if biometric is available on the device
 * @returns {Promise<Object>} Object with availability info and diagnostics
 */
export const isBiometricAvailable = async () => {
  try {
    const diagnostics = {
      webauthnSupported: !!window.PublicKeyCredential,
      credentialsAPISupported: !!navigator?.credentials,
      isAvailable: false,
      canMock: true,
      mockModeEnabled: USE_MOCK_MODE,
      os: detectOS(),
    };

    if (!window.PublicKeyCredential) {
      console.log('[BIOMETRIC] WebAuthn not supported - using mock mode');
      diagnostics.reason = 'WebAuthn API not available';
      return diagnostics;
    }

    try {
      const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      diagnostics.isAvailable = available;
      
      if (!available) {
        console.log('[BIOMETRIC] Platform authenticator not available - using mock mode');
        diagnostics.reason = 'No platform authenticator available';
      }
      
      return diagnostics;
    } catch (innerError) {
      console.log('[BIOMETRIC] Could not check platform authenticator - using mock mode:', innerError.message);
      diagnostics.reason = 'Platform check failed: ' + innerError.message;
      diagnostics.isAvailable = true;
      return diagnostics;
    }
  } catch (error) {
    console.error('[BIOMETRIC] Error checking biometric availability:', error);
    return {
      webauthnSupported: false,
      credentialsAPISupported: false,
      isAvailable: false,
      canMock: true,
      mockModeEnabled: USE_MOCK_MODE,
      error: error.message
    };
  }
};

/**
 * Detect operating system
 */
const detectOS = () => {
  const ua = navigator.userAgent;
  if (ua.includes('Windows')) return 'Windows';
  if (ua.includes('Macintosh')) return 'macOS';
  if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('Linux')) return 'Linux';
  return 'Unknown';
};

/**
 * Get all enrolled students
 * @returns {Array} List of enrolled students
 */
export const getEnrolledStudents = () => {
  try {
    initBiometricDB();
    const db = JSON.parse(localStorage.getItem(BIOMETRIC_DB_KEY));
    return Object.keys(db).map(studentId => ({
      studentId,
      ...db[studentId],
    }));
  } catch (error) {
    console.error('Error getting enrolled students:', error);
    return [];
  }
};

/**
 * Check if a student is enrolled for biometric
 * @param {string} studentId - Student's ID
 * @returns {boolean} True if enrolled
 */
export const isStudentEnrolled = (studentId) => {
  try {
    initBiometricDB();
    const db = JSON.parse(localStorage.getItem(BIOMETRIC_DB_KEY));
    return !!db[studentId];
  } catch (error) {
    console.error('Error checking enrollment:', error);
    return false;
  }
};

/**
 * Get device biometric information
 * Helpful for debugging and diagnostics
 * @returns {Object} Device capability information
 */
export const getBiometricDeviceInfo = () => {
  const info = {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    maxTouchPoints: navigator.maxTouchPoints,
    webauthnSupported: !!window.PublicKeyCredential,
    credentialsSupported: !!navigator?.credentials,
    touchscreen: navigator.maxTouchPoints > 0,
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    usesAppleDevice: /iPhone|iPad|Macintosh/.test(navigator.userAgent),
    usesAndroid: /Android/.test(navigator.userAgent),
    usesWindows: /Windows/.test(navigator.userAgent),
    secureContext: window.isSecureContext,
  };
  return info;
};

/**
 * Remove biometric enrollment for a student
 * @param {string} studentId - Student's ID
 * @returns {boolean} True if successfully removed
 */
export const removeBiometricEnrollment = (studentId) => {
  try {
    initBiometricDB();
    const db = JSON.parse(localStorage.getItem(BIOMETRIC_DB_KEY));
    delete db[studentId];
    localStorage.setItem(BIOMETRIC_DB_KEY, JSON.stringify(db));
    return true;
  } catch (error) {
    console.error('Error removing enrollment:', error);
    return false;
  }
};

export default {
  enrollBiometric,
  verifyBiometric,
  isBiometricAvailable,
  getEnrolledStudents,
  isStudentEnrolled,
  removeBiometricEnrollment,
  getBiometricDeviceInfo,
  testBiometricSetup: async () => {
    console.log('=== BIOMETRIC SETUP DIAGNOSTIC ===');
    const info = getBiometricDeviceInfo();
    console.log('Device Info:', info);
    
    const biometricAvail = await isBiometricAvailable();
    console.log('Biometric Availability:', biometricAvail);
    
    const enrolled = getEnrolledStudents();
    console.log('Enrolled Students:', enrolled);
    
    console.log('=== END DIAGNOSTIC ===');
    
    return {
      deviceInfo: info,
      biometricAvail,
      enrolledStudents: enrolled
    };
  }
};
