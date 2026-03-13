"use client";

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import PostForm from "./PostForm";
import { usePostDialog } from "@/hooks/use-post-dialog";

const CreatePostDialog = () => {
  const { isOpen, onClose } = usePostDialog();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black border-[#2f3336] p-0 overflow-hidden max-w-[600px] w-full sm:w-[90vw] rounded-2xl border-none shadow-none focus:outline-none">
        <PostForm 
           onSuccess={onClose} 
           showClose={true} 
           onClose={onClose} 
           placeholder="What is happening?"
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostDialog;
