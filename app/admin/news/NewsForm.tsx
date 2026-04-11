'use client'

import { useForm, Controller, useFieldArray } from "react-hook-form";
 
import { TextArea } from "@/components/input/Inputs";
import { Button } from "@/components/buttons/Button";

import { IQueryResponse } from "@/types";
import { ICloudinaryFile, IFileProps } from "@/types/file.interface";
import { Plus, X } from "lucide-react";
import { CgAttachment } from "react-icons/cg";
import QuillEditor from "@/components/editor/Quill";
import { INewsProps } from "@/types/news.interface";
import { useAppDispatch, useAppSelector } from "@/store/hooks/store";
import { smartToast } from "@/utils/toast";
import {
  useCreateNewsMutation,
  useUpdateNewsMutation,
} from "@/services/news.endpoints";
import { clearNews, setNews } from "@/store/slices/news.slice";
import { CloudinaryWidget } from "@/components/cloudinary/Cloudinary";
import { useEffect } from "react";
import { ImageUploadWidget } from "@/components/cloudinary/ImageUploadWidget";
import { useRouter } from "next/navigation";

export interface IPostNews {
  details: {
    text?: string;
    media?: ICloudinaryFile[];
  }[];

  headline: {
    text: string;
    image: string;
    hasVideo?: boolean;
    sponsor?: Partial<IFileProps>;
  };
}

interface INewsForm {
  newsItem?: INewsProps | null;
}

export const NewsForm = ({ newsItem = null }: INewsForm) => {
  const { news: persistedNews } = useAppSelector((state) => state.news);
  const router = useRouter();

  const { control, handleSubmit, reset, watch } = useForm<IPostNews>({
    defaultValues: newsItem ?? {
      headline: { text: "", image: "" },
      details: [{ text: "" }],
      ...persistedNews,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "details",
  });

  const formValues = watch();

  const dispatch = useAppDispatch();
  // Persist form state
  useEffect(() => {
    // console.log(formValues);
  }, [formValues]);

  const [updateNews, { isLoading: isUpdating }] = useUpdateNewsMutation();
  const [createNews, { isLoading: isCreating }] = useCreateNewsMutation();

  const isLoading = isCreating || isUpdating;

  const onSubmit = async (data: IPostNews) => {
    try {
      dispatch(setNews(data));
      let result: IQueryResponse;
      if (newsItem) {
        result = await updateNews(data).unwrap();
      } else {
        result = await createNews(data).unwrap();
        dispatch(clearNews());
        reset({ headline: { text: "", image: "" }, details: [{ text: "" }] });
        router.replace("/admin/news",  );
      }

      smartToast(result);
    } catch (error) {
      smartToast({ error });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-6">
      {/* Headline Section */}
      <header className="border-b-2 grid gap-4 py-4 mb-6 border px-2 border-border">
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
            <ImageUploadWidget
              onUpload={(file) => {
                console.log(file);
                field.onChange(file?.secure_url);
              }}
              folder={`news/media-${new Date().getFullYear()}`}
              cropping
              shape="square"
              previewFileStyles="w-full h-auto"
            />
          )}
        />
      </header>

      {/* Details Section */}
      <h1 className="_subtitle">Details</h1>
      <main className=" space-y-10 divide-y-2 divide-primary ">
        {fields.map((item, index) => (
          <div key={item.id} className="flex items-start gap-2 ">
            <div className="grow space-y-3">
              <Controller
                control={control}
                name={`details.${index}.text`}
                render={({ field }) => (
                  <QuillEditor
                    value={field.value || ""}
                    onChange={field.onChange}
                    className="w-full grow"
                  />
                )}
              />

              <div className="flex justify-between items-center mb-2">
                <Controller
                  control={control}
                  name={`details.${index}.media`}
                  render={({ field }) => (
                    <CloudinaryWidget
                      onUploadSuccess={(fs) => field.onChange(fs)}
                      maxFiles={30}
                      trigger={
                        <>
                          <CgAttachment size={24} /> Attach Media
                        </>
                      }
                      folder={`news/media-${new Date().getFullYear()}`}
                      resourceType="auto"
                      initialFiles={field.value}
                    />
                  )}
                />

                <Button
                  primaryText=""
                  onClick={async () => remove(index)}
                  variant="ghost"
                  title="Remove"
                  className="text-destructive"
                >
                  <X />
                </Button>
              </div>
            </div>
          </div>
        ))}

        <div className="flex items-center gap-2 justify-center">
          <button
            onClick={() => append({ text: "", media: [] })}
            className="rounded-full p-3 border _borderColor hover:opacity-90 bg-gray-700 text-white dark:text-gray-950 dark:bg-gray-200 justify-center"
            title="Add Content"
            type="button"
          >
            <Plus />
          </button>
        </div>
      </main>

      <br />

      <Button
        type="submit"
        primaryText={newsItem ? "Save Changes" : "Post news"}
        waiting={isLoading}
        disabled={isLoading}
        waitingText={newsItem ? "Saving..." : "Posting..."}
        className="_primaryBtn p-3 ml-auto w-full justify-center h-12 uppercase"
      />
    </form>
  );
};
