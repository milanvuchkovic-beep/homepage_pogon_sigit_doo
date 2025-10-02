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
const APPS_SCRIPT_BASE_URL = 'https://script.google.com/macros/s/AKfycbzqN45kEhZsWu-zessd_1qvXvnLgGsnDQ0R5G81JScqt2zdW0edrYs8QZ_p50vXpNU/exec';


// Ažuriranje glavnog naslova na stranici čim se dokument učita
document.addEventListener('DOMContentLoaded', () => {
    const mainTitleElement = document.getElementById('mainTitle');
    if (mainTitleElement) {
        mainTitleElement.textContent = `Radna stanica ${CURRENT_STATION_ID}`;
    }
});


// ----------------------------------------------------------------------
// 2. GLAVNA FUNKCIJA ZA OTVARANJE DUGMADI (PAGE PARAMETAR)
// ----------------------------------------------------------------------

/**
 * Obrađuje klik na dugme menija i kreira URL sa parametrima 'page' i 'id'.
 * @param {string} buttonId - HTML ID dugmeta.
 * @param {string} originalText - Originalni tekst dugmeta za vizuelni feedback.
 * @param {string} pageName - Page parametar koji se šalje Apps Script-u (npr. 'pocetak').
 */
function handleMenuClick(buttonId, originalText, pageName) {
    const dugme = document.getElementById(buttonId);
    
    if (dugme) {
        dugme.addEventListener('click', function() {
            if (dugme.classList.contains('loading-state')) {
                return; 
            }
            
            // 1. VIZUELNI FEEDBACK: Trenutno stanje "OTVARANJE"
            dugme.classList.add('loading-state');
            dugme.textContent = 'OTVARANJE...'; 
            
            // 2. KREIRANJE CILJNOG URL-a: BaseURL + ?page=XXX&id=PRXX
            const targetUrl = `${APPS_SCRIPT_BASE_URL}?page=${pageName}&id=${CURRENT_STATION_ID}`;
            
            console.log(`Otvaranje: ${originalText}. Ciljni URL: ${targetUrl}`);

            // 3. STVARNO PREUSMERAVANJE (Otvaranje WebApp u istom prozoru)
            window.location.href = targetUrl; 
        });
    }
}


// ----------------------------------------------------------------------
// 3. POVEZIVANJE DUGMADI SA ISPRAVNIM PAGE PARAMETRIMA
// ----------------------------------------------------------------------

// Dugmad iz glavnog menija
handleMenuClick('prijavaSmeneDugme', 'Prijava smene (OPERATERI)', 'smena');
handleMenuClick('prijavaSkartaDugme', 'Prijava škarta', 'proizvodnja_v2'); 
handleMenuClick('prijavaPauzaDugme', 'Prijava pauza', 'pauza');
handleMenuClick('izmenaParametaraDugme', 'Izmena parametara', 'izmena_parametara');
handleMenuClick('primopredajaDugme', 'Primopredaja smene (ŠEFOVI)', 'primopredaja');

// Akciona dugmad (zeleno/crveno/žuto)
handleMenuClick('playDugme', 'START', 'pocetak'); // 1. Zeleno dugme
handleMenuClick('stopDugme', 'KRAJ', 'kraj'); // 2. Crveno dugme
handleMenuClick('zastojiDugme', 'ZASTOJ', 'zastoj'); // 7. Žuto dugme
