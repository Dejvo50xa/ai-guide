# PromptujAI — vizuální systém

Redesign 30. 9. 2026: „Refined blue“. Zachovává světle modrou paletu, kterou si uživatel vybral, ale s výraznější hierarchií, méně soupeřícími kartami a jedním stylovým souborem (`src/styles.css`, tokeny v `:root`). Inline styly a animace při scrollování byly odstraněny.

Barvy: pozadí #f3f8fd, pás sekce #eaf3fc, karty #ffffff, text #16324d, sekundární text #4b6580, akcent #2f6fa8, jemný akcent #e3effa, hlavní tlačítko (navy) #16324d, hranice #d6e5f2 / #b3cde4. Varování #7a5210 na #fbf3e4, chyba #8b3a30 na #fbefec.

Písma: nadpisy Manrope 700/800, text Inter 400/500/600 (Google Fonts, `display=swap`), kód systémový monospace. Šířka obsahu 1200 px, okraje 32 px (20 px na mobilu). Karty 16 px zaoblení, tlačítka a pole 10 px. Pohyb jen při interakci (hover), `prefers-reduced-motion` vše vypíná.

Rozvržení: úvod rozdělený na text a ukázku slabého a silného promptu; sekce se střídají se světlejším pásem. Zlomy 1080 px (menu místo odkazů), 860 px (jeden sloupec u rozdělených bloků), 620 px (jeden sloupec všude). Viditelný focus (2 px akcent), nativní `<dialog>` pro detail techniky, `<details>` pro FAQ.
