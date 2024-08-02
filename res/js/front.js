/**Copyright 2022-2024 Almighty All rights reserved**/
$("#inputBox").on("paste", function() {
    setTimeout(function() {
        input(1)
    }, 0)
}),
$("#inputBox").on("focus", function() {
    $(this).attr("placeholder", "(한글검색은 끝에 /를 붙여서 검색해주세요 , '\\'를 끝에 붙이면 빠른 검색추가가 되요)"),
    setTimeout(function() {
        $("#inputBox").attr("placeholder", placeholder)
    }, 4e3),
    $(window).width() <= 600 && $("footer").css("display", "none")
}),
$("#inputBox").on("blur", function() {
    $(window).width() <= 600 && $("footer").css("display", "block")
}),
$("#playlistNameBox").on("blur", function() {
    input(2)
}),
window.addEventListener("keydown", function(e) {
    if (!($("#inputBox").is(":focus") && "" != $("#inputBox").val() && " " != $("#inputBox").val() || $("#playlistNameBox").is(":focus")))
        switch (e.code) {
        case "ArrowLeft":
        case "MediaTrackPrevious":
            e.preventDefault(),
            backVideo();
            break;
        case "ArrowRight":
        case "MediaTrackNext":
            e.preventDefault(),
            forwardVideo();
            break;
        case "Space":
        case "MediaPlayPause":
            e.preventDefault(),
            " " === $("#inputBox").val() && $("#inputBox").val(""),
            videoPaused ? player.playVideo() : player.pauseVideo()
        }
    if ($("#inputBox").is(":focus"))
        switch (e.code) {
        case "Backslash":
            if (e.preventDefault(),
            "|" !== e.key) {
                let e = $("#inputBox").val();
                " l" === (e = e.replace("\\", "")).slice(-2) && (e += "yric"),
                quickSearch(e)
            } else
                hotkeySearchClose = !0,
                toggleSearchClose(),
                input(0);
            break;
        case "Enter":
            e.preventDefault(),
            input(0)
        }
    if (!$("#inputBox").is(":focus") && !$("#playlistNameBox").is(":focus"))
        switch (e.code) {
        case "KeyR":
            e.preventDefault(),
            playlistAutoplay ? addAutoplayVideo(!1, "override") : playlistFeatures.autoplay();
            break;
        case "KeyZ":
            e.preventDefault(),
            toggleZen();
            break;
        case "KeyV":
            e.preventDefault(),
            toggleSBS()
        }
}),
$("#youtubeContainer").click(function() {
    stationRemote && ($("#remotePauseIcon").hasClass("fa-play") ? ($("#remotePauseIcon").removeClass("fa-play").addClass("fa-pause"),
    sendStation("videofunctionsplay")) : ($("#remotePauseIcon").removeClass("fa-pause").addClass("fa-play"),
    sendStation("videofunctionspause")))
}),
document.addEventListener("drop", function(e) {
    e.preventDefault();
    e = e.dataTransfer.getData("URL");
    $("#inputBox").val(e),
    input(1),
    $("#dropShadow, #dropOverlay").css("display", "none")
});
let dropOverlayAutoRemove, Message = (document.addEventListener("dragover", function(e) {
    e.preventDefault(),
    $("#dropShadow, #dropOverlay").css("display", "initial"),
    clearTimeout(dropOverlayAutoRemove),
    dropOverlayAutoRemove = setTimeout(function() {
        $("#dropShadow, #dropOverlay").css("display", "none")
    }, 5e3)
}),
function() {
    this.send = function(e) {
        $("#dialog").empty(),
        $("#dialog").append(e),
        $("#dialog").dialog()
    }
}
), message = new Message;
function saveButton() {
    $("#saveButton").text("재생목록이 복사 되었어요"),
    setTimeout(function() {
        resetSaveButton()
    }, 2e3)
}
function resetSaveButton() {
    $(window).width() <= 600 ? $("#saveButton").text("저장") : $("#saveButton").text("링크목록 복사")
}
function shareOnRedditAd() {
    let e = 0
      , t = document.getElementById("ad");
    t.style.color = "grey";
    let o = setInterval(function() {
        e++,
        t.style.color = "grey" == t.style.color ? "lightblue" : "grey",
        11 == e && clearInterval(o)
    }, 300)
}
function shareOnReddit() {
    let e;
    e = videos[0] || $("#playlistNameBox").attr("placeholder"),
    window.location.hash.substr(1).length <= 1e4 ? window.open("https://www.reddit.com/user/JerryKim1023/submit?resubmit=true&title=Playlist%20-%20" + e + "&url=https://https://jerrykim1023.github.io/Player/%23" + window.location.hash.substr(1), "_blank") : (alert('The playlist you are sharing is too long to automatically post, so please copy your Almighty Playlist URL and paste it into the open Reddit tab (you can copy by clicking the "링크목록 복사" button).\n\nSorry for this inconvenience.'),
    window.open("https://old.reddit.com/r/JerryKim1023/submit?resubmit=true&title=Playlist%20-%20" + e + "&url=%5BPaste+shortened+link+here%5D", "_blank"))
}
function startVideoProgress() {
    videoPaused ? (actionTimers.clear(),
    videoProgress(),
    actionTimers.pause()) : (actionTimers.clear(),
    videoProgress())
}
window.onload = function() {
    setBackground(),
    $("header, #forkme").addClass("animated slideInDown"),
    $("header").css("display", "flex"),
    $("#forkme").css("display", "initial"),
    $("footer").addClass("animated slideInUp").css("display", "initial"),
    $("#links").addClass("animated fadeIn").css("display", "initial"),
    $("#inputBox").focus(),
    $("#inputBox").autocomplete({
        delay: 100,
        source: function(e, t) {
            e = "//suggestqueries.google.com/complete/search?hl=en&ds=yt&q=" + e.term + "&client=chrome";
            $.ajax({
                method: "GET",
                dataType: "jsonp",
                jsonpCallback: "jsonCallback",
                url: e
            }).done(function(e) {
                10 < (suggestions = e[1]).length && (suggestions.length = 10);
                for (let e = suggestions.length - 1; -1 < e; e--)
                    -1 < suggestions[e].search(/htt(p|s):\/\//i) && suggestions.splice(e, 1);
                t(suggestions)
            })
        }
    }),
    cookie.get("sbs") && toggleSBS()
}
,
new ClipboardJS("#saveButton"),
resetSaveButton();
let tag = document.createElement("script")
  , firstScriptTag = (tag.src = "https://www.youtube.com/iframe_api",
document.getElementsByTagName("script")[0]);
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
let player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player("youtube",{
        events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange,
            onError: onError
        }
    }),
    console.log("Debug: Player loaded")
}
function onPlayerStateChange(e) {
    switch (e.data) {
    case -1:
        console.log(e),
        console.log(e.data),
        console.log("unstarted");
        break;
    case 0:
        console.log("ending"),
        sendStation("playerending"),
        loopVideo();
        break;
    case 1:
        console.log("playing"),
        videoFunctions.play(),
        startVideoProgress();
        break;
    case 2:
        console.log("paused"),
        videoFunctions.pause();
        break;
    case 3:
        console.log("buffering"),
        videoPaused = !1;
        break;
    case 5:
        console.log("cued"),
        startVideoProgress()
    }
}
function onPlayerReady(e) {
    console.log("Debug: onPlayerReady"),
    startVideoProgress(),
    getPlaylist(),
    makeSortable(),
    videoPreviews()
}
function onError(e) {
    console.log(videoPaused),
    videoErrorIds.push(videos[videoIteration][2]),
    $("tr:nth-child(" + videoIteration + ")").addClass("videoError"),
    forwardVideo()
}
$("#youtube").attr("src", "https://www.youtube.com/embed/?enablejsapi=1");
