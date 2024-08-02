/**Copyright 2022-2024 Almighty All rights reserved**/
function escape(e) {
    return $("<div>").text(decodeURIComponent(e)).html()
}
function changeIteration(e) {
    e = videoIteration + e;
    return playlistRepeat && e > videoCounter ? 1 : playlistRepeat && e < 0 ? videoCounter - 1 : e
}
function playVideo() {
    videoPlaying = !0,
    highlight(videoIteration, "selected", !1),
    videoPreviews(),
    autoplayList && !autoplayListOverride || addAutoplayVideo(),
    document.title = "Almighty - " + decodeURIComponent(videos[videoIteration][0]),
    stationRemote || ($("#youtube").css("display", "block"),
    videoPaused ? player.cueVideoById(videos[videoIteration][2]) : player.loadVideoById(videos[videoIteration][2]),
    console.log("Debug: playVideo")),
    backRestart = !1,
    clearTimeout(backRestartTimer),
    backRestartTimer = window.setTimeout(function() {
        backRestart = !0
    }, 3e3)
}
function loopVideo() {
    videoIteration < videoCounter || playlistRepeat ? (playlistShuffle && playlistRepeat && videoIteration === videoCounter && shufflePlaylist(),
    videoIteration = changeIteration(1),
    playVideo()) : (videoPlaying = !1,
    actionTimers.clear(),
    $("#youtube").css("display", "none"),
    void 0 !== videos[0] && null !== videos[0] ? document.title = "Almighty - " + decodeURIComponent(videos[0]) : document.title = "Almighty")
}
let VideoFunctions = function() {
    this.play = function() {
        setVideoTime(),
        sendStation("videofunctionsplay"),
        videoPaused = !1,
        document.title = "Almighty - " + decodeURIComponent(videos[videoIteration][0]),
        $("#favicon").attr("href", faviconPlay)
    }
    ,
    this.pause = function() {
        sendStation("videofunctionspause"),
        videoPaused = !0,
        void 0 !== videos[0] && null !== videos[0] && (document.title = "Almighty - " + decodeURIComponent(videos[0])),
        $("#favicon").attr("href", faviconPause),
        actionTimers.pause()
    }
}
  , videoFunctions = new VideoFunctions;
function forwardVideo() {
    sendStation("forwardvideo"),
    changeIteration(1) <= videoCounter && loopVideo()
}
function backVideo() {
    sendStation("backvideo"),
    backRestart ? (videoIteration = changeIteration(-1),
    loopVideo()) : -1 < changeIteration(-2) && (videoIteration = changeIteration(-2),
    loopVideo())
}
function addVideo(e, t, o) {
    videoCounter++;
    let a;
    a = playlistPlayNext ? videoIteration + 1 : videoCounter;
    var i = []
      , o = (i[0] = e,
    i[1] = t,
    i[2] = o,
    0 < videos.length ? videos.splice(a, 0, i) : videos[a] = i,
    sendStation("addvideo," + i),
    playlistShuffle && addedVideosWhileShuffled.push(i),
    msConversion(1e3 * t));
    addVideoToList(e, o, a, !0),
    setPlaylist(),
    makeSortable(),
    videoPreviews(),
    1 !== videoCounter && (!1 !== videoPlaying || videoPaused || videoIteration !== videoCounter - 1) || loopVideo()
}
function actionPlayVideo(e) {
    sendStation("actionplayvideo," + e),
    videoIteration = e,
    videoPaused = !1,
    loopVideo(),
    $("#favicon").attr("href", faviconPlay)
}
function actionRemoveVideo(e) {
    sendStation("actionremovevideo," + e),
    e === videoIteration ? videoIteration = (videoIteration + 1 <= videoCounter ? forwardVideo() : (stationRemote || (actionTimers.clear(),
    player.stopVideo(),
    $("#youtube").css("display", "none")),
    document.title = "Almighty"),
    changeIteration(-1)) : e < videoIteration && (videoIteration = changeIteration(-1)),
    videoCounter--,
    videos.splice(e, 1),
    removeVideoFromList(e, !1),
    setPlaylist(),
    makeSortable(),
    videoPreviews(),
    e - 1 === videoCounter && addAutoplayVideo()
}
function getVideoName(e, t) {
    $.ajax({
        dataType: "json",
        url: "https://noembed.com/embed",
        data: {
            url: "https://www.youtube.com/watch?v=" + e
        },
        success: function(e) {
            t(e.title)
        }
    })
}
function getVideoData(t) {
    let o = t;
    getVideoName(t, function(e) {
        e = encodeURIComponent(e).replace(/%20/g, " ");
        inBoxSearch ? ("undefined" !== e ? (addSearchResult(e, t),
        searchResultsIteration++) : (quickSearchVideos.splice(quickSearchVideosIteration, 1),
        quickSearchVideosIteration--),
        searchResultsIteration < quickSearchVideos.length - 1 ? quickSearch("") : inBoxSearch = !1) : "undefined" !== e ? ($("#inputBox").val("").attr("placeholder", placeholder),
        addVideo(e, 0, o),
        autoplayList && !autoplayListOverride && (console.log(autoplayVideoIteration),
        addAutoplayVideo())) : (quickSearchVideosIteration++,
        getVideoData(quickSearchVideos[quickSearchVideosIteration]))
    })
}
function setVideoTime() {
    var e, t, o;
    0 === videos[videoIteration][1] && (e = videos[videoIteration][0],
    t = player.getDuration(),
    o = msConversion(1e3 * (t = Math.round(t))),
    videos[videoIteration][1] = t,
    removeVideoFromList(videoIteration, !1),
    addVideoToList(e, o, videoIteration, !1),
    restoreHighlight(videoIteration),
    setPlaylist())
}
let Cookie = function() {
    this.set = function(e, t) {
        document.cookie = e + "=" + t
    }
    ,
    this.get = function(e) {
        e = new RegExp("(?:(?:^|.*;\\s*)" + e + "\\s*\\=\\s*([^;]*).*$)|^.*$","ig");
        return document.cookie.replace(e, "$1")
    }
    ,
    this.del = function(e) {
        document.cookie = e + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
    }
}, cookie = new Cookie, isMobile = !1, background = "https://cdn.pixabay.com/photo/2022/09/19/10/34/chess-pieces-7465249_960_720.jpg", placeholder, loadingPlaceholder, faviconPause = ($(window).width() <= 600 ? (isMobile = !0,
placeholder = "검색, 링크를 넣어주세요",
loadingPlaceholder = "Loading...",
background = "none") : (placeholder = "검색, 재생목록에 링크를 끌어다 놓거나 붙여주세요.",
loadingPlaceholder = "Loading video data from YouTube..."),
$("#inputBox").attr("placeholder", placeholder),
"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAiCAMAAAANmfvwAAAA/1BMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD64ociAAAAVHRSTlMAAQIDBAUGBwgJCgsPEBIUFxgbHh8iIyUrMDU/QEdKS09QUlZbXF5fYWZpb3F1e4aJmJ6go6WmqrK0tb7Aw8XHyM/R09XX2drg4unr7e/x8/X3+ftnm6MTAAABGklEQVQ4jYXTx1YCQRBG4TvCYKO2iglzxJwVA5gFs4LA//7P4mLIM9PeZfV3Tm26oC+vf9BTYu7wrib93hzMDkSCoaOG2tX2B0PA21FvjbU+YR4UquB3i5GPsJDK6Y4YjBTSU7JNbqOFdNkSG3FCWghEqhFPfhIA7EmSatYYY9JXUsYYY0wmMOsAXlWS9EbLN9cH5B1gRi6icWDbTVaACzc5AcpuUgQqblL6nzwDJTcpAOducgxsuskSMOUmY4D37SKvAAS/tj5hrbWjBSlrrbU2G5BlAPyaYvtsXstyPJlvbuU6Tpy2BP5LtLjvOsrh1yjxmKIrvxgW+QS9rdZ7QXWRUP5upQO+csmwALzprXy5Uimd5SYj3+P7A3jQxmKOfWTQAAAAAElFTkSuQmCC"), faviconPlay = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAiCAMAAAANmfvwAAABDlBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABxUYW9AAAAWXRSTlMAAQIDBAUGCAkRFBUZGhscHiAhJyorLzI0ODo7PUZMTlBVVldYWVtcXV5hZHB1foKDiIuPlZiboKKlpqirr7CytcDDyMrMzs/R09Xa3N7g4ubp7e/x9/n7/Ud7aO4AAAE3SURBVBgZlcFpOxtRAIbhZ8YgltBaopZEHanamtKgtYaSklJ0xPL+/z8iGedMZq5MPrhv3mlgslzZ2aksT/aTbfpQsYMpun24UMr5OGneN3XZ9EjoO1KGA5+Yd6pMxx5OVT1sY31STwUifqg3jaF8TWn/fdo+y1oFCv+UUqLtXpahxSs/KeGOlrwcQ2TwhxJGgWU5Bit/ptgSsCfHEJu9l7ULXMkxdPgbL4r8AR7kGJLmFQmBphxD0pQiTeCvHEPC/IMiV8C+HENs7LesX8CaHIOVqyr2FZiQY4j4K8/q+Ah4TVmGtplbJYQeLRuyvgAjp0pZp63/SW/Ogtx3pT0GRErqqYh1oh6OcIKGMl0GxHKXylAfJCHYV5effaQthEoJ5+jiL94odl3yyTRc3KrV67Wt4jDv8wr7Zt73xzlZAQAAAABJRU5ErkJggg==", popup, searchClose = !1, hotkeySearchClose = !1, videos = [], videoCounter = 0, videoIteration = 0, videoErrorIds = [], videosBeforeShuffle = [], addedVideosWhileShuffled = [], baseAutoplayVideoId = !1, autoplayList = !1, autoplayListOverride = !1, autoplayVideos = [], autoplayVideoIteration = -1, autoplayLoading = !1, quickSearchQuery, quickSearchVideos = [], quickSearchVideosIteration = 0, inBoxSearch = !1, searchResultsIteration = 0, searchResultsNameStorage = [], stationServer, stationSocket, stationRemote = !1, stationTxQuiet = !1, stationUserId, zenMode = !1, videoPaused, videoPlaying, backRestart, backRestartTimer, progressTimer, playlistPlayNext, playlistRepeat, playlistShuffle, playlistAutoplay, dataPlayer, radioDataPlayer, searchDataPlayer;
function urlValidate(e) {
    let t = !1;
    var o = e.match(/(?:v=|youtu\.be\/|youtube\..+\/embed\/)([^?&]+)/i)
      , a = e.match(/list=([^?&]+)/i)
      , i = e.match(/.*#(.+)/i)
      , e = e.match(/.+?\.(jpeg|jpg|gif|png)/i);
    return o && a ? t = ["playlist", t = [o[1], a[1]]] : o ? t = ["youtube", t = o[1]] : i ? t = ["Almighty", t = i[1]] : e && (t = ["image", t = e[0]]),
    t
}
function input(e) {
    if (2 === e) {
        e = $("#playlistNameBox").val();
        $("#inputBox").focus(),
        sendStation("playlistnamechange," + e),
        videos[0] = "" !== e ? encodeURIComponent(e).replace(/%20/g, " ") : void 0,
        setPlaylist()
    } else {
        let t = $("#inputBox").val();
        if ("" !== t) {
            var e = urlValidate(t)
              , o = t.match(/^-option (.+?)( .+?)?$/i);
            if (o) {
                switch (o[1]) {
                case "hidevideo":
                    $("#youtubeContainer").addClass("hideVideo");
                    break;
                case "showvideo":
                    $("#youtubeContainer").removeClass("hideVideo");
                    break;
                case "background":
                    void 0 !== o[2] ? $("body, #blurBackground").css("background", o[2]) : alert("No background color or image specified");
                    break;
                case "radio":
                    autoplayListOverride = !0;
                    break;
                default:
                    alert("Sorry, but that option does not exist\n\nCheck with the list of Almighty options on GitHub")
                }
                $("#inputBox").val("").attr("placeholder", placeholder)
            } else if (e)
                "youtube" === e[0] ? (getVideoData(t = e[1]),
                $("#inputBox").val("").attr("placeholder", loadingPlaceholder),
                void 0 !== popup && (!0 === popupClose ? (dropOverlay.close(),
                popup.close(),
                hotkeyPopupClose && (hotkeyPopupClose = !1,
                togglePopupClose())) : popup.focus())) : "Almighty" === e[0] ? (appendPlaylist(e[1]),
                $("#inputBox").val("").attr("placeholder", placeholder)) : "playlist" === e[0] ? (videoPaused = !0,
                playlistAutoplay && playlistFeatures.autoplay(),
                autoplayList = e[1],
                playlistFeatures.autoplay(),
                $("#inputBox").val("").attr("placeholder", placeholder)) : "image" === e[0] && (setBackground(e[1]),
                $("#inputBox").val("").attr("placeholder", placeholder));
            else if (-1 === t.indexOf("\\")) {
                " l" === t.slice(-2) && (t += "yric"),
                popup = window.open("https://www.youtube.com/results?search_query=" + t.replace(/ /g, "+"), "YouTube", "height=500,width=800"),
                dropOverlay.open();
                let e = setInterval(function() {
                    popup.closed && (dropOverlay.close(),
                    clearInterval(e))
                }, 500);
                $("#inputBox").blur().focus()
            } else
                " l" === (t = t.replace("\\", "")).slice(-2) && (t += "yric"),
                quickSearch(t)
        }
    }
}
function setPlaylist() {
    let e;
    1 < videos.length ? (e = JSON.stringify(videos),
    e = window.btoa(e),
    window.location.hash = e) : window.location.hash = "",
    $("#saveButton").attr("data-clipboard-text", "https://almighty.한국/#" + e)
}
function getPlaylist() {
    if ("" !== window.location.hash.substr(1)) {
        var e = window.location.hash.substr(1);
        $("#saveButton").attr("data-clipboard-text", "https://almighty.한국#" + e);
        try {
            var t, e = window.atob(e);
            e = JSON.parse(e),
            void 0 !== (videos = e)[0] && null !== videos[0] && (t = decodeURIComponent(videos[0]),
            $("#playlistNameBox").val(t),
            $("#ogTitle").attr("content", "Almighty - " + t));
            for (let e = 1; e < videos.length; e++) {
                videoCounter = e;
                var o = msConversion(1e3 * videos[videoCounter][1]);
                addVideoToList(videos[videoCounter][0], o, videoCounter, !0)
            }
            setPlaylist(),
            videoPaused = !0,
            loopVideo()
        } catch (e) {
            alert("재생목록 url 뒷부분이 잘린 것 같습니다(get).\n\n이 경우 재생목록을 검색창에 붙여넣어보고 안 되면 올바른 재생목록 값을 다시 복사해와야 합니다.\n\n링크목록 복사 버튼을 활용하여 검색창에 붙여넣어보시길 바랍니다.\n\nerr: " + e)
        }
    }
}
function appendPlaylist(t) {
    try {
        t = window.atob(t),
        void 0 === (t = JSON.parse(t))[0] || null === t[0] || void 0 !== videos[0] && null !== videos[0] || ($("#playlistNameBox").val(escape(t[0])),
        videos[0] = t[0]);
        for (let e = 1; e < t.length; e++) {
            videoCounter++;
            var o = msConversion(1e3 * t[e][1]);
            addVideoToList(t[e][0], o, videoCounter, !0)
        }
        if (0 !== videos.length && t.splice(0, 1),
        videos = videos.concat(t),
        setPlaylist(),
        makeSortable(),
        videoPreviews(),
        addAutoplayVideo(),
        0 === videoIteration) {
            for (let e = 1; e < videos.length; e++)
                restoreHighlight(e);
            videoPaused = !0,
            loopVideo()
        }
    } catch (e) {
        alert("재생목록 url 뒷부분이 잘린 것 같습니다(append).\n\n이 경우 재생목록을 검색창에 붙여넣어보고 안 되면 올바른 재생목록 값을 다시 복사해와야 합니다.\n\n링크목록 복사 버튼을 활용하여 검색창에 붙여넣어보시길 바랍니다.\n\nerr: " + e)
    }
}
function shuffleArray(t) {
    for (let e = t.length - 1; 0 < e; e--) {
        var o = Math.floor(Math.random() * (e + 1))
          , a = t[e];
        t[e] = t[o],
        t[o] = a
    }
    return t
}
function shufflePlaylist() {
    var e = videos[0]
      , t = videos[videoIteration][2];
    playlistShuffle ? (videosBeforeShuffle.length < 1 && (videosBeforeShuffle = JSON.parse(JSON.stringify(videos))),
    videos.splice(0, 1),
    shuffleArray(videos)) : (0 < addedVideosWhileShuffled.length && (videosBeforeShuffle.push.apply(videosBeforeShuffle, addedVideosWhileShuffled),
    addedVideosWhileShuffled = []),
    videos = JSON.parse(JSON.stringify(videosBeforeShuffle)),
    videosBeforeShuffle = [],
    videos.splice(0, 1)),
    videos.unshift(e),
    refreshVideoList(),
    setPlaylist(),
    makeSortable(),
    videoPreviews(),
    addAutoplayVideo(),
    videos[videoIteration][2] !== t && (videoIteration = changeIteration(-1),
    loopVideo())
}
function actionMoveVideo(e, t) {
    sendStation("actionmovevideo," + e + "," + t),
    videos.move(e, t),
    e == videoIteration ? videoIteration = t : e < videoIteration && t >= videoIteration ? videoIteration = changeIteration(-1) : e > videoIteration && t <= videoIteration && (videoIteration = changeIteration(1)),
    addAutoplayVideo()
}
function highlight(e, t, o) {
    $("tr:nth-child(" + e + ")").attr("id", "new-" + t),
    o || $("tr." + t).removeClass(t),
    $("#new-" + t).addClass(t),
    $("#new-" + t).removeAttr("id")
}
function addVideoToList(e, t, o, a) {
    a = "<tr" + (a = a ? ' class="animated flipInX"' : "") + '><td class="tableLeft">' + (e = escape(e)) + '<div class="tableButtons"><span class="fa fa-rss autoplayButton" onclick="playlistButtons.autoplay(this);" title="Start Radio"></span><span class="fa fa-play playButton" onclick="playlistButtons.play(this);" title="Play"></span><span class="fa fa-times removeButton" onclick="playlistButtons.remove(this);" title="Remove"></span></div></td><td>' + t + "</td></tr>";
    0 < $("#videosTable > tr").length ? 1 < o ? $("#videosTable > tr").eq(o - 2).after(a) : $(a).insertBefore("#videosTable > tr:first") : $("#videosTable").append(a)
}
function removeVideoFromList(e, t) {
    !0 === t ? $("tr:nth-child(" + e + ")").fadeOut(function() {
        $(this).remove()
    }) : $("tr:nth-child(" + e + ")").remove()
}
function restoreHighlight(e) {
    e === videoIteration && highlight(e, "selected", !1),
    videos[e][2] === baseAutoplayVideoId && highlight(e, "radio", !1),
    -1 < videoErrorIds.indexOf(videos[e][2]) && highlight(e, "videoError", !0)
}
function refreshVideoList() {
    for (let e = 1; e < videos.length; e++) {
        removeVideoFromList(e, !1);
        var t = msConversion(1e3 * videos[e][1]);
        addVideoToList(videos[e][0], t, e, !1),
        restoreHighlight(e)
    }
}
Array.prototype.move = function(e, t) {
    this.splice(t, 0, this.splice(e, 1)[0])
}
;
let PlaylistButtons = function() {
    this.play = function(e) {
        actionPlayVideo($(".playButton").index(e))
    }
    ,
    this.remove = function(e) {
        actionRemoveVideo($(".removeButton").index(e) + 1)
    }
    ,
    this.autoplay = function(e) {
        e = $(".autoplayButton").index(e) + 1;
        console.log("here: " + e),
        playlistAutoplay = !0,
        addAutoplayVideo(e, "reset"),
        playlistFeatures.toggleSelected(playlistAutoplay, ".fa-rss")
    }
}
  , playlistButtons = new PlaylistButtons;
function makeSortable() {
    $("#videosTable").sortable({
        update: function(e, t) {
            actionMoveVideo(oldIndex + 1, t.item.index() + 1),
            setPlaylist(),
            videoPreviews()
        },
        start: function(e, t) {
            oldIndex = t.item.index()
        },
        cancel: "span"
    })
}
let PlaylistFeatures = function() {
    let e = this;
    this.toggleSelected = function(e, t) {
        e ? $(t).addClass("selected") : $(t).removeClass("selected")
    }
    ,
    this.playNext = function() {
        sendStation("playlistfeaturesplaynext"),
        playlistPlayNext = !playlistPlayNext,
        e.toggleSelected(playlistPlayNext, ".fa-arrow-circle-right")
    }
    ,
    this.repeat = function() {
        sendStation("playlistfeaturesrepeat"),
        playlistRepeat = !playlistRepeat,
        videoPreviews(),
        e.toggleSelected(playlistRepeat, ".fa-redo-alt")
    }
    ,
    this.shuffle = function() {
        sendStation("playlistfeaturesshuffle"),
        playlistShuffle = !playlistShuffle,
        shufflePlaylist(),
        e.toggleSelected(playlistShuffle, ".fa-random")
    }
    ,
    this.autoplay = function() {
        !1 === (playlistAutoplay = !playlistAutoplay) ? (autoplayVideos = [],
        autoplayVideoIteration = 0,
        baseAutoplayVideoId = !1,
        autoplayList = !1,
        autoplayLoading = !1,
        $("tr").removeClass("radio")) : addAutoplayVideo(),
        e.toggleSelected(playlistAutoplay, ".fa-rss")
    }
}
  , playlistFeatures = new PlaylistFeatures;
function videoPreviews() {
    function e(e, t) {
        $("#" + e + "Video .videoName").text(escape(videos[t][0])),
        $("#" + e + "Video .videoTime").text(msConversion(1e3 * videos[t][1])),
        $("#" + e + "Video .videoImage").attr("src", "https://i.ytimg.com/vi/" + videos[t][2] + "/default.jpg")
    }
    function t(e, t) {
        $("#" + e + "Video .videoName, #" + e + "Video .videoImage, #" + e + "Video .videoTime").css("opacity", t)
    }
    function o(e, t) {
        $("#" + e + "Video").css("background-color", t),
        t = "white" === t ? "black" : "inherit",
        $("#" + e + "Video .videoImageContainer").css("background", t)
    }
    isMobile || (changeIteration(1) <= videoCounter ? (t("next", "1"),
    o("next", "white"),
    e("next", changeIteration(1))) : (t("next", "0"),
    o("next", "grey")),
    0 < changeIteration(-1) || playlistRepeat && 1 == videoIteration ? (t("previous", "1"),
    o("previous", "white"),
    e("previous", playlistRepeat && 1 == videoIteration ? changeIteration(-2) + 1 : changeIteration(-1))) : (t("previous", "0"),
    o("previous", "grey")))
}
function Timer(e, t) {
    let o, a, i = t, s;
    this.resume = function() {
        s = !0,
        a = new Date,
        o = window.setTimeout(e, i)
    }
    ,
    this.pause = function() {
        s = !1,
        window.clearTimeout(o),
        i -= new Date - a
    }
    ,
    this.getTimeLeft = function() {
        return s && (this.pause(),
        this.resume()),
        i
    }
    ,
    this.getStateRunning = function() {
        return s
    }
    ,
    this.resume()
}
function msConversion(e) {
    var e = Math.floor(e / 1e3)
      , t = Math.floor(e / 3600);
    e -= 3600 * t;
    let o = Math.floor(e / 60);
    return e = ("00" + (e = "" + (e -= 60 * o))).substring(e.length),
    0 < t ? t + ":" + (o = ("00" + (o = "" + o)).substring(o.length)) + ":" + e : o + ":" + e
}
function resetTimer(e) {
    void 0 !== e && 0 != e && e.pause()
}
let ActionTimers = function() {
    this.pause = function() {
        progressTimer.pause()
    }
    ,
    this.resume = function() {
        progressTimer.resume()
    }
    ,
    this.clear = function() {
        resetTimer(progressTimer),
        $("#progress").css("width", "0%"),
        $("#currentTime").text("0:00"),
        $("#videoTime").text("0:00")
    }
}
  , actionTimers = new ActionTimers;
function videoProgress() {
    if (void 0 !== videos[videoIteration] && null !== videos[videoIteration]) {
        let t = videos[videoIteration][1]
          , o = Math.round(player.getCurrentTime())
          , a = o / t * 100
          , i = ($("#videoTime").text(msConversion(1e3 * t)),
        $("#progress").css("width", a + "%"),
        msConversion(1e3 * o));
        "NaN:NaN" !== i && $("#currentTime").text(i),
        !function e() {
            o = Math.round(player.getCurrentTime()),
            a = o / t * 100,
            progressTimer = new Timer(function() {
                $("#progress").css("width", a + "%"),
                "NaN:NaN" !== (i = msConversion(1e3 * o)) && $("#currentTime").text(i),
                o < t && e()
            }
            ,500)
        }()
    }
}
function loadAutoplayData(e) {
    autoplayLoading = !0,
    autoplayVideos = [],
    autoplayVideoIteration = -1,
    baseAutoplayVideoId = autoplayList ? (console.log("작동여부2?"),
    autoplayList[0]) : ($("tr").removeClass("radio"),
    highlight(e, "radio", !1),
    videos[e][2]);
    e = document.createElement("iframe");
    e.setAttribute("id", "radioDataFrame"),
    e.setAttribute("src", ""),
    document.getElementById("dataFramesContainer").appendChild(e),
    radioDataPlayer = new YT.Player("radioDataFrame",{
        events: {
            onReady: onRadioDataPlayerReady,
            onStateChange: onRadioDataPlayerStateChange
        }
    }),
    e.setAttribute("src", "https://www.youtube.com/embed/" + baseAutoplayVideoId + "?enablejsapi=1")
}
function onRadioDataPlayerReady() {
    console.log("작동여부1?");
    let e;
    e = autoplayList ? autoplayList[1] : "RD" + baseAutoplayVideoId,
    radioDataPlayer.cuePlaylist({
        list: e
    })
}
function onRadioDataPlayerStateChange(e) {
    if (console.log("작동여부2?"),
    5 === e.data) {
        var o = [];
        if (autoplayVideos = radioDataPlayer.getPlaylist(),
        !autoplayList || autoplayListOverride) {
            for (let e = 0; e < autoplayVideos.length; e++) {
                let t = !0;
                var a = autoplayVideos[e];
                for (let e = 1; e < videos.length; e++)
                    videos[e][2] === a && (t = !1);
                t && o.push(a)
            }
            autoplayVideos = o
        }
        radioDataPlayer.destroy(),
        1 < autoplayVideos.length && (autoplayLoading = !1,
        addAutoplayVideo())
    }
}
function addAutoplayVideo(e=videoIteration, t="") {
    e = e || videoIteration,
    playlistAutoplay && !autoplayLoading && (0 < videos.length || autoplayList) && (0 < autoplayVideos.length && "reset" != t ? (videoIteration === videoCounter || autoplayList && !autoplayListOverride || "override" == t) && (autoplayVideoIteration < autoplayVideos.length - 1 ? (autoplayVideoIteration++,
    console.log("Getting new video: " + autoplayVideos[autoplayVideoIteration] + " data"),
    getVideoData(autoplayVideos[autoplayVideoIteration])) : autoplayList || autoplayListOverride ? playlistFeatures.autoplay() : loadAutoplayData(e)) : loadAutoplayData(e))
}
function addSearchResult(e, t) {
    searchResultsNameStorage.push(e),
    e = escape(e),
    $("#searchResults").append('<div class="searchResult" onclick="loadSearchResult(this);"><div class="left"><p>' + e + '</p></div><div class="right"><img src="https://i.ytimg.com/vi/' + t + '/default.jpg" /></div></div>')
}
function loadSearchResult(e) {
    var e = $(".searchResult").index(e)
      , t = quickSearchVideos[e];
    console.log("i:" + e + ",id:" + t);
    addVideo(searchResultsNameStorage[e], 0, t),
    searchClose && toggleMenu("searchResults")
}
function quickSearch(e) {
    !inBoxSearch && quickSearchVideosIteration + 1 < quickSearchVideos.length && $("#inputBox").val("").attr("placeholder", loadingPlaceholder),
    "" !== e ? ($("#searchProgress").css("display", "flex"),
    quickSearchQuery = e,
    (e = document.createElement("iframe")).setAttribute("id", "searchDataFrame"),
    e.setAttribute("src", ""),
    document.getElementById("dataFramesContainer").appendChild(e),
    searchDataPlayer = new YT.Player("searchDataFrame",{
        events: {
            onReady: onSearchDataPlayerReady,
            onStateChange: onSearchDataPlayerStateChange
        }
    }),
    e.setAttribute("src", "https://www.youtube.com/embed/?enablejsapi=1")) : quickSearchVideosIteration + 1 < quickSearchVideos.length && (quickSearchVideosIteration++,
    getVideoData(quickSearchVideos[quickSearchVideosIteration]))
}
let searchDataPlayerErrors = 0;
function onSearchDataPlayerReady() {
    try {
        searchDataPlayer.cuePlaylist({
            listType: "search",
            list: quickSearchQuery
        })
    } catch (e) {
        if (searchDataPlayerErrors++,
        console.log(e),
        searchDataPlayerErrors <= 5) {
            try {
                searchDataPlayer.destroy()
            } catch (e) {}
            quickSearch(quickSearchQuery)
        }
    }
}
function onSearchDataPlayerStateChange(e) {
    if (5 === e.data) {
        inBoxSearch || $("#inputBox").val("").attr("placeholder", placeholder).blur().focus(),
        quickSearchVideosIteration = 0,
        quickSearchVideos = searchDataPlayer.getPlaylist();
        let e = urlValidate(searchDataPlayer.getVideoUrl());
        e && ("playlist" === e[0] ? e = e[1][0] : "youtube" === e[0] && (e = e[1])),
        searchDataPlayer.destroy(),
        inBoxSearch && ($(".searchResult").remove(),
        searchResultsIteration = 0,
        searchResultsNameStorage = [],
        "block" !== $("#searchResultsWindow").css("display")) && toggleMenu("searchResults"),
        getVideoData(e),
        $("#searchProgress").css("display", "none")
    }
}
function makeId() {
    let t = "";
    var o = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let e = 0; e < 10; e++)
        t += o.charAt(Math.floor(Math.random() * o.length));
    return t
}
function flashStationIcon() {
    $("#stationIcon").css("color", "red"),
    setTimeout(function() {
        $("#stationIcon").css("color", "#00ff00")
    }, 300)
}
function sendStation(e) {
    void 0 !== stationServer && null !== stationServer && (stationTxQuiet ? stationTxQuiet = !1 : (console.log("Station Tx: " + e),
    flashStationIcon(),
    stationSocket.emit("msg", stationUserId + "," + e)))
}
function loadStation() {
    stationSocket = io("http://" + stationServer),
    stationUserId = makeId(),
    alert('Almighty Station "' + stationServer + '" connected!'),
    $("#stationIcon").css("display", "initial"),
    stationSocket.on("msg", function(e) {
        console.log("Station Rx: " + e);
        var t = e.split(",");
        if (t[0] !== stationUserId)
            switch (stationTxQuiet = !0,
            flashStationIcon(),
            t[1]) {
            case "addvideo":
                addVideo(t[2], t[3], t[4]);
                break;
            case "playerending":
                loopVideo();
                break;
            case "actionplayvideo":
                actionPlayVideo(+t[2]);
                break;
            case "actionremovevideo":
                actionRemoveVideo(+t[2]);
                break;
            case "forwardvideo":
                forwardVideo();
                break;
            case "backvideo":
                backVideo();
                break;
            case "videofunctionsplay":
                stationRemote ? $("#remotePauseIcon").removeClass("fa-play").addClass("fa-pause") : player.playVideo();
                break;
            case "videofunctionspause":
                stationRemote ? $("#remotePauseIcon").removeClass("fa-pause").addClass("fa-play") : player.pauseVideo();
                break;
            case "playlistfeaturesplaynext":
                playlistFeatures.playNext();
                break;
            case "playlistfeaturesrepeat":
                playlistFeatures.repeat();
                break;
            case "playlistfeaturesshuffle":
                playlistFeatures.shuffle();
                break;
            case "actionmovevideo":
                actionMoveVideo(+t[2], +t[3]),
                refreshVideoList(),
                setPlaylist(),
                makeSortable(),
                videoPreviews(),
                addAutoplayVideo();
                break;
            case "playlistnamechange":
                $("#playlistNameBox").val(t[2]),
                input(2)
            }
    })
}
function connectStation(e) {
    stationServer = e,
    $.ajax({
        url: "http://" + stationServer + "/socket.io/socket.io.js",
        dataType: "script",
        success: loadStation
    })
}
function disconnectStation() {
    stationSocket.disconnect(),
    $("#stationIcon").css("display", "none")
}
let securityWarning = !1;
function actionConnectStation() {
    var e = $("#connectStationBox").val();
    "https:" === window.location.protocol && !1 === securityWarning && (securityWarning = !0,
    alert("Note: Due to security protections, scripts on secured pages with 'https://' cannot make unsecured connections. Almighty Station runs without any onboard security, so this request will probably be blocked and you'll get a notification that the site requested unsecured scripts.\n\nIn order to use Almighty Station, either make an exception to 'Load unsafe scripts' or replace the 'https://' with 'http://' in the URL.")),
    connectStation(e)
}
function toggleRemote() {
    stationRemote ? (stationRemote = !1,
    $("#remotePauseIcon").css("display", "none"),
    $("#youtubeContainer").css("background", "none"),
    $("#youtube").css("display", "block"),
    $("#currentVideoTiming").css("opacity", "1")) : (stationRemote = !0,
    $("#remotePauseIcon").css("display", "block"),
    $("#youtubeContainer").css("background", "black"),
    $("#youtube").css("display", "none"),
    $("#currentVideoTiming").css("opacity", "0"))
}
function toggleZen() {
    zenMode ? (zenMode = !1,
    $("header, #forkme").removeClass("slideOutUp").addClass("slideInDown"),
    $("footer").removeClass("slideOutDown").addClass("slideInUp"),
    $("#links").off().css("display", "block").removeClass("fadeOut").addClass("fadeIn"),
    $("#main").removeClass("zen"),
    $("#zenModeToggle").prop("checked", !1)) : (zenMode = !0,
    $("header, #forkme").removeClass("slideInDown").addClass("slideOutUp"),
    $("footer").removeClass("slideInUp").addClass("slideOutDown"),
    $("#links").removeClass("fadeIn").addClass("fadeOut"),
    $("#links").on("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function() {
        $(this).css("display", "none")
    }),
    $("#main").addClass("zen"),
    $("#zenModeToggle").prop("checked", !0))
}
function toggleSBS() {
    $("#sbs").length ? ($("#sbs").remove(),
    cookie.del("sbs"),
    setBackground()) : ($("head").append('<link id="sbs" rel="stylesheet" href="res/css/sbs.min.css" type="text/css" />'),
    cookie.set("sbs", "1"))
}
function toggleSearchClose() {
    searchClose = !searchClose
}
function toggleMenu(e) {
    var t = "#" + e + "Window"
      , o = "#" + e + "Shadow";
    state = "none" !== $(t).css("display") ? "none" : "block",
    $(t).css("display", state),
    $(o).css("display", state),
    "searchResults" === e && "none" === state && ($("#inputBox").val("").focus(),
    hotkeySearchClose) && (hotkeySearchClose = !1,
    toggleSearchClose())
}
let DropOverlay = function() {
    this.open = function() {
        $("#dropShadow, #dropOverlay").css("display", "initial")
    }
    ,
    this.close = function() {
        $("#dropShadow, #dropOverlay").css("display", "none")
    }
}
  , dropOverlay = new DropOverlay;
function toggleAutoplayListOverride() {
    autoplayListOverride ? (autoplayListOverride = !1,
    $("#autoplayListOverrideToggle").prop("checked", !1)) : (autoplayListOverride = !0,
    $("#autoplayListOverrideToggle").prop("checked", !0))
}
function setBackground(e=!1) {
    let t;
    e ? (t = 'url("' + e + '") no-repeat center center fixed',
    cookie.set("background", e)) : (e = cookie.get("background"),
    t = "" !== e ? 'url("' + e + '") no-repeat center center fixed' : 'url("' + background + '") no-repeat center center fixed'),
    $("body, #blurBackground").css("background", t).css("background-size", "cover")
}
