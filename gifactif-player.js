// Demo: https://jsfiddle.net/baivong/a4z0hz63/embedded/result,html,js/

jQuery(function() {
  'use strict';

  // Giphy image in post
  var $giphyImg = $('.postbody, .post-entry').find('img[src*=".giphy.com/media/"][src$="giphy.gif"]');

  if (!$giphyImg.length) return;

  // Add style to player like Facebook
  $('head').append($('<style/>', {
    text: '.gifactif_icon_bg,.gifactif_icon_load,.gifactif_icon_text{background-image:url(//i.imgur.com/VvrpCQJ.png);background-repeat:no-repeat;background-size:auto;left:50%;top:50%;cursor:pointer}.gifactif_wrap{position:relative;display:inline-block}.gifactif_icon_bg{background-position:0 0;height:72px;margin-left:-36px;margin-top:-36px;position:absolute;width:72px}.gifactif_icon_load{background-position:0 -73px;height:66px;margin-left:-33px;margin-top:-33px;position:absolute;width:66px}.rotate-spinner{-webkit-animation:rotateSpinner 2.5s linear infinite;animation:rotateSpinner 2.5s linear infinite}.gifactif_icon_text{background-position:0 -140px;height:17px;margin-left:-16px;margin-top:-9px;position:absolute;width:32px}.gifactif_external{display:block;background:url(//i.imgur.com/1yqUihp.png) repeat-x;bottom:0;color:#fff;font-size:11px;-webkit-font-smoothing:antialiased;font-weight:700;height:56px;left:0;position:absolute;right:0;text-align:left;text-shadow:0 1px 4px rgba(0,0,0,.4);text-transform:uppercase;white-space:nowrap}.gifactif_external_text{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;bottom:9px;left:11px;max-width:400px;position:absolute;vertical-align:top;color:#fff}.gifactif_external_icon{width:24px;height:24px;background-image:url(//i.imgur.com/VvrpCQJ.png);background-size:auto;background-repeat:no-repeat;display:inline-block;background-position:0 -158px;bottom:9px;position:absolute;right:10px}.gifactif_player,.gifactif_poster{max-width:100%}.gifactif_cover{display:block}.gifactif_player,.gifactif_video .gifactif_cover{display:none}.gifactif_video .gifactif_player{display:block}@-webkit-keyframes rotateSpinner{0%{-webkit-transform:rotate(0);transform:rotate(0)}100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}@keyframes rotateSpinner{0%{-webkit-transform:rotate(0);transform:rotate(0)}100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}'
  }));

  // Replace GIF image to player like Facebook
  $giphyImg.replaceWith(function() {
    var imgUrl = this.src,
      pre = imgUrl.replace(/\.gif$/, '');

    return '<div class="gifactif_wrap" data-pre="' + pre + '" data-id="' + pre.match(/\/media\/([^\/]+)\/giphy/)[1] + '"><img class="gifactif_cover gifactif_poster" src="' + pre + '_s.gif" alt=""><div class="gifactif_cover gifactif_icon"><div class="gifactif_icon_bg"></div><div class="gifactif_icon_load"></div><div class="gifactif_icon_text"></div></div><a class="gifactif_cover gifactif_external" href="' + pre + '_s.gif" target="_blank"><div class="gifactif_external_text">giphy.com</div><i class="gifactif_external_icon"></i></a></div>';
  });

  // Click on player
  $('.gifactif_wrap').on('click', function(e) {
    var $this = $(this),
      $cover = $this.find('.gifactif_cover'),
      $video = $this.find('.gifactif_player'),
      $poster = $this.find('.gifactif_poster'),
      $loader = $this.find('.gifactif_icon_load'),
      pre = $this.data('pre');

    // Skip external url
    if (e.target.className === 'gifactif_cover gifactif_external') return;

    if (e.target.tagName !== 'VIDEO') {
      if (!$video.length) {

        // Generate video player
        $video = $('<video/>', {
          class: 'gifactif_player',
          poster: pre + '_s.gif',
          loop: 'loop',
          muted: 'muted',
          width: $poster.width(),
          height: $poster.height(),
          html: '<source src="' + pre + '.mp4" type="video/mp4"><source src="' + pre + '.webm" type="video/webm">Your browser does not support HTML5 video.'
        });
        $this.append($video);

        // Loading effect
        $loader.addClass('rotate-spinner');

        $video.on('canplay canplaythrough', function() {
          $loader.removeClass('rotate-spinner'); // Disable loading effect

          $this.addClass('gifactif_video'); // Hide image, show video
          $video.trigger('play');
        });

        $video.on('click', function() {
          $this.removeClass('gifactif_video'); // Show image, hide video
          $video.trigger('pause');
        });

        // Get real source url
        $.get('//api.giphy.com/v1/gifs/' + $this.data('id') + '?api_key=' + (window.gifactif ? window.gifactif.key : 'dc6zaTOxFJmzC')).done(function(res) {
          if (res.meta.status !== 200) return;

          $this.find('.gifactif_external').attr('href', (res.data.source_post_url || res.data.url));
          $this.find('.gifactif_external_text').text(res.data.source_tld || 'giphy.com');
        });

      } else {
        $this.addClass('gifactif_video');
      }

      $video.get(0).currentTime = 0; // Play video from the start
      $video.trigger('play');
    }
  });

});
