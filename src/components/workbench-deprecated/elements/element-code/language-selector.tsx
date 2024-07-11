import { Listbox, Transition } from "@headlessui/react";
import { Check, ChevronsUpDown } from "lucide-react";
import Image from "next/image";
import { Fragment } from "react";
import classNames from "../../../../client-functions/client-utils";
import { programmingLanguages, useCodeTask } from "./zustand";

export function LanguageSelector() {
  const { selectedLanguage: lang, setLanguage: setLang } = useCodeTask();

  return (
    <Listbox value={lang} onChange={setLang}>
      {({ open }) => (
        <>
          <div className="absolute -top-2 right-2 z-50 mt-4">
            <Listbox.Button className="relative cursor-pointer rounded-md border border-border bg-background py-1 pl-2 pr-7 text-left hover:bg-foreground focus:outline-none  sm:text-sm">
              <span className="flex items-center text-muted-contrast">
                <Image src={lang.logo} alt={lang.name} width={17} height={17} />
                <span className="ml-2 block truncate">{lang.name}</span>
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1">
                <ChevronsUpDown
                  className="h-5 w-5 text-muted-contrast"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute right-0 z-10 mt-1 max-h-56 w-[150px] overflow-auto rounded-md border border-border bg-foreground py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none  sm:text-sm">
                {programmingLanguages.map((language) => (
                  <Listbox.Option
                    key={language.name}
                    className={({ active }) =>
                      classNames(
                        active ? "bg-foreground" : "text-muted-contrast",
                        "relative cursor-pointer select-none py-1 pl-3 pr-9",
                      )
                    }
                    value={language}
                  >
                    {({ selected }) => (
                      <>
                        <div className="flex items-center">
                          <Image
                            src={language.logo}
                            alt={language.name}
                            width={17}
                            height={17}
                          />
                          <span
                            className={classNames(
                              "font-normal",
                              "ml-3 block truncate",
                            )}
                          >
                            {language.name}
                          </span>
                        </div>

                        {selected ? (
                          <span
                            className={classNames(
                              "absolute inset-y-0 right-0 flex items-center pr-4",
                            )}
                          >
                            <Check className="h-4 w-4" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
}
