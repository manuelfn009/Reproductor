const img = document.querySelector("img");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const duration = document.getElementById("duration");
const music = document.querySelector("audio");
const prevBtn = document.getElementById("prev");
const playBtn = document.getElementById("play");
const nextBtn = document.getElementById("next");
const shuffleBtn = document.getElementById("shuffle");
const repeatBtn = document.getElementById("repeat");
const audio = document.querySelector("audio");
const progressContainer = document.getElementById("progress-container");
const progress = document.getElementById("progress");
const currentTime = document.getElementById("current-time");

// Array of songs
let songs = [
  {
    name: "un verano sin ti",
    displayName: "Un verano sin ti",
    artist: "Bad Bunny",
  },
  {
    name: "Policía y Ladrón",
    displayName: "Policía y ladrón(Remix)",
    artist: "Maka",
  },
  {
    name: "Fruto",
    displayName: "Fruto",
    artist: "Milo J",
  },
  {
    name: "Besos",
    displayName: "Besos",
    artist: "Kidd Keo, Neelo",
  },
  {
    name: "Kemba Walker",
    displayName: "Kemba Walker",
    artist: "Eladio Carrión, Bad Bunny",
  },
  {
    name: "ElMen2",
    displayName: "El Men 2",
    artist: "La Tankeria, El Yordy DK, Michel Boutic",
  },
  {
    name: "Telefono",
    displayName: "TELEFONO NUEVO",
    artist: "Bad Bunny, Luar La L",
  },
  {
    name: "ElMambo",
    displayName: "El Mambo",
    artist: "Kiko Rivera",
  },
  {
    name: "ArenaSal",
    displayName: "Arena y Sal",
    artist: "Omar Montes, Saiko, Tunvao",
  },
];

// Check if playing
let isPlaying = false;

// Play music
function playMusic() {
  music.play();
  isPlaying = true;
  playBtn.classList.replace("fa-play", "fa-pause");
  playBtn.setAttribute("title", "pause");
}

// Pause music
function pauseMusic() {
  music.pause();
  isPlaying = false;
  playBtn.classList.replace("fa-pause", "fa-play");
  playBtn.setAttribute("title", "play");
}

playBtn.addEventListener("click", () =>
  isPlaying ? pauseMusic() : playMusic()
);

// Updata DOM
function loadSong(song) {
  title.textContent = song.displayName;
  artist.textContent = song.artist;
  duration.textContent = song.duration;
  music.src = `./MUSIC/${song.name}.mp3`;
  img.src = `./IMG/${song.name}.png`;
}
let songIndex = 0;
loadSong(songs[songIndex]);

function nextSong() {
  songIndex++;
  if (songIndex > songs.length - 1) {
    songIndex = 0;
  }
  loadSong(songs[songIndex]);
  playMusic();
}
function prevSong() {
  songIndex--;
  if (songIndex < 0) {
    songIndex = songs.length - 1;
  }
  loadSong(songs[songIndex]);
  playMusic();
}

nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);

document.addEventListener("DOMContentLoaded", function () {
  progressContainer.addEventListener("click", setProgress);
  audio.addEventListener("timeupdate", updateProgressBar);

  function setProgress(e) {
    const totalWidth = progressContainer.clientWidth;
    const clickX = e.clientX - progressContainer.getBoundingClientRect().left;
    const newTime = (clickX / totalWidth) * audio.duration;
    audio.currentTime = newTime;
  }

  function updateProgressBar() {
    const { currentTime: currentTimeValue, duration: durationValue } = audio;
    const progressPercent = (currentTimeValue / durationValue) * 100;

    currentTime.textContent = formatTime(currentTimeValue);
    duration.textContent = formatTime(durationValue);
    progress.style.width = progressPercent + "%";
  }

  function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }
});
let isShuffleOn = false;
let originalOrder = songs.slice(); // Almacena una copia del orden original

let isRepeatOn = false; // Variable para rastrear el estado de repetición


// Manejador de clic para el botón "repeat"
repeatBtn.addEventListener("click", () => {
  isRepeatOn = !isRepeatOn;
  repeatBtn.classList.toggle("active", isRepeatOn); // Cambia la apariencia del botón
});

// Evento para la reproducción de la siguiente canción
audio.addEventListener("ended", () => {
  if (isRepeatOn) {
    // Si la repetición está activada, vuelve al principio de la canción
    music.currentTime = 0;
    playMusic(); // Asegúrate de que la canción se reproduzca nuevamente
  } else {
    // De lo contrario, avanza a la siguiente canción
    nextSong();
  }
});
const songList = document.getElementById("song-list");

songList.addEventListener("click", (e) => {
  e.preventDefault();
  if (e.target.tagName === "A") {
    const songIndex = parseInt(e.target.getAttribute("data-index"), 10);
    loadSong(songs[songIndex]);
    playMusic();
  }
});
function createSongList(shuffleActive) {
  songList.innerHTML = ""; // Limpia la lista

  songs.forEach((song, index) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = "#";
    a.textContent = `${song.displayName} - ${song.artist}`;
    a.setAttribute("data-index", index);

    if (shuffleActive) {
      a.disabled = true;
    }

    li.appendChild(a);
    songList.appendChild(li);
  });
}

// Llamada inicial para crear la lista de canciones
createSongList(isShuffleOn);

function shuffleSongs() {
  for (let i = songs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [songs[i], songs[j]] = [songs[j], songs[i]];
  }
}
// Manejador de clics para el botón "Shuffle"
shuffleBtn.addEventListener("click", () => {
  isShuffleOn = !isShuffleOn;
  shuffleBtn.classList.toggle("active", isShuffleOn);

  if (isShuffleOn) {
    // Mezcla las canciones
    shuffleSongs();
  } else {
    // Restaura el orden original
    songs = originalOrder.slice();
  }

  songIndex = 0;
  loadSong(songs[songIndex]);
  playMusic();

  // Actualiza la lista de canciones en HTML después de cambiar el modo shuffle
  createSongList(isShuffleOn);
});

// Manejador de clics para la lista de canciones
songList.addEventListener("click", (e) => {
  e.preventDefault();
  if (!isShuffleOn && e.target.tagName === "A" && !e.target.disabled) {
    const songIndex = parseInt(e.target.getAttribute("data-index"), 10);
    loadSong(songs[songIndex]);
    playMusic();
  }
});