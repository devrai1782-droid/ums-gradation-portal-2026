const _memStore = {};
const _ls = {
  get: function (_0x504e08) {
    if (_memStore[_0x504e08] !== undefined) {
      return _memStore[_0x504e08];
    }
    try {
      return localStorage.getItem(_0x504e08);
    } catch (_0x24cc24) {
      return null;
    }
  },
  set: function (_0x21be12, _0x358c01) {
    _memStore[_0x21be12] = _0x358c01;
    try {
      localStorage.setItem(_0x21be12, _0x358c01);
    } catch (_0x4a70ca) {}
  },
  remove: function (_0x329b46) {
    delete _memStore[_0x329b46];
    try {
      localStorage.removeItem(_0x329b46);
    } catch (_0x5c8034) {}
  }
};
const SUPABASE_URL = "https://dgzdessdyrxhsbjxeahi.supabase.co";
async function _uploadToSupabaseStorage(_0x5804a4, _0xc62d5e, _0x23d1f9) {
  try {
    const _0x1a256b = getSupabase();
    if (!_0x1a256b) {
      return null;
    }
    const _0x16f57e = _0xc62d5e.replace(/[^a-zA-Z0-9._-]/g, "_");
    const _0x1be55e = _0x16f57e + "_" + Date.now();
    const {
      data: _0x35ade5,
      error: _0x178fff
    } = await _0x1a256b.storage.from(_0x23d1f9).upload(_0x1be55e, _0x5804a4, {
      upsert: true,
      contentType: _0x5804a4.type || "application/octet-stream"
    });
    if (_0x178fff) {
      console.warn("Supabase Storage upload error:", _0x178fff.message);
      return null;
    }
    const {
      data: _0x42def7
    } = _0x1a256b.storage.from(_0x23d1f9).getPublicUrl(_0x1be55e);
    return _0x42def7?.publicUrl || null;
  } catch (_0x31a69a) {
    console.warn("Supabase Storage upload exception:", _0x31a69a);
    return null;
  }
}
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRnemRlc3NkeXJ4aHNianhlYWhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMTg5MzksImV4cCI6MjA4OTU5NDkzOX0.I0_-cV_OEahHu7DtDwvfY1xhPyJRWwUmqdYsSiZJqaw";
let _supabase = null;
function getSupabase() {
  if (!_supabase && typeof supabase !== "undefined" && SUPABASE_URL !== "YOUR_SUPABASE_URL") {
    _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
  }
  return _supabase;
}
async function summaryUploadDocCloud(_0x219af1, _0x2aa75a) {
  let _0x4287e0 = null;
  try {
    const _0x5db679 = _0x2aa75a;
    _0x4287e0 = await _uploadToSupabaseStorage(_0x5db679, "summary-docs/" + _0x219af1 + "_" + _0x2aa75a.name, "ums-documents");
  } catch (_0x514079) {
    console.warn("Supabase Storage summary upload error:", _0x514079);
  }
  const _0x13ffb8 = {
    office_key: _0x219af1,
    file_name: _0x2aa75a.name,
    public_url: _0x4287e0,
    uploaded_by: window.currentUser || "UNKNOWN",
    uploaded_at: new Date().toISOString(),
    local_data: null
  };
  const _0x520e2d = getSupabase();
  if (_0x520e2d && _0x4287e0) {
    try {
      await _0x520e2d.from("summary_uploads").upsert({
        office_key: _0x219af1,
        file_name: _0x2aa75a.name,
        file_path: _0x4287e0,
        public_url: _0x4287e0,
        uploaded_by: window.currentUser || "UNKNOWN",
        uploaded_at: new Date().toISOString()
      }, {
        onConflict: "office_key"
      });
    } catch (_0x562c83) {}
  }
  if (!_0x4287e0) {
    await new Promise(_0x2c7632 => {
      const _0x24781c = new FileReader();
      _0x24781c.onload = _0x4908aa => {
        _0x13ffb8.local_data = _0x4908aa.target.result;
        _0x2c7632();
      };
      _0x24781c.readAsDataURL(_0x2aa75a);
    });
  }
  if (!_0x4287e0) {
    await _saveConfigToSupabase("summary_doc_" + _0x219af1, _0x13ffb8);
  }
  return _0x4287e0 || "local:" + _0x219af1;
}
async function getUploadedDocCloud(_0x2cc4ae) {
  const _0x5e5e00 = getSupabase();
  if (!_0x5e5e00) {
    return null;
  }
  try {
    const {
      data: _0x4b3de1,
      error: _0x2b32cc
    } = await _0x5e5e00.from("ums_summary_uploads").select("*").eq("office_key", _0x2cc4ae).single();
    if (!_0x2b32cc && _0x4b3de1) {
      return _0x4b3de1;
    }
  } catch (_0x24da78) {}
  try {
    const _0x371a08 = await _fetchConfigFromSupabase("summary_doc_" + _0x2cc4ae);
    if (_0x371a08) {
      return _0x371a08;
    }
  } catch (_0x1dea1c) {}
  return null;
}
async function savePwResetLogCloud(_0x536069) {
  const _0x6bd7e2 = getSupabase();
  if (!_0x6bd7e2) {
    return;
  }
  await _0x6bd7e2.from("pw_reset_log").insert({
    user_id: _0x536069.userId,
    reset_by: _0x536069.resetBy,
    reset_at: new Date().toISOString(),
    old_pass: _0x536069.oldPass,
    new_pass: _0x536069.newPass
  });
}
async function saveAuditLogCloud(_0x3513c8, _0x574ba5) {
  const _0x381794 = getSupabase();
  if (!_0x381794) {
    return;
  }
  await _0x381794.from("audit_log").insert({
    user_id: window.currentUser || currentUser || "SYSTEM",
    action: _0x3513c8,
    detail: _0x574ba5,
    logged_at: new Date().toISOString()
  });
}
async function _ensureHistoryLogColumn() {
  const _0xd03af5 = getSupabase();
  if (!_0xd03af5) {
    return;
  }
  try {
    const {
      error: _0x438535
    } = await _0xd03af5.from("ums_gradation").select("history_log").limit(1);
    if (_0x438535 && _0x438535.message && _0x438535.message.includes("history_log")) {
      if (window.currentUser === "DPI") {
        console.warn("⚠️ history_log column missing in ums_gradation table.");
        setTimeout(() => {
          const _0x3f932b = "⚠️ Cloud Setup Required!\n\nThe Record History feature requires adding a column.\n\nAsk Admin to run:\n\nALTER TABLE ums_gradation ADD COLUMN IF NOT EXISTS history_log TEXT;\n\nThen reload the page.";
          if (window.currentUser === "DPI") {
            alert(_0x3f932b);
          }
        }, 3000);
      }
    }
  } catch (_0x40b824) {}
}
function _setLoadUI(_0x28e28c, _0x4860e7, _0x52a86d) {
  const _0x1e8561 = document.getElementById("dataLoadBar");
  const _0x24609c = document.getElementById("dataLoadPct");
  const _0x524cdd = document.getElementById("dataLoadMsg");
  const _0x13dfd4 = document.getElementById("dataLoadCount");
  if (_0x1e8561) {
    _0x1e8561.style.width = _0x28e28c + "%";
  }
  if (_0x24609c) {
    _0x24609c.textContent = Math.round(_0x28e28c) + "%";
  }
  if (_0x4860e7 && _0x524cdd) {
    _0x524cdd.textContent = _0x4860e7;
  }
  if (_0x13dfd4 && _0x52a86d !== undefined) {
    _0x13dfd4.textContent = _0x52a86d;
  }
}
async function loadDataFromSupabase() {
  const _0x3ecd46 = getSupabase();
  if (!_0x3ecd46) {
    return false;
  }
  const _0x39d729 = document.getElementById("dataLoadingOverlay");
  if (_0x39d729) {
    _0x39d729.style.display = "flex";
  }
  _setLoadUI(5, "Cloud से कनेक्ट हो रहे हैं...", "");
  await new Promise(_0x210d1b => setTimeout(_0x210d1b, 40));
  try {
    const _0x10ea75 = 1000;
    let _0x5a75bf = [];
    let _0x45c0f3 = 0;
    let _0x2db5df = 0;
    _setLoadUI(10, "रिकॉर्ड्स डाउनलोड हो रहे हैं...", "");
    await new Promise(_0x56819b => setTimeout(_0x56819b, 30));
    while (true) {
      const {
        data: _0xc1d572,
        error: _0x484fd5
      } = await _0x3ecd46.from("ums_gradation").select("*").order("id", {
        ascending: true
      }).range(_0x45c0f3, _0x45c0f3 + _0x10ea75 - 1);
      if (_0x484fd5) {
        if (_0x174320) {
          _0x174320.style.display = "none";
        }
        console.warn("Supabase load error:", _0x484fd5);
        return false;
      }
      if (!_0xc1d572 || _0xc1d572.length === 0) {
        break;
      }
      _0x5a75bf = _0x5a75bf.concat(_0xc1d572);
      _0x2db5df++;
      const _0x4905c4 = Math.min(10 + _0x2db5df * 25, 60);
      _setLoadUI(_0x4905c4, "डेटा लोड हो रहा है...", _0x5a75bf.length + " रिकॉर्ड्स मिले");
      await new Promise(_0xed0545 => setTimeout(_0xed0545, 20));
      if (_0xc1d572.length < _0x10ea75) {
        break;
      }
      _0x45c0f3 += _0x10ea75;
    }
    if (_0x5a75bf.length === 0) {
      const _0x1c1a26 = document.getElementById("dataLoadingOverlay");
      if (_0x1c1a26) {
        _0x1c1a26.style.display = "none";
      }
      console.warn("Supabase returned empty data — keeping local data");
      return false;
    }
    _setLoadUI(62, "डेटा प्रोसेस हो रहा है...", "कुल " + _0x5a75bf.length + " रिकॉर्ड्स");
    await new Promise(_0x3712eb => setTimeout(_0x3712eb, 30));
    window.fullData = _0x5a75bf.map(_0x9abbdd => {
      const _0x1df68b = {};
      for (let _0x503f7a = 1; _0x503f7a <= 32; _0x503f7a++) {
        _0x1df68b["field" + _0x503f7a] = _0x9abbdd["field" + _0x503f7a] || "";
      }
      _0x1df68b._sbId = _0x9abbdd.id;
      var _0x1f7646 = (_0x1df68b.field25 || "").toString().trim().toUpperCase();
      if (_0x1f7646 === "YES") {
        _0x1df68b.field25 = "YES";
      } else {
        _0x1df68b.field25 = "NO";
      }
      if (_0x9abbdd.changed_fields) {
        try {
          var _0x2d49da = JSON.parse(_0x9abbdd.changed_fields);
          [29, 30, 31].forEach(function (_0x1a8017) {
            delete _0x2d49da[_0x1a8017];
            delete _0x2d49da[String(_0x1a8017)];
          });
          [23, 27].forEach(function (_0x5b6af9) {
            var _0x4adedf = String(_0x5b6af9);
            var _0x2ba3c5 = _0x2d49da[_0x5b6af9] || _0x2d49da[_0x4adedf];
            if (_0x2ba3c5) {
              var _0xb5c834 = (_0x2ba3c5.from || "").toUpperCase().replace(/^DEO\s+/, "").replace(/^JD\s+/, "").trim();
              var _0x1db997 = (_0x2ba3c5.to || "").toUpperCase().replace(/^DEO\s+/, "").replace(/^JD\s+/, "").trim();
              if (_0xb5c834 === _0x1db997) {
                delete _0x2d49da[_0x5b6af9];
                delete _0x2d49da[_0x4adedf];
              }
            }
          });
          var _0x477c8f = [6, 13, 15, 16, 17, 18, 19];
          function _0x5e1e31(_0x1f1abe) {
            if (!_0x1f1abe) {
              return "";
            }
            _0x1f1abe = String(_0x1f1abe).trim();
            if (!_0x1f1abe || _0x1f1abe === "NIL" || _0x1f1abe === "NIL/NIL/NIL" || _0x1f1abe === "0" || _0x1f1abe === "NO") {
              return "";
            }
            if (/^\d{4}-\d{2}-\d{2}$/.test(_0x1f1abe)) {
              return _0x1f1abe;
            }
            var _0x251c43 = _0x1f1abe.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
            if (_0x251c43) {
              return _0x251c43[3] + "-" + _0x251c43[2].padStart(2, "0") + "-" + _0x251c43[1].padStart(2, "0");
            }
            return _0x1f1abe;
          }
          _0x477c8f.forEach(function (_0x80f033) {
            var _0xeda505 = String(_0x80f033);
            var _0x4bfe3d = _0x2d49da[_0x80f033] || _0x2d49da[_0xeda505];
            if (_0x4bfe3d) {
              if (_0x5e1e31(_0x4bfe3d.from) === _0x5e1e31(_0x4bfe3d.to)) {
                delete _0x2d49da[_0x80f033];
                delete _0x2d49da[_0xeda505];
              }
            }
          });
          if (Object.keys(_0x2d49da).length > 0) {
            _0x1df68b._changedFields = _0x2d49da;
          }
        } catch (_0x2470bf) {}
      }
      if (_0x9abbdd.history_log) {
        try {
          _0x1df68b.history_log = JSON.parse(_0x9abbdd.history_log);
        } catch (_0x4ad31d) {}
      }
      var _0x5ba8bf = (_0x1df68b.field3 || "").trim().toUpperCase();
      if (_0x9abbdd.doc_url) {
        _0x1df68b._doc = {
          name: _0x1df68b.field32 || _0x9abbdd.doc_url.split("/").pop(),
          url: _0x9abbdd.doc_url,
          uploader: ""
        };
      }
      if (_0x9abbdd.transfer_doc_url) {
        _0x1df68b._transferDoc = {
          name: _0x9abbdd.transfer_doc_url.split("/").pop().replace(/^td_[^_]+_/, ""),
          url: _0x9abbdd.transfer_doc_url,
          uploader: ""
        };
      }
      if (_0x5ba8bf) {
        try {
          if (!_0x1df68b._doc) {
            var _0x10eab1 = _ls.get("ums_docmeta_" + _0x5ba8bf);
            var _0x4f1582 = _ls.get("ums_docdata_" + _0x5ba8bf);
            if (!_0x10eab1) {
              var _0x614196 = _ls.get("ums_doc_" + _0x5ba8bf);
              if (_0x614196) {
                var _0x2d8a8f = JSON.parse(_0x614196);
                _0x10eab1 = JSON.stringify({
                  name: _0x2d8a8f.name,
                  uploader: _0x2d8a8f.uploader || ""
                });
                _0x4f1582 = _0x2d8a8f.data || "";
              }
            }
            if (_0x10eab1) {
              var _0x503d7d = JSON.parse(_0x10eab1);
              _0x1df68b._doc = {
                name: _0x503d7d.name,
                uploader: _0x503d7d.uploader || "",
                data: _0x4f1582 || ""
              };
            }
          }
        } catch (_0x43055d) {}
        try {
          if (!_0x1df68b._transferDoc) {
            var _0x1444cd = _ls.get("ums_tdmeta_" + _0x5ba8bf);
            var _0x379f0b = _ls.get("ums_tddata_" + _0x5ba8bf);
            if (_0x1444cd) {
              var _0x1b4cb8 = JSON.parse(_0x1444cd);
              _0x1df68b._transferDoc = {
                name: _0x1b4cb8.name,
                uploader: _0x1b4cb8.uploader || "",
                data: _0x379f0b || ""
              };
            }
          }
        } catch (_0x261386) {}
      }
      return _0x1df68b;
    });
    _setLoadUI(75, "ग्रेडेशन नंबर से क्रमबद्ध हो रहा है...", "");
    await new Promise(_0x1aaecf => setTimeout(_0x1aaecf, 30));
    window.fullData.sort((_0x3efc64, _0x474cf5) => {
      const _0x3ef6d6 = parseInt(_0x3efc64.field2, 10) || 0;
      const _0x309ccc = parseInt(_0x474cf5.field2, 10) || 0;
      if (_0x3ef6d6 === 0 && _0x309ccc === 0) {
        return 0;
      }
      if (_0x3ef6d6 === 0) {
        return 1;
      }
      if (_0x309ccc === 0) {
        return -1;
      }
      return _0x3ef6d6 - _0x309ccc;
    });
    {
      window.fullData.forEach(_0x77ca82 => {
        if (!_0x77ca82.field2 || _0x77ca82.field2.trim() === "") {
          _0x77ca82.field2 = "NEW ENTRY";
        }
      });
    }
    _setLoadUI(90, "टेबल तैयार हो रहा है...", window.fullData.length + " रिकॉर्ड्स लोड हुए");
    await new Promise(_0x452333 => setTimeout(_0x452333, 50));
    window.filteredData = [...window.fullData];
    _setLoadUI(100, "✅ डेटा सफलतापूर्वक लोड हुआ!", "कुल " + window.fullData.length + " रिकॉर्ड्स");
    await new Promise(_0x1e6a71 => setTimeout(_0x1e6a71, 600));
    const _0x174320 = document.getElementById("dataLoadingOverlay");
    if (_0x174320) {
      _0x174320.style.display = "none";
    }
    console.log("✅ Supabase se " + window.fullData.length + " rows load hui");
    return true;
  } catch (_0x218c8e) {
    const _0x5f250a = document.getElementById("dataLoadingOverlay");
    if (_0x5f250a) {
      _0x5f250a.style.display = "none";
    }
    console.warn("Supabase exception:", _0x218c8e);
    return false;
  }
}
async function saveRecordToSupabase(_0x50aaa4) {
  const _0x3a358a = getSupabase();
  if (!_0x3a358a) {
    return false;
  }
  const _0x45db8c = {};
  for (let _0x387096 = 1; _0x387096 <= 32; _0x387096++) {
    _0x45db8c["field" + _0x387096] = _0x50aaa4["field" + _0x387096] || "";
  }
  _0x45db8c.changed_fields = _0x50aaa4._changedFields ? JSON.stringify(_0x50aaa4._changedFields) : null;
  _0x45db8c.history_log = _0x50aaa4.history_log && _0x50aaa4.history_log.length ? JSON.stringify(_0x50aaa4.history_log) : null;
  _0x45db8c.doc_url = _0x50aaa4._doc ? _0x50aaa4._doc.url || "" : "";
  _0x45db8c.transfer_doc_url = _0x50aaa4._transferDoc ? _0x50aaa4._transferDoc.url || "" : "";
  if (_0x50aaa4._sbId) {
    const {
      error: _0x440ffb
    } = await _0x3a358a.from("ums_gradation").update(_0x45db8c).eq("id", _0x50aaa4._sbId);
    if (_0x440ffb) {
      console.error("Supabase update error:", _0x440ffb);
    }
    return !_0x440ffb;
  } else {
    const {
      data: _0x24ef02,
      error: _0xe611e0
    } = await _0x3a358a.from("ums_gradation").insert(_0x45db8c).select().single();
    if (!_0xe611e0 && _0x24ef02) {
      _0x50aaa4._sbId = _0x24ef02.id;
    }
    if (_0xe611e0) {
      console.error("Supabase insert error:", _0xe611e0);
    }
    return !_0xe611e0;
  }
}
async function deleteRecordFromSupabase(_0x32d958) {
  const _0x2ebe8c = getSupabase();
  if (!_0x2ebe8c || !_0x32d958._sbId) {
    return false;
  }
  const {
    error: _0x5bd602
  } = await _0x2ebe8c.from("ums_gradation").delete().eq("id", _0x32d958._sbId);
  return !_0x5bd602;
}
function showSupabaseStatus(_0x3075e7) {
  const _0x1144e7 = document.getElementById("onlineStatusBar");
  if (!_0x1144e7) {
    return;
  }
  const _0x1fa64f = document.getElementById("sbStatusBadge");
  if (_0x1fa64f) {
    _0x1fa64f.remove();
  }
  const _0x7512 = document.createElement("span");
  _0x7512.id = "sbStatusBadge";
  _0x7512.style.cssText = "background:" + (_0x3075e7 ? "#dcfce7" : "#fee2e2") + ";border:1px solid " + (_0x3075e7 ? "#86efac" : "#fca5a5") + ";padding:2px 10px;border-radius:20px;font-size:11px;font-weight:700;color:" + (_0x3075e7 ? "#166534" : "#991b1b") + ";";
  _0x7512.textContent = _0x3075e7 ? "☁️ Cloud Connected" : "⚠️ Offline Mode";
  _0x1144e7.appendChild(_0x7512);
}
function openUserManual() {
  var _0x135925 = document.getElementById("userManualModal");
  _0x135925.style.display = "flex";
  _0x135925.style.animation = "ums-fadeIn 0.25s ease forwards";
  umTab(0);
}
function closeUserManual() {
  var _0x120131 = document.getElementById("userManualModal");
  _0x120131.style.display = "none";
}
function umTab(_0x3d8bd2) {
  var _0x21bc0e = document.querySelectorAll(".um-pane");
  var _0x443116 = document.querySelectorAll(".um-tab");
  _0x21bc0e.forEach(function (_0x139a73, _0x1fa9ec) {
    _0x139a73.style.display = _0x1fa9ec === _0x3d8bd2 ? "block" : "none";
  });
  _0x443116.forEach(function (_0x587cba, _0x43adcc) {
    _0x587cba.style.color = _0x43adcc === _0x3d8bd2 ? "#1a237e" : "#64748b";
    _0x587cba.style.borderBottom = _0x43adcc === _0x3d8bd2 ? "3px solid #3b82f6" : "3px solid transparent";
    _0x587cba.style.fontWeight = _0x43adcc === _0x3d8bd2 ? "700" : "600";
    _0x587cba.style.background = _0x43adcc === _0x3d8bd2 ? "white" : "none";
  });
}
document.getElementById("userManualModal").addEventListener("click", function (_0x4a15be) {
  if (_0x4a15be.target === this) {
    closeUserManual();
  }
});
const districtCredentials = {
  DPI: "5021",
  JDBHOPAL: "4821",
  JDGWALIOR: "9304",
  JDINDORE: "2158",
  JDJABALPUR: "7739",
  JDREWA: "6042",
  JDSAGAR: "1185",
  JDUJJAIN: "3391",
  JDSHAHDOL: "8520",
  JDNARMADAPURAM: "5567",
  DEOAGARMALWA: "1094",
  DEOALIRAJPUR: "3382",
  DEOANUPPUR: "8273",
  DEOASHOKNAGAR: "4412",
  DEOBALAGHAT: "5039",
  DEOBARWANI: "2281",
  DEOBETUL: "6645",
  DEOBHIND: "3190",
  DEOBHOPAL: "1782",
  DEOBURHANPUR: "9023",
  DEOCHHATARPUR: "7741",
  DEOCHHINDWARA: "1150",
  DEODAMOH: "4932",
  DEODATIA: "3368",
  DEODEWAS: "8120",
  DEODHAR: "2947",
  DEODINDORI: "6051",
  DEOGUNA: "4819",
  DEOGWALIOR: "7234",
  DEOHARDA: "5512",
  DEOINDORE: "9938",
  DEOJABALPUR: "1029",
  DEOJHABUA: "3384",
  DEOKATNI: "6721",
  DEOKHANDWA: "4490",
  DEOKHARGONE: "2105",
  DEOMAIHAR: "1234",
  DEOMANDLA: "8832",
  DEOMANDSAUR: "5561",
  DEOMAUGANJ: "1234",
  DEOMORENA: "7710",
  DEONARMADAPURAM: "2034",
  DEONARSINGHPUR: "9912",
  DEONEEMUCH: "4420",
  DEONIWARI: "3185",
  DEOPANDHURNA: "1234",
  DEOPANNA: "6629",
  DEORAISEN: "8843",
  DEORAJGARH: "1190",
  DEORATLAM: "5023",
  DEOREWA: "7731",
  DEOSAGAR: "4492",
  DEOSATNA: "2184",
  DEOSEHORE: "9930",
  DEOSEONI: "6612",
  DEOSHAHDOL: "4471",
  DEOSHAJAPUR: "8820",
  DEOSHEOPUR: "3309",
  DEOSHIVPURI: "1142",
  DEOSIDHI: "5583",
  DEOSINGRAULI: "9921",
  DEOTIKAMGARH: "2284",
  DEOUJJAIN: "4410",
  DEOUMARIA: "7753",
  DEOVIDISHA: "1104"
};
const districts = ["", "Agar Malwa", "Alirajpur", "Anuppur", "Ashoknagar", "Balaghat", "Barwani", "Betul", "Bhind", "Bhopal", "Burhanpur", "Chhatarpur", "Chhindwara", "Damoh", "Datia", "Dewas", "Dhar", "Dindori", "Guna", "Gwalior", "Harda", "Indore", "Jabalpur", "Jhabua", "Katni", "Khandwa", "Khargone", "Mandla", "Maihar", "Mandsaur", "Morena", "Mauganj", "Narmadapuram", "Narsinghpur", "Neemuch", "Niwari", "Pandhurna", "Panna", "Raisen", "Rajgarh", "Ratlam", "Rewa", "Sagar", "Satna", "Sehore", "Seoni", "Shahdol", "Shajapur", "Sheopur", "Shivpuri", "Sidhi", "Singrauli", "Tikamgarh", "Ujjain", "Umaria", "Vidisha"];
const DEO_DISTRICT = {
  DEOBHOPAL: "Bhopal",
  DEORAISEN: "Raisen",
  DEORAJGARH: "Rajgarh",
  DEOSEHORE: "Sehore",
  DEOVIDISHA: "Vidisha",
  DEOASHOKNAGAR: "Ashoknagar",
  DEOBHIND: "Bhind",
  DEODATIA: "Datia",
  DEOGUNA: "Guna",
  DEOGWALIOR: "Gwalior",
  DEOMORENA: "Morena",
  DEOSHEOPUR: "Sheopur",
  DEOSHIVPURI: "Shivpuri",
  DEOALIRAJPUR: "Alirajpur",
  DEOBARWANI: "Barwani",
  DEOBURHANPUR: "Burhanpur",
  DEOKHANDWA: "Khandwa",
  DEODHAR: "Dhar",
  DEOINDORE: "Indore",
  DEOJHABUA: "Jhabua",
  DEOKHARGONE: "Khargone",
  DEOBALAGHAT: "Balaghat",
  DEOCHHINDWARA: "Chhindwara",
  DEODINDORI: "Dindori",
  DEOJABALPUR: "Jabalpur",
  DEOKATNI: "Katni",
  DEOMANDLA: "Mandla",
  DEONARSINGHPUR: "Narsinghpur",
  DEOSEONI: "Seoni",
  DEOHARDA: "Harda",
  DEONARMADAPURAM: "Narmadapuram",
  DEOBETUL: "Betul",
  DEOREWA: "Rewa",
  DEOSATNA: "Satna",
  DEOSIDHI: "Sidhi",
  DEOSINGRAULI: "Singrauli",
  DEOCHHATARPUR: "Chhatarpur",
  DEODAMOH: "Damoh",
  DEONIWARI: "Niwari",
  DEOPANNA: "Panna",
  DEOSAGAR: "Sagar",
  DEOTIKAMGARH: "Tikamgarh",
  DEOANUPPUR: "Anuppur",
  DEOSHAHDOL: "Shahdol",
  DEOUMARIA: "Umaria",
  DEOAGARMALWA: "Agar Malwa",
  DEODEWAS: "Dewas",
  DEOMANDSAUR: "Mandsaur",
  DEONEEMUCH: "Neemuch",
  DEORATLAM: "Ratlam",
  DEOSHAJAPUR: "Shajapur",
  DEOUJJAIN: "Ujjain",
  DEOMAIHAR: "Maihar",
  DEOMAUGANJ: "Mauganj",
  DEOPANDHURNA: "Pandhurna"
};
const colConfig = [{
  name: "S.No.",
  cls: "col-xs"
}, {
  name: "Gradation No.",
  cls: "col-xs"
}, {
  name: "Unique ID",
  cls: "col-sm"
}, {
  name: "Name",
  cls: "col-lg"
}, {
  name: "Category",
  cls: "col-sm"
}, {
  name: "Gender",
  cls: "col-sm"
}, {
  name: "Date of Birth",
  cls: "col-md"
}, {
  name: "Mode",
  cls: "col-sm"
}, {
  name: "PG Subject (Appt.)",
  cls: "col-lg"
}, {
  name: "Prof. Qualification",
  cls: "col-lg"
}, {
  name: "PG Qualification",
  cls: "col-lg"
}, {
  name: "PG Subject (Other)",
  cls: "col-lg"
}, {
  name: "Home District",
  cls: "col-lg"
}, {
  name: "First Appointment",
  cls: "col-md"
}, {
  name: "Designation",
  cls: "col-lg"
}, {
  name: "1st Promotion",
  cls: "col-md"
}, {
  name: "2nd Promotion",
  cls: "col-md"
}, {
  name: "Present Cadre Date",
  cls: "col-md"
}, {
  name: "Seniority Date",
  cls: "col-md"
}, {
  name: "Samvilion/Transfer (Joining Date)",
  cls: "col-md"
}, {
  name: "Transfer Details",
  cls: "col-lg"
}, {
  name: "Present School",
  cls: "col-xl"
}, {
  name: "UDISE Code",
  cls: "col-md"
}, {
  name: "Present District",
  cls: "col-lg"
}, {
  name: "Ucch Pad Join",
  cls: "col-md"
}, {
  name: "Ucch Pad Shala",
  cls: "col-xl"
}, {
  name: "Ucch Pad UDISE",
  cls: "col-md"
}, {
  name: "Ucch Pad Jila",
  cls: "col-lg"
}, {
  name: "Remark",
  cls: "col-lg"
}, {
  name: "Status",
  cls: "col-md"
}, {
  name: "Updated By",
  cls: "col-lg"
}, {
  name: "📎 Upload Doc",
  cls: "col-md"
}, {
  name: "🚌 Transfer Doc",
  cls: "col-md"
}];
const fieldNames = {
  field1: "S.No",
  field2: "Gradation No.",
  field3: "Unique ID",
  field4: "Name",
  field5: "Category",
  field6: "Gender",
  field7: "Date of Birth",
  field8: "Mode of Appointment",
  field9: "PG Subject (Appt.)",
  field10: "Prof. Qualification",
  field11: "PG Qualification",
  field12: "PG Subject (Other)",
  field13: "Home District",
  field14: "First Appointment",
  field15: "Designation",
  field16: "1st Promotion",
  field17: "2nd Promotion",
  field18: "Present Cadre Date",
  field19: "Seniority Date",
  field20: "Samvilion/Transfer (Joining Date)",
  field21: "Transfer Details",
  field22: "Present School",
  field23: "UDISE Code",
  field24: "Present District",
  field25: "उच्च पद ज्वाइन",
  field26: "उच्च पद शाला",
  field27: "उच्च पद UDISE",
  field28: "उच्च पद जिला",
  field29: "Remark",
  field30: "Status",
  field31: "Updated By"
};
window.fullData = [];
window.filteredData = [];
let historyStore = [];
let listZoom = 11;
let formZoom = 12;
let selectedRowElement = null;
let currentUser = null;
function updateClock() {
  const _0x37df21 = document.getElementById("clockDisplay");
  if (_0x37df21) {
    _0x37df21.textContent = new Date().toLocaleString("en-IN", {
      hour12: true
    });
  }
}
setInterval(updateClock, 1000);
updateClock();
let keyTimer;
window.addEventListener("keydown", _0x1b75d1 => {
  if (_0x1b75d1.key && _0x1b75d1.key.toLowerCase() === "a" && !keyTimer) {
    keyTimer = setTimeout(() => {
      if (window.currentUser !== "DPI" && window.currentUser !== "UCR") {
        return;
      }
      openDpiPasswordModal();
    }, 2000);
  }
});
window.addEventListener("keyup", _0x5ee3bd => {
  if (_0x5ee3bd.key && _0x5ee3bd.key.toLowerCase() === "a") {
    clearTimeout(keyTimer);
    keyTimer = null;
  }
});
function myAlert(_0x34c496) {
  const _0x402e9d = document.getElementById("alertMsg");
  _0x402e9d.style.whiteSpace = "pre-line";
  _0x402e9d.textContent = _0x34c496;
  document.getElementById("customAlert").style.display = "flex";
}
function closeAlert() {
  document.getElementById("customAlert").style.display = "none";
}
window.alert = function (_0x105159) {
  myAlert(_0x105159);
};
function openDpiPasswordModal() {
  const _0x2a8667 = document.getElementById("dpiPassModal");
  _0x2a8667.style.display = "flex";
  document.getElementById("dpiPassInput").value = "";
  document.getElementById("dpiPassErr").textContent = "";
  setTimeout(() => document.getElementById("dpiPassInput").focus(), 100);
}
function verifyDpiPass() {
  const _0x13ad29 = document.getElementById("dpiPassInput").value;
  if (_0x13ad29 !== "1782") {
    document.getElementById("dpiPassErr").textContent = "❌ Galat password!";
    document.getElementById("dpiPassInput").value = "";
    document.getElementById("dpiPassInput").focus();
    return;
  }
  document.getElementById("dpiPassModal").style.display = "none";
  toggleDPI();
}
function toggleDPI() {
  const _0x12085c = document.getElementById("dpiControlPanel");
  const _0x3c4b59 = _0x12085c.style.display === "none" || !_0x12085c.style.display;
  _0x12085c.style.display = _0x3c4b59 ? "flex" : "none";
  if (_0x3c4b59) {
    document.getElementById("dpiStartDate").value = window._umsStart || "";
    document.getElementById("dpiEndDate").value = window._umsEnd || "";
    switchDpiTab(1);
    renderDpiUserCheckboxes();
    const _0x21576d = window._maintCfg || JSON.parse(_ls.get("ums_maintenance") || "null");
    const _0x32b329 = document.getElementById("maintActiveDot");
    if (_0x32b329) {
      _0x32b329.style.display = _0x21576d && _0x21576d.active ? "block" : "none";
    }
  }
}
function renderDpiUserCheckboxes() {
  const _0x92d7fc = window._userOverrides || JSON.parse(_ls.get("ums_user_overrides") || "{}");
  const _0x5baf59 = Object.keys(districtCredentials).filter(_0x4584e2 => _0x4584e2.startsWith("JD"));
  const _0x1cd9c4 = Object.keys(districtCredentials).filter(_0x2f7b07 => _0x2f7b07.startsWith("DEO"));
  function _0x34ecf2(_0x40d46c, _0x1a02e2) {
    const _0x3241e9 = document.getElementById(_0x1a02e2);
    if (!_0x3241e9) {
      return;
    }
    _0x3241e9.innerHTML = _0x40d46c.map(_0x2bb61b => {
      const _0x494760 = _0x92d7fc[_0x2bb61b];
      const _0x7d20be = _0x494760 ? "<span style=\"font-size:9px;color:#888;margin-left:4px;\">(" + (_0x494760.start || "?") + " to " + (_0x494760.end || "?") + ")</span>" : "";
      const _0x3de7b = _0x494760 && _0x494760.closed ? "<span style=\"font-size:9px;background:#fee2e2;color:#991b1b;padding:1px 5px;border-radius:3px;margin-left:4px;\">CLOSED</span>" : "";
      return "<label style=\"display:flex;align-items:center;gap:6px;padding:5px 10px;cursor:pointer;border-bottom:1px solid #f5f5f5;font-size:11px;\" onmouseover=\"this.style.background='#f9f9f9'\" onmouseout=\"this.style.background=''\"><input type=\"checkbox\" class=\"dpi-user-cb\" data-user=\"" + _0x2bb61b + "\" style=\"width:14px;height:14px;cursor:pointer;\"><span style=\"font-weight:600;color:#002e5b;\">" + _0x2bb61b + "</span>" + _0x7d20be + _0x3de7b + "</label>";
    }).join("");
  }
  _0x34ecf2(_0x5baf59, "jdCheckboxList");
  _0x34ecf2(_0x1cd9c4, "deoCheckboxList");
}
function toggleUserGroup(_0x149428) {
  const _0x2bba41 = document.getElementById(_0x149428);
  if (!_0x2bba41) {
    return;
  }
  _0x2bba41.style.display = _0x2bba41.style.display === "none" ? "" : "none";
}
function dpiSelectAllUsers(_0x32f991) {
  document.querySelectorAll(".dpi-user-cb").forEach(function (_0x51ee44) {
    _0x51ee44.checked = _0x32f991;
  });
}
function dpiSelectByType(_0x168e6d) {
  document.querySelectorAll(".dpi-user-cb").forEach(function (_0x365632) {
    if (_0x365632.dataset.user && _0x365632.dataset.user.startsWith(_0x168e6d)) {
      _0x365632.checked = true;
    }
  });
}
function onMaintToggleChange() {
  const _0xf86e6b = document.getElementById("maintToggle").checked;
  const _0x7a82ad = document.getElementById("maintToggleSlider");
  const _0x2218f3 = document.getElementById("maintToggleKnob");
  const _0x4453ad = document.getElementById("maintStatusLabel");
  if (_0xf86e6b) {
    _0x7a82ad.style.background = "#f59e0b";
    _0x2218f3.style.left = "27px";
    _0x4453ad.style.background = "#fef3c7";
    _0x4453ad.style.color = "#92400e";
    _0x4453ad.textContent = "Status: ON — Maintenance चालू है";
  } else {
    _0x7a82ad.style.background = "#ccc";
    _0x2218f3.style.left = "3px";
    _0x4453ad.style.background = "#f3f4f6";
    _0x4453ad.style.color = "#6b7280";
    _0x4453ad.textContent = "Status: OFF";
  }
}
function saveMaintSettings() {
  const _0x2a3ca7 = document.getElementById("maintToggle").checked;
  const _0x2866ec = document.getElementById("maintMsgInput").value.trim();
  if (_0x2a3ca7 && !_0x2866ec) {
    myAlert("⚠️ Please enter a maintenance message before enabling.");
    return;
  }
  const _0x2c48e5 = {
    active: _0x2a3ca7,
    message: _0x2866ec,
    startTime: document.getElementById("maintStartTime").value,
    endTime: document.getElementById("maintEndTime").value,
    durationText: document.getElementById("maintDurationText").value.trim(),
    forJD: document.getElementById("maintForJD").checked,
    forDEO: document.getElementById("maintForDEO").checked,
    savedAt: new Date().toISOString()
  };
  _ls.set("ums_maintenance", JSON.stringify(_0x2c48e5));
  window._maintCfg = _0x2c48e5;
  _saveMaintToSupabase(_0x2c48e5);
  const _0x3700cf = document.getElementById("maintActiveDot");
  if (_0x3700cf) {
    _0x3700cf.style.display = _0x2a3ca7 ? "block" : "none";
  }
  checkMaintenanceStatus();
  myAlert(_0x2a3ca7 ? "🔧 Maintenance Mode has been enabled! JD/DEO will now see the maintenance screen." : "✅ Maintenance settings saved successfully (Mode is OFF).");
  toggleDPI();
}
function turnOffMaintenance() {
  const _0x11d6e8 = JSON.parse(_ls.get("ums_maintenance") || "{}");
  _0x11d6e8.active = false;
  _0x11d6e8.savedAt = new Date().toISOString();
  _ls.set("ums_maintenance", JSON.stringify(_0x11d6e8));
  window._maintCfg = _0x11d6e8;
  _saveMaintToSupabase(_0x11d6e8);
  document.getElementById("maintToggle").checked = false;
  onMaintToggleChange();
  const _0x12a1e4 = document.getElementById("maintActiveDot");
  if (_0x12a1e4) {
    _0x12a1e4.style.display = "none";
  }
  document.getElementById("maintenanceScreen").style.display = "none";
  myAlert("✅ Maintenance Mode has been turned off.");
  toggleDPI();
}
let _maintCountdownTimer = null;
async function _fetchMaintFromSupabase() {
  try {
    const _0x3bfeed = getSupabase();
    if (!_0x3bfeed) {
      return null;
    }
    const {
      data: _0xcadd5c,
      error: _0x1069fe
    } = await _0x3bfeed.from("ums_app_config").select("value").eq("key", "maintenance").single();
    if (_0x1069fe || !_0xcadd5c) {
      return null;
    }
    const _0x5c9818 = JSON.parse(_0xcadd5c.value);
    window._maintCfg = _0x5c9818;
    _ls.set("ums_maintenance", JSON.stringify(_0x5c9818));
    return _0x5c9818;
  } catch (_0x2abca1) {
    return null;
  }
}
async function _fetchConfigFromSupabase(_0x5d7ca8) {
  try {
    const _0xd63c4b = getSupabase();
    if (!_0xd63c4b) {
      return null;
    }
    const {
      data: _0x50caea,
      error: _0x4e4fc6
    } = await _0xd63c4b.from("ums_app_config").select("value").eq("key", _0x5d7ca8).single();
    if (_0x4e4fc6 || !_0x50caea) {
      return null;
    }
    return JSON.parse(_0x50caea.value);
  } catch (_0x51fa5b) {
    return null;
  }
}
async function _saveConfigToSupabase(_0x41d129, _0x45b6ff) {
  try {
    const _0x130a09 = getSupabase();
    if (!_0x130a09) {
      return;
    }
    await _0x130a09.from("ums_app_config").upsert({
      key: _0x41d129,
      value: JSON.stringify(_0x45b6ff),
      updated_at: new Date().toISOString()
    }, {
      onConflict: "key"
    });
  } catch (_0x40dc1d) {
    console.warn("Config Supabase save failed [" + _0x41d129 + "]:", _0x40dc1d);
  }
}
async function _loadAllDpiConfigFromSupabase() {
  try {
    const _0x4aa5ad = getSupabase();
    if (!_0x4aa5ad) {
      return;
    }
    const {
      data: _0x2d3352,
      error: _0x500074
    } = await _0x4aa5ad.from("ums_app_config").select("key,value");
    if (_0x500074 || !_0x2d3352) {
      return;
    }
    _0x2d3352.forEach(function (_0x417b17) {
      try {
        const _0x1d2033 = JSON.parse(_0x417b17.value);
        if (_0x417b17.key === "global_dates") {
          window._umsStart = _0x1d2033.start || window._umsStart;
          window._umsEnd = _0x1d2033.end || window._umsEnd;
          _ls.set("ums_config_start", _0x1d2033.start || "");
          _ls.set("ums_config_end", _0x1d2033.end || "");
        } else if (_0x417b17.key === "user_overrides") {
          window._userOverrides = _0x1d2033;
          _ls.set("ums_user_overrides", JSON.stringify(_0x1d2033));
        } else if (_0x417b17.key === "maintenance") {
          window._maintCfg = _0x1d2033;
          _ls.set("ums_maintenance", JSON.stringify(_0x1d2033));
        }
      } catch (_0x4313bf) {}
    });
    updateDeadlineBadge();
    checkLockStatus();
    checkMaintenanceStatus();
  } catch (_0x5eb386) {
    console.warn("DPI config load failed:", _0x5eb386);
  }
}
async function _saveMaintToSupabase(_0x35f827) {
  try {
    const _0x41bb08 = getSupabase();
    if (!_0x41bb08) {
      return;
    }
    await _0x41bb08.from("ums_app_config").upsert({
      key: "maintenance",
      value: JSON.stringify(_0x35f827),
      updated_at: new Date().toISOString()
    }, {
      onConflict: "key"
    });
  } catch (_0x5dc903) {
    console.warn("Maintenance Supabase save failed:", _0x5dc903);
  }
}
function checkMaintenanceStatus() {
  const _0x3be73f = window.currentUser || currentUser || null;
  if (_0x3be73f === "DPI") {
    document.getElementById("maintenanceScreen").style.display = "none";
    return;
  }
  _fetchMaintFromSupabase().then(function (_0x69a6eb) {
    const _0x1c5e44 = _0x69a6eb || window._maintCfg || JSON.parse(_ls.get("ums_maintenance") || "null");
    _applyMaintenanceScreen(_0x3be73f, _0x1c5e44);
  }).catch(function () {
    const _0x6f2ba0 = window._maintCfg || JSON.parse(_ls.get("ums_maintenance") || "null");
    _applyMaintenanceScreen(_0x3be73f, _0x6f2ba0);
  });
}
function _applyMaintenanceScreen(_0x5a8749, _0x5da3bc) {
  const _0x1a2b8b = _0x5da3bc;
  if (!_0x1a2b8b || !_0x1a2b8b.active) {
    document.getElementById("maintenanceScreen").style.display = "none";
    return;
  }
  const _0x5af412 = _0x5a8749 && _0x5a8749.startsWith("JD");
  const _0x53c329 = _0x5a8749 && _0x5a8749.startsWith("DEO");
  if (_0x5af412 && !_0x1a2b8b.forJD || _0x53c329 && !_0x1a2b8b.forDEO) {
    document.getElementById("maintenanceScreen").style.display = "none";
    return;
  }
  document.getElementById("maintenanceScreen").style.display = "flex";
  document.getElementById("maintMsg").textContent = _0x1a2b8b.message || "Portal पर maintenance कार्य चल रहा है।";
  const _0x76cb35 = document.getElementById("maintTimePeriodBox");
  const _0x3072ac = document.getElementById("maintTimePeriod");
  const _0x2e3fe4 = document.getElementById("maintCountdownBox");
  const _0x351beb = document.getElementById("maintCountdown");
  let _0x22fd98 = [];
  if (_0x1a2b8b.startTime) {
    _0x22fd98.push("शुरू: " + formatDT(_0x1a2b8b.startTime));
  }
  if (_0x1a2b8b.endTime) {
    _0x22fd98.push("समाप्ति: " + formatDT(_0x1a2b8b.endTime));
  }
  if (_0x1a2b8b.durationText) {
    _0x22fd98.push("अवधि: " + _0x1a2b8b.durationText);
  }
  if (_0x22fd98.length > 0) {
    _0x3072ac.innerHTML = _0x22fd98.join("<br>");
    _0x76cb35.style.display = "block";
  } else {
    _0x76cb35.style.display = "none";
  }
  if (_maintCountdownTimer) {
    clearInterval(_maintCountdownTimer);
  }
  if (_0x1a2b8b.endTime) {
    _0x2e3fe4.style.display = "block";
    function _0x26d7c9() {
      const _0x52017b = Date.now();
      const _0x213bfa = new Date(_0x1a2b8b.endTime).getTime();
      const _0x4e0ed4 = _0x213bfa - _0x52017b;
      if (_0x4e0ed4 <= 0) {
        _0x351beb.textContent = "जल्द ही उपलब्ध होगा...";
        clearInterval(_maintCountdownTimer);
        return;
      }
      const _0x2d2f6d = Math.floor(_0x4e0ed4 / 3600000);
      const _0x2c5410 = Math.floor(_0x4e0ed4 % 3600000 / 60000);
      const _0x5a2d49 = Math.floor(_0x4e0ed4 % 60000 / 1000);
      _0x351beb.textContent = (_0x2d2f6d ? pad2(_0x2d2f6d) + " घण्टे " : "") + pad2(_0x2c5410) + " मिनट " + pad2(_0x5a2d49) + " सेकंड";
    }
    _0x26d7c9();
    _maintCountdownTimer = setInterval(_0x26d7c9, 1000);
  } else {
    _0x2e3fe4.style.display = "none";
  }
}
function formatDT(_0x5f19ba) {
  if (!_0x5f19ba) {
    return "";
  }
  try {
    const _0x42264f = new Date(_0x5f19ba);
    return _0x42264f.toLocaleDateString("hi-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }) + " " + _0x42264f.toLocaleTimeString("hi-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  } catch (_0x16f238) {
    return _0x5f19ba;
  }
}
function pad2(_0x352b88) {
  return String(_0x352b88).padStart(2, "0");
}
function loadMaintPanelState() {
  const _0x17ed0d = window._maintCfg || JSON.parse(_ls.get("ums_maintenance") || "null");
  if (!_0x17ed0d) {
    return;
  }
  document.getElementById("maintToggle").checked = !!_0x17ed0d.active;
  onMaintToggleChange();
  document.getElementById("maintMsgInput").value = _0x17ed0d.message || "";
  document.getElementById("maintStartTime").value = _0x17ed0d.startTime || "";
  document.getElementById("maintEndTime").value = _0x17ed0d.endTime || "";
  document.getElementById("maintDurationText").value = _0x17ed0d.durationText || "";
  if (_0x17ed0d.forJD !== undefined) {
    document.getElementById("maintForJD").checked = _0x17ed0d.forJD;
  }
  if (_0x17ed0d.forDEO !== undefined) {
    document.getElementById("maintForDEO").checked = _0x17ed0d.forDEO;
  }
  const _0x3758b2 = document.getElementById("maintActiveDot");
  if (_0x3758b2) {
    _0x3758b2.style.display = _0x17ed0d.active ? "block" : "none";
  }
}
function clearUserOverrides() {
  if (!confirm("Sabhi per-user overrides clear kar dein? Sab global dates par wapis aa jaayenge.")) {
    return;
  }
  _ls.remove("ums_user_overrides");
  window._userOverrides = {};
  _saveConfigToSupabase("user_overrides", {});
  renderDpiUserCheckboxes();
  myAlert("✅ All per-user overrides have been cleared.");
}
function saveTimeLimit() {
  const _0x42ea43 = document.getElementById("dpiStartDate").value;
  const _0x5195a8 = document.getElementById("dpiEndDate").value;
  if (!_0x42ea43 || !_0x5195a8) {
    myAlert("Please select both global start and end dates.");
    return;
  }
  window._umsStart = _0x42ea43;
  window._umsEnd = _0x5195a8;
  _ls.set("ums_config_start", _0x42ea43);
  _ls.set("ums_config_end", _0x5195a8);
  _saveConfigToSupabase("global_dates", {
    start: _0x42ea43,
    end: _0x5195a8
  });
  const _0x109faf = document.getElementById("overrideStartDate").value;
  const _0x5884b4 = document.getElementById("overrideEndDate").value;
  const _0x5716d6 = Array.from(document.querySelectorAll(".dpi-user-cb:checked"));
  if (_0x5716d6.length > 0) {
    if (!_0x109faf || !_0x5884b4) {
      myAlert("⚠️ Please select Override Start and End dates for per-user override.");
      return;
    }
    const _0x4fcd68 = JSON.parse(_ls.get("ums_user_overrides") || "{}");
    _0x5716d6.forEach(function (_0x5596b4) {
      const _0x11a8f2 = _0x5596b4.dataset.user;
      if (_0x11a8f2) {
        _0x4fcd68[_0x11a8f2] = {
          start: _0x109faf,
          end: _0x5884b4
        };
      }
    });
    _ls.set("ums_user_overrides", JSON.stringify(_0x4fcd68));
    window._userOverrides = _0x4fcd68;
    _saveConfigToSupabase("user_overrides", _0x4fcd68);
    renderDpiUserCheckboxes();
  }
  updateDeadlineBadge();
  const _0x2ff64d = _0x5716d6.length > 0 ? "Settings saved! " + _0x5716d6.length + " user(s) ko override dates set ki gayi." : "Global access period updated successfully.";
  myAlert(_0x2ff64d);
  toggleDPI();
  checkLockStatus();
}
function checkLockStatus() {
  const _0x4a6de5 = window.currentUser || currentUser || null;
  if (_0x4a6de5 === "DPI") {
    document.getElementById("lockScreen").style.display = "none";
    return;
  }
  if (!_0x4a6de5) {
    document.getElementById("lockScreen").style.display = "none";
    return;
  }
  const _0x3abce2 = window._userOverrides || JSON.parse(_ls.get("ums_user_overrides") || "{}");
  let _0xb39a03 = window._umsStart;
  let _0x1672f6 = window._umsEnd;
  if (_0x3abce2[_0x4a6de5]) {
    _0xb39a03 = _0x3abce2[_0x4a6de5].start || _0xb39a03;
    _0x1672f6 = _0x3abce2[_0x4a6de5].end || _0x1672f6;
  }
  if (!_0xb39a03 || !_0x1672f6) {
    return;
  }
  const _0x489b36 = new Date();
  const _0x12a647 = _0x489b36.getFullYear() + "-" + String(_0x489b36.getMonth() + 1).padStart(2, "0") + "-" + String(_0x489b36.getDate()).padStart(2, "0");
  if (_0x12a647 < _0xb39a03 || _0x12a647 > _0x1672f6) {
    document.getElementById("lockScreen").style.display = "flex";
    document.getElementById("lockMsg").textContent = "This portal was accessible from " + _0xb39a03 + " to " + _0x1672f6 + ". The access period has ended.";
  } else {
    document.getElementById("lockScreen").style.display = "none";
  }
}
function updateDeadlineBadge() {
  const _0x3c2309 = window._umsEnd;
  const _0x1c11d1 = document.getElementById("deadlineBadge");
  const _0x1d064c = document.getElementById("deadlineBadgeText");
  if (!_0x1c11d1 || !_0x1d064c) {
    return;
  }
  if (_0x3c2309) {
    const _0x3d491f = _0x3c2309.split("-");
    const _0xa432ec = _0x3d491f.length === 3 ? _0x3d491f[2] + "-" + _0x3d491f[1] + "-" + _0x3d491f[0] : _0x3c2309;
    _0x1d064c.textContent = "कार्य करने की अंतिम तिथि: " + _0xa432ec;
    const _0x1b2949 = new Date();
    _0x1b2949.setHours(0, 0, 0, 0);
    const _0xa2a172 = new Date(_0x3c2309);
    _0xa2a172.setHours(0, 0, 0, 0);
    const _0x2ec41d = Math.round((_0xa2a172 - _0x1b2949) / 86400000);
    if (_0x2ec41d < 0) {
      _0x1c11d1.style.background = "#fee2e2";
      _0x1c11d1.style.borderColor = "#ef4444";
      _0x1c11d1.style.color = "#991b1b";
    } else if (_0x2ec41d <= 7) {
      _0x1c11d1.style.background = "#fff3cd";
      _0x1c11d1.style.borderColor = "#ffc107";
      _0x1c11d1.style.color = "#856404";
    } else {
      _0x1c11d1.style.background = "#dcfce7";
      _0x1c11d1.style.borderColor = "#86efac";
      _0x1c11d1.style.color = "#166534";
    }
  }
}
window._loginAttempts = {};
window._loginBlocks = {};
function checkLogin() {
  const _0x18fd37 = document.getElementById("userField").value.trim().toUpperCase();
  const _0x38fcc3 = document.getElementById("passField").value.trim();
  const _0x4f84a6 = document.getElementById("loginError");
  const _0x4ecb63 = "ums_block_" + _0x18fd37;
  const _0x508690 = "ums_att_" + _0x18fd37;
  const _0xd92080 = window._loginBlocks[_0x4ecb63] || null;
  if (_0xd92080) {
    const _0x493899 = Math.ceil((_0xd92080.until - Date.now()) / 1000);
    if (_0x493899 > 0) {
      _0x4f84a6.textContent = "🔒 Account locked. Please try again in " + _0x493899 + " seconds.";
      return;
    } else {
      delete window._loginBlocks[_0x4ecb63];
      delete window._loginAttempts[_0x508690];
    }
  }
  if (districtCredentials[_0x18fd37] === _0x38fcc3) {
    delete window._loginAttempts[_0x508690];
    delete window._loginBlocks[_0x4ecb63];
    currentUser = _0x18fd37;
    window.currentUser = _0x18fd37;
    if (typeof updateTitleEditHint === "function") {
      updateTitleEditHint();
    }
    document.getElementById("loginOverlay").style.display = "none";
    document.body.style.overflow = "";
    document.getElementById("userBadge").style.display = "inline-block";
    document.getElementById("userBadge").textContent = "👤 " + _0x18fd37;
    document.getElementById("sessionUser").textContent = _0x18fd37 + " — Logged in";
    const _0x459b70 = DEO_DISTRICT[_0x18fd37];
    if (_0x459b70) {
      document.getElementById("in22").value = _0x459b70;
    }
    auditLog("LOGIN", "User logged in");
    if (typeof initRealtime === "function") {
      initRealtime();
    }
    if (typeof checkLockStatus === "function") {
      checkLockStatus();
    }
    if (typeof checkMaintenanceStatus === "function") {
      checkMaintenanceStatus();
    }
    _loadAllDpiConfigFromSupabase();
    if (_0x18fd37 !== "DPI") {
      if (window._maintPollTimer) {
        clearInterval(window._maintPollTimer);
      }
      window._maintPollTimer = setInterval(function () {
        _loadAllDpiConfigFromSupabase();
      }, 30000);
    }
    const _0x17056d = document.getElementById("storageBadge");
    if (_0x17056d) {
      _0x17056d.innerHTML = "⏳ Loading data from cloud...";
    }
    const _0x2f2f18 = document.getElementById("dataLoadBar");
    const _0x58a99a = document.getElementById("dataLoadPct");
    const _0x44a12c = document.getElementById("dataLoadMsg");
    const _0xfd3d0c = document.getElementById("dataLoadCount");
    if (_0x2f2f18) {
      _0x2f2f18.style.width = "0%";
    }
    if (_0x58a99a) {
      _0x58a99a.textContent = "0%";
    }
    if (_0x44a12c) {
      _0x44a12c.textContent = "Cloud से कनेक्ट हो रहे हैं";
    }
    if (_0xfd3d0c) {
      _0xfd3d0c.textContent = "";
    }
    loadDataFromSupabase().then(function (_0x230b74) {
      if (_0x230b74 && window.fullData && window.fullData.length > 0) {
        const _0x4c5ec6 = DEO_DISTRICT[_0x18fd37];
        if (_0x4c5ec6) {
          window.filteredData = window.fullData.filter(function (_0x17a981) {
            return (_0x17a981.field24 || "").trim().toLowerCase() === _0x4c5ec6.trim().toLowerCase();
          });
        } else {
          window.filteredData = [...window.fullData];
        }
        renderVirtual();
        updateStorageBadge(true);
      } else if (_0x17056d) {
        _0x17056d.innerHTML = "⚠️ No records found in cloud.";
      }
    });
  } else {
    let _0x42c9e6 = (window._loginAttempts[_0x508690] || 0) + 1;
    window._loginAttempts[_0x508690] = _0x42c9e6;
    if (_0x42c9e6 >= 3) {
      window._loginBlocks[_0x4ecb63] = {
        until: Date.now() + 300000
      };
      delete window._loginAttempts[_0x508690];
      _0x4f84a6.textContent = "🔒 Account locked for 5 minutes due to 3 failed attempts.";
    } else {
      _0x4f84a6.textContent = "❌ Invalid User ID or Password. (" + _0x42c9e6 + "/3 attempts)";
    }
  }
}
function logoutUser() {
  if (!confirm("Are you sure you want to log out?")) {
    return;
  }
  currentUser = null;
  window.currentUser = null;
  if (window._maintPollTimer) {
    clearInterval(window._maintPollTimer);
    window._maintPollTimer = null;
  }
  window.fullData = [];
  window.filteredData = [];
  renderVirtual();
  document.getElementById("loginOverlay").style.display = "flex";
  document.getElementById("userBadge").style.display = "none";
  document.getElementById("sessionUser").textContent = "";
}
function auditLog(_0x103537, _0x4f4700) {
  historyStore.push({
    time: new Date().toLocaleString("en-IN"),
    user: window.currentUser || currentUser,
    action: _0x103537,
    detail: _0x4f4700
  });
}
const STORAGE_KEY = "ums_gradation_data_v3";
const HISTORY_KEY = "ums_gradation_history_v3";
function saveToStorage() {
  updateStorageBadge(true);
}
async function saveAndSync(_0x21a9b0) {
  if (_0x21a9b0.field3 && _0x21a9b0._doc && _0x21a9b0._doc.name) {
    var _0x244670 = _0x21a9b0.field3.trim().toUpperCase();
    try {
      var _0x14b87d = {
        name: _0x21a9b0._doc.name,
        uploader: _0x21a9b0._doc.uploader || ""
      };
      _ls.set("ums_docmeta_" + _0x244670, JSON.stringify(_0x14b87d));
      if (_0x21a9b0._doc.data) {
        _ls.set("ums_docdata_" + _0x244670, _0x21a9b0._doc.data);
      }
    } catch (_0x2034ba) {
      console.warn("_doc localStorage save failed:", _0x2034ba);
    }
  }
  if (_0x21a9b0.field3 && _0x21a9b0._transferDoc && _0x21a9b0._transferDoc.name) {
    var _0x511afd = _0x21a9b0.field3.trim().toUpperCase();
    try {
      var _0xe9dd46 = {
        name: _0x21a9b0._transferDoc.name,
        uploader: _0x21a9b0._transferDoc.uploader || ""
      };
      _ls.set("ums_tdmeta_" + _0x511afd, JSON.stringify(_0xe9dd46));
      if (_0x21a9b0._transferDoc.data) {
        _ls.set("ums_tddata_" + _0x511afd, _0x21a9b0._transferDoc.data);
      }
    } catch (_0x27696b) {
      console.warn("_transferDoc localStorage save failed:", _0x27696b);
    }
  }
  const _0x286d24 = await saveRecordToSupabase(_0x21a9b0);
  updateStorageBadge(_0x286d24);
  return _0x286d24;
}
async function loadFromStorage() {
  return await loadDataFromSupabase();
}
function updateStorageBadge(_0x53f84e) {
  const _0x3bd7ea = document.getElementById("storageBadge");
  if (!_0x3bd7ea) {
    return;
  }
  const _0x2bbf7e = window.fullData.length;
  _0x3bd7ea.innerHTML = _0x53f84e ? "☁️ <b>Cloud Synced</b> — " + _0x2bbf7e + " Records" : "⚠️ <b>Save Failed</b>";
  _0x3bd7ea.style.color = _0x53f84e ? "#166534" : "#c62828";
}
window.onload = function () {
  const _0x429424 = _ls.get("ums_config_start");
  const _0x388eb2 = _ls.get("ums_config_end");
  if (_0x429424) {
    window._umsStart = _0x429424;
  }
  if (_0x388eb2) {
    window._umsEnd = _0x388eb2;
  }
  const _0x15ec1f = _ls.get("ums_user_overrides");
  if (_0x15ec1f) {
    try {
      window._userOverrides = JSON.parse(_0x15ec1f);
    } catch (_0x4ddd10) {}
  }
  checkLockStatus();
  updateDeadlineBadge();
  _loadAllDpiConfigFromSupabase();
  buildTableHead();
  buildFilterRow();
  fillDistrictDropdowns();
  setupFormZoom();
  document.getElementById("clearFiltersBtn").addEventListener("click", resetFilters);
  document.querySelectorAll(".date-field").forEach(_0x3f6de3 => {
    _0x3f6de3.setAttribute("max", new Date().toISOString().split("T")[0]);
    _0x3f6de3.addEventListener("keydown", _0x2eb73f => _0x2eb73f.preventDefault());
    _0x3f6de3.addEventListener("click", function () {
      if (this.showPicker) {
        this.showPicker();
      }
    });
  });
  handleUPPLogic();
  document.addEventListener("click", _0x59fe10 => {
    if (!_0x59fe10.target.closest(".ms-container") && !_0x59fe10.target.closest(".ms-options")) {
      document.querySelectorAll(".ms-options").forEach(_0x237479 => _0x237479.style.display = "none");
    }
  });
};
function buildTableHead() {
  const _0x1acbe8 = document.getElementById("tableHead");
  colConfig.forEach(_0x21e145 => {
    const _0x40a696 = document.createElement("th");
    _0x40a696.className = _0x21e145.cls;
    _0x40a696.innerText = _0x21e145.name;
    _0x1acbe8.appendChild(_0x40a696);
  });
}
function buildFilterRow() {
  const _0xc5e45a = document.getElementById("filterRow");
  for (let _0x2c347e = 0; _0x2c347e < colConfig.length; _0x2c347e++) {
    const _0xd351d0 = document.createElement("th");
    const _0x279269 = document.createElement("input");
    _0x279269.type = "text";
    _0x279269.placeholder = "🔍";
    _0x279269.oninput = function () {
      document.getElementById("tableBody").style.opacity = ".5";
      runAllFilters();
      setTimeout(() => document.getElementById("tableBody").style.opacity = "1", 300);
    };
    _0xd351d0.appendChild(_0x279269);
    _0xc5e45a.appendChild(_0xd351d0);
  }
}
function fillDistrictDropdowns() {
  document.querySelectorAll(".district-list").forEach(_0x36463b => {
    _0x36463b.innerHTML = "<option value=\"\">SELECT DISTRICT</option>";
    districts.filter(Boolean).forEach(_0x223598 => {
      const _0x56e234 = document.createElement("option");
      _0x56e234.value = _0x223598;
      _0x56e234.textContent = _0x223598;
      _0x36463b.appendChild(_0x56e234);
    });
  });
}
function toggleMS(_0x275a28, _0x24012d) {
  if (_0x275a28 && _0x275a28.stopPropagation) {
    _0x275a28.stopPropagation();
  }
  const _0x6e53aa = document.getElementById(_0x24012d);
  const _0x186c86 = _0x6e53aa.style.display === "block";
  document.querySelectorAll(".ms-options").forEach(_0x4cb772 => {
    _0x4cb772.style.display = "none";
  });
  if (_0x186c86) {
    return;
  }
  if (_0x6e53aa.parentNode !== document.body) {
    _0x6e53aa._originalParent = _0x6e53aa.parentNode;
    document.body.appendChild(_0x6e53aa);
  }
  const _0x2c27c9 = _0x275a28.currentTarget || _0x275a28.target.closest(".ms-container");
  const _0x2f7bfd = _0x2c27c9.getBoundingClientRect();
  const _0x4c0e85 = window.innerHeight - _0x2f7bfd.bottom;
  const _0x1de116 = _0x2f7bfd.top;
  const _0x24db24 = Math.min(240, _0x6e53aa.scrollHeight || 240);
  _0x6e53aa.style.position = "fixed";
  _0x6e53aa.style.left = _0x2f7bfd.left + "px";
  _0x6e53aa.style.width = Math.max(_0x2f7bfd.width, 210) + "px";
  _0x6e53aa.style.zIndex = "99999999";
  _0x6e53aa.style.top = "unset";
  _0x6e53aa.style.bottom = "unset";
  if (_0x4c0e85 >= _0x24db24 || _0x4c0e85 >= _0x1de116) {
    _0x6e53aa.style.top = _0x2f7bfd.bottom + 2 + "px";
    _0x6e53aa.style.maxHeight = _0x4c0e85 - 8 + "px";
  } else {
    _0x6e53aa.style.bottom = window.innerHeight - _0x2f7bfd.top + 2 + "px";
    _0x6e53aa.style.maxHeight = _0x1de116 - 8 + "px";
  }
  _0x6e53aa.style.display = "block";
  _0x6e53aa.scrollTop = 0;
  if (_0x24012d === "ms12") {
    filterMS12ByField9();
  }
}
function updateMS(_0x19dee8) {
  const _0x46b284 = document.getElementById("ms" + _0x19dee8);
  const _0x3e1599 = document.getElementById("text" + _0x19dee8);
  const _0x1e7f75 = document.getElementById("in" + _0x19dee8);
  if (!_0x46b284) {
    return;
  }
  const _0x39e66c = Array.from(_0x46b284.querySelectorAll("input:checked")).map(_0x1f5ff2 => _0x1f5ff2.value);
  if (_0x39e66c.length > 0) {
    _0x1e7f75.value = _0x39e66c.join("/");
    _0x3e1599.textContent = _0x39e66c.join("/");
  } else {
    _0x1e7f75.value = "";
    _0x3e1599.textContent = "SELECT";
  }
}
function setMSValues(_0x549120, _0x383cd7) {
  const _0x1f3b19 = document.getElementById("ms" + _0x549120);
  if (!_0x1f3b19 || !_0x383cd7) {
    return;
  }
  const _0x555963 = _0x383cd7.split("/").map(_0x4963a8 => _0x4963a8.trim().toUpperCase());
  _0x1f3b19.querySelectorAll("input[type=checkbox]").forEach(_0x1c0a4f => {
    _0x1c0a4f.checked = _0x555963.includes(_0x1c0a4f.value.toUpperCase());
  });
  updateMS(_0x549120);
}
function filterMS12ByField9() {
  var _0x4474ab = (document.getElementById("in9").value || "").trim();
  var _0x50fc3d = document.getElementById("ms12");
  if (!_0x50fc3d) {
    return;
  }
  _0x50fc3d.querySelectorAll("input[type=checkbox]").forEach(function (_0x4ab655) {
    _0x4ab655.disabled = false;
    _0x4ab655.parentElement.style.opacity = "";
    _0x4ab655.parentElement.style.pointerEvents = "";
    _0x4ab655.parentElement.title = "";
  });
  if (!_0x4474ab || _0x4474ab === "") {
    updateMS(12);
    return;
  }
  _0x50fc3d.querySelectorAll("input[type=checkbox]").forEach(function (_0xe3690e) {
    if (_0xe3690e.value.trim().toLowerCase() === _0x4474ab.toLowerCase()) {
      _0xe3690e.checked &&= false;
      _0xe3690e.disabled = true;
      _0xe3690e.parentElement.style.opacity = "0.38";
      _0xe3690e.parentElement.style.pointerEvents = "none";
      _0xe3690e.parentElement.title = "⚠️ यह subject पहले से Field 9 में चयनित है";
    }
  });
  updateMS(12);
}
function autoDesignationLogic() {
  const _0x225ae7 = document.getElementById("in8").value;
  const _0x3e5475 = document.getElementById("in14").value;
  const _0x2acada = document.getElementById("in16").value;
  const _0x27195a = document.getElementById("in16bMode") ? document.getElementById("in16bMode").value : "DATE";
  const _0x4be4d1 = _0x27195a === "NIL" ? "" : document.getElementById("in16b").value;
  const _0x34e2b1 = "2018-07-01";
  if (_0x225ae7 === "DIR") {
    document.getElementById("in16").value = "";
    document.getElementById("in16b").value = "";
    document.getElementById("in17").value = "";
    document.getElementById("in18").value = "";
    document.getElementById("promo1Row").style.display = "none";
    document.getElementById("promo2Row").style.display = "none";
    if (_0x3e5475) {
      document.getElementById("in15").value = _0x3e5475 < _0x34e2b1 ? "Shiksha Karmi-1/SSS-1" : "UMS";
      document.getElementById("in17").dataset.raw = _0x3e5475;
      document.getElementById("in17").value = fmtDate(_0x3e5475);
      calculateSeniority();
    }
  } else if (_0x225ae7 === "PRO") {
    document.getElementById("promo1Row").style.display = "flex";
    if (_0x2acada && _0x4be4d1) {
      document.getElementById("promo2Row").style.display = "flex";
      document.getElementById("in15").value = "Shiksha Karmi-3/SSS-3";
      document.getElementById("in17").dataset.raw = _0x4be4d1;
      document.getElementById("in17").value = fmtDate(_0x4be4d1);
    } else if (_0x2acada) {
      document.getElementById("promo2Row").style.display = "flex";
      document.getElementById("in15").value = "Shiksha Karmi-2/SSS-2";
      document.getElementById("in17").dataset.raw = _0x2acada;
      document.getElementById("in17").value = fmtDate(_0x2acada);
    } else {
      document.getElementById("in15").value = "Shiksha Karmi-2/SSS-2";
    }
    calculateSeniority();
  }
}
function handlePromo2Mode() {
  const _0x3d4c15 = document.getElementById("in16bMode").value;
  const _0x8b7977 = document.getElementById("in16b");
  if (_0x3d4c15 === "NIL") {
    _0x8b7977.value = "";
    _0x8b7977.disabled = true;
    _0x8b7977.style.background = "#eee";
    autoDesignationLogic();
  } else {
    _0x8b7977.disabled = false;
    _0x8b7977.style.background = "";
  }
}
function autoFillTransferDetails() {
  const _0x547de5 = document.getElementById("in19mode").value;
  const _0x26fd64 = document.getElementById("in19detail");
  if (_0x547de5 === "NIL") {
    _0x26fd64.value = "";
    return;
  }
  const _0x5b34bf = document.getElementById("in19").value;
  if (!_0x5b34bf) {
    _0x26fd64.value = "";
    return;
  }
  const _0x545c40 = "2018-07-01";
  if (_0x5b34bf < _0x545c40) {
    _0x26fd64.value = "Local body/ inter district/inter division Samvilion";
  } else {
    _0x26fd64.value = "From tribal to education";
  }
}
function calcRetirementDate(_0x26e22e) {
  if (!_0x26e22e) {
    return "";
  }
  const _0x1846d6 = new Date(_0x26e22e);
  if (isNaN(_0x1846d6)) {
    return "";
  }
  const _0x59128e = _0x1846d6.getDate();
  const _0x4e83ba = _0x1846d6.getMonth();
  const _0x2a2e82 = _0x1846d6.getFullYear();
  let _0x32bc7a = _0x2a2e82 + 62;
  let _0x323ae7 = _0x4e83ba;
  if (_0x59128e === 1) {
    _0x323ae7 = _0x4e83ba - 1;
    if (_0x323ae7 < 0) {
      _0x323ae7 = 11;
      _0x32bc7a--;
    }
  }
  const _0x26900d = new Date(_0x32bc7a, _0x323ae7 + 1, 0);
  const _0x425bd0 = String(_0x26900d.getDate()).padStart(2, "0");
  const _0x50ac77 = String(_0x26900d.getMonth() + 1).padStart(2, "0");
  return _0x425bd0 + "-" + _0x50ac77 + "-" + _0x32bc7a;
}
function onDobChange() {
  const _0x4189ff = document.getElementById("in7").value;
  document.getElementById("retirementField").value = calcRetirementDate(_0x4189ff);
}
function calculateSeniority() {
  const _0x119102 = document.getElementById("in14").value;
  const _0x1e6c6e = document.getElementById("in16").value;
  const _0x1596c3 = document.getElementById("in17").dataset.raw || "";
  const _0x44f822 = document.getElementById("in19mode") ? document.getElementById("in19mode").value : "DATE";
  const _0x163be2 = _0x44f822 === "NIL" ? "" : document.getElementById("in19").value;
  const _0x4d9af2 = [_0x119102, _0x1e6c6e, _0x1596c3, _0x163be2].filter(_0x504e25 => _0x504e25 && _0x504e25 !== "NIL").map(_0x13f249 => new Date(_0x13f249)).filter(_0x92b3ba => !isNaN(_0x92b3ba));
  if (_0x4d9af2.length) {
    const _0x401148 = new Date(Math.max(..._0x4d9af2)).toISOString().split("T")[0];
    document.getElementById("in18").value = fmtDate(_0x401148);
    document.getElementById("in18").dataset.raw = _0x401148;
  }
}
function handleTransferMode() {
  const _0x560854 = document.getElementById("in19mode").value;
  const _0x2ed572 = document.getElementById("in19");
  const _0x5005c7 = document.getElementById("in19detail");
  if (_0x560854 === "NIL") {
    _0x2ed572.value = "";
    _0x2ed572.disabled = true;
    _0x2ed572.style.background = "#eee";
    _0x5005c7.value = "";
    calculateSeniority();
    checkTransferDocRequired();
  } else {
    _0x2ed572.disabled = false;
    _0x2ed572.style.background = "";
    checkTransferDocRequired();
  }
}
function checkTransferDocRequired() {
  const _0x1f84cd = document.getElementById("in19mode").value;
  const _0x3bf1e5 = document.getElementById("in19").value;
  const _0x336db3 = document.getElementById("transferDocAlert");
  const _0x5e867d = document.getElementById("transferDocViewBtn");
  const _0x1fbe37 = _0x1f84cd === "DATE" && _0x3bf1e5;
  if (_0x336db3) {
    if (_0x1fbe37) {
      _0x336db3.style.display = "block";
      const _0x232bff = currentTransferDocData && (currentTransferDocData.data || currentTransferDocData.url);
      const _0x25be87 = _0x336db3.childNodes[0];
      if (_0x232bff) {
        _0x336db3.style.background = "#e8f5e9";
        _0x336db3.style.border = "1.5px solid #4caf50";
        _0x336db3.style.color = "#2e7d32";
        if (_0x25be87) {
          _0x25be87.textContent = "✅ Transfer Document uploaded successfully!";
        }
      } else {
        _0x336db3.style.background = "#ffebee";
        _0x336db3.style.border = "1.5px solid #f44336";
        _0x336db3.style.color = "#c62828";
        if (_0x25be87) {
          _0x25be87.textContent = "🚫 Transfer/Samvilion Date भरी है — Transfer Document अपलोड करना अनिवार्य है!";
        }
      }
    } else {
      _0x336db3.style.display = "none";
    }
  }
  if (_0x5e867d) {
    _0x5e867d.style.display = currentDocData ? "inline-block" : "none";
  }
}
function viewTransferDoc(_0x23ba64) {
  if (_0x23ba64) {
    _0x23ba64.stopPropagation();
  }
  if (currentDocData && currentDocData.url && !currentDocData.data) {
    window.open(currentDocData.url, "_blank");
  } else if (currentDocData && currentDocData.data) {
    viewDocument(currentDocData);
  } else {
    myAlert("❌ No document has been uploaded.");
  }
}
function handleUPPLogic() {
  const _0x344891 = document.getElementById("in23").value;
  const _0x522500 = document.getElementById("in24");
  const _0x4714aa = document.getElementById("in25");
  const _0x1a55da = document.getElementById("in26");
  if (_0x344891 === "NO" || _0x344891 === "") {
    _0x522500.value = "";
    _0x4714aa.value = "";
    _0x1a55da.selectedIndex = 0;
    _0x522500.readOnly = true;
    _0x4714aa.readOnly = true;
    _0x1a55da.disabled = true;
    [_0x522500, _0x4714aa, _0x1a55da].forEach(_0x37f377 => {
      _0x37f377.style.pointerEvents = "none";
      _0x37f377.style.background = "#bdc3c7";
      _0x37f377.style.cursor = "not-allowed";
    });
  } else {
    _0x522500.readOnly = false;
    _0x4714aa.readOnly = false;
    _0x1a55da.disabled = false;
    [_0x522500, _0x4714aa, _0x1a55da].forEach(_0x4dc5a9 => {
      _0x4dc5a9.style.pointerEvents = "auto";
      _0x4dc5a9.style.background = "#fff";
      _0x4dc5a9.style.cursor = "";
    });
  }
}
function validateFieldGap(_0x146427) {
  const _0x37a366 = document.getElementById("in7").value;
  const _0x1f3fab = document.getElementById("in14").value;
  const _0x229b2d = document.getElementById("in16").value;
  const _0x4f6380 = document.getElementById("in16bMode") ? document.getElementById("in16bMode").value : "DATE";
  const _0x4dc778 = _0x4f6380 === "NIL" ? "" : document.getElementById("in16b").value;
  const _0x1d6dbb = new Date().toISOString().split("T")[0];
  let _0x35864e = [];
  if (_0x37a366 && _0x37a366 < "1963-04-01") {
    markInvalid("in7", "❌ Date of Birth cannot be before 01-04-1963.");
    _0x35864e.push("DOB: 01-04-1963 se pahle ki date nahi ho sakti");
  } else {
    markValid("in7");
  }
  if (_0x1f3fab && _0x1f3fab < "1998-06-17") {
    markInvalid("in14", "❌ First Appointment cannot be before 17-06-1998.");
    _0x35864e.push("First Appointment: 17-06-1998 se pahle ki date nahi ho sakti");
  } else if (!_0x35864e.some(_0x4cdcd4 => _0x4cdcd4.startsWith("DOB"))) {
    markValid("in14");
  }
  if (_0x37a366 && _0x1f3fab) {
    const _0x5bf5c0 = (new Date(_0x1f3fab) - new Date(_0x37a366)) / 31557600000;
    if (_0x5bf5c0 < 18) {
      markInvalid("in7", "❌ Minimum 18 years gap required between Date of Birth and First Appointment.");
      markInvalid("in14", "❌ Minimum 18 years gap required between Date of Birth and First Appointment.");
      _0x35864e.push("Minimum 18 years gap required between Date of Birth and First Appointment.");
    } else {
      if (!_0x35864e.some(_0x585b58 => _0x585b58.startsWith("DOB"))) {
        markValid("in7");
      }
      if (!_0x35864e.some(_0x11484 => _0x11484.startsWith("First Appointment"))) {
        markValid("in14");
      }
    }
  }
  if (_0x229b2d && _0x229b2d < "2007-04-02") {
    markInvalid("in16", "❌ 1st Promotion Date cannot be before 02-04-2007.");
    _0x35864e.push("1st Promotion Date: 02-04-2007 se pahle ki date nahi ho sakti");
  } else {
    markValid("in16");
  }
  if (_0x1f3fab && _0x229b2d) {
    const _0xf88498 = (new Date(_0x229b2d) - new Date(_0x1f3fab)) / 31557600000;
    if (_0xf88498 < 7) {
      markInvalid("in14", "❌ Minimum 7 years gap required between First Appointment and 1st Promotion.");
      markInvalid("in16", "❌ Minimum 7 years gap required between First Appointment and 1st Promotion.");
      _0x35864e.push("Minimum 7 years gap required between First Appointment and 1st Promotion.");
    } else {
      if (!document.getElementById("in14").classList.contains("invalid-field")) {
        markValid("in14");
      }
      if (!document.getElementById("in16").classList.contains("invalid-field")) {
        markValid("in16");
      }
    }
  }
  if (_0x229b2d && _0x4dc778) {
    const _0x58c7be = (new Date(_0x4dc778) - new Date(_0x229b2d)) / 31557600000;
    if (_0x58c7be < 5) {
      markInvalid("in16", "❌ Minimum 5 years gap required between 1st and 2nd Promotion.");
      markInvalid("in16b", "❌ Minimum 5 years gap required between 1st and 2nd Promotion.");
      _0x35864e.push("Minimum 5 years gap required between 1st and 2nd Promotion.");
    } else {
      if (!document.getElementById("in16").classList.contains("invalid-field")) {
        markValid("in16");
      }
      markValid("in16b");
    }
  }
  const _0x2f5921 = document.getElementById("in19mode") ? document.getElementById("in19mode").value : "DATE";
  const _0x1d1da5 = _0x2f5921 === "DATE" && document.getElementById("in19") ? document.getElementById("in19").value : "";
  if (_0x1f3fab && _0x1d1da5) {
    if (_0x1d1da5 <= _0x1f3fab) {
      markInvalid("in19", "❌ Transfer/Samvilion Date (Field 20) must be AFTER First Appointment Date (Field 14).");
      markInvalid("in14", "❌ First Appointment Date (Field 14) must be BEFORE Transfer/Samvilion Date (Field 20).");
      _0x35864e.push("Field 20 Transfer Date, Field 14 First Appointment Date se baad ki honi chahiye.");
    } else if (!document.getElementById("in19").classList.contains("invalid-field")) {
      markValid("in19");
    }
  }
  ["in7", "in14", "in16"].forEach(_0x3ad7e2 => {
    const _0x1099b5 = document.getElementById(_0x3ad7e2);
    if (_0x1099b5 && _0x1099b5.value && _0x1099b5.value > _0x1d6dbb) {
      markInvalid(_0x3ad7e2, "❌ Future dates are not allowed.");
      _0x35864e.push(_0x3ad7e2 + ": Future date nahi daal sakte");
    }
  });
  if (_0x4dc778) {
    if (_0x4dc778 > _0x1d6dbb) {
      markInvalid("in16b", "❌ Future dates are not allowed.");
      _0x35864e.push("2nd Promotion: Future date nahi daal sakte");
    }
  }
  return _0x35864e;
}
function markInvalid(_0x9c3dd3, _0x5362aa) {
  const _0xc5de18 = document.getElementById(_0x9c3dd3);
  if (!_0xc5de18) {
    return;
  }
  _0xc5de18.classList.add("invalid-field");
  _0xc5de18.title = _0x5362aa;
  _0xc5de18.style.outline = "2px solid red";
  if (!_0xc5de18._clearListenerAttached) {
    _0xc5de18._clearListenerAttached = true;
    const _0x3b0957 = function () {
      if (_0xc5de18.value && _0xc5de18.value.trim()) {
        markValid(_0x9c3dd3);
      }
    };
    _0xc5de18.addEventListener("input", _0x3b0957);
    _0xc5de18.addEventListener("change", _0x3b0957);
  }
}
function markValid(_0x343c4d) {
  const _0x1ff01e = document.getElementById(_0x343c4d);
  if (_0x1ff01e) {
    _0x1ff01e.classList.remove("invalid-field");
    _0x1ff01e.title = "";
    _0x1ff01e.style.outline = "";
  }
}
function checkDuplicateID(_0x576b8b) {
  if (!_0x576b8b.value) {
    return;
  }
  if (_0x576b8b.value.length !== 6) {
    myAlert("Unique ID must be exactly 6 characters!");
    _0x576b8b.value = "";
    _0x576b8b.focus();
    return;
  }
  if (!/^[A-Z]{2}[0-9]{4}$/.test(_0x576b8b.value)) {
    myAlert("❌ Invalid Unique ID format!\n\nFirst 2 characters must be alphabets (A-Z)\nLast 4 characters must be numbers (0-9)\n\nExample: AB1234");
    _0x576b8b.value = "";
    _0x576b8b.focus();
    return;
  }
  const _0x480150 = window.fullData.find(_0x42a722 => _0x42a722.field3 === _0x576b8b.value);
  if (_0x480150) {
    myAlert("This Unique ID Already Submitted!\nUse Search to Update.");
    _0x576b8b.value = "";
    _0x576b8b.focus();
  }
}
let currentDocData = null;
async function updateUploadStatus(_0x3d7f47) {
  const _0x21b4ef = _0x3d7f47.target.files[0];
  if (!_0x21b4ef) {
    return;
  }
  const _0x37e311 = 500;
  if (_0x21b4ef.size > _0x37e311 * 1024) {
    myAlert("❌ Document is too large!\n\nFile Size: " + (_0x21b4ef.size / 1024).toFixed(1) + " KB\nMaximum Allowed: " + _0x37e311 + " KB (500 KB)\n\nPlease compress the file and upload again.");
    _0x3d7f47.target.value = "";
    return;
  }
  var _0x59be0e = document.getElementById("fileNameDisplay");
  if (_0x59be0e) {
    _0x59be0e.textContent = "⏳ Uploading " + _0x21b4ef.name + "...";
  }
  const _0x26d127 = new FileReader();
  _0x26d127.onload = async function (_0x284c51) {
    currentDocData = {
      name: _0x21b4ef.name,
      data: _0x284c51.target.result,
      uploader: currentUser
    };
    var _0x3ff470 = document.getElementById("transferDocViewBtn");
    if (_0x3ff470) {
      _0x3ff470.style.display = "inline-block";
    }
    var _0x2ef955 = document.getElementById("in3");
    var _0x45a8f7 = _0x2ef955 && _0x2ef955.value.trim() ? _0x2ef955.value.trim().toUpperCase() : "";
    if (_0x45a8f7) {
      _ls.set("ums_docmeta_" + _0x45a8f7, JSON.stringify({
        name: _0x21b4ef.name,
        uploader: currentUser
      }));
      _ls.set("ums_docdata_" + _0x45a8f7, _0x284c51.target.result);
      var _0x14efaf = window.fullData && window.fullData.find(function (_0x16b7a7) {
        return (_0x16b7a7.field3 || "").trim().toUpperCase() === _0x45a8f7;
      });
      if (_0x14efaf) {
        _0x14efaf._doc = currentDocData;
      }
    }
    if (_0x45a8f7) {
      try {
        const _0x4ed585 = _dataURLtoBlob(_0x284c51.target.result);
        const _0x361762 = await _uploadToSupabaseStorage(_0x4ed585, "teacher-docs/" + _0x45a8f7 + "_" + _0x21b4ef.name, "ums-documents");
        if (_0x361762) {
          currentDocData.url = _0x361762;
          currentDocData.data = null;
          if (_ls.remove) {
            _ls.remove("ums_docdata_" + _0x45a8f7);
          }
          var _0xeb10d4 = window.fullData && window.fullData.find(function (_0x157192) {
            return (_0x157192.field3 || "").trim().toUpperCase() === _0x45a8f7;
          });
          if (_0xeb10d4) {
            _0xeb10d4._doc = currentDocData;
          }
          if (_0x59be0e) {
            _0x59be0e.textContent = "✅ Uploaded";
          }
        } else if (_0x59be0e) {
          _0x59be0e.textContent = "⚠️ Local only";
        }
      } catch (_0xc16eb) {
        console.warn("Doc upload exception:", _0xc16eb);
        if (_0x59be0e) {
          _0x59be0e.textContent = "⚠️ Local only";
        }
      }
    } else if (_0x59be0e) {
      _0x59be0e.textContent = "📄 Selected";
    }
  };
  _0x26d127.readAsDataURL(_0x21b4ef);
}
function _dataURLtoBlob(_0xa07779) {
  var _0x34c2f3 = _0xa07779.split(",");
  var _0x3fab0e = _0x34c2f3[0].match(/:(.*?);/)[1];
  var _0x41f5f9 = atob(_0x34c2f3[1]);
  var _0x2bdc3a = _0x41f5f9.length;
  var _0x4b4836 = new Uint8Array(_0x2bdc3a);
  while (_0x2bdc3a--) {
    _0x4b4836[_0x2bdc3a] = _0x41f5f9.charCodeAt(_0x2bdc3a);
  }
  return new Blob([_0x4b4836], {
    type: _0x3fab0e
  });
}
var currentTransferDocData = null;
async function updateTransferDocStatus(_0x6f6992) {
  const _0x2b6620 = _0x6f6992.target.files[0];
  if (!_0x2b6620) {
    return;
  }
  const _0xb6bfad = 100;
  if (_0x2b6620.size > _0xb6bfad * 1024) {
    myAlert("❌ Transfer Document is too large!\n\nFile Size: " + (_0x2b6620.size / 1024).toFixed(1) + " KB\nMaximum Allowed: " + _0xb6bfad + " KB (100 KB)\n\nPlease compress the file and upload again.");
    _0x6f6992.target.value = "";
    return;
  }
  var _0x15a47b = document.getElementById("transferFileNameDisplay");
  if (_0x15a47b) {
    _0x15a47b.textContent = "⏳ Uploading " + _0x2b6620.name + "...";
  }
  const _0x1f67bb = new FileReader();
  _0x1f67bb.onload = async function (_0x6d8d8d) {
    currentTransferDocData = {
      name: _0x2b6620.name,
      data: _0x6d8d8d.target.result,
      uploader: currentUser
    };
    var _0x3c9ad2 = document.getElementById("transferDocViewBtn2");
    if (_0x3c9ad2) {
      _0x3c9ad2.style.display = "inline-block";
    }
    checkTransferDocRequired();
    var _0x3877b9 = document.getElementById("in3");
    var _0x190f96 = _0x3877b9 && _0x3877b9.value.trim() ? _0x3877b9.value.trim().toUpperCase() : "";
    if (_0x190f96) {
      _ls.set("ums_tdmeta_" + _0x190f96, JSON.stringify({
        name: _0x2b6620.name,
        uploader: currentUser
      }));
      _ls.set("ums_tddata_" + _0x190f96, _0x6d8d8d.target.result);
      var _0x45879b = window.fullData && window.fullData.find(function (_0x375d25) {
        return (_0x375d25.field3 || "").trim().toUpperCase() === _0x190f96;
      });
      if (_0x45879b) {
        _0x45879b._transferDoc = currentTransferDocData;
      }
    }
    if (_0x190f96) {
      try {
        const _0x3b9491 = _dataURLtoBlob(_0x6d8d8d.target.result);
        const _0x241af8 = await _uploadToSupabaseStorage(_0x3b9491, "transfer-docs/td_" + _0x190f96 + "_" + _0x2b6620.name, "ums-documents");
        if (_0x241af8) {
          currentTransferDocData.url = _0x241af8;
          currentTransferDocData.data = null;
          if (_ls.remove) {
            _ls.remove("ums_tddata_" + _0x190f96);
          }
          var _0x422f95 = window.fullData && window.fullData.find(function (_0x3cfc4a) {
            return (_0x3cfc4a.field3 || "").trim().toUpperCase() === _0x190f96;
          });
          if (_0x422f95) {
            _0x422f95._transferDoc = currentTransferDocData;
          }
          if (_0x15a47b) {
            _0x15a47b.textContent = "✅ Uploaded";
          }
        } else if (_0x15a47b) {
          _0x15a47b.textContent = "⚠️ Local only";
        }
      } catch (_0x3ae1ea) {
        console.warn("Transfer doc upload exception:", _0x3ae1ea);
        if (_0x15a47b) {
          _0x15a47b.textContent = "⚠️ Local only";
        }
      }
    } else if (_0x15a47b) {
      _0x15a47b.textContent = "📄 Selected";
    }
  };
  _0x1f67bb.readAsDataURL(_0x2b6620);
}
function viewTransferDocNew(_0x165ffe) {
  if (_0x165ffe) {
    _0x165ffe.stopPropagation();
  }
  if (currentTransferDocData && currentTransferDocData.url && !currentTransferDocData.data) {
    window.open(currentTransferDocData.url, "_blank");
  } else if (currentTransferDocData && currentTransferDocData.data) {
    viewDocument(currentTransferDocData);
  } else {
    myAlert("❌ No transfer document has been uploaded.");
  }
}
function saveEntry(_0x4ccd05) {
  if (!currentUser) {
    myAlert("Please log in to continue.");
    return;
  }
  let _0x17c9e4 = [];
  const _0xb85ea6 = [["in3", "Field 3 — Unique ID"], ["in4", "Field 4 — Name"], ["in5", "Field 5 — Category"], ["in6", "Field 6 — Gender"], ["in7", "Field 7 — Date of Birth"], ["in8", "Field 8 — Mode of Appointment"], ["in9", "Field 9 — PG Subject"], ["in13", "Field 13 — Home District"], ["in14", "Field 14 — First Appointment Date"], ["in20", "Field 22 — Present Posting Place"], ["in21", "Field 23 — UDISE Code"], ["in22", "Field 24 — Present Posting District"], ["in23", "Field 25 — उच्च पद ज्वाइन (YES/NO)"], ["in27", "Field 29 — Remark"]];
  for (const [_0xf71eae, _0xc5d273] of _0xb85ea6) {
    const _0x55cc0e = (document.getElementById(_0xf71eae) || {}).value || "";
    if (!_0x55cc0e.trim()) {
      markInvalid(_0xf71eae, "❌ " + _0xc5d273 + " is required.");
      _0x17c9e4.push(_0xc5d273);
    } else {
      markValid(_0xf71eae);
    }
  }
  const _0x5407c4 = (document.getElementById("in8") || {}).value || "";
  if (_0x5407c4 === "PRO") {
    const _0x309c68 = (document.getElementById("in16") || {}).value || "";
    if (!_0x309c68.trim()) {
      markInvalid("in16", "❌ Field 16 — 1st Promotion Date is required for PRO mode.");
      _0x17c9e4.push("Field 16 — 1st Promotion Date");
    } else {
      markValid("in16");
    }
    const _0x19f375 = (document.getElementById("in16bMode") || {}).value || "DATE";
    if (_0x19f375 === "DATE") {
      const _0x4e6804 = (document.getElementById("in16b") || {}).value || "";
      if (!_0x4e6804.trim()) {
        markInvalid("in16b", "❌ Field 17 — Please enter 2nd Promotion Date or select NIL.");
        _0x17c9e4.push("Field 17 — 2nd Promotion Date (ya NIL select karein)");
      } else {
        markValid("in16b");
      }
    } else {
      markValid("in16b");
    }
  } else {
    markValid("in16");
    markValid("in16b");
  }
  if (!document.getElementById("in10").value) {
    markInvalid("in10", "❌ Field 10 — Please select Professional Qualification.");
    _0x17c9e4.push("Field 10 — Professional Qualification");
  } else {
    markValid("in10");
  }
  if (!document.getElementById("in11").value) {
    markInvalid("in11", "❌ Field 11 — Please select PG Qualification.");
    _0x17c9e4.push("Field 11 — PG Qualification");
  } else {
    markValid("in11");
  }
  if (!document.getElementById("in12").value) {
    markInvalid("in12", "❌ Field 12 — Please select PG Subject (Other).");
    _0x17c9e4.push("Field 12 — PG Subject (Other)");
  } else {
    markValid("in12");
  }
  const _0x474007 = (document.getElementById("in19mode") || {}).value || "DATE";
  if (_0x474007 === "DATE") {
    const _0x55a0a7 = (document.getElementById("in19") || {}).value || "";
    if (!_0x55a0a7.trim()) {
      markInvalid("in19", "❌ Field 20 — Transfer/Samvilion Date is required.");
      _0x17c9e4.push("Field 20 — Transfer/Samvilion Date");
    } else {
      markValid("in19");
      const _0x4f9d40 = currentTransferDocData && (currentTransferDocData.data || currentTransferDocData.url);
      if (!_0x4f9d40) {
        const _0x536401 = document.getElementById("transferDocAlert");
        if (_0x536401) {
          _0x536401.style.background = "#ffebee";
          _0x536401.style.border = "1.5px solid #f44336";
          _0x536401.style.color = "#c62828";
          _0x536401.style.display = "block";
        }
        _0x17c9e4.push("Field 20 — Transfer Document अनिवार्य — कृपया Transfer Document अपलोड करें");
      }
    }
  }
  if ((document.getElementById("in23") || {}).value === "YES") {
    if (!(document.getElementById("in24") || {}).value) {
      markInvalid("in24", "❌ Field 26 — Higher Post School Name is required.");
      _0x17c9e4.push("Field 26 — उच्च पद शाला नाम");
    } else {
      markValid("in24");
    }
    if (!(document.getElementById("in25") || {}).value) {
      markInvalid("in25", "❌ Field 27 — Higher Post UDISE Code is required.");
      _0x17c9e4.push("Field 27 — उच्च पद UDISE Code");
    } else {
      markValid("in25");
    }
    if (!(document.getElementById("in26") || {}).value) {
      markInvalid("in26", "❌ Field 28 — Please select Higher Post District.");
      _0x17c9e4.push("Field 28 — उच्च पद जिला");
    } else {
      markValid("in26");
    }
  }
  if (!document.getElementById("in27").value.trim()) {
    document.getElementById("in27").value = "NO";
  }
  const _0x3cdd1a = validateFieldGap();
  const _0x4812fa = [..._0x17c9e4, ..._0x3cdd1a];
  if (_0x4812fa.length) {
    myAlert("⚠️ Please fill in the following required fields:\n\n• " + _0x4812fa.join("\n• "));
    return;
  }
  const _0x46c9d0 = new Date().toLocaleString("en-IN");
  const _0x5279d2 = buildRowFromForm(_0x4ccd05, _0x46c9d0);
  if (_0x4ccd05) {
    window.fullData.push(_0x5279d2);
    window.filteredData.push(_0x5279d2);
    document.getElementById("in2").value = _0x5279d2.field2;
    renderVirtual();
    setTimeout(function () {
      const _0x48a113 = document.getElementById("tableContainer");
      if (_0x48a113) {
        _0x48a113.scrollTop = _0x48a113.scrollHeight;
      }
    }, 100);
    auditLog("NEW ADD", "Added: " + _0x5279d2.field3 + " — " + _0x5279d2.field4);
    if (typeof broadcastDataUpdate === "function") {
      broadcastDataUpdate(_realtimeDistrict() + " added a new record: " + _0x5279d2.field3 + " — " + _0x5279d2.field4, "update");
    }
    saveAndSync(_0x5279d2).then(_0x5d5503 => {
      renderVirtual();
      _addToRecent(_0x5279d2);
      myAlert(_0x5d5503 ? "✅ Record saved successfully.\n\n" + _0x5279d2.field4 + " (" + _0x5279d2.field3 + ")" : "⚠️ Record saved locally, but cloud sync failed.");
    });
    currentDocData = null;
    clearForm();
  }
}
function handleUpdateClick() {
  if (!currentUser) {
    myAlert("Please log in to continue.");
    return;
  }
  const _0x31e75c = document.getElementById("in3").value.trim().toUpperCase();
  if (!_0x31e75c) {
    myAlert("⚠️ Please enter a Unique ID first.");
    return;
  }
  const _0x3b51a7 = window.fullData.findIndex(_0x242a16 => _0x242a16.field3 === _0x31e75c);
  if (_0x3b51a7 < 0) {
    myAlert("❌ Record not found. Only existing records can be updated.");
    return;
  }
  if (window._originalFormSnapshot) {
    var _0x1259ca = captureFormSnapshot();
    var _0x408a03 = false;
    var _0x245031 = Object.keys(window._originalFormSnapshot);
    for (var _0x3c79f2 = 0; _0x3c79f2 < _0x245031.length; _0x3c79f2++) {
      var _0x52f146 = _0x245031[_0x3c79f2];
      if ((_0x1259ca[_0x52f146] || "") !== (window._originalFormSnapshot[_0x52f146] || "")) {
        _0x408a03 = true;
        break;
      }
    }
    if (!_0x408a03) {
      myAlert("ℹ️ No Changes Found!\n\nNo fields were modified.\nRecord was not updated.");
      return;
    }
  }
  let _0x233a80 = [];
  const _0x578280 = [["in3", "Field 3 — Unique ID"], ["in4", "Field 4 — Name"], ["in5", "Field 5 — Category"], ["in6", "Field 6 — Gender"], ["in7", "Field 7 — Date of Birth"], ["in8", "Field 8 — Mode of Appointment"], ["in9", "Field 9 — PG Subject"], ["in13", "Field 13 — Home District"], ["in14", "Field 14 — First Appointment Date"], ["in20", "Field 22 — Present Posting Place"], ["in21", "Field 23 — UDISE Code"], ["in22", "Field 24 — Present Posting District"], ["in23", "Field 25 — उच्च पद ज्वाइन (YES/NO)"], ["in27", "Field 29 — Remark"]];
  for (const [_0x43759f, _0xce376e] of _0x578280) {
    const _0x36b3cb = (document.getElementById(_0x43759f) || {}).value || "";
    if (!_0x36b3cb.trim()) {
      markInvalid(_0x43759f, "❌ " + _0xce376e + " is required.");
      _0x233a80.push(_0xce376e);
    } else {
      markValid(_0x43759f);
    }
  }
  const _0x49dae4 = (document.getElementById("in8") || {}).value || "";
  if (_0x49dae4 === "PRO") {
    const _0x152798 = (document.getElementById("in16") || {}).value || "";
    if (!_0x152798.trim()) {
      markInvalid("in16", "❌ Field 16 — 1st Promotion Date is required for PRO mode.");
      _0x233a80.push("Field 16 — 1st Promotion Date");
    } else {
      markValid("in16");
    }
    const _0x8bbf3f = (document.getElementById("in16bMode") || {}).value || "DATE";
    if (_0x8bbf3f === "DATE") {
      const _0x1d6e32 = (document.getElementById("in16b") || {}).value || "";
      if (!_0x1d6e32.trim()) {
        markInvalid("in16b", "❌ Field 17 — Please enter 2nd Promotion Date or select NIL.");
        _0x233a80.push("Field 17 — 2nd Promotion Date (ya NIL select karein)");
      } else {
        markValid("in16b");
      }
    } else {
      markValid("in16b");
    }
  } else {
    markValid("in16");
    markValid("in16b");
  }
  if (!document.getElementById("in10").value) {
    markInvalid("in10", "❌ Field 10 — Please select Professional Qualification.");
    _0x233a80.push("Field 10 — Professional Qualification");
  } else {
    markValid("in10");
  }
  if (!document.getElementById("in11").value) {
    markInvalid("in11", "❌ Field 11 — Please select PG Qualification.");
    _0x233a80.push("Field 11 — PG Qualification");
  } else {
    markValid("in11");
  }
  if (!document.getElementById("in12").value) {
    markInvalid("in12", "❌ Field 12 — Please select PG Subject (Other).");
    _0x233a80.push("Field 12 — PG Subject (Other)");
  } else {
    markValid("in12");
  }
  const _0x479772 = (document.getElementById("in19mode") || {}).value || "DATE";
  if (_0x479772 === "DATE") {
    const _0x184cfe = (document.getElementById("in19") || {}).value || "";
    if (!_0x184cfe.trim()) {
      markInvalid("in19", "❌ Field 20 — Transfer/Samvilion Date is required.");
      _0x233a80.push("Field 20 — Transfer/Samvilion Date");
    } else {
      markValid("in19");
      const _0x2e4050 = window.fullData[_0x3b51a7];
      const _0x113386 = _0x2e4050 && _0x2e4050._transferDoc && (_0x2e4050._transferDoc.url || _0x2e4050._transferDoc.data || _0x2e4050._transferDoc.name);
      const _0x304686 = currentTransferDocData && (currentTransferDocData.data || currentTransferDocData.url);
      if (!_0x113386 && !_0x304686) {
        const _0xdea077 = document.getElementById("transferDocAlert");
        if (_0xdea077) {
          _0xdea077.style.display = "block";
          _0xdea077.style.background = "#ffebee";
          _0xdea077.style.border = "1.5px solid #f44336";
          _0xdea077.style.color = "#c62828";
        }
        _0x233a80.push("Field 20 — Transfer Document अनिवार्य — कृपया Transfer Document अपलोड करें");
      }
    }
  }
  if ((document.getElementById("in23") || {}).value === "YES") {
    if (!(document.getElementById("in24") || {}).value) {
      markInvalid("in24", "❌ Field 26 — Higher Post School Name is required.");
      _0x233a80.push("Field 26 — उच्च पद शाला नाम");
    } else {
      markValid("in24");
    }
    if (!(document.getElementById("in25") || {}).value) {
      markInvalid("in25", "❌ Field 27 — Higher Post UDISE Code is required.");
      _0x233a80.push("Field 27 — उच्च पद UDISE Code");
    } else {
      markValid("in25");
    }
    if (!(document.getElementById("in26") || {}).value) {
      markInvalid("in26", "❌ Field 28 — Please select Higher Post District.");
      _0x233a80.push("Field 28 — उच्च पद जिला");
    } else {
      markValid("in26");
    }
  }
  if (!document.getElementById("in27").value.trim()) {
    document.getElementById("in27").value = "NO";
  }
  const _0x54746f = validateFieldGap();
  const _0x3d9815 = [..._0x233a80, ..._0x54746f];
  if (_0x3d9815.length) {
    myAlert("⚠️ Please fill in the following required fields:\n\n• " + _0x3d9815.join("\n• "));
    return;
  }
  const _0x10e553 = new Date().toLocaleString("en-IN");
  const _0x3fcfa6 = Object.assign({}, window.fullData[_0x3b51a7]);
  const _0x4f8741 = buildRowFromForm(false, _0x10e553);
  _0x4f8741.field1 = window.fullData[_0x3b51a7].field1;
  _0x4f8741.field2 = window.fullData[_0x3b51a7].field2;
  _0x4f8741._sbId = window.fullData[_0x3b51a7]._sbId;
  _0x4f8741._doc = window.fullData[_0x3b51a7]._doc;
  var _0x3ead6f = new Set([29, 30, 31]);
  function _0x2491ba(_0x5912ab) {
    if (!_0x5912ab) {
      return "";
    }
    _0x5912ab = String(_0x5912ab).trim();
    if (!_0x5912ab || _0x5912ab === "NIL" || _0x5912ab === "NIL/NIL/NIL" || _0x5912ab === "0" || _0x5912ab === "NO") {
      return "";
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(_0x5912ab)) {
      return _0x5912ab;
    }
    var _0x437060 = _0x5912ab.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
    if (_0x437060) {
      return _0x437060[3] + "-" + _0x437060[2].padStart(2, "0") + "-" + _0x437060[1].padStart(2, "0");
    }
    return _0x5912ab;
  }
  var _0x5d3806 = new Set([23, 27]);
  function _0xcf5346(_0x4b9473) {
    if (!_0x4b9473) {
      return "";
    }
    return String(_0x4b9473).trim().toUpperCase().replace(/^DEO\s+/, "").replace(/^JD\s+/, "").trim();
  }
  var _0x2e7a36 = _0x3fcfa6._changedFields || {};
  var _0x14d36f = Object.assign({}, _0x2e7a36);
  for (var _0x46c2bb = 0; _0x46c2bb < colConfig.length; _0x46c2bb++) {
    if (_0x3ead6f.has(_0x46c2bb)) {
      continue;
    }
    var _0x589167 = "field" + (_0x46c2bb + 1);
    var _0x5e33ae;
    var _0x5a0313;
    if (DATE_COLS.has(_0x46c2bb)) {
      _0x5e33ae = _0x2491ba(_0x3fcfa6[_0x589167]);
      _0x5a0313 = _0x2491ba(_0x4f8741[_0x589167]);
    } else if (_0x5d3806.has(_0x46c2bb)) {
      _0x5e33ae = _0xcf5346(_0x3fcfa6[_0x589167]);
      _0x5a0313 = _0xcf5346(_0x4f8741[_0x589167]);
    } else {
      _0x5e33ae = (_0x3fcfa6[_0x589167] || "").toString().trim();
      _0x5a0313 = (_0x4f8741[_0x589167] || "").toString().trim();
    }
    if (_0x5e33ae !== _0x5a0313) {
      var _0x40d847 = _0x2e7a36[_0x46c2bb] ? _0x2e7a36[_0x46c2bb].from : (_0x3fcfa6[_0x589167] || "").toString().trim();
      var _0x4c8b18 = DATE_COLS.has(_0x46c2bb) ? _0x2491ba(_0x40d847) : _0x5d3806.has(_0x46c2bb) ? _0xcf5346(_0x40d847) : _0x40d847.trim();
      if (_0x4c8b18 === _0x5a0313) {
        delete _0x14d36f[_0x46c2bb];
      } else {
        _0x14d36f[_0x46c2bb] = {
          from: _0x40d847,
          to: (_0x4f8741[_0x589167] || "").toString().trim()
        };
      }
    } else if (_0x14d36f[_0x46c2bb] !== undefined) {
      var _0x49158e = _0x14d36f[_0x46c2bb];
      var _0xdb798c = DATE_COLS.has(_0x46c2bb) ? _0x2491ba(_0x49158e.from || "") : _0x5d3806.has(_0x46c2bb) ? _0xcf5346(_0x49158e.from || "") : (_0x49158e.from || "").trim();
      var _0x1301d8 = DATE_COLS.has(_0x46c2bb) ? _0x2491ba(_0x5a0313) : _0x5d3806.has(_0x46c2bb) ? _0xcf5346(_0x5a0313) : _0x5a0313;
      if (_0xdb798c === _0x1301d8) {
        delete _0x14d36f[_0x46c2bb];
      }
    }
  }
  _0x4f8741._changedFields = Object.keys(_0x14d36f).length > 0 ? _0x14d36f : undefined;
  var _0x2156e0 = {};
  var _0x5013b8 = {};
  for (var _0x1d667b = 1; _0x1d667b <= 29; _0x1d667b++) {
    var _0x174d23 = "field" + _0x1d667b;
    var _0x262ff7 = (_0x3fcfa6[_0x174d23] || "").toString().trim();
    var _0x7a292d = (_0x4f8741[_0x174d23] || "").toString().trim();
    function _0x49ef68(_0x1cf2d0) {
      var _0x3d5140 = _0x1cf2d0.match(/^(\d{2})-(\d{2})-(\d{4})$/);
      if (_0x3d5140) {
        return _0x3d5140[3] + "-" + _0x3d5140[2] + "-" + _0x3d5140[1];
      }
      return _0x1cf2d0;
    }
    var _0x3e9248 = _0x49ef68(_0x262ff7);
    var _0x7daa26 = _0x49ef68(_0x7a292d);
    function _0x397a5c(_0x2229ae) {
      return !_0x2229ae || _0x2229ae === "-" || _0x2229ae === "--" || _0x2229ae === "---" || _0x2229ae === "----" || _0x2229ae.toLowerCase() === "nil" || _0x2229ae.toLowerCase() === "null";
    }
    var _0x6a205a = _0x397a5c(_0x3e9248) && _0x397a5c(_0x7daa26);
    if (!_0x6a205a && _0x3e9248.toLowerCase() !== _0x7daa26.toLowerCase()) {
      _0x2156e0[_0x174d23] = _0x262ff7;
      _0x5013b8[_0x174d23] = _0x7a292d;
    }
  }
  _0x4f8741.history_log = _0x3fcfa6.history_log ? [..._0x3fcfa6.history_log] : [];
  _0x4f8741.history_log.push({
    time: _0x10e553,
    user: currentUser,
    before: JSON.stringify(_0x2156e0),
    after: JSON.stringify(_0x5013b8)
  });
  window.fullData[_0x3b51a7] = _0x4f8741;
  window.filteredData = window.filteredData.map(_0x5ec897 => _0x5ec897.field3 === _0x31e75c ? _0x4f8741 : _0x5ec897);
  auditLog("UPDATE", "Updated: " + _0x31e75c);
  if (typeof broadcastDataUpdate === "function") {
    broadcastDataUpdate(_realtimeDistrict() + " updated record: " + _0x31e75c, "update");
  }
  renderVirtual();
  saveAndSync(_0x4f8741).then(_0x440c66 => {
    myAlert(_0x440c66 ? "✅ Record updated successfully.\n\n" + _0x4f8741.field4 : "⚠️ Record updated locally, but cloud sync failed.");
  });
  currentDocData = null;
  currentTransferDocData = null;
  toggleForm(false);
  highlightUpdatedRow(_0x31e75c, _0x3fcfa6, _0x4f8741);
}
function buildRowFromForm(_0x2ae59a, _0x27fe9e) {
  const _0x5ed24c = _0x2ae59a ? window.fullData.length + 1 : null;
  const _0x4732b1 = document.getElementById("in19mode").value;
  const _0x2bb94e = _0x4732b1 === "NIL" ? "NIL" : document.getElementById("in19").value;
  const _0x462513 = document.getElementById("in16bMode") ? document.getElementById("in16bMode").value : "DATE";
  const _0x5bd6bd = _0x462513 === "NIL" ? "NIL" : document.getElementById("in16b").value;
  let _0x19f48e = null;
  if (currentDocData) {
    _0x19f48e = currentDocData;
  } else if (!_0x2ae59a) {
    const _0x36b573 = window.fullData.find(_0x570e61 => _0x570e61.field3 === document.getElementById("in3").value);
    if (_0x36b573) {
      _0x19f48e = _0x36b573._doc || null;
    }
  }
  let _0x2b72f4 = null;
  if (currentTransferDocData) {
    _0x2b72f4 = currentTransferDocData;
  } else if (!_0x2ae59a) {
    const _0x2f78a1 = window.fullData.find(_0x479439 => _0x479439.field3 === document.getElementById("in3").value);
    if (_0x2f78a1) {
      _0x2b72f4 = _0x2f78a1._transferDoc || null;
    }
  }
  let _0xaaf24f = "";
  if (_0x2ae59a) {
    const _0x4ad075 = (document.getElementById("in2").value || "").trim();
    _0xaaf24f = _0x4ad075 !== "" ? _0x4ad075 : "NEW ENTRY";
  }
  return {
    field1: _0x2ae59a ? String(_0x5ed24c) : (window.fullData.find(_0x9b9c2f => _0x9b9c2f.field3 === document.getElementById("in3").value) || {}).field1 || String(window.fullData.length),
    field2: _0x2ae59a ? _0xaaf24f : document.getElementById("in2").value || "",
    field3: document.getElementById("in3").value,
    field4: document.getElementById("in4").value,
    field5: document.getElementById("in5").value,
    field6: document.getElementById("in6").value,
    field7: document.getElementById("in7").value,
    field8: document.getElementById("in8").value,
    field9: document.getElementById("in9").value,
    field10: document.getElementById("in10").value,
    field11: document.getElementById("in11").value,
    field12: document.getElementById("in12").value,
    field13: document.getElementById("in13").value,
    field14: document.getElementById("in14").value,
    field15: document.getElementById("in15").value,
    field16: document.getElementById("in16").value || "NIL",
    field17: _0x5bd6bd || "NIL",
    field18: document.getElementById("in17").dataset.raw || document.getElementById("in17").value.split("-").reverse().join("-"),
    field19: document.getElementById("in18").dataset.raw || document.getElementById("in18").value.split("-").reverse().join("-"),
    field20: _0x2bb94e,
    field21: _0x4732b1 === "NIL" ? "NIL" : document.getElementById("in19detail").value || "",
    field22: document.getElementById("in20").value,
    field23: document.getElementById("in21").value,
    field24: document.getElementById("in22").value,
    field25: document.getElementById("in23").value,
    field26: document.getElementById("in24").value,
    field27: document.getElementById("in25").value,
    field28: document.getElementById("in26").value,
    field29: function () {
      var _0x38ed90 = document.getElementById("in27").value || "NO";
      var _0x4cd36a = extractProbationData(_0x38ed90);
      return _0x4cd36a.cleanRemark || _0x38ed90;
    }(),
    field30: _0x2ae59a ? "New Entry" : "Updated",
    field31: (_0x2ae59a ? "New Entry" : "Updated") + " by " + currentUser + " | " + _0x27fe9e,
    field32: _0x19f48e ? _0x19f48e.name : "",
    _doc: _0x19f48e,
    _transferDoc: _0x2b72f4
  };
}
function deleteEntry() {
  if (!currentUser) {
    myAlert("Please log in to continue.");
    return;
  }
  const _0x54c038 = document.getElementById("in3").value;
  if (!_0x54c038) {
    myAlert("Please search and select a record first.");
    return;
  }
  const _0x5b1d26 = document.getElementById("in27").value.trim();
  if (!_0x5b1d26 || _0x5b1d26.length <= 2) {
    myAlert("Please select a deletion reason in the Remark field.\n\nExample: Retired, BRS, Death, Terminated etc.");
    document.getElementById("in27").focus();
    return;
  }
  if (!confirm("SOFT DELETE this record?\n\nUnique ID: " + _0x54c038 + "\nName: " + document.getElementById("in4").value + "\n\nRecord delete nahi hoga — sirf DELETED mark ho jayega.")) {
    return;
  }
  const _0x4ec7bc = window.fullData.findIndex(_0x1b7b3b => _0x1b7b3b.field3 === _0x54c038);
  if (_0x4ec7bc < 0) {
    myAlert("❌ Record not found.");
    return;
  }
  const _0x5c2ebe = new Date().toLocaleString("en-IN");
  const _0x43e129 = window.fullData[_0x4ec7bc];
  _0x43e129.field30 = "Deleted";
  _0x43e129.field31 = "Deleted by " + currentUser + " | " + _0x5c2ebe;
  _0x43e129.field29 = _0x5b1d26;
  _0x43e129._softDeleted = true;
  const _0x3b0342 = window.filteredData.findIndex(_0xa082e2 => _0xa082e2.field3 === _0x54c038);
  if (_0x3b0342 >= 0) {
    window.filteredData[_0x3b0342] = _0x43e129;
  }
  auditLog("DELETE", "Soft Deleted: " + _0x54c038 + " — Reason: " + _0x5b1d26);
  if (typeof broadcastDataUpdate === "function") {
    broadcastDataUpdate(_realtimeDistrict() + " deleted record: " + _0x54c038, "delete");
  }
  renderVirtual();
  saveAndSync(_0x43e129).then(_0x398996 => {
    myAlert(_0x398996 ? "🗑 Record marked as deleted.\n\nUnique ID: " + _0x54c038 + "\nThe row is highlighted in red." : "⚠️ Deletion applied locally, but cloud sync failed.");
  });
  toggleForm(false);
}
function captureFormSnapshot() {
  var _0x1124fe = {};
  ["in3", "in4", "in5", "in6", "in7", "in8", "in9", "in13", "in14", "in15", "in16", "in16b", "in17", "in18", "in19", "in19detail", "in20", "in21", "in22", "in23", "in24", "in25", "in26", "in27"].forEach(function (_0x54b9ce) {
    var _0x5aee5f = document.getElementById(_0x54b9ce);
    _0x1124fe[_0x54b9ce] = _0x5aee5f ? _0x5aee5f.value : "";
  });
  ["in10", "in11", "in12"].forEach(function (_0xc14a3d) {
    var _0x222014 = document.getElementById(_0xc14a3d);
    _0x1124fe[_0xc14a3d] = _0x222014 ? _0x222014.value : "";
  });
  var _0x1e8317 = document.getElementById("in16bMode");
  _0x1124fe.in16bMode = _0x1e8317 ? _0x1e8317.value : "";
  var _0x487ec1 = document.getElementById("in19mode");
  _0x1124fe.in19mode = _0x487ec1 ? _0x487ec1.value : "";
  return _0x1124fe;
}
function performSearch() {
  const _0x5c36b5 = document.getElementById("searchVal").value.trim().toUpperCase();
  if (!_0x5c36b5) {
    return;
  }
  const _0x39834b = window.fullData.find(_0x13181a => _0x13181a.field3 === _0x5c36b5);
  if (!_0x39834b) {
    if (_0x5c36b5.length >= 6) {
      myAlert("❌ Record not found. Please check the Unique ID and try again.");
    }
    return;
  }
  document.getElementById("in1").value = _0x39834b.field1;
  document.getElementById("in2").value = _0x39834b.field2;
  document.getElementById("in3").value = _0x39834b.field3;
  document.getElementById("in4").value = _0x39834b.field4;
  document.getElementById("in5").value = _0x39834b.field5;
  document.getElementById("in6").value = _0x39834b.field6;
  document.getElementById("in7").value = toInputDate(_0x39834b.field7);
  onDobChange();
  document.getElementById("in8").value = _0x39834b.field8;
  document.getElementById("in9").value = _0x39834b.field9;
  filterMS12ByField9();
  setMSValues(10, _0x39834b.field10);
  setMSValues(11, _0x39834b.field11);
  setMSValues(12, _0x39834b.field12);
  document.getElementById("in13").value = _0x39834b.field13;
  document.getElementById("in14").value = toInputDate(_0x39834b.field14);
  document.getElementById("in15").value = _0x39834b.field15;
  document.getElementById("in16").value = toInputDate(_0x39834b.field16 === "NIL" ? "" : _0x39834b.field16);
  const _0x37e3f9 = _0x39834b.field17 || "";
  if (_0x37e3f9 === "NIL" || _0x37e3f9 === "") {
    if (document.getElementById("in16bMode")) {
      document.getElementById("in16bMode").value = "NIL";
    }
    document.getElementById("in16b").value = "";
    handlePromo2Mode();
  } else {
    if (document.getElementById("in16bMode")) {
      document.getElementById("in16bMode").value = "DATE";
    }
    document.getElementById("in16b").value = toInputDate(_0x37e3f9);
    if (document.getElementById("in16b").disabled) {
      document.getElementById("in16b").disabled = false;
      document.getElementById("in16b").style.background = "";
    }
  }
  const _0x93ade3 = toInputDate(_0x39834b.field18 || "");
  document.getElementById("in17").value = fmtDate(_0x93ade3 || _0x39834b.field18 || "");
  document.getElementById("in17").dataset.raw = _0x93ade3;
  const _0x4c4562 = toInputDate(_0x39834b.field19 || "");
  document.getElementById("in18").value = fmtDate(_0x4c4562 || _0x39834b.field19 || "");
  document.getElementById("in18").dataset.raw = _0x4c4562;
  if (_0x39834b.field20 === "NIL" || !_0x39834b.field20) {
    document.getElementById("in19mode").value = "NIL";
    document.getElementById("in19").value = "";
  } else {
    document.getElementById("in19mode").value = "DATE";
    document.getElementById("in19").value = toInputDate(_0x39834b.field20) || _0x39834b.field20;
  }
  handleTransferMode();
  checkTransferDocRequired();
  document.getElementById("in19detail").value = _0x39834b.field21 || "";
  document.getElementById("in20").value = _0x39834b.field22 || "";
  document.getElementById("in21").value = _0x39834b.field23 || "";
  (function () {
    const _0x4b5a87 = document.getElementById("in22");
    const _0x33bf0d = (_0x39834b.field24 || "").trim();
    if (!_0x33bf0d) {
      _0x4b5a87.value = "";
      return;
    }
    if (Array.from(_0x4b5a87.options).some(_0x558cbb => _0x558cbb.value === _0x33bf0d)) {
      _0x4b5a87.value = _0x33bf0d;
      return;
    }
    const _0x5ca86e = Array.from(_0x4b5a87.options).find(_0x1ac699 => _0x1ac699.value.toUpperCase() === _0x33bf0d.toUpperCase());
    if (_0x5ca86e) {
      _0x4b5a87.value = _0x5ca86e.value;
      return;
    }
    const _0x5b1477 = Array.from(_0x4b5a87.options).find(_0x236629 => _0x236629.value.toUpperCase().includes(_0x33bf0d.toUpperCase()) || _0x33bf0d.toUpperCase().includes(_0x236629.value.toUpperCase()));
    if (_0x5b1477) {
      _0x4b5a87.value = _0x5b1477.value;
      return;
    }
    const _0x2520b2 = document.createElement("option");
    _0x2520b2.value = _0x33bf0d;
    _0x2520b2.textContent = _0x33bf0d + " *";
    _0x4b5a87.appendChild(_0x2520b2);
    _0x4b5a87.value = _0x33bf0d;
  })();
  document.getElementById("in24").value = _0x39834b.field26 || "";
  document.getElementById("in25").value = _0x39834b.field27 || "";
  (function () {
    const _0x17b524 = document.getElementById("in26");
    const _0x2bfa36 = (_0x39834b.field28 || "").trim();
    if (!_0x2bfa36) {
      _0x17b524.selectedIndex = 0;
      return;
    }
    if (Array.from(_0x17b524.options).some(_0x4ed85c => _0x4ed85c.value === _0x2bfa36)) {
      _0x17b524.value = _0x2bfa36;
      return;
    }
    const _0x3bd0e3 = Array.from(_0x17b524.options).find(_0x4faa25 => _0x4faa25.value.toUpperCase() === _0x2bfa36.toUpperCase());
    if (_0x3bd0e3) {
      _0x17b524.value = _0x3bd0e3.value;
      return;
    }
    const _0x3b6690 = Array.from(_0x17b524.options).find(_0x247391 => _0x247391.value.toUpperCase().includes(_0x2bfa36.toUpperCase()) || _0x2bfa36.toUpperCase().includes(_0x247391.value.toUpperCase()));
    if (_0x3b6690) {
      _0x17b524.value = _0x3b6690.value;
      return;
    }
    const _0x305414 = document.createElement("option");
    _0x305414.value = _0x2bfa36;
    _0x305414.textContent = _0x2bfa36;
    _0x17b524.appendChild(_0x305414);
    _0x17b524.value = _0x2bfa36;
  })();
  (function () {
    var _0x26cabb = (_0x39834b.field25 || "").toString().trim().toUpperCase();
    if (_0x26cabb !== "YES") {
      _0x26cabb = "NO";
    }
    var _0x50dae9 = document.getElementById("in23");
    _0x50dae9.value = _0x26cabb;
    var _0x12f23a = document.getElementById("in24");
    var _0x9139e9 = document.getElementById("in25");
    var _0x5aa11b = document.getElementById("in26");
    if (_0x26cabb === "YES") {
      _0x12f23a.readOnly = false;
      _0x9139e9.readOnly = false;
      _0x5aa11b.disabled = false;
      [_0x12f23a, _0x9139e9, _0x5aa11b].forEach(function (_0x1b2549) {
        _0x1b2549.style.pointerEvents = "auto";
        _0x1b2549.style.background = "#fff";
        _0x1b2549.style.cursor = "";
      });
    } else {
      _0x12f23a.readOnly = true;
      _0x9139e9.readOnly = true;
      _0x5aa11b.disabled = true;
      [_0x12f23a, _0x9139e9, _0x5aa11b].forEach(function (_0x3a784e) {
        _0x3a784e.style.pointerEvents = "none";
        _0x3a784e.style.background = "#bdc3c7";
        _0x3a784e.style.cursor = "not-allowed";
      });
    }
  })();
  document.getElementById("in27").value = _0x39834b.field29 || "NO";
  var _0x323dbe = document.getElementById("inUpdatedBy");
  if (_0x323dbe) {
    _0x323dbe.value = _0x39834b.field31 || "";
  }
  if (_0x39834b._doc && _0x39834b._doc.name) {
    var _0x11fc5a = document.getElementById("fileNameDisplay");
    var _0x4eed14 = _0x39834b._doc.url ? "✅ Uploaded" : "📄 On file";
    if (_0x11fc5a) {
      _0x11fc5a.textContent = _0x4eed14;
    }
    currentDocData = _0x39834b._doc;
    var _0xe65fa8 = document.getElementById("transferDocViewBtn");
    if (_0xe65fa8) {
      _0xe65fa8.style.display = "inline-block";
    }
  }
  if (_0x39834b._transferDoc && _0x39834b._transferDoc.name) {
    var _0x4f1c54 = document.getElementById("transferFileNameDisplay");
    var _0x39f3e2 = _0x39834b._transferDoc.url ? "✅ Uploaded" : "📄 On file";
    if (_0x4f1c54) {
      _0x4f1c54.textContent = _0x39f3e2;
    }
    currentTransferDocData = _0x39834b._transferDoc;
    var _0x21ca75 = document.getElementById("transferDocViewBtn2");
    if (_0x21ca75) {
      _0x21ca75.style.display = "inline-block";
    }
  }
  populateProbationFromRecord(_0x39834b);
  autoDesignationLogic();
  (function () {
    var _0x4ab3dc = (_0x39834b.field25 || "").toString().trim().toUpperCase();
    if (_0x4ab3dc !== "YES") {
      _0x4ab3dc = "NO";
    }
    if (_0x4ab3dc === "YES") {
      var _0x17402c = document.getElementById("in24");
      var _0x397c0c = document.getElementById("in25");
      var _0x1623c5 = document.getElementById("in26");
      if (!_0x17402c.value) {
        _0x17402c.value = _0x39834b.field26 || "";
      }
      if (!_0x397c0c.value) {
        _0x397c0c.value = _0x39834b.field27 || "";
      }
      _0x17402c.readOnly = false;
      _0x397c0c.readOnly = false;
      _0x1623c5.disabled = false;
      [_0x17402c, _0x397c0c, _0x1623c5].forEach(function (_0x166873) {
        _0x166873.style.pointerEvents = "auto";
        _0x166873.style.background = "#fff";
        _0x166873.style.cursor = "";
      });
    }
  })();
  document.getElementById("newAddBtn").disabled = true;
  document.getElementById("newAddBtn").style.opacity = ".45";
  document.getElementById("updateBtn").style.display = "inline-block";
  document.getElementById("deleteBtn").style.display = "inline-block";
  document.getElementById("formStatusBadge").textContent = "EDIT MODE";
  document.getElementById("formStatusBadge").style.background = "#e65100";
  toggleForm(true, true);
  highlightRow(_0x39834b.field3);
  _addToRecent(_0x39834b);
  window._originalFormSnapshot = captureFormSnapshot();
}
function highlightRow(_0x4cb949) {
  const _0x882b64 = _getVSData();
  const _0x1ec11b = _0x882b64.findIndex(_0x16f5fc => _0x16f5fc.field3 === _0x4cb949);
  if (_0x1ec11b < 0) {
    return;
  }
  const _0x5017ac = document.getElementById("tableContainer");
  if (_0x5017ac) {
    const _0x16efdd = _0x1ec11b * VS.ROW_H;
    const _0x5de63a = _0x5017ac.clientHeight;
    _0x5017ac.scrollTop = Math.max(0, _0x16efdd - _0x5de63a / 2 + VS.ROW_H / 2);
    VS._lastStart = -1;
    _vsRender(true);
  }
  setTimeout(function () {
    document.querySelectorAll("#tableBody tr").forEach(_0x22dd31 => {
      _0x22dd31.classList.remove("selected-row");
      if (_0x22dd31.dataset.id === _0x4cb949) {
        _0x22dd31.classList.add("selected-row");
      }
    });
  }, 50);
}
function printFormRecord() {
  function _0x3657e9(_0x3e90b4) {
    var _0x161d80 = document.getElementById(_0x3e90b4);
    if (!_0x161d80) {
      return "";
    }
    return (_0x161d80.value || "").trim();
  }
  function _0x266b5c(_0x2aa8b5) {
    if (!_0x2aa8b5) {
      return "—";
    }
    var _0x328581 = _0x2aa8b5.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (_0x328581) {
      return _0x328581[3] + "-" + _0x328581[2] + "-" + _0x328581[1];
    }
    return _0x2aa8b5 || "—";
  }
  function _0x4989b3(_0x2be99f) {
    if (_0x2be99f && _0x2be99f.trim()) {
      return _0x2be99f.trim();
    } else {
      return "—";
    }
  }
  function _0x192717() {
    var _0x140e6d = document.getElementById("in16bMode");
    var _0x5a3391 = document.getElementById("in16b");
    if (!_0x140e6d || !_0x5a3391) {
      return "—";
    }
    if (_0x140e6d.value === "NIL") {
      return "NIL";
    }
    return _0x266b5c(_0x5a3391.value) || "—";
  }
  function _0x32f66e() {
    var _0x2d47d0 = document.getElementById("in19mode");
    var _0x575586 = document.getElementById("in19");
    if (!_0x2d47d0 || !_0x575586) {
      return "—";
    }
    if (_0x2d47d0.value === "NIL") {
      return "NIL";
    }
    return _0x266b5c(_0x575586.value) || "—";
  }
  var _0x10838f = _0x4989b3(_0x3657e9("in1"));
  var _0x4b4f4e = _0x4989b3(_0x3657e9("in2"));
  var _0x4afe7d = _0x4989b3(_0x3657e9("in3"));
  var _0x445d97 = _0x4989b3(_0x3657e9("in4"));
  var _0x5518d5 = _0x4989b3(_0x3657e9("in5"));
  var _0x3c9522 = _0x4989b3(_0x3657e9("in6"));
  var _0x253354 = _0x266b5c(_0x3657e9("in7"));
  var _0x403c13 = _0x4989b3(_0x3657e9("retirementField"));
  var _0x5d9439 = _0x4989b3(_0x3657e9("in8"));
  var _0x144e64 = _0x4989b3(_0x3657e9("in9"));
  var _0x3f99b9 = _0x4989b3(_0x3657e9("in10"));
  var _0x262ad4 = _0x4989b3(_0x3657e9("in11"));
  var _0x24342d = _0x4989b3(_0x3657e9("in12"));
  var _0x18cfa4 = _0x4989b3(_0x3657e9("in13"));
  var _0x1b041a = _0x266b5c(_0x3657e9("in14"));
  var _0xe40760 = _0x4989b3(_0x3657e9("in15"));
  var _0x38103c = _0x266b5c(_0x3657e9("in16"));
  var _0x5e2de8 = _0x192717();
  var _0x17ccb2 = _0x4989b3(_0x3657e9("in17"));
  var _0x1fd746 = _0x4989b3(_0x3657e9("in18"));
  var _0x40af17 = _0x32f66e();
  var _0x1c5e41 = _0x4989b3(_0x3657e9("in19detail"));
  var _0xd5ab35 = _0x4989b3(_0x3657e9("in20"));
  var _0x2657aa = _0x4989b3(_0x3657e9("in21"));
  var _0x10ffdb = _0x4989b3(_0x3657e9("in22"));
  var _0x29d591 = _0x4989b3(_0x3657e9("in23"));
  var _0x4036f3 = _0x4989b3(_0x3657e9("in24"));
  var _0x397c25 = _0x4989b3(_0x3657e9("in25"));
  var _0x3752ea = _0x4989b3(_0x3657e9("in26"));
  var _0x144bcc = _0x4989b3(_0x3657e9("in27"));
  var _0x23bbc1 = _0x4989b3(_0x3657e9("inUpdatedBy"));
  var _0x224fe5 = window._currentUserVal || window.currentUser || "UNKNOWN";
  var _0x48b10d = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata"
  });
  function _0x2c648f(_0x24a072, _0x3fa766, _0x22850c, _0x206517, _0x419ef3, _0x774e2e) {
    return "<tr><td class=\"num\">" + _0x24a072 + "</td><td class=\"lbl\">" + _0x3fa766 + "</td><td class=\"val\">" + _0x22850c + "</td><td class=\"num\">" + _0x206517 + "</td><td class=\"lbl\">" + _0x419ef3 + "</td><td class=\"val\">" + _0x774e2e + "</td></tr>";
  }
  function _0x14bf66(_0x2cf737, _0x307971, _0x437610) {
    return "<tr><td class=\"num\">" + _0x2cf737 + "</td><td class=\"lbl lbl-wide\">" + _0x307971 + "</td><td class=\"val val-wide\" colspan=\"4\">" + _0x437610 + "</td></tr>";
  }
  function _0x1ee4cc(_0x12a34d) {
    return "<tr><td colspan=\"6\" class=\"sec\">" + _0x12a34d + "</td></tr>";
  }
  var _0x325181 = "<!DOCTYPE html><html lang=\"hi\"><head><meta charset=\"UTF-8\"><title>लोक सेवक विवरण — " + _0x445d97 + "</title><style>*{box-sizing:border-box;margin:0;padding:0;}body{font-family:Arial,\"Noto Sans Devanagari\",sans-serif;font-size:9pt;color:#000;background:#fff;}@page{size:A4 portrait;margin:8mm 10mm 8mm 10mm;}@media print{body{-webkit-print-color-adjust:exact;}}.hdr{text-align:center;border-bottom:2px solid #000;padding-bottom:6px;margin-bottom:7px;}.hdr-logo{font-size:11pt;font-weight:900;letter-spacing:.5px;text-transform:uppercase;}.hdr-sub{font-size:8.5pt;font-weight:normal;margin-top:2px;}.hdr-dept{font-size:7.5pt;color:#333;margin-top:2px;}.hdr-title{display:inline-block;margin-top:5px;border:2px solid #000;padding:3px 16px;font-size:11pt;font-weight:900;letter-spacing:.6px;background:#000;color:#fff;}table{width:100%;border-collapse:collapse;table-layout:fixed;}td{border:1px solid #888;padding:3px 5px;vertical-align:middle;word-break:break-word;line-height:1.3;}.num{width:24px;text-align:center;font-weight:700;font-size:8pt;background:#e8e8e8;white-space:nowrap;border:1px solid #888;}.lbl{width:28%;font-weight:700;font-size:7.8pt;color:#000;}.val{font-size:8.5pt;color:#000;font-weight:600;}.lbl-wide{width:22%;}.val-wide{font-size:8.5pt;font-weight:600;}.sec{background:#222;color:#fff;font-weight:700;font-size:7.8pt;padding:3px 7px;letter-spacing:.4px;text-transform:uppercase;}.ftr{margin-top:6px;border-top:1.5px solid #000;padding-top:4px;display:flex;justify-content:space-between;align-items:flex-end;font-size:7.5pt;}.sig{border:1px solid #000;min-height:36px;min-width:160px;text-align:center;font-size:7pt;color:#666;padding-top:3px;}</style></head><body><div class=\"hdr\"><div class=\"hdr-logo\">लोक शिक्षण संचालनालय, मध्यप्रदेश</div><div class=\"hdr-sub\">Directorate of Public Instruction (DPI) — Madhya Pradesh</div><div class=\"hdr-dept\">उच्च माध्यमिक शिक्षक वरिष्ठता प्रबंधन प्रणाली (UMS Gradation ERP 2026)</div><div><span class=\"hdr-title\">लोक सेवक व्यक्तिगत विवरण पत्र</span></div></div><table>" + _0x1ee4cc("1. पहचान एवं व्यक्तिगत विवरण") + _0x2c648f("1", "S.NO.", _0x10838f, "2", "GRADATION NO.", _0x4b4f4e) + _0x2c648f("3", "UNIQUE ID", _0x4afe7d, "4", "NAME", _0x445d97) + _0x2c648f("5", "CATEGORY", _0x5518d5, "6", "GENDER", _0x3c9522) + _0x2c648f("7", "DATE OF BIRTH", _0x253354, "R", "RETIREMENT DATE (62 वर्ष)", _0x403c13) + _0x1ee4cc("2. नियुक्ति एवं शैक्षणिक योग्यता") + _0x2c648f("8", "MODE OF APPOINTMENT (PRO / DIR)", _0x5d9439, "9", "PG SUBJECT (AS PER APPT. & PROMOTION ORDER)", _0x144e64) + _0x2c648f("10", "PROFESSIONAL QUALIFICATION", _0x3f99b9, "11", "PG QUALIFICATION", _0x262ad4) + _0x14bf66("12", "PG SUBJECT (OTHER)", _0x24342d) + _0x14bf66("13", "HOME DISTRICT", _0x18cfa4) + _0x1ee4cc("3. प्रथम नियुक्ति एवं पदोन्नति") + _0x2c648f("14", "DATE OF FIRST APPOINTMENT", _0x1b041a, "15", "FIRST APPOINTMENT DESIGNATION", _0xe40760) + _0x2c648f("16", "1ST PROMOTION DATE", _0x38103c, "17", "2ND PROMOTION DATE (NIL or Date)", _0x5e2de8) + _0x2c648f("18", "DATE OF APPOINTMENT IN PRESENT CADRE", _0x17ccb2, "19", "DATE OF SENIORITY IN PRESENT CADRE", _0x1fd746) + _0x1ee4cc("4. संविलयन / स्थानान्तरण एवं वर्तमान पदस्थापना") + _0x2c648f("20", "SAMVILION / TRANSFER (JOINING DATE)", _0x40af17, "21", "TRANSFER DETAILS", _0x1c5e41) + _0x14bf66("22", "PRESENT POSTING PLACE (SCHOOL NAME)", _0xd5ab35) + _0x2c648f("23", "UDISE CODE", _0x2657aa, "24", "PRESENT POSTING DISTRICT", _0x10ffdb) + _0x1ee4cc("5. उच्च पद प्रभार विवरण") + _0x2c648f("25", "उच्च पद पर ज्वाइन किया (YES / NO)", _0x29d591, "26", "उच्च पद प्रभार की शाला का नाम", _0x4036f3) + _0x2c648f("27", "उच्च पद प्रभार की शाला का UDISE कोड", _0x397c25, "28", "उच्च पद प्रभार का जिला", _0x3752ea) + _0x1ee4cc("6. अभ्युक्ति एवं अद्यतन विवरण") + _0x14bf66("29", "REMARK (DEPUTATION OR OTHER ISSUE ETC.)", _0x144bcc) + _0x14bf66("F", "UPDATED BY / STATUS", _0x23bbc1) + "</table><div class=\"ftr\"><div><strong>मुद्रित किया गया:</strong> " + _0x224fe5 + " &nbsp;|&nbsp; <strong>दिनांक/समय:</strong> " + _0x48b10d + "</div><div class=\"sig\">कार्यालयीन हस्ताक्षर / Signature<br>&nbsp;</div></div></body></html>";
  var _0x42aabe = window.open("", "_blank", "width=850,height=1000,scrollbars=yes");
  if (!_0x42aabe) {
    alert("Popup blocked!\nBrowser में popup allow करें और फिर PRINT दबाएं।");
    return;
  }
  _0x42aabe.document.open();
  _0x42aabe.document.write(_0x325181);
  _0x42aabe.document.close();
  setTimeout(function () {
    try {
      _0x42aabe.focus();
      _0x42aabe.print();
    } catch (_0x3b9ecc) {}
  }, 800);
}
function toggleForm(_0xefb8f5, _0x4a563e) {
  document.getElementById("formOverlay").style.display = _0xefb8f5 ? "block" : "none";
  if (!_0xefb8f5 && selectedRowElement && typeof unlockRow === "function") {
    unlockRow(selectedRowElement.dataset.id);
  }
  if (_0xefb8f5 && !_0x4a563e) {
    clearForm();
    document.getElementById("in3").focus();
  }
}
function clearForm() {
  for (let _0x229b13 = 1; _0x229b13 <= 27; _0x229b13++) {
    const _0x15fce8 = document.getElementById("in" + _0x229b13);
    if (_0x15fce8 && !_0x15fce8.readOnly && !_0x15fce8.disabled) {
      if (_0x15fce8.tagName === "SELECT") {
        _0x15fce8.selectedIndex = 0;
      } else {
        _0x15fce8.value = "";
      }
      _0x15fce8.classList.remove("invalid-field");
      _0x15fce8.style.outline = "";
    }
  }
  document.getElementById("in1").value = "";
  document.getElementById("in2").value = "";
  document.getElementById("in15").value = "";
  document.getElementById("in27").value = "NO";
  document.getElementById("in16b").value = "";
  document.getElementById("in16b").disabled = false;
  document.getElementById("in16b").style.background = "";
  if (document.getElementById("in16bMode")) {
    document.getElementById("in16bMode").value = "DATE";
  }
  document.getElementById("in17").value = "";
  document.getElementById("in18").value = "";
  document.getElementById("in19detail").value = "";
  document.getElementById("retirementField").value = "";
  var _0x13939c = document.getElementById("inUpdatedBy");
  if (_0x13939c) {
    _0x13939c.value = "";
  }
  [10, 11, 12].forEach(_0x164e16 => {
    const _0x197307 = document.getElementById("ms" + _0x164e16);
    if (_0x197307) {
      _0x197307.querySelectorAll("input[type=checkbox]").forEach(_0x12bf12 => _0x12bf12.checked = false);
    }
    updateMS(_0x164e16);
  });
  document.getElementById("promo1Row").style.display = "flex";
  document.getElementById("promo2Row").style.display = "none";
  document.getElementById("newAddBtn").disabled = false;
  document.getElementById("newAddBtn").style.opacity = "1";
  document.getElementById("updateBtn").style.display = "none";
  document.getElementById("deleteBtn").style.display = "none";
  document.getElementById("formStatusBadge").textContent = "NEW ENTRY";
  document.getElementById("formStatusBadge").style.background = "#1b5e20";
  document.getElementById("searchVal").value = "";
  document.getElementById("in19mode").value = "DATE";
  document.getElementById("in19").disabled = false;
  document.getElementById("in19").style.background = "";
  var _0x4c99b4 = document.getElementById("fileNameDisplay");
  if (_0x4c99b4) {
    _0x4c99b4.textContent = "🚫 Feature Disabled";
  }
  var _0x2b782f = document.getElementById("fileInput");
  if (_0x2b782f) {
    _0x2b782f.value = "";
  }
  currentDocData = null;
  var _0x45bfb6 = document.getElementById("transferFileNameDisplay");
  if (_0x45bfb6) {
    _0x45bfb6.textContent = "";
  }
  var _0x2bd494 = document.getElementById("transferFileInput");
  if (_0x2bd494) {
    _0x2bd494.value = "";
  }
  var _0x2d730e = document.getElementById("transferDocViewBtn2");
  if (_0x2d730e) {
    _0x2d730e.style.display = "none";
  }
  currentTransferDocData = null;
  handleUPPLogic();
  checkTransferDocRequired();
  resetProbationSection();
}
function checkProbationSection() {
  var _0x5130ed = document.getElementById("in14").value;
  var _0x3df1d6 = document.getElementById("probationSection");
  if (!_0x3df1d6) {
    return;
  }
  if (_0x5130ed && _0x5130ed >= "2020-01-01") {
    _0x3df1d6.style.display = "block";
    var _0x42c4d6 = document.getElementById("probOrderDate");
    if (_0x42c4d6 && _0x5130ed) {
      var _0x5046ad = _0x5130ed.split("-");
      var _0x4822ae = parseInt(_0x5046ad[0]) + 3 + "-" + _0x5046ad[1] + "-" + _0x5046ad[2];
      _0x42c4d6.setAttribute("min", _0x4822ae);
      if (_0x42c4d6.value && _0x42c4d6.value < _0x4822ae) {
        _0x42c4d6.value = "";
      }
    }
  } else {
    _0x3df1d6.style.display = "none";
    resetProbationSection();
  }
}
function handleProbationToggle() {
  var _0x3ea1ed = document.getElementById("probYes");
  var _0x53c49f = document.getElementById("probationDetails");
  if (!_0x53c49f) {
    return;
  }
  _0x53c49f.style.display = _0x3ea1ed && _0x3ea1ed.checked ? "block" : "none";
}
function handleProbDocUpload(_0x55089c) {
  var _0x270fbf = _0x55089c.target.files && _0x55089c.target.files[0];
  var _0x58c16c = document.getElementById("probDocFileName");
  if (_0x58c16c) {
    _0x58c16c.textContent = _0x270fbf ? _0x270fbf.name : "कोई फ़ाइल नहीं चुनी";
  }
}
function resetProbationSection() {
  var _0x4204ac = document.getElementById("probationSection");
  if (_0x4204ac) {
    _0x4204ac.style.display = "none";
  }
  var _0x11d56f = document.getElementById("probNo");
  if (_0x11d56f) {
    _0x11d56f.checked = true;
  }
  var _0x35805d = document.getElementById("probationDetails");
  if (_0x35805d) {
    _0x35805d.style.display = "none";
  }
  var _0x3e2f2b = document.getElementById("probOrderNo");
  if (_0x3e2f2b) {
    _0x3e2f2b.value = "";
  }
  var _0x3b1798 = document.getElementById("probOrderDate");
  if (_0x3b1798) {
    _0x3b1798.value = "";
  }
  var _0x3783ad = document.getElementById("probDocFile");
  if (_0x3783ad) {
    _0x3783ad.value = "";
  }
  var _0x1a73e4 = document.getElementById("probDocFileName");
  if (_0x1a73e4) {
    _0x1a73e4.textContent = "कोई फ़ाइल नहीं चुनी";
  }
}
function populateProbationFromRecord(_0x3e29e5) {
  var _0x4866d4 = _0x3e29e5.field29 || "";
  resetProbationSection();
  checkProbationSection();
  var _0xe21df3 = document.getElementById("probationSection");
  if (!_0xe21df3 || _0xe21df3.style.display === "none") {
    return;
  }
  var _0x40c36e = _0x4866d4.match(/__PROB__({.*?})__END__/);
  if (_0x40c36e) {
    try {
      var _0x20f58c = JSON.parse(_0x40c36e[1]);
      if (_0x20f58c.status === "YES") {
        document.getElementById("probYes").checked = true;
        handleProbationToggle();
        if (_0x20f58c.orderNo) {
          document.getElementById("probOrderNo").value = _0x20f58c.orderNo;
        }
        if (_0x20f58c.orderDate) {
          document.getElementById("probOrderDate").value = _0x20f58c.orderDate;
        }
        if (_0x20f58c.docName) {
          document.getElementById("probDocFileName").textContent = _0x20f58c.docName;
        }
      } else {
        document.getElementById("probNo").checked = true;
        handleProbationToggle();
      }
    } catch (_0x2c1ff4) {}
  }
}
function extractProbationData(_0x18dc96) {
  var _0x53b373 = document.getElementById("probationSection");
  var _0x421f41 = (_0x18dc96 || "").replace(/__PROB__{.*?}__END__/g, "").trim();
  if (!_0x53b373 || _0x53b373.style.display === "none") {
    return {
      probationJSON: null,
      cleanRemark: _0x421f41
    };
  }
  var _0x13055a = document.getElementById("probYes");
  var _0x3fc05e = _0x13055a && _0x13055a.checked ? "YES" : "NO";
  var _0x1dbad9 = {
    status: _0x3fc05e
  };
  if (_0x3fc05e === "YES") {
    _0x1dbad9.orderNo = (document.getElementById("probOrderNo") || {}).value || "";
    _0x1dbad9.orderDate = (document.getElementById("probOrderDate") || {}).value || "";
    var _0x33986c = document.getElementById("probDocFile");
    var _0x4c4841 = (document.getElementById("probDocFileName") || {}).textContent || "";
    _0x1dbad9.docName = _0x33986c && _0x33986c.files && _0x33986c.files[0] ? _0x33986c.files[0].name : _0x4c4841 !== "कोई फ़ाइल नहीं चुनी" ? _0x4c4841 : "";
  }
  var _0x2ca3c8 = "__PROB__" + JSON.stringify(_0x1dbad9) + "__END__";
  var _0xf8fd57 = _0x421f41 ? _0x421f41 + " " + _0x2ca3c8 : _0x2ca3c8;
  return {
    probationJSON: _0x1dbad9,
    cleanRemark: _0xf8fd57
  };
}
function fmtDate(_0x4d9892) {
  if (!_0x4d9892 || _0x4d9892 === "NIL" || _0x4d9892 === "NO") {
    return _0x4d9892 || "";
  }
  const _0x223424 = String(_0x4d9892).trim();
  const _0x26a33f = _0x223424.split("-");
  if (_0x26a33f.length === 3 && _0x26a33f[0].length === 4) {
    return _0x26a33f[2] + "-" + _0x26a33f[1] + "-" + _0x26a33f[0];
  }
  const _0x40fbe3 = _0x223424.split("/");
  if (_0x40fbe3.length === 3) {
    return _0x40fbe3[0] + "-" + _0x40fbe3[1] + "-" + _0x40fbe3[2];
  }
  return _0x4d9892;
}
function toInputDate(_0xde4690) {
  if (!_0xde4690 || _0xde4690 === "NIL" || _0xde4690 === "NO" || _0xde4690 === "NIL/NIL/NIL") {
    return "";
  }
  const _0x151976 = String(_0xde4690).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(_0x151976)) {
    return _0x151976;
  }
  const _0x351313 = _0x151976.match(/^(\d{1,2})[-\/\.](\d{1,2})[-\/\.](\d{4})$/);
  if (_0x351313) {
    return _0x351313[3] + "-" + _0x351313[2].padStart(2, "0") + "-" + _0x351313[1].padStart(2, "0");
  }
  const _0x3b4782 = _0x151976.match(/^(\d{4})\/(\d{2})\/(\d{2})$/);
  if (_0x3b4782) {
    return _0x3b4782[1] + "-" + _0x3b4782[2] + "-" + _0x3b4782[3];
  }
  return "";
}
function escHtml(_0xc225a1) {
  return String(_0xc225a1).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
const DATE_COLS = new Set([6, 13, 15, 16, 17, 18, 19]);
function buildChangedHTML(_0x292f27, _0x5691c5) {
  var _0x566bf2 = _0x5691c5 && _0x5691c5.includes("-");
  var _0xa16f6c = _0x566bf2 ? "-" : "/";
  var _0xd32e60 = _0x292f27 ? _0x292f27.split(_0xa16f6c).map(function (_0x28c8c5) {
    return _0x28c8c5.trim();
  }) : [];
  var _0x344493 = _0x5691c5 ? _0x5691c5.split(_0xa16f6c).map(function (_0x9e0a48) {
    return _0x9e0a48.trim();
  }) : [];
  var _0x530ec1 = _0x344493.map(function (_0x68ef5) {
    if (!_0x68ef5) {
      return "";
    }
    if (_0xd32e60.indexOf(_0x68ef5) !== -1) {
      return escHtml(_0x68ef5);
    }
    return "<mark class=\"changed-text\">" + escHtml(_0x68ef5) + "</mark>";
  }).join("<span style=\"color:#999\">" + _0xa16f6c + "</span>");
  if (_0x530ec1 === escHtml(_0x5691c5)) {
    _0x530ec1 = "<mark class=\"changed-text\">" + escHtml(_0x5691c5) + "</mark>";
  }
  return _0x530ec1;
}
const VS = {
  ROW_H: 26,
  BUFFER: 15,
  _lastStart: -1,
  _lastEnd: -1,
  _spacerTop: null,
  _spacerBot: null,
  _container: null,
  _bound: false
};
function _getVSData() {
  if (window.filteredData && window.filteredData.length) {
    return window.filteredData;
  } else {
    return _getBaseData();
  }
}
function _buildRow(_0x3f2350, _0x52ad77, _0x5a3449) {
  const _0x587586 = document.createElement("tr");
  _0x587586.style.cursor = "pointer";
  if (_0x3f2350._softDeleted || (_0x3f2350.field30 || "").toLowerCase().includes("delete")) {
    _0x587586.classList.add("soft-deleted");
  }
  _0x587586.dataset.id = _0x3f2350.field3 || "row_" + _0x52ad77;
  _0x587586.onclick = function () {
    document.querySelectorAll("#tableBody tr.selected-row").forEach(_0x52b13e => _0x52b13e.classList.remove("selected-row"));
    _0x587586.classList.add("selected-row");
    addToRecent(_0x3f2350.field3, _0x3f2350.field4, _0x3f2350.field24);
    if (selectedRowElement && selectedRowElement !== _0x587586 && typeof unlockRow === "function") {
      unlockRow(selectedRowElement.dataset.id);
    }
    selectedRowElement = _0x587586;
    if (typeof lockRow === "function") {
      lockRow(_0x587586.dataset.id);
    }
  };
  _0x587586.ondblclick = function () {
    document.getElementById("searchVal").value = _0x3f2350.field3;
    performSearch();
  };
  colConfig.forEach((_0x565036, _0x266659) => {
    const _0x22cd23 = document.createElement("td");
    const _0x17f514 = _0x3f2350["field" + (_0x266659 + 1)] || "";
    _0x22cd23.title = String(_0x17f514);
    if (_0x266659 === 0) {
      _0x22cd23.textContent = _0x52ad77 + 1;
    } else if (_0x266659 === 1) {
      const _0x9d913f = _0x3f2350.field2 || "";
      _0x22cd23.textContent = _0x9d913f || _0x52ad77 + 1;
      if (!_0x9d913f) {
        _0x22cd23.style.color = "#bbb";
      }
    } else if (_0x266659 === 29) {
      const _0xf2bdfb = _0x3f2350.field30 || "";
      const _0x4519d7 = _0xf2bdfb === "Deleted" ? "badge-deleted" : _0xf2bdfb.includes("New") ? "badge-new" : "badge-updated";
      _0x22cd23.innerHTML = "<span class=\"badge " + _0x4519d7 + "\">" + (_0xf2bdfb || "-") + "</span>";
    } else if (_0x266659 === 30) {
      const _0x4f981b = _0x3f2350.field31 || "";
      _0x22cd23.innerHTML = "<span class=\"" + (_0x4f981b.includes("Updated") ? "update-highlight" : "") + "\">" + _0x4f981b + "</span>";
    } else if (_0x266659 === 31) {
      if (_0x3f2350._doc && _0x3f2350._doc.data) {
        const _0x3a01db = document.createElement("button");
        _0x3a01db.innerHTML = "🗂 View Doc";
        _0x3a01db.title = _0x3f2350._doc.name || "";
        _0x3a01db.style.cssText = "padding:3px 8px;background:#1565c0;color:white;border:none;border-radius:3px;cursor:pointer;font-size:10px;font-weight:bold;white-space:nowrap;";
        _0x3a01db.onclick = function (_0x5e1c79) {
          return function (_0x2df4b5) {
            _0x2df4b5.stopPropagation();
            if (_0x5e1c79._doc && _0x5e1c79._doc.url && !_0x5e1c79._doc.data) {
              window.open(_0x5e1c79._doc.url, "_blank");
            } else {
              viewDocument(_0x5e1c79._doc);
            }
          };
        }(_0x3f2350);
        _0x22cd23.appendChild(_0x3a01db);
      } else if (_0x3f2350._doc && _0x3f2350._doc.name || _0x3f2350.field32) {
        var _0x5c13ea = _0x3f2350._doc && _0x3f2350._doc.name || _0x3f2350.field32 || "";
        var _0xb5bee9 = document.createElement("div");
        _0xb5bee9.style.cssText = "display:flex;align-items:center;gap:4px;flex-wrap:wrap;";
        var _0x197125 = document.createElement("button");
        _0x197125.textContent = "View";
        _0x197125.title = "Click to view — agar data available hai";
        _0x197125.style.cssText = "padding:2px 6px;background:#1565c0;color:white;border:none;border-radius:3px;cursor:pointer;font-size:10px;font-weight:bold;";
        _0x197125.onclick = function (_0x1c4dea, _0x555875) {
          return function (_0x4e78b0) {
            _0x4e78b0.stopPropagation();
            if (_0x1c4dea._doc && _0x1c4dea._doc.url && !_0x1c4dea._doc.data) {
              window.open(_0x1c4dea._doc.url, "_blank");
              return;
            }
            if (_0x1c4dea._doc && _0x1c4dea._doc.data) {
              viewDocument(_0x1c4dea._doc);
              return;
            }
            var _0x16a5b1 = (_0x1c4dea.field3 || "").trim().toUpperCase();
            var _0x33ecbb = _ls.get("ums_docdata_" + _0x16a5b1) || _ls.get("ums_doc_" + _0x16a5b1);
            if (_0x33ecbb) {
              try {
                var _0x4b5d65 = _0x33ecbb.startsWith("{") ? JSON.parse(_0x33ecbb) : null;
                var _0x29fbb0 = _0x4b5d65 ? _0x4b5d65.data : _0x33ecbb;
                _0x1c4dea._doc = _0x1c4dea._doc || {};
                _0x1c4dea._doc.data = _0x29fbb0;
                _0x1c4dea._doc.name = _0x555875;
                viewDocument(_0x1c4dea._doc);
              } catch (_0x11e6e3) {
                myAlert("❌ Document data not found. Please re-upload the document by editing this record.");
              }
            } else {
              myAlert("⚠️ \"" + _0x555875 + "\" — This document was not uploaded from this browser.\n\nPlease edit the record and re-upload the document.");
            }
          };
        }(_0x3f2350, _0x5c13ea);
        _0xb5bee9.appendChild(_0x197125);
        _0x22cd23.appendChild(_0xb5bee9);
      } else {
        _0x22cd23.innerHTML = "<span style=\"color:#ddd;font-size:10px;\">—</span>";
      }
    } else if (_0x266659 === 32) {
      if (_0x3f2350._transferDoc && _0x3f2350._transferDoc.data) {
        var _0x2dab54 = document.createElement("button");
        _0x2dab54.innerHTML = "🚌 View Doc";
        _0x2dab54.title = _0x3f2350._transferDoc.name || "";
        _0x2dab54.style.cssText = "padding:3px 8px;background:#e65100;color:white;border:none;border-radius:3px;cursor:pointer;font-size:10px;font-weight:bold;white-space:nowrap;";
        _0x2dab54.onclick = function (_0x3095ff) {
          return function (_0x485f9c) {
            _0x485f9c.stopPropagation();
            if (_0x3095ff._transferDoc && _0x3095ff._transferDoc.url && !_0x3095ff._transferDoc.data) {
              window.open(_0x3095ff._transferDoc.url, "_blank");
            } else {
              viewDocument(_0x3095ff._transferDoc);
            }
          };
        }(_0x3f2350);
        _0x22cd23.appendChild(_0x2dab54);
      } else if (_0x3f2350._transferDoc && _0x3f2350._transferDoc.name) {
        var _0x6286cf = _0x3f2350._transferDoc && _0x3f2350._transferDoc.name || "";
        var _0x23c64a = document.createElement("div");
        _0x23c64a.style.cssText = "display:flex;align-items:center;gap:4px;flex-wrap:wrap;";
        var _0x502933 = document.createElement("button");
        _0x502933.textContent = "View";
        _0x502933.style.cssText = "padding:2px 6px;background:#e65100;color:white;border:none;border-radius:3px;cursor:pointer;font-size:10px;font-weight:bold;";
        _0x502933.onclick = function (_0x521539, _0x2e5de9) {
          return function (_0x4a586c) {
            _0x4a586c.stopPropagation();
            if (_0x521539._transferDoc && _0x521539._transferDoc.url && !_0x521539._transferDoc.data) {
              window.open(_0x521539._transferDoc.url, "_blank");
              return;
            }
            if (_0x521539._transferDoc && _0x521539._transferDoc.data) {
              viewDocument(_0x521539._transferDoc);
              return;
            }
            var _0x413856 = (_0x521539.field3 || "").trim().toUpperCase();
            var _0x4b52a2 = _ls.get("ums_tddata_" + _0x413856);
            if (_0x4b52a2) {
              _0x521539._transferDoc = _0x521539._transferDoc || {};
              _0x521539._transferDoc.data = _0x4b52a2;
              _0x521539._transferDoc.name = _0x2e5de9;
              viewDocument(_0x521539._transferDoc);
            } else {
              myAlert("⚠️ Transfer document data not found. Please edit the record and re-upload.");
            }
          };
        }(_0x3f2350, _0x6286cf);
        _0x23c64a.appendChild(_0x502933);
        _0x22cd23.appendChild(_0x23c64a);
      } else {
        _0x22cd23.innerHTML = "<span style=\"color:#ddd;font-size:10px;\">—</span>";
      }
    } else if (DATE_COLS.has(_0x266659)) {
      var _0x4b9ab9 = _0x17f514;
      if ((_0x266659 === 15 || _0x266659 === 16) && !_0x4b9ab9) {
        _0x4b9ab9 = "NIL";
      }
      var _0x4e8f8b = fmtDate(_0x4b9ab9);
      var _0xf198e0 = _0x3f2350._changedFields && _0x3f2350._changedFields[_0x266659];
      if (_0xf198e0 !== undefined && _0xf198e0 !== null) {
        var _0x214e3b = fmtDate(_0xf198e0.from || "");
        if (_0x214e3b !== _0x4e8f8b && _0xf198e0.from !== _0x4e8f8b) {
          _0x22cd23.innerHTML = buildChangedHTML(_0xf198e0.from || "", _0x4e8f8b);
        } else {
          _0x22cd23.textContent = _0x4e8f8b;
        }
      } else {
        _0x22cd23.textContent = _0x4e8f8b;
      }
    } else {
      var _0x19324e = _0x3f2350._changedFields && _0x3f2350._changedFields[_0x266659];
      if (_0x19324e !== undefined && _0x19324e !== null) {
        if (_0x19324e.from !== _0x17f514) {
          _0x22cd23.innerHTML = buildChangedHTML(_0x19324e.from || "", _0x17f514);
        } else {
          _0x22cd23.textContent = _0x17f514;
        }
      } else {
        _0x22cd23.textContent = _0x17f514;
      }
    }
    _0x587586.appendChild(_0x22cd23);
  });
  return _0x587586;
}
function _vsRender(_0x13ed38) {
  const _0x4ff9e8 = _getVSData();
  const _0x48ffe2 = document.getElementById("tableBody");
  const _0x58e473 = document.getElementById("tableContainer");
  if (!_0x48ffe2 || !_0x58e473) {
    return;
  }
  const _0xad0f64 = _0x4ff9e8.length;
  const _0x53e507 = _0xad0f64 * VS.ROW_H;
  const _0x131513 = _0x58e473.scrollTop;
  const _0x644ae3 = _0x58e473.clientHeight;
  let _0x2fa58 = Math.max(0, Math.floor(_0x131513 / VS.ROW_H) - VS.BUFFER);
  let _0x5810a6 = Math.min(_0xad0f64, Math.ceil((_0x131513 + _0x644ae3) / VS.ROW_H) + VS.BUFFER);
  if (!_0x13ed38 && _0x2fa58 === VS._lastStart && _0x5810a6 === VS._lastEnd) {
    return;
  }
  VS._lastStart = _0x2fa58;
  VS._lastEnd = _0x5810a6;
  if (!VS._spacerTop || !_0x48ffe2.contains(VS._spacerTop)) {
    VS._spacerTop = document.createElement("tr");
    VS._spacerTop.id = "_vsSpacerTop";
    VS._spacerBot = document.createElement("tr");
    VS._spacerBot.id = "_vsSpacerBot";
    _0x48ffe2.innerHTML = "";
    _0x48ffe2.appendChild(VS._spacerTop);
    _0x48ffe2.appendChild(VS._spacerBot);
  }
  const _0x492391 = _0x2fa58 * VS.ROW_H;
  const _0x4f3ecd = Math.max(0, (_0xad0f64 - _0x5810a6) * VS.ROW_H);
  VS._spacerTop.style.cssText = "height:" + _0x492391 + "px;display:" + (_0x492391 > 0 ? "table-row" : "none") + ";";
  VS._spacerBot.style.cssText = "height:" + _0x4f3ecd + "px;display:" + (_0x4f3ecd > 0 ? "table-row" : "none") + ";";
  const _0x3b8b4b = document.createDocumentFragment();
  for (let _0xe5b596 = _0x2fa58; _0xe5b596 < _0x5810a6; _0xe5b596++) {
    _0x3b8b4b.appendChild(_buildRow(_0x4ff9e8[_0xe5b596], _0xe5b596, _0xad0f64));
  }
  const _0x476132 = Array.from(_0x48ffe2.children);
  _0x476132.forEach(_0x5073cd => {
    if (_0x5073cd.id !== "_vsSpacerTop" && _0x5073cd.id !== "_vsSpacerBot") {
      _0x48ffe2.removeChild(_0x5073cd);
    }
  });
  _0x48ffe2.insertBefore(_0x3b8b4b, VS._spacerBot);
  if (typeof _rowLocks !== "undefined") {
    Object.keys(_rowLocks).forEach(_0x1ba45f => {
      const _0x2365c4 = _rowLocks[_0x1ba45f];
      if (!_0x2365c4.self) {
        const _0x1420e5 = document.querySelector("#tableBody tr[data-id=\"" + _0x1ba45f + "\"]");
        if (_0x1420e5 && !_0x1420e5.classList.contains("row-locked-external")) {
          _0x1420e5.classList.add("row-locked-external");
          _0x1420e5.title = "🔒 " + _0x2365c4.district + " edit kar raha hai";
          if (!_0x1420e5.querySelector(".lock-icon")) {
            const _0x3f853b = document.createElement("span");
            _0x3f853b.className = "lock-icon";
            _0x3f853b.textContent = " 🔒";
            if (_0x1420e5.cells[2]) {
              _0x1420e5.cells[2].appendChild(_0x3f853b);
            }
          }
        }
      }
    });
  }
}
function _vsBindScroll() {
  if (VS._bound) {
    return;
  }
  const _0x31a8cf = document.getElementById("tableContainer");
  if (!_0x31a8cf) {
    return;
  }
  let _0x2ea0de = null;
  _0x31a8cf.addEventListener("scroll", function () {
    if (_0x2ea0de) {
      cancelAnimationFrame(_0x2ea0de);
    }
    _0x2ea0de = requestAnimationFrame(function () {
      _vsRender(false);
      _0x2ea0de = null;
    });
  }, {
    passive: true
  });
  VS._bound = true;
}
function renderVirtual() {
  VS._lastStart = -1;
  VS._lastEnd = -1;
  VS._spacerTop = null;
  VS._spacerBot = null;
  const _0x554fdd = document.getElementById("tableBody");
  if (_0x554fdd) {
    _0x554fdd.innerHTML = "";
  }
  _vsBindScroll();
  _vsRender(true);
}
function highlightUpdatedRow(_0x22f5e3, _0x1489aa, _0x4ca0eb) {
  setTimeout(function () {
    highlightRow(_0x22f5e3);
    setTimeout(function () {
      var _0x506359 = document.querySelector("#tableBody tr[data-id=\"" + _0x22f5e3 + "\"]");
      if (_0x506359) {
        _0x506359.style.transition = "background 0.2s";
        _0x506359.style.background = "#fffde7";
        setTimeout(function () {
          _0x506359.style.transition = "background 1.5s";
          _0x506359.style.background = "";
        }, 1500);
      }
    }, 100);
  }, 400);
}
function viewDocument(_0x324e5a) {
  if (!_0x324e5a) {
    myAlert("❌ Document is not available.");
    return;
  }
  if (_0x324e5a.url && !_0x324e5a.data) {
    window.open(_0x324e5a.url, "_blank");
    return;
  }
  if (!_0x324e5a.data) {
    myAlert("❌ Document is not available.");
    return;
  }
  const _0x529836 = window.open("", "_blank");
  if (_0x324e5a.data.startsWith("data:image")) {
    _0x529836.document.write("<html><body style=\"margin:0;background:#000;display:flex;align-items:center;justify-content:center;min-height:100vh;\"><img src=\"" + _0x324e5a.data + "\" style=\"max-width:100%;max-height:100vh;\">\n<!-- ═══ RECENT RECORDS MODAL ═══ -->\n<div id=\"recentRecordsModal\" style=\"display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.55);z-index:9000;align-items:center;justify-content:center;\">\n  <div style=\"background:#fff;border-radius:12px;width:420px;max-width:95vw;box-shadow:0 10px 40px rgba(0,0,0,0.35);overflow:hidden;\">\n    <!-- Header -->\n    <div style=\"background:linear-gradient(135deg,#7c3aed,#5b21b6);color:white;padding:14px 18px;display:flex;align-items:center;justify-content:space-between;\">\n      <div style=\"display:flex;align-items:center;gap:8px;\">\n        <span style=\"font-size:18px;\">🕒</span>\n        <span style=\"font-weight:700;font-size:14px;letter-spacing:.3px;\">Recent Records</span>\n      </div>\n      <div style=\"display:flex;align-items:center;gap:10px;\">\n        <span style=\"font-size:10px;opacity:.75;\">Last 15 searched/edited</span>\n        <button onclick=\"closeRecentRecords()\" style=\"background:rgba(255,255,255,0.2);border:none;color:white;width:26px;height:26px;border-radius:50%;cursor:pointer;font-size:16px;font-weight:bold;line-height:1;\">×</button>\n      </div>\n    </div>\n    <!-- List -->\n    <div id=\"recentRecordsList\" style=\"max-height:420px;overflow-y:auto;padding:8px 0;\">\n      <div style=\"text-align:center;color:#999;padding:32px 0;font-size:13px;\">No recent records yet.<br><span style=\"font-size:11px;\">Search karo ya form kholne se records yahan dikhenge.</span></div>\n    </div>\n    <!-- Footer -->\n    <div style=\"padding:10px 16px;border-top:1px solid #eee;display:flex;justify-content:space-between;align-items:center;\">\n      <button onclick=\"clearRecentRecords()\" style=\"background:none;border:1px solid #ddd;color:#888;padding:5px 12px;border-radius:4px;cursor:pointer;font-size:11px;font-weight:600;\">🗑 Clear History</button>\n      <button onclick=\"closeRecentRecords()\" style=\"background:#7c3aed;color:white;border:none;padding:6px 18px;border-radius:4px;cursor:pointer;font-size:12px;font-weight:700;\">Close</button>\n    </div>\n  </div>\n</div>\n</body></html>");
  } else {
    _0x529836.document.write("<html><body style=\"margin:0;height:100vh;\"><embed src=\"" + _0x324e5a.data + "\" type=\"application/pdf\" width=\"100%\" height=\"100%\">\n<!-- ═══ RECENT RECORDS MODAL ═══ -->\n<div id=\"recentRecordsModal\" style=\"display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.55);z-index:9000;align-items:center;justify-content:center;\">\n  <div style=\"background:#fff;border-radius:12px;width:420px;max-width:95vw;box-shadow:0 10px 40px rgba(0,0,0,0.35);overflow:hidden;\">\n    <!-- Header -->\n    <div style=\"background:linear-gradient(135deg,#7c3aed,#5b21b6);color:white;padding:14px 18px;display:flex;align-items:center;justify-content:space-between;\">\n      <div style=\"display:flex;align-items:center;gap:8px;\">\n        <span style=\"font-size:18px;\">🕒</span>\n        <span style=\"font-weight:700;font-size:14px;letter-spacing:.3px;\">Recent Records</span>\n      </div>\n      <div style=\"display:flex;align-items:center;gap:10px;\">\n        <span style=\"font-size:10px;opacity:.75;\">Last 15 searched/edited</span>\n        <button onclick=\"closeRecentRecords()\" style=\"background:rgba(255,255,255,0.2);border:none;color:white;width:26px;height:26px;border-radius:50%;cursor:pointer;font-size:16px;font-weight:bold;line-height:1;\">×</button>\n      </div>\n    </div>\n    <!-- List -->\n    <div id=\"recentRecordsList\" style=\"max-height:420px;overflow-y:auto;padding:8px 0;\">\n      <div style=\"text-align:center;color:#999;padding:32px 0;font-size:13px;\">No recent records yet.<br><span style=\"font-size:11px;\">Search karo ya form kholne se records yahan dikhenge.</span></div>\n    </div>\n    <!-- Footer -->\n    <div style=\"padding:10px 16px;border-top:1px solid #eee;display:flex;justify-content:space-between;align-items:center;\">\n      <button onclick=\"clearRecentRecords()\" style=\"background:none;border:1px solid #ddd;color:#888;padding:5px 12px;border-radius:4px;cursor:pointer;font-size:11px;font-weight:600;\">🗑 Clear History</button>\n      <button onclick=\"closeRecentRecords()\" style=\"background:#7c3aed;color:white;border:none;padding:6px 18px;border-radius:4px;cursor:pointer;font-size:12px;font-weight:700;\">Close</button>\n    </div>\n  </div>\n</div>\n</body></html>");
  }
  _0x529836.document.title = _0x324e5a.name || "Document";
}
let filterTimeout;
function _getBaseData() {
  const _0x3dec25 = window.currentUser ? DEO_DISTRICT[window.currentUser] : null;
  if (_0x3dec25 && window.fullData && window.fullData.length) {
    return window.fullData.filter(_0x2c3792 => (_0x2c3792.field24 || "").trim().toLowerCase() === _0x3dec25.trim().toLowerCase());
  }
  return window.fullData || [];
}
function runAllFilters() {
  clearTimeout(filterTimeout);
  filterTimeout = setTimeout(() => {
    const _0x27a936 = Array.from(document.getElementById("filterRow").querySelectorAll("input")).map(_0x13f1a0 => _0x13f1a0.value.toUpperCase());
    if (_0x27a936.every(_0x3c4b6b => !_0x3c4b6b)) {
      window.filteredData = [..._getBaseData()];
    } else {
      window.filteredData = _getBaseData().filter(_0x37f417 => {
        return _0x27a936.every((_0x21267c, _0x1fb3d5) => {
          if (!_0x21267c) {
            return true;
          }
          return String(_0x37f417["field" + (_0x1fb3d5 + 1)] || "").toUpperCase().includes(_0x21267c);
        });
      });
    }
    renderVirtual();
  }, 300);
}
function resetFilters() {
  document.querySelectorAll("#filterRow input").forEach(_0x29463d => _0x29463d.value = "");
  window.filteredData = [..._getBaseData()];
  renderVirtual();
}
function importExcel(_0x28eb77) {
  const _0x4f552c = _0x28eb77.target.files[0];
  if (!_0x4f552c) {
    return;
  }
  const _0x45e755 = document.getElementById("uploadStatus");
  const _0x3ac411 = document.getElementById("progressBar");
  const _0x3bbbaf = document.getElementById("progressText");
  _0x45e755.style.display = "block";
  _0x3ac411.style.width = "0%";
  _0x3ac411.textContent = "0%";
  _0x3bbbaf.textContent = "Reading file...";
  const _0x315cd6 = new FileReader();
  _0x315cd6.onload = async function (_0x365b7c) {
    try {
      _0x3ac411.style.width = "30%";
      _0x3ac411.textContent = "30%";
      _0x3bbbaf.textContent = "Parsing Excel data...";
      await new Promise(_0x31d583 => setTimeout(_0x31d583, 0));
      const _0x110297 = XLSX.read(_0x365b7c.target.result, {
        type: "binary"
      });
      const _0x38e26f = _0x110297.Sheets[_0x110297.SheetNames[0]];
      const _0x2150d0 = XLSX.utils.sheet_to_json(_0x38e26f, {
        header: 1,
        raw: false
      });
      _0x3ac411.style.width = "60%";
      _0x3ac411.textContent = "60%";
      _0x3bbbaf.textContent = "Loading rows into table...";
      await new Promise(_0x5811de => setTimeout(_0x5811de, 0));
      window.fullData = [];
      try {
        Object.keys(localStorage).filter(_0x41f8e2 => _0x41f8e2.startsWith("ums_docmeta_") || _0x41f8e2.startsWith("ums_docdata_") || _0x41f8e2.startsWith("ums_tdmeta_") || _0x41f8e2.startsWith("ums_tddata_") || _0x41f8e2.startsWith("ums_doc_")).forEach(_0x19073 => localStorage.removeItem(_0x19073));
      } catch (_0x5163cd) {}
      const _0x244f4a = _0x2150d0[0] && typeof _0x2150d0[0][0] === "string" && _0x2150d0[0][0].toUpperCase().includes("S.NO") ? 1 : 0;
      for (let _0x3d5b3e = _0x244f4a; _0x3d5b3e < _0x2150d0.length; _0x3d5b3e++) {
        const _0x411ecf = _0x2150d0[_0x3d5b3e];
        if (!_0x411ecf || !_0x411ecf[2]) {
          continue;
        }
        const _0x23de43 = {};
        for (let _0x405ff1 = 0; _0x405ff1 < 29; _0x405ff1++) {
          _0x23de43["field" + (_0x405ff1 + 1)] = String(_0x411ecf[_0x405ff1] || "").trim();
        }
        window.fullData.push(_0x23de43);
      }
      window.filteredData = [...window.fullData];
      _0x3ac411.style.width = "70%";
      _0x3ac411.textContent = "70%";
      _0x3bbbaf.textContent = "Saving to cloud...";
      renderVirtual();
      const _0x242d87 = getSupabase();
      if (_0x242d87) {
        const {
          error: _0x3b2ad4
        } = await _0x242d87.from("ums_gradation").delete().neq("id", 0);
        const _0x25b524 = window.fullData.map(_0x3302fb => {
          const _0xfb16e3 = {};
          for (let _0x235c6a = 1; _0x235c6a <= 32; _0x235c6a++) {
            _0xfb16e3["field" + _0x235c6a] = _0x3302fb["field" + _0x235c6a] || "";
          }
          return _0xfb16e3;
        });
        const _0x282dec = 500;
        let _0x532b6e = 0;
        for (let _0x4b8383 = 0; _0x4b8383 < _0x25b524.length; _0x4b8383 += _0x282dec) {
          const _0x2971a7 = _0x25b524.slice(_0x4b8383, _0x4b8383 + _0x282dec);
          const {
            data: _0x3c6067,
            error: _0x51ac55
          } = await _0x242d87.from("ums_gradation").insert(_0x2971a7).select("id");
          if (!_0x51ac55 && _0x3c6067) {
            _0x3c6067.forEach((_0x285909, _0x37ea68) => {
              window.fullData[_0x4b8383 + _0x37ea68]._sbId = _0x285909.id;
            });
          }
          _0x532b6e += _0x2971a7.length;
          const _0x55f78 = Math.round(70 + (_0x4b8383 + _0x282dec) / _0x25b524.length * 28);
          _0x3ac411.style.width = Math.min(_0x55f78, 98) + "%";
          _0x3ac411.textContent = Math.min(_0x55f78, 98) + "%";
          await new Promise(_0x3015b6 => setTimeout(_0x3015b6, 0));
        }
        _0x3ac411.style.width = "100%";
        _0x3ac411.textContent = "100%";
        _0x3ac411.style.background = "#2e7d32";
        _0x3bbbaf.textContent = "✅ " + window.fullData.length + " records loaded & saved to cloud!";
      } else {
        _0x3ac411.style.width = "100%";
        _0x3ac411.textContent = "100%";
        _0x3bbbaf.textContent = "✅ " + window.fullData.length + " records loaded (cloud unavailable — use Chrome)";
      }
      setTimeout(() => _0x45e755.style.display = "none", 2500);
      auditLog("IMPORT", "Imported " + window.fullData.length + " records from " + _0x4f552c.name);
    } catch (_0x5335d4) {
      _0x3bbbaf.textContent = "❌ Error: " + _0x5335d4.message;
    }
  };
  _0x315cd6.readAsBinaryString(_0x4f552c);
  _0x28eb77.target.value = "";
}
function exportExcel() {
  if (!window.fullData.length) {
    myAlert("❌ No data available to export.");
    return;
  }
  const _0x18c972 = colConfig.map(_0x302d5a => _0x302d5a.name);
  const _0x2de4de = _getBaseData().map(_0x4f1e1e => colConfig.map((_0x5b19cf, _0x4607dd) => _0x4f1e1e["field" + (_0x4607dd + 1)] || ""));
  const _0x48ec52 = XLSX.utils.aoa_to_sheet([_0x18c972, ..._0x2de4de]);
  const _0x3a4a7b = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(_0x3a4a7b, _0x48ec52, "UMS Gradation");
  XLSX.writeFile(_0x3a4a7b, "UMS_Gradation_" + new Date().toISOString().split("T")[0] + ".xlsx");
  auditLog("EXPORT", "Exported " + window.fullData.length + " records");
}
function exportPDF() {
  if (!window.fullData.length) {
    myAlert("❌ No data available to export.");
    return;
  }
  const {
    jsPDF: _0x1336b9
  } = window.jspdf;
  const _0x654e05 = new _0x1336b9({
    orientation: "landscape",
    format: "a4"
  });
  const _0x290bd6 = document.getElementById("dpiLogoForm") ? document.getElementById("dpiLogoForm").src : null;
  function _0x18a2e1() {
    if (!_0x290bd6) {
      return;
    }
    try {
      const _0x2f240b = _0x654e05.internal.pageSize.getWidth();
      const _0x5e241d = _0x654e05.internal.pageSize.getHeight();
      const _0x3d1ca5 = 120;
      const _0x51b1ee = (_0x2f240b - _0x3d1ca5) / 2;
      const _0x1e9741 = (_0x5e241d - _0x3d1ca5) / 2;
      _0x654e05.saveGraphicsState();
      _0x654e05.setGState(new _0x654e05.GState({
        opacity: 0.1
      }));
      _0x654e05.addImage(_0x290bd6, "JPEG", _0x51b1ee, _0x1e9741, _0x3d1ca5, _0x3d1ca5);
      _0x654e05.restoreGraphicsState();
    } catch (_0x345d44) {
      console.warn("Watermark error:", _0x345d44);
    }
  }
  _0x18a2e1();
  const _0x49bcf7 = _0x654e05.internal.pageSize.getWidth();
  function _0x285f82(_0x71c2da) {
    try {
      const _0x374d80 = window._umsPdfTitle || "UMS (Ucch Madhyamik shikshak) Seniority Management System (As on 01/04/2026)";
      const _0x2340ae = document.createElement("canvas");
      const _0x4b4e45 = 3;
      _0x2340ae.width = _0x4b4e45 * 1800;
      _0x2340ae.height = _0x4b4e45 * 36;
      const _0x443475 = _0x2340ae.getContext("2d");
      _0x443475.scale(_0x4b4e45, _0x4b4e45);
      _0x443475.clearRect(0, 0, _0x2340ae.width, _0x2340ae.height);
      _0x443475.fillStyle = "#002e5b";
      _0x443475.font = "bold 15px \"Noto Sans Devanagari\", \"Arial Unicode MS\", Arial, sans-serif";
      _0x443475.textAlign = "center";
      _0x443475.textBaseline = "middle";
      _0x443475.fillText(_0x374d80, 900, 18);
      const _0x9f197 = _0x2340ae.toDataURL("image/png");
      const _0x4abb86 = _0x49bcf7 - 14;
      const _0x52f5e0 = 8;
      _0x654e05.addImage(_0x9f197, "PNG", 7, _0x71c2da, _0x4abb86, _0x52f5e0);
    } catch (_0x3c8b74) {
      _0x654e05.setFontSize(8);
      _0x654e05.setFont("helvetica", "bold");
      _0x654e05.text("UMS Uchch Madhyamik Shikshak - Navin Samvarg Variyata Suchi 01-04-2025", _0x49bcf7 / 2, _0x71c2da + 4, {
        align: "center"
      });
      _0x654e05.setFont("helvetica", "normal");
    }
  }
  _0x285f82(2);
  const _0x12da8c = 283;
  const _0x586b4d = [3, 5, 6, 10, 4, 4, 7, 4, 8, 7, 7, 8, 7, 7, 8, 7, 7, 7, 7, 7, 8, 10, 7, 7, 7, 9, 7, 7, 7, 4, 14, 5];
  const _0x3e38af = _0x586b4d.reduce((_0x408f8b, _0x5b0c60) => _0x408f8b + _0x5b0c60, 0);
  const _0x11d2b5 = _0x586b4d.map(_0xf6bc25 => parseFloat((_0xf6bc25 / _0x3e38af * _0x12da8c).toFixed(2)));
  const _0x28e952 = {};
  _0x11d2b5.forEach((_0x5c2cbe, _0x5205c9) => {
    _0x28e952[_0x5205c9] = {
      cellWidth: _0x5c2cbe
    };
  });
  const _0x39bebe = [colConfig.map(_0x19bab4 => _0x19bab4.name)];
  const _0x1ce9c9 = window.filteredData.length ? window.filteredData.map(_0x7108df => colConfig.map((_0x4bb2cc, _0x26ea2c) => _0x7108df["field" + (_0x26ea2c + 1)] || "")) : window.fullData.map(_0x3ddc49 => colConfig.map((_0x511ba2, _0x523738) => _0x3ddc49["field" + (_0x523738 + 1)] || ""));
  _0x654e05.autoTable({
    head: _0x39bebe,
    body: _0x1ce9c9,
    startY: 12,
    styles: {
      fontSize: 4,
      cellPadding: 1,
      overflow: "ellipsize",
      halign: "left"
    },
    headStyles: {
      fillColor: [0, 46, 91],
      textColor: 255,
      fontStyle: "bold",
      fontSize: 4
    },
    columnStyles: _0x28e952,
    tableWidth: _0x12da8c,
    margin: {
      top: 12,
      left: 7,
      right: 7,
      bottom: 8
    },
    didDrawPage: function (_0xbd2e93) {
      _0x18a2e1();
      _0x654e05.setFontSize(7);
      _0x654e05.setTextColor(100);
      _0x654e05.text("Page " + _0xbd2e93.pageNumber, _0x49bcf7 / 2, _0x654e05.internal.pageSize.getHeight() - 4, {
        align: "center"
      });
      _0x654e05.setTextColor(0);
      if (_0xbd2e93.pageNumber > 1) {
        _0x285f82(2);
      }
    }
  });
  _0x654e05.save("UMS_Gradation.pdf");
}
(function initPdfTitle() {})();
function handleTitleClick() {
  if (window.currentUser !== "DPI") {
    return;
  }
  const _0xc15ea2 = document.getElementById("sheetTitleText");
  const _0x2fe105 = _0xc15ea2 ? _0xc15ea2.textContent : "";
  const _0x17036b = document.getElementById("sheetTitleDiv");
  const _0x560cb2 = document.getElementById("titleEditInput");
  if (_0x560cb2) {
    return;
  }
  const _0x6c2cac = document.createElement("input");
  _0x6c2cac.id = "titleEditInput";
  _0x6c2cac.type = "text";
  _0x6c2cac.value = _0x2fe105;
  _0x6c2cac.style.cssText = "width:90%;font-size:14px;font-weight:700;padding:4px 8px;border:2px solid #2c7be5;border-radius:4px;color:#002e5b;outline:none;";
  _0x6c2cac.onkeydown = function (_0x4260f7) {
    if (_0x4260f7.key === "Enter") {
      savePdfTitle(_0x6c2cac.value);
    }
    if (_0x4260f7.key === "Escape") {
      _0x6c2cac.remove();
    }
  };
  _0x6c2cac.onblur = function () {
    savePdfTitle(_0x6c2cac.value);
  };
  if (_0xc15ea2) {
    _0xc15ea2.style.display = "none";
  }
  _0x17036b.appendChild(_0x6c2cac);
  _0x6c2cac.focus();
  _0x6c2cac.select();
}
function savePdfTitle(_0x5e87a3) {
  const _0x1175c6 = document.getElementById("titleEditInput");
  if (_0x1175c6) {
    _0x1175c6.remove();
  }
  if (!_0x5e87a3 || !_0x5e87a3.trim()) {
    return;
  }
  _0x5e87a3 = _0x5e87a3.trim();
  window._umsPdfTitle = _0x5e87a3;
  const _0x5538a2 = document.getElementById("sheetTitleText");
  if (_0x5538a2) {
    _0x5538a2.textContent = _0x5e87a3;
    _0x5538a2.style.display = "";
  }
  myAlert("✅ Title updated successfully.");
}
function updateTitleEditHint() {
  const _0xd4b787 = document.getElementById("editTitleHint");
  if (_0xd4b787) {
    _0xd4b787.style.display = window.currentUser === "DPI" ? "inline" : "none";
  }
}
function manualBackup() {
  if (!window.fullData.length) {
    myAlert("❌ No data available to backup.");
    return;
  }
  const _0x961f5f = JSON.stringify(window.fullData, null, 2);
  const _0x5f349e = new Blob([_0x961f5f], {
    type: "application/json"
  });
  const _0x3b4e12 = URL.createObjectURL(_0x5f349e);
  const _0x8f175b = document.createElement("a");
  _0x8f175b.href = _0x3b4e12;
  _0x8f175b.download = "UMS_Backup_" + new Date().toISOString().split("T")[0] + ".json";
  _0x8f175b.click();
  URL.revokeObjectURL(_0x3b4e12);
  auditLog("BACKUP", "Manual JSON backup downloaded — " + window.fullData.length + " records");
}
function restoreFromBackup() {
  const _0x54783e = document.createElement("input");
  _0x54783e.type = "file";
  _0x54783e.accept = ".json";
  _0x54783e.onchange = function (_0x5c676e) {
    const _0x370675 = _0x5c676e.target.files[0];
    if (!_0x370675) {
      return;
    }
    const _0x3f77ad = new FileReader();
    _0x3f77ad.onload = function (_0x254bb3) {
      try {
        const _0x29f98c = JSON.parse(_0x254bb3.target.result);
        if (!Array.isArray(_0x29f98c)) {
          throw new Error("Invalid format");
        }
        window.fullData = _0x29f98c;
        window.filteredData = [..._0x29f98c];
        renderVirtual();
        const _0x535f08 = document.getElementById("storageBadge");
        if (_0x535f08) {
          _0x535f08.innerHTML = "⏳ Syncing records to cloud...";
        }
        Promise.all(_0x29f98c.map(_0x399f54 => saveRecordToSupabase(_0x399f54))).then(_0x260cc5 => {
          const _0x1c90e1 = _0x260cc5.filter(Boolean).length;
          updateStorageBadge(true);
          myAlert("✅ " + _0x29f98c.length + " records restored successfully.\n(" + _0x1c90e1 + "/" + _0x29f98c.length + " synced to cloud)");
        });
        auditLog("RESTORE", "Restored " + _0x29f98c.length + " records from JSON backup");
      } catch (_0x194f91) {
        myAlert("❌ Invalid backup file: " + _0x194f91.message);
      }
    };
    _0x3f77ad.readAsText(_0x370675);
  };
  _0x54783e.click();
}
async function clearAllData() {
  if ((window.currentUser || currentUser) !== "DPI") {
    alert("⛔ Only DPI can clear all data.");
    return;
  }
  const _0x446965 = prompt("⚠️ CLEAR ALL DATA?\n\nEnter password to confirm:");
  if (_0x446965 === null) {
    return;
  }
  if (_0x446965 !== "1782") {
    myAlert("❌ Incorrect password. No data was cleared.");
    return;
  }
  const _0x2c7f92 = window.fullData.length;
  if (_0x2c7f92 === 0) {
    myAlert("ℹ️ There is no data to clear.");
    return;
  }
  const _0x4080a6 = [...window.fullData];
  window.fullData = [];
  window.filteredData = [];
  historyStore = [];
  renderVirtual();
  updateStorageBadge(false);
  try {
    const _0x1ef8f4 = Object.keys(localStorage).filter(_0x4feb93 => _0x4feb93.startsWith("ums_docmeta_") || _0x4feb93.startsWith("ums_docdata_") || _0x4feb93.startsWith("ums_tdmeta_") || _0x4feb93.startsWith("ums_tddata_") || _0x4feb93.startsWith("ums_doc_") || _0x4feb93.startsWith("ums_summary_docs"));
    _0x1ef8f4.forEach(_0x56cdc9 => localStorage.removeItem(_0x56cdc9));
  } catch (_0x5a87ee) {}
  const _0x578dd2 = document.getElementById("storageBadge");
  if (_0x578dd2) {
    _0x578dd2.innerHTML = "⏳ Deleting all records from cloud...";
  }
  const _0x3b0918 = getSupabase();
  if (_0x3b0918) {
    try {
      await _0x3b0918.from("ums_gradation").delete().not("id", "is", null);
      try {
        await _0x3b0918.from("summary_uploads").delete().neq("office_key", "__NONE__");
      } catch (_0x2d13c4) {}
      try {
        await _0x3b0918.from("audit_log").delete().neq("id", 0);
      } catch (_0x4e67ee) {}
      if (_0x578dd2) {
        _0x578dd2.innerHTML = "✅ All data deleted from cloud (all systems).";
      }
    } catch (_0x479c8e) {
      console.error("Clear error:", _0x479c8e);
      if (_0x578dd2) {
        _0x578dd2.innerHTML = "⚠️ Error occurred while deleting from cloud.";
      }
    }
  } else if (_0x578dd2) {
    _0x578dd2.innerHTML = "⚠️ Cloud not connected — only local data cleared.";
  }
  myAlert("✅ All records permanently deleted from cloud.\n\nSabhi systems pe next login pe data gone rahega.");
  auditLog("CLEAR_ALL", "All data cleared by " + currentUser);
}
function changeListZoom(_0x15959a) {
  listZoom = Math.min(18, Math.max(8, listZoom + _0x15959a));
  document.getElementById("listZoomVal").textContent = listZoom + "px";
  document.querySelectorAll("#tableBody td, #tableHead th").forEach(_0x52cdc1 => _0x52cdc1.style.fontSize = listZoom + "px");
}
function changeFormZoom(_0x3d8db8) {
  formZoom = Math.min(18, Math.max(9, formZoom + _0x3d8db8));
  document.getElementById("formZoomVal").textContent = formZoom + "px";
  document.getElementById("formCard").style.fontSize = formZoom + "px";
}
function setupFormZoom() {
  document.getElementById("formCard").style.fontSize = formZoom + "px";
}
function showSummary() {
  const _0xb7c8f = [{
    name: "JD BHOPAL",
    districts: ["BHOPAL", "RAISEN", "RAJGARH", "SEHORE", "VIDISHA"]
  }, {
    name: "JD GWALIOR",
    districts: ["ASHOKNAGAR", "BHIND", "DATIA", "GUNA", "GWALIOR", "MORENA", "SHEOPUR", "SHIVPURI"]
  }, {
    name: "JD INDORE",
    districts: ["ALIRAJPUR", "BARWANI", "BURHANPUR", "DHAR", "INDORE", "JHABUA", "KHANDWA", "KHARGONE"]
  }, {
    name: "JD JABALPUR",
    districts: ["BALAGHAT", "CHHINDWARA", "PANDHURNA", "DINDORI", "JABALPUR", "KATNI", "MANDLA", "NARSINGHPUR", "SEONI"]
  }, {
    name: "JD UJJAIN",
    districts: ["AGAR MALWA", "DEWAS", "MANDSAUR", "NEEMUCH", "RATLAM", "SHAJAPUR", "UJJAIN"]
  }, {
    name: "JD SAGAR",
    districts: ["CHHATARPUR", "DAMOH", "NIWARI", "PANNA", "SAGAR", "TIKAMGARH"]
  }, {
    name: "JD REWA",
    districts: ["REWA", "MAIHAR", "MAUGANJ", "SATNA", "SIDHI", "SINGRAULI"]
  }, {
    name: "JD NARMADAPURAM",
    districts: ["BETUL", "HARDA", "NARMADAPURAM"]
  }, {
    name: "JD SHAHDOL",
    districts: ["ANUPPUR", "SHAHDOL", "UMARIA"]
  }];
  const _0x5618b7 = window.fullData || [];
  if (!_0x5618b7.length) {
    return myAlert("❌ No data available to generate a summary.");
  }
  let _0x34a5df = {
    total: 0,
    updated: 0,
    new: 0,
    deleted: 0,
    deo: 0,
    jd: 0,
    dpi: 0
  };
  let _0x4b57af = [];
  _0xb7c8f.forEach(_0x417383 => {
    let _0x22d5fd = {
      name: _0x417383.name,
      type: "JD",
      total: 0,
      updated: 0,
      new: 0,
      deleted: 0,
      deo: 0,
      jd: 0,
      dpi: 0
    };
    let _0x15bcce = [];
    _0x417383.districts.forEach(_0x464fa6 => {
      let _0x3304c1 = {
        name: _0x464fa6,
        type: "DISTRICT",
        total: 0,
        updated: 0,
        new: 0,
        deleted: 0,
        deo: 0,
        jd: 0,
        dpi: 0
      };
      _0x5618b7.forEach(_0x5a49e2 => {
        let _0x2d535b = (_0x5a49e2.field24 || "").toUpperCase().trim();
        const _0x39709f = _0x2d535b.replace(/^DEO\s+/, "").replace(/^JD\s+/, "").trim();
        const _0x270d09 = _0x39709f === _0x464fa6.trim();
        if (_0x270d09) {
          _0x3304c1.total++;
          _0x22d5fd.total++;
          _0x34a5df.total++;
          const _0x4921f2 = (_0x5a49e2.field30 || "").toUpperCase().trim();
          const _0x2fd864 = (_0x5a49e2.field31 || "").toUpperCase().trim();
          if (_0x4921f2.includes("UPDATED")) {
            _0x3304c1.updated++;
            _0x22d5fd.updated++;
            _0x34a5df.updated++;
          } else if (_0x4921f2.includes("NEW")) {
            _0x3304c1.new++;
            _0x22d5fd.new++;
            _0x34a5df.new++;
          } else if (_0x4921f2.includes("DELETE")) {
            _0x3304c1.deleted++;
            _0x22d5fd.deleted++;
            _0x34a5df.deleted++;
          }
          if (_0x2fd864.includes("DPI")) {
            _0x3304c1.dpi++;
            _0x22d5fd.dpi++;
            _0x34a5df.dpi++;
          } else if (_0x2fd864.includes("JD")) {
            _0x3304c1.jd++;
            _0x22d5fd.jd++;
            _0x34a5df.jd++;
          } else if (_0x2fd864.includes("DEO") || _0x4921f2 !== "" && _0x2fd864 !== "") {
            _0x3304c1.deo++;
            _0x22d5fd.deo++;
            _0x34a5df.deo++;
          }
        }
      });
      if (_0x3304c1.total > 0) {
        _0x15bcce.push(_0x3304c1);
      }
    });
    if (_0x22d5fd.total > 0) {
      _0x4b57af.push(_0x22d5fd);
      _0x4b57af = _0x4b57af.concat(_0x15bcce);
    }
  });
  if (document.getElementById("summaryModal")) {
    document.getElementById("summaryModal").remove();
  }
  const _0x3467cf = "<style>@media print{body *{visibility:hidden;}#summaryModal,#summaryModal *{visibility:visible;}#summaryModal{position:absolute;left:0;top:0;width:auto!important;display:block!important;}.no-print{display:none!important;}table{width:auto!important;border-collapse:collapse!important;}th,td{border:1px solid black!important;padding:3px 6px!important;white-space:nowrap!important;}}</style>";
  const _0x2f3841 = document.createElement("div");
  _0x2f3841.id = "summaryModal";
  _0x2f3841.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:20000;display:flex;align-items:center;justify-content:center;";
  _0x2f3841.innerHTML = _0x3467cf + ("\n  <div style=\"background:#000080;color:white;border-radius:8px;border:1px solid #ffffff;display:inline-block;max-height:90vh;overflow:hidden;width:fit-content;box-shadow:0 10px 30px rgba(0,0,0,0.35);\">\n    <div style=\"background:linear-gradient(90deg,#2c3e50,#34495e);color:white;padding:10px;border-bottom:2px solid #1c2833;text-align:center;\">\n      <h3 style=\"margin:0;font-size:15px;font-weight:600;letter-spacing:0.5px;\">UMS — District Enrollment Summary</h3>\n      <div style=\"margin-top:6px;display:flex;gap:10px;justify-content:center;flex-wrap:wrap;font-weight:bold;font-size:14px;\">\n        <div style=\"background:#e3f2fd;padding:4px 12px;border:1px solid #000;border-radius:4px;color:black;\">Total : " + _0x34a5df.total + "</div>\n        <div style=\"background:#e8f5e9;padding:4px 12px;border:1px solid #000;border-radius:4px;color:black;\">Updated : " + _0x34a5df.updated + "</div>\n        <div style=\"background:#e1f5fe;padding:4px 12px;border:1px solid #000;border-radius:4px;color:black;\">New Entry : " + _0x34a5df.new + "</div>\n        <div style=\"background:#ffebee;padding:4px 12px;border:1px solid #000;border-radius:4px;color:#b71c1c;\">Delete : " + _0x34a5df.deleted + "</div>\n        <div style=\"background:#ffebee;padding:4px 12px;border:1px solid #000;border-radius:4px;color:#b71c1c;\">DEO : " + _0x34a5df.deo + "</div>\n        <div style=\"background:#e8f5e9;padding:4px 12px;border:1px solid #000;border-radius:4px;color:#1b5e20;\">JD : " + _0x34a5df.jd + "</div>\n        <div style=\"background:#e3f2fd;padding:4px 12px;border:1px solid #000;border-radius:4px;color:#0d47a1;\">DPI : " + _0x34a5df.dpi + "</div>\n      </div>\n    </div>\n    <div style=\"overflow-y:auto;max-height:65vh;padding:10px;display:block;width:100%;\">\n      <table style=\"width:1px!important;min-width:100%!important;border-collapse:collapse;font-size:11px;border:1px solid #000;margin:0 auto;background:white;\">\n        <thead style=\"background:#f2f2f2;color:#000;font-weight:bold;\">\n          <tr>\n            <th style=\"padding:4px 10px;text-align:left;border:1px solid #000;white-space:nowrap;\">Office Name</th>\n            <th style=\"padding:4px 8px;border:1px solid #000;\">Registered</th>\n            <th style=\"padding:4px 8px;border:1px solid #000;\">Updated</th>\n            <th style=\"padding:4px 8px;border:1px solid #000;\">New Entry</th>\n            <th style=\"padding:4px 8px;border:1px solid #000;\">Delete</th>\n            <th style=\"padding:4px 8px;border:1px solid #000;background:#002e5b;color:white;\">Upload</th>\n            <th style=\"padding:4px 8px;border:1px solid #000;background:#002e5b;color:white;\">View Doc</th>\n          </tr>\n        </thead>\n        <tbody>\n          " + _0x4b57af.map(_0x969d95 => {
    let _0x5d5ab3 = _0x969d95.type === "JD" ? _0x969d95.name.replace(/\s+/g, "") : "DEO" + _0x969d95.name.replace(/\s+/g, "");
    const _0x2aa01c = window.currentUser || currentUser || "";
    let _0x37b187 = false;
    if (_0x2aa01c === "DPI") {
      _0x37b187 = true;
    } else if (_0x969d95.type === "JD") {
      _0x37b187 = _0x2aa01c === _0x5d5ab3;
    } else {
      const _0x57dbc8 = {
        JDBHOPAL: ["BHOPAL", "RAISEN", "RAJGARH", "SEHORE", "VIDISHA"],
        JDGWALIOR: ["ASHOKNAGAR", "BHIND", "DATIA", "GUNA", "GWALIOR", "MORENA", "SHEOPUR", "SHIVPURI"],
        JDINDORE: ["ALIRAJPUR", "BARWANI", "BURHANPUR", "DHAR", "INDORE", "JHABUA", "KHANDWA", "KHARGONE"],
        JDJABALPUR: ["BALAGHAT", "CHHINDWARA", "PANDHURNA", "DINDORI", "JABALPUR", "KATNI", "MANDLA", "NARSINGHPUR", "SEONI"],
        JDUJJAIN: ["AGARMALWA", "DEWAS", "MANDSAUR", "NEEMUCH", "RATLAM", "SHAJAPUR", "UJJAIN"],
        JDSAGAR: ["CHHATARPUR", "DAMOH", "NIWARI", "PANNA", "SAGAR", "TIKAMGARH"],
        JDREWA: ["REWA", "MAIHAR", "MAUGANJ", "SATNA", "SIDHI", "SINGRAULI"],
        JDNARMADAPURAM: ["BETUL", "HARDA", "NARMADAPURAM"],
        JDSHAHDOL: ["ANUPPUR", "SHAHDOL", "UMARIA"]
      };
      const _0x33f312 = _0x969d95.name.replace(/\s+/g, "").toUpperCase();
      const _0x5afa9b = _0x57dbc8[_0x2aa01c] || [];
      const _0x305994 = _0x5afa9b.includes(_0x33f312);
      _0x37b187 = _0x2aa01c === _0x5d5ab3 || _0x305994;
    }
    let _0x38321d = _0x37b187 ? "<button onclick=\"summaryUploadDoc('" + _0x5d5ab3 + "')\" style=\"background:#2e7d32;color:white;border:none;padding:3px 8px;border-radius:4px;cursor:pointer;font-size:11px;font-weight:bold;\">📤 Upload</button><div id='uploadStatus_" + _0x5d5ab3 + "' style='font-size:10px;margin-top:2px;'></div>" : "<span style=\"color:#bbb;font-size:10px;\">🔒 No Access</span>";
    const _0x2d7dcd = "viewBtn_" + _0x5d5ab3;
    let _0x22a2ab = "<span id=\"" + _0x2d7dcd + "\" style=\"color:#aaa;font-size:10px;font-style:italic;\">⏳</span>";
    (async function (_0x4b307c, _0x1fcf73) {
      const _0x3649da = await getUploadedDocCloud(_0x4b307c);
      const _0x1678f3 = document.getElementById(_0x1fcf73);
      if (!_0x1678f3) {
        return;
      }
      if (_0x3649da && (_0x3649da.public_url || _0x3649da.local_data)) {
        _0x1678f3.outerHTML = "<button onclick=\"summaryViewDoc('" + _0x4b307c + "')\" style=\"background:#1565c0;color:white;border:none;padding:3px 8px;border-radius:4px;cursor:pointer;font-size:11px;font-weight:bold;\">👁️ View</button>";
      } else {
        _0x1678f3.outerHTML = "<span style=\"color:#aaa;font-size:10px;font-style:italic;\">No Document</span>";
      }
    })(_0x5d5ab3, _0x2d7dcd);
    return "<tr style=\"border-bottom:1px solid #000;" + (_0x969d95.type === "JD" ? "background:#e8f1ff;font-weight:600;color:#0d47a1;" : "") + "\">\n              <td style=\"padding:2px 10px;border-right:1px solid #000;white-space:nowrap;color:black!important;\">" + (_0x969d95.type === "JD" ? _0x969d95.name : "DEO " + _0x969d95.name) + "</td>\n              <td style=\"padding:2px 8px;text-align:center;border-right:1px solid #000;font-weight:bold;color:black!important;\">" + _0x969d95.total + "</td>\n              <td style=\"padding:2px 8px;text-align:center;border-right:1px solid #000;color:#2e7d32;\">" + _0x969d95.updated + "</td>\n              <td style=\"padding:2px 8px;text-align:center;border-right:1px solid #000;color:#1565c0;\">" + _0x969d95.new + "</td>\n              <td style=\"padding:2px 8px;text-align:center;border-right:1px solid #000;color:#c62828;font-weight:600;\">" + _0x969d95.deleted + "</td>\n              <td style=\"padding:2px 8px;text-align:center;border-right:1px solid #000;\">\n                <input type=\"file\" id=\"fileUpload_" + _0x5d5ab3 + "\" accept=\".pdf,.jpg,.jpeg,.png\" style=\"display:none;\" onchange=\"handleSummaryFileUpload(event,'" + _0x5d5ab3 + "')\">\n                " + _0x38321d + "\n              </td>\n              <td style=\"padding:2px 8px;text-align:center;\">" + _0x22a2ab + "</td>\n            </tr>";
  }).join("") + "\n        </tbody>\n      </table>\n    </div>\n    <div class=\"no-print\" style=\"padding:10px;background:#f5f6fa;text-align:right;border-top:1px solid #ddd;\">\n      <button onclick=\"window.print()\" style=\"padding:7px 18px;background:#2e7d32;color:white;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:12px;margin-right:8px;\">Print Report</button>\n      <button onclick=\"document.getElementById('summaryModal').remove()\" style=\"padding:7px 18px;background:#c62828;color:white;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:12px;\">Close</button>\n    </div>\n  </div>");
  document.body.appendChild(_0x2f3841);
  _0x2f3841.addEventListener("click", _0x13fbba => {
    if (_0x13fbba.target === _0x2f3841) {
      _0x2f3841.remove();
    }
  });
}
function closeSummary() {
  const _0x3510b7 = document.getElementById("summaryModal");
  if (_0x3510b7) {
    _0x3510b7.remove();
  }
}
function summaryUploadDoc(_0x372622) {
  if (window.currentUser !== _0x372622 && window.currentUser !== "DPI") {
    myAlert("❌ You can only upload documents for your own office.");
    return;
  }
  const _0x5131dc = document.getElementById("fileUpload_" + _0x372622);
  if (_0x5131dc) {
    _0x5131dc.click();
  }
}
function handleSummaryFileUpload(_0x3790e5, _0x44e0ff) {
  const _0x5bf372 = _0x3790e5.target.files[0];
  if (!_0x5bf372) {
    return;
  }
  const _0x8bcc31 = 1;
  if (_0x5bf372.size > _0x8bcc31 * 1024 * 1024) {
    myAlert("❌ Document is too large!\n\nFile Size: " + (_0x5bf372.size / 1048576).toFixed(2) + " MB\nMaximum Allowed: " + _0x8bcc31 + " MB (1 MB)\n\nPlease compress the file and upload again.");
    _0x3790e5.target.value = "";
    return;
  }
  const _0x325f16 = document.getElementById("uploadStatus_" + _0x44e0ff);
  if (_0x325f16) {
    _0x325f16.innerHTML = "⏳ Uploading document...";
    _0x325f16.style.color = "#f39c12";
  }
  (async function () {
    const _0x2d9391 = await summaryUploadDocCloud(_0x44e0ff, _0x5bf372);
    if (_0x2d9391) {
      if (_0x325f16) {
        _0x325f16.innerHTML = "✅ Uploaded: " + _0x5bf372.name;
        _0x325f16.style.color = "#27ae60";
      }
      myAlert("✅ Document uploaded successfully!\nFile: " + _0x5bf372.name + "\n\nReopen the Summary — View button will appear.");
    } else {
      if (_0x325f16) {
        _0x325f16.innerHTML = "❌ Upload failed.";
        _0x325f16.style.color = "#c62828";
      }
      myAlert("❌ Upload failed.");
    }
  })();
  _0x3790e5.target.value = "";
}
async function summaryViewDoc(_0x43051e) {
  if (!_0x43051e) {
    myAlert("❌ Office key missing.");
    return;
  }
  const _0x4ac0cb = await getUploadedDocCloud(_0x43051e);
  if (!_0x4ac0cb) {
    myAlert("❌ No document uploaded for — " + _0x43051e);
    return;
  }
  if (_0x4ac0cb.local_data) {
    try {
      const _0x2c674b = window.open("", "_blank");
      if (!_0x2c674b) {
        myAlert("❌ Popup blocked! Please allow popups in your browser settings.");
        return;
      }
      _0x2c674b.document.write("<html><head><title>" + _0x43051e + " Document</title></head><body style=\"margin:0;padding:0;\"><iframe src=\"" + _0x4ac0cb.local_data + "\" style=\"width:100%;height:100vh;border:none;\"></iframe></body></html>");
      _0x2c674b.document.close();
    } catch (_0x361e7e) {
      myAlert("❌ Could not open the document. Please try again.");
    }
    return;
  }
  if (_0x4ac0cb.public_url && !_0x4ac0cb.public_url.startsWith("local:")) {
    window.open(_0x4ac0cb.public_url, "_blank");
    return;
  }
  myAlert("❌ Document data not found — " + _0x43051e + ". Please upload the document first.");
}
let chartInstances = {};
function showAnalytics() {
  if (!window.fullData.length) {
    myAlert("❌ No data has been loaded yet.");
    return;
  }
  document.getElementById("analyticsOverlay").style.display = "flex";
  setTimeout(() => {
    Object.values(chartInstances).forEach(_0x17b7c5 => _0x17b7c5.destroy());
    chartInstances = {};
    const _0x2d4d5c = _getBaseData();
    const _0x46e099 = {
      UR: 0,
      SC: 0,
      ST: 0,
      OBC: 0
    };
    _0x2d4d5c.forEach(_0x46fd76 => {
      if (_0x46e099[_0x46fd76.field5] !== undefined) {
        _0x46e099[_0x46fd76.field5]++;
      }
    });
    chartInstances.cat = new Chart(document.getElementById("chartCat"), {
      type: "doughnut",
      data: {
        labels: Object.keys(_0x46e099),
        datasets: [{
          data: Object.values(_0x46e099),
          backgroundColor: ["#1565c0", "#2e7d32", "#e65100", "#6a1b9a"]
        }]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: "Category Distribution"
          }
        }
      }
    });
    const _0xa247d8 = _0x2d4d5c.filter(_0x5d2176 => _0x5d2176.field6 === "M").length;
    chartInstances.gen = new Chart(document.getElementById("chartGender"), {
      type: "pie",
      data: {
        labels: ["Male", "Female"],
        datasets: [{
          data: [_0xa247d8, _0x2d4d5c.length - _0xa247d8],
          backgroundColor: ["#0277bd", "#ad1457"]
        }]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: "Gender Distribution"
          }
        }
      }
    });
    const _0x409dff = {};
    _0x2d4d5c.forEach(_0x5009b0 => {
      const _0x2d8ffd = _0x5009b0.field24 || "Unknown";
      _0x409dff[_0x2d8ffd] = (_0x409dff[_0x2d8ffd] || 0) + 1;
    });
    const _0x4be49a = Object.entries(_0x409dff).sort((_0x12011e, _0xcee359) => _0xcee359[1] - _0x12011e[1]).slice(0, 10);
    chartInstances.dist = new Chart(document.getElementById("chartDistrict"), {
      type: "bar",
      data: {
        labels: _0x4be49a.map(_0xa3e795 => _0xa3e795[0]),
        datasets: [{
          label: "Records",
          data: _0x4be49a.map(_0x43f11a => _0x43f11a[1]),
          backgroundColor: "#1565c0"
        }]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: "Top 10 Districts"
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
    const _0x4d3918 = _0x2d4d5c.filter(_0x659547 => _0x659547.field8 === "DIR").length;
    chartInstances.mode = new Chart(document.getElementById("chartMode"), {
      type: "doughnut",
      data: {
        labels: ["DIR", "PRO"],
        datasets: [{
          data: [_0x4d3918, _0x2d4d5c.length - _0x4d3918],
          backgroundColor: ["#002e5b", "#2c7be5"]
        }]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: "Mode of Appointment"
          }
        }
      }
    });
  }, 100);
}
function openLiveDashboard() {
  const _0x2d0f61 = window.fullData || [];
  if (!_0x2d0f61.length) {
    myAlert("⚠️ Data has not been loaded yet. Please wait.");
    return;
  }
  if (document.getElementById("liveDashModal")) {
    document.getElementById("liveDashModal").remove();
  }
  const _0x43f676 = document.createElement("div");
  _0x43f676.id = "liveDashModal";
  _0x43f676.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.65);z-index:10001;display:flex;align-items:center;justify-content:center;";
  _0x43f676.innerHTML = "\n  <div style=\"background:#f8f9fa;border-radius:12px;width:96%;max-width:1100px;max-height:93vh;overflow:hidden;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,0.5);\">\n    <div style=\"background:linear-gradient(135deg,#1a237e,#283593);color:white;padding:14px 20px;display:flex;justify-content:space-between;align-items:center;flex-shrink:0;\">\n      <div>\n        <div style=\"font-size:17px;font-weight:700;letter-spacing:0.3px;\">📊 DPI Live Dashboard</div>\n        <div style=\"font-size:11px;opacity:0.75;margin-top:2px;\">UMS Gradation ERP — Real-time Analytics</div>\n      </div>\n      <div style=\"display:flex;align-items:center;gap:10px;\">\n        <span style=\"font-size:11px;background:rgba(76,175,80,0.3);border:1px solid rgba(76,175,80,0.6);padding:3px 10px;border-radius:20px;\">🟢 Live</span>\n        <button onclick=\"document.getElementById('liveDashModal').remove()\" style=\"background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.3);color:white;width:30px;height:30px;border-radius:50%;cursor:pointer;font-size:16px;font-weight:bold;\">✕</button>\n      </div>\n    </div>\n    <div id=\"ldKpiStrip\" style=\"display:flex;gap:0;border-bottom:1px solid #ddd;flex-shrink:0;background:white;\"></div>\n    <div style=\"display:flex;border-bottom:2px solid #e0e0e0;flex-shrink:0;background:white;\">\n      <button onclick=\"switchLDTab(1)\" id=\"ldTab1\" style=\"flex:1;padding:11px 6px;border:none;background:#1a237e;color:white;font-weight:600;font-size:12px;cursor:pointer;\">📊 District Chart</button>\n      <button onclick=\"switchLDTab(2)\" id=\"ldTab2\" style=\"flex:1;padding:11px 6px;border:none;background:#f5f5f5;color:#555;font-weight:600;font-size:12px;cursor:pointer;\">🥧 Category Split</button>\n      <button onclick=\"switchLDTab(3)\" id=\"ldTab3\" style=\"flex:1;padding:11px 6px;border:none;background:#f5f5f5;color:#555;font-weight:600;font-size:12px;cursor:pointer;\">📈 Trend</button>\n      <button onclick=\"switchLDTab(4)\" id=\"ldTab4\" style=\"flex:1;padding:11px 6px;border:none;background:#f5f5f5;color:#555;font-weight:600;font-size:12px;cursor:pointer;\">📅 Retirement</button>\n    </div>\n    <div style=\"overflow-y:auto;flex:1;padding:16px;background:#f8f9fa;\">\n      <div id=\"ldPane1\"><div style=\"background:white;border-radius:8px;padding:16px;border:1px solid #e0e0e0;\"><div style=\"font-size:13px;font-weight:700;color:#1a237e;margin-bottom:14px;\">District-wise Record Count</div><div style=\"position:relative;height:420px;\"><canvas id=\"ldDistBar\"></canvas></div></div></div>\n      <div id=\"ldPane2\" style=\"display:none;\"><div style=\"display:grid;grid-template-columns:1fr 1fr;gap:16px;\">\n        <div style=\"background:white;border-radius:8px;padding:16px;border:1px solid #e0e0e0;\"><div style=\"font-size:13px;font-weight:700;color:#1a237e;margin-bottom:14px;\">Category Split</div><div style=\"position:relative;height:280px;\"><canvas id=\"ldCatPie\"></canvas></div></div>\n        <div style=\"background:white;border-radius:8px;padding:16px;border:1px solid #e0e0e0;\"><div style=\"font-size:13px;font-weight:700;color:#1a237e;margin-bottom:14px;\">Gender Split</div><div style=\"position:relative;height:280px;\"><canvas id=\"ldGenderPie\"></canvas></div></div>\n      </div></div>\n      <div id=\"ldPane3\" style=\"display:none;\"><div style=\"background:white;border-radius:8px;padding:16px;border:1px solid #e0e0e0;\"><div style=\"font-size:13px;font-weight:700;color:#1a237e;margin-bottom:4px;\">Monthly Activity Trend</div><div style=\"position:relative;height:350px;\"><canvas id=\"ldTrendLine\"></canvas></div></div></div>\n      <div id=\"ldPane4\" style=\"display:none;\"><div style=\"background:white;border-radius:8px;padding:16px;border:1px solid #e0e0e0;\"><div style=\"font-size:13px;font-weight:700;color:#1a237e;margin-bottom:14px;\">Retirement Timeline — Next 12 Months</div><div style=\"position:relative;height:260px;\"><canvas id=\"ldRetBar\"></canvas></div></div><div id=\"ldRetDetail\" style=\"background:white;border-radius:8px;padding:14px;border:1px solid #e0e0e0;margin-top:14px;\"></div></div>\n    </div>\n    <div style=\"padding:10px 16px;background:white;border-top:1px solid #eee;display:flex;justify-content:space-between;align-items:center;flex-shrink:0;\">\n      <span style=\"font-size:11px;color:#aaa;\">Total: " + _0x2d0f61.length + " records loaded</span>\n      <button onclick=\"document.getElementById('liveDashModal').remove()\" style=\"background:#c62828;color:white;border:none;padding:7px 16px;border-radius:4px;cursor:pointer;font-weight:600;font-size:12px;\">✖ Close</button>\n    </div>\n  </div>";
  document.body.appendChild(_0x43f676);
  _0x43f676.addEventListener("click", _0x2c5cfa => {
    if (_0x2c5cfa.target === _0x43f676) {
      _0x43f676.remove();
    }
  });
  _buildLDKPI(_0x2d0f61);
  _buildLDDistBar(_0x2d0f61);
  _buildLDCatPie(_0x2d0f61);
  _buildLDTrend(_0x2d0f61);
  _buildLDRetirement(_0x2d0f61);
}
function switchLDTab(_0x5c5db7) {
  for (let _0x2809d4 = 1; _0x2809d4 <= 4; _0x2809d4++) {
    const _0x454d17 = document.getElementById("ldPane" + _0x2809d4);
    const _0x1d34ad = document.getElementById("ldTab" + _0x2809d4);
    if (_0x454d17) {
      _0x454d17.style.display = _0x2809d4 === _0x5c5db7 ? "block" : "none";
    }
    if (_0x1d34ad) {
      _0x1d34ad.style.background = _0x2809d4 === _0x5c5db7 ? "#1a237e" : "#f5f5f5";
      _0x1d34ad.style.color = _0x2809d4 === _0x5c5db7 ? "white" : "#555";
    }
  }
}
function _buildLDKPI(_0x1a59a6) {
  const _0x11ff7c = _0x1a59a6.filter(_0x3d8141 => !(_0x3d8141.field30 || "").toUpperCase().includes("DELETE"));
  const _0x275aa5 = _0x1a59a6.filter(_0x5cfecd => (_0x5cfecd.field30 || "").toUpperCase().includes("NEW"));
  const _0x3b86b8 = _0x1a59a6.filter(_0x30a180 => (_0x30a180.field30 || "").toUpperCase().includes("UPDATED"));
  const _0x256c22 = _0x1a59a6.filter(_0x5a6444 => (_0x5a6444.field30 || "").toUpperCase().includes("DELETE"));
  const _0x427fd9 = new Date();
  const _0x212961 = _0x1a59a6.filter(_0x34ff6f => {
    const _0x4401f0 = _0x34ff6f.field7 || "";
    if (!_0x4401f0 || _0x4401f0 === "NIL") {
      return false;
    }
    const _0x5b9a65 = _0x4401f0.split("-");
    let _0x1ff2bf = null;
    if (_0x5b9a65.length === 3) {
      _0x1ff2bf = _0x5b9a65[0].length === 4 ? new Date(_0x5b9a65[0], _0x5b9a65[1] - 1, _0x5b9a65[2]) : new Date(_0x5b9a65[2], _0x5b9a65[1] - 1, _0x5b9a65[0]);
    }
    if (!_0x1ff2bf || isNaN(_0x1ff2bf)) {
      return false;
    }
    const _0x5772ff = _0x1ff2bf.getDate();
    let _0x30346b = _0x1ff2bf.getMonth();
    let _0x20efac = _0x1ff2bf.getFullYear() + 62;
    if (_0x5772ff === 1) {
      _0x30346b--;
      if (_0x30346b < 0) {
        _0x30346b = 11;
        _0x20efac--;
      }
    }
    const _0x250e70 = new Date(_0x20efac, _0x30346b + 1, 0);
    return _0x250e70.getFullYear() === _0x427fd9.getFullYear() && _0x250e70.getMonth() === _0x427fd9.getMonth();
  });
  const _0x538353 = [{
    label: "Total Active",
    val: _0x11ff7c.length,
    color: "#1565c0",
    bg: "#e3f2fd"
  }, {
    label: "New Entries",
    val: _0x275aa5.length,
    color: "#2e7d32",
    bg: "#e8f5e9"
  }, {
    label: "Updated",
    val: _0x3b86b8.length,
    color: "#e65100",
    bg: "#fff3e0"
  }, {
    label: "Deleted",
    val: _0x256c22.length,
    color: "#c62828",
    bg: "#ffebee"
  }, {
    label: "Retiring This Month",
    val: _0x212961.length,
    color: "#6a1b9a",
    bg: "#f3e5f5"
  }];
  const _0x2eb7df = document.getElementById("ldKpiStrip");
  if (_0x2eb7df) {
    _0x2eb7df.innerHTML = _0x538353.map(_0x31f583 => "<div style=\"flex:1;padding:12px 10px;text-align:center;border-right:1px solid #eee;background:" + _0x31f583.bg + ";\"><div style=\"font-size:22px;font-weight:700;color:" + _0x31f583.color + ";\">" + _0x31f583.val + "</div><div style=\"font-size:10px;color:#777;margin-top:2px;\">" + _0x31f583.label + "</div></div>").join("");
  }
}
function _buildLDDistBar(_0x1f7222) {
  const _0x47f15d = {};
  _0x1f7222.forEach(_0x50f8c5 => {
    if ((_0x50f8c5.field30 || "").toUpperCase().includes("DELETE")) {
      return;
    }
    let _0x1ab3a5 = (_0x50f8c5.field24 || "").toUpperCase().trim().replace(/^DEO\s*/, "");
    if (!_0x1ab3a5 || _0x1ab3a5.length < 2) {
      return;
    }
    _0x47f15d[_0x1ab3a5] = (_0x47f15d[_0x1ab3a5] || 0) + 1;
  });
  const _0x250a6f = Object.entries(_0x47f15d).sort((_0x1fdf7d, _0x4b830d) => _0x4b830d[1] - _0x1fdf7d[1]);
  const _0x47c087 = document.getElementById("ldDistBar");
  if (!_0x47c087) {
    return;
  }
  new Chart(_0x47c087, {
    type: "bar",
    data: {
      labels: _0x250a6f.map(_0xb17f6e => _0xb17f6e[0]),
      datasets: [{
        label: "Records",
        data: _0x250a6f.map(_0x5228a5 => _0x5228a5[1]),
        backgroundColor: "rgba(21,101,192,0.8)",
        borderRadius: 4
      }]
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          grid: {
            color: "#f0f0f0"
          }
        },
        y: {
          grid: {
            display: false
          },
          ticks: {
            font: {
              size: 10
            }
          }
        }
      }
    }
  });
}
function _buildLDCatPie(_0x528354) {
  const _0x441b84 = _0x528354.filter(_0x2d186d => !(_0x2d186d.field30 || "").toUpperCase().includes("DELETE"));
  const _0x21e4db = {
    SC: 0,
    ST: 0,
    OBC: 0,
    UR: 0,
    Other: 0
  };
  _0x441b84.forEach(_0x36bf7d => {
    const _0x193e4b = (_0x36bf7d.field5 || "").toUpperCase().trim();
    if (_0x21e4db[_0x193e4b] !== undefined) {
      _0x21e4db[_0x193e4b]++;
    } else {
      _0x21e4db.Other++;
    }
  });
  const _0x2bf59d = document.getElementById("ldCatPie");
  if (_0x2bf59d) {
    new Chart(_0x2bf59d, {
      type: "doughnut",
      data: {
        labels: Object.keys(_0x21e4db).filter(_0x21cf51 => _0x21e4db[_0x21cf51] > 0),
        datasets: [{
          data: Object.values(_0x21e4db).filter(_0xde991a => _0xde991a > 0),
          backgroundColor: ["#e53935", "#f57c00", "#1565c0", "#2e7d32", "#9e9e9e"],
          borderWidth: 2,
          borderColor: "white"
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom"
          }
        }
      }
    });
  }
  const _0x2c2e2f = {
    Male: 0,
    Female: 0
  };
  _0x441b84.forEach(_0x4b120f => {
    const _0x476f24 = (_0x4b120f.field6 || "").toUpperCase();
    if (_0x476f24 === "M") {
      _0x2c2e2f.Male++;
    } else if (_0x476f24 === "F") {
      _0x2c2e2f.Female++;
    }
  });
  const _0x1689b6 = document.getElementById("ldGenderPie");
  if (_0x1689b6) {
    new Chart(_0x1689b6, {
      type: "doughnut",
      data: {
        labels: ["Male", "Female"],
        datasets: [{
          data: [_0x2c2e2f.Male, _0x2c2e2f.Female],
          backgroundColor: ["#1565c0", "#e91e63"],
          borderWidth: 2,
          borderColor: "white"
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom"
          }
        }
      }
    });
  }
}
function _buildLDTrend(_0x16ecae) {
  const _0x79f001 = new Date();
  const _0x2aef01 = [];
  const _0x1bc8f4 = [];
  const _0x56a8f4 = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  for (let _0x3ea11f = 11; _0x3ea11f >= 0; _0x3ea11f--) {
    const _0x40fca0 = new Date(_0x79f001.getFullYear(), _0x79f001.getMonth() - _0x3ea11f, 1);
    _0x2aef01.push(_0x40fca0.getFullYear() + "-" + String(_0x40fca0.getMonth() + 1).padStart(2, "0"));
    _0x1bc8f4.push(_0x56a8f4[_0x40fca0.getMonth()] + "'" + String(_0x40fca0.getFullYear()).slice(2));
  }
  const _0x11583e = _0x2aef01.map(() => 0);
  const _0x9fef = _0x2aef01.map(() => 0);
  const _0x19c9bb = _0x2aef01.map(() => 0);
  _0x16ecae.forEach(_0x5b825f => {
    const _0x52aed3 = (_0x5b825f.field31 || "").trim();
    const _0x24dc30 = _0x52aed3.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
    if (!_0x24dc30) {
      return;
    }
    const [, _0x2a9019, _0x359814, _0x5124ee] = _0x24dc30;
    const _0x353774 = _0x5124ee + "-" + _0x359814.padStart(2, "0");
    const _0x4285d1 = _0x2aef01.indexOf(_0x353774);
    if (_0x4285d1 === -1) {
      return;
    }
    const _0x53ebde = (_0x5b825f.field30 || "").toUpperCase();
    if (_0x53ebde.includes("DELETE")) {
      _0x19c9bb[_0x4285d1]++;
    } else if (_0x53ebde.includes("NEW")) {
      _0x11583e[_0x4285d1]++;
    } else if (_0x53ebde.includes("UPDATED")) {
      _0x9fef[_0x4285d1]++;
    }
  });
  const _0x221db8 = document.getElementById("ldTrendLine");
  if (!_0x221db8) {
    return;
  }
  new Chart(_0x221db8, {
    type: "line",
    data: {
      labels: _0x1bc8f4,
      datasets: [{
        label: "New",
        data: _0x11583e,
        borderColor: "#2e7d32",
        backgroundColor: "rgba(46,125,50,0.1)",
        tension: 0.4,
        fill: true
      }, {
        label: "Updated",
        data: _0x9fef,
        borderColor: "#1565c0",
        backgroundColor: "rgba(21,101,192,0.1)",
        tension: 0.4,
        fill: true
      }, {
        label: "Deleted",
        data: _0x19c9bb,
        borderColor: "#c62828",
        backgroundColor: "rgba(198,40,40,0.08)",
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom"
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: "#f0f0f0"
          }
        }
      }
    }
  });
}
function _buildLDRetirement(_0x29dc48) {
  const _0x559f2c = new Date();
  const _0x5f22ab = [];
  const _0x47dc7e = [];
  const _0x30ac02 = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  for (let _0x39421e = 0; _0x39421e < 12; _0x39421e++) {
    const _0x1b6353 = new Date(_0x559f2c.getFullYear(), _0x559f2c.getMonth() + _0x39421e, 1);
    _0x5f22ab.push({
      y: _0x1b6353.getFullYear(),
      m: _0x1b6353.getMonth()
    });
    _0x47dc7e.push(_0x30ac02[_0x1b6353.getMonth()] + "'" + String(_0x1b6353.getFullYear()).slice(2));
  }
  const _0x4c07b4 = _0x5f22ab.map(() => 0);
  const _0x55fa62 = _0x5f22ab.map(() => []);
  _0x29dc48.forEach(_0x48af70 => {
    const _0x10cd29 = _0x48af70.field7 || "";
    if (!_0x10cd29 || _0x10cd29 === "NIL") {
      return;
    }
    const _0xa05763 = _0x10cd29.split("-");
    let _0x5af652 = null;
    if (_0xa05763.length === 3) {
      _0x5af652 = _0xa05763[0].length === 4 ? new Date(_0xa05763[0], _0xa05763[1] - 1, _0xa05763[2]) : new Date(_0xa05763[2], _0xa05763[1] - 1, _0xa05763[0]);
    }
    if (!_0x5af652 || isNaN(_0x5af652)) {
      return;
    }
    const _0x12e845 = _0x5af652.getDate();
    let _0x3dc227 = _0x5af652.getFullYear() + 62;
    let _0x265bb9 = _0x5af652.getMonth();
    if (_0x12e845 === 1) {
      _0x265bb9--;
      if (_0x265bb9 < 0) {
        _0x265bb9 = 11;
        _0x3dc227--;
      }
    }
    const _0x429eb0 = _0x5f22ab.findIndex(_0x370af3 => _0x370af3.y === _0x3dc227 && _0x370af3.m === _0x265bb9);
    if (_0x429eb0 !== -1) {
      _0x4c07b4[_0x429eb0]++;
      _0x55fa62[_0x429eb0].push({
        name: _0x48af70.field4 || "—",
        id: _0x48af70.field3 || "—",
        dist: _0x48af70.field24 || "—"
      });
    }
  });
  const _0x248c0d = document.getElementById("ldRetBar");
  if (!_0x248c0d) {
    return;
  }
  new Chart(_0x248c0d, {
    type: "bar",
    data: {
      labels: _0x47dc7e,
      datasets: [{
        label: "Retirements",
        data: _0x4c07b4,
        backgroundColor: _0x4c07b4.map((_0x330a69, _0x37add1) => _0x37add1 === 0 ? "#c62828" : "rgba(21,101,192,0.7)"),
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: "#f0f0f0"
          }
        }
      }
    }
  });
  const _0x59bf1f = document.getElementById("ldRetDetail");
  if (!_0x59bf1f) {
    return;
  }
  const _0x131dba = _0x55fa62.flatMap((_0x403679, _0x1e586c) => _0x403679.map(_0x38f0b5 => ({
    ..._0x38f0b5,
    month: _0x47dc7e[_0x1e586c]
  }))).slice(0, 20);
  if (!_0x131dba.length) {
    _0x59bf1f.innerHTML = "<p style=\"color:#888;text-align:center;padding:15px;\">No retirements in next 12 months.</p>";
    return;
  }
  _0x59bf1f.innerHTML = "<div style=\"font-size:13px;font-weight:700;color:#1a237e;margin-bottom:10px;\">Upcoming Retirements (Next 12 Months)</div><table style=\"width:100%;border-collapse:collapse;font-size:11px;\"><thead><tr style=\"background:#f0f0f0;\"><th style=\"padding:6px 10px;text-align:left;border:1px solid #ddd;\">Name</th><th style=\"padding:6px 10px;border:1px solid #ddd;\">ID</th><th style=\"padding:6px 10px;border:1px solid #ddd;\">District</th><th style=\"padding:6px 10px;border:1px solid #ddd;\">Month</th></tr></thead><tbody>" + _0x131dba.map(_0x2f30d5 => "<tr><td style=\"padding:5px 10px;border:1px solid #ddd;\">" + escHtml(_0x2f30d5.name) + "</td><td style=\"padding:5px 10px;border:1px solid #ddd;\">" + escHtml(_0x2f30d5.id) + "</td><td style=\"padding:5px 10px;border:1px solid #ddd;\">" + escHtml(_0x2f30d5.dist) + "</td><td style=\"padding:5px 10px;border:1px solid #ddd;color:#c62828;font-weight:600;\">" + _0x2f30d5.month + "</td></tr>").join("") + "</tbody></table>";
}
function openCompletionTracker() {
  const _0x2249bd = new Date();
  const _0x547eea = [];
  const _0x50fb65 = {
    "JD BHOPAL": ["BHOPAL", "RAISEN", "RAJGARH", "SEHORE", "VIDISHA"],
    "JD GWALIOR": ["ASHOKNAGAR", "BHIND", "DATIA", "GUNA", "GWALIOR", "MORENA", "SHEOPUR", "SHIVPURI"],
    "JD INDORE": ["ALIRAJPUR", "BARWANI", "BURHANPUR", "DHAR", "INDORE", "JHABUA", "KHANDWA", "KHARGONE"],
    "JD JABALPUR": ["BALAGHAT", "CHHINDWARA", "PANDHURNA", "DINDORI", "JABALPUR", "KATNI", "MANDLA", "NARSINGHPUR", "SEONI"],
    "JD UJJAIN": ["AGAR MALWA", "DEWAS", "MANDSAUR", "NEEMUCH", "RATLAM", "SHAJAPUR", "UJJAIN"],
    "JD SAGAR": ["CHHATARPUR", "DAMOH", "NIWARI", "PANNA", "SAGAR", "TIKAMGARH"],
    "JD REWA": ["REWA", "SATNA", "SIDHI", "SINGRAULI"],
    "JD NARMADAPURAM": ["BETUL", "HARDA", "NARMADAPURAM"],
    "JD SHAHDOL": ["ANUPPUR", "SHAHDOL", "UMARIA"]
  };
  const _0x618fde = {
    "JD BHOPAL": "#1565c0",
    "JD GWALIOR": "#2e7d32",
    "JD INDORE": "#e65100",
    "JD JABALPUR": "#6a1b9a",
    "JD UJJAIN": "#00838f",
    "JD SAGAR": "#c62828",
    "JD REWA": "#f57c00",
    "JD NARMADAPURAM": "#37474f",
    "JD SHAHDOL": "#558b2f"
  };
  const _0x28fdd2 = _getBaseData();
  const _0x3c2a28 = {};
  _0x28fdd2.forEach(_0x414fc8 => {
    const _0xaea8b8 = (_0x414fc8.field24 || "").toUpperCase().trim().replace(/^DEO\s*/, "");
    if (!_0xaea8b8) {
      return;
    }
    if (!_0x3c2a28[_0xaea8b8]) {
      _0x3c2a28[_0xaea8b8] = {
        active: 0,
        newEntry: 0,
        updated: 0,
        deleted: 0,
        lastActivity: null,
        loginId: ""
      };
    }
    const _0x5ba5e9 = (_0x414fc8.field30 || "").toUpperCase();
    const _0x3cc826 = _0x414fc8.field31 || "";
    if (!_0x5ba5e9.includes("DELETE")) {
      _0x3c2a28[_0xaea8b8].active++;
    }
    if (_0x5ba5e9.includes("NEW")) {
      _0x3c2a28[_0xaea8b8].newEntry++;
    }
    if (_0x5ba5e9.includes("UPDATED")) {
      _0x3c2a28[_0xaea8b8].updated++;
    }
    if (_0x5ba5e9.includes("DELETE")) {
      _0x3c2a28[_0xaea8b8].deleted++;
    }
    const _0x583825 = _0x3cc826.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
    if (_0x583825) {
      const [, _0x3d1aa3, _0x25e7a6, _0x1890d9] = _0x583825;
      const _0x49637c = new Date(_0x1890d9, _0x25e7a6 - 1, _0x3d1aa3);
      if (!_0x3c2a28[_0xaea8b8].lastActivity || _0x49637c > _0x3c2a28[_0xaea8b8].lastActivity) {
        _0x3c2a28[_0xaea8b8].lastActivity = _0x49637c;
      }
    }
    if (_0x3cc826 && !_0x3c2a28[_0xaea8b8].loginId) {
      _0x3c2a28[_0xaea8b8].loginId = _0x3cc826.split("|")[0].trim();
    }
  });
  Object.entries(_0x3c2a28).forEach(([_0x4f6623, _0x710f9f]) => _0x547eea.push({
    district: _0x4f6623,
    ..._0x710f9f
  }));
  const _0x869e44 = _0x547eea.reduce((_0x295a17, _0x56617e) => _0x295a17 + _0x56617e.active, 0);
  const _0x531f0a = _0x547eea.reduce((_0x5587ae, _0x4b808a) => _0x5587ae + _0x4b808a.newEntry, 0);
  const _0xa2fe68 = _0x547eea.reduce((_0x362beb, _0x37abc8) => _0x362beb + _0x37abc8.updated, 0);
  const _0xf6ae58 = Math.max(..._0x547eea.map(_0x402a45 => _0x402a45.active), 1);
  const _0x174760 = _0x547eea.filter(_0x293933 => _0x293933.lastActivity && Date.now() - _0x293933.lastActivity.getTime() < 604800000).length;
  const _0x54e8ff = _0x547eea.filter(_0x23271e => !_0x23271e.lastActivity || Date.now() - _0x23271e.lastActivity.getTime() > 2592000000).length;
  function _0x53813e(_0x335221) {
    if (!_0x335221) {
      return "<span style=\"color:#bbb;font-size:10px;\">Never</span>";
    }
    const _0x26287c = Math.floor((Date.now() - _0x335221.getTime()) / 86400000);
    if (_0x26287c === 0) {
      return "<span style=\"color:#2e7d32;font-size:10px;font-weight:600;\">Today</span>";
    }
    if (_0x26287c <= 7) {
      return "<span style=\"color:#1565c0;font-size:10px;\">" + _0x26287c + "d ago</span>";
    }
    if (_0x26287c <= 30) {
      return "<span style=\"color:#f57c00;font-size:10px;\">" + _0x26287c + "d ago</span>";
    }
    return "<span style=\"color:#c62828;font-size:10px;\">" + _0x26287c + "d ago</span>";
  }
  function _0x345de5(_0x2bff76) {
    if (!_0x2bff76.lastActivity) {
      return "<span style=\"background:#e0e0e0;color:#555;padding:2px 6px;border-radius:3px;font-size:9px;font-weight:600;\">INACTIVE</span>";
    }
    const _0x348477 = Math.floor((Date.now() - _0x2bff76.lastActivity.getTime()) / 86400000);
    if (_0x348477 <= 7) {
      return "<span style=\"background:#2e7d32;color:white;padding:2px 6px;border-radius:3px;font-size:9px;font-weight:600;\">ACTIVE</span>";
    }
    if (_0x348477 <= 30) {
      return "<span style=\"background:#f57c00;color:white;padding:2px 6px;border-radius:3px;font-size:9px;font-weight:600;\">SLOW</span>";
    }
    return "<span style=\"background:#c62828;color:white;padding:2px 6px;border-radius:3px;font-size:9px;font-weight:600;\">LAGGING</span>";
  }
  const _0x2624e8 = _0x547eea.slice().sort((_0x44054d, _0x77e0dd) => _0x77e0dd.active + _0x77e0dd.updated * 2 + _0x77e0dd.newEntry - (_0x44054d.active + _0x44054d.updated * 2 + _0x44054d.newEntry)).slice(0, 10);
  const _0x2a5ee9 = ["🥇", "🥈", "🥉"];
  const _0x351685 = _0x2624e8.map((_0x5a122f, _0x655706) => "<tr style=\"border-bottom:1px solid #f0f0f0;" + (_0x655706 < 3 ? "background:#fffde7;" : "") + "\"><td style=\"padding:6px 10px;text-align:center;font-size:14px;\">" + (_0x2a5ee9[_0x655706] || _0x655706 + 1) + "</td><td style=\"padding:6px 10px;font-size:11px;font-weight:700;\">" + _0x5a122f.district + "</td><td style=\"padding:6px 10px;text-align:center;font-size:11px;font-weight:700;color:#1565c0;\">" + _0x5a122f.active + "</td><td style=\"padding:6px 10px;text-align:center;font-size:11px;\">" + (_0x5a122f.newEntry + _0x5a122f.updated) + "</td><td style=\"padding:6px 10px;text-align:center;font-size:11px;\">" + _0x53813e(_0x5a122f.lastActivity) + "</td><td style=\"padding:6px 10px;text-align:center;\">" + _0x345de5(_0x5a122f) + "</td></tr>").join("");
  let _0x356425 = "";
  Object.entries(_0x50fb65).forEach(([_0x15c7c1, _0x5a5b20]) => {
    const _0x247c75 = _0x618fde[_0x15c7c1] || "#555";
    _0x356425 += "<div style=\"margin-bottom:14px;\"><div style=\"font-size:12px;font-weight:700;color:" + _0x247c75 + ";padding:5px 8px;background:rgba(0,0,0,0.04);border-radius:4px;margin-bottom:6px;\">" + _0x15c7c1 + "</div>";
    _0x5a5b20.forEach(_0x1bd785 => {
      const _0x3b9aaa = _0x3c2a28[_0x1bd785.toUpperCase()] || {
        active: 0,
        newEntry: 0,
        updated: 0,
        deleted: 0,
        lastActivity: null
      };
      const _0x407916 = _0xf6ae58 > 0 ? Math.round(_0x3b9aaa.active / _0xf6ae58 * 100) : 0;
      const _0x1be7f7 = _0x3b9aaa.active === 0 ? "#e0e0e0" : _0x247c75;
      _0x356425 += "<div data-district=\"" + _0x1bd785.toUpperCase() + "\" style=\"display:grid;grid-template-columns:120px 1fr 60px 90px 80px;gap:8px;align-items:center;margin-bottom:6px;\"><div style=\"font-size:11px;font-weight:600;color:#333;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;\" title=\"" + _0x1bd785 + "\">" + _0x1bd785 + "</div><div style=\"background:#f0f0f0;border-radius:4px;height:10px;overflow:hidden;\"><div style=\"width:" + _0x407916 + "%;height:100%;background:" + _0x1be7f7 + ";border-radius:4px;\"></div></div><div style=\"font-size:11px;font-weight:700;color:#333;text-align:right;\">" + _0x3b9aaa.active.toLocaleString("en-IN") + "</div><div style=\"font-size:10px;text-align:center;\">" + _0x53813e(_0x3b9aaa.lastActivity) + "</div><div style=\"font-size:10px;text-align:right;\">" + _0x345de5(_0x3b9aaa) + "</div></div>";
    });
    _0x356425 += "</div>";
  });
  const _0x794264 = document.createElement("div");
  _0x794264.id = "trackerModal";
  _0x794264.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.72);z-index:10002;overflow-y:auto;";
  _0x794264.innerHTML = "\n  <div style=\"max-width:1080px;margin:20px auto 40px;background:#f4f6fa;border-radius:12px;overflow:hidden;box-shadow:0 24px 70px rgba(0,0,0,0.45);\">\n    <div style=\"background:linear-gradient(135deg,#0d47a1,#1565c0);color:white;padding:18px 28px;display:flex;justify-content:space-between;align-items:center;\">\n      <div><div style=\"font-size:19px;font-weight:700;\">🏆 District Completion Tracker</div><div style=\"font-size:12px;opacity:.8;margin-top:3px;\">UMS Gradation • " + _0x2249bd.toLocaleString("en-IN") + "</div></div>\n      <div style=\"display:flex;gap:10px;align-items:center;\">\n        <button onclick=\"openCompletionTracker()\" style=\"background:rgba(255,255,255,.2);border:1px solid rgba(255,255,255,.4);color:white;padding:6px 14px;border-radius:6px;cursor:pointer;font-size:12px;font-weight:600;\">🔄 Refresh</button>\n        <button onclick=\"document.getElementById('trackerModal').remove()\" style=\"background:rgba(255,255,255,.15);border:none;color:white;width:34px;height:34px;border-radius:50%;font-size:16px;cursor:pointer;font-weight:bold;\">✕</button>\n      </div>\n    </div>\n    <div style=\"display:grid;grid-template-columns:repeat(5,1fr);gap:12px;padding:20px 24px 10px;\">\n      <div style=\"background:white;border-radius:8px;padding:13px 15px;border-top:3px solid #1565c0;\"><div style=\"font-size:10px;color:#888;font-weight:600;text-transform:uppercase;\">Total Active</div><div style=\"font-size:26px;font-weight:700;color:#1565c0;margin-top:3px;\">" + _0x869e44.toLocaleString("en-IN") + "</div></div>\n      <div style=\"background:white;border-radius:8px;padding:13px 15px;border-top:3px solid #2e7d32;\"><div style=\"font-size:10px;color:#888;font-weight:600;text-transform:uppercase;\">New Entries</div><div style=\"font-size:26px;font-weight:700;color:#2e7d32;margin-top:3px;\">" + _0x531f0a.toLocaleString("en-IN") + "</div></div>\n      <div style=\"background:white;border-radius:8px;padding:13px 15px;border-top:3px solid #0277bd;\"><div style=\"font-size:10px;color:#888;font-weight:600;text-transform:uppercase;\">Updated</div><div style=\"font-size:26px;font-weight:700;color:#0277bd;margin-top:3px;\">" + _0xa2fe68.toLocaleString("en-IN") + "</div></div>\n      <div style=\"background:white;border-radius:8px;padding:13px 15px;border-top:3px solid #2e7d32;\"><div style=\"font-size:10px;color:#888;font-weight:600;text-transform:uppercase;\">Active This Week</div><div style=\"font-size:26px;font-weight:700;color:#2e7d32;margin-top:3px;\">" + _0x174760 + "</div></div>\n      <div style=\"background:white;border-radius:8px;padding:13px 15px;border-top:3px solid #b71c1c;\"><div style=\"font-size:10px;color:#888;font-weight:600;text-transform:uppercase;\">Lagging (&gt;30d)</div><div style=\"font-size:26px;font-weight:700;color:#b71c1c;margin-top:3px;\">" + _0x54e8ff + "</div></div>\n    </div>\n    <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:14px;padding:10px 24px;\">\n      <div style=\"background:white;border-radius:10px;overflow:hidden;\">\n        <div style=\"padding:14px 16px;border-bottom:1px solid #f0f0f0;\"><div style=\"font-size:13px;font-weight:700;color:#1a237e;\">🏅 Top 10 Leaderboard</div><div style=\"font-size:11px;color:#888;margin-top:2px;\">Score = Active + Updated×2 + New</div></div>\n        <div style=\"overflow-y:auto;max-height:340px;\"><table style=\"width:100%;border-collapse:collapse;\"><thead><tr style=\"background:#f8f9fa;position:sticky;top:0;\"><th style=\"padding:8px 10px;font-size:10px;color:#666;text-align:center;width:36px;\">#</th><th style=\"padding:8px 10px;font-size:10px;color:#666;text-align:left;\">District</th><th style=\"padding:8px 10px;font-size:10px;color:#666;text-align:center;\">Records</th><th style=\"padding:8px 10px;font-size:10px;color:#666;text-align:center;\">Activity</th><th style=\"padding:8px 10px;font-size:10px;color:#666;text-align:center;\">Last Active</th><th style=\"padding:8px 10px;font-size:10px;color:#666;text-align:center;\">Status</th></tr></thead><tbody>" + _0x351685 + "</tbody></table></div>\n      </div>\n      <div style=\"background:white;border-radius:10px;overflow:hidden;\">\n        <div style=\"padding:14px 16px;border-bottom:1px solid #f0f0f0;background:#fff8f8;\"><div style=\"font-size:13px;font-weight:700;color:#b71c1c;\">⚠️ Attention Required</div><div style=\"font-size:11px;color:#888;margin-top:2px;\">Districts with no activity in last 30 days</div></div>\n        <div style=\"overflow-y:auto;max-height:340px;padding:8px 0;\">" + (_0x547eea.filter(_0x3ba0d6 => !_0x3ba0d6.lastActivity || Date.now() - _0x3ba0d6.lastActivity.getTime() > 2592000000).sort((_0x5ddb80, _0xd7e40f) => (_0x5ddb80.lastActivity ? _0x5ddb80.lastActivity.getTime() : 0) - (_0xd7e40f.lastActivity ? _0xd7e40f.lastActivity.getTime() : 0)).map(_0x5023ba => "<div style=\"display:flex;justify-content:space-between;align-items:center;padding:9px 16px;border-bottom:1px solid #ffeaea;\"><div><div style=\"font-size:12px;font-weight:700;color:#333;\">" + _0x5023ba.district + "</div><div style=\"font-size:10px;color:#999;\">" + _0x5023ba.active + " records</div></div><div style=\"text-align:right;\">" + _0x53813e(_0x5023ba.lastActivity) + "<div style=\"margin-top:2px;\">" + _0x345de5(_0x5023ba) + "</div></div></div>").join("") || "<div style=\"padding:20px;text-align:center;color:#2e7d32;font-weight:600;\">✅ Sab districts active hain!</div>") + "</div>\n      </div>\n    </div>\n    <div style=\"padding:10px 24px 28px;\">\n      <div style=\"background:white;border-radius:10px;padding:18px 20px;\">\n        <div style=\"display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;\">\n          <div style=\"font-size:13px;font-weight:700;color:#333;\">📊 All Districts — Progress View</div>\n          <input type=\"text\" oninput=\"filterTrackerRows(this.value)\" placeholder=\"Search district...\" style=\"padding:5px 10px;border:1px solid #ddd;border-radius:6px;font-size:12px;width:160px;\">\n        </div>\n        <div style=\"display:grid;grid-template-columns:120px 1fr 60px 90px 80px;gap:8px;margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid #eee;\">\n          <div style=\"font-size:10px;font-weight:700;color:#888;text-transform:uppercase;\">District</div>\n          <div style=\"font-size:10px;font-weight:700;color:#888;text-transform:uppercase;\">Progress</div>\n          <div style=\"font-size:10px;font-weight:700;color:#888;text-transform:uppercase;text-align:right;\">Records</div>\n          <div style=\"font-size:10px;font-weight:700;color:#888;text-transform:uppercase;text-align:center;\">Last Active</div>\n          <div style=\"font-size:10px;font-weight:700;color:#888;text-transform:uppercase;text-align:right;\">Status</div>\n        </div>\n        <div id=\"trackerProgressBody\">" + _0x356425 + "</div>\n      </div>\n    </div>\n  </div>";
  document.body.appendChild(_0x794264);
  _0x794264.addEventListener("click", _0x16aecf => {
    if (_0x16aecf.target === _0x794264) {
      _0x794264.remove();
    }
  });
}
function filterTrackerRows(_0x3d7b6b) {
  const _0x65b6b7 = document.getElementById("trackerProgressBody");
  if (!_0x65b6b7) {
    return;
  }
  const _0x24eddc = _0x3d7b6b.trim().toUpperCase();
  _0x65b6b7.querySelectorAll("[data-district]").forEach(_0x5881d0 => {
    _0x5881d0.style.display = !_0x24eddc || _0x5881d0.dataset.district.includes(_0x24eddc) ? "" : "none";
  });
}
function openAdvancedFilter() {
  if (document.getElementById("advFilterModal")) {
    document.getElementById("advFilterModal").remove();
    return;
  }
  const _0x1c9b54 = document.createElement("div");
  _0x1c9b54.id = "advFilterModal";
  _0x1c9b54.style.cssText = "position:fixed;top:60px;right:20px;z-index:9000;background:white;border:1px solid #ccc;border-radius:10px;box-shadow:0 10px 30px rgba(0,0,0,.3);width:340px;font-family:sans-serif;overflow:hidden;";
  _0x1c9b54.innerHTML = "\n  <div style=\"background:#002147;color:white;padding:12px 16px;display:flex;justify-content:space-between;align-items:center;\">\n    <span style=\"font-weight:700;font-size:14px;\">📊 Advanced Filter</span>\n    <button onclick=\"document.getElementById('advFilterModal').remove()\" style=\"background:none;border:none;color:white;font-size:18px;cursor:pointer;\">×</button>\n  </div>\n  <div style=\"padding:16px;\">\n    <div style=\"margin-bottom:12px;\"><label style=\"font-size:11px;font-weight:600;color:#555;display:block;margin-bottom:4px;\">Category</label><select id=\"afCat\" style=\"width:100%;padding:6px;border:1px solid #ddd;border-radius:4px;font-size:12px;\"><option value=\"\">All</option><option>SC</option><option>ST</option><option>OBC</option><option>UR</option></select></div>\n    <div style=\"margin-bottom:12px;\"><label style=\"font-size:11px;font-weight:600;color:#555;display:block;margin-bottom:4px;\">Gender</label><select id=\"afGender\" style=\"width:100%;padding:6px;border:1px solid #ddd;border-radius:4px;font-size:12px;\"><option value=\"\">All</option><option value=\"M\">Male</option><option value=\"F\">Female</option></select></div>\n    <div style=\"margin-bottom:12px;\"><label style=\"font-size:11px;font-weight:600;color:#555;display:block;margin-bottom:4px;\">Mode of Appointment</label><select id=\"afMode\" style=\"width:100%;padding:6px;border:1px solid #ddd;border-radius:4px;font-size:12px;\"><option value=\"\">All</option><option>DIR</option><option>PRO</option></select></div>\n    <div style=\"margin-bottom:12px;\"><label style=\"font-size:11px;font-weight:600;color:#555;display:block;margin-bottom:4px;\">Status</label><select id=\"afStatus\" style=\"width:100%;padding:6px;border:1px solid #ddd;border-radius:4px;font-size:12px;\"><option value=\"\">All</option><option>New Entry</option><option>Updated</option><option>Deleted</option></select></div>\n    <div style=\"margin-bottom:12px;\"><label style=\"font-size:11px;font-weight:600;color:#555;display:block;margin-bottom:4px;\">Present District</label><select id=\"afDistrict\" style=\"width:100%;padding:6px;border:1px solid #ddd;border-radius:4px;font-size:12px;\"><option value=\"\">All Districts</option>" + districts.filter(Boolean).map(_0x3307c9 => "<option>" + _0x3307c9 + "</option>").join("") + "</select></div>\n    <div style=\"display:flex;gap:8px;margin-top:16px;\">\n      <button onclick=\"applyAdvancedFilter()\" style=\"flex:1;background:#002147;color:white;border:none;padding:9px;border-radius:4px;cursor:pointer;font-weight:700;font-size:13px;\">✅ Apply</button>\n      <button onclick=\"resetAdvancedFilter()\" style=\"flex:1;background:#ff4d4d;color:white;border:none;padding:9px;border-radius:4px;cursor:pointer;font-weight:700;font-size:13px;\">↺ Reset</button>\n    </div>\n    <div id=\"afResultCount\" style=\"margin-top:10px;font-size:11px;color:#888;text-align:center;\"></div>\n  </div>";
  document.body.appendChild(_0x1c9b54);
}
function applyAdvancedFilter() {
  const _0x1a1e99 = (document.getElementById("afCat") || {}).value || "";
  const _0x24c511 = (document.getElementById("afGender") || {}).value || "";
  const _0x44b15e = (document.getElementById("afMode") || {}).value || "";
  const _0x4eeb80 = (document.getElementById("afStatus") || {}).value || "";
  const _0x58376d = (document.getElementById("afDistrict") || {}).value || "";
  window.filteredData = window.fullData.filter(_0x1db5a9 => {
    if (_0x1a1e99 && (_0x1db5a9.field5 || "").toUpperCase() !== _0x1a1e99.toUpperCase()) {
      return false;
    }
    if (_0x24c511 && (_0x1db5a9.field6 || "").toUpperCase() !== _0x24c511.toUpperCase()) {
      return false;
    }
    if (_0x44b15e && (_0x1db5a9.field8 || "").toUpperCase() !== _0x44b15e.toUpperCase()) {
      return false;
    }
    if (_0x4eeb80 && !(_0x1db5a9.field30 || "").toUpperCase().includes(_0x4eeb80.toUpperCase())) {
      return false;
    }
    if (_0x58376d && (_0x1db5a9.field24 || "").toUpperCase().trim() !== _0x58376d.toUpperCase().trim()) {
      return false;
    }
    return true;
  });
  renderVirtual();
  const _0x42c6c7 = document.getElementById("afResultCount");
  if (_0x42c6c7) {
    _0x42c6c7.textContent = "✅ " + window.filteredData.length + " records found";
  }
}
function resetAdvancedFilter() {
  ["afCat", "afGender", "afMode", "afStatus", "afDistrict"].forEach(_0xea0bbe => {
    const _0x20dc4d = document.getElementById(_0xea0bbe);
    if (_0x20dc4d) {
      _0x20dc4d.value = "";
    }
  });
  window.filteredData = [...window.fullData];
  renderVirtual();
  const _0x460980 = document.getElementById("afResultCount");
  if (_0x460980) {
    _0x460980.textContent = "";
  }
}
const CUSTOM_PASS_KEY = "ums_customPasswords";
const PW_RESET_LOG_KEY = "ums_pw_reset_log";
window._customPasswords = {};
window._pwResetLog = [];
async function loadPasswordsFromSupabase() {
  try {
    const _0x5308b7 = getSupabase();
    if (_0x5308b7) {
      const {
        data: _0x1b3111
      } = await _0x5308b7.from("ums_pw_reset_log").select("*").order("reset_at", {
        ascending: false
      }).limit(100);
      if (_0x1b3111) {
        window._pwResetLog = _0x1b3111.map(function (_0x37be81) {
          return {
            userId: _0x37be81.user_id,
            dateTime: new Date(_0x37be81.reset_at).toLocaleString("en-IN", {
              hour12: true
            }),
            resetBy: _0x37be81.reset_by,
            oldPass: _0x37be81.old_pass,
            newPass: _0x37be81.new_pass
          };
        });
      }
    }
  } catch (_0x194bd3) {}
  const _0x3a9ff5 = getSupabase();
  if (!_0x3a9ff5) {
    return;
  }
  try {
    const {
      data: _0x103e46,
      error: _0x4fe4e0
    } = await _0x3a9ff5.from("ums_users").select("user_id, password");
    if (!_0x4fe4e0 && _0x103e46 && _0x103e46.length > 0) {
      const _0x5aeb34 = window._customPasswords || {};
      _0x103e46.forEach(_0x1ea4a5 => {
        if (_0x1ea4a5.user_id && _0x1ea4a5.password) {
          _0x5aeb34[_0x1ea4a5.user_id] = _0x1ea4a5.password;
        }
      });
      window._customPasswords = _0x5aeb34;
      console.log("✅ Passwords loaded from ums_users:", _0x103e46.length, "users");
    }
  } catch (_0x29fb45) {
    console.warn("Password load from Supabase failed:", _0x29fb45);
  }
}
async function saveNewUserToSupabase(_0xa3ed4c, _0x2feb34) {
  const _0x4792e3 = getSupabase();
  if (!_0x4792e3) {
    return;
  }
  try {
    await _0x4792e3.from("ums_users").upsert({
      user_id: _0xa3ed4c,
      password: _0x2feb34,
      level: "DEO",
      created_by: "DPI"
    }, {
      onConflict: "user_id"
    });
    console.log("✅ New user saved to ums_users:", _0xa3ed4c);
  } catch (_0x23c34a) {
    console.warn("New user save failed:", _0x23c34a);
  }
}
async function savePasswordToSupabase(_0x2681c4, _0x4e9e5f, _0x7dcf8f) {
  const _0x427c4f = getSupabase();
  if (!_0x427c4f) {
    return;
  }
  try {
    await _0x427c4f.from("ums_user_passwords").upsert({
      user_id: _0x2681c4,
      password: _0x4e9e5f,
      changed_by: _0x7dcf8f || "DPI",
      changed_at: new Date().toISOString()
    }, {
      onConflict: "user_id"
    });
    console.log("✅ Password change saved to ums_user_passwords for:", _0x2681c4);
    await _0x427c4f.from("ums_users").update({
      password: _0x4e9e5f
    }).eq("user_id", _0x2681c4);
    console.log("✅ Password also updated in ums_users for:", _0x2681c4);
  } catch (_0x32c4a8) {
    console.warn("Password save failed:", _0x32c4a8);
  }
}
async function createNewUser() {
  if (currentUser !== "DPI") {
    myAlert("⛔ Only DPI can perform this action.");
    return;
  }
  const _0x4c82a3 = (document.getElementById("newUserId").value || "").trim().toUpperCase();
  const _0x25f80f = (document.getElementById("newUserPass").value || "").trim();
  const _0x3a558f = document.getElementById("newUserMsg");
  if (!_0x4c82a3) {
    _0x3a558f.innerHTML = "<span style=\"color:red;\">❌ User ID खाली नहीं हो सकती।</span>";
    return;
  }
  if (_0x4c82a3.length < 3) {
    _0x3a558f.innerHTML = "<span style=\"color:red;\">❌ User ID कम से कम 3 characters की होनी चाहिए।</span>";
    return;
  }
  if (!_0x25f80f || _0x25f80f.length < 4) {
    _0x3a558f.innerHTML = "<span style=\"color:red;\">❌ Password कम से कम 4 characters का होना चाहिए।</span>";
    return;
  }
  if (districtCredentials[_0x4c82a3]) {
    _0x3a558f.innerHTML = "<span style=\"color:#b45309;\">⚠️ यह User ID पहले से system में है। Password बदलने के लिए नीचे list use करें।</span>";
    return;
  }
  const _0x2f74 = window._customPasswords || {};
  if (_0x2f74[_0x4c82a3]) {
    _0x3a558f.innerHTML = "<span style=\"color:#b45309;\">⚠️ यह User ID पहले से बनाई गई है। नीचे list में \"Change\" से password update करें।</span>";
    return;
  }
  _0x2f74[_0x4c82a3] = _0x25f80f;
  window._customPasswords = _0x2f74;
  await saveNewUserToSupabase(_0x4c82a3, _0x25f80f);
  auditLog("NEW_USER_CREATED", "DPI ne naya user banaya: " + _0x4c82a3);
  _0x3a558f.innerHTML = "<span style=\"color:#059669;font-weight:bold;\">✅ User \"<b>" + escHtml(_0x4c82a3) + "</b>\" बन गया! अब यह सभी devices पर login कर सकता है।</span>";
  document.getElementById("newUserId").value = "";
  document.getElementById("newUserPass").value = "";
  renderPwTable(document.getElementById("pwSearchBox").value);
}
function getEffectivePassword(_0x5aa4cd) {
  const _0x320d3d = window._customPasswords || {};
  return _0x320d3d[_0x5aa4cd] || districtCredentials[_0x5aa4cd] || null;
}
const _origCheckLoginPw = checkLogin;
checkLogin = function () {
  const _0x50d55f = (document.getElementById("userField").value || "").trim().toUpperCase();
  const _0x466158 = (document.getElementById("passField").value || "").trim();
  const _0x167220 = document.getElementById("loginError");
  const _0x286744 = "ums_block_" + _0x50d55f;
  const _0xef8b07 = "ums_att_" + _0x50d55f;
  const _0x431589 = window._loginBlocks[_0x286744] || null;
  if (_0x431589) {
    const _0x6b77bf = Math.ceil((_0x431589.until - Date.now()) / 1000);
    if (_0x6b77bf > 0) {
      _0x167220.textContent = "🔒 Account locked. Please try again in " + _0x6b77bf + " seconds.";
      return;
    } else {
      delete window._loginBlocks[_0x286744];
      delete window._loginAttempts[_0xef8b07];
    }
  }
  const _0x1138a1 = getEffectivePassword(_0x50d55f);
  if (_0x1138a1 && _0x466158 === _0x1138a1) {
    delete window._loginAttempts[_0xef8b07];
    delete window._loginBlocks[_0x286744];
    currentUser = _0x50d55f;
    window.currentUser = _0x50d55f;
    document.getElementById("loginOverlay").style.display = "none";
    document.body.style.overflow = "";
    document.getElementById("userBadge").style.display = "inline-block";
    document.getElementById("userBadge").textContent = "👤 " + _0x50d55f;
    if (document.getElementById("sessionUser")) {
      document.getElementById("sessionUser").textContent = _0x50d55f + " — Logged in";
    }
    const _0x6143a7 = DEO_DISTRICT[_0x50d55f];
    if (_0x6143a7) {
      document.getElementById("in22").value = _0x6143a7;
    }
    auditLog("LOGIN", "User logged in");
    if (typeof initRealtime === "function") {
      initRealtime();
    }
    if (typeof checkLockStatus === "function") {
      checkLockStatus();
    }
    if (typeof checkMaintenanceStatus === "function") {
      checkMaintenanceStatus();
    }
    const _0xde7cd3 = document.getElementById("storageBadge");
    if (_0xde7cd3) {
      _0xde7cd3.innerHTML = "⏳ Loading data from cloud...";
    }
    const _0x744765 = document.getElementById("dataLoadBar");
    const _0x5b4212 = document.getElementById("dataLoadPct");
    const _0x257cde = document.getElementById("dataLoadMsg");
    const _0x5e166c = document.getElementById("dataLoadCount");
    if (_0x744765) {
      _0x744765.style.width = "0%";
    }
    if (_0x5b4212) {
      _0x5b4212.textContent = "0%";
    }
    if (_0x257cde) {
      _0x257cde.textContent = "Cloud से कनेक्ट हो रहे हैं";
    }
    if (_0x5e166c) {
      _0x5e166c.textContent = "";
    }
    loadDataFromSupabase().then(function (_0x10c258) {
      if (_0x10c258 && window.fullData.length > 0) {
        renderVirtual();
        updateStorageBadge(true);
      } else if (_0xde7cd3) {
        _0xde7cd3.innerHTML = "⚠️ No records found in cloud.";
      }
      _ensureHistoryLogColumn();
    });
  } else {
    let _0x4bbc96 = (window._loginAttempts[_0xef8b07] || 0) + 1;
    window._loginAttempts[_0xef8b07] = _0x4bbc96;
    if (_0x4bbc96 >= 3) {
      window._loginBlocks[_0x286744] = {
        until: Date.now() + 300000
      };
      delete window._loginAttempts[_0xef8b07];
      _0x167220.textContent = "🔒 Account locked for 5 minutes due to 3 failed attempts.";
    } else {
      _0x167220.textContent = "❌ Invalid User ID or Password. (" + _0x4bbc96 + "/3 attempts)";
    }
  }
};
window._otpStore = {};
function _generateOTP() {
  return String(Math.floor(100000 + Math.random() * 900000));
}
function _showPwStep(_0x2767eb) {
  [1, 2, 3].forEach(_0x4852e9 => {
    const _0x3ec700 = document.getElementById("otpStep" + _0x4852e9);
    if (_0x3ec700) {
      _0x3ec700.style.display = _0x4852e9 === _0x2767eb ? "block" : "none";
    }
  });
}
function openChangePassword() {
  if (document.getElementById("changePwModal")) {
    document.getElementById("changePwModal").remove();
  }
  const _0x63316b = document.createElement("div");
  _0x63316b.id = "changePwModal";
  _0x63316b.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.75);z-index:10005;display:flex;align-items:center;justify-content:center;";
  _0x63316b.innerHTML = "\n  <div style=\"background:white;border-radius:10px;width:90%;max-width:400px;box-shadow:0 15px 40px rgba(0,0,0,0.5);overflow:hidden;font-family:sans-serif;\">\n    <div style=\"background:linear-gradient(90deg,#0d47a1,#1565c0);color:white;padding:16px 20px;display:flex;justify-content:space-between;align-items:center;\">\n      <b style=\"font-size:15px;\">🔑 Password Change (OTP)</b>\n      <button onclick=\"document.getElementById('changePwModal').remove()\" style=\"background:rgba(255,255,255,0.2);border:none;color:white;width:28px;height:28px;border-radius:50%;cursor:pointer;font-size:15px;font-weight:bold;\">✕</button>\n    </div>\n\n    <!-- Step 1: Enter User ID -->\n    <div id=\"otpStep1\" style=\"padding:24px;\">\n      <p style=\"font-size:12px;color:#666;margin:0 0 16px 0;\">अपना User ID डालें और OTP Generate करें।</p>\n      <label style=\"font-size:11px;font-weight:bold;color:#333;\">USER ID</label>\n      <input id=\"otpUserId\" type=\"text\" placeholder=\"e.g. DEOBHOPAL\"\n        style=\"width:100%;padding:10px;margin:6px 0 14px;border:1px solid #ccc;border-radius:4px;box-sizing:border-box;text-transform:uppercase;font-size:13px;\">\n      <button onclick=\"generateAndShowOTP()\"\n        style=\"width:100%;padding:11px;background:#0d47a1;color:white;border:none;border-radius:4px;font-weight:bold;cursor:pointer;font-size:13px;\">\n        📲 Generate OTP\n      </button>\n      <div id=\"otpGenMsg\" style=\"margin-top:10px;font-size:12px;text-align:center;\"></div>\n    </div>\n\n    <!-- Step 2: Enter OTP -->\n    <div id=\"otpStep2\" style=\"padding:24px;display:none;\">\n      <div style=\"background:#e3f2fd;border-radius:6px;padding:10px 14px;margin-bottom:14px;font-size:12px;color:#1565c0;\">\n        📲 OTP generate ho gaya। DPI Admin se OTP lekar neeche darj karein।<br>\n        <span style=\"font-size:10px;color:#888;\">(OTP 10 minutes mein expire ho jayega)</span>\n      </div>\n      <div id=\"dpiOtpReveal\" style=\"display:none;background:#fff3e0;border:1px solid #ff9800;border-radius:6px;padding:10px;margin-bottom:14px;text-align:center;\">\n        <div style=\"font-size:11px;color:#e65100;font-weight:bold;margin-bottom:4px;\">🔐 DPI Admin OTP View</div>\n        <div id=\"otpDisplayValue\" style=\"font-size:28px;font-weight:bold;letter-spacing:8px;color:#0d47a1;\"></div>\n        <div style=\"font-size:10px;color:#888;margin-top:4px;\" id=\"otpExpireTime\"></div>\n      </div>\n      <label style=\"font-size:11px;font-weight:bold;color:#333;\">OTP ENTER करें</label>\n      <input id=\"otpInputVal\" type=\"text\" maxlength=\"6\" placeholder=\"6-digit OTP\"\n        style=\"width:100%;padding:10px;margin:6px 0 14px;border:1px solid #ccc;border-radius:4px;box-sizing:border-box;font-size:18px;text-align:center;letter-spacing:6px;font-weight:bold;\">\n      <button onclick=\"verifyOTP()\" style=\"width:100%;padding:11px;background:#2e7d32;color:white;border:none;border-radius:4px;font-weight:bold;cursor:pointer;font-size:13px;\">✅ OTP Verify करें</button>\n      <button onclick=\"_showPwStep(1)\" style=\"width:100%;padding:8px;background:white;color:#555;border:1px solid #ccc;border-radius:4px;cursor:pointer;font-size:12px;margin-top:8px;\">← वापस जाएं</button>\n      <div id=\"otpVerifyMsg\" style=\"margin-top:10px;font-size:12px;text-align:center;\"></div>\n    </div>\n\n    <!-- Step 3: Set New Password -->\n    <div id=\"otpStep3\" style=\"padding:24px;display:none;\">\n      <div style=\"background:#e8f5e9;border-radius:6px;padding:10px 14px;margin-bottom:14px;font-size:12px;color:#2e7d32;font-weight:bold;\">\n        ✅ OTP Verified! अब नया Password सेट करें।\n      </div>\n      <label style=\"font-size:11px;font-weight:bold;color:#333;\">नया PASSWORD</label>\n      <input id=\"newPassVal\" type=\"password\" placeholder=\"नया password डालें\"\n        style=\"width:100%;padding:10px;margin:6px 0 14px;border:1px solid #ccc;border-radius:4px;box-sizing:border-box;font-size:13px;\">\n      <label style=\"font-size:11px;font-weight:bold;color:#333;\">PASSWORD CONFIRM करें</label>\n      <input id=\"confirmPassVal\" type=\"password\" placeholder=\"फिर से डालें\"\n        style=\"width:100%;padding:10px;margin:6px 0 16px;border:1px solid #ccc;border-radius:4px;box-sizing:border-box;font-size:13px;\">\n      <!-- Password strength bar -->\n      <div style=\"margin-bottom:12px;\">\n        <div style=\"background:#eee;border-radius:4px;height:6px;overflow:hidden;\">\n          <div id=\"pwStrengthBar\" style=\"height:100%;width:0%;border-radius:4px;transition:width 0.3s,background 0.3s;\"></div>\n        </div>\n        <div id=\"pwStrengthLabel\" style=\"font-size:10px;color:#888;margin-top:3px;\"></div>\n      </div>\n      <button onclick=\"saveNewPassword()\" style=\"width:100%;padding:11px;background:#0d47a1;color:white;border:none;border-radius:4px;font-weight:bold;cursor:pointer;font-size:13px;\">💾 Password Save करें</button>\n      <div id=\"pwSaveMsg\" style=\"margin-top:10px;font-size:12px;text-align:center;\"></div>\n    </div>\n  </div>";
  document.body.appendChild(_0x63316b);
  _0x63316b.addEventListener("click", _0x51f422 => {
    if (_0x51f422.target === _0x63316b) {
      _0x63316b.remove();
    }
  });
  setTimeout(() => {
    const _0x199562 = document.getElementById("newPassVal");
    if (_0x199562) {
      _0x199562.addEventListener("input", updatePwStrength);
    }
  }, 100);
}
function generateAndShowOTP() {
  const _0x26dcb9 = (document.getElementById("otpUserId").value || "").trim().toUpperCase();
  const _0x12ed8b = document.getElementById("otpGenMsg");
  if (!_0x26dcb9) {
    _0x12ed8b.innerHTML = "<span style=\"color:red;\">❌ User ID डालें।</span>";
    return;
  }
  if (!districtCredentials[_0x26dcb9]) {
    _0x12ed8b.innerHTML = "<span style=\"color:red;\">❌ यह User ID मौजूद नहीं है।</span>";
    return;
  }
  if (_0x26dcb9 === "DPI") {
    _0x12ed8b.innerHTML = "<span style=\"color:red;\">⛔ DPI का Password इस तरह reset नहीं किया जा सकता।</span>";
    return;
  }
  if (currentUser && currentUser !== "DPI" && currentUser !== _0x26dcb9) {
    _0x12ed8b.innerHTML = "<span style=\"color:red;\">⛔ आप केवल अपना Password reset कर सकते हैं।</span>";
    return;
  }
  const _0x530451 = _generateOTP();
  const _0x1bee2b = Date.now() + 600000;
  window._otpStore[_0x26dcb9] = {
    otp: _0x530451,
    expiry: _0x1bee2b
  };
  auditLog("OTP_GENERATED", "OTP generated for: " + _0x26dcb9);
  _showPwStep(2);
  const _0x408255 = document.getElementById("dpiOtpReveal");
  const _0x8ae00e = currentUser === "DPI";
  const _0x32a0ab = currentUser && currentUser === _0x26dcb9;
  if (_0x8ae00e || _0x32a0ab) {
    _0x408255.style.display = "block";
    document.getElementById("otpDisplayValue").innerText = _0x530451;
    document.getElementById("otpExpireTime").innerText = "⏱️ Expires: " + new Date(_0x1bee2b).toLocaleTimeString("en-IN");
    _0x408255.querySelector("div").innerText = _0x8ae00e ? "🔐 DPI Admin OTP View" : "🔐 आपका OTP";
  } else {
    _0x408255.style.display = "none";
  }
  document.getElementById("otpUserId")._resolvedUser = _0x26dcb9;
}
function verifyOTP() {
  const _0x144f73 = (document.getElementById("otpInputVal").value || "").trim();
  const _0xf788e = document.getElementById("otpUserId")._resolvedUser || (document.getElementById("otpUserId").value || "").trim().toUpperCase();
  const _0x3f6f22 = document.getElementById("otpVerifyMsg");
  const _0x412392 = window._otpStore[_0xf788e];
  if (!_0x412392) {
    _0x3f6f22.innerHTML = "<span style=\"color:red;\">❌ OTP not generated. Please generate an OTP first.</span>";
    return;
  }
  if (Date.now() > _0x412392.expiry) {
    _0x3f6f22.innerHTML = "<span style=\"color:red;\">⏱️ OTP has expired. Please generate a new one.</span>";
    delete window._otpStore[_0xf788e];
    return;
  }
  if (_0x144f73 !== _0x412392.otp) {
    _0x3f6f22.innerHTML = "<span style=\"color:red;\">❌ Incorrect OTP. Please try again.</span>";
    return;
  }
  delete window._otpStore[_0xf788e];
  auditLog("OTP_VERIFIED", "OTP verified for: " + _0xf788e);
  _showPwStep(3);
  document.getElementById("newPassVal").dataset.userId = _0xf788e;
}
function updatePwStrength() {
  const _0x317a4f = document.getElementById("newPassVal").value;
  const _0xeadbad = document.getElementById("pwStrengthBar");
  const _0x2ccac0 = document.getElementById("pwStrengthLabel");
  let _0x132231 = 0;
  if (_0x317a4f.length >= 6) {
    _0x132231++;
  }
  if (_0x317a4f.length >= 8) {
    _0x132231++;
  }
  if (/[A-Z]/.test(_0x317a4f)) {
    _0x132231++;
  }
  if (/[0-9]/.test(_0x317a4f)) {
    _0x132231++;
  }
  if (/[^A-Za-z0-9]/.test(_0x317a4f)) {
    _0x132231++;
  }
  const _0x4a033e = [{
    w: "0%",
    bg: "#eee",
    t: ""
  }, {
    w: "20%",
    bg: "#e53935",
    t: "बहुत कमज़ोर"
  }, {
    w: "40%",
    bg: "#f57c00",
    t: "कमज़ोर"
  }, {
    w: "60%",
    bg: "#fbc02d",
    t: "ठीक है"
  }, {
    w: "80%",
    bg: "#7cb342",
    t: "अच्छा"
  }, {
    w: "100%",
    bg: "#2e7d32",
    t: "बहुत मज़बूत ✅"
  }];
  const _0x188338 = _0x4a033e[_0x132231] || _0x4a033e[0];
  _0xeadbad.style.width = _0x188338.w;
  _0xeadbad.style.background = _0x188338.bg;
  _0x2ccac0.innerText = _0x188338.t;
  _0x2ccac0.style.color = _0x188338.bg;
}
function saveNewPassword() {
  const _0x4b7d5e = document.getElementById("newPassVal").value;
  const _0xf9b3e4 = document.getElementById("confirmPassVal").value;
  const _0x2fcc6d = document.getElementById("newPassVal").dataset.userId;
  const _0x1cf846 = document.getElementById("pwSaveMsg");
  if (!_0x4b7d5e || _0x4b7d5e.length < 4) {
    _0x1cf846.innerHTML = "<span style=\"color:red;\">❌ Password must be at least 4 characters long.</span>";
    return;
  }
  if (_0x4b7d5e !== _0xf9b3e4) {
    _0x1cf846.innerHTML = "<span style=\"color:red;\">❌ Passwords do not match. Please try again.</span>";
    return;
  }
  const _0x1a3834 = window._customPasswords || {};
  const _0x2caa86 = _0x1a3834[_0x2fcc6d] || districtCredentials[_0x2fcc6d] || "(default)";
  _0x1a3834[_0x2fcc6d] = _0x4b7d5e;
  window._customPasswords = _0x1a3834;
  auditLog("PASSWORD_CHANGED", "Password changed for: " + _0x2fcc6d);
  savePasswordToSupabase(_0x2fcc6d, _0x4b7d5e, currentUser || "SELF");
  if (!window._pwResetLog) {
    window._pwResetLog = [];
  }
  const _0x11b945 = {
    userId: _0x2fcc6d,
    dateTime: new Date().toLocaleString("en-IN", {
      hour12: true
    }),
    timestamp: Date.now(),
    resetBy: currentUser || "SELF",
    oldPass: _0x2caa86,
    newPass: _0x4b7d5e
  };
  window._pwResetLog.unshift(_0x11b945);
  savePwResetLogCloud(_0x11b945);
  _0x1cf846.innerHTML = "<span style=\"color:#2e7d32;font-weight:bold;\">✅ Password changed successfully!</span>";
  setTimeout(() => {
    document.getElementById("changePwModal")?.remove();
    const _0x36e952 = document.getElementById("userField");
    if (_0x36e952) {
      _0x36e952.value = _0x2fcc6d;
    }
  }, 1800);
}
function openPwResetLog() {
  if (currentUser !== "DPI") {
    myAlert("⛔ Access denied.");
    return;
  }
  const _0x3ac71a = document.getElementById("dpiControlPanel");
  if (_0x3ac71a) {
    _0x3ac71a.style.display = "flex";
    switchDpiTab(2);
  }
}
function switchDpiTab(_0x522ce8) {
  [1, 2, 3].forEach(_0x4bd6ad => {
    const _0x3a3335 = document.getElementById("dpiTab" + _0x4bd6ad);
    const _0x55bb81 = document.getElementById("dpiPane" + _0x4bd6ad);
    if (_0x3a3335) {
      _0x3a3335.classList.toggle("active", _0x4bd6ad === _0x522ce8);
    }
    if (_0x55bb81) {
      _0x55bb81.classList.toggle("active", _0x4bd6ad === _0x522ce8);
    }
  });
  if (_0x522ce8 === 2) {
    renderPwTable();
  }
  if (_0x522ce8 === 3) {
    loadMaintPanelState();
  }
}
function renderPwTable(_0x21eed5) {
  const _0x2c5c0c = document.getElementById("pwTableContainer");
  if (!_0x2c5c0c) {
    return;
  }
  _0x21eed5 = (_0x21eed5 || "").trim().toUpperCase();
  const _0x8a1c59 = window._customPasswords || {};
  const _0x3f70c9 = Object.keys(_0x8a1c59).filter(_0xe5330 => !districtCredentials[_0xe5330]);
  const _0x31de55 = [{
    label: "DPI",
    keys: ["DPI"]
  }, {
    label: "JD (Joint Directors)",
    keys: Object.keys(districtCredentials).filter(_0x44d011 => _0x44d011.startsWith("JD"))
  }, {
    label: "DEO (District Education Officers)",
    keys: Object.keys(districtCredentials).filter(_0x5ae50c => _0x5ae50c.startsWith("DEO"))
  }];
  if (_0x3f70c9.length > 0) {
    _0x31de55.push({
      label: "🆕 DPI द्वारा बनाए गए Custom Users",
      keys: _0x3f70c9
    });
  }
  let _0x3d99be = "";
  _0x31de55.forEach(function (_0x1e0e82) {
    const _0x6b56e9 = _0x1e0e82.keys.filter(_0x131edf => !_0x21eed5 || _0x131edf.includes(_0x21eed5));
    if (!_0x6b56e9.length) {
      return;
    }
    _0x3d99be += "<div class=\"pw-section-head\">" + _0x1e0e82.label + " <span style=\"font-weight:400;color:#aaa;\">(" + _0x6b56e9.length + ")</span></div>";
    _0x6b56e9.forEach(function (_0x26e56e) {
      const _0x39ff27 = _0x8a1c59[_0x26e56e] || districtCredentials[_0x26e56e] || "—";
      const _0x1804aa = !!_0x8a1c59[_0x26e56e];
      const _0xd46073 = !districtCredentials[_0x26e56e];
      _0x3d99be += "<div class=\"pw-row\" data-uid=\"" + _0x26e56e + "\">\n        <span class=\"pw-uid\">" + _0x26e56e + (_0xd46073 ? " <span style=\"font-size:9px;background:#d1fae5;color:#065f46;padding:1px 4px;border-radius:2px;font-weight:600;\">NEW</span>" : _0x1804aa ? " <span style=\"font-size:9px;background:#e3f2fd;color:#1565c0;padding:1px 4px;border-radius:2px;font-weight:600;\">CHANGED</span>" : "") + "</span>\n        <span class=\"pw-val\" title=\"Current Password\">" + escHtml(_0x39ff27) + "</span>\n        <button class=\"pw-change-btn\" onclick=\"openAdminPwChange('" + _0x26e56e + "')\">✏️ Change</button>\n        " + (_0xd46073 ? "<button class=\"pw-change-btn\" onclick=\"deleteCustomUser('" + _0x26e56e + "')\" style=\"background:#c0392b;margin-left:4px;\">🗑️ Delete</button>" : "") + "\n      </div>";
    });
  });
  _0x2c5c0c.innerHTML = _0x3d99be || "<p style=\"color:#aaa;text-align:center;font-size:12px;padding:16px;\">कोई user नहीं मिला।</p>";
}
function filterPwTable(_0x219284) {
  renderPwTable(_0x219284);
}
function openAdminPwChange(_0x206125) {
  if (currentUser !== "DPI") {
    myAlert("⛔ Only DPI can perform this action.");
    return;
  }
  const _0x1d6d1b = document.getElementById("adminPwChangeModal");
  const _0x204bfb = document.getElementById("adminPwChangeTarget");
  const _0xf124d4 = document.getElementById("adminPwMsg");
  const _0x23d743 = document.getElementById("adminNewPass");
  const _0x290993 = document.getElementById("adminConfirmPass");
  if (!_0x1d6d1b) {
    return;
  }
  const _0x5d3e6a = window._customPasswords || {};
  const _0x234693 = _0x5d3e6a[_0x206125] || districtCredentials[_0x206125] || "—";
  _0x204bfb.innerHTML = "User: <span style=\"color:#1565c0;\">" + escHtml(_0x206125) + "</span> &nbsp;|&nbsp; Current: <span style=\"font-family:monospace;color:#2e7d32;\">" + escHtml(_0x234693) + "</span>";
  _0x23d743.value = "";
  _0x290993.value = "";
  _0xf124d4.textContent = "";
  _0x23d743.dataset.userId = _0x206125;
  _0x1d6d1b.style.display = "flex";
  setTimeout(() => _0x23d743.focus(), 80);
}
function saveAdminPwChange() {
  const _0xfc5d70 = document.getElementById("adminNewPass");
  const _0x1bbcdf = document.getElementById("adminConfirmPass");
  const _0xc5d8bd = document.getElementById("adminPwMsg");
  const _0x3efca5 = _0xfc5d70.dataset.userId;
  const _0x11ba06 = _0xfc5d70.value.trim();
  const _0xb8f2de = _0x1bbcdf.value.trim();
  if (!_0x11ba06 || _0x11ba06.length < 4) {
    _0xc5d8bd.innerHTML = "<span style=\"color:red;\">❌ कम से कम 4 characters का password डालें।</span>";
    return;
  }
  if (_0x11ba06 !== _0xb8f2de) {
    _0xc5d8bd.innerHTML = "<span style=\"color:red;\">❌ दोनों passwords match नहीं करते।</span>";
    return;
  }
  const _0x119969 = window._customPasswords || {};
  const _0x368367 = _0x119969[_0x3efca5] || districtCredentials[_0x3efca5] || "(default)";
  _0x119969[_0x3efca5] = _0x11ba06;
  window._customPasswords = _0x119969;
  auditLog("ADMIN_PW_CHANGE", "DPI ne password change kiya for: " + _0x3efca5);
  savePasswordToSupabase(_0x3efca5, _0x11ba06, "DPI");
  if (!window._pwResetLog) {
    window._pwResetLog = [];
  }
  window._pwResetLog.unshift({
    userId: _0x3efca5,
    dateTime: new Date().toLocaleString("en-IN", {
      hour12: true
    }),
    timestamp: Date.now(),
    resetBy: "DPI",
    oldPass: _0x368367,
    newPass: _0x11ba06
  });
  savePwResetLogCloud({
    userId: _0x3efca5,
    resetBy: "DPI",
    oldPass: _0x368367,
    newPass: _0x11ba06
  });
  _0xc5d8bd.innerHTML = "<span style=\"color:#2e7d32;font-weight:bold;\">✅ Password successfully changed!</span>";
  setTimeout(() => {
    document.getElementById("adminPwChangeModal").style.display = "none";
    renderPwTable(document.getElementById("pwSearchBox").value);
  }, 1400);
}
function deleteCustomUser(_0x2bae40) {
  if (currentUser !== "DPI") {
    myAlert("⛔ Only DPI can perform this action.");
    return;
  }
  if (!confirm("⚠️ क्या आप \"" + _0x2bae40 + "\" user को permanently delete करना चाहते हैं?\n\nयह action undo नहीं होगा।")) {
    return;
  }
  const _0x15efc8 = window._customPasswords || {};
  if (!_0x15efc8[_0x2bae40]) {
    myAlert("❌ यह user delete नहीं किया जा सकता।");
    return;
  }
  delete _0x15efc8[_0x2bae40];
  window._customPasswords = _0x15efc8;
  const _0x27d132 = getSupabase();
  if (_0x27d132) {
    _0x27d132.from("ums_users").delete().eq("user_id", _0x2bae40).then(() => {});
  }
  auditLog("DELETE_USER", "DPI ne custom user delete kiya: " + _0x2bae40);
  myAlert("✅ User \"" + _0x2bae40 + "\" successfully delete कर दिया गया!");
  renderPwTable(document.getElementById("pwSearchBox").value);
}
document.addEventListener("DOMContentLoaded", function () {
  try {
    const _0xea2d5f = JSON.parse(_ls.get("ums_maintenance") || "null");
    if (_0xea2d5f) {
      window._maintCfg = _0xea2d5f;
    }
  } catch (_0x4f1186) {}
  _fetchMaintFromSupabase().then(function (_0xd64a8c) {
    if (_0xd64a8c) {
      checkMaintenanceStatus();
    }
  });
  loadPasswordsFromSupabase();
  const _0x3235b5 = document.getElementById("logoutBtn");
  if (_0x3235b5 && _0x3235b5.parentNode) {
    const _0x46b9f2 = document.createElement("button");
    _0x46b9f2.onclick = openChangePassword;
    _0x46b9f2.title = "Change Password via OTP";
    _0x46b9f2.style.cssText = "padding:7px 14px;background:#006064;color:white;border:none;border-radius:4px;cursor:pointer;font-size:12px;font-weight:bold;";
    _0x46b9f2.innerHTML = "🔑 Change Password";
    _0x3235b5.parentNode.insertBefore(_0x46b9f2, _0x3235b5);
  }
});
document.addEventListener("keydown", function (_0x3d00ad) {
  const _0xdeb2e1 = (document.activeElement?.tagName || "").toLowerCase();
  const _0x150916 = ["input", "textarea", "select"].includes(_0xdeb2e1);
  if (_0x3d00ad.ctrlKey && _0x3d00ad.key.toLowerCase() === "n") {
    _0x3d00ad.preventDefault();
    const _0x51438a = document.getElementById("formOverlay");
    if (_0x51438a) {
      _0x51438a.style.display = "block";
    }
    showShortcutToast("Ctrl+N → Form Opened");
    return;
  }
  if (_0x3d00ad.ctrlKey && _0x3d00ad.key.toLowerCase() === "s") {
    _0x3d00ad.preventDefault();
    if (document.getElementById("formOverlay")?.style.display === "block") {
      saveEntry(true);
      showShortcutToast("Ctrl+S → Saved");
    }
    return;
  }
  if (_0x3d00ad.ctrlKey && _0x3d00ad.key.toLowerCase() === "f") {
    _0x3d00ad.preventDefault();
    const _0x46aedc = document.getElementById("searchVal");
    if (_0x46aedc) {
      _0x46aedc.focus();
      _0x46aedc.select();
    }
    showShortcutToast("Ctrl+F → Search");
    return;
  }
  if (_0x3d00ad.ctrlKey && _0x3d00ad.key.toLowerCase() === "r") {
    _0x3d00ad.preventDefault();
    toggleRecentPanel();
    showShortcutToast("Ctrl+R → Recent Records");
    return;
  }
  if (_0x3d00ad.key === "Escape" && !_0x150916) {
    const _0xd1817c = document.getElementById("formOverlay");
    if (_0xd1817c?.style.display === "block") {
      _0xd1817c.style.display = "none";
      showShortcutToast("Esc → Form Closed");
      return;
    }
    const _0xc9c04e = document.getElementById("summaryModal");
    if (_0xc9c04e) {
      _0xc9c04e.remove();
      return;
    }
    const _0x386a4b = document.getElementById("liveDashModal");
    if (_0x386a4b) {
      _0x386a4b.remove();
      return;
    }
    const _0x4e66c8 = document.getElementById("trackerModal");
    if (_0x4e66c8) {
      _0x4e66c8.remove();
      return;
    }
    const _0x9a6dea = document.getElementById("advFilterModal");
    if (_0x9a6dea) {
      _0x9a6dea.remove();
      return;
    }
    return;
  }
  if (_0x3d00ad.key === "?" && !_0x150916) {
    showShortcutsHelp();
  }
});
function showShortcutToast(_0x2f90a9) {
  let _0x14dca6 = document.getElementById("shortcutToast");
  if (!_0x14dca6) {
    _0x14dca6 = document.createElement("div");
    _0x14dca6.id = "shortcutToast";
    _0x14dca6.style.cssText = "position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#002e5b;color:white;padding:8px 18px;border-radius:20px;font-size:12px;font-weight:bold;z-index:99999;transition:opacity 0.4s;pointer-events:none;";
    document.body.appendChild(_0x14dca6);
  }
  _0x14dca6.innerText = _0x2f90a9;
  _0x14dca6.style.opacity = "1";
  clearTimeout(_0x14dca6._timer);
  _0x14dca6._timer = setTimeout(() => {
    _0x14dca6.style.opacity = "0";
  }, 1800);
}
function showShortcutsHelp() {
  if (document.getElementById("shortcutsHelp")) {
    document.getElementById("shortcutsHelp").remove();
    return;
  }
  const _0xab94b = document.createElement("div");
  _0xab94b.id = "shortcutsHelp";
  _0xab94b.style.cssText = "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:white;border-radius:10px;padding:20px 25px;z-index:99999;box-shadow:0 10px 30px rgba(0,0,0,0.4);min-width:300px;font-family:sans-serif;";
  _0xab94b.innerHTML = "<div style=\"display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;border-bottom:2px solid #002e5b;padding-bottom:8px;\"><b style=\"color:#002e5b;font-size:15px;\">⌨️ Keyboard Shortcuts</b><button onclick=\"document.getElementById('shortcutsHelp').remove()\" style=\"background:#c62828;color:white;border:none;border-radius:50%;width:26px;height:26px;cursor:pointer;font-weight:bold;\">✕</button></div>" + [["Ctrl + N", "Form खोलें (New Entry)"], ["Ctrl + S", "Save / Add Record"], ["Ctrl + F", "Search Box Focus"], ["Ctrl + R", "Recent Records Panel"], ["Escape", "Form / Modal बंद करें"], ["?", "यह Help दिखाएं"]].map(([_0x5ee1fe, _0x3ff296]) => "<div style=\"display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #f0f0f0;font-size:13px;\"><kbd style=\"background:#f0f0f0;border:1px solid #ccc;padding:2px 8px;border-radius:4px;font-family:monospace;font-weight:bold;\">" + _0x5ee1fe + "</kbd><span style=\"color:#555;\">" + _0x3ff296 + "</span></div>").join("") + "<div style=\"margin-top:12px;font-size:10px;color:#aaa;text-align:center;\">Press '?' anywhere to toggle this panel</div>";
  document.body.appendChild(_0xab94b);
  _0xab94b.addEventListener("click", _0x12b6cc => _0x12b6cc.stopPropagation());
  setTimeout(() => document.addEventListener("click", function _0x1ebaab() {
    _0xab94b.remove();
    document.removeEventListener("click", _0x1ebaab);
  }), 100);
}
function viewHistorySmart() {
  var _0x3cba01 = document.querySelector("#tableBody tr.selected-row");
  if (_0x3cba01 && _0x3cba01.cells[2]) {
    var _0x41ab57 = _0x3cba01.cells[2].textContent.trim();
    if (_0x41ab57) {
      viewRecordHistory(_0x41ab57);
      return;
    }
  }
  viewHistory();
}
function viewHistory() {
  function _0x28da7f() {
    if (!historyStore.length) {
      return "<p style=\"text-align:center;color:#888;padding:30px;\">No audit entries yet.</p>";
    }
    return "<table style=\"width:100%;border-collapse:collapse;font-size:12px;\">\n      <thead><tr style=\"background:#002e5b;color:white;\">\n        <th style=\"padding:8px 12px;text-align:left;\">Time</th>\n        <th style=\"padding:8px 12px;\">User</th>\n        <th style=\"padding:8px 12px;\">Action</th>\n        <th style=\"padding:8px 12px;text-align:left;\">Detail</th>\n      </tr></thead>\n      <tbody>" + historyStore.slice().reverse().map(_0x15d126 => "\n        <tr style=\"border-bottom:1px solid #f0f0f0;\">\n          <td style=\"padding:7px 12px;color:#888;white-space:nowrap;\">" + _0x15d126.time + "</td>\n          <td style=\"padding:7px 12px;text-align:center;font-weight:700;\">" + _0x15d126.user + "</td>\n          <td style=\"padding:7px 12px;text-align:center;\">\n            <span class=\"badge " + (_0x15d126.action === "DELETE" ? "badge-deleted" : _0x15d126.action === "UPDATE" ? "badge-updated" : "badge-new") + "\">" + _0x15d126.action + "</span>\n          </td>\n          <td style=\"padding:7px 12px;\">" + _0x15d126.detail + "</td>\n        </tr>").join("") + "\n      </tbody></table>";
  }
  function _0x5d83af(_0x25ba6d) {
    if (!_0x25ba6d) {
      return "<p style=\"text-align:center;color:#aaa;padding:30px;\">Enter a Unique ID above and click Search.</p>";
    }
    const _0x1b5c2 = window.fullData.find(_0x27b1ea => (_0x27b1ea.field3 || "").trim().toUpperCase() === _0x25ba6d.toUpperCase());
    if (!_0x1b5c2) {
      return "<p style=\"text-align:center;color:#e53935;padding:20px;\">❌ Record not found: <b>" + _0x25ba6d + "</b></p>";
    }
    const _0xcdebd8 = _0x1b5c2.history_log;
    if (!_0xcdebd8 || !_0xcdebd8.length) {
      return "<p style=\"text-align:center;color:#888;padding:20px;\">No update history for <b>" + _0x25ba6d + "</b> yet.</p>";
    }
    let _0x1ded92 = "<div style=\"font-size:12px;font-weight:700;color:#002e5b;margin-bottom:10px;\">📄 " + escHtml(_0x1b5c2.field4 || _0x25ba6d) + " — " + _0xcdebd8.length + " update(s)</div>";
    function _0x28ce67(_0x55d4b8) {
      var _0xbd0a9 = (_0x55d4b8 || "").match(/^(\d{2})-(\d{2})-(\d{4})$/);
      if (_0xbd0a9) {
        return _0xbd0a9[3] + "-" + _0xbd0a9[2] + "-" + _0xbd0a9[1];
      }
      return (_0x55d4b8 || "").trim();
    }
    function _0x4793dc(_0x3e4264) {
      var _0xe2817d = (_0x3e4264 || "").toString().trim().toLowerCase();
      return !_0xe2817d || _0xe2817d === "-" || _0xe2817d === "--" || _0xe2817d === "---" || _0xe2817d === "----" || _0xe2817d === "nil" || _0xe2817d === "null";
    }
    _0xcdebd8.slice().reverse().forEach(function (_0x446cbf, _0x18d04d) {
      var _0x3732b9 = {};
      var _0x45411d = {};
      try {
        _0x3732b9 = JSON.parse(_0x446cbf.before || "{}");
      } catch (_0x550a45) {}
      try {
        _0x45411d = JSON.parse(_0x446cbf.after || "{}");
      } catch (_0x4997dc) {}
      var _0x28a7c5 = {};
      Object.keys(_0x3732b9).forEach(function (_0x3aec5f) {
        _0x28a7c5[_0x3aec5f] = 1;
      });
      Object.keys(_0x45411d).forEach(function (_0x590fea) {
        _0x28a7c5[_0x590fea] = 1;
      });
      var _0x46e7c0 = [];
      Object.keys(_0x28a7c5).forEach(function (_0xf8efe5) {
        var _0x4ac38a = (_0x3732b9[_0xf8efe5] || "").toString().trim();
        var _0x220882 = (_0x45411d[_0xf8efe5] || "").toString().trim();
        var _0x1a90ae = _0x28ce67(_0x4ac38a);
        var _0x550a88 = _0x28ce67(_0x220882);
        var _0x2c0b8e = _0x4793dc(_0x1a90ae) && _0x4793dc(_0x550a88);
        if (!_0x2c0b8e && _0x1a90ae.toLowerCase() !== _0x550a88.toLowerCase()) {
          _0x46e7c0.push({
            key: _0xf8efe5,
            from: _0x4ac38a,
            to: _0x220882
          });
        }
      });
      _0x1ded92 += "<div style=\"margin-bottom:16px;border:1px solid #cdd5df;border-radius:8px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.06);\">";
      _0x1ded92 += "<div style=\"background:#002e5b;color:white;padding:9px 14px;display:flex;justify-content:space-between;align-items:center;\">";
      _0x1ded92 += "<span style=\"font-weight:700;\">✏️ Update " + (_0xcdebd8.length - _0x18d04d) + "</span>";
      _0x1ded92 += "<span style=\"font-size:11px;opacity:.85;\">🕐 " + escHtml(_0x446cbf.time) + "&nbsp;&nbsp;👤 " + escHtml(_0x446cbf.user || "?") + "</span>";
      _0x1ded92 += "</div>";
      if (!_0x46e7c0.length) {
        _0x1ded92 += "<div style=\"padding:12px 16px;color:#888;font-style:italic;background:#fafafa;\">✅ No field changes detected.</div>";
      } else {
        _0x46e7c0.forEach(function (_0x233362, _0x2ffbc1) {
          var _0x3bfacd = _0x2ffbc1 % 2 === 0 ? "#fff" : "#fafcff";
          var _0x40901b = _0x233362.from || "(empty)";
          var _0x3987df = _0x233362.to || "(empty)";
          _0x1ded92 += "<div style=\"display:grid;grid-template-columns:160px 1fr 1fr;border-bottom:1px solid #eef0f4;background:" + _0x3bfacd + ";\">";
          _0x1ded92 += "<div style=\"padding:9px 12px;font-weight:700;font-size:11px;color:#002e5b;border-right:1px solid #eef0f4;display:flex;align-items:center;\">" + escHtml(fieldNames[_0x233362.key] || _0x233362.key) + "</div>";
          _0x1ded92 += "<div style=\"padding:9px 12px;border-right:1px solid #eef0f4;background:#fff8f8;\"><div style=\"font-size:9px;color:#c62828;font-weight:700;margin-bottom:2px;text-transform:uppercase;letter-spacing:.5px;\">Before</div><div style=\"color:#c62828;font-weight:600;font-size:12px;\">" + escHtml(_0x40901b) + "</div></div>";
          _0x1ded92 += "<div style=\"padding:9px 12px;background:#f6fff8;\"><div style=\"font-size:9px;color:#2e7d32;font-weight:700;margin-bottom:2px;text-transform:uppercase;letter-spacing:.5px;\">After</div><div style=\"color:#2e7d32;font-weight:700;font-size:12px;\">" + escHtml(_0x3987df) + "</div></div>";
          _0x1ded92 += "</div>";
        });
      }
      _0x1ded92 += "</div>";
    });
    return _0x1ded92;
  }
  const _0x296a82 = document.getElementById("historyBody");
  _0x296a82.innerHTML = "\n    <div style=\"display:flex;gap:0;border-bottom:2px solid #002e5b;margin-bottom:14px;\">\n      <button id=\"hTabAudit\" onclick=\"switchHistoryTab('audit')\"\n        style=\"padding:8px 20px;background:#002e5b;color:white;border:none;cursor:pointer;font-weight:700;font-size:12px;border-radius:4px 4px 0 0;\">\n        📋 Audit Log\n      </button>\n      <button id=\"hTabRecord\" onclick=\"switchHistoryTab('record')\"\n        style=\"padding:8px 20px;background:#e3ebf6;color:#002e5b;border:none;cursor:pointer;font-weight:700;font-size:12px;border-radius:4px 4px 0 0;margin-left:4px;\">\n        🔍 Record History\n      </button>\n    </div>\n    <div id=\"hPaneAudit\">" + _0x28da7f() + "</div>\n    <div id=\"hPaneRecord\" style=\"display:none;\">\n      <div style=\"display:flex;gap:8px;margin-bottom:12px;align-items:center;\">\n        <input id=\"hSearchUID\" type=\"text\" placeholder=\"Enter Unique ID...\"\n          style=\"border:1px solid #ccc;border-radius:4px;padding:6px 10px;font-size:12px;width:180px;text-transform:uppercase;\"\n          oninput=\"this.value=this.value.toUpperCase()\"\n          onkeydown=\"if(event.key==='Enter') document.getElementById('hSearchBtn').click()\">\n        <button id=\"hSearchBtn\" onclick=\"doRecordHistorySearch()\"\n          style=\"background:#002e5b;color:white;border:none;padding:6px 16px;border-radius:4px;cursor:pointer;font-weight:700;font-size:12px;\">Search</button>\n        <span style=\"font-size:11px;color:#888;\">or double-click any row in table then open history</span>\n      </div>\n      <div id=\"hRecordResult\"><p style=\"color:#aaa;text-align:center;padding:20px;\">Enter a Unique ID above and click Search.</p></div>\n    </div>";
  window._buildAuditTab = _0x28da7f;
  window._buildRecordTab = _0x5d83af;
  document.getElementById("historyOverlay").style.display = "flex";
}
function switchHistoryTab(_0x43a771) {
  document.getElementById("hTabAudit").style.background = _0x43a771 === "audit" ? "#002e5b" : "#e3ebf6";
  document.getElementById("hTabAudit").style.color = _0x43a771 === "audit" ? "white" : "#002e5b";
  document.getElementById("hTabRecord").style.background = _0x43a771 === "record" ? "#002e5b" : "#e3ebf6";
  document.getElementById("hTabRecord").style.color = _0x43a771 === "record" ? "white" : "#002e5b";
  document.getElementById("hPaneAudit").style.display = _0x43a771 === "audit" ? "block" : "none";
  document.getElementById("hPaneRecord").style.display = _0x43a771 === "record" ? "block" : "none";
}
function doRecordHistorySearch() {
  var _0x125738 = (document.getElementById("hSearchUID").value || "").trim().toUpperCase();
  document.getElementById("hRecordResult").innerHTML = window._buildRecordTab ? window._buildRecordTab(_0x125738) : "";
}
function viewRecordHistory(_0x3e8241) {
  viewHistory();
  setTimeout(function () {
    switchHistoryTab("record");
    document.getElementById("hSearchUID").value = _0x3e8241;
    doRecordHistorySearch();
  }, 80);
}
document.addEventListener("DOMContentLoaded", async function () {
  checkLockStatus();
  const _0x552410 = getSupabase();
  if (_0x552410) {
    try {
      const {
        error: _0x234405
      } = await _0x552410.from("ums_gradation").select("field1").limit(1);
      showSupabaseStatus(!_0x234405);
    } catch (_0x2764ba) {
      showSupabaseStatus(false);
    }
  } else {
    showSupabaseStatus(false);
  }
});
let presenceChannel = null;
function _realtimeUser() {
  return window.currentUser || "Unknown";
}
function _realtimeDistrict() {
  const _0x489975 = window.currentUser || "";
  if (!_0x489975) {
    return "UNKNOWN";
  }
  if (_0x489975 === "DPI") {
    return "DPI";
  }
  if (_0x489975.startsWith("JD")) {
    return "JD " + _0x489975.replace(/^JD/, "").trim();
  }
  if (_0x489975.startsWith("DEO")) {
    return _0x489975.replace(/^DEO/, "").trim() || _0x489975;
  }
  return _0x489975;
}
const _rowLocks = {};
function initRealtime() {
  const _0x34e66a = getSupabase();
  if (!_0x34e66a) {
    console.warn("Supabase not ready — realtime unavailable");
    return;
  }
  if (presenceChannel) {
    _0x34e66a.removeChannel(presenceChannel);
    presenceChannel = null;
  }
  const _0xaf65b1 = _realtimeUser();
  const _0x464a91 = _realtimeDistrict();
  presenceChannel = _0x34e66a.channel("ums-gradation-collab", {
    config: {
      presence: {
        key: _0xaf65b1
      }
    }
  });
  presenceChannel.on("presence", {
    event: "sync"
  }, () => {
    updateOnlineUsersUI(presenceChannel.presenceState());
  }).on("presence", {
    event: "join"
  }, ({
    key: _0x36b848,
    newPresences: _0x2198da
  }) => {
    const _0x2a1824 = _0x2198da?.[0];
    const _0x5d6d5f = _0x2a1824?.district && _0x2a1824.district !== "UNKNOWN" ? _0x2a1824.district : _labelFromKey(_0x36b848);
    showNotification(_0x5d6d5f + " is now online", "join");
  }).on("presence", {
    event: "leave"
  }, ({
    key: _0x26daac
  }) => {
    showNotification(_labelFromKey(_0x26daac) + " has gone offline", "leave");
  }).on("broadcast", {
    event: "row-locked"
  }, ({
    payload: _0x37ed18
  }) => {
    if (_0x37ed18.user !== _0xaf65b1) {
      handleExternalLock(_0x37ed18);
    }
  }).on("broadcast", {
    event: "row-unlocked"
  }, ({
    payload: _0x5d9c5e
  }) => {
    handleExternalUnlock(_0x5d9c5e);
  }).on("broadcast", {
    event: "data-update"
  }, ({
    payload: _0x5bfebb
  }) => {
    if (_0x5bfebb.user !== _0xaf65b1) {
      showNotification((_0x5bfebb.msg || "Data has been updated by another user.") + " (refreshing...)", _0x5bfebb.type || "update");
      const _0x19b1a4 = document.getElementById("formOverlay")?.style.display === "block";
      if (!_0x19b1a4) {
        const _uid = (_0x5bfebb.msg || "").match(/:\s*([A-Z]{2}\d+)/)?.[1];
        if (_uid && typeof _smartUpdateRecord === "function") {
          _smartUpdateRecord(_uid);
        } else {
          const _ov = document.getElementById("dataLoadingOverlay");
          window._silentReload = true;
          loadDataFromSupabase().then(_ok => {
            if (_ov) {
              _ov.style.display = "none";
            }
            if (_ok) {
              window.filteredData = [...window.fullData];
              renderVirtual();
              updateStorageBadge(true);
            }
          });
          if (_ov) {
            _ov.style.display = "none";
          }
        }
      } else {
        showNotification("⚠️ Doosre user ne data update kiya. Form band karke refresh kar lena.", "info");
      }
    }
  }).subscribe(async _0x168ffc => {
    if (_0x168ffc === "SUBSCRIBED") {
      await presenceChannel.track({
        user: _0xaf65b1,
        district: _0x464a91,
        onlineAt: new Date().toISOString()
      });
    }
  });
}
function _labelFromKey(_0x5ea3f1) {
  if (!_0x5ea3f1) {
    return "User";
  }
  if (_0x5ea3f1 === "DPI") {
    return "DPI";
  }
  if (_0x5ea3f1.startsWith("JD")) {
    return "JD " + _0x5ea3f1.replace(/^JD/, "").trim();
  }
  if (_0x5ea3f1.startsWith("DEO")) {
    return _0x5ea3f1.replace(/^DEO/, "").trim();
  }
  return _0x5ea3f1;
}
function updateOnlineUsersUI(_0x58f1db) {
  const _0x1b2de1 = document.getElementById("onlineStatus");
  if (!_0x1b2de1) {
    return;
  }
  const _0x33d68f = Object.entries(_0x58f1db);
  if (!_0x33d68f.length) {
    _0x1b2de1.innerHTML = "<span style=\"color:#999;font-style:italic;font-size:11px;\">No other users online</span>";
    return;
  }
  _0x1b2de1.innerHTML = _0x33d68f.map(([_0x51f762, _0x257253]) => {
    const _0x20b568 = Array.isArray(_0x257253) ? _0x257253[0] : _0x257253;
    let _0x1bc457 = "";
    if (_0x20b568?.district && _0x20b568.district !== "UNKNOWN" && _0x20b568.district !== "Unknown") {
      _0x1bc457 = _0x20b568.district;
    } else if (_0x20b568?.user && _0x20b568.user !== "Unknown") {
      _0x1bc457 = _labelFromKey(_0x20b568.user);
    } else {
      _0x1bc457 = _labelFromKey(_0x51f762);
    }
    const _0x1bc3c6 = _0x20b568?.onlineAt ? new Date(_0x20b568.onlineAt).toLocaleTimeString("en-IN") : "";
    return "<span title=\"" + _0x1bc457 + " | Online since: " + _0x1bc3c6 + "\"\n      style=\"padding:2px 8px;background:#e8f5e9;border-radius:12px;font-size:10px;border:1px solid #4caf50;white-space:nowrap;margin-right:4px;\">\n      🟢 " + _0x1bc457 + "\n    </span>";
  }).join("");
}
function lockRow(_0x51aeed) {
  if (!presenceChannel || !_0x51aeed) {
    return;
  }
  _rowLocks[_0x51aeed] = {
    user: _realtimeUser(),
    district: _realtimeDistrict(),
    self: true
  };
  presenceChannel.send({
    type: "broadcast",
    event: "row-locked",
    payload: {
      rowId: _0x51aeed,
      user: _realtimeUser(),
      district: _realtimeDistrict()
    }
  });
}
function unlockRow(_0x24cca5) {
  if (!presenceChannel || !_0x24cca5) {
    return;
  }
  delete _rowLocks[_0x24cca5];
  presenceChannel.send({
    type: "broadcast",
    event: "row-unlocked",
    payload: {
      rowId: _0x24cca5
    }
  });
}
function handleExternalLock(_0x31ff0c) {
  _rowLocks[_0x31ff0c.rowId] = {
    user: _0x31ff0c.user,
    district: _0x31ff0c.district,
    self: false
  };
  const _0x1c0f00 = document.querySelector("#tableBody tr[data-id=\"" + _0x31ff0c.rowId + "\"]");
  if (_0x1c0f00) {
    _0x1c0f00.classList.add("row-locked-external");
    _0x1c0f00.title = "🔒 " + _0x31ff0c.district + " edit kar raha hai";
    if (!_0x1c0f00.querySelector(".lock-icon")) {
      const _0x402da6 = document.createElement("span");
      _0x402da6.className = "lock-icon";
      _0x402da6.textContent = " 🔒";
      if (_0x1c0f00.cells[2]) {
        _0x1c0f00.cells[2].appendChild(_0x402da6);
      }
    }
  }
}
function handleExternalUnlock(_0xed9840) {
  delete _rowLocks[_0xed9840.rowId];
  const _0x2a6ad6 = document.querySelector("#tableBody tr[data-id=\"" + _0xed9840.rowId + "\"]");
  if (_0x2a6ad6) {
    _0x2a6ad6.classList.remove("row-locked-external");
    _0x2a6ad6.title = "";
    _0x2a6ad6.querySelector(".lock-icon")?.remove();
  }
}
const _toastColors = {
  update: "#4caf50",
  join: "#2196f3",
  leave: "#9e9e9e",
  delete: "#f44336",
  info: "#607d8b"
};
function showNotification(_0x59f12c, _0x1c4716 = "info") {
  const _0x5b369e = _toastColors[_0x1c4716] || _toastColors.info;
  const _0x237861 = document.createElement("div");
  _0x237861.style.cssText = "\n    position:fixed;bottom:20px;right:20px;z-index:100000;\n    background:#1e293b;color:white;\n    padding:11px 18px;border-radius:8px;\n    box-shadow:0 6px 20px rgba(0,0,0,.35);\n    border-left:5px solid " + _0x5b369e + ";\n    font-size:13px;font-family:'Inter',sans-serif;\n    max-width:320px;word-wrap:break-word;\n  ";
  _0x237861.innerHTML = "🔔 " + _0x59f12c;
  document.body.appendChild(_0x237861);
  setTimeout(() => {
    _0x237861.style.opacity = "0";
    _0x237861.style.transition = "opacity 0.4s";
    setTimeout(() => _0x237861.remove(), 400);
  }, 4500);
}
function broadcastDataUpdate(_0x2ab7b3, _0x32853d = "update") {
  if (!presenceChannel) {
    return;
  }
  presenceChannel.send({
    type: "broadcast",
    event: "data-update",
    payload: {
      msg: _0x2ab7b3,
      type: _0x32853d,
      user: _realtimeUser(),
      district: _realtimeDistrict()
    }
  });
}
window.addEventListener("load", () => {
  setTimeout(() => {
    if (typeof getSupabase === "function" && window.currentUser) {
      initRealtime();
    }
  }, 1500);
});
const _origLogout = typeof logoutUser === "function" ? logoutUser : null;
if (_origLogout) {
  logoutUser = function () {
    if (presenceChannel) {
      getSupabase()?.removeChannel(presenceChannel);
      presenceChannel = null;
    }
    _origLogout.apply(this, arguments);
  };
}
function toggleOtherToolbar(_0x126af4) {
  _0x126af4.stopPropagation();
  const _0x13d5f9 = document.getElementById("otherToolbarMenu");
  const _0x276812 = document.getElementById("otherToolbarWrap");
  if (_0x13d5f9.style.display === "block") {
    _0x13d5f9.style.display = "none";
    return;
  }
  if (_0x13d5f9.parentNode !== document.body) {
    document.body.appendChild(_0x13d5f9);
  }
  const _0x234407 = _0x276812.getBoundingClientRect();
  const _0xbb1d9 = window.innerHeight - _0x234407.bottom;
  const _0x11b613 = _0x234407.top;
  _0x13d5f9.style.position = "fixed";
  _0x13d5f9.style.left = _0x234407.left + "px";
  _0x13d5f9.style.zIndex = "99999999";
  _0x13d5f9.style.overflowY = "auto";
  _0x13d5f9.style.top = "unset";
  _0x13d5f9.style.bottom = "unset";
  if (_0xbb1d9 >= 200 || _0xbb1d9 >= _0x11b613) {
    _0x13d5f9.style.maxHeight = _0xbb1d9 - 12 + "px";
    _0x13d5f9.style.top = _0x234407.bottom + 4 + "px";
  } else {
    _0x13d5f9.style.maxHeight = _0x11b613 - 12 + "px";
    _0x13d5f9.style.bottom = window.innerHeight - _0x234407.top + 4 + "px";
  }
  _0x13d5f9.scrollTop = 0;
  _0x13d5f9.style.display = "block";
}
function closeOtherToolbar() {
  const _0x135201 = document.getElementById("otherToolbarMenu");
  if (_0x135201) {
    _0x135201.style.display = "none";
  }
}
document.addEventListener("click", function (_0x5dbdb6) {
  const _0x3be256 = document.getElementById("otherToolbarWrap");
  if (_0x3be256 && !_0x3be256.contains(_0x5dbdb6.target)) {
    closeOtherToolbar();
  }
});
function openImportExcelModal() {
  const _0x14f07b = document.getElementById("importExcelModal");
  _0x14f07b.style.display = "flex";
  document.getElementById("importExcelPassInput").value = "";
  document.getElementById("importExcelPassErr").textContent = "";
  setTimeout(() => document.getElementById("importExcelPassInput").focus(), 100);
}
function verifyImportExcelPass() {
  const _0x359abe = document.getElementById("importExcelPassInput").value;
  if (_0x359abe !== "1782") {
    document.getElementById("importExcelPassErr").textContent = "❌ Galat password! Dobara try karein.";
    document.getElementById("importExcelPassInput").value = "";
    document.getElementById("importExcelPassInput").focus();
    return;
  }
  document.getElementById("importExcelModal").style.display = "none";
  document.getElementById("excelFile").click();
}
function openPasteModal() {
  document.getElementById("pasteModal").style.display = "flex";
  document.getElementById("pasteStep1").style.display = "block";
  document.getElementById("pasteStep2").style.display = "none";
  document.getElementById("pastePassInput").value = "";
  document.getElementById("pastePassErr").textContent = "";
  document.getElementById("pasteArea").value = "";
  document.getElementById("pastePreviewInfo").textContent = "";
  document.getElementById("pasteResultMsg").textContent = "";
  document.getElementById("pasteProgressWrap").style.display = "none";
  setTimeout(() => document.getElementById("pastePassInput").focus(), 100);
}
function closePasteModal() {
  document.getElementById("pasteModal").style.display = "none";
}
function verifyPastePass() {
  const _0x58c0ae = document.getElementById("pastePassInput").value;
  if (_0x58c0ae !== "1782") {
    document.getElementById("pastePassErr").textContent = "❌ Incorrect password. Please try again.";
    document.getElementById("pastePassInput").value = "";
    return;
  }
  document.getElementById("pasteStep1").style.display = "none";
  document.getElementById("pasteStep2").style.display = "block";
  setTimeout(() => document.getElementById("pasteArea").focus(), 100);
}
function parseTSV(_0x175164) {
  const _0x45d1ea = [];
  let _0x4911ca = "";
  let _0x206e77 = [];
  let _0x1e9828 = false;
  for (let _0xf7512f = 0; _0xf7512f < _0x175164.length; _0xf7512f++) {
    const _0x380f2f = _0x175164[_0xf7512f];
    const _0x1574c0 = _0x175164[_0xf7512f + 1];
    if (_0x1e9828) {
      if (_0x380f2f === "\"" && _0x1574c0 === "\"") {
        _0x4911ca += "\"";
        _0xf7512f++;
      } else if (_0x380f2f === "\"") {
        _0x1e9828 = false;
      } else {
        _0x4911ca += _0x380f2f;
      }
    } else if (_0x380f2f === "\"") {
      _0x1e9828 = true;
    } else if (_0x380f2f === "\t") {
      _0x206e77.push(_0x4911ca);
      _0x4911ca = "";
    } else if (_0x380f2f === "\n") {
      _0x206e77.push(_0x4911ca);
      _0x4911ca = "";
      if (_0x206e77.length >= 3) {
        _0x45d1ea.push(_0x206e77);
      }
      _0x206e77 = [];
    } else if (_0x380f2f === "\r") {} else {
      _0x4911ca += _0x380f2f;
    }
  }
  _0x206e77.push(_0x4911ca);
  if (_0x206e77.length >= 3) {
    _0x45d1ea.push(_0x206e77);
  }
  return _0x45d1ea;
}
function _detectHeaderRows(_0x2d39ca) {
  if (!_0x2d39ca || !_0x2d39ca.length) {
    return false;
  }
  const _0x302c9c = (_0x2d39ca[0][0] || "").trim();
  return isNaN(_0x302c9c) || _0x302c9c === "";
}
function previewPasteData() {
  const _0x12fdc8 = document.getElementById("pasteArea").value;
  const _0x56596e = document.getElementById("pastePreviewInfo");
  if (!_0x12fdc8.trim()) {
    _0x56596e.textContent = "";
    return;
  }
  const _0x6467cf = parseTSV(_0x12fdc8);
  const _0x193c56 = _detectHeaderRows(_0x6467cf);
  const _0x1c60e4 = _0x193c56 ? _0x6467cf.slice(1) : _0x6467cf;
  _0x56596e.innerHTML = "<span style=\"color:#00695c;\">✅ " + _0x1c60e4.length + " rows detected</span>" + (_0x193c56 ? " <span style=\"color:#888;\">(First row detected as header — will be skipped)</span>" : "");
}
async function processPasteData() {
  const _0x17454e = document.getElementById("pasteArea").value;
  const _0x3d1a5f = document.getElementById("pasteResultMsg");
  const _0xb3f236 = document.getElementById("pasteProgressWrap");
  const _0x130181 = document.getElementById("pasteProgressBar");
  const _0x302260 = document.getElementById("pasteProgressText");
  if (!_0x17454e.trim()) {
    _0x3d1a5f.innerHTML = "<span style=\"color:red;\">❌ No data pasted. Please copy data from Excel first.</span>";
    return;
  }
  _0xb3f236.style.display = "block";
  _0x130181.style.width = "5%";
  _0x130181.textContent = "5%";
  _0x302260.textContent = "Parsing Excel data...";
  _0x3d1a5f.textContent = "";
  await new Promise(_0x16dc0e => setTimeout(_0x16dc0e, 50));
  const _0xc08aa3 = parseTSV(_0x17454e);
  const _0x3f025f = _detectHeaderRows(_0xc08aa3);
  const _0x2c110d = _0x3f025f ? _0xc08aa3.slice(1) : _0xc08aa3;
  if (!_0x2c110d.length) {
    _0x3d1a5f.innerHTML = "<span style=\"color:red;\">❌ No valid data found. Please copy tab-separated data from Excel.</span>";
    return;
  }
  _0x130181.style.width = "10%";
  _0x130181.textContent = "10%";
  await new Promise(_0x3bf05e => setTimeout(_0x3bf05e, 30));
  const _0x38b386 = [];
  for (let _0x410969 = 0; _0x410969 < _0x2c110d.length; _0x410969++) {
    const _0x511568 = _0x2c110d[_0x410969];
    const _0x219db6 = {};
    for (let _0x120356 = 0; _0x120356 < 32; _0x120356++) {
      _0x219db6["field" + (_0x120356 + 1)] = (_0x511568[_0x120356] || "").trim();
    }
    _0x219db6.field1 = String(_0x410969 + 1);
    var _0x248b59 = (_0x219db6.field25 || "").toString().trim().toUpperCase();
    _0x219db6.field25 = _0x248b59 === "YES" ? "YES" : "NO";
    _0x38b386.push(_0x219db6);
    if (_0x410969 % 200 === 0 || _0x410969 === _0x2c110d.length - 1) {
      const _0x256187 = Math.round(10 + _0x410969 / _0x2c110d.length * 50);
      _0x130181.style.width = _0x256187 + "%";
      _0x130181.textContent = _0x256187 + "%";
      _0x302260.textContent = "Parsing rows... " + (_0x410969 + 1) + " of " + _0x2c110d.length;
      await new Promise(_0x1a21c5 => setTimeout(_0x1a21c5, 0));
    }
  }
  _0x130181.style.width = "65%";
  _0x130181.textContent = "65%";
  _0x302260.textContent = "Loading records into table...";
  await new Promise(_0x54ea2d => setTimeout(_0x54ea2d, 50));
  try {
    Object.keys(localStorage).filter(_0xb2c6e3 => _0xb2c6e3.startsWith("ums_docmeta_") || _0xb2c6e3.startsWith("ums_docdata_") || _0xb2c6e3.startsWith("ums_tdmeta_") || _0xb2c6e3.startsWith("ums_tddata_") || _0xb2c6e3.startsWith("ums_doc_")).forEach(_0x5d7bca => localStorage.removeItem(_0x5d7bca));
  } catch (_0x278edf) {}
  window.fullData = _0x38b386;
  window.filteredData = [..._0x38b386];
  renderVirtual();
  _0x130181.style.width = "70%";
  _0x130181.textContent = "70%";
  const _0x51795b = getSupabase();
  if (!_0x51795b) {
    _0x130181.style.width = "100%";
    _0x130181.textContent = "100%";
    _0x130181.style.background = "#e65100";
    _0x302260.textContent = "";
    const _0x3a27e9 = navigator.userAgent.includes("Edg/");
    const _0x5175ee = _0x3a27e9 ? "<br><b>⚠️ Edge browser use kar rahe ho:</b> Settings → Privacy → Tracking Prevention → OFF karo, ya Chrome/Firefox use karo." : "";
    _0x3d1a5f.innerHTML = "<span style=\"color:#c62828;font-size:13px;font-weight:bold;\">⚠️ Supabase connected nahi hai — data sirf locally load hua, reload pe GAYAB ho jaayega!" + _0x5175ee + "</span>";
    auditLog("PASTE_IMPORT_LOCAL_ONLY", _0x38b386.length + " records local only (Supabase unavailable) by " + (currentUser || window.currentUser));
    return;
  }
  _0x302260.textContent = "Preparing batch for upload...";
  _0x130181.style.width = "72%";
  _0x130181.textContent = "72%";
  await new Promise(_0x2b0b7c => setTimeout(_0x2b0b7c, 30));
  _0x302260.textContent = "Clearing old data from cloud...";
  const {
    error: _0x5aad35
  } = await _0x51795b.from("ums_gradation").delete().neq("id", 0);
  if (_0x5aad35) {
    _0x130181.style.background = "#c62828";
    _0x302260.textContent = "";
    _0x3d1a5f.innerHTML = "<span style=\"color:#c62828;font-size:13px;font-weight:bold;\">❌ Supabase clear failed: " + (_0x5aad35.message || JSON.stringify(_0x5aad35)) + "<br>Data locally load hua but cloud mein nahi gaya.</span>";
    console.error("Supabase delete error:", _0x5aad35);
    return;
  }
  _0x130181.style.width = "78%";
  _0x130181.textContent = "78%";
  _0x302260.textContent = "Uploading all records in batches...";
  await new Promise(_0x1638ba => setTimeout(_0x1638ba, 30));
  const _0x552aeb = _0x38b386.map(_0xcfd8a0 => {
    const _0xbe229c = {};
    for (let _0x390202 = 1; _0x390202 <= 32; _0x390202++) {
      _0xbe229c["field" + _0x390202] = _0xcfd8a0["field" + _0x390202] || "";
    }
    return _0xbe229c;
  });
  const _0x5d09fa = 500;
  let _0x24d4c8 = 0;
  let _0x41c547 = 0;
  let _0x489436 = null;
  for (let _0xc20485 = 0; _0xc20485 < _0x552aeb.length; _0xc20485 += _0x5d09fa) {
    const _0x25a754 = _0x552aeb.slice(_0xc20485, _0xc20485 + _0x5d09fa);
    const {
      data: _0xc0cc66,
      error: _0x90b546
    } = await _0x51795b.from("ums_gradation").insert(_0x25a754).select("id");
    if (!_0x90b546 && _0xc0cc66) {
      _0xc0cc66.forEach((_0x38c8f9, _0x137fc6) => {
        _0x38b386[_0xc20485 + _0x137fc6]._sbId = _0x38c8f9.id;
      });
      _0x24d4c8 += _0x25a754.length;
    } else {
      let _0x8e481a = "";
      if (_0x90b546) {
        _0x8e481a = _0x90b546.message || _0x90b546.details || _0x90b546.hint || "";
        if (_0x90b546.code === "42501" || _0x8e481a.includes("policy") || _0x8e481a.includes("permission")) {
          _0x8e481a = "RLS policy block kar raha hai — Supabase dashboard mein ums_gradation table pe INSERT policy add karo ya RLS disable karo";
        } else if (_0x90b546.code === "42703" || _0x8e481a.includes("column")) {
          _0x8e481a = "Column mismatch — table mein koi column missing hai";
        } else if (!_0x8e481a) {
          _0x8e481a = "HTTP 400 — " + JSON.stringify(_0x90b546);
        }
      }
      console.error("Batch insert error:", _0x90b546, "| Parsed:", _0x8e481a);
      if (!_0x489436) {
        _0x489436 = {
          message: _0x8e481a || JSON.stringify(_0x90b546)
        };
      }
      _0x41c547 += _0x25a754.length;
    }
    const _0x464a8a = Math.round(78 + (_0xc20485 + _0x5d09fa) / _0x552aeb.length * 20);
    _0x130181.style.width = Math.min(_0x464a8a, 98) + "%";
    _0x130181.textContent = Math.min(_0x464a8a, 98) + "%";
    _0x302260.textContent = "Uploading: " + Math.min(_0xc20485 + _0x5d09fa, _0x552aeb.length) + " / " + _0x552aeb.length + " records...";
    await new Promise(_0x495711 => setTimeout(_0x495711, 0));
  }
  _0x130181.style.width = "100%";
  _0x130181.textContent = "100%";
  auditLog("PASTE_IMPORT", _0x24d4c8 + " records saved to Supabase, " + _0x41c547 + " failed by " + (currentUser || window.currentUser));
  if (_0x41c547 > 0) {
    _0x130181.style.background = "#c62828";
    _0x302260.textContent = "";
    const _0x8ffc0d = _0x489436 ? _0x489436.message || JSON.stringify(_0x489436) : "Unknown error";
    _0x3d1a5f.innerHTML = "<span style=\"color:#c62828;font-size:13px;font-weight:bold;\">❌ " + _0x41c547 + " records Supabase mein save nahi hue!<br><small>" + _0x8ffc0d + "</small><br>Saved: " + _0x24d4c8 + " / " + _0x552aeb.length + "</span>";
  } else {
    _0x130181.style.background = "#2e7d32";
    _0x302260.textContent = "✅ " + _0x24d4c8 + " records cloud mein save ho gaye!";
    _0x3d1a5f.innerHTML = "<span style=\"color:#2e7d32;font-size:13px;font-weight:bold;\">✅ " + _0x38b386.length + " records Supabase mein successfully save hue! ☁️</span>";
    setTimeout(() => {
      closePasteModal();
    }, 2500);
  }
}
window.recentRecords = [];
function addToRecent(_0xe2c590, _0x437e46, _0x27cf0a) {
  if (!_0xe2c590) {
    return;
  }
  window.recentRecords = window.recentRecords.filter(_0x545e33 => _0x545e33.id !== _0xe2c590);
  window.recentRecords.unshift({
    id: _0xe2c590,
    name: _0x437e46 || "—",
    district: _0x27cf0a || "—",
    time: new Date().toLocaleTimeString("en-IN")
  });
  if (window.recentRecords.length > 10) {
    window.recentRecords = window.recentRecords.slice(0, 10);
  }
  if (document.getElementById("recentPanel") && document.getElementById("recentPanel").style.display !== "none") {
    renderRecentList();
  }
}
function _addToRecent(_0xae2490) {
  if (!_0xae2490) {
    return;
  }
  var _0x38b7ce = _0xae2490.field3 || _0xae2490.uniqueId || "";
  var _0x5d7a5a = _0xae2490.field4 || "—";
  var _0x2ee740 = _0xae2490.field24 || _0xae2490.field22 || "—";
  addToRecent(_0x38b7ce, _0x5d7a5a, _0x2ee740);
}
function renderRecentList() {
  const _0xc2d8d9 = document.getElementById("recentList");
  if (!_0xc2d8d9) {
    return;
  }
  if (window.recentRecords.length === 0) {
    _0xc2d8d9.innerHTML = "<div style=\"color:#aaa;font-size:11px;text-align:center;padding:15px;\">No records viewed yet</div>";
    return;
  }
  _0xc2d8d9.innerHTML = window.recentRecords.map((_0x54ffcf, _0x4790a8) => "\n        <div onclick=\"jumpToRecord('" + _0x54ffcf.id + "')\" style=\"padding:7px 10px;border-bottom:1px solid #f0f0f0;cursor:pointer;transition:background 0.15s;\"\n             onmouseover=\"this.style.background='#e3f2fd'\" onmouseout=\"this.style.background='white'\">\n            <div style=\"font-size:12px;font-weight:bold;color:#002e5b;\">#" + _0x54ffcf.id + " &nbsp; " + _0x54ffcf.name + "</div>\n            <div style=\"font-size:10px;color:#888;\">📍 " + _0x54ffcf.district + " &nbsp;|&nbsp; 🕐 " + _0x54ffcf.time + "</div>\n        </div>").join("");
}
function jumpToRecord(_0x4007d6) {
  const _0x2e734d = document.getElementById("searchVal");
  if (_0x2e734d) {
    _0x2e734d.value = _0x4007d6;
    performSearch();
  }
  closeRecentPanel();
}
function toggleRecentPanel() {
  const _0x1a53d1 = document.getElementById("recentPanel");
  if (!_0x1a53d1) {
    return;
  }
  const _0x482013 = _0x1a53d1.style.display !== "none";
  _0x1a53d1.style.display = _0x482013 ? "none" : "block";
  if (!_0x482013) {
    renderRecentList();
  }
}
function closeRecentPanel() {
  const _0x52287e = document.getElementById("recentPanel");
  if (_0x52287e) {
    _0x52287e.style.display = "none";
  }
}
document.addEventListener("DOMContentLoaded", function () {
  const _0x34ebab = document.createElement("div");
  _0x34ebab.id = "recentBtn";
  _0x34ebab.onclick = toggleRecentPanel;
  _0x34ebab.title = "Recent Records (Ctrl+R)";
  _0x34ebab.style.cssText = "position:fixed;bottom:20px;right:20px;background:#002e5b;color:white;width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:20px;z-index:9990;box-shadow:0 4px 12px rgba(0,0,0,0.3);transition:transform 0.2s;";
  _0x34ebab.innerHTML = "🕐";
  _0x34ebab.onmouseover = () => _0x34ebab.style.transform = "scale(1.1)";
  _0x34ebab.onmouseout = () => _0x34ebab.style.transform = "scale(1)";
  document.body.appendChild(_0x34ebab);
  const _0x557183 = document.createElement("div");
  _0x557183.id = "recentPanel";
  _0x557183.style.cssText = "display:none;position:fixed;bottom:78px;right:20px;width:300px;max-height:380px;background:white;border-radius:10px;box-shadow:0 8px 25px rgba(0,0,0,0.3);z-index:9989;overflow:hidden;font-family:sans-serif;";
  _0x557183.innerHTML = "\n        <div style=\"background:#002e5b;color:white;padding:10px 14px;display:flex;justify-content:space-between;align-items:center;\">\n            <b style=\"font-size:13px;\">🕐 Recent Records</b>\n            <button onclick=\"closeRecentPanel()\" style=\"background:rgba(255,255,255,0.2);border:none;color:white;width:22px;height:22px;border-radius:50%;cursor:pointer;font-size:12px;\">✕</button>\n        </div>\n        <div id=\"recentList\" style=\"overflow-y:auto;max-height:320px;\"></div>";
  document.body.appendChild(_0x557183);
});
(function () {
  'use strict';

  function _0x5abcd9() {
    var _0x3a9747 = document.getElementById("loginOverlay");
    if (!_0x3a9747) {
      return;
    }
    var _0x5c07a8 = document.createElement("canvas");
    _0x5c07a8.style.cssText = "position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:0.3;";
    _0x3a9747.style.position = "relative";
    _0x3a9747.insertBefore(_0x5c07a8, _0x3a9747.firstChild);
    var _0xb98459 = _0x5c07a8.getContext("2d");
    var _0x263f08;
    var _0x57ae37;
    var _0xe66030 = [];
    function _0x308095() {
      _0x263f08 = _0x5c07a8.width = _0x3a9747.offsetWidth || window.innerWidth;
      _0x57ae37 = _0x5c07a8.height = _0x3a9747.offsetHeight || window.innerHeight;
    }
    _0x308095();
    window.addEventListener("resize", _0x308095);
    var _0x424c8b = ["#3b82f6", "#06b6d4", "#8b5cf6", "#f59e0b", "#10b981"];
    for (var _0x5cdb7e = 0; _0x5cdb7e < 55; _0x5cdb7e++) {
      _0xe66030.push({
        x: Math.random() * _0x263f08,
        y: Math.random() * _0x57ae37,
        r: Math.random() * 2.2 + 0.7,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        color: _0x424c8b[Math.floor(Math.random() * _0x424c8b.length)],
        alpha: Math.random() * 0.5 + 0.25
      });
    }
    var _0x319608;
    function _0x2d215f() {
      var _0x46e865 = document.getElementById("loginOverlay");
      if (!_0x46e865 || _0x46e865.style.display === "none") {
        cancelAnimationFrame(_0x319608);
        try {
          _0x5c07a8.remove();
        } catch (_0x40d46e) {}
        return;
      }
      _0xb98459.clearRect(0, 0, _0x263f08, _0x57ae37);
      for (var _0x2591be = 0; _0x2591be < _0xe66030.length; _0x2591be++) {
        var _0x346968 = _0xe66030[_0x2591be];
        _0x346968.x += _0x346968.vx;
        _0x346968.y += _0x346968.vy;
        if (_0x346968.x < 0) {
          _0x346968.x = _0x263f08;
        }
        if (_0x346968.x > _0x263f08) {
          _0x346968.x = 0;
        }
        if (_0x346968.y < 0) {
          _0x346968.y = _0x57ae37;
        }
        if (_0x346968.y > _0x57ae37) {
          _0x346968.y = 0;
        }
        _0xb98459.beginPath();
        _0xb98459.arc(_0x346968.x, _0x346968.y, _0x346968.r, 0, Math.PI * 2);
        _0xb98459.fillStyle = _0x346968.color;
        _0xb98459.globalAlpha = _0x346968.alpha;
        _0xb98459.fill();
      }
      _0xb98459.globalAlpha = 1;
      _0xb98459.strokeStyle = "#3b82f6";
      _0xb98459.lineWidth = 0.7;
      for (var _0x2591be = 0; _0x2591be < _0xe66030.length; _0x2591be++) {
        for (var _0x5f04d7 = _0x2591be + 1; _0x5f04d7 < _0xe66030.length; _0x5f04d7++) {
          var _0x1fe809 = _0xe66030[_0x2591be].x - _0xe66030[_0x5f04d7].x;
          var _0x465e3b = _0xe66030[_0x2591be].y - _0xe66030[_0x5f04d7].y;
          var _0x49c6ad = Math.sqrt(_0x1fe809 * _0x1fe809 + _0x465e3b * _0x465e3b);
          if (_0x49c6ad < 100) {
            _0xb98459.globalAlpha = (1 - _0x49c6ad / 100) * 0.1;
            _0xb98459.beginPath();
            _0xb98459.moveTo(_0xe66030[_0x2591be].x, _0xe66030[_0x2591be].y);
            _0xb98459.lineTo(_0xe66030[_0x5f04d7].x, _0xe66030[_0x5f04d7].y);
            _0xb98459.stroke();
          }
        }
      }
      _0xb98459.globalAlpha = 1;
      _0x319608 = requestAnimationFrame(_0x2d215f);
    }
    _0x2d215f();
  }
  function _0x4834e3(_0x418a32) {
    if (_0x418a32._rippleAdded) {
      return;
    }
    _0x418a32._rippleAdded = true;
    _0x418a32.addEventListener("click", function (_0x385ccf) {
      var _0x36e659 = _0x418a32.getBoundingClientRect();
      var _0x261a44 = _0x385ccf.clientX - _0x36e659.left;
      var _0x36d27d = _0x385ccf.clientY - _0x36e659.top;
      var _0x3e4dfc = Math.max(_0x36e659.width, _0x36e659.height) * 2.2;
      var _0x172c1e = document.createElement("span");
      _0x172c1e.style.cssText = "position:absolute;border-radius:50%;width:" + _0x3e4dfc + "px;height:" + _0x3e4dfc + "px;left:" + (_0x261a44 - _0x3e4dfc / 2) + "px;top:" + (_0x36d27d - _0x3e4dfc / 2) + "px;background:rgba(255,255,255,0.28);transform:scale(0);pointer-events:none;animation:ums-ripple 0.55s ease-out forwards;z-index:9999;";
      _0x418a32.style.position = "relative";
      _0x418a32.style.overflow = "hidden";
      _0x418a32.appendChild(_0x172c1e);
      setTimeout(function () {
        try {
          _0x172c1e.remove();
        } catch (_0x122a33) {}
      }, 600);
    });
  }
  window._umsAnimateRows = function () {
    var _0x4ad6c2 = document.querySelectorAll("#tableBody tr:not(.ums-row-done)");
    _0x4ad6c2.forEach(function (_0x2f2e84, _0x108a62) {
      _0x2f2e84.classList.add("ums-row-done", "ums-row-animate");
      _0x2f2e84.style.animationDelay = Math.min(_0x108a62 * 0.016, 0.38) + "s";
      _0x2f2e84.style.animationFillMode = "both";
    });
  };
  window._umsAnimateCounter = function (_0x146eba, _0x4dd045, _0x15b263, _0x24a69f) {
    if (!_0x146eba) {
      return;
    }
    _0x24a69f = _0x24a69f || 1000;
    var _0x35175e = performance.now();
    function _0x555c27(_0x3b1ef5) {
      var _0x184cde = Math.min((_0x3b1ef5 - _0x35175e) / _0x24a69f, 1);
      var _0x242346 = 1 - Math.pow(1 - _0x184cde, 3);
      var _0x1cb689 = Math.round(_0x4dd045 + (_0x15b263 - _0x4dd045) * _0x242346);
      _0x146eba.textContent = _0x1cb689.toLocaleString("en-IN");
      if (_0x184cde < 1) {
        requestAnimationFrame(_0x555c27);
      }
    }
    requestAnimationFrame(_0x555c27);
  };
  window._umsSaveFlash = function (_0x2964c4) {
    if (!_0x2964c4) {
      return;
    }
    var _0x401f65 = document.querySelectorAll("#tableBody tr");
    _0x401f65.forEach(function (_0x22aefc) {
      if (_0x22aefc.textContent.indexOf(String(_0x2964c4)) > -1) {
        _0x22aefc.classList.remove("ums-save-flash");
        _0x22aefc.offsetWidth;
        _0x22aefc.classList.add("ums-save-flash");
        setTimeout(function () {
          _0x22aefc.classList.remove("ums-save-flash");
        }, 1700);
      }
    });
  };
  window._umsShake = function (_0x3c499d) {
    if (!_0x3c499d) {
      return;
    }
    _0x3c499d.classList.remove("ums-shake");
    _0x3c499d.offsetWidth;
    _0x3c499d.classList.add("ums-shake");
    setTimeout(function () {
      _0x3c499d.classList.remove("ums-shake");
    }, 460);
  };
  function _0x416ff0() {
    var _0x27db94 = new Date();
    var _0x2a3b0b = _0x27db94.getFullYear();
    var _0x42b79e = String(_0x27db94.getMonth() + 1).padStart(2, "0");
    var _0x3fafd7 = String(_0x27db94.getDate()).padStart(2, "0");
    var _0x56d740 = _0x2a3b0b + "-" + _0x42b79e + "-" + _0x3fafd7;
    var _0x320286 = ["in7", "in14", "probOrderDate", "in16", "in16b", "in19"];
    _0x320286.forEach(function (_0x140ee3) {
      var _0x175666 = document.getElementById(_0x140ee3);
      if (!_0x175666) {
        return;
      }
      _0x175666.setAttribute("max", _0x56d740);
      _0x175666.addEventListener("keydown", function (_0x12e400) {
        _0x12e400.preventDefault();
        return false;
      });
      _0x175666.addEventListener("keypress", function (_0x16d2a1) {
        _0x16d2a1.preventDefault();
        return false;
      });
      _0x175666.addEventListener("paste", function (_0x164c85) {
        _0x164c85.preventDefault();
        return false;
      });
      _0x175666.style.cursor = "pointer";
    });
  }
  (function _0x4d4cc7() {
    document.addEventListener("contextmenu", function (_0x3abe8e) {
      _0x3abe8e.preventDefault();
      _0x3abe8e.stopPropagation();
      return false;
    }, true);
    document.addEventListener("selectstart", function (_0x48df4e) {
      _0x48df4e.preventDefault();
      return false;
    }, true);
    document.addEventListener("mousedown", function (_0x4bd641) {
      if (_0x4bd641.detail > 1) {
        _0x4bd641.preventDefault();
        return false;
      }
    }, true);
    document.addEventListener("dragstart", function (_0x318018) {
      _0x318018.preventDefault();
      return false;
    }, true);
    document.addEventListener("keydown", function (_0x59d0a5) {
      var _0x3bf3a3 = _0x59d0a5.key ? _0x59d0a5.key.toLowerCase() : "";
      var _0x2101f7 = _0x59d0a5.ctrlKey || _0x59d0a5.metaKey;
      if (_0x2101f7 && (_0x3bf3a3 === "c" || _0x3bf3a3 === "x" || _0x3bf3a3 === "a" || _0x3bf3a3 === "s" || _0x3bf3a3 === "u")) {
        _0x59d0a5.preventDefault();
        _0x59d0a5.stopPropagation();
        return false;
      }
      if (_0x2101f7 && _0x59d0a5.shiftKey && (_0x3bf3a3 === "i" || _0x3bf3a3 === "j" || _0x3bf3a3 === "c" || _0x3bf3a3 === "k")) {
        _0x59d0a5.preventDefault();
        _0x59d0a5.stopPropagation();
        return false;
      }
      if (_0x59d0a5.key === "F12") {
        _0x59d0a5.preventDefault();
        _0x59d0a5.stopPropagation();
        return false;
      }
      if (_0x59d0a5.key === "F5" && _0x2101f7) {
        _0x59d0a5.preventDefault();
        return false;
      }
      if (_0x2101f7 && _0x3bf3a3 === "p") {
        _0x59d0a5.preventDefault();
        _0x59d0a5.stopPropagation();
        return false;
      }
    }, true);
    window.addEventListener("beforeprint", function (_0xb4d4ee) {
      _0xb4d4ee.stopImmediatePropagation();
      document.body.innerHTML = "<div style=\"display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;font-size:22px;color:#b91c1c;font-weight:700;\">⛔ Printing is disabled for this document.<br>© 2026 DPI Madhya Pradesh</div>";
    });
    var _0x26fced = window.print;
    window.print = function () {
      alert("⛔ Printing is disabled.\n© 2026 DPI Madhya Pradesh – All Rights Reserved.");
      return false;
    };
    var _0x383df6 = false;
    function _0x5cc8c4() {
      var _0xe8904e = 160;
      var _0x4123b0 = window.outerWidth - window.innerWidth;
      var _0x420cb6 = window.outerHeight - window.innerHeight;
      if (_0x4123b0 > _0xe8904e || _0x420cb6 > _0xe8904e) {
        if (!_0x383df6) {
          _0x383df6 = true;
          document.body.style.filter = "blur(8px) grayscale(1)";
          var _0x534545 = document.getElementById("_umsDevWarn");
          if (!_0x534545) {
            _0x534545 = document.createElement("div");
            _0x534545.id = "_umsDevWarn";
            _0x534545.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.88);z-index:99999999;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;font-family:sans-serif;text-align:center;";
            _0x534545.innerHTML = "<div style=\"font-size:52px;\">🔒</div><div style=\"font-size:24px;font-weight:700;color:#f87171;margin:12px 0;\">Developer Tools Detected</div><div style=\"font-size:15px;color:#fcd34d;max-width:400px;line-height:1.6;\">This application is protected.<br>Unauthorized inspection is not permitted.<br><br><span style=\"color:#6ee7b7;font-size:13px;\">© 2026 DPI Madhya Pradesh – All Rights Reserved</span></div>";
            document.body.appendChild(_0x534545);
          }
          _0x534545.style.display = "flex";
        }
      } else if (_0x383df6) {
        _0x383df6 = false;
        document.body.style.filter = "";
        var _0x3ff055 = document.getElementById("_umsDevWarn");
        if (_0x3ff055) {
          _0x3ff055.style.display = "none";
        }
      }
    }
    setInterval(_0x5cc8c4, 1000);
    var _0x518ed9 = document.createElement("style");
    _0x518ed9.textContent = ["* {", "  -webkit-user-select: none !important;", "  -moz-user-select: none !important;", "  -ms-user-select: none !important;", "  user-select: none !important;", "  -webkit-touch-callout: none !important;", "}", "input, textarea, select {", "  -webkit-user-select: text !important;", "  -moz-user-select: text !important;", "  user-select: text !important;", "}"].join("\n");
    document.head.appendChild(_0x518ed9);
    if (window.location.href.indexOf("view-source:") !== -1) {
      document.documentElement.innerHTML = "<h1 style=\"font-family:sans-serif;color:red;text-align:center;margin-top:20vh;\">⛔ Access Denied<br><small style=\"font-size:16px;color:#555\">© 2026 DPI Madhya Pradesh</small></h1>";
    }
    document.addEventListener("copy", function (_0x5b8b8d) {
      _0x5b8b8d.preventDefault();
      if (_0x5b8b8d.clipboardData) {
        _0x5b8b8d.clipboardData.setData("text/plain", "⛔ Content protected. © 2026 DPI Madhya Pradesh – All Rights Reserved.");
      }
      return false;
    }, true);
    document.addEventListener("cut", function (_0x2e3a4e) {
      _0x2e3a4e.preventDefault();
      return false;
    }, true);
    (function _0x5808d6() {
      function _0x1ea66a() {
        (function () {
          try {
            var _0x59a14c = new Date();
            (function _0xbc5e80() {}).constructor("debugger")();
            if (new Date() - _0x59a14c > 100) {
              document.body.style.filter = "blur(10px) grayscale(1)";
              var _0x9cfffc = document.getElementById("_umsDevWarn");
              if (_0x9cfffc) {
                _0x9cfffc.style.display = "flex";
              }
            }
          } catch (_0x4e9504) {}
        })();
        setTimeout(_0x1ea66a, 50);
      }
      _0x1ea66a();
    })();
  })();
  document.addEventListener("DOMContentLoaded", function () {
    _0x5abcd9();
    _0x416ff0();
    document.querySelectorAll(".btn, .footer-btn, .pw-change-btn").forEach(_0x4834e3);
    var _0x4c85b4 = new MutationObserver(function (_0x1d1a24) {
      _0x1d1a24.forEach(function (_0x32becc) {
        _0x32becc.addedNodes.forEach(function (_0x215b59) {
          if (_0x215b59.nodeType !== 1) {
            return;
          }
          if (_0x215b59.classList && (_0x215b59.classList.contains("btn") || _0x215b59.classList.contains("footer-btn"))) {
            _0x4834e3(_0x215b59);
          }
          if (_0x215b59.querySelectorAll) {
            _0x215b59.querySelectorAll(".btn, .footer-btn").forEach(_0x4834e3);
          }
        });
      });
    });
    _0x4c85b4.observe(document.body, {
      childList: true,
      subtree: true
    });
    if (typeof window.renderVirtual === "function") {
      var _0x16ebfd = window.renderVirtual;
      window.renderVirtual = function () {
        _0x16ebfd.apply(this, arguments);
        requestAnimationFrame(window._umsAnimateRows);
      };
    }
    setTimeout(window._umsAnimateRows, 700);
    setTimeout(function () {
      document.querySelectorAll(".kpi-val, [data-animate-count]").forEach(function (_0x58c334) {
        var _0x31706a = parseInt((_0x58c334.textContent || "").replace(/,/g, ""), 10);
        if (!isNaN(_0x31706a) && _0x31706a > 0) {
          window._umsAnimateCounter(_0x58c334, 0, _0x31706a, 1100);
        }
      });
    }, 900);
    document.querySelectorAll(".scroll-area").forEach(function (_0x37c36d) {
      _0x37c36d.style.scrollBehavior = "smooth";
    });
    var _0x5db28c = document.querySelector("#loginOverlay h2");
    if (_0x5db28c) {
      var _0x58c2a9 = document.createElement("span");
      _0x58c2a9.style.cssText = "display:inline-block;width:2px;height:0.9em;background:#1a237e;margin-left:3px;vertical-align:middle;animation:ums-typewriter-cursor 0.8s step-end infinite;";
      _0x5db28c.appendChild(_0x58c2a9);
      setTimeout(function () {
        try {
          _0x58c2a9.remove();
        } catch (_0x3edc30) {}
      }, 3500);
    }
    document.body.style.opacity = "1";
    document.body.style.transition = "opacity 0.4s ease";
    var _0x797c86 = document.getElementById("onlineStatusBar");
    if (_0x797c86) {
      Array.from(_0x797c86.children).forEach(function (_0x4267cb, _0x3f8bd2) {
        _0x4267cb.style.animation = "ums-fadeInUp 0.4s ease both";
        _0x4267cb.style.animationDelay = 0.05 + _0x3f8bd2 * 0.07 + "s";
      });
    }
  });
})(); // ── Smart Single-Record Update (App 4 Realtime Reload Simplified Logic) ──
async function _smartUpdateRecord(uid) {
  if (!uid) {
    return;
  }
  const sb = getSupabase();
  if (!sb) {
    return;
  }
  try {
    const {
      data,
      error
    } = await sb.from("ums_gradation").select("*").ilike("field3", uid).single();
    if (error || !data) {
      // Fallback: silent full reload
      window._silentReload = true;
      const ok = await loadDataFromSupabase();
      if (ok) {
        window.filteredData = [...window.fullData];
        renderVirtual();
        updateStorageBadge(true);
      }
      const ov = document.getElementById("dataLoadingOverlay");
      if (ov) {
        ov.style.display = "none";
      }
      return;
    }
    // Map Supabase row to fullData format
    const obj = {};
    for (let i = 1; i <= 32; i++) {
      obj["field" + i] = data["field" + i] || "";
    }
    obj._sbId = data.id;
    // field25 normalize
    const f25v = (obj.field25 || "").toString().trim().toUpperCase();
    obj.field25 = f25v === "YES" ? "YES" : "NO";
    // changed_fields restore
    if (data.changed_fields) {
      try {
        let cf = JSON.parse(data.changed_fields);
        [29, 30, 31].forEach(k => {
          delete cf[k];
          delete cf[String(k)];
        });
        if (Object.keys(cf).length > 0) {
          obj._changedFields = cf;
        }
      } catch (e) {}
    }
    // history_log restore
    if (data.history_log) {
      try {
        obj.history_log = JSON.parse(data.history_log);
      } catch (e) {}
    }
    // doc URLs
    if (data.doc_url) {
      obj._doc = {
        name: obj.field32 || data.doc_url.split("/").pop(),
        url: data.doc_url,
        uploader: ""
      };
    }
    if (data.transfer_doc_url) {
      obj._transferDoc = {
        name: data.transfer_doc_url.split("/").pop().replace(/^td_[^_]+_/, ""),
        url: data.transfer_doc_url,
        uploader: ""
      };
    }
    // Update window.fullData in-place
    const idx = window.fullData ? window.fullData.findIndex(r => (r.field3 || "").trim().toUpperCase() === uid.toUpperCase()) : -1;
    if (idx >= 0) {
      window.fullData[idx] = obj;
    } else if (window.fullData) {
      window.fullData.push(obj);
    }
    // Update filteredData too
    if (window.filteredData) {
      const fidx = window.filteredData.findIndex(r => (r.field3 || "").trim().toUpperCase() === uid.toUpperCase());
      if (fidx >= 0) {
        window.filteredData[fidx] = obj;
      } else {
        window.filteredData.push(obj);
      }
    }
    renderVirtual();
    updateStorageBadge(true);
  } catch (err) {
    console.warn("_smartUpdateRecord error:", err);
  }
}