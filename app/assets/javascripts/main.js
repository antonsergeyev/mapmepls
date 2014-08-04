var app = {
    params: $.extend(window.params || {}, {
        tweetTtl: 8*1000,
        defaultZoom: 2
    })
};
app.tweetsProvider = {
    dispatcher: new WebSocketRails(app.params.ws.url),
    init: function () {
        var channel = this.dispatcher.subscribe('tweets');
        channel.bind('new', $.proxy(app.map.addTweet, app.map));
    }
};
app.map = {
    gmap: null,
    $map: null,
    lastTweet: null,
    init: function () {
        var $container = $('.map-container');
        this.$map = $container.find('.map');
        var mapOptions = {
            center: new google.maps.LatLng(-34.397, 150.644),
            zoom: app.params.defaultZoom,
            mapTypeId: google.maps.MapTypeId.SATELLITE
        };
        this.gmap = new google.maps.Map(this.$map[0], mapOptions);
        this.gmap.setTilt(45);
    },

    addTweet: function (data) {
        console.log(data);
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(data.geo.coordinates[0], data.geo.coordinates[1]),
            map: this.gmap,
            icon: {
                url: data.user.profile_image_url,
                size: new google.maps.Size(48, 48)
            },
            title: data.text,
            optimized: false,
            animation: google.maps.Animation.DROP
        });
        this.$map.find('img[src*="profile_images"]').addClass("map-tweet-avatar");
        var infowindow = new google.maps.InfoWindow({
            content: data.text
        });
        this.gmap.panTo(marker.getPosition());
        this.gmap.setZoom(Math.round(Math.random() * (4 - 2) + 2));

        if (this.lastTweet) {
            this.hideTweet(this.lastTweet);
            this.lastTweet=null;
        }
        this.lastTweet={
            data: data,
            marker: marker,
            infowindow: infowindow
        };
        setTimeout($.proxy(function(){
            infowindow.open(this.gmap, marker);
        }, this), 200);
        setTimeout($.proxy(function () {
            this.hideTweet(this.lastTweet);
        }, this), app.params.tweetTtl);
    },

    hideTweet: function(data) {
        data.infowindow.setMap(null);
        data.marker.setMap(null);
    }
};
app.init = function () {
    if (typeof google==='undefined') {
        alert('Sorry, seems like you don\'t have an internet connection');
        return;
    }
    $(function () {
        app.map.init();
        app.tweetsProvider.init();
    });
};
app.init();