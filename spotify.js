let currentsong = new Audio();
let seekbarprogress = document.querySelector(".seekbarprogress");
let circle = document.querySelector(".circle");
let right = document.querySelector(".right");
let Left = document.querySelector(".left");
let next = document.getElementById("next");
let previous = document.getElementById("previous");
let songs;
let songinfo = document.querySelector(".songinfo");
let vol_seekbar = document.querySelector(".vol-seekbar")
let volume_img = document.getElementById("volume-img")
let play = document.getElementById("play");
let CurrFolder;
let play_btn = document.querySelector(".play-btn")
let input = vol_seekbar.getElementsByTagName("input")[0];
let cardcontainer = document.querySelector(".cardcontainer")
async function getsongs(folder) {
    CurrFolder = folder;
    let fetched_song = await fetch(`http://127.0.0.1:5501/${CurrFolder}/`)
    let response = await fetched_song.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
    return songs
}
async function displayAlbums() {
    let fetched_song = await fetch(`http://127.0.0.1:5501/songs/`)
    let response = await fetched_song.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let Anchors = div.getElementsByTagName("a")
    console.log(Anchors)
    let array = Array.from(Anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("/songs/")) {
            let folder = e.href.split("/").slice(4)[0];
            console.log(folder)
            // Get the metadata of the folder 
            let fetched_song = await fetch(`http://127.0.0.1:5501/songs/${folder}/info.json`)
            let response = await fetched_song.json();
            cardcontainer.innerHTML = cardcontainer.innerHTML + `<div data-folder="${folder}" class="card">
            <div class="play-btn">
                <svg class="svg-black" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                    <path
                        d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393" />
                </svg>
            </div>
            <img src="/songs/${folder}/cover.jpg" alt="">
            <h3>${response.title}</h3>
            <p>${response.description}</p>
        </div>`
        }
    }
    // loading the playlist
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
           await main(item.currentTarget.dataset.folder);
            playmusic(songs[0]);
        })
    })


}
displayAlbums()
async function main(loadplaylist) {
    // get the list of all songs
    songs = await getsongs(`songs/${loadplaylist}`)
    // show all the song in the playlist
    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songul.innerHTML = "";
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML +
            `<li><img class="invert" src="/images/music.svg" alt="">
    <div class="info">
        <div>${song}</div>
        <div>yash</div>
    </div>
    <span class="playnow">PlayNow
        <img src="/images/play.svg" alt="">
    </span></li> `
    }
    //attach an event listener to each and every song
    let li = Array.from(document.querySelector(".songlist").getElementsByTagName("li"))
    li.forEach(e => {
        e.addEventListener("click", element => {
            playmusic(e.querySelector(".info").firstElementChild.innerHTML)
        })
    })
}

let playmusic = (track) => {
    currentsong.src = `/${CurrFolder}/` + track
    currentsong.play()
    play.src = ` images/pause.svg`
    songinfo.innerHTML = track
}
main()

//update song time
function convertSecondsToMinutesAndSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return `00:00`
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedMinutes = String(minutes).padStart(2, '0')
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
}
currentsong.addEventListener("timeupdate", () => {
    let songtime = document.querySelector(".songtime")
    songtime.innerHTML = `${convertSecondsToMinutesAndSeconds(currentsong.currentTime)} / ${convertSecondsToMinutesAndSeconds(currentsong.duration)}`
    circle.style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
    seekbarprogress.style.width = (currentsong.currentTime / currentsong.duration) * 100 + "%" //width is changing with javascript and it is alraedy green in color which gives the green effect to the seekbar

})
// add event listner to the seekbar
let seekbar = document.querySelector(".seekbar")
seekbar.addEventListener("click", e => {
    let percentage = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    circle.style.left = percentage + "%";
    //getboundingclientrect tells us about where we are in the page
    seekbarprogress.style.width = percentage;
    currentsong.currentTime = ((currentsong.duration) * percentage) / 100
})
let hamburger = document.querySelector(".hamburger");
hamburger.addEventListener("click", () => {
    Left.style.left = "0px";
    right.style = `filter: brightness(50%)`;
})
let close_btn = document.querySelector(".close-btn")
close_btn.addEventListener("click", () => {
    document.querySelector(".left").style.left = "-147%";
    right.style = `filter: brightness(100%)`;
})

input.addEventListener("change", (e) => {
    currentsong.volume = parseInt(e.target.value) / 100;
    if (currentsong.volume == 0) {
        volume_img.src = "http://127.0.0.1:5501/images/mute.svg"
    }
    else {
        volume_img.src = "http://127.0.0.1:5501/images/volume.svg"
    }
})
volume_img.addEventListener("click", e => {
    if (e.target.src == "http://127.0.0.1:5501/images/volume.svg") {
        currentsong.volume = 0;
        input.value = 0;
        e.target.src = "http://127.0.0.1:5501/images/mute.svg"
    }
    else {
        currentsong.volume = .20;
        input.value = 20;
        e.target.src = "http://127.0.0.1:5501/images/volume.svg"
    }
})
if(input.value == 0) {
    volume_img.src = "http://127.0.0.1:5501/images/mute.svg";
    currentsong.volume = 0;
}
next.addEventListener("click", () => {
    play.src = `images/play.svg`
    let index = songs.indexOf(currentsong.src.split("/")[5])
    if ((index + 1) < songs.length) {
        playmusic(songs[index + 1])
    }
})
previous.addEventListener("click", () => {
    play.src = `images/play.svg`
    let index = songs.indexOf(currentsong.src.split("/")[5])
    if ((index - 1) >= 0) {
        playmusic(songs[index - 1])
    }
})
play.addEventListener("click", element => {
    if (currentsong.paused) { // paused return true or false
        currentsong.play()
        play.src = ` images/pause.svg`
    } else {
        currentsong.pause()
        play.src = `images/play.svg`

    }
})