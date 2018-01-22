var api = new PieceMakerApi({
    host: 'https://piecemaker2-api-public.herokuapp.com',
    api_key: '0310XfxjdjH4EdY1' //zugang zu piecemaker
})

var groupId = 189,
    zitate = [],
    currentDescription = 0,
    allDescriptions = [],
    allVideos = []

var videos, videoNum = 0, currentVideo;
var player, nextYTVideoId;

var descriptionsLoaded = function (descriptions) {
    allDescriptions = descriptions.filter(function (d) {
        return d.fields.description.length > 0
    })
    allDescriptions.map(function(d){
        var descriptionTime = d.utc_timestamp.getTime()
        var videoContext = allVideos.find(function(v){
            var videoTime = v.utc_timestamp.getTime()
            if (videoTime <= descriptionTime && descriptionTime <= videoTime + v.duration) {
                return v
            }
            return false
        })
        d.fields.context_event = videoContext.id
        d.fields.context_event_service_id = videoContext.fields.vid_service_id
        return d
    })
    zitate = allDescriptions.map(function (d) {
            return d.fields.description
        })

    alleZitate();
}

var videosLoaded = function (videos) {
    allVideos = videos
    api.listEventsOfType(groupId, 'description', descriptionsLoaded)
}

api.listEventsOfType(groupId, 'video', videosLoaded)

var alleZitate = function () {
    var container = $('#zitat-container')
    zitate.forEach(function(zitat, i){
        var $el = $('<span class="zitat">' + zitat + '&nbsp;</span>')
        container.append($el)
        $el.data('width', $el.outerWidth())
        var elText = $el.text()
        $el.text(elText + elText + elText + elText + elText + elText + elText + elText + elText + elText + elText)
        $el.css('display', 'block')
        $el.css('width', '49000px')
        $el.hover(
            function () {
                $(this).addClass('active')
            },
            function () {
                $(this).removeClass('active')
            })
        $el.click( //Video-Background
            function () {
                var youTubeId = allDescriptions[i].fields.context_event_service_id
                setYTVideo(youTubeId)
            })
    })
    window.requestAnimationFrame(animate);
}

var speed = 2
var animate = function (time) {
    $('#zitat-container .zitat.active').each(function (i, e) {
        var $e = $(e)
        var x = +($e.data('x') || 0)
        var width = +($e.data('width'))
        x -= speed
        if (x < (width * -1)) x += width
        $e.css('transform', 'translate3d(' + x + 'px, 0px, 0px)')
        $e.data('x', x)
    })
    window.requestAnimationFrame(animate);
}

//-----------------------------Video-Background---------------------------------

var videosLoaded = function (videosPM) {
    // console.log(videosPM)
    videos = videosPM
    currentVideo = videos[videoNum]
        // setVideo(currentVideo.fields.title)
        // setYTVideo(currentVideo.fields.vid_service_id)
}
api.listEventsOfType(groupId, 'video', videosLoaded)

var setYTVideo = function (YTVideoId) {
    nextYTVideoId = YTVideoId;
    if (player) {
        player.loadVideoById(nextYTVideoId, 0, 'large') // ID, Sek., Qualität
    } else {
        player = new YT.Player('video-container', {
/*            width: '100%',
            height: '100%',*/
            playerVars: {
                autoplay: 1,
                loop: 1,
                controls: 0,
                rel: 0,
                showinfo: 0,
                mute: 1,
                autohide: 1,
                modestbranding: 1,
                vq: 'hd1080'
            },
            videoId: nextYTVideoId
        });
    }
}

function onYouTubeIframeAPIReady() {
    if (nextYTVideoId) {
        setYTVideo(nextYTVideoId)
    }
}

//-----------------loading--------------------------

function onReady(callback) {
    var intervalID = window.setInterval(checkReady, 1000);
    function checkReady() {
        if (document.getElementsByTagName('body')[0] !== undefined) {
            window.clearInterval(intervalID);
            callback.call(this);
        }
    }
}

onReady(setTimeout(function () {
    document.querySelector("div.loading").classList.add("hidden")
}));
