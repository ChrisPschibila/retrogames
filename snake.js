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
let kopfX = Math.floor(spielfeld/2);
let kopfY = Math.floor(spielfeld/2);
let dicke = 10;
let schritte = 10;
let laufeX = -schritte;
let laufeY = 0;
let startLaenge = 10;
let laenge = startLaenge;
let schwanz = [];

//Variablen des Apfels
//Eine While-Schleife, damit falls der Apfel zufällig im Rahmen liegt,
// er neu ermittelt wird
let apfelX = 0;
let apfelY = 0;

//Wenn die Seite geladen ist:
window.addEventListener("load", () => {
  //Stopp-Knopf verbergen
  document.getElementById("stopp").style.display = "none";

  //Setzte die aktuelle Länge der Schlange
  document.getElementById("laenge").innerHTML = laenge;

  //Setzte den Highscore
  document.getElementById("highscore").innerHTML = highscore;

  //add EventListener to the button start
  document.getElementById("start").addEventListener("click", starteSpiel);

  //add EventListener to the button stopp
  document.getElementById("stopp").addEventListener("click", beendeSpiel);


  });

let beendeSpiel = () => {
}

let starteSpiel = () => {
  //Verberge den Start-Knopf und zeigen den Stopp-Knopf
  document.getElementById("start").style.display = "none";
  document.getElementById("stopp").style.display = "inline";

  //Verberge das StartBild
  document.getElementById("snakePreStart").style.display = "none";

  //Lass die Grafik (Hintergrund) zeichnen
  canva = document.getElementById("canvasSnake");
  context = canva.getContext("2d");
  document.addEventListener("keydown", wechsleRichtung);

  //starte die Funktion, die immer wieder ausgeführt wird
  refreshId = window.requestAnimationFrame(spiele);

  //solange der Apfel nicht innerhalb des Spielfeldes ist, muss er neu positioniert werden
  while(apfelX < 10 || apfelX >= spielfeld - 10 || apfelY < 10 || apfelY >= spielfeld -10){
  apfelX = Math.floor(Math.random()*spielfeld);
  apfelY = Math.floor(Math.random()*spielfeld);
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
    context.fillRect(0,0,spielfeld,spielfeld);

    //Schlange
    context.fillStyle = "lime";
    for(let i=0; i < schwanz.length; i++){
      context.fillRect(schwanz[i].x,schwanz[i].y,dicke,dicke);
      //Falls der Kopf sich selbst berührt
      if(schwanz[i].x === kopfX && schwanz[i].y == kopfY){
        laenge = startLaenge;
      }
    }

    //füege aktuellen Kopf dem Schwanz hinzu
    schwanz.push({x:kopfX,y:kopfY});
    //Falls der Schwanz länger ist als die Länge, lösche ein Element
    while(schwanz.length > laenge){
      schwanz.shift();
    }

    //Apfel zeichnen:
    context.fillStyle = "red";
    context.fillRect(apfelX, apfelY, dicke, dicke);

  }

  //rufe die Funktion wieder auf
  refreshId = window.requestAnimationFrame(spiele);
}

let wechsleRichtung = (e) => {
  switch(e.keyCode){
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
  }
}
