import { useClerk as useClerkUser } from "@clerk/nextjs";
import { Trash } from "lucide-react";
import Image from "next/image";
import type { ChangeEvent } from "react";
import { useState } from "react";
import { changeProfilePicutre } from "@/src/client-functions/client-profile-modal";
import { imageFileTypes } from "@/src/utils/utils";
import ProfileImageInput from "./profile-image-input";

export default function ProfileImage() {
  const { user: clerkUser } = useClerkUser();
  const [imageURL, setImageURL] = useState(clerkUser?.imageUrl);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [inputKey, setInputKey] = useState(Date.now());

  const handleChangePicture = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!clerkUser) return;
    setUploading(true);
    const uploaded = await changeProfilePicutre(event, clerkUser);
    if (uploaded) {
      setImageURL(URL.createObjectURL(uploaded));
    }
    setUploading(false);
    setInputKey(Date.now());
  };

  const handleDeleteProfileImage = async () => {
    setDeleting(true);
    if (clerkUser?.hasImage) {
      await clerkUser?.setProfileImage({ file: null });
    }
    setImageURL(undefined);
    setDeleting(false);
    setInputKey(Date.now());
  };

  return (
    <div className="flex items-center gap-3">
      <div
        className="relative h-[80px] w-[80px] overflow-hidden rounded-full"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <Image
          objectFit="cover"
          layout="fill"
          alt="profile image"
          src={!!imageURL ? imageURL : clerkUser?.imageUrl || ""}
        />
        {isHovering && clerkUser?.hasImage && (
          <button
            onClick={handleDeleteProfileImage}
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50"
          >
            <Trash className="text-white" size={23} />
          </button>
        )}
      </div>
      <ProfileImageInput
        key={inputKey}
        accept={imageFileTypes.join()}
        showDeleteButton={clerkUser?.hasImage || false}
        handleChange={handleChangePicture}
        handleDelete={handleDeleteProfileImage}
        id="profile-image"
        imageUploading={uploading}
        imageDeleting={deleting}
        name="profile-image"
      />
    </div>
  );
}
