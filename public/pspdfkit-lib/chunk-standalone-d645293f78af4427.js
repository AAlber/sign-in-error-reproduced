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
"use strict";
(self.webpackChunkPSPDFKit = self.webpackChunkPSPDFKit || []).push([
  [3610],
  {
    49136: (t, e, n) => {
      n.r(e),
        n.d(e, {
          corePool: () => ot,
          customFontsPromiseRef: () => Ft,
          default: () => bt,
          loadModule: () => kt,
          normalizeCoreOptions: () => lt,
          validateStandaloneConfiguration: () => ct,
        });
      var i = n(84121),
        a = n(35369),
        s = n(47347),
        o = n(21076),
        r = n(13997),
        l = n(17375),
        c = n(34997),
        d = n(19575),
        u = n(37927),
        m = n(4054),
        h = n(30578),
        p = n(95651),
        f = n(46309),
        g = n(4757),
        y = n(91859),
        b = n(45513),
        F = n(2810),
        k = n(67366),
        v = n(44048),
        _ = n(45588),
        S = n(47825),
        P = n(83253);
      const w = ["rollover", "down"];
      function A(t, e) {
        var n = Object.keys(t);
        if (Object.getOwnPropertySymbols) {
          var i = Object.getOwnPropertySymbols(t);
          e &&
            (i = i.filter(function (e) {
              return Object.getOwnPropertyDescriptor(t, e).enumerable;
            })),
            n.push.apply(n, i);
        }
        return n;
      }
      function C(t) {
        for (var e = 1; e < arguments.length; e++) {
          var n = null != arguments[e] ? arguments[e] : {};
          e % 2
            ? A(Object(n), !0).forEach(function (e) {
                (0, i.Z)(t, e, n[e]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n))
            : A(Object(n)).forEach(function (e) {
                Object.defineProperty(
                  t,
                  e,
                  Object.getOwnPropertyDescriptor(n, e),
                );
              });
        }
        return t;
      }
      class D extends (0, a.WV)({
        alreadyLoadedPages: (0, a.D5)(),
        isLoaded: !1,
        isDestroyed: !1,
      }) {}
      const I = {
        skippedPdfObjectIds: [],
        skippedPdfBookmarkIds: [],
        annotations: [],
        bookmarks: [],
        formFieldValues: [],
        formFields: [],
        attachments: {},
      };
      class O {
        constructor(t, e) {
          (0, i.Z)(this, "_state", new D()),
            (0, i.Z)(this, "_formFieldsLoadedPromise", null),
            (0, i.Z)(this, "_objectCreationPromises", (0, a.D5)()),
            (0, i.Z)(this, "_loadBookmarksPromise", null),
            (0, i.Z)(this, "_commentsLoadedPromise", null),
            (0, i.Z)(this, "canCreateBackendOrphanWidgets", !1),
            (this._core = t),
            (this._json = e ? (0, s.H7)(e) : null),
            (this._setReadStateCallbacksPromise = new Promise((t) => {
              this._setReadStateCallbacksPromiseResolve = t;
            }));
        }
        async load() {
          if (
            ((this._state = this._state.set("isLoaded", !0)),
            !this._formFieldCallbacks && (await this._loadFormFieldValues()),
            !this._json)
          )
            return this;
          await this._core.importInstantJSON(C(C({}, I), this._json)),
            (0, s.kG)(this._json);
          const { annotations: t, attachments: e } = this._json;
          if (this._isDestroyed() || !e || 0 === Object.entries(e).length)
            return this;
          if (t)
            for (let n = 0; n < t.length; n++) {
              let i = null;
              const a = t[n];
              if ("imageAttachmentId" in a && a.imageAttachmentId) {
                const t = e ? e[a.imageAttachmentId] : null;
                if (t)
                  try {
                    (i = (0, _.Jc)(atob(t.binary), t.contentType)),
                      (0, s.kG)(this._annotationCallbacks),
                      this._annotationCallbacks.createAttachment(
                        a.imageAttachmentId,
                        i,
                      );
                  } catch (t) {
                    (0, s.um)(
                      `Skipped attachment with id ${a.imageAttachmentId} from payload because an error occurred while converting the binary image to blob.`,
                    ),
                      (0, s.um)(t);
                  }
              }
            }
          return this;
        }
        destroy() {
          (this._state = this._state.set("isDestroyed", !0)),
            (this._annotationCallbacks = null),
            (this._readStateCallbacks = null),
            (this._bookmarkCallbacks = null),
            (this._formFieldCallbacks = null),
            (this._formFieldValueCallbacks = null),
            (this._commentCallbacks = null);
        }
        setReadStateCallbacks(t) {
          var e;
          (this._readStateCallbacks = t),
            null === (e = this._setReadStateCallbacksPromiseResolve) ||
              void 0 === e ||
              e.call(this);
        }
        setAnnotationCallbacks(t) {
          this._annotationCallbacks = t;
        }
        setBookmarkCallbacks(t) {
          this._bookmarkCallbacks = t;
        }
        setFormFieldCallbacks(t) {
          this._formFieldCallbacks = t;
        }
        setFormFieldValueCallbacks(t) {
          this._formFieldValueCallbacks = t;
        }
        setCommentCallbacks(t) {
          this._commentCallbacks = t;
        }
        createComment(t, e, n) {
          return this._core.applyComments(e.map((t) => x(t, n)).toArray());
        }
        updateComment(t, e, n) {
          return this._core.applyComments(e.map((t) => x(t, n)).toArray());
        }
        deleteComment(t, e, n) {
          return this._core.applyComments(e.map((t) => x(t, n)).toArray());
        }
        async loadComments() {
          return (
            this._commentsLoadedPromise ||
              (this._commentsLoadedPromise = this._loadComments()),
            this._commentsLoadedPromise
          );
        }
        async _loadComments() {
          var t, e;
          this._verifyLoaded();
          const n =
              null !== (t = await this._core.getComments()) && void 0 !== t
                ? t
                : [],
            i = (0, a.aV)(
              n.map((t) => {
                let e;
                var n;
                t.pdfObjectId
                  ? (e =
                      t.id ||
                      (null === (n = t.pdfObjectId) || void 0 === n
                        ? void 0
                        : n.toString()))
                  : (e = (0, p.xc)());
                return (0, F.Mu)(e, t);
              }),
            );
          null === (e = this._commentCallbacks) ||
            void 0 === e ||
            e.createComments(i, P.y),
            (this._commentsLoadedPromise = Promise.resolve());
        }
        createAnnotation(t, e) {
          this._verifyLoaded();
          const n = e.find(
            (e, n) => (
              (0, s.kG)(
                "imageAttachmentId" in t,
                "Annotation must have imageAttachmentId.",
              ),
              n === t.imageAttachmentId
            ),
          );
          return this._core
            .createAnnotation((0, F.Hs)(t), n ? n.data : null)
            .then(async (e) => {
              "number" != typeof e ||
                "number" != typeof t.pdfObjectId ||
                t.pdfObjectId === e ||
                this._isDestroyed() ||
                ((0, s.kG)(this._annotationCallbacks),
                this._annotationCallbacks.updateAnnotations(
                  (0, a.aV)([t.set("pdfObjectId", e)]),
                ));
            });
        }
        updateAnnotation(t) {
          return (
            this._verifyLoaded(), this._core.updateAnnotation((0, F.Hs)(t))
          );
        }
        deleteAnnotation(t) {
          return (
            this._verifyLoaded(), this._core.deleteAnnotation((0, F.Hs)(t))
          );
        }
        createBookmark(t) {
          return this._verifyLoaded(), this._core.createBookmark((0, v.a)(t));
        }
        updateBookmark(t) {
          return this._verifyLoaded(), this._core.updateBookmark((0, v.a)(t));
        }
        deleteBookmark(t) {
          return this._verifyLoaded(), this._core.deleteBookmark(t);
        }
        createFormField(t) {
          this._verifyLoaded(), (0, s.kG)(this._readStateCallbacks);
          const e = this._readStateCallbacks.getFormFieldWidgets(t);
          return this._core.createFormField(
            (0, F.vD)(t),
            e.map((t) => (0, F.Hs)(t)).toArray(),
          );
        }
        updateFormField(t) {
          this._verifyLoaded(), (0, s.kG)(this._readStateCallbacks);
          const e = this._readStateCallbacks.getFormFieldWidgets(t);
          return this._core.updateFormField(
            (0, F.vD)(t),
            e.map((t) => (0, F.Hs)(t)).toArray(),
          );
        }
        deleteFormField(t) {
          return this._verifyLoaded(), this._core.deleteFormField((0, F.vD)(t));
        }
        loadFormFields() {
          return (
            this._formFieldsLoadedPromise ||
              (this._formFieldsLoadedPromise = this._loadFormFields()),
            this._formFieldsLoadedPromise
          );
        }
        async _loadFormFields() {
          this._verifyLoaded();
          const t = await this._core.readFormJSONObjects();
          if (this._isDestroyed()) return;
          let e = (0, a.aV)(),
            n = (0, a.aV)().withMutations((n) => {
              t.forEach((t) => {
                const { formField: i, widgets: a, value: o } = t;
                try {
                  let t;
                  t = i.pdfObjectId ? i.pdfObjectId.toString() : (0, p.xc)();
                  const r = (0, F.IN)(t, i);
                  (0, s.kG)(this._readStateCallbacks),
                    this._readStateCallbacks.isFormFieldInState(r.name) ||
                      n.push(r.set("value", o)),
                    a.forEach((t) => {
                      let n;
                      (n = t.pdfObjectId
                        ? t.id || t.pdfObjectId.toString()
                        : (0, p.xc)()),
                        (0, s.kG)(this._readStateCallbacks),
                        (e = e.push((0, F.vH)(n, t)));
                    });
                } catch (t) {
                  (0, s.um)(
                    `Skipped creating form field #${i.pdfObjectId} from payload because an error occurred while deserializing.`,
                  ),
                    (0, s.um)(t);
                }
              });
            });
          const i = {};
          (e = e.map((t) => {
            var a;
            if (
              e.find((e) => {
                var n;
                return (
                  e.pdfObjectId !== t.pdfObjectId &&
                  e.id === t.id &&
                  (null === (n = t.pdfObjectId) || void 0 === n
                    ? void 0
                    : n.toString()) !== t.id
                );
              }) ||
              (null !== (a = this._readStateCallbacks) &&
                void 0 !== a &&
                a.isAnnotationInState(t.id))
            ) {
              const e = (0, p.xc)();
              return (
                i[t.formFieldName]
                  ? i[t.formFieldName].push({ [t.id]: e })
                  : (i[t.formFieldName] = [{ [t.id]: e }]),
                (n = n.map((n) =>
                  n.name === t.formFieldName
                    ? n.update("annotationIds", (n) =>
                        null == n ? void 0 : n.map((n) => (n === t.id ? e : n)),
                      )
                    : n,
                )),
                t.set("id", e)
              );
            }
            return t;
          })),
            Object.keys(i).forEach((t) => {
              const i = n.find((e) => e.name === t);
              (0, s.kG)(i);
              const a = e
                .filter((e) => e.formFieldName === t)
                .toArray()
                .map((t) => (0, F.Hs)(t));
              this._core.updateFormField((0, F.vD)(i), a);
            }),
            n.size > 0 &&
              !this._isDestroyed() &&
              ((0, s.kG)(this._formFieldCallbacks),
              this._formFieldCallbacks.createFormFields(n, P.y)),
            await this._loadFormFieldValues(),
            e.size > 0 &&
              !this._isDestroyed() &&
              ((0, s.kG)(this._annotationCallbacks),
              this._annotationCallbacks.createAnnotations(e, (0, a.D5)(), P.y)),
            (this._formFieldsLoadedPromise = Promise.resolve());
        }
        createFormFieldValue(t) {
          return this._verifyLoaded(), this.setFormFieldValue(t);
        }
        setFormFieldValue(t) {
          return (
            this._verifyLoaded(), this._core.setFormFieldValue((0, F.kr)(t))
          );
        }
        deleteFormFieldValue(t) {
          return (
            this._verifyLoaded(),
            this._core.deleteFormFieldValue(t.replace("form-field-value/", ""))
          );
        }
        loadAnnotationsForPageIndex(t) {
          this._verifyLoaded();
          const e = this._state.alreadyLoadedPages.get(t);
          if (e) return e;
          const n = this._loadAnnotationsForPageIndex(t);
          return (
            (this._state = this._state.setIn(["alreadyLoadedPages", t], n)), n
          );
        }
        async _loadAnnotationsForPageIndex(t) {
          const e = await this._core.annotationsForPageIndex(t);
          if (this._isDestroyed()) return;
          const n = [],
            i = [],
            o = e
              .map((t) => {
                let { rollover: e, down: a } = t,
                  s = (0, l.Z)(t, w);
                return (
                  e &&
                    "number" == typeof s.pdfObjectId &&
                    n.push(s.pdfObjectId),
                  a &&
                    "number" == typeof s.pdfObjectId &&
                    i.push(s.pdfObjectId),
                  s
                );
              })
              .filter((t) => "number" == typeof t.pageIndex);
          this._formFieldCallbacks && (await this.loadFormFields());
          const r = (0, a.aV)().withMutations((t) => {
            o.filter(
              (t) =>
                !t.id ||
                (this._readStateCallbacks &&
                  !this._readStateCallbacks.isAnnotationInState(t.id)),
            ).forEach((e) => {
              e.pdfObjectId;
              try {
                let n;
                (n = (function (t) {
                  return "pspdfkit/link" === t.type && 0 === t.pdfObjectId;
                })(e)
                  ? e.id || (0, p.xc)()
                  : e.isCommentThreadRoot
                  ? e.pdfObjectId.toString()
                  : e.id || e.pdfObjectId.toString()),
                  t.some((t) => t.id === n) &&
                    ((n = (0, p.xc)()),
                    (e.id = n),
                    this._core.updateAnnotation(e));
                const i = (0, F.vH)(n, e);
                t.push(i);
              } catch (t) {
                (0, s.um)(
                  `Skipped creating annotation #${e.pdfObjectId} from payload because an error occurred while deserializing.`,
                ),
                  (0, s.um)(t);
              }
            });
          });
          (0, k.dC)(() => {
            r.size > 0 &&
              ((0, s.kG)(this._annotationCallbacks),
              this._annotationCallbacks.createAnnotations(r, (0, a.D5)(), P.y)),
              n.length > 0 &&
                ((0, s.kG)(this._annotationCallbacks),
                this._annotationCallbacks.addAnnotationVariants("rollover", n)),
              i.length > 0 &&
                ((0, s.kG)(this._annotationCallbacks),
                this._annotationCallbacks.addAnnotationVariants("down", i));
          }),
            (this._state = this._state.setIn(
              ["alreadyLoadedPages", t],
              Promise.resolve(),
            ));
        }
        async _loadFormFieldValues() {
          this._verifyLoaded();
          const t = await this._core.getFormValues();
          if (this._isDestroyed()) return;
          const e = (0, a.aV)().withMutations((e) => {
            t.forEach((t) => {
              try {
                e.push((0, F.u9)(t));
              } catch (e) {
                (0, s.um)(
                  `Skipped creating form field value #${t.pdfObjectId} from payload because an error occurred while deserializing.`,
                ),
                  (0, s.um)(e);
              }
            });
          });
          e.size > 0 &&
            !this._isDestroyed() &&
            ((0, s.kG)(this._formFieldValueCallbacks),
            this._formFieldValueCallbacks.setFormFieldValues(e));
        }
        async loadBookmarks() {
          this._verifyLoaded();
          const t = await this._core.getBookmarks();
          if (this._isDestroyed()) return;
          const e = (0, a.aV)().withMutations((e) => {
            t.forEach((t) => {
              let n;
              n = t.id ? t.id : t.pdfBookmarkId ? t.pdfBookmarkId : (0, S.A)();
              try {
                e.push((0, v.i)(n, t));
              } catch (t) {
                (0, s.um)(
                  `Skipped creating bookmark #${n} from payload because an error occurred while deserializing.`,
                ),
                  (0, s.um)(t);
              }
            });
          });
          e.size > 0 &&
            !this._isDestroyed() &&
            ((0, s.kG)(this._bookmarkCallbacks),
            this._bookmarkCallbacks.createBookmarks(e, P.y));
        }
        _verifyLoaded() {
          (0, s.kG)(
            this._state.isLoaded,
            "StandaloneProvider not properly initialized.",
          );
        }
        _isDestroyed() {
          return this._state.isDestroyed;
        }
        async syncChanges() {}
      }
      function x(t, e) {
        var n;
        (0, s.kG)(t.rootId, "A new comment must have `rootId` present");
        const i = e.get(t.rootId);
        return (
          (0, s.kG)(
            i,
            "An annotation must be present linked to the comment to create",
          ),
          (0, F.jA)(
            t,
            (null === (n = i.pdfObjectId) || void 0 === n
              ? void 0
              : n.toString()) === i.id
              ? parseInt(t.rootId)
              : t.rootId,
          )
        );
      }
      class E {
        constructor(t, e) {
          (this.identifier = t), (this.callback = e);
        }
        request() {
          return this.callback();
        }
      }
      var L = n(45207),
        B = n(89835),
        T = n(67628);
      class j extends a.WV({
        baseUrl: null,
        baseCoreUrl: null,
        licenseKey: null,
        document: null,
        backendPermissions: new B.Z(),
        documentResponse: null,
        disableWebAssemblyStreaming: !1,
        enableAutomaticLinkExtraction: !1,
        overrideMemoryLimit: null,
        features: (0, a.aV)(),
        signatureFeatureAvailability: T.H.NONE,
        documentHandle: null,
        trustedCAsCallback: null,
        signaturesInfoPromise: null,
        customFonts: null,
        fontSubstitutions: null,
        forceLegacySignaturesFeature: !1,
        forceAnnotationsRender: !1,
        appName: null,
        lazyLoadedPages: null,
        productId: null,
        processorEngine: null,
        dynamicFonts: null,
      }) {}
      var R = n(91039),
        N = n(16126),
        G = n(55237),
        U = n(70569),
        V = n(18146),
        K = n(53678),
        M = n(93572),
        J = n(96617),
        z = n(71231),
        H = n(39745),
        W = n(80488),
        $ = n(37300),
        Z = n(60132),
        q = n(5038),
        X = n(63632),
        Y = n(26248),
        Q = n(3150),
        tt = n(66392),
        et = n(88804);
      const nt = ["id"];
      function it(t, e) {
        var n = Object.keys(t);
        if (Object.getOwnPropertySymbols) {
          var i = Object.getOwnPropertySymbols(t);
          e &&
            (i = i.filter(function (e) {
              return Object.getOwnPropertyDescriptor(t, e).enumerable;
            })),
            n.push.apply(n, i);
        }
        return n;
      }
      function at(t) {
        for (var e = 1; e < arguments.length; e++) {
          var n = null != arguments[e] ? arguments[e] : {};
          e % 2
            ? it(Object(n), !0).forEach(function (e) {
                (0, i.Z)(t, e, n[e]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n))
            : it(Object(n)).forEach(function (e) {
                Object.defineProperty(
                  t,
                  e,
                  Object.getOwnPropertyDescriptor(n, e),
                );
              });
        }
        return t;
      }
      let st;
      st = n(21076).AO;
      const ot = new o.L7(st);
      class rt extends f.W {
        constructor(t) {
          super(),
            (0, i.Z)(this, "type", "STANDALONE"),
            (0, i.Z)(this, "_XFDF", null),
            ct(t);
          const {
            baseUrl: e,
            baseCoreUrl: n,
            instantJSON: a,
            XFDF: s,
            enableAutomaticLinkExtraction: o,
            overrideMemoryLimit: r,
            trustedCAsCallback: l,
            electronAppName: c,
            appName: d,
            isSharePoint: u,
            isSalesforce: m,
            productId: h,
            processorEngine: p,
            dynamicFonts: f,
          } = t;
          "string" == typeof s &&
            (this._XFDF = {
              source: s,
              keepCurrentAnnotations: !0 === t.XFDFKeepCurrentAnnotations,
              ignorePageRotation: !0 === t.XFDFIgnorePageRotation,
            }),
            a &&
              a.annotations &&
              (a.annotations = a.annotations.map((t) => {
                var e;
                return (
                  (t.id =
                    null === (e = t.id) || void 0 === e
                      ? void 0
                      : e.toString()),
                  t
                );
              })),
            (this._instantJSON = a),
            "function" == typeof l && (this._trustedCAsCallback = l);
          const {
              disableWebAssemblyStreaming: g,
              customFonts: b,
              fontSubstitutions: F,
            } = t,
            { standaloneInstancesPoolSize: k } = t;
          void 0 !== k && (ot.size = k);
          const v =
            !!t.electronicSignatures &&
            Boolean(t.electronicSignatures.forceLegacySignaturesFeature);
          let _ = h || null;
          (!u && !m) || _ || (_ = u ? q.x.SharePoint : q.x.Salesforce),
            (this._state = new j(
              lt({
                baseUrl: e,
                baseCoreUrl: n,
                licenseKey: t.licenseKey,
                document: t.document,
                disableWebAssemblyStreaming: g,
                enableAutomaticLinkExtraction: o,
                overrideMemoryLimit: r,
                documentHandle: "0",
                customFonts: b,
                fontSubstitutions: F,
                forceLegacySignaturesFeature: v,
                appName: d || c,
                productId: _,
                processorEngine: p || Q.l.fasterProcessing,
                dynamicFonts: f,
              }),
            )),
            (this._requestQueue = new L.Z(y.gZ));
          const { object: S, checkIn: P } = ot.checkOut();
          (this.client = S), (this.checkIn = P);
          const w = a
            ? at(
                {
                  annotations: a.annotations || [],
                  formFields: a.formFields || [],
                  formFieldValues: a.formFieldValues || [],
                  skippedPdfObjectIds: a.skippedPdfObjectIds || [],
                  skippedPdfFormFieldIds: a.skippedPdfFormFieldIds || [],
                  attachments: a.attachments || {},
                  bookmarks: a.bookmarks || [],
                  skippedPdfBookmarkIds: a.skippedPdfBookmarkIds || [],
                  format: a.format,
                },
                a.pdfId ? { pdfId: a.pdfId } : null,
              )
            : null;
          this.provider = new O(this.client, w);
        }
        isUsingInstantProvider() {
          return !1;
        }
        hasClientsPresence() {
          return !1;
        }
        async load() {
          let t =
            arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
          return (
            (this._isPDFJavaScriptEnabled = t.isPDFJavaScriptEnabled),
            {
              features: this._state.features,
              signatureFeatureAvailability:
                this._state.signatureFeatureAvailability,
              hasPassword: !!t.password,
              allowedTileScales: "all",
            }
          );
        }
        destroy() {
          this.provider && this.provider.destroy(),
            this._requestQueue && this._requestQueue.destroy(),
            this.checkIn();
        }
        async documentInfo() {
          return this._state.documentResponse;
        }
        async lazyLoadPages() {
          if (!this._state.lazyLoadedPages) {
            const t = await this.client.getAllPageInfos(
              this._state.documentResponse.pageCount,
            );
            this._state = this._state.set("lazyLoadedPages", t);
          }
          return this._state.lazyLoadedPages;
        }
        getDocumentHandle() {
          return this._state.documentHandle;
        }
        getFormJSON() {
          return this.client.getFormJSON();
        }
        permissions() {
          return Promise.resolve(this._state.backendPermissions);
        }
        textForPageIndex(t) {
          let e = !1;
          const n = new E(`${t}-text`, () =>
              e
                ? Promise.reject({ aborted: !0 })
                : this.client
                    .textForPageIndex(t)
                    .then((n) =>
                      e
                        ? Promise.reject({ aborted: !0 })
                        : (0, g.TH)({ textLines: n }, t),
                    ),
            ),
            { promise: i, cancel: a } = this._requestQueue.enqueue(n);
          return {
            promise: i,
            cancel: () => {
              (e = !0), a();
            },
          };
        }
        getTextContentTreeForPageIndex(t) {
          let e = !1;
          const n = new E(`${t}-text`, () =>
              e
                ? Promise.reject({ aborted: !0 })
                : this.client.textContentTreeForPageIndex(t).then((e) => {
                    let n = [],
                      i = 0;
                    return (
                      (n = e.reduce((e, n) => {
                        let { nodes: a } = n;
                        const s = (0, g.uv)(a, t, e.length, i);
                        return (
                          (i += s.reduce((t, e) => {
                            let { textLines: n } = e;
                            return t + n.size;
                          }, 0)),
                          e.concat(s)
                        );
                      }, [])),
                      (0, a.aV)(n)
                    );
                  }),
            ),
            { promise: i, cancel: s } = this._requestQueue.enqueue(n);
          return {
            promise: i,
            cancel: () => {
              (e = !0), s();
            },
          };
        }
        getTextFromRects(t, e) {
          return this.client.getTextFromRects(t, e.toJS());
        }
        getAvailableFontFaces(t) {
          return this.client.getAvailableFontFaces(t);
        }
        async getSuggestedLineHeightFactor(t) {
          return "number" != typeof t.pdfObjectId
            ? 1
            : "number" != typeof t.pageIndex
            ? ((0, s.ZK)("Annotation must have a pageIndex."), 1)
            : (t.lineHeightFactor &&
                (0, s.ZK)(
                  `Annotation ${t.id} already has a line height factor.`,
                ),
              this.client.getSuggestedLineHeightFactor(
                t.pdfObjectId,
                t.pageIndex,
              ));
        }
        async getClosestSnapPoint(t) {
          const e = await this.client.getClosestSnapPoint(t.x, t.y);
          return e && "number" == typeof e[0] && "number" == typeof e[1]
            ? new et.E9({ x: e[0], y: e[1] })
            : t;
        }
        configureSnapper(t) {
          return this.client.configureSnapper(t);
        }
        renderTile(t, e, n, i, a, o) {
          const r = `${t}-${e.width}-${e.height}-${n.top}-${n.left}-${
              n.width
            }-${n.height}-${this.getDocumentHandle()}`,
            l = new E(r, () => {
              const r = o ? o.annotations.filter(p.d).map(F.Hs).toJS() : null,
                l = o ? o.formFieldValues.map(F.kr).toJS() : null;
              return this.client
                .renderTile(
                  t,
                  e.toObject(),
                  n.toObject(),
                  i,
                  a,
                  r || (this._state.forceAnnotationsRender ? [] : null),
                  l,
                  (0, z.zP)(),
                )
                .then((i) =>
                  i
                    ? "string" == typeof i
                      ? (0, m.ar)(i)
                      : (0, m.R9)({
                          buffer: i,
                          width: n.width,
                          height: n.height,
                        })
                    : ((0, s.ZK)(
                        "The image buffer or URL is null, the tile cannot be rendered:",
                        `page: ${t}, page size: ${e.toObject()}, tile rect: ${n.toObject()}`,
                      ),
                      Promise.resolve(null)),
                );
            }),
            c = e.width === n.width && e.height === n.height,
            { promise: d, cancel: u } = this._requestQueue.enqueue(l, c);
          return { promise: d, cancel: u };
        }
        renderAnnotation(t, e, n, i, a, s) {
          const o = t.id,
            r = new E(o, () =>
              this.client
                .renderAnnotation((0, F.Hs)(t), n, i, a, (0, z.zP)(), s)
                .then((t) =>
                  t
                    ? "string" == typeof t
                      ? (0, m.ar)(t)
                      : (0, m.R9)({ buffer: t, width: i, height: a })
                    : Promise.resolve(null),
                ),
            );
          return this._requestQueue.enqueue(r, !1);
        }
        async getMeasurementSnappingPoints(t) {
          return this.client, this.client.getMeasurementSnappingPoints(t);
        }
        async getSecondaryMeasurementUnit() {
          return this.client, await this.client.getSecondaryMeasurementUnit();
        }
        async setSecondaryMeasurementUnit(t) {
          return this.client, await this.client.setSecondaryMeasurementUnit(t);
        }
        async compareDocuments(t, e) {
          this.client;
          const n = {
            originalDocument: t.originalDocument,
            changedDocument: t.changedDocument,
            comparisonOperation: (0, u.j)(e),
          };
          return await this.client.compareDocuments(n);
        }
        async renderPageAnnotations(t, e, n) {
          const i = this.provider,
            a = [],
            s = [],
            o = e.some((t) => t instanceof $.x_);
          o && (await i._setReadStateCallbacksPromise);
          const r = e.filter((t) => {
            const e = o
                ? i._readStateCallbacks.getAnnotationWithFormField(t.id)
                : null,
              n = null == e ? void 0 : e.formField,
              r = (0, p._R)(t, n);
            if (r && n) {
              a.find((t) => t.name === n.name) ||
                (a.push((0, F.kr)((0, N.CH)(n))), s.push(n));
            }
            return r;
          });
          function l(t, e) {
            if (null != t && t.formFieldName) {
              const n = s.find((e) => e.name === t.formFieldName),
                i = e.find((e) => e.name === t.formFieldName);
              if (!(0, N.BT)(n, i)) return !1;
            }
            return !0;
          }
          const c = new Promise((e, a) => {
            this.client
              .renderPageAnnotations(
                t,
                r.map((t) => t.pdfObjectId).toArray(),
                r.map((t) => t.boundingBox.width * n).toArray(),
                r.map((t) => t.boundingBox.height * n).toArray(),
                (0, z.zP)(),
              )
              .then((t) => {
                const a = s
                    .map((t) => {
                      var e;
                      return null === (e = i._readStateCallbacks) ||
                        void 0 === e
                        ? void 0
                        : e.getFormFieldByName(t.name);
                    })
                    .filter(Boolean),
                  o = t.map((t, e) => {
                    const i = r.get(e);
                    return l(i, a) && i && t
                      ? "string" == typeof t
                        ? (0, m.ar)(t)
                        : (0, m.R9)({
                            buffer: t,
                            width: i.boundingBox.width * n,
                            height: i.boundingBox.height * n,
                          })
                      : Promise.resolve(null);
                  });
                Promise.all(o).then((t) => {
                  const a = s
                    .map((t) => {
                      var e;
                      return null === (e = i._readStateCallbacks) ||
                        void 0 === e
                        ? void 0
                        : e.getFormFieldByName(t.name);
                    })
                    .filter(Boolean);
                  t.forEach((t, e) => {
                    const i = r.get(e);
                    if (i) {
                      const { formFieldValue: e } =
                          this.getAnnotationFormFieldAndValue(i),
                        s = this.getAnnotationAvailableVariants(i),
                        o = this.annotationAPStreamPromises.get(i.id),
                        r = l(i, a);
                      if (
                        (o &&
                          ((this.annotationAPStreamPromises =
                            this.annotationAPStreamPromises.delete(i.id)),
                          o(r ? t : null)),
                        s.length > 1)
                      ) {
                        const a = { normal: t };
                        t && r && this.cacheAPStream(a, i);
                        const { promise: o } = this.renderAPStream(
                          i,
                          e,
                          null,
                          i.boundingBox.width * n,
                          i.boundingBox.height * n,
                          s,
                        );
                        Promise.all(o.map((t) => t.promise)).then((t) => {
                          t.some(Boolean) &&
                            s.forEach((e, n) => {
                              "normal" !== e && t[n] && (a[e] = t[n]);
                            });
                        });
                      } else t && r && this.cacheAPStream(t, i);
                    }
                  }),
                    e();
                });
              })
              .catch(a);
          });
          return (
            (this.pageAPStreamsPromises = this.pageAPStreamsPromises.set(t, c)),
            c
          );
        }
        renderDetachedAnnotation(t, e, n, i) {
          if (t.id)
            throw new s.p2(
              `Detached annotations should not have an \`id\`: ${t.id}`,
            );
          const a = (0, c.SK)(),
            o = new E(a, () =>
              this.client
                .renderDetachedAnnotation((0, F.Hs)(t), e, n, i, (0, z.zP)())
                .then((t) =>
                  t
                    ? (0, m.R9)({ buffer: t, width: n, height: i })
                    : Promise.resolve(null),
                ),
            ),
            { promise: r, cancel: l } = this._requestQueue.enqueue(o, !1);
          return { promise: r, cancel: l };
        }
        async getAttachment(t) {
          const [e, n] = await this.client.getAttachment(t);
          return new Blob([e], { type: n });
        }
        async parseXFDF(t, e) {
          this.client;
          const {
            errors: n,
            formFieldValues: i,
            annotations: s,
          } = await this.client.parseXFDF(t, e);
          return {
            errors:
              null == n
                ? void 0
                : n.map((t) => ({
                    errorMessage: t.error_message,
                    type: t.type,
                  })),
            formFieldValues:
              null == i
                ? void 0
                : i.reduce((t, e) => ((t[e.fqdn] = e.values), t), {}),
            annotations: (0, a.aV)(
              (null == s ? void 0 : s.map((t) => (0, F.vH)((0, p.xc)(), t))) ||
                [],
            ),
          };
        }
        async search(t, e, n, i) {
          let a =
              arguments.length > 4 && void 0 !== arguments[4] && arguments[4],
            s =
              arguments.length > 5 && void 0 !== arguments[5]
                ? arguments[5]
                : J.S.TEXT;
          const o = await this.client.search(t, e, n, i, s);
          return (0, b.E)(o.filter((t) => a || !t.isAnnotation));
        }
        async searchAndRedact(t, e, n) {
          const { totalPages: i } = n,
            o = await this.client.search(
              t,
              0,
              i,
              e.caseSensitive,
              e.searchType,
            );
          return (0, a.aV)(
            o
              .filter((t) => e.searchInAnnotations || !t.isAnnotation)
              .map((t) => {
                const i = t.isAnnotation ? [t.annotationRect] : t.rectsOnPage,
                  o = (0, a.aV)(i).map((t) => ((0, s.kG)(t), (0, M.k)(t)));
                return new V.Z(
                  at(
                    at(at({}, (0, p.lx)(n)), e.annotationPreset),
                    {},
                    {
                      pageIndex: t.pageIndex,
                      rects: o,
                      boundingBox: G.Z.union(o),
                    },
                  ),
                );
              }),
          );
        }
        async exportPDF() {
          let {
            flatten: t = !1,
            incremental: e,
            saveForPrinting: n = !1,
            format: i = "pdf",
            excludeAnnotations: a = !1,
            preserveInstantJSONChanges: r = !0,
            permissions: l,
            outputFormat: c = !1,
          } = arguments.length > 0 && void 0 !== arguments[0]
            ? arguments[0]
            : {};
          if (
            (c &&
              "boolean" != typeof c &&
              c.conformance &&
              (0, s.kG)(
                c.conformance && Object.values(X.w).includes(c.conformance),
                "The supplied PDF/A Conformance type is not valid. Valid Conformance should be one of the following options PSPDFKit.Conformance." +
                  Object.keys(X.w).join(", PSPDFKit.Conformance."),
              ),
            void 0 === e)
          )
            if (this._state.features.includes(Z.q.DIGITAL_SIGNATURES)) {
              const t = await this.getSignaturesInfo();
              e = !n && Boolean("not_signed" !== t.status);
            } else e = !1;
          return this.client.exportFile(t, e, n, i, a, r, l).then(async (t) => {
            let [e, n] = t;
            if (((e.mimeType = n.mimeType), (e.extension = n.extension), c)) {
              const t =
                "boolean" != typeof c && c.conformance
                  ? c.conformance
                  : X.w.PDFA_2B;
              let n,
                a = (0, tt.xE)();
              try {
                return (
                  a ||
                    ((a = (0, tt.Un)({
                      baseUrl: this._state.baseCoreUrl,
                      mainThreadOrigin:
                        this._state.appName ||
                        (0, o.UK)() ||
                        window.location.origin,
                      licenseKey: this._state.licenseKey,
                      processorEngine: this._state.processorEngine,
                      customFonts: this._state.customFonts,
                      dynamicFonts: this._state.dynamicFonts,
                      fontSubstitutions: this._state.fontSubstitutions,
                    })),
                    (0, tt.Nt)(a)),
                  (n = await a),
                  await n.toPdf(e, t)
                );
              } finally {
                var i;
                null === (i = n) || void 0 === i || i.destroy();
              }
            }
            return e;
          });
        }
        exportXFDF(t) {
          return this.client.exportXFDF(t);
        }
        exportInstantJSON(t) {
          return this.client.exportInstantJSON(t);
        }
        getPDFURL() {
          let {
            includeComments: t = !0,
            saveForPrinting: e,
            excludeAnnotations: n,
          } = arguments.length > 0 && void 0 !== arguments[0]
            ? arguments[0]
            : {};
          return this.generatePDFObjectURL({
            includeComments: t,
            saveForPrinting: e,
            excludeAnnotations: n,
          });
        }
        generatePDFObjectURL() {
          let t,
            {
              includeComments: e = !0,
              saveForPrinting: n,
              excludeAnnotations: i = !1,
            } = arguments.length > 0 && void 0 !== arguments[0]
              ? arguments[0]
              : {},
            a = !1;
          return {
            promise: new Promise((s) => {
              this.exportPDF({
                flatten: !0,
                includeComments: e,
                saveForPrinting: n,
                excludeAnnotations: i,
              }).then((e) => {
                if (a) return;
                const n = new Blob([e], { type: e.mimeType });
                (t = window.URL.createObjectURL(n)), s(t);
              });
            }),
            revoke: () => {
              t && window.URL.revokeObjectURL(t), (a = !0);
            },
          };
        }
        async getDocumentOutline() {
          const t = await this.client.getDocumentOutline();
          return (0, a.aV)(t.map(h.i));
        }
        async setDocumentOutline(t) {
          return this.client.setDocumentOutline(t.map(h.a).toArray());
        }
        async getPageGlyphs(t) {
          const e = await this.client.getPageGlyphs(t);
          return (0, F.Vl)(e);
        }
        async onKeystrokeEvent(t) {
          return await this.client.onKeystrokeEvent(t);
        }
        async evalFormValuesActions(t) {
          return this.client.evalFormValuesActions(t.map(F.kr).toJS());
        }
        async evalScript(t, e) {
          return this.client.evalScript(t, e);
        }
        async setFormJSONUpdateBatchMode(t) {
          return this.client.setFormJSONUpdateBatchMode(t);
        }
        async getMeasurementScales() {
          const t = await this.client.getMeasurementScales();
          return null == t ? void 0 : t.measurementContentFormats;
        }
        async addMeasurementScale(t) {
          return this.client, await this.client.addMeasurementScale(t);
        }
        async removeMeasurementScale(t) {
          return this.client, await this.client.removeMeasurementScale(t);
        }
        async getAnnotationsByScale(t) {
          return this.client, await this.client.getAnnotationsByScale(t);
        }
        async applyOperationsAndReload(t) {
          try {
            let e, n;
            ({ processedOperations: e, operationsDocuments: n } = await dt(t)),
              await this.client.applyOperations(e, n);
          } catch (t) {
            throw new s.p2(`Applying operations failed: ${t}`);
          }
          return (
            (this.provider._state = this.provider._state.set(
              "alreadyLoadedPages",
              (0, a.D5)(),
            )),
            this.reloadDocument()
          );
        }
        async applyRedactionsAndReload() {
          try {
            await this.client.applyRedactions();
          } catch (t) {
            throw new s.p2(`Applying redactions failed: ${t}`);
          }
          return this.reloadDocument();
        }
        async reloadDocument() {
          try {
            var t;
            null === (t = this.provider) || void 0 === t || t.destroy(),
              (this.provider = new O(this.client, null)),
              (this._state = this._state.set("lazyLoadedPages", null));
            const e = await this.client.reloadDocument();
            return (
              (this._state = this._state
                .set("documentResponse", e)
                .set(
                  "documentHandle",
                  (parseInt(this._state.documentHandle) + 1).toString(),
                )
                .set("signaturesInfoPromise", null)),
              {
                features: this._state.features,
                signatureFeatureAvailability:
                  this._state.signatureFeatureAvailability,
                hasPassword: !1,
                allowedTileScales: "all",
              }
            );
          } catch (t) {
            throw new s.p2(`Reloading failed: ${t}`);
          }
        }
        async getEmbeddedFiles() {
          this.client;
          const t = await this.client.getEmbeddedFilesList();
          return (0, a.aV)(
            t.map((t) => {
              let { id: e } = t,
                n = (0, l.Z)(t, nt);
              return (0, W.i)(e, n, !0);
            }),
          );
        }
        async exportPDFWithOperations(t) {
          try {
            let e, n;
            return (
              ({ processedOperations: e, operationsDocuments: n } =
                await dt(t)),
              this.client.exportPDFWithOperations(e, n)
            );
          } catch (t) {
            throw new s.p2(`Exporting PDF with operations failed: ${t}`);
          }
        }
        getSignaturesInfo() {
          try {
            if (this._state.signaturesInfoPromise)
              return this._state.signaturesInfoPromise;
            const t = this.client.getSignaturesInfo().then((t) => (0, F.rS)(t));
            return (
              (this._state = this._state.set("signaturesInfoPromise", t)), t
            );
          } catch (t) {
            throw new s.p2(`Getting document signatures info: ${t}`);
          }
        }
        async refreshSignaturesInfo() {
          this._state = this._state.set("signaturesInfoPromise", null);
        }
        async loadCertificates(t) {
          return this.client.loadCertificates(t);
        }
        async signDocumentAndReload(t, e) {
          var n, i, a, o, r, l, c, u, m, h, p, f, g;
          (0, s.kG)(
            void 0 === e || "function" == typeof e,
            "On a Standalone deployment, `twoStepSignatureCallbackOrSigningServiceData` must be a function if provided.",
          );
          const y =
            null == t || null === (n = t.signingData) || void 0 === n
              ? void 0
              : n.certificates;
          (0, s.kG)(
            !(
              null != t &&
              null !== (i = t.signingData) &&
              void 0 !== i &&
              i.signatureType
            ) ||
              (null == t || null === (a = t.signingData) || void 0 === a
                ? void 0
                : a.signatureType) === Y.BG.CMS ||
              (Array.isArray(y) && y.length > 0),
            "For signatures of type `PSPDFKit.SignatureType.CAdES` an `Array` of certificates must be provided in `signaturePreparationData.signingData.certificates`.",
          ),
            (0, s.kG)(
              !(
                null != t &&
                null !== (o = t.signingData) &&
                void 0 !== o &&
                o.timestamp
              ) ||
                "string" ==
                  typeof (null == t ||
                  null === (r = t.signingData) ||
                  void 0 === r ||
                  null === (r = r.timestamp) ||
                  void 0 === r
                    ? void 0
                    : r.url),
              "The `url` property of `signingData.timestamp` must be a string.",
            ),
            (0, s.kG)(
              !(
                null != t &&
                null !== (l = t.signingData) &&
                void 0 !== l &&
                l.timestamp &&
                null != t &&
                null !== (c = t.signingData) &&
                void 0 !== c &&
                null !== (c = c.timestamp) &&
                void 0 !== c &&
                c.password &&
                "string" !=
                  typeof (null == t ||
                  null === (u = t.signingData) ||
                  void 0 === u ||
                  null === (u = u.timestamp) ||
                  void 0 === u
                    ? void 0
                    : u.password)
              ),
              "The `password` property of `signingData.timestamp` must be a string.",
            ),
            (0, s.kG)(
              !(
                null != t &&
                null !== (m = t.signingData) &&
                void 0 !== m &&
                m.timestamp &&
                null != t &&
                null !== (h = t.signingData) &&
                void 0 !== h &&
                null !== (h = h.timestamp) &&
                void 0 !== h &&
                h.username &&
                "string" !=
                  typeof (null == t ||
                  null === (p = t.signingData) ||
                  void 0 === p ||
                  null === (p = p.timestamp) ||
                  void 0 === p
                    ? void 0
                    : p.username)
              ),
              "The `username` property of `signingData.timestamp` must be a string.",
            );
          const b = at(
            at(
              {
                signatureType:
                  (null == t || null === (f = t.signingData) || void 0 === f
                    ? void 0
                    : f.signatureType) ||
                  (Array.isArray(y) && y.length > 0 ? Y.BG.CAdES : Y.BG.CMS),
              },
              (null == t || null === (g = t.signingData) || void 0 === g
                ? void 0
                : g.certificates) && {
                certificates: t.signingData.certificates.map((t) =>
                  t instanceof ArrayBuffer ? (0, R.sM)(t) : d.Base64.encode(t),
                ),
              },
            ),
            null != t && t.placeholderSize
              ? { estimatedSize: t.placeholderSize }
              : null,
          );
          try {
            var k, v;
            const {
                hash: n,
                signatureFormFieldName: i,
                file: a,
                fileContents: o,
                dataToBeSigned: r,
              } = await this.client.prepareSign(
                (0, F._L)(b),
                null != t && t.signatureMetadata
                  ? (0, F._D)(t.signatureMetadata)
                  : null,
                Boolean(null == t ? void 0 : t.flatten),
                null == t ? void 0 : t.formFieldName,
                (0, F.eE)(null == t ? void 0 : t.position),
                (0, F.sr)(null == t ? void 0 : t.appearance),
                (await (null == t ||
                null === (k = t.appearance) ||
                void 0 === k ||
                null === (k = k.watermarkImage) ||
                void 0 === k
                  ? void 0
                  : k.arrayBuffer())) || null,
              ),
              l = (function (t) {
                const e = t.trim(),
                  n = e.length / 2,
                  i = new Uint8Array(n);
                for (let t = 0; t < n; t++)
                  i[t] = parseInt(e.substr(2 * t, 2), 16);
                return i;
              })(r);
            let c, d, u;
            if (e) {
              try {
                c = await e({ hash: n, fileContents: o, dataToBeSigned: l });
              } catch (t) {
                throw new s.p2(
                  `\`twoStepSignatureCallback\` threw an error: ${t}`,
                );
              }
              if (!(c instanceof ArrayBuffer))
                throw new s.p2(
                  `The resolved value from \`twoStepSignatureCallback\` should be a an \`ArrayBuffer\` but is of type \`${typeof c}\` instead.`,
                );
              u = c;
            } else {
              if (null == t || !t.signingData || !t.signingData.privateKey)
                throw new s.p2(
                  "No `twoStepSignatureCallback` or `signingData.privateKey` was provided.",
                );
              {
                const e = {
                    name: "RSASSA-PKCS1-v1_5",
                    hash: { name: "SHA-256" },
                    modulusLength: 2048,
                    extractable: !1,
                    publicExponent: new Uint8Array([1, 0, 1]),
                  },
                  n = await globalThis.crypto.subtle.importKey(
                    "pkcs8",
                    (function (t) {
                      const e = t.split("\n");
                      let n = "";
                      for (let t = 0; t < e.length; t++)
                        e[t].trim().length > 0 &&
                          e[t].indexOf("-BEGIN RSA PRIVATE KEY-") < 0 &&
                          e[t].indexOf("-BEGIN PRIVATE KEY-") < 0 &&
                          e[t].indexOf("-BEGIN RSA PUBLIC KEY-") < 0 &&
                          e[t].indexOf("-BEGIN CERTIFICATE-") < 0 &&
                          e[t].indexOf("-END RSA PRIVATE KEY-") < 0 &&
                          e[t].indexOf("-END PRIVATE KEY-") < 0 &&
                          e[t].indexOf("-END RSA PUBLIC KEY-") < 0 &&
                          e[t].indexOf("-END CERTIFICATE-") < 0 &&
                          (n += e[t].trim());
                      return ut(n);
                    })(t.signingData.privateKey),
                    e,
                    !0,
                    ["sign"],
                  );
                (d = await globalThis.crypto.subtle.sign(e, n, l)), (u = d);
              }
            }
            const m = (0, R.sM)(u) || "";
            let h = null;
            if (
              null != t &&
              null !== (v = t.signingData) &&
              void 0 !== v &&
              v.timestamp
            ) {
              const {
                  url: e,
                  username: n = "",
                  password: i = "",
                } = t.signingData.timestamp,
                a = await this.client.getTimestampRequest(m, {
                  url: e,
                  username: n,
                  password: i,
                }),
                s = {
                  method: a.method,
                  headers: {
                    "Content-Type":
                      a.contentType || "application/timestamp-query",
                  },
                  body: ut(a.requestData),
                };
              (a.username || a.password) &&
                (s.headers.Authorization = `Basic ${btoa(
                  `${a.username}:${a.password}`,
                )}`);
              try {
                const t = await fetch(a.url, s),
                  e = await t.arrayBuffer();
                h = {
                  response_code: t.status,
                  body: (0, R.sM)(e),
                  token: a.token,
                };
              } catch (t) {
                h = {
                  response_code: 0,
                  body: "",
                  token: a.token,
                  error_message: t.message,
                };
              }
            }
            return (
              await this.client.sign(
                a,
                i,
                n,
                F.YA[b.signatureType],
                m,
                b.certificates || [],
                h,
              ),
              await this.reloadDocument(),
              i
            );
          } catch (t) {
            throw (await this.client.restoreToOriginalState(), t);
          }
        }
        cancelRequests() {
          this._requestQueue.cancelAll();
        }
        async syncChanges() {}
        getDefaultGroup() {}
        isCollaborationPermissionsEnabled() {
          return !1;
        }
        async clearAPStreamCache() {
          return this.client.clearAPStreamCache();
        }
        async setComparisonDocument(t, e) {
          return this.client, this.client.setComparisonDocument(t, e);
        }
        async openComparisonDocument(t) {
          return (
            this.client,
            (this._state = this._state.set("forceAnnotationsRender", !1)),
            await this.client.closeDocument(),
            (this._state = this._state.set("forceAnnotationsRender", !0)),
            (await this.client.openComparisonDocument(t)) ||
              this._state.documentResponse
          );
        }
        async documentCompareAndOpen(t) {
          return this.client, this.client.documentCompareAndOpen(t);
        }
        async persistOpenDocument(t) {
          return this.client, this.client.persistOpenDocument(t);
        }
        async cleanupDocumentComparison() {
          return this.client, this.client.cleanupDocumentComparison();
        }
        async runPDFFormattingScripts(t, e) {
          return this.client.runPDFFormattingScripts(t, e);
        }
        async runPDFFormattingScriptsFromWidgets(t, e, n) {
          let i = [];
          if (this._isPDFJavaScriptEnabled) {
            const { withAPStream: a, withoutAPStream: s } = t.reduce(
              (t, i) => {
                if (i instanceof $.x_) {
                  if (
                    (null == e ? void 0 : e.get(i.formFieldName)) instanceof
                    $.Yo
                  )
                    return t;
                  null != n && n(i)
                    ? t.withAPStream.push(i.formFieldName)
                    : t.withoutAPStream.push(i.formFieldName);
                }
                return t;
              },
              { withAPStream: [], withoutAPStream: [] },
            );
            let o = [];
            if (a.length && !s.length)
              o = await this.runPDFFormattingScripts(a, !0);
            else if (!a.length && s.length)
              o = await this.runPDFFormattingScripts(s, !1);
            else if (a.length && s.length) {
              const [t, e] = await Promise.all([
                this.runPDFFormattingScripts(a, !0),
                this.runPDFFormattingScripts(s, !1),
              ]);
              o = t.concat(e);
            }
            i = (0, N.gE)(this._initialChanges, o);
          }
          return i;
        }
        setFontSubstitutions(t) {
          return this.client, this.client.setFontSubstitutions(t);
        }
        contentEditorEnter() {
          return this.client, this.client.contentEditorEnter();
        }
        contentEditorExit() {
          return this.client, this.client.contentEditorExit();
        }
        contentEditorGetTextBlocks(t) {
          return this.client, this.client.contentEditorGetTextBlocks(t);
        }
        contentEditorDetectParagraphs(t) {
          return this.client, this.client.contentEditorDetectParagraphs(t);
        }
        contentEditorRenderTextBlock(t, e, n) {
          return this.client, this.client.contentEditorRenderTextBlock(t, e, n);
        }
        contentEditorSetTextBlockCursor(t, e, n, i) {
          return (
            this.client, this.client.contentEditorSetTextBlockCursor(t, e, n, i)
          );
        }
        contentEditorMoveTextBlockCursor(t, e, n, i) {
          return (
            this.client,
            this.client.contentEditorMoveTextBlockCursor(t, e, n, i)
          );
        }
        contentEditorInsertTextBlockString(t, e, n, i) {
          return (
            this.client,
            this.client.contentEditorInsertTextBlockString(t, e, n, i)
          );
        }
        contentEditorInsertTextBlockContentRef(t, e, n, i) {
          return (
            this.client,
            this.client.contentEditorInsertTextBlockContentRef(t, e, n, i)
          );
        }
        contentEditorCreateTextBlock(t) {
          return this.client, this.client.contentEditorCreateTextBlock(t);
        }
        contentEditorLayoutTextBlock(t, e, n, i) {
          return (
            this.client, this.client.contentEditorLayoutTextBlock(t, e, n, i)
          );
        }
        contentEditorDeleteTextBlockRange(t, e, n) {
          return (
            this.client, this.client.contentEditorDeleteTextBlockRange(t, e, n)
          );
        }
        contentEditorDeleteTextBlockString(t, e, n) {
          return (
            this.client, this.client.contentEditorDeleteTextBlockString(t, e, n)
          );
        }
        contentEditorSetTextBlockSelection(t, e, n) {
          return (
            this.client, this.client.contentEditorSetTextBlockSelection(t, e, n)
          );
        }
        contentEditorSetTextBlockSelectionRange(t, e, n, i, a) {
          return (
            this.client,
            this.client.contentEditorSetTextBlockSelectionRange(t, e, n, i, a)
          );
        }
        contentEditorTextBlockUndo(t, e) {
          return this.client, this.client.contentEditorTextBlockUndo(t, e);
        }
        contentEditorTextBlockRedo(t, e) {
          return this.client, this.client.contentEditorTextBlockRedo(t, e);
        }
        contentEditorTextBlockRestore(t, e, n) {
          return (
            this.client, this.client.contentEditorTextBlockRestore(t, e, n)
          );
        }
        contentEditorTextBlockApplyFormat(t, e, n, i) {
          return (
            this.client,
            this.client.contentEditorTextBlockApplyFormat(t, e, n, i)
          );
        }
        async contentEditorGetAvailableFaces() {
          return this.client, this.client.contentEditorGetAvailableFaces();
        }
        async contentEditorSaveAndReload(t) {
          return (
            (0, s.kG)(
              this.provider instanceof O,
              "Standalone can only use standalone annotation provider",
            ),
            this.client,
            await this.client.contentEditorSave(t),
            (this.provider._state = this.provider._state.set(
              "alreadyLoadedPages",
              (0, a.D5)(),
            )),
            this.reloadDocument()
          );
        }
        getOCGs() {
          return this.client.getOCGs();
        }
        getOCGVisibilityState() {
          return this.client.getOCGVisibilityState();
        }
        setOCGVisibilityState(t) {
          return this.client.setOCGVisibilityState(t);
        }
      }
      function lt(t) {
        return {
          baseUrl: t.baseUrl,
          baseCoreUrl: t.baseCoreUrl,
          licenseKey: t.licenseKey,
          document: t.document,
          disableWebAssemblyStreaming: !!t.disableWebAssemblyStreaming,
          enableAutomaticLinkExtraction: !!t.enableAutomaticLinkExtraction,
          overrideMemoryLimit:
            "number" == typeof t.overrideMemoryLimit
              ? t.overrideMemoryLimit
              : null,
          documentHandle:
            "number" == typeof t.documentHandle ? t.documentHandle : "0",
          trustedCAsCallback:
            "function" == typeof t.trustedCAsCallback
              ? t.trustedCAsCallback
              : null,
          customFonts: Array.isArray(t.customFonts)
            ? t.customFonts.filter((t) => t instanceof H.Z)
            : null,
          forceLegacySignaturesFeature: Boolean(t.forceLegacySignaturesFeature),
          appName: "string" == typeof t.appName ? t.appName : null,
          productId: t.productId,
          processorEngine: t.processorEngine,
          dynamicFonts: t.dynamicFonts,
          fontSubstitutions: t.fontSubstitutions,
        };
      }
      function ct(t) {
        const {
          licenseKey: e,
          instantJSON: n,
          XFDF: i,
          disableWebAssemblyStreaming: a,
          disableIndexedDBCaching: o,
          enableAutomaticLinkExtraction: r,
          overrideMemoryLimit: l,
          standaloneInstancesPoolSize: c,
          trustedCAsCallback: d,
          baseUrl: u,
          baseCoreUrl: m,
          customFonts: h,
          isSharePoint: p,
          isSalesforce: f,
          dynamicFonts: g,
        } = t;
        if (
          ((0, s.kG)(
            "string" == typeof u,
            "`baseUrl` is mandatory and must be a valid URL, e.g. `https://example.com/",
          ),
          (0, K.Pn)(u),
          (0, s.kG)(
            !m || "string" == typeof m,
            "`baseCoreUrl` must be a valid URL if set, e.g. `https://example.com/",
          ),
          m && (0, K.rH)(m),
          (0, s.kG)(
            null == e || "string" == typeof e,
            "licenseKey must be a string value if provided. Please obtain yours from https://customers.pspdfkit.com.",
          ),
          "string" == typeof e &&
            (0, s.kG)(
              !e.startsWith("TRIAL-"),
              "You're using the npm key instead of the license key. This key is used to download the PSPDFKit for Web package via the node package manager.\n\nLeave out the license key to activate as a trial.",
            ),
          (0, s.kG)(
            void 0 === i || "string" == typeof i,
            "XFDF must be a string",
          ),
          n &&
            ((0, s.Ou)(n),
            (0, s.kG)(
              void 0 === i,
              "Cannot import from both instantJSON and XFDF",
            )),
          (0, s.kG)(
            void 0 === a || "boolean" == typeof a,
            "disableWebAssemblyStreaming must be a boolean",
          ),
          (0, s.kG)(
            void 0 === r || "boolean" == typeof r,
            "enableAutomaticLinkExtraction must be a boolean",
          ),
          (0, s.kG)(
            void 0 === l || "number" == typeof l,
            "overrideMemoryLimit must be a number",
          ),
          (0, s.kG)(
            void 0 === c || ("number" == typeof c && c >= 0),
            "standaloneInstancesPoolSize must be a non-negative number",
          ),
          (0, s.kG)(
            void 0 === d || "function" == typeof d,
            "trustedCAsCallback must be a function",
          ),
          (0, s.kG)(
            void 0 === h ||
              (Array.isArray(h) && h.every((t) => t instanceof H.Z)),
            "customFonts must be an array of PSPDFKit.Font instances",
          ),
          (0, s.kG)(
            void 0 === h || h.every((t) => t.callback),
            "All PSPDFKit.Font instances specified on customFonts must have its callback property defined",
          ),
          void 0 !== o &&
            (0, s.a1)(
              "disableIndexedDbCaching has been deprecated and it no longer has effect. It will be removed in a later version.\nBrowsers dropped IndexedDB serialization of Wasm modules in favor of regular HTTP caching.",
            ),
          (p || f) &&
            (0, s.a1)(
              "isSharePoint and isSalesforce configuration properties are deprecated and will be removed in the next major release. Please use the new Configuration#productId property instead. For more information, please check the migration guide.",
            ),
          (0, s.kG)(
            !(p && f),
            "You cannot enable both SharePoint and Salesforce integrations at the same time. Please set either isSharePoint or isSalesforce to true, but not both.",
          ),
          "string" == typeof g)
        )
          try {
            new URL(g);
          } catch (t) {
            throw new s.p2(
              "dynamicFonts must be a valid URL to a JSON file containing the data for fonts to be dynamically loaded.",
            );
          }
      }
      async function dt(t) {
        const e = new WeakMap(),
          n = {};
        return {
          processedOperations: await Promise.all(
            t.map(async (t, i) => {
              if ("importDocument" === t.type) {
                const { document: a } = t;
                return (
                  (0, s.kG)(
                    a instanceof File || a instanceof Blob,
                    "Wrong `importDocument` operation `document` value: it must be a File or a Blob",
                  ),
                  (0, U.M)(e, n, a, t, i, "document")
                );
              }
              if ("applyInstantJson" === t.type) {
                const a = t.instantJson;
                (0, s.kG)(
                  "object" == typeof a && null !== a,
                  "Wrong `applyInstantJson` operation `instantJson` value: it must be an object",
                );
                const o = JSON.stringify(a),
                  r = new Blob([o], { type: "application/json" });
                return (0, U.M)(e, n, r, t, i, "dataFilePath");
              }
              if ("applyXfdf" === t.type) {
                const a = t.xfdf;
                (0, s.kG)(
                  "string" == typeof a,
                  "Wrong `applyXfdf` operation `xfdf` value: it must be a string",
                );
                const o = new Blob([a], { type: "application/vnd.adobe.xfdf" });
                return (0, U.M)(e, n, o, t, i, "dataFilePath");
              }
              return t;
            }),
          ),
          operationsDocuments: n,
        };
      }
      function ut(t) {
        const e = atob(t),
          n = new Uint8Array(e.length);
        for (let t = 0; t < e.length; t++) n[t] = e.charCodeAt(t);
        return n.buffer;
      }
      var mt = n(19815),
        ht = n(30761),
        pt = n(38623);
      function ft(t, e) {
        var n = Object.keys(t);
        if (Object.getOwnPropertySymbols) {
          var i = Object.getOwnPropertySymbols(t);
          e &&
            (i = i.filter(function (e) {
              return Object.getOwnPropertyDescriptor(t, e).enumerable;
            })),
            n.push.apply(n, i);
        }
        return n;
      }
      function gt(t) {
        for (var e = 1; e < arguments.length; e++) {
          var n = null != arguments[e] ? arguments[e] : {};
          e % 2
            ? ft(Object(n), !0).forEach(function (e) {
                (0, i.Z)(t, e, n[e]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n))
            : ft(Object(n)).forEach(function (e) {
                Object.defineProperty(
                  t,
                  e,
                  Object.getOwnPropertyDescriptor(n, e),
                );
              });
        }
        return t;
      }
      let yt;
      class bt extends rt {
        constructor(t) {
          const e = t.baseUrl || (0, r.SV)(window.document),
            n = t.baseCoreUrl || e,
            i = gt(gt({}, t), {}, { baseUrl: e, baseCoreUrl: n });
          if ("string" != typeof i.baseUrl)
            throw new s.p2(
              "`baseUrl` is mandatory and must be a valid URL, e.g. `https://example.com/`",
            );
          if (
            "string" != typeof i.document &&
            !(i.document instanceof ArrayBuffer)
          )
            throw new s.p2(
              "document must be either an URL to a supported document type (PDF and images), e.g. `https://example.com/document.pdf`, or an `ArrayBuffer`",
            );
          if (yt && yt !== i.licenseKey)
            throw new s.p2(
              "Trying to re-use PSPDFKit for Web with a different licenseKey than the previous one.\nUnfortunately we only allow one licenseKey per instance.\nPlease contact support for further assistance.",
            );
          if (
            "string" == typeof i.licenseKey &&
            i.licenseKey.startsWith("TRIAL-")
          )
            throw new s.p2(
              "You're using the npm key instead of the license key. This key is used to download the PSPDFKit for Web package via the node package manager.\n\nLeave out the license key to activate as a trial.",
            );
          super(i), (this.destroyed = !1);
        }
        async load() {
          let t =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : {},
            e = 0.2;
          t.progressCallback && t.progressCallback("loading", e),
            (this._isPDFJavaScriptEnabled = t.isPDFJavaScriptEnabled);
          const n = (0, ht.D4)(
              this._state.baseUrl,
              this._state.document,
              this._state.productId,
              () => {
                (e += 0.3),
                  t.progressCallback && t.progressCallback("loading", e);
              },
            ),
            i = await kt(this.client, this._state).finally(() => {
              (e += 0.3),
                t.progressCallback && t.progressCallback("loading", e);
            });
          (0, s.kG)(i);
          const { features: r, signatureFeatureAvailability: l } = i;
          if (
            this._state.productId === q.x.SharePoint &&
            "string" == typeof this._state.document &&
            Array.isArray(i.afu)
          ) {
            const t = new URL(this._state.document, this._state.baseUrl);
            if (!i.afu.some((e) => t.hostname.match(e)))
              throw new s.p2(
                `The document origin ${t.hostname} is not authorized.`,
              );
          }
          const c =
            l === T.H.ELECTRONIC_SIGNATURES &&
            (0, mt.Vz)(r) &&
            this._state.forceLegacySignaturesFeature
              ? T.H.LEGACY_SIGNATURES
              : l;
          (this._state = this._state
            .set("features", (0, a.aV)(r))
            .set("signatureFeatureAvailability", c)),
            (yt = this._state.licenseKey);
          const d = await n;
          let u,
            m = d.slice(0);
          try {
            this.destroyed
              ? ((m = null), (u = await new Promise(() => {})))
              : ((u = await this.client.openDocument(
                  d,
                  t.password,
                  "number" == typeof t.initialPageIndex
                    ? t.initialPageIndex
                    : 0,
                )),
                (m = null));
          } catch (e) {
            if (
              ("INVALID_PASSWORD" === e.message &&
                this._state.document instanceof ArrayBuffer &&
                (this._state = this._state.set("document", e.callArgs[0])),
              "IMAGE_DOCUMENTS_NOT_LICENSED" === e.message &&
                (e.message =
                  "The image documents feature is not enabled for your license key. Please contact support or sales to purchase the UI module for PSPDFKit for Web."),
              !(
                e instanceof s.p2 &&
                e.message.includes("File not in PDF format or corrupted.") &&
                this._state.productId !== q.x.Salesforce
              ))
            )
              throw e;
            {
              (0, s.kG)(m);
              let n,
                i = (0, tt.xE)();
              try {
                i ||
                  ((i = (0, tt.Un)({
                    baseUrl: this._state.baseCoreUrl,
                    mainThreadOrigin:
                      this._state.appName ||
                      (0, o.UK)() ||
                      window.location.origin,
                    licenseKey: this._state.licenseKey || void 0,
                    customFonts: this._state.customFonts || void 0,
                    dynamicFonts: this._state.dynamicFonts || void 0,
                    fontSubstitutions: this._state.fontSubstitutions,
                    processorEngine: this._state.processorEngine,
                  })),
                  (0, tt.Nt)(i)),
                  (n = await i),
                  (0, s.kG)(n);
                const e = await n.toPdf(m);
                u = await this.client.openDocument(
                  e,
                  t.password,
                  "number" == typeof t.initialPageIndex
                    ? t.initialPageIndex
                    : 0,
                );
              } catch (t) {
                throw (
                  ("INVALID_PASSWORD" === t.message &&
                    this._state.document instanceof ArrayBuffer &&
                    (this._state = this._state.set("document", e.callArgs[0])),
                  "IMAGE_DOCUMENTS_NOT_LICENSED" === t.message &&
                    (t.message =
                      "The image documents feature is not enabled for your license key. Please contact support or sales to purchase the UI module for PSPDFKit for Web."),
                  t)
                );
              } finally {
                var h;
                (m = null),
                  null === (h = n) || void 0 === h || h.destroy(),
                  (0, tt.Nt)(null);
              }
            }
          }
          if (
            (this._isPDFJavaScriptEnabled &&
              (this._initialChanges =
                await this.client.enablePDFJavaScriptSupport()),
            this._XFDF &&
              (await this.client.importXFDF(
                this._XFDF.source,
                this._XFDF.keepCurrentAnnotations,
                this._XFDF.ignorePageRotation,
              )),
            this._instantJSON && this._instantJSON.pdfId && u.ID.permanent)
          ) {
            const t = this._instantJSON.pdfId,
              e = u.ID;
            if (t.permanent !== e.permanent)
              throw new s.p2(
                "Could not instantiate from Instant JSON: Permanent PDF ID mismatch.\nPlease use the same PDF document that was used to create this Instant JSON.\nFor more information, please visit: https://pspdfkit.com/guides/web/current/importing-exporting/instant-json/",
              );
            if (t.changing !== e.changing)
              throw new s.p2(
                "Could not instantiate from Instant JSON: Changing PDF ID mismatch.\nPlease use the same revision of this PDF document that was used to create this Instant JSON.\nFor more information, please visit: https://pspdfkit.com/guides/web/current/importing-exporting/instant-json/",
              );
          }
          if (this._trustedCAsCallback)
            try {
              const t = await this._trustedCAsCallback();
              if (!Array.isArray(t))
                throw new s.p2("Certificates response must be an array");
              if (
                t.some(
                  (t) => !(t instanceof ArrayBuffer) && "string" != typeof t,
                )
              )
                throw new s.p2(
                  "All certificates must be passed as ArrayBuffer (DER) or string (PEM)",
                );
              await this.client.loadCertificates(t.map(R.uF));
            } catch (t) {
              throw new s.p2(
                `Could not retrieve certificates for digital signatures validation: ${t.message}.`,
              );
            }
          return (
            (this._state = this._state.set("documentResponse", u)),
            {
              features: this._state.features,
              signatureFeatureAvailability:
                this._state.signatureFeatureAvailability,
              hasPassword: !!t.password,
              allowedTileScales: "all",
            }
          );
        }
        destroy() {
          (this.destroyed = !0), super.destroy();
        }
        getCustomFontsPromise() {
          return Ft;
        }
      }
      const Ft = { current: void 0 };
      async function kt(t, e) {
        Ft.current =
          Ft.current || (e.customFonts ? (0, pt.x6)(e.customFonts) : void 0);
        const n = e.appName || (0, o.UK)() || window.location.origin;
        return t
          .loadNativeModule(e.baseCoreUrl, {
            mainThreadOrigin: n,
            disableWebAssemblyStreaming: e.disableWebAssemblyStreaming,
            enableAutomaticLinkExtraction: e.enableAutomaticLinkExtraction,
            overrideMemoryLimit: e.overrideMemoryLimit,
            workerSpawnerFn: o.$u,
          })
          .then(async () =>
            t.load(
              e.baseCoreUrl,
              e.licenseKey,
              gt(
                gt(
                  { mainThreadOrigin: n },
                  Ft.current ? { customFonts: await Ft.current } : null,
                ),
                {},
                { dynamicFonts: e.dynamicFonts, productId: e.productId },
              ),
            ),
          );
      }
    },
  },
]);
