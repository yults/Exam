function parse(str) {
    strPtr = 0;
    bracketCount = 0;
    token = "";
    if (str === "") {
        throw new EmptyPushException();
    }
    function getToken() {
        while (strPtr < str.length && /\s/.test(str[strPtr])) strPtr++;
        if (strPtr >= str.length) return token = "";
        token = str[strPtr++];
        if (!/[a-z01|~&()]/.test(token)) {
            throw new UnknownSymbolException(strPtr, token);
        }
    }
    function value() {
        getToken();
        switch (token) {
            case '~':
                return [token, value()];
            case ')':
                throw new BracketException(strPtr);
            case '(':
                bracketCount++;
                o = or();
                if (token !== ')') throw new BracketException(strPtr);
                bracketCount--;
                getToken();
                return o;
            default:
                if (!/[a-z01]/.test(token)) throw new ArgumentException(strPtr, token);
                t = token;
                getToken();
                return t;
        }
    }
    function and() {
        left = value();
        while (1) {
            if (token === '&') {
                left = [token, left, value()];
            } else {
                return left;
            }
        }
    }
    function or() {
        left = and();
        while (1) {
            if (token === '|') left = [token, left, and()];
            else return left;
        }
    }
    o = or();
    if (token !== "") throw new ExtraneousException(strPtr, token);
    return o;
}

function simplify(l, neg = false) {
    if (typeof (l) == "string") {
        if (l === '0') return (neg ? '1' : '0');
        if (l === '1') return (neg ? '0' : '1');
        return (neg ? '~' + l : l);
    }
    if (l[0] === '~') return simplify(l[1], !neg);
    if (l[0] === '&') return `${simplify(l[1], neg)} ${neg ? '|' : '&'} ${simplify(l[2], neg)}`; //TODO: Скобки
    if (l[0] === '|') return `${simplify(l[1], neg)} ${neg ? '&' : '|'} ${simplify(l[2], neg)}`;
}
function push(expr) {
    console.log(simplify(parse(expr)));
}

Exception.prototype = Error.prototype;
function Exception(message) {
    this.message = message;
}

BracketException.prototype = Exception.prototype;
function BracketException(s) {
    Exception.call(this, "BracketException in pos" + s);
}

UnknownSymbolException.prototype = Exception.prototype;
function UnknownSymbolException(s, t) {
    Exception.call(this, "UnknownSymbolException in pos: " + s + " - " + t);
}

ArgumentException.prototype = Exception.prototype;
function ArgumentException(s, t) {
    Exception.call(this, "ArgumentException in pos: " + s + " - " + t);
}

ExtraneousException.prototype = Exception.prototype;
function ExtraneousException(s, t) {
    Exception.call(this, "ExtraneousException in pos: " + s + " - " + t);
}

EmptyPushException.prototype = Exception.prototype;
function EmptyPushException() {
    Exception.call(this, "Empty string in push");
}
