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
// ... u js/script.js ...

// ----------------------------------------------------------------------
// FUNKCIJA ZA KLIK (Sada prima 'pageName' umesto Base URL-a)
// ----------------------------------------------------------------------

/**
 * Obrađuje klik na dugme menija, dodaje vizuelni feedback
 * i kreira URL sa dva ključna parametra: 'page' i 'id' stanice.
 */
function handleMenuClick(buttonId, originalText, pageName) {
    const dugme = document.getElementById(buttonId);
    
    // DEFINIŠITE JEDINSTVENI BASE URL VAŠE GOOGLE APPS SKRIPT WEBAPP
    // Ovo je isti URL za sve Vaše funkcije (exec adresa)
    const APPS_SCRIPT_BASE_URL = 'https://script.google.com/macros/s/AKfycbzqN45kEhZsWu-zessd_1qvXvnLgGsnDQ0R5G81JScqt2zdW0edrYs8QZ_p50vXpNU/exec';
    
    if (dugme) {
        dugme.addEventListener('click', function() {
            if (dugme.classList.contains('loading-state')) {
                return; 
            }
            
            // 1. VIZUELNI FEEDBACK: Promena stanja
            dugme.classList.add('loading-state');
            dugme.textContent = 'UČITAVANJE...';
            
            // 2. KREIRANJE CILJNOG URL-a
            // Ovo je ključna izmena: dodajemo ?page= i &id=
            const targetUrl = `${APPS_SCRIPT_BASE_URL}?page=${pageName}&id=${CURRENT_STATION_ID}`;
            
            console.log(`Kliknuto: ${originalText}. Ciljni URL: ${targetUrl}`);

            // 3. SIMULACIJA UČITAVANJA
            setTimeout(() => {
                alert(`Aplikacija za "${originalText}" (Page: ${pageName}, ID: ${CURRENT_STATION_ID}) je USPEŠNO učitana. Simulacija otvara: ${targetUrl}`);
                
                dugme.classList.remove('loading-state');
                dugme.textContent = originalText;

                // KOD ZA STVARNO PREUSMERAVANJE:
                // window.location.href = targetUrl; 

            }, 2000); 
        });
    }
}

// ----------------------------------------------------------------------
// POVEZIVANJE DUGMADI (Sada šaljemo samo pageName - npr. 'primopredaja')
// ----------------------------------------------------------------------

// ZAMENITE Base URL iznad sa Vašim stvarnim exec URL-om!

handleMenuClick('prijavaSmeneDugme', 'Prijava smene', 'primopredaja'); // page=primopredaja
handleMenuClick('prijavaDelova', 'Prijava proizvodnje delova', 'proizvodnja'); // page=proizvodnja_v2
handleMenuClick('prijavaPauza', 'Prijava pauza', 'pauza'); // page=pauza
handleMenuClick('izmenaParametara', 'Izmena parametara', 'parametri'); // page=parametri
handleMenuClick('proveraKvalitetaDugme', 'Provera kvaliteta', 'kvalitet'); // page=kvalitet
handleMenuClick('prijavaZamene', 'Prijava zamene alata', 'zamena'); // page=zamena

// ... (Ostatak logike za Play/Stop/Zastoj dugmad se prilagođava slično)

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
