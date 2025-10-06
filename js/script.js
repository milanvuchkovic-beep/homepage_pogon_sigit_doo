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
const APPS_SCRIPT_BASE_URL = 'https://script.google.com/macros/s/AKfycbzzVwEs83KIH-M0ExKxifDBdCzvZNockcvhFUhFkZPQYMD1rOqmxIy90lOt4C1deHau/exec';


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
 */
function handleMenuClick(buttonId, originalText, pageName) {
    const dugme = document.getElementById(buttonId);
    // Tražimo element za statusnu poruku
    const statusMessageElement = document.getElementById('statusMessage'); 
    
    if (dugme && statusMessageElement) {
        dugme.addEventListener('click', function() {
            // Blokiranje dvostrukog klika
            if (dugme.classList.contains('loading-state')) {
                return; 
            }
            
            // 1. VIZUELNI FEEDBACK: Prikazivanje statusne poruke
            statusMessageElement.textContent = `OTVARANJE: ${originalText}...`;
            statusMessageElement.classList.add('visible');
            dugme.classList.add('loading-state');
            
            // 2. KREIRANJE CILJNOG URL-a: BaseURL + ?page=XXX&id=PRXX
            const targetUrl = `${APPS_SCRIPT_BASE_URL}?page=${pageName}&id=${CURRENT_STATION_ID}`;
            
            console.log(`Otvaranje: ${originalText} (Page: ${pageName}). URL: ${targetUrl}`);

            // 3. STVARNO PREUSMERAVANJE (Otvaranje WebApp u istom prozoru)
            window.location.href = targetUrl; 
            
            // NAPOMENA: Sve ispod window.location.href je nedostupno.
        });
    } else {
        // Logovanje greške ako nedostaje dugme ili status element (za debagovanje)
        console.error(`ERROR: Element with ID ${buttonId} or statusMessage not found.`);
    }
}


// ----------------------------------------------------------------------
// 3. POVEZIVANJE DUGMADI SA ISPRAVNIM PAGE PARAMETRIMA
// ----------------------------------------------------------------------

// Dugmad iz glavnog menija (Operateri/Šefovi)
handleMenuClick('prijavaSmeneDugme', 'Prijava smene (OPERATERI)', 'smena');
handleMenuClick('prijavaSkartaDugme', 'Prijava škarta', 'proizvodnja_v2'); 
handleMenuClick('prijavaPauzaDugme', 'Prijava pauza', 'pauza');
handleMenuClick('izmenaParametaraDugme', 'Izmena parametara', 'izmena_parametara');
handleMenuClick('primopredajaDugme', 'Primopredaja smene (ŠEFOVI)', 'primopredaja');
handleMenuClick('prijavaKvalitetaDugme', 'Prijava kvaliteta', 'paznja');
// Portal za Šefove (sa novim ID-jem dugmeta)
handleMenuClick('primopredajaDugmeSef', 'Primopredaja smene (ŠEFOVI)', 'primopredaja');

// Akciona dugmad (zeleno/crveno/žuto)
handleMenuClick('playDugme', 'START/POČETAK', 'pocetak'); 
handleMenuClick('stopDugme', 'STOP/KRAJ', 'kraj'); 
handleMenuClick('zastojiDugme', 'ZASTOJ', 'zastoj');

