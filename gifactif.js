/**********************************************
** GIFACTIF
** GIPHY PLUGIN FOR THE FORUMACTIF SCEDITOR
** DEVELOPED BY SETH CLYDESDALE
** API BY https://github.com/Giphy/GiphyAPI
**********************************************/
(function() {

  // return if gifactif has been initialized
  if (window.gifactif) {
    if (window.console && console.warn) {
      console.warn('gifactif has already been initialized');
    }
    return;
  }


  // setup global object
  window.gifactif = {
    key : 'dc6zaTOxFJmzC', // PUBLIC BETA KEY
    limit : 27, // max image results
    delay : 100, // delay before searches commence (100ms)


    // dropdown markup
    dropDown : $(
      '<div>'+
        '<input type="text" id="gifactif_search" placeholder="Search for a GIF..." style="width:90%;" onkeyup="gifactif.search(this.value);"/>'+
        '<div id="gifactif_results" onscroll="gifactif.scrolling(this);"></div>'+
        '<div id="giphy_attribution_mark"></div>'+
      '</div>'
    )[0],


    // initial setup of the SCEditor command
    init : function () {
      if ($.sceditor && window.toolbar) {

        // set the gifactif command
        $.sceditor.command.set('gifactif', {

          tooltip : 'Insert a GIF',

          // Dropdown and general functionality for gifactif
          dropDown : function (editor, caller, callback) {
            gifactif.editor = editor;
            gifactif.callback = callback;
            editor.createDropDown(caller, 'gifactif', gifactif.dropDown);
          },


          // WYSIWYG MODE
          exec : function(caller) {
            var editor = this;

            $.sceditor.command.get('gifactif').dropDown(editor, caller, function(gif) {
              editor.insert('[img]' + gif + '[/img]');
            });
          },


          // SOURCE MODE
          txtExec : function(caller) {
            var editor = this;

            $.sceditor.command.get('gifactif').dropDown(editor, caller, function(gif) {
              editor.insertText('[img]' + gif + '[/img]');
            });
          }

        });


        // add gifactif to the editor toolbar
        toolbar = toolbar.replace('image,', 'image,gifactif,');

        // add CSS for button image and dropdown
        $('head').append(
          '<style type="text/css">'+
            '.sceditor-button-gifactif div { background-image:url(http://i35.servimg.com/u/f35/18/21/60/73/giphy10.png) !important; }'+
            '.sceditor-button-gifactif:after, .sceditor-button-gifactif:before { content:""; }'+ // Forumactif Edge override
            '#gifactif_results { width:336px; margin:10px auto; max-height:200px; overflow-x:hidden; overflow-y:auto; }'+
            '#gifactif_results img { vertical-align:top; margin:3px; cursor:pointer; }'+
            'html #giphy_attribution_mark { background:url(http://i35.servimg.com/u/f35/18/21/60/73/powere11.png) no-repeat 50% 50% transparent !important; height:22px !important; width:100%; !important; min-width:200px !important; display:block !important; visibility:visible !important; opacity:1 !important; }'+
          '</style>'
        );
      }

    },


    // search for a GIPHY gif
    search : function (query) {
      if (gifactif.timeout) {
        gifactif.abort(); // abort ongoing searches and requests
      }

      if (query) {

        // set a small timeout in case the user is still typing
        gifactif.timeout = window.setTimeout(function() {
          $('#gifactif_results', gifactif.dropDown).html('Searching...');
          gifactif.query = encodeURIComponent(query);

          gifactif.request = $.get('http://api.giphy.com/v1/gifs/search?q=' + gifactif.query + '&limit=' + gifactif.limit + '&rating=pg-13&api_key=' + gifactif.key, function(data) {
            // update global data such as page offsets for scrolling
            gifactif.request = null;
            gifactif.offset = data.pagination.offset + gifactif.limit;
            gifactif.offset_total = data.pagination.total_count;

            $('#gifactif_results', gifactif.dropDown).html(''); // reset HTML content
            gifactif.addGIF(data); // send data to be parsed
          });

        }, gifactif.delay);

      } else {
        $('#gifactif_results', gifactif.dropDown).html('');
      }
    },


    // abort ongoing searches and requests
    abort : function () {
      if (gifactif.timeout) {
        window.clearInterval(gifactif.timeout);
        gifactif.timeout = null;
      }

      if (gifactif.request) {
        gifactif.request.abort();
        gifactif.request = null;
      }
    },


    // add gifs to the result list
    addGIF : function (data) {
      // setup data and begin parsing results
      var gif = data.data,
          i = 0,
          j = gif.length,
          frag = document.createDocumentFragment();

      for (; i < j; i++) {
        frag.appendChild($('<img id="' + gif[i].id + '" src="' + gif[i].images.fixed_width_small.url + '" />').click(gifactif.insert)[0]);
      }

      // add results to the result list
      $('#gifactif_results', gifactif.dropDown).append(frag);
    },


    // listen to the scrolling so we can add more gifs when the user reaches the bottom
    scrolling : function (that) {
      if (that.scrollHeight - that.scrollTop === that.clientHeight) {
        gifactif.loadMore();
      }
    },


    // load more results once the user has scrolled through the last results
    loadMore : function () {
      if (gifactif.offset < gifactif.offset_total) {
        gifactif.request = $.get('http://api.giphy.com/v1/gifs/search?q=' + gifactif.query + '&offset=' + gifactif.offset + '&limit=' + gifactif.limit + '&rating=pg-13&api_key=' + gifactif.key, function(data) {
          gifactif.request = null;
          gifactif.offset = data.pagination.offset + gifactif.limit;
          gifactif.offset_total = data.pagination.total_count;

          gifactif.addGIF(data); // send data to be parsed
        });
      }
    },


    // inserts the gif into the editor
    insert : function () {
      // add the gif to the editor and close the dropdown
      gifactif.callback('http://media0.giphy.com/media/' + this.id + '/giphy.gif');
      gifactif.editor.closeDropDown(true);

      // reset dropdown fields
      $('#gifactif_results', gifactif.dropDown).html('');
      $('#gifactif_search', gifactif.dropDown).val('');
    }
  };

  // initilize gifactif
  $(gifactif.init);
}());
