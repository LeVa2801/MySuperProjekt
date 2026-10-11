import type { CodeLanguage } from "./types";

/* eslint-disable no-useless-escape */
export const codeSamples: Record<CodeLanguage, { name: string; source: string }[]> = {
  C: [
    { name: "Sensor und Förderband", source: `#include <stdbool.h>\n#include <stdio.h>\n\n/* Beispiel: Sensor auswerten und Förderband steuern.\n   Hardware-Ein- und Ausgänge durch deine SPS-API ersetzen. */\ntypedef struct {\n    bool lichtschranke_belegt;\n    bool not_aus;\n} Eingaenge;\n\ntypedef struct {\n    bool motor_ein;\n    bool stoerung;\n} Ausgaenge;\n\nAusgaenge zyklus(Eingaenge eingang) {\n    Ausgaenge ausgang = { false, false };\n\n    if (eingang.not_aus) {\n        ausgang.stoerung = true;\n        return ausgang;\n    }\n\n    ausgang.motor_ein = !eingang.lichtschranke_belegt;\n    return ausgang;\n}\n\nint main(void) {\n    const Eingaenge eingang = { false, false };\n    const Ausgaenge ausgang = zyklus(eingang);\n    printf(\"Foerderband: %s\\\\n\", ausgang.motor_ein ? \"EIN\" : \"AUS\");\n    return 0;\n}` },
    { name: "Start/Stopp mit Not-Aus", source: `#include <stdbool.h>\n#include <stdio.h>\n\ntypedef struct {\n    bool start;\n    bool stopp;\n    bool not_aus;\n} Taster;\n\ntypedef struct {\n    bool motor_ein;\n    bool stoerung;\n} Zustand;\n\nZustand aktualisieren(Taster taster, Zustand vorher) {\n    if (taster.not_aus || taster.stopp) {\n        return (Zustand){ false, taster.not_aus };\n    }\n    if (taster.start) {\n        vorher.motor_ein = true;\n    }\n    return vorher;\n}\n\nint main(void) {\n    Zustand zustand = { false, false };\n    zustand = aktualisieren((Taster){ true, false, false }, zustand);\n    printf(\"Motor: %s\\\\n\", zustand.motor_ein ? \"EIN\" : \"AUS\");\n    return 0;\n}` },
  ],
  "C++": [
    { name: "Motorsteuerung", source: `#include <iostream>\n\nclass Motorsteuerung {\npublic:\n    void zyklus(bool start, bool stopp, bool notAus) {\n        if (notAus || stopp) {\n            motorEin = false;\n            stoerung = notAus;\n        } else if (start) {\n            motorEin = true;\n        }\n    }\n\n    bool laeuft() const { return motorEin; }\n    bool hatStoerung() const { return stoerung; }\n\nprivate:\n    bool motorEin{false};\n    bool stoerung{false};\n};\n\nint main() {\n    Motorsteuerung foerderband;\n    foerderband.zyklus(true, false, false);\n    std::cout << \"Motor: \" << (foerderband.laeuft() ? \"EIN\" : \"AUS\") << '\\\\n';\n    return 0;\n}` },
    { name: "Lichtschranke und Aktor", source: `#include <iostream>\n\nstruct Maschine {\n    bool lichtschrankeBelegt{false};\n    bool notAus{false};\n    bool motorEin{false};\n    double achsenPosition{0.0};\n\n    void zyklus(double deltaZeit) {\n        if (notAus) {\n            motorEin = false;\n            return;\n        }\n        motorEin = !lichtschrankeBelegt;\n        achsenPosition += deltaZeit * (motorEin ? 0.25 : 0.0);\n    }\n};\n\nint main() {\n    Maschine maschine;\n    maschine.zyklus(0.02);\n    std::cout << \"Band: \" << (maschine.motorEin ? \"EIN\" : \"AUS\")\n              << \", Achse: \" << maschine.achsenPosition << '\\\\n';\n}` },
  ],
};
/* eslint-enable no-useless-escape */

export const defaultCodeFiles: Record<CodeLanguage, string> = {
  C: codeSamples.C[0].source.replaceAll("\\\\n", "\\n"),
  "C++": codeSamples["C++"][0].source.replaceAll("\\\\n", "\\n"),
};
