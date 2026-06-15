export function getRoleTitle(language: 'en' | 'te'): string {
  // June 22, 2026 local time is: 2026-06-22
  const targetDate = new Date('2026-06-22T00:00:00+05:30');
  const now = new Date();
  
  if (now < targetDate) {
    return language === 'te' 
      ? 'ఆంధ్రప్రదేశ్ నుండి ఎన్నికైన భారత రాజ్యసభ సభ్యులు' 
      : 'Rajya Sabha Member-Elect from Andhra Pradesh';
  } else {
    return language === 'te'
      ? 'భారత రాజ్యసభ సభ్యులు (ఆంధ్రప్రదేశ్)'
      : 'Member of Parliament, Rajya Sabha';
  }
}
