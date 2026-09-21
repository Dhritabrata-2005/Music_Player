// ==========================================
// MUSIC PLAYER
// ==========================================

const audio = document.getElementById("audio");

const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const progressBar = document.getElementById("progressBar");
const volumeBar = document.getElementById("volumeBar");

const currentTimeDisplay = document.getElementById("currentTime");
const durationDisplay = document.getElementById("duration");

const songTitle = document.getElementById("songTitle");
const artistName = document.getElementById("artistName");
const albumImage = document.getElementById("albumImage");

const playlistItems = document.getElementById("playlistItems");
const autoplayCheckbox = document.getElementById("autoplay");


// ==========================================
// SONG LIST
// ==========================================

const songs = [
    {
        title: "Summer Vibes",
        artist: "Artist One",
        src: "music/song1.mp3",
        image: "https://picsum.photos/id/1015/500/500"
    },

    {
        title: "Dreamy Nights",
        artist: "Artist Two",
        src: "music/song2.mp3",
        image: "https://picsum.photos/id/1016/500/500"
    },

    {
        title: "Ocean Waves",
        artist: "Artist Three",
        src: "music/song3.mp3",
        image: "https://picsum.photos/id/1018/500/500"
    }
];

let currentSongIndex = 0;


// ==========================================
// LOAD SONG
// ==========================================

function loadSong(index) {

    currentSongIndex = index;

    const song = songs[currentSongIndex];

    songTitle.textContent = song.title;
    artistName.textContent = song.artist;

    albumImage.src = song.image;
    albumImage.alt = song.title;

    // Set audio file
    audio.src = song.src;

    // Reset audio
    audio.currentTime = 0;

    // Reset progress
    progressBar.value = 0;

    currentTimeDisplay.textContent = "0:00";
    durationDisplay.textContent = "0:00";

    // Make sure song is paused
    audio.pause();

    // Update button
    playBtn.textContent = "▶";

    // Stop album animation
    albumImage.parentElement.classList.remove("playing");

    // Update playlist
    updatePlaylist();
}


// ==========================================
// PLAY
// ==========================================

function playSong() {

    // Make sure audio source exists
    if (!audio.src) {
        return;
    }

    const playPromise = audio.play();

    if (playPromise !== undefined) {

        playPromise
            .then(() => {

                // Music successfully started
                playBtn.textContent = "❚❚";

                albumImage.parentElement.classList.add("playing");

            })
            .catch((error) => {

                console.error("Could not play audio:", error);

                playBtn.textContent = "▶";

                albumImage.parentElement.classList.remove("playing");

            });
    }
}


// ==========================================
// PAUSE
// ==========================================

function pauseSong() {

    audio.pause();

    playBtn.textContent = "▶";

    albumImage.parentElement.classList.remove("playing");
}


// ==========================================
// PLAY / PAUSE BUTTON
// ==========================================

playBtn.addEventListener("click", function () {

    if (audio.paused) {

        playSong();

    } else {

        pauseSong();

    }

});


// ==========================================
// PREVIOUS SONG
// ==========================================

prevBtn.addEventListener("click", function () {

    currentSongIndex--;

    if (currentSongIndex < 0) {
        currentSongIndex = songs.length - 1;
    }

    loadSong(currentSongIndex);

    playSong();

});


// ==========================================
// NEXT SONG
// ==========================================

nextBtn.addEventListener("click", function () {

    currentSongIndex++;

    if (currentSongIndex >= songs.length) {
        currentSongIndex = 0;
    }

    loadSong(currentSongIndex);

    playSong();

});


// ==========================================
// UPDATE PROGRESS BAR
// ==========================================

audio.addEventListener("timeupdate", function () {

    if (!audio.duration) {
        return;
    }

    const percentage =
        (audio.currentTime / audio.duration) * 100;

    progressBar.value = percentage;

    currentTimeDisplay.textContent =
        formatTime(audio.currentTime);

});


// ==========================================
// GET SONG DURATION
// ==========================================

audio.addEventListener("loadedmetadata", function () {

    if (!isNaN(audio.duration)) {

        durationDisplay.textContent =
            formatTime(audio.duration);

    }

});


// ==========================================
// PROGRESS BAR SEEK
// ==========================================

progressBar.addEventListener("input", function () {

    if (!audio.duration) {
        return;
    }

    audio.currentTime =
        (progressBar.value / 100) * audio.duration;

});


// ==========================================
// VOLUME
// ==========================================

audio.volume = 1;

volumeBar.value = 1;

volumeBar.addEventListener("input", function () {

    audio.volume = Number(volumeBar.value);

});


// ==========================================
// WHEN AUDIO STARTS
// ==========================================

audio.addEventListener("play", function () {

    playBtn.textContent = "❚❚";

    albumImage.parentElement.classList.add("playing");

});


// ==========================================
// WHEN AUDIO PAUSES
// ==========================================

audio.addEventListener("pause", function () {

    playBtn.textContent = "▶";

    albumImage.parentElement.classList.remove("playing");

});


// ==========================================
// SONG ENDED
// ==========================================

audio.addEventListener("ended", function () {

    // Reset progress
    progressBar.value = 100;

    playBtn.textContent = "▶";

    albumImage.parentElement.classList.remove("playing");


    // Autoplay enabled
    if (autoplayCheckbox.checked) {

        currentSongIndex++;

        if (currentSongIndex >= songs.length) {
            currentSongIndex = 0;
        }

        loadSong(currentSongIndex);

        playSong();

    }

});


// ==========================================
// PLAYLIST
// ==========================================

function updatePlaylist() {

    playlistItems.innerHTML = "";

    songs.forEach(function (song, index) {

        const item = document.createElement("div");

        item.classList.add("playlist-item");

        if (index === currentSongIndex) {
            item.classList.add("active");
        }

        item.innerHTML = `
            <span class="song-number">
                ${index + 1}
            </span>

            <div class="playlist-details">

                <div class="playlist-title">
                    ${song.title}
                </div>

                <div class="playlist-artist">
                    ${song.artist}
                </div>

            </div>
        `;

        item.addEventListener("click", function () {

            // Load selected song
            loadSong(index);

            // Start selected song
            playSong();

        });

        playlistItems.appendChild(item);

    });

}


// ==========================================
// FORMAT TIME
// ==========================================

function formatTime(seconds) {

    if (isNaN(seconds)) {
        return "0:00";
    }

    const minutes = Math.floor(seconds / 60);

    const remainingSeconds =
        Math.floor(seconds % 60);

    return (
        minutes +
        ":" +
        remainingSeconds.toString().padStart(2, "0")
    );

}


// ==========================================
// KEYBOARD CONTROLS
// ==========================================

document.addEventListener("keydown", function (event) {

    // Don't activate shortcuts when
    // interacting with range controls
    if (event.target.tagName === "INPUT") {
        return;
    }


    // SPACE = PLAY / PAUSE
    if (event.code === "Space") {

        event.preventDefault();

        if (audio.paused) {
            playSong();
        } else {
            pauseSong();
        }

    }


    // LEFT ARROW = PREVIOUS
    else if (event.key === "ArrowLeft") {

        event.preventDefault();

        prevBtn.click();

    }


    // RIGHT ARROW = NEXT
    else if (event.key === "ArrowRight") {

        event.preventDefault();

        nextBtn.click();

    }

});


// ==========================================
// INITIALIZE
// ==========================================

loadSong(0);