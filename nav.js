let links = newElement('span.links'), home = location.href.includes('welcome.html')
    links.append(newElement('a').set('니케등록').set('href', home? 'regist/regist.html':        '../regist/regist.html'))
    links.append(newElement('a').set('장비강화').set('href', home? 'upgrade/upgrade.html':      '../upgrade/upgrade.html'))
    links.append(newElement('a').set('스킬').set(    'href', home? 'skill/skill.html':          '../skill/skill.html'))
    links.append(newElement('a').set('오버로드').set('href', home? 'overload.v1/overload.html': '../overload.v1/overload.html'))
    links.append(newElement('a').set('레이드').set(  'href', home? 'raid/raid.html':            '../raid/raid.html'))
    links.append(newElement('a').set('오버클럭').set('href', home? 'overclock/overclock.html':  '../overclock/overclock.html'))
    links.append(newElement('a').set('데이터').set(  'href', home? 'data/data.html':            '../data/data.html'))

let command = newElement('span.command')
    let rtfm = newElement('input:btn#showDoc').set('도움말').clickevent(e => {
        K.id.document.show(); document.body.removeClass('read')
    })
    command.append(rtfm)

let nav = newElement('nav.global')
    nav.append(links); nav.append(command)


document.body.prepend(nav)
each($$$('nav .links a'), a => {
    if (a.href.split('/').at(-1) === location.href.split('/').at(-1)) a.removeAttribute('href')
})
each($$$('nav .command a'), a => {
    a.clickevent(e => {
        e.preventDefault()
        if (a.id === 'resetLocalStorage') {
            localStorage.removeItem('nikkeHelperData'); location.reload();
        }
    })
})