//REWRITE TO ALLOW VERTICAL CAROUSEL
// ***** TODO: can remove use of padding argument! The messages currently supploy padding=0 and instead
// ***** TODO: non-unique ids for multiple carousels!!
// a class "message" is applied to each card, and the padding is then set in the css!

//_this         = a copy of the caller's 'this' object which can be used by the callback
// containerDiv = container for the carousel
// cardSize     = 1x2 array [w, h]. Value of 'null' means the cards will be auto-sized.
// cardList     = array where each element is the HTML for a card
// ids          = array of ids for each of the cards
// padding      = the mount of padding to add between the cards
// isHorizontal = the carousel scrolls horizontally rather than vertically
// callback     = a function to call when the cards are clicked. The card's id is passed to the callback.
carousel = function(_this, containerDiv, cardSize, cardList, ids, padding, isHorizontal, callback){
    this._callingThis = _this;
    this.containerDiv = containerDiv;
    this.cardList = cardList;
    this.ids = ids;
    this.cardSize = cardSize;
    this.padding = padding;
    this.isHorizontal = isHorizontal;
    this.callback = callback;
    this.init();
}

carousel.prototype._callingThis = null;
carousel.prototype.containerDiv = null;
carousel.prototype.cardList = null;
carousel.prototype.ids = null;
carousel.prototype.cardSize = null;
carousel.prototype.padding = null;
carousel.prototype.isHorizontal = true;
carousel.prototype.callback = null;

/*  Builds the carousel.
 *  1) Creates a div wide enough to fit all cards in (including padding)
 *  2) Adds all the cards in cardList to this, each wrapped in a container
 *     of the specified dimensions, and with the specified padding.
 *  3) Appends this wide div to the specified container.
 */
carousel.prototype.init = function(){
    var _this = this;
    //::: WARNING ::: multiple instances of carousel will have non-unique ids!!
    var carouselContainer;
    if(this.isHorizontal) {
        carouselContainer = '<div id="carouselContainer"' + '>';
                                //'style="width:' + _this.recalcSize(_this.cardList.length).toString() + 'px;' +
                                //      'height:' + _this.cardSize[1].toString() + 'px;">';
    } else {
        carouselContainer = '<div id="carouselContainer"' + '>';
                                //'style="height:' + _this.recalcSize(_this.cardList.length).toString() + 'px;' +
                                //      'width:' + _this.cardSize[0].toString() + 'px;">';
    }
    $.each(this.cardList, function(index, obj) {
        var css_string = (_this.cardSize == null) ? '' : 'style="width:' + _this.cardSize[0].toString() + 'px; ' +
                                                         'height:' + _this.cardSize[1].toString() + 'px; ';
        carouselContainer = carouselContainer + '<div ' +
            'id=' + _this.ids[index] + ' ' +
            css_string +
            'padding: 0 ' + _this.padding + 'px; ' +
            'display: ' + ((_this.isHorizontal) ? 'inline-block;' : 'block;') + '">' + obj + '</div>';
    });
    carouselContainer = carouselContainer + '</div>';
    this.containerDiv.append(carouselContainer);

    var css_string;
    if(this.isHorizontal) {
        css_string = (_this.cardSize == null) ? 'auto;' : _this.cardSize[1].toString() + 'px;';
        $('#carouselContainer').css({   'width': _this.recalcSize(_this.cardList.length).toString() + 'px;',
                                        'height': css_string });
    } else {
        css_string = (_this.cardSize == null) ? 'auto;' : _this.cardSize[0].toString() + 'px;';
        $('#carouselContainer').css({   'height': _this.recalcSize(_this.cardList.length).toString() + 'px;',
                                        'width': css_string });
    }

    //attach callbacks, (passing the card's id to the callback)
    for(var i = 0; i < this.cardList.length; i++) {
        $('#' + _this.ids[i]).on('click', function(e) {
            //call the callback but make sure its 'this' object is whatever
            //called the carousel... otherwise the carousel's 'this' object
            //will be referenced by the callback when it uses the keyword 'this' !!
            _this.callback.call(_this._callingThis, this.id);
        });
    }
}

// Recalculate the (internal) width of the carousel based on
// a number of cards; set this value and return it for reference.
// Used to stop whitespace when cards are removed
carousel.prototype.recalcSize = function(numCards) {
    var size;
    if(this.cardSize != null) {
        if(this.isHorizontal) {
            size = ((this.cardSize[0] + (2 * this.padding)) * numCards);
            $('#carouselContainer').width(size);
        } else {
            size = ((this.cardSize[1] + (2 * this.padding)) * numCards);
            $('#carouselContainer').height(size);
        }
    } else {
        //null cardSize means auto-size... need to calculate the container
        //size from each of the cards within it
        var _this = this;
        size = 0;
        $.each(this.cardList, function(index, obj) {
            if(this.isHorizontal) {
                size += ($('#' + _this.ids[index]).width() + (2 * _this.padding));
            } else {
                size += ($('#' + _this.ids[index]).height() + (2 * _this.padding));
            }
        });
        if(this.isHorizontal) { $('#carouselContainer').width(size); } else { $('#carouselContainer').height(size); }
    }
    return size;
}

// Add a card to the end of the carousel
// id     ::  the unique id for the new card
// item   ::  the html for the new card
carousel.prototype.addCard = function(id, item) {
  var _this = this;
  _this.ids.push(id);
  _this.cardList.push(item);
  var css_string = (_this.cardSize == null) ? '' : 'style="width:' + _this.cardSize[0].toString() + 'px; ' +
                                                   'height:' + _this.cardSize[1].toString() + 'px; ';
  var cardHtml =
    '<div ' +
      'id=' + id + ' ' +
      css_string +
      'padding: 0 ' + _this.padding + 'px; ' +
      'display: ' + ((_this.isHorizontal) ? 'inline-block;' : 'block;') + '">' + item +
    '</div>';

  $('#carouselContainer').append(cardHtml);
  _this.recalcSize(_this.cardList.length);
}
