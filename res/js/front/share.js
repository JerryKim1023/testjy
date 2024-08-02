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

new ClipboardJS("#saveButton");
function saveButton() {
  $("#saveButton").text("재생목록이 복사 되었어요");
  setTimeout(function() {
    resetSaveButton();
  }, 2000);
}

function resetSaveButton() {
  if ($(window).width() <= 600) {
    $("#saveButton").text("저장");
  }
  else {
    $("#saveButton").text("링크목록 복사");
  }
}
resetSaveButton();

function shareOnRedditAd() {
  let i=0;
  let text = document.getElementById('ad');
  text.style.color = 'grey';
  function flash() {
    i++;
    text.style.color = (text.style.color=='grey') ? 'lightblue':'grey';
    if (i == 11) {
      clearInterval(clr);
    }
  }
  let clr = setInterval(flash, 300);
}

function shareOnReddit() {
  let playlistName;
  if (videos[0]) {
    playlistName = videos[0];
  }
  else {
    playlistName = $("#playlistNameBox").attr("placeholder");
  }
  if (window.location.hash.substr(1).length <= 10000) {
    window.open("https://www.reddit.com/user/JerryKim1023/submit?resubmit=true&title=Playlist%20-%20" + playlistName + "&url=https://https://jerrykim1023.github.io/Player/%23" + window.location.hash.substr(1), "_blank");
  }
  else {
    alert("The playlist you are sharing is too long to automatically post, so please copy your Almighty Playlist URL and paste it into the open Reddit tab (you can copy by clicking the \"링크목록 복사\" button).\n\nSorry for this inconvenience.");
    window.open("https://old.reddit.com/r/JerryKim1023/submit?resubmit=true&title=Playlist%20-%20" + playlistName + "&url=%5BPaste+shortened+link+here%5D", "_blank");
  }
}
