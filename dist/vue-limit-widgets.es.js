import { ref as i, watch as d, onMounted as x, openBlock as v, createElementBlock as Q, Fragment as h, renderSlot as y, createCommentVNode as b, onUnmounted as U } from "vue";
const S = () => typeof chrome > "u" ? null : chrome.storage?.local ?? null, N = () => {
  if (typeof globalThis > "u")
    return null;
  try {
    const t = globalThis.localStorage;
    return !t || typeof t.getItem != "function" ? null : t;
  } catch {
    return null;
  }
}, k = async (t) => {
  const e = S();
  if (e)
    return (await e.get(t))[t] ?? null;
  const n = N();
  if (n) {
    const a = n.getItem(t);
    if (a === null)
      return null;
    try {
      return JSON.parse(a);
    } catch {
      return null;
    }
  }
  throw new Error("No supported storage backend available");
}, m = async (t, e) => {
  const n = S();
  if (n) {
    await n.set({ [t]: e });
    return;
  }
  const a = N();
  if (a) {
    a.setItem(t, JSON.stringify(e));
    return;
  }
  throw new Error("No supported storage backend available");
}, p = "n8eneere88chbpbp8766bc97", w = (t) => btoa(String.fromCodePoint(...new TextEncoder().encode(JSON.stringify(t)).map(
  (e, n) => e ^ p.codePointAt(n % p.length)
))), E = (t) => {
  try {
    const e = new Uint8Array(
      atob(t).split("").map(
        (n, a) => n.codePointAt(0) ^ p.codePointAt(a % p.length)
      )
    );
    return JSON.parse(new TextDecoder().decode(e));
  } catch (e) {
    return console.warn("Failed to decrypt data:", e.message), null;
  }
}, l = /* @__PURE__ */ new Map(), _ = async (t, e) => {
  const n = l.get(t) ?? Promise.resolve();
  let a;
  const o = new Promise((c) => {
    a = c;
  });
  l.set(t, n.then(() => o)), await n;
  try {
    return await e();
  } finally {
    a(), l.get(t) === o && l.delete(t);
  }
}, M = async (t) => {
  const e = await k(t);
  return e ? E(e) : null;
}, D = async (t, e) => {
  const n = w(e);
  return m(t, n);
}, P = async (t, e) => _(t, async () => {
  const n = Number(await M(t) ?? 0), a = Number(e), o = n <= a ? n + 1 : n;
  return await D(t, o), o;
}), I = async (t) => {
  const e = await k(t);
  return e ? E(e) : null;
}, f = async (t, e) => {
  const n = w(e);
  return m(t, n);
}, J = {
  __name: "Quota",
  props: {
    quotaName: {
      type: String,
      default: "quota"
    },
    maxQuotaName: {
      type: String,
      default: "maxQuota"
    },
    maxQuota: {
      type: Number,
      required: !0
    }
  },
  setup(t) {
    const e = t, n = i(0), a = i(0), o = i(!1), c = async (r) => {
      const u = await I(r), g = Number(u ?? e.maxQuota);
      u === null && await f(r, g), a.value = g;
    }, s = async (r) => {
      n.value = await P(r, a.value);
    };
    return d(() => e.maxQuota, async (r) => {
      const u = Number(r);
      a.value = u, await f(e.maxQuotaName, u);
    }), d(() => e.maxQuotaName, async (r) => {
      await c(r);
    }), d(() => e.quotaName, async (r) => {
      await s(r);
    }), x(async () => {
      await c(e.maxQuotaName), await s(e.quotaName), o.value = !0;
    }), (r, u) => o.value ? (v(), Q(h, { key: 0 }, [
      n.value <= a.value ? y(r.$slots, "withinQuota", { key: 0 }) : y(r.$slots, "exceededQuota", { key: 1 })
    ], 64)) : b("", !0);
  }
}, $ = async (t, e) => {
  const n = w(e);
  return m(t, n);
}, O = {
  __name: "Expiry",
  props: {
    expiry: {
      type: String,
      required: !0
    },
    expiryName: {
      type: String,
      default: "expiry"
    }
  },
  setup(t) {
    const e = t, n = i(/* @__PURE__ */ new Date()), a = i(/* @__PURE__ */ new Date()), o = i(!1);
    let c = null;
    return d(() => [e.expiry, e.expiryName], async ([s, r]) => {
      n.value = new Date(s), await $(r, s);
    }, { immediate: !0 }), x(() => {
      a.value = /* @__PURE__ */ new Date(), o.value = !0, c = setInterval(() => {
        a.value = /* @__PURE__ */ new Date();
      }, 6e4);
    }), U(() => {
      clearInterval(c);
    }), (s, r) => o.value ? (v(), Q(h, { key: 0 }, [
      a.value <= n.value ? y(s.$slots, "withinExpiry", { key: 0 }) : y(s.$slots, "exceededExpiry", { key: 1 })
    ], 64)) : b("", !0);
  }
};
export {
  O as Expiry,
  J as Quota
};
