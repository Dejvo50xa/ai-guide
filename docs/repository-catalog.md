# Katalog repozitářů

Veřejná stránka `/repozitare/` je samostatný vstup Vite. Sdílí navigaci a vizuální systém s hlavní stránkou. Odkaz je v navigaci a v úvodním bloku hlavní stránky.

## Data a aktualizace

`src/data/repositories.json` obsahuje redakčně vybraných 28 repozitářů. Popisy, kategorie, návody a ukázková zadání jsou ručně spravované. Čísla hvězdiček, archivace a datum poslední změny pocházejí z veřejného GitHub API; `checkedAt` uvádí čas načtení. README jednotlivých projektů byly použity pro kontrolu typu integrace. AutoGen je označen jako projekt v režimu údržby.

- `npm run refresh:repositories` aktualizuje metadata v repozitáři. Při selhání zachová původní údaj a vrátí chybový stav. Poté zkontrolovat diff a commitnout aktualizovaná data.
- Tlačítko na stránce obnovuje pouze počty hvězdiček pomocí veřejného API, bez klíčů. Výsledky se ukládají do localStorage návštěvníka.
- GitHub omezuje anonymní požadavky. Při omezení se obnovování zastaví a stránka vypíše počet úspěšných aktualizací. Původní data zůstávají dostupná s původním datem.
- Nejde o automaticky generovaný žebříček celého GitHubu; řazení probíhá pouze v redakčním výběru.

## Ověření

`npm run test:catalog` kontroluje úplnost dat, řazení, kombinování filtrů a odmítnutí vadné cache. `npm run build` sestaví hlavní stránku i katalog. V prohlížeči byly ověřeny kategorie, nulové výsledky, obnova filtrů, abecední řazení, rozbalení karty, kopírování zadání, částečná obnova dat při rate limitu a šířka 375 px.

Nová položka potřebuje popis, typ zapojení, kategorie, návod, příklad zadání a ověřená metadata. Samotná hvězdička není redakční hodnocení kvality.
