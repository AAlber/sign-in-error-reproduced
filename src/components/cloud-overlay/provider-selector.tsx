import { Listbox, Transition } from "@headlessui/react";
import { Check, ChevronDown } from "lucide-react";
import Image from "next/image";
import { Fragment, useEffect } from "react";
import { useTranslation } from "react-i18next";
import classNames from "../../client-functions/client-utils";
import api from "../../pages/api/api";
import useUser from "../../zustand/user";
import { FuxamDrive } from "./classes/fuxam-drive";
import { GoogleDrive } from "./classes/google-drive";
import useCloudOverlay, { driveProviders } from "./zustand";

export async function updateUserDriveId({ driveId }) {
  const response = await fetch(api.updateUser, {
    method: "POST",
    body: JSON.stringify({
      data: {
        driveId: driveId,
      },
    }),
  });
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return response;
}

export default function ProviderSelector() {
  const {
    drive,
    setUploadStep,
    driveObject,
    currentPath,
    googlePath,
    setDrive,
    setLoaded,
    setDriveObject,
    setCurrentPath,
    setFuxamLastFolder,
    setGooglePath,
    setGoogleLastFolder,
    setFiles,
  } = useCloudOverlay();
  const { user: user, setUser: setData } = useUser();
  const { t } = useTranslation("page");

  useEffect(() => {
    setDriveObject(
      drive.id === 0
        ? new FuxamDrive(
            user.id,
            [],
            null,
            currentPath,
            setCurrentPath,
            setFuxamLastFolder,
            setLoaded,
            setFiles,
            setUploadStep,
          )
        : new GoogleDrive(
            user.id,
            [],
            null,
            googlePath,
            setGooglePath,
            setGoogleLastFolder,
            setLoaded,
            setFiles,
            setUploadStep,
          ),
    );
  }, [drive]);
  return (
    <Listbox value={drive} onChange={setDrive}>
      {({ open }) => (
        <>
          <Listbox.Label className="sr-only">
            {" "}
            Change published status{" "}
          </Listbox.Label>
          <div className="relative z-50">
            <div className="inline-flex divide-x divide-border rounded-md ">
              <div className="inline-flex -space-x-1 divide-border rounded-md ">
                <div className="inline-flex cursor-default items-center rounded-l-md border border-border bg-background py-1 pl-2 pr-3  text-sm font-medium text-contrast hover:bg-secondary ">
                  {drive && (
                    <Image
                      className={classNames("h-4 w-4 flex-shrink-0")}
                      aria-hidden="true"
                      priority
                      src={drive?.icon}
                      alt={drive?.name}
                      width={32}
                      height={32}
                    />
                  )}
                  <p className="ml-2.5 text-sm">{t(drive?.name)}</p>
                </div>
                <Listbox.Button className="inline-flex items-center rounded-r-md border border-border bg-background px-2 py-1.5 text-sm font-medium text-contrast hover:bg-secondary">
                  <span className="sr-only">Providers</span>
                  <ChevronDown
                    aria-hidden="true"
                    className="h-5 w-5 text-contrast"
                  />
                </Listbox.Button>
              </div>
            </div>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="milkblur-mid absolute right-0 z-10 mt-2 grid w-80 origin-top-right divide-y divide-border overflow-hidden rounded-lg rounded-t-md border border-border bg-background/80 shadow-lg ring-1 ring-border ring-opacity-5 focus:outline-none ">
                {driveProviders.map((option) => (
                  <Listbox.Option
                    key={option.name}
                    disabled={option.badge ? true : false}
                    className={({ active }) =>
                      classNames(
                        active ? "bg-foreground " : "text-muted",
                        "select-none p-4 text-sm",
                        option.badge ? "cursor-not-allowed" : "cursor-pointer",
                      )
                    }
                    value={option}
                    onClick={() => setLoaded(false)}
                  >
                    {({ selected, active }) => (
                      <div className="flex items-start">
                        <Image
                          className={classNames(
                            option.size,
                            "mr-3 mt-1 flex-shrink-0",
                          )}
                          aria-hidden="true"
                          priority
                          src={option.icon}
                          alt={option.name}
                          width={52}
                          height={52}
                        />
                        <div className="flex flex-col">
                          <div className="flex items-start justify-between">
                            <div className="flex">
                              <p className="mr-2 text-sm font-medium text-contrast">
                                {t(option.name)}
                              </p>
                              {option.badge && (
                                <span
                                  className={classNames(
                                    "inline-flex items-center rounded-full  px-2 text-xs font-medium",
                                    option.badge.color,
                                  )}
                                >
                                  {t(option.badge.text)}
                                </span>
                              )}
                            </div>
                            {selected ? (
                              <span className={"text-contrast"}>
                                <Check className="h-4 w-4" aria-hidden="true" />
                              </span>
                            ) : null}
                          </div>
                          <p className="mt-1 text-sm text-muted-contrast">
                            {t(option.description)}
                          </p>
                        </div>
                      </div>
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
