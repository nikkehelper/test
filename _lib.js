String.prototype.int = function () { return parseInt(this.replace(/\D/g, '')); };
Number.prototype.int = function () { return parseInt((this + '').replace(/\D/g, '')); };
String.prototype.array = function () { return this.split(',').map(s => s.trim()); };
String.prototype.comma = function (arg) {
    return new Intl.NumberFormat('ko-KR').format(Number(this)) + (arg || '')
}
Number.prototype.comma = function (arg) {
    return new Intl.NumberFormat('ko-KR').format(this) + (arg || '')
}
String.prototype.percent = function (decimal) { return (Number(this) * 100).toFixed(decimal) + '%' }
Number.prototype.percent = function (decimal) { return (this * 100).toFixed(decimal) + '%' }
Array.prototype.clone = function () { return this.filter(n => true) }
Array.prototype.uniq = function () { return [...new Set(this)] }
Array.prototype.kSum = function () {
    const plus = (a, b) => a + b;
    let that = this.map(el => {
            if (Number(el) === el) return el;
            if (!el.nodeName) return 0;
            return Number(el.nodeName == 'INPUT'? el.value: el.innerHTML);
        })
    return that.reduce(plus, 0);
};
Array.prototype.len = function (length) {
    if (this.length <= length) return this;
    this.length = length; return this;
}
Array.prototype.누계 = function (length) {
    let that = this.clone()
    if (that.length <= length) return that.kSum();
    that.length = length; return that.kSum();
}
Array.prototype.right = function (length) {
    if (this.length <= length) return this;
    this.splice(0, this.length - length); return this;
}


HTMLElement.prototype.changeevent = function (callback) { this.addEventListener('change', callback); return this; }
HTMLElement.prototype.clickevent =  function (callback) { this.addEventListener('click', callback);  return this; }
HTMLElement.prototype.submitevent = function (callback) { this.addEventListener('submit', callback); return this; }
HTMLElement.prototype.keyupevent =  function (callback) { this.addEventListener('keyup', e => {callback(e)}); return this;}

HTMLElement.prototype.get = function (attr) {
    if (attr) return this.getAttribute(attr)
    
    if (this.type === 'number') return this.value.int()
    if (this.type === 'checkbox') return this.checked
    if (['INPUT','TEXTAREA','SELECT'].some(e => e === this.nodeName)) return this.value
    return this.innerHTML
}
HTMLElement.prototype.rel = function () { return this.get('rel') }

HTMLElement.prototype.set = function (arg1, arg2) {
    if (arg2 !== undefined && arg2 !== null) {
        this.setAttribute(arg1, arg2);
        return this;
    }

    if (this.type === 'checkbox') this.checked = !!arg1
    else if (['INPUT','TEXTAREA','SELECT'].some(e => e === this.nodeName)) {this.value = arg1;}
    else this.innerHTML = arg1;
    return this;
}
HTMLElement.prototype.unset = function (attrs) {
    each(attrs.array(), attr => this.removeAttribute(attr)); return this;
}
HTMLElement.prototype.href = function (href) {
    if (!href) return this.get('href')
    return this.set('href', href)
}

HTMLElement.prototype.link = function (her) {
    if (!'SELECT, INPUT, TH'.includes(this.nodeName)) return this
    if (this.type === 'button') return this
        
    let rel = this.rel()
    if (her[rel]) this.set(her[rel]);
    
    this.changeevent(e => { her[rel] = this.get(); F.save(); });        
    if (this.type === 'number') this.keyupevent(e => { her[rel] = this.get(); F.save(); console.log(her) })
    
    return this
}

HTMLElement.prototype.setting = function () {
    if (!'SELECT, INPUT, TH'.includes(this.nodeName)) return false
    if (this.type === 'button') return false

    let key = this.id || this.rel(), s = Main.settings; 
        if (s[key]) this.set(s[key])
    
    this.changeevent(e => { s[key] = this.get(); F.save() });        
    if (this.type === 'number') this.keyupevent(e => { s[key] = this.get(); F.save() })
    if (this.type === 'text') this.keyupevent(e => { s[key] = this.get(); F.save() })
    
    return this
}
HTMLElement.prototype.option = function (array, avoidBlank) {
    if (this.nodeName !== 'SELECT') return false

    if (typeof array === 'string') array = array.array()
    if (!array) return false
    array = array.clone()

    if (array === null || array === undefined) array = ['']
    if (!avoidBlank && array[0] !== '') array.unshift('')
    array = array.map(el => newElement('option').set(el).set('value', el))

    this.innerHTML = '';
    each(array, option => {this.append(option)})
    return this;
}
HTMLElement.prototype.next = function () {return this.nextElementSibling}
HTMLElement.prototype.prev = function () {return this.previousElementSibling}
HTMLElement.prototype.nextOption = function () {
    if (this.nodeName !== 'SELECT') return false

    let nextOpt = this.$$$('option')[this.selectedIndex + 1]
        if (!nextOpt) return false
        return nextOpt
}
HTMLElement.prototype.class = function (cname) {
    if (cname.includes(' '))    cname.split(' ').forEach(c => this.classList.add(c))
    else                        this.classList.add(cname);
    return this;
}
HTMLElement.prototype.removeClass = function (cnames) {
    each(cnames.array(), cname => this.classList.remove(cname)); return this;
}
HTMLElement.prototype.json = function (json) {
    if (!json) return this.get('json')

    if (typeof json === 'string') this.set('json', json)
    else this.set('json', JSON.stringify(json))

    return this
}
HTMLElement.prototype.parse = function () {
    if (!this.get('json')) return false
    return JSON.parse(this.json())
}


const $ = (expression, parent) => {
    if (expression.includes(':')) {
        let p = expression.split(':');
        expression = `[${p[0]}="${p[1]}"]`
    }
    if (parent) return parent.querySelector(expression)
    return document.querySelector(expression)
};  HTMLElement.prototype.$  = function (expression) { return $(expression, this) }
    HTMLElement.prototype.$c = function (expression) { return $(`.${expression}`, this) }
    HTMLElement.prototype.$r = function (expression) { return $(`[rel="${expression}"]`, this) }

const $$ = (expression, parent) => {
    if (expression.includes(':')) {
        let p = expression.split(':');
        expression = `[${p[0]}="${p[1]}"]`
    }
    if (parent) return parent.querySelectorAll(expression)
    return document.querySelectorAll(expression)
};  HTMLElement.prototype.$$  = function (expression) { return $$(expression, this) }
    HTMLElement.prototype.$$c = function (expression) { return $$(`.${expression}`, this) }
    HTMLElement.prototype.$$r = function (expression) { return $$(`[rel="${expression}"]`, this) }

const $$$ = (expression, parent) => {
    if (expression.includes(':')) {
        let p = expression.split(':');
        expression = `[${p[0]}="${p[1]}"]`
    }
    if (parent) return Array.from(parent.querySelectorAll(expression))
    return Array.from(document.querySelectorAll(expression))
};  HTMLElement.prototype.$$$  = function (expression) { return $$$(expression, this) }
    HTMLElement.prototype.$$$c = function (expression) { return $$$(`.${expression}`, this) }
    HTMLElement.prototype.$$$r = function (expression) { return $$$(`[rel="${expression}"]`, this) }

HTMLElement.prototype.hide = function () { this.hidden = true; return this; }
HTMLElement.prototype.show = function () { this.removeAttribute('hidden'); return this; }


const each = (obj, callBack) => {
    if (!obj) return false;
    if (typeof obj === 'string') obj = obj.split(',').map(s => s.trim())
    
    if (obj.forEach) obj.forEach((val, i) => callBack(val, i))
    else for (const [key, val] of Object.entries(obj)) {callBack(key, val)}
}

const clone = template => {//console.log(config)
    if (!template.nodeName) template = document.querySelector(template);

    let clone = template.cloneNode(true);
    clone.removeAttribute('hidden');
    clone.removeAttribute('id');
    clone.show();
    return clone
}

const newElement = names => {
    if (Array.isArray(names)) return names.map(name => newElement(name))
    if (typeof names !== 'string') throw new Error('newElement: use array or string');
    if (names.includes(',')) return names.split(',').map(name => name.trim()).map(name => newElement(name))

    let name = names, id, classes, type, attrs;
        if (name.includes('#')) {
            id = name.match(/\#([a-zA-Z0-9가-힣]*)/)[1]; name = name.replace(`#${id}`, ''); //
        }
        if (name.includes('.')) {
            classes = name.match(/\.[a-zA-Z0-9가-힣]*/g).map(cname => cname.replace('.', ''));
            each(classes, cname => name = name.replace(`.${cname}`, ''))
        }
        if (name.includes(':')) {
            type = name.match(/\:([a-zA-Z0-9가-힣]*)/)[1]; name = name.replace(`:${type}`, ''); //console.log(id, name)
            type = type.replace('btn', 'button').replace('chk', 'checkbox')
        }
        // if (name.includes('{')) {
        //     attrs = name.match(/\{[^\}]*\}/)[0]; name = name.replace(attrs, ''); 
        //     attrs = attrs.replaceAll('_', ', '); console.log(name, attrs);//console.log(id, name)
        // }
    let that = document.createElement(name)
        if (type && name === 'input') that.set('type', type)
        if (id) that = that.set('id', id)
        if (classes) each(classes, cname => that.class(cname))
        return that
    // return document.createElement(name)
}