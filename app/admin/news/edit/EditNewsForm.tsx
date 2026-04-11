"use client";

import { useState } from "react";
import {
  useForm,
  Controller,
  useFieldArray,
  SubmitHandler,
} from "react-hook-form";
import { TextArea } from "@/components/input/Inputs";
import { Button } from "@/components/buttons/Button";
import { IFileProps } from "@/types/file.interface";
import { Plus, Trash, X } from "lucide-react";
import { CgAttachment } from "react-icons/cg";
import QuillEditor from "@/components/editor/Quill";
import { INewsProps } from "@/types/news.interface";
import FileRenderer from "@/components/files/FileRender";
import { useUpdateNewsMutation } from "@/services/news.endpoints";
import { smartToast } from "@/utils/toast";
import { CloudinaryWidget } from "@/components/cloudinary/Cloudinary";

interface INewsForm {
  newsItem?: INewsProps;
}

export const EditNewsForm = ({ newsItem }: INewsForm) => {
  const [updateNews, { isLoading }] = useUpdateNewsMutation();

  const defaultValues = {
    headline: newsItem?.headline || { text: "", image: "" },
    details:
      newsItem?.details?.map((d) => ({
        text: d.text || "",
        media: d.media || [],
      })) || [],
  } as INewsProps;

  const { control, handleSubmit, watch, setValue } = useForm<INewsProps>({
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "details",
  });

  const details = watch("details");

  /** -------------------------
   *  SUBMIT HANDLER
   ------------------------- **/
  const onSubmit: SubmitHandler<INewsProps> = async (data) => {
    try {
      const response = await updateNews({
        ...data,
        _id: newsItem?._id,
      } as Partial<INewsProps>).unwrap();

      smartToast(response);
    } catch (err) {
      smartToast({ error: err });
    }
  };

  /** -------------------------
   *  DEDUPE FUNCTION
   ------------------------- **/
  const dedupeFiles = (files: IFileProps[]) => {
    return Array.from(new Map(files.map((f) => [f.secure_url, f])).values());
  };

  const [headlineImages, setHeadlineImages] = useState<string[]>([
    newsItem?.headline?.image as string,
  ]);

  /** -------------------------
   *  RENDER
   ------------------------- **/
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-6">
      {/* -----------------------------------------
          HEADLINE SECTION
      ------------------------------------------ */}
      <header className="border-b-2 grid gap-4 py-4 mb-6 px-2 border-primary">
        <h1 className="_subtitle">Headline text</h1>
        <Controller
          name="headline.text"
          control={control}
          rules={{ required: "Headline is required" }}
          render={({ field }) => (
            <TextArea
              {...field}
              label="Headline text"
              placeholder="Type headline here..."
              labelStyles="mb-3"
              className="bg-white text-black"
            />
          )}
        />
        <Controller
          name="headline.image"
          control={control}
          render={({ field }) => (
            <div className="grow w-full">
              {field.value && (
                <img
                  alt="headline"
                  src={field.value}
                  className="w-full min-w-64 bg-cover object-cover aspect-5/3"
                />
              )}
              <br />
              <CloudinaryWidget
                onUploadSuccess={(files) => {
                  field.onChange(files?.[0]?.secure_url);
                  setHeadlineImages(
                    [
                      newsItem?.headline?.image as string,
                      ...files?.map((f) => f.secure_url),
                    ].filter(Boolean),
                  );
                }}
                maxFiles={1}
                trigger={
                  <>
                    <CgAttachment size={24} /> Upload Headline Image
                  </>
                }
                folder={`news/media-${new Date().getFullYear()}`}
                hidePreview={true}
              />

              <br />
              <hr />
              <p className="font-thin text-sm">Select instead</p>
              <div className="flex gap-3 flex-wrap border-t pt-3">
                {headlineImages?.map((img, i) => (
                  <img
                    alt={`img${i}`}
                    key={`img${i}`}
                    src={img}
                    className="w-20 h-12 rounded shadow _hover _shrink cursor-pointer"
                    onClick={() => field.onChange(img)}
                  />
                ))}
              </div>
            </div>
          )}
        />
      </header>

      {/* -----------------------------------------
          DETAILS SECTION
      ------------------------------------------ */}
      <h1 className="_subtitle">Details</h1>

      <main className="space-y-10 divide-y-2 divide-primary">
        {fields.map((item, index) => (
          <div key={item.id} className="py-4">
            {/* TEXT EDITOR */}
            <Controller
              control={control}
              name={`details.${index}.text`}
              render={({ field }) => (
                <QuillEditor
                  value={field.value || ""}
                  onChange={field.onChange}
                  className="w-full"
                />
              )}
            />

            {/* EXISTING MEDIA */}
            <div className="flex flex-wrap gap-3 mt-4">
              {details?.[index]?.media?.map((file, mediaIdx) => (
                <div key={mediaIdx} className="relative">
                  <FileRenderer file={file as unknown as IFileProps} controls />

                  <Button
                    onClick={() => {
                      const newMedia = [...(details?.[index]?.media ?? [])];
                      newMedia.splice(mediaIdx, 1);
                      setValue(`details.${index}.media`, newMedia);
                    }}
                    className="absolute top-1 right-1 bg-red-500 hover:bg-red-400 text-white rounded-full p-1"
                  >
                    <X size={14} />
                  </Button>
                </div>
              ))}
            </div>

            {/* UPLOAD MEDIA */}
            <div className="flex justify-between items-center mt-3">
              <Controller
                control={control}
                name={`details.${index}.media`}
                render={({ field }) => (
                  <CloudinaryWidget
                    onUploadSuccess={(newFiles) => {
                      const normalized = newFiles
                        .map((f) => ({
                          secure_url: f.secure_url,
                          public_id: f.public_id,
                          format: f.format,
                          resource_type: f.resource_type,
                        }))
                        .filter((f) => f.secure_url);

                      const merged = [
                        ...(field.value || []),
                        ...normalized,
                      ] as IFileProps[];
                      field.onChange(dedupeFiles(merged));
                    }}
                    maxFiles={12}
                    folder={`news/media-${new Date().getFullYear()}`}
                    hidePreview={(field?.value?.length ?? 0) === 0}
                    trigger={
                      <>
                        <CgAttachment size={24} /> Add Media
                      </>
                    }
                  />
                )}
              />

              <Button
                primaryText=""
                onClick={() => remove(index)}
                className="text-red-400"
                variant={"link"}
              >
                <Trash />
              </Button>
            </div>
          </div>
        ))}

        {/* ADD NEW DETAIL BLOCK */}
        <div className="flex justify-center">
          <button
            onClick={() => append({ text: "", media: [] })}
            className="rounded-full p-3 border _borderColor bg-gray-700 text-white hover:opacity-90"
            type="button"
          >
            <Plus />
          </button>
        </div>
      </main>

      {/* SUBMIT */}
      <Button
        type="submit"
        primaryText="Save Changes"
        waiting={isLoading}
        disabled={isLoading}
        waitingText="Updating..."
        className="_primaryBtn p-3 ml-auto w-full justify-center h-12 uppercase"
      />
    </form>
  );
};
