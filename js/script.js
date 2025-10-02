// ----------------------------------------------------------------------
// FUNKCIJE ZA ČITANJE URL PARAMETARA I INICIJALIZACIJU
// ----------------------------------------------------------------------

/**
 * Izvlači ID stanice (npr. 'PR05') iz URL parametra 'id'.
 */
function getStationIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    // Ako nema ID-a u URL-u, podrazumevana je PR01
    let stationId = urlParams.get('id'); 
    return stationId ? stationId.toUpperCase() : 'PR01'; 
}

const CURRENT_STATION_ID = getStationIdFromUrl();

// Ažuriranje glavnog naslova na stranici
document.addEventListener('DOMContentLoaded', () => {
    const mainTitleElement = document.getElementById('mainTitle');
    if (mainTitleElement) {
        mainTitleElement.textContent = `Radna stanica ${CURRENT_STATION_ID}`;
    }
});


// ----------------------------------------------------------------------
// FUNKCIJA ZA KLIK (KORISTI ID STANICE ZA POZIV WEB APP-A)
// ----------------------------------------------------------------------

/**
 * Obrađuje klik na dugme menija, dodaje vizuelni feedback
 * i priprema URL za Google Web App (Apps Script).
 */
function handleMenuClick(buttonId, originalText, baseUrl) {
    const dugme = document.getElementById(buttonId);
    
    if (dugme) {
        dugme.addEventListener('click', function() {
            if (dugme.classList.contains('loading-state')) {
                return; 
            }

            // 1. VIZUELNI FEEDBACK: Promena stanja na "UČITAVANJE"
            dugme.classList.add('loading-state');
            dugme.textContent = 'UČITAVANJE...';
            
            // 2. KREIRANJE CILJNOG URL-a ZA GOOGLE SKRIPTU
            // Base URL + ?station=PR05
            const targetUrl = `${baseUrl}?station=${CURRENT_STATION_ID}`;
            
            console.log(`Kliknuto: ${originalText}. Ciljni URL: ${targetUrl}`);

            // 3. SIMULACIJA UČITAVANJA (Zameniti stvarnom logikom)
            setTimeout(() => {
                alert(`Aplikacija za "${originalText}" (Stanica ${CURRENT_STATION_ID}) je USPEŠNO učitana. Simulacija otvara: ${targetUrl}`);
                
                // Vraćanje dugmeta u normalno stanje
                dugme.classList.remove('loading-state');
                dugme.textContent = originalText;

                // OVO JE KOD KOJI BI OTVORIO GOOGLE WEB APP:
                // window.location.href = targetUrl; 

            }, 2000); 
        });
    }
}

// ----------------------------------------------------------------------
// POVEZIVANJE DUGMADI SA BASE URL-OVIMA VAŠIH GOOGLE APLIKACIJA
// ----------------------------------------------------------------------

// Zamenite 'https://vase-webapp-domen.com/api' sa stvarnim BASE URL-om Vaših Apps Script Web App-ova (npr. 'https://script.google.com/macros/s/ABCDEF/exec')

// PRIMERI POZIVA:
handleMenuClick('prijavaSmene', 'Prijava smene', 'https://vase-webapp-domen.com/api/smene');
handleMenuClick('prijavaDelova', 'Prijava proizvodnje delova', 'https://vase-webapp-domen.com/api/delovi');
handleMenuClick('prijavaPauza', 'Prijava pauza', 'https://vase-webapp-domen.com/api/pauza');
handleMenuClick('izmenaParametara', 'Izmena parametara', 'https://vase-webapp-domen.com/api/parametri');
handleMenuClick('prijavaZamene', 'Prijava zamene alata', 'https://vase-webapp-domen.com/api/alati');

// Logika za START/STOP i Zastoj
document.getElementById('playDugme').addEventListener('click', function() {
    alert(`START je pritisnut za ${CURRENT_STATION_ID}!`);
});

document.getElementById('stopDugme').addEventListener('click', function() {
    alert(`STOP je pritisnut za ${CURRENT_STATION_ID}!`);
});

document.getElementById('zastojiDugme').addEventListener('click', function() {
    const targetUrl = `https://vase-webapp-domen.com/api/zastoji?station=${CURRENT_STATION_ID}`;
    alert(`Aktiviran Zastoj za ${CURRENT_STATION_ID}! URL: ${targetUrl}`);
});
