"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X, Camera } from "lucide-react";
import { UploadButton } from "@/lib/uploadthing";
import { updateUserProfileAction } from "@/actions/user.actions";

interface EditProfileModalProps {
  user: {
    clerkId: string;
    name: string | null;
    bio: string | null;
    profileImage: string | null;
    bannerImage: string | null;
  };
}

export function EditProfileModal({ user }: EditProfileModalProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(user.name || "");
  const [bio, setBio] = useState(user.bio || "");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updateUserProfileAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile", user.clerkId] });
      setOpen(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ name, bio });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="rounded-full border-[#536471] hover:bg-white/10 text-white font-bold h-9"
        >
          Edit profile
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[600px] p-0 bg-black border-[#2f3336] overflow-hidden">
        <DialogHeader className="flex flex-row items-center justify-between px-4 py-3 bg-black/80 backdrop-blur-md sticky top-0 z-50">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setOpen(false)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={20} className="text-white" />
            </button>
            <DialogTitle className="text-xl font-bold text-white">
              Edit profile
            </DialogTitle>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={mutation.isPending}
            className="rounded-full bg-white text-black hover:bg-white/90 font-bold px-4 h-8"
          >
            {mutation.isPending ? "Saving..." : "Save"}
          </Button>
        </DialogHeader>

        <div className="max-h-[80vh] overflow-y-auto">
          {/* Banner Edit */}
          <div className="relative h-48 bg-[#333639]">
            {user.bannerImage && (
              <img
                src={user.bannerImage}
                alt="Banner"
                className="w-full h-full object-cover opacity-75"
              />
            )}
            <div className="absolute inset-0 flex items-center justify-center gap-4 bg-black/20">
              <UploadButton
                endpoint="bannerImage"
                onClientUploadComplete={() => {
                  queryClient.invalidateQueries({ queryKey: ["user-profile", user.clerkId] });
                }}
                content={{
                    button: <div className="p-3 bg-black/50 hover:bg-black/40 rounded-full transition-colors"><Camera size={20} className="text-white" /></div>
                }}
                appearance={{
                    button: "bg-transparent after:hidden p-0 m-0 w-auto h-auto",
                    allowedContent: "hidden"
                }}
              />
            </div>
          </div>

          {/* Profile Image Edit */}
          <div className="px-4 relative -mt-16 mb-4">
            <div className="relative border-4 border-black rounded-full overflow-hidden w-28 h-28 bg-black group">
              <img
                src={user.profileImage || "/default-avatar.png"}
                alt={user.name || "User"}
                className="w-full h-full object-cover opacity-75"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-100 group-hover:opacity-100 transition-opacity">
                <UploadButton
                  endpoint="profileImage"
                  onClientUploadComplete={() => {
                    queryClient.invalidateQueries({ queryKey: ["user-profile", user.clerkId] });
                  }}
                  content={{
                    button: <div className="p-3 bg-black/50 hover:bg-black/40 rounded-full transition-colors"><Camera size={20} className="text-white" /></div>
                  }}
                  appearance={{
                      button: "bg-transparent after:hidden p-0 m-0 w-auto h-auto",
                      allowedContent: "hidden"
                  }}
                />
              </div>
            </div>
          </div>

          {/* Forms */}
          <div className="px-4 py-8 flex flex-col gap-6">
            <div className="grid w-full items-center gap-1.5 border border-[#2f3336] rounded p-3 focus-within:border-[#1d9bf0] transition-colors group">
              <Label htmlFor="name" className="text-xs text-[#71767b] group-focus-within:text-[#1d9bf0]">
                Name
              </Label>
              <Input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-none bg-transparent p-0 h-auto focus-visible:ring-0 text-[17px] text-white"
              />
            </div>

            <div className="grid w-full items-center gap-1.5 border border-[#2f3336] rounded p-3 focus-within:border-[#1d9bf0] transition-colors group">
              <Label htmlFor="bio" className="text-xs text-[#71767b] group-focus-within:text-[#1d9bf0]">
                Bio
              </Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="border-none bg-transparent p-0 h-auto focus-visible:ring-0 text-[17px] text-white resize-none min-h-[100px]"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
