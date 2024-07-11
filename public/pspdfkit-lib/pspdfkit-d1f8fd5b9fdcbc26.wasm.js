/*!
 * PSPDFKit for Web 2023.5.4 (https://pspdfkit.com/web)
 *
 * Copyright (c) 2016-2023 PSPDFKit GmbH. All rights reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 *
 * PSPDFKit uses several open source third-party components: https://pspdfkit.com/acknowledgements/web/
 */
var PSPDFModuleInit = (() => {
  var _scriptDir =
    "undefined" != typeof document && document.currentScript
      ? document.currentScript.src
      : void 0;
  return (
    "undefined" != typeof __filename && (_scriptDir = _scriptDir || __filename),
    function (moduleArg = {}) {
      var Module = moduleArg,
        readyPromiseResolve,
        readyPromiseReject;
      Module.ready = new Promise((e, r) => {
        (readyPromiseResolve = e), (readyPromiseReject = r);
      });
      var moduleOverrides = Object.assign({}, Module),
        arguments_ = [],
        thisProgram = "./this.program",
        quit_ = (e, r) => {
          throw r;
        },
        ENVIRONMENT_IS_WEB = "object" == typeof window,
        ENVIRONMENT_IS_WORKER = "function" == typeof importScripts,
        ENVIRONMENT_IS_NODE =
          "object" == typeof process &&
          "object" == typeof process.versions &&
          "string" == typeof process.versions.node,
        scriptDirectory = "",
        read_,
        readAsync,
        readBinary;
      function locateFile(e) {
        return Module.locateFile
          ? Module.locateFile(e, scriptDirectory)
          : scriptDirectory + e;
      }
      if (ENVIRONMENT_IS_NODE) {
        var fs = require("fs"),
          nodePath = require("path");
        (scriptDirectory = ENVIRONMENT_IS_WORKER
          ? nodePath.dirname(scriptDirectory) + "/"
          : __dirname + "/"),
          (read_ = (e, r) => (
            (e = isFileURI(e) ? new URL(e) : nodePath.normalize(e)),
            fs.readFileSync(e, r ? void 0 : "utf8")
          )),
          (readBinary = (e) => {
            var r = read_(e, !0);
            return r.buffer || (r = new Uint8Array(r)), r;
          }),
          (readAsync = (e, r, t, n = !0) => {
            (e = isFileURI(e) ? new URL(e) : nodePath.normalize(e)),
              fs.readFile(e, n ? void 0 : "utf8", (e, o) => {
                e ? t(e) : r(n ? o.buffer : o);
              });
          }),
          !Module.thisProgram &&
            process.argv.length > 1 &&
            (thisProgram = process.argv[1].replace(/\\/g, "/")),
          (arguments_ = process.argv.slice(2)),
          (quit_ = (e, r) => {
            throw ((process.exitCode = e), r);
          }),
          (Module.inspect = () => "[Emscripten Module object]");
      } else
        (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) &&
          (ENVIRONMENT_IS_WORKER
            ? (scriptDirectory = self.location.href)
            : "undefined" != typeof document &&
              document.currentScript &&
              (scriptDirectory = document.currentScript.src),
          _scriptDir && (scriptDirectory = _scriptDir),
          (scriptDirectory =
            0 !== scriptDirectory.indexOf("blob:")
              ? scriptDirectory.substr(
                  0,
                  scriptDirectory.replace(/[?#].*/, "").lastIndexOf("/") + 1,
                )
              : ""),
          (read_ = (e) => {
            var r = new XMLHttpRequest();
            return r.open("GET", e, !1), r.send(null), r.responseText;
          }),
          ENVIRONMENT_IS_WORKER &&
            (readBinary = (e) => {
              var r = new XMLHttpRequest();
              return (
                r.open("GET", e, !1),
                (r.responseType = "arraybuffer"),
                r.send(null),
                new Uint8Array(r.response)
              );
            }),
          (readAsync = (e, r, t) => {
            var n = new XMLHttpRequest();
            n.open("GET", e, !0),
              (n.responseType = "arraybuffer"),
              (n.onload = () => {
                200 == n.status || (0 == n.status && n.response)
                  ? r(n.response)
                  : t();
              }),
              (n.onerror = t),
              n.send(null);
          }));
      var out = Module.print || console.log.bind(console),
        err = Module.printErr || console.error.bind(console),
        wasmBinary;
      Object.assign(Module, moduleOverrides),
        (moduleOverrides = null),
        Module.arguments && (arguments_ = Module.arguments),
        Module.thisProgram && (thisProgram = Module.thisProgram),
        Module.quit && (quit_ = Module.quit),
        Module.wasmBinary && (wasmBinary = Module.wasmBinary);
      var noExitRuntime = Module.noExitRuntime || !0,
        wasmMemory;
      "object" != typeof WebAssembly &&
        abort("no native wasm support detected");
      var ABORT = !1,
        EXITSTATUS,
        HEAP8,
        HEAPU8,
        HEAP16,
        HEAPU16,
        HEAP32,
        HEAPU32,
        HEAPF32,
        HEAPF64;
      function assert(e, r) {
        e || abort(r);
      }
      function updateMemoryViews() {
        var e = wasmMemory.buffer;
        (Module.HEAP8 = HEAP8 = new Int8Array(e)),
          (Module.HEAP16 = HEAP16 = new Int16Array(e)),
          (Module.HEAPU8 = HEAPU8 = new Uint8Array(e)),
          (Module.HEAPU16 = HEAPU16 = new Uint16Array(e)),
          (Module.HEAP32 = HEAP32 = new Int32Array(e)),
          (Module.HEAPU32 = HEAPU32 = new Uint32Array(e)),
          (Module.HEAPF32 = HEAPF32 = new Float32Array(e)),
          (Module.HEAPF64 = HEAPF64 = new Float64Array(e));
      }
      var __ATPRERUN__ = [],
        __ATINIT__ = [],
        __ATPOSTRUN__ = [],
        runtimeInitialized = !1;
      function preRun() {
        if (Module.preRun)
          for (
            "function" == typeof Module.preRun &&
            (Module.preRun = [Module.preRun]);
            Module.preRun.length;

          )
            addOnPreRun(Module.preRun.shift());
        callRuntimeCallbacks(__ATPRERUN__);
      }
      function initRuntime() {
        (runtimeInitialized = !0),
          Module.noFSInit || FS.init.initialized || FS.init(),
          (FS.ignorePermissions = !1),
          TTY.init(),
          callRuntimeCallbacks(__ATINIT__);
      }
      function postRun() {
        if (Module.postRun)
          for (
            "function" == typeof Module.postRun &&
            (Module.postRun = [Module.postRun]);
            Module.postRun.length;

          )
            addOnPostRun(Module.postRun.shift());
        callRuntimeCallbacks(__ATPOSTRUN__);
      }
      function addOnPreRun(e) {
        __ATPRERUN__.unshift(e);
      }
      function addOnInit(e) {
        __ATINIT__.unshift(e);
      }
      function addOnPostRun(e) {
        __ATPOSTRUN__.unshift(e);
      }
      var runDependencies = 0,
        runDependencyWatcher = null,
        dependenciesFulfilled = null;
      function getUniqueRunDependency(e) {
        return e;
      }
      function addRunDependency(e) {
        runDependencies++,
          Module.monitorRunDependencies &&
            Module.monitorRunDependencies(runDependencies);
      }
      function removeRunDependency(e) {
        if (
          (runDependencies--,
          Module.monitorRunDependencies &&
            Module.monitorRunDependencies(runDependencies),
          0 == runDependencies &&
            (null !== runDependencyWatcher &&
              (clearInterval(runDependencyWatcher),
              (runDependencyWatcher = null)),
            dependenciesFulfilled))
        ) {
          var r = dependenciesFulfilled;
          (dependenciesFulfilled = null), r();
        }
      }
      function abort(e) {
        Module.onAbort && Module.onAbort(e),
          err((e = "Aborted(" + e + ")")),
          (ABORT = !0),
          (EXITSTATUS = 1),
          (e += ". Build with -sASSERTIONS for more info."),
          runtimeInitialized && ___trap();
        var r = new WebAssembly.RuntimeError(e);
        throw (readyPromiseReject(r), r);
      }
      var dataURIPrefix = "data:application/octet-stream;base64,",
        wasmBinaryFile,
        tempDouble,
        tempI64;
      function isDataURI(e) {
        return e.startsWith(dataURIPrefix);
      }
      function isFileURI(e) {
        return e.startsWith("file://");
      }
      function getBinarySync(e) {
        if (e == wasmBinaryFile && wasmBinary)
          return new Uint8Array(wasmBinary);
        if (readBinary) return readBinary(e);
        throw "both async and sync fetching of the wasm failed";
      }
      function getBinaryPromise(e) {
        if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER)) {
          if ("function" == typeof fetch && !isFileURI(e))
            return fetch(e, { credentials: "same-origin" })
              .then((r) => {
                if (!r.ok)
                  throw "failed to load wasm binary file at '" + e + "'";
                return r.arrayBuffer();
              })
              .catch(() => getBinarySync(e));
          if (readAsync)
            return new Promise((r, t) => {
              readAsync(e, (e) => r(new Uint8Array(e)), t);
            });
        }
        return Promise.resolve().then(() => getBinarySync(e));
      }
      function instantiateArrayBuffer(e, r, t) {
        return getBinaryPromise(e)
          .then((e) => WebAssembly.instantiate(e, r))
          .then((e) => e)
          .then(t, (e) => {
            err(`failed to asynchronously prepare wasm: ${e}`), abort(e);
          });
      }
      function instantiateAsync(e, r, t, n) {
        return e ||
          "function" != typeof WebAssembly.instantiateStreaming ||
          isDataURI(r) ||
          isFileURI(r) ||
          ENVIRONMENT_IS_NODE ||
          "function" != typeof fetch
          ? instantiateArrayBuffer(r, t, n)
          : fetch(r, { credentials: "same-origin" }).then((e) =>
              WebAssembly.instantiateStreaming(e, t).then(n, function (e) {
                return (
                  err(`wasm streaming compile failed: ${e}`),
                  err("falling back to ArrayBuffer instantiation"),
                  instantiateArrayBuffer(r, t, n)
                );
              }),
            );
      }
      function createWasm() {
        var e = { a: wasmImports };
        function r(e, r) {
          return (
            (wasmExports = e.exports),
            (wasmMemory = wasmExports.va),
            updateMemoryViews(),
            (wasmTable = wasmExports.Ca),
            addOnInit(wasmExports.wa),
            removeRunDependency("wasm-instantiate"),
            wasmExports
          );
        }
        if ((addRunDependency("wasm-instantiate"), Module.instantiateWasm))
          try {
            return Module.instantiateWasm(e, r);
          } catch (e) {
            err(`Module.instantiateWasm callback failed with error: ${e}`),
              readyPromiseReject(e);
          }
        return (
          instantiateAsync(wasmBinary, wasmBinaryFile, e, function (e) {
            r(e.instance);
          }).catch(readyPromiseReject),
          {}
        );
      }
      (wasmBinaryFile = "pspdfkit.wasm.wasm"),
        isDataURI(wasmBinaryFile) ||
          (wasmBinaryFile = locateFile(wasmBinaryFile));
      var ASM_CONSTS = {
          3038280: () =>
            !!(
              "undefined" != typeof window &&
              window &&
              window.process &&
              window.process.type
            ) ||
            ("object" == typeof navigator &&
              "string" == typeof navigator.userAgent &&
              navigator.userAgent.indexOf("Electron/") >= 0),
          3038540: (e, r) => {
            setTimeout(function () {
              console.error(UTF8ToString(e));
            }, r);
          },
          3038607: (e) => {
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
          3039003: () => {
            if (
              "undefined" != typeof self &&
              void 0 !== self.crypto &&
              void 0 !== self.crypto.getRandomValues
            ) {
              var e = new Uint32Array(1);
              return self.crypto.getRandomValues(e), e[0];
            }
            return Math.round(255 * Math.random());
          },
        },
        callRuntimeCallbacks = (e) => {
          for (; e.length > 0; ) e.shift()(Module);
        },
        PATH = {
          isAbs: (e) => "/" === e.charAt(0),
          splitPath: (e) =>
            /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/
              .exec(e)
              .slice(1),
          normalizeArray: (e, r) => {
            for (var t = 0, n = e.length - 1; n >= 0; n--) {
              var o = e[n];
              "." === o
                ? e.splice(n, 1)
                : ".." === o
                ? (e.splice(n, 1), t++)
                : t && (e.splice(n, 1), t--);
            }
            if (r) for (; t; t--) e.unshift("..");
            return e;
          },
          normalize: (e) => {
            var r = PATH.isAbs(e),
              t = "/" === e.substr(-1);
            return (
              (e = PATH.normalizeArray(
                e.split("/").filter((e) => !!e),
                !r,
              ).join("/")) ||
                r ||
                (e = "."),
              e && t && (e += "/"),
              (r ? "/" : "") + e
            );
          },
          dirname: (e) => {
            var r = PATH.splitPath(e),
              t = r[0],
              n = r[1];
            return t || n ? (n && (n = n.substr(0, n.length - 1)), t + n) : ".";
          },
          basename: (e) => {
            if ("/" === e) return "/";
            var r = (e = (e = PATH.normalize(e)).replace(
              /\/$/,
              "",
            )).lastIndexOf("/");
            return -1 === r ? e : e.substr(r + 1);
          },
          join: function () {
            var e = Array.prototype.slice.call(arguments);
            return PATH.normalize(e.join("/"));
          },
          join2: (e, r) => PATH.normalize(e + "/" + r),
        },
        initRandomFill = () => {
          if (
            "object" == typeof crypto &&
            "function" == typeof crypto.getRandomValues
          )
            return (e) => crypto.getRandomValues(e);
          if (ENVIRONMENT_IS_NODE)
            try {
              var e = require("crypto");
              if (e.randomFillSync) return (r) => e.randomFillSync(r);
              var r = e.randomBytes;
              return (e) => (e.set(r(e.byteLength)), e);
            } catch (e) {}
          abort("initRandomDevice");
        },
        randomFill = (e) => (randomFill = initRandomFill())(e),
        PATH_FS = {
          resolve: function () {
            for (
              var e = "", r = !1, t = arguments.length - 1;
              t >= -1 && !r;
              t--
            ) {
              var n = t >= 0 ? arguments[t] : FS.cwd();
              if ("string" != typeof n)
                throw new TypeError(
                  "Arguments to path.resolve must be strings",
                );
              if (!n) return "";
              (e = n + "/" + e), (r = PATH.isAbs(n));
            }
            return (
              (r ? "/" : "") +
                (e = PATH.normalizeArray(
                  e.split("/").filter((e) => !!e),
                  !r,
                ).join("/")) || "."
            );
          },
          relative: (e, r) => {
            function t(e) {
              for (var r = 0; r < e.length && "" === e[r]; r++);
              for (var t = e.length - 1; t >= 0 && "" === e[t]; t--);
              return r > t ? [] : e.slice(r, t - r + 1);
            }
            (e = PATH_FS.resolve(e).substr(1)),
              (r = PATH_FS.resolve(r).substr(1));
            for (
              var n = t(e.split("/")),
                o = t(r.split("/")),
                a = Math.min(n.length, o.length),
                i = a,
                s = 0;
              s < a;
              s++
            )
              if (n[s] !== o[s]) {
                i = s;
                break;
              }
            var l = [];
            for (s = i; s < n.length; s++) l.push("..");
            return (l = l.concat(o.slice(i))).join("/");
          },
        },
        UTF8Decoder =
          "undefined" != typeof TextDecoder ? new TextDecoder("utf8") : void 0,
        UTF8ArrayToString = (e, r, t) => {
          for (var n = r + t, o = r; e[o] && !(o >= n); ) ++o;
          if (o - r > 16 && e.buffer && UTF8Decoder)
            return UTF8Decoder.decode(e.subarray(r, o));
          for (var a = ""; r < o; ) {
            var i = e[r++];
            if (128 & i) {
              var s = 63 & e[r++];
              if (192 != (224 & i)) {
                var l = 63 & e[r++];
                if (
                  (i =
                    224 == (240 & i)
                      ? ((15 & i) << 12) | (s << 6) | l
                      : ((7 & i) << 18) |
                        (s << 12) |
                        (l << 6) |
                        (63 & e[r++])) < 65536
                )
                  a += String.fromCharCode(i);
                else {
                  var d = i - 65536;
                  a += String.fromCharCode(
                    55296 | (d >> 10),
                    56320 | (1023 & d),
                  );
                }
              } else a += String.fromCharCode(((31 & i) << 6) | s);
            } else a += String.fromCharCode(i);
          }
          return a;
        },
        FS_stdin_getChar_buffer = [],
        lengthBytesUTF8 = (e) => {
          for (var r = 0, t = 0; t < e.length; ++t) {
            var n = e.charCodeAt(t);
            n <= 127
              ? r++
              : n <= 2047
              ? (r += 2)
              : n >= 55296 && n <= 57343
              ? ((r += 4), ++t)
              : (r += 3);
          }
          return r;
        },
        stringToUTF8Array = (e, r, t, n) => {
          if (!(n > 0)) return 0;
          for (var o = t, a = t + n - 1, i = 0; i < e.length; ++i) {
            var s = e.charCodeAt(i);
            if (s >= 55296 && s <= 57343)
              s = (65536 + ((1023 & s) << 10)) | (1023 & e.charCodeAt(++i));
            if (s <= 127) {
              if (t >= a) break;
              r[t++] = s;
            } else if (s <= 2047) {
              if (t + 1 >= a) break;
              (r[t++] = 192 | (s >> 6)), (r[t++] = 128 | (63 & s));
            } else if (s <= 65535) {
              if (t + 2 >= a) break;
              (r[t++] = 224 | (s >> 12)),
                (r[t++] = 128 | ((s >> 6) & 63)),
                (r[t++] = 128 | (63 & s));
            } else {
              if (t + 3 >= a) break;
              (r[t++] = 240 | (s >> 18)),
                (r[t++] = 128 | ((s >> 12) & 63)),
                (r[t++] = 128 | ((s >> 6) & 63)),
                (r[t++] = 128 | (63 & s));
            }
          }
          return (r[t] = 0), t - o;
        };
      function intArrayFromString(e, r, t) {
        var n = t > 0 ? t : lengthBytesUTF8(e) + 1,
          o = new Array(n),
          a = stringToUTF8Array(e, o, 0, o.length);
        return r && (o.length = a), o;
      }
      var FS_stdin_getChar = () => {
          if (!FS_stdin_getChar_buffer.length) {
            var e = null;
            if (ENVIRONMENT_IS_NODE) {
              var r = Buffer.alloc(256),
                t = 0,
                n = process.stdin.fd;
              try {
                t = fs.readSync(n, r);
              } catch (e) {
                if (!e.toString().includes("EOF")) throw e;
                t = 0;
              }
              e = t > 0 ? r.slice(0, t).toString("utf-8") : null;
            } else
              "undefined" != typeof window && "function" == typeof window.prompt
                ? null !== (e = window.prompt("Input: ")) && (e += "\n")
                : "function" == typeof readline &&
                  null !== (e = readline()) &&
                  (e += "\n");
            if (!e) return null;
            FS_stdin_getChar_buffer = intArrayFromString(e, !0);
          }
          return FS_stdin_getChar_buffer.shift();
        },
        TTY = {
          ttys: [],
          init() {},
          shutdown() {},
          register(e, r) {
            (TTY.ttys[e] = { input: [], output: [], ops: r }),
              FS.registerDevice(e, TTY.stream_ops);
          },
          stream_ops: {
            open(e) {
              var r = TTY.ttys[e.node.rdev];
              if (!r) throw new FS.ErrnoError(43);
              (e.tty = r), (e.seekable = !1);
            },
            close(e) {
              e.tty.ops.fsync(e.tty);
            },
            fsync(e) {
              e.tty.ops.fsync(e.tty);
            },
            read(e, r, t, n, o) {
              if (!e.tty || !e.tty.ops.get_char) throw new FS.ErrnoError(60);
              for (var a = 0, i = 0; i < n; i++) {
                var s;
                try {
                  s = e.tty.ops.get_char(e.tty);
                } catch (e) {
                  throw new FS.ErrnoError(29);
                }
                if (void 0 === s && 0 === a) throw new FS.ErrnoError(6);
                if (null == s) break;
                a++, (r[t + i] = s);
              }
              return a && (e.node.timestamp = Date.now()), a;
            },
            write(e, r, t, n, o) {
              if (!e.tty || !e.tty.ops.put_char) throw new FS.ErrnoError(60);
              try {
                for (var a = 0; a < n; a++) e.tty.ops.put_char(e.tty, r[t + a]);
              } catch (e) {
                throw new FS.ErrnoError(29);
              }
              return n && (e.node.timestamp = Date.now()), a;
            },
          },
          default_tty_ops: {
            get_char: (e) => FS_stdin_getChar(),
            put_char(e, r) {
              null === r || 10 === r
                ? (out(UTF8ArrayToString(e.output, 0)), (e.output = []))
                : 0 != r && e.output.push(r);
            },
            fsync(e) {
              e.output &&
                e.output.length > 0 &&
                (out(UTF8ArrayToString(e.output, 0)), (e.output = []));
            },
            ioctl_tcgets: (e) => ({
              c_iflag: 25856,
              c_oflag: 5,
              c_cflag: 191,
              c_lflag: 35387,
              c_cc: [
                3, 28, 127, 21, 4, 0, 1, 0, 17, 19, 26, 0, 18, 15, 23, 22, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
            }),
            ioctl_tcsets: (e, r, t) => 0,
            ioctl_tiocgwinsz: (e) => [24, 80],
          },
          default_tty1_ops: {
            put_char(e, r) {
              null === r || 10 === r
                ? (err(UTF8ArrayToString(e.output, 0)), (e.output = []))
                : 0 != r && e.output.push(r);
            },
            fsync(e) {
              e.output &&
                e.output.length > 0 &&
                (err(UTF8ArrayToString(e.output, 0)), (e.output = []));
            },
          },
        },
        zeroMemory = (e, r) => (HEAPU8.fill(0, e, e + r), e),
        alignMemory = (e, r) => Math.ceil(e / r) * r,
        mmapAlloc = (e) => {
          e = alignMemory(e, 65536);
          var r = _emscripten_builtin_memalign(65536, e);
          return r ? zeroMemory(r, e) : 0;
        },
        MEMFS = {
          ops_table: null,
          mount: (e) => MEMFS.createNode(null, "/", 16895, 0),
          createNode(e, r, t, n) {
            if (FS.isBlkdev(t) || FS.isFIFO(t)) throw new FS.ErrnoError(63);
            MEMFS.ops_table ||
              (MEMFS.ops_table = {
                dir: {
                  node: {
                    getattr: MEMFS.node_ops.getattr,
                    setattr: MEMFS.node_ops.setattr,
                    lookup: MEMFS.node_ops.lookup,
                    mknod: MEMFS.node_ops.mknod,
                    rename: MEMFS.node_ops.rename,
                    unlink: MEMFS.node_ops.unlink,
                    rmdir: MEMFS.node_ops.rmdir,
                    readdir: MEMFS.node_ops.readdir,
                    symlink: MEMFS.node_ops.symlink,
                  },
                  stream: { llseek: MEMFS.stream_ops.llseek },
                },
                file: {
                  node: {
                    getattr: MEMFS.node_ops.getattr,
                    setattr: MEMFS.node_ops.setattr,
                  },
                  stream: {
                    llseek: MEMFS.stream_ops.llseek,
                    read: MEMFS.stream_ops.read,
                    write: MEMFS.stream_ops.write,
                    allocate: MEMFS.stream_ops.allocate,
                    mmap: MEMFS.stream_ops.mmap,
                    msync: MEMFS.stream_ops.msync,
                  },
                },
                link: {
                  node: {
                    getattr: MEMFS.node_ops.getattr,
                    setattr: MEMFS.node_ops.setattr,
                    readlink: MEMFS.node_ops.readlink,
                  },
                  stream: {},
                },
                chrdev: {
                  node: {
                    getattr: MEMFS.node_ops.getattr,
                    setattr: MEMFS.node_ops.setattr,
                  },
                  stream: FS.chrdev_stream_ops,
                },
              });
            var o = FS.createNode(e, r, t, n);
            return (
              FS.isDir(o.mode)
                ? ((o.node_ops = MEMFS.ops_table.dir.node),
                  (o.stream_ops = MEMFS.ops_table.dir.stream),
                  (o.contents = {}))
                : FS.isFile(o.mode)
                ? ((o.node_ops = MEMFS.ops_table.file.node),
                  (o.stream_ops = MEMFS.ops_table.file.stream),
                  (o.usedBytes = 0),
                  (o.contents = null))
                : FS.isLink(o.mode)
                ? ((o.node_ops = MEMFS.ops_table.link.node),
                  (o.stream_ops = MEMFS.ops_table.link.stream))
                : FS.isChrdev(o.mode) &&
                  ((o.node_ops = MEMFS.ops_table.chrdev.node),
                  (o.stream_ops = MEMFS.ops_table.chrdev.stream)),
              (o.timestamp = Date.now()),
              e && ((e.contents[r] = o), (e.timestamp = o.timestamp)),
              o
            );
          },
          getFileDataAsTypedArray: (e) =>
            e.contents
              ? e.contents.subarray
                ? e.contents.subarray(0, e.usedBytes)
                : new Uint8Array(e.contents)
              : new Uint8Array(0),
          expandFileStorage(e, r) {
            var t = e.contents ? e.contents.length : 0;
            if (!(t >= r)) {
              (r = Math.max(r, (t * (t < 1048576 ? 2 : 1.125)) >>> 0)),
                0 != t && (r = Math.max(r, 256));
              var n = e.contents;
              (e.contents = new Uint8Array(r)),
                e.usedBytes > 0 &&
                  e.contents.set(n.subarray(0, e.usedBytes), 0);
            }
          },
          resizeFileStorage(e, r) {
            if (e.usedBytes != r)
              if (0 == r) (e.contents = null), (e.usedBytes = 0);
              else {
                var t = e.contents;
                (e.contents = new Uint8Array(r)),
                  t && e.contents.set(t.subarray(0, Math.min(r, e.usedBytes))),
                  (e.usedBytes = r);
              }
          },
          node_ops: {
            getattr(e) {
              var r = {};
              return (
                (r.dev = FS.isChrdev(e.mode) ? e.id : 1),
                (r.ino = e.id),
                (r.mode = e.mode),
                (r.nlink = 1),
                (r.uid = 0),
                (r.gid = 0),
                (r.rdev = e.rdev),
                FS.isDir(e.mode)
                  ? (r.size = 4096)
                  : FS.isFile(e.mode)
                  ? (r.size = e.usedBytes)
                  : FS.isLink(e.mode)
                  ? (r.size = e.link.length)
                  : (r.size = 0),
                (r.atime = new Date(e.timestamp)),
                (r.mtime = new Date(e.timestamp)),
                (r.ctime = new Date(e.timestamp)),
                (r.blksize = 4096),
                (r.blocks = Math.ceil(r.size / r.blksize)),
                r
              );
            },
            setattr(e, r) {
              void 0 !== r.mode && (e.mode = r.mode),
                void 0 !== r.timestamp && (e.timestamp = r.timestamp),
                void 0 !== r.size && MEMFS.resizeFileStorage(e, r.size);
            },
            lookup(e, r) {
              throw FS.genericErrors[44];
            },
            mknod: (e, r, t, n) => MEMFS.createNode(e, r, t, n),
            rename(e, r, t) {
              if (FS.isDir(e.mode)) {
                var n;
                try {
                  n = FS.lookupNode(r, t);
                } catch (e) {}
                if (n) for (var o in n.contents) throw new FS.ErrnoError(55);
              }
              delete e.parent.contents[e.name],
                (e.parent.timestamp = Date.now()),
                (e.name = t),
                (r.contents[t] = e),
                (r.timestamp = e.parent.timestamp),
                (e.parent = r);
            },
            unlink(e, r) {
              delete e.contents[r], (e.timestamp = Date.now());
            },
            rmdir(e, r) {
              var t = FS.lookupNode(e, r);
              for (var n in t.contents) throw new FS.ErrnoError(55);
              delete e.contents[r], (e.timestamp = Date.now());
            },
            readdir(e) {
              var r = [".", ".."];
              for (var t in e.contents)
                e.contents.hasOwnProperty(t) && r.push(t);
              return r;
            },
            symlink(e, r, t) {
              var n = MEMFS.createNode(e, r, 41471, 0);
              return (n.link = t), n;
            },
            readlink(e) {
              if (!FS.isLink(e.mode)) throw new FS.ErrnoError(28);
              return e.link;
            },
          },
          stream_ops: {
            read(e, r, t, n, o) {
              var a = e.node.contents;
              if (o >= e.node.usedBytes) return 0;
              var i = Math.min(e.node.usedBytes - o, n);
              if (i > 8 && a.subarray) r.set(a.subarray(o, o + i), t);
              else for (var s = 0; s < i; s++) r[t + s] = a[o + s];
              return i;
            },
            write(e, r, t, n, o, a) {
              if ((r.buffer === HEAP8.buffer && (a = !1), !n)) return 0;
              var i = e.node;
              if (
                ((i.timestamp = Date.now()),
                r.subarray && (!i.contents || i.contents.subarray))
              ) {
                if (a)
                  return (
                    (i.contents = r.subarray(t, t + n)), (i.usedBytes = n), n
                  );
                if (0 === i.usedBytes && 0 === o)
                  return (i.contents = r.slice(t, t + n)), (i.usedBytes = n), n;
                if (o + n <= i.usedBytes)
                  return i.contents.set(r.subarray(t, t + n), o), n;
              }
              if (
                (MEMFS.expandFileStorage(i, o + n),
                i.contents.subarray && r.subarray)
              )
                i.contents.set(r.subarray(t, t + n), o);
              else for (var s = 0; s < n; s++) i.contents[o + s] = r[t + s];
              return (i.usedBytes = Math.max(i.usedBytes, o + n)), n;
            },
            llseek(e, r, t) {
              var n = r;
              if (
                (1 === t
                  ? (n += e.position)
                  : 2 === t &&
                    FS.isFile(e.node.mode) &&
                    (n += e.node.usedBytes),
                n < 0)
              )
                throw new FS.ErrnoError(28);
              return n;
            },
            allocate(e, r, t) {
              MEMFS.expandFileStorage(e.node, r + t),
                (e.node.usedBytes = Math.max(e.node.usedBytes, r + t));
            },
            mmap(e, r, t, n, o) {
              if (!FS.isFile(e.node.mode)) throw new FS.ErrnoError(43);
              var a,
                i,
                s = e.node.contents;
              if (2 & o || s.buffer !== HEAP8.buffer) {
                if (
                  ((t > 0 || t + r < s.length) &&
                    (s = s.subarray
                      ? s.subarray(t, t + r)
                      : Array.prototype.slice.call(s, t, t + r)),
                  (i = !0),
                  !(a = mmapAlloc(r)))
                )
                  throw new FS.ErrnoError(48);
                HEAP8.set(s, a);
              } else (i = !1), (a = s.byteOffset);
              return { ptr: a, allocated: i };
            },
            msync: (e, r, t, n, o) => (
              MEMFS.stream_ops.write(e, r, 0, n, t, !1), 0
            ),
          },
        },
        asyncLoad = (e, r, t, n) => {
          var o = n ? "" : getUniqueRunDependency(`al ${e}`);
          readAsync(
            e,
            (t) => {
              assert(t, `Loading data file "${e}" failed (no arrayBuffer).`),
                r(new Uint8Array(t)),
                o && removeRunDependency(o);
            },
            (r) => {
              if (!t) throw `Loading data file "${e}" failed.`;
              t();
            },
          ),
            o && addRunDependency(o);
        },
        FS_createDataFile = (e, r, t, n, o, a) =>
          FS.createDataFile(e, r, t, n, o, a),
        preloadPlugins = Module.preloadPlugins || [],
        FS_handledByPreloadPlugin = (e, r, t, n) => {
          "undefined" != typeof Browser && Browser.init();
          var o = !1;
          return (
            preloadPlugins.forEach((a) => {
              o || (a.canHandle(r) && (a.handle(e, r, t, n), (o = !0)));
            }),
            o
          );
        },
        FS_createPreloadedFile = (e, r, t, n, o, a, i, s, l, d) => {
          var u = r ? PATH_FS.resolve(PATH.join2(e, r)) : e,
            c = getUniqueRunDependency(`cp ${u}`);
          function m(t) {
            function m(t) {
              d && d(),
                s || FS_createDataFile(e, r, t, n, o, l),
                a && a(),
                removeRunDependency(c);
            }
            FS_handledByPreloadPlugin(t, u, m, () => {
              i && i(), removeRunDependency(c);
            }) || m(t);
          }
          addRunDependency(c),
            "string" == typeof t ? asyncLoad(t, (e) => m(e), i) : m(t);
        },
        FS_modeStringToFlags = (e) => {
          var r = { r: 0, "r+": 2, w: 577, "w+": 578, a: 1089, "a+": 1090 }[e];
          if (void 0 === r) throw new Error(`Unknown file open mode: ${e}`);
          return r;
        },
        FS_getMode = (e, r) => {
          var t = 0;
          return e && (t |= 365), r && (t |= 146), t;
        },
        WORKERFS = {
          DIR_MODE: 16895,
          FILE_MODE: 33279,
          reader: null,
          mount(e) {
            assert(ENVIRONMENT_IS_WORKER),
              WORKERFS.reader || (WORKERFS.reader = new FileReaderSync());
            var r = WORKERFS.createNode(null, "/", WORKERFS.DIR_MODE, 0),
              t = {};
            function n(e) {
              for (var n = e.split("/"), o = r, a = 0; a < n.length - 1; a++) {
                var i = n.slice(0, a + 1).join("/");
                t[i] ||
                  (t[i] = WORKERFS.createNode(o, n[a], WORKERFS.DIR_MODE, 0)),
                  (o = t[i]);
              }
              return o;
            }
            function o(e) {
              var r = e.split("/");
              return r[r.length - 1];
            }
            return (
              Array.prototype.forEach.call(e.opts.files || [], function (e) {
                WORKERFS.createNode(
                  n(e.name),
                  o(e.name),
                  WORKERFS.FILE_MODE,
                  0,
                  e,
                  e.lastModifiedDate,
                );
              }),
              (e.opts.blobs || []).forEach(function (e) {
                WORKERFS.createNode(
                  n(e.name),
                  o(e.name),
                  WORKERFS.FILE_MODE,
                  0,
                  e.data,
                );
              }),
              (e.opts.packages || []).forEach(function (e) {
                e.metadata.files.forEach(function (r) {
                  var t = r.filename.substr(1);
                  WORKERFS.createNode(
                    n(t),
                    o(t),
                    WORKERFS.FILE_MODE,
                    0,
                    e.blob.slice(r.start, r.end),
                  );
                });
              }),
              r
            );
          },
          createNode(e, r, t, n, o, a) {
            var i = FS.createNode(e, r, t);
            return (
              (i.mode = t),
              (i.node_ops = WORKERFS.node_ops),
              (i.stream_ops = WORKERFS.stream_ops),
              (i.timestamp = (a || new Date()).getTime()),
              assert(WORKERFS.FILE_MODE !== WORKERFS.DIR_MODE),
              t === WORKERFS.FILE_MODE
                ? ((i.size = o.size), (i.contents = o))
                : ((i.size = 4096), (i.contents = {})),
              e && (e.contents[r] = i),
              i
            );
          },
          node_ops: {
            getattr: (e) => ({
              dev: 1,
              ino: e.id,
              mode: e.mode,
              nlink: 1,
              uid: 0,
              gid: 0,
              rdev: 0,
              size: e.size,
              atime: new Date(e.timestamp),
              mtime: new Date(e.timestamp),
              ctime: new Date(e.timestamp),
              blksize: 4096,
              blocks: Math.ceil(e.size / 4096),
            }),
            setattr(e, r) {
              void 0 !== r.mode && (e.mode = r.mode),
                void 0 !== r.timestamp && (e.timestamp = r.timestamp);
            },
            lookup(e, r) {
              throw new FS.ErrnoError(44);
            },
            mknod(e, r, t, n) {
              throw new FS.ErrnoError(63);
            },
            rename(e, r, t) {
              throw new FS.ErrnoError(63);
            },
            unlink(e, r) {
              throw new FS.ErrnoError(63);
            },
            rmdir(e, r) {
              throw new FS.ErrnoError(63);
            },
            readdir(e) {
              var r = [".", ".."];
              for (var t in e.contents)
                e.contents.hasOwnProperty(t) && r.push(t);
              return r;
            },
            symlink(e, r, t) {
              throw new FS.ErrnoError(63);
            },
          },
          stream_ops: {
            read(e, r, t, n, o) {
              if (o >= e.node.size) return 0;
              var a = e.node.contents.slice(o, o + n),
                i = WORKERFS.reader.readAsArrayBuffer(a);
              return r.set(new Uint8Array(i), t), a.size;
            },
            write(e, r, t, n, o) {
              throw new FS.ErrnoError(29);
            },
            llseek(e, r, t) {
              var n = r;
              if (
                (1 === t
                  ? (n += e.position)
                  : 2 === t && FS.isFile(e.node.mode) && (n += e.node.size),
                n < 0)
              )
                throw new FS.ErrnoError(28);
              return n;
            },
          },
        },
        FS = {
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
          lookupPath(e, r = {}) {
            if (!(e = PATH_FS.resolve(e))) return { path: "", node: null };
            if (
              (r = Object.assign({ follow_mount: !0, recurse_count: 0 }, r))
                .recurse_count > 8
            )
              throw new FS.ErrnoError(32);
            for (
              var t = e.split("/").filter((e) => !!e),
                n = FS.root,
                o = "/",
                a = 0;
              a < t.length;
              a++
            ) {
              var i = a === t.length - 1;
              if (i && r.parent) break;
              if (
                ((n = FS.lookupNode(n, t[a])),
                (o = PATH.join2(o, t[a])),
                FS.isMountpoint(n) &&
                  (!i || (i && r.follow_mount)) &&
                  (n = n.mounted.root),
                !i || r.follow)
              )
                for (var s = 0; FS.isLink(n.mode); ) {
                  var l = FS.readlink(o);
                  if (
                    ((o = PATH_FS.resolve(PATH.dirname(o), l)),
                    (n = FS.lookupPath(o, {
                      recurse_count: r.recurse_count + 1,
                    }).node),
                    s++ > 40)
                  )
                    throw new FS.ErrnoError(32);
                }
            }
            return { path: o, node: n };
          },
          getPath(e) {
            for (var r; ; ) {
              if (FS.isRoot(e)) {
                var t = e.mount.mountpoint;
                return r ? ("/" !== t[t.length - 1] ? `${t}/${r}` : t + r) : t;
              }
              (r = r ? `${e.name}/${r}` : e.name), (e = e.parent);
            }
          },
          hashName(e, r) {
            for (var t = 0, n = 0; n < r.length; n++)
              t = ((t << 5) - t + r.charCodeAt(n)) | 0;
            return ((e + t) >>> 0) % FS.nameTable.length;
          },
          hashAddNode(e) {
            var r = FS.hashName(e.parent.id, e.name);
            (e.name_next = FS.nameTable[r]), (FS.nameTable[r] = e);
          },
          hashRemoveNode(e) {
            var r = FS.hashName(e.parent.id, e.name);
            if (FS.nameTable[r] === e) FS.nameTable[r] = e.name_next;
            else
              for (var t = FS.nameTable[r]; t; ) {
                if (t.name_next === e) {
                  t.name_next = e.name_next;
                  break;
                }
                t = t.name_next;
              }
          },
          lookupNode(e, r) {
            var t = FS.mayLookup(e);
            if (t) throw new FS.ErrnoError(t, e);
            for (
              var n = FS.hashName(e.id, r), o = FS.nameTable[n];
              o;
              o = o.name_next
            ) {
              var a = o.name;
              if (o.parent.id === e.id && a === r) return o;
            }
            return FS.lookup(e, r);
          },
          createNode(e, r, t, n) {
            var o = new FS.FSNode(e, r, t, n);
            return FS.hashAddNode(o), o;
          },
          destroyNode(e) {
            FS.hashRemoveNode(e);
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
          flagsToPermissionString(e) {
            var r = ["r", "w", "rw"][3 & e];
            return 512 & e && (r += "w"), r;
          },
          nodePermissions: (e, r) =>
            FS.ignorePermissions ||
            ((!r.includes("r") || 292 & e.mode) &&
              (!r.includes("w") || 146 & e.mode) &&
              (!r.includes("x") || 73 & e.mode))
              ? 0
              : 2,
          mayLookup(e) {
            var r = FS.nodePermissions(e, "x");
            return r || (e.node_ops.lookup ? 0 : 2);
          },
          mayCreate(e, r) {
            try {
              FS.lookupNode(e, r);
              return 20;
            } catch (e) {}
            return FS.nodePermissions(e, "wx");
          },
          mayDelete(e, r, t) {
            var n;
            try {
              n = FS.lookupNode(e, r);
            } catch (e) {
              return e.errno;
            }
            var o = FS.nodePermissions(e, "wx");
            if (o) return o;
            if (t) {
              if (!FS.isDir(n.mode)) return 54;
              if (FS.isRoot(n) || FS.getPath(n) === FS.cwd()) return 10;
            } else if (FS.isDir(n.mode)) return 31;
            return 0;
          },
          mayOpen: (e, r) =>
            e
              ? FS.isLink(e.mode)
                ? 32
                : FS.isDir(e.mode) &&
                  ("r" !== FS.flagsToPermissionString(r) || 512 & r)
                ? 31
                : FS.nodePermissions(e, FS.flagsToPermissionString(r))
              : 44,
          MAX_OPEN_FDS: 4096,
          nextfd() {
            for (var e = 0; e <= FS.MAX_OPEN_FDS; e++)
              if (!FS.streams[e]) return e;
            throw new FS.ErrnoError(33);
          },
          getStreamChecked(e) {
            var r = FS.getStream(e);
            if (!r) throw new FS.ErrnoError(8);
            return r;
          },
          getStream: (e) => FS.streams[e],
          createStream: (e, r = -1) => (
            FS.FSStream ||
              ((FS.FSStream = function () {
                this.shared = {};
              }),
              (FS.FSStream.prototype = {}),
              Object.defineProperties(FS.FSStream.prototype, {
                object: {
                  get() {
                    return this.node;
                  },
                  set(e) {
                    this.node = e;
                  },
                },
                isRead: {
                  get() {
                    return 1 != (2097155 & this.flags);
                  },
                },
                isWrite: {
                  get() {
                    return 0 != (2097155 & this.flags);
                  },
                },
                isAppend: {
                  get() {
                    return 1024 & this.flags;
                  },
                },
                flags: {
                  get() {
                    return this.shared.flags;
                  },
                  set(e) {
                    this.shared.flags = e;
                  },
                },
                position: {
                  get() {
                    return this.shared.position;
                  },
                  set(e) {
                    this.shared.position = e;
                  },
                },
              })),
            (e = Object.assign(new FS.FSStream(), e)),
            -1 == r && (r = FS.nextfd()),
            (e.fd = r),
            (FS.streams[r] = e),
            e
          ),
          closeStream(e) {
            FS.streams[e] = null;
          },
          chrdev_stream_ops: {
            open(e) {
              var r = FS.getDevice(e.node.rdev);
              (e.stream_ops = r.stream_ops),
                e.stream_ops.open && e.stream_ops.open(e);
            },
            llseek() {
              throw new FS.ErrnoError(70);
            },
          },
          major: (e) => e >> 8,
          minor: (e) => 255 & e,
          makedev: (e, r) => (e << 8) | r,
          registerDevice(e, r) {
            FS.devices[e] = { stream_ops: r };
          },
          getDevice: (e) => FS.devices[e],
          getMounts(e) {
            for (var r = [], t = [e]; t.length; ) {
              var n = t.pop();
              r.push(n), t.push.apply(t, n.mounts);
            }
            return r;
          },
          syncfs(e, r) {
            "function" == typeof e && ((r = e), (e = !1)),
              FS.syncFSRequests++,
              FS.syncFSRequests > 1 &&
                err(
                  `warning: ${FS.syncFSRequests} FS.syncfs operations in flight at once, probably just doing extra work`,
                );
            var t = FS.getMounts(FS.root.mount),
              n = 0;
            function o(e) {
              return FS.syncFSRequests--, r(e);
            }
            function a(e) {
              if (e) return a.errored ? void 0 : ((a.errored = !0), o(e));
              ++n >= t.length && o(null);
            }
            t.forEach((r) => {
              if (!r.type.syncfs) return a(null);
              r.type.syncfs(r, e, a);
            });
          },
          mount(e, r, t) {
            var n,
              o = "/" === t,
              a = !t;
            if (o && FS.root) throw new FS.ErrnoError(10);
            if (!o && !a) {
              var i = FS.lookupPath(t, { follow_mount: !1 });
              if (((t = i.path), (n = i.node), FS.isMountpoint(n)))
                throw new FS.ErrnoError(10);
              if (!FS.isDir(n.mode)) throw new FS.ErrnoError(54);
            }
            var s = { type: e, opts: r, mountpoint: t, mounts: [] },
              l = e.mount(s);
            return (
              (l.mount = s),
              (s.root = l),
              o
                ? (FS.root = l)
                : n && ((n.mounted = s), n.mount && n.mount.mounts.push(s)),
              l
            );
          },
          unmount(e) {
            var r = FS.lookupPath(e, { follow_mount: !1 });
            if (!FS.isMountpoint(r.node)) throw new FS.ErrnoError(28);
            var t = r.node,
              n = t.mounted,
              o = FS.getMounts(n);
            Object.keys(FS.nameTable).forEach((e) => {
              for (var r = FS.nameTable[e]; r; ) {
                var t = r.name_next;
                o.includes(r.mount) && FS.destroyNode(r), (r = t);
              }
            }),
              (t.mounted = null);
            var a = t.mount.mounts.indexOf(n);
            t.mount.mounts.splice(a, 1);
          },
          lookup: (e, r) => e.node_ops.lookup(e, r),
          mknod(e, r, t) {
            var n = FS.lookupPath(e, { parent: !0 }).node,
              o = PATH.basename(e);
            if (!o || "." === o || ".." === o) throw new FS.ErrnoError(28);
            var a = FS.mayCreate(n, o);
            if (a) throw new FS.ErrnoError(a);
            if (!n.node_ops.mknod) throw new FS.ErrnoError(63);
            return n.node_ops.mknod(n, o, r, t);
          },
          create: (e, r) => (
            (r = void 0 !== r ? r : 438),
            (r &= 4095),
            (r |= 32768),
            FS.mknod(e, r, 0)
          ),
          mkdir: (e, r) => (
            (r = void 0 !== r ? r : 511),
            (r &= 1023),
            (r |= 16384),
            FS.mknod(e, r, 0)
          ),
          mkdirTree(e, r) {
            for (var t = e.split("/"), n = "", o = 0; o < t.length; ++o)
              if (t[o]) {
                n += "/" + t[o];
                try {
                  FS.mkdir(n, r);
                } catch (e) {
                  if (20 != e.errno) throw e;
                }
              }
          },
          mkdev: (e, r, t) => (
            void 0 === t && ((t = r), (r = 438)), (r |= 8192), FS.mknod(e, r, t)
          ),
          symlink(e, r) {
            if (!PATH_FS.resolve(e)) throw new FS.ErrnoError(44);
            var t = FS.lookupPath(r, { parent: !0 }).node;
            if (!t) throw new FS.ErrnoError(44);
            var n = PATH.basename(r),
              o = FS.mayCreate(t, n);
            if (o) throw new FS.ErrnoError(o);
            if (!t.node_ops.symlink) throw new FS.ErrnoError(63);
            return t.node_ops.symlink(t, n, e);
          },
          rename(e, r) {
            var t,
              n,
              o = PATH.dirname(e),
              a = PATH.dirname(r),
              i = PATH.basename(e),
              s = PATH.basename(r);
            if (
              ((t = FS.lookupPath(e, { parent: !0 }).node),
              (n = FS.lookupPath(r, { parent: !0 }).node),
              !t || !n)
            )
              throw new FS.ErrnoError(44);
            if (t.mount !== n.mount) throw new FS.ErrnoError(75);
            var l,
              d = FS.lookupNode(t, i),
              u = PATH_FS.relative(e, a);
            if ("." !== u.charAt(0)) throw new FS.ErrnoError(28);
            if ("." !== (u = PATH_FS.relative(r, o)).charAt(0))
              throw new FS.ErrnoError(55);
            try {
              l = FS.lookupNode(n, s);
            } catch (e) {}
            if (d !== l) {
              var c = FS.isDir(d.mode),
                m = FS.mayDelete(t, i, c);
              if (m) throw new FS.ErrnoError(m);
              if ((m = l ? FS.mayDelete(n, s, c) : FS.mayCreate(n, s)))
                throw new FS.ErrnoError(m);
              if (!t.node_ops.rename) throw new FS.ErrnoError(63);
              if (FS.isMountpoint(d) || (l && FS.isMountpoint(l)))
                throw new FS.ErrnoError(10);
              if (n !== t && (m = FS.nodePermissions(t, "w")))
                throw new FS.ErrnoError(m);
              FS.hashRemoveNode(d);
              try {
                t.node_ops.rename(d, n, s);
              } catch (e) {
                throw e;
              } finally {
                FS.hashAddNode(d);
              }
            }
          },
          rmdir(e) {
            var r = FS.lookupPath(e, { parent: !0 }).node,
              t = PATH.basename(e),
              n = FS.lookupNode(r, t),
              o = FS.mayDelete(r, t, !0);
            if (o) throw new FS.ErrnoError(o);
            if (!r.node_ops.rmdir) throw new FS.ErrnoError(63);
            if (FS.isMountpoint(n)) throw new FS.ErrnoError(10);
            r.node_ops.rmdir(r, t), FS.destroyNode(n);
          },
          readdir(e) {
            var r = FS.lookupPath(e, { follow: !0 }).node;
            if (!r.node_ops.readdir) throw new FS.ErrnoError(54);
            return r.node_ops.readdir(r);
          },
          unlink(e) {
            var r = FS.lookupPath(e, { parent: !0 }).node;
            if (!r) throw new FS.ErrnoError(44);
            var t = PATH.basename(e),
              n = FS.lookupNode(r, t),
              o = FS.mayDelete(r, t, !1);
            if (o) throw new FS.ErrnoError(o);
            if (!r.node_ops.unlink) throw new FS.ErrnoError(63);
            if (FS.isMountpoint(n)) throw new FS.ErrnoError(10);
            r.node_ops.unlink(r, t), FS.destroyNode(n);
          },
          readlink(e) {
            var r = FS.lookupPath(e).node;
            if (!r) throw new FS.ErrnoError(44);
            if (!r.node_ops.readlink) throw new FS.ErrnoError(28);
            return PATH_FS.resolve(
              FS.getPath(r.parent),
              r.node_ops.readlink(r),
            );
          },
          stat(e, r) {
            var t = FS.lookupPath(e, { follow: !r }).node;
            if (!t) throw new FS.ErrnoError(44);
            if (!t.node_ops.getattr) throw new FS.ErrnoError(63);
            return t.node_ops.getattr(t);
          },
          lstat: (e) => FS.stat(e, !0),
          chmod(e, r, t) {
            var n;
            "string" == typeof e
              ? (n = FS.lookupPath(e, { follow: !t }).node)
              : (n = e);
            if (!n.node_ops.setattr) throw new FS.ErrnoError(63);
            n.node_ops.setattr(n, {
              mode: (4095 & r) | (-4096 & n.mode),
              timestamp: Date.now(),
            });
          },
          lchmod(e, r) {
            FS.chmod(e, r, !0);
          },
          fchmod(e, r) {
            var t = FS.getStreamChecked(e);
            FS.chmod(t.node, r);
          },
          chown(e, r, t, n) {
            var o;
            "string" == typeof e
              ? (o = FS.lookupPath(e, { follow: !n }).node)
              : (o = e);
            if (!o.node_ops.setattr) throw new FS.ErrnoError(63);
            o.node_ops.setattr(o, { timestamp: Date.now() });
          },
          lchown(e, r, t) {
            FS.chown(e, r, t, !0);
          },
          fchown(e, r, t) {
            var n = FS.getStreamChecked(e);
            FS.chown(n.node, r, t);
          },
          truncate(e, r) {
            if (r < 0) throw new FS.ErrnoError(28);
            var t;
            "string" == typeof e
              ? (t = FS.lookupPath(e, { follow: !0 }).node)
              : (t = e);
            if (!t.node_ops.setattr) throw new FS.ErrnoError(63);
            if (FS.isDir(t.mode)) throw new FS.ErrnoError(31);
            if (!FS.isFile(t.mode)) throw new FS.ErrnoError(28);
            var n = FS.nodePermissions(t, "w");
            if (n) throw new FS.ErrnoError(n);
            t.node_ops.setattr(t, { size: r, timestamp: Date.now() });
          },
          ftruncate(e, r) {
            var t = FS.getStreamChecked(e);
            if (0 == (2097155 & t.flags)) throw new FS.ErrnoError(28);
            FS.truncate(t.node, r);
          },
          utime(e, r, t) {
            var n = FS.lookupPath(e, { follow: !0 }).node;
            n.node_ops.setattr(n, { timestamp: Math.max(r, t) });
          },
          open(e, r, t) {
            if ("" === e) throw new FS.ErrnoError(44);
            var n;
            if (
              ((t = void 0 === t ? 438 : t),
              (t =
                64 & (r = "string" == typeof r ? FS_modeStringToFlags(r) : r)
                  ? (4095 & t) | 32768
                  : 0),
              "object" == typeof e)
            )
              n = e;
            else {
              e = PATH.normalize(e);
              try {
                n = FS.lookupPath(e, { follow: !(131072 & r) }).node;
              } catch (e) {}
            }
            var o = !1;
            if (64 & r)
              if (n) {
                if (128 & r) throw new FS.ErrnoError(20);
              } else (n = FS.mknod(e, t, 0)), (o = !0);
            if (!n) throw new FS.ErrnoError(44);
            if (
              (FS.isChrdev(n.mode) && (r &= -513),
              65536 & r && !FS.isDir(n.mode))
            )
              throw new FS.ErrnoError(54);
            if (!o) {
              var a = FS.mayOpen(n, r);
              if (a) throw new FS.ErrnoError(a);
            }
            512 & r && !o && FS.truncate(n, 0), (r &= -131713);
            var i = FS.createStream({
              node: n,
              path: FS.getPath(n),
              flags: r,
              seekable: !0,
              position: 0,
              stream_ops: n.stream_ops,
              ungotten: [],
              error: !1,
            });
            return (
              i.stream_ops.open && i.stream_ops.open(i),
              !Module.logReadFiles ||
                1 & r ||
                (FS.readFiles || (FS.readFiles = {}),
                e in FS.readFiles || (FS.readFiles[e] = 1)),
              i
            );
          },
          close(e) {
            if (FS.isClosed(e)) throw new FS.ErrnoError(8);
            e.getdents && (e.getdents = null);
            try {
              e.stream_ops.close && e.stream_ops.close(e);
            } catch (e) {
              throw e;
            } finally {
              FS.closeStream(e.fd);
            }
            e.fd = null;
          },
          isClosed: (e) => null === e.fd,
          llseek(e, r, t) {
            if (FS.isClosed(e)) throw new FS.ErrnoError(8);
            if (!e.seekable || !e.stream_ops.llseek)
              throw new FS.ErrnoError(70);
            if (0 != t && 1 != t && 2 != t) throw new FS.ErrnoError(28);
            return (
              (e.position = e.stream_ops.llseek(e, r, t)),
              (e.ungotten = []),
              e.position
            );
          },
          read(e, r, t, n, o) {
            if (n < 0 || o < 0) throw new FS.ErrnoError(28);
            if (FS.isClosed(e)) throw new FS.ErrnoError(8);
            if (1 == (2097155 & e.flags)) throw new FS.ErrnoError(8);
            if (FS.isDir(e.node.mode)) throw new FS.ErrnoError(31);
            if (!e.stream_ops.read) throw new FS.ErrnoError(28);
            var a = void 0 !== o;
            if (a) {
              if (!e.seekable) throw new FS.ErrnoError(70);
            } else o = e.position;
            var i = e.stream_ops.read(e, r, t, n, o);
            return a || (e.position += i), i;
          },
          write(e, r, t, n, o, a) {
            if (n < 0 || o < 0) throw new FS.ErrnoError(28);
            if (FS.isClosed(e)) throw new FS.ErrnoError(8);
            if (0 == (2097155 & e.flags)) throw new FS.ErrnoError(8);
            if (FS.isDir(e.node.mode)) throw new FS.ErrnoError(31);
            if (!e.stream_ops.write) throw new FS.ErrnoError(28);
            e.seekable && 1024 & e.flags && FS.llseek(e, 0, 2);
            var i = void 0 !== o;
            if (i) {
              if (!e.seekable) throw new FS.ErrnoError(70);
            } else o = e.position;
            var s = e.stream_ops.write(e, r, t, n, o, a);
            return i || (e.position += s), s;
          },
          allocate(e, r, t) {
            if (FS.isClosed(e)) throw new FS.ErrnoError(8);
            if (r < 0 || t <= 0) throw new FS.ErrnoError(28);
            if (0 == (2097155 & e.flags)) throw new FS.ErrnoError(8);
            if (!FS.isFile(e.node.mode) && !FS.isDir(e.node.mode))
              throw new FS.ErrnoError(43);
            if (!e.stream_ops.allocate) throw new FS.ErrnoError(138);
            e.stream_ops.allocate(e, r, t);
          },
          mmap(e, r, t, n, o) {
            if (0 != (2 & n) && 0 == (2 & o) && 2 != (2097155 & e.flags))
              throw new FS.ErrnoError(2);
            if (1 == (2097155 & e.flags)) throw new FS.ErrnoError(2);
            if (!e.stream_ops.mmap) throw new FS.ErrnoError(43);
            return e.stream_ops.mmap(e, r, t, n, o);
          },
          msync: (e, r, t, n, o) =>
            e.stream_ops.msync ? e.stream_ops.msync(e, r, t, n, o) : 0,
          munmap: (e) => 0,
          ioctl(e, r, t) {
            if (!e.stream_ops.ioctl) throw new FS.ErrnoError(59);
            return e.stream_ops.ioctl(e, r, t);
          },
          readFile(e, r = {}) {
            if (
              ((r.flags = r.flags || 0),
              (r.encoding = r.encoding || "binary"),
              "utf8" !== r.encoding && "binary" !== r.encoding)
            )
              throw new Error(`Invalid encoding type "${r.encoding}"`);
            var t,
              n = FS.open(e, r.flags),
              o = FS.stat(e).size,
              a = new Uint8Array(o);
            return (
              FS.read(n, a, 0, o, 0),
              "utf8" === r.encoding
                ? (t = UTF8ArrayToString(a, 0))
                : "binary" === r.encoding && (t = a),
              FS.close(n),
              t
            );
          },
          writeFile(e, r, t = {}) {
            t.flags = t.flags || 577;
            var n = FS.open(e, t.flags, t.mode);
            if ("string" == typeof r) {
              var o = new Uint8Array(lengthBytesUTF8(r) + 1),
                a = stringToUTF8Array(r, o, 0, o.length);
              FS.write(n, o, 0, a, void 0, t.canOwn);
            } else {
              if (!ArrayBuffer.isView(r))
                throw new Error("Unsupported data type");
              FS.write(n, r, 0, r.byteLength, void 0, t.canOwn);
            }
            FS.close(n);
          },
          cwd: () => FS.currentPath,
          chdir(e) {
            var r = FS.lookupPath(e, { follow: !0 });
            if (null === r.node) throw new FS.ErrnoError(44);
            if (!FS.isDir(r.node.mode)) throw new FS.ErrnoError(54);
            var t = FS.nodePermissions(r.node, "x");
            if (t) throw new FS.ErrnoError(t);
            FS.currentPath = r.path;
          },
          createDefaultDirectories() {
            FS.mkdir("/tmp"), FS.mkdir("/home"), FS.mkdir("/home/web_user");
          },
          createDefaultDevices() {
            FS.mkdir("/dev"),
              FS.registerDevice(FS.makedev(1, 3), {
                read: () => 0,
                write: (e, r, t, n, o) => n,
              }),
              FS.mkdev("/dev/null", FS.makedev(1, 3)),
              TTY.register(FS.makedev(5, 0), TTY.default_tty_ops),
              TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops),
              FS.mkdev("/dev/tty", FS.makedev(5, 0)),
              FS.mkdev("/dev/tty1", FS.makedev(6, 0));
            var e = new Uint8Array(1024),
              r = 0,
              t = () => (0 === r && (r = randomFill(e).byteLength), e[--r]);
            FS.createDevice("/dev", "random", t),
              FS.createDevice("/dev", "urandom", t),
              FS.mkdir("/dev/shm"),
              FS.mkdir("/dev/shm/tmp");
          },
          createSpecialDirectories() {
            FS.mkdir("/proc");
            var e = FS.mkdir("/proc/self");
            FS.mkdir("/proc/self/fd"),
              FS.mount(
                {
                  mount() {
                    var r = FS.createNode(e, "fd", 16895, 73);
                    return (
                      (r.node_ops = {
                        lookup(e, r) {
                          var t = +r,
                            n = FS.getStreamChecked(t),
                            o = {
                              parent: null,
                              mount: { mountpoint: "fake" },
                              node_ops: { readlink: () => n.path },
                            };
                          return (o.parent = o), o;
                        },
                      }),
                      r
                    );
                  },
                },
                {},
                "/proc/self/fd",
              );
          },
          createStandardStreams() {
            Module.stdin
              ? FS.createDevice("/dev", "stdin", Module.stdin)
              : FS.symlink("/dev/tty", "/dev/stdin"),
              Module.stdout
                ? FS.createDevice("/dev", "stdout", null, Module.stdout)
                : FS.symlink("/dev/tty", "/dev/stdout"),
              Module.stderr
                ? FS.createDevice("/dev", "stderr", null, Module.stderr)
                : FS.symlink("/dev/tty1", "/dev/stderr");
            FS.open("/dev/stdin", 0),
              FS.open("/dev/stdout", 1),
              FS.open("/dev/stderr", 1);
          },
          ensureErrnoError() {
            FS.ErrnoError ||
              ((FS.ErrnoError = function (e, r) {
                (this.name = "ErrnoError"),
                  (this.node = r),
                  (this.setErrno = function (e) {
                    this.errno = e;
                  }),
                  this.setErrno(e),
                  (this.message = "FS error");
              }),
              (FS.ErrnoError.prototype = new Error()),
              (FS.ErrnoError.prototype.constructor = FS.ErrnoError),
              [44].forEach((e) => {
                (FS.genericErrors[e] = new FS.ErrnoError(e)),
                  (FS.genericErrors[e].stack = "<generic error, no stack>");
              }));
          },
          staticInit() {
            FS.ensureErrnoError(),
              (FS.nameTable = new Array(4096)),
              FS.mount(MEMFS, {}, "/"),
              FS.createDefaultDirectories(),
              FS.createDefaultDevices(),
              FS.createSpecialDirectories(),
              (FS.filesystems = { MEMFS, WORKERFS });
          },
          init(e, r, t) {
            (FS.init.initialized = !0),
              FS.ensureErrnoError(),
              (Module.stdin = e || Module.stdin),
              (Module.stdout = r || Module.stdout),
              (Module.stderr = t || Module.stderr),
              FS.createStandardStreams();
          },
          quit() {
            FS.init.initialized = !1;
            for (var e = 0; e < FS.streams.length; e++) {
              var r = FS.streams[e];
              r && FS.close(r);
            }
          },
          findObject(e, r) {
            var t = FS.analyzePath(e, r);
            return t.exists ? t.object : null;
          },
          analyzePath(e, r) {
            try {
              e = (n = FS.lookupPath(e, { follow: !r })).path;
            } catch (e) {}
            var t = {
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
              var n = FS.lookupPath(e, { parent: !0 });
              (t.parentExists = !0),
                (t.parentPath = n.path),
                (t.parentObject = n.node),
                (t.name = PATH.basename(e)),
                (n = FS.lookupPath(e, { follow: !r })),
                (t.exists = !0),
                (t.path = n.path),
                (t.object = n.node),
                (t.name = n.node.name),
                (t.isRoot = "/" === n.path);
            } catch (e) {
              t.error = e.errno;
            }
            return t;
          },
          createPath(e, r, t, n) {
            e = "string" == typeof e ? e : FS.getPath(e);
            for (var o = r.split("/").reverse(); o.length; ) {
              var a = o.pop();
              if (a) {
                var i = PATH.join2(e, a);
                try {
                  FS.mkdir(i);
                } catch (e) {}
                e = i;
              }
            }
            return i;
          },
          createFile(e, r, t, n, o) {
            var a = PATH.join2("string" == typeof e ? e : FS.getPath(e), r),
              i = FS_getMode(n, o);
            return FS.create(a, i);
          },
          createDataFile(e, r, t, n, o, a) {
            var i = r;
            e &&
              ((e = "string" == typeof e ? e : FS.getPath(e)),
              (i = r ? PATH.join2(e, r) : e));
            var s = FS_getMode(n, o),
              l = FS.create(i, s);
            if (t) {
              if ("string" == typeof t) {
                for (
                  var d = new Array(t.length), u = 0, c = t.length;
                  u < c;
                  ++u
                )
                  d[u] = t.charCodeAt(u);
                t = d;
              }
              FS.chmod(l, 146 | s);
              var m = FS.open(l, 577);
              FS.write(m, t, 0, t.length, 0, a), FS.close(m), FS.chmod(l, s);
            }
            return l;
          },
          createDevice(e, r, t, n) {
            var o = PATH.join2("string" == typeof e ? e : FS.getPath(e), r),
              a = FS_getMode(!!t, !!n);
            FS.createDevice.major || (FS.createDevice.major = 64);
            var i = FS.makedev(FS.createDevice.major++, 0);
            return (
              FS.registerDevice(i, {
                open(e) {
                  e.seekable = !1;
                },
                close(e) {
                  n && n.buffer && n.buffer.length && n(10);
                },
                read(e, r, n, o, a) {
                  for (var i = 0, s = 0; s < o; s++) {
                    var l;
                    try {
                      l = t();
                    } catch (e) {
                      throw new FS.ErrnoError(29);
                    }
                    if (void 0 === l && 0 === i) throw new FS.ErrnoError(6);
                    if (null == l) break;
                    i++, (r[n + s] = l);
                  }
                  return i && (e.node.timestamp = Date.now()), i;
                },
                write(e, r, t, o, a) {
                  for (var i = 0; i < o; i++)
                    try {
                      n(r[t + i]);
                    } catch (e) {
                      throw new FS.ErrnoError(29);
                    }
                  return o && (e.node.timestamp = Date.now()), i;
                },
              }),
              FS.mkdev(o, a, i)
            );
          },
          forceLoadFile(e) {
            if (e.isDevice || e.isFolder || e.link || e.contents) return !0;
            if ("undefined" != typeof XMLHttpRequest)
              throw new Error(
                "Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.",
              );
            if (!read_)
              throw new Error("Cannot load without read() or XMLHttpRequest.");
            try {
              (e.contents = intArrayFromString(read_(e.url), !0)),
                (e.usedBytes = e.contents.length);
            } catch (e) {
              throw new FS.ErrnoError(29);
            }
          },
          createLazyFile(e, r, t, n, o) {
            function a() {
              (this.lengthKnown = !1), (this.chunks = []);
            }
            if (
              ((a.prototype.get = function (e) {
                if (!(e > this.length - 1 || e < 0)) {
                  var r = e % this.chunkSize,
                    t = (e / this.chunkSize) | 0;
                  return this.getter(t)[r];
                }
              }),
              (a.prototype.setDataGetter = function (e) {
                this.getter = e;
              }),
              (a.prototype.cacheLength = function () {
                var e = new XMLHttpRequest();
                if (
                  (e.open("HEAD", t, !1),
                  e.send(null),
                  !((e.status >= 200 && e.status < 300) || 304 === e.status))
                )
                  throw new Error(
                    "Couldn't load " + t + ". Status: " + e.status,
                  );
                var r,
                  n = Number(e.getResponseHeader("Content-length")),
                  o =
                    (r = e.getResponseHeader("Accept-Ranges")) && "bytes" === r,
                  a =
                    (r = e.getResponseHeader("Content-Encoding")) &&
                    "gzip" === r,
                  i = 1048576;
                o || (i = n);
                var s = this;
                s.setDataGetter((e) => {
                  var r = e * i,
                    o = (e + 1) * i - 1;
                  if (
                    ((o = Math.min(o, n - 1)),
                    void 0 === s.chunks[e] &&
                      (s.chunks[e] = ((e, r) => {
                        if (e > r)
                          throw new Error(
                            "invalid range (" +
                              e +
                              ", " +
                              r +
                              ") or no bytes requested!",
                          );
                        if (r > n - 1)
                          throw new Error(
                            "only " + n + " bytes available! programmer error!",
                          );
                        var o = new XMLHttpRequest();
                        if (
                          (o.open("GET", t, !1),
                          n !== i &&
                            o.setRequestHeader("Range", "bytes=" + e + "-" + r),
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
                            "Couldn't load " + t + ". Status: " + o.status,
                          );
                        return void 0 !== o.response
                          ? new Uint8Array(o.response || [])
                          : intArrayFromString(o.responseText || "", !0);
                      })(r, o)),
                    void 0 === s.chunks[e])
                  )
                    throw new Error("doXHR failed!");
                  return s.chunks[e];
                }),
                  (!a && n) ||
                    ((i = n = 1),
                    (n = this.getter(0).length),
                    (i = n),
                    out(
                      "LazyFiles on gzip forces download of the whole file when length is accessed",
                    )),
                  (this._length = n),
                  (this._chunkSize = i),
                  (this.lengthKnown = !0);
              }),
              "undefined" != typeof XMLHttpRequest)
            ) {
              if (!ENVIRONMENT_IS_WORKER)
                throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
              var i = new a();
              Object.defineProperties(i, {
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
              var s = { isDevice: !1, contents: i };
            } else s = { isDevice: !1, url: t };
            var l = FS.createFile(e, r, s, n, o);
            s.contents
              ? (l.contents = s.contents)
              : s.url && ((l.contents = null), (l.url = s.url)),
              Object.defineProperties(l, {
                usedBytes: {
                  get: function () {
                    return this.contents.length;
                  },
                },
              });
            var d = {};
            function u(e, r, t, n, o) {
              var a = e.node.contents;
              if (o >= a.length) return 0;
              var i = Math.min(a.length - o, n);
              if (a.slice) for (var s = 0; s < i; s++) r[t + s] = a[o + s];
              else for (s = 0; s < i; s++) r[t + s] = a.get(o + s);
              return i;
            }
            return (
              Object.keys(l.stream_ops).forEach((e) => {
                var r = l.stream_ops[e];
                d[e] = function () {
                  return FS.forceLoadFile(l), r.apply(null, arguments);
                };
              }),
              (d.read = (e, r, t, n, o) => (
                FS.forceLoadFile(l), u(e, r, t, n, o)
              )),
              (d.mmap = (e, r, t, n, o) => {
                FS.forceLoadFile(l);
                var a = mmapAlloc(r);
                if (!a) throw new FS.ErrnoError(48);
                return u(e, HEAP8, a, r, t), { ptr: a, allocated: !0 };
              }),
              (l.stream_ops = d),
              l
            );
          },
        },
        UTF8ToString = (e, r) => (e ? UTF8ArrayToString(HEAPU8, e, r) : ""),
        SYSCALLS = {
          DEFAULT_POLLMASK: 5,
          calculateAt(e, r, t) {
            if (PATH.isAbs(r)) return r;
            var n;
            -100 === e
              ? (n = FS.cwd())
              : (n = SYSCALLS.getStreamFromFD(e).path);
            if (0 == r.length) {
              if (!t) throw new FS.ErrnoError(44);
              return n;
            }
            return PATH.join2(n, r);
          },
          doStat(e, r, t) {
            try {
              var n = e(r);
            } catch (e) {
              if (
                e &&
                e.node &&
                PATH.normalize(r) !== PATH.normalize(FS.getPath(e.node))
              )
                return -54;
              throw e;
            }
            (HEAP32[t >> 2] = n.dev),
              (HEAP32[(t + 4) >> 2] = n.mode),
              (HEAPU32[(t + 8) >> 2] = n.nlink),
              (HEAP32[(t + 12) >> 2] = n.uid),
              (HEAP32[(t + 16) >> 2] = n.gid),
              (HEAP32[(t + 20) >> 2] = n.rdev),
              (tempI64 = [
                n.size >>> 0,
                ((tempDouble = n.size),
                +Math.abs(tempDouble) >= 1
                  ? tempDouble > 0
                    ? +Math.floor(tempDouble / 4294967296) >>> 0
                    : ~~+Math.ceil(
                        (tempDouble - +(~~tempDouble >>> 0)) / 4294967296,
                      ) >>> 0
                  : 0),
              ]),
              (HEAP32[(t + 24) >> 2] = tempI64[0]),
              (HEAP32[(t + 28) >> 2] = tempI64[1]),
              (HEAP32[(t + 32) >> 2] = 4096),
              (HEAP32[(t + 36) >> 2] = n.blocks);
            var o = n.atime.getTime(),
              a = n.mtime.getTime(),
              i = n.ctime.getTime();
            return (
              (tempI64 = [
                Math.floor(o / 1e3) >>> 0,
                ((tempDouble = Math.floor(o / 1e3)),
                +Math.abs(tempDouble) >= 1
                  ? tempDouble > 0
                    ? +Math.floor(tempDouble / 4294967296) >>> 0
                    : ~~+Math.ceil(
                        (tempDouble - +(~~tempDouble >>> 0)) / 4294967296,
                      ) >>> 0
                  : 0),
              ]),
              (HEAP32[(t + 40) >> 2] = tempI64[0]),
              (HEAP32[(t + 44) >> 2] = tempI64[1]),
              (HEAPU32[(t + 48) >> 2] = (o % 1e3) * 1e3),
              (tempI64 = [
                Math.floor(a / 1e3) >>> 0,
                ((tempDouble = Math.floor(a / 1e3)),
                +Math.abs(tempDouble) >= 1
                  ? tempDouble > 0
                    ? +Math.floor(tempDouble / 4294967296) >>> 0
                    : ~~+Math.ceil(
                        (tempDouble - +(~~tempDouble >>> 0)) / 4294967296,
                      ) >>> 0
                  : 0),
              ]),
              (HEAP32[(t + 56) >> 2] = tempI64[0]),
              (HEAP32[(t + 60) >> 2] = tempI64[1]),
              (HEAPU32[(t + 64) >> 2] = (a % 1e3) * 1e3),
              (tempI64 = [
                Math.floor(i / 1e3) >>> 0,
                ((tempDouble = Math.floor(i / 1e3)),
                +Math.abs(tempDouble) >= 1
                  ? tempDouble > 0
                    ? +Math.floor(tempDouble / 4294967296) >>> 0
                    : ~~+Math.ceil(
                        (tempDouble - +(~~tempDouble >>> 0)) / 4294967296,
                      ) >>> 0
                  : 0),
              ]),
              (HEAP32[(t + 72) >> 2] = tempI64[0]),
              (HEAP32[(t + 76) >> 2] = tempI64[1]),
              (HEAPU32[(t + 80) >> 2] = (i % 1e3) * 1e3),
              (tempI64 = [
                n.ino >>> 0,
                ((tempDouble = n.ino),
                +Math.abs(tempDouble) >= 1
                  ? tempDouble > 0
                    ? +Math.floor(tempDouble / 4294967296) >>> 0
                    : ~~+Math.ceil(
                        (tempDouble - +(~~tempDouble >>> 0)) / 4294967296,
                      ) >>> 0
                  : 0),
              ]),
              (HEAP32[(t + 88) >> 2] = tempI64[0]),
              (HEAP32[(t + 92) >> 2] = tempI64[1]),
              0
            );
          },
          doMsync(e, r, t, n, o) {
            if (!FS.isFile(r.node.mode)) throw new FS.ErrnoError(43);
            if (2 & n) return 0;
            var a = HEAPU8.slice(e, e + t);
            FS.msync(r, a, o, t, n);
          },
          varargs: void 0,
          get() {
            var e = HEAP32[+SYSCALLS.varargs >> 2];
            return (SYSCALLS.varargs += 4), e;
          },
          getp: () => SYSCALLS.get(),
          getStr: (e) => UTF8ToString(e),
          getStreamFromFD: (e) => FS.getStreamChecked(e),
        };
      function ___syscall_chmod(e, r) {
        try {
          return (e = SYSCALLS.getStr(e)), FS.chmod(e, r), 0;
        } catch (e) {
          if (void 0 === FS || "ErrnoError" !== e.name) throw e;
          return -e.errno;
        }
      }
      function ___syscall_faccessat(e, r, t, n) {
        try {
          if (
            ((r = SYSCALLS.getStr(r)), (r = SYSCALLS.calculateAt(e, r)), -8 & t)
          )
            return -28;
          var o = FS.lookupPath(r, { follow: !0 }).node;
          if (!o) return -44;
          var a = "";
          return (
            4 & t && (a += "r"),
            2 & t && (a += "w"),
            1 & t && (a += "x"),
            a && FS.nodePermissions(o, a) ? -2 : 0
          );
        } catch (e) {
          if (void 0 === FS || "ErrnoError" !== e.name) throw e;
          return -e.errno;
        }
      }
      function ___syscall_fchmod(e, r) {
        try {
          return FS.fchmod(e, r), 0;
        } catch (e) {
          if (void 0 === FS || "ErrnoError" !== e.name) throw e;
          return -e.errno;
        }
      }
      var setErrNo = (e) => ((HEAP32[___errno_location() >> 2] = e), e);
      function ___syscall_fcntl64(e, r, t) {
        SYSCALLS.varargs = t;
        try {
          var n = SYSCALLS.getStreamFromFD(e);
          switch (r) {
            case 0:
              if ((o = SYSCALLS.get()) < 0) return -28;
              for (; FS.streams[o]; ) o++;
              return FS.createStream(n, o).fd;
            case 1:
            case 2:
            case 6:
            case 7:
              return 0;
            case 3:
              return n.flags;
            case 4:
              var o = SYSCALLS.get();
              return (n.flags |= o), 0;
            case 5:
              o = SYSCALLS.getp();
              return (HEAP16[(o + 0) >> 1] = 2), 0;
            case 16:
            case 8:
            default:
              return -28;
            case 9:
              return setErrNo(28), -1;
          }
        } catch (e) {
          if (void 0 === FS || "ErrnoError" !== e.name) throw e;
          return -e.errno;
        }
      }
      function ___syscall_fstat64(e, r) {
        try {
          var t = SYSCALLS.getStreamFromFD(e);
          return SYSCALLS.doStat(FS.stat, t.path, r);
        } catch (e) {
          if (void 0 === FS || "ErrnoError" !== e.name) throw e;
          return -e.errno;
        }
      }
      var convertI32PairToI53Checked = (e, r) =>
        (r + 2097152) >>> 0 < 4194305 - !!e ? (e >>> 0) + 4294967296 * r : NaN;
      function ___syscall_ftruncate64(e, r, t) {
        var n = convertI32PairToI53Checked(r, t);
        try {
          return isNaN(n) ? 61 : (FS.ftruncate(e, n), 0);
        } catch (e) {
          if (void 0 === FS || "ErrnoError" !== e.name) throw e;
          return -e.errno;
        }
      }
      var stringToUTF8 = (e, r, t) => stringToUTF8Array(e, HEAPU8, r, t);
      function ___syscall_getdents64(e, r, t) {
        try {
          var n = SYSCALLS.getStreamFromFD(e);
          n.getdents || (n.getdents = FS.readdir(n.path));
          for (
            var o = 280, a = 0, i = FS.llseek(n, 0, 1), s = Math.floor(i / o);
            s < n.getdents.length && a + o <= t;

          ) {
            var l,
              d,
              u = n.getdents[s];
            if ("." === u) (l = n.node.id), (d = 4);
            else if (".." === u) {
              (l = FS.lookupPath(n.path, { parent: !0 }).node.id), (d = 4);
            } else {
              var c = FS.lookupNode(n.node, u);
              (l = c.id),
                (d = FS.isChrdev(c.mode)
                  ? 2
                  : FS.isDir(c.mode)
                  ? 4
                  : FS.isLink(c.mode)
                  ? 10
                  : 8);
            }
            (tempI64 = [
              l >>> 0,
              ((tempDouble = l),
              +Math.abs(tempDouble) >= 1
                ? tempDouble > 0
                  ? +Math.floor(tempDouble / 4294967296) >>> 0
                  : ~~+Math.ceil(
                      (tempDouble - +(~~tempDouble >>> 0)) / 4294967296,
                    ) >>> 0
                : 0),
            ]),
              (HEAP32[(r + a) >> 2] = tempI64[0]),
              (HEAP32[(r + a + 4) >> 2] = tempI64[1]),
              (tempI64 = [
                ((s + 1) * o) >>> 0,
                ((tempDouble = (s + 1) * o),
                +Math.abs(tempDouble) >= 1
                  ? tempDouble > 0
                    ? +Math.floor(tempDouble / 4294967296) >>> 0
                    : ~~+Math.ceil(
                        (tempDouble - +(~~tempDouble >>> 0)) / 4294967296,
                      ) >>> 0
                  : 0),
              ]),
              (HEAP32[(r + a + 8) >> 2] = tempI64[0]),
              (HEAP32[(r + a + 12) >> 2] = tempI64[1]),
              (HEAP16[(r + a + 16) >> 1] = 280),
              (HEAP8[(r + a + 18) >> 0] = d),
              stringToUTF8(u, r + a + 19, 256),
              (a += o),
              (s += 1);
          }
          return FS.llseek(n, s * o, 0), a;
        } catch (e) {
          if (void 0 === FS || "ErrnoError" !== e.name) throw e;
          return -e.errno;
        }
      }
      function ___syscall_ioctl(e, r, t) {
        SYSCALLS.varargs = t;
        try {
          var n = SYSCALLS.getStreamFromFD(e);
          switch (r) {
            case 21509:
            case 21510:
            case 21511:
            case 21512:
            case 21524:
            case 21515:
              return n.tty ? 0 : -59;
            case 21505:
              if (!n.tty) return -59;
              if (n.tty.ops.ioctl_tcgets) {
                var o = n.tty.ops.ioctl_tcgets(n),
                  a = SYSCALLS.getp();
                (HEAP32[a >> 2] = o.c_iflag || 0),
                  (HEAP32[(a + 4) >> 2] = o.c_oflag || 0),
                  (HEAP32[(a + 8) >> 2] = o.c_cflag || 0),
                  (HEAP32[(a + 12) >> 2] = o.c_lflag || 0);
                for (var i = 0; i < 32; i++)
                  HEAP8[(a + i + 17) >> 0] = o.c_cc[i] || 0;
                return 0;
              }
              return 0;
            case 21506:
            case 21507:
            case 21508:
              if (!n.tty) return -59;
              if (n.tty.ops.ioctl_tcsets) {
                a = SYSCALLS.getp();
                var s = HEAP32[a >> 2],
                  l = HEAP32[(a + 4) >> 2],
                  d = HEAP32[(a + 8) >> 2],
                  u = HEAP32[(a + 12) >> 2],
                  c = [];
                for (i = 0; i < 32; i++) c.push(HEAP8[(a + i + 17) >> 0]);
                return n.tty.ops.ioctl_tcsets(n.tty, r, {
                  c_iflag: s,
                  c_oflag: l,
                  c_cflag: d,
                  c_lflag: u,
                  c_cc: c,
                });
              }
              return 0;
            case 21519:
              if (!n.tty) return -59;
              a = SYSCALLS.getp();
              return (HEAP32[a >> 2] = 0), 0;
            case 21520:
              return n.tty ? -28 : -59;
            case 21531:
              a = SYSCALLS.getp();
              return FS.ioctl(n, r, a);
            case 21523:
              if (!n.tty) return -59;
              if (n.tty.ops.ioctl_tiocgwinsz) {
                var m = n.tty.ops.ioctl_tiocgwinsz(n.tty);
                a = SYSCALLS.getp();
                (HEAP16[a >> 1] = m[0]), (HEAP16[(a + 2) >> 1] = m[1]);
              }
              return 0;
            default:
              return -28;
          }
        } catch (e) {
          if (void 0 === FS || "ErrnoError" !== e.name) throw e;
          return -e.errno;
        }
      }
      function ___syscall_lstat64(e, r) {
        try {
          return (e = SYSCALLS.getStr(e)), SYSCALLS.doStat(FS.lstat, e, r);
        } catch (e) {
          if (void 0 === FS || "ErrnoError" !== e.name) throw e;
          return -e.errno;
        }
      }
      function ___syscall_mkdirat(e, r, t) {
        try {
          return (
            (r = SYSCALLS.getStr(r)),
            (r = SYSCALLS.calculateAt(e, r)),
            "/" === (r = PATH.normalize(r))[r.length - 1] &&
              (r = r.substr(0, r.length - 1)),
            FS.mkdir(r, t, 0),
            0
          );
        } catch (e) {
          if (void 0 === FS || "ErrnoError" !== e.name) throw e;
          return -e.errno;
        }
      }
      function ___syscall_newfstatat(e, r, t, n) {
        try {
          r = SYSCALLS.getStr(r);
          var o = 256 & n,
            a = 4096 & n;
          return (
            (n &= -6401),
            (r = SYSCALLS.calculateAt(e, r, a)),
            SYSCALLS.doStat(o ? FS.lstat : FS.stat, r, t)
          );
        } catch (e) {
          if (void 0 === FS || "ErrnoError" !== e.name) throw e;
          return -e.errno;
        }
      }
      function ___syscall_openat(e, r, t, n) {
        SYSCALLS.varargs = n;
        try {
          (r = SYSCALLS.getStr(r)), (r = SYSCALLS.calculateAt(e, r));
          var o = n ? SYSCALLS.get() : 0;
          return FS.open(r, t, o).fd;
        } catch (e) {
          if (void 0 === FS || "ErrnoError" !== e.name) throw e;
          return -e.errno;
        }
      }
      function ___syscall_renameat(e, r, t, n) {
        try {
          return (
            (r = SYSCALLS.getStr(r)),
            (n = SYSCALLS.getStr(n)),
            (r = SYSCALLS.calculateAt(e, r)),
            (n = SYSCALLS.calculateAt(t, n)),
            FS.rename(r, n),
            0
          );
        } catch (e) {
          if (void 0 === FS || "ErrnoError" !== e.name) throw e;
          return -e.errno;
        }
      }
      function ___syscall_rmdir(e) {
        try {
          return (e = SYSCALLS.getStr(e)), FS.rmdir(e), 0;
        } catch (e) {
          if (void 0 === FS || "ErrnoError" !== e.name) throw e;
          return -e.errno;
        }
      }
      function ___syscall_stat64(e, r) {
        try {
          return (e = SYSCALLS.getStr(e)), SYSCALLS.doStat(FS.stat, e, r);
        } catch (e) {
          if (void 0 === FS || "ErrnoError" !== e.name) throw e;
          return -e.errno;
        }
      }
      function ___syscall_unlinkat(e, r, t) {
        try {
          return (
            (r = SYSCALLS.getStr(r)),
            (r = SYSCALLS.calculateAt(e, r)),
            0 === t
              ? FS.unlink(r)
              : 512 === t
              ? FS.rmdir(r)
              : abort("Invalid flags passed to unlinkat"),
            0
          );
        } catch (e) {
          if (void 0 === FS || "ErrnoError" !== e.name) throw e;
          return -e.errno;
        }
      }
      var char_0 = 48,
        char_9 = 57,
        makeLegalFunctionName = (e) => {
          if (void 0 === e) return "_unknown";
          var r = (e = e.replace(/[^a-zA-Z0-9_]/g, "$")).charCodeAt(0);
          return r >= char_0 && r <= char_9 ? `_${e}` : e;
        };
      function createNamedFunction(e, r) {
        return {
          [(e = makeLegalFunctionName(e))]: function () {
            return r.apply(this, arguments);
          },
        }[e];
      }
      function handleAllocatorInit() {
        Object.assign(HandleAllocator.prototype, {
          get(e) {
            return this.allocated[e];
          },
          has(e) {
            return void 0 !== this.allocated[e];
          },
          allocate(e) {
            var r = this.freelist.pop() || this.allocated.length;
            return (this.allocated[r] = e), r;
          },
          free(e) {
            (this.allocated[e] = void 0), this.freelist.push(e);
          },
        });
      }
      function HandleAllocator() {
        (this.allocated = [void 0]), (this.freelist = []);
      }
      var emval_handles = new HandleAllocator(),
        BindingError,
        throwBindingError = (e) => {
          throw new BindingError(e);
        },
        count_emval_handles = () => {
          for (
            var e = 0, r = emval_handles.reserved;
            r < emval_handles.allocated.length;
            ++r
          )
            void 0 !== emval_handles.allocated[r] && ++e;
          return e;
        },
        init_emval = () => {
          emval_handles.allocated.push(
            { value: void 0 },
            { value: null },
            { value: !0 },
            { value: !1 },
          ),
            (emval_handles.reserved = emval_handles.allocated.length),
            (Module.count_emval_handles = count_emval_handles);
        },
        Emval = {
          toValue: (e) => (
            e || throwBindingError("Cannot use deleted val. handle = " + e),
            emval_handles.get(e).value
          ),
          toHandle: (e) => {
            switch (e) {
              case void 0:
                return 1;
              case null:
                return 2;
              case !0:
                return 3;
              case !1:
                return 4;
              default:
                return emval_handles.allocate({ refcount: 1, value: e });
            }
          },
        },
        extendError = (e, r) => {
          var t = createNamedFunction(r, function (e) {
            (this.name = r), (this.message = e);
            var t = new Error(e).stack;
            void 0 !== t &&
              (this.stack =
                this.toString() + "\n" + t.replace(/^Error(:[^\n]*)?\n/, ""));
          });
          return (
            (t.prototype = Object.create(e.prototype)),
            (t.prototype.constructor = t),
            (t.prototype.toString = function () {
              return void 0 === this.message
                ? this.name
                : `${this.name}: ${this.message}`;
            }),
            t
          );
        },
        PureVirtualError,
        embind_init_charCodes = () => {
          for (var e = new Array(256), r = 0; r < 256; ++r)
            e[r] = String.fromCharCode(r);
          embind_charCodes = e;
        },
        embind_charCodes,
        readLatin1String = (e) => {
          for (var r = "", t = e; HEAPU8[t]; )
            r += embind_charCodes[HEAPU8[t++]];
          return r;
        },
        getInheritedInstanceCount = () =>
          Object.keys(registeredInstances).length,
        getLiveInheritedInstances = () => {
          var e = [];
          for (var r in registeredInstances)
            registeredInstances.hasOwnProperty(r) &&
              e.push(registeredInstances[r]);
          return e;
        },
        deletionQueue = [],
        flushPendingDeletes = () => {
          for (; deletionQueue.length; ) {
            var e = deletionQueue.pop();
            (e.$$.deleteScheduled = !1), e.delete();
          }
        },
        delayFunction,
        setDelayFunction = (e) => {
          (delayFunction = e),
            deletionQueue.length &&
              delayFunction &&
              delayFunction(flushPendingDeletes);
        },
        init_embind = () => {
          (Module.getInheritedInstanceCount = getInheritedInstanceCount),
            (Module.getLiveInheritedInstances = getLiveInheritedInstances),
            (Module.flushPendingDeletes = flushPendingDeletes),
            (Module.setDelayFunction = setDelayFunction);
        },
        registeredInstances = {},
        getBasestPointer = (e, r) => {
          for (
            void 0 === r && throwBindingError("ptr should not be undefined");
            e.baseClass;

          )
            (r = e.upcast(r)), (e = e.baseClass);
          return r;
        },
        registerInheritedInstance = (e, r, t) => {
          (r = getBasestPointer(e, r)),
            registeredInstances.hasOwnProperty(r)
              ? throwBindingError(`Tried to register registered instance: ${r}`)
              : (registeredInstances[r] = t);
        },
        registeredTypes = {},
        getTypeName = (e) => {
          var r = ___getTypeName(e),
            t = readLatin1String(r);
          return _free(r), t;
        },
        requireRegisteredType = (e, r) => {
          var t = registeredTypes[e];
          return (
            void 0 === t &&
              throwBindingError(r + " has unknown type " + getTypeName(e)),
            t
          );
        },
        unregisterInheritedInstance = (e, r) => {
          (r = getBasestPointer(e, r)),
            registeredInstances.hasOwnProperty(r)
              ? delete registeredInstances[r]
              : throwBindingError(
                  `Tried to unregister unregistered instance: ${r}`,
                );
        },
        detachFinalizer = (e) => {},
        finalizationRegistry = !1,
        runDestructor = (e) => {
          e.smartPtr
            ? e.smartPtrType.rawDestructor(e.smartPtr)
            : e.ptrType.registeredClass.rawDestructor(e.ptr);
        },
        releaseClassHandle = (e) => {
          (e.count.value -= 1), 0 === e.count.value && runDestructor(e);
        },
        downcastPointer = (e, r, t) => {
          if (r === t) return e;
          if (void 0 === t.baseClass) return null;
          var n = downcastPointer(e, r, t.baseClass);
          return null === n ? null : t.downcast(n);
        },
        registeredPointers = {},
        getInheritedInstance = (e, r) => (
          (r = getBasestPointer(e, r)), registeredInstances[r]
        ),
        InternalError,
        throwInternalError = (e) => {
          throw new InternalError(e);
        },
        makeClassHandle = (e, r) => (
          (r.ptrType && r.ptr) ||
            throwInternalError("makeClassHandle requires ptr and ptrType"),
          !!r.smartPtrType !== !!r.smartPtr &&
            throwInternalError(
              "Both smartPtrType and smartPtr must be specified",
            ),
          (r.count = { value: 1 }),
          attachFinalizer(Object.create(e, { $$: { value: r } }))
        );
      function RegisteredPointer_fromWireType(e) {
        var r = this.getPointee(e);
        if (!r) return this.destructor(e), null;
        var t = getInheritedInstance(this.registeredClass, r);
        if (void 0 !== t) {
          if (0 === t.$$.count.value)
            return (t.$$.ptr = r), (t.$$.smartPtr = e), t.clone();
          var n = t.clone();
          return this.destructor(e), n;
        }
        function o() {
          return this.isSmartPointer
            ? makeClassHandle(this.registeredClass.instancePrototype, {
                ptrType: this.pointeeType,
                ptr: r,
                smartPtrType: this,
                smartPtr: e,
              })
            : makeClassHandle(this.registeredClass.instancePrototype, {
                ptrType: this,
                ptr: e,
              });
        }
        var a,
          i = this.registeredClass.getActualType(r),
          s = registeredPointers[i];
        if (!s) return o.call(this);
        a = this.isConst ? s.constPointerType : s.pointerType;
        var l = downcastPointer(r, this.registeredClass, a.registeredClass);
        return null === l
          ? o.call(this)
          : this.isSmartPointer
          ? makeClassHandle(a.registeredClass.instancePrototype, {
              ptrType: a,
              ptr: l,
              smartPtrType: this,
              smartPtr: e,
            })
          : makeClassHandle(a.registeredClass.instancePrototype, {
              ptrType: a,
              ptr: l,
            });
      }
      var attachFinalizer = (e) =>
          "undefined" == typeof FinalizationRegistry
            ? ((attachFinalizer = (e) => e), e)
            : ((finalizationRegistry = new FinalizationRegistry((e) => {
                releaseClassHandle(e.$$);
              })),
              (attachFinalizer = (e) => {
                var r = e.$$;
                if (!!r.smartPtr) {
                  var t = { $$: r };
                  finalizationRegistry.register(e, t, e);
                }
                return e;
              }),
              (detachFinalizer = (e) => finalizationRegistry.unregister(e)),
              attachFinalizer(e)),
        __embind_create_inheriting_constructor = (e, r, t) => {
          (e = readLatin1String(e)),
            (r = requireRegisteredType(r, "wrapper")),
            (t = Emval.toValue(t));
          var n = [].slice,
            o = r.registeredClass,
            a = o.instancePrototype,
            i = o.baseClass.instancePrototype,
            s = o.baseClass.constructor,
            l = createNamedFunction(e, function () {
              o.baseClass.pureVirtualFunctions.forEach(
                function (e) {
                  if (this[e] === i[e])
                    throw new PureVirtualError(
                      `Pure virtual function ${e} must be implemented in JavaScript`,
                    );
                }.bind(this),
              ),
                Object.defineProperty(this, "__parent", { value: a }),
                this.__construct.apply(this, n.call(arguments));
            });
          return (
            (a.__construct = function () {
              this === a &&
                throwBindingError("Pass correct 'this' to __construct");
              var e = s.implement.apply(
                void 0,
                [this].concat(n.call(arguments)),
              );
              detachFinalizer(e);
              var r = e.$$;
              e.notifyOnDestruction(),
                (r.preservePointerOnDelete = !0),
                Object.defineProperties(this, { $$: { value: r } }),
                attachFinalizer(this),
                registerInheritedInstance(o, r.ptr, this);
            }),
            (a.__destruct = function () {
              this === a &&
                throwBindingError("Pass correct 'this' to __destruct"),
                detachFinalizer(this),
                unregisterInheritedInstance(o, this.$$.ptr);
            }),
            (l.prototype = Object.create(a)),
            Object.assign(l.prototype, t),
            Emval.toHandle(l)
          );
        },
        structRegistrations = {},
        runDestructors = (e) => {
          for (; e.length; ) {
            var r = e.pop();
            e.pop()(r);
          }
        };
      function simpleReadValueFromPointer(e) {
        return this.fromWireType(HEAP32[e >> 2]);
      }
      var awaitingDependencies = {},
        typeDependencies = {},
        whenDependentTypesAreResolved = (e, r, t) => {
          function n(r) {
            var n = t(r);
            n.length !== e.length &&
              throwInternalError("Mismatched type converter count");
            for (var o = 0; o < e.length; ++o) registerType(e[o], n[o]);
          }
          e.forEach(function (e) {
            typeDependencies[e] = r;
          });
          var o = new Array(r.length),
            a = [],
            i = 0;
          r.forEach((e, r) => {
            registeredTypes.hasOwnProperty(e)
              ? (o[r] = registeredTypes[e])
              : (a.push(e),
                awaitingDependencies.hasOwnProperty(e) ||
                  (awaitingDependencies[e] = []),
                awaitingDependencies[e].push(() => {
                  (o[r] = registeredTypes[e]), ++i === a.length && n(o);
                }));
          }),
            0 === a.length && n(o);
        },
        __embind_finalize_value_object = (e) => {
          var r = structRegistrations[e];
          delete structRegistrations[e];
          var t = r.rawConstructor,
            n = r.rawDestructor,
            o = r.fields,
            a = o
              .map((e) => e.getterReturnType)
              .concat(o.map((e) => e.setterArgumentType));
          whenDependentTypesAreResolved([e], a, (e) => {
            var a = {};
            return (
              o.forEach((r, t) => {
                var n = r.fieldName,
                  i = e[t],
                  s = r.getter,
                  l = r.getterContext,
                  d = e[t + o.length],
                  u = r.setter,
                  c = r.setterContext;
                a[n] = {
                  read: (e) => i.fromWireType(s(l, e)),
                  write: (e, r) => {
                    var t = [];
                    u(c, e, d.toWireType(t, r)), runDestructors(t);
                  },
                };
              }),
              [
                {
                  name: r.name,
                  fromWireType: (e) => {
                    var r = {};
                    for (var t in a) r[t] = a[t].read(e);
                    return n(e), r;
                  },
                  toWireType: (e, r) => {
                    for (var o in a)
                      if (!(o in r))
                        throw new TypeError(`Missing field: "${o}"`);
                    var i = t();
                    for (o in a) a[o].write(i, r[o]);
                    return null !== e && e.push(n, i), i;
                  },
                  argPackAdvance: GenericWireTypeSize,
                  readValueFromPointer: simpleReadValueFromPointer,
                  destructorFunction: n,
                },
              ]
            );
          });
        },
        __embind_register_bigint = (e, r, t, n, o) => {};
      function sharedRegisterType(e, r, t = {}) {
        var n = r.name;
        if (
          (e ||
            throwBindingError(
              `type "${n}" must have a positive integer typeid pointer`,
            ),
          registeredTypes.hasOwnProperty(e))
        ) {
          if (t.ignoreDuplicateRegistrations) return;
          throwBindingError(`Cannot register type '${n}' twice`);
        }
        if (
          ((registeredTypes[e] = r),
          delete typeDependencies[e],
          awaitingDependencies.hasOwnProperty(e))
        ) {
          var o = awaitingDependencies[e];
          delete awaitingDependencies[e], o.forEach((e) => e());
        }
      }
      function registerType(e, r, t = {}) {
        if (!("argPackAdvance" in r))
          throw new TypeError(
            "registerType registeredInstance requires argPackAdvance",
          );
        return sharedRegisterType(e, r, t);
      }
      var GenericWireTypeSize = 8,
        __embind_register_bool = (e, r, t, n) => {
          registerType(e, {
            name: (r = readLatin1String(r)),
            fromWireType: function (e) {
              return !!e;
            },
            toWireType: function (e, r) {
              return r ? t : n;
            },
            argPackAdvance: GenericWireTypeSize,
            readValueFromPointer: function (e) {
              return this.fromWireType(HEAPU8[e]);
            },
            destructorFunction: null,
          });
        },
        shallowCopyInternalPointer = (e) => ({
          count: e.count,
          deleteScheduled: e.deleteScheduled,
          preservePointerOnDelete: e.preservePointerOnDelete,
          ptr: e.ptr,
          ptrType: e.ptrType,
          smartPtr: e.smartPtr,
          smartPtrType: e.smartPtrType,
        }),
        throwInstanceAlreadyDeleted = (e) => {
          throwBindingError(
            e.$$.ptrType.registeredClass.name + " instance already deleted",
          );
        },
        init_ClassHandle = () => {
          Object.assign(ClassHandle.prototype, {
            isAliasOf(e) {
              if (!(this instanceof ClassHandle)) return !1;
              if (!(e instanceof ClassHandle)) return !1;
              var r = this.$$.ptrType.registeredClass,
                t = this.$$.ptr;
              e.$$ = e.$$;
              for (
                var n = e.$$.ptrType.registeredClass, o = e.$$.ptr;
                r.baseClass;

              )
                (t = r.upcast(t)), (r = r.baseClass);
              for (; n.baseClass; ) (o = n.upcast(o)), (n = n.baseClass);
              return r === n && t === o;
            },
            clone() {
              if (
                (this.$$.ptr || throwInstanceAlreadyDeleted(this),
                this.$$.preservePointerOnDelete)
              )
                return (this.$$.count.value += 1), this;
              var e = attachFinalizer(
                Object.create(Object.getPrototypeOf(this), {
                  $$: { value: shallowCopyInternalPointer(this.$$) },
                }),
              );
              return (e.$$.count.value += 1), (e.$$.deleteScheduled = !1), e;
            },
            delete() {
              this.$$.ptr || throwInstanceAlreadyDeleted(this),
                this.$$.deleteScheduled &&
                  !this.$$.preservePointerOnDelete &&
                  throwBindingError("Object already scheduled for deletion"),
                detachFinalizer(this),
                releaseClassHandle(this.$$),
                this.$$.preservePointerOnDelete ||
                  ((this.$$.smartPtr = void 0), (this.$$.ptr = void 0));
            },
            isDeleted() {
              return !this.$$.ptr;
            },
            deleteLater() {
              return (
                this.$$.ptr || throwInstanceAlreadyDeleted(this),
                this.$$.deleteScheduled &&
                  !this.$$.preservePointerOnDelete &&
                  throwBindingError("Object already scheduled for deletion"),
                deletionQueue.push(this),
                1 === deletionQueue.length &&
                  delayFunction &&
                  delayFunction(flushPendingDeletes),
                (this.$$.deleteScheduled = !0),
                this
              );
            },
          });
        };
      function ClassHandle() {}
      var ensureOverloadTable = (e, r, t) => {
          if (void 0 === e[r].overloadTable) {
            var n = e[r];
            (e[r] = function () {
              return (
                e[r].overloadTable.hasOwnProperty(arguments.length) ||
                  throwBindingError(
                    `Function '${t}' called with an invalid number of arguments (${arguments.length}) - expects one of (${e[r].overloadTable})!`,
                  ),
                e[r].overloadTable[arguments.length].apply(this, arguments)
              );
            }),
              (e[r].overloadTable = []),
              (e[r].overloadTable[n.argCount] = n);
          }
        },
        exposePublicSymbol = (e, r, t) => {
          Module.hasOwnProperty(e)
            ? ((void 0 === t ||
                (void 0 !== Module[e].overloadTable &&
                  void 0 !== Module[e].overloadTable[t])) &&
                throwBindingError(`Cannot register public name '${e}' twice`),
              ensureOverloadTable(Module, e, e),
              Module.hasOwnProperty(t) &&
                throwBindingError(
                  `Cannot register multiple overloads of a function with the same number of arguments (${t})!`,
                ),
              (Module[e].overloadTable[t] = r))
            : ((Module[e] = r), void 0 !== t && (Module[e].numArguments = t));
        };
      function RegisteredClass(e, r, t, n, o, a, i, s) {
        (this.name = e),
          (this.constructor = r),
          (this.instancePrototype = t),
          (this.rawDestructor = n),
          (this.baseClass = o),
          (this.getActualType = a),
          (this.upcast = i),
          (this.downcast = s),
          (this.pureVirtualFunctions = []);
      }
      var upcastPointer = (e, r, t) => {
        for (; r !== t; )
          r.upcast ||
            throwBindingError(
              `Expected null or instance of ${t.name}, got an instance of ${r.name}`,
            ),
            (e = r.upcast(e)),
            (r = r.baseClass);
        return e;
      };
      function constNoSmartPtrRawPointerToWireType(e, r) {
        if (null === r)
          return (
            this.isReference &&
              throwBindingError(`null is not a valid ${this.name}`),
            0
          );
        r.$$ ||
          throwBindingError(`Cannot pass "${embindRepr(r)}" as a ${this.name}`),
          r.$$.ptr ||
            throwBindingError(
              `Cannot pass deleted object as a pointer of type ${this.name}`,
            );
        var t = r.$$.ptrType.registeredClass;
        return upcastPointer(r.$$.ptr, t, this.registeredClass);
      }
      function genericPointerToWireType(e, r) {
        var t;
        if (null === r)
          return (
            this.isReference &&
              throwBindingError(`null is not a valid ${this.name}`),
            this.isSmartPointer
              ? ((t = this.rawConstructor()),
                null !== e && e.push(this.rawDestructor, t),
                t)
              : 0
          );
        r.$$ ||
          throwBindingError(`Cannot pass "${embindRepr(r)}" as a ${this.name}`),
          r.$$.ptr ||
            throwBindingError(
              `Cannot pass deleted object as a pointer of type ${this.name}`,
            ),
          !this.isConst &&
            r.$$.ptrType.isConst &&
            throwBindingError(
              `Cannot convert argument of type ${
                r.$$.smartPtrType ? r.$$.smartPtrType.name : r.$$.ptrType.name
              } to parameter type ${this.name}`,
            );
        var n = r.$$.ptrType.registeredClass;
        if (
          ((t = upcastPointer(r.$$.ptr, n, this.registeredClass)),
          this.isSmartPointer)
        )
          switch (
            (void 0 === r.$$.smartPtr &&
              throwBindingError(
                "Passing raw pointer to smart pointer is illegal",
              ),
            this.sharingPolicy)
          ) {
            case 0:
              r.$$.smartPtrType === this
                ? (t = r.$$.smartPtr)
                : throwBindingError(
                    `Cannot convert argument of type ${
                      r.$$.smartPtrType
                        ? r.$$.smartPtrType.name
                        : r.$$.ptrType.name
                    } to parameter type ${this.name}`,
                  );
              break;
            case 1:
              t = r.$$.smartPtr;
              break;
            case 2:
              if (r.$$.smartPtrType === this) t = r.$$.smartPtr;
              else {
                var o = r.clone();
                (t = this.rawShare(
                  t,
                  Emval.toHandle(() => o.delete()),
                )),
                  null !== e && e.push(this.rawDestructor, t);
              }
              break;
            default:
              throwBindingError("Unsupporting sharing policy");
          }
        return t;
      }
      function nonConstNoSmartPtrRawPointerToWireType(e, r) {
        if (null === r)
          return (
            this.isReference &&
              throwBindingError(`null is not a valid ${this.name}`),
            0
          );
        r.$$ ||
          throwBindingError(`Cannot pass "${embindRepr(r)}" as a ${this.name}`),
          r.$$.ptr ||
            throwBindingError(
              `Cannot pass deleted object as a pointer of type ${this.name}`,
            ),
          r.$$.ptrType.isConst &&
            throwBindingError(
              `Cannot convert argument of type ${r.$$.ptrType.name} to parameter type ${this.name}`,
            );
        var t = r.$$.ptrType.registeredClass;
        return upcastPointer(r.$$.ptr, t, this.registeredClass);
      }
      function readPointer(e) {
        return this.fromWireType(HEAPU32[e >> 2]);
      }
      var init_RegisteredPointer = () => {
        Object.assign(RegisteredPointer.prototype, {
          getPointee(e) {
            return this.rawGetPointee && (e = this.rawGetPointee(e)), e;
          },
          destructor(e) {
            this.rawDestructor && this.rawDestructor(e);
          },
          argPackAdvance: GenericWireTypeSize,
          readValueFromPointer: readPointer,
          deleteObject(e) {
            null !== e && e.delete();
          },
          fromWireType: RegisteredPointer_fromWireType,
        });
      };
      function RegisteredPointer(e, r, t, n, o, a, i, s, l, d, u) {
        (this.name = e),
          (this.registeredClass = r),
          (this.isReference = t),
          (this.isConst = n),
          (this.isSmartPointer = o),
          (this.pointeeType = a),
          (this.sharingPolicy = i),
          (this.rawGetPointee = s),
          (this.rawConstructor = l),
          (this.rawShare = d),
          (this.rawDestructor = u),
          o || void 0 !== r.baseClass
            ? (this.toWireType = genericPointerToWireType)
            : n
            ? ((this.toWireType = constNoSmartPtrRawPointerToWireType),
              (this.destructorFunction = null))
            : ((this.toWireType = nonConstNoSmartPtrRawPointerToWireType),
              (this.destructorFunction = null));
      }
      var replacePublicSymbol = (e, r, t) => {
          Module.hasOwnProperty(e) ||
            throwInternalError("Replacing nonexistant public symbol"),
            void 0 !== Module[e].overloadTable && void 0 !== t
              ? (Module[e].overloadTable[t] = r)
              : ((Module[e] = r), (Module[e].argCount = t));
        },
        dynCallLegacy = (e, r, t) => {
          var n = Module["dynCall_" + e];
          return t && t.length ? n.apply(null, [r].concat(t)) : n.call(null, r);
        },
        wasmTable,
        getWasmTableEntry = (e) => wasmTable.get(e),
        dynCall = (e, r, t) =>
          e.includes("j")
            ? dynCallLegacy(e, r, t)
            : getWasmTableEntry(r).apply(null, t),
        getDynCaller = (e, r) => {
          var t = [];
          return function () {
            return (
              (t.length = 0), Object.assign(t, arguments), dynCall(e, r, t)
            );
          };
        },
        embind__requireFunction = (e, r) => {
          var t = (e = readLatin1String(e)).includes("j")
            ? getDynCaller(e, r)
            : getWasmTableEntry(r);
          return (
            "function" != typeof t &&
              throwBindingError(
                `unknown function pointer with signature ${e}: ${r}`,
              ),
            t
          );
        },
        UnboundTypeError,
        throwUnboundTypeError = (e, r) => {
          var t = [],
            n = {};
          throw (
            (r.forEach(function e(r) {
              n[r] ||
                registeredTypes[r] ||
                (typeDependencies[r]
                  ? typeDependencies[r].forEach(e)
                  : (t.push(r), (n[r] = !0)));
            }),
            new UnboundTypeError(`${e}: ` + t.map(getTypeName).join([", "])))
          );
        },
        __embind_register_class = (e, r, t, n, o, a, i, s, l, d, u, c, m) => {
          (u = readLatin1String(u)),
            (a = embind__requireFunction(o, a)),
            s && (s = embind__requireFunction(i, s)),
            d && (d = embind__requireFunction(l, d)),
            (m = embind__requireFunction(c, m));
          var p = makeLegalFunctionName(u);
          exposePublicSymbol(p, function () {
            throwUnboundTypeError(
              `Cannot construct ${u} due to unbound types`,
              [n],
            );
          }),
            whenDependentTypesAreResolved(
              [e, r, t],
              n ? [n] : [],
              function (r) {
                var t, o;
                (r = r[0]),
                  (o = n
                    ? (t = r.registeredClass).instancePrototype
                    : ClassHandle.prototype);
                var i = createNamedFunction(p, function () {
                    if (Object.getPrototypeOf(this) !== l)
                      throw new BindingError("Use 'new' to construct " + u);
                    if (void 0 === c.constructor_body)
                      throw new BindingError(
                        u + " has no accessible constructor",
                      );
                    var e = c.constructor_body[arguments.length];
                    if (void 0 === e)
                      throw new BindingError(
                        `Tried to invoke ctor of ${u} with invalid number of parameters (${
                          arguments.length
                        }) - expected (${Object.keys(
                          c.constructor_body,
                        ).toString()}) parameters instead!`,
                      );
                    return e.apply(this, arguments);
                  }),
                  l = Object.create(o, { constructor: { value: i } });
                i.prototype = l;
                var c = new RegisteredClass(u, i, l, m, t, a, s, d);
                c.baseClass &&
                  (void 0 === c.baseClass.__derivedClasses &&
                    (c.baseClass.__derivedClasses = []),
                  c.baseClass.__derivedClasses.push(c));
                var _ = new RegisteredPointer(u, c, !0, !1, !1),
                  h = new RegisteredPointer(u + "*", c, !1, !1, !1),
                  f = new RegisteredPointer(u + " const*", c, !1, !0, !1);
                return (
                  (registeredPointers[e] = {
                    pointerType: h,
                    constPointerType: f,
                  }),
                  replacePublicSymbol(p, i),
                  [_, h, f]
                );
              },
            );
        };
      function newFunc(e, r) {
        if (!(e instanceof Function))
          throw new TypeError(
            `new_ called with constructor type ${typeof e} which is not a function`,
          );
        var t = createNamedFunction(
          e.name || "unknownFunctionName",
          function () {},
        );
        t.prototype = e.prototype;
        var n = new t(),
          o = e.apply(n, r);
        return o instanceof Object ? o : n;
      }
      function craftInvokerFunction(e, r, t, n, o, a) {
        var i = r.length;
        i < 2 &&
          throwBindingError(
            "argTypes array size mismatch! Must at least get return value and 'this' types!",
          );
        for (
          var s = null !== r[1] && null !== t, l = !1, d = 1;
          d < r.length;
          ++d
        )
          if (null !== r[d] && void 0 === r[d].destructorFunction) {
            l = !0;
            break;
          }
        var u = "void" !== r[0].name,
          c = "",
          m = "";
        for (d = 0; d < i - 2; ++d)
          (c += (0 !== d ? ", " : "") + "arg" + d),
            (m += (0 !== d ? ", " : "") + "arg" + d + "Wired");
        var p = `\n        return function ${makeLegalFunctionName(
          e,
        )}(${c}) {\n        if (arguments.length !== ${
          i - 2
        }) {\n          throwBindingError('function ${e} called with ' + arguments.length + ' arguments, expected ${
          i - 2
        }');\n        }`;
        l && (p += "var destructors = [];\n");
        var _ = l ? "destructors" : "null",
          h = [
            "throwBindingError",
            "invoker",
            "fn",
            "runDestructors",
            "retType",
            "classParam",
          ],
          f = [throwBindingError, n, o, runDestructors, r[0], r[1]];
        s && (p += "var thisWired = classParam.toWireType(" + _ + ", this);\n");
        for (d = 0; d < i - 2; ++d)
          (p +=
            "var arg" +
            d +
            "Wired = argType" +
            d +
            ".toWireType(" +
            _ +
            ", arg" +
            d +
            "); // " +
            r[d + 2].name +
            "\n"),
            h.push("argType" + d),
            f.push(r[d + 2]);
        if (
          (s && (m = "thisWired" + (m.length > 0 ? ", " : "") + m),
          (p +=
            (u || a ? "var rv = " : "") +
            "invoker(fn" +
            (m.length > 0 ? ", " : "") +
            m +
            ");\n"),
          l)
        )
          p += "runDestructors(destructors);\n";
        else
          for (d = s ? 1 : 2; d < r.length; ++d) {
            var y = 1 === d ? "thisWired" : "arg" + (d - 2) + "Wired";
            null !== r[d].destructorFunction &&
              ((p += y + "_dtor(" + y + "); // " + r[d].name + "\n"),
              h.push(y + "_dtor"),
              f.push(r[d].destructorFunction));
          }
        return (
          u && (p += "var ret = retType.fromWireType(rv);\nreturn ret;\n"),
          (p += "}\n"),
          h.push(p),
          newFunc(Function, h).apply(null, f)
        );
      }
      var heap32VectorToArray = (e, r) => {
          for (var t = [], n = 0; n < e; n++) t.push(HEAPU32[(r + 4 * n) >> 2]);
          return t;
        },
        __embind_register_class_class_function = (e, r, t, n, o, a, i, s) => {
          var l = heap32VectorToArray(t, n);
          (r = readLatin1String(r)),
            (a = embind__requireFunction(o, a)),
            whenDependentTypesAreResolved([], [e], function (e) {
              var n = `${(e = e[0]).name}.${r}`;
              function o() {
                throwUnboundTypeError(
                  `Cannot call ${n} due to unbound types`,
                  l,
                );
              }
              r.startsWith("@@") && (r = Symbol[r.substring(2)]);
              var d = e.registeredClass.constructor;
              return (
                void 0 === d[r]
                  ? ((o.argCount = t - 1), (d[r] = o))
                  : (ensureOverloadTable(d, r, n),
                    (d[r].overloadTable[t - 1] = o)),
                whenDependentTypesAreResolved([], l, function (o) {
                  var l = [o[0], null].concat(o.slice(1)),
                    u = craftInvokerFunction(n, l, null, a, i, s);
                  if (
                    (void 0 === d[r].overloadTable
                      ? ((u.argCount = t - 1), (d[r] = u))
                      : (d[r].overloadTable[t - 1] = u),
                    e.registeredClass.__derivedClasses)
                  )
                    for (const t of e.registeredClass.__derivedClasses)
                      t.constructor.hasOwnProperty(r) || (t.constructor[r] = u);
                  return [];
                }),
                []
              );
            });
        },
        __embind_register_class_constructor = (e, r, t, n, o, a) => {
          var i = heap32VectorToArray(r, t);
          (o = embind__requireFunction(n, o)),
            whenDependentTypesAreResolved([], [e], function (e) {
              var t = `constructor ${(e = e[0]).name}`;
              if (
                (void 0 === e.registeredClass.constructor_body &&
                  (e.registeredClass.constructor_body = []),
                void 0 !== e.registeredClass.constructor_body[r - 1])
              )
                throw new BindingError(
                  `Cannot register multiple constructors with identical number of parameters (${
                    r - 1
                  }) for class '${
                    e.name
                  }'! Overload resolution is currently only performed using the parameter count, not actual type info!`,
                );
              return (
                (e.registeredClass.constructor_body[r - 1] = () => {
                  throwUnboundTypeError(
                    `Cannot construct ${e.name} due to unbound types`,
                    i,
                  );
                }),
                whenDependentTypesAreResolved(
                  [],
                  i,
                  (n) => (
                    n.splice(1, 0, null),
                    (e.registeredClass.constructor_body[r - 1] =
                      craftInvokerFunction(t, n, null, o, a)),
                    []
                  ),
                ),
                []
              );
            });
        },
        __embind_register_class_function = (e, r, t, n, o, a, i, s, l) => {
          var d = heap32VectorToArray(t, n);
          (r = readLatin1String(r)),
            (a = embind__requireFunction(o, a)),
            whenDependentTypesAreResolved([], [e], function (e) {
              var n = `${(e = e[0]).name}.${r}`;
              function o() {
                throwUnboundTypeError(
                  `Cannot call ${n} due to unbound types`,
                  d,
                );
              }
              r.startsWith("@@") && (r = Symbol[r.substring(2)]),
                s && e.registeredClass.pureVirtualFunctions.push(r);
              var u = e.registeredClass.instancePrototype,
                c = u[r];
              return (
                void 0 === c ||
                (void 0 === c.overloadTable &&
                  c.className !== e.name &&
                  c.argCount === t - 2)
                  ? ((o.argCount = t - 2), (o.className = e.name), (u[r] = o))
                  : (ensureOverloadTable(u, r, n),
                    (u[r].overloadTable[t - 2] = o)),
                whenDependentTypesAreResolved([], d, function (o) {
                  var s = craftInvokerFunction(n, o, e, a, i, l);
                  return (
                    void 0 === u[r].overloadTable
                      ? ((s.argCount = t - 2), (u[r] = s))
                      : (u[r].overloadTable[t - 2] = s),
                    []
                  );
                }),
                []
              );
            });
        },
        validateThis = (e, r, t) => (
          e instanceof Object ||
            throwBindingError(`${t} with invalid "this": ${e}`),
          e instanceof r.registeredClass.constructor ||
            throwBindingError(
              `${t} incompatible with "this" of type ${e.constructor.name}`,
            ),
          e.$$.ptr ||
            throwBindingError(
              `cannot call emscripten binding method ${t} on deleted object`,
            ),
          upcastPointer(
            e.$$.ptr,
            e.$$.ptrType.registeredClass,
            r.registeredClass,
          )
        ),
        __embind_register_class_property = (e, r, t, n, o, a, i, s, l, d) => {
          (r = readLatin1String(r)),
            (o = embind__requireFunction(n, o)),
            whenDependentTypesAreResolved([], [e], function (e) {
              var n = `${(e = e[0]).name}.${r}`,
                u = {
                  get() {
                    throwUnboundTypeError(
                      `Cannot access ${n} due to unbound types`,
                      [t, i],
                    );
                  },
                  enumerable: !0,
                  configurable: !0,
                };
              return (
                (u.set = l
                  ? () =>
                      throwUnboundTypeError(
                        `Cannot access ${n} due to unbound types`,
                        [t, i],
                      )
                  : (e) => throwBindingError(n + " is a read-only property")),
                Object.defineProperty(
                  e.registeredClass.instancePrototype,
                  r,
                  u,
                ),
                whenDependentTypesAreResolved(
                  [],
                  l ? [t, i] : [t],
                  function (t) {
                    var i = t[0],
                      u = {
                        get() {
                          var r = validateThis(this, e, n + " getter");
                          return i.fromWireType(o(a, r));
                        },
                        enumerable: !0,
                      };
                    if (l) {
                      l = embind__requireFunction(s, l);
                      var c = t[1];
                      u.set = function (r) {
                        var t = validateThis(this, e, n + " setter"),
                          o = [];
                        l(d, t, c.toWireType(o, r)), runDestructors(o);
                      };
                    }
                    return (
                      Object.defineProperty(
                        e.registeredClass.instancePrototype,
                        r,
                        u,
                      ),
                      []
                    );
                  },
                ),
                []
              );
            });
        },
        __emval_decref = (e) => {
          e >= emval_handles.reserved &&
            0 == --emval_handles.get(e).refcount &&
            emval_handles.free(e);
        },
        __embind_register_emval = (e, r) => {
          registerType(e, {
            name: (r = readLatin1String(r)),
            fromWireType: (e) => {
              var r = Emval.toValue(e);
              return __emval_decref(e), r;
            },
            toWireType: (e, r) => Emval.toHandle(r),
            argPackAdvance: GenericWireTypeSize,
            readValueFromPointer: simpleReadValueFromPointer,
            destructorFunction: null,
          });
        },
        embindRepr = (e) => {
          if (null === e) return "null";
          var r = typeof e;
          return "object" === r || "array" === r || "function" === r
            ? e.toString()
            : "" + e;
        },
        floatReadValueFromPointer = (e, r) => {
          switch (r) {
            case 4:
              return function (e) {
                return this.fromWireType(HEAPF32[e >> 2]);
              };
            case 8:
              return function (e) {
                return this.fromWireType(HEAPF64[e >> 3]);
              };
            default:
              throw new TypeError(`invalid float width (${r}): ${e}`);
          }
        },
        __embind_register_float = (e, r, t) => {
          registerType(e, {
            name: (r = readLatin1String(r)),
            fromWireType: (e) => e,
            toWireType: (e, r) => r,
            argPackAdvance: GenericWireTypeSize,
            readValueFromPointer: floatReadValueFromPointer(r, t),
            destructorFunction: null,
          });
        },
        __embind_register_function = (e, r, t, n, o, a, i) => {
          var s = heap32VectorToArray(r, t);
          (e = readLatin1String(e)),
            (o = embind__requireFunction(n, o)),
            exposePublicSymbol(
              e,
              function () {
                throwUnboundTypeError(
                  `Cannot call ${e} due to unbound types`,
                  s,
                );
              },
              r - 1,
            ),
            whenDependentTypesAreResolved([], s, function (t) {
              var n = [t[0], null].concat(t.slice(1));
              return (
                replacePublicSymbol(
                  e,
                  craftInvokerFunction(e, n, null, o, a, i),
                  r - 1,
                ),
                []
              );
            });
        },
        integerReadValueFromPointer = (e, r, t) => {
          switch (r) {
            case 1:
              return t ? (e) => HEAP8[e >> 0] : (e) => HEAPU8[e >> 0];
            case 2:
              return t ? (e) => HEAP16[e >> 1] : (e) => HEAPU16[e >> 1];
            case 4:
              return t ? (e) => HEAP32[e >> 2] : (e) => HEAPU32[e >> 2];
            default:
              throw new TypeError(`invalid integer width (${r}): ${e}`);
          }
        },
        __embind_register_integer = (e, r, t, n, o) => {
          (r = readLatin1String(r)), -1 === o && (o = 4294967295);
          var a = (e) => e;
          if (0 === n) {
            var i = 32 - 8 * t;
            a = (e) => (e << i) >>> i;
          }
          var s = r.includes("unsigned");
          registerType(e, {
            name: r,
            fromWireType: a,
            toWireType: s
              ? function (e, r) {
                  return this.name, r >>> 0;
                }
              : function (e, r) {
                  return this.name, r;
                },
            argPackAdvance: GenericWireTypeSize,
            readValueFromPointer: integerReadValueFromPointer(r, t, 0 !== n),
            destructorFunction: null,
          });
        },
        __embind_register_memory_view = (e, r, t) => {
          var n = [
            Int8Array,
            Uint8Array,
            Int16Array,
            Uint16Array,
            Int32Array,
            Uint32Array,
            Float32Array,
            Float64Array,
          ][r];
          function o(e) {
            var r = HEAPU32[e >> 2],
              t = HEAPU32[(e + 4) >> 2];
            return new n(HEAP8.buffer, t, r);
          }
          registerType(
            e,
            {
              name: (t = readLatin1String(t)),
              fromWireType: o,
              argPackAdvance: GenericWireTypeSize,
              readValueFromPointer: o,
            },
            { ignoreDuplicateRegistrations: !0 },
          );
        },
        __embind_register_smart_ptr = (e, r, t, n, o, a, i, s, l, d, u, c) => {
          (t = readLatin1String(t)),
            (a = embind__requireFunction(o, a)),
            (s = embind__requireFunction(i, s)),
            (d = embind__requireFunction(l, d)),
            (c = embind__requireFunction(u, c)),
            whenDependentTypesAreResolved([e], [r], function (e) {
              return (
                (e = e[0]),
                [
                  new RegisteredPointer(
                    t,
                    e.registeredClass,
                    !1,
                    !1,
                    !0,
                    e,
                    n,
                    a,
                    s,
                    d,
                    c,
                  ),
                ]
              );
            });
        },
        __embind_register_std_string = (e, r) => {
          var t = "std::string" === (r = readLatin1String(r));
          registerType(e, {
            name: r,
            fromWireType(e) {
              var r,
                n = HEAPU32[e >> 2],
                o = e + 4;
              if (t)
                for (var a = o, i = 0; i <= n; ++i) {
                  var s = o + i;
                  if (i == n || 0 == HEAPU8[s]) {
                    var l = UTF8ToString(a, s - a);
                    void 0 === r
                      ? (r = l)
                      : ((r += String.fromCharCode(0)), (r += l)),
                      (a = s + 1);
                  }
                }
              else {
                var d = new Array(n);
                for (i = 0; i < n; ++i)
                  d[i] = String.fromCharCode(HEAPU8[o + i]);
                r = d.join("");
              }
              return _free(e), r;
            },
            toWireType(e, r) {
              var n;
              r instanceof ArrayBuffer && (r = new Uint8Array(r));
              var o = "string" == typeof r;
              o ||
                r instanceof Uint8Array ||
                r instanceof Uint8ClampedArray ||
                r instanceof Int8Array ||
                throwBindingError("Cannot pass non-string to std::string"),
                (n = t && o ? lengthBytesUTF8(r) : r.length);
              var a = _malloc(4 + n + 1),
                i = a + 4;
              if (((HEAPU32[a >> 2] = n), t && o)) stringToUTF8(r, i, n + 1);
              else if (o)
                for (var s = 0; s < n; ++s) {
                  var l = r.charCodeAt(s);
                  l > 255 &&
                    (_free(i),
                    throwBindingError(
                      "String has UTF-16 code units that do not fit in 8 bits",
                    )),
                    (HEAPU8[i + s] = l);
                }
              else for (s = 0; s < n; ++s) HEAPU8[i + s] = r[s];
              return null !== e && e.push(_free, a), a;
            },
            argPackAdvance: GenericWireTypeSize,
            readValueFromPointer: readPointer,
            destructorFunction(e) {
              _free(e);
            },
          });
        },
        UTF16Decoder =
          "undefined" != typeof TextDecoder
            ? new TextDecoder("utf-16le")
            : void 0,
        UTF16ToString = (e, r) => {
          for (var t = e, n = t >> 1, o = n + r / 2; !(n >= o) && HEAPU16[n]; )
            ++n;
          if ((t = n << 1) - e > 32 && UTF16Decoder)
            return UTF16Decoder.decode(HEAPU8.subarray(e, t));
          for (var a = "", i = 0; !(i >= r / 2); ++i) {
            var s = HEAP16[(e + 2 * i) >> 1];
            if (0 == s) break;
            a += String.fromCharCode(s);
          }
          return a;
        },
        stringToUTF16 = (e, r, t) => {
          if ((void 0 === t && (t = 2147483647), t < 2)) return 0;
          for (
            var n = r, o = (t -= 2) < 2 * e.length ? t / 2 : e.length, a = 0;
            a < o;
            ++a
          ) {
            var i = e.charCodeAt(a);
            (HEAP16[r >> 1] = i), (r += 2);
          }
          return (HEAP16[r >> 1] = 0), r - n;
        },
        lengthBytesUTF16 = (e) => 2 * e.length,
        UTF32ToString = (e, r) => {
          for (var t = 0, n = ""; !(t >= r / 4); ) {
            var o = HEAP32[(e + 4 * t) >> 2];
            if (0 == o) break;
            if ((++t, o >= 65536)) {
              var a = o - 65536;
              n += String.fromCharCode(55296 | (a >> 10), 56320 | (1023 & a));
            } else n += String.fromCharCode(o);
          }
          return n;
        },
        stringToUTF32 = (e, r, t) => {
          if ((void 0 === t && (t = 2147483647), t < 4)) return 0;
          for (var n = r, o = n + t - 4, a = 0; a < e.length; ++a) {
            var i = e.charCodeAt(a);
            if (i >= 55296 && i <= 57343)
              i = (65536 + ((1023 & i) << 10)) | (1023 & e.charCodeAt(++a));
            if (((HEAP32[r >> 2] = i), (r += 4) + 4 > o)) break;
          }
          return (HEAP32[r >> 2] = 0), r - n;
        },
        lengthBytesUTF32 = (e) => {
          for (var r = 0, t = 0; t < e.length; ++t) {
            var n = e.charCodeAt(t);
            n >= 55296 && n <= 57343 && ++t, (r += 4);
          }
          return r;
        },
        __embind_register_std_wstring = (e, r, t) => {
          var n, o, a, i, s;
          (t = readLatin1String(t)),
            2 === r
              ? ((n = UTF16ToString),
                (o = stringToUTF16),
                (i = lengthBytesUTF16),
                (a = () => HEAPU16),
                (s = 1))
              : 4 === r &&
                ((n = UTF32ToString),
                (o = stringToUTF32),
                (i = lengthBytesUTF32),
                (a = () => HEAPU32),
                (s = 2)),
            registerType(e, {
              name: t,
              fromWireType: (e) => {
                for (
                  var t, o = HEAPU32[e >> 2], i = a(), l = e + 4, d = 0;
                  d <= o;
                  ++d
                ) {
                  var u = e + 4 + d * r;
                  if (d == o || 0 == i[u >> s]) {
                    var c = n(l, u - l);
                    void 0 === t
                      ? (t = c)
                      : ((t += String.fromCharCode(0)), (t += c)),
                      (l = u + r);
                  }
                }
                return _free(e), t;
              },
              toWireType: (e, n) => {
                "string" != typeof n &&
                  throwBindingError(
                    `Cannot pass non-string to C++ string type ${t}`,
                  );
                var a = i(n),
                  l = _malloc(4 + a + r);
                return (
                  (HEAPU32[l >> 2] = a >> s),
                  o(n, l + 4, a + r),
                  null !== e && e.push(_free, l),
                  l
                );
              },
              argPackAdvance: GenericWireTypeSize,
              readValueFromPointer: simpleReadValueFromPointer,
              destructorFunction(e) {
                _free(e);
              },
            });
        },
        __embind_register_value_object = (e, r, t, n, o, a) => {
          structRegistrations[e] = {
            name: readLatin1String(r),
            rawConstructor: embind__requireFunction(t, n),
            rawDestructor: embind__requireFunction(o, a),
            fields: [],
          };
        },
        __embind_register_value_object_field = (
          e,
          r,
          t,
          n,
          o,
          a,
          i,
          s,
          l,
          d,
        ) => {
          structRegistrations[e].fields.push({
            fieldName: readLatin1String(r),
            getterReturnType: t,
            getter: embind__requireFunction(n, o),
            getterContext: a,
            setterArgumentType: i,
            setter: embind__requireFunction(s, l),
            setterContext: d,
          });
        },
        __embind_register_void = (e, r) => {
          registerType(e, {
            isVoid: !0,
            name: (r = readLatin1String(r)),
            argPackAdvance: 0,
            fromWireType: () => {},
            toWireType: (e, r) => {},
          });
        },
        __emscripten_fs_load_embedded_files = (e) => {
          do {
            var r = HEAPU32[e >> 2],
              t = HEAPU32[(e += 4) >> 2],
              n = HEAPU32[(e += 4) >> 2];
            e += 4;
            var o = UTF8ToString(r);
            FS.createPath("/", PATH.dirname(o), !0, !0),
              FS.createDataFile(o, null, HEAP8.subarray(n, n + t), !0, !0, !0);
          } while (HEAPU32[e >> 2]);
        },
        nowIsMonotonic = !0,
        __emscripten_get_now_is_monotonic = () => nowIsMonotonic,
        __emval_as = (e, r, t) => {
          (e = Emval.toValue(e)), (r = requireRegisteredType(r, "emval::as"));
          var n = [],
            o = Emval.toHandle(n);
          return (HEAPU32[t >> 2] = o), r.toWireType(n, e);
        },
        emval_lookupTypes = (e, r) => {
          for (var t = new Array(e), n = 0; n < e; ++n)
            t[n] = requireRegisteredType(
              HEAPU32[(r + 4 * n) >> 2],
              "parameter " + n,
            );
          return t;
        },
        __emval_call = (e, r, t, n) => {
          e = Emval.toValue(e);
          for (
            var o = emval_lookupTypes(r, t), a = new Array(r), i = 0;
            i < r;
            ++i
          ) {
            var s = o[i];
            (a[i] = s.readValueFromPointer(n)), (n += s.argPackAdvance);
          }
          var l = e.apply(void 0, a);
          return Emval.toHandle(l);
        },
        emval_allocateDestructors = (e) => {
          var r = [];
          return (HEAPU32[e >> 2] = Emval.toHandle(r)), r;
        },
        emval_symbols = {},
        getStringOrSymbol = (e) => {
          var r = emval_symbols[e];
          return void 0 === r ? readLatin1String(e) : r;
        },
        emval_methodCallers = [],
        __emval_call_method = (e, r, t, n, o) =>
          (e = emval_methodCallers[e])(
            (r = Emval.toValue(r)),
            (t = getStringOrSymbol(t)),
            emval_allocateDestructors(n),
            o,
          ),
        __emval_call_void_method = (e, r, t, n) => {
          (e = emval_methodCallers[e])(
            (r = Emval.toValue(r)),
            (t = getStringOrSymbol(t)),
            null,
            n,
          );
        },
        emval_get_global = () =>
          "object" == typeof globalThis
            ? globalThis
            : Function("return this")(),
        __emval_get_global = (e) =>
          0 === e
            ? Emval.toHandle(emval_get_global())
            : ((e = getStringOrSymbol(e)),
              Emval.toHandle(emval_get_global()[e])),
        emval_addMethodCaller = (e) => {
          var r = emval_methodCallers.length;
          return emval_methodCallers.push(e), r;
        },
        emval_registeredMethods = {},
        __emval_get_method_caller = (e, r) => {
          var t = emval_lookupTypes(e, r),
            n = t[0],
            o =
              n.name +
              "_$" +
              t
                .slice(1)
                .map(function (e) {
                  return e.name;
                })
                .join("_") +
              "$",
            a = emval_registeredMethods[o];
          if (void 0 !== a) return a;
          for (var i = ["retType"], s = [n], l = "", d = 0; d < e - 1; ++d)
            (l += (0 !== d ? ", " : "") + "arg" + d),
              i.push("argType" + d),
              s.push(t[1 + d]);
          var u =
              "return function " +
              makeLegalFunctionName("methodCaller_" + o) +
              "(handle, name, destructors, args) {\n",
            c = 0;
          for (d = 0; d < e - 1; ++d)
            (u +=
              "    var arg" +
              d +
              " = argType" +
              d +
              ".readValueFromPointer(args" +
              (c ? "+" + c : "") +
              ");\n"),
              (c += t[d + 1].argPackAdvance);
          u += "    var rv = handle[name](" + l + ");\n";
          for (d = 0; d < e - 1; ++d)
            t[d + 1].deleteObject &&
              (u += "    argType" + d + ".deleteObject(arg" + d + ");\n");
          n.isVoid ||
            (u += "    return retType.toWireType(destructors, rv);\n"),
            (u += "};\n"),
            i.push(u);
          var m = newFunc(Function, i).apply(null, s);
          return (
            (a = emval_addMethodCaller(m)), (emval_registeredMethods[o] = a), a
          );
        },
        __emval_get_property = (e, r) => (
          (e = Emval.toValue(e)), (r = Emval.toValue(r)), Emval.toHandle(e[r])
        ),
        __emval_incref = (e) => {
          e > 4 && (emval_handles.get(e).refcount += 1);
        },
        __emval_new_cstring = (e) => Emval.toHandle(getStringOrSymbol(e)),
        __emval_run_destructors = (e) => {
          var r = Emval.toValue(e);
          runDestructors(r), __emval_decref(e);
        },
        __emval_take_value = (e, r) => {
          var t = (e = requireRegisteredType(
            e,
            "_emval_take_value",
          )).readValueFromPointer(r);
          return Emval.toHandle(t);
        },
        __emval_typeof = (e) => (
          (e = Emval.toValue(e)), Emval.toHandle(typeof e)
        );
      function __gmtime_js(e, r, t) {
        var n = convertI32PairToI53Checked(e, r),
          o = new Date(1e3 * n);
        (HEAP32[t >> 2] = o.getUTCSeconds()),
          (HEAP32[(t + 4) >> 2] = o.getUTCMinutes()),
          (HEAP32[(t + 8) >> 2] = o.getUTCHours()),
          (HEAP32[(t + 12) >> 2] = o.getUTCDate()),
          (HEAP32[(t + 16) >> 2] = o.getUTCMonth()),
          (HEAP32[(t + 20) >> 2] = o.getUTCFullYear() - 1900),
          (HEAP32[(t + 24) >> 2] = o.getUTCDay());
        var a = Date.UTC(o.getUTCFullYear(), 0, 1, 0, 0, 0, 0),
          i = ((o.getTime() - a) / 864e5) | 0;
        HEAP32[(t + 28) >> 2] = i;
      }
      var isLeapYear = (e) => e % 4 == 0 && (e % 100 != 0 || e % 400 == 0),
        MONTH_DAYS_LEAP_CUMULATIVE = [
          0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335,
        ],
        MONTH_DAYS_REGULAR_CUMULATIVE = [
          0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334,
        ],
        ydayFromDate = (e) =>
          (isLeapYear(e.getFullYear())
            ? MONTH_DAYS_LEAP_CUMULATIVE
            : MONTH_DAYS_REGULAR_CUMULATIVE)[e.getMonth()] +
          e.getDate() -
          1;
      function __localtime_js(e, r, t) {
        var n = convertI32PairToI53Checked(e, r),
          o = new Date(1e3 * n);
        (HEAP32[t >> 2] = o.getSeconds()),
          (HEAP32[(t + 4) >> 2] = o.getMinutes()),
          (HEAP32[(t + 8) >> 2] = o.getHours()),
          (HEAP32[(t + 12) >> 2] = o.getDate()),
          (HEAP32[(t + 16) >> 2] = o.getMonth()),
          (HEAP32[(t + 20) >> 2] = o.getFullYear() - 1900),
          (HEAP32[(t + 24) >> 2] = o.getDay());
        var a = 0 | ydayFromDate(o);
        (HEAP32[(t + 28) >> 2] = a),
          (HEAP32[(t + 36) >> 2] = -60 * o.getTimezoneOffset());
        var i = new Date(o.getFullYear(), 0, 1),
          s = new Date(o.getFullYear(), 6, 1).getTimezoneOffset(),
          l = i.getTimezoneOffset(),
          d = 0 | (s != l && o.getTimezoneOffset() == Math.min(l, s));
        HEAP32[(t + 32) >> 2] = d;
      }
      var __mktime_js = function (e) {
        var r = (() => {
          var r = new Date(
              HEAP32[(e + 20) >> 2] + 1900,
              HEAP32[(e + 16) >> 2],
              HEAP32[(e + 12) >> 2],
              HEAP32[(e + 8) >> 2],
              HEAP32[(e + 4) >> 2],
              HEAP32[e >> 2],
              0,
            ),
            t = HEAP32[(e + 32) >> 2],
            n = r.getTimezoneOffset(),
            o = new Date(r.getFullYear(), 0, 1),
            a = new Date(r.getFullYear(), 6, 1).getTimezoneOffset(),
            i = o.getTimezoneOffset(),
            s = Math.min(i, a);
          if (t < 0) HEAP32[(e + 32) >> 2] = Number(a != i && s == n);
          else if (t > 0 != (s == n)) {
            var l = Math.max(i, a),
              d = t > 0 ? s : l;
            r.setTime(r.getTime() + 6e4 * (d - n));
          }
          HEAP32[(e + 24) >> 2] = r.getDay();
          var u = 0 | ydayFromDate(r);
          return (
            (HEAP32[(e + 28) >> 2] = u),
            (HEAP32[e >> 2] = r.getSeconds()),
            (HEAP32[(e + 4) >> 2] = r.getMinutes()),
            (HEAP32[(e + 8) >> 2] = r.getHours()),
            (HEAP32[(e + 12) >> 2] = r.getDate()),
            (HEAP32[(e + 16) >> 2] = r.getMonth()),
            (HEAP32[(e + 20) >> 2] = r.getYear()),
            r.getTime() / 1e3
          );
        })();
        return (
          setTempRet0(
            ((tempDouble = r),
            +Math.abs(tempDouble) >= 1
              ? tempDouble > 0
                ? +Math.floor(tempDouble / 4294967296) >>> 0
                : ~~+Math.ceil(
                    (tempDouble - +(~~tempDouble >>> 0)) / 4294967296,
                  ) >>> 0
              : 0),
          ),
          r >>> 0
        );
      };
      function __mmap_js(e, r, t, n, o, a, i, s) {
        var l = convertI32PairToI53Checked(o, a);
        try {
          if (isNaN(l)) return 61;
          var d = SYSCALLS.getStreamFromFD(n),
            u = FS.mmap(d, e, l, r, t),
            c = u.ptr;
          return (HEAP32[i >> 2] = u.allocated), (HEAPU32[s >> 2] = c), 0;
        } catch (e) {
          if (void 0 === FS || "ErrnoError" !== e.name) throw e;
          return -e.errno;
        }
      }
      function __munmap_js(e, r, t, n, o, a, i) {
        var s = convertI32PairToI53Checked(a, i);
        try {
          if (isNaN(s)) return 61;
          var l = SYSCALLS.getStreamFromFD(o);
          2 & t && SYSCALLS.doMsync(e, l, r, n, s), FS.munmap(l);
        } catch (e) {
          if (void 0 === FS || "ErrnoError" !== e.name) throw e;
          return -e.errno;
        }
      }
      var __timegm_js = function (e) {
          var r = (() => {
            var r = Date.UTC(
                HEAP32[(e + 20) >> 2] + 1900,
                HEAP32[(e + 16) >> 2],
                HEAP32[(e + 12) >> 2],
                HEAP32[(e + 8) >> 2],
                HEAP32[(e + 4) >> 2],
                HEAP32[e >> 2],
                0,
              ),
              t = new Date(r);
            HEAP32[(e + 24) >> 2] = t.getUTCDay();
            var n = Date.UTC(t.getUTCFullYear(), 0, 1, 0, 0, 0, 0),
              o = ((t.getTime() - n) / 864e5) | 0;
            return (HEAP32[(e + 28) >> 2] = o), t.getTime() / 1e3;
          })();
          return (
            setTempRet0(
              ((tempDouble = r),
              +Math.abs(tempDouble) >= 1
                ? tempDouble > 0
                  ? +Math.floor(tempDouble / 4294967296) >>> 0
                  : ~~+Math.ceil(
                      (tempDouble - +(~~tempDouble >>> 0)) / 4294967296,
                    ) >>> 0
                : 0),
            ),
            r >>> 0
          );
        },
        _abort = () => {
          abort("");
        },
        readEmAsmArgsArray = [],
        readEmAsmArgs = (e, r) => {
          var t;
          for (readEmAsmArgsArray.length = 0; (t = HEAPU8[e++]); ) {
            var n = 105 != t;
            (r += (n &= 112 != t) && r % 8 ? 4 : 0),
              readEmAsmArgsArray.push(
                112 == t
                  ? HEAPU32[r >> 2]
                  : 105 == t
                  ? HEAP32[r >> 2]
                  : HEAPF64[r >> 3],
              ),
              (r += n ? 8 : 4);
          }
          return readEmAsmArgsArray;
        },
        runEmAsmFunction = (e, r, t) => {
          var n = readEmAsmArgs(r, t);
          return ASM_CONSTS[e].apply(null, n);
        },
        _emscripten_asm_const_int = (e, r, t) => runEmAsmFunction(e, r, t),
        _emscripten_date_now = () => Date.now(),
        _emscripten_get_now;
      _emscripten_get_now = () => performance.now();
      var _emscripten_memcpy_js = (e, r, t) => HEAPU8.copyWithin(e, r, r + t),
        getHeapMax = () => 2147483648,
        growMemory = (e) => {
          var r = (e - wasmMemory.buffer.byteLength + 65535) / 65536;
          try {
            return wasmMemory.grow(r), updateMemoryViews(), 1;
          } catch (e) {}
        },
        _emscripten_resize_heap = (e) => {
          var r = HEAPU8.length;
          e >>>= 0;
          var t = getHeapMax();
          if (e > t) return !1;
          for (var n, o, a = 1; a <= 4; a *= 2) {
            var i = r * (1 + 0.2 / a);
            i = Math.min(i, e + 100663296);
            var s = Math.min(
              t,
              (n = Math.max(e, i)) + (((o = 65536) - (n % o)) % o),
            );
            if (growMemory(s)) return !0;
          }
          return !1;
        },
        _emscripten_run_script = (ptr) => {
          eval(UTF8ToString(ptr));
        },
        ENV = {},
        getExecutableName = () => thisProgram || "./this.program",
        getEnvStrings = () => {
          if (!getEnvStrings.strings) {
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
              _: getExecutableName(),
            };
            for (var r in ENV)
              void 0 === ENV[r] ? delete e[r] : (e[r] = ENV[r]);
            var t = [];
            for (var r in e) t.push(`${r}=${e[r]}`);
            getEnvStrings.strings = t;
          }
          return getEnvStrings.strings;
        },
        stringToAscii = (e, r) => {
          for (var t = 0; t < e.length; ++t) HEAP8[r++ >> 0] = e.charCodeAt(t);
          HEAP8[r >> 0] = 0;
        },
        _environ_get = (e, r) => {
          var t = 0;
          return (
            getEnvStrings().forEach((n, o) => {
              var a = r + t;
              (HEAPU32[(e + 4 * o) >> 2] = a),
                stringToAscii(n, a),
                (t += n.length + 1);
            }),
            0
          );
        },
        _environ_sizes_get = (e, r) => {
          var t = getEnvStrings();
          HEAPU32[e >> 2] = t.length;
          var n = 0;
          return (
            t.forEach((e) => (n += e.length + 1)), (HEAPU32[r >> 2] = n), 0
          );
        };
      function _fd_close(e) {
        try {
          var r = SYSCALLS.getStreamFromFD(e);
          return FS.close(r), 0;
        } catch (e) {
          if (void 0 === FS || "ErrnoError" !== e.name) throw e;
          return e.errno;
        }
      }
      function _fd_fdstat_get(e, r) {
        try {
          var t = SYSCALLS.getStreamFromFD(e),
            n = t.tty ? 2 : FS.isDir(t.mode) ? 3 : FS.isLink(t.mode) ? 7 : 4;
          return (
            (HEAP8[r >> 0] = n),
            (HEAP16[(r + 2) >> 1] = 0),
            (tempI64 = [
              0,
              ((tempDouble = 0),
              +Math.abs(tempDouble) >= 1
                ? tempDouble > 0
                  ? +Math.floor(tempDouble / 4294967296) >>> 0
                  : ~~+Math.ceil(
                      (tempDouble - +(~~tempDouble >>> 0)) / 4294967296,
                    ) >>> 0
                : 0),
            ]),
            (HEAP32[(r + 8) >> 2] = tempI64[0]),
            (HEAP32[(r + 12) >> 2] = tempI64[1]),
            (tempI64 = [
              0,
              ((tempDouble = 0),
              +Math.abs(tempDouble) >= 1
                ? tempDouble > 0
                  ? +Math.floor(tempDouble / 4294967296) >>> 0
                  : ~~+Math.ceil(
                      (tempDouble - +(~~tempDouble >>> 0)) / 4294967296,
                    ) >>> 0
                : 0),
            ]),
            (HEAP32[(r + 16) >> 2] = tempI64[0]),
            (HEAP32[(r + 20) >> 2] = tempI64[1]),
            0
          );
        } catch (e) {
          if (void 0 === FS || "ErrnoError" !== e.name) throw e;
          return e.errno;
        }
      }
      var doReadv = (e, r, t, n) => {
        for (var o = 0, a = 0; a < t; a++) {
          var i = HEAPU32[r >> 2],
            s = HEAPU32[(r + 4) >> 2];
          r += 8;
          var l = FS.read(e, HEAP8, i, s, n);
          if (l < 0) return -1;
          if (((o += l), l < s)) break;
          void 0 !== n && (n += l);
        }
        return o;
      };
      function _fd_read(e, r, t, n) {
        try {
          var o = SYSCALLS.getStreamFromFD(e),
            a = doReadv(o, r, t);
          return (HEAPU32[n >> 2] = a), 0;
        } catch (e) {
          if (void 0 === FS || "ErrnoError" !== e.name) throw e;
          return e.errno;
        }
      }
      function _fd_seek(e, r, t, n, o) {
        var a = convertI32PairToI53Checked(r, t);
        try {
          if (isNaN(a)) return 61;
          var i = SYSCALLS.getStreamFromFD(e);
          return (
            FS.llseek(i, a, n),
            (tempI64 = [
              i.position >>> 0,
              ((tempDouble = i.position),
              +Math.abs(tempDouble) >= 1
                ? tempDouble > 0
                  ? +Math.floor(tempDouble / 4294967296) >>> 0
                  : ~~+Math.ceil(
                      (tempDouble - +(~~tempDouble >>> 0)) / 4294967296,
                    ) >>> 0
                : 0),
            ]),
            (HEAP32[o >> 2] = tempI64[0]),
            (HEAP32[(o + 4) >> 2] = tempI64[1]),
            i.getdents && 0 === a && 0 === n && (i.getdents = null),
            0
          );
        } catch (e) {
          if (void 0 === FS || "ErrnoError" !== e.name) throw e;
          return e.errno;
        }
      }
      function _fd_sync(e) {
        try {
          var r = SYSCALLS.getStreamFromFD(e);
          return r.stream_ops && r.stream_ops.fsync ? r.stream_ops.fsync(r) : 0;
        } catch (e) {
          if (void 0 === FS || "ErrnoError" !== e.name) throw e;
          return e.errno;
        }
      }
      var doWritev = (e, r, t, n) => {
        for (var o = 0, a = 0; a < t; a++) {
          var i = HEAPU32[r >> 2],
            s = HEAPU32[(r + 4) >> 2];
          r += 8;
          var l = FS.write(e, HEAP8, i, s, n);
          if (l < 0) return -1;
          (o += l), void 0 !== n && (n += l);
        }
        return o;
      };
      function _fd_write(e, r, t, n) {
        try {
          var o = SYSCALLS.getStreamFromFD(e),
            a = doWritev(o, r, t);
          return (HEAPU32[n >> 2] = a), 0;
        } catch (e) {
          if (void 0 === FS || "ErrnoError" !== e.name) throw e;
          return e.errno;
        }
      }
      var _getentropy = (e, r) => (randomFill(HEAPU8.subarray(e, e + r)), 0),
        arraySum = (e, r) => {
          for (var t = 0, n = 0; n <= r; t += e[n++]);
          return t;
        },
        MONTH_DAYS_LEAP = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
        MONTH_DAYS_REGULAR = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
        addDays = (e, r) => {
          for (var t = new Date(e.getTime()); r > 0; ) {
            var n = isLeapYear(t.getFullYear()),
              o = t.getMonth(),
              a = (n ? MONTH_DAYS_LEAP : MONTH_DAYS_REGULAR)[o];
            if (!(r > a - t.getDate())) return t.setDate(t.getDate() + r), t;
            (r -= a - t.getDate() + 1),
              t.setDate(1),
              o < 11
                ? t.setMonth(o + 1)
                : (t.setMonth(0), t.setFullYear(t.getFullYear() + 1));
          }
          return t;
        },
        writeArrayToMemory = (e, r) => {
          HEAP8.set(e, r);
        },
        _strftime = (e, r, t, n) => {
          var o = HEAPU32[(n + 40) >> 2],
            a = {
              tm_sec: HEAP32[n >> 2],
              tm_min: HEAP32[(n + 4) >> 2],
              tm_hour: HEAP32[(n + 8) >> 2],
              tm_mday: HEAP32[(n + 12) >> 2],
              tm_mon: HEAP32[(n + 16) >> 2],
              tm_year: HEAP32[(n + 20) >> 2],
              tm_wday: HEAP32[(n + 24) >> 2],
              tm_yday: HEAP32[(n + 28) >> 2],
              tm_isdst: HEAP32[(n + 32) >> 2],
              tm_gmtoff: HEAP32[(n + 36) >> 2],
              tm_zone: o ? UTF8ToString(o) : "",
            },
            i = UTF8ToString(t),
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
          for (var l in s) i = i.replace(new RegExp(l, "g"), s[l]);
          var d = [
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
          function c(e, r, t) {
            for (
              var n = "number" == typeof e ? e.toString() : e || "";
              n.length < r;

            )
              n = t[0] + n;
            return n;
          }
          function m(e, r) {
            return c(e, r, "0");
          }
          function p(e, r) {
            function t(e) {
              return e < 0 ? -1 : e > 0 ? 1 : 0;
            }
            var n;
            return (
              0 === (n = t(e.getFullYear() - r.getFullYear())) &&
                0 === (n = t(e.getMonth() - r.getMonth())) &&
                (n = t(e.getDate() - r.getDate())),
              n
            );
          }
          function _(e) {
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
            var r = addDays(new Date(e.tm_year + 1900, 0, 1), e.tm_yday),
              t = new Date(r.getFullYear(), 0, 4),
              n = new Date(r.getFullYear() + 1, 0, 4),
              o = _(t),
              a = _(n);
            return p(o, r) <= 0
              ? p(a, r) <= 0
                ? r.getFullYear() + 1
                : r.getFullYear()
              : r.getFullYear() - 1;
          }
          var f = {
            "%a": (e) => d[e.tm_wday].substring(0, 3),
            "%A": (e) => d[e.tm_wday],
            "%b": (e) => u[e.tm_mon].substring(0, 3),
            "%B": (e) => u[e.tm_mon],
            "%C": (e) => m(((e.tm_year + 1900) / 100) | 0, 2),
            "%d": (e) => m(e.tm_mday, 2),
            "%e": (e) => c(e.tm_mday, 2, " "),
            "%g": (e) => h(e).toString().substring(2),
            "%G": (e) => h(e),
            "%H": (e) => m(e.tm_hour, 2),
            "%I": (e) => {
              var r = e.tm_hour;
              return 0 == r ? (r = 12) : r > 12 && (r -= 12), m(r, 2);
            },
            "%j": (e) =>
              m(
                e.tm_mday +
                  arraySum(
                    isLeapYear(e.tm_year + 1900)
                      ? MONTH_DAYS_LEAP
                      : MONTH_DAYS_REGULAR,
                    e.tm_mon - 1,
                  ),
                3,
              ),
            "%m": (e) => m(e.tm_mon + 1, 2),
            "%M": (e) => m(e.tm_min, 2),
            "%n": () => "\n",
            "%p": (e) => (e.tm_hour >= 0 && e.tm_hour < 12 ? "AM" : "PM"),
            "%S": (e) => m(e.tm_sec, 2),
            "%t": () => "\t",
            "%u": (e) => e.tm_wday || 7,
            "%U": (e) => {
              var r = e.tm_yday + 7 - e.tm_wday;
              return m(Math.floor(r / 7), 2);
            },
            "%V": (e) => {
              var r = Math.floor((e.tm_yday + 7 - ((e.tm_wday + 6) % 7)) / 7);
              if (((e.tm_wday + 371 - e.tm_yday - 2) % 7 <= 2 && r++, r)) {
                if (53 == r) {
                  var t = (e.tm_wday + 371 - e.tm_yday) % 7;
                  4 == t || (3 == t && isLeapYear(e.tm_year)) || (r = 1);
                }
              } else {
                r = 52;
                var n = (e.tm_wday + 7 - e.tm_yday - 1) % 7;
                (4 == n || (5 == n && isLeapYear((e.tm_year % 400) - 1))) &&
                  r++;
              }
              return m(r, 2);
            },
            "%w": (e) => e.tm_wday,
            "%W": (e) => {
              var r = e.tm_yday + 7 - ((e.tm_wday + 6) % 7);
              return m(Math.floor(r / 7), 2);
            },
            "%y": (e) => (e.tm_year + 1900).toString().substring(2),
            "%Y": (e) => e.tm_year + 1900,
            "%z": (e) => {
              var r = e.tm_gmtoff,
                t = r >= 0;
              return (
                (r = ((r = Math.abs(r) / 60) / 60) * 100 + (r % 60)),
                (t ? "+" : "-") + String("0000" + r).slice(-4)
              );
            },
            "%Z": (e) => e.tm_zone,
            "%%": () => "%",
          };
          for (var l in ((i = i.replace(/%%/g, "\0\0")), f))
            i.includes(l) && (i = i.replace(new RegExp(l, "g"), f[l](a)));
          var y = intArrayFromString((i = i.replace(/\0\0/g, "%")), !1);
          return y.length > r ? 0 : (writeArrayToMemory(y, e), y.length - 1);
        },
        jstoi_q = (e) => parseInt(e),
        _strptime = (e, r, t) => {
          for (
            var n = UTF8ToString(r),
              o = "\\!@#$^&*()+=-[]/{}|:<>?,.",
              a = 0,
              i = o.length;
            a < i;
            ++a
          )
            n = n.replace(new RegExp("\\" + o[a], "g"), "\\" + o[a]);
          var s = {
            "%A": "%a",
            "%B": "%b",
            "%c": "%a %b %d %H:%M:%S %Y",
            "%D": "%m\\/%d\\/%y",
            "%e": "%d",
            "%F": "%Y-%m-%d",
            "%h": "%b",
            "%R": "%H\\:%M",
            "%r": "%I\\:%M\\:%S\\s%p",
            "%T": "%H\\:%M\\:%S",
            "%x": "%m\\/%d\\/(?:%y|%Y)",
            "%X": "%H\\:%M\\:%S",
          };
          for (var l in s) n = n.replace(l, s[l]);
          var d = {
            "%a": "(?:Sun(?:day)?)|(?:Mon(?:day)?)|(?:Tue(?:sday)?)|(?:Wed(?:nesday)?)|(?:Thu(?:rsday)?)|(?:Fri(?:day)?)|(?:Sat(?:urday)?)",
            "%b": "(?:Jan(?:uary)?)|(?:Feb(?:ruary)?)|(?:Mar(?:ch)?)|(?:Apr(?:il)?)|May|(?:Jun(?:e)?)|(?:Jul(?:y)?)|(?:Aug(?:ust)?)|(?:Sep(?:tember)?)|(?:Oct(?:ober)?)|(?:Nov(?:ember)?)|(?:Dec(?:ember)?)",
            "%C": "\\d\\d",
            "%d": "0[1-9]|[1-9](?!\\d)|1\\d|2\\d|30|31",
            "%H": "\\d(?!\\d)|[0,1]\\d|20|21|22|23",
            "%I": "\\d(?!\\d)|0\\d|10|11|12",
            "%j": "00[1-9]|0?[1-9](?!\\d)|0?[1-9]\\d(?!\\d)|[1,2]\\d\\d|3[0-6]\\d",
            "%m": "0[1-9]|[1-9](?!\\d)|10|11|12",
            "%M": "0\\d|\\d(?!\\d)|[1-5]\\d",
            "%n": "\\s",
            "%p": "AM|am|PM|pm|A\\.M\\.|a\\.m\\.|P\\.M\\.|p\\.m\\.",
            "%S": "0\\d|\\d(?!\\d)|[1-5]\\d|60",
            "%U": "0\\d|\\d(?!\\d)|[1-4]\\d|50|51|52|53",
            "%W": "0\\d|\\d(?!\\d)|[1-4]\\d|50|51|52|53",
            "%w": "[0-6]",
            "%y": "\\d\\d",
            "%Y": "\\d\\d\\d\\d",
            "%%": "%",
            "%t": "\\s",
          };
          for (var u in d) n = n.replace(u, "(" + u + d[u] + ")");
          var c = [];
          for (a = n.indexOf("%"); a >= 0; a = n.indexOf("%"))
            c.push(n[a + 1]),
              (n = n.replace(new RegExp("\\%" + n[a + 1], "g"), ""));
          var m = new RegExp("^" + n, "i").exec(UTF8ToString(e));
          if (m) {
            var p,
              _ = (function () {
                function e(e, r, t) {
                  return "number" != typeof e || isNaN(e)
                    ? r
                    : e >= r
                    ? e <= t
                      ? e
                      : t
                    : r;
                }
                return {
                  year: e(HEAP32[(t + 20) >> 2] + 1900, 1970, 9999),
                  month: e(HEAP32[(t + 16) >> 2], 0, 11),
                  day: e(HEAP32[(t + 12) >> 2], 1, 31),
                  hour: e(HEAP32[(t + 8) >> 2], 0, 23),
                  min: e(HEAP32[(t + 4) >> 2], 0, 59),
                  sec: e(HEAP32[t >> 2], 0, 59),
                };
              })(),
              h = (e) => {
                var r = c.indexOf(e);
                if (r >= 0) return m[r + 1];
              };
            if (
              ((p = h("S")) && (_.sec = jstoi_q(p)),
              (p = h("M")) && (_.min = jstoi_q(p)),
              (p = h("H")))
            )
              _.hour = jstoi_q(p);
            else if ((p = h("I"))) {
              var f = jstoi_q(p);
              (p = h("p")) && (f += "P" === p.toUpperCase()[0] ? 12 : 0),
                (_.hour = f);
            }
            if ((p = h("Y"))) _.year = jstoi_q(p);
            else if ((p = h("y"))) {
              var y = jstoi_q(p);
              (p = h("C"))
                ? (y += 100 * jstoi_q(p))
                : (y += y < 69 ? 2e3 : 1900),
                (_.year = y);
            }
            if (
              ((p = h("m"))
                ? (_.month = jstoi_q(p) - 1)
                : (p = h("b")) &&
                  (_.month =
                    {
                      JAN: 0,
                      FEB: 1,
                      MAR: 2,
                      APR: 3,
                      MAY: 4,
                      JUN: 5,
                      JUL: 6,
                      AUG: 7,
                      SEP: 8,
                      OCT: 9,
                      NOV: 10,
                      DEC: 11,
                    }[p.substring(0, 3).toUpperCase()] || 0),
              (p = h("d")))
            )
              _.day = jstoi_q(p);
            else if ((p = h("j")))
              for (
                var g = jstoi_q(p), S = isLeapYear(_.year), v = 0;
                v < 12;
                ++v
              ) {
                var F = arraySum(
                  S ? MONTH_DAYS_LEAP : MONTH_DAYS_REGULAR,
                  v - 1,
                );
                g <= F + (S ? MONTH_DAYS_LEAP : MONTH_DAYS_REGULAR)[v] &&
                  (_.day = g - F);
              }
            else if ((p = h("a"))) {
              var E = p.substring(0, 3).toUpperCase();
              if ((p = h("U"))) {
                var w = {
                    SUN: 0,
                    MON: 1,
                    TUE: 2,
                    WED: 3,
                    THU: 4,
                    FRI: 5,
                    SAT: 6,
                  }[E],
                  A = jstoi_q(p);
                (b =
                  0 === (P = new Date(_.year, 0, 1)).getDay()
                    ? addDays(P, w + 7 * (A - 1))
                    : addDays(P, 7 - P.getDay() + w + 7 * (A - 1))),
                  (_.day = b.getDate()),
                  (_.month = b.getMonth());
              } else if ((p = h("W"))) {
                var P, b;
                (w = { MON: 0, TUE: 1, WED: 2, THU: 3, FRI: 4, SAT: 5, SUN: 6 }[
                  E
                ]),
                  (A = jstoi_q(p));
                (b =
                  1 === (P = new Date(_.year, 0, 1)).getDay()
                    ? addDays(P, w + 7 * (A - 1))
                    : addDays(P, 7 - P.getDay() + 1 + w + 7 * (A - 1))),
                  (_.day = b.getDate()),
                  (_.month = b.getMonth());
              }
            }
            var T = new Date(_.year, _.month, _.day, _.hour, _.min, _.sec, 0);
            return (
              (HEAP32[t >> 2] = T.getSeconds()),
              (HEAP32[(t + 4) >> 2] = T.getMinutes()),
              (HEAP32[(t + 8) >> 2] = T.getHours()),
              (HEAP32[(t + 12) >> 2] = T.getDate()),
              (HEAP32[(t + 16) >> 2] = T.getMonth()),
              (HEAP32[(t + 20) >> 2] = T.getFullYear() - 1900),
              (HEAP32[(t + 24) >> 2] = T.getDay()),
              (HEAP32[(t + 28) >> 2] =
                arraySum(
                  isLeapYear(T.getFullYear())
                    ? MONTH_DAYS_LEAP
                    : MONTH_DAYS_REGULAR,
                  T.getMonth() - 1,
                ) +
                T.getDate() -
                1),
              (HEAP32[(t + 32) >> 2] = 0),
              e + intArrayFromString(m[0]).length - 1
            );
          }
          return 0;
        },
        FSNode = function (e, r, t, n) {
          e || (e = this),
            (this.parent = e),
            (this.mount = e.mount),
            (this.mounted = null),
            (this.id = FS.nextInode++),
            (this.name = r),
            (this.mode = t),
            (this.node_ops = {}),
            (this.stream_ops = {}),
            (this.rdev = n);
        },
        readMode = 365,
        writeMode = 146;
      Object.defineProperties(FSNode.prototype, {
        read: {
          get: function () {
            return (this.mode & readMode) === readMode;
          },
          set: function (e) {
            e ? (this.mode |= readMode) : (this.mode &= ~readMode);
          },
        },
        write: {
          get: function () {
            return (this.mode & writeMode) === writeMode;
          },
          set: function (e) {
            e ? (this.mode |= writeMode) : (this.mode &= ~writeMode);
          },
        },
        isFolder: {
          get: function () {
            return FS.isDir(this.mode);
          },
        },
        isDevice: {
          get: function () {
            return FS.isChrdev(this.mode);
          },
        },
      }),
        (FS.FSNode = FSNode),
        (FS.createPreloadedFile = FS_createPreloadedFile),
        FS.staticInit(),
        (Module.FS_createPath = FS.createPath),
        (Module.FS_createDataFile = FS.createDataFile),
        (Module.FS_createPreloadedFile = FS.createPreloadedFile),
        (Module.FS_unlink = FS.unlink),
        (Module.FS_createLazyFile = FS.createLazyFile),
        (Module.FS_createDevice = FS.createDevice),
        handleAllocatorInit(),
        (BindingError = Module.BindingError =
          class extends Error {
            constructor(e) {
              super(e), (this.name = "BindingError");
            }
          }),
        init_emval(),
        (PureVirtualError = Module.PureVirtualError =
          extendError(Error, "PureVirtualError")),
        embind_init_charCodes(),
        init_embind(),
        (InternalError = Module.InternalError =
          class extends Error {
            constructor(e) {
              super(e), (this.name = "InternalError");
            }
          }),
        init_ClassHandle(),
        init_RegisteredPointer(),
        (UnboundTypeError = Module.UnboundTypeError =
          extendError(Error, "UnboundTypeError"));
      var wasmImports = {
          ia: ___syscall_chmod,
          ma: ___syscall_faccessat,
          ja: ___syscall_fchmod,
          C: ___syscall_fcntl64,
          fa: ___syscall_fstat64,
          T: ___syscall_ftruncate64,
          Z: ___syscall_getdents64,
          ha: ___syscall_ioctl,
          da: ___syscall_lstat64,
          _: ___syscall_mkdirat,
          ca: ___syscall_newfstatat,
          u: ___syscall_openat,
          Y: ___syscall_renameat,
          y: ___syscall_rmdir,
          ea: ___syscall_stat64,
          z: ___syscall_unlinkat,
          ua: __embind_create_inheriting_constructor,
          J: __embind_finalize_value_object,
          U: __embind_register_bigint,
          oa: __embind_register_bool,
          k: __embind_register_class,
          I: __embind_register_class_class_function,
          K: __embind_register_class_constructor,
          d: __embind_register_class_function,
          G: __embind_register_class_property,
          na: __embind_register_emval,
          D: __embind_register_float,
          c: __embind_register_function,
          g: __embind_register_integer,
          e: __embind_register_memory_view,
          ta: __embind_register_smart_ptr,
          E: __embind_register_std_string,
          v: __embind_register_std_wstring,
          L: __embind_register_value_object,
          x: __embind_register_value_object_field,
          pa: __embind_register_void,
          qa: __emscripten_fs_load_embedded_files,
          la: __emscripten_get_now_is_monotonic,
          o: __emval_as,
          sa: __emval_call,
          j: __emval_call_method,
          H: __emval_call_void_method,
          b: __emval_decref,
          r: __emval_get_global,
          h: __emval_get_method_caller,
          q: __emval_get_property,
          i: __emval_incref,
          p: __emval_new_cstring,
          f: __emval_run_destructors,
          l: __emval_take_value,
          w: __emval_typeof,
          O: __gmtime_js,
          P: __localtime_js,
          Q: __mktime_js,
          M: __mmap_js,
          N: __munmap_js,
          R: __timegm_js,
          a: _abort,
          t: _emscripten_asm_const_int,
          m: _emscripten_date_now,
          ka: _emscripten_get_now,
          ga: _emscripten_memcpy_js,
          W: _emscripten_resize_heap,
          F: _emscripten_run_script,
          $: _environ_get,
          aa: _environ_sizes_get,
          n: _fd_close,
          X: _fd_fdstat_get,
          B: _fd_read,
          S: _fd_seek,
          ba: _fd_sync,
          A: _fd_write,
          V: _getentropy,
          s: _strftime,
          ra: _strptime,
        },
        wasmExports = createWasm(),
        ___wasm_call_ctors = () => (___wasm_call_ctors = wasmExports.wa)(),
        _malloc = (e) => (_malloc = wasmExports.xa)(e),
        _free = (e) => (_free = wasmExports.ya)(e),
        ___errno_location = () => (___errno_location = wasmExports.za)(),
        ___getTypeName = (e) => (___getTypeName = wasmExports.Aa)(e),
        __embind_initialize_bindings = (Module.__embind_initialize_bindings =
          () =>
            (__embind_initialize_bindings =
              Module.__embind_initialize_bindings =
                wasmExports.Ba)()),
        _emscripten_builtin_memalign = (e, r) =>
          (_emscripten_builtin_memalign = wasmExports.Da)(e, r),
        ___trap = () => (___trap = wasmExports.Ea)(),
        setTempRet0 = (e) => (setTempRet0 = wasmExports.Fa)(e),
        dynCall_jiji = (Module.dynCall_jiji = (e, r, t, n, o) =>
          (dynCall_jiji = Module.dynCall_jiji = wasmExports.Ga)(e, r, t, n, o)),
        dynCall_ji = (Module.dynCall_ji = (e, r) =>
          (dynCall_ji = Module.dynCall_ji = wasmExports.Ha)(e, r)),
        dynCall_viij = (Module.dynCall_viij = (e, r, t, n, o) =>
          (dynCall_viij = Module.dynCall_viij = wasmExports.Ia)(e, r, t, n, o)),
        dynCall_iij = (Module.dynCall_iij = (e, r, t, n) =>
          (dynCall_iij = Module.dynCall_iij = wasmExports.Ja)(e, r, t, n)),
        dynCall_iiji = (Module.dynCall_iiji = (e, r, t, n, o) =>
          (dynCall_iiji = Module.dynCall_iiji = wasmExports.Ka)(e, r, t, n, o)),
        dynCall_jji = (Module.dynCall_jji = (e, r, t, n) =>
          (dynCall_jji = Module.dynCall_jji = wasmExports.La)(e, r, t, n)),
        dynCall_iji = (Module.dynCall_iji = (e, r, t, n) =>
          (dynCall_iji = Module.dynCall_iji = wasmExports.Ma)(e, r, t, n)),
        dynCall_viijj = (Module.dynCall_viijj = (e, r, t, n, o, a, i) =>
          (dynCall_viijj = Module.dynCall_viijj = wasmExports.Na)(
            e,
            r,
            t,
            n,
            o,
            a,
            i,
          )),
        dynCall_iiij = (Module.dynCall_iiij = (e, r, t, n, o) =>
          (dynCall_iiij = Module.dynCall_iiij = wasmExports.Oa)(e, r, t, n, o)),
        dynCall_vij = (Module.dynCall_vij = (e, r, t, n) =>
          (dynCall_vij = Module.dynCall_vij = wasmExports.Pa)(e, r, t, n)),
        dynCall_viiiji = (Module.dynCall_viiiji = (e, r, t, n, o, a, i) =>
          (dynCall_viiiji = Module.dynCall_viiiji = wasmExports.Qa)(
            e,
            r,
            t,
            n,
            o,
            a,
            i,
          )),
        dynCall_viijii = (Module.dynCall_viijii = (e, r, t, n, o, a, i) =>
          (dynCall_viijii = Module.dynCall_viijii = wasmExports.Ra)(
            e,
            r,
            t,
            n,
            o,
            a,
            i,
          )),
        dynCall_jij = (Module.dynCall_jij = (e, r, t, n) =>
          (dynCall_jij = Module.dynCall_jij = wasmExports.Sa)(e, r, t, n)),
        dynCall_iiiij = (Module.dynCall_iiiij = (e, r, t, n, o, a) =>
          (dynCall_iiiij = Module.dynCall_iiiij = wasmExports.Ta)(
            e,
            r,
            t,
            n,
            o,
            a,
          )),
        dynCall_iiiiij = (Module.dynCall_iiiiij = (e, r, t, n, o, a, i) =>
          (dynCall_iiiiij = Module.dynCall_iiiiij = wasmExports.Ua)(
            e,
            r,
            t,
            n,
            o,
            a,
            i,
          )),
        dynCall_iiiiijj = (Module.dynCall_iiiiijj = (
          e,
          r,
          t,
          n,
          o,
          a,
          i,
          s,
          l,
        ) =>
          (dynCall_iiiiijj = Module.dynCall_iiiiijj = wasmExports.Va)(
            e,
            r,
            t,
            n,
            o,
            a,
            i,
            s,
            l,
          )),
        dynCall_iiiiiijj = (Module.dynCall_iiiiiijj = (
          e,
          r,
          t,
          n,
          o,
          a,
          i,
          s,
          l,
          d,
        ) =>
          (dynCall_iiiiiijj = Module.dynCall_iiiiiijj = wasmExports.Wa)(
            e,
            r,
            t,
            n,
            o,
            a,
            i,
            s,
            l,
            d,
          )),
        ___emscripten_embedded_file_data =
          (Module.___emscripten_embedded_file_data = 186828),
        calledRun;
      function run() {
        function e() {
          calledRun ||
            ((calledRun = !0),
            (Module.calledRun = !0),
            ABORT ||
              (initRuntime(),
              readyPromiseResolve(Module),
              Module.onRuntimeInitialized && Module.onRuntimeInitialized(),
              postRun()));
        }
        runDependencies > 0 ||
          (preRun(),
          runDependencies > 0 ||
            (Module.setStatus
              ? (Module.setStatus("Running..."),
                setTimeout(function () {
                  setTimeout(function () {
                    Module.setStatus("");
                  }, 1),
                    e();
                }, 1))
              : e()));
      }
      if (
        ((Module.addRunDependency = addRunDependency),
        (Module.removeRunDependency = removeRunDependency),
        (Module.FS_createPath = FS.createPath),
        (Module.FS_createLazyFile = FS.createLazyFile),
        (Module.FS_createDevice = FS.createDevice),
        (Module.FS_createPreloadedFile = FS.createPreloadedFile),
        (Module.FS = FS),
        (Module.FS_createDataFile = FS.createDataFile),
        (Module.FS_unlink = FS.unlink),
        (dependenciesFulfilled = function e() {
          calledRun || run(), calledRun || (dependenciesFulfilled = e);
        }),
        Module.preInit)
      )
        for (
          "function" == typeof Module.preInit &&
          (Module.preInit = [Module.preInit]);
          Module.preInit.length > 0;

        )
          Module.preInit.pop()();
      return run(), moduleArg.ready;
    }
  );
})();
"object" == typeof exports && "object" == typeof module
  ? (module.exports = PSPDFModuleInit)
  : "function" == typeof define &&
    define.amd &&
    define([], () => PSPDFModuleInit);
