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
(self.webpackChunkPSPDFKit = self.webpackChunkPSPDFKit || []).push([
  [1063],
  {
    69909: () => {
      Intl.PluralRules &&
        "function" == typeof Intl.PluralRules.__addLocaleData &&
        Intl.PluralRules.__addLocaleData({
          data: {
            th: {
              categories: { cardinal: ["other"], ordinal: ["other"] },
              fn: function (a, l) {
                return "other";
              },
            },
          },
          availableLocales: ["th"],
        });
    },
  },
]);
