/**
 * Inhalt der AGB-Seite — 1:1 übernommen von der Live-Version unter
 * https://mkdesignweb.de/policies/terms-of-service
 *
 * Zwei Dokumente, wie auf der Live-Seite:
 *   A — Allgemeine Nutzungsbedingungen (Shopify-Standardtext)
 *   B — Verkaufsbedingungen für Waren im Onlineshop (betriebsspezifisch)
 */

export type TosBlock =
  | { type: "p"; text: string }
  | { type: "list"; items: string[] }
  | { type: "subheading"; text: string };

export interface TosSection {
  title: string;
  blocks: TosBlock[];
}

export interface TosPart {
  heading: string;
  intro: string[];
  sections: TosSection[];
}

const p = (text: string): TosBlock => ({ type: "p", text });
const list = (items: string[]): TosBlock => ({ type: "list", items });
const sub = (text: string): TosBlock => ({ type: "subheading", text });

export const TOS_PARTS: TosPart[] = [
  {
    heading: "Teil A — Allgemeine Nutzungsbedingungen",
    intro: [
      "Diese Website wird betrieben von M.K.Design. Auf der gesamten Website beziehen sich die Begriffe „wir“, „uns“ und „unser“ auf M.K.Design. M.K.Design bietet Ihnen, dem Benutzer, diese Website einschließlich aller auf dieser Website verfügbaren Informationen, Tools und Dienste unter der Bedingung an, dass Sie alle hier aufgeführten Bedingungen, Richtlinien und Hinweise akzeptieren.",
      "Indem Sie unsere Site besuchen und/oder etwas von uns kaufen, nehmen Sie an unserem „Service“ teil und erklären sich mit den folgenden Geschäftsbedingungen einverstanden, einschließlich der zusätzlichen Geschäftsbedingungen und Richtlinien, auf die hierin verwiesen wird und/oder die per Hyperlink verfügbar sind. Diese allgemeinen Geschäftsbedingungen gelten für alle Benutzer der Site, insbesondere für Browser, Anbieter, Kunden, Händler und/oder Inhaltsanbieter.",
      "Bitte lesen Sie diese allgemeinen Geschäftsbedingungen sorgfältig durch, bevor Sie auf unsere Website zugreifen oder sie nutzen. Indem Sie auf einen beliebigen Teil der Site zugreifen oder diesen verwenden, erklären Sie sich mit diesen allgemeinen Geschäftsbedingungen einverstanden. Wenn Sie nicht allen Geschäftsbedingungen dieser Vereinbarung zustimmen, dürfen Sie nicht auf die Website zugreifen oder Dienste nutzen.",
      "Alle neuen Funktionen oder Tools, die dem aktuellen Store hinzugefügt werden, unterliegen ebenfalls den allgemeinen Geschäftsbedingungen. Sie können die aktuellste Version jederzeit auf dieser Seite einsehen. Wir behalten uns das Recht vor, Teile dieser Bedingungen jederzeit zu aktualisieren, zu ändern oder zu ersetzen. Es liegt in Ihrer Verantwortung, diese Seite regelmäßig auf Änderungen zu überprüfen.",
      "Unser Shop wird von Shopify Inc. gehostet. Shopify stellt uns die Online-E-Commerce-Plattform zur Verfügung, die es uns ermöglicht, Ihnen unsere Produkte und Dienstleistungen zu verkaufen.",
    ],
    sections: [
      {
        title: "Abschnitt 1 — Online-Shop-Bedingungen",
        blocks: [
          p("Indem Sie diesen allgemeinen Geschäftsbedingungen zustimmen, erklären Sie, dass Sie in Ihrem Wohnsitzstaat oder -provinz mindestens volljährig sind, oder dass Sie volljährig sind und uns Ihr Einverständnis gegeben haben, dass Ihre minderjährigen Angehörigen diese Website nutzen dürfen."),
          p("Sie dürfen unsere Produkte nicht für illegale oder nicht autorisierte Zwecke verwenden, noch dürfen Sie bei der Nutzung des Dienstes gegen die Gesetze Ihrer Gerichtsbarkeit verstoßen. Sie dürfen keine Würmer, Viren oder sonstigen Code zerstörerischer Natur übertragen. Ein Verstoß führt zur sofortigen Kündigung Ihrer Dienste."),
        ],
      },
      {
        title: "Abschnitt 2 — Allgemeine Bedingungen",
        blocks: [
          p("Wir behalten uns das Recht vor, den Service jederzeit und aus beliebigem Grund zu verweigern. Ihre Inhalte (ohne Kreditkarteninformationen) können unverschlüsselt übertragen werden; Kreditkarteninformationen werden bei der Übertragung stets verschlüsselt."),
          p("Sie erklären sich damit einverstanden, ohne unsere ausdrückliche schriftliche Genehmigung keinen Teil des Dienstes zu reproduzieren, zu vervielfältigen, zu kopieren, zu verkaufen, weiterzuverkaufen oder zu nutzen. Überschriften in dieser Vereinbarung dienen lediglich der Übersichtlichkeit."),
        ],
      },
      {
        title: "Abschnitt 3 — Genauigkeit, Vollständigkeit und Aktualität der Informationen",
        blocks: [
          p("Wir sind nicht verantwortlich für die Richtigkeit, Vollständigkeit oder Aktualität der auf dieser Site bereitgestellten Informationen. Die Materialien dienen ausschließlich der allgemeinen Information; das Vertrauen darauf erfolgt auf eigene Gefahr."),
          p("Diese Site kann historische Informationen enthalten, die nicht zwangsläufig aktuell sind. Wir behalten uns das Recht vor, den Inhalt jederzeit zu ändern, sind jedoch nicht verpflichtet, ihn zu aktualisieren."),
        ],
      },
      {
        title: "Abschnitt 4 — Änderungen des Dienstes und der Preise",
        blocks: [
          p("Die Preise unserer Produkte können ohne Vorankündigung geändert werden. Wir behalten uns das Recht vor, den Dienst jederzeit und ohne Vorankündigung zu ändern oder einzustellen. Wir haften nicht für Modifikationen, Preisänderungen, Aussetzungen oder die Einstellung des Dienstes."),
        ],
      },
      {
        title: "Abschnitt 5 — Produkte oder Dienstleistungen",
        blocks: [
          p("Bestimmte Produkte sind möglicherweise nur online verfügbar und nur in begrenzten Mengen erhältlich. Wir haben uns bemüht, Farben und Bilder unserer Produkte so genau wie möglich darzustellen, können jedoch die Farbdarstellung Ihres Monitors nicht garantieren."),
          p("Wir behalten uns das Recht vor, den Verkauf auf bestimmte Personen, Regionen oder Gerichtsbarkeiten zu beschränken, Mengen zu begrenzen, Produktbeschreibungen und Preise jederzeit zu ändern und die Produktion eines Produkts einzustellen."),
        ],
      },
      {
        title: "Abschnitt 6 — Genauigkeit der Rechnungs- und Kontoinformationen",
        blocks: [
          p("Wir behalten uns das Recht vor, jede Bestellung abzulehnen sowie Mengen pro Person, Haushalt oder Bestellung zu begrenzen oder zu stornieren — etwa bei Bestellungen über dasselbe Konto, dieselbe Karte oder dieselbe Rechnungs-/Lieferadresse."),
          p("Sie verpflichten sich, aktuelle, vollständige und genaue Kauf- und Kontoinformationen anzugeben und diese umgehend zu aktualisieren, damit wir Ihre Transaktionen abschließen und Sie bei Bedarf kontaktieren können."),
        ],
      },
      {
        title: "Abschnitt 7 — Optionale Tools",
        blocks: [
          p("Wir gewähren Ihnen möglicherweise Zugriff auf Tools von Drittanbietern, die wir weder überwachen noch kontrollieren. Die Nutzung erfolgt „wie besehen“ und auf Ihr eigenes Risiko, ohne Haftung unsererseits. Neue Funktionen oder Dienste unterliegen ebenfalls diesen Bedingungen."),
        ],
      },
      {
        title: "Abschnitt 8 — Links von Drittanbietern",
        blocks: [
          p("Über Links auf dieser Site können Sie auf Websites Dritter weitergeleitet werden. Wir prüfen deren Inhalte nicht und übernehmen keine Garantie oder Haftung für Materialien, Produkte oder Dienstleistungen Dritter. Beschwerden bezüglich Drittanbieter-Produkten richten Sie bitte direkt an den jeweiligen Anbieter."),
        ],
      },
      {
        title: "Abschnitt 9 — Benutzerkommentare, Feedback und andere Einreichungen",
        blocks: [
          p("Wenn Sie uns Kommentare, Ideen oder Vorschläge übermitteln, erklären Sie sich damit einverstanden, dass wir diese jederzeit ohne Einschränkung bearbeiten, veröffentlichen und anderweitig verwenden dürfen. Wir sind nicht verpflichtet, Kommentare vertraulich zu behandeln, dafür zu entschädigen oder darauf zu antworten."),
          p("Sie erklären sich damit einverstanden, dass Ihre Kommentare keine Rechte Dritter verletzen und kein rechtswidriges, beleidigendes oder obszönes Material sowie keine Schadsoftware enthalten. Sie sind allein für Ihre Kommentare und deren Richtigkeit verantwortlich."),
        ],
      },
      {
        title: "Abschnitt 10 — Personenbezogene Daten",
        blocks: [
          p("Ihre Übermittlung personenbezogener Daten über den Shop unterliegt unserer Datenschutzerklärung."),
        ],
      },
      {
        title: "Abschnitt 11 — Fehler, Ungenauigkeiten und Auslassungen",
        blocks: [
          p("Informationen auf unserer Site können gelegentlich Tippfehler, Ungenauigkeiten oder Auslassungen enthalten, u. a. zu Produktbeschreibungen, Preisen, Angeboten, Versandkosten und Lieferzeiten. Wir behalten uns das Recht vor, solche Fehler jederzeit zu korrigieren und Bestellungen ggf. zu stornieren, ohne Verpflichtung zur Aktualisierung, sofern gesetzlich nicht vorgeschrieben."),
        ],
      },
      {
        title: "Abschnitt 12 — Verbotene Verwendungen",
        blocks: [
          p("Zusätzlich zu anderen Verboten ist Ihnen die Nutzung der Site untersagt:"),
          list([
            "für rechtswidrige Zwecke oder zur Aufforderung zu rechtswidrigen Handlungen",
            "um gegen internationale, bundes- oder landesrechtliche Bestimmungen zu verstoßen",
            "um geistige Eigentumsrechte zu verletzen",
            "um zu belästigen, zu missbrauchen, zu diskriminieren oder zu diffamieren",
            "um falsche oder irreführende Angaben zu machen",
            "um Viren oder Schadcode zu übertragen",
            "um persönliche Daten anderer zu sammeln oder zu verfolgen",
            "zum Spammen, Phishing oder Scrapen",
            "für obszöne oder unmoralische Zwecke",
            "um Sicherheitsfunktionen des Dienstes zu stören oder zu umgehen",
          ]),
          p("Wir behalten uns das Recht vor, Ihre Nutzung bei verbotener Verwendung zu beenden."),
        ],
      },
      {
        title: "Abschnitt 13 — Haftungsausschluss; Haftungsbeschränkung",
        blocks: [
          p("Wir übernehmen keine Garantie dafür, dass die Nutzung unseres Dienstes ohne Unterbrechungen, rechtzeitig, sicher oder fehlerfrei erfolgt, oder dass Ergebnisse genau oder zuverlässig sind. Der Dienst wird „wie besehen“ und „wie verfügbar“ bereitgestellt, ohne jegliche Zusicherungen oder Garantien."),
          p("In keinem Fall haften M.K.Design, unsere Vertreter, Mitarbeiter, Lieferanten oder Lizenzgeber für direkte, indirekte, zufällige, Straf-, Sonder- oder Folgeschäden, die sich aus Ihrer Nutzung des Dienstes ergeben — soweit gesetzlich zulässig."),
        ],
      },
      {
        title: "Abschnitt 14 — Schadensersatz",
        blocks: [
          p("Sie verpflichten sich, M.K.Design und unsere verbundenen Unternehmen, Vertreter und Mitarbeiter von allen Ansprüchen Dritter schadlos zu halten, die aus Ihrem Verstoß gegen diese Bedingungen oder gegen Rechte Dritter entstehen."),
        ],
      },
      {
        title: "Abschnitt 15 — Salvatorische Klausel",
        blocks: [
          p("Sollte eine Bestimmung dieser Bedingungen für ungültig oder nicht durchsetzbar befunden werden, bleibt diese im größtmöglichen zulässigen Umfang durchsetzbar; die übrigen Bestimmungen bleiben davon unberührt."),
        ],
      },
      {
        title: "Abschnitt 16 — Kündigung",
        blocks: [
          p("Diese Bedingungen gelten, bis sie von Ihnen oder uns gekündigt werden. Sie können jederzeit kündigen, indem Sie die Nutzung unserer Dienste einstellen. Wir können diese Vereinbarung bei Verstoß gegen die Bedingungen jederzeit fristlos kündigen und Ihnen den Zugriff verweigern."),
        ],
      },
      {
        title: "Abschnitt 17 — Gesamte Vereinbarung",
        blocks: [
          p("Diese Bedingungen sowie alle von uns veröffentlichten Richtlinien stellen die gesamte Vereinbarung zwischen Ihnen und uns dar und ersetzen alle vorherigen Vereinbarungen. Das Versäumnis, ein Recht auszuüben, stellt keinen Verzicht darauf dar."),
        ],
      },
      {
        title: "Abschnitt 18 — Geltendes Recht",
        blocks: [
          p("Diese Servicebedingungen unterliegen den Gesetzen Deutschlands."),
        ],
      },
      {
        title: "Abschnitt 19 — Änderungen der allgemeinen Geschäftsbedingungen",
        blocks: [
          p("Sie können die aktuellste Version jederzeit auf dieser Seite einsehen. Wir behalten uns vor, Teile dieser Bedingungen nach eigenem Ermessen zu aktualisieren. Ihre fortgesetzte Nutzung nach Veröffentlichung von Änderungen gilt als Akzeptanz dieser Änderungen."),
        ],
      },
      {
        title: "Abschnitt 20 — Kontaktinformationen",
        blocks: [
          p("Fragen zu den allgemeinen Geschäftsbedingungen richten Sie bitte an uns:"),
          list([
            "M.K.Design by Markus Klement",
            "MKDesignbyMarkusKlement@web.de",
            "im Wiesengrund 8, 29584 Himbergen",
            "+49 162/3143590",
            "Umsatzsteuer-Identifikationsnummer DE335394256",
          ]),
        ],
      },
    ],
  },
  {
    heading: "Teil B — Verkaufsbedingungen für Waren im Onlineshop",
    intro: [
      "Allgemeine Geschäftsbedingungen (AGB) für den Verkauf von Waren im Onlineshop mkdesignweb.de.",
    ],
    sections: [
      {
        title: "§ 1 Geltungsbereich",
        blocks: [
          p("(1) Diese Allgemeinen Verkaufsbedingungen gelten für alle über den Online-Shop geschlossenen Verträge zwischen M.K.Design by Markus Klement, Einzelunternehmer, im Wiesengrund 8, 29584 Himbergen OT Groß Thondorf, Telefonnummer 0162/3143590, E-Mail-Adresse MKDesignbyMarkusKlement@web.de (nachfolgend „Verkäufer“) und den Kunden (nachfolgend „Kunde“)."),
          p("(2) Maßgebend ist die jeweils bei Abschluss des Vertrags gültige Fassung der AGB."),
          p("(3) Abweichende Bedingungen des Kunden werden nicht akzeptiert, auch wenn der Verkäufer der Einbeziehung nicht ausdrücklich widerspricht."),
          p("(4) Die AGB gelten sowohl gegenüber Verbrauchern gem. § 13 BGB als auch gegenüber Unternehmern gem. § 14 BGB."),
          p("(5) Der Kunde ist Verbraucher, soweit der Zweck der Bestellung nicht überwiegend seiner gewerblichen oder selbständigen beruflichen Tätigkeit zugerechnet werden kann. Unternehmer ist jede Person oder Gesellschaft, die beim Vertragsschluss in Ausübung ihrer gewerblichen oder selbständigen beruflichen Tätigkeit handelt."),
        ],
      },
      {
        title: "§ 2 Handgefertigte Artikel",
        blocks: [
          p("(1) Der Verkäufer bietet die Herstellung und den Verkauf von Upcycling-Produkten an, darunter insbesondere Feuertonnen, Stehtische und weitere Produkte aus recycelten Materialien. Jedes Produkt ist ein Unikat."),
          p("(2) Alle Artikel im Onlineshop sind handgefertigt, wodurch es zu leichten Abweichungen in Form, Farbe und Größe zwischen den einzelnen Produkten kommen kann. Diese Abweichungen sind charakteristisch für handgefertigte Produkte, stellen keinen Mangel dar und berechtigen nicht zu Reklamationen oder Rücksendungen."),
          p("(3) Durch die handwerkliche Fertigung können Kanten, Astlöcher, kleine Risse, Unebenheiten und Farbveränderungen auftreten, die keinen Mangel darstellen, sondern den einzigartigen Charakter der Produkte ausmachen."),
          p("(4) Die verwendeten recycelten Materialien können aus unterschiedlichen Quellen stammen, was zu weiterer Individualisierung führt. Pflege und Umgang mit den Produkten erfordern besondere Aufmerksamkeit, um deren Langlebigkeit zu gewährleisten."),
          p("(5) Der Kunde wird gebeten, sich vor dem Kauf über Besonderheiten und Pflegehinweise zu informieren, die auf der Website des Verkäufers zur Verfügung stehen. Bei Fragen steht der Kundenservice zur Verfügung."),
        ],
      },
      {
        title: "§ 3 Vertragsschluss",
        blocks: [
          p("(1) Die Präsentation und Bewerbung von Artikeln im Online-Shop stellt kein bindendes Angebot zum Abschluss eines Kaufvertrags dar."),
          p("(2) Kunden wählen Produkte aus und legen sie in den Warenkorb. Über den Button „Kaufen“ geben sie einen verbindlichen Antrag zum Kauf ab. Der Antrag kann nur übermittelt werden, wenn diese Vertragsbedingungen durch Klick akzeptiert wurden."),
          p("(3) Der Verkäufer sendet eine automatische Empfangsbestätigung per E-Mail, die lediglich den Eingang der Bestellung dokumentiert und keine Annahme darstellt. Der Vertrag kommt erst durch eine gesonderte Auftragsbestätigung des Verkäufers zustande. Der Vertragstext wird dem Kunden spätestens bei Lieferung auf einem dauerhaften Datenträger zugesandt."),
          p("Der Vertragsschluss erfolgt in deutscher Sprache."),
        ],
      },
      {
        title: "§ 4 Lieferbedingungen",
        blocks: [
          p("(1) Der Verkäufer ist zu Teillieferungen berechtigt, soweit dies für den Kunden zumutbar ist."),
          p("(2) Lieferzeiten berechnen sich ab dem Zeitpunkt der Auftragsbestätigung, vorherige Zahlung vorausgesetzt (außer bei Rechnungskauf). Ist keine abweichende Lieferzeit angegeben, beträgt sie 3–5 Tage."),
          p("(3) Ist ein bestelltes Produkt zum Bestellzeitpunkt nicht verfügbar, teilt der Verkäufer dies unverzüglich in der Auftragsbestätigung mit. Ist das Produkt dauerhaft nicht lieferbar, kommt kein Vertrag zustande."),
          p("(4) Bei vorübergehender Nichtverfügbarkeit informiert der Verkäufer ebenfalls unverzüglich in der Auftragsbestätigung."),
        ],
      },
      {
        title: "§ 5 Preise und Versandkosten",
        blocks: [
          p("(1) Sämtliche Preisangaben im Online-Shop sind Endpreise inkl. gesetzlicher Umsatzsteuer, ggf. zzgl. anfallender Versandkosten."),
          p("(2) Der Gesamtpreis inkl. Versandkosten wird vor Absenden der Bestellung in der Bestellmaske angezeigt."),
          p("(3) Bei Teillieferungen entstehen dem Kunden nur für die erste Teillieferung Versandkosten, es sei denn, die Teillieferung erfolgt auf Wunsch des Kunden — dann werden die Kosten je Teillieferung berechnet."),
          p("(4) Bei wirksamem Widerruf kann der Kunde unter den gesetzlichen Voraussetzungen die Erstattung bereits gezahlter Hinsendekosten verlangen."),
          p("(5) Der Versand erfolgt per Postversand. Ist der Kunde Verbraucher, trägt der Verkäufer das Versandrisiko."),
          p("(6) Im Falle eines Widerrufs trägt der Kunde die unmittelbaren Kosten der Rücksendung."),
        ],
      },
      {
        title: "§ 6 Zahlungsbedingungen",
        blocks: [
          p("(1) Kunden können per Kreditkarte, PayPal, Klarna Rechnung oder Banküberweisung bezahlen."),
          p("(2) Die im Nutzerkonto gespeicherte Zahlungsart kann jederzeit geändert werden."),
          p("(3) Die Zahlung ist unmittelbar mit Vertragsschluss fällig. Bei Terminversäumnis kommt der Kunde in Verzug und schuldet Verzugszinsen von 5 Prozentpunkten über dem Basiszinssatz (Verbraucher) bzw. 9 Prozentpunkten (Unternehmer)."),
          p("(4) Die Pflicht zur Zahlung von Verzugszinsen schließt die Geltendmachung weiterer Verzugsschäden nicht aus."),
        ],
      },
      {
        title: "§ 7 Eigentumsvorbehalt",
        blocks: [
          p("Die gelieferte Ware bleibt bis zur vollständigen Bezahlung des Kaufpreises im Eigentum des Verkäufers."),
        ],
      },
      {
        title: "§ 8 Gewährleistung",
        blocks: [
          p("(1) Der Verkäufer haftet für Sach- oder Rechtsmängel nach den gesetzlichen Vorschriften (§§ 434 ff. BGB). Die Verjährungsfrist beträgt zwei Jahre ab Ablieferung; gegenüber Unternehmern zwölf Monate."),
          p("(2) Etwaige Garantien treten neben die gesetzlichen Gewährleistungsansprüche und erweitern oder beschränken diese nicht. Details ergeben sich aus den jeweiligen Garantiebedingungen."),
          p("(3) Abweichungen und natürliche Merkmale handgefertigter Artikel — etwa Unterschiede in Form, Farbe, Größe, Maserung, Astlöcher oder kleine Risse — stellen keinen Mangel dar und berechtigen nicht zu Gewährleistungsansprüchen."),
          p("(4) Tischplatten aus Terrassendielen sind mit Bootslack behandelt. Der Kunde ist verpflichtet, den Bootslack regelmäßig zu erneuern; Schäden durch unterlassene oder unsachgemäße Pflege stellen keinen Mangel dar."),
        ],
      },
      {
        title: "§ 9 Haftung",
        blocks: [
          p("(1) Ansprüche des Kunden auf Schadensersatz sind ausgeschlossen, außer bei Verletzung von Leben, Körper oder Gesundheit, bei Verletzung wesentlicher Vertragspflichten (Kardinalpflichten) oder bei vorsätzlichem bzw. grob fahrlässigem Verhalten des Verkäufers."),
          p("(2) Bei Verletzung wesentlicher Vertragspflichten durch einfache Fahrlässigkeit haftet der Verkäufer nur auf den vertragstypischen, vorhersehbaren Schaden."),
          p("(3) Der Kunde ist verpflichtet, die Pflegehinweise auf der Verkäufer-Website zu beachten, insbesondere zur regelmäßigen Erneuerung des Bootslacks. Der Verkäufer haftet nicht für Schäden durch unterlassene oder unsachgemäße Pflege."),
          p("(4) Der Verkäufer haftet nicht für Schäden durch unsachgemäße Lagerung, etwa bei hoher Temperatur oder Luftfeuchtigkeit."),
          p("(5) Der Kunde muss Hinweise zur Verwendung hitzefester Lacke und zu Sicherheitsabständen beachten; der Verkäufer haftet nicht für Schäden durch Missachtung dieser Hinweise."),
          p("(6) Die Haftungsbeschränkungen gelten auch zugunsten der gesetzlichen Vertreter und Erfüllungsgehilfen des Verkäufers."),
          p("(7) Die Haftungsbeschränkungen gelten nicht, soweit der Verkäufer einen Mangel arglistig verschwiegen oder eine Garantie übernommen hat; die Vorschriften des Produkthaftungsgesetzes bleiben unberührt."),
        ],
      },
      {
        title: "§ 10 Datenschutz",
        blocks: [
          p("Detaillierte Informationen zum Datenschutz, zum Umfang der Datenverarbeitung und zu Ihren gesetzlichen Rechten finden Sie in unserer Datenschutzerklärung."),
        ],
      },
      {
        title: "§ 11 Urheberrechte",
        blocks: [
          p("Der Verkäufer hat an allen im Online-Shop veröffentlichten Bildern, Filmen und Texten die Urheberrechte. Eine Verwendung ist ohne ausdrückliche Zustimmung des Verkäufers nicht gestattet."),
        ],
      },
      {
        title: "§ 12 Gesetzliches Widerrufsrecht für Verbraucher",
        blocks: [
          sub("Widerrufsrecht"),
          p("Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen. Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag, an dem Sie oder ein von Ihnen benannter Dritter die Waren in Besitz genommen haben."),
          p("Um Ihr Widerrufsrecht auszuüben, müssen Sie uns — M.K.Design by Markus Klement, im Wiesengrund 8, 29584 Himbergen OT Groß Thondorf, Telefon 0162/3143590, E-Mail MKDesignbyMarkusKlement@web.de — mittels einer eindeutigen Erklärung über Ihren Entschluss informieren. Sie können dafür das Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist."),
          p("Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung vor Ablauf der Frist absenden."),
          sub("Folgen des Widerrufs"),
          p("Wenn Sie widerrufen, erstatten wir Ihnen alle Zahlungen einschließlich der Lieferkosten (mit Ausnahme zusätzlicher Kosten durch eine andere als die günstigste Standardlieferung) unverzüglich, spätestens binnen vierzehn Tagen ab Eingang der Widerrufsmitteilung. Wir verwenden dasselbe Zahlungsmittel wie bei der ursprünglichen Transaktion, sofern nichts anderes vereinbart wurde; Entgelte fallen dafür nicht an. Die Rückzahlung kann verweigert werden, bis die Ware zurückerhalten wurde oder der Nachweis der Rücksendung erbracht ist."),
          p("Sie haben die Waren unverzüglich, spätestens binnen vierzehn Tagen ab Mitteilung des Widerrufs, zurückzusenden. Die Frist ist gewahrt, wenn Sie die Waren vor Fristablauf absenden. Sie tragen die unmittelbaren Kosten der Rücksendung. Für einen etwaigen Wertverlust müssen Sie nur aufkommen, wenn dieser auf einen zur Prüfung nicht notwendigen Umgang zurückzuführen ist."),
          sub("Ausschluss des Widerrufsrechts"),
          p("Das Widerrufsrecht besteht nicht bei folgenden Verträgen:"),
          list([
            "Lieferung von Waren, die nicht vorgefertigt sind und für deren Herstellung eine individuelle Auswahl oder Bestimmung durch den Verbraucher maßgeblich ist oder die eindeutig auf dessen persönliche Bedürfnisse zugeschnitten sind",
            "Lieferung schnell verderblicher Waren oder solcher mit schnell überschrittenem Verfallsdatum",
            "Lieferung versiegelter Waren, die aus Gründen des Gesundheitsschutzes oder der Hygiene nicht zur Rückgabe geeignet sind, wenn die Versiegelung nach Lieferung entfernt wurde",
            "Lieferung von Waren, die nach Lieferung untrennbar mit anderen Gütern vermischt wurden",
            "Lieferung alkoholischer Getränke mit bei Vertragsschluss vereinbartem Preis, deren Lieferung frühestens 30 Tage später erfolgt und deren Wert von Marktschwankungen abhängt",
            "Lieferung von Ton-/Videoaufnahmen oder Software in versiegelter Packung, wenn die Versiegelung entfernt wurde",
            "Lieferung von Zeitungen, Zeitschriften oder Illustrierten (außer Abonnement-Verträge)",
            "Lieferung von Waren, deren Preis von Finanzmarktschwankungen abhängt, auf die der Unternehmer keinen Einfluss hat",
          ]),
          sub("Muster-Widerrufsformular"),
          p("(Wenn Sie den Vertrag widerrufen wollen, füllen Sie bitte dieses Formular aus und senden Sie es zurück.)"),
          p("An: M.K.Design by Markus Klement, Einzelunternehmer, im Wiesengrund 8, 29584 Himbergen OT Groß Thondorf, E-Mail: MKDesignbyMarkusKlement@web.de"),
          list([
            "Hiermit widerrufe(n) ich/wir den von mir/uns abgeschlossenen Vertrag über den Kauf der folgenden Waren / die Erbringung der folgenden Dienstleistung",
            "Bestellt am / erhalten am",
            "Name des/der Verbraucher(s)",
            "Anschrift des/der Verbraucher(s)",
            "Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier)",
            "Datum",
          ]),
        ],
      },
      {
        title: "§ 13 Anwendbares Recht und Gerichtsstand",
        blocks: [
          p("(1) Der Verkäufer ist zu einer Teilnahme an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle nicht bereit oder verpflichtet."),
          p("(2) Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts. Hat der Kunde als Verbraucher bestellt und seinen gewöhnlichen Aufenthalt in einem anderen Land, bleibt die Anwendung zwingender Rechtsvorschriften dieses Landes unberührt."),
          p("(3) Ist der Kunde Kaufmann mit Sitz in Deutschland, ist ausschließlicher Gerichtsstand der Sitz des Verkäufers. Im Übrigen gelten die anwendbaren gesetzlichen Bestimmungen."),
          p("(4) Der Vertrag bleibt auch bei rechtlicher Unwirksamkeit einzelner Punkte im Übrigen verbindlich; an die Stelle unwirksamer Punkte treten die gesetzlichen Vorschriften, soweit vorhanden."),
        ],
      },
    ],
  },
];
