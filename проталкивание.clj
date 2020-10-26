(defn -return [value tail] {:value value :tail tail})
(def -valid? boolean)
(def -value :value)
(def -tail :tail)
(defn _show [result]
  (if (-valid? result)
    (str "-> " (pr-str (-value result)) " | " (pr-str (apply str  (-tail result))))
    "!"))
(defn tabulate [parser inputs]
  (run! (fn [input] (printf "    %-10s %s\n" input (_show (parser input)))) inputs))
(defn _empty [value] (partial -return value))
(defn _char [p]
  (fn [[c & cs]]
    (if (and c (p c)) (-return c cs))))
(defn _map [f]
  (fn [result]
    (if (-valid? result)
      (-return (f (-value result)) (-tail result)))))
(defn _combine [f a b]
  (fn [str]
    (let [ar ((force a) str)]
      (if (-valid? ar)
        ((_map (partial f (-value ar)))
         ((force b) (-tail ar)))))))
(defn _either [a b]
  (fn [str]
    (let [ar ((force a) str)]
      (if (-valid? ar) ar ((force b) str)))))
(defn _parser [p]
  (fn [input]
    (-value ((_combine (fn [v _] v) p (_char #{\u0000})) (str input \u0000)))))

(defn +char [chars] (_char (set chars)))
(defn +char-not [chars] (_char (comp not (set chars))))
(defn +map [f parser] (comp (_map f) parser))
(def +parser _parser)
(def +ignore (partial +map (constantly 'ignore)))
(defn iconj [coll value]
  (if (= value 'ignore) coll (conj coll value)))
(defn +seq [& ps]
  (reduce (partial _combine iconj) (_empty []) ps))
(defn +seqf [f & ps] (+map (partial apply f) (apply +seq ps)))
(defn +seqn [n & ps] (apply +seqf (fn [& vs] (nth vs n)) ps))
(defn +or [p & ps]
  (reduce (partial _either) p ps))
(defn +opt [p]
  (+or p (_empty nil)))
(defn +star [p]
  (letfn [(rec [] (+or (+seqf cons p (delay (rec))) (_empty ())))] (rec)))
(defn +plus [p] (+seqf cons p (+star p)))
(defn +str [p] (+map (partial apply str) p))

(def *digit (+char "0123456789"))
(def *number (+map read-string (+str (+plus *digit))))
(def *string
  (+seqn 1 (+char "\"") (+str (+star (+char-not "\""))) (+char "\"")))
(def *space (+char " \t\n\r"))
(def *ws (+ignore (+star *space)))

; single char in string, converted to string
(defn *str_char [chars] (+map str (+char chars)))
; single char in string, converted to symbol
(defn *symbol [chars] (+map (fn [x] (symbol (str x))) (+char chars)))

(def *unary (*symbol "~"))
(def *const (+map read-string (*str_char "01")))
(def *variable (*str_char (apply str (mapv char (range 97 123)))))

(declare expr)

(def prim (+or
            (+seqf list *unary *ws (delay prim))
            (+seqn 0 *ws (+ignore (+char "(")) (+seqn 0 (delay expr)) (+ignore (+char ")")) *ws)
            *const *variable))

(def expr (+seqf
            (fn [a b] (if (empty? b) a
                                     (reduce (fn [s x] (list (first x) s (nth x 1))) (cons a b)) ))
            *ws prim (+star (+seqf list *ws (*symbol "&|") *ws prim)) *ws))

(defn xor [a b] (and (not (and a b)) (or a b)))
(defn simplify [l negate]
  (case (str (first l))
    "~" (simplify (second l) (not negate))
    "&" (str (simplify (second l) negate) (if negate "|" "&") (simplify (first (rest (rest l))) negate))
    "|" (str (simplify (second l) negate) (if negate "&" "|") (simplify (first (rest (rest l))) negate))
    (if (instance? Boolean l) (if (xor l negate) "1" "0") (if negate (str "~" l) l))
    ))

(defn push [s] (simplify (-value (expr s)) 'false))
(tabulate expr ["a" "a | b" " ~   (a&~b)" "a|b&s&a|f&g" "0|~1"])

