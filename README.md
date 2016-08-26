# What is GIFActif ?

GIFActif is a [Giphy](http://giphy.com/) search plugin for the free forum service, [Forumotion](http://www.forumotion.com/) aka [Forumactif](http://www.forumactif.com/). GIFActif adds a new button to the message editor that gives your members the ability to search for GIFS and attach them to their messages without ever leaving the page !

**Table of Contents**

1. [Introduction](#what-is-gifactif-)
2. [Installation](#how-to-install-gifactif-on-forumotion)
3. [Modifications](#modifications)
4. [Extra Goodies](#extra---display-giphy-gifs-like-facebook)

![preview](http://i.imgur.com/2DO0i76.gif)

[**CLICK TO VIEW DEMO**](http://demoactif.forumactif.com/t31-demo-gifactif-giphy-button-for-the-editor?demo=gifactif&demo_user=true)

GIFActif uses the [Giphy Search API](https://github.com/Giphy/GiphyAPI#search-endpoint) to find GIFs just for you ! Why express yourself with just words alone when you can add a GIF to liven things up ?

**NOTE :** As this project is open source, it'll be using the public beta key provided by Giphy, which is subject to rate limit constraints.

## How to Install GIFActif on Forumotion

To install this plugin on your Forumotion forum, navigate to Admin Panel > Modules > JavaScript codes management, and create a new script with the following settings.

1. **Title :** GIFActif
2. **Placement :** In all the pages
3. In the textarea, paste the code from [**this page**](https://raw.githubusercontent.com/SethClydesdale/gifactif/master/gifactif.js) and hit submit.

After this the Giphy button will be installed on your forum !

### How does it work ?
- GIFActif adds a new button to the editor with the Giphy logo --> ![](http://i35.servimg.com/u/f35/18/21/60/73/giphy10.png)
- Clicking the button opens the Giphy search drop down.
- Type any words you want into the search bar and you'll immediately be presented with GIFs relevant to your keywords.
- Scrolling to the end of the results will load more results.
- Click the GIF you want to add to your message and you're done !
- Open the drop down again to find more GIFs !!

## Modifications

**1.** limit 

The **limit** variable determines the maximum amount of GIFs that are loaded into the search results at a time. By default, 26 GIFs are loaded into the results when you search or scroll to the end of the results. Increment or decrement this value to show more or less results at a time.

```javascript
limit : 26, // max image results
```

***

**2.** delay

The **delay** variable defines a small delay before the search results are submitted to Giphy. This helps reduce the frequency of requests while you're still typing. By default, the delay is 200ms, if you want it to be longer or shorter, simply modify the value of this variable.

```javascript
delay : 200, // delay before searches commence (200ms)
```

***

**3.** auto_close

The **auto_close** variable allows you to choose if the Giphy search drop down closes once you choose an image. By default the drop down closes when you've chosen a GIF. If you want the drop down to remain open after picking a GIF simply change the value of this option to **false** !

```javascript
auto_close : true, // choose if the drop down automatically closes
```

***

**4.** language

If you want to change the general language of this plugin simply find and edit the **lang** object and **dropDown** element :

```javascript
    // general language settings
    lang : {
      searching : 'Searching...',
      not_found : 'No results found.. <img src="http://illiweb.com/fa/i/smiles/icon_sad.gif" style="margin:0;vertical-align:middle;"/>'
    },
 
    // dropdown markup
    dropDown : $(
      '<div>'+
        '<input type="text" id="gifactif_search" placeholder="Search for a GIF..." style="width:90%;"/>'+
        '<div id="gifactif_results" onscroll="gifactif.scrolling(this);"><div id="gifactif_images"></div></div>'+
        '<div id="giphy_attribution_mark"></div>'+
      '</div>'
    )[0],
```

The lang object contains the basic texts, whereas dropDown concerns the structure of search drop down.

***

**5.** key

The **key** variable is for the API key provided by Giphy to everyone -- it's necessary for submitting searches for the vast awesomeness that Giphy offers. You shouldn't need to edit this variable.


## Extra - Display Giphy GIFs like Facebook

Thanks to [baivong](https://github.com/SethClydesdale/gifactif/pull/1), you can also install an additional plugin which displays Giphy's GIFs like Facebook ; the GIFs will remain static until you click on them !

![](http://i35.servimg.com/u/f35/18/45/41/65/captur12.gif)

[**CLICK TO VIEW DEMO**](https://jsfiddle.net/baivong/a4z0hz63/embedded/result,html,js/)

To install this additional plugin, go to Admin Panel > Modules > JavaScript codes management and create a new script with the following settings.

1. **Title :** GIFActif Player
2. **Placement :** In all the pages
3. In the textarea, paste the code from [**this page**](https://raw.githubusercontent.com/SethClydesdale/gifactif/master/gifactif-player.js) and hit submit.

When you're finished, save the script and the Giphy GIFs should now display like Facebook !
