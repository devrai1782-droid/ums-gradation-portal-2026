/*!
 * supabase-shim-ums.js — UMS Gradation ERP
 * ─────────────────────────────────────────────────────────────────
 * Ye file Supabase JS client (supabase-js CDN) ki jagah leti hai
 * for DATABASE calls (ums_gradation, ums_users, ums_app_config,
 * pw_reset_log, audit_log) — sab ab Cloudflare Worker (D1-backed)
 * ko hit karte hain.
 *
 * IMPORTANT — HYBRID SETUP (UPDATED):
 * Tumhare Worker (ums.devrai1782.workers.dev) mein Storage
 * (document uploads) ke liye abhi bhi koi route nahi hai, isliye
 * uske liye REAL Supabase (dgzdessdyrxhsbjxeahi project) use hota
 * hai — matlab: DB = Worker/D1, Storage = still Supabase.
 *
 * ✅ Online Users / row-locking / data-update notifications AB
 * Supabase Realtime pe depend NAHI karte — ye ab Worker + D1
 * polling (/presence/heartbeat, /presence/list, /presence/broadcast,
 * /presence/events) use karte hain. Isliye "Connecting..." atakne
 * ka jo bug tha (Supabase project pause/inactive hone se) wo fix
 * ho gaya — Worker routes add karne ke baad Online Users sirf
 * apne khud ke D1 pe chalega, Supabase project down ho tab bhi
 * chalta rahega.
 *
 * Storage ke liye dgzdessdyrxhsbjxeahi project abhi bhi active
 * rehna chahiye (documents upload/preview).
 *
 * SETUP (ek hi baar):
 * 1) index.html mein Supabase CDN <script> tag WAHI RAKHO (mat hatao),
 *    kyunki storage/realtime ke liye real client chahiye. Bas is
 *    shim ko uske TURANT BAAD load karo, app.js SE PEHLE:
 *      <script src="https://unpkg.com/@supabase/supabase-js@2"></script>
 *      <script src="supabase-shim-ums.js"></script>
 *      <script src="app_updated_deobfuscated.js"></script>
 * 2) Neeche WORKER_SECRET set karo (same value jo Worker ke
 *    env.WORKER_SECRET mein hai — X-UMS-Secret header ke liye).
 * ─────────────────────────────────────────────────────────────────
 */
(function () {
  "use strict";

  // ── Apna Worker URL yahan (last slash ke bina) ──
  var WORKER_URL = "https://ums.devrai1782.workers.dev";

  // ── ⚠️ YAHAN APNA WORKER_SECRET DAALO (env.WORKER_SECRET se match hona chahiye) ──
  var WORKER_SECRET = "UMS2026SECRET";

  var GRADATION_PAGE_SIZE = 1000;

  // ── Polling settings for Online Users / row-lock / data-update (replaces Supabase Realtime) ──
  var PRESENCE_POLL_MS = 6000; // har 6 sec heartbeat + refresh

  function buildQS(params) {
    var parts = [];
    Object.keys(params).forEach(function (k) {
      if (params[k] === undefined || params[k] === null) return;
      parts.push(encodeURIComponent(k) + "=" + encodeURIComponent(params[k]));
    });
    return parts.length ? "?" + parts.join("&") : "";
  }

  async function _fetchJson(path, opts) {
    opts = opts || {};
    var headers = Object.assign(
      { "Content-Type": "application/json", "X-UMS-Secret": WORKER_SECRET },
      opts.headers || {}
    );
    var res;
    try {
      res = await fetch(WORKER_URL + path, {
        method: opts.method || "GET",
        headers: headers,
        body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined
      });
    } catch (netErr) {
      return { data: null, error: { message: "Network error: " + netErr.message } };
    }
    if (res.status === 204) return { data: null, error: null };
    var text = await res.text();
    var parsed = null;
    try { parsed = text ? JSON.parse(text) : null; } catch (e) { parsed = text; }
    if (!res.ok) {
      var msg = (parsed && parsed.error) ? parsed.error : ("HTTP " + res.status);
      return { data: null, error: { message: msg, code: res.status === 401 ? "401" : undefined } };
    }
    return { data: parsed, error: null };
  }

  // ── Chainable query-builder — mimics the subset of supabase-js used in app_updated.js ──
  function makeQueryBuilder(table) {
    var state = {
      table: table,
      action: "select",
      filters: {},        // { col: val } → only "id" and "user_id" used
      likeFilters: {},    // { col: val } → ilike("field3", uid) style, unsupported server-side
      order: null,
      range: null,         // [from, to]
      isSingle: false,
      isMaybeSingle: false,
      isNeqAllId: false,   // delete().neq("id", 0)  → delete ALL
      isNotNullId: false,  // delete().not("id","is",null) → delete ALL
      payload: null,
      selectCols: null
    };

    var builder = {
      select: function (cols) { state.selectCols = cols; return builder; },
      eq: function (col, val) { state.filters[col] = val; return builder; },
      neq: function (col, val) {
        if (col === "id" && (val === 0 || val === "0")) state.isNeqAllId = true;
        return builder;
      },
      not: function (col, op, val) {
        if (col === "id" && op === "is" && val === null) state.isNotNullId = true;
        return builder;
      },
      ilike: function (col, val) { state.likeFilters[col] = val; return builder; },
      order: function (col, opts) { state.order = { col: col, ascending: !opts || opts.ascending !== false }; return builder; },
      range: function (from, to) { state.range = [from, to]; return builder; },
      limit: function (_n) { return builder; },
      single: function () { state.isSingle = true; return builder; },
      maybeSingle: function () { state.isMaybeSingle = true; return builder; },
      insert: function (payload) { state.action = "insert"; state.payload = payload; return builder; },
      update: function (payload) { state.action = "update"; state.payload = payload; return builder; },
      upsert: function (payload, opts) { state.action = "upsert"; state.payload = payload; state.upsertOpts = opts || {}; return builder; },
      delete: function () { state.action = "delete"; return builder; },
      then: function (resolve, reject) { _execute(state).then(resolve, reject); },
      catch: function (reject) { return _execute(state).catch(reject); }
    };
    return builder;
  }

  async function _execute(state) {
    var t = state.table;

    // ═══════════ ums_gradation ═══════════
    if (t === "ums_gradation") {
      if (state.action === "select") {
        // Targeted single-record lookup (ilike field3) — Worker has no filter
        // endpoint for this, so we can't support it server-side. Signal an
        // error so the caller's existing fallback (full reload) kicks in.
        if (Object.keys(state.likeFilters).length) {
          return { data: null, error: { message: "Targeted lookup not supported by Worker — use full reload fallback" } };
        }
        // Simple schema-probe pattern: select("history_log").limit(1) etc.
        if (!state.range) {
          var r0 = await _fetchJson("/gradation" + buildQS({ page: 0, pageSize: 1 }), { method: "GET" });
          if (r0.error) return r0;
          var arr0 = (r0.data && r0.data.data) || [];
          return { data: arr0, error: null };
        }
        var from = state.range[0], to = state.range[1];
        var pageSize = to - from + 1;
        var page = Math.round(from / pageSize);
        var r = await _fetchJson("/gradation" + buildQS({ page: page, pageSize: pageSize }), { method: "GET" });
        if (r.error) return r;
        return { data: (r.data && r.data.data) || [], error: null };
      }
      if (state.action === "insert") {
        var rows = Array.isArray(state.payload) ? state.payload : [state.payload];
        var results = [];
        var lastError = null;
        for (var i = 0; i < rows.length; i++) {
          var ir = await _fetchJson("/gradation", { method: "POST", body: rows[i] });
          if (ir.error) { lastError = ir.error; break; }
          results.push({ id: ir.data && ir.data.id });
        }
        if (lastError) return { data: null, error: lastError };
        if (state.isSingle) return { data: results[0] || null, error: null };
        return { data: results, error: null };
      }
      if (state.action === "update") {
        if (state.filters.id === undefined) return { data: null, error: { message: "update() needs .eq('id', ...)" } };
        return _fetchJson("/gradation/" + state.filters.id, { method: "PUT", body: state.payload });
      }
      if (state.action === "delete") {
        if (state.isNeqAllId || state.isNotNullId) {
          return _fetchJson("/gradation/all", { method: "DELETE" });
        }
        if (state.filters.id !== undefined) {
          return _fetchJson("/gradation/" + state.filters.id, { method: "DELETE" });
        }
        return { data: null, error: { message: "delete() needs .eq('id', ...) or delete-all pattern" } };
      }
    }

    // ═══════════ ums_users ═══════════
    if (t === "ums_users") {
      if (state.action === "select") {
        var ru = await _fetchJson("/users", { method: "GET" });
        if (ru.error) return ru;
        return { data: (ru.data && ru.data.data) || [], error: null };
      }
      if (state.action === "upsert") {
        return _fetchJson("/users", { method: "POST", body: state.payload });
      }
      if (state.action === "update") {
        // savePasswordToSupabase's second call: .update({password}).eq('user_id', X)
        // The Worker's /users POST upsert also works for a password-only update.
        if (state.filters.user_id === undefined) return { data: null, error: { message: "update() needs .eq('user_id', ...)" } };
        return _fetchJson("/users/" + encodeURIComponent(state.filters.user_id) + "/password", {
          method: "PUT",
          body: { password: state.payload.password }
        });
      }
      if (state.action === "delete") {
        if (state.filters.user_id === undefined) return { data: null, error: { message: "delete() needs .eq('user_id', ...)" } };
        return _fetchJson("/users/" + encodeURIComponent(state.filters.user_id), { method: "DELETE" });
      }
    }

    // ═══════════ ums_user_passwords (savePasswordToSupabase's first call) ═══════════
    if (t === "ums_user_passwords") {
      if (state.action === "upsert") {
        // Worker's PUT /users/:id/password already does BOTH the
        // ums_user_passwords upsert AND the ums_users update in one call.
        // The app calls this table first, then updates ums_users separately —
        // we just do the combined call here and let the second (ums_users
        // .update) call below be a harmless no-op-ish duplicate.
        return _fetchJson("/users/" + encodeURIComponent(state.payload.user_id) + "/password", {
          method: "PUT",
          body: { password: state.payload.password, changed_by: state.payload.changed_by }
        });
      }
    }

    // ═══════════ pw_reset_log / ums_pw_reset_log (app uses both names — same Worker table) ═══════════
    if (t === "pw_reset_log" || t === "ums_pw_reset_log") {
      if (state.action === "select") {
        var rp = await _fetchJson("/pw-reset-log", { method: "GET" });
        if (rp.error) return rp;
        return { data: (rp.data && rp.data.data) || [], error: null };
      }
      if (state.action === "insert") {
        return _fetchJson("/pw-reset-log", { method: "POST", body: state.payload });
      }
    }

    // ═══════════ audit_log ═══════════
    if (t === "audit_log") {
      if (state.action === "insert") {
        return _fetchJson("/audit-log", { method: "POST", body: state.payload });
      }
    }

    // ═══════════ ums_app_config ═══════════
    if (t === "ums_app_config") {
      if (state.action === "select") {
        if (state.filters.key !== undefined) {
          var rk = await _fetchJson("/config/" + encodeURIComponent(state.filters.key), { method: "GET" });
          if (rk.error) return rk;
          var row = { key: state.filters.key, value: rk.data && rk.data.value };
          if (state.isSingle || state.isMaybeSingle) return { data: row, error: null };
          return { data: [row], error: null };
        }
        var ra = await _fetchJson("/config", { method: "GET" });
        if (ra.error) return ra;
        return { data: (ra.data && ra.data.data) || [], error: null };
      }
      if (state.action === "upsert") {
        var key = state.payload.key;
        var value = state.payload.value;
        return _fetchJson("/config/" + encodeURIComponent(key), { method: "PUT", body: { value: value } });
      }
    }

    return { data: null, error: { message: "supabase-shim-ums: unhandled table/action → " + t + "/" + state.action } };
  }

  // ═══════════════════════════════════════════════════════════════════
  // Polling-based channel — mimics supabase-js presence + broadcast API
  // (on/subscribe/track/send/presenceState/removeChannel), backed by
  // Worker + D1 instead of Supabase Realtime. No dependency on the
  // Supabase project staying alive anymore for Online Users / row-locks.
  // ═══════════════════════════════════════════════════════════════════
  function makePollingChannel(_topic) {
    var handlers = { sync: [], join: [], leave: [], broadcast: {} };
    var pollTimer = null;
    var myKey = null, myPayload = null;
    var snapshot = {};
    var sinceTs = Date.now();
    var stopped = false;

    async function pollOnce() {
      if (stopped) return;
      if (myKey) {
        _fetchJson("/presence/heartbeat", {
          method: "POST",
          body: { key: myKey, district: myPayload && myPayload.district, onlineAt: (myPayload && myPayload.onlineAt) || new Date().toISOString() }
        }).catch(function () {});
      }
      var r = await _fetchJson("/presence/list", { method: "GET" });
      if (!stopped && !r.error && r.data) {
        var rows = (r.data && r.data.data) || r.data.rows || [];
        var next = {};
        rows.forEach(function (row) {
          var k = row.ukey || row.key;
          if (!k) return;
          next[k] = [{ user: k, district: row.district, onlineAt: row.online_at || row.onlineAt }];
        });
        Object.keys(next).forEach(function (k) {
          if (!snapshot[k]) handlers.join.forEach(function (fn) { fn({ key: k, newPresences: next[k] }); });
        });
        Object.keys(snapshot).forEach(function (k) {
          if (!next[k]) handlers.leave.forEach(function (fn) { fn({ key: k }); });
        });
        snapshot = next;
        handlers.sync.forEach(function (fn) { fn(); });
      }
      var re = await _fetchJson("/presence/events" + buildQS({ since: sinceTs }), { method: "GET" });
      if (!stopped && !re.error && re.data) {
        var events = re.data.data || [];
        events.forEach(function (ev) {
          if (ev.sender === myKey) return;
          var list = handlers.broadcast[ev.event] || [];
          var payload = ev.payload;
          if (typeof payload === "string") { try { payload = JSON.parse(payload); } catch (e) {} }
          list.forEach(function (fn) { fn({ payload: payload }); });
        });
        sinceTs = re.data.serverTime || Date.now();
      }
    }

    var api = {
      on: function (type, filter, cb) {
        if (type === "presence") {
          if (filter && filter.event === "sync") handlers.sync.push(cb);
          else if (filter && filter.event === "join") handlers.join.push(cb);
          else if (filter && filter.event === "leave") handlers.leave.push(cb);
        } else if (type === "broadcast" && filter && filter.event) {
          handlers.broadcast[filter.event] = handlers.broadcast[filter.event] || [];
          handlers.broadcast[filter.event].push(cb);
        }
        return api;
      },
      subscribe: function (cb) {
        pollOnce().then(function () {
          if (cb) cb("SUBSCRIBED");
          pollTimer = setInterval(pollOnce, PRESENCE_POLL_MS);
        });
        return api;
      },
      track: async function (payload) {
        myKey = payload.user || payload.key;
        myPayload = payload;
        return _fetchJson("/presence/heartbeat", {
          method: "POST",
          body: { key: myKey, district: payload.district, onlineAt: payload.onlineAt || new Date().toISOString() }
        });
      },
      send: async function (msg) {
        if (!msg || msg.type !== "broadcast") return;
        return _fetchJson("/presence/broadcast", {
          method: "POST",
          body: { event: msg.event, payload: JSON.stringify(msg.payload || {}), sender: myKey }
        });
      },
      presenceState: function () { return snapshot; },
      _stopPolling: function () {
        stopped = true;
        if (pollTimer) clearInterval(pollTimer);
        pollTimer = null;
        if (myKey) _fetchJson("/presence/leave", { method: "POST", body: { key: myKey } }).catch(function () {});
      }
    };
    return api;
  }

  // ── Capture the REAL supabase-js client (for Storage only) ──
  // Must run AFTER the supabase-js CDN script has set window.supabase,
  // and BEFORE we overwrite window.supabase below.
  var _RealCreateClient = (window.supabase && window.supabase.createClient)
    ? window.supabase.createClient
    : null;

  if (!_RealCreateClient) {
    console.warn("[supabase-shim-ums] Real supabase-js not found — did you keep the CDN <script> tag? Storage/Realtime (documents, online users, row-locking) will not work.");
  }

  // ── Drop-in replacement for `window.supabase.createClient(url, key)` ──
  window.supabase = {
    createClient: function (url, key) {
      var realClient = _RealCreateClient ? _RealCreateClient(url, key) : null;
      return {
        from: function (table) { return makeQueryBuilder(table); },
        storage: realClient ? realClient.storage : {
          from: function () {
            return {
              upload: async function () { return { data: null, error: { message: "Storage unavailable — real Supabase client failed to load" } }; },
              getPublicUrl: function () { return { data: { publicUrl: "" } }; }
            };
          }
        },
        // Online Users / row-locks / data-update broadcasts now run on
        // Worker+D1 polling — Supabase Realtime is no longer used for this.
        channel: function (topic) { return makePollingChannel(topic); },
        removeChannel: function (ch) { if (ch && ch._stopPolling) ch._stopPolling(); }
      };
    }
  };

  console.log("[supabase-shim-ums] Active — DB calls → Worker:", WORKER_URL, "| Storage & Realtime → Supabase (still required, keep it alive)");
})();
