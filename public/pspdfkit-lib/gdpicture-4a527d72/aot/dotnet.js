var __dotnet_runtime = (function (e) {
    "use strict";
    let t, r, n, o, i, a, s, c;
    const _ = {},
      u = {};
    let l;
    function f(e, _) {
      (r = _.internal),
        (n = _.marshaled_imports),
        (t = _.module),
        m(e),
        (o = e.isNode),
        (i = e.isShell),
        (a = e.isWeb),
        (s = e.isWorker),
        (c = e.isPThread),
        (d.quit = e.quit_),
        (d.ExitStatus = e.ExitStatus),
        (d.requirePromise = e.requirePromise);
    }
    function m(e) {
      (o = e.isNode),
        (i = e.isShell),
        (a = e.isWeb),
        (s = e.isWorker),
        (c = e.isPThread);
    }
    const d = {
        javaScriptExports: {},
        mono_wasm_load_runtime_done: !1,
        mono_wasm_bindings_is_ready: !1,
        maxParallelDownloads: 16,
        config: { environmentVariables: {} },
        diagnosticTracing: !1,
      },
      h = -1;
    function p(e) {
      return null == e;
    }
    const w = [
        [
          !0,
          "mono_wasm_register_root",
          "number",
          ["number", "number", "string"],
        ],
        [!0, "mono_wasm_deregister_root", null, ["number"]],
        [
          !0,
          "mono_wasm_string_get_data",
          null,
          ["number", "number", "number", "number"],
        ],
        [
          !0,
          "mono_wasm_string_get_data_ref",
          null,
          ["number", "number", "number", "number"],
        ],
        [!0, "mono_wasm_set_is_debugger_attached", "void", ["bool"]],
        [
          !0,
          "mono_wasm_send_dbg_command",
          "bool",
          ["number", "number", "number", "number", "number"],
        ],
        [
          !0,
          "mono_wasm_send_dbg_command_with_parms",
          "bool",
          [
            "number",
            "number",
            "number",
            "number",
            "number",
            "number",
            "string",
          ],
        ],
        [!0, "mono_wasm_setenv", null, ["string", "string"]],
        [!0, "mono_wasm_parse_runtime_options", null, ["number", "number"]],
        [!0, "mono_wasm_strdup", "number", ["string"]],
        [!0, "mono_background_exec", null, []],
        [!0, "mono_set_timeout_exec", null, []],
        [!0, "mono_wasm_load_icu_data", "number", ["number"]],
        [!0, "mono_wasm_get_icudt_name", "string", ["string"]],
        [
          !1,
          "mono_wasm_add_assembly",
          "number",
          ["string", "number", "number"],
        ],
        [
          !0,
          "mono_wasm_add_satellite_assembly",
          "void",
          ["string", "string", "number", "number"],
        ],
        [!1, "mono_wasm_load_runtime", null, ["string", "number"]],
        [!0, "mono_wasm_change_debugger_log_level", "void", ["number"]],
        [!0, "mono_wasm_get_corlib", "number", []],
        [!0, "mono_wasm_assembly_load", "number", ["string"]],
        [!0, "mono_wasm_find_corlib_class", "number", ["string", "string"]],
        [
          !0,
          "mono_wasm_assembly_find_class",
          "number",
          ["number", "string", "string"],
        ],
        [!0, "mono_wasm_runtime_run_module_cctor", "void", ["number"]],
        [!0, "mono_wasm_find_corlib_type", "number", ["string", "string"]],
        [
          !0,
          "mono_wasm_assembly_find_type",
          "number",
          ["number", "string", "string"],
        ],
        [
          !0,
          "mono_wasm_assembly_find_method",
          "number",
          ["number", "string", "number"],
        ],
        [
          !0,
          "mono_wasm_invoke_method",
          "number",
          ["number", "number", "number", "number"],
        ],
        [
          !1,
          "mono_wasm_invoke_method_ref",
          "void",
          ["number", "number", "number", "number", "number"],
        ],
        [!0, "mono_wasm_string_get_utf8", "number", ["number"]],
        [
          !0,
          "mono_wasm_string_from_utf16_ref",
          "void",
          ["number", "number", "number"],
        ],
        [!0, "mono_wasm_get_obj_type", "number", ["number"]],
        [!0, "mono_wasm_array_length", "number", ["number"]],
        [!0, "mono_wasm_array_get", "number", ["number", "number"]],
        [!0, "mono_wasm_array_get_ref", "void", ["number", "number", "number"]],
        [!1, "mono_wasm_obj_array_new", "number", ["number"]],
        [!1, "mono_wasm_obj_array_new_ref", "void", ["number", "number"]],
        [!1, "mono_wasm_obj_array_set", "void", ["number", "number", "number"]],
        [
          !1,
          "mono_wasm_obj_array_set_ref",
          "void",
          ["number", "number", "number"],
        ],
        [!0, "mono_wasm_register_bundled_satellite_assemblies", "void", []],
        [
          !1,
          "mono_wasm_try_unbox_primitive_and_get_type_ref",
          "number",
          ["number", "number", "number"],
        ],
        [
          !0,
          "mono_wasm_box_primitive_ref",
          "void",
          ["number", "number", "number", "number"],
        ],
        [!0, "mono_wasm_intern_string_ref", "void", ["number"]],
        [!0, "mono_wasm_assembly_get_entry_point", "number", ["number"]],
        [!0, "mono_wasm_get_delegate_invoke_ref", "number", ["number"]],
        [!0, "mono_wasm_string_array_new_ref", "void", ["number", "number"]],
        [
          !0,
          "mono_wasm_typed_array_new_ref",
          "void",
          ["number", "number", "number", "number", "number"],
        ],
        [!0, "mono_wasm_class_get_type", "number", ["number"]],
        [!0, "mono_wasm_type_get_class", "number", ["number"]],
        [!0, "mono_wasm_get_type_name", "string", ["number"]],
        [!0, "mono_wasm_get_type_aqn", "string", ["number"]],
        [
          !0,
          "mono_wasm_event_pipe_enable",
          "bool",
          ["string", "number", "number", "string", "bool", "number"],
        ],
        [
          !0,
          "mono_wasm_event_pipe_session_start_streaming",
          "bool",
          ["number"],
        ],
        [!0, "mono_wasm_event_pipe_session_disable", "bool", ["number"]],
        [
          !0,
          "mono_wasm_diagnostic_server_create_thread",
          "bool",
          ["string", "number"],
        ],
        [
          !0,
          "mono_wasm_diagnostic_server_thread_attach_to_runtime",
          "void",
          [],
        ],
        [!0, "mono_wasm_diagnostic_server_post_resume_runtime", "void", []],
        [!0, "mono_wasm_diagnostic_server_create_stream", "number", []],
        [!0, "mono_wasm_string_from_js", "number", ["string"]],
        [!1, "mono_wasm_exit", "void", ["number"]],
        [!0, "mono_wasm_getenv", "number", ["string"]],
        [!0, "mono_wasm_set_main_args", "void", ["number", "number"]],
        [!1, "mono_wasm_enable_on_demand_gc", "void", ["number"]],
        [!1, "mono_profiler_init_aot", "void", ["number"]],
        [!1, "mono_wasm_exec_regression", "number", ["number", "string"]],
        [!1, "mono_wasm_invoke_method_bound", "number", ["number", "number"]],
        [
          !0,
          "mono_wasm_write_managed_pointer_unsafe",
          "void",
          ["number", "number"],
        ],
        [!0, "mono_wasm_copy_managed_pointer", "void", ["number", "number"]],
        [!0, "mono_wasm_i52_to_f64", "number", ["number", "number"]],
        [!0, "mono_wasm_u52_to_f64", "number", ["number", "number"]],
        [!0, "mono_wasm_f64_to_i52", "number", ["number", "number"]],
        [!0, "mono_wasm_f64_to_u52", "number", ["number", "number"]],
      ],
      g = {};
    function y(e, t, r) {
      const n = (function (e, t, r) {
        let n,
          o = "number" == typeof t ? t : 0;
        n = "number" == typeof r ? o + r : e.length - o;
        const i = {
          read: function () {
            if (o >= n) return null;
            const t = e[o];
            return (o += 1), t;
          },
        };
        return (
          Object.defineProperty(i, "eof", {
            get: function () {
              return o >= n;
            },
            configurable: !0,
            enumerable: !0,
          }),
          i
        );
      })(e, t, r);
      let o = "",
        i = 0,
        a = 0,
        s = 0,
        c = 0,
        _ = 0,
        u = 0;
      for (; (i = n.read()), (a = n.read()), (s = n.read()), null !== i; )
        null === a && ((a = 0), (_ += 1)),
          null === s && ((s = 0), (_ += 1)),
          (u = (i << 16) | (a << 8) | (s << 0)),
          (c = (16777215 & u) >> 18),
          (o += b[c]),
          (c = (262143 & u) >> 12),
          (o += b[c]),
          _ < 2 && ((c = (4095 & u) >> 6), (o += b[c])),
          2 === _
            ? (o += "==")
            : 1 === _
            ? (o += "=")
            : ((c = (63 & u) >> 0), (o += b[c]));
      return o;
    }
    const b = [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z",
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "+",
      "/",
    ];
    const v = new Map();
    v.remove = function (e) {
      const t = this.get(e);
      return this.delete(e), t;
    };
    let E,
      S,
      A,
      k = {},
      N = 0,
      O = -1;
    function x() {
      (r.mono_wasm_runtime_is_ready = d.mono_wasm_runtime_is_ready = !0),
        (N = 0),
        (k = {}),
        (O = -1),
        globalThis.dotnetDebugger ||
          console.debug(
            "mono_wasm_runtime_ready",
            "fe00e07a-5519-4dfe-b35a-f867dbaf2e28",
          );
    }
    function j() {}
    function T(e, r, n, o) {
      const i = {
        res_ok: e,
        res: { id: r, value: y(new Uint8Array(t.HEAPU8.buffer, n, o)) },
      };
      v.has(r) &&
        console.warn(
          `MONO_WASM: Adding an id (${r}) that already exists in commands_received`,
        ),
        v.set(r, i);
    }
    function D(e) {
      e.length > O &&
        (E && t._free(E), (O = Math.max(e.length, O, 256)), (E = t._malloc(O)));
      const r = atob(e);
      for (let e = 0; e < r.length; e++) t.HEAPU8[E + e] = r.charCodeAt(e);
    }
    function M(e, t, r, n, o, i, a) {
      D(n),
        g.mono_wasm_send_dbg_command_with_parms(e, t, r, E, o, i, a.toString());
      const { res_ok: s, res: c } = v.remove(e);
      if (!s)
        throw new Error(
          "Failed on mono_wasm_invoke_method_debugger_agent_with_parms",
        );
      return c;
    }
    function R(e, t, r, n) {
      D(n), g.mono_wasm_send_dbg_command(e, t, r, E, n.length);
      const { res_ok: o, res: i } = v.remove(e);
      if (!o) throw new Error("Failed on mono_wasm_send_dbg_command");
      return i;
    }
    function P() {
      const { res_ok: e, res: t } = v.remove(0);
      if (!e) throw new Error("Failed on mono_wasm_get_dbg_command_info");
      return t;
    }
    function C() {}
    function I() {
      g.mono_wasm_set_is_debugger_attached(!1);
    }
    function F(e) {
      g.mono_wasm_change_debugger_log_level(e);
    }
    function $(e, t = {}) {
      if ("object" != typeof e)
        throw new Error(
          `event must be an object, but got ${JSON.stringify(e)}`,
        );
      if (void 0 === e.eventName)
        throw new Error(
          `event.eventName is a required parameter, in event: ${JSON.stringify(
            e,
          )}`,
        );
      if ("object" != typeof t)
        throw new Error(`args must be an object, but got ${JSON.stringify(t)}`);
      console.debug(
        "mono_wasm_debug_event_raised:aef14bca-5519-4dfe-b35a-f867abc123ae",
        JSON.stringify(e),
        JSON.stringify(t),
      );
    }
    function U() {
      -1 == d.waitForDebugger && (d.waitForDebugger = 1),
        g.mono_wasm_set_is_debugger_attached(!0);
    }
    function B(e, r) {
      (S = t.UTF8ToString(e).concat(".dll")),
        (A = r),
        console.assert(
          !0,
          `Adding an entrypoint breakpoint ${S} at method token  ${A}`,
        );
    }
    function W(e) {
      if (null != e.arguments && !Array.isArray(e.arguments))
        throw new Error(
          `"arguments" should be an array, but was ${e.arguments}`,
        );
      const t = e.objectId,
        r = e.details;
      let n = {};
      if (t.startsWith("dotnet:cfo_res:")) {
        if (!(t in k)) throw new Error(`Unknown object id ${t}`);
        n = k[t];
      } else
        n = (function (e, t) {
          if (e.startsWith("dotnet:array:")) {
            let e;
            if (void 0 === t.items) return (e = t.map((e) => e.value)), e;
            if (
              void 0 === t.dimensionsDetails ||
              1 === t.dimensionsDetails.length
            )
              return (e = t.items.map((e) => e.value)), e;
          }
          const r = {};
          return (
            Object.keys(t).forEach((e) => {
              const n = t[e];
              void 0 !== n.get
                ? Object.defineProperty(r, n.name, {
                    get: () =>
                      R(
                        n.get.id,
                        n.get.commandSet,
                        n.get.command,
                        n.get.buffer,
                      ),
                    set: function (e) {
                      return (
                        M(
                          n.set.id,
                          n.set.commandSet,
                          n.set.command,
                          n.set.buffer,
                          n.set.length,
                          n.set.valtype,
                          e,
                        ),
                        !0
                      );
                    },
                  })
                : void 0 !== n.set
                ? Object.defineProperty(r, n.name, {
                    get: () => n.value,
                    set: function (e) {
                      return (
                        M(
                          n.set.id,
                          n.set.commandSet,
                          n.set.command,
                          n.set.buffer,
                          n.set.length,
                          n.set.valtype,
                          e,
                        ),
                        !0
                      );
                    },
                  })
                : (r[n.name] = n.value);
            }),
            r
          );
        })(t, r);
      const o =
          null != e.arguments
            ? e.arguments.map((e) => JSON.stringify(e.value))
            : [],
        i = `const fn = ${e.functionDeclaration}; return fn.apply(proxy, [${o}]);`,
        a = new Function("proxy", i)(n);
      if (void 0 === a) return { type: "undefined" };
      if (Object(a) !== a)
        return "object" == typeof a && null == a
          ? { type: typeof a, subtype: `${a}`, value: null }
          : { type: typeof a, description: `${a}`, value: `${a}` };
      if (e.returnByValue && null == a.subtype)
        return { type: "object", value: a };
      if (Object.getPrototypeOf(a) == Array.prototype) {
        const e = L(a);
        return {
          type: "object",
          subtype: "array",
          className: "Array",
          description: `Array(${a.length})`,
          objectId: e,
        };
      }
      if (void 0 !== a.value || void 0 !== a.subtype) return a;
      if (a == n)
        return {
          type: "object",
          className: "Object",
          description: "Object",
          objectId: t,
        };
      return {
        type: "object",
        className: "Object",
        description: "Object",
        objectId: L(a),
      };
    }
    function z(e, t = {}) {
      return (function (e, t) {
        if (!(e in k))
          throw new Error(`Could not find any object with id ${e}`);
        const r = k[e],
          n = Object.getOwnPropertyDescriptors(r);
        t.accessorPropertiesOnly &&
          Object.keys(n).forEach((e) => {
            void 0 === n[e].get && Reflect.deleteProperty(n, e);
          });
        const o = [];
        return (
          Object.keys(n).forEach((e) => {
            let t;
            const r = n[e];
            (t =
              "object" == typeof r.value
                ? Object.assign({ name: e }, r)
                : void 0 !== r.value
                ? {
                    name: e,
                    value: Object.assign(
                      { type: typeof r.value, description: "" + r.value },
                      r,
                    ),
                  }
                : void 0 !== r.get
                ? {
                    name: e,
                    get: {
                      className: "Function",
                      description: `get ${e} () {}`,
                      type: "function",
                    },
                  }
                : {
                    name: e,
                    value: {
                      type: "symbol",
                      value: "<Unknown>",
                      description: "<Unknown>",
                    },
                  }),
              o.push(t);
          }),
          { __value_as_json_string__: JSON.stringify(o) }
        );
      })(`dotnet:cfo_res:${e}`, t);
    }
    function L(e) {
      const t = "dotnet:cfo_res:" + N++;
      return (k[t] = e), t;
    }
    function H(e) {
      e in k && delete k[e];
    }
    function V(e, n) {
      const o = t.UTF8ToString(n);
      r.logging &&
        "function" == typeof r.logging.debugger &&
        r.logging.debugger(e, o);
    }
    let q = 0;
    function G(e) {
      const t = 1 === g.mono_wasm_load_icu_data(e);
      return t && q++, t;
    }
    function J(e) {
      return g.mono_wasm_get_icudt_name(e);
    }
    function Y() {
      const e = d.config;
      let r = !1;
      if (
        (e.globalizationMode || (e.globalizationMode = "auto"),
        "invariant" === e.globalizationMode && (r = !0),
        !r)
      )
        if (q > 0)
          d.diagnosticTracing &&
            console.debug(
              "MONO_WASM: ICU data archive(s) loaded, disabling invariant mode",
            );
        else {
          if ("icu" === e.globalizationMode) {
            const e =
              "invariant globalization mode is inactive and no ICU data archives were loaded";
            throw (t.printErr(`MONO_WASM: ERROR: ${e}`), new Error(e));
          }
          d.diagnosticTracing &&
            console.debug(
              "MONO_WASM: ICU data archive(s) not loaded, using invariant globalization mode",
            ),
            (r = !0);
        }
      r && g.mono_wasm_setenv("DOTNET_SYSTEM_GLOBALIZATION_INVARIANT", "1"),
        g.mono_wasm_setenv(
          "DOTNET_SYSTEM_GLOBALIZATION_PREDEFINED_CULTURES_ONLY",
          "1",
        );
    }
    function X(e) {
      null == e && (e = {}),
        "writeAt" in e ||
          (e.writeAt =
            "System.Runtime.InteropServices.JavaScript.JavaScriptExports::StopProfile"),
        "sendTo" in e || (e.sendTo = "Interop/Runtime::DumpAotProfileData");
      const r =
        "aot:write-at-method=" + e.writeAt + ",send-to-method=" + e.sendTo;
      t.ccall("mono_wasm_load_profiler_aot", null, ["string"], [r]);
    }
    function Z(e) {
      null == e && (e = {}),
        "writeAt" in e || (e.writeAt = "WebAssembly.Runtime::StopProfile"),
        "sendTo" in e ||
          (e.sendTo = "WebAssembly.Runtime::DumpCoverageProfileData");
      const r =
        "coverage:write-at-method=" + e.writeAt + ",send-to-method=" + e.sendTo;
      t.ccall("mono_wasm_load_profiler_coverage", null, ["string"], [r]);
    }
    const K = new Map(),
      Q = new Map();
    let ee = 0;
    function te(e) {
      if (K.has(e)) return K.get(e);
      const t = g.mono_wasm_assembly_load(e);
      return K.set(e, t), t;
    }
    function re(e, t, r) {
      ee || (ee = g.mono_wasm_get_corlib());
      let n = (function (e, t, r) {
        let n = Q.get(e);
        n || Q.set(e, (n = new Map()));
        let o = n.get(t);
        return o || ((o = new Map()), n.set(t, o)), o.get(r);
      })(ee, e, t);
      if (void 0 !== n) return n;
      if (((n = g.mono_wasm_assembly_find_class(ee, e, t)), r && !n))
        throw new Error(`Failed to find corlib class ${e}.${t}`);
      return (
        (function (e, t, r, n) {
          const o = Q.get(e);
          if (!o) throw new Error("internal error");
          const i = o.get(t);
          if (!i) throw new Error("internal error");
          i.set(r, n);
        })(ee, e, t, n),
        n
      );
    }
    const ne = new Map(),
      oe = [];
    function ie(e) {
      try {
        if (0 == ne.size) return e;
        const t = e;
        for (let r = 0; r < oe.length; r++) {
          const n = e.replace(new RegExp(oe[r], "g"), (e, ...t) => {
            const r = t.find(
              (e) => "object" == typeof e && void 0 !== e.replaceSection,
            );
            if (void 0 === r) return e;
            const n = r.funcNum,
              o = r.replaceSection,
              i = ne.get(Number(n));
            return void 0 === i ? e : e.replace(o, `${i} (${o})`);
          });
          if (n !== t) return n;
        }
        return t;
      } catch (t) {
        return console.debug(`MONO_WASM: failed to symbolicate: ${t}`), e;
      }
    }
    function ae(e) {
      let t = e;
      return t instanceof Error || (t = new Error(t)), ie(t.stack);
    }
    function se(e, n, o, i, a) {
      const s = t.UTF8ToString(o),
        c = !!i,
        _ = t.UTF8ToString(e),
        u = a,
        l = t.UTF8ToString(n),
        f = `[MONO] ${s}`;
      if (r.logging && "function" == typeof r.logging.trace)
        r.logging.trace(_, l, f, c, u);
      else
        switch (l) {
          case "critical":
          case "error":
            console.error(ae(f));
            break;
          case "warning":
            console.warn(f);
            break;
          case "message":
          default:
            console.log(f);
            break;
          case "info":
            console.info(f);
            break;
          case "debug":
            console.debug(f);
        }
    }
    let ce;
    function _e(e) {
      if (!d.mono_wasm_symbols_are_ready) {
        d.mono_wasm_symbols_are_ready = !0;
        try {
          t.FS_readFile(e, { flags: "r", encoding: "utf8" })
            .split(/[\r\n]/)
            .forEach((e) => {
              const t = e.split(/:/);
              t.length < 2 ||
                ((t[1] = t.splice(1).join(":")), ne.set(Number(t[0]), t[1]));
            });
        } catch (t) {
          return void (
            44 == t.errno ||
            console.log(
              `MONO_WASM: Error loading symbol file ${e}: ${JSON.stringify(t)}`,
            )
          );
        }
      }
    }
    async function ue(e, t) {
      try {
        const r = await le(e, t);
        return de(r), r;
      } catch (e) {
        return e instanceof d.ExitStatus ? e.status : (de(1, e), 1);
      }
    }
    async function le(e, r) {
      (function (e, r) {
        const n = r.length + 1,
          o = t._malloc(4 * n);
        let i = 0;
        t.setValue(o + 4 * i, g.mono_wasm_strdup(e), "i32"), (i += 1);
        for (let e = 0; e < r.length; ++e)
          t.setValue(o + 4 * i, g.mono_wasm_strdup(r[e]), "i32"), (i += 1);
        g.mono_wasm_set_main_args(n, o);
      })(e, r),
        -1 == d.waitForDebugger &&
          (console.log("MONO_WASM: waiting for debugger..."),
          await new Promise((e) => {
            const t = setInterval(() => {
              1 == d.waitForDebugger && (clearInterval(t), e());
            }, 100);
          }));
      const n = fe(e);
      return d.javaScriptExports.call_entry_point(n, r);
    }
    function fe(e) {
      if (!d.mono_wasm_bindings_is_ready)
        throw new Error("Assert failed: The runtime must be initialized.");
      const t = te(e);
      if (!t) throw new Error("Could not find assembly: " + e);
      let r = 0;
      1 == d.waitForDebugger && (r = 1);
      const n = g.mono_wasm_assembly_get_entry_point(t, r);
      if (!n) throw new Error("Could not find entry point for assembly: " + e);
      return n;
    }
    function me(e) {
      Da(e, !1), de(1, e);
    }
    function de(e, t) {
      if (d.config.asyncFlushOnExit && 0 === e)
        throw (
          ((async () => {
            try {
              await (async function () {
                try {
                  const e = await import("process"),
                    t = (e) =>
                      new Promise((t, r) => {
                        e.on("error", (e) => r(e)),
                          e.write("", function () {
                            t();
                          });
                      }),
                    r = t(e.stderr),
                    n = t(e.stdout);
                  await Promise.all([n, r]);
                } catch (e) {
                  console.error(`flushing std* streams failed: ${e}`);
                }
              })();
            } finally {
              he(e, t);
            }
          })(),
          d.ExitStatus
            ? new d.ExitStatus(e)
            : t || new Error("Stop with exit code " + e))
        );
      he(e, t);
    }
    function he(e, n) {
      if (
        (d.ExitStatus &&
          (!n || n instanceof d.ExitStatus
            ? (n = new d.ExitStatus(e))
            : n instanceof Error
            ? t.printErr(r.mono_wasm_stringify_as_error_with_stack(n))
            : "string" == typeof n
            ? t.printErr(n)
            : t.printErr(JSON.stringify(n))),
        (function (e, t) {
          if (d.config.logExitCode)
            if (
              (0 != e &&
                t &&
                (t instanceof Error
                  ? console.error(ae(t))
                  : "string" == typeof t
                  ? console.error(t)
                  : console.error(JSON.stringify(t))),
              ce)
            ) {
              const t = () => {
                0 == ce.bufferedAmount
                  ? console.log("WASM EXIT " + e)
                  : setTimeout(t, 100);
              };
              t();
            } else console.log("WASM EXIT " + e);
        })(e, n),
        (function (e) {
          if (a && d.config.appendElementOnExit) {
            const t = document.createElement("label");
            (t.id = "tests_done"),
              e && (t.style.background = "red"),
              (t.innerHTML = e.toString()),
              document.body.appendChild(t);
          }
        })(e),
        0 !== e || !a)
      ) {
        if (!d.quit) throw n;
        d.quit(e, n);
      }
    }
    oe.push(
      /at (?<replaceSection>[^:()]+:wasm-function\[(?<funcNum>\d+)\]:0x[a-fA-F\d]+)((?![^)a-fA-F\d])|$)/,
    ),
      oe.push(
        /(?:WASM \[[\da-zA-Z]+\], (?<replaceSection>function #(?<funcNum>[\d]+) \(''\)))/,
      ),
      oe.push(
        /(?<replaceSection>[a-z]+:\/\/[^ )]*:wasm-function\[(?<funcNum>\d+)\]:0x[a-fA-F\d]+)/,
      ),
      oe.push(
        /(?<replaceSection><[^ >]+>[.:]wasm-function\[(?<funcNum>[0-9]+)\])/,
      );
    const pe = "function" == typeof globalThis.WeakRef;
    function we(e) {
      return pe ? new WeakRef(e) : { deref: () => e };
    }
    const ge = "function" == typeof globalThis.FinalizationRegistry;
    let ye;
    const be = [],
      ve = [];
    let Ee = 1;
    const Se = new Map();
    ge &&
      (ye = new globalThis.FinalizationRegistry(function (e) {
        Te(null, e);
      }));
    const Ae = Symbol.for("wasm js_owned_gc_handle"),
      ke = Symbol.for("wasm cs_owned_js_handle");
    function Ne(e) {
      return 0 !== e && -1 !== e ? be[e] : null;
    }
    function Oe(e) {
      if (e[ke]) return e[ke];
      const t = ve.length ? ve.pop() : Ee++;
      return (be[t] = e), Object.isExtensible(e) && (e[ke] = t), t;
    }
    function xe(e) {
      const t = be[e];
      if (null != t) {
        if (globalThis === t) return;
        void 0 !== t[ke] && (t[ke] = void 0), (be[e] = void 0), ve.push(e);
      }
    }
    function je(e, t) {
      (e[Ae] = t), ge && ye.register(e, t, e);
      const r = we(e);
      Se.set(t, r);
    }
    function Te(e, t) {
      e && ((t = e[Ae]), (e[Ae] = 0), ge && ye.unregister(e)),
        0 !== t &&
          Se.delete(t) &&
          d.javaScriptExports.release_js_owned_object_by_gc_handle(t);
    }
    function De(e) {
      const t = e[Ae];
      if (0 == t) throw new Error("Assert failed: ObjectDisposedException");
      return t;
    }
    function Me(e) {
      if (!e) return null;
      const t = Se.get(e);
      return t ? t.deref() : null;
    }
    const Re = Symbol.for("wasm promise_control");
    function Pe(e, t) {
      let r = null;
      const n = new Promise(function (n, o) {
        r = {
          isDone: !1,
          promise: null,
          resolve: (t) => {
            r.isDone || ((r.isDone = !0), n(t), e && e());
          },
          reject: (e) => {
            r.isDone || ((r.isDone = !0), o(e), t && t());
          },
        };
      });
      r.promise = n;
      const o = n;
      return (o[Re] = r), { promise: o, promise_control: r };
    }
    function Ce(e) {
      return e[Re];
    }
    function Ie(e) {
      if (
        !(function (e) {
          return void 0 !== e[Re];
        })(e)
      )
        throw new Error("Assert failed: Promise is not controllable");
    }
    const Fe =
      ("object" == typeof Promise || "function" == typeof Promise) &&
      "function" == typeof Promise.resolve;
    function $e(e) {
      return (
        Promise.resolve(e) === e ||
        (("object" == typeof e || "function" == typeof e) &&
          "function" == typeof e.then)
      );
    }
    function Ue(e) {
      const { promise: t, promise_control: r } = Pe();
      return (
        e()
          .then((e) => r.resolve(e))
          .catch((e) => r.reject(e)),
        t
      );
    }
    function Be(e) {
      const t = Me(e);
      if (!t) return;
      const r = t.promise;
      if (!r)
        throw new Error(`Assert failed: Expected Promise for GCHandle ${e}`);
      Ie(r);
      Ce(r).reject("OperationCanceledException");
    }
    const We = [];
    let ze,
      Le,
      He = null;
    const Ve =
      "undefined" != typeof BigInt && "undefined" != typeof BigInt64Array;
    function qe() {
      ze || ((ze = t._malloc(32768)), (Le = ze)), We.push(Le);
    }
    function Ge(e, t, r) {
      if (!Number.isSafeInteger(e))
        throw new Error(
          `Assert failed: Value is not an integer: ${e} (${typeof e})`,
        );
      if (!(e >= t && e <= r))
        throw new Error(
          `Assert failed: Overflow: value ${e} is out of ${t} ${r} range`,
        );
    }
    function Je(e, r) {
      t.HEAP8.fill(0, e, r + e);
    }
    function Ye(e, r) {
      const n = !!r;
      "number" == typeof r && Ge(r, 0, 1), (t.HEAP32[e >>> 2] = n ? 1 : 0);
    }
    function Xe(e, r) {
      Ge(r, 0, 255), (t.HEAPU8[e] = r);
    }
    function Ze(e, r) {
      Ge(r, 0, 65535), (t.HEAPU16[e >>> 1] = r);
    }
    function Ke(e, r) {
      t.HEAPU32[e >>> 2] = r;
    }
    function Qe(e, r) {
      Ge(r, 0, 4294967295), (t.HEAPU32[e >>> 2] = r);
    }
    function et(e, r) {
      Ge(r, -128, 127), (t.HEAP8[e] = r);
    }
    function tt(e, r) {
      Ge(r, -32768, 32767), (t.HEAP16[e >>> 1] = r);
    }
    function rt(e, r) {
      t.HEAP32[e >>> 2] = r;
    }
    function nt(e, r) {
      Ge(r, -2147483648, 2147483647), (t.HEAP32[e >>> 2] = r);
    }
    function ot(e) {
      if (0 !== e)
        switch (e) {
          case 1:
            throw new Error("value was not an integer");
          case 2:
            throw new Error("value out of range");
          default:
            throw new Error("unknown internal error");
        }
    }
    function it(e, t) {
      if (!Number.isSafeInteger(t))
        throw new Error(
          `Assert failed: Value is not a safe integer: ${t} (${typeof t})`,
        );
      ot(g.mono_wasm_f64_to_i52(e, t));
    }
    function at(e, t) {
      if (!Number.isSafeInteger(t))
        throw new Error(
          `Assert failed: Value is not a safe integer: ${t} (${typeof t})`,
        );
      if (!(t >= 0))
        throw new Error(
          "Assert failed: Can't convert negative Number into UInt64",
        );
      ot(g.mono_wasm_f64_to_u52(e, t));
    }
    function st(e, t) {
      if (!Ve) throw new Error("Assert failed: BigInt is not supported.");
      if ("bigint" != typeof t)
        throw new Error(
          `Assert failed: Value is not an bigint: ${t} (${typeof t})`,
        );
      if (!(t >= St && t <= Et))
        throw new Error(
          `Assert failed: Overflow: value ${t} is out of ${St} ${Et} range`,
        );
      He[e >>> 3] = t;
    }
    function ct(e, r) {
      if ("number" != typeof r)
        throw new Error(
          `Assert failed: Value is not a Number: ${r} (${typeof r})`,
        );
      t.HEAPF32[e >>> 2] = r;
    }
    function _t(e, r) {
      if ("number" != typeof r)
        throw new Error(
          `Assert failed: Value is not a Number: ${r} (${typeof r})`,
        );
      t.HEAPF64[e >>> 3] = r;
    }
    function ut(e) {
      return !!t.HEAP32[e >>> 2];
    }
    function lt(e) {
      return t.HEAPU8[e];
    }
    function ft(e) {
      return t.HEAPU16[e >>> 1];
    }
    function mt(e) {
      return t.HEAPU32[e >>> 2];
    }
    function dt(e) {
      return t.HEAP8[e];
    }
    function ht(e) {
      return t.HEAP16[e >>> 1];
    }
    function pt(e) {
      return t.HEAP32[e >>> 2];
    }
    function wt(e) {
      const t = g.mono_wasm_i52_to_f64(e, d._i52_error_scratch_buffer);
      return ot(pt(d._i52_error_scratch_buffer)), t;
    }
    function gt(e) {
      const t = g.mono_wasm_u52_to_f64(e, d._i52_error_scratch_buffer);
      return ot(pt(d._i52_error_scratch_buffer)), t;
    }
    function yt(e) {
      if (!Ve) throw new Error("Assert failed: BigInt is not supported.");
      return He[e >>> 3];
    }
    function bt(e) {
      return t.HEAPF32[e >>> 2];
    }
    function vt(e) {
      return t.HEAPF64[e >>> 3];
    }
    let Et, St;
    function At(e) {
      const r = t._malloc(e.length);
      return new Uint8Array(t.HEAPU8.buffer, r, e.length).set(e), r;
    }
    const kt = 8192;
    let Nt = null,
      Ot = null,
      xt = 0;
    const jt = [],
      Tt = [];
    function Dt(e, r) {
      if (e <= 0) throw new Error("capacity >= 1");
      const n = 4 * (e |= 0),
        o = t._malloc(n);
      if (o % 4 != 0) throw new Error("Malloc returned an unaligned offset");
      return Je(o, n), new Ct(o, e, !0, r);
    }
    function Mt(e) {
      let t;
      if (!e) throw new Error("address must be a location in the native heap");
      return (
        Tt.length > 0 ? ((t = Tt.pop()), t._set_address(e)) : (t = new Ft(e)), t
      );
    }
    function Rt(e) {
      let t;
      if (jt.length > 0) t = jt.pop();
      else {
        const e = (function () {
          if (p(Nt) || !Ot) {
            (Nt = Dt(kt, "js roots")), (Ot = new Int32Array(kt)), (xt = kt);
            for (let e = 0; e < kt; e++) Ot[e] = kt - e - 1;
          }
          if (xt < 1) throw new Error("Out of scratch root space");
          const e = Ot[xt - 1];
          return xt--, e;
        })();
        t = new It(Nt, e);
      }
      if (void 0 !== e) {
        if ("number" != typeof e)
          throw new Error("value must be an address in the managed heap");
        t.set(e);
      } else t.set(0);
      return t;
    }
    function Pt(...e) {
      for (let t = 0; t < e.length; t++) p(e[t]) || e[t].release();
    }
    class Ct {
      constructor(e, t, r, n) {
        const o = 4 * t;
        (this.__offset = e),
          (this.__offset32 = e >>> 2),
          (this.__count = t),
          (this.length = t),
          (this.__handle = g.mono_wasm_register_root(e, o, n || "noname")),
          (this.__ownsAllocation = r);
      }
      _throw_index_out_of_range() {
        throw new Error("index out of range");
      }
      _check_in_range(e) {
        (e >= this.__count || e < 0) && this._throw_index_out_of_range();
      }
      get_address(e) {
        return this._check_in_range(e), this.__offset + 4 * e;
      }
      get_address_32(e) {
        return this._check_in_range(e), this.__offset32 + e;
      }
      get(e) {
        this._check_in_range(e);
        const r = this.get_address_32(e);
        return t.HEAPU32[r];
      }
      set(e, t) {
        const r = this.get_address(e);
        return g.mono_wasm_write_managed_pointer_unsafe(r, t), t;
      }
      copy_value_from_address(e, t) {
        const r = this.get_address(e);
        g.mono_wasm_copy_managed_pointer(r, t);
      }
      _unsafe_get(e) {
        return t.HEAPU32[this.__offset32 + e];
      }
      _unsafe_set(e, t) {
        const r = this.__offset + e;
        g.mono_wasm_write_managed_pointer_unsafe(r, t);
      }
      clear() {
        this.__offset && Je(this.__offset, 4 * this.__count);
      }
      release() {
        this.__offset &&
          this.__ownsAllocation &&
          (g.mono_wasm_deregister_root(this.__offset),
          Je(this.__offset, 4 * this.__count),
          t._free(this.__offset)),
          (this.__handle = this.__offset = this.__count = this.__offset32 = 0);
      }
      toString() {
        return `[root buffer @${this.get_address(0)}, size ${this.__count} ]`;
      }
    }
    class It {
      constructor(e, t) {
        (this.__buffer = e), (this.__index = t);
      }
      get_address() {
        return this.__buffer.get_address(this.__index);
      }
      get_address_32() {
        return this.__buffer.get_address_32(this.__index);
      }
      get address() {
        return this.__buffer.get_address(this.__index);
      }
      get() {
        return this.__buffer._unsafe_get(this.__index);
      }
      set(e) {
        const t = this.__buffer.get_address(this.__index);
        return g.mono_wasm_write_managed_pointer_unsafe(t, e), e;
      }
      copy_from(e) {
        const t = e.address,
          r = this.address;
        g.mono_wasm_copy_managed_pointer(r, t);
      }
      copy_to(e) {
        const t = this.address,
          r = e.address;
        g.mono_wasm_copy_managed_pointer(r, t);
      }
      copy_from_address(e) {
        const t = this.address;
        g.mono_wasm_copy_managed_pointer(t, e);
      }
      copy_to_address(e) {
        const t = this.address;
        g.mono_wasm_copy_managed_pointer(e, t);
      }
      get value() {
        return this.get();
      }
      set value(e) {
        this.set(e);
      }
      valueOf() {
        throw new Error(
          "Implicit conversion of roots to pointers is no longer supported. Use .value or .address as appropriate",
        );
      }
      clear() {
        this.set(0);
      }
      release() {
        if (!this.__buffer) throw new Error("No buffer");
        jt.length > 128
          ? ((function (e) {
              void 0 !== e && (Nt.set(e, 0), (Ot[xt] = e), xt++);
            })(this.__index),
            (this.__buffer = null),
            (this.__index = 0))
          : (this.set(0), jt.push(this));
      }
      toString() {
        return `[root @${this.address}]`;
      }
    }
    class Ft {
      constructor(e) {
        (this.__external_address = 0),
          (this.__external_address_32 = 0),
          this._set_address(e);
      }
      _set_address(e) {
        (this.__external_address = e), (this.__external_address_32 = e >>> 2);
      }
      get address() {
        return this.__external_address;
      }
      get_address() {
        return this.__external_address;
      }
      get_address_32() {
        return this.__external_address_32;
      }
      get() {
        return t.HEAPU32[this.__external_address_32];
      }
      set(e) {
        return (
          g.mono_wasm_write_managed_pointer_unsafe(this.__external_address, e),
          e
        );
      }
      copy_from(e) {
        const t = e.address,
          r = this.__external_address;
        g.mono_wasm_copy_managed_pointer(r, t);
      }
      copy_to(e) {
        const t = this.__external_address,
          r = e.address;
        g.mono_wasm_copy_managed_pointer(r, t);
      }
      copy_from_address(e) {
        const t = this.__external_address;
        g.mono_wasm_copy_managed_pointer(t, e);
      }
      copy_to_address(e) {
        const t = this.__external_address;
        g.mono_wasm_copy_managed_pointer(e, t);
      }
      get value() {
        return this.get();
      }
      set value(e) {
        this.set(e);
      }
      valueOf() {
        throw new Error(
          "Implicit conversion of roots to pointers is no longer supported. Use .value or .address as appropriate",
        );
      }
      clear() {
        this.set(0);
      }
      release() {
        Tt.length < 128 && Tt.push(this);
      }
      toString() {
        return `[external root @${this.address}]`;
      }
    }
    const $t = new Map(),
      Ut = new Map(),
      Bt = Symbol.for("wasm bound_cs_function"),
      Wt = Symbol.for("wasm bound_js_function"),
      zt = 16;
    function Lt(e) {
      const r = t.stackAlloc(zt * e);
      if (!r || r % 8 != 0) throw new Error("Assert failed: Arg alignment");
      er(Ht(r, 0), yr.None);
      return er(Ht(r, 1), yr.None), r;
    }
    function Ht(e, t) {
      if (!e) throw new Error("Assert failed: Null args");
      return e + t * zt;
    }
    function Vt(e, t) {
      if (!e) throw new Error("Assert failed: Null signatures");
      return e + 32 * t + 8;
    }
    function qt(e) {
      if (!e) throw new Error("Assert failed: Null sig");
      return mt(e);
    }
    function Gt(e) {
      if (!e) throw new Error("Assert failed: Null sig");
      return mt(e + 16);
    }
    function Jt(e) {
      if (!e) throw new Error("Assert failed: Null sig");
      return mt(e + 20);
    }
    function Yt(e) {
      if (!e) throw new Error("Assert failed: Null sig");
      return mt(e + 24);
    }
    function Xt(e) {
      if (!e) throw new Error("Assert failed: Null sig");
      return mt(e + 28);
    }
    function Zt(e) {
      if (!e) throw new Error("Assert failed: Null signatures");
      return pt(e + 4);
    }
    function Kt(e) {
      if (!e) throw new Error("Assert failed: Null signatures");
      return pt(e);
    }
    function Qt(e) {
      if (!e) throw new Error("Assert failed: Null arg");
      return mt(e + 12);
    }
    function er(e, t) {
      if (!e) throw new Error("Assert failed: Null arg");
      Qe(e + 12, t);
    }
    function tr(e) {
      if (!e) throw new Error("Assert failed: Null arg");
      return mt(e);
    }
    function rr(e, t) {
      if (!e) throw new Error("Assert failed: Null arg");
      if ("boolean" != typeof t)
        throw new Error(
          `Assert failed: Value is not a Boolean: ${t} (${typeof t})`,
        );
      Xe(e, t ? 1 : 0);
    }
    function nr(e, t) {
      if (!e) throw new Error("Assert failed: Null arg");
      Qe(e, t);
    }
    function or(e, t) {
      if (!e) throw new Error("Assert failed: Null arg");
      _t(e, t.getTime());
    }
    function ir(e, t) {
      if (!e) throw new Error("Assert failed: Null arg");
      _t(e, t);
    }
    function ar(e) {
      if (!e) throw new Error("Assert failed: Null arg");
      return mt(e + 4);
    }
    function sr(e, t) {
      if (!e) throw new Error("Assert failed: Null arg");
      Qe(e + 4, t);
    }
    function cr(e) {
      if (!e) throw new Error("Assert failed: Null arg");
      return mt(e + 4);
    }
    function _r(e, t) {
      if (!e) throw new Error("Assert failed: Null arg");
      Qe(e + 4, t);
    }
    function ur(e) {
      if (!e) throw new Error("Assert failed: Null arg");
      return Mt(e);
    }
    function lr(e) {
      if (!e) throw new Error("Assert failed: Null arg");
      return pt(e + 8);
    }
    function fr(e, t) {
      if (!e) throw new Error("Assert failed: Null arg");
      nt(e + 8, t);
    }
    class mr {
      dispose() {
        Te(this, 0);
      }
      get isDisposed() {
        return 0 === this[Ae];
      }
      toString() {
        return `CsObject(gc_handle: ${this[Ae]})`;
      }
    }
    class dr extends Error {
      constructor(e) {
        super(e),
          (this.superStack = Object.getOwnPropertyDescriptor(this, "stack")),
          Object.defineProperty(this, "stack", { get: this.getManageStack });
      }
      getSuperStack() {
        return this.superStack ? this.superStack.value : super.stack;
      }
      getManageStack() {
        const e = this[Ae];
        if (e) {
          const t = d.javaScriptExports.get_managed_stack_trace(e);
          if (t) return t + "\n" + this.getSuperStack();
        }
        return this.getSuperStack();
      }
      dispose() {
        Te(this, 0);
      }
      get isDisposed() {
        return 0 === this[Ae];
      }
    }
    function hr(e) {
      return e == yr.Byte
        ? 1
        : e == yr.Int32
        ? 4
        : e == yr.Int52 || e == yr.Double
        ? 8
        : e == yr.String || e == yr.Object || e == yr.JSObject
        ? zt
        : -1;
    }
    class pr {
      constructor(e, t, r) {
        (this._pointer = e), (this._length = t), (this._viewType = r);
      }
      _unsafe_create_view() {
        const e =
          0 == this._viewType
            ? new Uint8Array(t.HEAPU8.buffer, this._pointer, this._length)
            : 1 == this._viewType
            ? new Int32Array(t.HEAP32.buffer, this._pointer, this._length)
            : 2 == this._viewType
            ? new Float64Array(t.HEAPF64.buffer, this._pointer, this._length)
            : null;
        if (!e) throw new Error("NotImplementedException");
        return e;
      }
      set(e, t) {
        if (this.isDisposed)
          throw new Error("Assert failed: ObjectDisposedException");
        const r = this._unsafe_create_view();
        if (!e || !r || e.constructor !== r.constructor)
          throw new Error(`Assert failed: Expected ${r.constructor}`);
        r.set(e, t);
      }
      copyTo(e, t) {
        if (this.isDisposed)
          throw new Error("Assert failed: ObjectDisposedException");
        const r = this._unsafe_create_view();
        if (!e || !r || e.constructor !== r.constructor)
          throw new Error(`Assert failed: Expected ${r.constructor}`);
        const n = r.subarray(t);
        e.set(n);
      }
      slice(e, t) {
        if (this.isDisposed)
          throw new Error("Assert failed: ObjectDisposedException");
        return this._unsafe_create_view().slice(e, t);
      }
      get length() {
        if (this.isDisposed)
          throw new Error("Assert failed: ObjectDisposedException");
        return this._length;
      }
      get byteLength() {
        if (this.isDisposed)
          throw new Error("Assert failed: ObjectDisposedException");
        return 0 == this._viewType
          ? this._length
          : 1 == this._viewType
          ? this._length << 2
          : 2 == this._viewType
          ? this._length << 3
          : 0;
      }
    }
    class wr extends pr {
      constructor(e, t, r) {
        super(e, t, r), (this.is_disposed = !1);
      }
      dispose() {
        this.is_disposed = !0;
      }
      get isDisposed() {
        return this.is_disposed;
      }
    }
    class gr extends pr {
      constructor(e, t, r) {
        super(e, t, r);
      }
      dispose() {
        Te(this, 0);
      }
      get isDisposed() {
        return 0 === this[Ae];
      }
    }
    var yr;
    !(function (e) {
      (e[(e.None = 0)] = "None"),
        (e[(e.Void = 1)] = "Void"),
        (e[(e.Discard = 2)] = "Discard"),
        (e[(e.Boolean = 3)] = "Boolean"),
        (e[(e.Byte = 4)] = "Byte"),
        (e[(e.Char = 5)] = "Char"),
        (e[(e.Int16 = 6)] = "Int16"),
        (e[(e.Int32 = 7)] = "Int32"),
        (e[(e.Int52 = 8)] = "Int52"),
        (e[(e.BigInt64 = 9)] = "BigInt64"),
        (e[(e.Double = 10)] = "Double"),
        (e[(e.Single = 11)] = "Single"),
        (e[(e.IntPtr = 12)] = "IntPtr"),
        (e[(e.JSObject = 13)] = "JSObject"),
        (e[(e.Object = 14)] = "Object"),
        (e[(e.String = 15)] = "String"),
        (e[(e.Exception = 16)] = "Exception"),
        (e[(e.DateTime = 17)] = "DateTime"),
        (e[(e.DateTimeOffset = 18)] = "DateTimeOffset"),
        (e[(e.Nullable = 19)] = "Nullable"),
        (e[(e.Task = 20)] = "Task"),
        (e[(e.Array = 21)] = "Array"),
        (e[(e.ArraySegment = 22)] = "ArraySegment"),
        (e[(e.Span = 23)] = "Span"),
        (e[(e.Action = 24)] = "Action"),
        (e[(e.Function = 25)] = "Function"),
        (e[(e.JSException = 26)] = "JSException");
    })(yr || (yr = {}));
    const br = new Map(),
      vr = new Map();
    let Er = 0,
      Sr = null,
      Ar = 0;
    const kr = new (class {
        init_fields() {
          this.mono_wasm_string_decoder_buffer ||
            ((this.mono_text_decoder =
              "undefined" != typeof TextDecoder
                ? new TextDecoder("utf-16le")
                : null),
            (this.mono_wasm_string_root = Rt()),
            (this.mono_wasm_string_decoder_buffer = t._malloc(12)));
        }
        copy(e) {
          if ((this.init_fields(), 0 === e)) return null;
          this.mono_wasm_string_root.value = e;
          const t = this.copy_root(this.mono_wasm_string_root);
          return (this.mono_wasm_string_root.value = 0), t;
        }
        copy_root(e) {
          if ((this.init_fields(), 0 === e.value)) return null;
          const t = this.mono_wasm_string_decoder_buffer + 0,
            r = this.mono_wasm_string_decoder_buffer + 4,
            n = this.mono_wasm_string_decoder_buffer + 8;
          let o;
          g.mono_wasm_string_get_data_ref(e.address, t, r, n);
          const i = pt(r),
            a = mt(t),
            s = pt(n);
          if (
            (s && (o = br.get(e.value)),
            void 0 === o &&
              (i && a
                ? ((o = this.decode(a, a + i)), s && br.set(e.value, o))
                : (o = Nr)),
            void 0 === o)
          )
            throw new Error(
              `internal error when decoding string at location ${e.value}`,
            );
          return o;
        }
        decode(e, r) {
          let n = "";
          if (this.mono_text_decoder) {
            const o =
              "undefined" != typeof SharedArrayBuffer &&
              t.HEAPU8.buffer instanceof SharedArrayBuffer
                ? t.HEAPU8.slice(e, r)
                : t.HEAPU8.subarray(e, r);
            n = this.mono_text_decoder.decode(o);
          } else
            for (let o = 0; o < r - e; o += 2) {
              const r = t.getValue(e + o, "i16");
              n += String.fromCharCode(r);
            }
          return n;
        }
      })(),
      Nr = "";
    function Or(e) {
      return kr.copy(e);
    }
    function xr(e) {
      return kr.copy_root(e);
    }
    function jr(e) {
      if (0 === e.length) return Nr;
      const t = (function (e) {
          const t = Rt();
          try {
            return Tr(e, t), t.value;
          } finally {
            t.release();
          }
        })(e),
        r = br.get(t);
      if (p(r))
        throw new Error(
          "internal error: interned_string_table did not contain string after js_string_to_mono_string_interned",
        );
      return r;
    }
    function Tr(e, t) {
      let r;
      if (
        ("symbol" == typeof e
          ? ((r = e.description),
            "string" != typeof r && (r = Symbol.keyFor(e)),
            "string" != typeof r && (r = "<unknown Symbol>"))
          : "string" == typeof e && (r = e),
        "string" != typeof r)
      )
        throw new Error(
          `Argument to js_string_to_mono_string_interned must be a string but was ${e}`,
        );
      if (0 === r.length && Er) return void t.set(Er);
      const n = vr.get(r);
      n
        ? t.set(n)
        : (Mr(r, t),
          (function (e, t, r) {
            if (!t.value)
              throw new Error(
                "null pointer passed to _store_string_in_intern_table",
              );
            Ar >= 8192 && (Sr = null),
              Sr || ((Sr = Dt(8192, "interned strings")), (Ar = 0));
            const n = Sr,
              o = Ar++;
            if (r && (g.mono_wasm_intern_string_ref(t.address), !t.value))
              throw new Error(
                "mono_wasm_intern_string_ref produced a null pointer",
              );
            vr.set(e, t.value),
              br.set(t.value, e),
              0 !== e.length || Er || (Er = t.value),
              n.copy_value_from_address(o, t.address);
          })(r, t, !0));
    }
    function Dr(e, t) {
      if ((t.clear(), null !== e))
        if ("symbol" == typeof e) Tr(e, t);
        else {
          if ("string" != typeof e)
            throw new Error("Expected string argument, got " + typeof e);
          if (0 === e.length) Tr(e, t);
          else {
            if (e.length <= 256) {
              const r = vr.get(e);
              if (r) return void t.set(r);
            }
            Mr(e, t);
          }
        }
    }
    function Mr(e, r) {
      const n = t._malloc(2 * (e.length + 1)),
        o = (n >>> 1) | 0;
      for (let r = 0; r < e.length; r++) t.HEAP16[o + r] = e.charCodeAt(r);
      (t.HEAP16[o + e.length] = 0),
        g.mono_wasm_string_from_utf16_ref(n, e.length, r.address),
        t._free(n);
    }
    function Rr(e) {
      const t = Rt();
      try {
        return Dr(e, t), t.value;
      } finally {
        t.release();
      }
    }
    function Pr(e, t, r, n, o, i) {
      let a = "",
        s = "",
        c = "";
      const _ = "converter" + t;
      let u = "null",
        l = "null",
        f = "null",
        m = "null",
        d = qt(e);
      if (d === yr.None || d === yr.Void)
        return { converters: a, call_body: c, marshaler_type: d };
      const h = Gt(e);
      if (h !== yr.None) {
        const e = Ut.get(h);
        if (!e || "function" != typeof e)
          throw new Error(
            `Assert failed: Unknow converter for type ${h} at ${t}`,
          );
        d != yr.Nullable
          ? ((m = "converter" + t + "_res"),
            (a += ", " + m),
            (s += " " + yr[h]),
            (i[m] = e))
          : (d = h);
      }
      const p = Jt(e);
      if (p !== yr.None) {
        const e = $t.get(p);
        if (!e || "function" != typeof e)
          throw new Error(
            `Assert failed: Unknow converter for type ${p} at ${t}`,
          );
        (u = "converter" + t + "_arg1"),
          (a += ", " + u),
          (s += " " + yr[p]),
          (i[u] = e);
      }
      const w = Yt(e);
      if (w !== yr.None) {
        const e = $t.get(w);
        if (!e || "function" != typeof e)
          throw new Error(
            `Assert failed: Unknow converter for type ${w} at ${t}`,
          );
        (l = "converter" + t + "_arg2"),
          (a += ", " + l),
          (s += " " + yr[w]),
          (i[l] = e);
      }
      const g = Xt(e);
      if (g !== yr.None) {
        const e = $t.get(g);
        if (!e || "function" != typeof e)
          throw new Error(
            `Assert failed: Unknow converter for type ${g} at ${t}`,
          );
        (f = "converter" + t + "_arg3"),
          (a += ", " + f),
          (s += " " + yr[g]),
          (i[f] = e);
      }
      const y = Ut.get(d),
        b = yr[d];
      if (!y || "function" != typeof y)
        throw new Error(
          `Assert failed: Unknow converter for type ${b} (${d}) at ${t} `,
        );
      return (
        (a += ", " + _),
        (s += " " + b),
        (i[_] = y),
        (c =
          d == yr.Task
            ? `  ${_}(args + ${r}, ${o}, signature + ${n}, ${m}); // ${s} \n`
            : d == yr.Action || d == yr.Function
            ? `  ${_}(args + ${r}, ${o}, signature + ${n}, ${m}, ${u}, ${l}, ${l}); // ${s} \n`
            : `  ${_}(args + ${r}, ${o}, signature + ${n}); // ${s} \n`),
        { converters: a, call_body: c, marshaler_type: d }
      );
    }
    function Cr(e, t) {
      null == t ? er(e, yr.None) : (er(e, yr.Boolean), rr(e, t));
    }
    function Ir(e, t) {
      null == t
        ? er(e, yr.None)
        : (er(e, yr.Byte),
          (function (e, t) {
            if (!e) throw new Error("Assert failed: Null arg");
            Xe(e, t);
          })(e, t));
    }
    function Fr(e, t) {
      null == t
        ? er(e, yr.None)
        : (er(e, yr.Char),
          (function (e, t) {
            if (!e) throw new Error("Assert failed: Null arg");
            Ze(e, t);
          })(e, t));
    }
    function $r(e, t) {
      null == t
        ? er(e, yr.None)
        : (er(e, yr.Int16),
          (function (e, t) {
            if (!e) throw new Error("Assert failed: Null arg");
            tt(e, t);
          })(e, t));
    }
    function Ur(e, t) {
      null == t
        ? er(e, yr.None)
        : (er(e, yr.Int32),
          (function (e, t) {
            if (!e) throw new Error("Assert failed: Null arg");
            nt(e, t);
          })(e, t));
    }
    function Br(e, t) {
      null == t
        ? er(e, yr.None)
        : (er(e, yr.Int52),
          (function (e, t) {
            if (!e) throw new Error("Assert failed: Null arg");
            if (!Number.isSafeInteger(t))
              throw new Error(
                `Assert failed: Value is not an integer: ${t} (${typeof t})`,
              );
            _t(e, t);
          })(e, t));
    }
    function Wr(e, t) {
      null == t
        ? er(e, yr.None)
        : (er(e, yr.BigInt64),
          (function (e, t) {
            if (!e) throw new Error("Assert failed: Null arg");
            st(e, t);
          })(e, t));
    }
    function zr(e, t) {
      null == t ? er(e, yr.None) : (er(e, yr.Double), ir(e, t));
    }
    function Lr(e, t) {
      null == t
        ? er(e, yr.None)
        : (er(e, yr.Single),
          (function (e, t) {
            if (!e) throw new Error("Assert failed: Null arg");
            ct(e, t);
          })(e, t));
    }
    function Hr(e, t) {
      null == t ? er(e, yr.None) : (er(e, yr.IntPtr), nr(e, t));
    }
    function Vr(e, t) {
      if (null == t) er(e, yr.None);
      else {
        if (!(t instanceof Date))
          throw new Error("Assert failed: Value is not a Date");
        er(e, yr.DateTime), or(e, t);
      }
    }
    function qr(e, t) {
      if (null == t) er(e, yr.None);
      else {
        if (!(t instanceof Date))
          throw new Error("Assert failed: Value is not a Date");
        er(e, yr.DateTimeOffset), or(e, t);
      }
    }
    function Gr(e, t) {
      if (null == t) er(e, yr.None);
      else {
        if ((er(e, yr.String), "string" != typeof t))
          throw new Error("Assert failed: Value is not a String");
        Jr(e, t);
      }
    }
    function Jr(e, t) {
      const r = ur(e);
      try {
        Dr(t, r);
      } finally {
        r.release();
      }
    }
    function Yr(e) {
      er(e, yr.None);
    }
    function Xr(e, t, r, n, o, i, a) {
      if (null == t) return void er(e, yr.None);
      if (!(t && t instanceof Function))
        throw new Error("Assert failed: Value is not a Function");
      const s = (e) => {
        const r = Ht(e, 0),
          s = Ht(e, 1),
          c = Ht(e, 2),
          _ = Ht(e, 3),
          u = Ht(e, 4);
        try {
          let e, r, l;
          o && (e = o(c)), i && (r = i(_)), a && (l = a(u));
          const f = t(e, r, l);
          n && n(s, f);
        } catch (e) {
          Qr(r, e);
        }
      };
      s[Wt] = !0;
      sr(e, Oe(s)), er(e, yr.Function);
    }
    class Zr {
      constructor(e) {
        this.promise = e;
      }
      dispose() {
        Te(this, 0);
      }
      get isDisposed() {
        return 0 === this[Ae];
      }
    }
    function Kr(e, t, r, n) {
      if (null == t) return void er(e, yr.None);
      if (!$e(t)) throw new Error("Assert failed: Value is not a Promise");
      const o = d.javaScriptExports.create_task_callback();
      _r(e, o), er(e, yr.Task);
      const i = new Zr(t);
      je(i, o),
        t
          .then((e) => {
            d.javaScriptExports.complete_task(o, null, e, n || tn), Te(i, o);
          })
          .catch((e) => {
            d.javaScriptExports.complete_task(o, e, null, void 0), Te(i, o);
          });
    }
    function Qr(e, t) {
      if (null == t) er(e, yr.None);
      else if (t instanceof dr) {
        er(e, yr.Exception);
        _r(e, De(t));
      } else {
        if ("object" != typeof t && "string" != typeof t)
          throw new Error("Assert failed: Value is not an Error " + typeof t);
        er(e, yr.JSException);
        Jr(e, t.toString());
        const r = t[ke];
        if (r) sr(e, r);
        else {
          sr(e, Oe(t));
        }
      }
    }
    function en(e, t) {
      if (null == t) er(e, yr.None);
      else {
        if (void 0 !== t[Ae])
          throw new Error(
            "Assert failed: JSObject proxy of ManagedObject proxy is not supported",
          );
        if ("function" != typeof t && "object" != typeof t)
          throw new Error(
            `Assert failed: JSObject proxy of ${typeof t} is not supported`,
          );
        er(e, yr.JSObject);
        sr(e, Oe(t));
      }
    }
    function tn(e, t) {
      if (null == t) er(e, yr.None);
      else {
        const r = t[Ae],
          n = typeof t;
        if (void 0 === r)
          if ("string" === n || "symbol" === n) er(e, yr.String), Jr(e, t);
          else if ("number" === n) er(e, yr.Double), ir(e, t);
          else {
            if ("bigint" === n)
              throw new Error("NotImplementedException: bigint");
            if ("boolean" === n) er(e, yr.Boolean), rr(e, t);
            else if (t instanceof Date) er(e, yr.DateTime), or(e, t);
            else if (t instanceof Error) Qr(e, t);
            else if (t instanceof Uint8Array) nn(e, t, yr.Byte);
            else if (t instanceof Float64Array) nn(e, t, yr.Double);
            else if (t instanceof Int32Array) nn(e, t, yr.Int32);
            else if (Array.isArray(t)) nn(e, t, yr.Object);
            else {
              if (
                t instanceof Int16Array ||
                t instanceof Int8Array ||
                t instanceof Uint8ClampedArray ||
                t instanceof Uint16Array ||
                t instanceof Uint32Array ||
                t instanceof Float32Array
              )
                throw new Error("NotImplementedException: TypedArray");
              if ($e(t)) Kr(e, t);
              else {
                if (t instanceof wr)
                  throw new Error("NotImplementedException: Span");
                if ("object" != n)
                  throw new Error(
                    `JSObject proxy is not supported for ${n} ${t}`,
                  );
                {
                  const r = Oe(t);
                  er(e, yr.JSObject), sr(e, r);
                }
              }
            }
          }
        else {
          if ((De(t), t instanceof gr))
            throw new Error("NotImplementedException: ArraySegment");
          if (t instanceof dr) er(e, yr.Exception), _r(e, r);
          else {
            if (!(t instanceof mr))
              throw new Error("NotImplementedException " + n);
            er(e, yr.Object), _r(e, r);
          }
        }
      }
    }
    function rn(e, t, r) {
      if (!r) throw new Error("Assert failed: Expected valid sig parameter");
      nn(e, t, Jt(r));
    }
    function nn(e, r, n) {
      if (null == r) er(e, yr.None);
      else {
        const o = hr(n);
        if (-1 == o)
          throw new Error(`Assert failed: Element type ${yr[n]} not supported`);
        const i = r.length,
          a = o * i,
          s = t._malloc(a);
        if (n == yr.String) {
          if (!Array.isArray(r))
            throw new Error("Assert failed: Value is not an Array");
          Je(s, a), g.mono_wasm_register_root(s, a, "marshal_array_to_cs");
          for (let e = 0; e < i; e++) {
            Gr(Ht(s, e), r[e]);
          }
        } else if (n == yr.Object) {
          if (!Array.isArray(r))
            throw new Error("Assert failed: Value is not an Array");
          Je(s, a), g.mono_wasm_register_root(s, a, "marshal_array_to_cs");
          for (let e = 0; e < i; e++) {
            tn(Ht(s, e), r[e]);
          }
        } else if (n == yr.JSObject) {
          if (!Array.isArray(r))
            throw new Error("Assert failed: Value is not an Array");
          Je(s, a);
          for (let e = 0; e < i; e++) {
            en(Ht(s, e), r[e]);
          }
        } else if (n == yr.Byte) {
          if (!(Array.isArray(r) || r instanceof Uint8Array))
            throw new Error(
              "Assert failed: Value is not an Array or Uint8Array",
            );
          t.HEAPU8.subarray(s, s + i).set(r);
        } else if (n == yr.Int32) {
          if (!(Array.isArray(r) || r instanceof Int32Array))
            throw new Error(
              "Assert failed: Value is not an Array or Int32Array",
            );
          t.HEAP32.subarray(s >> 2, (s >> 2) + i).set(r);
        } else {
          if (n != yr.Double) throw new Error("not implemented");
          if (!(Array.isArray(r) || r instanceof Float64Array))
            throw new Error(
              "Assert failed: Value is not an Array or Float64Array",
            );
          t.HEAPF64.subarray(s >> 3, (s >> 3) + i).set(r);
        }
        nr(e, s),
          er(e, yr.Array),
          (function (e, t) {
            if (!e) throw new Error("Assert failed: Null arg");
            Qe(e + 4, t);
          })(e, n),
          fr(e, r.length);
      }
    }
    function on(e, t, r) {
      if (!r) throw new Error("Assert failed: Expected valid sig parameter");
      if (t.isDisposed)
        throw new Error("Assert failed: ObjectDisposedException");
      sn(r, t._viewType), er(e, yr.Span), nr(e, t._pointer), fr(e, t.length);
    }
    function an(e, t, r) {
      if (!r) throw new Error("Assert failed: Expected valid sig parameter");
      const n = De(t);
      if (!n)
        throw new Error(
          "Assert failed: Only roundtrip of ArraySegment instance created by C#",
        );
      sn(r, t._viewType),
        er(e, yr.ArraySegment),
        nr(e, t._pointer),
        fr(e, t.length),
        _r(e, n);
    }
    function sn(e, t) {
      const r = Jt(e);
      if (r == yr.Byte) {
        if (0 != t)
          throw new Error("Assert failed: Expected MemoryViewType.Byte");
      } else if (r == yr.Int32) {
        if (1 != t)
          throw new Error("Assert failed: Expected MemoryViewType.Int32");
      } else {
        if (r != yr.Double)
          throw new Error(`NotImplementedException ${yr[r]} `);
        if (2 != t)
          throw new Error("Assert failed: Expected MemoryViewType.Double");
      }
    }
    function cn(e, t, r, n, o, i) {
      let a = "",
        s = "",
        c = "";
      const _ = "converter" + t;
      let u = "null",
        l = "null",
        f = "null",
        m = "null",
        d = qt(e);
      if (d === yr.None || d === yr.Void)
        return { converters: a, call_body: c, marshaler_type: d };
      const h = Gt(e);
      if (h !== yr.None) {
        const e = $t.get(h);
        if (!e || "function" != typeof e)
          throw new Error(
            `Assert failed: Unknow converter for type ${h} at ${t}`,
          );
        d != yr.Nullable
          ? ((m = "converter" + t + "_res"),
            (a += ", " + m),
            (s += " " + yr[h]),
            (i[m] = e))
          : (d = h);
      }
      const p = Jt(e);
      if (p !== yr.None) {
        const e = Ut.get(p);
        if (!e || "function" != typeof e)
          throw new Error(
            `Assert failed: Unknow converter for type ${p} at ${t}`,
          );
        (u = "converter" + t + "_arg1"),
          (a += ", " + u),
          (s += " " + yr[p]),
          (i[u] = e);
      }
      const w = Yt(e);
      if (w !== yr.None) {
        const e = Ut.get(w);
        if (!e || "function" != typeof e)
          throw new Error(
            `Assert failed: Unknow converter for type ${w} at ${t}`,
          );
        (l = "converter" + t + "_arg2"),
          (a += ", " + l),
          (s += " " + yr[w]),
          (i[l] = e);
      }
      const g = Xt(e);
      if (g !== yr.None) {
        const e = Ut.get(g);
        if (!e || "function" != typeof e)
          throw new Error(
            `Assert failed: Unknow converter for type ${g} at ${t}`,
          );
        (f = "converter" + t + "_arg3"),
          (a += ", " + f),
          (s += " " + yr[g]),
          (i[f] = e);
      }
      const y = $t.get(d);
      if (!y || "function" != typeof y)
        throw new Error(
          `Assert failed: Unknow converter for type ${d} at ${t} `,
        );
      return (
        (a += ", " + _),
        (s += " " + yr[d]),
        (i[_] = y),
        (c =
          d == yr.Task
            ? `  const ${o} = ${_}(args + ${r}, signature + ${n}, ${m}); // ${s} \n`
            : d == yr.Action || d == yr.Function
            ? `  const ${o} = ${_}(args + ${r}, signature + ${n}, ${m}, ${u}, ${l}, ${f}); // ${s} \n`
            : `  const ${o} = ${_}(args + ${r}, signature + ${n}); // ${s} \n`),
        { converters: a, call_body: c, marshaler_type: d }
      );
    }
    function _n(e) {
      return Qt(e) == yr.None
        ? null
        : (function (e) {
            if (!e) throw new Error("Assert failed: Null arg");
            return !!lt(e);
          })(e);
    }
    function un(e) {
      return Qt(e) == yr.None
        ? null
        : (function (e) {
            if (!e) throw new Error("Assert failed: Null arg");
            return lt(e);
          })(e);
    }
    function ln(e) {
      return Qt(e) == yr.None
        ? null
        : (function (e) {
            if (!e) throw new Error("Assert failed: Null arg");
            return ft(e);
          })(e);
    }
    function fn(e) {
      return Qt(e) == yr.None
        ? null
        : (function (e) {
            if (!e) throw new Error("Assert failed: Null arg");
            return ht(e);
          })(e);
    }
    function mn(e) {
      return Qt(e) == yr.None
        ? null
        : (function (e) {
            if (!e) throw new Error("Assert failed: Null arg");
            return pt(e);
          })(e);
    }
    function dn(e) {
      return Qt(e) == yr.None
        ? null
        : (function (e) {
            if (!e) throw new Error("Assert failed: Null arg");
            return vt(e);
          })(e);
    }
    function hn(e) {
      return Qt(e) == yr.None
        ? null
        : (function (e) {
            if (!e) throw new Error("Assert failed: Null arg");
            return yt(e);
          })(e);
    }
    function pn(e) {
      return Qt(e) == yr.None
        ? null
        : (function (e) {
            if (!e) throw new Error("Assert failed: Null arg");
            return bt(e);
          })(e);
    }
    function wn(e) {
      return Qt(e) == yr.None
        ? null
        : (function (e) {
            if (!e) throw new Error("Assert failed: Null arg");
            return vt(e);
          })(e);
    }
    function gn(e) {
      return Qt(e) == yr.None ? null : tr(e);
    }
    function yn() {
      return null;
    }
    function bn(e) {
      return Qt(e) === yr.None
        ? null
        : (function (e) {
            if (!e) throw new Error("Assert failed: Null arg");
            const t = vt(e);
            return new Date(t);
          })(e);
    }
    function vn(e, t, r, n, o, i) {
      if (Qt(e) === yr.None) return null;
      const a = cr(e);
      let s = Me(a);
      return (
        null != s ||
          ((s = (e, t, s) =>
            d.javaScriptExports.call_delegate(a, e, t, s, r, n, o, i)),
          je(s, a)),
        s
      );
    }
    function En(e, t, r) {
      const n = Qt(e);
      if (n === yr.None) return null;
      if (n !== yr.Task) {
        if ((r || (r = $t.get(n)), !r))
          throw new Error(
            `Assert failed: Unknow sub_converter for type ${yr[n]} `,
          );
        const t = r(e);
        return new Promise((e) => e(t));
      }
      const o = ar(e);
      if (0 == o) return new Promise((e) => e(void 0));
      const i = Ne(o);
      if (!i)
        throw new Error(
          `Assert failed: ERR28: promise not found for js_handle: ${o} `,
        );
      Ie(i);
      const a = Ce(i),
        s = a.resolve;
      return (
        (a.resolve = (e) => {
          const t = Qt(e);
          if (t === yr.None) return void s(null);
          if ((r || (r = $t.get(t)), !r))
            throw new Error(
              `Assert failed: Unknow sub_converter for type ${yr[t]}`,
            );
          const n = r(e);
          s(n);
        }),
        i
      );
    }
    function Sn(e) {
      const t = Ht(e, 0),
        r = Ht(e, 1),
        n = Ht(e, 2),
        o = Ht(e, 3),
        i = Qt(t),
        a = Qt(o),
        s = ar(n);
      if (0 === s) {
        const { promise: e, promise_control: n } = Pe();
        if ((sr(r, Oe(e)), i !== yr.None)) {
          const e = kn(t);
          n.reject(e);
        } else if (a !== yr.Task) {
          const e = $t.get(a);
          if (!e)
            throw new Error(
              `Assert failed: Unknow sub_converter for type ${yr[a]} `,
            );
          const t = e(o);
          n.resolve(t);
        }
      } else {
        const e = Ne(s);
        if (!e)
          throw new Error(
            `Assert failed: ERR25: promise not found for js_handle: ${s} `,
          );
        Ie(e);
        const r = Ce(e);
        if (i !== yr.None) {
          const e = kn(t);
          r.reject(e);
        } else a !== yr.Task && r.resolve(o);
      }
      er(r, yr.Task), er(t, yr.None);
    }
    function An(e) {
      if (Qt(e) == yr.None) return null;
      const t = ur(e);
      try {
        return xr(t);
      } finally {
        t.release();
      }
    }
    function kn(e) {
      const t = Qt(e);
      if (t == yr.None) return null;
      if (t == yr.JSException) {
        return Ne(ar(e));
      }
      const r = cr(e);
      let n = Me(r);
      if (null == n) {
        const t = An(e);
        (n = new dr(t)), je(n, r);
      }
      return n;
    }
    function Nn(e) {
      if (Qt(e) == yr.None) return null;
      return Ne(ar(e));
    }
    function On(e) {
      const t = Qt(e);
      if (t == yr.None) return null;
      if (t == yr.JSObject) {
        return Ne(ar(e));
      }
      if (t == yr.Array) {
        return jn(
          e,
          (function (e) {
            if (!e) throw new Error("Assert failed: Null arg");
            return mt(e + 4);
          })(e),
        );
      }
      if (t == yr.Object) {
        const t = cr(e);
        if (0 === t) return null;
        let r = Me(t);
        return r || ((r = new mr()), je(r, t)), r;
      }
      const r = $t.get(t);
      if (!r)
        throw new Error(`Assert failed: Unknow converter for type ${yr[t]}`);
      return r(e);
    }
    function xn(e, t) {
      if (!t) throw new Error("Assert failed: Expected valid sig parameter");
      return jn(e, Jt(t));
    }
    function jn(e, r) {
      if (Qt(e) == yr.None) return null;
      if (-1 == hr(r))
        throw new Error(`Assert failed: Element type ${yr[r]} not supported`);
      const n = tr(e),
        o = lr(e);
      let i = null;
      if (r == yr.String) {
        i = new Array(o);
        for (let e = 0; e < o; e++) {
          const t = Ht(n, e);
          i[e] = An(t);
        }
        g.mono_wasm_deregister_root(n);
      } else if (r == yr.Object) {
        i = new Array(o);
        for (let e = 0; e < o; e++) {
          const t = Ht(n, e);
          i[e] = On(t);
        }
        g.mono_wasm_deregister_root(n);
      } else if (r == yr.JSObject) {
        i = new Array(o);
        for (let e = 0; e < o; e++) {
          const t = Ht(n, e);
          i[e] = Nn(t);
        }
      } else if (r == yr.Byte) {
        i = t.HEAPU8.subarray(n, n + o).slice();
      } else if (r == yr.Int32) {
        i = t.HEAP32.subarray(n >> 2, (n >> 2) + o).slice();
      } else {
        if (r != yr.Double)
          throw new Error(`NotImplementedException ${yr[r]} `);
        i = t.HEAPF64.subarray(n >> 3, (n >> 3) + o).slice();
      }
      return t._free(n), i;
    }
    function Tn(e, t) {
      if (!t) throw new Error("Assert failed: Expected valid sig parameter");
      const r = Jt(t),
        n = tr(e),
        o = lr(e);
      let i = null;
      if (r == yr.Byte) i = new wr(n, o, 0);
      else if (r == yr.Int32) i = new wr(n, o, 1);
      else {
        if (r != yr.Double)
          throw new Error(`NotImplementedException ${yr[r]} `);
        i = new wr(n, o, 2);
      }
      return i;
    }
    function Dn(e, t) {
      if (!t) throw new Error("Assert failed: Expected valid sig parameter");
      const r = Jt(t),
        n = tr(e),
        o = lr(e);
      let i = null;
      if (r == yr.Byte) i = new gr(n, o, 0);
      else if (r == yr.Int32) i = new gr(n, o, 1);
      else {
        if (r != yr.Double)
          throw new Error(`NotImplementedException ${yr[r]} `);
        i = new gr(n, o, 2);
      }
      return je(i, cr(e)), i;
    }
    let Mn, Rn;
    const Pn = {};
    const Cn = Symbol.for("wasm type");
    const In = Pe(),
      Fn = Pe();
    let $n = 0,
      Un = 0,
      Bn = 0,
      Wn = 0;
    const zn = [],
      Ln = Object.create(null);
    let Hn,
      Vn = 0;
    const qn = { "js-module-threads": !0 },
      Gn = { dotnetwasm: !0 },
      Jn = { "js-module-threads": !0, dotnetwasm: !0 };
    async function Yn() {
      d.diagnosticTracing && console.debug("MONO_WASM: mono_download_assets"),
        (d.maxParallelDownloads =
          d.config.maxParallelDownloads || d.maxParallelDownloads);
      try {
        const e = [];
        for (const t of d.config.assets) {
          const r = t;
          if ((Jn[r.behavior] || Wn++, !qn[r.behavior])) {
            const t = Gn[r.behavior];
            if ((Bn++, r.pendingDownload)) {
              r.pendingDownloadInternal = r.pendingDownload;
              const n = async () => {
                const e = await r.pendingDownloadInternal.response;
                return (
                  t || (r.buffer = await e.arrayBuffer()),
                  ++$n,
                  { asset: r, buffer: r.buffer }
                );
              };
              e.push(n());
            } else {
              const n = async () => (
                (r.buffer = await Xn(r, !t)), { asset: r, buffer: r.buffer }
              );
              e.push(n());
            }
          }
        }
        Fn.promise_control.resolve();
        const r = [];
        for (const t of e)
          r.push(
            (async () => {
              const e = await t,
                r = e.asset;
              if (e.buffer) {
                if (!Jn[r.behavior]) {
                  const t = r.pendingDownloadInternal.url,
                    n = new Uint8Array(r.buffer);
                  (r.pendingDownloadInternal = null),
                    (r.pendingDownload = null),
                    (r.buffer = null),
                    (e.buffer = null),
                    await Aa.promise,
                    eo(r, t, n);
                }
              } else {
                if (Gn[r.behavior]) Gn[r.behavior] && ++$n;
                else {
                  if (!r.isOptional)
                    throw new Error(
                      "Assert failed: Expected asset to have the downloaded buffer",
                    );
                  qn[r.behavior] || Bn--, Jn[r.behavior] || Wn--;
                }
              }
            })(),
          );
        Promise.all(r)
          .then(() => {
            In.promise_control.resolve();
          })
          .catch((e) => {
            t.printErr("MONO_WASM: Error in mono_download_assets: " + e),
              Da(e, !0);
          });
      } catch (e) {
        throw (t.printErr("MONO_WASM: Error in mono_download_assets: " + e), e);
      }
    }
    async function Xn(e, t) {
      try {
        return await Zn(e, t);
      } catch (r) {
        if (i || o) throw r;
        if (e.pendingDownload && e.pendingDownloadInternal == e.pendingDownload)
          throw r;
        if (e.resolvedUrl && -1 != e.resolvedUrl.indexOf("file://")) throw r;
        if (r && 404 == r.status) throw r;
        (e.pendingDownloadInternal = void 0), await Fn.promise;
        try {
          return await Zn(e, t);
        } catch (r) {
          return (
            (e.pendingDownloadInternal = void 0),
            await (function (e) {
              return new Promise((t) => setTimeout(t, e));
            })(100),
            await Zn(e, t)
          );
        }
      }
    }
    async function Zn(e, r) {
      for (; Hn; ) await Hn.promise;
      try {
        ++Vn,
          Vn == d.maxParallelDownloads &&
            (d.diagnosticTracing &&
              console.debug("MONO_WASM: Throttling further parallel downloads"),
            (Hn = Pe()));
        const n = await (async function (e) {
          if (e.buffer) {
            const t = e.buffer;
            return (
              (e.buffer = null),
              (e.pendingDownloadInternal = {
                url: "undefined://" + e.name,
                name: e.name,
                response: Promise.resolve({
                  arrayBuffer: () => t,
                  headers: { get: () => {} },
                }),
              }),
              e.pendingDownloadInternal.response
            );
          }
          if (e.pendingDownloadInternal && e.pendingDownloadInternal.response) {
            return await e.pendingDownloadInternal.response;
          }
          const r =
            e.loadRemote && d.config.remoteSources
              ? d.config.remoteSources
              : [""];
          let n;
          for (let t of r) {
            (t = t.trim()), "./" === t && (t = "");
            const r = Kn(e, t);
            e.name === r
              ? d.diagnosticTracing &&
                console.debug(`MONO_WASM: Attempting to download '${r}'`)
              : d.diagnosticTracing &&
                console.debug(
                  `MONO_WASM: Attempting to download '${r}' for ${e.name}`,
                );
            try {
              const t = Qn({
                name: e.name,
                resolvedUrl: r,
                hash: e.hash,
                behavior: e.behavior,
              });
              if (
                ((e.pendingDownloadInternal = t), (n = await t.response), !n.ok)
              )
                continue;
              return n;
            } catch (e) {
              continue;
            }
          }
          const o =
            e.isOptional ||
            (e.name.match(/\.pdb$/) && d.config.ignorePdbLoadErrors);
          if (!n)
            throw new Error(`Assert failed: Response undefined ${e.name}`);
          if (o)
            return void t.print(
              `MONO_WASM: optional download '${n.url}' for ${e.name} failed ${n.status} ${n.statusText}`,
            );
          {
            const t = new Error(
              `MONO_WASM: download '${n.url}' for ${e.name} failed ${n.status} ${n.statusText}`,
            );
            throw ((t.status = n.status), t);
          }
        })(e);
        if (!r || !n) return;
        const o = await n.arrayBuffer();
        return ++$n, o;
      } finally {
        if ((--Vn, Hn && Vn == d.maxParallelDownloads - 1)) {
          d.diagnosticTracing &&
            console.debug("MONO_WASM: Resuming more parallel downloads");
          const e = Hn;
          (Hn = void 0), e.promise_control.resolve();
        }
      }
    }
    function Kn(e, t) {
      if (null == t)
        throw new Error(
          `Assert failed: sourcePrefix must be provided for ${e.name}`,
        );
      let r;
      const n = d.config.assemblyRootFolder;
      if (e.resolvedUrl) r = e.resolvedUrl;
      else {
        if ("" === t)
          if ("assembly" === e.behavior || "pdb" === e.behavior)
            r = n ? n + "/" + e.name : e.name;
          else if ("resource" === e.behavior) {
            const t =
              e.culture && "" !== e.culture ? `${e.culture}/${e.name}` : e.name;
            r = n ? n + "/" + t : t;
          } else r = e.name;
        else r = t + e.name;
        r = d.locateFile(r);
      }
      if (!r || "string" != typeof r)
        throw new Error(
          "Assert failed: attemptUrl need to be path or url string",
        );
      return r;
    }
    function Qn(e) {
      try {
        if ("function" == typeof t.downloadResource) {
          const r = t.downloadResource(e);
          if (r) return r;
        }
        const r = {};
        e.hash && (r.integrity = e.hash);
        const n = d.fetch_like(e.resolvedUrl, r);
        return { name: e.name, url: e.resolvedUrl, response: n };
      } catch (t) {
        const r = {
          ok: !1,
          url: e.resolvedUrl,
          status: 500,
          statusText: "ERR29: " + t,
          arrayBuffer: () => {
            throw t;
          },
          json: () => {
            throw t;
          },
        };
        return {
          name: e.name,
          url: e.resolvedUrl,
          response: Promise.resolve(r),
        };
      }
    }
    function eo(e, r, n) {
      d.diagnosticTracing &&
        console.debug(
          `MONO_WASM: Loaded:${e.name} as ${e.behavior} size ${n.length} from ${r}`,
        );
      const o = "string" == typeof e.virtualPath ? e.virtualPath : e.name;
      let i = null;
      switch (e.behavior) {
        case "dotnetwasm":
        case "js-module-threads":
          break;
        case "resource":
        case "assembly":
        case "pdb":
          zn.push({ url: r, file: o });
        case "heap":
        case "icu":
          (i = At(n)), (Ln[o] = [i, n.length]);
          break;
        case "vfs": {
          const e = o.lastIndexOf("/");
          let r = e > 0 ? o.substr(0, e) : null,
            i = e > 0 ? o.substr(e + 1) : o;
          i.startsWith("/") && (i = i.substr(1)),
            r
              ? (d.diagnosticTracing &&
                  console.debug(`MONO_WASM: Creating directory '${r}'`),
                t.FS_createPath("/", r, !0, !0))
              : (r = "/"),
            d.diagnosticTracing &&
              console.debug(
                `MONO_WASM: Creating file '${i}' in directory '${r}'`,
              ),
            to(n, r) || t.FS_createDataFile(r, i, n, !0, !0, !0);
          break;
        }
        default:
          throw new Error(
            `Unrecognized asset behavior:${e.behavior}, for asset ${e.name}`,
          );
      }
      if ("assembly" === e.behavior) {
        if (!g.mono_wasm_add_assembly(o, i, n.length)) {
          const e = zn.findIndex((e) => e.file == o);
          zn.splice(e, 1);
        }
      } else
        "icu" === e.behavior
          ? G(i) || t.printErr(`MONO_WASM: Error loading ICU asset ${e.name}`)
          : "resource" === e.behavior &&
            g.mono_wasm_add_satellite_assembly(o, e.culture || "", i, n.length);
      ++Un;
    }
    function to(e, r) {
      if (e.length < 8) return !1;
      const n = new DataView(e.buffer);
      if (1651270004 != n.getUint32(0, !0)) return !1;
      const o = n.getUint32(4, !0);
      if (0 == o || e.length < o + 8) return !1;
      let i;
      try {
        const r = t.UTF8ArrayToString(e, 8, o);
        if (((i = JSON.parse(r)), !(i instanceof Array))) return !1;
      } catch (e) {
        return !1;
      }
      e = e.slice(o + 8);
      const a = new Set();
      i.filter((e) => {
        const t = e[0],
          r = t.lastIndexOf("/"),
          n = t.slice(0, r + 1);
        a.add(n);
      }),
        a.forEach((e) => {
          t.FS_createPath(r, e, !0, !0);
        });
      for (const n of i) {
        const o = n[0],
          i = n[1],
          a = e.slice(0, i);
        t.FS_createDataFile(r, o, a, !0, !0), (e = e.slice(i));
      }
      return !0;
    }
    async function ro() {
      if ((await In.promise, d.config.assets)) {
        if ($n != Bn)
          throw new Error(
            `Assert failed: Expected ${Bn} assets to be downloaded, but only finished ${$n}`,
          );
        if (Un != Wn)
          throw new Error(
            `Assert failed: Expected ${Wn} assets to be in memory, but only instantiated ${Un}`,
          );
        zn.forEach((e) => Mn.loaded_files.push(e.url)),
          d.diagnosticTracing &&
            console.debug("MONO_WASM: all assets are loaded in wasm memory");
      }
    }
    function no() {
      return Mn.loaded_files;
    }
    let oo, io;
    function ao(e) {
      const r = t;
      void 0 === globalThis.performance && (globalThis.performance = so),
        void 0 === globalThis.URL &&
          (globalThis.URL = class {
            constructor(e) {
              this.url = e;
            }
            toString() {
              return this.url;
            }
          });
      const n = (r.imports = t.imports || {}),
        c = (e) => (r) => t.imports[r] || e(r);
      n.require
        ? (d.requirePromise = e.requirePromise = Promise.resolve(c(n.require)))
        : e.require
        ? (d.requirePromise = e.requirePromise = Promise.resolve(c(e.require)))
        : e.requirePromise
        ? (d.requirePromise = e.requirePromise.then((e) => c(e)))
        : (d.requirePromise = e.requirePromise =
            Promise.resolve(
              c((e) => {
                throw new Error(
                  `Please provide Module.imports.${e} or Module.imports.require`,
                );
              }),
            )),
        (d.scriptDirectory = e.scriptDirectory =
          (function (e) {
            return (
              s && (e.scriptUrl = self.location.href),
              e.scriptUrl || (e.scriptUrl = "./dotnet.js"),
              (e.scriptUrl = (function (e) {
                return e.replace(/\\/g, "/").replace(/[?#].*/, "");
              })(e.scriptUrl)),
              (function (e) {
                return e.slice(0, e.lastIndexOf("/")) + "/";
              })(e.scriptUrl)
            );
          })(e)),
        (r.mainScriptUrlOrBlob = e.scriptUrl),
        r.__locateFile === r.locateFile
          ? (r.locateFile = d.locateFile =
              (e) =>
                (function (e) {
                  return o || i
                    ? e.startsWith("/") ||
                        e.startsWith("\\") ||
                        -1 !== e.indexOf("///") ||
                        uo.test(e)
                    : _o.test(e);
                })(e)
                  ? e
                  : d.scriptDirectory + e)
          : (d.locateFile = r.locateFile),
        n.fetch
          ? (e.fetch = d.fetch_like = n.fetch)
          : (e.fetch = d.fetch_like = co),
        (e.noExitRuntime = a);
      const _ = e.updateGlobalBufferAndViews;
      e.updateGlobalBufferAndViews = (e) => {
        _(e),
          (function (e) {
            Ve &&
              ((Et = BigInt("9223372036854775807")),
              (St = BigInt("-9223372036854775808")),
              (He = new BigInt64Array(e)));
          })(e);
      };
    }
    const so = {
      now: function () {
        return Date.now();
      },
    };
    async function co(e, r) {
      try {
        if (o) {
          if (!oo) {
            const e = await d.requirePromise;
            (io = e("url")), (oo = e("fs"));
          }
          e.startsWith("file://") && (e = io.fileURLToPath(e));
          const t = await oo.promises.readFile(e);
          return {
            ok: !0,
            url: e,
            arrayBuffer: () => t,
            json: () => JSON.parse(t),
          };
        }
        if ("function" == typeof globalThis.fetch)
          return globalThis.fetch(e, r || { credentials: "same-origin" });
        if ("function" == typeof read) {
          const r = new Uint8Array(read(e, "binary"));
          return {
            ok: !0,
            url: e,
            arrayBuffer: () => r,
            json: () => JSON.parse(t.UTF8ArrayToString(r, 0, r.length)),
          };
        }
      } catch (r) {
        return {
          ok: !1,
          url: e,
          status: 500,
          statusText: "ERR28: " + r,
          arrayBuffer: () => {
            throw r;
          },
          json: () => {
            throw r;
          },
        };
      }
      throw new Error("No fetch implementation available");
    }
    const _o = /^[a-zA-Z][a-zA-Z\d+\-.]*?:\/\//,
      uo = /[a-zA-Z]:[\\/]/;
    function lo(e, t, r, n, o, i) {
      const a = Mt(e),
        s = Mt(t),
        c = Mt(i);
      try {
        const e = Kt(r);
        if (1 !== e)
          throw new Error(`Assert failed: Signature version ${e} mismatch.`);
        const t = xr(a),
          o = xr(s);
        d.diagnosticTracing &&
          console.debug(`MONO_WASM: Binding [JSImport] ${t} from ${o}`);
        const i = ho(t, o),
          _ = Zt(r),
          u = { fn: i, marshal_exception_to_cs: Qr, signature: r },
          l = "_bound_js_" + t.replace(/\./g, "_");
        let f = `//# sourceURL=https://dotnet.generated.invalid/${l} \n`,
          m = "",
          h = "",
          p = "";
        for (let e = 0; e < _; e++) {
          const t = (e + 2) * zt,
            n = 32 * (e + 2) + 8,
            o = `arg${e}`,
            i = Vt(r, e + 2),
            { converters: a, call_body: s } = cn(i, e + 2, t, n, o, u);
          (m += a), (h += s), (p += "" === p ? o : `, ${o}`);
        }
        const {
          converters: w,
          call_body: g,
          marshaler_type: y,
        } = Pr(Vt(r, 1), 1, zt, 40, "js_result", u);
        (m += w),
          (f += `const { signature, fn, marshal_exception_to_cs ${m} } = closure;\n`),
          (f += `return function ${l} (args) { try {\n`),
          (f += h),
          y === yr.Void
            ? ((f += `  const js_result = fn(${p});\n`),
              (f += `  if (js_result !== undefined) throw new Error('Function ${t} returned unexpected value, C# signature is void');\n`))
            : y === yr.Discard
            ? (f += `  fn(${p});\n`)
            : ((f += `  const js_result = fn(${p});\n`), (f += g));
        for (let e = 0; e < _; e++) {
          const t = Vt(r, e + 2);
          if (qt(t) == yr.Span) {
            f += `  arg${e}.dispose();\n`;
          }
        }
        (f += "} catch (ex) {\n"),
          (f += "  marshal_exception_to_cs(args, ex);\n"),
          (f += "}}");
        const b = new Function("closure", f)(u);
        b[Wt] = !0;
        nt(n, Oe(b));
      } catch (e) {
        Ao(o, e, c);
      } finally {
        c.release(), a.release();
      }
    }
    function fo(e, t) {
      const r = Ne(e);
      if (!r || "function" != typeof r || !r[Wt])
        throw new Error(`Assert failed: Bound function handle expected ${e}`);
      r(t);
    }
    function mo(e, t) {
      Eo.set(e, t),
        d.diagnosticTracing &&
          console.debug(`MONO_WASM: added module imports '${e}'`);
    }
    function ho(e, t) {
      if (!e || "string" != typeof e)
        throw new Error("Assert failed: function_name must be string");
      let o = n;
      const i = e.split(".");
      if (t) {
        if (((o = Eo.get(t)), !o))
          throw new Error(
            `Assert failed: ES6 module ${t} was not imported yet, please call JSHost.Import() first.`,
          );
      } else
        "INTERNAL" === i[0]
          ? ((o = r), i.shift())
          : "globalThis" === i[0] && ((o = globalThis), i.shift());
      for (let t = 0; t < i.length - 1; t++) {
        const r = i[t],
          n = o[r];
        if (!n)
          throw new Error(
            `Assert failed: ${r} not found while looking up ${e}`,
          );
        o = n;
      }
      const a = o[i[i.length - 1]];
      if ("function" != typeof a)
        throw new Error(
          `Assert failed: ${e} must be a Function but was ${typeof a}`,
        );
      return a.bind(o);
    }
    function po(e, t, r) {
      if (!e) throw new Error("Assert failed: Null reference");
      e[t] = r;
    }
    function wo(e, t) {
      if (!e) throw new Error("Assert failed: Null reference");
      return e[t];
    }
    function go(e, t) {
      if (!e) throw new Error("Assert failed: Null reference");
      return t in e;
    }
    function yo(e, t) {
      if (!e) throw new Error("Assert failed: Null reference");
      return typeof e[t];
    }
    function bo() {
      return globalThis;
    }
    const vo = new Map(),
      Eo = new Map();
    function So(e, t) {
      if (!e) throw new Error("Assert failed: Invalid module_name");
      if (!t) throw new Error("Assert failed: Invalid module_name");
      let r = vo.get(e);
      const n = !r;
      return (
        n &&
          (d.diagnosticTracing &&
            console.debug(`MONO_WASM: importing ES6 module '${e}' from '${t}'`),
          (r = import(t)),
          vo.set(e, r)),
        Ue(async () => {
          const o = await r;
          return (
            n &&
              (Eo.set(e, o),
              d.diagnosticTracing &&
                console.debug(
                  `MONO_WASM: imported ES6 module '${e}' from '${t}'`,
                )),
            o
          );
        })
      );
    }
    function Ao(e, r, n) {
      Dr(
        (function (e, r) {
          let n = "unknown exception";
          if (r) {
            n = r.toString();
            const e = r.stack;
            e && (e.startsWith(n) ? (n = e) : (n += "\n" + e)), (n = ie(n));
          }
          return e && t.setValue(e, 1, "i32"), n;
        })(e, r),
        n,
      );
    }
    const ko = new Map();
    function No(e, r, n, o, i) {
      const a = Mt(e),
        s = Mt(i),
        c = t;
      try {
        const e = Kt(n);
        if (1 !== e)
          throw new Error(`Assert failed: Signature version ${e} mismatch.`);
        const t = Zt(n),
          o = xr(a);
        if (!o)
          throw new Error("Assert failed: fully_qualified_name must be string");
        d.diagnosticTracing &&
          console.debug(`MONO_WASM: Binding [JSExport] ${o}`);
        const {
            assembly: i,
            namespace: _,
            classname: u,
            methodname: l,
          } = To(o),
          f = te(i);
        if (!f) throw new Error("Could not find assembly: " + i);
        const m = g.mono_wasm_assembly_find_class(f, _, u);
        if (!m)
          throw new Error(
            "Could not find class: " + _ + ":" + u + " in assembly " + i,
          );
        const h = `__Wrapper_${l}_${r}`,
          p = g.mono_wasm_assembly_find_method(m, h, -1);
        if (!p) throw new Error(`Could not find method: ${h} in ${m} [${i}]`);
        const w = {
            method: p,
            signature: n,
            stackSave: c.stackSave,
            stackRestore: c.stackRestore,
            alloc_stack_frame: Lt,
            invoke_method_and_handle_exception: Oo,
          },
          y =
            "_bound_cs_" +
            `${_}_${u}_${l}`.replace(/\./g, "_").replace(/\//g, "_");
        let b = `//# sourceURL=https://dotnet.generated.invalid/${y} \n`,
          v = "",
          E = "";
        for (let e = 0; e < t; e++) {
          const t = (e + 2) * zt,
            r = 32 * (e + 2) + 8,
            o = Vt(n, e + 2),
            { converters: i, call_body: a } = Pr(
              o,
              e + 2,
              t,
              r,
              `arguments[${e}]`,
              w,
            );
          (E += i), (v += a);
        }
        const {
          converters: S,
          call_body: A,
          marshaler_type: k,
        } = cn(Vt(n, 1), 1, zt, 40, "js_result", w);
        (E += S),
          (b += `const { method, signature, stackSave, stackRestore,  alloc_stack_frame, invoke_method_and_handle_exception ${E} } = closure;\n`),
          (b += `return function ${y} () {\n`),
          (b += "const sp = stackSave();\n"),
          (b += "try {\n"),
          (b += `  const args = alloc_stack_frame(${t + 2});\n`),
          (b += v),
          (b += "  invoke_method_and_handle_exception(method, args);\n"),
          k !== yr.Void && k !== yr.Discard && (b += A),
          k !== yr.Void && k !== yr.Discard && (b += "  return js_result;\n"),
          (b += "} finally {\n"),
          (b += "  stackRestore(sp);\n"),
          (b += "}}");
        const N = new Function("closure", b)(w);
        (N[Bt] = !0),
          ko.set(o, N),
          (function (e, t, r, n, o, i) {
            const a = `${t}.${r}`.replace(/\//g, ".").split(".");
            let s,
              c = xo.get(e);
            c || ((c = {}), xo.set(e, c), xo.set(e + ".dll", c)), (s = c);
            for (let e = 0; e < a.length; e++) {
              const t = a[e];
              if ("" != t) {
                let e = s[t];
                if ((void 0 === e && ((e = {}), (s[t] = e)), !e))
                  throw new Error(
                    `Assert failed: ${t} not found while looking up ${r}`,
                  );
                s = e;
              }
            }
            s[n] || (s[n] = i), (s[`${n}.${o}`] = i);
          })(i, _, u, l, r, N);
      } catch (e) {
        t.printErr(e.toString()), Ao(o, e, s);
      } finally {
        s.release(), a.release();
      }
    }
    function Oo(e, t) {
      const r = g.mono_wasm_invoke_method_bound(e, t);
      if (r) throw new Error("ERR24: Unexpected error: " + Or(r));
      if (
        (function (e) {
          if (!e) throw new Error("Assert failed: Null args");
          return Qt(e) !== yr.None;
        })(t)
      ) {
        throw kn(Ht(t, 0));
      }
    }
    const xo = new Map();
    async function jo(e) {
      if (!d.mono_wasm_bindings_is_ready)
        throw new Error("Assert failed: The runtime must be initialized.");
      if (!xo.get(e)) {
        const t = te(e);
        if (!t) throw new Error("Could not find assembly: " + e);
        g.mono_wasm_runtime_run_module_cctor(t);
      }
      return xo.get(e) || {};
    }
    function To(e) {
      const t = e.substring(e.indexOf("[") + 1, e.indexOf("]")).trim(),
        r = (e = e.substring(e.indexOf("]") + 1).trim()).substring(
          e.indexOf(":") + 1,
        );
      let n = "",
        o = (e = e.substring(0, e.indexOf(":")).trim());
      if (-1 != e.indexOf(".")) {
        const t = e.lastIndexOf(".");
        (n = e.substring(0, t)), (o = e.substring(t + 1));
      }
      if (!t.trim()) throw new Error("No assembly name specified " + e);
      if (!o.trim()) throw new Error("No class name specified " + e);
      if (!r.trim()) throw new Error("No method name specified " + e);
      return { assembly: t, namespace: n, classname: o, methodname: r };
    }
    function Do(e) {
      const t = g.mono_wasm_assembly_find_method(
        d.runtime_interop_exports_class,
        e,
        -1,
      );
      if (!t)
        throw (
          "Can't find method " +
          d.runtime_interop_namespace +
          "." +
          d.runtime_interop_exports_classname +
          "." +
          e
        );
      return t;
    }
    function Mo(e, t, r, n, o, i, a) {
      const s = Mt(a);
      try {
        Fo(
          (function (e, t, r, n, o) {
            let i = null;
            switch (o) {
              case 5:
                i = new Int8Array(r - t);
                break;
              case 6:
                i = new Uint8Array(r - t);
                break;
              case 7:
                i = new Int16Array(r - t);
                break;
              case 8:
                i = new Uint16Array(r - t);
                break;
              case 9:
                i = new Int32Array(r - t);
                break;
              case 10:
                i = new Uint32Array(r - t);
                break;
              case 13:
                i = new Float32Array(r - t);
                break;
              case 14:
                i = new Float64Array(r - t);
                break;
              case 15:
                i = new Uint8ClampedArray(r - t);
                break;
              default:
                throw new Error("Unknown array type " + o);
            }
            return Ro(i, e, t, r, n), i;
          })(e, t, r, n, o),
          s,
          !0,
        );
      } catch (e) {
        Ao(i, String(e), s);
      } finally {
        s.release();
      }
    }
    function Ro(e, r, n, o, i) {
      if (Po(e) && e.BYTES_PER_ELEMENT) {
        if (i !== e.BYTES_PER_ELEMENT)
          throw new Error(
            "Inconsistent element sizes: TypedArray.BYTES_PER_ELEMENT '" +
              e.BYTES_PER_ELEMENT +
              "' sizeof managed element: '" +
              i +
              "'",
          );
        let a = (o - n) * i;
        const s = e.length * e.BYTES_PER_ELEMENT;
        a > s && (a = s);
        const c = n * i;
        return (
          new Uint8Array(e.buffer, 0, a).set(
            t.HEAPU8.subarray(r + c, r + c + a),
          ),
          a
        );
      }
      throw new Error("Object '" + e + "' is not a typed array");
    }
    function Po(e) {
      return "undefined" != typeof SharedArrayBuffer
        ? e.buffer instanceof ArrayBuffer ||
            e.buffer instanceof SharedArrayBuffer
        : e.buffer instanceof ArrayBuffer;
    }
    function Co(e, t, r) {
      switch (!0) {
        case null === t:
        case void 0 === t:
          return void r.clear();
        case "symbol" == typeof t:
        case "string" == typeof t:
          return void Ei._create_uri_ref(t, r.address);
        default:
          return void $o(e, t, r);
      }
    }
    function Io(e) {
      const t = Rt();
      try {
        return Fo(e, t, !1), t.value;
      } finally {
        t.release();
      }
    }
    function Fo(e, t, r) {
      if (p(t)) throw new Error("Expected (value, WasmRoot, boolean)");
      switch (!0) {
        case null === e:
        case void 0 === e:
          return void t.clear();
        case "number" == typeof e: {
          let r;
          return (
            (0 | e) === e
              ? (rt(Pn._box_buffer, e), (r = Pn._class_int32))
              : e >>> 0 === e
              ? (Ke(Pn._box_buffer, e), (r = Pn._class_uint32))
              : (_t(Pn._box_buffer, e), (r = Pn._class_double)),
            void g.mono_wasm_box_primitive_ref(r, Pn._box_buffer, 8, t.address)
          );
        }
        case "string" == typeof e:
          return void Dr(e, t);
        case "symbol" == typeof e:
          return void Tr(e, t);
        case "boolean" == typeof e:
          return (
            Ye(Pn._box_buffer, e),
            void g.mono_wasm_box_primitive_ref(
              Pn._class_boolean,
              Pn._box_buffer,
              4,
              t.address,
            )
          );
        case !0 === $e(e):
          return void (function (e, t) {
            if (!e) return t.clear(), null;
            const r = Oe(e),
              n = Ei._create_tcs(),
              o = { tcs_gc_handle: n };
            je(o, n),
              e
                .then(
                  (e) => {
                    Ei._set_tcs_result_ref(n, e);
                  },
                  (e) => {
                    Ei._set_tcs_failure(n, e ? e.toString() : "");
                  },
                )
                .finally(() => {
                  xe(r), Te(o, n);
                }),
              Ei._get_tcs_task_ref(n, t.address);
          })(e, t);
        case "Date" === e.constructor.name:
          return void Ei._create_date_time_ref(e.getTime(), t.address);
        default:
          return void $o(r, e, t);
      }
    }
    function $o(e, t, r) {
      if ((r.clear(), null != t)) {
        if (void 0 !== t[Ae]) {
          return void Ko(De(t), r.address);
        }
        if (
          (t[ke] &&
            ((function (e, t, r) {
              if (0 === e || -1 === e) return void rt(r, 0);
              Ei._get_cs_owned_object_by_js_handle_ref(e, t ? 1 : 0, r);
            })(t[ke], e, r.address),
            r.value || delete t[ke]),
          !r.value)
        ) {
          const n = t[Cn],
            o = void 0 === n ? 0 : n,
            i = Oe(t);
          Ei._create_cs_owned_proxy_ref(i, o, e ? 1 : 0, r.address);
        }
      }
    }
    function Uo(e, r) {
      if (!Po(e) || !e.BYTES_PER_ELEMENT)
        throw new Error("Object '" + e + "' is not a typed array");
      {
        const n = e[Cn],
          o = (function (e) {
            const r = e.length * e.BYTES_PER_ELEMENT,
              n = t._malloc(r),
              o = new Uint8Array(t.HEAPU8.buffer, n, r);
            return o.set(new Uint8Array(e.buffer, e.byteOffset, r)), o;
          })(e);
        g.mono_wasm_typed_array_new_ref(
          o.byteOffset,
          e.length,
          e.BYTES_PER_ELEMENT,
          n,
          r.address,
        ),
          t._free(o.byteOffset);
      }
    }
    function Bo(e) {
      const t = Rt();
      try {
        return Uo(e, t), t.value;
      } finally {
        t.release();
      }
    }
    function Wo(e, t, r) {
      if ("number" != typeof e)
        throw new Error(`Expected numeric value for enum argument, got '${e}'`);
      return 0 | e;
    }
    function zo(e, t, r) {
      const n = Mt(r);
      try {
        const r = Ne(e);
        if (p(r))
          return void Ao(t, "ERR06: Invalid JS object handle '" + e + "'", n);
        Uo(r, n);
      } catch (e) {
        Ao(t, String(e), n);
      } finally {
        n.release();
      }
    }
    const Lo = Symbol.for("wasm delegate_invoke");
    function Ho(e) {
      if (0 === e) return;
      const t = Rt(e);
      try {
        return Go(t);
      } finally {
        t.release();
      }
    }
    function Vo(e, t, r, n) {
      switch (t) {
        case 0:
          return null;
        case 26:
        case 27:
          throw new Error("int64 not available");
        case 3:
        case 29:
          return xr(e);
        case 4:
          throw new Error("no idea on how to unbox value types");
        case 5:
          return (function (e) {
            if (0 === e.value) return null;
            return (function (e) {
              let t = Me(e);
              if (t) De(t);
              else {
                t = function (...e) {
                  De(t);
                  return (0, t[Lo])(...e);
                };
                const r = Rt();
                Ko(e, r.address);
                try {
                  if (void 0 === t[Lo]) {
                    const n = g.mono_wasm_get_delegate_invoke_ref(r.address),
                      o = wi(n, bi(n, r), !0);
                    if (((t[Lo] = o.bind({ this_arg_gc_handle: e })), !t[Lo]))
                      throw new Error(
                        "System.Delegate Invoke method can not be resolved.",
                      );
                  }
                } finally {
                  r.release();
                }
                je(t, e);
              }
              return t;
            })(Ei._get_js_owned_object_gc_handle_ref(e.address));
          })(e);
        case 6:
          return (function (e) {
            if (0 === e.value) return null;
            if (!Fe)
              throw new Error(
                "Promises are not supported thus 'System.Threading.Tasks.Task' can not work in this context.",
              );
            const t = Ei._get_js_owned_object_gc_handle_ref(e.address);
            let r = Me(t);
            if (!r) {
              const n = () => Te(r, t),
                { promise: o, promise_control: i } = Pe(n, n);
              (r = o), Ei._setup_js_cont_ref(e.address, i), je(r, t);
            }
            return r;
          })(e);
        case 7:
          return (function (e) {
            if (0 === e.value) return null;
            const t = Ei._try_get_cs_owned_object_js_handle_ref(e.address, 0);
            if (t) {
              if (t === h)
                throw new Error(
                  "Cannot access a disposed JSObject at " + e.value,
                );
              return Ne(t);
            }
            const r = Ei._get_js_owned_object_gc_handle_ref(e.address);
            let n = Me(r);
            return p(n) && ((n = new mr()), je(n, r)), n;
          })(e);
        case 10:
        case 11:
        case 12:
        case 13:
        case 14:
        case 15:
        case 16:
        case 17:
        case 18:
          throw new Error("Marshaling of primitive arrays are not supported.");
        case 20:
          return new Date(Ei._get_date_value_ref(e.address));
        case 21:
        case 22:
          return Ei._object_to_string_ref(e.address);
        case 23:
          return (function (e) {
            return Ne(Ei._get_cs_owned_object_js_handle_ref(e.address, 0));
          })(e);
        case 30:
          return;
        default:
          throw new Error(
            `no idea on how to unbox object of MarshalType ${t} at offset ${e.value} (root address is ${e.address})`,
          );
      }
    }
    function qo(e, t, r) {
      if (t >= 512)
        throw new Error(
          `Got marshaling error ${t} when attempting to unbox object at address ${e.value} (root located at ${e.address})`,
        );
      let n = 0;
      if ((4 === t || 7 == t) && ((n = mt(r)), n < 1024))
        throw new Error(
          `Got invalid MonoType ${n} for object at address ${e.value} (root located at ${e.address})`,
        );
      return Vo(e, t);
    }
    function Go(e) {
      if (0 === e.value) return;
      const t = Pn._unbox_buffer,
        r = g.mono_wasm_try_unbox_primitive_and_get_type_ref(
          e.address,
          t,
          Pn._unbox_buffer_size,
        );
      switch (r) {
        case 1:
          return pt(t);
        case 25:
        case 32:
          return mt(t);
        case 24:
          return bt(t);
        case 2:
          return vt(t);
        case 8:
          return 0 !== pt(t);
        case 28:
          return String.fromCharCode(pt(t));
        case 0:
          return null;
        default:
          return qo(e, r, t);
      }
    }
    function Jo(e) {
      if (0 === e) return null;
      const t = Rt(e);
      try {
        return Xo(t);
      } finally {
        t.release();
      }
    }
    function Yo(e) {
      return Ei._is_simple_array_ref(e.address);
    }
    function Xo(e) {
      if (0 === e.value) return null;
      const t = e.address,
        r = Rt(),
        n = r.address;
      try {
        const o = g.mono_wasm_array_length(e.value),
          i = new Array(o);
        for (let e = 0; e < o; ++e)
          g.mono_wasm_array_get_ref(t, e, n),
            Yo(r) ? (i[e] = Xo(r)) : (i[e] = Go(r));
        return i;
      } finally {
        r.release();
      }
    }
    function Zo(e, t, r, n) {
      const o = Mt(t),
        i = Mt(e),
        a = Mt(n);
      try {
        const t = xr(i);
        if (!t) return void Ao(r, "Invalid name @" + i.value, a);
        const n = globalThis[t];
        if (null == n)
          return void Ao(r, "JavaScript host object '" + t + "' not found.", a);
        try {
          const e = Xo(o),
            t = function (e, t) {
              let r = [];
              (r[0] = e), t && (r = r.concat(t));
              return new (e.bind.apply(e, r))();
            },
            r = t(n, e);
          Fo(Oe(r), a, !1);
        } catch (e) {
          return void Ao(r, e, a);
        }
      } finally {
        a.release(), o.release(), i.release();
      }
    }
    function Ko(e, t) {
      e ? Ei._get_js_owned_object_by_gc_handle_ref(e, t) : rt(t, 0);
    }
    const Qo = new Map();
    function ei(e, r, n, o, i, a, s) {
      (function () {
        if (!We.length)
          throw new Error("No temp frames have been created at this point");
        Le = We.pop();
      })(),
        t.stackRestore(s),
        "object" == typeof o &&
          (o.clear(),
          null !== r && null === r.scratchResultRoot
            ? (r.scratchResultRoot = o)
            : o.release()),
        "object" == typeof i &&
          (i.clear(),
          null !== r && null === r.scratchExceptionRoot
            ? (r.scratchExceptionRoot = i)
            : i.release()),
        "object" == typeof a &&
          (a.clear(),
          null !== r && null === r.scratchThisArgRoot
            ? (r.scratchThisArgRoot = a)
            : a.release());
    }
    function ti(e, t) {
      if (!d.mono_wasm_bindings_is_ready)
        throw new Error("Assert failed: The runtime must be initialized.");
      const r = `${e}-${t}`;
      let n = Qo.get(r);
      if (void 0 === n) {
        const o = yi(e);
        void 0 === t && (t = bi(o, void 0)),
          (n = wi(o, t, !1, e)),
          Qo.set(r, n);
      }
      return n;
    }
    function ri(e, t) {
      const r = fe(e);
      "string" != typeof t && (t = bi(r, void 0));
      const n = wi(r, t, !1, "_" + e + "__entrypoint");
      return async function (...e) {
        return (
          e.length > 0 &&
            Array.isArray(e[0]) &&
            (e[0] = (function (e, t, r) {
              const n = Rt();
              t
                ? g.mono_wasm_string_array_new_ref(e.length, n.address)
                : g.mono_wasm_obj_array_new_ref(e.length, n.address);
              const o = Rt(0),
                i = n.address,
                a = o.address;
              try {
                for (let n = 0; n < e.length; ++n) {
                  let s = e[n];
                  t && (s = s.toString()),
                    Fo(s, o, r),
                    g.mono_wasm_obj_array_set_ref(i, n, a);
                }
                return n.value;
              } finally {
                Pt(n, o);
              }
            })(e[0], !0, !1)),
          n(...e)
        );
      };
    }
    function ni(e, t, r) {
      if (!d.mono_wasm_bindings_is_ready)
        throw new Error("Assert failed: The runtime must be initialized.");
      return t || (t = [[]]), ri(e, r)(...t);
    }
    function oi(e, t, r, n, o) {
      const i = Mt(r),
        a = Mt(t),
        s = Mt(o);
      try {
        const t = xr(a);
        if (!t || "string" != typeof t)
          return void Ao(n, "ERR12: Invalid method name object @" + a.value, s);
        const r = (function (e) {
          return 0 !== e && -1 !== e ? Ne(e) : null;
        })(e);
        if (p(r))
          return void Ao(
            n,
            "ERR13: Invalid JS object handle '" +
              e +
              "' while invoking '" +
              t +
              "'",
            s,
          );
        const o = Xo(i);
        try {
          const e = r[t];
          if (void 0 === e)
            throw new Error(
              "Method: '" +
                t +
                "' not found for: '" +
                Object.prototype.toString.call(r) +
                "'",
            );
          Fo(e.apply(r, o), s, !0);
        } catch (e) {
          Ao(n, e, s);
        }
      } finally {
        i.release(), a.release(), s.release();
      }
    }
    function ii(e, t, r, n) {
      const o = Mt(t),
        i = Mt(n);
      try {
        const t = xr(o);
        if (!t)
          return void Ao(
            r,
            "Invalid property name object '" + o.value + "'",
            i,
          );
        const n = Ne(e);
        if (p(n))
          return void Ao(
            r,
            "ERR01: Invalid JS object handle '" +
              e +
              "' while geting '" +
              t +
              "'",
            i,
          );
        Fo(n[t], i, !0);
      } catch (e) {
        Ao(r, e, i);
      } finally {
        i.release(), o.release();
      }
    }
    function ai(e, t, r, n, o, i, a) {
      const s = Mt(r),
        c = Mt(t),
        _ = Mt(a);
      try {
        const r = xr(c);
        if (!r)
          return void Ao(i, "Invalid property name object '" + t + "'", _);
        const a = Ne(e);
        if (p(a))
          return void Ao(
            i,
            "ERR02: Invalid JS object handle '" +
              e +
              "' while setting '" +
              r +
              "'",
            _,
          );
        let u = !1;
        const l = Go(s);
        if (n) (a[r] = l), (u = !0);
        else {
          if (((u = !1), !n && !Object.prototype.hasOwnProperty.call(a, r)))
            return void Fo(!1, _, !1);
          !0 === o
            ? Object.prototype.hasOwnProperty.call(a, r) &&
              ((a[r] = l), (u = !0))
            : ((a[r] = l), (u = !0));
        }
        Fo(u, _, !1);
      } catch (e) {
        Ao(i, e, _);
      } finally {
        _.release(), c.release(), s.release();
      }
    }
    function si(e, t, r, n) {
      const o = Mt(n);
      try {
        const n = Ne(e);
        if (p(n))
          return void Ao(
            r,
            "ERR03: Invalid JS object handle '" +
              e +
              "' while getting [" +
              t +
              "]",
            o,
          );
        Fo(n[t], o, !0);
      } catch (e) {
        Ao(r, e, o);
      } finally {
        o.release();
      }
    }
    function ci(e, t, r, n, o) {
      const i = Mt(r),
        a = Mt(o);
      try {
        const r = Ne(e);
        if (p(r))
          return void Ao(
            n,
            "ERR04: Invalid JS object handle '" +
              e +
              "' while setting [" +
              t +
              "]",
            a,
          );
        const o = Go(i);
        (r[t] = o), a.clear();
      } catch (e) {
        Ao(n, e, a);
      } finally {
        a.release(), i.release();
      }
    }
    function _i(e, n, o) {
      const i = Mt(e),
        a = Mt(o);
      try {
        const e = xr(i);
        let o;
        if (
          ((o = e
            ? "Module" == e
              ? t
              : "INTERNAL" == e
              ? r
              : globalThis[e]
            : globalThis),
          null === o || void 0 === typeof o)
        )
          return void Ao(n, "Global object '" + e + "' not found.", a);
        Fo(o, a, !0);
      } catch (e) {
        Ao(n, e, a);
      } finally {
        a.release(), i.release();
      }
    }
    function ui(e, t, r, n, o) {
      try {
        const e = globalThis.Blazor;
        if (!e)
          throw new Error("The blazor.webassembly.js library is not loaded.");
        return e._internal.invokeJSFromDotNet(t, r, n, o);
      } catch (t) {
        const r = t.message + "\n" + t.stack,
          n = Rt();
        return Dr(r, n), n.copy_to_address(e), n.release(), 0;
      }
    }
    const li = /[^A-Za-z0-9_$]/g,
      fi = new Map(),
      mi = new Map(),
      di = new Map();
    function hi(e, t, r, n) {
      let o = null,
        i = null,
        a = null;
      if (n) {
        (a = Object.keys(n)), (i = new Array(a.length));
        for (let e = 0, t = a.length; e < t; e++) i[e] = n[a[e]];
      }
      return (
        (o = (function (e, t, r, n) {
          const o = '"use strict";\r\n';
          let i = "",
            a = "";
          e
            ? ((i =
                "//# sourceURL=https://dotnet.generated.invalid/" + e + "\r\n"),
              (a = e))
            : (a = "unnamed");
          let s =
            "function " + a + "(" + t.join(", ") + ") {\r\n" + r + "\r\n};\r\n";
          const c = /\r(\n?)/g;
          s = i + o + s.replace(c, "\r\n    ") + `    return ${a};\r\n`;
          let _ = null,
            u = null;
          return (
            (u = n ? n.concat([s]) : [s]), (_ = Function.apply(Function, u)), _
          );
        })(e, t, r, a).apply(null, i)),
        o
      );
    }
    function pi(e) {
      let t = mi.get(e);
      return (
        t ||
          ((t = (function (e) {
            const t = [];
            let r = 0,
              n = !1,
              o = !1,
              i = -1,
              a = !1;
            for (let s = 0; s < e.length; ++s) {
              const c = e[s];
              if (s === e.length - 1) {
                if ("!" === c) {
                  n = !0;
                  continue;
                }
                "m" === c && ((o = !0), (i = e.length - 1));
              } else if ("!" === c)
                throw new Error("! must be at the end of the signature");
              const _ = fi.get(c);
              if (!_) throw new Error("Unknown parameter type " + c);
              const u = Object.create(_.steps[0]);
              (u.size = _.size),
                _.needs_root && (a = !0),
                (u.needs_root = _.needs_root),
                (u.key = c),
                t.push(u),
                (r += _.size);
            }
            return {
              steps: t,
              size: r,
              args_marshal: e,
              is_result_definitely_unmarshaled: n,
              is_result_possibly_unmarshaled: o,
              result_unmarshaled_if_argc: i,
              needs_root_buffer: a,
            };
          })(e)),
          mi.set(e, t)),
        t
      );
    }
    function wi(e, r, n, o) {
      if ("string" != typeof r)
        throw new Error("args_marshal argument invalid, expected string");
      const i = `managed_${e}_${r}`;
      let a = di.get(i);
      if (a) return a;
      o || (o = i);
      let s = null;
      "string" == typeof r &&
        (s = (function (e) {
          const r = pi(e);
          if ("string" != typeof r.args_marshal)
            throw new Error("Corrupt converter for '" + e + "'");
          if (r.compiled_function && r.compiled_variadic_function) return r;
          const n = e.replace("!", "_result_unmarshaled");
          r.name = n;
          let o = [],
            i = ["method"];
          const a = {
            Module: t,
            setI32: nt,
            setU32: Qe,
            setF32: ct,
            setF64: _t,
            setU52: at,
            setI52: it,
            setB32: Ye,
            setI32_unchecked: rt,
            setU32_unchecked: Ke,
            scratchValueRoot: r.scratchValueRoot,
            stackAlloc: t.stackAlloc,
            _zero_region: Je,
          };
          let s = 0;
          const c = 8 * (((4 * e.length + 7) / 8) | 0),
            _ = r.size + 4 * e.length + 16;
          o.push(
            "if (!method) throw new Error('no method provided');",
            `const buffer = stackAlloc(${_});`,
            `_zero_region(buffer, ${_});`,
            `const indirectStart = buffer + ${c};`,
            "",
          );
          for (let e = 0; e < r.steps.length; e++) {
            const n = r.steps[e],
              c = "step" + e,
              _ = "value" + e,
              u = "arg" + e,
              l = `(indirectStart + ${s})`;
            if ((i.push(u), n.convert_root)) {
              if (n.indirect)
                throw new Error(
                  "Assert failed: converter step cannot both be rooted and indirect",
                );
              if (!r.scratchValueRoot) {
                const e = t.stackSave();
                (r.scratchValueRoot = Mt(e)),
                  (a.scratchValueRoot = r.scratchValueRoot);
              }
              (a[c] = n.convert_root),
                o.push(`scratchValueRoot._set_address(${l});`),
                o.push(`${c}(${u}, scratchValueRoot);`),
                n.byref
                  ? o.push(`let ${_} = ${l};`)
                  : o.push(`let ${_} = scratchValueRoot.value;`);
            } else
              n.convert
                ? ((a[c] = n.convert),
                  o.push(`let ${_} = ${c}(${u}, method, ${e});`))
                : o.push(`let ${_} = ${u};`);
            if (
              (n.needs_root &&
                !n.convert_root &&
                (o.push(
                  "if (!rootBuffer) throw new Error('no root buffer provided');",
                ),
                o.push(`rootBuffer.set (${e}, ${_});`)),
              n.indirect)
            ) {
              switch (n.indirect) {
                case "bool":
                  o.push(`setB32(${l}, ${_});`);
                  break;
                case "u32":
                  o.push(`setU32(${l}, ${_});`);
                  break;
                case "i32":
                  o.push(`setI32(${l}, ${_});`);
                  break;
                case "float":
                  o.push(`setF32(${l}, ${_});`);
                  break;
                case "double":
                  o.push(`setF64(${l}, ${_});`);
                  break;
                case "i52":
                  o.push(`setI52(${l}, ${_});`);
                  break;
                case "u52":
                  o.push(`setU52(${l}, ${_});`);
                  break;
                default:
                  throw new Error("Unimplemented indirect type: " + n.indirect);
              }
              o.push(`setU32_unchecked(buffer + (${e} * 4), ${l});`),
                (s += n.size);
            } else
              o.push(`setU32_unchecked(buffer + (${e} * 4), ${_});`), (s += 4);
            o.push("");
          }
          o.push("return buffer;");
          let u = o.join("\r\n"),
            l = null,
            f = null;
          try {
            (l = hi("converter_" + n, i, u, a)), (r.compiled_function = l);
          } catch (e) {
            throw (
              ((r.compiled_function = null),
              console.warn(
                "MONO_WASM: compiling converter failed for",
                u,
                "with error",
                e,
              ),
              e)
            );
          }
          i = ["method", "args"];
          const m = { converter: l };
          o = ["return converter(", "  method,"];
          for (let e = 0; e < r.steps.length; e++)
            o.push("  args[" + e + (e == r.steps.length - 1 ? "]" : "], "));
          o.push(");"), (u = o.join("\r\n"));
          try {
            (f = hi("variadic_converter_" + n, i, u, m)),
              (r.compiled_variadic_function = f);
          } catch (e) {
            throw (
              ((r.compiled_variadic_function = null),
              console.warn(
                "MONO_WASM: compiling converter failed for",
                u,
                "with error",
                e,
              ),
              e)
            );
          }
          return (r.scratchRootBuffer = null), (r.scratchBuffer = 0), r;
        })(r));
      const c = t._malloc(128),
        _ = {
          method: e,
          converter: s,
          scratchRootBuffer: null,
          scratchBuffer: 0,
          scratchResultRoot: Rt(),
          scratchExceptionRoot: Rt(),
          scratchThisArgRoot: Rt(),
        },
        u = {
          Module: t,
          mono_wasm_new_root: Rt,
          get_js_owned_object_by_gc_handle_ref: Ko,
          _create_temp_frame: qe,
          _handle_exception_for_call: gi,
          _teardown_after_call: ei,
          mono_wasm_try_unbox_primitive_and_get_type_ref:
            g.mono_wasm_try_unbox_primitive_and_get_type_ref,
          _unbox_mono_obj_root_with_known_nonprimitive_type: qo,
          invoke_method_ref: g.mono_wasm_invoke_method_ref,
          method: e,
          token: _,
          unbox_buffer: c,
          unbox_buffer_size: 128,
          getB32: ut,
          getI32: pt,
          getU32: mt,
          getF32: bt,
          getF64: vt,
          stackSave: t.stackSave,
        },
        l = s ? "converter_" + s.name : "";
      s && (u[l] = s);
      const f = [],
        m = [
          "_create_temp_frame();",
          "let resultRoot = token.scratchResultRoot, exceptionRoot = token.scratchExceptionRoot, thisArgRoot = token.scratchThisArgRoot , sp = stackSave();",
          "token.scratchResultRoot = null;",
          "token.scratchExceptionRoot = null;",
          "token.scratchThisArgRoot = null;",
          "if (resultRoot === null)",
          "\tresultRoot = mono_wasm_new_root ();",
          "if (exceptionRoot === null)",
          "\texceptionRoot = mono_wasm_new_root ();",
          "if (thisArgRoot === null)",
          "\tthisArgRoot = mono_wasm_new_root ();",
          "",
        ];
      if (s) {
        m.push(`let buffer = ${l}.compiled_function(`, "    method,");
        for (let e = 0; e < s.steps.length; e++) {
          const t = "arg" + e;
          f.push(t), m.push("    " + t + (e == s.steps.length - 1 ? "" : ", "));
        }
        m.push(");");
      } else m.push("let buffer = 0;");
      if (
        (s && s.is_result_definitely_unmarshaled
          ? m.push("let is_result_marshaled = false;")
          : s && s.is_result_possibly_unmarshaled
          ? m.push(
              `let is_result_marshaled = arguments.length !== ${s.result_unmarshaled_if_argc};`,
            )
          : m.push("let is_result_marshaled = true;"),
        m.push("", "", ""),
        n
          ? (m.push(
              "get_js_owned_object_by_gc_handle_ref(this.this_arg_gc_handle, thisArgRoot.address);",
            ),
            m.push(
              "invoke_method_ref (method, thisArgRoot.address, buffer, exceptionRoot.address, resultRoot.address);",
            ))
          : m.push(
              "invoke_method_ref (method, 0, buffer, exceptionRoot.address, resultRoot.address);",
            ),
        m.push(
          `_handle_exception_for_call (${l}, token, buffer, resultRoot, exceptionRoot, thisArgRoot, sp);`,
          "",
          "let resultPtr = resultRoot.value, result = undefined;",
        ),
        !s)
      )
        throw new Error("No converter");
      s.is_result_possibly_unmarshaled && m.push("if (!is_result_marshaled) "),
        (s.is_result_definitely_unmarshaled ||
          s.is_result_possibly_unmarshaled) &&
          m.push("    result = resultPtr;"),
        s.is_result_definitely_unmarshaled ||
          m.push(
            "if (is_result_marshaled) {",
            "    let resultType = mono_wasm_try_unbox_primitive_and_get_type_ref (resultRoot.address, unbox_buffer, unbox_buffer_size);",
            "    switch (resultType) {",
            "    case 1:",
            "        result = getI32(unbox_buffer); break;",
            "    case 32:",
            "    case 25:",
            "        result = getU32(unbox_buffer); break;",
            "    case 24:",
            "        result = getF32(unbox_buffer); break;",
            "    case 2:",
            "        result = getF64(unbox_buffer); break;",
            "    case 8:",
            "        result = getB32(unbox_buffer); break;",
            "    case 28:",
            "        result = String.fromCharCode(getI32(unbox_buffer)); break;",
            "    case 0:",
            "        result = null; break;",
            "    default:",
            "        result = _unbox_mono_obj_root_with_known_nonprimitive_type (resultRoot, resultType, unbox_buffer); break;",
            "    }",
            "}",
          );
      let d = o.replace(li, "_");
      n && (d += "_this"),
        m.push(
          `_teardown_after_call (${l}, token, buffer, resultRoot, exceptionRoot, thisArgRoot, sp);`,
          "return result;",
        );
      return (a = hi(d, f, m.join("\r\n"), u)), di.set(i, a), a;
    }
    function gi(e, t, r, n, o, i, a) {
      const s = (function (e, t) {
        if (0 === t.value) return null;
        const r = xr(e);
        return new Error(r);
      })(n, o);
      if (s) throw (ei(0, t, 0, n, o, i, a), s);
    }
    function yi(e) {
      const { assembly: t, namespace: r, classname: n, methodname: o } = To(e),
        i = g.mono_wasm_assembly_load(t);
      if (!i) throw new Error("Could not find assembly: " + t);
      const a = g.mono_wasm_assembly_find_class(i, r, n);
      if (!a)
        throw new Error(
          "Could not find class: " + r + ":" + n + " in assembly " + t,
        );
      const s = g.mono_wasm_assembly_find_method(a, o, -1);
      if (!s) throw new Error("Could not find method: " + o);
      return s;
    }
    function bi(e, t) {
      return Ei._get_call_sig_ref(e, t ? t.address : Pn._null_root.address);
    }
    const vi = [
        [
          !0,
          "_get_cs_owned_object_by_js_handle_ref",
          "GetCSOwnedObjectByJSHandleRef",
          "iim",
        ],
        [
          !0,
          "_get_cs_owned_object_js_handle_ref",
          "GetCSOwnedObjectJSHandleRef",
          "mi",
        ],
        [
          !0,
          "_try_get_cs_owned_object_js_handle_ref",
          "TryGetCSOwnedObjectJSHandleRef",
          "mi",
        ],
        [!1, "_create_cs_owned_proxy_ref", "CreateCSOwnedProxyRef", "iiim"],
        [
          !1,
          "_get_js_owned_object_by_gc_handle_ref",
          "GetJSOwnedObjectByGCHandleRef",
          "im",
        ],
        [
          !0,
          "_get_js_owned_object_gc_handle_ref",
          "GetJSOwnedObjectGCHandleRef",
          "m",
        ],
        [!0, "_create_tcs", "CreateTaskSource", ""],
        [!0, "_set_tcs_result_ref", "SetTaskSourceResultRef", "iR"],
        [!0, "_set_tcs_failure", "SetTaskSourceFailure", "is"],
        [!0, "_get_tcs_task_ref", "GetTaskSourceTaskRef", "im"],
        [!0, "_setup_js_cont_ref", "SetupJSContinuationRef", "mo"],
        [!0, "_object_to_string_ref", "ObjectToStringRef", "m"],
        [!0, "_get_date_value_ref", "GetDateValueRef", "m"],
        [!0, "_create_date_time_ref", "CreateDateTimeRef", "dm"],
        [!0, "_create_uri_ref", "CreateUriRef", "sm"],
        [!0, "_is_simple_array_ref", "IsSimpleArrayRef", "m"],
        [!1, "_get_call_sig_ref", "GetCallSignatureRef", "im"],
      ],
      Ei = {};
    function Si(e, t) {
      return wi(
        (function (e) {
          const t = g.mono_wasm_assembly_find_method(
            Pn.runtime_legacy_exports_class,
            e,
            -1,
          );
          if (!t)
            throw (
              "Can't find method " +
              d.runtime_interop_namespace +
              "." +
              Pn.runtime_legacy_exports_classname +
              "." +
              e
            );
          return t;
        })(e),
        t,
        !1,
        "BINDINGS_" + e,
      );
    }
    function Ai() {
      (Object.prototype[Cn] = 0),
        (Array.prototype[Cn] = 1),
        (ArrayBuffer.prototype[Cn] = 2),
        (DataView.prototype[Cn] = 3),
        (Function.prototype[Cn] = 4),
        (Uint8Array.prototype[Cn] = 11);
      if (
        ((Pn._unbox_buffer_size = 65536),
        (Pn._box_buffer = t._malloc(65536)),
        (Pn._unbox_buffer = t._malloc(Pn._unbox_buffer_size)),
        (Pn._class_int32 = re("System", "Int32")),
        (Pn._class_uint32 = re("System", "UInt32")),
        (Pn._class_double = re("System", "Double")),
        (Pn._class_boolean = re("System", "Boolean")),
        (Pn._null_root = Rt()),
        (function () {
          const e = fi;
          e.set("m", { steps: [{}], size: 0 }),
            e.set("s", {
              steps: [{ convert_root: Dr.bind(Rn) }],
              size: 0,
              needs_root: !0,
            }),
            e.set("S", {
              steps: [{ convert_root: Tr.bind(Rn) }],
              size: 0,
              needs_root: !0,
            }),
            e.set("o", {
              steps: [{ convert_root: Fo.bind(Rn) }],
              size: 0,
              needs_root: !0,
            }),
            e.set("u", {
              steps: [{ convert_root: Co.bind(Rn, !1) }],
              size: 0,
              needs_root: !0,
            }),
            e.set("R", {
              steps: [{ convert_root: Fo.bind(Rn), byref: !0 }],
              size: 0,
              needs_root: !0,
            }),
            e.set("j", {
              steps: [{ convert: Wo.bind(Rn), indirect: "i32" }],
              size: 8,
            }),
            e.set("b", { steps: [{ indirect: "bool" }], size: 8 }),
            e.set("i", { steps: [{ indirect: "i32" }], size: 8 }),
            e.set("I", { steps: [{ indirect: "u32" }], size: 8 }),
            e.set("l", { steps: [{ indirect: "i52" }], size: 8 }),
            e.set("L", { steps: [{ indirect: "u52" }], size: 8 }),
            e.set("f", { steps: [{ indirect: "float" }], size: 8 }),
            e.set("d", { steps: [{ indirect: "double" }], size: 8 });
        })(),
        (Pn.runtime_legacy_exports_classname = "LegacyExports"),
        (Pn.runtime_legacy_exports_class = g.mono_wasm_assembly_find_class(
          d.runtime_interop_module,
          d.runtime_interop_namespace,
          Pn.runtime_legacy_exports_classname,
        )),
        !Pn.runtime_legacy_exports_class)
      )
        throw (
          "Can't find " +
          d.runtime_interop_namespace +
          "." +
          d.runtime_interop_exports_classname +
          " class"
        );
      for (const e of vi) {
        const t = Ei,
          [r, n, o, i] = e;
        if (r)
          t[n] = function (...e) {
            const r = Si(o, i);
            return (t[n] = r), r(...e);
          };
        else {
          const e = Si(o, i);
          t[n] = e;
        }
      }
    }
    function ki() {
      return (
        "undefined" != typeof Response &&
        "body" in Response.prototype &&
        "function" == typeof ReadableStream
      );
    }
    function Ni() {
      return new AbortController();
    }
    function Oi(e) {
      e.abort();
    }
    function xi(e) {
      e.__abort_controller.abort(),
        e.__reader &&
          e.__reader.cancel().catch((e) => {
            e &&
              "AbortError" !== e.name &&
              t.printErr("MONO_WASM: Error in http_wasm_abort_response: " + e);
          });
    }
    function ji(e, t, r, n, o, i, a, s) {
      return Ti(e, t, r, n, o, i, new wr(a, s, 0).slice());
    }
    function Ti(e, t, r, n, o, i, a) {
      if (!e || "string" != typeof e)
        throw new Error("Assert failed: expected url string");
      if (
        !(
          t &&
          r &&
          Array.isArray(t) &&
          Array.isArray(r) &&
          t.length === r.length
        )
      )
        throw new Error(
          "Assert failed: expected headerNames and headerValues arrays",
        );
      if (
        !(
          n &&
          o &&
          Array.isArray(n) &&
          Array.isArray(o) &&
          n.length === o.length
        )
      )
        throw new Error(
          "Assert failed: expected headerNames and headerValues arrays",
        );
      const s = new Headers();
      for (let e = 0; e < t.length; e++) s.append(t[e], r[e]);
      const c = { body: a, headers: s, signal: i.signal };
      for (let e = 0; e < n.length; e++) c[n[e]] = o[e];
      return Ue(async () => {
        const t = await fetch(e, c);
        return (t.__abort_controller = i), t;
      });
    }
    function Di(e) {
      if (!e.__headerNames) {
        (e.__headerNames = []), (e.__headerValues = []);
        const t = e.headers.entries();
        for (const r of t)
          e.__headerNames.push(r[0]), e.__headerValues.push(r[1]);
      }
    }
    function Mi(e) {
      return Di(e), e.__headerNames;
    }
    function Ri(e) {
      return Di(e), e.__headerValues;
    }
    function Pi(e) {
      return Ue(async () => {
        const t = await e.arrayBuffer();
        return (e.__buffer = t), (e.__source_offset = 0), t.byteLength;
      });
    }
    function Ci(e, t) {
      if (!e.__buffer)
        throw new Error("Assert failed: expected resoved arrayBuffer");
      if (e.__source_offset == e.__buffer.byteLength) return 0;
      const r = new Uint8Array(e.__buffer, e.__source_offset);
      t.set(r, 0);
      const n = Math.min(t.byteLength, r.byteLength);
      return (e.__source_offset += n), n;
    }
    function Ii(e, t, r) {
      const n = new wr(t, r, 0);
      return Ue(async () => {
        if (
          (e.__reader || (e.__reader = e.body.getReader()),
          e.__chunk ||
            ((e.__chunk = await e.__reader.read()), (e.__source_offset = 0)),
          e.__chunk.done)
        )
          return 0;
        const t = e.__chunk.value.byteLength - e.__source_offset;
        if (!(t > 0))
          throw new Error(
            "Assert failed: expected remaining_source to be greater than 0",
          );
        const r = Math.min(t, n.byteLength),
          o = e.__chunk.value.subarray(
            e.__source_offset,
            e.__source_offset + r,
          );
        return (
          n.set(o, 0),
          (e.__source_offset += r),
          t == r && (e.__chunk = void 0),
          r
        );
      });
    }
    let Fi,
      $i = 0,
      Ui = !1,
      Bi = 0;
    if (globalThis.navigator) {
      const e = globalThis.navigator;
      e.userAgentData && e.userAgentData.brands
        ? (Ui = e.userAgentData.brands.some((e) => "Chromium" == e.brand))
        : e.userAgent && (Ui = e.userAgent.includes("Chrome"));
    }
    function Wi() {
      for (; Bi > 0; ) --Bi, g.mono_background_exec();
    }
    function zi() {
      if (!Ui) return;
      const e = new Date().valueOf(),
        t = e + 36e4;
      for (let r = Math.max(e + 1e3, $i); r < t; r += 1e3) {
        setTimeout(() => {
          g.mono_set_timeout_exec(), Bi++, Wi();
        }, r - e);
      }
      $i = t;
    }
    function Li() {
      ++Bi, setTimeout(Wi, 0);
    }
    function Hi(e) {
      Fi && (clearTimeout(Fi), (Fi = void 0)),
        (Fi = setTimeout(function () {
          g.mono_set_timeout_exec();
        }, e));
    }
    class Vi {
      constructor() {
        (this.queue = []), (this.offset = 0);
      }
      getLength() {
        return this.queue.length - this.offset;
      }
      isEmpty() {
        return 0 == this.queue.length;
      }
      enqueue(e) {
        this.queue.push(e);
      }
      dequeue() {
        if (0 === this.queue.length) return;
        const e = this.queue[this.offset];
        return (
          (this.queue[this.offset] = null),
          2 * ++this.offset >= this.queue.length &&
            ((this.queue = this.queue.slice(this.offset)), (this.offset = 0)),
          e
        );
      }
      peek() {
        return this.queue.length > 0 ? this.queue[this.offset] : void 0;
      }
      drain(e) {
        for (; this.getLength(); ) {
          e(this.dequeue());
        }
      }
    }
    const qi = Symbol.for("wasm ws_pending_send_buffer"),
      Gi = Symbol.for("wasm ws_pending_send_buffer_offset"),
      Ji = Symbol.for("wasm ws_pending_send_buffer_type"),
      Yi = Symbol.for("wasm ws_pending_receive_event_queue"),
      Xi = Symbol.for("wasm ws_pending_receive_promise_queue"),
      Zi = Symbol.for("wasm ws_pending_open_promise"),
      Ki = Symbol.for("wasm ws_pending_close_promises"),
      Qi = Symbol.for("wasm ws_pending_send_promises"),
      ea = Symbol.for("wasm ws_is_aborted"),
      ta = Symbol.for("wasm ws_receive_status_ptr");
    let ra,
      na,
      oa = !1;
    const ia = new Uint8Array();
    function aa(e, t, r, n) {
      if (!e || "string" != typeof e)
        throw new Error("Assert failed: ERR12: Invalid uri " + typeof e);
      const o = new globalThis.WebSocket(e, t || void 0),
        { promise_control: i } = Pe();
      (o[Yi] = new Vi()),
        (o[Xi] = new Vi()),
        (o[Zi] = i),
        (o[Qi] = []),
        (o[Ki] = []),
        (o[ta] = r),
        (o.binaryType = "arraybuffer");
      const a = (e) => {
        o[ea] ||
          ((function (e, t) {
            const r = e[Yi],
              n = e[Xi];
            if ("string" == typeof t.data)
              void 0 === na && (na = new TextEncoder()),
                r.enqueue({ type: 0, data: na.encode(t.data), offset: 0 });
            else {
              if ("ArrayBuffer" !== t.data.constructor.name)
                throw new Error(
                  "ERR19: WebSocket receive expected ArrayBuffer",
                );
              r.enqueue({ type: 1, data: new Uint8Array(t.data), offset: 0 });
            }
            if (n.getLength() && r.getLength() > 1)
              throw new Error("ERR21: Invalid WS state");
            for (; n.getLength() && r.getLength(); ) {
              const t = n.dequeue();
              fa(e, r, t.buffer_ptr, t.buffer_length), t.resolve();
            }
            zi();
          })(o, e),
          zi());
      };
      return (
        o.addEventListener("message", a),
        o.addEventListener(
          "open",
          () => {
            o[ea] || (i.resolve(o), zi());
          },
          { once: !0 },
        ),
        o.addEventListener(
          "close",
          (e) => {
            if ((o.removeEventListener("message", a), o[ea])) return;
            n && n(e.code, e.reason), i.reject(e.reason);
            for (const e of o[Ki]) e.resolve();
            o[Xi].drain((e) => {
              nt(r, 0), nt(r + 4, 2), nt(r + 8, 1), e.resolve();
            });
          },
          { once: !0 },
        ),
        o.addEventListener(
          "error",
          (e) => {
            i.reject(e.message || "WebSocket error");
          },
          { once: !0 },
        ),
        o
      );
    }
    function sa(e) {
      if (!e) throw new Error("Assert failed: ERR17: expected ws instance");
      return e[Zi].promise;
    }
    function ca(e, r, n, o, i) {
      if (!e) throw new Error("Assert failed: ERR17: expected ws instance");
      const a = (function (e, t, r, n) {
        let o = e[qi],
          i = 0;
        const a = t.byteLength;
        if (o) {
          if (((i = e[Gi]), (r = e[Ji]), 0 !== a)) {
            if (i + a > o.length) {
              const r = new Uint8Array(1.5 * (i + a + 50));
              r.set(o, 0), r.subarray(i).set(t), (e[qi] = o = r);
            } else o.subarray(i).set(t);
            (i += a), (e[Gi] = i);
          }
        } else
          n
            ? 0 !== a && ((o = t), (i = a))
            : (0 !== a && ((o = t.slice()), (i = a), (e[Gi] = i), (e[qi] = o)),
              (e[Ji] = r));
        if (n) {
          if (0 == i || null == o) return ia;
          if (0 === r) {
            void 0 === ra && (ra = new TextDecoder("utf-8", { fatal: !1 }));
            const e =
              "undefined" != typeof SharedArrayBuffer &&
              o instanceof SharedArrayBuffer
                ? o.slice(0, i)
                : o.subarray(0, i);
            return ra.decode(e);
          }
          return o.subarray(0, i);
        }
        return null;
      })(e, new Uint8Array(t.HEAPU8.buffer, r, n), o, i);
      return i && a
        ? (function (e, t) {
            if ((e.send(t), (e[qi] = null), e.bufferedAmount < 65536))
              return null;
            const { promise: r, promise_control: n } = Pe(),
              o = e[Qi];
            o.push(n);
            let i = 1;
            const a = () => {
              if (0 === e.bufferedAmount) n.resolve();
              else if (e.readyState != WebSocket.OPEN)
                n.reject("InvalidState: The WebSocket is not connected.");
              else if (!n.isDone)
                return (
                  globalThis.setTimeout(a, i), void (i = Math.min(1.5 * i, 1e3))
                );
              const t = o.indexOf(n);
              t > -1 && o.splice(t, 1);
            };
            return globalThis.setTimeout(a, 0), r;
          })(e, a)
        : null;
    }
    function _a(e, t, r) {
      if (!e) throw new Error("Assert failed: ERR18: expected ws instance");
      const n = e[Yi],
        o = e[Xi],
        i = e.readyState;
      if (i != WebSocket.OPEN && i != WebSocket.CLOSING)
        throw new Error("InvalidState: The WebSocket is not connected.");
      if (n.getLength()) {
        if (0 != o.getLength())
          throw new Error("Assert failed: ERR20: Invalid WS state");
        return fa(e, n, t, r), null;
      }
      const { promise: a, promise_control: s } = Pe(),
        c = s;
      return (c.buffer_ptr = t), (c.buffer_length = r), o.enqueue(c), a;
    }
    function ua(e, t, r, n) {
      if (!e) throw new Error("Assert failed: ERR19: expected ws instance");
      if (e.readyState == WebSocket.CLOSED) return null;
      if (n) {
        const { promise: n, promise_control: o } = Pe();
        return (
          e[Ki].push(o), "string" == typeof r ? e.close(t, r) : e.close(t), n
        );
      }
      return (
        oa ||
          ((oa = !0),
          console.warn(
            "WARNING: Web browsers do not support closing the output side of a WebSocket. CloseOutputAsync has closed the socket and discarded any incoming messages.",
          )),
        "string" == typeof r ? e.close(t, r) : e.close(t),
        null
      );
    }
    function la(e) {
      if (!e) throw new Error("Assert failed: ERR18: expected ws instance");
      e[ea] = !0;
      const t = e[Zi];
      t && t.reject("OperationCanceledException");
      for (const t of e[Ki]) t.reject("OperationCanceledException");
      for (const t of e[Qi]) t.reject("OperationCanceledException");
      e[Xi].drain((e) => {
        e.reject("OperationCanceledException");
      }),
        e.close(1e3, "Connection was aborted.");
    }
    function fa(e, r, n, o) {
      const i = r.peek(),
        a = Math.min(o, i.data.length - i.offset);
      if (a > 0) {
        const e = i.data.subarray(i.offset, i.offset + a);
        new Uint8Array(t.HEAPU8.buffer, n, o).set(e, 0), (i.offset += a);
      }
      const s = i.data.length === i.offset ? 1 : 0;
      s && r.dequeue();
      const c = e[ta];
      nt(c, a), nt(c + 4, i.type), nt(c + 8, s);
    }
    function ma() {
      return {
        mono_wasm_exit: (e) => {
          t.printErr("MONO_WASM: early exit " + e);
        },
        mono_wasm_enable_on_demand_gc: g.mono_wasm_enable_on_demand_gc,
        mono_profiler_init_aot: g.mono_profiler_init_aot,
        mono_wasm_exec_regression: g.mono_wasm_exec_regression,
        mono_method_resolve: yi,
        mono_intern_string: jr,
        logging: void 0,
        mono_wasm_stringify_as_error_with_stack: ae,
        mono_wasm_get_loaded_files: no,
        mono_wasm_send_dbg_command_with_parms: M,
        mono_wasm_send_dbg_command: R,
        mono_wasm_get_dbg_command_info: P,
        mono_wasm_get_details: z,
        mono_wasm_release_object: H,
        mono_wasm_call_function_on: W,
        mono_wasm_debugger_resume: C,
        mono_wasm_detach_debugger: I,
        mono_wasm_raise_debug_event: $,
        mono_wasm_change_debugger_log_level: F,
        mono_wasm_debugger_attached: U,
        mono_wasm_runtime_is_ready: d.mono_wasm_runtime_is_ready,
        get_property: wo,
        set_property: po,
        has_property: go,
        get_typeof_property: yo,
        get_global_this: bo,
        get_dotnet_instance: () => _,
        dynamic_import: So,
        mono_wasm_cancel_promise: Be,
        ws_wasm_create: aa,
        ws_wasm_open: sa,
        ws_wasm_send: ca,
        ws_wasm_receive: _a,
        ws_wasm_close: ua,
        ws_wasm_abort: la,
        http_wasm_supports_streaming_response: ki,
        http_wasm_create_abort_controler: Ni,
        http_wasm_abort_request: Oi,
        http_wasm_abort_response: xi,
        http_wasm_fetch: Ti,
        http_wasm_fetch_bytes: ji,
        http_wasm_get_response_header_names: Mi,
        http_wasm_get_response_header_values: Ri,
        http_wasm_get_response_bytes: Ci,
        http_wasm_get_response_length: Pi,
        http_wasm_get_streamed_response_bytes: Ii,
      };
    }
    function da() {}
    let ha,
      pa = !1,
      wa = !1;
    const ga = Pe(),
      ya = Pe(),
      ba = Pe(),
      va = Pe(),
      Ea = Pe(),
      Sa = Pe(),
      Aa = Pe(),
      ka = Pe(),
      Na = Pe();
    function Oa(e, t) {
      const r = e.instantiateWasm,
        n = e.preInit
          ? "function" == typeof e.preInit
            ? [e.preInit]
            : e.preInit
          : [],
        o = e.preRun
          ? "function" == typeof e.preRun
            ? [e.preRun]
            : e.preRun
          : [],
        i = e.postRun
          ? "function" == typeof e.postRun
            ? [e.postRun]
            : e.postRun
          : [],
        a = e.onRuntimeInitialized ? e.onRuntimeInitialized : () => {};
      (wa = !(
        e.configSrc ||
        (e.config &&
          e.config.assets &&
          -1 != e.config.assets.findIndex((e) => "assembly" === e.behavior))
      )),
        (e.instantiateWasm = (e, t) => xa(e, t, r)),
        (e.preInit = [() => ja(n)]),
        (e.preRun = [() => Ta(o)]),
        (e.onRuntimeInitialized = () =>
          (async function (e) {
            await Sa.promise,
              d.diagnosticTracing &&
                console.debug("MONO_WASM: onRuntimeInitialized"),
              Aa.promise_control.resolve();
            try {
              wa ||
                (await ro(),
                await (async function () {
                  d.diagnosticTracing &&
                    console.debug(
                      "MONO_WASM: mono_wasm_before_user_runtime_initialized",
                    );
                  try {
                    await (async function () {
                      try {
                        Pa(
                          "TZ",
                          Intl.DateTimeFormat().resolvedOptions().timeZone ||
                            "UTC",
                        );
                      } catch (e) {
                        Pa("TZ", "UTC");
                      }
                      for (const e in ha.environmentVariables) {
                        const t = ha.environmentVariables[e];
                        if ("string" != typeof t)
                          throw new Error(
                            `Expected environment variable '${e}' to be a string but it was ${typeof t}: '${t}'`,
                          );
                        Pa(e, t);
                      }
                      ha.runtimeOptions && Ca(ha.runtimeOptions),
                        ha.aotProfilerOptions && X(ha.aotProfilerOptions),
                        ha.coverageProfilerOptions &&
                          Z(ha.coverageProfilerOptions);
                    })(),
                      Y(),
                      d.mono_wasm_load_runtime_done ||
                        Ia("unused", ha.debugLevel),
                      d.mono_wasm_runtime_is_ready || x(),
                      d.mono_wasm_symbols_are_ready || _e("dotnet.js.symbols"),
                      setTimeout(() => {
                        kr.init_fields();
                      });
                  } catch (e) {
                    throw (
                      (Ra(
                        "MONO_WASM: Error in mono_wasm_before_user_runtime_initialized",
                        e,
                      ),
                      e)
                    );
                  }
                })()),
                ha.runtimeOptions && Ca(ha.runtimeOptions);
              try {
                e();
              } catch (e) {
                throw (
                  (Ra(
                    "MONO_WASM: user callback onRuntimeInitialized() failed",
                    e,
                  ),
                  e)
                );
              }
              await Ma();
            } catch (e) {
              throw (
                (Ra("MONO_WASM: onRuntimeInitializedAsync() failed", e),
                Da(e, !0),
                e)
              );
            }
            ka.promise_control.resolve();
          })(a)),
        (e.postRun = [
          () =>
            (async function (e) {
              await ka.promise,
                d.diagnosticTracing && console.debug("MONO_WASM: postRunAsync");
              try {
                e.map((e) => e());
              } catch (e) {
                throw (
                  (Ra("MONO_WASM: user callback posRun() failed", e),
                  Da(e, !0),
                  e)
                );
              }
              Na.promise_control.resolve();
            })(i),
        ]),
        e.ready
          .then(async () => {
            await Na.promise, ga.promise_control.resolve(t);
          })
          .catch((e) => {
            ga.promise_control.reject(e);
          }),
        (e.ready = ga.promise),
        e.onAbort || (e.onAbort = () => me);
    }
    function xa(e, r, n) {
      if (
        (t.configSrc ||
          t.config ||
          n ||
          t.print("MONO_WASM: configSrc nor config was specified"),
        (ha = t.config ? (d.config = t.config) : (d.config = t.config = {})),
        (d.diagnosticTracing = !!ha.diagnosticTracing),
        n)
      ) {
        return n(e, (e, t) => {
          ba.promise_control.resolve(), r(e, t);
        });
      }
      return (
        (async function (e, r) {
          try {
            await Fa(t.configSrc),
              d.diagnosticTracing &&
                console.debug("MONO_WASM: instantiate_wasm_module");
            const n = (function (e) {
              var t;
              const r =
                null === (t = d.config.assets) || void 0 === t
                  ? void 0
                  : t.find((t) => t.behavior == e);
              if (!r)
                throw new Error(`Assert failed: Can't find asset for ${e}`);
              return r.resolvedUrl || (r.resolvedUrl = Kn(r, "")), r;
            })("dotnetwasm");
            await Xn(n, !1),
              await va.promise,
              t.addRunDependency("instantiate_wasm_module"),
              (async function (e, t, r) {
                if (
                  !(
                    e &&
                    e.pendingDownloadInternal &&
                    e.pendingDownloadInternal.response
                  )
                )
                  throw new Error("Assert failed: Can't load dotnet.wasm");
                const n = await e.pendingDownloadInternal.response,
                  o =
                    n.headers && n.headers.get
                      ? n.headers.get("Content-Type")
                      : void 0;
                let i, s;
                if (
                  "function" == typeof WebAssembly.instantiateStreaming &&
                  "application/wasm" === o
                ) {
                  d.diagnosticTracing &&
                    console.debug(
                      "MONO_WASM: instantiate_wasm_module streaming",
                    );
                  const e = await WebAssembly.instantiateStreaming(n, t);
                  (i = e.instance), (s = e.module);
                } else {
                  a &&
                    "application/wasm" !== o &&
                    console.warn(
                      'MONO_WASM: WebAssembly resource does not have the expected content type "application/wasm", so falling back to slower ArrayBuffer instantiation.',
                    );
                  const e = await n.arrayBuffer();
                  d.diagnosticTracing &&
                    console.debug(
                      "MONO_WASM: instantiate_wasm_module buffered",
                    );
                  const r = await WebAssembly.instantiate(e, t);
                  (i = r.instance), (s = r.module);
                }
                r(i, s);
              })(n, e, r),
              d.diagnosticTracing &&
                console.debug("MONO_WASM: instantiate_wasm_module done"),
              ba.promise_control.resolve();
          } catch (e) {
            throw (
              (Ra("MONO_WASM: instantiate_wasm_module() failed", e),
              Da(e, !0),
              e)
            );
          }
          t.removeRunDependency("instantiate_wasm_module");
        })(e, r),
        []
      );
    }
    function ja(e) {
      t.addRunDependency("mono_pre_init");
      try {
        t.addRunDependency("mono_wasm_pre_init_essential"),
          d.diagnosticTracing &&
            console.debug("MONO_WASM: mono_wasm_pre_init_essential"),
          (function () {
            const e = !!c;
            for (const r of w) {
              const n = g,
                [o, i, a, s, c] = r;
              if (o || e)
                n[i] = function (...e) {
                  const r = t.cwrap(i, a, s, c);
                  return (n[i] = r), r(...e);
                };
              else {
                const e = t.cwrap(i, a, s, c);
                n[i] = e;
              }
            }
          })(),
          (function (e) {
            Object.assign(e, {
              mono_wasm_exit: g.mono_wasm_exit,
              mono_wasm_enable_on_demand_gc: g.mono_wasm_enable_on_demand_gc,
              mono_profiler_init_aot: g.mono_profiler_init_aot,
              mono_wasm_exec_regression: g.mono_wasm_exec_regression,
            });
          })(r),
          (function (e) {
            Object.assign(e, {
              mono_wasm_add_assembly: g.mono_wasm_add_assembly,
            });
          })(Mn),
          (function (e) {
            Object.assign(e, {
              mono_obj_array_new: g.mono_wasm_obj_array_new,
              mono_obj_array_set: g.mono_wasm_obj_array_set,
              mono_obj_array_new_ref: g.mono_wasm_obj_array_new_ref,
              mono_obj_array_set_ref: g.mono_wasm_obj_array_set_ref,
            });
          })(Rn),
          t.removeRunDependency("mono_wasm_pre_init_essential"),
          d.diagnosticTracing && console.debug("MONO_WASM: preInit"),
          va.promise_control.resolve(),
          e.forEach((e) => e());
      } catch (e) {
        throw (Ra("MONO_WASM: user preInint() failed", e), Da(e, !0), e);
      }
      (async () => {
        try {
          await (async function () {
            d.diagnosticTracing &&
              console.debug("MONO_WASM: mono_wasm_pre_init_essential_async"),
              t.addRunDependency("mono_wasm_pre_init_essential_async"),
              await (async function () {
                if (o) {
                  if (
                    ((r.require = await d.requirePromise),
                    globalThis.performance === so)
                  ) {
                    const { performance: e } = r.require("perf_hooks");
                    globalThis.performance = e;
                  }
                  if (
                    (globalThis.crypto || (globalThis.crypto = {}),
                    !globalThis.crypto.getRandomValues)
                  ) {
                    let e;
                    try {
                      e = r.require("node:crypto");
                    } catch (e) {}
                    e
                      ? e.webcrypto
                        ? (globalThis.crypto = e.webcrypto)
                        : e.randomBytes &&
                          (globalThis.crypto.getRandomValues = (t) => {
                            t && t.set(e.randomBytes(t.length));
                          })
                      : (globalThis.crypto.getRandomValues = () => {
                          throw new Error(
                            "Using node without crypto support. To enable current operation, either provide polyfill for 'globalThis.crypto.getRandomValues' or enable 'node:crypto' module.",
                          );
                        });
                  }
                }
              })(),
              await Fa(t.configSrc),
              t.removeRunDependency("mono_wasm_pre_init_essential_async");
          })(),
            wa ||
              (await (async function () {
                d.diagnosticTracing &&
                  console.debug("MONO_WASM: mono_wasm_pre_init_full"),
                  t.addRunDependency("mono_wasm_pre_init_full"),
                  await Yn(),
                  t.removeRunDependency("mono_wasm_pre_init_full");
              })());
        } catch (e) {
          throw (Da(e, !0), e);
        }
        Ea.promise_control.resolve(), t.removeRunDependency("mono_pre_init");
      })();
    }
    async function Ta(e) {
      t.addRunDependency("mono_pre_run_async"),
        await ba.promise,
        await Ea.promise,
        d.diagnosticTracing && console.debug("MONO_WASM: preRunAsync");
      try {
        e.map((e) => e());
      } catch (e) {
        throw (Ra("MONO_WASM: user callback preRun() failed", e), Da(e, !0), e);
      }
      Sa.promise_control.resolve(), t.removeRunDependency("mono_pre_run_async");
    }
    function Da(e, t) {
      d.diagnosticTracing && console.trace("MONO_WASM: abort_startup"),
        ga.promise_control.reject(e),
        ba.promise_control.reject(e),
        va.promise_control.reject(e),
        Ea.promise_control.reject(e),
        Sa.promise_control.reject(e),
        Aa.promise_control.reject(e),
        ka.promise_control.reject(e),
        Na.promise_control.reject(e),
        t && de(1, e);
    }
    async function Ma() {
      d.diagnosticTracing &&
        console.debug("MONO_WASM: mono_wasm_after_user_runtime_initialized");
      try {
        if (!t.disableDotnet6Compatibility && t.exports) {
          const e = globalThis;
          for (let r = 0; r < t.exports.length; ++r) {
            const n = t.exports[r],
              o = t[n];
            null != o
              ? (e[n] = o)
              : console.warn(
                  `MONO_WASM: The exported symbol ${n} could not be found in the emscripten module`,
                );
          }
        }
        if (
          (d.diagnosticTracing &&
            console.debug("MONO_WASM: Initializing mono runtime"),
          t.onDotnetReady)
        )
          try {
            await t.onDotnetReady();
          } catch (e) {
            throw (Ra("MONO_WASM: onDotnetReady () failed", e), e);
          }
      } catch (e) {
        throw (
          (Ra(
            "MONO_WASM: Error in mono_wasm_after_user_runtime_initialized",
            e,
          ),
          e)
        );
      }
    }
    function Ra(e, r) {
      t.printErr(`${e}: ${JSON.stringify(r)}`),
        r.stack &&
          (t.printErr("MONO_WASM: Stacktrace: \n"), t.printErr(r.stack));
    }
    function Pa(e, t) {
      g.mono_wasm_setenv(e, t);
    }
    function Ca(e) {
      if (!Array.isArray(e))
        throw new Error("Expected runtimeOptions to be an array of strings");
      const r = t._malloc(4 * e.length);
      let n = 0;
      for (let o = 0; o < e.length; ++o) {
        const i = e[o];
        if ("string" != typeof i)
          throw new Error("Expected runtimeOptions to be an array of strings");
        t.setValue(r + 4 * n, g.mono_wasm_strdup(i), "i32"), (n += 1);
      }
      g.mono_wasm_parse_runtime_options(e.length, r);
    }
    function Ia(e, r) {
      if (
        (d.diagnosticTracing &&
          console.debug("MONO_WASM: mono_wasm_load_runtime"),
        !d.mono_wasm_load_runtime_done)
      ) {
        d.mono_wasm_load_runtime_done = !0;
        try {
          null == r && ((r = 0), ha && ha.debugLevel && (r = 0 + r)),
            g.mono_wasm_load_runtime(e || "unused", r),
            (d.waitForDebugger = ha.waitForDebugger),
            d.mono_wasm_bindings_is_ready ||
              (function () {
                if (
                  (d.diagnosticTracing &&
                    console.debug("MONO_WASM: bindings_init"),
                  !d.mono_wasm_bindings_is_ready)
                ) {
                  d.mono_wasm_bindings_is_ready = !0;
                  try {
                    (function () {
                      const e = t,
                        r = "System.Runtime.InteropServices.JavaScript";
                      if (
                        ((d.runtime_interop_module =
                          g.mono_wasm_assembly_load(r)),
                        !d.runtime_interop_module)
                      )
                        throw "Can't find bindings module assembly: " + r;
                      if (
                        ((d.runtime_interop_namespace =
                          "System.Runtime.InteropServices.JavaScript"),
                        (d.runtime_interop_exports_classname =
                          "JavaScriptExports"),
                        (d.runtime_interop_exports_class =
                          g.mono_wasm_assembly_find_class(
                            d.runtime_interop_module,
                            d.runtime_interop_namespace,
                            d.runtime_interop_exports_classname,
                          )),
                        !d.runtime_interop_exports_class)
                      )
                        throw (
                          "Can't find " +
                          d.runtime_interop_namespace +
                          "." +
                          d.runtime_interop_exports_classname +
                          " class"
                        );
                      const n = g.mono_wasm_assembly_find_method(
                          d.runtime_interop_exports_class,
                          "InstallSynchronizationContext",
                          -1,
                        ),
                        o = Do("CallEntrypoint");
                      if (!o)
                        throw new Error(
                          "Assert failed: Can't find CallEntrypoint method",
                        );
                      const i = Do("ReleaseJSOwnedObjectByGCHandle");
                      if (!i)
                        throw new Error(
                          "Assert failed: Can't find ReleaseJSOwnedObjectByGCHandle method",
                        );
                      const a = Do("CreateTaskCallback");
                      if (!a)
                        throw new Error(
                          "Assert failed: Can't find CreateTaskCallback method",
                        );
                      const s = Do("CompleteTask");
                      if (!s)
                        throw new Error(
                          "Assert failed: Can't find CompleteTask method",
                        );
                      const _ = Do("CallDelegate");
                      if (!_)
                        throw new Error(
                          "Assert failed: Can't find CallDelegate method",
                        );
                      const u = Do("GetManagedStackTrace");
                      if (!u)
                        throw new Error(
                          "Assert failed: Can't find GetManagedStackTrace method",
                        );
                      (d.javaScriptExports.call_entry_point = (t, r) => {
                        const n = e.stackSave();
                        try {
                          const i = Lt(4),
                            a = Ht(i, 1),
                            s = Ht(i, 2),
                            c = Ht(i, 3);
                          return (
                            Hr(s, t),
                            r && 0 == r.length && (r = void 0),
                            nn(c, r, yr.String),
                            Oo(o, i),
                            En(a, 0, mn) || Promise.resolve(0)
                          );
                        } finally {
                          e.stackRestore(n);
                        }
                      }),
                        (d.javaScriptExports.release_js_owned_object_by_gc_handle =
                          (t) => {
                            if (!t)
                              throw new Error(
                                "Assert failed: Must be valid gc_handle",
                              );
                            const r = e.stackSave();
                            try {
                              const n = Lt(3),
                                o = Ht(n, 2);
                              er(o, yr.Object), _r(o, t), Oo(i, n);
                            } finally {
                              e.stackRestore(r);
                            }
                          }),
                        (d.javaScriptExports.create_task_callback = () => {
                          const t = e.stackSave();
                          try {
                            const r = Lt(2);
                            return Oo(a, r), cr(Ht(r, 1));
                          } finally {
                            e.stackRestore(t);
                          }
                        }),
                        (d.javaScriptExports.complete_task = (t, r, n, o) => {
                          const i = e.stackSave();
                          try {
                            const a = Lt(5),
                              c = Ht(a, 2);
                            er(c, yr.Object), _r(c, t);
                            const _ = Ht(a, 3);
                            if (r) Qr(_, r);
                            else {
                              er(_, yr.None);
                              const e = Ht(a, 4);
                              if (!o)
                                throw new Error(
                                  "Assert failed: res_converter missing",
                                );
                              o(e, n);
                            }
                            Oo(s, a);
                          } finally {
                            e.stackRestore(i);
                          }
                        }),
                        (d.javaScriptExports.call_delegate = (
                          t,
                          r,
                          n,
                          o,
                          i,
                          a,
                          s,
                          c,
                        ) => {
                          const u = e.stackSave();
                          try {
                            const l = Lt(6),
                              f = Ht(l, 2);
                            if (
                              (er(f, yr.Object),
                              _r(f, t),
                              a && a(Ht(l, 3), r),
                              s && s(Ht(l, 4), n),
                              c && c(Ht(l, 5), o),
                              Oo(_, l),
                              i)
                            )
                              return i(Ht(l, 1));
                          } finally {
                            e.stackRestore(u);
                          }
                        }),
                        (d.javaScriptExports.get_managed_stack_trace = (t) => {
                          const r = e.stackSave();
                          try {
                            const n = Lt(3),
                              o = Ht(n, 2);
                            return (
                              er(o, yr.Exception),
                              _r(o, t),
                              Oo(u, n),
                              An(Ht(n, 1))
                            );
                          } finally {
                            e.stackRestore(r);
                          }
                        }),
                        n &&
                          ((d.javaScriptExports.install_synchronization_context =
                            () => {
                              const t = e.stackSave();
                              try {
                                const r = Lt(2);
                                Oo(n, r);
                              } finally {
                                e.stackRestore(t);
                              }
                            }),
                          c ||
                            d.javaScriptExports.install_synchronization_context());
                    })(),
                      Ai(),
                      0 == $t.size &&
                        ($t.set(yr.Array, xn),
                        $t.set(yr.Span, Tn),
                        $t.set(yr.ArraySegment, Dn),
                        $t.set(yr.Boolean, _n),
                        $t.set(yr.Byte, un),
                        $t.set(yr.Char, ln),
                        $t.set(yr.Int16, fn),
                        $t.set(yr.Int32, mn),
                        $t.set(yr.Int52, dn),
                        $t.set(yr.BigInt64, hn),
                        $t.set(yr.Single, pn),
                        $t.set(yr.IntPtr, gn),
                        $t.set(yr.Double, wn),
                        $t.set(yr.String, An),
                        $t.set(yr.Exception, kn),
                        $t.set(yr.JSException, kn),
                        $t.set(yr.JSObject, Nn),
                        $t.set(yr.Object, On),
                        $t.set(yr.DateTime, bn),
                        $t.set(yr.DateTimeOffset, bn),
                        $t.set(yr.Task, En),
                        $t.set(yr.Action, vn),
                        $t.set(yr.Function, vn),
                        $t.set(yr.None, yn),
                        $t.set(yr.Void, yn),
                        $t.set(yr.Discard, yn)),
                      0 == Ut.size &&
                        (Ut.set(yr.Array, rn),
                        Ut.set(yr.Span, on),
                        Ut.set(yr.ArraySegment, an),
                        Ut.set(yr.Boolean, Cr),
                        Ut.set(yr.Byte, Ir),
                        Ut.set(yr.Char, Fr),
                        Ut.set(yr.Int16, $r),
                        Ut.set(yr.Int32, Ur),
                        Ut.set(yr.Int52, Br),
                        Ut.set(yr.BigInt64, Wr),
                        Ut.set(yr.Double, zr),
                        Ut.set(yr.Single, Lr),
                        Ut.set(yr.IntPtr, Hr),
                        Ut.set(yr.DateTime, Vr),
                        Ut.set(yr.DateTimeOffset, qr),
                        Ut.set(yr.String, Gr),
                        Ut.set(yr.Exception, Qr),
                        Ut.set(yr.JSException, Qr),
                        Ut.set(yr.JSObject, en),
                        Ut.set(yr.Object, tn),
                        Ut.set(yr.Task, Kr),
                        Ut.set(yr.Action, Xr),
                        Ut.set(yr.Function, Xr),
                        Ut.set(yr.None, Yr),
                        Ut.set(yr.Discard, Yr),
                        Ut.set(yr.Void, Yr)),
                      (d._i52_error_scratch_buffer = t._malloc(4));
                  } catch (e) {
                    throw (Ra("MONO_WASM: Error in bindings_init", e), e);
                  }
                }
              })();
        } catch (e) {
          if (
            (Ra("MONO_WASM: mono_wasm_load_runtime () failed", e),
            Da(e, !1),
            i || o)
          ) {
            (0, g.mono_wasm_exit)(1);
          }
          throw e;
        }
      }
    }
    async function Fa(e) {
      if (pa) await ya.promise;
      else {
        if (((pa = !0), !e)) return r(), void ya.promise_control.resolve();
        d.diagnosticTracing &&
          console.debug("MONO_WASM: mono_wasm_load_config");
        try {
          const n = d.locateFile(e),
            o = await d.fetch_like(n),
            i = (await o.json()) || {};
          if (
            i.environmentVariables &&
            "object" != typeof i.environmentVariables
          )
            throw new Error(
              "Expected config.environmentVariables to be unset or a dictionary-style object",
            );
          if (
            ((i.assets = [...(i.assets || []), ...(ha.assets || [])]),
            (i.environmentVariables = {
              ...(i.environmentVariables || {}),
              ...(ha.environmentVariables || {}),
            }),
            (ha = d.config = t.config = Object.assign(t.config, i)),
            r(),
            t.onConfigLoaded)
          )
            try {
              await t.onConfigLoaded(d.config), r();
            } catch (e) {
              throw (Ra("MONO_WASM: onConfigLoaded() failed", e), e);
            }
          ya.promise_control.resolve();
        } catch (r) {
          const n = `Failed to load config file ${e} ${r}`;
          throw (
            (Da(n, !0),
            (ha = d.config = t.config = { message: n, error: r, isError: !0 }),
            r)
          );
        }
      }
      function r() {
        (ha.environmentVariables = ha.environmentVariables || {}),
          (ha.assets = ha.assets || []),
          (ha.runtimeOptions = ha.runtimeOptions || []),
          (ha.globalizationMode = ha.globalizationMode || "auto"),
          ha.debugLevel,
          ha.diagnosticTracing,
          (d.diagnosticTracing = !!d.config.diagnosticTracing);
      }
    }
    function $a(e, r, n, o, i) {
      if (!0 !== d.mono_wasm_runtime_is_ready) return;
      const a = 0 !== e ? t.UTF8ToString(e).concat(".dll") : "",
        s = y(new Uint8Array(t.HEAPU8.buffer, r, n));
      let c;
      if (o) {
        c = y(new Uint8Array(t.HEAPU8.buffer, o, i));
      }
      $({
        eventName: "AssemblyLoaded",
        assembly_name: a,
        assembly_b64: s,
        pdb_b64: c,
      });
    }
    async function Ua(e) {
      (ha = t.config = d.config = Object.assign(d.config || {}, e || {})),
        await Yn(),
        wa || (await ro());
    }
    var Ba, Wa;
    (function (e) {
      (e[(e.Sending = 0)] = "Sending"),
        (e[(e.Closed = 1)] = "Closed"),
        (e[(e.Error = 2)] = "Error");
    })(Ba || (Ba = {})),
      (function (e) {
        (e[(e.Idle = 0)] = "Idle"),
          (e[(e.PartialCommand = 1)] = "PartialCommand"),
          (e[(e.Error = 2)] = "Error");
      })(Wa || (Wa = {}));
    const za = new (class {
      constructor() {
        this.moduleConfig = {
          disableDotnet6Compatibility: !0,
          configSrc: "./mono-config.json",
          config: d.config,
        };
      }
      withModuleConfig(e) {
        try {
          return Object.assign(this.moduleConfig, e), this;
        } catch (e) {
          throw (de(1, e), e);
        }
      }
      withConsoleForwarding() {
        try {
          const e = { forwardConsoleLogsToWS: !0 };
          return Object.assign(this.moduleConfig.config, e), this;
        } catch (e) {
          throw (de(1, e), e);
        }
      }
      withAsyncFlushOnExit() {
        try {
          const e = { asyncFlushOnExit: !0 };
          return Object.assign(this.moduleConfig.config, e), this;
        } catch (e) {
          throw (de(1, e), e);
        }
      }
      withExitCodeLogging() {
        try {
          const e = { logExitCode: !0 };
          return Object.assign(this.moduleConfig.config, e), this;
        } catch (e) {
          throw (de(1, e), e);
        }
      }
      withElementOnExit() {
        try {
          const e = { appendElementOnExit: !0 };
          return Object.assign(this.moduleConfig.config, e), this;
        } catch (e) {
          throw (de(1, e), e);
        }
      }
      withWaitingForDebugger(e) {
        try {
          const t = { waitForDebugger: e };
          return Object.assign(this.moduleConfig.config, t), this;
        } catch (e) {
          throw (de(1, e), e);
        }
      }
      withConfig(e) {
        try {
          const t = { ...e };
          return (
            (t.assets = [
              ...(this.moduleConfig.config.assets || []),
              ...(t.assets || []),
            ]),
            (t.environmentVariables = {
              ...(this.moduleConfig.config.environmentVariables || {}),
              ...(t.environmentVariables || {}),
            }),
            Object.assign(this.moduleConfig.config, t),
            this
          );
        } catch (e) {
          throw (de(1, e), e);
        }
      }
      withConfigSrc(e) {
        try {
          if (!e || "string" != typeof e)
            throw new Error("Assert failed: must be file path or URL");
          return Object.assign(this.moduleConfig, { configSrc: e }), this;
        } catch (e) {
          throw (de(1, e), e);
        }
      }
      withVirtualWorkingDirectory(e) {
        try {
          if (!e || "string" != typeof e)
            throw new Error("Assert failed: must be directory path");
          return (this.virtualWorkingDirectory = e), this;
        } catch (e) {
          throw (de(1, e), e);
        }
      }
      withEnvironmentVariable(e, t) {
        try {
          return (this.moduleConfig.config.environmentVariables[e] = t), this;
        } catch (e) {
          throw (de(1, e), e);
        }
      }
      withEnvironmentVariables(e) {
        try {
          if (!e || "object" != typeof e)
            throw new Error("Assert failed: must be dictionary object");
          return (
            Object.assign(this.moduleConfig.config.environmentVariables, e),
            this
          );
        } catch (e) {
          throw (de(1, e), e);
        }
      }
      withDiagnosticTracing(e) {
        try {
          if ("boolean" != typeof e)
            throw new Error("Assert failed: must be boolean");
          return (this.moduleConfig.config.diagnosticTracing = e), this;
        } catch (e) {
          throw (de(1, e), e);
        }
      }
      withDebugging(e) {
        try {
          if (!e || "number" != typeof e)
            throw new Error("Assert failed: must be number");
          return (this.moduleConfig.config.debugLevel = e), this;
        } catch (e) {
          throw (de(1, e), e);
        }
      }
      withApplicationArguments(...e) {
        try {
          if (!e || !Array.isArray(e))
            throw new Error("Assert failed: must be array of strings");
          return (this.applicationArguments = e), this;
        } catch (e) {
          throw (de(1, e), e);
        }
      }
      withRuntimeOptions(e) {
        try {
          if (!e || !Array.isArray(e))
            throw new Error("Assert failed: must be array of strings");
          return Object.assign(this.moduleConfig, { runtimeOptions: e }), this;
        } catch (e) {
          throw (de(1, e), e);
        }
      }
      withMainAssembly(e) {
        try {
          return (this.moduleConfig.config.mainAssemblyName = e), this;
        } catch (e) {
          throw (de(1, e), e);
        }
      }
      withApplicationArgumentsFromQuery() {
        try {
          if (void 0 !== globalThis.URLSearchParams) {
            const e = new URLSearchParams(window.location.search).getAll("arg");
            return this.withApplicationArguments(...e);
          }
          throw new Error("URLSearchParams is supported");
        } catch (e) {
          throw (de(1, e), e);
        }
      }
      async create() {
        try {
          if (!this.instance) {
            if (
              (a &&
                !c &&
                this.moduleConfig.config.forwardConsoleLogsToWS &&
                void 0 !== globalThis.WebSocket &&
                (function (e, t, r) {
                  const n = { log: t.log, error: t.error },
                    o = t;
                  function i(t, r, o) {
                    return function (...i) {
                      try {
                        let n = i[0];
                        if (void 0 === n) n = "undefined";
                        else if (null === n) n = "null";
                        else if ("function" == typeof n) n = n.toString();
                        else if ("string" != typeof n)
                          try {
                            n = JSON.stringify(n);
                          } catch (e) {
                            n = n.toString();
                          }
                        "string" == typeof n &&
                          "main" !== e &&
                          (n = `[${e}] ${n}`),
                          r(
                            o
                              ? JSON.stringify({
                                  method: t,
                                  payload: n,
                                  arguments: i,
                                })
                              : [t + n, ...i.slice(1)],
                          );
                      } catch (e) {
                        n.error(`proxyConsole failed: ${e}`);
                      }
                    };
                  }
                  const a = ["debug", "trace", "warn", "info", "error"];
                  for (const e of a)
                    "function" != typeof o[e] &&
                      (o[e] = i(`console.${e}: `, t.log, !1));
                  const s = `${r}/console`
                    .replace("https://", "wss://")
                    .replace("http://", "ws://");
                  (ce = new WebSocket(s)),
                    ce.addEventListener("open", () => {
                      n.log(`browser: [${e}] Console websocket connected.`);
                    }),
                    ce.addEventListener("error", (t) => {
                      n.error(`[${e}] websocket error: ${t}`, t);
                    }),
                    ce.addEventListener("close", (t) => {
                      n.error(`[${e}] websocket closed: ${t}`, t);
                    });
                  const c = (e) => {
                    ce.readyState === WebSocket.OPEN ? ce.send(e) : n.log(e);
                  };
                  for (const e of ["log", ...a])
                    o[e] = i(`console.${e}`, c, !0);
                })("main", globalThis.console, globalThis.location.origin),
              o)
            ) {
              const e = await import("process");
              if (e.versions.node.split(".")[0] < 14)
                throw new Error(
                  `NodeJS at '${e.execPath}' has too low version '${e.versions.node}'`,
                );
            }
            if (!this.moduleConfig)
              throw new Error("Assert failed: Null moduleConfig");
            if (!this.moduleConfig.config)
              throw new Error("Assert failed: Null moduleConfig.config");
            this.instance = await l(this.moduleConfig);
          }
          if (this.virtualWorkingDirectory) {
            const e = this.instance.Module.FS,
              t = e.stat(this.virtualWorkingDirectory);
            if (!t || !e.isDir(t.mode))
              throw new Error(
                `Assert failed: Could not find working directory ${this.virtualWorkingDirectory}`,
              );
            e.chdir(this.virtualWorkingDirectory);
          }
          return this.instance;
        } catch (e) {
          throw (de(1, e), e);
        }
      }
      async run() {
        try {
          if (!this.moduleConfig.config)
            throw new Error("Assert failed: Null moduleConfig.config");
          if (
            (this.instance || (await this.create()),
            !this.moduleConfig.config.mainAssemblyName)
          )
            throw new Error(
              "Assert failed: Null moduleConfig.config.mainAssemblyName",
            );
          if (!this.applicationArguments)
            if (o) {
              const e = await import("process");
              this.applicationArguments = e.argv.slice(2);
            } else this.applicationArguments = [];
          return this.instance.runMainAndExit(
            this.moduleConfig.config.mainAssemblyName,
            this.applicationArguments,
          );
        } catch (e) {
          throw (de(1, e), e);
        }
      }
    })();
    const La = function (t, r, n, o) {
        const i = r.module,
          a = globalThis;
        f(t, r),
          (function (e) {
            (Mn = e.mono), (Rn = e.binding);
          })(r),
          ao(n),
          Object.assign(r.mono, {
            mono_wasm_setenv: Pa,
            mono_wasm_load_bytes_into_heap: At,
            mono_wasm_load_icu_data: G,
            mono_wasm_runtime_ready: x,
            mono_wasm_load_data_archive: to,
            mono_wasm_load_config: Fa,
            mono_load_runtime_and_bcl_args: Ua,
            mono_wasm_new_root_buffer: Dt,
            mono_wasm_new_root: Rt,
            mono_wasm_new_external_root: Mt,
            mono_wasm_release_roots: Pt,
            mono_run_main: le,
            mono_run_main_and_exit: ue,
            mono_wasm_add_assembly: null,
            mono_wasm_load_runtime: Ia,
            config: d.config,
            loaded_files: [],
            setB32: Ye,
            setI8: et,
            setI16: tt,
            setI32: nt,
            setI52: it,
            setU52: at,
            setI64Big: st,
            setU8: Xe,
            setU16: Ze,
            setU32: Qe,
            setF32: ct,
            setF64: _t,
            getB32: ut,
            getI8: dt,
            getI16: ht,
            getI32: pt,
            getI52: wt,
            getU52: gt,
            getI64Big: yt,
            getU8: lt,
            getU16: ft,
            getU32: mt,
            getF32: bt,
            getF64: vt,
          }),
          Object.assign(r.binding, {
            bind_static_method: ti,
            call_assembly_entry_point: ni,
            mono_obj_array_new: null,
            mono_obj_array_set: null,
            js_string_to_mono_string: Rr,
            js_typed_array_to_array: Bo,
            mono_array_to_js_array: Jo,
            js_to_mono_obj: Io,
            conv_string: Or,
            unbox_mono_obj: Ho,
            mono_obj_array_new_ref: null,
            mono_obj_array_set_ref: null,
            js_string_to_mono_string_root: Dr,
            js_typed_array_to_array_root: Uo,
            js_to_mono_obj_root: Fo,
            conv_string_root: xr,
            unbox_mono_obj_root: Go,
            mono_array_root_to_js_array: Xo,
          }),
          Object.assign(r.internal, ma()),
          Object.assign(r.internal, ma());
        const s = {
          runMain: le,
          runMainAndExit: ue,
          setEnvironmentVariable: Pa,
          getAssemblyExports: jo,
          setModuleImports: mo,
          getConfig: () => d.config,
          setHeapB32: Ye,
          setHeapU8: Xe,
          setHeapU16: Ze,
          setHeapU32: Qe,
          setHeapI8: et,
          setHeapI16: tt,
          setHeapI32: nt,
          setHeapI52: it,
          setHeapU52: at,
          setHeapI64Big: st,
          setHeapF32: ct,
          setHeapF64: _t,
          getHeapB32: ut,
          getHeapU8: lt,
          getHeapU16: ft,
          getHeapU32: mt,
          getHeapI8: dt,
          getHeapI16: ht,
          getHeapI32: pt,
          getHeapI52: wt,
          getHeapU52: gt,
          getHeapI64Big: yt,
          getHeapF32: bt,
          getHeapF64: vt,
        };
        if (
          ((e.__linker_exports = {
            mono_set_timeout: Hi,
            mono_wasm_asm_loaded: $a,
            mono_wasm_fire_debugger_agent_message: j,
            mono_wasm_debugger_log: V,
            mono_wasm_add_dbg_command_received: T,
            schedule_background_exec: Li,
            mono_wasm_invoke_js_blazor: ui,
            mono_wasm_trace_logger: se,
            mono_wasm_set_entrypoint_breakpoint: B,
            mono_wasm_event_pipe_early_startup_callback: da,
            mono_wasm_invoke_js_with_args_ref: oi,
            mono_wasm_get_object_property_ref: ii,
            mono_wasm_set_object_property_ref: ai,
            mono_wasm_get_by_index_ref: si,
            mono_wasm_set_by_index_ref: ci,
            mono_wasm_get_global_object_ref: _i,
            mono_wasm_create_cs_owned_object_ref: Zo,
            mono_wasm_release_cs_owned_object: xe,
            mono_wasm_typed_array_to_array_ref: zo,
            mono_wasm_typed_array_from_ref: Mo,
            mono_wasm_bind_js_function: lo,
            mono_wasm_invoke_bound_function: fo,
            mono_wasm_bind_cs_function: No,
            mono_wasm_marshal_promise: Sn,
            mono_wasm_load_icu_data: G,
            mono_wasm_get_icudt_name: J,
          }),
          Object.assign(_, {
            MONO: r.mono,
            BINDING: r.binding,
            INTERNAL: r.internal,
            IMPORTS: r.marshaled_imports,
            Module: i,
            runtimeBuildInfo: {
              productVersion: "7.0.14",
              buildConfiguration: "Release",
            },
            ...s,
          }),
          Object.assign(o, s),
          r.module.__undefinedConfig &&
            ((i.disableDotnet6Compatibility = !0),
            (i.configSrc = "./mono-config.json")),
          i.print || (i.print = console.log.bind(console)),
          i.printErr || (i.printErr = console.error.bind(console)),
          void 0 === i.disableDotnet6Compatibility &&
            (i.disableDotnet6Compatibility = !0),
          t.isGlobal || !i.disableDotnet6Compatibility)
        ) {
          Object.assign(i, _),
            (i.mono_bind_static_method = (e, t) => (
              console.warn(
                "MONO_WASM: Module.mono_bind_static_method is obsolete, please use [JSExportAttribute] interop instead",
              ),
              ti(e, t)
            ));
          const e = (e, t) => {
            if (void 0 !== a[e]) return;
            let r;
            Object.defineProperty(globalThis, e, {
              get: () => {
                if (p(r)) {
                  const n = new Error().stack,
                    o = n ? n.substr(n.indexOf("\n", 8) + 1) : "";
                  console.warn(
                    `MONO_WASM: global ${e} is obsolete, please use Module.${e} instead ${o}`,
                  ),
                    (r = t());
                }
                return r;
              },
            });
          };
          (a.MONO = r.mono),
            (a.BINDING = r.binding),
            (a.INTERNAL = r.internal),
            t.isGlobal || (a.Module = i),
            e("cwrap", () => i.cwrap),
            e("addRunDependency", () => i.addRunDependency),
            e("removeRunDependency", () => i.removeRunDependency);
        }
        let c;
        return (
          a.getDotnetRuntime
            ? (c = a.getDotnetRuntime.__list)
            : ((a.getDotnetRuntime = (e) =>
                a.getDotnetRuntime.__list.getRuntime(e)),
              (a.getDotnetRuntime.__list = c = new Va())),
          c.registerRuntime(_),
          Oa(i, _),
          _
        );
      },
      Ha = function (e, t) {
        m(t),
          Object.assign(u, { dotnet: za, exit: de }),
          (function (e) {
            l = e;
          })(e);
      };
    e.__linker_exports = null;
    class Va {
      constructor() {
        this.list = {};
      }
      registerRuntime(e) {
        return (
          (e.runtimeId = Object.keys(this.list).length),
          (this.list[e.runtimeId] = we(e)),
          e.runtimeId
        );
      }
      getRuntime(e) {
        const t = this.list[e];
        return t ? t.deref() : void 0;
      }
    }
    return (
      (e.__initializeImportsAndExports = La),
      (e.__setEmscriptenEntrypoint = Ha),
      (e.moduleExports = u),
      Object.defineProperty(e, "__esModule", { value: !0 }),
      e
    );
  })({}),
  createDotnetRuntime = (() => {
    var e = import.meta.url;
    return function (t) {
      var r,
        n,
        o = void 0 !== (t = t || {}) ? t : {};
      o.ready = new Promise(function (e, t) {
        (r = e), (n = t);
      });
      var i = i || void 0,
        a = a || "",
        s = { MONO, BINDING, INTERNAL, IMPORTS };
      if ("function" == typeof t) {
        s.Module = o = { ready: o.ready };
        const e = t(s);
        if (e.ready)
          throw new Error("MONO_WASM: Module.ready couldn't be redefined.");
        Object.assign(o, e),
          (t = o).locateFile || (t.locateFile = t.__locateFile = (e) => E + e);
      } else {
        if ("object" != typeof t)
          throw new Error(
            "MONO_WASM: Can't use moduleFactory callback of createDotnetRuntime function.",
          );
        (s.Module = o =
          { ready: o.ready, __undefinedConfig: 1 === Object.keys(t).length }),
          Object.assign(o, t),
          (t = o).locateFile || (t.locateFile = t.__locateFile = (e) => E + e);
      }
      var c,
        _,
        u,
        l,
        f,
        m,
        d = Object.assign({}, o),
        h = [],
        p = "./this.program",
        w = (e, t) => {
          throw t;
        },
        g = "object" == typeof window,
        y = "function" == typeof importScripts,
        b =
          "object" == typeof process &&
          "object" == typeof process.versions &&
          "string" == typeof process.versions.node,
        v = !g && !b && !y,
        E = "";
      function S(e) {
        return o.locateFile ? o.locateFile(e, E) : E + e;
      }
      function A(e) {
        if (e instanceof gs) return;
        N("exiting due to exception: " + e);
      }
      b
        ? ((E = y ? i("path").dirname(E) + "/" : a + "/"),
          (m = () => {
            f || ((l = i("fs")), (f = i("path")));
          }),
          (c = function (e, t) {
            return (
              m(), (e = f.normalize(e)), l.readFileSync(e, t ? void 0 : "utf8")
            );
          }),
          (u = (e) => {
            var t = c(e, !0);
            return t.buffer || (t = new Uint8Array(t)), t;
          }),
          (_ = (e, t, r) => {
            m(),
              (e = f.normalize(e)),
              l.readFile(e, function (e, n) {
                e ? r(e) : t(n.buffer);
              });
          }),
          process.argv.length > 1 && (p = process.argv[1].replace(/\\/g, "/")),
          (h = process.argv.slice(2)),
          process.on("uncaughtException", function (e) {
            if (!(e instanceof gs)) throw e;
          }),
          process.on("unhandledRejection", function (e) {
            throw e;
          }),
          (w = (e, t) => {
            if (se()) throw ((process.exitCode = e), t);
            A(t), process.exit(e);
          }),
          (o.inspect = function () {
            return "[Emscripten Module object]";
          }))
        : v
        ? ("undefined" != typeof read &&
            (c = function (e) {
              return read(e);
            }),
          (u = function (e) {
            let t;
            return "function" == typeof readbuffer
              ? new Uint8Array(readbuffer(e))
              : ((t = read(e, "binary")), P("object" == typeof t), t);
          }),
          (_ = function (e, t, r) {
            setTimeout(() => t(u(e)), 0);
          }),
          "undefined" != typeof scriptArgs
            ? (h = scriptArgs)
            : void 0 !== arguments && (h = arguments),
          "function" == typeof quit &&
            (w = (e, t) => {
              A(t), quit(e);
            }),
          "undefined" != typeof print &&
            ("undefined" == typeof console && (console = {}),
            (console.log = print),
            (console.warn = console.error =
              "undefined" != typeof printErr ? printErr : print)))
        : (g || y) &&
          (y
            ? (E = self.location.href)
            : "undefined" != typeof document &&
              document.currentScript &&
              (E = document.currentScript.src),
          e && (E = e),
          (E =
            0 !== E.indexOf("blob:")
              ? E.substr(0, E.replace(/[?#].*/, "").lastIndexOf("/") + 1)
              : ""),
          (c = (e) => {
            var t = new XMLHttpRequest();
            return t.open("GET", e, !1), t.send(null), t.responseText;
          }),
          y &&
            (u = (e) => {
              var t = new XMLHttpRequest();
              return (
                t.open("GET", e, !1),
                (t.responseType = "arraybuffer"),
                t.send(null),
                new Uint8Array(t.response)
              );
            }),
          (_ = (e, t, r) => {
            var n = new XMLHttpRequest();
            n.open("GET", e, !0),
              (n.responseType = "arraybuffer"),
              (n.onload = () => {
                200 == n.status || (0 == n.status && n.response)
                  ? t(n.response)
                  : r();
              }),
              (n.onerror = r),
              n.send(null);
          }));
      var k = o.print || console.log.bind(console),
        N = o.printErr || console.warn.bind(console);
      Object.assign(o, d),
        (d = null),
        o.arguments && (h = o.arguments),
        o.thisProgram && (p = o.thisProgram),
        o.quit && (w = o.quit);
      var O,
        x = 0,
        j = (e) => {
          x = e;
        },
        T = () => x;
      o.wasmBinary && (O = o.wasmBinary);
      var D,
        M = o.noExitRuntime || !0;
      "object" != typeof WebAssembly && ye("no native wasm support detected");
      var R = !1;
      function P(e, t) {
        e || ye(t);
      }
      function C(e) {
        return o["_" + e];
      }
      function I(e, t, r, n, o) {
        var i = {
          string: function (e) {
            var t = 0;
            if (null != e && 0 !== e) {
              var r = 1 + (e.length << 2);
              Z(e, (t = xn(r)), r);
            }
            return t;
          },
          array: function (e) {
            var t = xn(e.length);
            return ee(e, t), t;
          },
        };
        var a = C(e),
          s = [],
          c = 0;
        if (n)
          for (var _ = 0; _ < n.length; _++) {
            var u = i[r[_]];
            u ? (0 === c && (c = Nn()), (s[_] = u(n[_]))) : (s[_] = n[_]);
          }
        var l = a.apply(null, s);
        return (l = (function (e) {
          return (
            0 !== c && On(c),
            (function (e) {
              return "string" === t ? Y(e) : "boolean" === t ? Boolean(e) : e;
            })(e)
          );
        })(l));
      }
      function F(e, t, r, n) {
        var o = (r = r || []).every(function (e) {
          return "number" === e;
        });
        return "string" !== t && o && !n
          ? C(e)
          : function () {
              return I(e, t, r, arguments);
            };
      }
      var $,
        U,
        B,
        W,
        z,
        L,
        H,
        V,
        q,
        G =
          "undefined" != typeof TextDecoder ? new TextDecoder("utf8") : void 0;
      function J(e, t, r) {
        for (var n = t + r, o = t; e[o] && !(o >= n); ) ++o;
        if (o - t > 16 && e.buffer && G) return G.decode(e.subarray(t, o));
        for (var i = ""; t < o; ) {
          var a = e[t++];
          if (128 & a) {
            var s = 63 & e[t++];
            if (192 != (224 & a)) {
              var c = 63 & e[t++];
              if (
                (a =
                  224 == (240 & a)
                    ? ((15 & a) << 12) | (s << 6) | c
                    : ((7 & a) << 18) | (s << 12) | (c << 6) | (63 & e[t++])) <
                65536
              )
                i += String.fromCharCode(a);
              else {
                var _ = a - 65536;
                i += String.fromCharCode(55296 | (_ >> 10), 56320 | (1023 & _));
              }
            } else i += String.fromCharCode(((31 & a) << 6) | s);
          } else i += String.fromCharCode(a);
        }
        return i;
      }
      function Y(e, t) {
        return e ? J(B, e, t) : "";
      }
      function X(e, t, r, n) {
        if (!(n > 0)) return 0;
        for (var o = r, i = r + n - 1, a = 0; a < e.length; ++a) {
          var s = e.charCodeAt(a);
          if (s >= 55296 && s <= 57343)
            s = (65536 + ((1023 & s) << 10)) | (1023 & e.charCodeAt(++a));
          if (s <= 127) {
            if (r >= i) break;
            t[r++] = s;
          } else if (s <= 2047) {
            if (r + 1 >= i) break;
            (t[r++] = 192 | (s >> 6)), (t[r++] = 128 | (63 & s));
          } else if (s <= 65535) {
            if (r + 2 >= i) break;
            (t[r++] = 224 | (s >> 12)),
              (t[r++] = 128 | ((s >> 6) & 63)),
              (t[r++] = 128 | (63 & s));
          } else {
            if (r + 3 >= i) break;
            (t[r++] = 240 | (s >> 18)),
              (t[r++] = 128 | ((s >> 12) & 63)),
              (t[r++] = 128 | ((s >> 6) & 63)),
              (t[r++] = 128 | (63 & s));
          }
        }
        return (t[r] = 0), r - o;
      }
      function Z(e, t, r) {
        return X(e, B, t, r);
      }
      function K(e) {
        for (var t = 0, r = 0; r < e.length; ++r) {
          var n = e.charCodeAt(r);
          n >= 55296 &&
            n <= 57343 &&
            (n = (65536 + ((1023 & n) << 10)) | (1023 & e.charCodeAt(++r))),
            n <= 127 ? ++t : (t += n <= 2047 ? 2 : n <= 65535 ? 3 : 4);
        }
        return t;
      }
      function Q(e) {
        var t = K(e) + 1,
          r = yn(t);
        return r && X(e, U, r, t), r;
      }
      function ee(e, t) {
        U.set(e, t);
      }
      function te(e, t, r) {
        for (var n = 0; n < e.length; ++n) U[t++ >> 0] = e.charCodeAt(n);
        r || (U[t >> 0] = 0);
      }
      function re(e) {
        ($ = e),
          (o.HEAP8 = U = new Int8Array(e)),
          (o.HEAP16 = W = new Int16Array(e)),
          (o.HEAP32 = L = new Int32Array(e)),
          (o.HEAPU8 = B = new Uint8Array(e)),
          (o.HEAPU16 = z = new Uint16Array(e)),
          (o.HEAPU32 = H = new Uint32Array(e)),
          (o.HEAPF32 = V = new Float32Array(e)),
          (o.HEAPF64 = q = new Float64Array(e));
      }
      o.INITIAL_MEMORY;
      var ne,
        oe = [],
        ie = [],
        ae = [];
      function se() {
        return M;
      }
      function ce() {
        if (o.preRun)
          for (
            "function" == typeof o.preRun && (o.preRun = [o.preRun]);
            o.preRun.length;

          )
            le(o.preRun.shift());
        Te(oe);
      }
      function _e() {
        !0,
          o.noFSInit || ct.init.initialized || ct.init(),
          (ct.ignorePermissions = !1),
          tt.init(),
          (ft.root = ct.mount(ft, {}, null)),
          Te(ie);
      }
      function ue() {
        if (o.postRun)
          for (
            "function" == typeof o.postRun && (o.postRun = [o.postRun]);
            o.postRun.length;

          )
            me(o.postRun.shift());
        Te(ae);
      }
      function le(e) {
        oe.unshift(e);
      }
      function fe(e) {
        ie.unshift(e);
      }
      function me(e) {
        ae.unshift(e);
      }
      var de = 0,
        he = null,
        pe = null;
      function we(e) {
        de++, o.monitorRunDependencies && o.monitorRunDependencies(de);
      }
      function ge(e) {
        if (
          (de--,
          o.monitorRunDependencies && o.monitorRunDependencies(de),
          0 == de && (null !== he && (clearInterval(he), (he = null)), pe))
        ) {
          var t = pe;
          (pe = null), t();
        }
      }
      function ye(e) {
        o.onAbort && o.onAbort(e),
          N((e = "Aborted(" + e + ")")),
          (R = !0),
          1,
          (e += ". Build with -sASSERTIONS for more info.");
        var t = new WebAssembly.RuntimeError(e);
        throw (n(t), t);
      }
      var be,
        ve,
        Ee,
        Se = "data:application/octet-stream;base64,";
      function Ae(e) {
        return e.startsWith(Se);
      }
      function ke(e) {
        return e.startsWith("file://");
      }
      function Ne(e) {
        try {
          if (e == be && O) return new Uint8Array(O);
          if (u) return u(e);
          throw "both async and sync fetching of the wasm failed";
        } catch (e) {
          ye(e);
        }
      }
      function Oe() {
        if (!O && (g || y)) {
          if ("function" == typeof hn && !ke(be))
            return hn(be, { credentials: "same-origin" })
              .then(function (e) {
                if (!e.ok)
                  throw "failed to load wasm binary file at '" + be + "'";
                return e.arrayBuffer();
              })
              .catch(function () {
                return Ne(be);
              });
          if (_)
            return new Promise(function (e, t) {
              _(
                be,
                function (t) {
                  e(new Uint8Array(t));
                },
                t,
              );
            });
        }
        return Promise.resolve().then(function () {
          return Ne(be);
        });
      }
      function xe() {
        var e = { a: gn };
        function t(e, t) {
          var r = e.exports;
          (o.asm = r),
            re((D = o.asm.Rd).buffer),
            (ne = o.asm.Vd),
            fe(o.asm.Sd),
            ge();
        }
        function r(e) {
          t(e.instance);
        }
        function i(t) {
          return Oe()
            .then(function (t) {
              return WebAssembly.instantiate(t, e);
            })
            .then(function (e) {
              return e;
            })
            .then(t, function (e) {
              N("failed to asynchronously prepare wasm: " + e), ye(e);
            });
        }
        if ((we(), o.instantiateWasm))
          try {
            return o.instantiateWasm(e, t);
          } catch (e) {
            return (
              N("Module.instantiateWasm callback failed with error: " + e), !1
            );
          }
        return (
          (O ||
          "function" != typeof WebAssembly.instantiateStreaming ||
          Ae(be) ||
          ke(be) ||
          "function" != typeof hn
            ? i(r)
            : hn(be, { credentials: "same-origin" }).then(function (t) {
                return WebAssembly.instantiateStreaming(t, e).then(
                  r,
                  function (e) {
                    return (
                      N("wasm streaming compile failed: " + e),
                      N("falling back to ArrayBuffer instantiation"),
                      i(r)
                    );
                  },
                );
              })
          ).catch(n),
          {}
        );
      }
      o.locateFile
        ? Ae((be = "dotnet.wasm")) || (be = S(be))
        : (be = new URL("dotnet.wasm", import.meta.url).toString());
      var je = {
        18765336: (e, t) => {
          setTimeout(function () {
            console.error(Y(e));
          }, t);
        },
        18765403: (e) => {
          setTimeout(function () {
            try {
              "undefined" == typeof window &&
              "undefined" == typeof document &&
              "undefined" != typeof self &&
              void 0 !== self.close
                ? self.close()
                : "undefined" != typeof process && void 0 !== process.exit
                ? process.exit(1)
                : (location.href = "https://pspdfkit.com");
            } catch (e) {
              location.href = "https://pspdfkit.com";
            }
          }, e);
        },
      };
      function Te(e) {
        for (; e.length > 0; ) {
          var t = e.shift();
          if ("function" != typeof t) {
            var r = t.func;
            "number" == typeof r
              ? void 0 === t.arg
                ? Re(r)()
                : Re(r)(t.arg)
              : r(void 0 === t.arg ? null : t.arg);
          } else t(o);
        }
      }
      function De(e, t = "i8") {
        switch ((t.endsWith("*") && (t = "i32"), t)) {
          case "i1":
          case "i8":
            return U[e >> 0];
          case "i16":
            return W[e >> 1];
          case "i32":
          case "i64":
            return L[e >> 2];
          case "float":
            return V[e >> 2];
          case "double":
            return Number(q[e >> 3]);
          default:
            ye("invalid type for getValue: " + t);
        }
        return null;
      }
      var Me = [];
      function Re(e) {
        var t = Me[e];
        return (
          t || (e >= Me.length && (Me.length = e + 1), (Me[e] = t = ne.get(e))),
          t
        );
      }
      function Pe(e, t, r = "i8") {
        switch ((r.endsWith("*") && (r = "i32"), r)) {
          case "i1":
          case "i8":
            U[e >> 0] = t;
            break;
          case "i16":
            W[e >> 1] = t;
            break;
          case "i32":
            L[e >> 2] = t;
            break;
          case "i64":
            (Ee = [
              t >>> 0,
              ((ve = t),
              +Math.abs(ve) >= 1
                ? ve > 0
                  ? (0 | Math.min(+Math.floor(ve / 4294967296), 4294967295)) >>>
                    0
                  : ~~+Math.ceil((ve - +(~~ve >>> 0)) / 4294967296) >>> 0
                : 0),
            ]),
              (L[e >> 2] = Ee[0]),
              (L[(e + 4) >> 2] = Ee[1]);
            break;
          case "float":
            V[e >> 2] = t;
            break;
          case "double":
            q[e >> 3] = t;
            break;
          default:
            ye("invalid type for setValue: " + r);
        }
      }
      function Ce(e, t, r, n) {
        ye(
          "Assertion failed: " +
            Y(e) +
            ", at: " +
            [t ? Y(t) : "unknown filename", r, n ? Y(n) : "unknown function"],
        );
      }
      function Ie(e) {
        return yn(e + 24) + 24;
      }
      var Fe = [];
      function $e(e) {
        e.add_ref();
      }
      var Ue = 0;
      function Be(e) {
        var t = new ze(e);
        return (
          t.get_caught() || (t.set_caught(!0), Ue--),
          t.set_rethrown(!1),
          Fe.push(t),
          $e(t),
          t.get_exception_ptr()
        );
      }
      var We = 0;
      function ze(e) {
        (this.excPtr = e),
          (this.ptr = e - 24),
          (this.set_type = function (e) {
            H[(this.ptr + 4) >> 2] = e;
          }),
          (this.get_type = function () {
            return H[(this.ptr + 4) >> 2];
          }),
          (this.set_destructor = function (e) {
            H[(this.ptr + 8) >> 2] = e;
          }),
          (this.get_destructor = function () {
            return H[(this.ptr + 8) >> 2];
          }),
          (this.set_refcount = function (e) {
            L[this.ptr >> 2] = e;
          }),
          (this.set_caught = function (e) {
            (e = e ? 1 : 0), (U[(this.ptr + 12) >> 0] = e);
          }),
          (this.get_caught = function () {
            return 0 != U[(this.ptr + 12) >> 0];
          }),
          (this.set_rethrown = function (e) {
            (e = e ? 1 : 0), (U[(this.ptr + 13) >> 0] = e);
          }),
          (this.get_rethrown = function () {
            return 0 != U[(this.ptr + 13) >> 0];
          }),
          (this.init = function (e, t) {
            this.set_adjusted_ptr(0),
              this.set_type(e),
              this.set_destructor(t),
              this.set_refcount(0),
              this.set_caught(!1),
              this.set_rethrown(!1);
          }),
          (this.add_ref = function () {
            var e = L[this.ptr >> 2];
            L[this.ptr >> 2] = e + 1;
          }),
          (this.release_ref = function () {
            var e = L[this.ptr >> 2];
            return (L[this.ptr >> 2] = e - 1), 1 === e;
          }),
          (this.set_adjusted_ptr = function (e) {
            H[(this.ptr + 16) >> 2] = e;
          }),
          (this.get_adjusted_ptr = function () {
            return H[(this.ptr + 16) >> 2];
          }),
          (this.get_exception_ptr = function () {
            if (Tn(this.get_type())) return H[this.excPtr >> 2];
            var e = this.get_adjusted_ptr();
            return 0 !== e ? e : this.excPtr;
          });
      }
      function Le(e) {
        return bn(new ze(e).ptr);
      }
      function He(e) {
        if (e.release_ref() && !e.get_rethrown()) {
          var t = e.get_destructor();
          t && Re(t)(e.excPtr), Le(e.excPtr);
        }
      }
      function Ve() {
        kn(0), He(Fe.pop()), (We = 0);
      }
      function qe(e) {
        throw (We || (We = e), e);
      }
      function Ge() {
        var e = We;
        if (!e) return j(0), 0;
        var t = new ze(e);
        t.set_adjusted_ptr(e);
        var r = t.get_type();
        if (!r) return j(0), e;
        for (
          var n = Array.prototype.slice.call(arguments), o = 0;
          o < n.length;
          o++
        ) {
          var i = n[o];
          if (0 === i || i === r) break;
          var a = t.ptr + 16;
          if (jn(i, r, a)) return j(i), e;
        }
        return j(r), e;
      }
      function Je() {
        var e = We;
        if (!e) return j(0), 0;
        var t = new ze(e);
        t.set_adjusted_ptr(e);
        var r = t.get_type();
        if (!r) return j(0), e;
        for (
          var n = Array.prototype.slice.call(arguments), o = 0;
          o < n.length;
          o++
        ) {
          var i = n[o];
          if (0 === i || i === r) break;
          var a = t.ptr + 16;
          if (jn(i, r, a)) return j(i), e;
        }
        return j(r), e;
      }
      function Ye() {
        var e = Fe.pop();
        e || ye("no exception to throw");
        var t = e.excPtr;
        throw (
          (e.get_rethrown() ||
            (Fe.push(e), e.set_rethrown(!0), e.set_caught(!1), Ue++),
          (We = t),
          t)
        );
      }
      function Xe(e, t, r) {
        throw (new ze(e).init(t, r), (We = e), Ue++, e);
      }
      function Ze() {
        return Ue;
      }
      var Ke = {
        isAbs: (e) => "/" === e.charAt(0),
        splitPath: (e) =>
          /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/
            .exec(e)
            .slice(1),
        normalizeArray: (e, t) => {
          for (var r = 0, n = e.length - 1; n >= 0; n--) {
            var o = e[n];
            "." === o
              ? e.splice(n, 1)
              : ".." === o
              ? (e.splice(n, 1), r++)
              : r && (e.splice(n, 1), r--);
          }
          if (t) for (; r; r--) e.unshift("..");
          return e;
        },
        normalize: (e) => {
          var t = Ke.isAbs(e),
            r = "/" === e.substr(-1);
          return (
            (e = Ke.normalizeArray(
              e.split("/").filter((e) => !!e),
              !t,
            ).join("/")) ||
              t ||
              (e = "."),
            e && r && (e += "/"),
            (t ? "/" : "") + e
          );
        },
        dirname: (e) => {
          var t = Ke.splitPath(e),
            r = t[0],
            n = t[1];
          return r || n ? (n && (n = n.substr(0, n.length - 1)), r + n) : ".";
        },
        basename: (e) => {
          if ("/" === e) return "/";
          var t = (e = (e = Ke.normalize(e)).replace(/\/$/, "")).lastIndexOf(
            "/",
          );
          return -1 === t ? e : e.substr(t + 1);
        },
        join: function () {
          var e = Array.prototype.slice.call(arguments, 0);
          return Ke.normalize(e.join("/"));
        },
        join2: (e, t) => Ke.normalize(e + "/" + t),
      };
      function Qe() {
        if (
          "object" == typeof crypto &&
          "function" == typeof crypto.getRandomValues
        ) {
          var e = new Uint8Array(1);
          return function () {
            return crypto.getRandomValues(e), e[0];
          };
        }
        if (b)
          try {
            var t = i("crypto");
            return function () {
              return t.randomBytes(1)[0];
            };
          } catch (e) {}
        return function () {
          ye("randomDevice");
        };
      }
      var et = {
          resolve: function () {
            for (
              var e = "", t = !1, r = arguments.length - 1;
              r >= -1 && !t;
              r--
            ) {
              var n = r >= 0 ? arguments[r] : ct.cwd();
              if ("string" != typeof n)
                throw new TypeError(
                  "Arguments to path.resolve must be strings",
                );
              if (!n) return "";
              (e = n + "/" + e), (t = Ke.isAbs(n));
            }
            return (
              (t ? "/" : "") +
                (e = Ke.normalizeArray(
                  e.split("/").filter((e) => !!e),
                  !t,
                ).join("/")) || "."
            );
          },
          relative: (e, t) => {
            function r(e) {
              for (var t = 0; t < e.length && "" === e[t]; t++);
              for (var r = e.length - 1; r >= 0 && "" === e[r]; r--);
              return t > r ? [] : e.slice(t, r - t + 1);
            }
            (e = et.resolve(e).substr(1)), (t = et.resolve(t).substr(1));
            for (
              var n = r(e.split("/")),
                o = r(t.split("/")),
                i = Math.min(n.length, o.length),
                a = i,
                s = 0;
              s < i;
              s++
            )
              if (n[s] !== o[s]) {
                a = s;
                break;
              }
            var c = [];
            for (s = a; s < n.length; s++) c.push("..");
            return (c = c.concat(o.slice(a))).join("/");
          },
        },
        tt = {
          ttys: [],
          init: function () {},
          shutdown: function () {},
          register: function (e, t) {
            (tt.ttys[e] = { input: [], output: [], ops: t }),
              ct.registerDevice(e, tt.stream_ops);
          },
          stream_ops: {
            open: function (e) {
              var t = tt.ttys[e.node.rdev];
              if (!t) throw new ct.ErrnoError(43);
              (e.tty = t), (e.seekable = !1);
            },
            close: function (e) {
              e.tty.ops.flush(e.tty);
            },
            flush: function (e) {
              e.tty.ops.flush(e.tty);
            },
            read: function (e, t, r, n, o) {
              if (!e.tty || !e.tty.ops.get_char) throw new ct.ErrnoError(60);
              for (var i = 0, a = 0; a < n; a++) {
                var s;
                try {
                  s = e.tty.ops.get_char(e.tty);
                } catch (e) {
                  throw new ct.ErrnoError(29);
                }
                if (void 0 === s && 0 === i) throw new ct.ErrnoError(6);
                if (null == s) break;
                i++, (t[r + a] = s);
              }
              return i && (e.node.timestamp = Date.now()), i;
            },
            write: function (e, t, r, n, o) {
              if (!e.tty || !e.tty.ops.put_char) throw new ct.ErrnoError(60);
              try {
                for (var i = 0; i < n; i++) e.tty.ops.put_char(e.tty, t[r + i]);
              } catch (e) {
                throw new ct.ErrnoError(29);
              }
              return n && (e.node.timestamp = Date.now()), i;
            },
          },
          default_tty_ops: {
            get_char: function (e) {
              if (!e.input.length) {
                var t = null;
                if (b) {
                  var r = Buffer.alloc(256),
                    n = 0;
                  try {
                    n = l.readSync(process.stdin.fd, r, 0, 256, -1);
                  } catch (e) {
                    if (!e.toString().includes("EOF")) throw e;
                    n = 0;
                  }
                  t = n > 0 ? r.slice(0, n).toString("utf-8") : null;
                } else
                  "undefined" != typeof window &&
                  "function" == typeof window.prompt
                    ? null !== (t = window.prompt("Input: ")) && (t += "\n")
                    : "function" == typeof readline &&
                      null !== (t = readline()) &&
                      (t += "\n");
                if (!t) return null;
                e.input = pn(t, !0);
              }
              return e.input.shift();
            },
            put_char: function (e, t) {
              null === t || 10 === t
                ? (k(J(e.output, 0)), (e.output = []))
                : 0 != t && e.output.push(t);
            },
            flush: function (e) {
              e.output &&
                e.output.length > 0 &&
                (k(J(e.output, 0)), (e.output = []));
            },
          },
          default_tty1_ops: {
            put_char: function (e, t) {
              null === t || 10 === t
                ? (N(J(e.output, 0)), (e.output = []))
                : 0 != t && e.output.push(t);
            },
            flush: function (e) {
              e.output &&
                e.output.length > 0 &&
                (N(J(e.output, 0)), (e.output = []));
            },
          },
        };
      function rt(e, t) {
        B.fill(0, e, e + t);
      }
      function nt(e, t) {
        return Math.ceil(e / t) * t;
      }
      function ot(e) {
        e = nt(e, 65536);
        var t = Sn(65536, e);
        return t ? (rt(t, e), t) : 0;
      }
      var it = {
        ops_table: null,
        mount: function (e) {
          return it.createNode(null, "/", 16895, 0);
        },
        createNode: function (e, t, r, n) {
          if (ct.isBlkdev(r) || ct.isFIFO(r)) throw new ct.ErrnoError(63);
          it.ops_table ||
            (it.ops_table = {
              dir: {
                node: {
                  getattr: it.node_ops.getattr,
                  setattr: it.node_ops.setattr,
                  lookup: it.node_ops.lookup,
                  mknod: it.node_ops.mknod,
                  rename: it.node_ops.rename,
                  unlink: it.node_ops.unlink,
                  rmdir: it.node_ops.rmdir,
                  readdir: it.node_ops.readdir,
                  symlink: it.node_ops.symlink,
                },
                stream: { llseek: it.stream_ops.llseek },
              },
              file: {
                node: {
                  getattr: it.node_ops.getattr,
                  setattr: it.node_ops.setattr,
                },
                stream: {
                  llseek: it.stream_ops.llseek,
                  read: it.stream_ops.read,
                  write: it.stream_ops.write,
                  allocate: it.stream_ops.allocate,
                  mmap: it.stream_ops.mmap,
                  msync: it.stream_ops.msync,
                },
              },
              link: {
                node: {
                  getattr: it.node_ops.getattr,
                  setattr: it.node_ops.setattr,
                  readlink: it.node_ops.readlink,
                },
                stream: {},
              },
              chrdev: {
                node: {
                  getattr: it.node_ops.getattr,
                  setattr: it.node_ops.setattr,
                },
                stream: ct.chrdev_stream_ops,
              },
            });
          var o = ct.createNode(e, t, r, n);
          return (
            ct.isDir(o.mode)
              ? ((o.node_ops = it.ops_table.dir.node),
                (o.stream_ops = it.ops_table.dir.stream),
                (o.contents = {}))
              : ct.isFile(o.mode)
              ? ((o.node_ops = it.ops_table.file.node),
                (o.stream_ops = it.ops_table.file.stream),
                (o.usedBytes = 0),
                (o.contents = null))
              : ct.isLink(o.mode)
              ? ((o.node_ops = it.ops_table.link.node),
                (o.stream_ops = it.ops_table.link.stream))
              : ct.isChrdev(o.mode) &&
                ((o.node_ops = it.ops_table.chrdev.node),
                (o.stream_ops = it.ops_table.chrdev.stream)),
            (o.timestamp = Date.now()),
            e && ((e.contents[t] = o), (e.timestamp = o.timestamp)),
            o
          );
        },
        getFileDataAsTypedArray: function (e) {
          return e.contents
            ? e.contents.subarray
              ? e.contents.subarray(0, e.usedBytes)
              : new Uint8Array(e.contents)
            : new Uint8Array(0);
        },
        expandFileStorage: function (e, t) {
          var r = e.contents ? e.contents.length : 0;
          if (!(r >= t)) {
            (t = Math.max(t, (r * (r < 1048576 ? 2 : 1.125)) >>> 0)),
              0 != r && (t = Math.max(t, 256));
            var n = e.contents;
            (e.contents = new Uint8Array(t)),
              e.usedBytes > 0 && e.contents.set(n.subarray(0, e.usedBytes), 0);
          }
        },
        resizeFileStorage: function (e, t) {
          if (e.usedBytes != t)
            if (0 == t) (e.contents = null), (e.usedBytes = 0);
            else {
              var r = e.contents;
              (e.contents = new Uint8Array(t)),
                r && e.contents.set(r.subarray(0, Math.min(t, e.usedBytes))),
                (e.usedBytes = t);
            }
        },
        node_ops: {
          getattr: function (e) {
            var t = {};
            return (
              (t.dev = ct.isChrdev(e.mode) ? e.id : 1),
              (t.ino = e.id),
              (t.mode = e.mode),
              (t.nlink = 1),
              (t.uid = 0),
              (t.gid = 0),
              (t.rdev = e.rdev),
              ct.isDir(e.mode)
                ? (t.size = 4096)
                : ct.isFile(e.mode)
                ? (t.size = e.usedBytes)
                : ct.isLink(e.mode)
                ? (t.size = e.link.length)
                : (t.size = 0),
              (t.atime = new Date(e.timestamp)),
              (t.mtime = new Date(e.timestamp)),
              (t.ctime = new Date(e.timestamp)),
              (t.blksize = 4096),
              (t.blocks = Math.ceil(t.size / t.blksize)),
              t
            );
          },
          setattr: function (e, t) {
            void 0 !== t.mode && (e.mode = t.mode),
              void 0 !== t.timestamp && (e.timestamp = t.timestamp),
              void 0 !== t.size && it.resizeFileStorage(e, t.size);
          },
          lookup: function (e, t) {
            throw ct.genericErrors[44];
          },
          mknod: function (e, t, r, n) {
            return it.createNode(e, t, r, n);
          },
          rename: function (e, t, r) {
            if (ct.isDir(e.mode)) {
              var n;
              try {
                n = ct.lookupNode(t, r);
              } catch (e) {}
              if (n) for (var o in n.contents) throw new ct.ErrnoError(55);
            }
            delete e.parent.contents[e.name],
              (e.parent.timestamp = Date.now()),
              (e.name = r),
              (t.contents[r] = e),
              (t.timestamp = e.parent.timestamp),
              (e.parent = t);
          },
          unlink: function (e, t) {
            delete e.contents[t], (e.timestamp = Date.now());
          },
          rmdir: function (e, t) {
            var r = ct.lookupNode(e, t);
            for (var n in r.contents) throw new ct.ErrnoError(55);
            delete e.contents[t], (e.timestamp = Date.now());
          },
          readdir: function (e) {
            var t = [".", ".."];
            for (var r in e.contents) e.contents.hasOwnProperty(r) && t.push(r);
            return t;
          },
          symlink: function (e, t, r) {
            var n = it.createNode(e, t, 41471, 0);
            return (n.link = r), n;
          },
          readlink: function (e) {
            if (!ct.isLink(e.mode)) throw new ct.ErrnoError(28);
            return e.link;
          },
        },
        stream_ops: {
          read: function (e, t, r, n, o) {
            var i = e.node.contents;
            if (o >= e.node.usedBytes) return 0;
            var a = Math.min(e.node.usedBytes - o, n);
            if (a > 8 && i.subarray) t.set(i.subarray(o, o + a), r);
            else for (var s = 0; s < a; s++) t[r + s] = i[o + s];
            return a;
          },
          write: function (e, t, r, n, o, i) {
            if ((t.buffer === U.buffer && (i = !1), !n)) return 0;
            var a = e.node;
            if (
              ((a.timestamp = Date.now()),
              t.subarray && (!a.contents || a.contents.subarray))
            ) {
              if (i)
                return (
                  (a.contents = t.subarray(r, r + n)), (a.usedBytes = n), n
                );
              if (0 === a.usedBytes && 0 === o)
                return (a.contents = t.slice(r, r + n)), (a.usedBytes = n), n;
              if (o + n <= a.usedBytes)
                return a.contents.set(t.subarray(r, r + n), o), n;
            }
            if (
              (it.expandFileStorage(a, o + n),
              a.contents.subarray && t.subarray)
            )
              a.contents.set(t.subarray(r, r + n), o);
            else for (var s = 0; s < n; s++) a.contents[o + s] = t[r + s];
            return (a.usedBytes = Math.max(a.usedBytes, o + n)), n;
          },
          llseek: function (e, t, r) {
            var n = t;
            if (
              (1 === r
                ? (n += e.position)
                : 2 === r && ct.isFile(e.node.mode) && (n += e.node.usedBytes),
              n < 0)
            )
              throw new ct.ErrnoError(28);
            return n;
          },
          allocate: function (e, t, r) {
            it.expandFileStorage(e.node, t + r),
              (e.node.usedBytes = Math.max(e.node.usedBytes, t + r));
          },
          mmap: function (e, t, r, n, o) {
            if (!ct.isFile(e.node.mode)) throw new ct.ErrnoError(43);
            var i,
              a,
              s = e.node.contents;
            if (2 & o || s.buffer !== $) {
              if (
                ((r > 0 || r + t < s.length) &&
                  (s = s.subarray
                    ? s.subarray(r, r + t)
                    : Array.prototype.slice.call(s, r, r + t)),
                (a = !0),
                !(i = ot(t)))
              )
                throw new ct.ErrnoError(48);
              U.set(s, i);
            } else (a = !1), (i = s.byteOffset);
            return { ptr: i, allocated: a };
          },
          msync: function (e, t, r, n, o) {
            if (!ct.isFile(e.node.mode)) throw new ct.ErrnoError(43);
            if (2 & o) return 0;
            it.stream_ops.write(e, t, 0, n, r, !1);
            return 0;
          },
        },
      };
      function at(e, t, r, n) {
        var o = n ? "" : "al " + e;
        _(
          e,
          function (r) {
            P(r, 'Loading data file "' + e + '" failed (no arrayBuffer).'),
              t(new Uint8Array(r)),
              o && ge();
          },
          function (t) {
            if (!r) throw 'Loading data file "' + e + '" failed.';
            r();
          },
        ),
          o && we();
      }
      var st = {
          DIR_MODE: 16895,
          FILE_MODE: 33279,
          reader: null,
          mount: function (e) {
            P(y), st.reader || (st.reader = new FileReaderSync());
            var t = st.createNode(null, "/", st.DIR_MODE, 0),
              r = {};
            function n(e) {
              for (var n = e.split("/"), o = t, i = 0; i < n.length - 1; i++) {
                var a = n.slice(0, i + 1).join("/");
                r[a] || (r[a] = st.createNode(o, n[i], st.DIR_MODE, 0)),
                  (o = r[a]);
              }
              return o;
            }
            function o(e) {
              var t = e.split("/");
              return t[t.length - 1];
            }
            return (
              Array.prototype.forEach.call(e.opts.files || [], function (e) {
                st.createNode(
                  n(e.name),
                  o(e.name),
                  st.FILE_MODE,
                  0,
                  e,
                  e.lastModifiedDate,
                );
              }),
              (e.opts.blobs || []).forEach(function (e) {
                st.createNode(n(e.name), o(e.name), st.FILE_MODE, 0, e.data);
              }),
              (e.opts.packages || []).forEach(function (e) {
                e.metadata.files.forEach(function (t) {
                  var r = t.filename.substr(1);
                  st.createNode(
                    n(r),
                    o(r),
                    st.FILE_MODE,
                    0,
                    e.blob.slice(t.start, t.end),
                  );
                });
              }),
              t
            );
          },
          createNode: function (e, t, r, n, o, i) {
            var a = ct.createNode(e, t, r);
            return (
              (a.mode = r),
              (a.node_ops = st.node_ops),
              (a.stream_ops = st.stream_ops),
              (a.timestamp = (i || new Date()).getTime()),
              P(st.FILE_MODE !== st.DIR_MODE),
              r === st.FILE_MODE
                ? ((a.size = o.size), (a.contents = o))
                : ((a.size = 4096), (a.contents = {})),
              e && (e.contents[t] = a),
              a
            );
          },
          node_ops: {
            getattr: function (e) {
              return {
                dev: 1,
                ino: e.id,
                mode: e.mode,
                nlink: 1,
                uid: 0,
                gid: 0,
                rdev: void 0,
                size: e.size,
                atime: new Date(e.timestamp),
                mtime: new Date(e.timestamp),
                ctime: new Date(e.timestamp),
                blksize: 4096,
                blocks: Math.ceil(e.size / 4096),
              };
            },
            setattr: function (e, t) {
              void 0 !== t.mode && (e.mode = t.mode),
                void 0 !== t.timestamp && (e.timestamp = t.timestamp);
            },
            lookup: function (e, t) {
              throw new ct.ErrnoError(44);
            },
            mknod: function (e, t, r, n) {
              throw new ct.ErrnoError(63);
            },
            rename: function (e, t, r) {
              throw new ct.ErrnoError(63);
            },
            unlink: function (e, t) {
              throw new ct.ErrnoError(63);
            },
            rmdir: function (e, t) {
              throw new ct.ErrnoError(63);
            },
            readdir: function (e) {
              var t = [".", ".."];
              for (var r in e.contents)
                e.contents.hasOwnProperty(r) && t.push(r);
              return t;
            },
            symlink: function (e, t, r) {
              throw new ct.ErrnoError(63);
            },
            readlink: function (e) {
              throw new ct.ErrnoError(63);
            },
          },
          stream_ops: {
            read: function (e, t, r, n, o) {
              if (o >= e.node.size) return 0;
              var i = e.node.contents.slice(o, o + n),
                a = st.reader.readAsArrayBuffer(i);
              return t.set(new Uint8Array(a), r), i.size;
            },
            write: function (e, t, r, n, o) {
              throw new ct.ErrnoError(29);
            },
            llseek: function (e, t, r) {
              var n = t;
              if (
                (1 === r
                  ? (n += e.position)
                  : 2 === r && ct.isFile(e.node.mode) && (n += e.node.size),
                n < 0)
              )
                throw new ct.ErrnoError(28);
              return n;
            },
          },
        },
        ct = {
          root: null,
          mounts: [],
          devices: {},
          streams: [],
          nextInode: 1,
          nameTable: null,
          currentPath: "/",
          initialized: !1,
          ignorePermissions: !0,
          ErrnoError: null,
          genericErrors: {},
          filesystems: null,
          syncFSRequests: 0,
          lookupPath: (e, t = {}) => {
            if (!(e = et.resolve(ct.cwd(), e))) return { path: "", node: null };
            if (
              (t = Object.assign({ follow_mount: !0, recurse_count: 0 }, t))
                .recurse_count > 8
            )
              throw new ct.ErrnoError(32);
            for (
              var r = Ke.normalizeArray(
                  e.split("/").filter((e) => !!e),
                  !1,
                ),
                n = ct.root,
                o = "/",
                i = 0;
              i < r.length;
              i++
            ) {
              var a = i === r.length - 1;
              if (a && t.parent) break;
              if (
                ((n = ct.lookupNode(n, r[i])),
                (o = Ke.join2(o, r[i])),
                ct.isMountpoint(n) &&
                  (!a || (a && t.follow_mount)) &&
                  (n = n.mounted.root),
                !a || t.follow)
              )
                for (var s = 0; ct.isLink(n.mode); ) {
                  var c = ct.readlink(o);
                  if (
                    ((o = et.resolve(Ke.dirname(o), c)),
                    (n = ct.lookupPath(o, {
                      recurse_count: t.recurse_count + 1,
                    }).node),
                    s++ > 40)
                  )
                    throw new ct.ErrnoError(32);
                }
            }
            return { path: o, node: n };
          },
          getPath: (e) => {
            for (var t; ; ) {
              if (ct.isRoot(e)) {
                var r = e.mount.mountpoint;
                return t ? ("/" !== r[r.length - 1] ? r + "/" + t : r + t) : r;
              }
              (t = t ? e.name + "/" + t : e.name), (e = e.parent);
            }
          },
          hashName: (e, t) => {
            for (var r = 0, n = 0; n < t.length; n++)
              r = ((r << 5) - r + t.charCodeAt(n)) | 0;
            return ((e + r) >>> 0) % ct.nameTable.length;
          },
          hashAddNode: (e) => {
            var t = ct.hashName(e.parent.id, e.name);
            (e.name_next = ct.nameTable[t]), (ct.nameTable[t] = e);
          },
          hashRemoveNode: (e) => {
            var t = ct.hashName(e.parent.id, e.name);
            if (ct.nameTable[t] === e) ct.nameTable[t] = e.name_next;
            else
              for (var r = ct.nameTable[t]; r; ) {
                if (r.name_next === e) {
                  r.name_next = e.name_next;
                  break;
                }
                r = r.name_next;
              }
          },
          lookupNode: (e, t) => {
            var r = ct.mayLookup(e);
            if (r) throw new ct.ErrnoError(r, e);
            for (
              var n = ct.hashName(e.id, t), o = ct.nameTable[n];
              o;
              o = o.name_next
            ) {
              var i = o.name;
              if (o.parent.id === e.id && i === t) return o;
            }
            return ct.lookup(e, t);
          },
          createNode: (e, t, r, n) => {
            var o = new ct.FSNode(e, t, r, n);
            return ct.hashAddNode(o), o;
          },
          destroyNode: (e) => {
            ct.hashRemoveNode(e);
          },
          isRoot: (e) => e === e.parent,
          isMountpoint: (e) => !!e.mounted,
          isFile: (e) => 32768 == (61440 & e),
          isDir: (e) => 16384 == (61440 & e),
          isLink: (e) => 40960 == (61440 & e),
          isChrdev: (e) => 8192 == (61440 & e),
          isBlkdev: (e) => 24576 == (61440 & e),
          isFIFO: (e) => 4096 == (61440 & e),
          isSocket: (e) => 49152 == (49152 & e),
          flagModes: { r: 0, "r+": 2, w: 577, "w+": 578, a: 1089, "a+": 1090 },
          modeStringToFlags: (e) => {
            var t = ct.flagModes[e];
            if (void 0 === t) throw new Error("Unknown file open mode: " + e);
            return t;
          },
          flagsToPermissionString: (e) => {
            var t = ["r", "w", "rw"][3 & e];
            return 512 & e && (t += "w"), t;
          },
          nodePermissions: (e, t) =>
            ct.ignorePermissions ||
            ((!t.includes("r") || 292 & e.mode) &&
              (!t.includes("w") || 146 & e.mode) &&
              (!t.includes("x") || 73 & e.mode))
              ? 0
              : 2,
          mayLookup: (e) => {
            var t = ct.nodePermissions(e, "x");
            return t || (e.node_ops.lookup ? 0 : 2);
          },
          mayCreate: (e, t) => {
            try {
              ct.lookupNode(e, t);
              return 20;
            } catch (e) {}
            return ct.nodePermissions(e, "wx");
          },
          mayDelete: (e, t, r) => {
            var n;
            try {
              n = ct.lookupNode(e, t);
            } catch (e) {
              return e.errno;
            }
            var o = ct.nodePermissions(e, "wx");
            if (o) return o;
            if (r) {
              if (!ct.isDir(n.mode)) return 54;
              if (ct.isRoot(n) || ct.getPath(n) === ct.cwd()) return 10;
            } else if (ct.isDir(n.mode)) return 31;
            return 0;
          },
          mayOpen: (e, t) =>
            e
              ? ct.isLink(e.mode)
                ? 32
                : ct.isDir(e.mode) &&
                  ("r" !== ct.flagsToPermissionString(t) || 512 & t)
                ? 31
                : ct.nodePermissions(e, ct.flagsToPermissionString(t))
              : 44,
          MAX_OPEN_FDS: 4096,
          nextfd: (e = 0, t = ct.MAX_OPEN_FDS) => {
            for (var r = e; r <= t; r++) if (!ct.streams[r]) return r;
            throw new ct.ErrnoError(33);
          },
          getStream: (e) => ct.streams[e],
          createStream: (e, t, r) => {
            ct.FSStream ||
              ((ct.FSStream = function () {
                this.shared = {};
              }),
              (ct.FSStream.prototype = {
                object: {
                  get: function () {
                    return this.node;
                  },
                  set: function (e) {
                    this.node = e;
                  },
                },
                isRead: {
                  get: function () {
                    return 1 != (2097155 & this.flags);
                  },
                },
                isWrite: {
                  get: function () {
                    return 0 != (2097155 & this.flags);
                  },
                },
                isAppend: {
                  get: function () {
                    return 1024 & this.flags;
                  },
                },
                flags: {
                  get: function () {
                    return this.shared.flags;
                  },
                  set: function (e) {
                    this.shared.flags = e;
                  },
                },
                position: {
                  get function() {
                    return this.shared.position;
                  },
                  set: function (e) {
                    this.shared.position = e;
                  },
                },
              })),
              (e = Object.assign(new ct.FSStream(), e));
            var n = ct.nextfd(t, r);
            return (e.fd = n), (ct.streams[n] = e), e;
          },
          closeStream: (e) => {
            ct.streams[e] = null;
          },
          chrdev_stream_ops: {
            open: (e) => {
              var t = ct.getDevice(e.node.rdev);
              (e.stream_ops = t.stream_ops),
                e.stream_ops.open && e.stream_ops.open(e);
            },
            llseek: () => {
              throw new ct.ErrnoError(70);
            },
          },
          major: (e) => e >> 8,
          minor: (e) => 255 & e,
          makedev: (e, t) => (e << 8) | t,
          registerDevice: (e, t) => {
            ct.devices[e] = { stream_ops: t };
          },
          getDevice: (e) => ct.devices[e],
          getMounts: (e) => {
            for (var t = [], r = [e]; r.length; ) {
              var n = r.pop();
              t.push(n), r.push.apply(r, n.mounts);
            }
            return t;
          },
          syncfs: (e, t) => {
            "function" == typeof e && ((t = e), (e = !1)),
              ct.syncFSRequests++,
              ct.syncFSRequests > 1 &&
                N(
                  "warning: " +
                    ct.syncFSRequests +
                    " FS.syncfs operations in flight at once, probably just doing extra work",
                );
            var r = ct.getMounts(ct.root.mount),
              n = 0;
            function o(e) {
              return ct.syncFSRequests--, t(e);
            }
            function i(e) {
              if (e) return i.errored ? void 0 : ((i.errored = !0), o(e));
              ++n >= r.length && o(null);
            }
            r.forEach((t) => {
              if (!t.type.syncfs) return i(null);
              t.type.syncfs(t, e, i);
            });
          },
          mount: (e, t, r) => {
            var n,
              o = "/" === r,
              i = !r;
            if (o && ct.root) throw new ct.ErrnoError(10);
            if (!o && !i) {
              var a = ct.lookupPath(r, { follow_mount: !1 });
              if (((r = a.path), (n = a.node), ct.isMountpoint(n)))
                throw new ct.ErrnoError(10);
              if (!ct.isDir(n.mode)) throw new ct.ErrnoError(54);
            }
            var s = { type: e, opts: t, mountpoint: r, mounts: [] },
              c = e.mount(s);
            return (
              (c.mount = s),
              (s.root = c),
              o
                ? (ct.root = c)
                : n && ((n.mounted = s), n.mount && n.mount.mounts.push(s)),
              c
            );
          },
          unmount: (e) => {
            var t = ct.lookupPath(e, { follow_mount: !1 });
            if (!ct.isMountpoint(t.node)) throw new ct.ErrnoError(28);
            var r = t.node,
              n = r.mounted,
              o = ct.getMounts(n);
            Object.keys(ct.nameTable).forEach((e) => {
              for (var t = ct.nameTable[e]; t; ) {
                var r = t.name_next;
                o.includes(t.mount) && ct.destroyNode(t), (t = r);
              }
            }),
              (r.mounted = null);
            var i = r.mount.mounts.indexOf(n);
            r.mount.mounts.splice(i, 1);
          },
          lookup: (e, t) => e.node_ops.lookup(e, t),
          mknod: (e, t, r) => {
            var n = ct.lookupPath(e, { parent: !0 }).node,
              o = Ke.basename(e);
            if (!o || "." === o || ".." === o) throw new ct.ErrnoError(28);
            var i = ct.mayCreate(n, o);
            if (i) throw new ct.ErrnoError(i);
            if (!n.node_ops.mknod) throw new ct.ErrnoError(63);
            return n.node_ops.mknod(n, o, t, r);
          },
          create: (e, t) => (
            (t = void 0 !== t ? t : 438),
            (t &= 4095),
            (t |= 32768),
            ct.mknod(e, t, 0)
          ),
          mkdir: (e, t) => (
            (t = void 0 !== t ? t : 511),
            (t &= 1023),
            (t |= 16384),
            ct.mknod(e, t, 0)
          ),
          mkdirTree: (e, t) => {
            for (var r = e.split("/"), n = "", o = 0; o < r.length; ++o)
              if (r[o]) {
                n += "/" + r[o];
                try {
                  ct.mkdir(n, t);
                } catch (e) {
                  if (20 != e.errno) throw e;
                }
              }
          },
          mkdev: (e, t, r) => (
            void 0 === r && ((r = t), (t = 438)), (t |= 8192), ct.mknod(e, t, r)
          ),
          symlink: (e, t) => {
            if (!et.resolve(e)) throw new ct.ErrnoError(44);
            var r = ct.lookupPath(t, { parent: !0 }).node;
            if (!r) throw new ct.ErrnoError(44);
            var n = Ke.basename(t),
              o = ct.mayCreate(r, n);
            if (o) throw new ct.ErrnoError(o);
            if (!r.node_ops.symlink) throw new ct.ErrnoError(63);
            return r.node_ops.symlink(r, n, e);
          },
          rename: (e, t) => {
            var r,
              n,
              o = Ke.dirname(e),
              i = Ke.dirname(t),
              a = Ke.basename(e),
              s = Ke.basename(t);
            if (
              ((r = ct.lookupPath(e, { parent: !0 }).node),
              (n = ct.lookupPath(t, { parent: !0 }).node),
              !r || !n)
            )
              throw new ct.ErrnoError(44);
            if (r.mount !== n.mount) throw new ct.ErrnoError(75);
            var c,
              _ = ct.lookupNode(r, a),
              u = et.relative(e, i);
            if ("." !== u.charAt(0)) throw new ct.ErrnoError(28);
            if ("." !== (u = et.relative(t, o)).charAt(0))
              throw new ct.ErrnoError(55);
            try {
              c = ct.lookupNode(n, s);
            } catch (e) {}
            if (_ !== c) {
              var l = ct.isDir(_.mode),
                f = ct.mayDelete(r, a, l);
              if (f) throw new ct.ErrnoError(f);
              if ((f = c ? ct.mayDelete(n, s, l) : ct.mayCreate(n, s)))
                throw new ct.ErrnoError(f);
              if (!r.node_ops.rename) throw new ct.ErrnoError(63);
              if (ct.isMountpoint(_) || (c && ct.isMountpoint(c)))
                throw new ct.ErrnoError(10);
              if (n !== r && (f = ct.nodePermissions(r, "w")))
                throw new ct.ErrnoError(f);
              ct.hashRemoveNode(_);
              try {
                r.node_ops.rename(_, n, s);
              } catch (e) {
                throw e;
              } finally {
                ct.hashAddNode(_);
              }
            }
          },
          rmdir: (e) => {
            var t = ct.lookupPath(e, { parent: !0 }).node,
              r = Ke.basename(e),
              n = ct.lookupNode(t, r),
              o = ct.mayDelete(t, r, !0);
            if (o) throw new ct.ErrnoError(o);
            if (!t.node_ops.rmdir) throw new ct.ErrnoError(63);
            if (ct.isMountpoint(n)) throw new ct.ErrnoError(10);
            t.node_ops.rmdir(t, r), ct.destroyNode(n);
          },
          readdir: (e) => {
            var t = ct.lookupPath(e, { follow: !0 }).node;
            if (!t.node_ops.readdir) throw new ct.ErrnoError(54);
            return t.node_ops.readdir(t);
          },
          unlink: (e) => {
            var t = ct.lookupPath(e, { parent: !0 }).node;
            if (!t) throw new ct.ErrnoError(44);
            var r = Ke.basename(e),
              n = ct.lookupNode(t, r),
              o = ct.mayDelete(t, r, !1);
            if (o) throw new ct.ErrnoError(o);
            if (!t.node_ops.unlink) throw new ct.ErrnoError(63);
            if (ct.isMountpoint(n)) throw new ct.ErrnoError(10);
            t.node_ops.unlink(t, r), ct.destroyNode(n);
          },
          readlink: (e) => {
            var t = ct.lookupPath(e).node;
            if (!t) throw new ct.ErrnoError(44);
            if (!t.node_ops.readlink) throw new ct.ErrnoError(28);
            return et.resolve(ct.getPath(t.parent), t.node_ops.readlink(t));
          },
          stat: (e, t) => {
            var r = ct.lookupPath(e, { follow: !t }).node;
            if (!r) throw new ct.ErrnoError(44);
            if (!r.node_ops.getattr) throw new ct.ErrnoError(63);
            return r.node_ops.getattr(r);
          },
          lstat: (e) => ct.stat(e, !0),
          chmod: (e, t, r) => {
            var n;
            "string" == typeof e
              ? (n = ct.lookupPath(e, { follow: !r }).node)
              : (n = e);
            if (!n.node_ops.setattr) throw new ct.ErrnoError(63);
            n.node_ops.setattr(n, {
              mode: (4095 & t) | (-4096 & n.mode),
              timestamp: Date.now(),
            });
          },
          lchmod: (e, t) => {
            ct.chmod(e, t, !0);
          },
          fchmod: (e, t) => {
            var r = ct.getStream(e);
            if (!r) throw new ct.ErrnoError(8);
            ct.chmod(r.node, t);
          },
          chown: (e, t, r, n) => {
            var o;
            "string" == typeof e
              ? (o = ct.lookupPath(e, { follow: !n }).node)
              : (o = e);
            if (!o.node_ops.setattr) throw new ct.ErrnoError(63);
            o.node_ops.setattr(o, { timestamp: Date.now() });
          },
          lchown: (e, t, r) => {
            ct.chown(e, t, r, !0);
          },
          fchown: (e, t, r) => {
            var n = ct.getStream(e);
            if (!n) throw new ct.ErrnoError(8);
            ct.chown(n.node, t, r);
          },
          truncate: (e, t) => {
            if (t < 0) throw new ct.ErrnoError(28);
            var r;
            "string" == typeof e
              ? (r = ct.lookupPath(e, { follow: !0 }).node)
              : (r = e);
            if (!r.node_ops.setattr) throw new ct.ErrnoError(63);
            if (ct.isDir(r.mode)) throw new ct.ErrnoError(31);
            if (!ct.isFile(r.mode)) throw new ct.ErrnoError(28);
            var n = ct.nodePermissions(r, "w");
            if (n) throw new ct.ErrnoError(n);
            r.node_ops.setattr(r, { size: t, timestamp: Date.now() });
          },
          ftruncate: (e, t) => {
            var r = ct.getStream(e);
            if (!r) throw new ct.ErrnoError(8);
            if (0 == (2097155 & r.flags)) throw new ct.ErrnoError(28);
            ct.truncate(r.node, t);
          },
          utime: (e, t, r) => {
            var n = ct.lookupPath(e, { follow: !0 }).node;
            n.node_ops.setattr(n, { timestamp: Math.max(t, r) });
          },
          open: (e, t, r) => {
            if ("" === e) throw new ct.ErrnoError(44);
            var n;
            if (
              ((r = void 0 === r ? 438 : r),
              (r =
                64 & (t = "string" == typeof t ? ct.modeStringToFlags(t) : t)
                  ? (4095 & r) | 32768
                  : 0),
              "object" == typeof e)
            )
              n = e;
            else {
              e = Ke.normalize(e);
              try {
                n = ct.lookupPath(e, { follow: !(131072 & t) }).node;
              } catch (e) {}
            }
            var i = !1;
            if (64 & t)
              if (n) {
                if (128 & t) throw new ct.ErrnoError(20);
              } else (n = ct.mknod(e, r, 0)), (i = !0);
            if (!n) throw new ct.ErrnoError(44);
            if (
              (ct.isChrdev(n.mode) && (t &= -513),
              65536 & t && !ct.isDir(n.mode))
            )
              throw new ct.ErrnoError(54);
            if (!i) {
              var a = ct.mayOpen(n, t);
              if (a) throw new ct.ErrnoError(a);
            }
            512 & t && !i && ct.truncate(n, 0), (t &= -131713);
            var s = ct.createStream({
              node: n,
              path: ct.getPath(n),
              flags: t,
              seekable: !0,
              position: 0,
              stream_ops: n.stream_ops,
              ungotten: [],
              error: !1,
            });
            return (
              s.stream_ops.open && s.stream_ops.open(s),
              !o.logReadFiles ||
                1 & t ||
                (ct.readFiles || (ct.readFiles = {}),
                e in ct.readFiles || (ct.readFiles[e] = 1)),
              s
            );
          },
          close: (e) => {
            if (ct.isClosed(e)) throw new ct.ErrnoError(8);
            e.getdents && (e.getdents = null);
            try {
              e.stream_ops.close && e.stream_ops.close(e);
            } catch (e) {
              throw e;
            } finally {
              ct.closeStream(e.fd);
            }
            e.fd = null;
          },
          isClosed: (e) => null === e.fd,
          llseek: (e, t, r) => {
            if (ct.isClosed(e)) throw new ct.ErrnoError(8);
            if (!e.seekable || !e.stream_ops.llseek)
              throw new ct.ErrnoError(70);
            if (0 != r && 1 != r && 2 != r) throw new ct.ErrnoError(28);
            return (
              (e.position = e.stream_ops.llseek(e, t, r)),
              (e.ungotten = []),
              e.position
            );
          },
          read: (e, t, r, n, o) => {
            if (n < 0 || o < 0) throw new ct.ErrnoError(28);
            if (ct.isClosed(e)) throw new ct.ErrnoError(8);
            if (1 == (2097155 & e.flags)) throw new ct.ErrnoError(8);
            if (ct.isDir(e.node.mode)) throw new ct.ErrnoError(31);
            if (!e.stream_ops.read) throw new ct.ErrnoError(28);
            var i = void 0 !== o;
            if (i) {
              if (!e.seekable) throw new ct.ErrnoError(70);
            } else o = e.position;
            var a = e.stream_ops.read(e, t, r, n, o);
            return i || (e.position += a), a;
          },
          write: (e, t, r, n, o, i) => {
            if (n < 0 || o < 0) throw new ct.ErrnoError(28);
            if (ct.isClosed(e)) throw new ct.ErrnoError(8);
            if (0 == (2097155 & e.flags)) throw new ct.ErrnoError(8);
            if (ct.isDir(e.node.mode)) throw new ct.ErrnoError(31);
            if (!e.stream_ops.write) throw new ct.ErrnoError(28);
            e.seekable && 1024 & e.flags && ct.llseek(e, 0, 2);
            var a = void 0 !== o;
            if (a) {
              if (!e.seekable) throw new ct.ErrnoError(70);
            } else o = e.position;
            var s = e.stream_ops.write(e, t, r, n, o, i);
            return a || (e.position += s), s;
          },
          allocate: (e, t, r) => {
            if (ct.isClosed(e)) throw new ct.ErrnoError(8);
            if (t < 0 || r <= 0) throw new ct.ErrnoError(28);
            if (0 == (2097155 & e.flags)) throw new ct.ErrnoError(8);
            if (!ct.isFile(e.node.mode) && !ct.isDir(e.node.mode))
              throw new ct.ErrnoError(43);
            if (!e.stream_ops.allocate) throw new ct.ErrnoError(138);
            e.stream_ops.allocate(e, t, r);
          },
          mmap: (e, t, r, n, o) => {
            if (0 != (2 & n) && 0 == (2 & o) && 2 != (2097155 & e.flags))
              throw new ct.ErrnoError(2);
            if (1 == (2097155 & e.flags)) throw new ct.ErrnoError(2);
            if (!e.stream_ops.mmap) throw new ct.ErrnoError(43);
            return e.stream_ops.mmap(e, t, r, n, o);
          },
          msync: (e, t, r, n, o) =>
            e && e.stream_ops.msync ? e.stream_ops.msync(e, t, r, n, o) : 0,
          munmap: (e) => 0,
          ioctl: (e, t, r) => {
            if (!e.stream_ops.ioctl) throw new ct.ErrnoError(59);
            return e.stream_ops.ioctl(e, t, r);
          },
          readFile: (e, t = {}) => {
            if (
              ((t.flags = t.flags || 0),
              (t.encoding = t.encoding || "binary"),
              "utf8" !== t.encoding && "binary" !== t.encoding)
            )
              throw new Error('Invalid encoding type "' + t.encoding + '"');
            var r,
              n = ct.open(e, t.flags),
              o = ct.stat(e).size,
              i = new Uint8Array(o);
            return (
              ct.read(n, i, 0, o, 0),
              "utf8" === t.encoding
                ? (r = J(i, 0))
                : "binary" === t.encoding && (r = i),
              ct.close(n),
              r
            );
          },
          writeFile: (e, t, r = {}) => {
            r.flags = r.flags || 577;
            var n = ct.open(e, r.flags, r.mode);
            if ("string" == typeof t) {
              var o = new Uint8Array(K(t) + 1),
                i = X(t, o, 0, o.length);
              ct.write(n, o, 0, i, void 0, r.canOwn);
            } else {
              if (!ArrayBuffer.isView(t))
                throw new Error("Unsupported data type");
              ct.write(n, t, 0, t.byteLength, void 0, r.canOwn);
            }
            ct.close(n);
          },
          cwd: () => ct.currentPath,
          chdir: (e) => {
            var t = ct.lookupPath(e, { follow: !0 });
            if (null === t.node) throw new ct.ErrnoError(44);
            if (!ct.isDir(t.node.mode)) throw new ct.ErrnoError(54);
            var r = ct.nodePermissions(t.node, "x");
            if (r) throw new ct.ErrnoError(r);
            ct.currentPath = t.path;
          },
          createDefaultDirectories: () => {
            ct.mkdir("/tmp"), ct.mkdir("/home"), ct.mkdir("/home/web_user");
          },
          createDefaultDevices: () => {
            ct.mkdir("/dev"),
              ct.registerDevice(ct.makedev(1, 3), {
                read: () => 0,
                write: (e, t, r, n, o) => n,
              }),
              ct.mkdev("/dev/null", ct.makedev(1, 3)),
              tt.register(ct.makedev(5, 0), tt.default_tty_ops),
              tt.register(ct.makedev(6, 0), tt.default_tty1_ops),
              ct.mkdev("/dev/tty", ct.makedev(5, 0)),
              ct.mkdev("/dev/tty1", ct.makedev(6, 0));
            var e = Qe();
            ct.createDevice("/dev", "random", e),
              ct.createDevice("/dev", "urandom", e),
              ct.mkdir("/dev/shm"),
              ct.mkdir("/dev/shm/tmp");
          },
          createSpecialDirectories: () => {
            ct.mkdir("/proc");
            var e = ct.mkdir("/proc/self");
            ct.mkdir("/proc/self/fd"),
              ct.mount(
                {
                  mount: () => {
                    var t = ct.createNode(e, "fd", 16895, 73);
                    return (
                      (t.node_ops = {
                        lookup: (e, t) => {
                          var r = +t,
                            n = ct.getStream(r);
                          if (!n) throw new ct.ErrnoError(8);
                          var o = {
                            parent: null,
                            mount: { mountpoint: "fake" },
                            node_ops: { readlink: () => n.path },
                          };
                          return (o.parent = o), o;
                        },
                      }),
                      t
                    );
                  },
                },
                {},
                "/proc/self/fd",
              );
          },
          createStandardStreams: () => {
            o.stdin
              ? ct.createDevice("/dev", "stdin", o.stdin)
              : ct.symlink("/dev/tty", "/dev/stdin"),
              o.stdout
                ? ct.createDevice("/dev", "stdout", null, o.stdout)
                : ct.symlink("/dev/tty", "/dev/stdout"),
              o.stderr
                ? ct.createDevice("/dev", "stderr", null, o.stderr)
                : ct.symlink("/dev/tty1", "/dev/stderr");
            ct.open("/dev/stdin", 0),
              ct.open("/dev/stdout", 1),
              ct.open("/dev/stderr", 1);
          },
          ensureErrnoError: () => {
            ct.ErrnoError ||
              ((ct.ErrnoError = function (e, t) {
                (this.node = t),
                  (this.setErrno = function (e) {
                    this.errno = e;
                  }),
                  this.setErrno(e),
                  (this.message = "FS error");
              }),
              (ct.ErrnoError.prototype = new Error()),
              (ct.ErrnoError.prototype.constructor = ct.ErrnoError),
              [44].forEach((e) => {
                (ct.genericErrors[e] = new ct.ErrnoError(e)),
                  (ct.genericErrors[e].stack = "<generic error, no stack>");
              }));
          },
          staticInit: () => {
            ct.ensureErrnoError(),
              (ct.nameTable = new Array(4096)),
              ct.mount(it, {}, "/"),
              ct.createDefaultDirectories(),
              ct.createDefaultDevices(),
              ct.createSpecialDirectories(),
              (ct.filesystems = { MEMFS: it, WORKERFS: st });
          },
          init: (e, t, r) => {
            (ct.init.initialized = !0),
              ct.ensureErrnoError(),
              (o.stdin = e || o.stdin),
              (o.stdout = t || o.stdout),
              (o.stderr = r || o.stderr),
              ct.createStandardStreams();
          },
          quit: () => {
            ct.init.initialized = !1;
            for (var e = 0; e < ct.streams.length; e++) {
              var t = ct.streams[e];
              t && ct.close(t);
            }
          },
          getMode: (e, t) => {
            var r = 0;
            return e && (r |= 365), t && (r |= 146), r;
          },
          findObject: (e, t) => {
            var r = ct.analyzePath(e, t);
            return r.exists ? r.object : null;
          },
          analyzePath: (e, t) => {
            try {
              e = (n = ct.lookupPath(e, { follow: !t })).path;
            } catch (e) {}
            var r = {
              isRoot: !1,
              exists: !1,
              error: 0,
              name: null,
              path: null,
              object: null,
              parentExists: !1,
              parentPath: null,
              parentObject: null,
            };
            try {
              var n = ct.lookupPath(e, { parent: !0 });
              (r.parentExists = !0),
                (r.parentPath = n.path),
                (r.parentObject = n.node),
                (r.name = Ke.basename(e)),
                (n = ct.lookupPath(e, { follow: !t })),
                (r.exists = !0),
                (r.path = n.path),
                (r.object = n.node),
                (r.name = n.node.name),
                (r.isRoot = "/" === n.path);
            } catch (e) {
              r.error = e.errno;
            }
            return r;
          },
          createPath: (e, t, r, n) => {
            e = "string" == typeof e ? e : ct.getPath(e);
            for (var o = t.split("/").reverse(); o.length; ) {
              var i = o.pop();
              if (i) {
                var a = Ke.join2(e, i);
                try {
                  ct.mkdir(a);
                } catch (e) {}
                e = a;
              }
            }
            return a;
          },
          createFile: (e, t, r, n, o) => {
            var i = Ke.join2("string" == typeof e ? e : ct.getPath(e), t),
              a = ct.getMode(n, o);
            return ct.create(i, a);
          },
          createDataFile: (e, t, r, n, o, i) => {
            var a = t;
            e &&
              ((e = "string" == typeof e ? e : ct.getPath(e)),
              (a = t ? Ke.join2(e, t) : e));
            var s = ct.getMode(n, o),
              c = ct.create(a, s);
            if (r) {
              if ("string" == typeof r) {
                for (
                  var _ = new Array(r.length), u = 0, l = r.length;
                  u < l;
                  ++u
                )
                  _[u] = r.charCodeAt(u);
                r = _;
              }
              ct.chmod(c, 146 | s);
              var f = ct.open(c, 577);
              ct.write(f, r, 0, r.length, 0, i), ct.close(f), ct.chmod(c, s);
            }
            return c;
          },
          createDevice: (e, t, r, n) => {
            var o = Ke.join2("string" == typeof e ? e : ct.getPath(e), t),
              i = ct.getMode(!!r, !!n);
            ct.createDevice.major || (ct.createDevice.major = 64);
            var a = ct.makedev(ct.createDevice.major++, 0);
            return (
              ct.registerDevice(a, {
                open: (e) => {
                  e.seekable = !1;
                },
                close: (e) => {
                  n && n.buffer && n.buffer.length && n(10);
                },
                read: (e, t, n, o, i) => {
                  for (var a = 0, s = 0; s < o; s++) {
                    var c;
                    try {
                      c = r();
                    } catch (e) {
                      throw new ct.ErrnoError(29);
                    }
                    if (void 0 === c && 0 === a) throw new ct.ErrnoError(6);
                    if (null == c) break;
                    a++, (t[n + s] = c);
                  }
                  return a && (e.node.timestamp = Date.now()), a;
                },
                write: (e, t, r, o, i) => {
                  for (var a = 0; a < o; a++)
                    try {
                      n(t[r + a]);
                    } catch (e) {
                      throw new ct.ErrnoError(29);
                    }
                  return o && (e.node.timestamp = Date.now()), a;
                },
              }),
              ct.mkdev(o, i, a)
            );
          },
          forceLoadFile: (e) => {
            if (e.isDevice || e.isFolder || e.link || e.contents) return !0;
            if ("undefined" != typeof XMLHttpRequest)
              throw new Error(
                "Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.",
              );
            if (!c)
              throw new Error("Cannot load without read() or XMLHttpRequest.");
            try {
              (e.contents = pn(c(e.url), !0)),
                (e.usedBytes = e.contents.length);
            } catch (e) {
              throw new ct.ErrnoError(29);
            }
          },
          createLazyFile: (e, t, r, n, o) => {
            function i() {
              (this.lengthKnown = !1), (this.chunks = []);
            }
            if (
              ((i.prototype.get = function (e) {
                if (!(e > this.length - 1 || e < 0)) {
                  var t = e % this.chunkSize,
                    r = (e / this.chunkSize) | 0;
                  return this.getter(r)[t];
                }
              }),
              (i.prototype.setDataGetter = function (e) {
                this.getter = e;
              }),
              (i.prototype.cacheLength = function () {
                var e = new XMLHttpRequest();
                if (
                  (e.open("HEAD", r, !1),
                  e.send(null),
                  !((e.status >= 200 && e.status < 300) || 304 === e.status))
                )
                  throw new Error(
                    "Couldn't load " + r + ". Status: " + e.status,
                  );
                var t,
                  n = Number(e.getResponseHeader("Content-length")),
                  o =
                    (t = e.getResponseHeader("Accept-Ranges")) && "bytes" === t,
                  i =
                    (t = e.getResponseHeader("Content-Encoding")) &&
                    "gzip" === t,
                  a = 1048576;
                o || (a = n);
                var s = this;
                s.setDataGetter((e) => {
                  var t = e * a,
                    o = (e + 1) * a - 1;
                  if (
                    ((o = Math.min(o, n - 1)),
                    void 0 === s.chunks[e] &&
                      (s.chunks[e] = ((e, t) => {
                        if (e > t)
                          throw new Error(
                            "invalid range (" +
                              e +
                              ", " +
                              t +
                              ") or no bytes requested!",
                          );
                        if (t > n - 1)
                          throw new Error(
                            "only " + n + " bytes available! programmer error!",
                          );
                        var o = new XMLHttpRequest();
                        if (
                          (o.open("GET", r, !1),
                          n !== a &&
                            o.setRequestHeader("Range", "bytes=" + e + "-" + t),
                          (o.responseType = "arraybuffer"),
                          o.overrideMimeType &&
                            o.overrideMimeType(
                              "text/plain; charset=x-user-defined",
                            ),
                          o.send(null),
                          !(
                            (o.status >= 200 && o.status < 300) ||
                            304 === o.status
                          ))
                        )
                          throw new Error(
                            "Couldn't load " + r + ". Status: " + o.status,
                          );
                        return void 0 !== o.response
                          ? new Uint8Array(o.response || [])
                          : pn(o.responseText || "", !0);
                      })(t, o)),
                    void 0 === s.chunks[e])
                  )
                    throw new Error("doXHR failed!");
                  return s.chunks[e];
                }),
                  (!i && n) ||
                    ((a = n = 1),
                    (n = this.getter(0).length),
                    (a = n),
                    k(
                      "LazyFiles on gzip forces download of the whole file when length is accessed",
                    )),
                  (this._length = n),
                  (this._chunkSize = a),
                  (this.lengthKnown = !0);
              }),
              "undefined" != typeof XMLHttpRequest)
            ) {
              if (!y)
                throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
              var a = new i();
              Object.defineProperties(a, {
                length: {
                  get: function () {
                    return this.lengthKnown || this.cacheLength(), this._length;
                  },
                },
                chunkSize: {
                  get: function () {
                    return (
                      this.lengthKnown || this.cacheLength(), this._chunkSize
                    );
                  },
                },
              });
              var s = { isDevice: !1, contents: a };
            } else s = { isDevice: !1, url: r };
            var c = ct.createFile(e, t, s, n, o);
            s.contents
              ? (c.contents = s.contents)
              : s.url && ((c.contents = null), (c.url = s.url)),
              Object.defineProperties(c, {
                usedBytes: {
                  get: function () {
                    return this.contents.length;
                  },
                },
              });
            var _ = {};
            return (
              Object.keys(c.stream_ops).forEach((e) => {
                var t = c.stream_ops[e];
                _[e] = function () {
                  return ct.forceLoadFile(c), t.apply(null, arguments);
                };
              }),
              (_.read = (e, t, r, n, o) => {
                ct.forceLoadFile(c);
                var i = e.node.contents;
                if (o >= i.length) return 0;
                var a = Math.min(i.length - o, n);
                if (i.slice) for (var s = 0; s < a; s++) t[r + s] = i[o + s];
                else for (s = 0; s < a; s++) t[r + s] = i.get(o + s);
                return a;
              }),
              (c.stream_ops = _),
              c
            );
          },
          createPreloadedFile: (e, t, r, n, o, i, a, s, c, _) => {
            var u = t ? et.resolve(Ke.join2(e, t)) : e;
            function l(r) {
              function l(r) {
                _ && _(),
                  s || ct.createDataFile(e, t, r, n, o, c),
                  i && i(),
                  ge();
              }
              Browser.handledByPreloadPlugin(r, u, l, () => {
                a && a(), ge();
              }) || l(r);
            }
            we(), "string" == typeof r ? at(r, (e) => l(e), a) : l(r);
          },
          indexedDB: () =>
            window.indexedDB ||
            window.mozIndexedDB ||
            window.webkitIndexedDB ||
            window.msIndexedDB,
          DB_NAME: () => "EM_FS_" + window.location.pathname,
          DB_VERSION: 20,
          DB_STORE_NAME: "FILE_DATA",
          saveFilesToDB: (e, t, r) => {
            (t = t || (() => {})), (r = r || (() => {}));
            var n = ct.indexedDB();
            try {
              var o = n.open(ct.DB_NAME(), ct.DB_VERSION);
            } catch (e) {
              return r(e);
            }
            (o.onupgradeneeded = () => {
              k("creating db"), o.result.createObjectStore(ct.DB_STORE_NAME);
            }),
              (o.onsuccess = () => {
                var n = o.result.transaction([ct.DB_STORE_NAME], "readwrite"),
                  i = n.objectStore(ct.DB_STORE_NAME),
                  a = 0,
                  s = 0,
                  c = e.length;
                function _() {
                  0 == s ? t() : r();
                }
                e.forEach((e) => {
                  var t = i.put(ct.analyzePath(e).object.contents, e);
                  (t.onsuccess = () => {
                    ++a + s == c && _();
                  }),
                    (t.onerror = () => {
                      s++, a + s == c && _();
                    });
                }),
                  (n.onerror = r);
              }),
              (o.onerror = r);
          },
          loadFilesFromDB: (e, t, r) => {
            (t = t || (() => {})), (r = r || (() => {}));
            var n = ct.indexedDB();
            try {
              var o = n.open(ct.DB_NAME(), ct.DB_VERSION);
            } catch (e) {
              return r(e);
            }
            (o.onupgradeneeded = r),
              (o.onsuccess = () => {
                var n = o.result;
                try {
                  var i = n.transaction([ct.DB_STORE_NAME], "readonly");
                } catch (e) {
                  return void r(e);
                }
                var a = i.objectStore(ct.DB_STORE_NAME),
                  s = 0,
                  c = 0,
                  _ = e.length;
                function u() {
                  0 == c ? t() : r();
                }
                e.forEach((e) => {
                  var t = a.get(e);
                  (t.onsuccess = () => {
                    ct.analyzePath(e).exists && ct.unlink(e),
                      ct.createDataFile(
                        Ke.dirname(e),
                        Ke.basename(e),
                        t.result,
                        !0,
                        !0,
                        !0,
                      ),
                      ++s + c == _ && u();
                  }),
                    (t.onerror = () => {
                      c++, s + c == _ && u();
                    });
                }),
                  (i.onerror = r);
              }),
              (o.onerror = r);
          },
        },
        _t = {
          DEFAULT_POLLMASK: 5,
          calculateAt: function (e, t, r) {
            if (Ke.isAbs(t)) return t;
            var n;
            if (-100 === e) n = ct.cwd();
            else {
              var o = ct.getStream(e);
              if (!o) throw new ct.ErrnoError(8);
              n = o.path;
            }
            if (0 == t.length) {
              if (!r) throw new ct.ErrnoError(44);
              return n;
            }
            return Ke.join2(n, t);
          },
          doStat: function (e, t, r) {
            try {
              var n = e(t);
            } catch (e) {
              if (
                e &&
                e.node &&
                Ke.normalize(t) !== Ke.normalize(ct.getPath(e.node))
              )
                return -54;
              throw e;
            }
            return (
              (L[r >> 2] = n.dev),
              (L[(r + 4) >> 2] = 0),
              (L[(r + 8) >> 2] = n.ino),
              (L[(r + 12) >> 2] = n.mode),
              (L[(r + 16) >> 2] = n.nlink),
              (L[(r + 20) >> 2] = n.uid),
              (L[(r + 24) >> 2] = n.gid),
              (L[(r + 28) >> 2] = n.rdev),
              (L[(r + 32) >> 2] = 0),
              (Ee = [
                n.size >>> 0,
                ((ve = n.size),
                +Math.abs(ve) >= 1
                  ? ve > 0
                    ? (0 |
                        Math.min(+Math.floor(ve / 4294967296), 4294967295)) >>>
                      0
                    : ~~+Math.ceil((ve - +(~~ve >>> 0)) / 4294967296) >>> 0
                  : 0),
              ]),
              (L[(r + 40) >> 2] = Ee[0]),
              (L[(r + 44) >> 2] = Ee[1]),
              (L[(r + 48) >> 2] = 4096),
              (L[(r + 52) >> 2] = n.blocks),
              (L[(r + 56) >> 2] = (n.atime.getTime() / 1e3) | 0),
              (L[(r + 60) >> 2] = 0),
              (L[(r + 64) >> 2] = (n.mtime.getTime() / 1e3) | 0),
              (L[(r + 68) >> 2] = 0),
              (L[(r + 72) >> 2] = (n.ctime.getTime() / 1e3) | 0),
              (L[(r + 76) >> 2] = 0),
              (Ee = [
                n.ino >>> 0,
                ((ve = n.ino),
                +Math.abs(ve) >= 1
                  ? ve > 0
                    ? (0 |
                        Math.min(+Math.floor(ve / 4294967296), 4294967295)) >>>
                      0
                    : ~~+Math.ceil((ve - +(~~ve >>> 0)) / 4294967296) >>> 0
                  : 0),
              ]),
              (L[(r + 80) >> 2] = Ee[0]),
              (L[(r + 84) >> 2] = Ee[1]),
              0
            );
          },
          doMsync: function (e, t, r, n, o) {
            var i = B.slice(e, e + r);
            ct.msync(t, i, o, r, n);
          },
          varargs: void 0,
          get: function () {
            return (_t.varargs += 4), L[(_t.varargs - 4) >> 2];
          },
          getStr: function (e) {
            return Y(e);
          },
          getStreamFromFD: function (e) {
            var t = ct.getStream(e);
            if (!t) throw new ct.ErrnoError(8);
            return t;
          },
        };
      function ut(e) {
        try {
          return (e = _t.getStr(e)), ct.chdir(e), 0;
        } catch (e) {
          if (void 0 === ct || !(e instanceof ct.ErrnoError)) throw e;
          return -e.errno;
        }
      }
      function lt(e, t) {
        try {
          return (e = _t.getStr(e)), ct.chmod(e, t), 0;
        } catch (e) {
          if (void 0 === ct || !(e instanceof ct.ErrnoError)) throw e;
          return -e.errno;
        }
      }
      var ft = {
        mount: function (e) {
          return (
            (o.websocket =
              o.websocket && "object" == typeof o.websocket ? o.websocket : {}),
            (o.websocket._callbacks = {}),
            (o.websocket.on = function (e, t) {
              return "function" == typeof t && (this._callbacks[e] = t), this;
            }),
            (o.websocket.emit = function (e, t) {
              "function" == typeof this._callbacks[e] &&
                this._callbacks[e].call(this, t);
            }),
            ct.createNode(null, "/", 16895, 0)
          );
        },
        createSocket: function (e, t, r) {
          if (1 == (t &= -526337) && r && 6 != r) throw new ct.ErrnoError(66);
          var n = {
              family: e,
              type: t,
              protocol: r,
              server: null,
              error: null,
              peers: {},
              pending: [],
              recv_queue: [],
              sock_ops: ft.websocket_sock_ops,
            },
            o = ft.nextname(),
            i = ct.createNode(ft.root, o, 49152, 0);
          i.sock = n;
          var a = ct.createStream({
            path: o,
            node: i,
            flags: 2,
            seekable: !1,
            stream_ops: ft.stream_ops,
          });
          return (n.stream = a), n;
        },
        getSocket: function (e) {
          var t = ct.getStream(e);
          return t && ct.isSocket(t.node.mode) ? t.node.sock : null;
        },
        stream_ops: {
          poll: function (e) {
            var t = e.node.sock;
            return t.sock_ops.poll(t);
          },
          ioctl: function (e, t, r) {
            var n = e.node.sock;
            return n.sock_ops.ioctl(n, t, r);
          },
          read: function (e, t, r, n, o) {
            var i = e.node.sock,
              a = i.sock_ops.recvmsg(i, n);
            return a ? (t.set(a.buffer, r), a.buffer.length) : 0;
          },
          write: function (e, t, r, n, o) {
            var i = e.node.sock;
            return i.sock_ops.sendmsg(i, t, r, n);
          },
          close: function (e) {
            var t = e.node.sock;
            t.sock_ops.close(t);
          },
        },
        nextname: function () {
          return (
            ft.nextname.current || (ft.nextname.current = 0),
            "socket[" + ft.nextname.current++ + "]"
          );
        },
        websocket_sock_ops: {
          createPeer: function (e, t, r) {
            var n;
            if (("object" == typeof t && ((n = t), (t = null), (r = null)), n))
              if (n._socket)
                (t = n._socket.remoteAddress), (r = n._socket.remotePort);
              else {
                var a = /ws[s]?:\/\/([^:]+):(\d+)/.exec(n.url);
                if (!a)
                  throw new Error(
                    "WebSocket URL must be in the format ws(s)://address:port",
                  );
                (t = a[1]), (r = parseInt(a[2], 10));
              }
            else
              try {
                var s = o.websocket && "object" == typeof o.websocket,
                  c = "ws:#".replace("#", "//");
                if (
                  (s &&
                    "string" == typeof o.websocket.url &&
                    (c = o.websocket.url),
                  "ws://" === c || "wss://" === c)
                ) {
                  var _ = t.split("/");
                  c = c + _[0] + ":" + r + "/" + _.slice(1).join("/");
                }
                var u = "binary";
                s &&
                  "string" == typeof o.websocket.subprotocol &&
                  (u = o.websocket.subprotocol);
                var l = void 0;
                "null" !== u &&
                  (l = u = u.replace(/^ +| +$/g, "").split(/ *, */)),
                  s &&
                    null === o.websocket.subprotocol &&
                    ((u = "null"), (l = void 0)),
                  ((n = new (b ? i("ws") : WebSocket)(c, l)).binaryType =
                    "arraybuffer");
              } catch (e) {
                throw new ct.ErrnoError(23);
              }
            var f = { addr: t, port: r, socket: n, dgram_send_queue: [] };
            return (
              ft.websocket_sock_ops.addPeer(e, f),
              ft.websocket_sock_ops.handlePeerEvents(e, f),
              2 === e.type &&
                void 0 !== e.sport &&
                f.dgram_send_queue.push(
                  new Uint8Array([
                    255,
                    255,
                    255,
                    255,
                    "p".charCodeAt(0),
                    "o".charCodeAt(0),
                    "r".charCodeAt(0),
                    "t".charCodeAt(0),
                    (65280 & e.sport) >> 8,
                    255 & e.sport,
                  ]),
                ),
              f
            );
          },
          getPeer: function (e, t, r) {
            return e.peers[t + ":" + r];
          },
          addPeer: function (e, t) {
            e.peers[t.addr + ":" + t.port] = t;
          },
          removePeer: function (e, t) {
            delete e.peers[t.addr + ":" + t.port];
          },
          handlePeerEvents: function (e, t) {
            var r = !0,
              n = function () {
                o.websocket.emit("open", e.stream.fd);
                try {
                  for (var r = t.dgram_send_queue.shift(); r; )
                    t.socket.send(r), (r = t.dgram_send_queue.shift());
                } catch (e) {
                  t.socket.close();
                }
              };
            function i(n) {
              if ("string" == typeof n) {
                n = new TextEncoder().encode(n);
              } else {
                if ((P(void 0 !== n.byteLength), 0 == n.byteLength)) return;
                n = new Uint8Array(n);
              }
              var i = r;
              if (
                ((r = !1),
                i &&
                  10 === n.length &&
                  255 === n[0] &&
                  255 === n[1] &&
                  255 === n[2] &&
                  255 === n[3] &&
                  n[4] === "p".charCodeAt(0) &&
                  n[5] === "o".charCodeAt(0) &&
                  n[6] === "r".charCodeAt(0) &&
                  n[7] === "t".charCodeAt(0))
              ) {
                var a = (n[8] << 8) | n[9];
                return (
                  ft.websocket_sock_ops.removePeer(e, t),
                  (t.port = a),
                  void ft.websocket_sock_ops.addPeer(e, t)
                );
              }
              e.recv_queue.push({ addr: t.addr, port: t.port, data: n }),
                o.websocket.emit("message", e.stream.fd);
            }
            b
              ? (t.socket.on("open", n),
                t.socket.on("message", function (e, t) {
                  t && i(new Uint8Array(e).buffer);
                }),
                t.socket.on("close", function () {
                  o.websocket.emit("close", e.stream.fd);
                }),
                t.socket.on("error", function (t) {
                  (e.error = 14),
                    o.websocket.emit("error", [
                      e.stream.fd,
                      e.error,
                      "ECONNREFUSED: Connection refused",
                    ]);
                }))
              : ((t.socket.onopen = n),
                (t.socket.onclose = function () {
                  o.websocket.emit("close", e.stream.fd);
                }),
                (t.socket.onmessage = function (e) {
                  i(e.data);
                }),
                (t.socket.onerror = function (t) {
                  (e.error = 14),
                    o.websocket.emit("error", [
                      e.stream.fd,
                      e.error,
                      "ECONNREFUSED: Connection refused",
                    ]);
                }));
          },
          poll: function (e) {
            if (1 === e.type && e.server) return e.pending.length ? 65 : 0;
            var t = 0,
              r =
                1 === e.type
                  ? ft.websocket_sock_ops.getPeer(e, e.daddr, e.dport)
                  : null;
            return (
              (e.recv_queue.length ||
                !r ||
                (r && r.socket.readyState === r.socket.CLOSING) ||
                (r && r.socket.readyState === r.socket.CLOSED)) &&
                (t |= 65),
              (!r || (r && r.socket.readyState === r.socket.OPEN)) && (t |= 4),
              ((r && r.socket.readyState === r.socket.CLOSING) ||
                (r && r.socket.readyState === r.socket.CLOSED)) &&
                (t |= 16),
              t
            );
          },
          ioctl: function (e, t, r) {
            if (21531 === t) {
              var n = 0;
              return (
                e.recv_queue.length && (n = e.recv_queue[0].data.length),
                (L[r >> 2] = n),
                0
              );
            }
            return 28;
          },
          close: function (e) {
            if (e.server) {
              try {
                e.server.close();
              } catch (e) {}
              e.server = null;
            }
            for (var t = Object.keys(e.peers), r = 0; r < t.length; r++) {
              var n = e.peers[t[r]];
              try {
                n.socket.close();
              } catch (e) {}
              ft.websocket_sock_ops.removePeer(e, n);
            }
            return 0;
          },
          bind: function (e, t, r) {
            if (void 0 !== e.saddr || void 0 !== e.sport)
              throw new ct.ErrnoError(28);
            if (((e.saddr = t), (e.sport = r), 2 === e.type)) {
              e.server && (e.server.close(), (e.server = null));
              try {
                e.sock_ops.listen(e, 0);
              } catch (e) {
                if (!(e instanceof ct.ErrnoError)) throw e;
                if (138 !== e.errno) throw e;
              }
            }
          },
          connect: function (e, t, r) {
            if (e.server) throw new ct.ErrnoError(138);
            if (void 0 !== e.daddr && void 0 !== e.dport) {
              var n = ft.websocket_sock_ops.getPeer(e, e.daddr, e.dport);
              if (n)
                throw n.socket.readyState === n.socket.CONNECTING
                  ? new ct.ErrnoError(7)
                  : new ct.ErrnoError(30);
            }
            var o = ft.websocket_sock_ops.createPeer(e, t, r);
            throw (
              ((e.daddr = o.addr), (e.dport = o.port), new ct.ErrnoError(26))
            );
          },
          listen: function (e, t) {
            if (!b) throw new ct.ErrnoError(138);
            if (e.server) throw new ct.ErrnoError(28);
            var r = i("ws").Server,
              n = e.saddr;
            (e.server = new r({ host: n, port: e.sport })),
              o.websocket.emit("listen", e.stream.fd),
              e.server.on("connection", function (t) {
                if (1 === e.type) {
                  var r = ft.createSocket(e.family, e.type, e.protocol),
                    n = ft.websocket_sock_ops.createPeer(r, t);
                  (r.daddr = n.addr),
                    (r.dport = n.port),
                    e.pending.push(r),
                    o.websocket.emit("connection", r.stream.fd);
                } else
                  ft.websocket_sock_ops.createPeer(e, t),
                    o.websocket.emit("connection", e.stream.fd);
              }),
              e.server.on("close", function () {
                o.websocket.emit("close", e.stream.fd), (e.server = null);
              }),
              e.server.on("error", function (t) {
                (e.error = 23),
                  o.websocket.emit("error", [
                    e.stream.fd,
                    e.error,
                    "EHOSTUNREACH: Host is unreachable",
                  ]);
              });
          },
          accept: function (e) {
            if (!e.server || !e.pending.length) throw new ct.ErrnoError(28);
            var t = e.pending.shift();
            return (t.stream.flags = e.stream.flags), t;
          },
          getname: function (e, t) {
            var r, n;
            if (t) {
              if (void 0 === e.daddr || void 0 === e.dport)
                throw new ct.ErrnoError(53);
              (r = e.daddr), (n = e.dport);
            } else (r = e.saddr || 0), (n = e.sport || 0);
            return { addr: r, port: n };
          },
          sendmsg: function (e, t, r, n, o, i) {
            if (2 === e.type) {
              if (
                ((void 0 !== o && void 0 !== i) ||
                  ((o = e.daddr), (i = e.dport)),
                void 0 === o || void 0 === i)
              )
                throw new ct.ErrnoError(17);
            } else (o = e.daddr), (i = e.dport);
            var a,
              s = ft.websocket_sock_ops.getPeer(e, o, i);
            if (1 === e.type) {
              if (
                !s ||
                s.socket.readyState === s.socket.CLOSING ||
                s.socket.readyState === s.socket.CLOSED
              )
                throw new ct.ErrnoError(53);
              if (s.socket.readyState === s.socket.CONNECTING)
                throw new ct.ErrnoError(6);
            }
            if (
              (ArrayBuffer.isView(t) && ((r += t.byteOffset), (t = t.buffer)),
              (a = t.slice(r, r + n)),
              2 === e.type && (!s || s.socket.readyState !== s.socket.OPEN))
            )
              return (
                (s &&
                  s.socket.readyState !== s.socket.CLOSING &&
                  s.socket.readyState !== s.socket.CLOSED) ||
                  (s = ft.websocket_sock_ops.createPeer(e, o, i)),
                s.dgram_send_queue.push(a),
                n
              );
            try {
              return s.socket.send(a), n;
            } catch (e) {
              throw new ct.ErrnoError(28);
            }
          },
          recvmsg: function (e, t) {
            if (1 === e.type && e.server) throw new ct.ErrnoError(53);
            var r = e.recv_queue.shift();
            if (!r) {
              if (1 === e.type) {
                var n = ft.websocket_sock_ops.getPeer(e, e.daddr, e.dport);
                if (n) {
                  if (
                    n.socket.readyState === n.socket.CLOSING ||
                    n.socket.readyState === n.socket.CLOSED
                  )
                    return null;
                  throw new ct.ErrnoError(6);
                }
                throw new ct.ErrnoError(53);
              }
              throw new ct.ErrnoError(6);
            }
            var o = r.data.byteLength || r.data.length,
              i = r.data.byteOffset || 0,
              a = r.data.buffer || r.data,
              s = Math.min(t, o),
              c = {
                buffer: new Uint8Array(a, i, s),
                addr: r.addr,
                port: r.port,
              };
            if (1 === e.type && s < o) {
              var _ = o - s;
              (r.data = new Uint8Array(a, i + s, _)), e.recv_queue.unshift(r);
            }
            return c;
          },
        },
      };
      function mt(e) {
        var t = ft.getSocket(e);
        if (!t) throw new ct.ErrnoError(8);
        return t;
      }
      function dt(e) {
        return (L[vn() >> 2] = e), e;
      }
      function ht(e) {
        return (
          (255 & e) +
          "." +
          ((e >> 8) & 255) +
          "." +
          ((e >> 16) & 255) +
          "." +
          ((e >> 24) & 255)
        );
      }
      function pt(e) {
        var t = "",
          r = 0,
          n = 0,
          o = 0,
          i = 0,
          a = 0,
          s = 0,
          c = [
            65535 & e[0],
            e[0] >> 16,
            65535 & e[1],
            e[1] >> 16,
            65535 & e[2],
            e[2] >> 16,
            65535 & e[3],
            e[3] >> 16,
          ],
          _ = !0,
          u = "";
        for (s = 0; s < 5; s++)
          if (0 !== c[s]) {
            _ = !1;
            break;
          }
        if (_) {
          if (((u = ht(c[6] | (c[7] << 16))), -1 === c[5]))
            return (t = "::ffff:"), (t += u);
          if (0 === c[5])
            return (
              (t = "::"),
              "0.0.0.0" === u && (u = ""),
              "0.0.0.1" === u && (u = "1"),
              (t += u)
            );
        }
        for (r = 0; r < 8; r++)
          0 === c[r] && (r - o > 1 && (a = 0), (o = r), a++),
            a > n && (i = r - (n = a) + 1);
        for (r = 0; r < 8; r++)
          n > 1 && 0 === c[r] && r >= i && r < i + n
            ? r === i && ((t += ":"), 0 === i && (t += ":"))
            : ((t += Number(An(65535 & c[r])).toString(16)),
              (t += r < 7 ? ":" : ""));
        return t;
      }
      function wt(e, t) {
        var r,
          n = W[e >> 1],
          o = An(z[(e + 2) >> 1]);
        switch (n) {
          case 2:
            if (16 !== t) return { errno: 28 };
            r = ht((r = L[(e + 4) >> 2]));
            break;
          case 10:
            if (28 !== t) return { errno: 28 };
            r = pt(
              (r = [
                L[(e + 8) >> 2],
                L[(e + 12) >> 2],
                L[(e + 16) >> 2],
                L[(e + 20) >> 2],
              ]),
            );
            break;
          default:
            return { errno: 5 };
        }
        return { family: n, addr: r, port: o };
      }
      function gt(e) {
        for (var t = e.split("."), r = 0; r < 4; r++) {
          var n = Number(t[r]);
          if (isNaN(n)) return null;
          t[r] = n;
        }
        return (t[0] | (t[1] << 8) | (t[2] << 16) | (t[3] << 24)) >>> 0;
      }
      function yt(e) {
        return parseInt(e);
      }
      function bt(e) {
        var t,
          r,
          n,
          o,
          i = [];
        if (
          !/^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/i.test(
            e,
          )
        )
          return null;
        if ("::" === e) return [0, 0, 0, 0, 0, 0, 0, 0];
        for (
          (e = e.startsWith("::")
            ? e.replace("::", "Z:")
            : e.replace("::", ":Z:")).indexOf(".") > 0
            ? (((t = (e = e.replace(new RegExp("[.]", "g"), ":")).split(":"))[
                t.length - 4
              ] = yt(t[t.length - 4]) + 256 * yt(t[t.length - 3])),
              (t[t.length - 3] =
                yt(t[t.length - 2]) + 256 * yt(t[t.length - 1])),
              (t = t.slice(0, t.length - 2)))
            : (t = e.split(":")),
            n = 0,
            o = 0,
            r = 0;
          r < t.length;
          r++
        )
          if ("string" == typeof t[r])
            if ("Z" === t[r]) {
              for (o = 0; o < 8 - t.length + 1; o++) i[r + o] = 0;
              n = o - 1;
            } else i[r + n] = En(parseInt(t[r], 16));
          else i[r + n] = t[r];
        return [
          (i[1] << 16) | i[0],
          (i[3] << 16) | i[2],
          (i[5] << 16) | i[4],
          (i[7] << 16) | i[6],
        ];
      }
      var vt = {
        address_map: { id: 1, addrs: {}, names: {} },
        lookup_name: function (e) {
          var t,
            r = gt(e);
          if (null !== r) return e;
          if (null !== (r = bt(e))) return e;
          if (vt.address_map.addrs[e]) t = vt.address_map.addrs[e];
          else {
            var n = vt.address_map.id++;
            P(n < 65535, "exceeded max address mappings of 65535"),
              (t = "172.29." + (255 & n) + "." + (65280 & n)),
              (vt.address_map.names[t] = e),
              (vt.address_map.addrs[e] = t);
          }
          return t;
        },
        lookup_addr: function (e) {
          return vt.address_map.names[e] ? vt.address_map.names[e] : null;
        },
      };
      function Et(e, t, r) {
        if (r && 0 === e) return null;
        var n = wt(e, t);
        if (n.errno) throw new ct.ErrnoError(n.errno);
        return (n.addr = vt.lookup_addr(n.addr) || n.addr), n;
      }
      function St(e, t, r) {
        try {
          var n = mt(e),
            o = Et(t, r);
          return n.sock_ops.connect(n, o.addr, o.port), 0;
        } catch (e) {
          if (void 0 === ct || !(e instanceof ct.ErrnoError)) throw e;
          return -e.errno;
        }
      }
      function At(e, t, r, n) {
        try {
          if (((t = _t.getStr(t)), (t = _t.calculateAt(e, t)), -8 & r))
            return -28;
          var o = ct.lookupPath(t, { follow: !0 }).node;
          if (!o) return -44;
          var i = "";
          return (
            4 & r && (i += "r"),
            2 & r && (i += "w"),
            1 & r && (i += "x"),
            i && ct.nodePermissions(o, i) ? -2 : 0
          );
        } catch (e) {
          if (void 0 === ct || !(e instanceof ct.ErrnoError)) throw e;
          return -e.errno;
        }
      }
      function kt(e, t, r, n) {
        return 0;
      }
      function Nt(e, t) {
        try {
          return ct.fchmod(e, t), 0;
        } catch (e) {
          if (void 0 === ct || !(e instanceof ct.ErrnoError)) throw e;
          return -e.errno;
        }
      }
      function Ot(e, t, r) {
        _t.varargs = r;
        try {
          var n = _t.getStreamFromFD(e);
          switch (t) {
            case 0:
              return (o = _t.get()) < 0 ? -28 : ct.createStream(n, o).fd;
            case 1:
            case 2:
            case 6:
            case 7:
              return 0;
            case 3:
              return n.flags;
            case 4:
              var o = _t.get();
              return (n.flags |= o), 0;
            case 5:
              o = _t.get();
              return (W[(o + 0) >> 1] = 2), 0;
            case 16:
            case 8:
            default:
              return -28;
            case 9:
              return dt(28), -1;
          }
        } catch (e) {
          if (void 0 === ct || !(e instanceof ct.ErrnoError)) throw e;
          return -e.errno;
        }
      }
      function xt(e, t) {
        try {
          var r = _t.getStreamFromFD(e);
          return _t.doStat(ct.stat, r.path, t);
        } catch (e) {
          if (void 0 === ct || !(e instanceof ct.ErrnoError)) throw e;
          return -e.errno;
        }
      }
      function jt(e, t, r) {
        try {
          return (
            (e = _t.getStr(e)),
            (L[(r + 4) >> 2] = 4096),
            (L[(r + 40) >> 2] = 4096),
            (L[(r + 8) >> 2] = 1e6),
            (L[(r + 12) >> 2] = 5e5),
            (L[(r + 16) >> 2] = 5e5),
            (L[(r + 20) >> 2] = ct.nextInode),
            (L[(r + 24) >> 2] = 1e6),
            (L[(r + 28) >> 2] = 42),
            (L[(r + 44) >> 2] = 2),
            (L[(r + 36) >> 2] = 255),
            0
          );
        } catch (e) {
          if (void 0 === ct || !(e instanceof ct.ErrnoError)) throw e;
          return -e.errno;
        }
      }
      function Tt(e, t, r) {
        try {
          _t.getStreamFromFD(e);
          return jt(0, 0, r);
        } catch (e) {
          if (void 0 === ct || !(e instanceof ct.ErrnoError)) throw e;
          return -e.errno;
        }
      }
      function Dt(e, t) {
        return (t + 2097152) >>> 0 < 4194305 - !!e
          ? (e >>> 0) + 4294967296 * t
          : NaN;
      }
      function Mt(e, t, r) {
        try {
          var n = Dt(t, r);
          return isNaN(n) ? -61 : (ct.ftruncate(e, n), 0);
        } catch (e) {
          if (void 0 === ct || !(e instanceof ct.ErrnoError)) throw e;
          return -e.errno;
        }
      }
      function Rt(e, t) {
        try {
          if (0 === t) return -28;
          var r = ct.cwd(),
            n = K(r) + 1;
          return t < n ? -68 : (Z(r, e, t), n);
        } catch (e) {
          if (void 0 === ct || !(e instanceof ct.ErrnoError)) throw e;
          return -e.errno;
        }
      }
      function Pt(e, t, r) {
        try {
          var n = _t.getStreamFromFD(e);
          n.getdents || (n.getdents = ct.readdir(n.path));
          for (
            var o = 280, i = 0, a = ct.llseek(n, 0, 1), s = Math.floor(a / o);
            s < n.getdents.length && i + o <= r;

          ) {
            var c,
              _,
              u = n.getdents[s];
            if ("." === u) (c = n.node.id), (_ = 4);
            else if (".." === u) {
              (c = ct.lookupPath(n.path, { parent: !0 }).node.id), (_ = 4);
            } else {
              var l = ct.lookupNode(n.node, u);
              (c = l.id),
                (_ = ct.isChrdev(l.mode)
                  ? 2
                  : ct.isDir(l.mode)
                  ? 4
                  : ct.isLink(l.mode)
                  ? 10
                  : 8);
            }
            (Ee = [
              c >>> 0,
              ((ve = c),
              +Math.abs(ve) >= 1
                ? ve > 0
                  ? (0 | Math.min(+Math.floor(ve / 4294967296), 4294967295)) >>>
                    0
                  : ~~+Math.ceil((ve - +(~~ve >>> 0)) / 4294967296) >>> 0
                : 0),
            ]),
              (L[(t + i) >> 2] = Ee[0]),
              (L[(t + i + 4) >> 2] = Ee[1]),
              (Ee = [
                ((s + 1) * o) >>> 0,
                ((ve = (s + 1) * o),
                +Math.abs(ve) >= 1
                  ? ve > 0
                    ? (0 |
                        Math.min(+Math.floor(ve / 4294967296), 4294967295)) >>>
                      0
                    : ~~+Math.ceil((ve - +(~~ve >>> 0)) / 4294967296) >>> 0
                  : 0),
              ]),
              (L[(t + i + 8) >> 2] = Ee[0]),
              (L[(t + i + 12) >> 2] = Ee[1]),
              (W[(t + i + 16) >> 1] = 280),
              (U[(t + i + 18) >> 0] = _),
              Z(u, t + i + 19, 256),
              (i += o),
              (s += 1);
          }
          return ct.llseek(n, s * o, 0), i;
        } catch (e) {
          if (void 0 === ct || !(e instanceof ct.ErrnoError)) throw e;
          return -e.errno;
        }
      }
      function Ct(e, t, r) {
        _t.varargs = r;
        try {
          var n = _t.getStreamFromFD(e);
          switch (t) {
            case 21509:
            case 21505:
            case 21510:
            case 21511:
            case 21512:
            case 21506:
            case 21507:
            case 21508:
            case 21523:
            case 21524:
              return n.tty ? 0 : -59;
            case 21519:
              if (!n.tty) return -59;
              var o = _t.get();
              return (L[o >> 2] = 0), 0;
            case 21520:
              return n.tty ? -28 : -59;
            case 21531:
              o = _t.get();
              return ct.ioctl(n, t, o);
            default:
              ye("bad ioctl syscall " + t);
          }
        } catch (e) {
          if (void 0 === ct || !(e instanceof ct.ErrnoError)) throw e;
          return -e.errno;
        }
      }
      function It(e, t) {
        try {
          return (e = _t.getStr(e)), _t.doStat(ct.lstat, e, t);
        } catch (e) {
          if (void 0 === ct || !(e instanceof ct.ErrnoError)) throw e;
          return -e.errno;
        }
      }
      function Ft(e, t, r) {
        try {
          return (
            (t = _t.getStr(t)),
            (t = _t.calculateAt(e, t)),
            "/" === (t = Ke.normalize(t))[t.length - 1] &&
              (t = t.substr(0, t.length - 1)),
            ct.mkdir(t, r, 0),
            0
          );
        } catch (e) {
          if (void 0 === ct || !(e instanceof ct.ErrnoError)) throw e;
          return -e.errno;
        }
      }
      function $t(e, t, r, n) {
        try {
          t = _t.getStr(t);
          var o = 256 & n,
            i = 4096 & n;
          return (
            (n &= -4353),
            (t = _t.calculateAt(e, t, i)),
            _t.doStat(o ? ct.lstat : ct.stat, t, r)
          );
        } catch (e) {
          if (void 0 === ct || !(e instanceof ct.ErrnoError)) throw e;
          return -e.errno;
        }
      }
      function Ut(e, t, r, n) {
        _t.varargs = n;
        try {
          (t = _t.getStr(t)), (t = _t.calculateAt(e, t));
          var o = n ? _t.get() : 0;
          return ct.open(t, r, o).fd;
        } catch (e) {
          if (void 0 === ct || !(e instanceof ct.ErrnoError)) throw e;
          return -e.errno;
        }
      }
      function Bt(e, t, r, n) {
        try {
          if (((t = _t.getStr(t)), (t = _t.calculateAt(e, t)), n <= 0))
            return -28;
          var o = ct.readlink(t),
            i = Math.min(n, K(o)),
            a = U[r + i];
          return Z(o, r, n + 1), (U[r + i] = a), i;
        } catch (e) {
          if (void 0 === ct || !(e instanceof ct.ErrnoError)) throw e;
          return -e.errno;
        }
      }
      function Wt(e, t, r, n) {
        try {
          return (
            (t = _t.getStr(t)),
            (n = _t.getStr(n)),
            (t = _t.calculateAt(e, t)),
            (n = _t.calculateAt(r, n)),
            ct.rename(t, n),
            0
          );
        } catch (e) {
          if (void 0 === ct || !(e instanceof ct.ErrnoError)) throw e;
          return -e.errno;
        }
      }
      function zt(e) {
        try {
          return (e = _t.getStr(e)), ct.rmdir(e), 0;
        } catch (e) {
          if (void 0 === ct || !(e instanceof ct.ErrnoError)) throw e;
          return -e.errno;
        }
      }
      function Lt(e, t, r, n, o, i) {
        try {
          var a = mt(e),
            s = Et(o, i, !0);
          return s
            ? a.sock_ops.sendmsg(a, U, t, r, s.addr, s.port)
            : ct.write(a.stream, U, t, r);
        } catch (e) {
          if (void 0 === ct || !(e instanceof ct.ErrnoError)) throw e;
          return -e.errno;
        }
      }
      function Ht(e, t, r) {
        try {
          return ft.createSocket(e, t, r).stream.fd;
        } catch (e) {
          if (void 0 === ct || !(e instanceof ct.ErrnoError)) throw e;
          return -e.errno;
        }
      }
      function Vt(e, t) {
        try {
          return (e = _t.getStr(e)), _t.doStat(ct.stat, e, t);
        } catch (e) {
          if (void 0 === ct || !(e instanceof ct.ErrnoError)) throw e;
          return -e.errno;
        }
      }
      function qt(e, t, r) {
        try {
          return (
            (t = _t.getStr(t)),
            (t = _t.calculateAt(e, t)),
            0 === r
              ? ct.unlink(t)
              : 512 === r
              ? ct.rmdir(t)
              : ye("Invalid flags passed to unlinkat"),
            0
          );
        } catch (e) {
          if (void 0 === ct || !(e instanceof ct.ErrnoError)) throw e;
          return -e.errno;
        }
      }
      function Gt(e, t, r, n) {
        try {
          if (((t = _t.getStr(t)), (t = _t.calculateAt(e, t, !0)), r)) {
            var o = L[r >> 2],
              i = L[(r + 4) >> 2];
            (a = 1e3 * o + i / 1e6),
              (s = 1e3 * (o = L[(r += 8) >> 2]) + (i = L[(r + 4) >> 2]) / 1e6);
          } else
            var a = Date.now(),
              s = a;
          return ct.utime(t, a, s), 0;
        } catch (e) {
          if (void 0 === ct || !(e instanceof ct.ErrnoError)) throw e;
          return -e.errno;
        }
      }
      function Jt() {
        return Date.now();
      }
      var Yt = !0;
      function Xt() {
        return Yt;
      }
      function Zt() {
        throw 1 / 0;
      }
      function Kt(e, t) {
        var r = new Date(1e3 * L[e >> 2]);
        (L[t >> 2] = r.getUTCSeconds()),
          (L[(t + 4) >> 2] = r.getUTCMinutes()),
          (L[(t + 8) >> 2] = r.getUTCHours()),
          (L[(t + 12) >> 2] = r.getUTCDate()),
          (L[(t + 16) >> 2] = r.getUTCMonth()),
          (L[(t + 20) >> 2] = r.getUTCFullYear() - 1900),
          (L[(t + 24) >> 2] = r.getUTCDay());
        var n = Date.UTC(r.getUTCFullYear(), 0, 1, 0, 0, 0, 0),
          o = ((r.getTime() - n) / 864e5) | 0;
        L[(t + 28) >> 2] = o;
      }
      function Qt(e, t) {
        var r = new Date(1e3 * L[e >> 2]);
        (L[t >> 2] = r.getSeconds()),
          (L[(t + 4) >> 2] = r.getMinutes()),
          (L[(t + 8) >> 2] = r.getHours()),
          (L[(t + 12) >> 2] = r.getDate()),
          (L[(t + 16) >> 2] = r.getMonth()),
          (L[(t + 20) >> 2] = r.getFullYear() - 1900),
          (L[(t + 24) >> 2] = r.getDay());
        var n = new Date(r.getFullYear(), 0, 1),
          o = ((r.getTime() - n.getTime()) / 864e5) | 0;
        (L[(t + 28) >> 2] = o),
          (L[(t + 36) >> 2] = -60 * r.getTimezoneOffset());
        var i = new Date(r.getFullYear(), 6, 1).getTimezoneOffset(),
          a = n.getTimezoneOffset(),
          s = 0 | (i != a && r.getTimezoneOffset() == Math.min(a, i));
        L[(t + 32) >> 2] = s;
      }
      function er(e) {
        var t = new Date(
            L[(e + 20) >> 2] + 1900,
            L[(e + 16) >> 2],
            L[(e + 12) >> 2],
            L[(e + 8) >> 2],
            L[(e + 4) >> 2],
            L[e >> 2],
            0,
          ),
          r = L[(e + 32) >> 2],
          n = t.getTimezoneOffset(),
          o = new Date(t.getFullYear(), 0, 1),
          i = new Date(t.getFullYear(), 6, 1).getTimezoneOffset(),
          a = o.getTimezoneOffset(),
          s = Math.min(a, i);
        if (r < 0) L[(e + 32) >> 2] = Number(i != a && s == n);
        else if (r > 0 != (s == n)) {
          var c = Math.max(a, i),
            _ = r > 0 ? s : c;
          t.setTime(t.getTime() + 6e4 * (_ - n));
        }
        L[(e + 24) >> 2] = t.getDay();
        var u = ((t.getTime() - o.getTime()) / 864e5) | 0;
        return (
          (L[(e + 28) >> 2] = u),
          (L[e >> 2] = t.getSeconds()),
          (L[(e + 4) >> 2] = t.getMinutes()),
          (L[(e + 8) >> 2] = t.getHours()),
          (L[(e + 12) >> 2] = t.getDate()),
          (L[(e + 16) >> 2] = t.getMonth()),
          (t.getTime() / 1e3) | 0
        );
      }
      function tr(e, t, r, n, o, i) {
        try {
          var a = ct.getStream(n);
          if (!a) return -8;
          var s = ct.mmap(a, e, o, t, r),
            c = s.ptr;
          return (L[i >> 2] = s.allocated), c;
        } catch (e) {
          if (void 0 === ct || !(e instanceof ct.ErrnoError)) throw e;
          return -e.errno;
        }
      }
      function rr(e, t, r, n, o, i) {
        try {
          var a = ct.getStream(o);
          a && (2 & r && _t.doMsync(e, a, t, n, i), ct.munmap(a));
        } catch (e) {
          if (void 0 === ct || !(e instanceof ct.ErrnoError)) throw e;
          return -e.errno;
        }
      }
      function nr(e, t, r) {
        var n = new Date().getFullYear(),
          o = new Date(n, 0, 1),
          i = new Date(n, 6, 1),
          a = o.getTimezoneOffset(),
          s = i.getTimezoneOffset(),
          c = Math.max(a, s);
        function _(e) {
          var t = e.toTimeString().match(/\(([A-Za-z ]+)\)$/);
          return t ? t[1] : "GMT";
        }
        (L[e >> 2] = 60 * c), (L[t >> 2] = Number(a != s));
        var u = _(o),
          l = _(i),
          f = Q(u),
          m = Q(l);
        s < a
          ? ((H[r >> 2] = f), (H[(r + 4) >> 2] = m))
          : ((H[r >> 2] = m), (H[(r + 4) >> 2] = f));
      }
      function or(e, t, r) {
        or.called || ((or.called = !0), nr(e, t, r));
      }
      function ir() {
        ye("");
      }
      var ar = {
        batchedQuotaMax: 65536,
        getBatchedRandomValues: function (e, t) {
          const r =
              "undefined" != typeof SharedArrayBuffer &&
              o.HEAPU8.buffer instanceof SharedArrayBuffer,
            n = r ? new ArrayBuffer(t) : o.HEAPU8.buffer,
            i = r ? 0 : e;
          for (let e = 0; e < t; e += this.batchedQuotaMax) {
            const r = new Uint8Array(
              n,
              i + e,
              Math.min(t - e, this.batchedQuotaMax),
            );
            crypto.getRandomValues(r);
          }
          if (r) {
            new Uint8Array(o.HEAPU8.buffer, e, t).set(new Uint8Array(n));
          }
        },
      };
      function sr(e, t) {
        return "object" == typeof crypto &&
          "function" == typeof crypto.getRandomValues
          ? (ar.getBatchedRandomValues(e, t), 0)
          : -1;
      }
      var cr,
        _r = [];
      function ur(e, t) {
        var r;
        for (_r.length = 0, t >>= 2; (r = B[e++]); )
          (t += (105 != r) & t), _r.push(105 == r ? L[t] : q[t++ >> 1]), ++t;
        return _r;
      }
      function lr(e, t, r) {
        var n = ur(t, r);
        return je[e].apply(null, n);
      }
      function fr() {
        return 2147483648;
      }
      function mr() {
        return b ? 1 : 1e3;
      }
      function dr(e, t, r) {
        B.copyWithin(e, t, t + r);
      }
      function hr(e) {
        try {
          return D.grow((e - $.byteLength + 65535) >>> 16), re(D.buffer), 1;
        } catch (e) {}
      }
      function pr(e) {
        var t = B.length,
          r = 2147483648;
        if ((e >>>= 0) > r) return !1;
        for (var n = 1; n <= 4; n *= 2) {
          var o = t * (1 + 0.2 / n);
          if (
            ((o = Math.min(o, e + 100663296)),
            hr(
              Math.min(r, (i = Math.max(e, o)) + (((a = 65536) - (i % a)) % a)),
            ))
          )
            return !0;
        }
        var i, a;
        return !1;
      }
      cr = b
        ? () => {
            var e = process.hrtime();
            return 1e3 * e[0] + e[1] / 1e6;
          }
        : "undefined" != typeof dateNow
        ? dateNow
        : () => performance.now();
      var wr = {};
      function gr() {
        return p || "./this.program";
      }
      function yr() {
        if (!yr.strings) {
          var e = {
            USER: "web_user",
            LOGNAME: "web_user",
            PATH: "/",
            PWD: "/",
            HOME: "/home/web_user",
            LANG:
              (
                ("object" == typeof navigator &&
                  navigator.languages &&
                  navigator.languages[0]) ||
                "C"
              ).replace("-", "_") + ".UTF-8",
            _: gr(),
          };
          for (var t in wr) void 0 === wr[t] ? delete e[t] : (e[t] = wr[t]);
          var r = [];
          for (var t in e) r.push(t + "=" + e[t]);
          yr.strings = r;
        }
        return yr.strings;
      }
      function br(e, t) {
        var r = 0;
        return (
          yr().forEach(function (n, o) {
            var i = t + r;
            (H[(e + 4 * o) >> 2] = i), te(n, i), (r += n.length + 1);
          }),
          0
        );
      }
      function vr(e, t) {
        var r = yr();
        H[e >> 2] = r.length;
        var n = 0;
        return (
          r.forEach(function (e) {
            n += e.length + 1;
          }),
          (H[t >> 2] = n),
          0
        );
      }
      function Er(e) {
        bs(e);
      }
      function Sr(e) {
        try {
          var t = _t.getStreamFromFD(e);
          return ct.close(t), 0;
        } catch (e) {
          if (void 0 === ct || !(e instanceof ct.ErrnoError)) throw e;
          return e.errno;
        }
      }
      function Ar(e, t) {
        try {
          var r = _t.getStreamFromFD(e),
            n = r.tty ? 2 : ct.isDir(r.mode) ? 3 : ct.isLink(r.mode) ? 7 : 4;
          return (U[t >> 0] = n), 0;
        } catch (e) {
          if (void 0 === ct || !(e instanceof ct.ErrnoError)) throw e;
          return e.errno;
        }
      }
      function kr(e, t, r, n) {
        for (var o = 0, i = 0; i < r; i++) {
          var a = H[t >> 2],
            s = H[(t + 4) >> 2];
          t += 8;
          var c = ct.read(e, U, a, s, n);
          if (c < 0) return -1;
          if (((o += c), c < s)) break;
        }
        return o;
      }
      function Nr(e, t, r, n, o, i) {
        try {
          var a = Dt(n, o);
          if (isNaN(a)) return 61;
          var s = kr(_t.getStreamFromFD(e), t, r, a);
          return (L[i >> 2] = s), 0;
        } catch (e) {
          if (void 0 === ct || !(e instanceof ct.ErrnoError)) throw e;
          return e.errno;
        }
      }
      function Or(e, t, r, n) {
        for (var o = 0, i = 0; i < r; i++) {
          var a = H[t >> 2],
            s = H[(t + 4) >> 2];
          t += 8;
          var c = ct.write(e, U, a, s, n);
          if (c < 0) return -1;
          o += c;
        }
        return o;
      }
      function xr(e, t, r, n, o, i) {
        try {
          var a = Dt(n, o);
          if (isNaN(a)) return 61;
          var s = Or(_t.getStreamFromFD(e), t, r, a);
          return (L[i >> 2] = s), 0;
        } catch (e) {
          if (void 0 === ct || !(e instanceof ct.ErrnoError)) throw e;
          return e.errno;
        }
      }
      function jr(e, t, r, n) {
        try {
          var o = kr(_t.getStreamFromFD(e), t, r);
          return (L[n >> 2] = o), 0;
        } catch (e) {
          if (void 0 === ct || !(e instanceof ct.ErrnoError)) throw e;
          return e.errno;
        }
      }
      function Tr(e, t, r, n, o) {
        try {
          var i = Dt(t, r);
          if (isNaN(i)) return 61;
          var a = _t.getStreamFromFD(e);
          return (
            ct.llseek(a, i, n),
            (Ee = [
              a.position >>> 0,
              ((ve = a.position),
              +Math.abs(ve) >= 1
                ? ve > 0
                  ? (0 | Math.min(+Math.floor(ve / 4294967296), 4294967295)) >>>
                    0
                  : ~~+Math.ceil((ve - +(~~ve >>> 0)) / 4294967296) >>> 0
                : 0),
            ]),
            (L[o >> 2] = Ee[0]),
            (L[(o + 4) >> 2] = Ee[1]),
            a.getdents && 0 === i && 0 === n && (a.getdents = null),
            0
          );
        } catch (e) {
          if (void 0 === ct || !(e instanceof ct.ErrnoError)) throw e;
          return e.errno;
        }
      }
      function Dr(e) {
        try {
          var t = _t.getStreamFromFD(e);
          return t.stream_ops && t.stream_ops.fsync
            ? -t.stream_ops.fsync(t)
            : 0;
        } catch (e) {
          if (void 0 === ct || !(e instanceof ct.ErrnoError)) throw e;
          return e.errno;
        }
      }
      function Mr(e, t, r, n) {
        try {
          var o = Or(_t.getStreamFromFD(e), t, r);
          return (H[n >> 2] = o), 0;
        } catch (e) {
          if (void 0 === ct || !(e instanceof ct.ErrnoError)) throw e;
          return e.errno;
        }
      }
      function Rr() {
        return T();
      }
      function Pr(e) {
        return e;
      }
      function Cr() {
        return __dotnet_runtime.__linker_exports.mono_set_timeout.apply(
          __dotnet_runtime,
          arguments,
        );
      }
      function Ir() {
        return __dotnet_runtime.__linker_exports.mono_wasm_bind_cs_function.apply(
          __dotnet_runtime,
          arguments,
        );
      }
      function Fr() {
        return __dotnet_runtime.__linker_exports.mono_wasm_bind_js_function.apply(
          __dotnet_runtime,
          arguments,
        );
      }
      function $r() {
        return __dotnet_runtime.__linker_exports.mono_wasm_create_cs_owned_object_ref.apply(
          __dotnet_runtime,
          arguments,
        );
      }
      function Ur() {
        return __dotnet_runtime.__linker_exports.mono_wasm_get_by_index_ref.apply(
          __dotnet_runtime,
          arguments,
        );
      }
      function Br() {
        return __dotnet_runtime.__linker_exports.mono_wasm_get_global_object_ref.apply(
          __dotnet_runtime,
          arguments,
        );
      }
      function Wr() {
        return __dotnet_runtime.__linker_exports.mono_wasm_get_object_property_ref.apply(
          __dotnet_runtime,
          arguments,
        );
      }
      function zr() {
        return __dotnet_runtime.__linker_exports.mono_wasm_invoke_bound_function.apply(
          __dotnet_runtime,
          arguments,
        );
      }
      function Lr() {
        return __dotnet_runtime.__linker_exports.mono_wasm_invoke_js_blazor.apply(
          __dotnet_runtime,
          arguments,
        );
      }
      function Hr() {
        return __dotnet_runtime.__linker_exports.mono_wasm_invoke_js_with_args_ref.apply(
          __dotnet_runtime,
          arguments,
        );
      }
      function Vr() {
        return __dotnet_runtime.__linker_exports.mono_wasm_marshal_promise.apply(
          __dotnet_runtime,
          arguments,
        );
      }
      function qr() {
        return __dotnet_runtime.__linker_exports.mono_wasm_release_cs_owned_object.apply(
          __dotnet_runtime,
          arguments,
        );
      }
      function Gr() {
        return __dotnet_runtime.__linker_exports.mono_wasm_set_by_index_ref.apply(
          __dotnet_runtime,
          arguments,
        );
      }
      function Jr() {
        return __dotnet_runtime.__linker_exports.mono_wasm_set_entrypoint_breakpoint.apply(
          __dotnet_runtime,
          arguments,
        );
      }
      function Yr() {
        return __dotnet_runtime.__linker_exports.mono_wasm_set_object_property_ref.apply(
          __dotnet_runtime,
          arguments,
        );
      }
      function Xr() {
        return __dotnet_runtime.__linker_exports.mono_wasm_trace_logger.apply(
          __dotnet_runtime,
          arguments,
        );
      }
      function Zr() {
        return __dotnet_runtime.__linker_exports.mono_wasm_typed_array_from_ref.apply(
          __dotnet_runtime,
          arguments,
        );
      }
      function Kr() {
        return __dotnet_runtime.__linker_exports.mono_wasm_typed_array_to_array_ref.apply(
          __dotnet_runtime,
          arguments,
        );
      }
      function Qr() {
        return __dotnet_runtime.__linker_exports.schedule_background_exec.apply(
          __dotnet_runtime,
          arguments,
        );
      }
      function en(e) {
        j(e);
      }
      function tn(e) {
        return e % 4 == 0 && (e % 100 != 0 || e % 400 == 0);
      }
      function rn(e, t) {
        for (var r = 0, n = 0; n <= t; r += e[n++]);
        return r;
      }
      var nn = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
        on = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      function an(e, t) {
        for (var r = new Date(e.getTime()); t > 0; ) {
          var n = tn(r.getFullYear()),
            o = r.getMonth(),
            i = (n ? nn : on)[o];
          if (!(t > i - r.getDate())) return r.setDate(r.getDate() + t), r;
          (t -= i - r.getDate() + 1),
            r.setDate(1),
            o < 11
              ? r.setMonth(o + 1)
              : (r.setMonth(0), r.setFullYear(r.getFullYear() + 1));
        }
        return r;
      }
      function sn(e, t, r, n) {
        var o = L[(n + 40) >> 2],
          i = {
            tm_sec: L[n >> 2],
            tm_min: L[(n + 4) >> 2],
            tm_hour: L[(n + 8) >> 2],
            tm_mday: L[(n + 12) >> 2],
            tm_mon: L[(n + 16) >> 2],
            tm_year: L[(n + 20) >> 2],
            tm_wday: L[(n + 24) >> 2],
            tm_yday: L[(n + 28) >> 2],
            tm_isdst: L[(n + 32) >> 2],
            tm_gmtoff: L[(n + 36) >> 2],
            tm_zone: o ? Y(o) : "",
          },
          a = Y(r),
          s = {
            "%c": "%a %b %d %H:%M:%S %Y",
            "%D": "%m/%d/%y",
            "%F": "%Y-%m-%d",
            "%h": "%b",
            "%r": "%I:%M:%S %p",
            "%R": "%H:%M",
            "%T": "%H:%M:%S",
            "%x": "%m/%d/%y",
            "%X": "%H:%M:%S",
            "%Ec": "%c",
            "%EC": "%C",
            "%Ex": "%m/%d/%y",
            "%EX": "%H:%M:%S",
            "%Ey": "%y",
            "%EY": "%Y",
            "%Od": "%d",
            "%Oe": "%e",
            "%OH": "%H",
            "%OI": "%I",
            "%Om": "%m",
            "%OM": "%M",
            "%OS": "%S",
            "%Ou": "%u",
            "%OU": "%U",
            "%OV": "%V",
            "%Ow": "%w",
            "%OW": "%W",
            "%Oy": "%y",
          };
        for (var c in s) a = a.replace(new RegExp(c, "g"), s[c]);
        var _ = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ],
          u = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ];
        function l(e, t, r) {
          for (
            var n = "number" == typeof e ? e.toString() : e || "";
            n.length < t;

          )
            n = r[0] + n;
          return n;
        }
        function f(e, t) {
          return l(e, t, "0");
        }
        function m(e, t) {
          function r(e) {
            return e < 0 ? -1 : e > 0 ? 1 : 0;
          }
          var n;
          return (
            0 === (n = r(e.getFullYear() - t.getFullYear())) &&
              0 === (n = r(e.getMonth() - t.getMonth())) &&
              (n = r(e.getDate() - t.getDate())),
            n
          );
        }
        function d(e) {
          switch (e.getDay()) {
            case 0:
              return new Date(e.getFullYear() - 1, 11, 29);
            case 1:
              return e;
            case 2:
              return new Date(e.getFullYear(), 0, 3);
            case 3:
              return new Date(e.getFullYear(), 0, 2);
            case 4:
              return new Date(e.getFullYear(), 0, 1);
            case 5:
              return new Date(e.getFullYear() - 1, 11, 31);
            case 6:
              return new Date(e.getFullYear() - 1, 11, 30);
          }
        }
        function h(e) {
          var t = an(new Date(e.tm_year + 1900, 0, 1), e.tm_yday),
            r = new Date(t.getFullYear(), 0, 4),
            n = new Date(t.getFullYear() + 1, 0, 4),
            o = d(r),
            i = d(n);
          return m(o, t) <= 0
            ? m(i, t) <= 0
              ? t.getFullYear() + 1
              : t.getFullYear()
            : t.getFullYear() - 1;
        }
        var p = {
          "%a": function (e) {
            return _[e.tm_wday].substring(0, 3);
          },
          "%A": function (e) {
            return _[e.tm_wday];
          },
          "%b": function (e) {
            return u[e.tm_mon].substring(0, 3);
          },
          "%B": function (e) {
            return u[e.tm_mon];
          },
          "%C": function (e) {
            return f(((e.tm_year + 1900) / 100) | 0, 2);
          },
          "%d": function (e) {
            return f(e.tm_mday, 2);
          },
          "%e": function (e) {
            return l(e.tm_mday, 2, " ");
          },
          "%g": function (e) {
            return h(e).toString().substring(2);
          },
          "%G": function (e) {
            return h(e);
          },
          "%H": function (e) {
            return f(e.tm_hour, 2);
          },
          "%I": function (e) {
            var t = e.tm_hour;
            return 0 == t ? (t = 12) : t > 12 && (t -= 12), f(t, 2);
          },
          "%j": function (e) {
            return f(
              e.tm_mday + rn(tn(e.tm_year + 1900) ? nn : on, e.tm_mon - 1),
              3,
            );
          },
          "%m": function (e) {
            return f(e.tm_mon + 1, 2);
          },
          "%M": function (e) {
            return f(e.tm_min, 2);
          },
          "%n": function () {
            return "\n";
          },
          "%p": function (e) {
            return e.tm_hour >= 0 && e.tm_hour < 12 ? "AM" : "PM";
          },
          "%S": function (e) {
            return f(e.tm_sec, 2);
          },
          "%t": function () {
            return "\t";
          },
          "%u": function (e) {
            return e.tm_wday || 7;
          },
          "%U": function (e) {
            var t = e.tm_yday + 7 - e.tm_wday;
            return f(Math.floor(t / 7), 2);
          },
          "%V": function (e) {
            var t = Math.floor((e.tm_yday + 7 - ((e.tm_wday + 6) % 7)) / 7);
            if (((e.tm_wday + 371 - e.tm_yday - 2) % 7 <= 2 && t++, t)) {
              if (53 == t) {
                var r = (e.tm_wday + 371 - e.tm_yday) % 7;
                4 == r || (3 == r && tn(e.tm_year)) || (t = 1);
              }
            } else {
              t = 52;
              var n = (e.tm_wday + 7 - e.tm_yday - 1) % 7;
              (4 == n || (5 == n && tn((e.tm_year % 400) - 1))) && t++;
            }
            return f(t, 2);
          },
          "%w": function (e) {
            return e.tm_wday;
          },
          "%W": function (e) {
            var t = e.tm_yday + 7 - ((e.tm_wday + 6) % 7);
            return f(Math.floor(t / 7), 2);
          },
          "%y": function (e) {
            return (e.tm_year + 1900).toString().substring(2);
          },
          "%Y": function (e) {
            return e.tm_year + 1900;
          },
          "%z": function (e) {
            var t = e.tm_gmtoff,
              r = t >= 0;
            return (
              (t = ((t = Math.abs(t) / 60) / 60) * 100 + (t % 60)),
              (r ? "+" : "-") + String("0000" + t).slice(-4)
            );
          },
          "%Z": function (e) {
            return e.tm_zone;
          },
          "%%": function () {
            return "%";
          },
        };
        for (var c in ((a = a.replace(/%%/g, "\0\0")), p))
          a.includes(c) && (a = a.replace(new RegExp(c, "g"), p[c](i)));
        var w = pn((a = a.replace(/\0\0/g, "%")), !1);
        return w.length > t ? 0 : (ee(w, e), w.length - 1);
      }
      function cn(e, t, r, n) {
        return sn(e, t, r, n);
      }
      var _n = function (e, t, r, n) {
          e || (e = this),
            (this.parent = e),
            (this.mount = e.mount),
            (this.mounted = null),
            (this.id = ct.nextInode++),
            (this.name = t),
            (this.mode = r),
            (this.node_ops = {}),
            (this.stream_ops = {}),
            (this.rdev = n);
        },
        un = 365,
        ln = 146;
      let fn;
      Object.defineProperties(_n.prototype, {
        read: {
          get: function () {
            return (this.mode & un) === un;
          },
          set: function (e) {
            e ? (this.mode |= un) : (this.mode &= ~un);
          },
        },
        write: {
          get: function () {
            return (this.mode & ln) === ln;
          },
          set: function (e) {
            e ? (this.mode |= ln) : (this.mode &= ~ln);
          },
        },
        isFolder: {
          get: function () {
            return ct.isDir(this.mode);
          },
        },
        isDevice: {
          get: function () {
            return ct.isChrdev(this.mode);
          },
        },
      }),
        (ct.FSNode = _n),
        ct.staticInit(),
        (o.FS_createPath = ct.createPath),
        (o.FS_createDataFile = ct.createDataFile),
        (o.FS_readFile = ct.readFile),
        (o.FS_createPath = ct.createPath),
        (o.FS_createDataFile = ct.createDataFile),
        (o.FS_createPreloadedFile = ct.createPreloadedFile),
        (o.FS_unlink = ct.unlink),
        (o.FS_createLazyFile = ct.createLazyFile),
        (o.FS_createDevice = ct.createDevice);
      let mn = {
        scriptUrl: import.meta.url,
        fetch: globalThis.fetch,
        require: i,
        updateGlobalBufferAndViews: re,
        pthreadReplacements: fn,
      };
      b &&
        (mn.requirePromise = import("module").then((e) =>
          e.createRequire(import.meta.url),
        ));
      let dn = __dotnet_runtime.__initializeImportsAndExports(
        {
          isGlobal: !1,
          isNode: b,
          isWorker: y,
          isShell: v,
          isWeb: g,
          isPThread: !1,
          quit_: w,
          ExitStatus: gs,
          requirePromise: mn.requirePromise,
        },
        {
          mono: MONO,
          binding: BINDING,
          internal: INTERNAL,
          module: o,
          marshaled_imports: IMPORTS,
        },
        mn,
        s,
      );
      re = mn.updateGlobalBufferAndViews;
      var hn = mn.fetch;
      (e = a = E = mn.scriptDirectory),
        b &&
          mn.requirePromise.then((e) => {
            i = e;
          });
      M = mn.noExitRuntime;
      function pn(e, t, r) {
        var n = r > 0 ? r : K(e) + 1,
          o = new Array(n),
          i = X(e, o, 0, o.length);
        return t && (o.length = i), o;
      }
      var wn,
        gn = {
          T: Ce,
          n: Ie,
          D: Be,
          H: Ve,
          h: Ge,
          d: Je,
          s: Le,
          gb: Ye,
          u: Xe,
          Qd: Ze,
          m: qe,
          Pd: ut,
          fb: lt,
          Od: St,
          Nd: At,
          ic: kt,
          Md: Nt,
          ba: Ot,
          Ld: xt,
          Kd: Tt,
          hc: Mt,
          Jd: Rt,
          Id: Pt,
          Hd: Ct,
          Gd: It,
          Fd: Ft,
          Ed: $t,
          eb: Ut,
          Dd: Bt,
          Cd: Wt,
          db: zt,
          Bd: Lt,
          cb: Ht,
          Ad: Vt,
          bb: qt,
          zd: Gt,
          pa: Jt,
          $a: Xt,
          ud: Zt,
          td: Kt,
          sd: Qt,
          rd: er,
          qd: tr,
          pd: rr,
          od: or,
          v: ir,
          _a: sr,
          Za: lr,
          nd: fr,
          Ba: cr,
          md: mr,
          ld: dr,
          kd: pr,
          yd: br,
          xd: vr,
          P: Er,
          qa: Sr,
          wd: Ar,
          gc: Nr,
          fc: xr,
          ab: jr,
          ec: Tr,
          vd: Dr,
          Ca: Mr,
          b: Rr,
          ia: Vo,
          Ya: di,
          M: Qo,
          W: Ro,
          I: Mo,
          Q: So,
          dc: as,
          ga: Ii,
          G: Go,
          Xa: Uo,
          Wa: Si,
          t: To,
          Aa: gi,
          jd: Ui,
          N: Ao,
          ua: Ni,
          za: Qi,
          z: oa,
          x: si,
          Va: Ei,
          id: oi,
          ya: zo,
          hd: Gi,
          ca: Fo,
          k: bo,
          gd: Yo,
          fd: aa,
          xa: Vi,
          Ua: Fi,
          ta: ni,
          _: Co,
          Ta: Xo,
          Sa: Jo,
          Ra: Wo,
          ed: ra,
          dd: na,
          a: co,
          cd: fi,
          oa: Do,
          bd: li,
          ad: Ki,
          Qa: Io,
          $c: Lo,
          _c: Xi,
          c: _o,
          Pa: ui,
          Oa: Ji,
          Na: Bo,
          l: yo,
          Ma: Ua,
          p: go,
          Zc: $a,
          Yc: xi,
          Xc: Ti,
          w: po,
          Wc: Fa,
          E: No,
          O: ri,
          Vc: Ai,
          aa: Ri,
          ea: yi,
          V: Zi,
          Uc: mi,
          Tc: ti,
          cc: _s,
          bc: us,
          ac: ws,
          $b: ls,
          _b: Qa,
          Zb: Ya,
          Yb: ds,
          Xb: ns,
          Wb: Ka,
          Vb: Za,
          Ub: is,
          Tb: Ga,
          Sb: Ja,
          Rb: ps,
          Qb: ts,
          Pb: ms,
          Ob: za,
          Nb: Ha,
          Mb: cs,
          Lb: os,
          Kb: Wa,
          Jb: Xa,
          f: lo,
          j: uo,
          Sc: Ia,
          La: Mi,
          Ka: ta,
          na: Ko,
          y: ai,
          S: hi,
          Ja: Bi,
          J: ei,
          Ia: Pi,
          Z: ko,
          wa: zi,
          sa: Di,
          ma: Hi,
          ha: Oo,
          A: xo,
          fa: Li,
          $: $o,
          C: qo,
          Rc: $i,
          i: fo,
          U: ii,
          Qc: Ba,
          Pc: vi,
          Oc: ea,
          Nc: Yi,
          Mc: Wi,
          L: Zo,
          Lc: Oi,
          F: ci,
          Y: qi,
          e: mo,
          Kc: Po,
          Jc: ji,
          da: Ci,
          g: wo,
          Ha: bi,
          Ga: jo,
          o: ho,
          r: vo,
          B: Eo,
          K: Ho,
          X: ia,
          R: _i,
          va: sa,
          ra: ca,
          Ic: _a,
          Fa: pi,
          la: ua,
          Ea: wi,
          Da: ki,
          Hc: la,
          Gc: fa,
          Fc: ma,
          Ec: da,
          Dc: ha,
          Cc: pa,
          Bc: wa,
          Ac: ga,
          zc: ya,
          yc: ba,
          xc: va,
          wc: Ea,
          vc: Sa,
          uc: Aa,
          tc: ka,
          sc: Na,
          rc: Oa,
          qc: xa,
          pc: ja,
          oc: Ta,
          nc: Da,
          mc: Ma,
          lc: Ra,
          kc: Pa,
          jc: Ca,
          Ib: es,
          Hb: Va,
          Gb: hs,
          Fb: fs,
          Eb: La,
          Db: qa,
          Cb: rs,
          Bb: ss,
          ka: Pr,
          Ab: Cr,
          zb: Ir,
          yb: Fr,
          xb: $r,
          wb: Ur,
          vb: Br,
          ub: Wr,
          tb: zr,
          sb: Lr,
          rb: Hr,
          qb: Vr,
          pb: qr,
          ob: Gr,
          nb: Jr,
          mb: Yr,
          lb: Xr,
          kb: Zr,
          jb: Kr,
          ib: Qr,
          q: en,
          ja: sn,
          hb: cn,
        },
        yn =
          (xe(),
          (o.___wasm_call_ctors = function () {
            return (o.___wasm_call_ctors = o.asm.Sd).apply(null, arguments);
          }),
          (o._memset = function () {
            return (o._memset = o.asm.Td).apply(null, arguments);
          }),
          (o._mono_aot_BouncyCastle_Cryptography_get_method = function () {
            return (o._mono_aot_BouncyCastle_Cryptography_get_method =
              o.asm.Ud).apply(null, arguments);
          }),
          (o._mono_aot_ChromeHtmlToPdfLib_get_method = function () {
            return (o._mono_aot_ChromeHtmlToPdfLib_get_method = o.asm.Wd).apply(
              null,
              arguments,
            );
          }),
          (o._mono_aot_DocumentFormat_OpenXml_get_method = function () {
            return (o._mono_aot_DocumentFormat_OpenXml_get_method =
              o.asm.Xd).apply(null, arguments);
          }),
          (o._mono_aot_GdPicture_NET_14_API_get_method = function () {
            return (o._mono_aot_GdPicture_NET_14_API_get_method =
              o.asm.Yd).apply(null, arguments);
          }),
          (o._mono_aot_GdPicture_NET_14_barcode_1d_writer_get_method =
            function () {
              return (o._mono_aot_GdPicture_NET_14_barcode_1d_writer_get_method =
                o.asm.Zd).apply(null, arguments);
            }),
          (o._mono_aot_GdPicture_NET_14_barcode_2d_writer_get_method =
            function () {
              return (o._mono_aot_GdPicture_NET_14_barcode_2d_writer_get_method =
                o.asm._d).apply(null, arguments);
            }),
          (o._mono_aot_GdPicture_NET_14_CAD_get_method = function () {
            return (o._mono_aot_GdPicture_NET_14_CAD_get_method =
              o.asm.$d).apply(null, arguments);
          }),
          (o._mono_aot_GdPicture_NET_14_Common_get_method = function () {
            return (o._mono_aot_GdPicture_NET_14_Common_get_method =
              o.asm.ae).apply(null, arguments);
          }),
          (o._mono_aot_GdPicture_NET_14_Document_get_method = function () {
            return (o._mono_aot_GdPicture_NET_14_Document_get_method =
              o.asm.be).apply(null, arguments);
          }),
          (o._mono_aot_GdPicture_NET_14_Imaging_get_method = function () {
            return (o._mono_aot_GdPicture_NET_14_Imaging_get_method =
              o.asm.ce).apply(null, arguments);
          }),
          (o._mono_aot_GdPicture_NET_14_Imaging_Formats_Conversion_get_method =
            function () {
              return (o._mono_aot_GdPicture_NET_14_Imaging_Formats_Conversion_get_method =
                o.asm.de).apply(null, arguments);
            }),
          (o._mono_aot_GdPicture_NET_14_Imaging_Formats_get_method =
            function () {
              return (o._mono_aot_GdPicture_NET_14_Imaging_Formats_get_method =
                o.asm.ee).apply(null, arguments);
            }),
          (o._mono_aot_GdPicture_NET_14_Imaging_Rendering_get_method =
            function () {
              return (o._mono_aot_GdPicture_NET_14_Imaging_Rendering_get_method =
                o.asm.fe).apply(null, arguments);
            }),
          (o._mono_aot_GdPicture_NET_14_MSOfficeBinary_get_method =
            function () {
              return (o._mono_aot_GdPicture_NET_14_MSOfficeBinary_get_method =
                o.asm.ge).apply(null, arguments);
            }),
          (o._mono_aot_GdPicture_NET_14_OpenDocument_get_method = function () {
            return (o._mono_aot_GdPicture_NET_14_OpenDocument_get_method =
              o.asm.he).apply(null, arguments);
          }),
          (o._mono_aot_GdPicture_NET_14_OpenXML_get_method = function () {
            return (o._mono_aot_GdPicture_NET_14_OpenXML_get_method =
              o.asm.ie).apply(null, arguments);
          }),
          (o._mono_aot_GdPicture_NET_14_PDF_get_method = function () {
            return (o._mono_aot_GdPicture_NET_14_PDF_get_method =
              o.asm.je).apply(null, arguments);
          }),
          (o._mono_aot_GdPicture_NET_14_RTF_get_method = function () {
            return (o._mono_aot_GdPicture_NET_14_RTF_get_method =
              o.asm.ke).apply(null, arguments);
          }),
          (o._mono_aot_GdPicture_NET_14_SVG_get_method = function () {
            return (o._mono_aot_GdPicture_NET_14_SVG_get_method =
              o.asm.le).apply(null, arguments);
          }),
          (o._mono_aot_GdPicture_NET_OpenXML_Templating_Wasm_NET7_get_method =
            function () {
              return (o._mono_aot_GdPicture_NET_OpenXML_Templating_Wasm_NET7_get_method =
                o.asm.me).apply(null, arguments);
            }),
          (o._mono_aot_GdPicture_NET_PSPDFKit_Wasm_NET7_get_method =
            function () {
              return (o._mono_aot_GdPicture_NET_PSPDFKit_Wasm_NET7_get_method =
                o.asm.ne).apply(null, arguments);
            }),
          (o._mono_aot_GdPicture_NET_Wasm_NET7_get_method = function () {
            return (o._mono_aot_GdPicture_NET_Wasm_NET7_get_method =
              o.asm.oe).apply(null, arguments);
          }),
          (o._mono_aot_Microsoft_CSharp_get_method = function () {
            return (o._mono_aot_Microsoft_CSharp_get_method = o.asm.pe).apply(
              null,
              arguments,
            );
          }),
          (o._mono_aot_Microsoft_Win32_Registry_get_method = function () {
            return (o._mono_aot_Microsoft_Win32_Registry_get_method =
              o.asm.qe).apply(null, arguments);
          }),
          (o._mono_aot_MsgReader_get_method = function () {
            return (o._mono_aot_MsgReader_get_method = o.asm.re).apply(
              null,
              arguments,
            );
          }),
          (o._mono_aot_Newtonsoft_Json_get_method = function () {
            return (o._mono_aot_Newtonsoft_Json_get_method = o.asm.se).apply(
              null,
              arguments,
            );
          }),
          (o._mono_aot_OpenMcdf_get_method = function () {
            return (o._mono_aot_OpenMcdf_get_method = o.asm.te).apply(
              null,
              arguments,
            );
          }),
          (o._mono_aot_protobuf_net_Core_get_method = function () {
            return (o._mono_aot_protobuf_net_Core_get_method = o.asm.ue).apply(
              null,
              arguments,
            );
          }),
          (o._mono_aot_protobuf_net_get_method = function () {
            return (o._mono_aot_protobuf_net_get_method = o.asm.ve).apply(
              null,
              arguments,
            );
          }),
          (o._mono_aot_RtfPipe_get_method = function () {
            return (o._mono_aot_RtfPipe_get_method = o.asm.we).apply(
              null,
              arguments,
            );
          }),
          (o._mono_aot_System_Collections_Concurrent_get_method = function () {
            return (o._mono_aot_System_Collections_Concurrent_get_method =
              o.asm.xe).apply(null, arguments);
          }),
          (o._mono_aot_System_Collections_get_method = function () {
            return (o._mono_aot_System_Collections_get_method = o.asm.ye).apply(
              null,
              arguments,
            );
          }),
          (o._mono_aot_System_Collections_Immutable_get_method = function () {
            return (o._mono_aot_System_Collections_Immutable_get_method =
              o.asm.ze).apply(null, arguments);
          }),
          (o._mono_aot_System_Collections_NonGeneric_get_method = function () {
            return (o._mono_aot_System_Collections_NonGeneric_get_method =
              o.asm.Ae).apply(null, arguments);
          }),
          (o._mono_aot_System_Collections_Specialized_get_method = function () {
            return (o._mono_aot_System_Collections_Specialized_get_method =
              o.asm.Be).apply(null, arguments);
          }),
          (o._mono_aot_System_ComponentModel_get_method = function () {
            return (o._mono_aot_System_ComponentModel_get_method =
              o.asm.Ce).apply(null, arguments);
          }),
          (o._mono_aot_System_ComponentModel_EventBasedAsync_get_method =
            function () {
              return (o._mono_aot_System_ComponentModel_EventBasedAsync_get_method =
                o.asm.De).apply(null, arguments);
            }),
          (o._mono_aot_System_ComponentModel_Primitives_get_method =
            function () {
              return (o._mono_aot_System_ComponentModel_Primitives_get_method =
                o.asm.Ee).apply(null, arguments);
            }),
          (o._mono_aot_System_ComponentModel_TypeConverter_get_method =
            function () {
              return (o._mono_aot_System_ComponentModel_TypeConverter_get_method =
                o.asm.Fe).apply(null, arguments);
            }),
          (o._mono_aot_System_Console_get_method = function () {
            return (o._mono_aot_System_Console_get_method = o.asm.Ge).apply(
              null,
              arguments,
            );
          }),
          (o._mono_aot_System_Data_Common_get_method = function () {
            return (o._mono_aot_System_Data_Common_get_method = o.asm.He).apply(
              null,
              arguments,
            );
          }),
          (o._mono_aot_System_Diagnostics_DiagnosticSource_get_method =
            function () {
              return (o._mono_aot_System_Diagnostics_DiagnosticSource_get_method =
                o.asm.Ie).apply(null, arguments);
            }),
          (o._mono_aot_System_Diagnostics_Process_get_method = function () {
            return (o._mono_aot_System_Diagnostics_Process_get_method =
              o.asm.Je).apply(null, arguments);
          }),
          (o._mono_aot_System_Diagnostics_TraceSource_get_method = function () {
            return (o._mono_aot_System_Diagnostics_TraceSource_get_method =
              o.asm.Ke).apply(null, arguments);
          }),
          (o._mono_aot_System_get_method = function () {
            return (o._mono_aot_System_get_method = o.asm.Le).apply(
              null,
              arguments,
            );
          }),
          (o._mono_aot_System_Drawing_get_method = function () {
            return (o._mono_aot_System_Drawing_get_method = o.asm.Me).apply(
              null,
              arguments,
            );
          }),
          (o._mono_aot_System_Drawing_Primitives_get_method = function () {
            return (o._mono_aot_System_Drawing_Primitives_get_method =
              o.asm.Ne).apply(null, arguments);
          }),
          (o._mono_aot_System_Formats_Asn1_get_method = function () {
            return (o._mono_aot_System_Formats_Asn1_get_method =
              o.asm.Oe).apply(null, arguments);
          }),
          (o._mono_aot_System_IO_Compression_get_method = function () {
            return (o._mono_aot_System_IO_Compression_get_method =
              o.asm.Pe).apply(null, arguments);
          }),
          (o._mono_aot_System_IO_Packaging_get_method = function () {
            return (o._mono_aot_System_IO_Packaging_get_method =
              o.asm.Qe).apply(null, arguments);
          }),
          (o._mono_aot_System_Linq_get_method = function () {
            return (o._mono_aot_System_Linq_get_method = o.asm.Re).apply(
              null,
              arguments,
            );
          }),
          (o._mono_aot_System_Linq_Expressions_get_method = function () {
            return (o._mono_aot_System_Linq_Expressions_get_method =
              o.asm.Se).apply(null, arguments);
          }),
          (o._mono_aot_System_Memory_get_method = function () {
            return (o._mono_aot_System_Memory_get_method = o.asm.Te).apply(
              null,
              arguments,
            );
          }),
          (o._mono_aot_System_Net_Http_get_method = function () {
            return (o._mono_aot_System_Net_Http_get_method = o.asm.Ue).apply(
              null,
              arguments,
            );
          }),
          (o._mono_aot_System_Net_Http_Formatting_get_method = function () {
            return (o._mono_aot_System_Net_Http_Formatting_get_method =
              o.asm.Ve).apply(null, arguments);
          }),
          (o._mono_aot_System_Net_Mail_get_method = function () {
            return (o._mono_aot_System_Net_Mail_get_method = o.asm.We).apply(
              null,
              arguments,
            );
          }),
          (o._mono_aot_System_Net_NetworkInformation_get_method = function () {
            return (o._mono_aot_System_Net_NetworkInformation_get_method =
              o.asm.Xe).apply(null, arguments);
          }),
          (o._mono_aot_System_Net_Primitives_get_method = function () {
            return (o._mono_aot_System_Net_Primitives_get_method =
              o.asm.Ye).apply(null, arguments);
          }),
          (o._mono_aot_System_Net_Requests_get_method = function () {
            return (o._mono_aot_System_Net_Requests_get_method =
              o.asm.Ze).apply(null, arguments);
          }),
          (o._mono_aot_System_Net_Security_get_method = function () {
            return (o._mono_aot_System_Net_Security_get_method =
              o.asm._e).apply(null, arguments);
          }),
          (o._mono_aot_System_Net_ServicePoint_get_method = function () {
            return (o._mono_aot_System_Net_ServicePoint_get_method =
              o.asm.$e).apply(null, arguments);
          }),
          (o._mono_aot_System_Net_Sockets_get_method = function () {
            return (o._mono_aot_System_Net_Sockets_get_method = o.asm.af).apply(
              null,
              arguments,
            );
          }),
          (o._mono_aot_System_Net_WebHeaderCollection_get_method = function () {
            return (o._mono_aot_System_Net_WebHeaderCollection_get_method =
              o.asm.bf).apply(null, arguments);
          }),
          (o._mono_aot_System_Net_WebSockets_Client_get_method = function () {
            return (o._mono_aot_System_Net_WebSockets_Client_get_method =
              o.asm.cf).apply(null, arguments);
          }),
          (o._mono_aot_System_Net_WebSockets_get_method = function () {
            return (o._mono_aot_System_Net_WebSockets_get_method =
              o.asm.df).apply(null, arguments);
          }),
          (o._mono_aot_System_ObjectModel_get_method = function () {
            return (o._mono_aot_System_ObjectModel_get_method = o.asm.ef).apply(
              null,
              arguments,
            );
          }),
          (o._mono_aot_corlib_get_method = function () {
            return (o._mono_aot_corlib_get_method = o.asm.ff).apply(
              null,
              arguments,
            );
          }),
          (o._mono_aot_System_Private_Uri_get_method = function () {
            return (o._mono_aot_System_Private_Uri_get_method = o.asm.gf).apply(
              null,
              arguments,
            );
          }),
          (o._mono_aot_System_Private_Xml_get_method = function () {
            return (o._mono_aot_System_Private_Xml_get_method = o.asm.hf).apply(
              null,
              arguments,
            );
          }),
          (o._mono_aot_System_Private_Xml_Linq_get_method = function () {
            return (o._mono_aot_System_Private_Xml_Linq_get_method =
              o.asm.jf).apply(null, arguments);
          }),
          (o._mono_aot_System_Runtime_get_method = function () {
            return (o._mono_aot_System_Runtime_get_method = o.asm.kf).apply(
              null,
              arguments,
            );
          }),
          (o._mono_aot_System_Runtime_InteropServices_JavaScript_get_method =
            function () {
              return (o._mono_aot_System_Runtime_InteropServices_JavaScript_get_method =
                o.asm.lf).apply(null, arguments);
            }),
          (o._mono_aot_System_Runtime_Numerics_get_method = function () {
            return (o._mono_aot_System_Runtime_Numerics_get_method =
              o.asm.mf).apply(null, arguments);
          }),
          (o._mono_aot_System_Runtime_Serialization_Formatters_get_method =
            function () {
              return (o._mono_aot_System_Runtime_Serialization_Formatters_get_method =
                o.asm.nf).apply(null, arguments);
            }),
          (o._mono_aot_System_Runtime_Serialization_Primitives_get_method =
            function () {
              return (o._mono_aot_System_Runtime_Serialization_Primitives_get_method =
                o.asm.of).apply(null, arguments);
            }),
          (o._mono_aot_System_Security_Cryptography_get_method = function () {
            return (o._mono_aot_System_Security_Cryptography_get_method =
              o.asm.pf).apply(null, arguments);
          }),
          (o._mono_aot_System_Security_Cryptography_Pkcs_get_method =
            function () {
              return (o._mono_aot_System_Security_Cryptography_Pkcs_get_method =
                o.asm.qf).apply(null, arguments);
            }),
          (o._mono_aot_System_Text_Encoding_CodePages_get_method = function () {
            return (o._mono_aot_System_Text_Encoding_CodePages_get_method =
              o.asm.rf).apply(null, arguments);
          }),
          (o._mono_aot_System_Text_Encodings_Web_get_method = function () {
            return (o._mono_aot_System_Text_Encodings_Web_get_method =
              o.asm.sf).apply(null, arguments);
          }),
          (o._mono_aot_System_Text_Json_get_method = function () {
            return (o._mono_aot_System_Text_Json_get_method = o.asm.tf).apply(
              null,
              arguments,
            );
          }),
          (o._mono_aot_System_Text_RegularExpressions_get_method = function () {
            return (o._mono_aot_System_Text_RegularExpressions_get_method =
              o.asm.uf).apply(null, arguments);
          }),
          (o._mono_aot_System_Threading_Tasks_Parallel_get_method =
            function () {
              return (o._mono_aot_System_Threading_Tasks_Parallel_get_method =
                o.asm.vf).apply(null, arguments);
            }),
          (o._mono_aot_System_Windows_Extensions_get_method = function () {
            return (o._mono_aot_System_Windows_Extensions_get_method =
              o.asm.wf).apply(null, arguments);
          }),
          (o._mono_aot_System_Xml_Linq_get_method = function () {
            return (o._mono_aot_System_Xml_Linq_get_method = o.asm.xf).apply(
              null,
              arguments,
            );
          }),
          (o._malloc = function () {
            return (yn = o._malloc = o.asm.yf).apply(null, arguments);
          })),
        bn = (o._free = function () {
          return (bn = o._free = o.asm.zf).apply(null, arguments);
        }),
        vn = (o.___errno_location = function () {
          return (vn = o.___errno_location = o.asm.Af).apply(null, arguments);
        }),
        En =
          ((o._memalign = function () {
            return (o._memalign = o.asm.Bf).apply(null, arguments);
          }),
          (o._htons = function () {
            return (En = o._htons = o.asm.Cf).apply(null, arguments);
          })),
        Sn =
          ((o._mono_wasm_register_root = function () {
            return (o._mono_wasm_register_root = o.asm.Df).apply(
              null,
              arguments,
            );
          }),
          (o._mono_wasm_deregister_root = function () {
            return (o._mono_wasm_deregister_root = o.asm.Ef).apply(
              null,
              arguments,
            );
          }),
          (o._mono_wasm_add_assembly = function () {
            return (o._mono_wasm_add_assembly = o.asm.Ff).apply(
              null,
              arguments,
            );
          }),
          (o._mono_wasm_add_satellite_assembly = function () {
            return (o._mono_wasm_add_satellite_assembly = o.asm.Gf).apply(
              null,
              arguments,
            );
          }),
          (o._mono_wasm_setenv = function () {
            return (o._mono_wasm_setenv = o.asm.Hf).apply(null, arguments);
          }),
          (o._mono_wasm_getenv = function () {
            return (o._mono_wasm_getenv = o.asm.If).apply(null, arguments);
          }),
          (o._mono_wasm_register_bundled_satellite_assemblies = function () {
            return (o._mono_wasm_register_bundled_satellite_assemblies =
              o.asm.Jf).apply(null, arguments);
          }),
          (o._mono_wasm_load_runtime = function () {
            return (o._mono_wasm_load_runtime = o.asm.Kf).apply(
              null,
              arguments,
            );
          }),
          (o._mono_wasm_assembly_load = function () {
            return (o._mono_wasm_assembly_load = o.asm.Lf).apply(
              null,
              arguments,
            );
          }),
          (o._mono_wasm_get_corlib = function () {
            return (o._mono_wasm_get_corlib = o.asm.Mf).apply(null, arguments);
          }),
          (o._mono_wasm_assembly_find_class = function () {
            return (o._mono_wasm_assembly_find_class = o.asm.Nf).apply(
              null,
              arguments,
            );
          }),
          (o._mono_wasm_runtime_run_module_cctor = function () {
            return (o._mono_wasm_runtime_run_module_cctor = o.asm.Of).apply(
              null,
              arguments,
            );
          }),
          (o._mono_wasm_assembly_find_method = function () {
            return (o._mono_wasm_assembly_find_method = o.asm.Pf).apply(
              null,
              arguments,
            );
          }),
          (o._mono_wasm_get_delegate_invoke_ref = function () {
            return (o._mono_wasm_get_delegate_invoke_ref = o.asm.Qf).apply(
              null,
              arguments,
            );
          }),
          (o._mono_wasm_box_primitive_ref = function () {
            return (o._mono_wasm_box_primitive_ref = o.asm.Rf).apply(
              null,
              arguments,
            );
          }),
          (o._mono_wasm_invoke_method_ref = function () {
            return (o._mono_wasm_invoke_method_ref = o.asm.Sf).apply(
              null,
              arguments,
            );
          }),
          (o._mono_wasm_invoke_method_bound = function () {
            return (o._mono_wasm_invoke_method_bound = o.asm.Tf).apply(
              null,
              arguments,
            );
          }),
          (o._mono_wasm_assembly_get_entry_point = function () {
            return (o._mono_wasm_assembly_get_entry_point = o.asm.Uf).apply(
              null,
              arguments,
            );
          }),
          (o._mono_wasm_string_get_utf8 = function () {
            return (o._mono_wasm_string_get_utf8 = o.asm.Vf).apply(
              null,
              arguments,
            );
          }),
          (o._mono_wasm_string_from_js = function () {
            return (o._mono_wasm_string_from_js = o.asm.Wf).apply(
              null,
              arguments,
            );
          }),
          (o._mono_wasm_string_from_utf16_ref = function () {
            return (o._mono_wasm_string_from_utf16_ref = o.asm.Xf).apply(
              null,
              arguments,
            );
          }),
          (o._mono_wasm_get_obj_class = function () {
            return (o._mono_wasm_get_obj_class = o.asm.Yf).apply(
              null,
              arguments,
            );
          }),
          (o._mono_wasm_get_obj_type = function () {
            return (o._mono_wasm_get_obj_type = o.asm.Zf).apply(
              null,
              arguments,
            );
          }),
          (o._mono_wasm_try_unbox_primitive_and_get_type_ref = function () {
            return (o._mono_wasm_try_unbox_primitive_and_get_type_ref =
              o.asm._f).apply(null, arguments);
          }),
          (o._mono_wasm_array_length = function () {
            return (o._mono_wasm_array_length = o.asm.$f).apply(
              null,
              arguments,
            );
          }),
          (o._mono_wasm_array_get = function () {
            return (o._mono_wasm_array_get = o.asm.ag).apply(null, arguments);
          }),
          (o._mono_wasm_array_get_ref = function () {
            return (o._mono_wasm_array_get_ref = o.asm.bg).apply(
              null,
              arguments,
            );
          }),
          (o._mono_wasm_obj_array_new_ref = function () {
            return (o._mono_wasm_obj_array_new_ref = o.asm.cg).apply(
              null,
              arguments,
            );
          }),
          (o._mono_wasm_obj_array_new = function () {
            return (o._mono_wasm_obj_array_new = o.asm.dg).apply(
              null,
              arguments,
            );
          }),
          (o._mono_wasm_obj_array_set = function () {
            return (o._mono_wasm_obj_array_set = o.asm.eg).apply(
              null,
              arguments,
            );
          }),
          (o._mono_wasm_obj_array_set_ref = function () {
            return (o._mono_wasm_obj_array_set_ref = o.asm.fg).apply(
              null,
              arguments,
            );
          }),
          (o._mono_wasm_string_array_new_ref = function () {
            return (o._mono_wasm_string_array_new_ref = o.asm.gg).apply(
              null,
              arguments,
            );
          }),
          (o._mono_wasm_exec_regression = function () {
            return (o._mono_wasm_exec_regression = o.asm.hg).apply(
              null,
              arguments,
            );
          }),
          (o._mono_wasm_exit = function () {
            return (o._mono_wasm_exit = o.asm.ig).apply(null, arguments);
          }),
          (o._mono_wasm_set_main_args = function () {
            return (o._mono_wasm_set_main_args = o.asm.jg).apply(
              null,
              arguments,
            );
          }),
          (o._mono_wasm_strdup = function () {
            return (o._mono_wasm_strdup = o.asm.kg).apply(null, arguments);
          }),
          (o._mono_wasm_parse_runtime_options = function () {
            return (o._mono_wasm_parse_runtime_options = o.asm.lg).apply(
              null,
              arguments,
            );
          }),
          (o._mono_wasm_enable_on_demand_gc = function () {
            return (o._mono_wasm_enable_on_demand_gc = o.asm.mg).apply(
              null,
              arguments,
            );
          }),
          (o._mono_wasm_intern_string_ref = function () {
            return (o._mono_wasm_intern_string_ref = o.asm.ng).apply(
              null,
              arguments,
            );
          }),
          (o._mono_wasm_string_get_data_ref = function () {
            return (o._mono_wasm_string_get_data_ref = o.asm.og).apply(
              null,
              arguments,
            );
          }),
          (o._mono_wasm_string_get_data = function () {
            return (o._mono_wasm_string_get_data = o.asm.pg).apply(
              null,
              arguments,
            );
          }),
          (o._mono_wasm_class_get_type = function () {
            return (o._mono_wasm_class_get_type = o.asm.qg).apply(
              null,
              arguments,
            );
          }),
          (o._mono_wasm_type_get_class = function () {
            return (o._mono_wasm_type_get_class = o.asm.rg).apply(
              null,
              arguments,
            );
          }),
          (o._mono_wasm_get_type_name = function () {
            return (o._mono_wasm_get_type_name = o.asm.sg).apply(
              null,
              arguments,
            );
          }),
          (o._mono_wasm_get_type_aqn = function () {
            return (o._mono_wasm_get_type_aqn = o.asm.tg).apply(
              null,
              arguments,
            );
          }),
          (o._mono_wasm_write_managed_pointer_unsafe = function () {
            return (o._mono_wasm_write_managed_pointer_unsafe = o.asm.ug).apply(
              null,
              arguments,
            );
          }),
          (o._mono_wasm_copy_managed_pointer = function () {
            return (o._mono_wasm_copy_managed_pointer = o.asm.vg).apply(
              null,
              arguments,
            );
          }),
          (o._mono_wasm_i52_to_f64 = function () {
            return (o._mono_wasm_i52_to_f64 = o.asm.wg).apply(null, arguments);
          }),
          (o._mono_wasm_u52_to_f64 = function () {
            return (o._mono_wasm_u52_to_f64 = o.asm.xg).apply(null, arguments);
          }),
          (o._mono_wasm_f64_to_u52 = function () {
            return (o._mono_wasm_f64_to_u52 = o.asm.yg).apply(null, arguments);
          }),
          (o._mono_wasm_f64_to_i52 = function () {
            return (o._mono_wasm_f64_to_i52 = o.asm.zg).apply(null, arguments);
          }),
          (o._mono_wasm_typed_array_new_ref = function () {
            return (o._mono_wasm_typed_array_new_ref = o.asm.Ag).apply(
              null,
              arguments,
            );
          }),
          (o._mono_wasm_unbox_enum = function () {
            return (o._mono_wasm_unbox_enum = o.asm.Bg).apply(null, arguments);
          }),
          (o._mono_wasm_send_dbg_command_with_parms = function () {
            return (o._mono_wasm_send_dbg_command_with_parms = o.asm.Cg).apply(
              null,
              arguments,
            );
          }),
          (o._mono_wasm_send_dbg_command = function () {
            return (o._mono_wasm_send_dbg_command = o.asm.Dg).apply(
              null,
              arguments,
            );
          }),
          (o._mono_wasm_event_pipe_enable = function () {
            return (o._mono_wasm_event_pipe_enable = o.asm.Eg).apply(
              null,
              arguments,
            );
          }),
          (o._mono_wasm_event_pipe_session_start_streaming = function () {
            return (o._mono_wasm_event_pipe_session_start_streaming =
              o.asm.Fg).apply(null, arguments);
          }),
          (o._mono_wasm_event_pipe_session_disable = function () {
            return (o._mono_wasm_event_pipe_session_disable = o.asm.Gg).apply(
              null,
              arguments,
            );
          }),
          (o._mono_background_exec = function () {
            return (o._mono_background_exec = o.asm.Hg).apply(null, arguments);
          }),
          (o._mono_wasm_get_icudt_name = function () {
            return (o._mono_wasm_get_icudt_name = o.asm.Ig).apply(
              null,
              arguments,
            );
          }),
          (o._mono_wasm_load_icu_data = function () {
            return (o._mono_wasm_load_icu_data = o.asm.Jg).apply(
              null,
              arguments,
            );
          }),
          (o._mono_print_method_from_ip = function () {
            return (o._mono_print_method_from_ip = o.asm.Kg).apply(
              null,
              arguments,
            );
          }),
          (o._mono_set_timeout_exec = function () {
            return (o._mono_set_timeout_exec = o.asm.Lg).apply(null, arguments);
          }),
          (o._emscripten_builtin_memalign = function () {
            return (Sn = o._emscripten_builtin_memalign = o.asm.Mg).apply(
              null,
              arguments,
            );
          })),
        An = (o._ntohs = function () {
          return (An = o._ntohs = o.asm.Ng).apply(null, arguments);
        }),
        kn = (o._setThrew = function () {
          return (kn = o._setThrew = o.asm.Og).apply(null, arguments);
        }),
        Nn = (o.stackSave = function () {
          return (Nn = o.stackSave = o.asm.Pg).apply(null, arguments);
        }),
        On = (o.stackRestore = function () {
          return (On = o.stackRestore = o.asm.Qg).apply(null, arguments);
        }),
        xn = (o.stackAlloc = function () {
          return (xn = o.stackAlloc = o.asm.Rg).apply(null, arguments);
        }),
        jn = (o.___cxa_can_catch = function () {
          return (jn = o.___cxa_can_catch = o.asm.Sg).apply(null, arguments);
        }),
        Tn = (o.___cxa_is_pointer_type = function () {
          return (Tn = o.___cxa_is_pointer_type = o.asm.Tg).apply(
            null,
            arguments,
          );
        }),
        Dn = (o.dynCall_iji = function () {
          return (Dn = o.dynCall_iji = o.asm.Ug).apply(null, arguments);
        }),
        Mn = (o.dynCall_jii = function () {
          return (Mn = o.dynCall_jii = o.asm.Vg).apply(null, arguments);
        }),
        Rn = (o.dynCall_viji = function () {
          return (Rn = o.dynCall_viji = o.asm.Wg).apply(null, arguments);
        }),
        Pn = (o.dynCall_jijii = function () {
          return (Pn = o.dynCall_jijii = o.asm.Xg).apply(null, arguments);
        }),
        Cn = (o.dynCall_ji = function () {
          return (Cn = o.dynCall_ji = o.asm.Yg).apply(null, arguments);
        }),
        In = (o.dynCall_iijiii = function () {
          return (In = o.dynCall_iijiii = o.asm.Zg).apply(null, arguments);
        }),
        Fn = (o.dynCall_jiii = function () {
          return (Fn = o.dynCall_jiii = o.asm._g).apply(null, arguments);
        }),
        $n = (o.dynCall_vijii = function () {
          return ($n = o.dynCall_vijii = o.asm.$g).apply(null, arguments);
        }),
        Un = (o.dynCall_iiji = function () {
          return (Un = o.dynCall_iiji = o.asm.ah).apply(null, arguments);
        }),
        Bn = (o.dynCall_vijji = function () {
          return (Bn = o.dynCall_vijji = o.asm.bh).apply(null, arguments);
        }),
        Wn = (o.dynCall_jjjji = function () {
          return (Wn = o.dynCall_jjjji = o.asm.ch).apply(null, arguments);
        }),
        zn = (o.dynCall_viiji = function () {
          return (zn = o.dynCall_viiji = o.asm.dh).apply(null, arguments);
        }),
        Ln = (o.dynCall_ijii = function () {
          return (Ln = o.dynCall_ijii = o.asm.eh).apply(null, arguments);
        }),
        Hn = (o.dynCall_iiijii = function () {
          return (Hn = o.dynCall_iiijii = o.asm.fh).apply(null, arguments);
        }),
        Vn = (o.dynCall_iiiji = function () {
          return (Vn = o.dynCall_iiiji = o.asm.gh).apply(null, arguments);
        }),
        qn = (o.dynCall_ijiii = function () {
          return (qn = o.dynCall_ijiii = o.asm.hh).apply(null, arguments);
        }),
        Gn = (o.dynCall_jiiii = function () {
          return (Gn = o.dynCall_jiiii = o.asm.ih).apply(null, arguments);
        }),
        Jn = (o.dynCall_iijiiiii = function () {
          return (Jn = o.dynCall_iijiiiii = o.asm.jh).apply(null, arguments);
        }),
        Yn = (o.dynCall_jiiiii = function () {
          return (Yn = o.dynCall_jiiiii = o.asm.kh).apply(null, arguments);
        }),
        Xn = (o.dynCall_viiiiiji = function () {
          return (Xn = o.dynCall_viiiiiji = o.asm.lh).apply(null, arguments);
        }),
        Zn = (o.dynCall_iiiiiji = function () {
          return (Zn = o.dynCall_iiiiiji = o.asm.mh).apply(null, arguments);
        }),
        Kn = (o.dynCall_jd = function () {
          return (Kn = o.dynCall_jd = o.asm.nh).apply(null, arguments);
        }),
        Qn = (o.dynCall_dji = function () {
          return (Qn = o.dynCall_dji = o.asm.oh).apply(null, arguments);
        }),
        eo = (o.dynCall_viijii = function () {
          return (eo = o.dynCall_viijii = o.asm.ph).apply(null, arguments);
        }),
        to = (o.dynCall_vjji = function () {
          return (to = o.dynCall_vjji = o.asm.qh).apply(null, arguments);
        }),
        ro = (o.dynCall_iiiiiiji = function () {
          return (ro = o.dynCall_iiiiiiji = o.asm.rh).apply(null, arguments);
        }),
        no = (o.dynCall_viijji = function () {
          return (no = o.dynCall_viijji = o.asm.sh).apply(null, arguments);
        }),
        oo = (o.dynCall_iiiiiiijiii = function () {
          return (oo = o.dynCall_iiiiiiijiii = o.asm.th).apply(null, arguments);
        }),
        io = (o.dynCall_iij = function () {
          return (io = o.dynCall_iij = o.asm.uh).apply(null, arguments);
        }),
        ao = (o.dynCall_j = function () {
          return (ao = o.dynCall_j = o.asm.vh).apply(null, arguments);
        }),
        so = (o.dynCall_iiiiij = function () {
          return (so = o.dynCall_iiiiij = o.asm.wh).apply(null, arguments);
        });
      function co(e, t, r) {
        var n = Nn();
        try {
          return Re(e)(t, r);
        } catch (e) {
          if ((On(n), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function _o(e, t, r, n) {
        var o = Nn();
        try {
          return Re(e)(t, r, n);
        } catch (e) {
          if ((On(o), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function uo(e, t) {
        var r = Nn();
        try {
          Re(e)(t);
        } catch (e) {
          if ((On(r), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function lo(e) {
        var t = Nn();
        try {
          Re(e)();
        } catch (e) {
          if ((On(t), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function fo(e, t, r) {
        var n = Nn();
        try {
          Re(e)(t, r);
        } catch (e) {
          if ((On(n), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function mo(e, t, r, n) {
        var o = Nn();
        try {
          Re(e)(t, r, n);
        } catch (e) {
          if ((On(o), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function ho(e, t, r, n, o, i) {
        var a = Nn();
        try {
          Re(e)(t, r, n, o, i);
        } catch (e) {
          if ((On(a), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function po(e, t, r, n, o, i, a) {
        var s = Nn();
        try {
          return Re(e)(t, r, n, o, i, a);
        } catch (e) {
          if ((On(s), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function wo(e, t, r, n, o) {
        var i = Nn();
        try {
          Re(e)(t, r, n, o);
        } catch (e) {
          if ((On(i), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function go(e, t, r, n, o, i) {
        var a = Nn();
        try {
          return Re(e)(t, r, n, o, i);
        } catch (e) {
          if ((On(a), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function yo(e, t, r, n, o) {
        var i = Nn();
        try {
          return Re(e)(t, r, n, o);
        } catch (e) {
          if ((On(i), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function bo(e, t) {
        var r = Nn();
        try {
          return Re(e)(t);
        } catch (e) {
          if ((On(r), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function vo(e, t, r, n, o, i, a) {
        var s = Nn();
        try {
          Re(e)(t, r, n, o, i, a);
        } catch (e) {
          if ((On(s), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function Eo(e, t, r, n, o, i, a, s) {
        var c = Nn();
        try {
          Re(e)(t, r, n, o, i, a, s);
        } catch (e) {
          if ((On(c), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function So(e, t, r, n) {
        var o = Nn();
        try {
          return Re(e)(t, r, n);
        } catch (e) {
          if ((On(o), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function Ao(e, t, r, n) {
        var o = Nn();
        try {
          return Re(e)(t, r, n);
        } catch (e) {
          if ((On(o), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function ko(e, t, r, n, o, i, a) {
        var s = Nn();
        try {
          Re(e)(t, r, n, o, i, a);
        } catch (e) {
          if ((On(s), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function No(e, t, r, n, o, i, a, s) {
        var c = Nn();
        try {
          return Re(e)(t, r, n, o, i, a, s);
        } catch (e) {
          if ((On(c), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function Oo(e, t, r, n, o, i, a) {
        var s = Nn();
        try {
          Re(e)(t, r, n, o, i, a);
        } catch (e) {
          if ((On(s), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function xo(e, t, r, n, o) {
        var i = Nn();
        try {
          Re(e)(t, r, n, o);
        } catch (e) {
          if ((On(i), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function jo(e, t, r, n, o, i, a, s, c, _) {
        var u = Nn();
        try {
          Re(e)(t, r, n, o, i, a, s, c, _);
        } catch (e) {
          if ((On(u), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function To(e, t, r) {
        var n = Nn();
        try {
          return Re(e)(t, r);
        } catch (e) {
          if ((On(n), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function Do(e, t, r, n, o, i, a, s) {
        var c = Nn();
        try {
          return Re(e)(t, r, n, o, i, a, s);
        } catch (e) {
          if ((On(c), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function Mo(e, t, r) {
        var n = Nn();
        try {
          return Re(e)(t, r);
        } catch (e) {
          if ((On(n), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function Ro(e, t, r) {
        var n = Nn();
        try {
          return Re(e)(t, r);
        } catch (e) {
          if ((On(n), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function Po(e, t, r, n, o, i) {
        var a = Nn();
        try {
          Re(e)(t, r, n, o, i);
        } catch (e) {
          if ((On(a), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function Co(e, t, r, n, o, i) {
        var a = Nn();
        try {
          return Re(e)(t, r, n, o, i);
        } catch (e) {
          if ((On(a), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function Io(e, t, r, n, o) {
        var i = Nn();
        try {
          return Re(e)(t, r, n, o);
        } catch (e) {
          if ((On(i), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function Fo(e, t, r) {
        var n = Nn();
        try {
          return Re(e)(t, r);
        } catch (e) {
          if ((On(n), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function $o(e, t, r, n, o, i) {
        var a = Nn();
        try {
          Re(e)(t, r, n, o, i);
        } catch (e) {
          if ((On(a), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function Uo(e, t, r) {
        var n = Nn();
        try {
          return Re(e)(t, r);
        } catch (e) {
          if ((On(n), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function Bo(e, t, r, n, o, i, a, s, c, _, u, l, f, m, d) {
        var h = Nn();
        try {
          return Re(e)(t, r, n, o, i, a, s, c, _, u, l, f, m, d);
        } catch (e) {
          if ((On(h), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function Wo(e, t, r, n) {
        var o = Nn();
        try {
          return Re(e)(t, r, n);
        } catch (e) {
          if ((On(o), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function zo(e, t, r, n, o, i) {
        var a = Nn();
        try {
          return Re(e)(t, r, n, o, i);
        } catch (e) {
          if ((On(a), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function Lo(e, t, r, n, o, i, a, s, c, _, u) {
        var l = Nn();
        try {
          return Re(e)(t, r, n, o, i, a, s, c, _, u);
        } catch (e) {
          if ((On(l), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function Ho(e, t, r, n, o, i, a, s, c) {
        var _ = Nn();
        try {
          Re(e)(t, r, n, o, i, a, s, c);
        } catch (e) {
          if ((On(_), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function Vo(e, t, r) {
        var n = Nn();
        try {
          return Re(e)(t, r);
        } catch (e) {
          if ((On(n), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function qo(e, t, r, n) {
        var o = Nn();
        try {
          Re(e)(t, r, n);
        } catch (e) {
          if ((On(o), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function Go(e, t, r, n) {
        var o = Nn();
        try {
          return Re(e)(t, r, n);
        } catch (e) {
          if ((On(o), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function Jo(e, t, r, n, o, i) {
        var a = Nn();
        try {
          return Re(e)(t, r, n, o, i);
        } catch (e) {
          if ((On(a), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function Yo(e, t, r, n, o, i) {
        var a = Nn();
        try {
          return Re(e)(t, r, n, o, i);
        } catch (e) {
          if ((On(a), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function Xo(e, t, r, n, o) {
        var i = Nn();
        try {
          return Re(e)(t, r, n, o);
        } catch (e) {
          if ((On(i), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function Zo(e, t, r, n, o, i) {
        var a = Nn();
        try {
          Re(e)(t, r, n, o, i);
        } catch (e) {
          if ((On(a), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function Ko(e, t, r, n, o, i, a) {
        var s = Nn();
        try {
          Re(e)(t, r, n, o, i, a);
        } catch (e) {
          if ((On(s), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function Qo(e, t, r, n) {
        var o = Nn();
        try {
          return Re(e)(t, r, n);
        } catch (e) {
          if ((On(o), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function ei(e, t, r, n, o, i, a, s, c) {
        var _ = Nn();
        try {
          Re(e)(t, r, n, o, i, a, s, c);
        } catch (e) {
          if ((On(_), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function ti(e, t, r, n, o, i, a, s, c, _, u, l, f, m, d, h, p) {
        var w = Nn();
        try {
          return Re(e)(t, r, n, o, i, a, s, c, _, u, l, f, m, d, h, p);
        } catch (e) {
          if ((On(w), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function ri(e, t, r, n, o, i, a, s, c) {
        var _ = Nn();
        try {
          return Re(e)(t, r, n, o, i, a, s, c);
        } catch (e) {
          if ((On(_), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function ni(e, t, r, n, o, i, a, s, c) {
        var _ = Nn();
        try {
          return Re(e)(t, r, n, o, i, a, s, c);
        } catch (e) {
          if ((On(_), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function oi(e, t, r, n, o, i, a, s, c, _) {
        var u = Nn();
        try {
          return Re(e)(t, r, n, o, i, a, s, c, _);
        } catch (e) {
          if ((On(u), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function ii(e, t, r, n, o) {
        var i = Nn();
        try {
          Re(e)(t, r, n, o);
        } catch (e) {
          if ((On(i), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function ai(e, t, r, n) {
        var o = Nn();
        try {
          Re(e)(t, r, n);
        } catch (e) {
          if ((On(o), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function si(e, t, r) {
        var n = Nn();
        try {
          return Re(e)(t, r);
        } catch (e) {
          if ((On(n), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function ci(e, t, r, n, o) {
        var i = Nn();
        try {
          Re(e)(t, r, n, o);
        } catch (e) {
          if ((On(i), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function _i(e, t, r, n, o, i, a, s, c, _, u) {
        var l = Nn();
        try {
          Re(e)(t, r, n, o, i, a, s, c, _, u);
        } catch (e) {
          if ((On(l), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function ui(e, t, r, n, o, i) {
        var a = Nn();
        try {
          return Re(e)(t, r, n, o, i);
        } catch (e) {
          if ((On(a), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function li(e, t, r, n, o, i, a, s, c) {
        var _ = Nn();
        try {
          return Re(e)(t, r, n, o, i, a, s, c);
        } catch (e) {
          if ((On(_), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function fi(e, t, r, n, o, i, a, s, c) {
        var _ = Nn();
        try {
          return Re(e)(t, r, n, o, i, a, s, c);
        } catch (e) {
          if ((On(_), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function mi(
        e,
        t,
        r,
        n,
        o,
        i,
        a,
        s,
        c,
        _,
        u,
        l,
        f,
        m,
        d,
        h,
        p,
        w,
        g,
        y,
        b,
        v,
      ) {
        var E = Nn();
        try {
          return Re(e)(
            t,
            r,
            n,
            o,
            i,
            a,
            s,
            c,
            _,
            u,
            l,
            f,
            m,
            d,
            h,
            p,
            w,
            g,
            y,
            b,
            v,
          );
        } catch (e) {
          if ((On(E), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function di(e, t, r, n, o) {
        var i = Nn();
        try {
          return Re(e)(t, r, n, o);
        } catch (e) {
          if ((On(i), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function hi(e, t, r, n, o) {
        var i = Nn();
        try {
          Re(e)(t, r, n, o);
        } catch (e) {
          if ((On(i), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function pi(e, t, r, n, o, i, a, s, c, _, u, l, f, m, d) {
        var h = Nn();
        try {
          Re(e)(t, r, n, o, i, a, s, c, _, u, l, f, m, d);
        } catch (e) {
          if ((On(h), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function wi(e, t, r, n, o, i, a, s, c, _, u, l, f, m, d, h, p) {
        var w = Nn();
        try {
          Re(e)(t, r, n, o, i, a, s, c, _, u, l, f, m, d, h, p);
        } catch (e) {
          if ((On(w), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function gi(e, t, r, n, o) {
        var i = Nn();
        try {
          return Re(e)(t, r, n, o);
        } catch (e) {
          if ((On(i), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function yi(e, t, r, n, o, i, a, s, c, _, u) {
        var l = Nn();
        try {
          return Re(e)(t, r, n, o, i, a, s, c, _, u);
        } catch (e) {
          if ((On(l), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function bi(e, t, r, n, o, i, a) {
        var s = Nn();
        try {
          Re(e)(t, r, n, o, i, a);
        } catch (e) {
          if ((On(s), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function vi(e, t, r, n, o, i, a, s, c) {
        var _ = Nn();
        try {
          Re(e)(t, r, n, o, i, a, s, c);
        } catch (e) {
          if ((On(_), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function Ei(e, t, r, n) {
        var o = Nn();
        try {
          return Re(e)(t, r, n);
        } catch (e) {
          if ((On(o), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function Si(e, t, r, n) {
        var o = Nn();
        try {
          return Re(e)(t, r, n);
        } catch (e) {
          if ((On(o), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function Ai(e, t, r, n, o, i, a, s, c, _, u, l, f, m, d, h, p, w, g, y) {
        var b = Nn();
        try {
          return Re(e)(t, r, n, o, i, a, s, c, _, u, l, f, m, d, h, p, w, g, y);
        } catch (e) {
          if ((On(b), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function ki(e, t, r, n, o, i, a, s, c, _, u, l, f, m, d, h, p, w) {
        var g = Nn();
        try {
          Re(e)(t, r, n, o, i, a, s, c, _, u, l, f, m, d, h, p, w);
        } catch (e) {
          if ((On(g), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function Ni(e, t, r, n, o) {
        var i = Nn();
        try {
          return Re(e)(t, r, n, o);
        } catch (e) {
          if ((On(i), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function Oi(e, t, r, n, o, i, a) {
        var s = Nn();
        try {
          Re(e)(t, r, n, o, i, a);
        } catch (e) {
          if ((On(s), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function xi(e, t, r, n, o, i, a, s) {
        var c = Nn();
        try {
          return Re(e)(t, r, n, o, i, a, s);
        } catch (e) {
          if ((On(c), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function ji(e, t, r, n, o, i, a) {
        var s = Nn();
        try {
          Re(e)(t, r, n, o, i, a);
        } catch (e) {
          if ((On(s), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function Ti(e, t, r, n, o, i, a, s, c) {
        var _ = Nn();
        try {
          return Re(e)(t, r, n, o, i, a, s, c);
        } catch (e) {
          if ((On(_), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function Di(e, t, r, n, o, i, a, s, c) {
        var _ = Nn();
        try {
          Re(e)(t, r, n, o, i, a, s, c);
        } catch (e) {
          if ((On(_), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function Mi(e, t, r, n, o, i, a, s, c) {
        var _ = Nn();
        try {
          Re(e)(t, r, n, o, i, a, s, c);
        } catch (e) {
          if ((On(_), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function Ri(e, t, r, n, o, i, a, s, c, _) {
        var u = Nn();
        try {
          return Re(e)(t, r, n, o, i, a, s, c, _);
        } catch (e) {
          if ((On(u), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function Pi(e, t, r, n, o, i, a, s, c, _, u) {
        var l = Nn();
        try {
          Re(e)(t, r, n, o, i, a, s, c, _, u);
        } catch (e) {
          if ((On(l), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function Ci(e, t, r, n, o, i) {
        var a = Nn();
        try {
          Re(e)(t, r, n, o, i);
        } catch (e) {
          if ((On(a), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function Ii(e, t, r) {
        var n = Nn();
        try {
          return Re(e)(t, r);
        } catch (e) {
          if ((On(n), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function Fi(e, t, r, n, o, i, a) {
        var s = Nn();
        try {
          return Re(e)(t, r, n, o, i, a);
        } catch (e) {
          if ((On(s), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function $i(e, t, r, n, o, i) {
        var a = Nn();
        try {
          Re(e)(t, r, n, o, i);
        } catch (e) {
          if ((On(a), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function Ui(e, t, r, n, o, i) {
        var a = Nn();
        try {
          return Re(e)(t, r, n, o, i);
        } catch (e) {
          if ((On(a), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function Bi(e, t, r, n, o, i, a, s, c, _, u, l, f, m) {
        var d = Nn();
        try {
          Re(e)(t, r, n, o, i, a, s, c, _, u, l, f, m);
        } catch (e) {
          if ((On(d), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function Wi(e, t, r, n, o, i, a, s) {
        var c = Nn();
        try {
          Re(e)(t, r, n, o, i, a, s);
        } catch (e) {
          if ((On(c), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function zi(e, t, r, n, o, i, a, s) {
        var c = Nn();
        try {
          Re(e)(t, r, n, o, i, a, s);
        } catch (e) {
          if ((On(c), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function Li(e, t, r, n, o, i, a) {
        var s = Nn();
        try {
          Re(e)(t, r, n, o, i, a);
        } catch (e) {
          if ((On(s), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function Hi(e, t, r, n, o, i) {
        var a = Nn();
        try {
          Re(e)(t, r, n, o, i);
        } catch (e) {
          if ((On(a), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function Vi(e, t, r, n, o, i, a, s, c, _, u, l) {
        var f = Nn();
        try {
          return Re(e)(t, r, n, o, i, a, s, c, _, u, l);
        } catch (e) {
          if ((On(f), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function qi(e, t, r, n, o, i, a) {
        var s = Nn();
        try {
          Re(e)(t, r, n, o, i, a);
        } catch (e) {
          if ((On(s), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function Gi(e, t, r, n, o, i) {
        var a = Nn();
        try {
          return Re(e)(t, r, n, o, i);
        } catch (e) {
          if ((On(a), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function Ji(e, t, r, n, o, i) {
        var a = Nn();
        try {
          return Re(e)(t, r, n, o, i);
        } catch (e) {
          if ((On(a), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function Yi(e, t, r, n, o, i, a, s, c) {
        var _ = Nn();
        try {
          Re(e)(t, r, n, o, i, a, s, c);
        } catch (e) {
          if ((On(_), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function Xi(e, t, r, n, o, i, a, s, c, _, u, l, f, m) {
        var d = Nn();
        try {
          return Re(e)(t, r, n, o, i, a, s, c, _, u, l, f, m);
        } catch (e) {
          if ((On(d), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function Zi(e, t, r, n, o, i, a, s, c, _, u, l) {
        var f = Nn();
        try {
          return Re(e)(t, r, n, o, i, a, s, c, _, u, l);
        } catch (e) {
          if ((On(f), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function Ki(e, t, r, n, o, i, a, s) {
        var c = Nn();
        try {
          return Re(e)(t, r, n, o, i, a, s);
        } catch (e) {
          if ((On(c), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function Qi(e, t, r, n, o, i) {
        var a = Nn();
        try {
          return Re(e)(t, r, n, o, i);
        } catch (e) {
          if ((On(a), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function ea(e, t, r, n, o, i, a, s, c) {
        var _ = Nn();
        try {
          Re(e)(t, r, n, o, i, a, s, c);
        } catch (e) {
          if ((On(_), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function ta(e, t, r, n, o) {
        var i = Nn();
        try {
          Re(e)(t, r, n, o);
        } catch (e) {
          if ((On(i), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function ra(e, t, r, n, o, i) {
        var a = Nn();
        try {
          return Re(e)(t, r, n, o, i);
        } catch (e) {
          if ((On(a), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function na(e, t, r, n, o, i, a) {
        var s = Nn();
        try {
          return Re(e)(t, r, n, o, i, a);
        } catch (e) {
          if ((On(s), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function oa(e) {
        var t = Nn();
        try {
          return Re(e)();
        } catch (e) {
          if ((On(t), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function ia(e, t, r, n, o, i, a, s, c, _) {
        var u = Nn();
        try {
          Re(e)(t, r, n, o, i, a, s, c, _);
        } catch (e) {
          if ((On(u), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function aa(e, t, r, n) {
        var o = Nn();
        try {
          return Re(e)(t, r, n);
        } catch (e) {
          if ((On(o), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function sa(e, t, r, n, o, i, a, s, c, _, u, l) {
        var f = Nn();
        try {
          Re(e)(t, r, n, o, i, a, s, c, _, u, l);
        } catch (e) {
          if ((On(f), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function ca(e, t, r, n, o, i, a, s, c, _, u, l, f) {
        var m = Nn();
        try {
          Re(e)(t, r, n, o, i, a, s, c, _, u, l, f);
        } catch (e) {
          if ((On(m), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function _a(e, t, r, n, o, i, a, s, c, _, u, l, f, m) {
        var d = Nn();
        try {
          Re(e)(t, r, n, o, i, a, s, c, _, u, l, f, m);
        } catch (e) {
          if ((On(d), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function ua(e, t, r, n, o, i, a, s, c, _, u, l, f, m, d, h) {
        var p = Nn();
        try {
          Re(e)(t, r, n, o, i, a, s, c, _, u, l, f, m, d, h);
        } catch (e) {
          if ((On(p), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function la(e, t, r, n, o, i, a, s, c, _, u, l, f, m, d, h, p, w, g) {
        var y = Nn();
        try {
          Re(e)(t, r, n, o, i, a, s, c, _, u, l, f, m, d, h, p, w, g);
        } catch (e) {
          if ((On(y), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function fa(e, t, r, n, o, i, a, s, c, _, u, l, f, m, d, h, p, w, g, y) {
        var b = Nn();
        try {
          Re(e)(t, r, n, o, i, a, s, c, _, u, l, f, m, d, h, p, w, g, y);
        } catch (e) {
          if ((On(b), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function ma(
        e,
        t,
        r,
        n,
        o,
        i,
        a,
        s,
        c,
        _,
        u,
        l,
        f,
        m,
        d,
        h,
        p,
        w,
        g,
        y,
        b,
      ) {
        var v = Nn();
        try {
          Re(e)(t, r, n, o, i, a, s, c, _, u, l, f, m, d, h, p, w, g, y, b);
        } catch (e) {
          if ((On(v), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function da(
        e,
        t,
        r,
        n,
        o,
        i,
        a,
        s,
        c,
        _,
        u,
        l,
        f,
        m,
        d,
        h,
        p,
        w,
        g,
        y,
        b,
        v,
      ) {
        var E = Nn();
        try {
          Re(e)(t, r, n, o, i, a, s, c, _, u, l, f, m, d, h, p, w, g, y, b, v);
        } catch (e) {
          if ((On(E), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function ha(
        e,
        t,
        r,
        n,
        o,
        i,
        a,
        s,
        c,
        _,
        u,
        l,
        f,
        m,
        d,
        h,
        p,
        w,
        g,
        y,
        b,
        v,
        E,
      ) {
        var S = Nn();
        try {
          Re(e)(
            t,
            r,
            n,
            o,
            i,
            a,
            s,
            c,
            _,
            u,
            l,
            f,
            m,
            d,
            h,
            p,
            w,
            g,
            y,
            b,
            v,
            E,
          );
        } catch (e) {
          if ((On(S), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function pa(
        e,
        t,
        r,
        n,
        o,
        i,
        a,
        s,
        c,
        _,
        u,
        l,
        f,
        m,
        d,
        h,
        p,
        w,
        g,
        y,
        b,
        v,
        E,
        S,
      ) {
        var A = Nn();
        try {
          Re(e)(
            t,
            r,
            n,
            o,
            i,
            a,
            s,
            c,
            _,
            u,
            l,
            f,
            m,
            d,
            h,
            p,
            w,
            g,
            y,
            b,
            v,
            E,
            S,
          );
        } catch (e) {
          if ((On(A), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function wa(
        e,
        t,
        r,
        n,
        o,
        i,
        a,
        s,
        c,
        _,
        u,
        l,
        f,
        m,
        d,
        h,
        p,
        w,
        g,
        y,
        b,
        v,
        E,
        S,
        A,
      ) {
        var k = Nn();
        try {
          Re(e)(
            t,
            r,
            n,
            o,
            i,
            a,
            s,
            c,
            _,
            u,
            l,
            f,
            m,
            d,
            h,
            p,
            w,
            g,
            y,
            b,
            v,
            E,
            S,
            A,
          );
        } catch (e) {
          if ((On(k), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function ga(
        e,
        t,
        r,
        n,
        o,
        i,
        a,
        s,
        c,
        _,
        u,
        l,
        f,
        m,
        d,
        h,
        p,
        w,
        g,
        y,
        b,
        v,
        E,
        S,
        A,
        k,
      ) {
        var N = Nn();
        try {
          Re(e)(
            t,
            r,
            n,
            o,
            i,
            a,
            s,
            c,
            _,
            u,
            l,
            f,
            m,
            d,
            h,
            p,
            w,
            g,
            y,
            b,
            v,
            E,
            S,
            A,
            k,
          );
        } catch (e) {
          if ((On(N), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function ya(
        e,
        t,
        r,
        n,
        o,
        i,
        a,
        s,
        c,
        _,
        u,
        l,
        f,
        m,
        d,
        h,
        p,
        w,
        g,
        y,
        b,
        v,
        E,
        S,
        A,
        k,
        N,
      ) {
        var O = Nn();
        try {
          Re(e)(
            t,
            r,
            n,
            o,
            i,
            a,
            s,
            c,
            _,
            u,
            l,
            f,
            m,
            d,
            h,
            p,
            w,
            g,
            y,
            b,
            v,
            E,
            S,
            A,
            k,
            N,
          );
        } catch (e) {
          if ((On(O), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function ba(
        e,
        t,
        r,
        n,
        o,
        i,
        a,
        s,
        c,
        _,
        u,
        l,
        f,
        m,
        d,
        h,
        p,
        w,
        g,
        y,
        b,
        v,
        E,
        S,
        A,
        k,
        N,
        O,
      ) {
        var x = Nn();
        try {
          Re(e)(
            t,
            r,
            n,
            o,
            i,
            a,
            s,
            c,
            _,
            u,
            l,
            f,
            m,
            d,
            h,
            p,
            w,
            g,
            y,
            b,
            v,
            E,
            S,
            A,
            k,
            N,
            O,
          );
        } catch (e) {
          if ((On(x), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function va(
        e,
        t,
        r,
        n,
        o,
        i,
        a,
        s,
        c,
        _,
        u,
        l,
        f,
        m,
        d,
        h,
        p,
        w,
        g,
        y,
        b,
        v,
        E,
        S,
        A,
        k,
        N,
        O,
        x,
      ) {
        var j = Nn();
        try {
          Re(e)(
            t,
            r,
            n,
            o,
            i,
            a,
            s,
            c,
            _,
            u,
            l,
            f,
            m,
            d,
            h,
            p,
            w,
            g,
            y,
            b,
            v,
            E,
            S,
            A,
            k,
            N,
            O,
            x,
          );
        } catch (e) {
          if ((On(j), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function Ea(
        e,
        t,
        r,
        n,
        o,
        i,
        a,
        s,
        c,
        _,
        u,
        l,
        f,
        m,
        d,
        h,
        p,
        w,
        g,
        y,
        b,
        v,
        E,
        S,
        A,
        k,
        N,
        O,
        x,
        j,
      ) {
        var T = Nn();
        try {
          Re(e)(
            t,
            r,
            n,
            o,
            i,
            a,
            s,
            c,
            _,
            u,
            l,
            f,
            m,
            d,
            h,
            p,
            w,
            g,
            y,
            b,
            v,
            E,
            S,
            A,
            k,
            N,
            O,
            x,
            j,
          );
        } catch (e) {
          if ((On(T), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function Sa(
        e,
        t,
        r,
        n,
        o,
        i,
        a,
        s,
        c,
        _,
        u,
        l,
        f,
        m,
        d,
        h,
        p,
        w,
        g,
        y,
        b,
        v,
        E,
        S,
        A,
        k,
        N,
        O,
        x,
        j,
        T,
      ) {
        var D = Nn();
        try {
          Re(e)(
            t,
            r,
            n,
            o,
            i,
            a,
            s,
            c,
            _,
            u,
            l,
            f,
            m,
            d,
            h,
            p,
            w,
            g,
            y,
            b,
            v,
            E,
            S,
            A,
            k,
            N,
            O,
            x,
            j,
            T,
          );
        } catch (e) {
          if ((On(D), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function Aa(
        e,
        t,
        r,
        n,
        o,
        i,
        a,
        s,
        c,
        _,
        u,
        l,
        f,
        m,
        d,
        h,
        p,
        w,
        g,
        y,
        b,
        v,
        E,
        S,
        A,
        k,
        N,
        O,
        x,
        j,
        T,
        D,
      ) {
        var M = Nn();
        try {
          Re(e)(
            t,
            r,
            n,
            o,
            i,
            a,
            s,
            c,
            _,
            u,
            l,
            f,
            m,
            d,
            h,
            p,
            w,
            g,
            y,
            b,
            v,
            E,
            S,
            A,
            k,
            N,
            O,
            x,
            j,
            T,
            D,
          );
        } catch (e) {
          if ((On(M), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function ka(
        e,
        t,
        r,
        n,
        o,
        i,
        a,
        s,
        c,
        _,
        u,
        l,
        f,
        m,
        d,
        h,
        p,
        w,
        g,
        y,
        b,
        v,
        E,
        S,
        A,
        k,
        N,
        O,
        x,
        j,
        T,
        D,
        M,
      ) {
        var R = Nn();
        try {
          Re(e)(
            t,
            r,
            n,
            o,
            i,
            a,
            s,
            c,
            _,
            u,
            l,
            f,
            m,
            d,
            h,
            p,
            w,
            g,
            y,
            b,
            v,
            E,
            S,
            A,
            k,
            N,
            O,
            x,
            j,
            T,
            D,
            M,
          );
        } catch (e) {
          if ((On(R), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function Na(
        e,
        t,
        r,
        n,
        o,
        i,
        a,
        s,
        c,
        _,
        u,
        l,
        f,
        m,
        d,
        h,
        p,
        w,
        g,
        y,
        b,
        v,
        E,
        S,
        A,
        k,
        N,
        O,
        x,
        j,
        T,
        D,
        M,
        R,
      ) {
        var P = Nn();
        try {
          Re(e)(
            t,
            r,
            n,
            o,
            i,
            a,
            s,
            c,
            _,
            u,
            l,
            f,
            m,
            d,
            h,
            p,
            w,
            g,
            y,
            b,
            v,
            E,
            S,
            A,
            k,
            N,
            O,
            x,
            j,
            T,
            D,
            M,
            R,
          );
        } catch (e) {
          if ((On(P), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function Oa(
        e,
        t,
        r,
        n,
        o,
        i,
        a,
        s,
        c,
        _,
        u,
        l,
        f,
        m,
        d,
        h,
        p,
        w,
        g,
        y,
        b,
        v,
        E,
        S,
        A,
        k,
        N,
        O,
        x,
        j,
        T,
        D,
        M,
        R,
        P,
      ) {
        var C = Nn();
        try {
          Re(e)(
            t,
            r,
            n,
            o,
            i,
            a,
            s,
            c,
            _,
            u,
            l,
            f,
            m,
            d,
            h,
            p,
            w,
            g,
            y,
            b,
            v,
            E,
            S,
            A,
            k,
            N,
            O,
            x,
            j,
            T,
            D,
            M,
            R,
            P,
          );
        } catch (e) {
          if ((On(C), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function xa(
        e,
        t,
        r,
        n,
        o,
        i,
        a,
        s,
        c,
        _,
        u,
        l,
        f,
        m,
        d,
        h,
        p,
        w,
        g,
        y,
        b,
        v,
        E,
        S,
        A,
        k,
        N,
        O,
        x,
        j,
        T,
        D,
        M,
        R,
        P,
        C,
      ) {
        var I = Nn();
        try {
          Re(e)(
            t,
            r,
            n,
            o,
            i,
            a,
            s,
            c,
            _,
            u,
            l,
            f,
            m,
            d,
            h,
            p,
            w,
            g,
            y,
            b,
            v,
            E,
            S,
            A,
            k,
            N,
            O,
            x,
            j,
            T,
            D,
            M,
            R,
            P,
            C,
          );
        } catch (e) {
          if ((On(I), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function ja(
        e,
        t,
        r,
        n,
        o,
        i,
        a,
        s,
        c,
        _,
        u,
        l,
        f,
        m,
        d,
        h,
        p,
        w,
        g,
        y,
        b,
        v,
        E,
        S,
        A,
        k,
        N,
        O,
        x,
        j,
        T,
        D,
        M,
        R,
        P,
        C,
        I,
      ) {
        var F = Nn();
        try {
          Re(e)(
            t,
            r,
            n,
            o,
            i,
            a,
            s,
            c,
            _,
            u,
            l,
            f,
            m,
            d,
            h,
            p,
            w,
            g,
            y,
            b,
            v,
            E,
            S,
            A,
            k,
            N,
            O,
            x,
            j,
            T,
            D,
            M,
            R,
            P,
            C,
            I,
          );
        } catch (e) {
          if ((On(F), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function Ta(
        e,
        t,
        r,
        n,
        o,
        i,
        a,
        s,
        c,
        _,
        u,
        l,
        f,
        m,
        d,
        h,
        p,
        w,
        g,
        y,
        b,
        v,
        E,
        S,
        A,
        k,
        N,
        O,
        x,
        j,
        T,
        D,
        M,
        R,
        P,
        C,
        I,
        F,
      ) {
        var $ = Nn();
        try {
          Re(e)(
            t,
            r,
            n,
            o,
            i,
            a,
            s,
            c,
            _,
            u,
            l,
            f,
            m,
            d,
            h,
            p,
            w,
            g,
            y,
            b,
            v,
            E,
            S,
            A,
            k,
            N,
            O,
            x,
            j,
            T,
            D,
            M,
            R,
            P,
            C,
            I,
            F,
          );
        } catch (e) {
          if ((On($), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function Da(
        e,
        t,
        r,
        n,
        o,
        i,
        a,
        s,
        c,
        _,
        u,
        l,
        f,
        m,
        d,
        h,
        p,
        w,
        g,
        y,
        b,
        v,
        E,
        S,
        A,
        k,
        N,
        O,
        x,
        j,
        T,
        D,
        M,
        R,
        P,
        C,
        I,
        F,
        $,
      ) {
        var U = Nn();
        try {
          Re(e)(
            t,
            r,
            n,
            o,
            i,
            a,
            s,
            c,
            _,
            u,
            l,
            f,
            m,
            d,
            h,
            p,
            w,
            g,
            y,
            b,
            v,
            E,
            S,
            A,
            k,
            N,
            O,
            x,
            j,
            T,
            D,
            M,
            R,
            P,
            C,
            I,
            F,
            $,
          );
        } catch (e) {
          if ((On(U), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function Ma(
        e,
        t,
        r,
        n,
        o,
        i,
        a,
        s,
        c,
        _,
        u,
        l,
        f,
        m,
        d,
        h,
        p,
        w,
        g,
        y,
        b,
        v,
        E,
        S,
        A,
        k,
        N,
        O,
        x,
        j,
        T,
        D,
        M,
        R,
        P,
        C,
        I,
        F,
        $,
        U,
      ) {
        var B = Nn();
        try {
          Re(e)(
            t,
            r,
            n,
            o,
            i,
            a,
            s,
            c,
            _,
            u,
            l,
            f,
            m,
            d,
            h,
            p,
            w,
            g,
            y,
            b,
            v,
            E,
            S,
            A,
            k,
            N,
            O,
            x,
            j,
            T,
            D,
            M,
            R,
            P,
            C,
            I,
            F,
            $,
            U,
          );
        } catch (e) {
          if ((On(B), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function Ra(
        e,
        t,
        r,
        n,
        o,
        i,
        a,
        s,
        c,
        _,
        u,
        l,
        f,
        m,
        d,
        h,
        p,
        w,
        g,
        y,
        b,
        v,
        E,
        S,
        A,
        k,
        N,
        O,
        x,
        j,
        T,
        D,
        M,
        R,
        P,
        C,
        I,
        F,
        $,
        U,
        B,
      ) {
        var W = Nn();
        try {
          Re(e)(
            t,
            r,
            n,
            o,
            i,
            a,
            s,
            c,
            _,
            u,
            l,
            f,
            m,
            d,
            h,
            p,
            w,
            g,
            y,
            b,
            v,
            E,
            S,
            A,
            k,
            N,
            O,
            x,
            j,
            T,
            D,
            M,
            R,
            P,
            C,
            I,
            F,
            $,
            U,
            B,
          );
        } catch (e) {
          if ((On(W), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function Pa(
        e,
        t,
        r,
        n,
        o,
        i,
        a,
        s,
        c,
        _,
        u,
        l,
        f,
        m,
        d,
        h,
        p,
        w,
        g,
        y,
        b,
        v,
        E,
        S,
        A,
        k,
        N,
        O,
        x,
        j,
        T,
        D,
        M,
        R,
        P,
        C,
        I,
        F,
        $,
        U,
        B,
        W,
      ) {
        var z = Nn();
        try {
          Re(e)(
            t,
            r,
            n,
            o,
            i,
            a,
            s,
            c,
            _,
            u,
            l,
            f,
            m,
            d,
            h,
            p,
            w,
            g,
            y,
            b,
            v,
            E,
            S,
            A,
            k,
            N,
            O,
            x,
            j,
            T,
            D,
            M,
            R,
            P,
            C,
            I,
            F,
            $,
            U,
            B,
            W,
          );
        } catch (e) {
          if ((On(z), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function Ca(
        e,
        t,
        r,
        n,
        o,
        i,
        a,
        s,
        c,
        _,
        u,
        l,
        f,
        m,
        d,
        h,
        p,
        w,
        g,
        y,
        b,
        v,
        E,
        S,
        A,
        k,
        N,
        O,
        x,
        j,
        T,
        D,
        M,
        R,
        P,
        C,
        I,
        F,
        $,
        U,
        B,
        W,
        z,
      ) {
        var L = Nn();
        try {
          Re(e)(
            t,
            r,
            n,
            o,
            i,
            a,
            s,
            c,
            _,
            u,
            l,
            f,
            m,
            d,
            h,
            p,
            w,
            g,
            y,
            b,
            v,
            E,
            S,
            A,
            k,
            N,
            O,
            x,
            j,
            T,
            D,
            M,
            R,
            P,
            C,
            I,
            F,
            $,
            U,
            B,
            W,
            z,
          );
        } catch (e) {
          if ((On(L), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function Ia(e, t, r, n) {
        var o = Nn();
        try {
          Re(e)(t, r, n);
        } catch (e) {
          if ((On(o), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function Fa(e, t, r, n, o, i, a, s) {
        var c = Nn();
        try {
          return Re(e)(t, r, n, o, i, a, s);
        } catch (e) {
          if ((On(c), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function $a(e, t, r, n, o, i, a) {
        var s = Nn();
        try {
          return Re(e)(t, r, n, o, i, a);
        } catch (e) {
          if ((On(s), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function Ua(e, t, r, n, o, i) {
        var a = Nn();
        try {
          return Re(e)(t, r, n, o, i);
        } catch (e) {
          if ((On(a), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function Ba(e, t, r, n) {
        var o = Nn();
        try {
          Re(e)(t, r, n);
        } catch (e) {
          if ((On(o), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function Wa(e, t, r, n, o, i) {
        var a = Nn();
        try {
          return Pn(e, t, r, n, o, i);
        } catch (e) {
          if ((On(a), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function za(e, t, r) {
        var n = Nn();
        try {
          return Mn(e, t, r);
        } catch (e) {
          if ((On(n), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function La(e, t, r, n, o) {
        var i = Nn();
        try {
          Rn(e, t, r, n, o);
        } catch (e) {
          if ((On(i), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function Ha(e, t, r, n) {
        var o = Nn();
        try {
          return Fn(e, t, r, n);
        } catch (e) {
          if ((On(o), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function Va(e, t, r, n, o, i) {
        var a = Nn();
        try {
          zn(e, t, r, n, o, i);
        } catch (e) {
          if ((On(a), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function qa(e, t, r, n, o, i) {
        var a = Nn();
        try {
          $n(e, t, r, n, o, i);
        } catch (e) {
          if ((On(a), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function Ga(e, t, r, n, o) {
        var i = Nn();
        try {
          return Ln(e, t, r, n, o);
        } catch (e) {
          if ((On(i), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function Ja(e, t, r, n, o, i) {
        var a = Nn();
        try {
          return qn(e, t, r, n, o, i);
        } catch (e) {
          if ((On(a), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function Ya(e, t, r, n, o, i, a) {
        var s = Nn();
        try {
          return Hn(e, t, r, n, o, i, a);
        } catch (e) {
          if ((On(s), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function Xa(e, t, r, n, o, i, a, s) {
        var c = Nn();
        try {
          return Wn(e, t, r, n, o, i, a, s);
        } catch (e) {
          if ((On(c), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function Za(e, t, r, n, o, i, a, s, c) {
        var _ = Nn();
        try {
          return Jn(e, t, r, n, o, i, a, s, c);
        } catch (e) {
          if ((On(_), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function Ka(e, t, r, n, o, i, a) {
        var s = Nn();
        try {
          return In(e, t, r, n, o, i, a);
        } catch (e) {
          if ((On(s), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function Qa(e, t, r, n, o, i) {
        var a = Nn();
        try {
          return Vn(e, t, r, n, o, i);
        } catch (e) {
          if ((On(a), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function es(e, t, r, n, o, i, a, s, c) {
        var _ = Nn();
        try {
          Xn(e, t, r, n, o, i, a, s, c);
        } catch (e) {
          if ((On(_), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function ts(e, t) {
        var r = Nn();
        try {
          return Kn(e, t);
        } catch (e) {
          if ((On(r), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function rs(e, t, r, n, o, i, a) {
        var s = Nn();
        try {
          Bn(e, t, r, n, o, i, a);
        } catch (e) {
          if ((On(s), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function ns(e, t, r, n, o) {
        var i = Nn();
        try {
          return Un(e, t, r, n, o);
        } catch (e) {
          if ((On(i), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function os(e, t, r, n, o, i) {
        var a = Nn();
        try {
          return Yn(e, t, r, n, o, i);
        } catch (e) {
          if ((On(a), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function is(e, t, r, n) {
        var o = Nn();
        try {
          return Dn(e, t, r, n);
        } catch (e) {
          if ((On(o), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function as(e, t, r, n) {
        var o = Nn();
        try {
          return Qn(e, t, r, n);
        } catch (e) {
          if ((On(o), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function ss(e, t, r, n, o, i) {
        var a = Nn();
        try {
          to(e, t, r, n, o, i);
        } catch (e) {
          if ((On(a), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function cs(e, t, r, n, o) {
        var i = Nn();
        try {
          return Gn(e, t, r, n, o);
        } catch (e) {
          if ((On(i), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function _s(e, t, r, n, o, i, a, s, c, _, u, l) {
        var f = Nn();
        try {
          return oo(e, t, r, n, o, i, a, s, c, _, u, l);
        } catch (e) {
          if ((On(f), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function us(e, t, r, n, o, i, a, s, c) {
        var _ = Nn();
        try {
          return ro(e, t, r, n, o, i, a, s, c);
        } catch (e) {
          if ((On(_), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function ls(e, t, r, n, o, i, a, s) {
        var c = Nn();
        try {
          return Zn(e, t, r, n, o, i, a, s);
        } catch (e) {
          if ((On(c), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function fs(e, t, r, n, o, i, a, s) {
        var c = Nn();
        try {
          no(e, t, r, n, o, i, a, s);
        } catch (e) {
          if ((On(c), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function ms(e, t) {
        var r = Nn();
        try {
          return Cn(e, t);
        } catch (e) {
          if ((On(r), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function ds(e, t, r, n) {
        var o = Nn();
        try {
          return io(e, t, r, n);
        } catch (e) {
          if ((On(o), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function hs(e, t, r, n, o, i, a) {
        var s = Nn();
        try {
          eo(e, t, r, n, o, i, a);
        } catch (e) {
          if ((On(s), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function ps(e) {
        var t = Nn();
        try {
          return ao(e);
        } catch (e) {
          if ((On(t), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function ws(e, t, r, n, o, i, a) {
        var s = Nn();
        try {
          return so(e, t, r, n, o, i, a);
        } catch (e) {
          if ((On(s), e !== e + 0)) throw e;
          kn(1, 0);
        }
      }
      function gs(e) {
        (this.name = "ExitStatus"),
          (this.message = "Program terminated with exit(" + e + ")"),
          (this.status = e);
      }
      function ys(e) {
        function t() {
          wn ||
            ((wn = !0),
            (o.calledRun = !0),
            R ||
              (_e(),
              r(o),
              o.onRuntimeInitialized && o.onRuntimeInitialized(),
              ue()));
        }
        (e = e || h),
          de > 0 ||
            (ce(),
            de > 0 ||
              (o.setStatus
                ? (o.setStatus("Running..."),
                  setTimeout(function () {
                    setTimeout(function () {
                      o.setStatus("");
                    }, 1),
                      t();
                  }, 1))
                : t()));
      }
      function bs(e, t) {
        e, vs(e);
      }
      function vs(e) {
        e, se() || (o.onExit && o.onExit(e), (R = !0)), w(e, new gs(e));
      }
      if (
        ((o.ccall = I),
        (o.cwrap = F),
        (o.UTF8ArrayToString = J),
        (o.UTF8ToString = Y),
        (o.addRunDependency = we),
        (o.removeRunDependency = ge),
        (o.FS_createPath = ct.createPath),
        (o.FS_createDataFile = ct.createDataFile),
        (o.FS_createPreloadedFile = ct.createPreloadedFile),
        (o.FS_createLazyFile = ct.createLazyFile),
        (o.FS_createDevice = ct.createDevice),
        (o.FS_unlink = ct.unlink),
        (o.print = k),
        (o.setValue = Pe),
        (o.getValue = De),
        (o.FS = ct),
        (pe = function e() {
          wn || ys(), wn || (pe = e);
        }),
        (o.run = ys),
        o.preInit)
      )
        for (
          "function" == typeof o.preInit && (o.preInit = [o.preInit]);
          o.preInit.length > 0;

        )
          o.preInit.pop()();
      return ys(), (t.ready = t.ready.then(() => dn)), t.ready;
    };
  })();
export default createDotnetRuntime;
const MONO = {},
  BINDING = {},
  INTERNAL = {},
  IMPORTS = {};
var ENVIRONMENT_IS_WEB = "object" == typeof window,
  ENVIRONMENT_IS_WORKER = "function" == typeof importScripts,
  ENVIRONMENT_IS_NODE =
    "object" == typeof process &&
    "object" == typeof process.versions &&
    "string" == typeof process.versions.node,
  ENVIRONMENT_IS_SHELL =
    !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;
__dotnet_runtime.__setEmscriptenEntrypoint(createDotnetRuntime, {
  isNode: ENVIRONMENT_IS_NODE,
  isShell: ENVIRONMENT_IS_SHELL,
  isWeb: ENVIRONMENT_IS_WEB,
  isWorker: ENVIRONMENT_IS_WORKER,
});
const dotnet = __dotnet_runtime.moduleExports.dotnet,
  exit = __dotnet_runtime.moduleExports.exit;
export { dotnet, exit, INTERNAL };
