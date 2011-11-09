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

$ ->
    $('input#login').click () ->
        login($('input#acct').val())
    
    kibo = new Kibo()   
    kibo.down( 'up', () -> scrollOld() )
        .down( 'down', () -> scrollNew() )
        
    $('a#new').click () -> scrollNew()
    $('a#old').click () -> scrollOld()


login = (acct) ->
    param = $.param({ url: 'http://www.plurk.com/m/u/' + acct })
    plurkObj = []

    $.getJSON( "ba-simple-proxy.php?#{param}").done (data) ->
        $(data.contents).each () ->    
            tmpObj = $(this).find('div.plurk')
            if (tmpObj.text() != '') then plurkObj.push(tmpObj)
            
        $('section').remove()

        $(plurkObj)[0].each () ->
            $('<section>').append($(this).contents()).appendTo('body')
        
        init()
        reShow()


init = () -> 
    maxNum = $('section').length - 1
    curNum = 0
    curAlpha = defNewAlpha
    alphaLev = (defNewAlpha - defOldAlpha) / maxNum
    fontSizeLev = defOldFontSize / defNewFontSize
    newTop = ( screenHeight - defHeight) / 2
    $('section').addClass('show')


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