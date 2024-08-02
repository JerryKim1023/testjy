/**
  Copyright 2022 Almighty
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
      http://www.apache.org/licenses/LICENSE-2.0
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
**/

function startVideoProgress() {
    if (!videoPaused) {
      actionTimers.clear();
      videoProgress();
    }
    else {
      actionTimers.clear();
      videoProgress();
      actionTimers.pause();
    }
  }
  
  let tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  let firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  
  // **BREAKTHROUGH THE GREATER!**
  let player;
  function onYouTubeIframeAPIReady() {
    player = new YT.Player('youtube', {
      playerVars: {
        'origin': 'https://jerrykim1023.github.io' // 'origin' 파라미터 추가
      },
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange,
        'onError': onError
      }
    });
    console.log("Debug: Player loaded");
  }
  
  // 비디오가 끝날 때 다음 비디오 자동재생
  function onPlayerStateChange(event) {
    switch(event.data) {
      //unstarted
      case -1:
        console.log(event)
        console.log(event.data)
        console.log("unstarted");
        break;
      //ending
      case 0:
        console.log("ending");
        sendStation("playerending");
        loopVideo();
        break;
      //playing
      case 1:
        console.log("playing");
        videoFunctions.play();
        startVideoProgress();
        break;
      //paused
      case 2:
        console.log("paused");
        videoFunctions.pause();
        break;
      //buffering
      case 3:
        console.log("buffering");
        videoPaused = false;
        break;
      //cued
      case 5:
        console.log("cued");
        startVideoProgress();
        break;
    }
  }
  
  // 플레이어가 준비되면 호출되면서 비디오 자동재생
  function onPlayerReady(event) {
    console.log("Debug: onPlayerReady");
    startVideoProgress();
  
    getPlaylist();
    makeSortable();
    videoPreviews();
  }
  
  function onError(event) {
    console.log(videoPaused);
    videoErrorIds.push(videos[videoIteration][2]);
    $("tr:nth-child(" + videoIteration + ")").addClass("videoError");
    forwardVideo();
  }
  
  // YouTube iframe API 초기화
  $("#youtube").attr("src", "https://www.youtube.com/embed/?enablejsapi=1&origin=https://jerrykim1023.github.io"); // 'origin' 파라미터 추가
  