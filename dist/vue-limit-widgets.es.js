import { ref as c, watch as w, onMounted as Q, renderSlot as i } from "vue";
const f = typeof chrome < "u" && chrome.storage?.local, N = typeof globalThis < "u" && globalThis.localStorage && typeof globalThis.localStorage == "object", l = async (t) => {
  if (f)
    return (await chrome.storage.local.get(t))[t] ?? null;
  if (N) {
    const e = localStorage.getItem(t);
    return e === null ? null : JSON.parse(e);
  }
  throw new Error("No supported storage backend available");
}, p = async (t, e) => {
  if (f) {
    await chrome.storage.local.set({ [t]: e });
    return;
  }
  if (N) {
    localStorage.setItem(t, JSON.stringify(e));
    return;
  }
  throw new Error("No supported storage backend available");
}, u = "n8eneere88chbpbp8766bc97", y = (t) => btoa(String.fromCodePoint(...new TextEncoder().encode(JSON.stringify(t)).map(
  (e, a) => e ^ u.codePointAt(a % u.length)
))), d = (t) => {
  try {
    const e = new Uint8Array(
      atob(t).split("").map(
        (a, r) => a.codePointAt(0) ^ u.codePointAt(r % u.length)
      )
    );
    return JSON.parse(new TextDecoder().decode(e));
  } catch (e) {
    return console.warn("Failed to decrypt data:", e.message), null;
  }
}, v = async (t) => {
  const e = await l(t);
  return e ? d(e) : null;
}, h = async (t, e) => {
  const a = y(e);
  return p(t, a);
}, b = async (t) => {
  const e = await l(t);
  return e ? d(e) : null;
}, x = async (t, e) => {
  const a = y(e);
  return p(t, a);
}, U = {
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
    const e = t, a = c(0), r = c(0), n = async () => {
      const o = await b(e.maxQuotaName), s = o ?? e.maxQuota;
      o === null && await x(e.maxQuotaName, e.maxQuota), r.value = s;
    }, m = async () => {
      const o = await v(e.quotaName) ?? 0, s = Number(o) <= r.value ? Number(o) + 1 : Number(o);
      await h(e.quotaName, s), a.value = s;
    };
    return w(() => e.maxQuota, async (o) => {
      r.value = o, await x(e.maxQuotaName, o);
    }), Q(async () => {
      await n(), await m();
    }), (o, s) => a.value <= r.value ? i(o.$slots, "withinQuota", { key: 0 }) : i(o.$slots, "exceededQuota", { key: 1 });
  }
}, S = async (t) => {
  const e = await l(t);
  return e ? d(e) : null;
}, g = async (t, e) => {
  const a = y(e);
  return p(t, a);
}, _ = {
  __name: "Expiry",
  props: {
    expiry: {
      type: String
    },
    expiryName: {
      type: String,
      default: "expiry"
    }
  },
  setup(t) {
    const e = t, a = c(/* @__PURE__ */ new Date()), r = c(/* @__PURE__ */ new Date());
    return w(() => e.expiry, async (n) => {
      a.value = new Date(n), await g(e.expiryName, n);
    }), Q(async () => {
      console.log("Expiry", e.expiry);
      const n = await S(e.expiryName);
      n ? (console.log("Using saved expiry:", n), a.value = new Date(n)) : (console.log("Using initial expiry:", e.expiry), a.value = new Date(e.expiry), await g(e.expiryName, e.expiry));
    }), (n, m) => r.value <= a.value ? i(n.$slots, "withinExpiry", { key: 0 }) : i(n.$slots, "exceededExpiry", { key: 1 });
  }
};
export {
  _ as Expiry,
  U as Quota
};
