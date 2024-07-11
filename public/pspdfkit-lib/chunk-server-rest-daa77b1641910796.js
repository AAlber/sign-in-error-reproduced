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
  [4099],
  {
    62961: (t, e, a) => {
      a.d(e, { RESTProvider: () => P });
      var s = a(17375),
        o = a(84121),
        i = a(35369),
        r = a(47347),
        n = a(2810),
        l = a(44048);
      class d extends i.WV({
        alreadyLoadedPages: (0, i.D5)(),
        serverURL: null,
        authPayload: null,
        isLoaded: !1,
        isFormsEnabled: !0,
        loadBookmarksPromise: null,
        ignoredFormFieldNames: null,
      }) {}
      var c = a(11032),
        h = a(83253),
        m = a(13997);
      const u = ["id"],
        k = ["id"],
        y = ["id"],
        f = ["id"];
      function b(t, e) {
        var a = Object.keys(t);
        if (Object.getOwnPropertySymbols) {
          var s = Object.getOwnPropertySymbols(t);
          e &&
            (s = s.filter(function (e) {
              return Object.getOwnPropertyDescriptor(t, e).enumerable;
            })),
            a.push.apply(a, s);
        }
        return a;
      }
      class P {
        constructor(t, e, a) {
          let { isFormsEnabled: s } = a;
          (0, o.Z)(this, "canCreateBackendOrphanWidgets", !0),
            (0, o.Z)(this, "setDocumentHandleConflictCallback", () => {}),
            (this.state = new d({
              serverURL: t,
              authPayload: e,
              isFormsEnabled: s,
            })),
            (this._setReadStateCallbacksPromise = new Promise((t) => {
              this._setReadStateCallbacksPromiseResolve = t;
            }));
        }
        async load() {
          return (
            (this.state = this.state.set("isLoaded", !0)),
            this.state.isFormsEnabled &&
              (await this._initializeFormFieldValues()),
            this
          );
        }
        destroy() {}
        setReadStateCallbacks(t) {
          var e;
          (this._readStateCallbacks = t),
            null === (e = this._setReadStateCallbacksPromiseResolve) ||
              void 0 === e ||
              e.call(this);
        }
        setAnnotationCallbacks(t) {
          this.annotationCallbacks = t;
        }
        setBookmarkCallbacks(t) {
          this.bookmarkCallbacks = t;
        }
        setFormFieldValueCallbacks(t) {
          this.formFieldValueCallbacks = t;
        }
        async createAnnotation(t, e) {
          this._verifyLoaded();
          const a = (0, n.Hs)(t),
            { id: o } = a,
            i = { id: o, content: (0, s.Z)(a, u) },
            l = await this._request("/annotations", "POST", i);
          if (200 !== l.status)
            throw new r.p2(
              "PSPDFKit Server returned an error, when saving an annotation.",
            );
          if ("attachment_missing" === (await l.json()).error) {
            const t = (function (t, e) {
              const a = new FormData();
              return (
                a.append("annotation", JSON.stringify(t)),
                e.forEach((t, e) => {
                  e && t.data && a.append(e, t.data);
                }),
                a
              );
            })(i, e);
            if (200 !== (await this._request("/annotations", "POST", t)).status)
              throw new r.p2(
                "PSPDFKit Server returned an error, when saving an annotation attachment.",
              );
          }
        }
        async updateAnnotation(t) {
          this._verifyLoaded();
          const e = (0, n.Hs)(t),
            { id: a } = e,
            o = (0, s.Z)(e, k);
          await this._request(`/annotations/${a}`, "PUT", {
            id: a,
            content: o,
          });
        }
        async deleteAnnotation(t) {
          this._verifyLoaded(),
            await this._request(`/annotations/${t.id}`, "DELETE");
        }
        async createBookmark(t) {
          this._verifyLoaded(), await this.loadBookmarks();
          const e = (0, l.a)(t),
            { id: a } = e,
            o = (0, s.Z)(e, y);
          if (
            200 !==
            (await this._request("/bookmarks", "POST", { id: a, content: o }))
              .status
          )
            throw new r.p2(
              "PSPDFKit Server returned an error, when saving an bookmark.",
            );
        }
        async updateBookmark(t) {
          this._verifyLoaded(), await this.loadBookmarks();
          const e = (0, l.a)(t),
            { id: a } = e,
            o = (0, s.Z)(e, f);
          await this._request(`/bookmarks/${a}`, "PUT", { id: a, content: o });
        }
        async deleteBookmark(t) {
          this._verifyLoaded(),
            await this.loadBookmarks(),
            await this._request(`/bookmarks/${t}`, "DELETE");
        }
        async setFormFieldValue(t) {
          this._verifyLoaded();
          const e = { id: (0, c.X)(t), content: (0, n.kr)(t) };
          await this._request("/form-field-values", "POST", {
            formFieldValues: [e],
          });
        }
        async createFormFieldValue() {}
        async deleteFormFieldValue() {}
        async loadAnnotationsForPageIndex(t) {
          if ((this._verifyLoaded(), this.state.alreadyLoadedPages.has(t)))
            await this.state.alreadyLoadedPages.get(t);
          else
            try {
              const e = this._request(`/page-${t}-annotations`, "GET")
                .then((t) => t.json())
                .catch((t) => {
                  throw t;
                });
              this.state = this.state.setIn(["alreadyLoadedPages", t], e);
              const a = await e;
              this.state = this.state.setIn(
                ["alreadyLoadedPages", t],
                Promise.resolve(),
              );
              const s = (0, i.aV)().withMutations((t) => {
                a.annotations.forEach((e) => {
                  try {
                    t.push((0, n.vH)(e.id, e.content));
                  } catch (t) {
                    (0, r.um)(
                      `Skipped creating annotation #${e.id} from payload because an error occurred while deserializing.`,
                      e.content,
                    ),
                      (0, r.um)(t);
                  }
                });
              });
              s.size > 0 &&
                ((0, r.kG)(this.annotationCallbacks),
                this.annotationCallbacks.createAnnotations(
                  s,
                  (0, i.D5)(),
                  h.y,
                ));
            } catch (t) {
              this._handleError(t, "annotations");
            }
        }
        async loadBookmarks() {
          if ((this._verifyLoaded(), this.state.loadBookmarksPromise))
            await this.state.loadBookmarksPromise;
          else
            try {
              const t = this._request("/bookmarks", "GET")
                .then((t) => t.json())
                .then((t) => t.data)
                .catch((t) => {
                  throw t;
                });
              this.state = this.state.set("loadBookmarksPromise", t);
              const e = await t;
              (this.state = this.state.set(
                "loadBookmarksPromise",
                Promise.resolve(),
              )),
                (0, r.kG)(
                  Array.isArray(e.bookmarks),
                  "Unexpected reply from bookmarks endpoint.",
                );
              const a = (0, i.aV)().withMutations((t) => {
                e.bookmarks.forEach((e) => {
                  try {
                    t.push((0, l.i)(e.id, e.content));
                  } catch (t) {
                    (0, r.um)(
                      `Skipped creating bookmark #${e.id} from payload because an error occurred while deserializing.`,
                      e,
                    ),
                      (0, r.um)(t);
                  }
                });
              });
              a.size > 0 &&
                ((0, r.kG)(this.bookmarkCallbacks),
                this.bookmarkCallbacks.createBookmarks(a, h.y));
            } catch (t) {
              this._handleError(t, "bookmarks");
            }
        }
        async syncChanges() {}
        async _initializeFormFieldValues() {
          const t = await this._request("/form-field-values", "GET"),
            e = await t.json();
          (0, r.kG)(
            Array.isArray(e.formFieldValues),
            "Unexpected reply from form-values endpoint.",
          );
          const a = (0, i.aV)(
            e.formFieldValues
              .map((t) => {
                let { content: e } = t;
                try {
                  return (0, n.u9)(e);
                } catch (t) {
                  return (
                    (0, r.um)(
                      `Skipped form field value ${e.name} from payload because an error occurred while deserializing.`,
                      e,
                    ),
                    (0, r.um)(t),
                    null
                  );
                }
              })
              .filter(Boolean),
          );
          (0, r.kG)(this.formFieldValueCallbacks),
            this.state.ignoredFormFieldNames &&
            this.state.ignoredFormFieldNames.size
              ? this.formFieldValueCallbacks.setFormFieldValues(
                  a.filter((t) => {
                    var e;
                    return !(
                      null !== (e = this.state.ignoredFormFieldNames) &&
                      void 0 !== e &&
                      e.includes(t.name)
                    );
                  }),
                )
              : this.formFieldValueCallbacks.setFormFieldValues(a);
        }
        _handleError(t, e) {
          (0, r.vU)(`Loading or updating ${e} failed:\n\n${t.message}`);
        }
        _request(t, e, a) {
          (0, r.kG)(
            null != this.state.authPayload,
            "Cannot call request without authPayload",
          );
          const s =
              a instanceof FormData || "object" != typeof a
                ? null
                : { "Content-Type": "application/json" },
            i = (function (t) {
              for (var e = 1; e < arguments.length; e++) {
                var a = null != arguments[e] ? arguments[e] : {};
                e % 2
                  ? b(Object(a), !0).forEach(function (e) {
                      (0, o.Z)(t, e, a[e]);
                    })
                  : Object.getOwnPropertyDescriptors
                  ? Object.defineProperties(
                      t,
                      Object.getOwnPropertyDescriptors(a),
                    )
                  : b(Object(a)).forEach(function (e) {
                      Object.defineProperty(
                        t,
                        e,
                        Object.getOwnPropertyDescriptor(a, e),
                      );
                    });
              }
              return t;
            })(
              {
                "X-PSPDFKit-Token": this.state.authPayload.token,
                "PSPDFKit-Platform": "web",
                "PSPDFKit-Version": (0, m.oM)(),
              },
              s,
            );
          return fetch(`${this.state.serverURL}${t}`, {
            method: e,
            headers: i,
            body:
              a instanceof FormData
                ? a
                : "object" == typeof a
                ? JSON.stringify(a)
                : void 0,
            credentials: "include",
          });
        }
        _verifyLoaded() {
          if (!this.state.isLoaded) throw new Error("not loaded");
        }
        setIgnoredFormFieldNames(t) {
          this.state = this.state.set("ignoredFormFieldNames", t);
        }
      }
    },
  },
]);