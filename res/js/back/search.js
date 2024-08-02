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

// Start Quick Search

function addSearchResult(name, id) {
    searchResultsNameStorage.push(name);
    name = escape(name);
    $("#searchResults").append("<div class=\"searchResult\" onclick=\"loadSearchResult(this);\"><div class=\"left\"><p>" + name + "</p></div><div class=\"right\"><img src=\"https://i.ytimg.com/vi/" + id + "/default.jpg\" /></div></div>");
  }
  
  function loadSearchResult(element) {
    let iteration = $(".searchResult").index(element);
    let id = quickSearchVideos[iteration];
    console.log("i:" + iteration + ",id:" + id);
  
    //getVideoData function equivalent without reloading video names
    let videoId = id;
    let videoTime = 0;
    let videoName = searchResultsNameStorage[iteration];
    addVideo(videoName, videoTime, videoId);
  
    if (searchClose) {
      toggleMenu("searchResults");
    }
  }
  
  // * This function loads the video for the Quick Search functionality
  
function quickSearch(query) {
    return new Promise((resolve, reject) => {
        try {
            // 기존 quickSearch 코드
            if (!inBoxSearch && quickSearchVideosIteration + 1 < quickSearchVideos.length) {
                $("#inputBox").val("").attr("placeholder", loadingPlaceholder);
            }
            if (query !== "") {
                $("#searchProgress").css("display", "flex");

                quickSearchQuery = query;
                let searchDataFrame = document.createElement("iframe");
                searchDataFrame.setAttribute("id", "searchDataFrame");
                searchDataFrame.setAttribute("src", "");
                document.getElementById("dataFramesContainer").appendChild(searchDataFrame);
                searchDataPlayer = new YT.Player('searchDataFrame', {
                    events: {
                        'onReady': function() {
                            // 검색이 성공적으로 실행된 경우
                            searchDataPlayer.cuePlaylist({ listType: "search", list: quickSearchQuery });
                            resolve();
                        },
                        'onStateChange': onSearchDataPlayerStateChange
                    }
                });
                searchDataFrame.setAttribute("src", "https://www.youtube.com/embed/?enablejsapi=1&origin=https://jerrykim1023.github.io");
            } else if (quickSearchVideosIteration + 1 < quickSearchVideos.length) {
                quickSearchVideosIteration++;
                getVideoData(quickSearchVideos[quickSearchVideosIteration]);
                resolve();
            }
        } catch (error) {
            reject(error); // 오류 발생 시 reject 호출
        }
    });
}
  
  // * This function uses the search results to add the next video
  
  function onSearchDataPlayerStateChange(event) {
    if (event.data === 5) {
      if (!inBoxSearch) {
        $("#inputBox").val("").attr("placeholder", placeholder).blur().focus();
      }
      quickSearchVideosIteration = 0;
      quickSearchVideos = searchDataPlayer.getPlaylist();
      let data = searchDataPlayer.getVideoUrl();
      
      let id = urlValidate(data);
      if (id) {
        if (id[0] === "playlist") {
          id = id[1][0];
        }
        else if (id[0] === "youtube") {
          id = id[1];
        }
      }
      
      searchDataPlayer.destroy();
      if (inBoxSearch) {
        $(".searchResult").remove();
        searchResultsIteration = 0;
        searchResultsNameStorage = [];
        //as long as not open already (trying to search twice will close on second)
        if ($("#searchResultsWindow").css("display") !== "block") {
          toggleMenu("searchResults");
        }
      }
      getVideoData(id);
      
      $("#searchProgress").css("display", "none");
    }
  }
  
  // End Quick Search
  