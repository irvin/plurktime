screenWidth = $(window).width()
screenHeight = $(window).height()

defWidth = 600
defHeight = 300
curWidth = null
curHeight = null

newTop = null
topLev = 15

defNewAlpha = 0.95
defOldAlpha = 0.2
curAlpha = null
alphaLev = null

defNewFontSize = 28
defOldFontSize = 26
curFontSize = null
fontSizeLev = null

maxNum = null
curNum = null

uid = null
entryTmpl = null

$ ->
    source   = $("#entryTmpl").html();
    entryTmpl = Handlebars.compile(source);

    $('form').submit () ->
        login($('input#acct').val())
        return false
    
    kibo = new Kibo()   
    kibo.down( 'up', () -> scrollOld() )
        .down( 'down', () -> scrollNew() )
        
    $('a#new').click () -> scrollNew()
    $('a#old').click () -> scrollOld()


login = (acct) ->
    param = $.param({ url: 'http://www.plurk.com/m/u/' + acct })
    plurkObj = []
    
    feedUrl = "http://www.plurk.com/#{acct}.xml"
    
    $.jGFeed(feedUrl, (feeds) ->
        # Check for errors
        if (!feeds) then return false
        # console.log(feeds)
        $('section').remove()

        for i in [0...feeds.entries.length]            
            entry = feeds.entries[i]
            $('<section>').append(entryTmpl(entry)).appendTo('body')
            
        maxNum = $('section').length - 1
        curNum = 0
        curAlpha = defNewAlpha
        alphaLev = (defNewAlpha - defOldAlpha) / maxNum
        fontSizeLev = defOldFontSize / defNewFontSize
        newTop = ( screenHeight - defHeight) / 2
        $('section').addClass('show')
        
        reShow()
            
    , -1 )    




reShow = () ->
    curHeight = defHeight
    curWidth = defWidth
    curAlpha = defNewAlpha
    curFontSize = defNewFontSize
    
    $('section').not('.show').css( 'opacity', 0 )
    
    $('section.show').each (index) ->
        $(this)
            .css( 'height', curHeight )
            .css( 'width', curWidth )
            .css( 'left', ( screenWidth - curWidth) / 2 )
            .css( 'top', ( newTop - (index * topLev) ) )
            .css( 'font-size', curFontSize + "px" )
            .css( 'opacity', curAlpha )
            .css( 'z-index', maxNum - index )
        
        curHeight *= fontSizeLev
        curWidth *= fontSizeLev
        curAlpha -= alphaLev
        curFontSize *= fontSizeLev
        return


scrollOld = () ->
    if (curNum < maxNum)
        $('section').eq(curNum).removeClass('show')
        curNum += 1
    reShow()
    return


scrollNew = () ->
    if (curNum > 0)
        curNum -= 1
        $('section').eq(curNum).addClass('show')
    reShow()
    return