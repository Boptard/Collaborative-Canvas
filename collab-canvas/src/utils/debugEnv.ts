// Debug: Check if environment variables are loaded
export const checkEnvVars = () => {
  console.log('=== Environment Variables Debug ===');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('All REACT_APP vars:', Object.keys(process.env).filter(key => key.startsWith('REACT_APP_')));

  console.log('\nFirebase Config Status:');
  console.log('API_KEY exists:', !!process.env.REACT_APP_FIREBASE_API_KEY);
  console.log('API_KEY value:', process.env.REACT_APP_FIREBASE_API_KEY || 'UNDEFINED');
  console.log('AUTH_DOMAIN:', process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'UNDEFINED');
  console.log('PROJECT_ID:', process.env.REACT_APP_FIREBASE_PROJECT_ID || 'UNDEFINED');

  // Check for common issues
  if (process.env.REACT_APP_FIREBASE_API_KEY === 'your-api-key') {
    console.error('❌ API Key still has placeholder value!');
  }

  return {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID
  };
};

// Call immediately when module loads
checkEnvVars();