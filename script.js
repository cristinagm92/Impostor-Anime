let jugadores = [];
let jugadorActual = 0;
let rolVisible = false;
let ronda = 1;

/* ============================
   SONIDO GLOBAL
   ============================ */

let sonidoActivo = localStorage.getItem("sonido") !== "off";

document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("btnSonido");
    if (btn) btn.innerText = sonidoActivo ? "🔊" : "🔇";
});

function toggleSonido() {
    sonidoActivo = !sonidoActivo;
    localStorage.setItem("sonido", sonidoActivo ? "on" : "off");

    const btn = document.getElementById("btnSonido");
    if (btn) btn.innerText = sonidoActivo ? "🔊" : "🔇";

    const sonido = document.getElementById("sonidoRol");

    // Si se apaga el sonido, detener audio inmediatamente
    if (!sonidoActivo) {
        sonido.pause();
        sonido.currentTime = 0;
    }
}

/* ============================
   PALABRAS Y PISTAS
   ============================ */

const palabrasRonda = [
    "Eren","Kamehameha","Doraemon","Charizar","Kakashi","Namek",
    "Retumbar","Digievolución","Megumi","Pochita","Dorayaki","Draken",
    "Naruto","Death Note","Bachira","Tokito","Turbo vieja","Ghoul",
    "Zoro","Akaza","Potara","Senku","Oliver/Tsubasa","Shoto Todoroki",
    "Pokeball","Black Clover","Boticaria","Aizawa","Ryuk","Erwin",
    "Aldea de la hoja","Team Rocket","Caballeros del zodiaco","Nana",
    "Kisaki","Zeno","Mewtwo","Fruta del diablo","Titán fundador","Sukuna"
];

const pistasRonda = [
    "mar","energía","azul","dragón","ojo","verde",
    "golpear","mejora","sombras","cortar","dulce","delincuente",
    "bestia","intelecto","regate","nube","vehículo antiguo","monstruo",
    "espadas","luna","objeto","crear","partido","dual",
    "objeto","magia","ungüento","profesor","divino","liderazgo",
    "lugar","villanos","armadura","mujeres",
    "celos","Dragon Ball","creación","comida","enorme","poderoso"
];

/* ============================
   LÓGICA DEL JUEGO
   ============================ */

function iniciarJuego() {
    const numJugadores = parseInt(document.getElementById("numJugadores").value);
    const numImpostores = parseInt(document.getElementById("numImpostores").value);

    if (!numJugadores || numImpostores >= numJugadores) return;

    let palabraNormal = palabrasRonda[ronda - 1];
    let pistaImpostor = pistasRonda[ronda - 1];

    jugadores = Array(numJugadores).fill(palabraNormal);

    let asignados = 0;
    while (asignados < numImpostores) {
        const i = Math.floor(Math.random() * numJugadores);
        if (jugadores[i] === palabraNormal) {
            jugadores[i] = `Impostor (pista: ${pistaImpostor})`;
            asignados++;
        }
    }

    jugadorActual = 0;
    rolVisible = false;

    document.getElementById("inicio").classList.add("oculto");
    document.getElementById("juego").classList.remove("oculto");
    document.getElementById("final").classList.add("oculto");

    prepararJugador();
}

function prepararJugador() {
    document.getElementById("jugadorTexto").innerText =
        `Jugador ${jugadorActual + 1}`;

    document.getElementById("rolTexto").innerText = "Toca para ver tu rol";
    document.getElementById("btnSiguiente").classList.add("oculto");
    rolVisible = false;
}

function mostrarRol() {
    const rolTexto = document.getElementById("rolTexto");
    const sonido = document.getElementById("sonidoRol");
    const rolReal = jugadores[jugadorActual];

    if (!rolVisible) {

        // Mostrar impostor en rojo
        if (rolReal.startsWith("Impostor")) {
            rolTexto.innerHTML = `<span style="color:red; font-weight:bold;">${rolReal}</span>`;
        } else {
            rolTexto.innerHTML = rolReal;
        }

        // Reproducir sonido si está activo
        if (sonidoActivo) {
            sonido.currentTime = 0;
            sonido.play();
        }

        rolVisible = true;

    } else {
        rolTexto.innerText = "Pasa el móvil al siguiente jugador";
        document.getElementById("btnSiguiente").classList.remove("oculto");
    }
}

function siguienteJugador() {
    jugadorActual++;

    if (jugadorActual < jugadores.length) {
        prepararJugador();
    } else {
        mostrarFinal();
    }
}

function mostrarFinal() {
    document.getElementById("juego").classList.add("oculto");
    document.getElementById("final").classList.remove("oculto");

    const lista = document.getElementById("listaJugadores");
    lista.innerHTML = "";

    jugadores.forEach((rol, index) => {
        const li = document.createElement("li");

        li.innerText = `Jugador ${index + 1}`;

        li.onclick = () => {
            const esImpostor = rol.startsWith("Impostor");

            li.innerHTML = `Jugador ${index + 1} → 
                <span style="color:${esImpostor ? "red" : "green"}; font-weight:bold;">
                    ${esImpostor ? "Impostor" : "Buena gente"}
                </span>`;

            // Vibración si es impostor
            if (esImpostor && navigator.vibrate) {
                navigator.vibrate(200);
            }
        };

        lista.appendChild(li);
    });

    let btnSiguienteRonda = document.createElement("button");
    btnSiguienteRonda.style.marginTop = "20px";

    if (ronda < palabrasRonda.length) {
        btnSiguienteRonda.innerText = `Ronda ${ronda + 1}`;
        btnSiguienteRonda.onclick = () => {
            ronda++;
            iniciarJuego();
        };
    } else {
        btnSiguienteRonda.innerText = "Reiniciar Juego";
        btnSiguienteRonda.onclick = () => {
            ronda = 1;
            document.getElementById("final").classList.add("oculto");
            document.getElementById("inicio").classList.remove("oculto");
        };
    }

    document.getElementById("final").appendChild(btnSiguienteRonda);
}

function irARonda() {
    const select = document.getElementById("selectRonda");
    const valor = parseInt(select.value);

    if (!valor || valor < 1 || valor > palabrasRonda.length) return;

    ronda = valor;

    document.getElementById("inicio").classList.add("oculto");
    document.getElementById("juego").classList.remove("oculto");
    document.getElementById("final").classList.add("oculto");

    iniciarJuego();
}
