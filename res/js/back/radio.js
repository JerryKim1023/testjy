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

// Start Almighty Radio

// * This function loads the video for the Almighty Radio function


// 맨 아래 라디오 버튼 누를 때 작동
function loadAutoplayData(iteration) {
  autoplayLoading = true;
  autoplayVideos = [];
  autoplayVideoIteration = -1;

  console.log("Autoplay list at loadAutoplayData start: ", autoplayList);
  
  // videos 배열이 비어있거나 유효한 iteration 값인지 확인
  if (videos.length > 0 && iteration >= 0 && iteration < videos.length) {
      if (autoplayList.length > 0) {
          console.log("Autoplay List is set.");
          baseAutoplayVideoId = autoplayList[0];
      } else {
          console.log("Autoplay List is not set, using fallback.");
          $("tr").removeClass("radio");
          highlight(iteration, "radio", false);
          baseAutoplayVideoId = videos[iteration][2];
      }

      // 기존 YT.Player 대신, 직접 iframe을 사용하여 동영상 재생
      let dataFrame = document.getElementById("radioDataFrame");

      if (!dataFrame) {
          dataFrame = document.createElement("iframe");
          dataFrame.setAttribute("id", "radioDataFrame");
          document.getElementById("dataFramesContainer").appendChild(dataFrame);
      }

      // videoId를 기준으로 다음 영상을 자동으로 재생하도록 설정
      dataFrame.setAttribute("src", "https://www.youtube.com/embed/" + baseAutoplayVideoId + "?autoplay=1&enablejsapi=1&rel=1");

      dataFrame.onload = function() {
          console.log("Video is playing, loaded from baseAutoplayVideoId: " + baseAutoplayVideoId);
          // 다음 재생할 영상을 로드하는 로직 추가
          prepareNextVideo(baseAutoplayVideoId);
      };

  } else {
      console.error("Invalid iteration value or empty videos array.");
  }
}

// 다음 재생할 영상을 준비하는 함수
function prepareNextVideo(currentVideoId) {
  console.log("Preparing next video based on current video ID: " + currentVideoId);

  // currentVideoId를 기반으로 다음 추천 영상을 가져오기 위한 로직
  // YouTube의 자동 재생 기능을 활용하여 다음 영상을 자동으로 재생하도록 설정
  let dataFrame = document.getElementById("radioDataFrame");
  dataFrame.onload = function() {
      // 로드된 iframe에서 자동으로 다음 영상을 재생
      console.log("Next video is ready to be played.");
  };
}
  

  // * This function cues the playlist for use in the next function
  
  function onRadioDataPlayerReady() {
    console.log("작동여부1?")
    let autoplayUrl;
    if (autoplayList) {
      autoplayUrl = autoplayList[1];
    }
    else {
      autoplayUrl = "RD" + baseAutoplayVideoId;
    }
    radioDataPlayer.cuePlaylist({list:autoplayUrl});
  }
  
  // * This function compiles an array of videos for Almighty Radio
  // * Making sure they aren't in the current playlist already
  
  function onRadioDataPlayerStateChange(event) {
    console.log("작동여부2?")
    if (event.data === 5) {
      let autoplayVideosSpare = [];
      autoplayVideos = radioDataPlayer.getPlaylist();
      console.log("Autoplay Videos from Player: ", autoplayVideos);
      
      if (!autoplayList || autoplayListOverride) {
        for (let i = 0; i < autoplayVideos.length; i++) {
          let notInPlaylist = true;
          let autoplayVideo = autoplayVideos[i];
          for (let x = 1; x < videos.length; x++) {
            if (videos[x][2] === autoplayVideo) {
              notInPlaylist = false;
            }
          }
          if (notInPlaylist) {
            autoplayVideosSpare.push(autoplayVideo);
          }
        }
        autoplayVideos = autoplayVideosSpare;
      }
  
      radioDataPlayer.destroy();
      if (autoplayVideos.length > 1) {
        autoplayLoading = false;
        addAutoplayVideo();
      }
    }
  }
  
  // * This function loads the latest Almighty Radio video into the playlist
  
  function addAutoplayVideo(base = videoIteration, option = '') {
    console.log("Calling addAutoplayVideo with base: " + base + " and option: " + option);
    console.log("Current autoplayList: ", autoplayList);
    
    if (!base) { base = videoIteration; } //conditional for uses that need option, yet not setting base
    if (playlistAutoplay && !autoplayLoading && (videos.length > 0 || autoplayList)) {
      if (!(autoplayVideos.length > 0) || option == 'reset') {
        loadAutoplayData(base);
      }
      else if (videoIteration === videoCounter || (autoplayList && !autoplayListOverride) || option == 'override') {
        if (autoplayVideoIteration < autoplayVideos.length - 1) {
          autoplayVideoIteration++;
          console.log("Getting new video: " + autoplayVideos[autoplayVideoIteration] + " data");
          getVideoData(autoplayVideos[autoplayVideoIteration]);
        }
        else if (!autoplayList && !autoplayListOverride) {
          loadAutoplayData(base);
        }
        else {
          //kill Almighty Radio after the playlist is loaded
          playlistFeatures.autoplay();
        }
      }
    }
  }
  
  // End Almighty Radio
  