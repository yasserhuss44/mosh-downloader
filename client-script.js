var sectionList = [];
function getPageContents(callback, url, params) {
    http = new XMLHttpRequest();
    if (params != null) {
        http.open("POST", url, true);
        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    } else {
        http.open("GET", url, true);
    }
    http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
            callback(http.responseText);
        }
    }
    http.send(params);
}

function downloadFile(url) {
   $.ajax({
       url:url,

   })
}
function getDownloadUrl(pageurl, callback) {
    getPageContents((resp) => {
        var el = document.createElement('html');
        el.innerHTML = resp;
        const hashedUrl = el.getElementsByClassName('download')[0].href;
        const downloadName=el.getElementsByClassName('download')[0].attributes['data-x-origin-download-name'].value.replace('#',' Sharp');

        callback({hashedUrl,downloadName});

        // resp.indexOf('<div class='row attachment'><a class='download'
        //   href='')
        // videosUrl.push(download) ;
    }, pageurl)
}


$('.course-section').each(function (index, item) {
    const sectionTitle = $(item).find('.section-title')[0].innerText.replace(/(?:\r\n|\r|\n)/g, '').replace('#',' Sharp').trim();
    let section = { SectionTitle: sectionTitle, lecturesList: [] };
    $(item).find('.section-list').find('li.section-item').each(function (index2, video) {
        const name = $(video).find('.lecture-name')[0].innerText.replace(/(?:\r\n|\r|\n)/g, '').trim()
        let trimmedName = '';
        if (name.indexOf('(') != -1)
            trimmedName = name.slice(0, name.length - 10).trim();
        else
            trimmedName = name.trim();

        let ext=$(video).find('.fa-file-text').length>0?'txt':'mp4';
        const videourl = video.attributes['data-lecture-url'].value;
        const fullurl = `https://codewithmosh.com/${videourl}`;
        sectionList.push({ moduleName:sectionTitle,videoUrl: fullurl, videoName: trimmedName,extension:ext,courseName:'C Sharp Advanced: Get Ready for Job Interviews',hashedUrl:'' });
    })


})
var i = 0;                     //  set your counter to 1

function myLoop() {           //  create a loop function
    setTimeout(function () {   
        let videoInfo=sectionList[i]; //  call a 3s setTimeout when the loop is called
        getDownloadUrl(videoInfo.videoUrl, function (hashedObject) {
            videoInfo.hashedUrl=hashedObject.hashedUrl;
            videoInfo.downloadName=hashedObject.downloadName;
          let url=`http://localhost:3100/?videoUrl=${videoInfo.hashedUrl.replace('https','http')}&courseName=${videoInfo.courseName}&videoName=${videoInfo.downloadName}&moduleName=${videoInfo.moduleName}`;
          console.log(`${i}:    ${url}`);
            $.get(url, function(data, status){
               // alert("Data: " + data + "\nStatus: " + status);
              });
        })
        i++;                     //  increment the counter
        if (i < sectionList.length) {            //  if the counter < 10, call the loop function
            myLoop();             //  ..  again which will trigger another
        }                        //  ..  setTimeout()
    }, 120000)
}

 setTimeout(function () {
     myLoop();
 }, 10000)
