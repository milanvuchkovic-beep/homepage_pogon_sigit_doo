// ----------------------------------------------------------------------
// 1. INICIJALIZACIJA I ČITANJE URL PARAMETARA
// ----------------------------------------------------------------------

/**
 * Izvlači ID stanice (npr. 'PR05') iz URL parametra 'id'.
 */
function getStationIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    let stationId = urlParams.get('id'); 
    return stationId ? stationId.toUpperCase() : 'PR01'; 
}

const CURRENT_STATION_ID = getStationIdFromUrl();

// GLAVNI URL ZA SVE GOOGLE APPS SKRIPT WEB APPLIKACIJE:
// Važno: Mora završavati sa /exec
const APPS_SCRIPT_BASE_URL = 'https://script.google.com/macros/s/AKfycbzzVwEs83KIH-M0ExKxifDBdCzvZNockcvhFUhFkZPQYMD1rOqmxIy90lOt4C1deHau/exec';


// Ažuriranje glavnog naslova na stranici čim se dokument učita
document.addEventListener('DOMContentLoaded', () => {
    const mainTitleElement = document.getElementById('mainTitle');
    if (mainTitleElement) {
        mainTitleElement.textContent = `Radna stanica ${CURRENT_STATION_ID}`;
    }
});


// ----------------------------------------------------------------------
// 2. GLAVNA FUNKCIJA ZA OTVARANJE DUGMADI (KONTROLA SLANJA ID-ja)
// ----------------------------------------------------------------------

/**
 * Obrađuje klik na dugme menija i kreira URL sa parametrima 'page' i Opciono 'id'.
 * * @param {string} buttonId - HTML ID dugmeta.
 * @param {string} originalText - Originalni tekst dugmeta za vizuelni feedback.
 * @param {string} pageName - Page parametar koji se šalje Apps Script-u (npr. 'pocetak').
 * @param {boolean} [includeId=true] - Da li treba uključiti &id=PRXX parametar. Podrazumevano je TRUE.
 */
function handleMenuClick(buttonId, originalText, pageName, includeId = true) {
    const dugme = document.getElementById(buttonId);
    const statusMessageElement = document.getElementById('statusMessage');
    
    if (dugme && statusMessageElement) {
        dugme.addEventListener('click', function() {
            if (dugme.classList.contains('loading-state')) {
                return; 
            }
            
            // 1. VIZUELNI FEEDBACK: Prikazivanje statusne poruke
            statusMessageElement.textContent = `OTVARANJE: ${originalText}...`;
            statusMessageElement.classList.add('visible');
            dugme.classList.add('loading-state');
            
            // 2. KREIRANJE CILJNOG URL-a
            let targetUrl = `${APPS_SCRIPT_BASE_URL}?page=${pageName}`;
            
            // KLJUČNA LOGIKA: Dodavanje ID-ja samo ako je to potrebno
            if (includeId) {
                targetUrl += `&id=${CURRENT_STATION_ID}`;
                console.log(`URL ukljucuje ID: ${CURRENT_STATION_ID}`);
            } else {
                // Dodaje se source parametar za reglere/sefove, koji Vaša Apps Script čita
                const currentPage = window.location.pathname.split('/').pop() || 'index.html';
                targetUrl += `&source=${currentPage}`;
                console.log(`URL NE ukljucuje ID. Koristi SOURCE: ${currentPage}`);
            }

            // 3. STVARNO PREUSMERAVANJE (Otvaranje WebApp u istom prozoru)
            window.location.href = targetUrl; 
        });
    } else {
        console.error(`ERROR: Element with ID ${buttonId} or statusMessage not found.`);
    }
}


// ----------------------------------------------------------------------
// 3. POVEZIVANJE DUGMADI SA ISPRAVNIM PAGE PARAMETRIMA
// ----------------------------------------------------------------------

// *** DUGMAD OPERATERA (ZAHTEVAJU ID) ***
handleMenuClick('prijavaSmeneDugme', 'Prijava smene (OPERATERI)', 'smena', true); 
handleMenuClick('prijavaSkartaDugme', 'Prijava škarta', 'proizvodnja_v2', true); 
handleMenuClick('prijavaPauzaDugme', 'Prijava pauza', 'pauza', true);
handleMenuClick('izmenaParametaraDugme', 'Izmena parametara', 'izmena_parametara', true);
handleMenuClick('prijavaKvalitetaDugme', 'Prijava kvaliteta', 'paznja', true); // Novo dugme
handleMenuClick('playDugme', 'START/POČETAK', 'pocetak', true); 
handleMenuClick('stopDugme', 'STOP/KRAJ', 'kraj', true); 
handleMenuClick('zastojiDugme', 'ZASTOJ', 'zastoj', true);

// *** DUGMAD ZA ŠEFOVE/REGLERE (NE ZAHTEVAJU ID) ***
// Postavljamo cetvrti argument (includeId) na FALSE!
handleMenuClick('primopredajaDugmeSef', 'Primopredaja smene (ŠEFOVI)', 'primopredaja', false); // sefovi.html
handleMenuClick('reglerDugme', 'Regler aplikacija', 'alati', false); // regleri.html
