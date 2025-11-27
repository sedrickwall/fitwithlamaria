/**
 * Test Mode Utility
 * 
 * Allows easy testing by adding ?testMode=on to the URL
 * Example: https://yourapp.replit.app/?testMode=on
 * 
 * This bypasses:
 * - 24-hour workout lock (free users can do unlimited workouts)
 * - Premium paywall (all premium features unlocked)
 */

export function initTestMode(): boolean {
  const urlParams = new URLSearchParams(window.location.search);
  const testModeParam = urlParams.get('testMode');
  
  if (testModeParam === 'on') {
    localStorage.setItem('testPremium', 'true');
    localStorage.setItem('bypassWorkoutLock', 'true');
    console.log('🧪 TEST MODE ENABLED - All restrictions bypassed');
    return true;
  }
  
  if (testModeParam === 'off') {
    localStorage.removeItem('testPremium');
    localStorage.removeItem('bypassWorkoutLock');
    console.log('🔒 TEST MODE DISABLED - Normal restrictions active');
    return false;
  }
  
  // Check if already in test mode from previous session
  const isTestMode = localStorage.getItem('testPremium') === 'true' || 
                     localStorage.getItem('bypassWorkoutLock') === 'true';
  
  return isTestMode;
}

export function isTestModeActive(): boolean {
  return localStorage.getItem('testPremium') === 'true' || 
         localStorage.getItem('bypassWorkoutLock') === 'true';
}

export function disableTestMode(): void {
  localStorage.removeItem('testPremium');
  localStorage.removeItem('bypassWorkoutLock');
  window.location.href = window.location.pathname;
}
