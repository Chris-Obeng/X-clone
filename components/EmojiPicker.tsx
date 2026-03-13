"use client";

import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";

interface EmojiPickerComponentProps {
  onEmojiSelect: (emoji: string) => void;
}

export default function EmojiPickerComponent({ onEmojiSelect }: EmojiPickerComponentProps) {
  return (
    <EmojiPicker
      theme={Theme.DARK}
      onEmojiClick={(emojiData: EmojiClickData) => onEmojiSelect(emojiData.emoji)}
      skinTonesDisabled
      searchPlaceholder="Search emoji..."
      lazyLoadEmojis
      height={380}
      width={320}
    />
  );
}