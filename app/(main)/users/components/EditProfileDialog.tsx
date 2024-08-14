import React from "react";
import { userProps } from "@/types/types";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { updateProfileSchema, updateProfileValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateUserMutation } from "../../hooks/updateUserMutation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import LoadingButton from "@/components/common/LoadingButton";
import Image, { StaticImageData } from "next/image";
import { HiOutlineCamera } from "react-icons/hi2";
import placeholder from "../../../../public/images/user-avatar.png";
import CropImageDialog from "./CropImageDialog";

type editProfileDialogProps = {
  user: userProps;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type imageInputProps = {
  src: string | StaticImageData;
  onImageCropped: (blob: Blob | null) => void;
};

const EditProfileDialog = ({
  user,
  open,
  onOpenChange,
}: editProfileDialogProps) => {
  const defaultUserValues = {
    displayName: user.displayName,
    bio: user.bio || "",
    website: user.website || "",
    country: user.country || "",
    city: user.city || "",
    state: user.state || "",
    occupation: user.occupation || "",
  };

  const form = useForm<updateProfileValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: defaultUserValues,
  });

  const mutation = useUpdateUserMutation();

  const [imageCropped, setImageCropped] = React.useState<Blob | null>(null);

  const onSubmit = async (values: updateProfileValues) => {
    const newImageFile = imageCropped
      ? new File([imageCropped], `image_${user._id}.webp`)
      : undefined;
    mutation.mutate(
      { values, image: newImageFile },
      {
        onSuccess: () => {
          setImageCropped(null);
          onOpenChange(false);
        },
      }
    );
  };

  const ImageInput = ({ src, onImageCropped }: imageInputProps) => {
    const [imageFile, setImageFile] = React.useState<File>();

    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const onImageSelection = (image: File | undefined) => {
      if (!image) {
        return;
      }

      setImageFile(image);
    };

    return (
      <React.Fragment>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => onImageSelection(e.target.files?.[0])}
          ref={fileInputRef}
          className="hidden sr-only"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="group relative block"
        >
          <div className="size-20 rounded overflow-hidden relative">
            <Image
              src={src}
              alt="image preview"
              className="object-cover"
              fill
            />
            <span className="absolute inset-0 m-auto flex resize size-20 items-center justify-center rounded bg-black/30 text-white transition-colors duration-200 group-hover:bg-opacity-25">
              <HiOutlineCamera size={24} />
            </span>
          </div>
        </button>
        {imageFile && (
          <CropImageDialog
            src={URL.createObjectURL(imageFile)}
            cropAspectRatio={1}
            onCropped={onImageCropped}
            onClose={() => {
              setImageFile(undefined);
              if (fileInputRef.current?.value) {
                fileInputRef.current.value = "";
              }
            }}
          />
        )}
      </React.Fragment>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            <p className="text-xl lg:text-2xl">Edit profile</p>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-1 5">
          <ImageInput
            src={
              imageCropped
                ? URL.createObjectURL(imageCropped)
                : user?.image || placeholder
            }
            onImageCropped={setImageCropped}
          />
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Your display name"
                      {...field}
                      className="focus:outline-none outline-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Which country are you from?"
                      {...field}
                      className="focus:outline-none outline-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Which state do you reside?"
                      {...field}
                      className="focus:outline-none outline-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Which city do you reside?"
                      {...field}
                      className="focus:outline-none outline-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="occupation"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="What do you do for a living?"
                      {...field}
                      className="focus:outline-none outline-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Any personal website?"
                      {...field}
                      className="focus:outline-none outline-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="tell us a little bit about yourself"
                      {...field}
                      className="resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <LoadingButton
                loading={mutation.isPending}
                className="rounded-full"
              >
                <p className="text-base">
                  {mutation.isPending ? "Saving changes..." : "Save"}
                </p>
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
