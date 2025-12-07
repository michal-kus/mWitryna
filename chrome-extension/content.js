(function() {
  if (window.mobywatelVerifyInjected) return;
  window.mobywatelVerifyInjected = true;

  const currentUrl = window.location.href;
  const currentDomain = window.location.hostname;

  fetch(chrome.runtime.getURL('safe_domains.csv'))
    .then(response => response.text())
    .then(csv => {
      const safeDomains = csv.split('\n')
        .slice(1) // Skip header
        .map(line => line.trim())
        .filter(line => line.length > 0);

      const isVerified = safeDomains.includes(currentDomain);

      const looksLikeGov = currentDomain.includes('gov') ||
                           currentDomain.includes('podatk') ||
                           currentDomain.includes('epuap') ||
                           currentDomain.includes('obywatel') ||
                           currentDomain.includes('urzad');

      if (looksLikeGov) {
        chrome.runtime.sendMessage({
          action: 'updateIcon',
          verified: isVerified
        });
      }

      if (!isVerified && looksLikeGov) {
        showPhishingWarning();
        return;
      }

      if (isVerified) {
        console.log('✅ mObywatel - Strona zweryfikowana');
        console.log('✓ Zweryfikowana strona gov.pl');
      }
    })
    .catch(err => {
      console.error('Failed to load safe domains:', err);
    });
})();

function showPhishingWarning() {
  const warning = document.createElement('div');
  warning.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(220, 38, 38, 0.95);
    z-index: 9999999;
    display: flex;
    align-items: center;
    justify-content: center;
  `;

  warning.innerHTML = `
    <div style="
      background: white;
      padding: 40px;
      border-radius: 16px;
      max-width: 500px;
      text-align: center;
      box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    ">
      <div style="font-size: 64px; margin-bottom: 20px;">🚫</div>
      <h1 style="color: #dc2626; margin: 0 0 20px 0; font-size: 28px;">
        OSTRZEŻENIE!
      </h1>
      <h2 style="color: #991b1b; margin: 0 0 20px 0; font-size: 20px;">
        Możliwe oszustwo phishingowe
      </h2>
      <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
        Ta strona wygląda jak strona rządowa, ale <strong>NIE znajduje się</strong>
        w oficjalnym rejestrze domen gov.pl.
      </p>
      <div style="
        background: #fef2f2;
        border: 2px solid #fecaca;
        border-radius: 8px;
        padding: 15px;
        margin-bottom: 20px;
        text-align: left;
      ">
        <p style="margin: 5px 0; font-size: 14px; color: #991b1b;">
          ❌ <strong>NIE LOGUJ SIĘ</strong>
        </p>
        <p style="margin: 5px 0; font-size: 14px; color: #991b1b;">
          ❌ <strong>NIE PODAWAJ DANYCH OSOBOWYCH</strong>
        </p>
        <p style="margin: 5px 0; font-size: 14px; color: #991b1b;">
          ❌ <strong>NIE WYKONUJ PŁATNOŚCI</strong>
        </p>
      </div>
      <div style="margin-bottom: 24px;">
        <button onclick="window.location.href='https://www.gov.pl'" style="
          background: #dc2626;
          color: white;
          border: none;
          padding: 16px 40px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
          transition: all 0.2s;
          width: 100%;
          margin-bottom: 12px;
        " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 16px rgba(220, 38, 38, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(220, 38, 38, 0.3)'">Przejdź do gov.pl</button>

        <button onclick="this.closest('div').parentElement.parentElement.remove()" style="
          background: transparent;
          color: #666;
          border: 1px solid #cbd5e1;
          padding: 12px 24px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          width: 100%;
        " onmouseover="this.style.background='#f8fafc'; this.style.borderColor='#94a3b8'" onmouseout="this.style.background='transparent'; this.style.borderColor='#cbd5e1'">Zignoruj ostrzeżenie</button>
      </div>
    </div>
  `;

  document.body.appendChild(warning);
  console.warn('⚠️ PHISHING DETECTED:', window.location.href);
}
