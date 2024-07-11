import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { Transition } from "@headlessui/react";
import React, { Fragment, useEffect, useState } from "react";

interface AddReactionProps {
  onSelect: (data: EmojiMartData) => void;
}

const AddReactions: React.FC<AddReactionProps> = (props) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleClose = () => {
    setIsMounted(false);
    setTimeout(() => {
      // onClose();
    }, 400);
  };

  const handleOnSelect = async (data: EmojiMartData) => {
    props.onSelect(data);
    handleClose();
  };

  return (
    <Transition
      as={Fragment}
      show={isMounted}
      enter="transition ease-out duration-200"
      enterFrom="opacity-0 translate-y-1"
      enterTo="opacity-100 translate-y-0"
      leave="transition ease-in duration-150"
      leaveFrom="opacity-100 translate-y-0"
      leaveTo="opacity-0 translate-y-1"
    >
      <div
        className="w-full overflow-hidden rounded-lg border-border shadow-lg ring-1 ring-black ring-opacity-5 "
        onClick={(e) => e.stopPropagation()}
      >
        <Picker
          data={data}
          emojiButtonSize={30}
          emojiSize={20}
          onEmojiSelect={handleOnSelect}
        />
      </div>
    </Transition>
  );
};

export default React.memo(AddReactions);

export interface EmojiMartData {
  /**
   * ex. kissing_smiling_eyes
   */
  id: string;
  /**
   * ex. ['affection', 'valentines', 'infatuation', 'kiss']
   */
  keywords: string[];
  /**
   * ex. Kissing Face with Smiling Eyes
   */
  name: string;
  /**
   * ex. 😙
   */
  native: string;
  /**
   * ex. :kissing_smiling_eyes:
   */
  shortcodes: string;
  /**
   * ex. 1f619
   */
  unified: string;
}
