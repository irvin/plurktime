screenWidth = $(window).width()
screenHeight = $(window).height()

defWidth = 600
defHeight = 300
curWidth = null
curHeight = null

newTop = null
topLev = 15

defNewAlpha = 0.95
defOldAlpha = 0.01
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
    source = $("#entryTmpl").html();
    entryTmpl = Handlebars.compile(source);

    $('form').submit () ->
        acct = $('input#acct').val().trim()
        if acct != ''
            window.location.hash = '#' + acct
        return false

    $(window).on( 'hashchange', () ->
        acct = window.location.hash.substr(1).trim()
        login(acct)
    )

    acct = window.location.hash.substr(1).trim()
    if acct != '' then login(acct)

    kibo = new Kibo()   
    kibo.down( 'up', () -> scrollOld() )
        .down( 'down', () -> scrollNew() )
        
        
login = (acct) ->
    plurkObj = []

    $.jGFeed( "http://www.plurk.com/#{acct}.xml", (feeds) ->
        # Check for errors
        if (feeds)
            # console.log(feeds)
            $('section').remove()

            maxNum = feeds.entries.length    
            for i in [0...maxNum]            
                entry = feeds.entries[i]
                section = $("<section style='opacity: 0'>").append(entryTmpl(entry)).appendTo('body')
                if i < 15 then section.addClass('show')
                
            curNum = 0
            curAlpha = defNewAlpha
            alphaLev = (defNewAlpha - defOldAlpha) / 15
            fontSizeLev = defOldFontSize / defNewFontSize
            newTop = ( screenHeight - defHeight) / 2

            acct = $('input#acct').val().trim()
            if acct != '' then $('input#acct').blur()
            
            reShow()
            
        else
            window.location.hash = ''
            return false
            
    , -1 )


reShow = () ->
    curHeight = defHeight
    curWidth = defWidth
    curAlpha = defNewAlpha
    curFontSize = defNewFontSize
    
    $('section').not('.show').css( 'opacity', 0 )
    $('section.show').each (index) ->
        
        if curAlpha > 0
            $(this).css(
                'height': curHeight
                'width': curWidth
                'left': (screenWidth - curWidth) / 2
                'top': newTop - (index * topLev)    # to be adjust
                'font-size': curFontSize + "px"
                'opacity': curAlpha
                'z-index': maxNum - index
            )

            curHeight *= fontSizeLev
            curWidth *= fontSizeLev
            if curAlpha > alphaLev 
                curAlpha = curAlpha - alphaLev 
            else 
                curAlpha = 0          
            curFontSize *= fontSizeLev

        else $(this).css 'opacity': 0
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