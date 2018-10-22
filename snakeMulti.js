//Variablen zum setzten der Spielverzögerung
let verzögerung = 40;
let jetzt = null;
let dann = null;
let delta = null;

//Variablen zum Einstallen des Spiels
let spielfeld = 600;
let highscore = 10;
let highscore2 = 10;
let canva = null;
let context = null;
let refreshId = null;

//Variablen für die Schlange
let dicke = 10;
let kopfX = Math.floor(spielfeld / 2);
let kopfY = Math.floor(spielfeld / 2);
let kopfX2 = Math.floor((spielfeld + 2 * dicke) / 2);
let kopfY2 = Math.floor((spielfeld + 2 * dicke) / 2);
let schritte = 10;
let laufeX = -schritte;
let laufeY = 0;
let laufeX2 = +schritte;
let laufeY2 = 0;
let startLaenge = 10;
let laenge = startLaenge;
let laenge2 = 10;
let schwanz = [];
let schwanz2 = [];

//Variablen des Apfels
let apfelX = 0;
let apfelY = 0;

//Wenn die Seite geladen ist:
window.addEventListener("load", () => {
  //Stopp-Knopf verbergen
  document.getElementById("stopp").style.display = "none";

  //Setzte die aktuelle Länge der Schlange
  document.getElementById("laenge").innerHTML = laenge;

  //Setzte die aktuelle Länge der Schlange2
  document.getElementById("laenge2").innerHTML = laenge2;

  //Setzte den Highscore der Schlange
  document.getElementById("h1").innerHTML = highscore;

  //Setzte den Highscore der Schlange2
  document.getElementById("h2").innerHTML = highscore2;

  //add EventListener to the button start
  document.getElementById("start").addEventListener("click", starteSpiel);

  //add EventListener to the button stopp
  document.getElementById("stopp").addEventListener("click", beendeSpiel);
});

let beendeSpiel = () => {
  //Verberge den Stopp-Knopf und zeige den Start-Knopf
  document.getElementById("stopp").style.display = "none";
  document.getElementById("start").style.display = "inline";

  //Beende das Spiel
  context.fillStyle = "white";
  context.fillRect(0, 0, spielfeld, spielfeld);
  canva = null;
  context = null;

  //Setzte die Variablen auf den intialen Wert
  kopfX = spielfeld / 2;
  kopfY = spielfeld / 2;
  kopfX2 = Math.floor((spielfeld + 2 * dicke) / 2);
  kopfY2 = Math.floor((spielfeld + 2 * dicke) / 2);
  laenge = startLaenge;
  laenge2 = startLaenge;
  schritte = 10;
  laufeX = -schritte;
  laufeY = 0;
  laufeX2 = +schritte;
  laufeY2 = 0;
  schwanz = [];
  schwanz2 =[];

  //refresche das Canvas Element
  window.cancelAnimationFrame(refreshId);

}

let starteSpiel = () => {
  //Verberge den Start-Knopf und zeigen den Stopp-Knopf
  document.getElementById("start").style.display = "none";
  document.getElementById("stopp").style.display = "inline";

  //Lass die Grafik (Hintergrund) zeichnen
  canva = document.getElementById("canvasSnake");
  context = canva.getContext("2d");
  document.addEventListener("keydown", wechsleRichtung);

  //starte die Funktion, die immer wieder ausgeführt wird
  refreshId = window.requestAnimationFrame(spiele);

  //Eine While-Schleife, damit falls der Apfel zufällig im Rahmen liegt,
  // er neu ermittelt wird
  //solange der Apfel nicht innerhalb des Spielfeldes ist, muss er neu positioniert werden
  while (apfelX < 10 || apfelX >= spielfeld - 10 || apfelY < 10 || apfelY >= spielfeld - 10) {
    apfelX = Math.floor(Math.random() * spielfeld / dicke) * dicke;
    apfelY = Math.floor(Math.random() * spielfeld / dicke) * dicke;
  }
}

let spiele = () => {

  //Setzte die Variablen für die Zeit
  jetzt = Date.now();
  delta = jetzt - dann;

  if (delta > verzögerung) {
    dann = jetzt - (delta % verzögerung);

    // Logik des Spiels:

    //Wohin läuft die Schlange
    kopfX += laufeX;
    kopfY += laufeY;

    //Wohin läuft die Schlange 2
    kopfX2 += laufeX2;
    kopfY2 += laufeY2;
    console.log(kopfX2);
    console.log(kopfY2);

    //schwarzer Hintergrund
    context.fillStyle = "black";
    context.fillRect(0, 0, spielfeld, spielfeld);

    //Umrandung
    context.fillStyle = "rgb(108, 47, 7)";
    context.fillRect(0, 0, spielfeld, 10);
    context.fillStyle = "rgb(108, 47, 7)";
    context.fillRect(0, 0, 10, spielfeld);
    context.fillStyle = "rgb(108, 47, 7)";
    context.fillRect(0, spielfeld - 10, spielfeld, spielfeld);
    context.fillStyle = "rgb(108, 47, 7)";
    context.fillRect(spielfeld - 10, 0, spielfeld, spielfeld);

    //Schlange
    context.fillStyle = "lime";
    for (let i = 0; i < schwanz.length; i++) {
      context.fillRect(schwanz[i].x, schwanz[i].y, dicke, dicke);
      //Falls der Kopf sich selbst berührt
      if (schwanz[i].x === kopfX && schwanz[i].y == kopfY) {
        laenge = startLaenge;
      }
    }

    //Schlange 2
    context.fillStyle = "orange";
    for (let i = 0; i < schwanz2.length; i++) {
      context.fillRect(schwanz2[i].x, schwanz2[i].y, dicke, dicke);
      //Falls der Kopf sich selbst berührt
      if (schwanz2[i].x === kopfX2 && schwanz2[i].y == kopfY2) {
        laenge2 = startLaenge;
      }
    }

    //füege aktuellen Kopf dem Schwanz hinzu
    schwanz.push({
      x: kopfX,
      y: kopfY
    });

    //füege aktuellen Kopf dem Schwanz2 hinzu
    schwanz2.push({
      x: kopfX2,
      y: kopfY2
    });


    //Falls der Schwanz länger ist als die Länge, lösche ein Element
    while (schwanz.length > laenge) {
      schwanz.shift();
    }

    //Falls der Schwanz2 länger ist als die Länge, lösche ein Element
    while (schwanz2.length > laenge2) {
      schwanz2.shift();
    }


    //wenn der Apfel von Schlange 1 gegessen wurde
    if (apfelX === kopfX && apfelY === kopfY) {
      //Update die Länge der Schlange
      laenge++;
      //Apfel erst auf 0 gesetzt, dass ein neuer zufälliger Wert gewürfelt wird
      //Eine While-Schleife, damit falls der Apfel zufällig im Rahmen liegt,
      // er neu ermittelt wird
      apfelX = 0;
      apfelY = 0;
      while (apfelX < 10 || apfelX >= spielfeld - 10 || apfelY < 10 || apfelY >= spielfeld - 10) {
        apfelX = Math.floor(Math.random() * spielfeld / dicke) * dicke;
        apfelY = Math.floor(Math.random() * spielfeld / dicke) * dicke;

      }
    }

    //wenn der Apfel von Schlange 2 gegessen wurde
    if (apfelX === kopfX2 && apfelY === kopfY2) {
      //Update die Länge der Schlange
      laenge2++;
      //Apfel erst auf 0 gesetzt, dass ein neuer zufälliger Wert gewürfelt wird
      //Eine While-Schleife, damit falls der Apfel zufällig im Rahmen liegt,
      // er neu ermittelt wird
      apfelX = 0;
      apfelY = 0;
      while (apfelX < 10 || apfelX >= spielfeld - 10 || apfelY < 10 || apfelY >= spielfeld - 10) {
        apfelX = Math.floor(Math.random() * spielfeld / dicke) * dicke;
        apfelY = Math.floor(Math.random() * spielfeld / dicke) * dicke;

      }
    }

    //Apfel zeichnen:
    context.fillStyle = "red";
    context.fillRect(apfelX, apfelY, dicke, dicke);

    //Die Anzeige der Länge aktualisieren
    document.getElementById("laenge").innerHTML = laenge;

    //Die Anzeige der Länge2 aktualisieren
    document.getElementById("laenge2").innerHTML = laenge2;

    //Setzte highscore
    if (laenge >= highscore) {
      highscore = laenge;
    }
    let hAlt = parseInt(document.getElementById("h1").innerHTML);

    if (hAlt < highscore) {
      document.getElementById("h1").innerHTML = highscore;
    }

    //Setzte highscore2
    if (laenge2 >= highscore2) {
      highscore2 = laenge2;
    }
    let hAlt2 = parseInt(document.getElementById("h2").innerHTML);

    if (hAlt2 < highscore2) {
      document.getElementById("h2").innerHTML = highscore2;
    }

    // Snake darf den Rand nicht berühren
    if (kopfX < 10) {
      beendeSpiel();
    }
    if (kopfX >= spielfeld - 10) {
      beendeSpiel();
    }
    if (kopfY < 10) {
      beendeSpiel();
    }
    if (kopfY >= spielfeld - 10) {
      beendeSpiel();
    }

    // Snake2 darf den Rand nicht berühren
    if (kopfX2 < 10) {
      beendeSpiel();
    }
    if (kopfX2 >= spielfeld - 10) {
      beendeSpiel();
    }
    if (kopfY2 < 10) {
      beendeSpiel();
    }
    if (kopfY2 >= spielfeld - 10) {
      beendeSpiel();
    }

  }
  //rufe die Funktion wieder auf
  refreshId = window.requestAnimationFrame(spiele);
}

let wechsleRichtung = (e) => {
  switch (e.keyCode) {
    //Pfeiltaste nach links
    case 37:
      laufeX = -schritte;
      laufeY = 0;
      break;
    //Pfeiltaste nach oben
    case 38:
      laufeX = 0;
      laufeY = -schritte;
      break;
    //Pfeiltaste nach rechts
    case 39:
      laufeX = schritte;
      laufeY = 0;
      break;
    //Pfeiltaste nach unten
    case 40:
      laufeX = 0;
      laufeY = schritte;
      break;
    //Pfeiltaste nach links2
    case 65:
      laufeX2 = -schritte;
      laufeY2 = 0;
      break;
    //Pfeiltaste nach oben2
    case 87:
      laufeX2 = 0;
      laufeY2 = -schritte;
      break;
    //Pfeiltaste nach rechts2
    case 68:
      laufeX2 = schritte;
      laufeY2 = 0;
      break;
    //Pfeiltaste nach unten2
    case 83:
      laufeX2 = 0;
      laufeY2 = schritte;
      break;
  }
}
