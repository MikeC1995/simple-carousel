//_this         = a copy of the caller's 'this' object which can be used by the callback
// containerDiv = container for the carousel
// cardSize     = 1x2 array [w, h]
// cardList     = array where each element is the HTML for a card
// ids          = array of ids for each of the cards
// padding      = the mount of padding to add between the cards
// callback     = a function to call when the cards are clicked. The card's id is passed to the callback.
carousel = function(_this, containerDiv, cardSize, cardList, ids, padding, callback){
    this._callingThis = _this;
    this.containerDiv = containerDiv;
    this.cardList = cardList;
    this.ids = ids;
    this.cardSize = cardSize;
    this.padding = padding;
    this.callback = callback;
    this.init();
}

carousel.prototype._callingThis = null;
carousel.prototype.containerDiv = null;
carousel.prototype.cardList = null;
carousel.prototype.ids = null;
carousel.prototype.cardSize = null;
carousel.prototype.padding = null;
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
    var carouselContainer = '<div id="carouselContainer"' +
                            'style="width:' + _this.recalcWidth(_this.cardList.length).toString() + 'px;' +
                                  'height:' + _this.cardSize[1].toString() + 'px;">';
    $.each(this.cardList, function(index, obj) {
        carouselContainer = carouselContainer + '<div ' + 
            'id=' + _this.ids[index] + ' ' + 
            'style="width:' + _this.cardSize[0].toString() + 'px; ' +
            'height:' + _this.cardSize[1].toString() + 'px; ' + 
            'padding: 0 ' + _this.padding + 'px; ' +
            'display: inline-block; ">' + obj + '</div>';
    });
    carouselContainer = carouselContainer + '</div>';
    this.containerDiv.append(carouselContainer);
    
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
carousel.prototype.recalcWidth = function(numCards){
    var width = ((this.cardSize[0] + (2 * this.padding)) * numCards);
    $('#carouselContainer').width(width);
    return width;
}