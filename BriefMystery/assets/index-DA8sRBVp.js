;(function () {
  const t = document.createElement('link').relList
  if (t && t.supports && t.supports('modulepreload')) return
  for (const s of document.querySelectorAll('link[rel="modulepreload"]')) n(s)
  new MutationObserver(s => {
    for (const i of s)
      if (i.type === 'childList')
        for (const l of i.addedNodes)
          l.tagName === 'LINK' && l.rel === 'modulepreload' && n(l)
  }).observe(document, { childList: !0, subtree: !0 })
  function r (s) {
    const i = {}
    return (
      s.integrity && (i.integrity = s.integrity),
      s.referrerPolicy && (i.referrerPolicy = s.referrerPolicy),
      s.crossOrigin === 'use-credentials'
        ? (i.credentials = 'include')
        : s.crossOrigin === 'anonymous'
        ? (i.credentials = 'omit')
        : (i.credentials = 'same-origin'),
      i
    )
  }
  function n (s) {
    if (s.ep) return
    s.ep = !0
    const i = r(s)
    fetch(s.href, i)
  }
})()
const Xr = !1
var ns = Array.isArray,
  Si = Array.prototype.indexOf,
  Er = Array.from,
  ss = Object.defineProperty,
  kt = Object.getOwnPropertyDescriptor,
  is = Object.getOwnPropertyDescriptors,
  Ei = Object.prototype,
  $i = Array.prototype,
  an = Object.getPrototypeOf,
  Mn = Object.isExtensible
const zt = () => {}
function Ti (e) {
  return typeof e?.then == 'function'
}
function Ni (e) {
  return e()
}
function qr (e) {
  for (var t = 0; t < e.length; t++) e[t]()
}
function as () {
  var e,
    t,
    r = new Promise((n, s) => {
      ;(e = n), (t = s)
    })
  return { promise: r, resolve: e, reject: t }
}
function Di (e, t) {
  if (Array.isArray(e)) return e
  if (!(Symbol.iterator in e)) return Array.from(e)
  const r = []
  for (const n of e) if ((r.push(n), r.length === t)) break
  return r
}
const be = 2,
  yr = 4,
  ur = 8,
  os = 1 << 24,
  lt = 16,
  ct = 32,
  At = 64,
  on = 128,
  He = 512,
  me = 1024,
  $e = 2048,
  Je = 4096,
  je = 8192,
  rt = 16384,
  ln = 32768,
  Ht = 65536,
  Cn = 1 << 17,
  ls = 1 << 18,
  Gt = 1 << 19,
  cs = 1 << 20,
  tt = 1 << 25,
  Dt = 32768,
  Gr = 1 << 21,
  cn = 1 << 22,
  dt = 1 << 23,
  St = Symbol('$state'),
  Ai = Symbol('legacy props'),
  Oi = Symbol(''),
  Lt = new (class extends Error {
    name = 'StaleReactionError'
    message =
      'The reaction that called `getAbortSignal()` was re-run or destroyed'
  })()
function us (e) {
  throw new Error('https://svelte.dev/e/lifecycle_outside_component')
}
function Ii () {
  throw new Error('https://svelte.dev/e/async_derived_orphan')
}
function Mi (e) {
  throw new Error('https://svelte.dev/e/effect_in_teardown')
}
function Ci () {
  throw new Error('https://svelte.dev/e/effect_in_unowned_derived')
}
function Pi (e) {
  throw new Error('https://svelte.dev/e/effect_orphan')
}
function ji () {
  throw new Error('https://svelte.dev/e/effect_update_depth_exceeded')
}
function Yi (e) {
  throw new Error('https://svelte.dev/e/props_invalid_value')
}
function Li () {
  throw new Error('https://svelte.dev/e/state_descriptors_fixed')
}
function Ri () {
  throw new Error('https://svelte.dev/e/state_prototype_fixed')
}
function zi () {
  throw new Error('https://svelte.dev/e/state_unsafe_mutation')
}
function Wi () {
  throw new Error('https://svelte.dev/e/svelte_boundary_reset_onerror')
}
const Hi = 1,
  Fi = 2,
  fs = 4,
  Xi = 8,
  qi = 16,
  Gi = 2,
  Bi = 4,
  Ki = 8,
  Ui = 1,
  Vi = 2,
  de = Symbol(),
  Zi = 'http://www.w3.org/1999/xhtml'
function Ji () {
  console.warn('https://svelte.dev/e/svelte_boundary_reset_noop')
}
function ds (e) {
  return e === this.v
}
function vs (e, t) {
  return e != e
    ? t == t
    : e !== t || (e !== null && typeof e == 'object') || typeof e == 'function'
}
function hs (e) {
  return !vs(e, this.v)
}
let Bt = !1,
  Qi = !1
function ea () {
  Bt = !0
}
let ae = null
function Ft (e) {
  ae = e
}
function ve (e, t = !1, r) {
  ae = {
    p: ae,
    i: !1,
    c: null,
    e: null,
    s: e,
    x: null,
    l: Bt && !t ? { s: null, u: null, $: [] } : null
  }
}
function he (e) {
  var t = ae,
    r = t.e
  if (r !== null) {
    t.e = null
    for (var n of r) Ms(n)
  }
  return e !== void 0 && (t.x = e), (t.i = !0), (ae = t.p), e ?? {}
}
function Kt () {
  return !Bt || (ae !== null && ae.l === null)
}
let yt = []
function gs () {
  var e = yt
  ;(yt = []), qr(e)
}
function Ot (e) {
  if (yt.length === 0 && !Wt) {
    var t = yt
    queueMicrotask(() => {
      t === yt && gs()
    })
  }
  yt.push(e)
}
function ta () {
  for (; yt.length > 0; ) gs()
}
function ps (e) {
  var t = J
  if (t === null) return (X.f |= dt), e
  if ((t.f & ln) === 0) {
    if ((t.f & on) === 0) throw e
    t.b.error(e)
  } else Xt(e, t)
}
function Xt (e, t) {
  for (; t !== null; ) {
    if ((t.f & on) !== 0)
      try {
        t.b.error(e)
        return
      } catch (r) {
        e = r
      }
    t = t.parent
  }
  throw e
}
const ra = -7169
function ce (e, t) {
  e.f = (e.f & ra) | t
}
function un (e) {
  ;(e.f & He) !== 0 || e.deps === null ? ce(e, me) : ce(e, Je)
}
function _s (e) {
  if (e !== null)
    for (const t of e)
      (t.f & be) === 0 || (t.f & Dt) === 0 || ((t.f ^= Dt), _s(t.deps))
}
function ms (e, t, r) {
  ;(e.f & $e) !== 0 ? t.add(e) : (e.f & Je) !== 0 && r.add(e),
    _s(e.deps),
    ce(e, me)
}
const pr = new Set()
let te = null,
  br = null,
  Xe = null,
  ze = [],
  $r = null,
  Br = !1,
  Wt = !1
class Ge {
  committed = !1
  current = new Map()
  previous = new Map()
  #t = new Set()
  #a = new Set()
  #e = 0
  #s = 0
  #i = null
  #n = new Set()
  #r = new Set()
  skipped_effects = new Set()
  is_fork = !1
  is_deferred () {
    return this.is_fork || this.#s > 0
  }
  process (t) {
    ;(ze = []), (br = null), this.apply()
    var r = [],
      n = []
    for (const s of t) this.#o(s, r, n)
    this.is_fork || this.#c(),
      this.is_deferred()
        ? (this.#l(n), this.#l(r))
        : ((br = this),
          (te = null),
          Pn(n),
          Pn(r),
          (br = null),
          this.#i?.resolve()),
      (Xe = null)
  }
  #o (t, r, n) {
    t.f ^= me
    for (var s = t.first, i = null; s !== null; ) {
      var l = s.f,
        o = (l & (ct | At)) !== 0,
        c = o && (l & me) !== 0,
        u = c || (l & je) !== 0 || this.skipped_effects.has(s)
      if (!u && s.fn !== null) {
        o
          ? (s.f ^= me)
          : i !== null && (l & (yr | ur | os)) !== 0
          ? i.b.defer_effect(s)
          : (l & yr) !== 0
          ? r.push(s)
          : Ut(s) && ((l & lt) !== 0 && this.#n.add(s), qt(s))
        var h = s.first
        if (h !== null) {
          s = h
          continue
        }
      }
      var _ = s.parent
      for (s = s.next; s === null && _ !== null; )
        _ === i && (i = null), (s = _.next), (_ = _.parent)
    }
  }
  #l (t) {
    for (var r = 0; r < t.length; r += 1) ms(t[r], this.#n, this.#r)
  }
  capture (t, r) {
    r !== de && !this.previous.has(t) && this.previous.set(t, r),
      (t.f & dt) === 0 && (this.current.set(t, t.v), Xe?.set(t, t.v))
  }
  activate () {
    ;(te = this), this.apply()
  }
  deactivate () {
    te === this && ((te = null), (Xe = null))
  }
  flush () {
    if ((this.activate(), ze.length > 0)) {
      if ((ys(), te !== null && te !== this)) return
    } else this.#e === 0 && this.process([])
    this.deactivate()
  }
  discard () {
    for (const t of this.#a) t(this)
    this.#a.clear()
  }
  #c () {
    if (this.#s === 0) {
      for (const t of this.#t) t()
      this.#t.clear()
    }
    this.#e === 0 && this.#u()
  }
  #u () {
    if (pr.size > 1) {
      this.previous.clear()
      var t = Xe,
        r = !0
      for (const s of pr) {
        if (s === this) {
          r = !1
          continue
        }
        const i = []
        for (const [o, c] of this.current) {
          if (s.current.has(o))
            if (r && c !== s.current.get(o)) s.current.set(o, c)
            else continue
          i.push(o)
        }
        if (i.length === 0) continue
        const l = [...s.current.keys()].filter(o => !this.current.has(o))
        if (l.length > 0) {
          var n = ze
          ze = []
          const o = new Set(),
            c = new Map()
          for (const u of i) ws(u, l, o, c)
          if (ze.length > 0) {
            ;(te = s), s.apply()
            for (const u of ze) s.#o(u, [], [])
            s.deactivate()
          }
          ze = n
        }
      }
      ;(te = null), (Xe = t)
    }
    ;(this.committed = !0), pr.delete(this)
  }
  increment (t) {
    ;(this.#e += 1), t && (this.#s += 1)
  }
  decrement (t) {
    ;(this.#e -= 1), t && (this.#s -= 1), this.revive()
  }
  revive () {
    for (const t of this.#n) this.#r.delete(t), ce(t, $e), it(t)
    for (const t of this.#r) ce(t, Je), it(t)
    this.flush()
  }
  oncommit (t) {
    this.#t.add(t)
  }
  ondiscard (t) {
    this.#a.add(t)
  }
  settled () {
    return (this.#i ??= as()).promise
  }
  static ensure () {
    if (te === null) {
      const t = (te = new Ge())
      pr.add(te),
        Wt ||
          Ge.enqueue(() => {
            te === t && t.flush()
          })
    }
    return te
  }
  static enqueue (t) {
    Ot(t)
  }
  apply () {}
}
function bs (e) {
  var t = Wt
  Wt = !0
  try {
    for (var r; ; ) {
      if ((ta(), ze.length === 0 && (te?.flush(), ze.length === 0)))
        return ($r = null), r
      ys()
    }
  } finally {
    Wt = t
  }
}
function ys () {
  var e = $t
  Br = !0
  var t = null
  try {
    var r = 0
    for (xr(!0); ze.length > 0; ) {
      var n = Ge.ensure()
      if (r++ > 1e3) {
        var s, i
        na()
      }
      n.process(ze), vt.clear()
    }
  } finally {
    ;(Br = !1), xr(e), ($r = null)
  }
}
function na () {
  try {
    ji()
  } catch (e) {
    Xt(e, $r)
  }
}
let et = null
function Pn (e) {
  var t = e.length
  if (t !== 0) {
    for (var r = 0; r < t; ) {
      var n = e[r++]
      if (
        (n.f & (rt | je)) === 0 &&
        Ut(n) &&
        ((et = new Set()),
        qt(n),
        n.deps === null &&
          n.first === null &&
          n.nodes === null &&
          (n.teardown === null && n.ac === null ? Ys(n) : (n.fn = null)),
        et?.size > 0)
      ) {
        vt.clear()
        for (const s of et) {
          if ((s.f & (rt | je)) !== 0) continue
          const i = [s]
          let l = s.parent
          for (; l !== null; )
            et.has(l) && (et.delete(l), i.push(l)), (l = l.parent)
          for (let o = i.length - 1; o >= 0; o--) {
            const c = i[o]
            ;(c.f & (rt | je)) === 0 && qt(c)
          }
        }
        et.clear()
      }
    }
    et = null
  }
}
function ws (e, t, r, n) {
  if (!r.has(e) && (r.add(e), e.reactions !== null))
    for (const s of e.reactions) {
      const i = s.f
      ;(i & be) !== 0
        ? ws(s, t, r, n)
        : (i & (cn | lt)) !== 0 &&
          (i & $e) === 0 &&
          xs(s, t, n) &&
          (ce(s, $e), it(s))
    }
}
function xs (e, t, r) {
  const n = r.get(e)
  if (n !== void 0) return n
  if (e.deps !== null)
    for (const s of e.deps) {
      if (t.includes(s)) return !0
      if ((s.f & be) !== 0 && xs(s, t, r)) return r.set(s, !0), !0
    }
  return r.set(e, !1), !1
}
function it (e) {
  for (var t = ($r = e); t.parent !== null; ) {
    t = t.parent
    var r = t.f
    if (Br && t === J && (r & lt) !== 0 && (r & ls) === 0) return
    if ((r & (At | ct)) !== 0) {
      if ((r & me) === 0) return
      t.f ^= me
    }
  }
  ze.push(t)
}
function sa (e) {
  let t = 0,
    r = at(0),
    n
  return () => {
    hn() &&
      (a(r),
      dr(
        () => (
          t === 0 && (n = $(() => e(() => or(r)))),
          (t += 1),
          () => {
            Ot(() => {
              ;(t -= 1), t === 0 && (n?.(), (n = void 0), or(r))
            })
          }
        )
      ))
  }
}
var ia = Ht | Gt | on
function aa (e, t, r) {
  new oa(e, t, r)
}
class oa {
  parent
  is_pending = !1
  #t
  #a = null
  #e
  #s
  #i
  #n = null
  #r = null
  #o = null
  #l = null
  #c = null
  #u = 0
  #f = 0
  #v = !1
  #h = new Set()
  #g = new Set()
  #d = null
  #y = sa(
    () => (
      (this.#d = at(this.#u)),
      () => {
        this.#d = null
      }
    )
  )
  constructor (t, r, n) {
    ;(this.#t = t),
      (this.#e = r),
      (this.#s = n),
      (this.parent = J.b),
      (this.is_pending = !!this.#e.pending),
      (this.#i = Dr(() => {
        J.b = this
        {
          var s = this.#m()
          try {
            this.#n = We(() => n(s))
          } catch (i) {
            this.error(i)
          }
          this.#f > 0 ? this.#_() : (this.is_pending = !1)
        }
        return () => {
          this.#c?.remove()
        }
      }, ia))
  }
  #w () {
    try {
      this.#n = We(() => this.#s(this.#t))
    } catch (t) {
      this.error(t)
    }
  }
  #x () {
    const t = this.#e.pending
    t &&
      ((this.#r = We(() => t(this.#t))),
      Ge.enqueue(() => {
        var r = this.#m()
        ;(this.#n = this.#p(() => (Ge.ensure(), We(() => this.#s(r))))),
          this.#f > 0
            ? this.#_()
            : (Et(this.#r, () => {
                this.#r = null
              }),
              (this.is_pending = !1))
      }))
  }
  #m () {
    var t = this.#t
    return (
      this.is_pending &&
        ((this.#c = nt()), this.#t.before(this.#c), (t = this.#c)),
      t
    )
  }
  defer_effect (t) {
    ms(t, this.#h, this.#g)
  }
  is_rendered () {
    return !this.is_pending && (!this.parent || this.parent.is_rendered())
  }
  has_pending_snippet () {
    return !!this.#e.pending
  }
  #p (t) {
    var r = J,
      n = X,
      s = ae
    Ze(this.#i), Oe(this.#i), Ft(this.#i.ctx)
    try {
      return t()
    } catch (i) {
      return ps(i), null
    } finally {
      Ze(r), Oe(n), Ft(s)
    }
  }
  #_ () {
    const t = this.#e.pending
    this.#n !== null &&
      ((this.#l = document.createDocumentFragment()),
      this.#l.append(this.#c),
      zs(this.#n, this.#l)),
      this.#r === null && (this.#r = We(() => t(this.#t)))
  }
  #b (t) {
    if (!this.has_pending_snippet()) {
      this.parent && this.parent.#b(t)
      return
    }
    if (((this.#f += t), this.#f === 0)) {
      this.is_pending = !1
      for (const r of this.#h) ce(r, $e), it(r)
      for (const r of this.#g) ce(r, Je), it(r)
      this.#h.clear(),
        this.#g.clear(),
        this.#r &&
          Et(this.#r, () => {
            this.#r = null
          }),
        this.#l && (this.#t.before(this.#l), (this.#l = null))
    }
  }
  update_pending_count (t) {
    this.#b(t), (this.#u += t), this.#d && Ve(this.#d, this.#u)
  }
  get_effect_pending () {
    return this.#y(), a(this.#d)
  }
  error (t) {
    var r = this.#e.onerror
    let n = this.#e.failed
    if (this.#v || (!r && !n)) throw t
    this.#n && (Ie(this.#n), (this.#n = null)),
      this.#r && (Ie(this.#r), (this.#r = null)),
      this.#o && (Ie(this.#o), (this.#o = null))
    var s = !1,
      i = !1
    const l = () => {
      if (s) {
        Ji()
        return
      }
      ;(s = !0),
        i && Wi(),
        Ge.ensure(),
        (this.#u = 0),
        this.#o !== null &&
          Et(this.#o, () => {
            this.#o = null
          }),
        (this.is_pending = this.has_pending_snippet()),
        (this.#n = this.#p(() => ((this.#v = !1), We(() => this.#s(this.#t))))),
        this.#f > 0 ? this.#_() : (this.is_pending = !1)
    }
    var o = X
    try {
      Oe(null), (i = !0), r?.(t, l), (i = !1)
    } catch (c) {
      Xt(c, this.#i && this.#i.parent)
    } finally {
      Oe(o)
    }
    n &&
      Ot(() => {
        this.#o = this.#p(() => {
          Ge.ensure(), (this.#v = !0)
          try {
            return We(() => {
              n(
                this.#t,
                () => t,
                () => l
              )
            })
          } catch (c) {
            return Xt(c, this.#i.parent), null
          } finally {
            this.#v = !1
          }
        })
      })
  }
}
function la (e, t, r, n) {
  const s = Kt() ? fn : dn
  if (r.length === 0 && e.length === 0) {
    n(t.map(s))
    return
  }
  var i = te,
    l = J,
    o = ks()
  function c () {
    Promise.all(r.map(u => ca(u)))
      .then(u => {
        o()
        try {
          n([...t.map(s), ...u])
        } catch (h) {
          ;(l.f & rt) === 0 && Xt(h, l)
        }
        i?.deactivate(), lr()
      })
      .catch(u => {
        Xt(u, l)
      })
  }
  e.length > 0
    ? Promise.all(e).then(() => {
        o()
        try {
          return c()
        } finally {
          i?.deactivate(), lr()
        }
      })
    : c()
}
function ks () {
  var e = J,
    t = X,
    r = ae,
    n = te
  return function (i = !0) {
    Ze(e), Oe(t), Ft(r), i && n?.activate()
  }
}
function lr () {
  Ze(null), Oe(null), Ft(null)
}
function fn (e) {
  var t = be | $e,
    r = X !== null && (X.f & be) !== 0 ? X : null
  return (
    J !== null && (J.f |= Gt),
    {
      ctx: ae,
      deps: null,
      effects: null,
      equals: ds,
      f: t,
      fn: e,
      reactions: null,
      rv: 0,
      v: de,
      wv: 0,
      parent: r ?? J,
      ac: null
    }
  )
}
function ca (e, t, r) {
  let n = J
  n === null && Ii()
  var s = n.b,
    i = void 0,
    l = at(de),
    o = !X,
    c = new Map()
  return (
    ya(() => {
      var u = as()
      i = u.promise
      try {
        Promise.resolve(e())
          .then(u.resolve, u.reject)
          .then(() => {
            h === te && h.committed && h.deactivate(), lr()
          })
      } catch (g) {
        u.reject(g), lr()
      }
      var h = te
      if (o) {
        var _ = s.is_rendered()
        s.update_pending_count(1),
          h.increment(_),
          c.get(h)?.reject(Lt),
          c.delete(h),
          c.set(h, u)
      }
      const v = (g, x = void 0) => {
        if ((h.activate(), x)) x !== Lt && ((l.f |= dt), Ve(l, x))
        else {
          ;(l.f & dt) !== 0 && (l.f ^= dt), Ve(l, g)
          for (const [S, f] of c) {
            if ((c.delete(S), S === h)) break
            f.reject(Lt)
          }
        }
        o && (s.update_pending_count(-1), h.decrement(_))
      }
      u.promise.then(v, g => v(null, g || 'unknown'))
    }),
    Nr(() => {
      for (const u of c.values()) u.reject(Lt)
    }),
    new Promise(u => {
      function h (_) {
        function v () {
          _ === i ? u(l) : h(i)
        }
        _.then(v, v)
      }
      h(i)
    })
  )
}
function dn (e) {
  const t = fn(e)
  return (t.equals = hs), t
}
function Ss (e) {
  var t = e.effects
  if (t !== null) {
    e.effects = null
    for (var r = 0; r < t.length; r += 1) Ie(t[r])
  }
}
function ua (e) {
  for (var t = e.parent; t !== null; ) {
    if ((t.f & be) === 0) return (t.f & rt) === 0 ? t : null
    t = t.parent
  }
  return null
}
function vn (e) {
  var t,
    r = J
  Ze(ua(e))
  try {
    ;(e.f &= ~Dt), Ss(e), (t = Xs(e))
  } finally {
    Ze(r)
  }
  return t
}
function Es (e) {
  var t = vn(e)
  if (
    !e.equals(t) &&
    ((e.wv = Hs()),
    (!te?.is_fork || e.deps === null) && ((e.v = t), e.deps === null))
  ) {
    ce(e, me)
    return
  }
  ht || (Xe !== null ? (hn() || te?.is_fork) && Xe.set(e, t) : un(e))
}
let Kr = new Set()
const vt = new Map()
let $s = !1
function at (e, t) {
  var r = { f: 0, v: e, reactions: null, equals: ds, rv: 0, wv: 0 }
  return r
}
function Re (e, t) {
  const r = at(e)
  return Sa(r), r
}
function R (e, t = !1, r = !0) {
  const n = at(e)
  return (
    t || (n.equals = hs),
    Bt && r && ae !== null && ae.l !== null && (ae.l.s ??= []).push(n),
    n
  )
}
function De (e, t) {
  return (
    E(
      e,
      $(() => a(e))
    ),
    t
  )
}
function E (e, t, r = !1) {
  X !== null &&
    (!Be || (X.f & Cn) !== 0) &&
    Kt() &&
    (X.f & (be | lt | cn | Cn)) !== 0 &&
    !st?.includes(e) &&
    zi()
  let n = r ? qe(t) : t
  return Ve(e, n)
}
function Ve (e, t) {
  if (!e.equals(t)) {
    var r = e.v
    ht ? vt.set(e, t) : vt.set(e, r), (e.v = t)
    var n = Ge.ensure()
    if ((n.capture(e, r), (e.f & be) !== 0)) {
      const s = e
      ;(e.f & $e) !== 0 && vn(s), un(s)
    }
    ;(e.wv = Hs()),
      Ts(e, $e),
      Kt() &&
        J !== null &&
        (J.f & me) !== 0 &&
        (J.f & (ct | At)) === 0 &&
        (Le === null ? Ea([e]) : Le.push(e)),
      !n.is_fork && Kr.size > 0 && !$s && fa()
  }
  return t
}
function fa () {
  $s = !1
  var e = $t
  xr(!0)
  const t = Array.from(Kr)
  try {
    for (const r of t) (r.f & me) !== 0 && ce(r, Je), Ut(r) && qt(r)
  } finally {
    xr(e)
  }
  Kr.clear()
}
function da (e, t = 1) {
  var r = a(e),
    n = t === 1 ? r++ : r--
  return E(e, r), n
}
function or (e) {
  E(e, e.v + 1)
}
function Ts (e, t) {
  var r = e.reactions
  if (r !== null)
    for (var n = Kt(), s = r.length, i = 0; i < s; i++) {
      var l = r[i],
        o = l.f
      if (!(!n && l === J)) {
        var c = (o & $e) === 0
        if ((c && ce(l, t), (o & be) !== 0)) {
          var u = l
          Xe?.delete(u), (o & Dt) === 0 && (o & He && (l.f |= Dt), Ts(u, Je))
        } else c && ((o & lt) !== 0 && et !== null && et.add(l), it(l))
      }
    }
}
function qe (e) {
  if (typeof e != 'object' || e === null || St in e) return e
  const t = an(e)
  if (t !== Ei && t !== $i) return e
  var r = new Map(),
    n = ns(e),
    s = Re(0),
    i = Tt,
    l = o => {
      if (Tt === i) return o()
      var c = X,
        u = Tt
      Oe(null), Rn(i)
      var h = o()
      return Oe(c), Rn(u), h
    }
  return (
    n && r.set('length', Re(e.length)),
    new Proxy(e, {
      defineProperty (o, c, u) {
        ;(!('value' in u) ||
          u.configurable === !1 ||
          u.enumerable === !1 ||
          u.writable === !1) &&
          Li()
        var h = r.get(c)
        return (
          h === void 0
            ? (h = l(() => {
                var _ = Re(u.value)
                return r.set(c, _), _
              }))
            : E(h, u.value, !0),
          !0
        )
      },
      deleteProperty (o, c) {
        var u = r.get(c)
        if (u === void 0) {
          if (c in o) {
            const h = l(() => Re(de))
            r.set(c, h), or(s)
          }
        } else E(u, de), or(s)
        return !0
      },
      get (o, c, u) {
        if (c === St) return e
        var h = r.get(c),
          _ = c in o
        if (
          (h === void 0 &&
            (!_ || kt(o, c)?.writable) &&
            ((h = l(() => {
              var g = qe(_ ? o[c] : de),
                x = Re(g)
              return x
            })),
            r.set(c, h)),
          h !== void 0)
        ) {
          var v = a(h)
          return v === de ? void 0 : v
        }
        return Reflect.get(o, c, u)
      },
      getOwnPropertyDescriptor (o, c) {
        var u = Reflect.getOwnPropertyDescriptor(o, c)
        if (u && 'value' in u) {
          var h = r.get(c)
          h && (u.value = a(h))
        } else if (u === void 0) {
          var _ = r.get(c),
            v = _?.v
          if (_ !== void 0 && v !== de)
            return { enumerable: !0, configurable: !0, value: v, writable: !0 }
        }
        return u
      },
      has (o, c) {
        if (c === St) return !0
        var u = r.get(c),
          h = (u !== void 0 && u.v !== de) || Reflect.has(o, c)
        if (u !== void 0 || (J !== null && (!h || kt(o, c)?.writable))) {
          u === void 0 &&
            ((u = l(() => {
              var v = h ? qe(o[c]) : de,
                g = Re(v)
              return g
            })),
            r.set(c, u))
          var _ = a(u)
          if (_ === de) return !1
        }
        return h
      },
      set (o, c, u, h) {
        var _ = r.get(c),
          v = c in o
        if (n && c === 'length')
          for (var g = u; g < _.v; g += 1) {
            var x = r.get(g + '')
            x !== void 0
              ? E(x, de)
              : g in o && ((x = l(() => Re(de))), r.set(g + '', x))
          }
        if (_ === void 0)
          (!v || kt(o, c)?.writable) &&
            ((_ = l(() => Re(void 0))), E(_, qe(u)), r.set(c, _))
        else {
          v = _.v !== de
          var S = l(() => qe(u))
          E(_, S)
        }
        var f = Reflect.getOwnPropertyDescriptor(o, c)
        if ((f?.set && f.set.call(h, u), !v)) {
          if (n && typeof c == 'string') {
            var p = r.get('length'),
              m = Number(c)
            Number.isInteger(m) && m >= p.v && E(p, m + 1)
          }
          or(s)
        }
        return !0
      },
      ownKeys (o) {
        a(s)
        var c = Reflect.ownKeys(o).filter(_ => {
          var v = r.get(_)
          return v === void 0 || v.v !== de
        })
        for (var [u, h] of r) h.v !== de && !(u in o) && c.push(u)
        return c
      },
      setPrototypeOf () {
        Ri()
      }
    })
  )
}
var jn, Ns, Ds, As
function va () {
  if (jn === void 0) {
    ;(jn = window), (Ns = /Firefox/.test(navigator.userAgent))
    var e = Element.prototype,
      t = Node.prototype,
      r = Text.prototype
    ;(Ds = kt(t, 'firstChild').get),
      (As = kt(t, 'nextSibling').get),
      Mn(e) &&
        ((e.__click = void 0),
        (e.__className = void 0),
        (e.__attributes = null),
        (e.__style = void 0),
        (e.__e = void 0)),
      Mn(r) && (r.__t = void 0)
  }
}
function nt (e = '') {
  return document.createTextNode(e)
}
function wr (e) {
  return Ds.call(e)
}
function fr (e) {
  return As.call(e)
}
function N (e, t) {
  return wr(e)
}
function q (e, t = !1) {
  {
    var r = wr(e)
    return r instanceof Comment && r.data === '' ? fr(r) : r
  }
}
function y (e, t = 1, r = !1) {
  let n = e
  for (; t--; ) n = fr(n)
  return n
}
function ha (e) {
  e.textContent = ''
}
function Os () {
  return !1
}
let Yn = !1
function ga () {
  Yn ||
    ((Yn = !0),
    document.addEventListener(
      'reset',
      e => {
        Promise.resolve().then(() => {
          if (!e.defaultPrevented)
            for (const t of e.target.elements) t.__on_r?.()
        })
      },
      { capture: !0 }
    ))
}
function Tr (e) {
  var t = X,
    r = J
  Oe(null), Ze(null)
  try {
    return e()
  } finally {
    Oe(t), Ze(r)
  }
}
function pa (e, t, r, n = r) {
  e.addEventListener(t, () => Tr(r))
  const s = e.__on_r
  s
    ? (e.__on_r = () => {
        s(), n(!0)
      })
    : (e.__on_r = () => n(!0)),
    ga()
}
function Is (e) {
  J === null && (X === null && Pi(), Ci()), ht && Mi()
}
function _a (e, t) {
  var r = t.last
  r === null
    ? (t.last = t.first = e)
    : ((r.next = e), (e.prev = r), (t.last = e))
}
function Qe (e, t, r) {
  var n = J
  n !== null && (n.f & je) !== 0 && (e |= je)
  var s = {
    ctx: ae,
    deps: null,
    nodes: null,
    f: e | $e | He,
    first: null,
    fn: t,
    last: null,
    next: null,
    parent: n,
    b: n && n.b,
    prev: null,
    teardown: null,
    wv: 0,
    ac: null
  }
  if (r)
    try {
      qt(s), (s.f |= ln)
    } catch (o) {
      throw (Ie(s), o)
    }
  else t !== null && it(s)
  var i = s
  if (
    (r &&
      i.deps === null &&
      i.teardown === null &&
      i.nodes === null &&
      i.first === i.last &&
      (i.f & Gt) === 0 &&
      ((i = i.first),
      (e & lt) !== 0 && (e & Ht) !== 0 && i !== null && (i.f |= Ht)),
    i !== null &&
      ((i.parent = n),
      n !== null && _a(i, n),
      X !== null && (X.f & be) !== 0 && (e & At) === 0))
  ) {
    var l = X
    ;(l.effects ??= []).push(i)
  }
  return s
}
function hn () {
  return X !== null && !Be
}
function Nr (e) {
  const t = Qe(ur, null, !1)
  return ce(t, me), (t.teardown = e), t
}
function Ur (e) {
  Is()
  var t = J.f,
    r = !X && (t & ct) !== 0 && (t & ln) === 0
  if (r) {
    var n = ae
    ;(n.e ??= []).push(e)
  } else return Ms(e)
}
function Ms (e) {
  return Qe(yr | cs, e, !1)
}
function ma (e) {
  return Is(), Qe(ur | cs, e, !0)
}
function ba (e) {
  Ge.ensure()
  const t = Qe(At | Gt, e, !0)
  return (r = {}) =>
    new Promise(n => {
      r.outro
        ? Et(t, () => {
            Ie(t), n(void 0)
          })
        : (Ie(t), n(void 0))
    })
}
function Cs (e) {
  return Qe(yr, e, !1)
}
function ot (e, t) {
  var r = ae,
    n = { effect: null, ran: !1, deps: e }
  r.l.$.push(n),
    (n.effect = dr(() => {
      e(), !n.ran && ((n.ran = !0), $(t))
    }))
}
function pt () {
  var e = ae
  dr(() => {
    for (var t of e.l.$) {
      t.deps()
      var r = t.effect
      ;(r.f & me) !== 0 && r.deps !== null && ce(r, Je),
        Ut(r) && qt(r),
        (t.ran = !1)
    }
  })
}
function ya (e) {
  return Qe(cn | Gt, e, !0)
}
function dr (e, t = 0) {
  return Qe(ur | t, e, !0)
}
function U (e, t = [], r = [], n = []) {
  la(n, t, r, s => {
    Qe(ur, () => e(...s.map(a)), !0)
  })
}
function Dr (e, t = 0) {
  var r = Qe(lt | t, e, !0)
  return r
}
function We (e) {
  return Qe(ct | Gt, e, !0)
}
function Ps (e) {
  var t = e.teardown
  if (t !== null) {
    const r = ht,
      n = X
    Ln(!0), Oe(null)
    try {
      t.call(null)
    } finally {
      Ln(r), Oe(n)
    }
  }
}
function js (e, t = !1) {
  var r = e.first
  for (e.first = e.last = null; r !== null; ) {
    const s = r.ac
    s !== null &&
      Tr(() => {
        s.abort(Lt)
      })
    var n = r.next
    ;(r.f & At) !== 0 ? (r.parent = null) : Ie(r, t), (r = n)
  }
}
function wa (e) {
  for (var t = e.first; t !== null; ) {
    var r = t.next
    ;(t.f & ct) === 0 && Ie(t), (t = r)
  }
}
function Ie (e, t = !0) {
  var r = !1
  ;(t || (e.f & ls) !== 0) &&
    e.nodes !== null &&
    e.nodes.end !== null &&
    (xa(e.nodes.start, e.nodes.end), (r = !0)),
    js(e, t && !r),
    kr(e, 0),
    ce(e, rt)
  var n = e.nodes && e.nodes.t
  if (n !== null) for (const i of n) i.stop()
  Ps(e)
  var s = e.parent
  s !== null && s.first !== null && Ys(e),
    (e.next =
      e.prev =
      e.teardown =
      e.ctx =
      e.deps =
      e.fn =
      e.nodes =
      e.ac =
        null)
}
function xa (e, t) {
  for (; e !== null; ) {
    var r = e === t ? null : fr(e)
    e.remove(), (e = r)
  }
}
function Ys (e) {
  var t = e.parent,
    r = e.prev,
    n = e.next
  r !== null && (r.next = n),
    n !== null && (n.prev = r),
    t !== null && (t.first === e && (t.first = n), t.last === e && (t.last = r))
}
function Et (e, t, r = !0) {
  var n = []
  Ls(e, n, !0)
  var s = () => {
      r && Ie(e), t && t()
    },
    i = n.length
  if (i > 0) {
    var l = () => --i || s()
    for (var o of n) o.out(l)
  } else s()
}
function Ls (e, t, r) {
  if ((e.f & je) === 0) {
    e.f ^= je
    var n = e.nodes && e.nodes.t
    if (n !== null) for (const o of n) (o.is_global || r) && t.push(o)
    for (var s = e.first; s !== null; ) {
      var i = s.next,
        l = (s.f & Ht) !== 0 || ((s.f & ct) !== 0 && (e.f & lt) !== 0)
      Ls(s, t, l ? r : !1), (s = i)
    }
  }
}
function gn (e) {
  Rs(e, !0)
}
function Rs (e, t) {
  if ((e.f & je) !== 0) {
    ;(e.f ^= je), (e.f & me) === 0 && (ce(e, $e), it(e))
    for (var r = e.first; r !== null; ) {
      var n = r.next,
        s = (r.f & Ht) !== 0 || (r.f & ct) !== 0
      Rs(r, s ? t : !1), (r = n)
    }
    var i = e.nodes && e.nodes.t
    if (i !== null) for (const l of i) (l.is_global || t) && l.in()
  }
}
function zs (e, t) {
  if (e.nodes)
    for (var r = e.nodes.start, n = e.nodes.end; r !== null; ) {
      var s = r === n ? null : fr(r)
      t.append(r), (r = s)
    }
}
let Yt = null
function ka (e) {
  var t = Yt
  try {
    if (((Yt = new Set()), $(e), t !== null)) for (var r of Yt) t.add(r)
    return Yt
  } finally {
    Yt = t
  }
}
function ft (e) {
  for (var t of ka(e)) Ve(t, t.v)
}
let $t = !1
function xr (e) {
  $t = e
}
let ht = !1
function Ln (e) {
  ht = e
}
let X = null,
  Be = !1
function Oe (e) {
  X = e
}
let J = null
function Ze (e) {
  J = e
}
let st = null
function Sa (e) {
  X !== null && (st === null ? (st = [e]) : st.push(e))
}
let Ae = null,
  Pe = 0,
  Le = null
function Ea (e) {
  Le = e
}
let Ws = 1,
  wt = 0,
  Tt = wt
function Rn (e) {
  Tt = e
}
function Hs () {
  return ++Ws
}
function Ut (e) {
  var t = e.f
  if ((t & $e) !== 0) return !0
  if ((t & be && (e.f &= ~Dt), (t & Je) !== 0)) {
    for (var r = e.deps, n = r.length, s = 0; s < n; s++) {
      var i = r[s]
      if ((Ut(i) && Es(i), i.wv > e.wv)) return !0
    }
    ;(t & He) !== 0 && Xe === null && ce(e, me)
  }
  return !1
}
function Fs (e, t, r = !0) {
  var n = e.reactions
  if (n !== null && !st?.includes(e))
    for (var s = 0; s < n.length; s++) {
      var i = n[s]
      ;(i.f & be) !== 0
        ? Fs(i, t, !1)
        : t === i && (r ? ce(i, $e) : (i.f & me) !== 0 && ce(i, Je), it(i))
    }
}
function Xs (e) {
  var t = Ae,
    r = Pe,
    n = Le,
    s = X,
    i = st,
    l = ae,
    o = Be,
    c = Tt,
    u = e.f
  ;(Ae = null),
    (Pe = 0),
    (Le = null),
    (X = (u & (ct | At)) === 0 ? e : null),
    (st = null),
    Ft(e.ctx),
    (Be = !1),
    (Tt = ++wt),
    e.ac !== null &&
      (Tr(() => {
        e.ac.abort(Lt)
      }),
      (e.ac = null))
  try {
    e.f |= Gr
    var h = e.fn,
      _ = h(),
      v = e.deps
    if (Ae !== null) {
      var g
      if ((kr(e, Pe), v !== null && Pe > 0))
        for (v.length = Pe + Ae.length, g = 0; g < Ae.length; g++)
          v[Pe + g] = Ae[g]
      else e.deps = v = Ae
      if (hn() && (e.f & He) !== 0)
        for (g = Pe; g < v.length; g++) (v[g].reactions ??= []).push(e)
    } else v !== null && Pe < v.length && (kr(e, Pe), (v.length = Pe))
    if (
      Kt() &&
      Le !== null &&
      !Be &&
      v !== null &&
      (e.f & (be | Je | $e)) === 0
    )
      for (g = 0; g < Le.length; g++) Fs(Le[g], e)
    if (s !== null && s !== e) {
      if ((wt++, s.deps !== null))
        for (let x = 0; x < r; x += 1) s.deps[x].rv = wt
      if (t !== null) for (const x of t) x.rv = wt
      Le !== null && (n === null ? (n = Le) : n.push(...Le))
    }
    return (e.f & dt) !== 0 && (e.f ^= dt), _
  } catch (x) {
    return ps(x)
  } finally {
    ;(e.f ^= Gr),
      (Ae = t),
      (Pe = r),
      (Le = n),
      (X = s),
      (st = i),
      Ft(l),
      (Be = o),
      (Tt = c)
  }
}
function $a (e, t) {
  let r = t.reactions
  if (r !== null) {
    var n = Si.call(r, e)
    if (n !== -1) {
      var s = r.length - 1
      s === 0 ? (r = t.reactions = null) : ((r[n] = r[s]), r.pop())
    }
  }
  if (r === null && (t.f & be) !== 0 && (Ae === null || !Ae.includes(t))) {
    var i = t
    ;(i.f & He) !== 0 && ((i.f ^= He), (i.f &= ~Dt)), un(i), Ss(i), kr(i, 0)
  }
}
function kr (e, t) {
  var r = e.deps
  if (r !== null) for (var n = t; n < r.length; n++) $a(e, r[n])
}
function qt (e) {
  var t = e.f
  if ((t & rt) === 0) {
    ce(e, me)
    var r = J,
      n = $t
    ;(J = e), ($t = !0)
    try {
      ;(t & (lt | os)) !== 0 ? wa(e) : js(e), Ps(e)
      var s = Xs(e)
      ;(e.teardown = typeof s == 'function' ? s : null), (e.wv = Ws)
      var i
      Xr && Qi && (e.f & $e) !== 0 && e.deps
    } finally {
      ;($t = n), (J = r)
    }
  }
}
async function Ta () {
  await Promise.resolve(), bs()
}
function a (e) {
  var t = e.f,
    r = (t & be) !== 0
  if ((Yt?.add(e), X !== null && !Be)) {
    var n = J !== null && (J.f & rt) !== 0
    if (!n && !st?.includes(e)) {
      var s = X.deps
      if ((X.f & Gr) !== 0)
        e.rv < wt &&
          ((e.rv = wt),
          Ae === null && s !== null && s[Pe] === e
            ? Pe++
            : Ae === null
            ? (Ae = [e])
            : Ae.push(e))
      else {
        ;(X.deps ??= []).push(e)
        var i = e.reactions
        i === null ? (e.reactions = [X]) : i.includes(X) || i.push(X)
      }
    }
  }
  if (ht && vt.has(e)) return vt.get(e)
  if (r) {
    var l = e
    if (ht) {
      var o = l.v
      return (
        (((l.f & me) === 0 && l.reactions !== null) || Gs(l)) && (o = vn(l)),
        vt.set(l, o),
        o
      )
    }
    var c = (l.f & He) === 0 && !Be && X !== null && ($t || (X.f & He) !== 0),
      u = l.deps === null
    Ut(l) && (c && (l.f |= He), Es(l)), c && !u && qs(l)
  }
  if (Xe?.has(e)) return Xe.get(e)
  if ((e.f & dt) !== 0) throw e.v
  return e.v
}
function qs (e) {
  if (e.deps !== null) {
    e.f |= He
    for (const t of e.deps)
      (t.reactions ??= []).push(e),
        (t.f & be) !== 0 && (t.f & He) === 0 && qs(t)
  }
}
function Gs (e) {
  if (e.v === de) return !0
  if (e.deps === null) return !1
  for (const t of e.deps)
    if (vt.has(t) || ((t.f & be) !== 0 && Gs(t))) return !0
  return !1
}
function $ (e) {
  var t = Be
  try {
    return (Be = !0), e()
  } finally {
    Be = t
  }
}
function xt (e) {
  if (!(typeof e != 'object' || !e || e instanceof EventTarget)) {
    if (St in e) Vr(e)
    else if (!Array.isArray(e))
      for (let t in e) {
        const r = e[t]
        typeof r == 'object' && r && St in r && Vr(r)
      }
  }
}
function Vr (e, t = new Set()) {
  if (
    typeof e == 'object' &&
    e !== null &&
    !(e instanceof EventTarget) &&
    !t.has(e)
  ) {
    t.add(e), e instanceof Date && e.getTime()
    for (let n in e)
      try {
        Vr(e[n], t)
      } catch {}
    const r = an(e)
    if (
      r !== Object.prototype &&
      r !== Array.prototype &&
      r !== Map.prototype &&
      r !== Set.prototype &&
      r !== Date.prototype
    ) {
      const n = is(r)
      for (let s in n) {
        const i = n[s].get
        if (i)
          try {
            i.call(e)
          } catch {}
      }
    }
  }
}
const Na = ['touchstart', 'touchmove']
function Da (e) {
  return Na.includes(e)
}
const Bs = new Set(),
  Zr = new Set()
function Aa (e, t, r, n = {}) {
  function s (i) {
    if ((n.capture || sr.call(t, i), !i.cancelBubble))
      return Tr(() => r?.call(this, i))
  }
  return (
    e.startsWith('pointer') || e.startsWith('touch') || e === 'wheel'
      ? Ot(() => {
          t.addEventListener(e, s, n)
        })
      : t.addEventListener(e, s, n),
    s
  )
}
function M (e, t, r, n, s) {
  var i = { capture: n, passive: s },
    l = Aa(e, t, r, i)
  ;(t === document.body ||
    t === window ||
    t === document ||
    t instanceof HTMLMediaElement) &&
    Nr(() => {
      t.removeEventListener(e, l, i)
    })
}
function Oa (e) {
  for (var t = 0; t < e.length; t++) Bs.add(e[t])
  for (var r of Zr) r(e)
}
let zn = null
function sr (e) {
  var t = this,
    r = t.ownerDocument,
    n = e.type,
    s = e.composedPath?.() || [],
    i = s[0] || e.target
  zn = e
  var l = 0,
    o = zn === e && e.__root
  if (o) {
    var c = s.indexOf(o)
    if (c !== -1 && (t === document || t === window)) {
      e.__root = t
      return
    }
    var u = s.indexOf(t)
    if (u === -1) return
    c <= u && (l = c)
  }
  if (((i = s[l] || e.target), i !== t)) {
    ss(e, 'currentTarget', {
      configurable: !0,
      get () {
        return i || r
      }
    })
    var h = X,
      _ = J
    Oe(null), Ze(null)
    try {
      for (var v, g = []; i !== null; ) {
        var x = i.assignedSlot || i.parentNode || i.host || null
        try {
          var S = i['__' + n]
          S != null && (!i.disabled || e.target === i) && S.call(i, e)
        } catch (f) {
          v ? g.push(f) : (v = f)
        }
        if (e.cancelBubble || x === t || x === null) break
        i = x
      }
      if (v) {
        for (let f of g)
          queueMicrotask(() => {
            throw f
          })
        throw v
      }
    } finally {
      ;(e.__root = t), delete e.currentTarget, Oe(h), Ze(_)
    }
  }
}
function Ia (e) {
  var t = document.createElement('template')
  return (t.innerHTML = e.replaceAll('<!>', '<!---->')), t.content
}
function Sr (e, t) {
  var r = J
  r.nodes === null && (r.nodes = { start: e, end: t, a: null, t: null })
}
function T (e, t) {
  var r = (t & Ui) !== 0,
    n = (t & Vi) !== 0,
    s,
    i = !e.startsWith('<!>')
  return () => {
    s === void 0 && ((s = Ia(i ? e : '<!>' + e)), r || (s = wr(s)))
    var l = n || Ns ? document.importNode(s, !0) : s.cloneNode(!0)
    if (r) {
      var o = wr(l),
        c = l.lastChild
      Sr(o, c)
    } else Sr(l, l)
    return l
  }
}
function Wn (e = '') {
  {
    var t = nt(e + '')
    return Sr(t, t), t
  }
}
function Ee () {
  var e = document.createDocumentFragment(),
    t = document.createComment(''),
    r = nt()
  return e.append(t, r), Sr(t, r), e
}
function k (e, t) {
  e !== null && e.before(t)
}
function re (e, t) {
  var r = t == null ? '' : typeof t == 'object' ? t + '' : t
  r !== (e.__t ??= e.nodeValue) && ((e.__t = r), (e.nodeValue = r + ''))
}
function Ma (e, t) {
  return Ca(e, t)
}
const Mt = new Map()
function Ca (
  e,
  { target: t, anchor: r, props: n = {}, events: s, context: i, intro: l = !0 }
) {
  va()
  var o = new Set(),
    c = _ => {
      for (var v = 0; v < _.length; v++) {
        var g = _[v]
        if (!o.has(g)) {
          o.add(g)
          var x = Da(g)
          t.addEventListener(g, sr, { passive: x })
          var S = Mt.get(g)
          S === void 0
            ? (document.addEventListener(g, sr, { passive: x }), Mt.set(g, 1))
            : Mt.set(g, S + 1)
        }
      }
    }
  c(Er(Bs)), Zr.add(c)
  var u = void 0,
    h = ba(() => {
      var _ = r ?? t.appendChild(nt())
      return (
        aa(_, { pending: () => {} }, v => {
          if (i) {
            ve({})
            var g = ae
            g.c = i
          }
          s && (n.$$events = s), (u = e(v, n) || {}), i && he()
        }),
        () => {
          for (var v of o) {
            t.removeEventListener(v, sr)
            var g = Mt.get(v)
            --g === 0
              ? (document.removeEventListener(v, sr), Mt.delete(v))
              : Mt.set(v, g)
          }
          Zr.delete(c), _ !== r && _.parentNode?.removeChild(_)
        }
      )
    })
  return Pa.set(u, h), u
}
let Pa = new WeakMap()
class Ks {
  anchor
  #t = new Map()
  #a = new Map()
  #e = new Map()
  #s = new Set()
  #i = !0
  constructor (t, r = !0) {
    ;(this.anchor = t), (this.#i = r)
  }
  #n = () => {
    var t = te
    if (this.#t.has(t)) {
      var r = this.#t.get(t),
        n = this.#a.get(r)
      if (n) gn(n), this.#s.delete(r)
      else {
        var s = this.#e.get(r)
        s &&
          (this.#a.set(r, s.effect),
          this.#e.delete(r),
          s.fragment.lastChild.remove(),
          this.anchor.before(s.fragment),
          (n = s.effect))
      }
      for (const [i, l] of this.#t) {
        if ((this.#t.delete(i), i === t)) break
        const o = this.#e.get(l)
        o && (Ie(o.effect), this.#e.delete(l))
      }
      for (const [i, l] of this.#a) {
        if (i === r || this.#s.has(i)) continue
        const o = () => {
          if (Array.from(this.#t.values()).includes(i)) {
            var u = document.createDocumentFragment()
            zs(l, u), u.append(nt()), this.#e.set(i, { effect: l, fragment: u })
          } else Ie(l)
          this.#s.delete(i), this.#a.delete(i)
        }
        this.#i || !n ? (this.#s.add(i), Et(l, o, !1)) : o()
      }
    }
  }
  #r = t => {
    this.#t.delete(t)
    const r = Array.from(this.#t.values())
    for (const [n, s] of this.#e)
      r.includes(n) || (Ie(s.effect), this.#e.delete(n))
  }
  ensure (t, r) {
    var n = te,
      s = Os()
    if (r && !this.#a.has(t) && !this.#e.has(t))
      if (s) {
        var i = document.createDocumentFragment(),
          l = nt()
        i.append(l), this.#e.set(t, { effect: We(() => r(l)), fragment: i })
      } else
        this.#a.set(
          t,
          We(() => r(this.anchor))
        )
    if ((this.#t.set(n, t), s)) {
      for (const [o, c] of this.#a)
        o === t ? n.skipped_effects.delete(c) : n.skipped_effects.add(c)
      for (const [o, c] of this.#e)
        o === t
          ? n.skipped_effects.delete(c.effect)
          : n.skipped_effects.add(c.effect)
      n.oncommit(this.#n), n.ondiscard(this.#r)
    } else this.#n()
  }
}
const ja = 0,
  zr = 1
function Ya (e, t, r, n, s) {
  var i = Kt(),
    l = de,
    o = i ? at(l) : R(l, !1, !1),
    c = i ? at(l) : R(l, !1, !1),
    u = new Ks(e)
  Dr(() => {
    var h = t(),
      _ = !1
    if (Ti(h)) {
      var v = ks(),
        g = !1
      const x = S => {
        if (!_) {
          ;(g = !0), v(!1), Ge.ensure()
          try {
            S()
          } finally {
            lr(), Wt || bs()
          }
        }
      }
      h.then(
        S => {
          x(() => {
            Ve(o, S), u.ensure(zr, n && (f => n(f, o)))
          })
        },
        S => {
          x(() => {
            if ((Ve(c, S), u.ensure(zr, s && (f => s(f, c))), !s)) throw c.v
          })
        }
      ),
        Ot(() => {
          g ||
            x(() => {
              u.ensure(ja, r)
            })
        })
    } else Ve(o, h), u.ensure(zr, n && (x => n(x, o)))
    return () => {
      _ = !0
    }
  })
}
function C (e, t, r = !1) {
  var n = new Ks(e),
    s = r ? Ht : 0
  function i (l, o) {
    n.ensure(l, o)
  }
  Dr(() => {
    var l = !1
    t((o, c = !0) => {
      ;(l = !0), i(c, o)
    }),
      l || i(!1, null)
  }, s)
}
function pe (e, t) {
  return t
}
function La (e, t, r) {
  for (var n = [], s = t.length, i, l = t.length, o = 0; o < s; o++) {
    let _ = t[o]
    Et(
      _,
      () => {
        if (i) {
          if ((i.pending.delete(_), i.done.add(_), i.pending.size === 0)) {
            var v = e.outrogroups
            Jr(Er(i.done)), v.delete(i), v.size === 0 && (e.outrogroups = null)
          }
        } else l -= 1
      },
      !1
    )
  }
  if (l === 0) {
    var c = n.length === 0 && r !== null
    if (c) {
      var u = r,
        h = u.parentNode
      ha(h), h.append(u), e.items.clear()
    }
    Jr(t, !c)
  } else
    (i = { pending: new Set(t), done: new Set() }),
      (e.outrogroups ??= new Set()).add(i)
}
function Jr (e, t = !0) {
  for (var r = 0; r < e.length; r++) Ie(e[r], t)
}
var Hn
function _e (e, t, r, n, s, i = null) {
  var l = e,
    o = new Map(),
    c = (t & fs) !== 0
  if (c) {
    var u = e
    l = u.appendChild(nt())
  }
  var h = null,
    _ = dn(() => {
      var p = r()
      return ns(p) ? p : p == null ? [] : Er(p)
    }),
    v,
    g = !0
  function x () {
    ;(f.fallback = h),
      Ra(f, v, l, t, n),
      h !== null &&
        (v.length === 0
          ? (h.f & tt) === 0
            ? gn(h)
            : ((h.f ^= tt), ir(h, null, l))
          : Et(h, () => {
              h = null
            }))
  }
  var S = Dr(() => {
      v = a(_)
      for (
        var p = v.length, m = new Set(), d = te, w = Os(), A = 0;
        A < p;
        A += 1
      ) {
        var O = v[A],
          j = n(O, A),
          Y = g ? null : o.get(j)
        Y
          ? (Y.v && Ve(Y.v, O),
            Y.i && Ve(Y.i, A),
            w && d.skipped_effects.delete(Y.e))
          : ((Y = za(o, g ? l : (Hn ??= nt()), O, j, A, s, t, r)),
            g || (Y.e.f |= tt),
            o.set(j, Y)),
          m.add(j)
      }
      if (
        (p === 0 &&
          i &&
          !h &&
          (g
            ? (h = We(() => i(l)))
            : ((h = We(() => i((Hn ??= nt())))), (h.f |= tt))),
        !g)
      )
        if (w) {
          for (const [z, P] of o) m.has(z) || d.skipped_effects.add(P.e)
          d.oncommit(x), d.ondiscard(() => {})
        } else x()
      a(_)
    }),
    f = { effect: S, items: o, outrogroups: null, fallback: h }
  g = !1
}
function Ra (e, t, r, n, s) {
  var i = (n & Xi) !== 0,
    l = t.length,
    o = e.items,
    c = e.effect.first,
    u,
    h = null,
    _,
    v = [],
    g = [],
    x,
    S,
    f,
    p
  if (i)
    for (p = 0; p < l; p += 1)
      (x = t[p]),
        (S = s(x, p)),
        (f = o.get(S).e),
        (f.f & tt) === 0 && (f.nodes?.a?.measure(), (_ ??= new Set()).add(f))
  for (p = 0; p < l; p += 1) {
    if (((x = t[p]), (S = s(x, p)), (f = o.get(S).e), e.outrogroups !== null))
      for (const P of e.outrogroups) P.pending.delete(f), P.done.delete(f)
    if ((f.f & tt) !== 0)
      if (((f.f ^= tt), f === c)) ir(f, null, r)
      else {
        var m = h ? h.next : c
        f === e.effect.last && (e.effect.last = f.prev),
          f.prev && (f.prev.next = f.next),
          f.next && (f.next.prev = f.prev),
          ut(e, h, f),
          ut(e, f, m),
          ir(f, m, r),
          (h = f),
          (v = []),
          (g = []),
          (c = h.next)
        continue
      }
    if (
      ((f.f & je) !== 0 &&
        (gn(f), i && (f.nodes?.a?.unfix(), (_ ??= new Set()).delete(f))),
      f !== c)
    ) {
      if (u !== void 0 && u.has(f)) {
        if (v.length < g.length) {
          var d = g[0],
            w
          h = d.prev
          var A = v[0],
            O = v[v.length - 1]
          for (w = 0; w < v.length; w += 1) ir(v[w], d, r)
          for (w = 0; w < g.length; w += 1) u.delete(g[w])
          ut(e, A.prev, O.next),
            ut(e, h, A),
            ut(e, O, d),
            (c = d),
            (h = O),
            (p -= 1),
            (v = []),
            (g = [])
        } else
          u.delete(f),
            ir(f, c, r),
            ut(e, f.prev, f.next),
            ut(e, f, h === null ? e.effect.first : h.next),
            ut(e, h, f),
            (h = f)
        continue
      }
      for (v = [], g = []; c !== null && c !== f; )
        (u ??= new Set()).add(c), g.push(c), (c = c.next)
      if (c === null) continue
    }
    ;(f.f & tt) === 0 && v.push(f), (h = f), (c = f.next)
  }
  if (e.outrogroups !== null) {
    for (const P of e.outrogroups)
      P.pending.size === 0 && (Jr(Er(P.done)), e.outrogroups?.delete(P))
    e.outrogroups.size === 0 && (e.outrogroups = null)
  }
  if (c !== null || u !== void 0) {
    var j = []
    if (u !== void 0) for (f of u) (f.f & je) === 0 && j.push(f)
    for (; c !== null; )
      (c.f & je) === 0 && c !== e.fallback && j.push(c), (c = c.next)
    var Y = j.length
    if (Y > 0) {
      var z = (n & fs) !== 0 && l === 0 ? r : null
      if (i) {
        for (p = 0; p < Y; p += 1) j[p].nodes?.a?.measure()
        for (p = 0; p < Y; p += 1) j[p].nodes?.a?.fix()
      }
      La(e, j, z)
    }
  }
  i &&
    Ot(() => {
      if (_ !== void 0) for (f of _) f.nodes?.a?.apply()
    })
}
function za (e, t, r, n, s, i, l, o) {
  var c = (l & Hi) !== 0 ? ((l & qi) === 0 ? R(r, !1, !1) : at(r)) : null,
    u = (l & Fi) !== 0 ? at(s) : null
  return {
    v: c,
    i: u,
    e: We(
      () => (
        i(t, c ?? r, u ?? s, o),
        () => {
          e.delete(n)
        }
      )
    )
  }
}
function ir (e, t, r) {
  if (e.nodes)
    for (
      var n = e.nodes.start,
        s = e.nodes.end,
        i = t && (t.f & tt) === 0 ? t.nodes.start : r;
      n !== null;

    ) {
      var l = fr(n)
      if ((i.before(n), n === s)) return
      n = l
    }
}
function ut (e, t, r) {
  t === null ? (e.effect.first = r) : (t.next = r),
    r === null ? (e.effect.last = t) : (r.prev = t)
}
function Wa (e, t, r) {
  Cs(() => {
    var n = $(() => t(e, r?.()) || {})
    if (n?.destroy) return () => n.destroy()
  })
}
function Us (e) {
  var t,
    r,
    n = ''
  if (typeof e == 'string' || typeof e == 'number') n += e
  else if (typeof e == 'object')
    if (Array.isArray(e)) {
      var s = e.length
      for (t = 0; t < s; t++)
        e[t] && (r = Us(e[t])) && (n && (n += ' '), (n += r))
    } else for (r in e) e[r] && (n && (n += ' '), (n += r))
  return n
}
function Ha () {
  for (var e, t, r = 0, n = '', s = arguments.length; r < s; r++)
    (e = arguments[r]) && (t = Us(e)) && (n && (n += ' '), (n += t))
  return n
}
function pn (e) {
  return typeof e == 'object' ? Ha(e) : e ?? ''
}
function Fa (e, t, r) {
  var n = e == null ? '' : '' + e
  return t && (n = n ? n + ' ' + t : t), n === '' ? null : n
}
function Xa (e, t) {
  return e == null ? null : String(e)
}
function se (e, t, r, n, s, i) {
  var l = e.__className
  if (l !== r || l === void 0) {
    var o = Fa(r, n)
    o == null ? e.removeAttribute('class') : (e.className = o),
      (e.__className = r)
  }
  return i
}
function Qr (e, t, r, n) {
  var s = e.__style
  if (s !== t) {
    var i = Xa(t)
    i == null ? e.removeAttribute('style') : (e.style.cssText = i),
      (e.__style = t)
  }
  return n
}
const qa = Symbol('is custom element'),
  Ga = Symbol('is html')
function cr (e, t, r, n) {
  var s = Ba(e)
  s[t] !== (s[t] = r) &&
    (t === 'loading' && (e[Oi] = r),
    r == null
      ? e.removeAttribute(t)
      : typeof r != 'string' && Ka(e).includes(t)
      ? (e[t] = r)
      : e.setAttribute(t, r))
}
function Ba (e) {
  return (e.__attributes ??= {
    [qa]: e.nodeName.includes('-'),
    [Ga]: e.namespaceURI === Zi
  })
}
var Fn = new Map()
function Ka (e) {
  var t = e.getAttribute('is') || e.nodeName,
    r = Fn.get(t)
  if (r) return r
  Fn.set(t, (r = []))
  for (var n, s = e, i = Element.prototype; i !== s; ) {
    n = is(s)
    for (var l in n) n[l].set && r.push(l)
    s = an(s)
  }
  return r
}
function Ue (e, t, r = t) {
  var n = new WeakSet()
  pa(e, 'input', async s => {
    var i = s ? e.defaultValue : e.value
    if (
      ((i = Wr(e) ? Hr(i) : i),
      r(i),
      te !== null && n.add(te),
      await Ta(),
      i !== (i = t()))
    ) {
      var l = e.selectionStart,
        o = e.selectionEnd,
        c = e.value.length
      if (((e.value = i ?? ''), o !== null)) {
        var u = e.value.length
        l === o && o === c && u > c
          ? ((e.selectionStart = u), (e.selectionEnd = u))
          : ((e.selectionStart = l), (e.selectionEnd = Math.min(o, u)))
      }
    }
  }),
    $(t) == null &&
      e.value &&
      (r(Wr(e) ? Hr(e.value) : e.value), te !== null && n.add(te)),
    dr(() => {
      var s = t()
      if (e === document.activeElement) {
        var i = br ?? te
        if (n.has(i)) return
      }
      ;(Wr(e) && s === Hr(e.value)) ||
        (e.type === 'date' && !s && !e.value) ||
        (s !== e.value && (e.value = s ?? ''))
    })
}
function Wr (e) {
  var t = e.type
  return t === 'number' || t === 'range'
}
function Hr (e) {
  return e === '' ? null : +e
}
function Ua (e, t, r) {
  var n = kt(e, t)
  n &&
    n.set &&
    ((e[t] = r),
    Nr(() => {
      e[t] = null
    }))
}
function Xn (e, t) {
  return e === t || e?.[St] === t
}
function Va (e = {}, t, r, n) {
  return (
    Cs(() => {
      var s, i
      return (
        dr(() => {
          ;(s = i),
            (i = []),
            $(() => {
              e !== r(...i) &&
                (t(e, ...i), s && Xn(r(...s), e) && t(null, ...s))
            })
        }),
        () => {
          Ot(() => {
            i && Xn(r(...i), e) && t(null, ...i)
          })
        }
      )
    }),
    e
  )
}
function Se (e = !1) {
  const t = ae,
    r = t.l.u
  if (!r) return
  let n = () => xt(t.s)
  if (e) {
    let s = 0,
      i = {}
    const l = fn(() => {
      let o = !1
      const c = t.s
      for (const u in c) c[u] !== i[u] && ((i[u] = c[u]), (o = !0))
      return o && s++, s
    })
    n = () => a(l)
  }
  r.b.length &&
    ma(() => {
      qn(t, n), qr(r.b)
    }),
    Ur(() => {
      const s = $(() => r.m.map(Ni))
      return () => {
        for (const i of s) typeof i == 'function' && i()
      }
    }),
    r.a.length &&
      Ur(() => {
        qn(t, n), qr(r.a)
      })
}
function qn (e, t) {
  if (e.l.s) for (const r of e.l.s) a(r)
  t()
}
function Vs (e, t, r) {
  if (e == null) return t(void 0), zt
  const n = $(() => e.subscribe(t, r))
  return n.unsubscribe ? () => n.unsubscribe() : n
}
const Ct = []
function Ar (e, t = zt) {
  let r = null
  const n = new Set()
  function s (o) {
    if (vs(e, o) && ((e = o), r)) {
      const c = !Ct.length
      for (const u of n) u[1](), Ct.push(u, e)
      if (c) {
        for (let u = 0; u < Ct.length; u += 2) Ct[u][0](Ct[u + 1])
        Ct.length = 0
      }
    }
  }
  function i (o) {
    s(o(e))
  }
  function l (o, c = zt) {
    const u = [o, c]
    return (
      n.add(u),
      n.size === 1 && (r = t(s, i) || zt),
      o(e),
      () => {
        n.delete(u), n.size === 0 && r && (r(), (r = null))
      }
    )
  }
  return { set: s, update: i, subscribe: l }
}
function Za (e) {
  let t
  return Vs(e, r => (t = r))(), t
}
let _r = !1,
  en = Symbol()
function ue (e, t, r) {
  const n = (r[t] ??= { store: null, source: R(void 0), unsubscribe: zt })
  if (n.store !== e && !(en in r))
    if ((n.unsubscribe(), (n.store = e ?? null), e == null))
      (n.source.v = void 0), (n.unsubscribe = zt)
    else {
      var s = !0
      ;(n.unsubscribe = Vs(e, i => {
        s ? (n.source.v = i) : E(n.source, i)
      })),
        (s = !1)
    }
  return e && en in r ? Za(e) : a(n.source)
}
function V (e, t) {
  return e.set(t), t
}
function ge () {
  const e = {}
  function t () {
    Nr(() => {
      for (var r in e) e[r].unsubscribe()
      ss(e, en, { enumerable: !1, value: !0 })
    })
  }
  return [e, t]
}
function ie (e, t, r) {
  return e.set(r), t
}
function Ja (e) {
  var t = _r
  try {
    return (_r = !1), [e(), _r]
  } finally {
    _r = t
  }
}
function Rt (e, t, r, n) {
  var s = !Bt || (r & Gi) !== 0,
    i = (r & Ki) !== 0,
    l = n,
    o = !0,
    c = () => (o && ((o = !1), (l = n)), l),
    u
  {
    var h = St in e || Ai in e
    u = kt(e, t)?.set ?? (h && t in e ? m => (e[t] = m) : void 0)
  }
  var _,
    v = !1
  ;([_, v] = Ja(() => e[t])),
    _ === void 0 && n !== void 0 && ((_ = c()), u && (s && Yi(), u(_)))
  var g
  if (
    (s
      ? (g = () => {
          var m = e[t]
          return m === void 0 ? c() : ((o = !0), m)
        })
      : (g = () => {
          var m = e[t]
          return m !== void 0 && (l = void 0), m === void 0 ? l : m
        }),
    s && (r & Bi) === 0)
  )
    return g
  if (u) {
    var x = e.$$legacy
    return function (m, d) {
      return arguments.length > 0
        ? ((!s || !d || x || v) && u(d ? g() : m), m)
        : g()
    }
  }
  var S = !1,
    f = dn(() => ((S = !1), g()))
  a(f)
  var p = J
  return function (m, d) {
    if (arguments.length > 0) {
      const w = d ? a(f) : s && i ? qe(m) : m
      return E(f, w), (S = !0), l !== void 0 && (l = w), m
    }
    return (ht && S) || (p.f & rt) !== 0 ? f.v : a(f)
  }
}
function Vt (e) {
  ae === null && us(),
    Bt && ae.l !== null
      ? Qa(ae).m.push(e)
      : Ur(() => {
          const t = $(e)
          if (typeof t == 'function') return t
        })
}
function Zs (e) {
  ae === null && us(), Vt(() => () => $(e))
}
function Qa (e) {
  var t = e.l
  return (t.u ??= { a: [], b: [], m: [] })
}
const eo = '5'
typeof window < 'u' && ((window.__svelte ??= {}).v ??= new Set()).add(eo)
ea()
const to = {
  _game_name: 'Brief Mystery',
  _game_begun: !1,
  onlineOnly: !0,
  caseOpen: !1,
  kristaMoved: !1,
  kristaIndex: 0,
  melissaIndex: 0,
  wordleOver: !1,
  sudoku: [],
  crossword: [],
  connections: [!1, !1, !1, !1],
  inventory: {
    shovel: !1,
    shedKey: !1,
    shedNote: !1,
    sudokuNote: !1,
    redHerring: !1,
    rod: !1,
    gps: !1
  }
}
let H = Ar(to),
  K = Ar('splash'),
  Gn = Ar([200, 200, 1, 1])
function Nt (e = 0.5) {
  let t = new Audio('success.mp3')
  ;(t.volume = e), t.play()
}
function Bn (e = 0.5) {
  let t = new Audio('./assets/unsuccessful.m4a')
  ;(t.volume = e), t.play()
}
function ro (e = 0.5) {
  let t = new Audio('./assets/fart.mp3')
  ;(t.volume = e), t.play()
}
function Kn (e = 0.5) {
  let t = new Audio('./assets/successful.m4a')
  ;(t.volume = e), t.play()
}
var no = T('<h3 class="svelte-1y24yx5">Info</h3> <p> </p>', 1),
  so = T('<button class="text-sm svelte-1y24yx5"> </button>'),
  io = T('<p class="text-center"> </p>'),
  ao = T('<button class="text-sm svelte-1y24yx5">Use Shovel</button>'),
  oo = T(`<button class="text-sm svelte-1y24yx5">Go Fishin'</button>`),
  lo = T('<div class="text-3xl">🪏</div>'),
  co = T('<div class="flex text-3xl justify-center">🗝️</div>'),
  uo = T('<div class="text-3xl">📡</div> <p class="my-0"> </p>', 1),
  fo = T('<div class="text-3xl">🎣</div>'),
  vo = T(
    '<button class="svelte-1y24yx5"><div class="text-3xl">📡</div></button>'
  ),
  ho = T('<button class="svelte-1y24yx5">🗝️</button>'),
  go = T('<button class="svelte-1y24yx5">🗒️</button>'),
  po = T('<button class="svelte-1y24yx5">📄</button>'),
  _o = T('<button class="svelte-1y24yx5">🎣</button>'),
  mo = T(
    '<button class="text-3xl mx-3 inventoryButton svelte-1y24yx5">🪏</button>'
  ),
  bo = T(
    '<canvas id="canvas" class="bg-amber-200 ring-2 ring-black mx-auto">CONTENT</canvas> <div class="mx-auto bg-zinc-900 ring-2 ring-black"><div class="grid grid-cols-7 place-content-around p-1"><div class="controlArea col-span-2 svelte-1y24yx5"><!></div> <div class="controlArea mx-2 svelte-1y24yx5"><h3 class="svelte-1y24yx5">Actions</h3> <!> <!> <!></div> <div class="grid grid-cols-3 place-items-center rounded-md p-1 ring-2 bg-zinc-100 dark:bg-zinc-700 ring-gray-500 shadow-inner"><div></div> <button class="arrowButton svelte-1y24yx5">⬆</button> <div></div> <button class="arrowButton svelte-1y24yx5">⬅</button> <div></div> <button class="arrowButton rotate-180 svelte-1y24yx5">⬅</button> <div></div> <button class="arrowButton svelte-1y24yx5">⬇</button></div> <div class="controlArea ml-2 svelte-1y24yx5"><h3 class="svelte-1y24yx5">Equipped</h3> <div class="grid items-center equippedZone svelte-1y24yx5"><p class="italic dark:text-zinc-400 text-zinc-800 lowercase text-xs text-center"> </p> <!></div></div> <div class="controlArea col-span-2 ml-2 svelte-1y24yx5"><h3 class="svelte-1y24yx5">Inventory</h3> <div class="flex my-2 flex-wrap place-content-center text-center inventoryArea svelte-1y24yx5"><button class="svelte-1y24yx5">📱</button> <!> <!> <!> <!> <!>  <!></div></div></div></div>',
    1
  )
function yo (e, t) {
  ve(t, !1)
  const r = () => ue(Gn, '$savedPlayerPosition', s),
    n = () => ue(H, '$gameData', s),
    [s, i] = ge()
  Vt(we),
    Zs(() => {
      V(Gn, [...a(x), ...w])
    })
  let l
  const o = { width: 900, height: 600 }
  let c = !1,
    u = 0,
    h = R(!1),
    _ = R(!1),
    v = R(!1),
    g = R(''),
    x = R(r()),
    S = R('- nothing -'),
    f = 0,
    p = 0,
    m = [],
    d = R(),
    w = [r()[2], r()[3]],
    A = 4,
    O = R('0'),
    j = R('0')
  function Y () {
    return Math.round(1001 - (869 - a(x)[0]) / 0.869)
  }
  function z () {
    return Math.round(1001 - (1098 - (a(x)[1] + w[1] * 548 - 548)) / 1.098)
  }
  let P = new Image()
  P.src = './assets/my-sprite.png'
  let Z = new Image()
  Z.src = './assets/map-sheet.png'
  let Q = new Image()
  Q.src = './assets/objects.png'
  let oe = new Image()
  oe.src = './assets/people.png'
  const ye = new Image()
  ye.src = './assets/map.png'
  const Me = new Image()
  Me.src = './assets/mapAbove.png'
  const D = {
    name: 'Player',
    dX: a(x)[0],
    dY: a(x)[1],
    sX: 0,
    sY: 0,
    sH: 35,
    sW: 22,
    facing: 'Right',
    screen: [1, 1],
    scale: 1.5,
    img: P,
    show: () => {
      F++
      let b = 0
      D.facing == 'Up' && (b = 1),
        D.facing == 'Left' && (b = 2),
        D.facing == 'Down' && (b = 3),
        p < 0 && ((b = 4), (D.facing = 'Up')),
        p > 0 && ((b = 5), (D.facing = 'Down')),
        f > 0 && ((b = 6), (D.facing = 'Right')),
        f < 0 && ((b = 7), (D.facing = 'Left')),
        a(h) && (b = 8),
        b < 4 &&
          le == 1 &&
          F == 1 &&
          (Math.random() < 0.92 && (le = 2),
          Math.random() < 0.1 && ((c = !0), setTimeout(() => (c = !1), 150))),
        a(_)
          ? ne(D, D.sW, 9 * D.sH)
          : a(v)
          ? ne(D, 0, 9 * D.sH)
          : ne(D, Ce[le] * D.sW, b * D.sH),
        F > 10 && ((F = 0), le++, u++),
        le >= Ce.length && (le = 0)
    }
  }
  ;(D.dX = (o.width - D.sW) / 2), (D.dY = (o.height - D.sH) / 2)
  const Ce = [0, 1, 2, 3]
  let le = 0,
    F = 0
  m.push(D)
  let W = []
  function G () {
    W = [
      { screenNum: '1,1', x: 250, y: 270, w: 64, h: 54 },
      { screenNum: '1,1', x: 10, y: 10, w: 115, h: 140 },
      { screenNum: '1,1', x: 35, y: 520, w: 40, h: 40 },
      { screenNum: '1,1', x: 560, y: 572, w: 664, h: 32 },
      {
        screenNum: '1,1',
        x: 160,
        y: 562,
        w: n().kristaMoved ? 360 : 500,
        h: 38
      },
      { screenNum: '1,1', x: 140, y: 412, w: 75, h: 342 },
      { screenNum: '1,2', x: 760, y: 212, w: 30, h: 252 },
      { screenNum: '1,2', x: 230, y: 282, w: 30, h: 152 },
      { screenNum: '1,2', x: 150, y: 282, w: 30, h: 152 },
      { screenNum: '1,1', x: 0, y: 412, w: 160, h: 75 },
      { screenNum: '1,1', x: 680, y: 0, w: 220, h: 125 },
      { screenNum: '1,2', x: 155, y: 0, w: 362, h: 65 },
      { screenNum: '1,2', x: 35, y: 500, w: 62, h: 65 },
      { screenNum: '1,2', x: 565, y: 0, w: 362, h: 65 },
      { screenNum: '1,2', x: 850, y: 12, w: 75, h: 742 },
      { screenNum: '1,2', x: 0, y: 572, w: 1475, h: 42 }
    ]
  }
  function B () {
    const b = {
      name: 'Table',
      sX: 0,
      sY: 704,
      sH: 64,
      sW: 64,
      dX: 250,
      dY: 250,
      screen: [1, 1],
      scale: 1,
      img: Z,
      show: () => {
        n().caseOpen ? ne(b, 0, 640) : ne(b)
      },
      action: () => {
        V(K, 'table')
      },
      actionName: 'Sit Down'
    }
    m.push(b)
    const L = {
      name: 'Shed',
      sX: 0,
      sY: 704,
      sH: 64,
      sW: 64,
      dX: 50,
      dY: 100,
      screen: [1, 1],
      scale: 1,
      img: Z,
      show: () => {
        ne(b)
      },
      action: () => {
        n().inventory.shedKey
          ? V(K, 'shed')
          : a(g) == 'No Key!'
          ? E(g, 'Key not equipped!')
          : E(g, 'No Key!')
      },
      actionName: 'Open Shed'
    }
    m.push(L)
    const ee = {
      name: 'Shed',
      sX: 0,
      sY: 704,
      sH: 64,
      sW: 64,
      dX: 30,
      dY: 520,
      screen: [1, 1],
      scale: 1,
      img: Z,
      show: () => {},
      action: () => {
        ie(H, ($(n).inventory.sudokuNote = !0), $(n)),
          (ee.action = void 0),
          (ee.actionName = void 0),
          E(g, 'Added 🗒️ to inventory'),
          Nt()
      },
      actionName: 'Open Chest'
    }
    m.push(ee)
    const xe = {
      name: 'Krista',
      sX: 0,
      sY: 0,
      sH: 35,
      sW: 22,
      dX: n().kristaMoved ? 700 : 520,
      dY: n().kristaMoved ? 485 : 540,
      screen: [1, 1],
      scale: 1.5,
      img: oe,
      show: () => {
        let Ne = 0
        c && (Ne = 3), ne(xe, Ne * D.sW, 0)
      },
      action: () => {
        V(K, 'krista')
      },
      actionName: 'Speak'
    }
    m.push(xe)
    const It = {
      name: 'Melissa',
      sX: 0,
      sY: 0,
      sH: 35,
      sW: 22,
      dX: 200,
      dY: 370,
      screen: [1, 2],
      scale: 1.5,
      img: oe,
      show: () => {
        ne(It, Ce[Math.round(le)] * D.sW, 35)
      },
      action: () => {
        V(K, 'melissa')
      },
      actionName: 'Speak To'
    }
    m.push(It)
    const ke = {
      name: 'Mom',
      sX: 0,
      sY: 0,
      sH: 35,
      sW: 22,
      dX: 750,
      dY: 125,
      screen: [1, 1],
      scale: 1.45,
      img: oe,
      show: () => {
        let Ne = 2
        c && (Ne = 3), ne(ke, Ne * D.sW, 70)
      },
      action: () => {
        V(K, 'momAndDad')
      },
      actionName: 'Speak To'
    }
    m.push(ke)
    const Te = {
      name: 'Dad',
      sX: 0,
      sY: 0,
      sH: 35,
      sW: 22,
      dX: 700,
      dY: 120,
      screen: [1, 1],
      scale: 1.55,
      img: oe,
      show: () => {
        let Ne = 0
        a(d) && a(d).name === 'Dad' && (Ne = 1), ne(Te, Ne * D.sW, 70)
      },
      action: () => {
        V(K, 'momAndDad')
      },
      actionName: 'Speak To'
    }
    m.push(Te)
    const Ye = {
      name: 'Shovel',
      dX: 40,
      dY: 495,
      sX: 0,
      sY: 0,
      sH: 64,
      sW: 64,
      scale: 1,
      screen: [1, 2],
      img: Q,
      show: () => {
        n().inventory.shovel ? ne(Ye) : ne(Ye, 64)
      },
      action: () => {
        Nt(),
          ie(H, ($(n).inventory.shovel = !0), $(n)),
          (Ye.actionName = void 0),
          (Ye.action = void 0)
      },
      actionName: 'Take Shovel'
    }
    n().inventory.shovel && (Ye.action = void 0), m.push(Ye)
    const gr = {
      name: 'Duck',
      dX: 870,
      dY: 495,
      sX: 0,
      sY: 64,
      sH: 32,
      sW: 32,
      scale: 1,
      screen: [1, 2],
      img: Q,
      show: () => {
        ne(gr, 64 * (u % 4))
      },
      action: () => {
        ro(), E(g, 'The duck does nothing.')
      },
      actionName: 'Yell at duck'
    }
    m.push(gr)
    const nr = {
      name: 'Fish',
      dX: 190,
      dY: 15,
      sX: 0,
      sY: 96,
      sH: 32,
      sW: 32,
      scale: 1,
      screen: [1, 2],
      img: Q,
      show: () => {
        n().inventory.redHerring || ne(nr, 64 * (u % 2))
      },
      action: () => {
        E(g, 'There appears to be something in the water.')
      },
      actionName: 'Look'
    }
    n().inventory.redHerring && (nr.action = void 0), m.push(nr)
    const Fe = {
      name: 'Rod',
      dX: 750,
      dY: 415,
      sX: 128,
      sY: 32,
      sH: 32,
      sW: 64,
      scale: 1,
      screen: [1, 2],
      img: Q,
      show: () => {
        n().inventory.rod || ne(Fe)
      },
      action: () => {
        ie(H, ($(n).inventory.rod = !0), $(n)),
          (Fe.action = void 0),
          (Fe.actionName = void 0)
      },
      actionName: 'Pick up Rod'
    }
    m.push(Fe)
  }
  function we () {
    ;(D.dX = r()[0]),
      (D.dY = r()[1]),
      (l = document.getElementById('canvas').getContext('2d')),
      G(),
      B(),
      ti(),
      window.requestAnimationFrame(fe)
  }
  function fe () {
    bt(), mt(), vr(), Or(), Zt(), _t(), I(), window.requestAnimationFrame(fe)
  }
  function ne (b, L, ee) {
    l.drawImage(
      b.img,
      L ?? b.sX,
      ee ?? b.sY,
      b.sW,
      b.sH,
      b.dX,
      b.dY,
      b.sW * b.scale,
      b.sH * b.scale
    )
  }
  function _t () {
    m.sort((b, L) =>
      b.dY + b.sH * b.scale > L.dY + L.sH * L.scale ? 1 : -1
    ).forEach(b => {
      w.toString() === b.screen.toString() && b.show()
    })
  }
  function mt () {
    D.dX < 0
      ? (D.dX = 0)
      : D.dX > o.width - D.sW * D.scale
      ? (D.dX = o.width - D.sW * D.scale)
      : D.dY < 0
      ? b()
        ? ((D.dY = o.height - D.sH * D.scale), (w = [w[0], w[1] - 1]))
        : (D.dY = 0)
      : D.dY > o.height - D.sH * D.scale &&
        (L()
          ? ((D.dY = 0), (w = [w[0], w[1] + 1]))
          : (D.dY = o.height - D.sH * D.scale)),
      (D.screen = w)
    function b () {
      return w[1] != 1
    }
    function L () {
      return w[1] != 2
    }
  }
  function Zt () {
    l.clearRect(0, 0, o.width, o.height),
      l.drawImage(ye, 0, (1 - w[1]) * o.height)
  }
  function I () {
    l.drawImage(Me, 0, (1 - w[1]) * o.height)
  }
  function bt () {
    let b = 1
    f !== 0 && p !== 0 && (b = 0.7),
      (D.dX = D.dX + f * b),
      (D.dY = D.dY + p * b)
  }
  function vr () {
    Qs() !== void 0 && ((f = 0), (p = 0), (D.dX = a(x)[0]), (D.dY = a(x)[1]))
  }
  function Or () {
    E(d, ei(25)), a(d)
  }
  function Jt () {
    f = 0
  }
  function Qt () {
    p = 0
  }
  function Ir () {
    f = -A
  }
  function Mr () {
    f = A
  }
  function Cr () {
    p = -A
  }
  function Pr () {
    p = A
  }
  function Qs (b = 0) {
    let L
    return (
      m.forEach(ee => {
        ee.name !== 'Player' &&
          ee.screen.toString() === w.toString() &&
          W.forEach(xe => {
            L === void 0 &&
              xe.screenNum === w.toString() &&
              (xe.x > D.dX + b + D.sW * D.scale - 15 ||
                D.dX > xe.x + b + xe.w - 15 ||
                xe.y > D.dY + b + D.sH * D.scale - 5 ||
                D.dY > xe.y + b + xe.h - 60 ||
                ((L = ee), (f = 0), (p = 0)))
          })
      }),
      L === void 0 && E(x, [D.dX, D.dY]),
      L
    )
  }
  function ei (b = 0) {
    let L
    return (
      m.forEach(ee => {
        ee.name !== 'Player' &&
          L === void 0 &&
          ee.screen.toString() === w.toString() &&
          ee.action !== void 0 &&
          (ee.dX > D.dX + b + D.sW * D.scale - 15 ||
            D.dX > ee.dX + b + ee.sW * ee.scale - 15 ||
            ee.dY > D.dY + b + D.sH * D.scale - 5 ||
            D.dY > ee.dY + b + ee.sH * ee.scale - 60 ||
            (L = ee))
      }),
      L
    )
  }
  function ti () {
    document.body.addEventListener('keydown', function (b) {
      ;(b.code == 'ArrowLeft' || b.code == 'KeyA') && Ir(),
        (b.code == 'ArrowRight' || b.code == 'KeyD') && Mr(),
        (b.code == 'ArrowUp' || b.code == 'KeyW') && Cr(),
        (b.code == 'ArrowDown' || b.code == 'KeyS') && Pr(),
        b.code == 'KeyL' && console.log(m),
        b.code == 'KeyI' && console.log(n()),
        b.code == 'Space' && a(d) && a(d).action && a(d).action()
    }),
      document.body.addEventListener('keyup', function (b) {
        ;(b.code == 'ArrowLeft' ||
          b.code == 'ArrowRight' ||
          b.code == 'KeyA' ||
          b.code == 'KeyD') &&
          Jt(),
          (b.code == 'ArrowUp' ||
            b.code == 'ArrowDown' ||
            b.code == 'KeyW' ||
            b.code == 'KeyS') &&
            Qt()
      })
  }
  ot(
    () => (a(S), a(x)),
    () => {
      a(S) === 'gps' &&
        (console.log(`x: ${Math.round(a(x)[0])}
        y: ${Math.round(a(x)[1])}`),
        E(O, Y().toString().padStart(3, '0')),
        E(j, z().toString().padStart(3, '0')))
    }
  ),
    pt(),
    Se()
  var mn = bo(),
    jr = q(mn),
    bn = y(jr, 2),
    ri = N(bn),
    yn = N(ri),
    ni = N(yn)
  {
    var si = b => {
      var L = no(),
        ee = y(q(L), 2),
        xe = N(ee)
      U(() => re(xe, a(g))), k(b, L)
    }
    C(ni, b => {
      a(g) !== '' && b(si)
    })
  }
  var wn = y(yn, 2),
    xn = y(N(wn), 2)
  {
    var ii = b => {
      var L = Ee(),
        ee = q(L)
      {
        var xe = ke => {
            var Te = so(),
              Ye = N(Te)
            U(() => re(Ye, (a(d), $(() => a(d).actionName)))),
              M('click', Te, () => {
                a(d).action()
              }),
              k(ke, Te)
          },
          It = ke => {
            var Te = io(),
              Ye = N(Te)
            U(() => re(Ye, `${(a(d), $(() => a(d).name) ?? '')} does nothing`)),
              k(ke, Te)
          }
        C(ee, ke => {
          a(d), $(() => a(d).actionName !== void 0) ? ke(xe) : ke(It, !1)
        })
      }
      k(b, L)
    }
    C(xn, b => {
      a(d) && b(ii)
    })
  }
  var kn = y(xn, 2)
  {
    var ai = b => {
      var L = ao()
      M('click', L, () => {
        if (
          (E(h, !0),
          setTimeout(() => {
            E(h, !1)
          }, 500),
          Math.abs(Y() - 735) < 10 &&
            Math.abs(z() - 284) < 10 &&
            !n().inventory.shedKey)
        ) {
          E(g, 'Found buried key!'),
            ie(H, ($(n).inventory.shedKey = !0), $(n)),
            Nt()
          return
        }
        a(g) === 'Shovel dug up nothing.'
          ? E(g, 'Shovel got nothing here either.')
          : E(g, 'Shovel dug up nothing.')
      }),
        k(b, L)
    }
    C(kn, b => {
      a(S) === 'shovel' && b(ai)
    })
  }
  var oi = y(kn, 2)
  {
    var li = b => {
      var L = oo()
      M('click', L, () => {
        if (
          (E(v, !0),
          setTimeout(() => {
            E(v, !1)
          }, 1e3),
          a(d) && a(d).name === 'Fish')
        ) {
          E(g, 'You caught the red herring!'),
            ie(H, ($(n).inventory.redHerring = !0), $(n)),
            E(_, !0),
            setTimeout(() => {
              E(_, !1)
            }, 4e3)
          return
        }
        a(g) === 'No fish here. :-('
          ? E(g, 'No fish around.')
          : E(g, 'No fish here. :-(')
      }),
        k(b, L)
    }
    C(oi, b => {
      a(S) === 'rod' && b(li)
    })
  }
  var Sn = y(wn, 2),
    er = y(N(Sn), 2),
    tr = y(er, 4),
    rr = y(tr, 4),
    hr = y(rr, 4),
    En = y(Sn, 2),
    ci = y(N(En), 2),
    $n = N(ci),
    ui = N($n),
    fi = y($n, 2)
  {
    var di = b => {
        var L = lo()
        k(b, L)
      },
      vi = b => {
        var L = Ee(),
          ee = q(L)
        {
          var xe = ke => {
              var Te = co()
              k(ke, Te)
            },
            It = ke => {
              var Te = Ee(),
                Ye = q(Te)
              {
                var gr = Fe => {
                    var Ne = uo(),
                      Yr = y(q(Ne), 2),
                      Lr = N(Yr)
                    U(() => re(Lr, `[${a(O) ?? ''}, ${a(j) ?? ''}]`)), k(Fe, Ne)
                  },
                  nr = Fe => {
                    var Ne = Ee(),
                      Yr = q(Ne)
                    {
                      var Lr = Rr => {
                        var ki = fo()
                        k(Rr, ki)
                      }
                      C(
                        Yr,
                        Rr => {
                          a(S) === 'rod' && Rr(Lr)
                        },
                        !0
                      )
                    }
                    k(Fe, Ne)
                  }
                C(
                  Ye,
                  Fe => {
                    a(S) === 'gps' ? Fe(gr) : Fe(nr, !1)
                  },
                  !0
                )
              }
              k(ke, Te)
            }
          C(
            ee,
            ke => {
              a(S) === 'shedKey' ? ke(xe) : ke(It, !1)
            },
            !0
          )
        }
        k(b, L)
      }
    C(fi, b => {
      a(S) === 'shovel' ? b(di) : b(vi, !1)
    })
  }
  var hi = y(En, 2),
    gi = y(N(hi), 2),
    Tn = N(gi),
    Nn = y(Tn, 2)
  {
    var pi = b => {
      var L = vo()
      M('click', L, () => E(S, 'gps')), k(b, L)
    }
    C(Nn, b => {
      n(), $(() => n().inventory.gps) && b(pi)
    })
  }
  var Dn = y(Nn, 2)
  {
    var _i = b => {
      var L = ho()
      M('click', L, () => E(S, 'shedKey')), k(b, L)
    }
    C(Dn, b => {
      n(), $(() => n().inventory.shedKey) && b(_i)
    })
  }
  var An = y(Dn, 2)
  {
    var mi = b => {
      var L = go()
      M('click', L, () => {
        E(S, '- nothing -'), V(K, 'sudokuNote')
      }),
        k(b, L)
    }
    C(An, b => {
      n(), $(() => n().inventory.sudokuNote) && b(mi)
    })
  }
  var On = y(An, 2)
  {
    var bi = b => {
      var L = po()
      M('click', L, () => {
        E(S, '- nothing -'), V(K, 'shedNote')
      }),
        k(b, L)
    }
    C(On, b => {
      n(), $(() => n().inventory.shedNote) && b(bi)
    })
  }
  var In = y(On, 2)
  {
    var yi = b => {
      var L = _o()
      M('click', L, () => {
        E(S, 'rod')
      }),
        k(b, L)
    }
    C(In, b => {
      n(), $(() => n().inventory.rod) && b(yi)
    })
  }
  var wi = y(In, 2)
  {
    var xi = b => {
      var L = mo()
      M('click', L, () => {
        E(S, 'shovel')
      }),
        k(b, L)
    }
    C(wi, b => {
      n(), $(() => n().inventory.shovel) && b(xi)
    })
  }
  U(() => {
    cr(
      jr,
      'width',
      $(() => o.width)
    ),
      cr(
        jr,
        'height',
        $(() => o.height)
      ),
      Qr(bn, `width:${$(() => o.width) ?? ''}px; height:136px`),
      re(ui, a(S))
  }),
    M('mousedown', er, Cr),
    M('mouseup', er, Qt),
    M('touchstart', er, Cr),
    M('touchend', er, Qt),
    M('mousedown', tr, Ir),
    M('mouseup', tr, Jt),
    M('touchstart', tr, Ir),
    M('touchend', tr, Jt),
    M('mousedown', rr, Mr),
    M('mouseup', rr, Jt),
    M('touchstart', rr, Mr),
    M('touchend', rr, Jt),
    M('mousedown', hr, Pr),
    M('mouseup', hr, Qt),
    M('touchstart', hr, Pr),
    M('touchend', hr, Qt),
    M('click', Tn, () => V(K, 'phone')),
    k(e, mn),
    he(),
    i()
}
var wo = T('<button class="latch svelte-zpo8sv">Open</button>'),
  xo = T('<button class="latch svelte-zpo8sv">Open</button>'),
  ko = T(
    '<button class="bg-blue-200 dark:bg-blue-900 rounded-lg p-2 my-3 ring-1 hover:ring-2 duration-200 transition-all hover:bg-blue-300">OPEN THE CASE!</button>'
  ),
  So = T(
    '<div class="container svelte-zpo8sv"><div class="top svelte-zpo8sv"></div> <div class="front svelte-zpo8sv"><div><!></div> <div class="front-top svelte-zpo8sv"></div> <div class="left svelte-zpo8sv"><input type="number" max="9" min="0"/> <input type="number" max="9" min="0"/> <input type="number" max="9" min="0"/></div> <div class="handle-box svelte-zpo8sv"><div class="handle-adjacent svelte-zpo8sv"></div> <div class="handle rounded-t-lg svelte-zpo8sv"></div> <div class="handle-adjacent svelte-zpo8sv"></div> <div class="handle rounded-t-lg svelte-zpo8sv"></div> <div class="handle-adjacent svelte-zpo8sv"></div> <div class="handle-adjacent svelte-zpo8sv"></div> <div class="handle rounded-bl-lg svelte-zpo8sv"></div> <div class="handle svelte-zpo8sv"></div> <div class="handle rounded-br-lg svelte-zpo8sv"></div> <div class="handle-adjacent svelte-zpo8sv"></div></div> <div class="right svelte-zpo8sv"><input type="number" max="9" min="0"/> <input type="number" max="9" min="0"/> <input type="number" max="9" min="0"/></div> <div><!></div></div> <div><!></div></div>'
  )
function Eo (e, t) {
  ve(t, !1)
  const r = () => ue(H, '$gameData', n),
    [n, s] = ge()
  let i = R(0),
    l = R(0),
    o = R(0),
    c = R(0),
    u = R(0),
    h = R(0),
    _ = R(!1),
    v = R(!1)
  r().caseOpen &&
    (E(_, !0), E(v, !0), E(i, 7), E(l, 3), E(o, 5), E(c, 2), E(u, 8), E(h, 4))
  function g () {
    a(i) === 7 && a(l) === 3 && a(o) === 5 ? (E(_, !0), Kn()) : Bn()
  }
  function x () {
    a(c) === 2 && a(u) === 8 && a(h) === 4 ? (E(v, !0), Kn()) : Bn()
  }
  function S () {
    r().caseOpen || Nt(), ie(H, ($(r).caseOpen = !0), $(r)), V(K, 'contents')
  }
  Se()
  var f = So(),
    p = y(N(f), 2),
    m = N(p),
    d = N(m)
  {
    var w = F => {
      var W = wo()
      M('click', W, g), k(F, W)
    }
    C(d, F => {
      a(_) || F(w)
    })
  }
  var A = y(m, 4),
    O = N(A),
    j = y(O, 2),
    Y = y(j, 2),
    z = y(A, 4),
    P = N(z),
    Z = y(P, 2),
    Q = y(Z, 2),
    oe = y(z, 2),
    ye = N(oe)
  {
    var Me = F => {
      var W = xo()
      M('click', W, x), k(F, W)
    }
    C(ye, F => {
      a(v) || F(Me)
    })
  }
  var D = y(p, 2),
    Ce = N(D)
  {
    var le = F => {
      var W = ko()
      M('click', W, S), k(F, W)
    }
    C(Ce, F => {
      a(_) && a(v) && F(le)
    })
  }
  U(() => {
    se(O, 1, `dial ${a(_) ? 'bg-green-500' : ''}`, 'svelte-zpo8sv'),
      (O.disabled = a(_)),
      se(j, 1, `dial ${a(_) ? 'bg-green-500' : ''}`, 'svelte-zpo8sv'),
      (j.disabled = a(_)),
      se(Y, 1, `dial ${a(_) ? 'bg-green-500' : ''}`, 'svelte-zpo8sv'),
      (Y.disabled = a(_)),
      se(P, 1, `dial ${a(v) ? 'bg-green-500' : ''}`, 'svelte-zpo8sv'),
      (P.disabled = a(v)),
      se(Z, 1, `dial ${a(v) ? 'bg-green-500' : ''}`, 'svelte-zpo8sv'),
      (Z.disabled = a(v)),
      se(Q, 1, `dial ${a(v) ? 'bg-green-500' : ''}`, 'svelte-zpo8sv'),
      (Q.disabled = a(v))
  }),
    Ue(
      O,
      () => a(i),
      F => E(i, F)
    ),
    Ue(
      j,
      () => a(l),
      F => E(l, F)
    ),
    Ue(
      Y,
      () => a(o),
      F => E(o, F)
    ),
    Ue(
      P,
      () => a(c),
      F => E(c, F)
    ),
    Ue(
      Z,
      () => a(u),
      F => E(u, F)
    ),
    Ue(
      Q,
      () => a(h),
      F => E(h, F)
    ),
    k(e, f),
    he(),
    s()
}
var $o = T('<div class="border border-black text-white svelte-e26p08"> </div>'),
  To = T(
    '<div class="grid grid-cols-1 col-span-4 rounded-sm svelte-e26p08"><p class="text-white text-xl"> </p> <div class="grid grid-cols-4 gap-5 text-white svelte-e26p08"></div></div>'
  ),
  No = T(
    '<button class="hover:bg-zinc-700 transition-all dark:text-black duration-200 svelte-e26p08"> </button>'
  ),
  Do = T(
    '<div class="grid grid-cols-4 gap-5 myGrid p-5 bg-white svelte-e26p08"><h2 class="dark:text-black col-span-4">Create four groups of four!</h2> <!> <!> <button class="col-span-4 shuffleButton svelte-e26p08">shuffle</button></div>'
  )
function Ao (e, t) {
  ve(t, !1)
  const r = () => ue(H, '$gameData', n),
    [n, s] = ge()
  let i = R([
      {
        msg: 'Briefcase',
        color: 'goldenrod',
        found: !1,
        members: ['Satchel', 'Bag', 'Clutch', 'Attaché']
      },
      {
        msg: 'Combination',
        color: 'green',
        found: !1,
        members: ['Fusion', 'Mix', 'Amalgamation', 'Compound']
      },
      {
        msg: 'Coordinates',
        color: 'blue',
        found: !1,
        members: ['Lat', 'Long', 'Alt', 'Depth']
      },
      {
        msg: 'Good Place to Dig',
        color: 'purple',
        found: !1,
        members: ['Sandbox', 'X', 'Mine', 'Garden']
      }
    ]),
    l = R([])
  r().connections.forEach((f, p) => {
    De(i, (a(i)[p].found = f))
  }),
    a(i).forEach(f => {
      f.found || f.members.forEach(p => a(l).push(p))
    }),
    _()
  let o = R([]),
    c = R('grey')
  function u () {
    E(i, a(i))
  }
  function h () {
    let f = !1
    return (
      a(i)
        .map((m, d) => {
          let w = !0
          return (
            a(o).forEach(A => {
              m.members.some(O => O === A) || (w = !1)
            }),
            w && ((m.found = !0), ie(H, ($(r).connections[d] = !0), $(r)), u()),
            w
          )
        })
        .some(m => m === !0) && (f = !0),
      f
    )
  }
  function _ () {
    for (let f = a(l).length - 1; f > 0; f--) {
      const p = Math.floor(Math.random() * (f + 1))
      ;(m => {
        var d = Di(m, 2)
        De(l, (a(l)[f] = d[0])), De(l, (a(l)[p] = d[1]))
      })([a(l)[p], a(l)[f]])
    }
  }
  ot(
    () => (a(o), a(l)),
    () => {
      a(o).length === 4 &&
        (h()
          ? E(
              l,
              a(l).filter(f => !a(o).some(p => p === f))
            )
          : E(c, 'red'),
        setTimeout(() => {
          E(o, []), E(c, 'grey')
        }, 500))
    }
  ),
    pt(),
    Se()
  var v = Do(),
    g = y(N(v), 2)
  _e(
    g,
    1,
    () => a(i),
    pe,
    (f, p) => {
      var m = Ee(),
        d = q(m)
      {
        var w = A => {
          var O = To(),
            j = N(O),
            Y = N(j),
            z = y(j, 2)
          _e(
            z,
            5,
            () => (a(p), $(() => a(p).members)),
            pe,
            (P, Z) => {
              var Q = $o(),
                oe = N(Q)
              U(() => re(oe, a(Z))), k(P, Q)
            }
          ),
            U(() => {
              Qr(O, `background-color: ${(a(p), $(() => a(p).color) ?? '')};`),
                re(Y, (a(p), $(() => a(p).msg)))
            }),
            k(A, O)
        }
        C(d, A => {
          a(p), $(() => a(p).found) && A(w)
        })
      }
      k(f, m)
    }
  )
  var x = y(g, 2)
  _e(
    x,
    1,
    () => a(l),
    pe,
    (f, p) => {
      var m = No(),
        d = N(m)
      U(
        w => {
          Qr(m, `background-color: ${w ?? ''};`), re(d, a(p))
        },
        [
          () => (
            a(o), a(p), a(c), $(() => (a(o).some(w => w === a(p)) ? a(c) : ''))
          )
        ]
      ),
        M('click', m, () => {
          a(o).some(w => w === a(p))
            ? E(
                o,
                a(o).filter(w => w !== a(p))
              )
            : E(o, [...a(o), a(p)])
        }),
        k(f, m)
    }
  )
  var S = y(x, 2)
  M('click', S, _), k(e, v), he(), s()
}
var Oo = T(
  '<div class="container grid grid-cols-2 svelte-126i2jt"><button><img src="./assets/case-open-temp.png" width="200px" alt="logo" class="mx-auto my-3"/></button> <button><img src="./assets/cryptex.png" width="200px" alt="logo" class="mx-auto my-3"/></button></div>'
)
function Io (e) {
  const [t, r] = ge()
  var n = Oo(),
    s = N(n),
    i = y(s, 2)
  M('click', s, () => V(K, 'switches')),
    M('click', i, () => V(K, 'cryptex')),
    k(e, n),
    r()
}
var Mo = T(
  '<div class="bg-white mx-auto border-2 border-black rounded-xl p-3"><h2 class="dark:text-black">Daily Puzzles App!</h2> <div class="grid grid-cols-2 gap-10 content-around"><button><img src="./assets/connections.png" width="100px" alt="logo" class="mx-auto my-3"/> <p class="svelte-1v0qglv">Connections</p></button> <button><img src="./assets/wordle.png" width="100px" alt="logo" class="mx-auto my-3"/> <p class="svelte-1v0qglv">Wordle</p></button> <button><img src="./assets/sudoku.png" width="100px" alt="logo" class="mx-auto my-3"/> <p class="svelte-1v0qglv">Sudoku</p></button> <button><img src="./assets/mini.png" width="100px" alt="logo" class="mx-auto my-3"/> <p class="svelte-1v0qglv">The Mini</p></button></div></div>'
)
function Co (e) {
  const [t, r] = ge()
  var n = Mo(),
    s = y(N(n), 2),
    i = N(s),
    l = y(i, 2),
    o = y(l, 2),
    c = y(o, 2)
  M('click', i, () => V(K, 'connections')),
    M('click', l, () => V(K, 'wordle')),
    M('click', o, () => V(K, 'sudoku')),
    M('click', c, () => V(K, 'mini')),
    k(e, n),
    r()
}
var Po = T('<input type="number" max="9" min="0"/>'),
  jo = T('<h2>SOLVED CORRECTLY!</h2> <div>...but why?</div>', 1),
  Yo = T(
    '<div class="grid grid-cols-9 mx-auto bg-black" style="width: 360px;"></div> <!>',
    1
  )
function Lo (e, t) {
  ve(t, !1)
  const r = () => ue(H, '$gameData', n),
    [n, s] = ge(),
    i = [
      8,
      null,
      1,
      3,
      4,
      null,
      5,
      9,
      2,
      5,
      4,
      3,
      null,
      8,
      2,
      7,
      6,
      null,
      null,
      6,
      9,
      1,
      7,
      5,
      null,
      4,
      8,
      4,
      9,
      6,
      5,
      null,
      8,
      1,
      3,
      7,
      null,
      null,
      5,
      6,
      1,
      9,
      null,
      8,
      null,
      1,
      8,
      2,
      7,
      3,
      null,
      6,
      5,
      9,
      3,
      2,
      null,
      null,
      5,
      7,
      null,
      1,
      6,
      6,
      1,
      7,
      4,
      9,
      null,
      8,
      2,
      5,
      9,
      5,
      null,
      2,
      6,
      1,
      4,
      null,
      3
    ]
  let l = R(JSON.parse(JSON.stringify(i))),
    o = R(!1)
  const c = [
    8, 7, 1, 3, 4, 6, 5, 9, 2, 5, 4, 3, 9, 8, 2, 7, 6, 1, 2, 6, 9, 1, 7, 5, 3,
    4, 8, 4, 9, 6, 5, 2, 8, 1, 3, 7, 7, 3, 5, 6, 1, 9, 2, 8, 4, 1, 8, 2, 7, 3,
    4, 6, 5, 9, 3, 2, 4, 8, 5, 7, 9, 1, 6, 6, 1, 7, 4, 9, 3, 8, 2, 5, 9, 5, 8,
    2, 6, 1, 4, 7, 3
  ]
  function u () {
    a(l).toString() === c.toString() && (console.log('SOLVED'), E(o, !0))
  }
  let h = [],
    _ = 0
  for (let f = 0; f < 9; f++) {
    h.push([])
    for (let p = 0; p < 9; p++) h[f].push(a(l)[_]), (_ += 1)
  }
  ot(
    () => (r(), a(l)),
    () => {
      r().sudoku.toString() !== ''
        ? (E(l, r().sudoku), u())
        : ie(H, ($(r).sudoku = a(l)), $(r))
    }
  ),
    pt(),
    Se()
  var v = Yo(),
    g = q(v)
  _e(
    g,
    5,
    () => i,
    pe,
    (f, p, m) => {
      var d = Po()
      U(() => {
        ;(d.disabled = (a(o), $(() => i[m] !== null || a(o)))),
          se(
            d,
            1,
            `numberBox text-xl ${
              $(() =>
                i[m] !== null ? 'bg-zinc-300' : 'bg-white dark:bg-white'
              ) ?? ''
            }
            ${
              $(() =>
                i[m] !== null ? 'font-bold' : 'text-gray-500 dark:text-gray-300'
              ) ?? ''
            }`,
            'svelte-yxikgq'
          )
      }),
        Ue(
          d,
          () => a(l)[m],
          w => De(l, (a(l)[m] = w))
        ),
        M('change', d, u),
        k(f, d)
    }
  )
  var x = y(g, 2)
  {
    var S = f => {
      var p = jo()
      k(f, p)
    }
    C(x, f => {
      a(o) && f(S)
    })
  }
  k(e, v), he(), s()
}
var Ro = T(
    '<div style="height:48px; width: 48px;" class="bg-black dark:bg-black border border-black"></div>'
  ),
  zo = T('<div class="absolute select-none text-black mx-1"> </div>'),
  Wo = T(
    '<div><!> <input style="height:48px; width: 48px;" class="text-black dark:text-black text-center border bg-white dark:bg-white border-black" type="text" maxlength="1"/></div>'
  ),
  Ho = T('<h1>Solved correctly!</h1>'),
  Fo = T(
    '<div><div class="mx-auto grid grid-cols-5 justify-center border border-black dark:border-black dark:bg-white" style="width: 15em; height: 15em;"></div> <div class="grid grid-cols-7"><div></div> <div class="col-span-2"><h2>Across</h2> <table><tbody><tr><td class="svelte-1ps453r">1.</td><td class="svelte-1ps453r">Little drink</td></tr><tr><td class="svelte-1ps453r">4.</td><td class="svelte-1ps453r">Incline plane wrapped around a wheel and axle</td></tr><tr><td class="svelte-1ps453r">6.</td><td class="svelte-1ps453r">Make a speech</td></tr><tr><td class="svelte-1ps453r">7.</td><td class="svelte-1ps453r">Old-fashioned</td></tr><tr><td class="svelte-1ps453r">8.</td><td class="svelte-1ps453r">Each</td></tr></tbody></table></div> <div></div> <div class="col-span-2"><h2>Down</h2> <table><tbody><tr><td class="svelte-1ps453r">1.</td><td class="svelte-1ps453r">Discard</td></tr><tr><td class="svelte-1ps453r">2.</td><td class="svelte-1ps453r">Real pissed</td></tr><tr><td class="svelte-1ps453r">3.</td><td class="svelte-1ps453r">Mr. Frampton, Mr. Parker, or Mr. Dinklage</td></tr><tr><td class="svelte-1ps453r">4.</td><td class="svelte-1ps453r">Grassy turf</td></tr><tr><td class="svelte-1ps453r">5.</td><td class="svelte-1ps453r">Married</td></tr></tbody></table></div></div> <!></div>'
  )
function Xo (e, t) {
  ve(t, !1)
  const r = () => ue(H, '$gameData', n),
    [n, s] = ge(),
    i = [
      '',
      'S',
      'I',
      'P',
      '',
      'S',
      'C',
      'R',
      'E',
      'W',
      'O',
      'R',
      'A',
      'T',
      'E',
      'D',
      'A',
      'T',
      'E',
      'D',
      '',
      'P',
      'E',
      'R',
      ''
    ],
    l = [
      '',
      '1',
      '2',
      '3',
      '',
      '4',
      '',
      '',
      '',
      '5',
      '6',
      '',
      '',
      '',
      '',
      '7',
      '',
      '',
      '',
      '',
      '',
      '8',
      '',
      '',
      ''
    ]
  let o = R(i.map(x => '')),
    c = R(!1)
  function u () {
    a(o)
      .map(x => x.toUpperCase())
      .toString() === i.toString() && (console.log('SOLVED'), E(c, !0))
  }
  ot(
    () => (r(), a(o)),
    () => {
      r().crossword.toString() !== ''
        ? (E(o, r().crossword), u())
        : ie(H, ($(r).crossword = a(o)), $(r))
    }
  ),
    pt(),
    Se()
  var h = Fo(),
    _ = N(h)
  _e(
    _,
    5,
    () => a(o),
    pe,
    (x, S, f) => {
      var p = Ee(),
        m = q(p)
      {
        var d = A => {
            var O = Ro()
            k(A, O)
          },
          w = A => {
            var O = Wo(),
              j = N(O)
            {
              var Y = P => {
                var Z = zo(),
                  Q = N(Z)
                U(() =>
                  re(
                    Q,
                    $(() => l[f])
                  )
                ),
                  k(P, Z)
              }
              C(j, P => {
                $(() => l[f] !== '') && P(Y)
              })
            }
            var z = y(j, 2)
            U(
              P => {
                ;(z.disabled = a(c)), cr(z, 'id', P)
              },
              [() => $(() => f.toString())]
            ),
              Ue(
                z,
                () => a(o)[f],
                P => ((a(o)[f] = P), ft(() => a(o)))
              ),
              M('input', z, P => {
                P.data !== null &&
                  document.getElementById((f + 1).toString())?.focus()
              }),
              k(A, O)
          }
        C(m, A => {
          $(() => i[f] === '') ? A(d) : A(w, !1)
        })
      }
      k(x, p)
    }
  )
  var v = y(_, 4)
  {
    var g = x => {
      var S = Ho()
      k(x, S)
    }
    C(v, x => {
      a(c) && x(g)
    })
  }
  k(e, h), he(), s()
}
var qo = T('<div> </div>'),
  Go = T('<div class="grid grid-cols-5 gap-2 svelte-7bcig0"></div>'),
  Bo = T(
    `<div class="text-gray-500 text-xs italic svelte-7bcig0">Warning: unlike real Wordle, I'm not checking the dictionary.</div>`
  ),
  Ko = T(
    '<p class="font-bold svelte-7bcig0"> </p> <h2 class="text-2xl tracking-widest svelte-7bcig0"> </h2>',
    1
  ),
  Uo = T('<button> </button>'),
  Vo = T('<button> </button>'),
  Zo = T('<button> </button>'),
  Jo = T(
    '<div class="bg-white p-4 svelte-7bcig0"><div class="max-w-md mx-auto svelte-7bcig0"><div class="grid grid-rows-6 gap-2 mb-4 svelte-7bcig0"></div> <div class="h-16 text-center svelte-7bcig0"><!></div> <div class="flex flex-col gap-2 svelte-7bcig0"><div class="flex justify-center gap-1 svelte-7bcig0"></div> <div class="flex justify-center gap-1 svelte-7bcig0"></div> <div class="flex justify-center gap-1 svelte-7bcig0"><button>ENTER</button> <!> <button class="keybox px-4 svelte-7bcig0">DEL</button></div></div></div></div>'
  )
function Qo (e, t) {
  ve(t, !0)
  const r = () => ue(H, '$gameData', n),
    [n, s] = ge()
  let i = qe([
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', '']
  ])
  const l = ['T', 'R', 'E', 'A', 'D']
  let o = Re(0),
    c = Re(qe([])),
    u = Re(!1),
    h = Re('')
  const _ = 'QWERTYUIOP'.split(''),
    v = 'ASDFGHJKL'.split(''),
    g = 'ZXCVBNM'.split('')
  let x = qe([]),
    S = qe([]),
    f = qe([])
  function p (W) {
    a(c).length === 5 ||
      r().wordleOver ||
      ((i[a(o)][a(c).length] = W.toUpperCase()), a(c).push(W.toUpperCase()))
  }
  function m () {
    a(c).length === 5 &&
      (i[a(o)].forEach((W, G) => {
        l.includes(W) ? (l[G] === W ? x.push(W) : f.push(W)) : S.push(W)
      }),
      a(c).join('') === l.join('') &&
        (ie(H, ($(r).wordleOver = !0), $(r)), E(h, 'Correct!'), E(u, !0)),
      a(o) === 5 &&
        !a(u) &&
        (ie(H, ($(r).wordleOver = !0), $(r)),
        E(h, 'You did NOT win - but that is okay! The word was:')),
      da(o),
      E(c, [], !0))
  }
  function d () {
    a(c).length !== 0 && (a(c).pop(), (i[a(o)][a(c).length] = ''))
  }
  function w (W) {
    const G = W.toUpperCase()
    return x.includes(G)
      ? 'bg-green-500'
      : f.includes(G)
      ? 'bg-yellow-500'
      : S.includes(G)
      ? 'bg-gray-500'
      : 'bg-white'
  }
  function A (W, G, B) {
    return a(o) <= W
      ? 'bg-white'
      : i[W][G] === l[G]
      ? 'bg-green-500'
      : l.includes(B)
      ? i[W].some((fe, ne) => fe === B && l[ne] === fe)
        ? 'bg-gray-500'
        : 'bg-yellow-500'
      : 'bg-gray-500'
  }
  var O = Jo(),
    j = N(O),
    Y = N(j)
  _e(
    Y,
    21,
    () => i,
    pe,
    (W, G, B) => {
      var we = Go()
      _e(
        we,
        21,
        () => a(G),
        pe,
        (fe, ne, _t) => {
          var mt = qo(),
            Zt = N(mt)
          U(
            I => {
              se(mt, 1, `letterbox ${I ?? ''}`, 'svelte-7bcig0'), re(Zt, a(ne))
            },
            [() => A(B, _t, a(ne))]
          ),
            k(fe, mt)
        }
      ),
        k(W, we)
    }
  )
  var z = y(Y, 2),
    P = N(z)
  {
    var Z = W => {
        var G = Bo()
        k(W, G)
      },
      Q = W => {
        var G = Ko(),
          B = q(G),
          we = N(B),
          fe = y(B, 2),
          ne = N(fe)
        U(
          _t => {
            re(we, a(h)), re(ne, _t)
          },
          [() => l.join('')]
        ),
          k(W, G)
      }
    C(P, W => {
      r().wordleOver ? W(Q, !1) : W(Z)
    })
  }
  var oe = y(z, 2),
    ye = N(oe)
  _e(
    ye,
    21,
    () => _,
    pe,
    (W, G) => {
      var B = Uo()
      B.__click = () => p(a(G))
      var we = N(B)
      U(
        fe => {
          se(B, 1, `keybox ${fe ?? ''}`, 'svelte-7bcig0'),
            (B.disabled = r().wordleOver),
            re(we, a(G))
        },
        [() => w(a(G))]
      ),
        k(W, B)
    }
  )
  var Me = y(ye, 2)
  _e(
    Me,
    21,
    () => v,
    pe,
    (W, G) => {
      var B = Vo()
      B.__click = () => p(a(G))
      var we = N(B)
      U(
        fe => {
          se(B, 1, `keybox ${fe ?? ''}`, 'svelte-7bcig0'),
            (B.disabled = r().wordleOver),
            re(we, a(G))
        },
        [() => w(a(G))]
      ),
        k(W, B)
    }
  )
  var D = y(Me, 2),
    Ce = N(D)
  Ce.__click = m
  var le = y(Ce, 2)
  _e(
    le,
    17,
    () => g,
    pe,
    (W, G) => {
      var B = Zo()
      B.__click = () => p(a(G))
      var we = N(B)
      U(
        fe => {
          se(B, 1, `keybox ${fe ?? ''}`, 'svelte-7bcig0'),
            (B.disabled = r().wordleOver),
            re(we, a(G))
        },
        [() => w(a(G))]
      ),
        k(W, B)
    }
  )
  var F = y(le, 2)
  ;(F.__click = d),
    U(() =>
      se(
        Ce,
        1,
        `keybox px-4 ${a(c).length !== 5 ? 'bg-gray-300' : 'bg-white'}`,
        'svelte-7bcig0'
      )
    ),
    k(e, O),
    he(),
    s()
}
Oa(['click'])
var el = T(
    '<div class="grid grid-cols-1 hover:bg-cyan-50 svelte-1ejbkfo"><button class="py-1 hover:scale-125 duration-100 svelte-1ejbkfo">👆</button> <div class="text-center text-3xl bg-white text-black svelte-1ejbkfo"> </div> <button class="py-1  hover:scale-125 duration-100 svelte-1ejbkfo">👇</button></div>'
  ),
  tl = T(
    '<img src="./assets/cryptex.png" alt="logo" class="mx-auto my-3 svelte-1ejbkfo"/> <div class="svelte-1ejbkfo"><div class="grid grid-cols-8 gap-2 svelte-1ejbkfo"><div class="svelte-1ejbkfo"></div> <!> <div class="grid justify-evenly svelte-1ejbkfo"><button style="width:40px; height: 40px;">→</button></div> <div class="svelte-1ejbkfo"></div></div></div>',
    1
  )
function rl (e, t) {
  ve(t, !1)
  const r = () => ue(H, '$gameData', n),
    [n, s] = ge(),
    i = [
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
      'U',
      'V',
      'W',
      'X',
      'Y',
      'Z'
    ],
    l = [3, 14, 10, 13, 14, 19]
  let o = R([11, 14, 2, 10, 4, 3])
  r().cryptex !== void 0 && E(o, r().cryptex)
  let c = R('')
  Zs(() => {
    ie(H, ($(r).cryptex = a(o)), $(r))
  }),
    Se()
  var u = tl(),
    h = y(q(u), 2),
    _ = N(h),
    v = y(N(_), 2)
  _e(
    v,
    1,
    () => a(o),
    pe,
    (S, f, p) => {
      var m = el(),
        d = N(m),
        w = y(d, 2),
        A = N(w),
        O = y(w, 2)
      U(() => re(A, i[a(o)[p]])),
        M('click', d, () => {
          if (a(o)[p] === 25) {
            ;(a(o)[p] = 0), ft(() => a(o))
            return
          }
          ;(a(o)[p] = a(o)[p] + 1), ft(() => a(o))
        }),
        M('click', O, () => {
          if (a(o)[p] === 0) {
            ;(a(o)[p] = 25), ft(() => a(o))
            return
          }
          ;(a(o)[p] = a(o)[p] - 1), ft(() => a(o))
        }),
        k(S, m)
    }
  )
  var g = y(v, 2),
    x = N(g)
  U(() =>
    se(
      x,
      1,
      `${
        a(c) ?? ''
      } bg-white grid my-auto duration-200 border-2 border-black rounded-lg hover:bg-cyan-200 hover:ring-2 hover:ring-cyan-500`,
      'svelte-1ejbkfo'
    )
  ),
    M('click', x, () => {
      if ((console.log(a(o).toString()), l.toString() === a(o).toString())) {
        E(c, 'bg-green-500'), ie(H, ($(r)._game_over = !0), $(r)), V(K, 'end')
        return
      }
      E(c, 'jiggle'),
        setTimeout(() => {
          E(c, '')
        }, 1e3)
    }),
    k(e, u),
    he(),
    s()
}
var nl = T(
    '<div><div class="text-3xl bg-orange-300 text-white"> </div> <img width="60px" alt="logo" class="mx-auto"/> <div class="text-3xl bg-blue-300 text-white"> </div></div>'
  ),
  sl = T(
    '<div class="group flex items-center justify-center hover-target my-3"><button class="opacity-0 duration-150 group-hover:opacity-100 hideable svelte-1oiyo4m">👈</button> <div class="text-2xl text-white"> </div> <button class="toggle mx-3 svelte-1oiyo4m"><img width="40px" alt="logo" class="mx-auto my-0"/></button> <div class="text-2xl text-white"> </div> <button class="opacity-0 duration-150 group-hover:opacity-100 hideable svelte-1oiyo4m">👉</button></div>'
  ),
  il = T('<div></div>'),
  al = T(
    '<img src="./assets/case-open-temp.png" width="200px" alt="logo" class="mx-auto my-3"/> <div class="grid grid-cols-10 my-3"></div> <div class="grid grid-cols-5 justify-center content-around"></div>',
    1
  )
function ol (e) {
  function t () {
    return { state: 'neutral' }
  }
  const r = ['N', 'P', 'C', 'H', 'L', 'M', 'O', 'Q', 'T', 'B'],
    n = ['K', 'A', 'S', 'O', 'V', 'W', 'D', 'I', 'Z', 'U']
  let s = [],
    i = R([])
  for (let v = 0; v < 8; v++) s.push(t())
  for (let v = 0; v < 10; v++) a(i).push({ number: v, isOn: !1 })
  const l = R([null, s[0], s[1], s[2], null, s[3], s[4], s[5], s[6], s[7]]),
    o = [
      {},
      { l: 'M', r: 'E' },
      { l: 'R', r: 'I' },
      { l: 'F', r: 'C' },
      {},
      { l: 'P', r: 'Z' },
      { l: 'A', r: 'S' },
      { l: 'T', r: 'B' },
      { l: 'L', r: 'W' },
      { l: 'D', r: 'O' }
    ]
  function c () {
    ;(s = s),
      E(i, a(i)),
      De(i, (a(i)[0].isOn = s[4].state === 'right' && s[0].state === 'right')),
      De(i, (a(i)[1].isOn = s[3].state === 'right')),
      De(
        i,
        (a(i)[2].isOn =
          s[4].state === 'left' &&
          s[5].state === 'left' &&
          s[7].state === 'right')
      ),
      De(i, (a(i)[3].isOn = s[3].state === 'left' && s[1].state === 'right')),
      De(
        i,
        (a(i)[4].isOn =
          s[4].state === 'left' &&
          s[5].state === 'right' &&
          s[6].state === 'left' &&
          s[2].state === 'left')
      ),
      De(
        i,
        (a(i)[5].isOn =
          s[4].state === 'left' &&
          s[5].state === 'right' &&
          s[6].state === 'right' &&
          s[2].state === 'left')
      ),
      De(i, (a(i)[6].isOn = s[3].state === 'left' && s[1].state === 'left')),
      De(
        i,
        (a(i)[7].isOn =
          s[4].state === 'left' &&
          s[5].state === 'right' &&
          s[2].state === 'right')
      ),
      De(
        i,
        (a(i)[8].isOn =
          s[4].state === 'left' &&
          s[5].state === 'left' &&
          s[7].state === 'left')
      ),
      De(i, (a(i)[9].isOn = s[4].state === 'right' && s[0].state === 'left'))
  }
  var u = al(),
    h = y(q(u), 2)
  _e(
    h,
    5,
    () => a(i),
    pe,
    (v, g) => {
      var x = nl(),
        S = N(x),
        f = N(S),
        p = y(S, 2),
        m = y(p, 2),
        d = N(m)
      U(() => {
        re(f, r[a(g).number]),
          cr(p, 'src', `./assets/${a(g).isOn ? 'on' : 'off'}.png`),
          re(d, n[a(g).number])
      }),
        k(v, x)
    }
  )
  var _ = y(h, 2)
  _e(
    _,
    5,
    () => a(l),
    pe,
    (v, g, x) => {
      var S = Ee(),
        f = q(S)
      {
        var p = d => {
            var w = sl(),
              A = N(w),
              O = y(A, 2),
              j = N(O),
              Y = y(O, 2),
              z = N(Y),
              P = y(Y, 2),
              Z = N(P),
              Q = y(P, 2)
            U(() => {
              re(j, o[x].l),
                cr(z, 'src', `./assets/${a(g).state ?? ''}.png`),
                re(Z, o[x].r)
            }),
              M('click', A, () => {
                ;(a(g).state = 'left'), ft(() => a(l)), c()
              }),
              M('click', Y, () => {
                ;(a(g).state = 'neutral'), ft(() => a(l)), c()
              }),
              M('click', Q, () => {
                ;(a(g).state = 'right'), ft(() => a(l)), c()
              }),
              k(d, w)
          },
          m = d => {
            var w = il()
            k(d, w)
          }
        C(f, d => {
          a(g) !== null ? d(p) : d(m, !1)
        })
      }
      k(v, S)
    }
  ),
    k(e, u)
}
var ll = T(
  '<div style="width:400px; height: 500px; border: solid black 1px; background-color: white; margin: auto;"><img src="./assets/sudoku-case.png" width="300px" alt="logo" class="mx-auto my-3"/></div>'
)
function cl (e) {
  var t = ll()
  k(e, t)
}
var ul = T('<div> </div>'),
  fl = T('<button class="svelte-kv3or8">Continue conversation</button>'),
  dl = T('<button class="svelte-kv3or8">Walk around</button>'),
  vl = T('<button class="svelte-kv3or8">Take GPS unit</button>'),
  hl = T('<div class="text-2xl">GPS added to inventory!</div>'),
  gl = T(
    '<div class="grid grid-cols-5"><div><h2>You</h2> <img src="./assets/me-bigger.png" width="100px" alt="logo" class="mx-auto my-3"/></div> <div class="col-span-3 conversation-holder svelte-kv3or8"></div> <div><h2>Don & Vickie</h2> <img src="./assets/parents-bigger.png" width="200px" alt="logo" class="mx-auto my-3"/></div></div> <!> <!>',
    1
  )
function pl (e, t) {
  ve(t, !1)
  const r = () => ue(H, '$gameData', n),
    [n, s] = ge()
  let i = R([
      { me: 'Hi.' },
      { dad: 'Howdy.' },
      { mom: "You look like you're looking for something." },
      { me: "I'm trying to get into a locked briefcase." },
      { dad: 'Ah, sounds like a puzzle box.' },
      { mom: 'Take our GPS, I think it will help you find a way in.' },
      { me: "I'm not sure that's how GPSes work?" },
      { mom: "Son, we've been doing this shit for years." },
      { dad: 'Besides, our fancy truck has CarPlay.' }
    ]),
    l = R(0),
    o = R([])
  function c () {
    E(l, a(l) + 1), E(o, a(i).slice(0, a(l)))
  }
  c(),
    r().inventory.gps &&
      (r().inventory.shedKey
        ? E(i, [
            { me: 'I found a key with that GPS!' },
            { mom: 'Ha! Knew it!' },
            { dad: 'You gonna give back that GPS, now?' },
            { me: 'Nope.' }
          ])
        : E(i, [
            { me: 'Thanks for the GPS.' },
            { dad: 'No problem.' },
            { me: "I'm not sure what I'm finding with it yet." },
            { mom: 'Good luck!' },
            { dad: 'Your shoe is untied.' }
          ])),
    Se()
  var u = gl(),
    h = q(u),
    _ = y(N(h), 2)
  _e(
    _,
    5,
    () => a(o),
    pe,
    (p, m) => {
      var d = ul(),
        w = N(d)
      U(
        (A, O) => {
          se(d, 1, A, 'svelte-kv3or8'), re(w, O)
        },
        [() => pn(Object.keys(a(m))[0]), () => Object.values(a(m))[0]]
      ),
        k(p, d)
    }
  )
  var v = y(h, 2)
  {
    var g = p => {
        var m = fl()
        M('click', m, c), k(p, m)
      },
      x = p => {
        var m = Ee(),
          d = q(m)
        {
          var w = O => {
              var j = dl()
              M('click', j, () => {
                V(K, 'overworld')
              }),
                k(O, j)
            },
            A = O => {
              var j = vl()
              M('click', j, () => {
                if (r().inventory.gps) return V(K, 'overworld')
                ie(H, ($(r).inventory.gps = !0), $(r)), Nt()
              }),
                k(O, j)
            }
          C(
            d,
            O => {
              r().inventory.gps ? O(w) : O(A, !1)
            },
            !0
          )
        }
        k(p, m)
      }
    C(v, p => {
      a(l) < a(i).length ? p(g) : p(x, !1)
    })
  }
  var S = y(v, 2)
  {
    var f = p => {
      var m = hl()
      k(p, m)
    }
    C(S, p => {
      r().inventory.gps && p(f)
    })
  }
  k(e, u), he(), s()
}
var _l = T(
    '<button class="svelte-o0mui9"><img src="./assets/shed-note.png" width="60px; " alt="logo" class="absolute" style="top: 175px; left: 520px; rotate: 10deg;"/></button>'
  ),
  ml = T('<div class="text-2xl mt-2">📄 Added to Inventory!</div>'),
  bl = T(
    '<div class="img-div h-full grid grid-cols-9 grid-rows-5" style="width: 600px; height: 640px;"><div style="width: 508px; height: 640px; position: relative;"><img src="./assets/shed-interior.jpeg" height="600px;" alt="logo" class="absolute myclass"/> <!></div></div> <!>',
    1
  )
function yl (e, t) {
  ve(t, !1)
  const r = () => ue(H, '$gameData', n),
    [n, s] = ge()
  Se()
  var i = bl(),
    l = q(i),
    o = N(l),
    c = y(N(o), 2)
  {
    var u = v => {
      var g = _l()
      M('click', g, () => {
        ie(H, ($(r).inventory.shedNote = !0), $(r)), Nt()
      }),
        k(v, g)
    }
    C(c, v => {
      r().inventory.shedNote === !1 && v(u)
    })
  }
  var h = y(l, 2)
  {
    var _ = v => {
      var g = ml()
      k(v, g)
    }
    C(h, v => {
      r().inventory.shedNote === !0 && v(_)
    })
  }
  k(e, i), he(), s()
}
var wl = T('<div> </div>'),
  xl = T('<button class="svelte-1ao6qd5">Walk around</button>'),
  kl = T('<button class="svelte-1ao6qd5">Continue conversation</button>'),
  Sl = T(
    '<div class="svelte-1ao6qd5"><input id="in" placeholder="Say next..." class="svelte-1ao6qd5"/></div>'
  ),
  El = T(
    '<div class="grid grid-cols-5 svelte-1ao6qd5"><div class="svelte-1ao6qd5"><h2 class="svelte-1ao6qd5">You</h2> <img src="./assets/me-bigger.png" width="100px" alt="logo"/></div> <div class="col-span-3 conversation-holder svelte-1ao6qd5"></div> <div class="svelte-1ao6qd5"><h2 class="svelte-1ao6qd5">Krista</h2> <img src="./assets/krista-bigger.png" width="100px" alt="logo"/></div></div> <!>',
    1
  )
function $l (e, t) {
  ve(t, !1)
  const r = () => ue(H, '$gameData', n),
    [n, s] = ge()
  let i = [
      { me: 'Hi.' },
      { them: 'Hey.' },
      { me: 'Can I get by you?' },
      { them: "Sorry I'm too busy to move." },
      { me: '...busy... on your phone?' },
      { them: "Yeah, I'm trying to figure out the Wordle." },
      { them: "I'm terrible at games." },
      { them: "Until I learn what the Wordle is, I'm not moving." }
    ],
    l = R(),
    o = R(i.slice(0, r().kristaIndex))
  function c () {
    ie(H, ($(r).kristaIndex = r().kristaIndex + 1), $(r)),
      E(o, i.slice(0, r().kristaIndex)),
      E(l, Object.keys(a(o)[r().kristaIndex - 1])[0])
  }
  r().kristaIndex === 0 && c(),
    r().kristaMoved &&
      E(o, [
        { me: 'Thanks for moving.' },
        { them: "Thanks for helping - I'm terrible at games." },
        { them: '...' },
        { them: 'Terrible.' }
      ])
  let u = R('')
  ot(
    () => (a(u), a(o)),
    () => {
      a(u).toUpperCase().includes('TREAD') &&
        (ie(H, ($(r).kristaMoved = !0), $(r)),
        Nt(),
        E(o, [
          ...a(o),
          { me: 'TREAD' },
          { them: "Aw nuts! That's what it is! OK I'll move." }
        ]))
    }
  ),
    pt(),
    Se()
  var h = El(),
    _ = q(h),
    v = N(_),
    g = y(N(v), 2),
    x = y(v, 2)
  _e(
    x,
    5,
    () => a(o),
    pe,
    (w, A) => {
      var O = wl(),
        j = N(O)
      U(
        (Y, z) => {
          se(O, 1, Y, 'svelte-1ao6qd5'), re(j, z)
        },
        [
          () => pn((a(A), $(() => Object.keys(a(A))[0]))),
          () => (a(A), $(() => Object.values(a(A))[0]))
        ]
      ),
        k(w, O)
    }
  )
  var S = y(x, 2),
    f = y(N(S), 2),
    p = y(_, 2)
  {
    var m = w => {
        var A = xl()
        M('click', A, () => {
          V(K, 'overworld')
        }),
          k(w, A)
      },
      d = w => {
        var A = Ee(),
          O = q(A)
        {
          var j = z => {
              var P = kl()
              M('click', P, c), k(z, P)
            },
            Y = z => {
              var P = Sl(),
                Z = N(P)
              Ue(
                Z,
                () => a(u),
                Q => E(u, Q)
              ),
                k(z, P)
            }
          C(
            O,
            z => {
              r(), $(() => r().kristaIndex < i.length) ? z(j) : z(Y, !1)
            },
            !0
          )
        }
        k(w, A)
      }
    C(p, w => {
      r(), $(() => r().kristaMoved) ? w(m) : w(d, !1)
    })
  }
  U(() => {
    se(
      g,
      1,
      `mx-auto my-3 ${a(l) === 'me' ? 'talking' : ''}`,
      'svelte-1ao6qd5'
    ),
      se(
        f,
        1,
        `mx-auto my-3 ${a(l) === 'them' ? 'talking' : ''}`,
        'svelte-1ao6qd5'
      )
  }),
    k(e, h),
    he(),
    s()
}
var Tl = T('<div> </div>'),
  Nl = T('<button class="svelte-70hij5">Continue conversation</button>'),
  Dl = T('<button class="svelte-70hij5">Walk around</button>'),
  Al = T(
    '<div class="grid grid-cols-5 svelte-70hij5"><div class="svelte-70hij5"><h2 class="svelte-70hij5">You</h2> <img src="./assets/me-bigger.png" width="100px" alt="logo"/></div> <div class="col-span-3 conversation-holder svelte-70hij5"></div> <div class="svelte-70hij5"><h2 class="svelte-70hij5">Melissa</h2> <img src="./assets/melissa-bigger.png" width="100px" alt="logo"/></div></div> <!>',
    1
  )
function Ol (e, t) {
  ve(t, !1)
  const r = () => ue(H, '$gameData', n),
    [n, s] = ge()
  let i = R(),
    l = R([
      { me: 'Hi.' },
      { them: 'Hi.' },
      { me: 'Whatcha doing?' },
      { them: 'Some light gardening.' }
    ])
  r().inventory.shedKey
    ? E(l, [
        ...a(l),
        { me: 'I found this key' },
        { them: 'Hey my key! Thanks!' },
        { them: "You can use it, if you haven't already" }
      ])
    : E(l, [
        ...a(l),
        { me: 'Can you get into that shed?' },
        { them: "I could if I hadn't lost my key" }
      ])
  let o = R(a(l).slice(0, r().melissaIndex))
  function c () {
    ie(H, ($(r).melissaIndex = r().melissaIndex + 1), $(r)),
      E(o, a(l).slice(0, r().melissaIndex)),
      E(i, Object.keys(a(o)[r().melissaIndex - 1])[0])
  }
  console.log(r().melissaIndex), r().melissaIndex == 0 && c(), Se()
  var u = Al(),
    h = q(u),
    _ = N(h),
    v = y(N(_), 2),
    g = y(_, 2)
  _e(
    g,
    5,
    () => a(o),
    pe,
    (d, w) => {
      var A = Tl(),
        O = N(A)
      U(
        (j, Y) => {
          se(A, 1, j, 'svelte-70hij5'), re(O, Y)
        },
        [() => pn(Object.keys(a(w))[0]), () => Object.values(a(w))[0]]
      ),
        k(d, A)
    }
  )
  var x = y(g, 2),
    S = y(N(x), 2),
    f = y(h, 2)
  {
    var p = d => {
        var w = Nl()
        M('click', w, c), k(d, w)
      },
      m = d => {
        var w = Dl()
        M('click', w, () => {
          V(K, 'overworld')
        }),
          k(d, w)
      }
    C(f, d => {
      r().melissaIndex < a(l).length ? d(p) : d(m, !1)
    })
  }
  U(() => {
    se(v, 1, `mx-auto my-3 ${a(i) === 'me' ? 'talking' : ''}`, 'svelte-70hij5'),
      se(
        S,
        1,
        `mx-auto my-3 ${a(i) === 'them' ? 'talking' : ''}`,
        'svelte-70hij5'
      )
  }),
    k(e, u),
    he(),
    s()
}
var Il = T(
  '<div style="width:600px; height: 600px; border: solid black 1px; background-color: white; margin: auto;"><img src="./assets/shed-note.png" alt="logo" class="mx-auto my-3 w-full"/></div>'
)
function Ml (e) {
  var t = Il()
  k(e, t)
}
var Cl = T(
    '<button class="svelte-b3v6gp">See Switches</button> <button class="svelte-b3v6gp">See Cryptex</button>',
    1
  ),
  Pl = T('<button class="svelte-b3v6gp">Look at 📄</button>'),
  jl = T(
    '<div class="grid grid-cols-1"><div style="width:900px; height:690px;" class="mx-auto ring-2 ring-black bg-zinc-600 grid content-center"><!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!> <!></div> <div class="flex gap-10 justify-center"><button class="svelte-b3v6gp">↩ Walk Around</button> <button class="svelte-b3v6gp">Look at 📱</button> <!> <!></div></div>'
  )
function Yl (e, t) {
  ve(t, !1)
  const r = () => ue(K, '$screen', s),
    n = () => ue(H, '$gameData', s),
    [s, i] = ge()
  Se()
  var l = jl(),
    o = N(l),
    c = N(o)
  {
    var u = I => {
      Eo(I, {})
    }
    C(c, I => {
      r() === 'table' && I(u)
    })
  }
  var h = y(c, 2)
  {
    var _ = I => {
      Io(I)
    }
    C(h, I => {
      r() === 'contents' && I(_)
    })
  }
  var v = y(h, 2)
  {
    var g = I => {
      ol(I)
    }
    C(v, I => {
      r() === 'switches' && I(g)
    })
  }
  var x = y(v, 2)
  {
    var S = I => {
      rl(I, {})
    }
    C(x, I => {
      r() === 'cryptex' && I(S)
    })
  }
  var f = y(x, 2)
  {
    var p = I => {
      Co(I)
    }
    C(f, I => {
      r() === 'phone' && I(p)
    })
  }
  var m = y(f, 2)
  {
    var d = I => {
      Ao(I, {})
    }
    C(m, I => {
      r() === 'connections' && I(d)
    })
  }
  var w = y(m, 2)
  {
    var A = I => {
      Lo(I, {})
    }
    C(w, I => {
      r() === 'sudoku' && I(A)
    })
  }
  var O = y(w, 2)
  {
    var j = I => {
      Xo(I, {})
    }
    C(O, I => {
      r() === 'mini' && I(j)
    })
  }
  var Y = y(O, 2)
  {
    var z = I => {
      Qo(I, {})
    }
    C(Y, I => {
      r() === 'wordle' && I(z)
    })
  }
  var P = y(Y, 2)
  {
    var Z = I => {
      cl(I)
    }
    C(P, I => {
      r() === 'sudokuNote' && I(Z)
    })
  }
  var Q = y(P, 2)
  {
    var oe = I => {
      Ml(I)
    }
    C(Q, I => {
      r() === 'shedNote' && I(oe)
    })
  }
  var ye = y(Q, 2)
  {
    var Me = I => {
      pl(I, {})
    }
    C(ye, I => {
      r() === 'momAndDad' && I(Me)
    })
  }
  var D = y(ye, 2)
  {
    var Ce = I => {
      yl(I, {})
    }
    C(D, I => {
      r() === 'shed' && I(Ce)
    })
  }
  var le = y(D, 2)
  {
    var F = I => {
      $l(I, {})
    }
    C(le, I => {
      r() === 'krista' && I(F)
    })
  }
  var W = y(le, 2)
  {
    var G = I => {
      Ol(I, {})
    }
    C(W, I => {
      r() === 'melissa' && I(G)
    })
  }
  var B = y(o, 2),
    we = N(B),
    fe = y(we, 2),
    ne = y(fe, 2)
  {
    var _t = I => {
      var bt = Cl(),
        vr = q(bt),
        Or = y(vr, 2)
      M('click', vr, () => {
        V(K, 'switches')
      }),
        M('click', Or, () => {
          V(K, 'cryptex')
        }),
        k(I, bt)
    }
    C(ne, I => {
      n().caseOpen && I(_t)
    })
  }
  var mt = y(ne, 2)
  {
    var Zt = I => {
      var bt = Pl()
      M('click', bt, () => {
        V(K, 'shedNote')
      }),
        k(I, bt)
    }
    C(mt, I => {
      n().inventory.shedNote && I(Zt)
    })
  }
  M('click', we, () => {
    V(K, 'overworld')
  }),
    M('click', fe, () => {
      V(K, 'phone')
    }),
    k(e, l),
    he(),
    i()
}
const Ll = 'gameStateDB',
  Rl = 1,
  gt = 'gameStates'
function _n () {
  return new Promise((e, t) => {
    const r = indexedDB.open(Ll, Rl)
    ;(r.onupgradeneeded = () => {
      const n = r.result
      n.objectStoreNames.contains(gt) || n.createObjectStore(gt)
    }),
      (r.onsuccess = () => e(r.result)),
      (r.onerror = () => t(r.error))
  })
}
const Un = async (e, t) => {
    const n = (await _n()).transaction(gt, 'readwrite')
    return (
      n.objectStore(gt).put(t, e),
      new Promise((i, l) => {
        ;(n.oncomplete = () => i()), (n.onerror = () => l(n.error))
      })
    )
  },
  tn = async e => {
    const s = (await _n()).transaction(gt, 'readonly').objectStore(gt).get(e)
    return new Promise((i, l) => {
      ;(s.onsuccess = () => i(s.result)), (s.onerror = () => l(s.error))
    })
  },
  zl = async e => {
    const r = (await _n()).transaction(gt, 'readwrite')
    return (
      r.objectStore(gt).delete(e),
      new Promise((n, s) => {
        ;(r.oncomplete = () => n()), (r.onerror = () => s(r.error))
      })
    )
  },
  Vn = Ar({}),
  Wl = async e => {
    const t = await tn(e)
    t
      ? (t._timer_started && (t._timer_started = new Date(t._timer_started)),
        t._completed && (t._completed = new Date(t._completed)),
        Vn.set(t))
      : Vn.set({ _team_name: '', _game_begun: !1, _game_over: !1 })
  }
var Hl = T(
    '<button class="nested-button svelte-kk8cjo">Resume Game</button> <button class="nested-button-clear svelte-kk8cjo">Remove saved game cookie from browser</button>',
    1
  ),
  Fl = T('<button class="nested-button svelte-kk8cjo">Ready to Play!</button>'),
  Xl = T(
    '<h2>This puzzle can be done entirely online!</h2> <p class="svelte-kk8cjo">You can play this puzzle without the physical box...</p> <!>',
    1
  ),
  ql = T(
    '<p class="mb-3 text-2xl svelte-kk8cjo">Watch the video above before playing.</p> <div class="flex justify-center gap-5 my-5"><input placeholder="Choose Team Name" class="p-2 rounded-md shadow-sm shadow-zinc-400 block text-xl"/> <button>Proceed</button></div>',
    1
  ),
  Gl = T(
    '<h1>BRIEF MYSTERY</h1> <section><iframe class="youtube-video svelte-kk8cjo" src="https://www.youtube.com/embed/dxelVRsx_so" title="Intro" frameborder="0" allowfullscreen=""></iframe> <!> <!></section>',
    1
  )
function Bl (e, t) {
  ve(t, !1)
  const r = () => ue(H, '$gameData', n),
    [n, s] = ge(),
    i = R(),
    l = 'briefmystery'
  let o = R(''),
    c = R(void 0),
    u = R(!1)
  Vt(async () => {
    const d = await tn(l)
    d && d._game_begun && E(u, !0)
  })
  async function h () {
    const d = await tn(l)
    d && d._game_begun
      ? (console.log('Existing save found, bypassing login.'),
        d._timer_started && (d._timer_started = new Date(d._timer_started)),
        d._timer_end && (d._timer_end = new Date(d._timer_end)),
        H.set(d),
        V(K, 'overworld'))
      : E(c, !0)
  }
  async function _ () {
    if (a(o).length < 3) return
    ie(H, ($(r)._team_name = a(o)), $(r)), ie(H, ($(r)._game_begun = !0), $(r))
    const d = new Date()
    ie(H, ($(r)._timer_started = d), $(r)),
      ie(H, ($(r)._timer_end = new Date(d.getTime() + 3600 * 1e3)), $(r)),
      V(K, 'overworld')
  }
  async function v () {
    confirm('Are you sure? This will delete all current progress.') &&
      (await zl(l), E(u, !1), E(c, !0))
  }
  ot(
    () => a(o),
    () => {
      E(
        i,
        a(o).length > 3
          ? 'hover:ring ring-green-700 cursor-pointer text-xl text-green-700 dark:text-zinc-100 bg-green-300 dark:bg-green-700'
          : 'cursor-default text-zinc-400 dark:text-zinc-700 dark:text-zinc-100 bg-zinc-300 dark:bg-zinc-900'
      )
    }
  ),
    pt(),
    Se()
  var g = Gl(),
    x = y(q(g), 2),
    S = y(N(x), 2)
  {
    var f = d => {
      var w = Xl(),
        A = y(q(w), 4)
      {
        var O = Y => {
            var z = Hl(),
              P = q(z),
              Z = y(P, 2)
            M('click', P, h), M('click', Z, v), k(Y, z)
          },
          j = Y => {
            var z = Fl()
            M('click', z, h), k(Y, z)
          }
        C(A, Y => {
          a(u) ? Y(O) : Y(j, !1)
        })
      }
      k(d, w)
    }
    C(S, d => {
      a(c) === void 0 && d(f)
    })
  }
  var p = y(S, 2)
  {
    var m = d => {
      var w = ql(),
        A = y(q(w), 2),
        O = N(A),
        j = y(O, 2)
      U(() =>
        se(
          j,
          1,
          `${a(i) ?? ''} block rounded-md p-3 transition-all`,
          'svelte-kk8cjo'
        )
      ),
        Ue(
          O,
          () => a(o),
          Y => E(o, Y)
        ),
        M('click', j, _),
        k(d, w)
    }
    C(p, d => {
      a(c) === !0 && d(m)
    })
  }
  k(e, g), he(), s()
}
var Kl = T('<div> </div>')
function Ul (e, t) {
  ve(t, !1)
  const r = () => ue(H, '$gameData', n),
    [n, s] = ge(),
    i = R(),
    l = R()
  let o = Rt(t, 'timerEndTime', 8),
    c = Rt(t, 'stopTimerOverride', 8, !1),
    u = R(new Date())
  Vt(() => {
    const v = setInterval(() => {
      if (r()._game_over || c()) {
        clearInterval(v)
        return
      }
      E(u, new Date())
    }, 1e3)
    return () => {
      clearInterval(v)
    }
  }),
    ot(
      () => (xt(o()), a(u)),
      () => {
        E(
          i,
          Math.floor((o().getTime() - a(u).getTime()) / 1e3 / 60)
            .toString()
            .padStart(2, '0')
        )
      }
    ),
    ot(
      () => (xt(o()), a(u)),
      () => {
        E(
          l,
          Math.floor(((o().getTime() - a(u).getTime()) / 1e3) % 60)
            .toString()
            .padStart(2, '0')
        )
      }
    ),
    pt(),
    Se()
  var h = Kl(),
    _ = N(h)
  U(() => {
    se(
      h,
      1,
      `text-3xl my-1 transition-all duration-200 ${
        a(l) == '00' ? 'text-red-300' : ''
      }`
    ),
      re(_, `${a(i) ?? ''}:${a(l) ?? ''}`)
  }),
    k(e, h),
    he(),
    s()
}
var Vl = T('<h2 class="my-1">Fastest Teams</h2>'),
  Zl = T('<div><div> </div> <div> </div></div>'),
  Jl = T(
    '<!> <div class="w-fit border-black border-2 mx-auto bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white col-start-2 rounded-xl px-3 py-3"><div><!></div></div>',
    1
  ),
  Ql = T('<div class="bg-red-600">You forgot to specify a gameName</div>')
function ec (e, t) {
  ve(t, !1)
  let r = Rt(t, 'gameName', 8, 'briefmystery'),
    n = Rt(t, 'surpressTitle', 8, !1),
    s = Rt(t, 'highlightTeam', 8, ''),
    i = Rt(t, 'listLimit', 8, 5)
  const l =
    'https://script.google.com/macros/s/AKfycbxEMiKvUvMsmtYTQKv57QMBxjmdNbooOwBNkD2IOoqrqEakxmCLPDFHh-s9kp2NsB6Y/exec'
  function o (x) {
    return fetch(l + '?limit=' + i() + '&game=' + encodeURIComponent(x)).then(
      S => {
        if (!S.ok) throw new Error('Network response was not ok')
        return S.json()
      }
    )
  }
  let c = o(r())
  var u = { getHighScores: o }
  Se()
  var h = Ee(),
    _ = q(h)
  {
    var v = x => {
        var S = Jl(),
          f = q(S)
        {
          var p = A => {
            var O = Vl()
            k(A, O)
          }
          C(f, A => {
            n() || A(p)
          })
        }
        var m = y(f, 2),
          d = N(m),
          w = N(d)
        Ya(
          w,
          () => c,
          A => {
            var O = Wn('Loading...')
            k(A, O)
          },
          (A, O) => {
            var j = Ee(),
              Y = q(j)
            _e(
              Y,
              1,
              () => a(O),
              pe,
              (z, P) => {
                var Z = Zl(),
                  Q = N(Z),
                  oe = N(Q),
                  ye = y(Q, 2),
                  Me = N(ye)
                U(() => {
                  se(
                    Z,
                    1,
                    `text-center shadow-yellow-300 ${
                      (a(P),
                      xt(s()),
                      $(() =>
                        a(P).team_name == s() ? 'bg-yellow-300 text-black' : ''
                      ) ?? '')
                    } flex hover:text-violet-600 hover:scale-110 transition-all duration-500 flex`
                  ),
                    se(
                      Q,
                      1,
                      `text-xl ${
                        (a(P),
                        xt(s()),
                        $(() => (a(P).team_name == s() ? 'text-black' : '')) ??
                          '')
                      } font-mono font-bold pr-2`
                    ),
                    re(oe, (a(P), $(() => a(P).duration_text))),
                    se(
                      ye,
                      1,
                      `h-8 content-center text-right ${
                        (a(P),
                        xt(s()),
                        $(() => (a(P).team_name == s() ? 'text-black' : '')) ??
                          '')
                      }`
                    ),
                    re(Me, (a(P), $(() => a(P).team_name)))
                }),
                  k(z, Z)
              }
            ),
              k(A, j)
          },
          (A, O) => {
            var j = Wn()
            U(() => re(j, (xt(a(O)), $(() => a(O).message)))), k(A, j)
          }
        ),
          k(x, S)
      },
      g = x => {
        var S = Ql()
        k(x, S)
      }
    C(_, x => {
      r() !== '' ? x(v) : x(g, !1)
    })
  }
  return k(e, h), Ua(t, 'getHighScores', o), he(u)
}
const tc = (e, t = {}) => {
  rs(t)
  let {
    colors: r = ['#FFC700', '#FF0000', '#2E3191', '#41BBC7'],
    duration: n = 3500,
    force: s = 0.5,
    particleCount: i = 150,
    particleShape: l = 'mix',
    particleSize: o = 12,
    destroyAfterDone: c = !0,
    stageHeight: u = 800,
    stageWidth: h = 1600
  } = t
  ;(function (S) {
    const f = rn('style')
    ;(f.dataset.neoconfetti = ''),
      (f.textContent =
        '@keyframes fk9XWG_y-axis{to{transform:translate3d(0,var(--stage-height),0)}}@keyframes fk9XWG_x-axis{to{transform:translate3d(var(--x-landing-point),0,0)}}@keyframes fk9XWG_rotation{50%{transform:rotate3d(var(--half-rotation),180deg)}to{transform:rotate3d(var(--rotation),360deg)}}.fk9XWG_container{width:0;height:0;z-index:1200;position:relative;overflow:visible}.fk9XWG_particle{animation:x-axis var(--duration-chaos)forwards cubic-bezier(var(--x1),var(--x2),var(--x3),var(--x4));animation-name:fk9XWG_x-axis}.fk9XWG_particle>div{animation:y-axis var(--duration-chaos)forwards cubic-bezier(var(--y1),var(--y2),var(--y3),var(--y4));width:var(--width);height:var(--height);animation-name:fk9XWG_y-axis;position:absolute;top:0;left:0}.fk9XWG_particle>div:before{height:100%;width:100%;content:"";background-color:var(--bgcolor);animation:rotation var(--rotation-duration)infinite linear;border-radius:var(--border-radius);animation-name:fk9XWG_rotation;display:block}'),
      nn(document.head, f)
  })(),
    e.classList.add('fk9XWG_container'),
    e.style.setProperty('--stage-height', u + 'px')
  let _,
    v = es(i, r),
    g = Zn(e, v)
  function x (S, f) {
    const p = ar(Ke() * (ac - 1)),
      m = l !== 'rectangles' && (l === 'circles' || oc(p)),
      d = (O, j) => S.style.setProperty(O, j + '')
    d(
      '--x-landing-point',
      Fr(mr(ts(f, 90) - 180), 0, 180, -h / 2, h / 2) + 'px'
    ),
      d('--duration-chaos', n - ar(1e3 * Ke()) + 'ms')
    const w = Ke() < nc ? Pt(Ke() * sc, 2) : 0
    d('--x1', w),
      d('--x2', -1 * w),
      d('--x3', w),
      d('--x4', Pt(mr(Fr(mr(ts(f, 90) - 180), 0, 180, -1, 1)), 4)),
      d('--y1', Pt(Ke() * Qn, 4)),
      d('--y2', Pt(Ke() * s * (Js() ? 1 : -1), 4)),
      d('--y3', Qn),
      d('--y4', Pt(ic(Fr(mr(f - 180), 0, 180, s, -s), 0), 4)),
      d('--width', (m ? o : ar(4 * Ke()) + o / 2) + 'px'),
      d('--height', (m ? o : ar(2 * Ke()) + o) + 'px')
    const A = p.toString(2).padStart(3, '0').split('')
    d(
      '--half-rotation',
      A.map(O => +O / 2 + '')
    ),
      d('--rotation', A),
      d('--rotation-duration', Pt(Ke() * (rc - Jn) + Jn) + 'ms'),
      d('--border-radius', m ? '50%' : 0)
  }
  for (const [S, f] of Object.entries(g)) x(f, v[+S].degree)
  return (
    Promise.resolve().then(
      () => (_ = setTimeout(() => c && (e.innerHTML = ''), n))
    ),
    {
      update (S) {
        rs(S)
        const f = S.particleCount ?? i,
          p = S.colors ?? r,
          m = S.stageHeight ?? u
        if (
          ((v = es(f, p)), f === i && JSON.stringify(r) !== JSON.stringify(p))
        )
          for (const [d, { color: w }] of Object.entries(v))
            g[+d].style.setProperty('--bgcolor', w)
        f !== i && ((e.innerHTML = ''), (g = Zn(e, v))),
          c && !S.destroyAfterDone && clearTimeout(_),
          e.style.setProperty('--stage-height', m + 'px'),
          (r = p),
          (n = S.duration ?? n),
          (s = S.force ?? s),
          (i = f),
          (l = S.particleShape ?? l),
          (o = S.particleSize ?? o),
          (c = S.destroyAfterDone ?? c),
          (u = m),
          (h = S.stageWidth ?? h)
      },
      destroy () {
        clearTimeout(_)
      }
    }
  )
}
function Zn (e, t = []) {
  const r = []
  for (const { color: n } of t) {
    const s = rn('div')
    ;(s.className = 'fk9XWG_particle'), s.style.setProperty('--bgcolor', n)
    const i = rn('div')
    nn(s, i), nn(e, s), r.push(s)
  }
  return r
}
const Jn = 200,
  rc = 800,
  nc = 0.1,
  sc = 0.3,
  Qn = 0.5,
  mr = Math.abs,
  Ke = Math.random,
  ar = Math.round,
  ic = Math.max,
  rn = e => document.createElement(e),
  nn = (e, t) => e.appendChild(t),
  es = (e, t) =>
    Array.from({ length: e }, (r, n) => ({
      color: t[n % t.length],
      degree: (360 * n) / e
    })),
  Pt = (e, t = 2) => ar((e + Number.EPSILON) * 10 ** t) / 10 ** t,
  Fr = (e, t, r, n, s) => ((e - t) * (s - n)) / (r - t) + n,
  ts = (e, t) => (e + t > 360 ? e + t - 360 : e + t),
  Js = () => Ke() > 0.5,
  ac = 6,
  oc = e => e !== 1 && Js(),
  sn = e => e === void 0,
  jt = (e, t) => {
    if (!sn(e) && Number.isSafeInteger(e) && e < 0)
      throw new Error(t + ' must be a positive integer')
  },
  rs = ({
    particleCount: e,
    duration: t,
    colors: r,
    particleSize: n,
    force: s,
    stageHeight: i,
    stageWidth: l,
    particleShape: o
  }) => {
    if (
      (jt(e, 'particleCount'),
      jt(t, 'duration'),
      jt(n, 'particleSize'),
      jt(s, 'force'),
      jt(i, 'stageHeight'),
      jt(l, 'stageWidth'),
      !sn(o) && !/^(mix|circles|rectangles)$/i.test(o))
    )
      throw new Error(
        'particlesShape should be either "mix" or "circles" or "rectangle"'
      )
    if (!sn(r) && !Array.isArray(r))
      throw new Error('colors must be an array of strings')
    if (s > 1) throw new Error('force must be within 0 and 1')
  }
var lc = T(
    '<button class="col-start-2 border border-blue-800 bg-blue-500 text-gray-100 p-3 rounded-md mt-3 text-xl mx-auto">Load High Scores</button>'
  ),
  cc = T('<div class="grid col-start-2  items-center"><!></div>'),
  uc = T(
    '<audio src="success-fanfare.mp3"></audio> <div></div> <div class="grid grid-cols-1 overflow-auto"><h1 class="mx-auto">MYSTERY SOLVED <i>(below)</i> !</h1> <div class="grid grid-cols-3 justify-center"><h2 class="col-span-3">- High Scores -</h2> <!></div> <div class="grid items-center"><h2>- Outro -</h2> <iframe class="youtube-video svelte-5wojgc" src="https://www.youtube.com/embed/bEWa0CASHm4" title="Brief Mystery Outro" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen=""></iframe></div> <div class="w-11/12 mx-auto grid items-center"><h2>- Game Flow -</h2> <img src="./assets/game-flow.png" alt="flowchart of the puzzle" class="game-flow svelte-5wojgc"/></div> <div class="grid items-center"><h2>- For Fun -</h2> <button class="border w-1/3 mx-auto border-blue-800 bg-blue-500 text-gray-100 p-3 rounded-md mt-3 text-xl">Explore More</button></div></div>',
    1
  )
function fc (e, t) {
  ve(t, !1)
  const r = () => ue(H, '$gameData', n),
    [n, s] = ge()
  let i = R(!1),
    l = R()
  Vt(() => {
    a(l).play(), o()
  })
  function o () {
    const m = { sheet: 'briefmystery', data: [r()._team_name, r()._duration] }
    fetch(
      'https://script.google.com/macros/s/AKfycbxEMiKvUvMsmtYTQKv57QMBxjmdNbooOwBNkD2IOoqrqEakxmCLPDFHh-s9kp2NsB6Y/exec',
      {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(m)
      }
    )
      .then(d => {
        d.ok || console.error('Failed to save high score')
      })
      .catch(d => {
        console.error('Error saving high score:', d)
      })
  }
  Se()
  var c = uc(),
    u = q(c)
  Va(
    u,
    m => E(l, m),
    () => a(l)
  )
  var h = y(u, 2)
  Wa(h, m => tc?.(m))
  var _ = y(h, 2),
    v = y(N(_), 2),
    g = y(N(v), 2)
  {
    var x = m => {
        var d = lc()
        M('click', d, () => {
          E(i, !0)
        }),
          k(m, d)
      },
      S = m => {
        var d = cc(),
          w = N(d)
        ec(w, {
          gameName: 'briefmystery',
          listLimit: 10,
          surpressTitle: !0,
          get highlightTeam () {
            return r()._team_name
          }
        }),
          k(m, d)
      }
    C(g, m => {
      a(i) ? m(S, !1) : m(x)
    })
  }
  var f = y(v, 6),
    p = y(N(f), 2)
  M('click', p, () => V(K, 'overworld')), k(e, c), he(), s()
}
var dc = T('<div class="flex my-3 justify-center"><!></div>'),
  vc = T('<div> </div>'),
  hc = T(
    '<!> <div style="height:750px; width:900px;" class="ring-1 ring-red-400 grid mx-auto m-0 text-center content-center bg-white dark:bg-zinc-800 mt-1"><!></div> <!>',
    1
  )
function gc (e, t) {
  ve(t, !1)
  const r = () => ue(K, '$screen', s),
    n = () => ue(H, '$gameData', s),
    [s, i] = ge()
  let l = R('splash')
  V(K, 'splash')
  function o () {
    return n()._game_begun ? 'main' : 'splash'
  }
  const c = 'briefmystery'
  let u = R(!1)
  Vt(async () => {
    await Wl(c), E(u, !0)
  }),
    ot(
      () => (n(), a(u), r(), Un),
      () => {
        console.log('Store Update', n()),
          a(u) &&
            n()._team_name !== '' &&
            n()._game_begun &&
            (r() === 'end' &&
              n()._game_over === !0 &&
              !n()._completed &&
              (ie(H, ($(n)._completed = new Date()), $(n)),
              ie(
                H,
                ($(n)._duration =
                  new Date().getTime() - n()._timer_started.getTime()),
                $(n)
              )),
            Un(c, n()).catch(d => console.error('Save failed', d))),
          E(l, o())
      }
    ),
    pt(),
    Se()
  var h = hc(),
    _ = q(h)
  {
    var v = d => {
      var w = dc(),
        A = N(w)
      Ul(A, {
        get stopTimerOverride () {
          return n(), $(() => n()._game_over)
        },
        get timerEndTime () {
          return n(), $(() => n()._timer_end)
        }
      }),
        k(d, w)
    }
    C(_, d => {
      a(l) === 'main' && d(v)
    })
  }
  var g = y(_, 2),
    x = N(g)
  {
    var S = d => {
        Bl(d, {})
      },
      f = d => {
        var w = Ee(),
          A = q(w)
        {
          var O = Y => {
              var z = Ee(),
                P = q(z)
              {
                var Z = oe => {
                    yo(oe, {})
                  },
                  Q = oe => {
                    var ye = Ee(),
                      Me = q(ye)
                    {
                      var D = le => {
                          fc(le, {})
                        },
                        Ce = le => {
                          var F = Ee(),
                            W = q(F)
                          {
                            var G = B => {
                              Yl(B, {})
                            }
                            C(
                              W,
                              B => {
                                r() != 'overworld' && B(G)
                              },
                              !0
                            )
                          }
                          k(le, F)
                        }
                      C(
                        Me,
                        le => {
                          r() === 'end' ? le(D) : le(Ce, !1)
                        },
                        !0
                      )
                    }
                    k(oe, ye)
                  }
                C(P, oe => {
                  r() == 'overworld' ? oe(Z) : oe(Q, !1)
                })
              }
              k(Y, z)
            },
            j = Y => {
              var z = vc(),
                P = N(z)
              U(() =>
                re(
                  P,
                  `There was an error with state. The unhandled state is ${
                    a(l) ?? ''
                  }`
                )
              ),
                k(Y, z)
            }
          C(
            A,
            Y => {
              a(l) === 'main' ? Y(O) : Y(j, !1)
            },
            !0
          )
        }
        k(d, w)
      }
    C(x, d => {
      a(l) === 'splash' ? d(S) : d(f, !1)
    })
  }
  var p = y(g, 2)
  {
    var m = d => {}
    C(p, d => {
      r() === 'splash' && d(m)
    })
  }
  k(e, h), he(), i()
}
Ma(gc, { target: document.getElementById('app') })
