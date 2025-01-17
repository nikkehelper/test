window.K = { id: {} }

window.S = {
    href: location.href.split('/').at(-2),

    // regist
    사용처:'스토리, 1군, 2군, 3군, 스레나, 타워',
    range10:'1, 2, 3, 4, 5, 6, 7, 8, 9, 10',

    버스트:'1, 2, 3', 
    코드:'철갑, 작열, 전격, 풍압, 수냉', 
    역할:'딜러, 버퍼, 서포터',

    장비:'머리, 장갑, 갑옷, 신발',
    무기:'AR, SMG, SG, SR, RL, MG',
    소장품등급:'R, SR',
    소장품레벨:'0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15',
    장비강화:'기업, 기업1강, 기업2강, 기업3강, 기업4강, 기업5강, 오버로드, 오버1강, 오버2강, 오버3강, 오버4강, 오버5강',
    오버옵션:'우코, 공증, 장탄, 차속, 차뎀, 명중, 크뎀, 크확, 방어',
    기업:'앨리시온, 미실리스, 테트라, 필그림, 어브노멀',
    클래스:'화력, 방어, 지원',
    스킬: [ [], // 1 베이스 배열로 치환
        //   0   1    2    3    4     5     6     7     8     9
            [0,  8,  10,  26,  42,  126,  168,  210,  231,  273],   // 1
            [0,  0,   0,   0,  60,   90,  120,  150,  165,  190],   // 2
            [0,  0,   0,   0,   0,    0,    0,   90,  105,  120],   // 3
            [0,  0,   0,   0,  10,   15,   30,   70,  100,  135],   // 코드
            [0,  0,   0,   0,  20,   30,   60,  140,  200,  270]
    ],
    총스킬: {
        스킬매뉴얼1:      [0,  8,  10,  26,  42,  126,  168,  210,  231,  273],   // 1
        스킬매뉴얼2:      [0,  0,   0,   0,  60,   90,  120,  150,  165,  190],   // 2
        스킬매뉴얼3:      [0,  0,   0,   0,   0,    0,    0,   90,  105,  120],   // 3
        버스트매뉴얼1:    [0,  8,  10,  26,  42,  126,  168,  210,  231,  273],   // 1
        버스트매뉴얼2:    [0,  0,   0,   0,  60,   90,  120,  150,  165,  190],   // 2
        버스트매뉴얼3:    [0,  0,   0,   0,   0,    0,    0,   90,  105,  120],   // 3
        코드매뉴얼:       [0,  0,   0,   0,  10,   15,   30,   70,  100,  135],   // 코드
    },
    매뉴얼: [0,  0,   0,   0,  10,   15,   30,   70,  100,  135],


    레이드타입:'전격 약점, 철갑 약점, 풍압 약점, 작열 약점, 수냉 약점',
    parties:'파티 1, 파티 2, 파티 3, 파티 4, 파티 5'
}

window.F = { 
    registID: () => each($$$('[id]'), el => {K.id[el.id] = el;}),
    stop: e => e.stopImmediatePropagation(),
    prevent: e => e.preventDefault(),
    JSONfix: o => JSON.parse(JSON.stringify(o)),
    save: () => {localStorage.nikkeHelperData = JSON.stringify(Main)},
    reload: () => {F.save(); location.reload()},
    her: el => {
        if      (typeof el === 'string') return Main[Main.settings.현재계정].find(o => o.name === el)
        else if (el.nodeName)            return F.her(el.$('.name').get('name') || el.$('.name').get())
        else                             return F.her(el.name)
    },
    tr: (her, complete) => {
        let tr = clone(K.id.template).json(her).set('id', her.name);
            
            tr.$('.name').set('name', her.name).set(her.displayName || her.name);
            each(tr.$$$('select[rel]'), select => {if (S[select.rel()]) select.option(S[select.rel()])})
        return tr
    }
}

F.registID()
if (K.id.closeDoc) K.id.closeDoc.clickevent(e => {
    K.id.document.hide(); Main.settings.RTFM[S.href] = true; F.save();
})

window.init = {}
    init.category = () => F.select(Main.values).class('category')
    init.values = () => F.select().class('values')

window.build = {}
window.listen = {};

document.title = '니케 메모장'