//Variablen zum setzten der Spielverzögerung
let verzögerung = 40;
let jetzt = null;
let dann = null;
let delta = null;

//Variablen zum Einstallen des Spiels
let spielfeld = 600;
let highscore = 10;
let canva = null;
let context = null;
let refreshId = null;

//Variablen für die Schlange
let kopfX = Math.floor(spielfeld / 2);
let kopfY = Math.floor(spielfeld / 2);
let dicke = 10;
let schritte = 10;
let laufeX = -schritte;
let laufeY = 0;
let startLaenge = 10;
let laenge = startLaenge;
let schwanz = [];

//Variablen des Apfels
let apfelX = 0;
let apfelY = 0;

//Wenn die Seite geladen ist:
window.addEventListener("load", () => {
  //Stop-Knopf verbergen
  document.getElementById("stop").style.display = "none";

  //Setzte die aktuelle Länge der Schlange
  document.getElementById("laenge").innerHTML = laenge;

  //Setzte den Highscore
  document.getElementById("highscore").innerHTML = highscore;

  //add EventListener to the button start
  document.getElementById("start").addEventListener("click", starteSpiel);

  //add EventListener to the button stop
  document.getElementById("stop").addEventListener("click", beendeSpiel);

  //add EventListener to the button plus
  document.getElementById("plus").addEventListener("click", plusGeschwindigkeit);

  //add EventListener to the button minus
  document.getElementById("minus").addEventListener("click", minusGeschwindigkeit);
});

let beendeSpiel = () => {

  //Verberge den Stop-Knopf und zeige den Start-Knopf
  document.getElementById("stop").style.display = "none";
  document.getElementById("start").style.display = "inline";

  //zeige das Schlangen-Bild
  document.getElementById("snakePreStart").style.display = "inline";

  //context.fillStyle = "white";
  //context.fillRect(0, 0, spielfeld, spielfeld);
  canva = null;
  context = null;

  //Setzte die Variablen auf den intialen Wert
  kopfX = spielfeld / 2;
  kopfY = spielfeld / 2;
  laenge = startLaenge;
  schritte = 10;
  laufeX = -schritte;
  laufeY = 0;
  schwanz = [];

  //refresche das Canvas Element
  window.cancelAnimationFrame(refreshId);

  //verberge das Canvas Element
  document.getElementById("canvasSnake").style.display = "none";
}

let starteSpiel = () => {
  //Verberge den Start-Knopf und zeigen den Stop-Knopf
  document.getElementById("start").style.display = "none";
  document.getElementById("stop").style.display = "inline";

  //Verberge das StartBild
  document.getElementById("snakePreStart").style.display = "none";

  //Lass die Grafik (Hintergrund) zeichnen
  canva = document.getElementById("canvasSnake");
  context = canva.getContext("2d");
  document.addEventListener("keydown", wechsleRichtung);
  document.getElementById("canvasSnake").style.display = "inline";

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

    //füege aktuellen Kopf dem Schwanz hinzu
    schwanz.push({
      x: kopfX,
      y: kopfY
    });

    //Falls der Schwanz länger ist als die Länge, lösche ein Element
    while (schwanz.length > laenge) {
      schwanz.shift();
    }

    //wenn der Apfel gegessen wurde
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

    //Apfel zeichnen:
    context.fillStyle = "red";
    context.fillRect(apfelX, apfelY, dicke, dicke);

  }

  //Die Anzeige der Länge aktualisieren
  document.getElementById("laenge").innerHTML = laenge;

  //Setzte highscore
  if (laenge >= highscore) {
    highscore = laenge;
  }
  let hAlt = parseInt(document.getElementById("highscore").innerHTML);

  if (hAlt < highscore) {
    document.getElementById("highscore").innerHTML = highscore;
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

  //rufe die Funktion wieder auf
  refreshId = window.requestAnimationFrame(spiele);
}

let wechsleRichtung = (e) => {
  switch (e.keyCode) {
    //Pfeiltaste nach links
    case 37:
      if(laufeX === schritte){
        break;
      }
      laufeX = -schritte;
      laufeY = 0;
      break;
    //Pfeiltaste nach oben
    case 38:
      if(laufeY === schritte){
        break;
      }
      laufeX = 0;
      laufeY = -schritte;
      break;
    //Pfeiltaste nach rechts
    case 39:
      if(laufeX === -schritte){
        break;
      }
      laufeX = schritte;
      laufeY = 0;
      break;
    //Pfeiltaste nach unten
    case 40:
      if(laufeY === -schritte){
        break;
      }
      laufeX = 0;
      laufeY = schritte;
      break;
  }
}

let plusGeschwindigkeit = () => {
  verzögerung = Math.max(Math.min(60, verzögerung - 10), 20);
  window.cancelAnimationFrame(refreshId);
  refreshId = window.requestAnimationFrame(spiele);
}

let minusGeschwindigkeit = () => {
  verzögerung = Math.max(Math.min(60, verzögerung + 10), 20);
  window.cancelAnimationFrame(refreshId);
  refreshId = window.requestAnimationFrame(spiele);
}
