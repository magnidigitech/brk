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

export function parsePhoneNumbers(phoneStr: string): Array<{ display: string, href: string }> {
  if (!phoneStr) return [];
  const cleanStr = phoneStr.trim();
  if (cleanStr.includes('/')) {
    const parts = cleanStr.split('/').map(p => p.trim());
    if (parts.length === 2 && parts[0].length >= 7) {
      const firstNum = parts[0];
      const secondPart = parts[1];
      if (/^\d{2}$/.test(secondPart)) {
        const prefix = firstNum.slice(0, -2);
        const secondNum = prefix + secondPart;
        return [
          { display: firstNum, href: `tel:${firstNum.replace(/[\s()-]/g, '')}` },
          { display: secondNum, href: `tel:${secondNum.replace(/[\s()-]/g, '')}` }
        ];
      }
    }
  }
  return [
    { display: cleanStr, href: `tel:${cleanStr.replace(/[\s()-]/g, '')}` }
  ];
}
