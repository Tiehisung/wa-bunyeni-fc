"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DateTimeInput, IconInputWithLabel } from "@/components/input/Inputs";
import { Button } from "@/components/buttons/Button";
import   ImageUploadWidget   from "@/components/cloudinary/ImageUploadWidget";
import { smartToast } from "@/utils/toast";
import { IStaff } from "@/types/staff.interface";
import {
  useCreateStaffMutation,
  useUpdateStaffMutation,
} from "@/services/staff.endpoints";

// Zod validation schema
const staffSchema = z.object({
  fullname: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  dateSigned: z.string().min(1, "Date signed is required"),
  role: z.string().min(2, "Role must be at least 2 characters"),
  avatar: z.string().optional(),
});

type StaffFormData = z.infer<typeof staffSchema>;

type Props = {
  existingStaff?: IStaff;
  className?: string;
  onSuccess?: () => void;
};

export default function StaffForm({
  existingStaff,
  className,
  onSuccess,
}: Props) {
  const [createStaff, { isLoading: creating }] = useCreateStaffMutation();
  const [updateStaff, { isLoading: updating }] = useUpdateStaffMutation();
  const isLoading = creating || updating;

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty, dirtyFields },
  } = useForm<StaffFormData>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      fullname: existingStaff?.fullname || "",
      email: existingStaff?.email || "",
      phone: existingStaff?.phone || "",
      dateSigned: existingStaff?.dateSigned?.split("T")?.[0] || "",
      role: existingStaff?.role || "",
      avatar: existingStaff?.avatar || "",
    },
  });

  const avatar = watch("avatar");

  // Reset form when existingStaff changes
  useEffect(() => {
    if (existingStaff) {
      reset({
        fullname: existingStaff.fullname || "",
        email: existingStaff.email || "",
        phone: existingStaff.phone || "",
        dateSigned: existingStaff.dateSigned?.split("T")?.[0] || "",
        role: existingStaff.role || "",
        avatar: existingStaff.avatar || "",
      });
    }
  }, [existingStaff, reset]);

  const onSubmit = async (data: StaffFormData) => {
    try {
      let result;

      if (existingStaff) {
        // Only send changed fields
        const changedFields = Object.keys(dirtyFields).reduce((acc, key) => {
          const typedKey = key as keyof StaffFormData;
          acc[typedKey] = data[typedKey];
          return acc;
        }, {} as Partial<StaffFormData>);

        result = await updateStaff({
          _id: existingStaff._id,
          ...changedFields,
        }).unwrap();
      } else {
        result = await createStaff(data).unwrap();
      }

      if (result.success) {
        if (!existingStaff) {
          // Reset form for new staff
          reset({
            fullname: "",
            email: "",
            phone: "",
            dateSigned: "",
            role: "",
            avatar: "",
          });
        }

        smartToast(result);
        onSuccess?.();
      } else {
        smartToast(result);
      }
    } catch (error) {
      smartToast({ error });
    }
  };

  const handleAvatarUpload = (file: any) => {
    setValue("avatar", file?.secure_url || "", {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <div className="container mx-auto w-full transition-all duration-300 p-2">
      <h1 className="_title text-Green text-center uppercase p-3">
        {existingStaff
          ? `${existingStaff.fullname} details`
          : "Staff registration"}
      </h1>

      {existingStaff && (
        <h2 className="mt-5 mb-2 text-teal-700 text-xl text-center">
          {existingStaff.role}
        </h2>
      )}

      <form
        id="staff-form"
        onSubmit={handleSubmit(onSubmit)}
        className="grid bg-card gap-9 w-full transition-all duration-300 delay-75 ease-in shadow border _borderColor rounded-md p-6 pt-10 text-sm"
      >
        {/* Avatar Upload */}
        <div className="flex flex-col items-center gap-2">
          <Controller
            name="avatar"
            control={control}
            render={({ field }) => (
              <ImageUploadWidget
                initialImage={field.value  as string}
                onUpload={handleAvatarUpload}
                shape="rounded"
              />
            )}
          />

          {errors.avatar && (
            <p className="text-red-500 text-xs">{errors.avatar.message}</p>
          )}

          {!avatar && (
            <p className="text-red-500 text-xs">Avatar is required</p>
          )}
        </div>

        <section className={`grid gap-8 ${className || ""}`}>
          {/* Fullname */}
          <Controller
            name="fullname"
            control={control}
            render={({ field }) => (
              <IconInputWithLabel
                label="Fullname"
                {...field}
                type="text"
                className="px-2 w-52 sm:w-60 rounded font-semibold"
                error={errors.fullname?.message}
              />
            )}
          />

          {/* Phone */}
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <IconInputWithLabel
                label="Phone"
                {...field}
                type="tel"
                className="px-2 w-52 sm:w-60 rounded font-semibold"
                error={errors.phone?.message}
              />
            )}
          />

          {/* Email */}
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <IconInputWithLabel
                label="Email"
                {...field}
                type="email"
                className="px-2 w-52 sm:w-60 rounded font-semibold"
                error={errors.email?.message}
              />
            )}
          />

          {/* Date Signed */}
          <Controller
            name="dateSigned"
            control={control}
            render={({ field }) => (
              <DateTimeInput
                label="Date Signed"
                type="date"
                {...field}
                className="px-2 w-52 sm:w-60 rounded font-semibold"
                error={errors.dateSigned?.message}
              />
            )}
          />

          {/* Role */}
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <IconInputWithLabel
                label="Role"
                {...field}
                type="text"
                className="px-2 w-52 sm:w-60 rounded font-semibold"
                error={errors.role?.message}
              />
            )}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            waiting={isLoading}
            waitingText={existingStaff ? "Saving Changes" : "Submitting"}
            primaryText={existingStaff ? "Save Changes" : "Submit"}
            className="px-12 h-10 py-1 w-full justify-center my-6"
            disabled={isLoading || (existingStaff ? !isDirty : false)}
          />
        </section>
      </form>
    </div>
  );
}
