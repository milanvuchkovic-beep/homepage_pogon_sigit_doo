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

/**
 * Dobija puni URL trenutne stranice (uključujući repozitorijum) za povratne linkove.
 */
function getCurrentPagePath() {
    // Vraća putanju, npr. /homepage_pogon_sigit_doo/sefovi.html
    return window.location.pathname; 
}

const CURRENT_STATION_ID = getStationIdFromUrl();
const CURRENT_PAGE_PATH = getCurrentPagePath();

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
 * Obrađuje klik na dugme i kreira URL sa parametrima 'page', 'id' i opcionalno 'source'.
 * * @param {string} buttonId - HTML ID dugmeta.
 * @param {string} originalText - Originalni tekst dugmeta za vizuelni feedback.
 * @param {string} pageName - Page parametar koji se šalje Apps Script-u (npr. 'smena').
 * @param {boolean} includeId - Da li u URL treba uključiti &id=PRXX (true/false).
 */
function handleMenuClick(buttonId, originalText, pageName, includeId = true) {
    const dugme = document.getElementById(buttonId);
    // Tražimo element za statusnu poruku
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
            
            let params = `page=${pageName}`;
            
            // Dodavanje ID-ja stanice (samo za operatere)
            if (includeId) {
                params += `&id=${CURRENT_STATION_ID}`;
            }
            
            // Dodavanje izvora (za portale koji se ne vraćaju na index.html)
            if (CURRENT_PAGE_PATH.includes('sefovi.html') || CURRENT_PAGE_PATH.includes('regleri.html')) {
                // Ako je korisnik na sefovi.html, šaljemo punu putanju za povratak
                params += `&source=${encodeURIComponent(window.location.href)}`;
            }


            // 2. KREIRANJE CILJNOG URL-a
            const targetUrl = `${APPS_SCRIPT_BASE_URL}?${params}`;
            
            console.log(`Otvaranje: ${originalText} (Page: ${pageName}). URL: ${targetUrl}`);

            // 3. STVARNO PREUSMERAVANJE
            window.location.href = targetUrl; 
        });
    }
}


/**
 * Koristi se za povezivanje dugmadi samo ako element postoji na stranici.
 * Ovo sprečava greške u konzoli na portalima sa manje dugmadi (sefovi.html, regleri.html).
 * @param {string} buttonId - HTML ID dugmeta.
 * @param {string} originalText - Tekst dugmeta.
 * @param {string} pageName - Page parametar.
 * @param {boolean} includeId - Da li uključiti ID stanice.
 */
function connectButtonIfPresent(buttonId, originalText, pageName, includeId = true) {
    if (document.getElementById(buttonId)) {
        handleMenuClick(buttonId, originalText, pageName, includeId);
    }
}


// ----------------------------------------------------------------------
// 3. POVEZIVANJE DUGMADI SA ISPRAVNIM PAGE PARAMETRIMA
// ----------------------------------------------------------------------

// *** LOGIKA ZA GLAVNU KOMANDNU TABLU (index.html) ***
// Sva ova dugmad zahtevaju ID i nalaze se samo na index.html

connectButtonIfPresent('prijavaSmeneDugme', 'Prijava smene (OPERATERI)', 'smena', true);
connectButtonIfPresent('prijavaSkartaDugme', 'Prijava škarta', 'proizvodnja_v2', true); 
connectButtonIfPresent('prijavaPauzaDugme', 'Prijava pauza', 'pauza', true);
connectButtonIfPresent('izmenaParametaraDugme', 'Izmena parametara', 'izmena_parametara', true);
connectButtonIfPresent('prijavaKvalitetaDugme', 'Prijava kvaliteta', 'paznja', true);

connectButtonIfPresent('playDugme', 'START/POČETAK', 'pocetak', true); 
connectButtonIfPresent('stopDugme', 'STOP/KRAJ', 'kraj', true); 
connectButtonIfPresent('zastojiDugme', 'ZASTOJ', 'zastoj', true);


// *** LOGIKA ZA PORTAL ŠEFOVA (sefovi.html) ***
// Primopredaja NE SME da šalje ID, samo page parametar
connectButtonIfPresent('primopredajaDugmeSef', 'Primopredaja smene', 'primopredaja', false);


// *** LOGIKA ZA PORTAL REGLERA (regleri.html) ***
// Regleri NE ŠALJU ID
connectButtonIfPresent('reglerDugme', 'Regler aplikacija', 'alati', false);
