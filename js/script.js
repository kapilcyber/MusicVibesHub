const content = document.querySelector(".content"),
  body = document.body,
  Playimage = content.querySelector(".music-image img"),
  musicName = content.querySelector(".music-titles .name"),
  musicArtist = content.querySelector(".music-titles .artist"),
  Audio = document.querySelector(".main-song"),
  playBtn = content.querySelector(".play-pause"),
  playBtnIcon = content.querySelector(".play-pause span"),
  prevBtn = content.querySelector("#prev"),
  nextBtn = content.querySelector("#next"),
  progressBar = content.querySelector(".progress-bar"),
  progressDetails = content.querySelector(".progress-details"),
  repeatBtn = content.querySelector("#repeat"),
  Shuffle = content.querySelector("#shuffle");
// Existing code...
const songColors = ['#ff7675', '#74b9ff', '#fdcb6e', '#a29bfe', '#fab1a0', '#55efc4', '#ffdd59', '#00cec9'];

// Add the following code to make the sidebar links responsive
const sidebarLinks = document.querySelectorAll('.sidebar a');

sidebarLinks.forEach((link, i) => {

  link.style.backgroundColor = songColors[i % songColors.length];
  link.style.color = '#2d3436'; 

  link.addEventListener('click', () => {
    // Remove the 'selected' class from all links
    sidebarLinks.forEach((link) => link.classList.remove('active'));

    // Add the 'selected' class to the clicked link
    link.classList.add('active');

    index = i + 1;
    loadData(index);
     // Reset the current time of the audio element to 0
    Audio.currentTime = 0;

     // Reset the width of the progress bar to 0%
    progressBar.style.width = '0%';

    playSong();
  });
});

const disc = document.querySelector('.disc');

// Add the following code to update the disc size and photo with the current song
function updateDisc() {
  const discImage = document.querySelector('#nowPlayingLink .music-image');
  const discSize = document.querySelector('.disc');

  discImage.src = "images/" + songs[index - 1].img + ".jpg";

  // Adjust the size of the disc based on your preferences
  // You can add logic here to change the size according to the song or any other criteria
  discSize.style.width = '100px';
  discSize.style.height = '100px';
}


let index = 1;

window.addEventListener("load", () => {
  loadData(index);

  // Start the rotation animation
  Playimage.style.animationPlayState = "running";

});

function loadData(indexValue) {
  musicName.innerHTML = songs[indexValue - 1].name;
  musicArtist.innerHTML = songs[indexValue - 1].artist;
  Playimage.src = "images/" + songs[indexValue - 1].img + ".jpg";
  Audio.src = "music/" + songs[indexValue - 1].audio + ".mp3";

  // Change the background image
  body.style.backgroundImage = `url('images/${songs[indexValue - 1].img}-bg.jpg')`;
  // Set the current song name in the sidebar header
  const currentSongName = document.getElementById('currentSongName');
  currentSongName.textContent = songs[indexValue - 1].name;

  // Remove the 'active' class from all links
  sidebarLinks.forEach((link) => link.classList.remove('active'));

  // Add the 'active' class to the corresponding link in the sidebar
  sidebarLinks[indexValue - 1].classList.add('active');
  updateDisc();
}
// Add this code to your existing JavaScript
const sidebarHeader = document.querySelector('.sidebar header');
const currentSongName = document.getElementById('currentSongName');

sidebarHeader.addEventListener('touchstart', () => {
  currentSongName.classList.toggle('visible');
});


playBtn.addEventListener("click", () => {
  const isMusicPaused = content.classList.contains("paused");
  if (isMusicPaused) {
    pauseSong();
  }
  else {
    playSong();
  }
});


// Add this code to set initial disc properties
window.addEventListener("load", () => {
  loadData(index);
  Playimage.style.animationPlayState = "running";
  updateDisc();
});

function playSong() {
  content.classList.toggle("paused"); // Toggle the "paused" class
  playBtnIcon.innerHTML = Audio.paused ? "pause" : "play_arrow"; // Toggle play/pause icon

  //if (Audio.paused || Audio.ended) {
  Audio.play();

  // Add or remove blur effect based on the play state
  content.classList.toggle("blur-effect", !Audio.paused);

  updateDisc();
}

function pauseSong() {
  content.classList.remove("paused");
  playBtnIcon.innerHTML = "play_arrow";
  Audio.pause();

  // remove blur effect when music is paused
  content.classList.add("blur-effect");

  updateDisc();
}

nextBtn.addEventListener("click", () => {
  nextSong();
});

prevBtn.addEventListener("click", () => {
  prevSong();
});

function nextSong() {
  index++;
  if (index > songs.length) {
    index = 1;
  }
  
  loadData(index);

  // Reset the current time of the audio element to 0
  Audio.currentTime = 0;

  // Reset the width of the progress bar to 0%
  progressBar.style.width = '0%';

  playSong();

  //resetAndPlayNext(); // Automatically play the previous song after loading
}


function prevSong() {
  index--;
  if (index <= 0) {
    index = songs.length;
  }

  loadData(index);
  // Reset the current time of the audio element to 0
  Audio.currentTime = 0;

  // Reset the width of the progress bar to 0%
  progressBar.style.width = '0%';
  playSong();  

  //resetAndPlayNext();
}

function resetAndPlayNext() {
  Audio.currentTime = 0; // Reset the current time to 0
  progressBar.style.width = '0'; // Reset the progress bar to 0
  playSong(); // Automatically play the song
}



Audio.addEventListener("ended", () => {
  resetAndPlayNext(); // Automatically move to the next song when the current song ends
});


Audio.addEventListener("ended", () => {
  nextSong(); // Automatically move to the next song when the current song ends
});
Audio.addEventListener("timeupdate", (e) => {
  const initialTime = e.target.currentTime; // Get current music time
  const finalTime = e.target.duration; // Get music duration
  let BarWidth = (initialTime / finalTime) * 100;
  progressBar.style.width = BarWidth + "%";

  progressDetails.addEventListener("click", (e) => {
    let progressValue = progressDetails.clientWidth; // Get width of Progress Bar
    let clickedOffsetX = e.offsetX; // get offset x value
    let MusicDuration = Audio.duration; // get total music duration

    Audio.currentTime = (clickedOffsetX / progressValue) * MusicDuration;
  });

  //Timer Logic
  Audio.addEventListener("loadeddata", () => {
    let finalTimeData = content.querySelector(".final");

    //Update finalDuration
    let AudioDuration = Audio.duration;
    let finalMinutes = Math.floor(AudioDuration / 60);
    let finalSeconds = Math.floor(AudioDuration % 60);
    if (finalSeconds < 10) {
      finalSeconds = "0" + finalSeconds;
    }
    finalTimeData.innerText = finalMinutes + ":" + finalSeconds;
  });

  //Update Current Duration
  let currentTimeData = content.querySelector(".current");
  let CurrentTime = Audio.currentTime;
  let currentMinutes = Math.floor(CurrentTime / 60);
  let currentSeconds = Math.floor(CurrentTime % 60);
  if (currentSeconds < 10) {
    currentSeconds = "0" + currentSeconds;
  }
  currentTimeData.innerText = currentMinutes + ":" + currentSeconds;

  //repeat button logic
  repeatBtn.addEventListener("click", () => {
    Audio.currentTime = 0;
  });
});

//Shuffle Logic
Shuffle.addEventListener("click", () => {
  var randIndex = Math.floor(Math.random() * songs.length) + 1; // Select random betwn 1 and song array length
  loadData(randIndex);
  playSong();
});

Audio.addEventListener("ended", () => {
  index++;
  if (index > songs.length) {
    index = 1;
  }
  loadData(index);
  playSong();
});

// JavaScript
document.addEventListener("DOMContentLoaded", function () {
  // Get the logout button element
  const logoutButton = document.getElementById("logoutButton");

  // Add a click event listener to the logout button
  logoutButton.addEventListener("click", function (event) {
    // Prevent the default behavior of the link
    event.preventDefault();

    // Perform any necessary logout logic here (e.g., clearing session, etc.)

    // Redirect to the login page
    window.location.href = "login.html"; // Replace "login.html" with the actual login page URL
  });
});