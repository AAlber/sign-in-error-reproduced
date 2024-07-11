import { reduceNamesFromUsersArray } from "@/src/client-functions/client-chat";
import {
  capitalize,
  capitalizeEveryWordFromString,
  isUrl,
  normalizeLink,
} from "@/src/client-functions/client-utils";
import { filterUndefined } from "@/src/utils/utils";

describe("Client Utils", () => {
  describe("filterUndefined", () => {
    it("Return correct value", () => {
      const truthy1 = filterUndefined(1);
      expect(truthy1).toBeTruthy();

      const truthy2 = filterUndefined([undefined, null]);
      expect(truthy2).toBeTruthy();

      const falsy = filterUndefined(undefined);
      expect(falsy).toBeFalsy();
    });

    it("Removes all nulls and undefined from an array", () => {
      const arr = [1, 2, 3, undefined, null].filter(filterUndefined);
      expect(arr.length).toBe(3);

      const nullArray = [undefined, null].filter(filterUndefined);
      expect(nullArray.length).toBe(0);
    });
  });

  describe("Strings", () => {
    describe("Capitalize strings", () => {
      it("Capitalizes first char of string", () => {
        let str = capitalize("hello");
        expect(str[0]).toBe("H");

        str = capitalize(" hello");
        expect(str[0]).toBe(" ");

        str = capitalize("1helo");
        expect(str[0]).toBe("1");
      });

      it("Capitalizes every word from sentence", () => {
        let str = capitalizeEveryWordFromString("lorem ipsum dolor");
        expect(str).toBe("Lorem Ipsum Dolor");

        str = capitalizeEveryWordFromString(`lorem ipsum dolor   lorem`);
        expect(str).toBe("Lorem Ipsum Dolor   Lorem");
      });
    });

    describe("URLs", () => {
      it("Normalize URLs", () => {
        let link = "http://google.com";
        let result = normalizeLink(link);
        expect(result).toBe("https://google.com");

        link = "h//ttps://google.com";
        result = normalizeLink(link);
        expect(result).toBe("https://google.com");

        link = "httpp://google.com";
        result = normalizeLink(link);
        expect(result).toBe("https://google.com");

        link = "google.com";
        result = normalizeLink(link);
        expect(result).toBe("https://google.com");
      });

      it("Validates URL", () => {
        let isValid = isUrl("http://google.com");
        expect(isValid).toBeTruthy();

        // we normalize protocol to https
        isValid = isUrl("httpp://google.com");
        expect(isValid).toBeTruthy();

        isValid = isUrl("google.com");
        expect(isValid).toBeTruthy();

        isValid = isUrl("google");
        expect(isValid).toBeFalsy();

        isValid = isUrl("http://google.com/1/2?id=1");
        expect(isValid).toBeTruthy();

        isValid = isUrl("google.com/1/2?id=1");
        expect(isValid).toBeTruthy();
      });
    });
  });
});

describe("reduceNamesFromUsersArray", () => {
  it("reduce users array into string with correct grammar", () => {
    let users: SimpleUser[] = [
      { name: "user1", email: "u1@mail.com", id: "id1", image: null },
      { name: "user2", email: "u2@mail.com", id: "id2", image: null },
      { name: "", email: "user3@mail.com", id: "id3", image: null },
    ];

    let u = reduceNamesFromUsersArray(users);
    expect(u).toBe("user1, user2, and user3@mail.com");

    users = [
      { name: "user1", email: "u1@mail.com", id: "id1", image: null },
      { name: "user2", email: "u2@mail.com", id: "id2", image: null },
    ];
    u = reduceNamesFromUsersArray(users);
    expect(u).toBe("user1 and user2");
  });
});
