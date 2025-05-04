import { getAllCountries, getAllProvinces } from "@/api/countryApi";
import { updateAvatar, updateBanner } from "@/api/updateProfileInfoApi";
import { Input, JumpingSelect, Select, TextBox } from "@/components/Field";
import { PencilChangeImageIcon } from "@/components/Icon";
import ModalCropImage from "@/components/ModalCropImage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  allCountries,
  allProvinces,
  dayOptions,
  monthOptions,
  yearOptions,
} from "@/config/globalVariables";
import { cn } from "@/lib/utils";
import { ownerAccountStore } from "@/store/ownerAccountStore";
import { usePopupStore } from "@/store/popupStore";
import { combineIntoAvatarName } from "@/utils/combineName";
import { getTextboxData } from "@/utils/processTextboxData";
import { ChevronDown } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function UserAccountBasic() {
  const navigate = useNavigate();
  const { user, setUser } = ownerAccountStore();
  const { showPopup, hidePopup } = usePopupStore();

  const handleSelectBanner = (e) => {
    const el = e.target;
    const file = el.files[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);
      console.log("have file");
      showPopup(
        "Cập nhật ảnh bìa",
        <ModalCropImage
          image={previewURL}
          ratio={3 / 1}
          acceptCropCallback={async (imageCroped) => {
            // const resp = await updateBanner();
            toast.success("Đã cập nhật ảnh bìa");
            setUser({ banner: imageCroped });
            hidePopup();
          }}
        />
      );
    }
  };

  const handleSelectAvatar = (e) => {
    const el = e.target;
    const file = el.files[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);
      console.log("have file");
      showPopup(
        "Cập nhật ảnh đại diện",
        <ModalCropImage
          image={previewURL}
          ratio={1 / 1}
          acceptCropCallback={async (imageCroped) => {
            const resp = await updateAvatar();
            toast.success("Đã cập nhật ảnh đại diện");
            setUser({ avatar: imageCroped });
            hidePopup();
          }}
        />
      );
    }
  };

  // react hook form
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty, dirtyFields },
    getValues,
    setValue,
    watch,
    reset,
  } = useForm({
    mode: "onChange",
    defaultValues: {},
  });

  // load data từ store lên UI
  useEffect(() => {
    if (!user.userId) return;
    const values = {
      firstName: user.firstName,
      lastName: user.lastName,
      country: "VN",
      province: "VN-01",
    };
    reset({
      bio: "",
      ...getValues(),
      ...values,
    });
    register("bio");
    console.log(getValues());
  }, [user]);

  const bioRef = useRef();

  const handleOnInput = () => {
    console.log("textbox change");
    let innerHTML = getTextboxData(bioRef).innerHTML || "";
    console.log("innerHTML is: ", innerHTML);
    console.log("trước: ", getValues());
    console.log(dirtyFields.bio);

    setValue("bio", innerHTML, { shouldDirty: true });

    console.log("sau: ", getValues());
    console.log(dirtyFields.bio);
  };

  const onSubmit = async (data) => {
    reset(getValues()); // gọi để cho isDirty, diryFields biết
    console.log(data);
    // const resp = await updatePersonalInfo();
    toast.success("Đã cập nhật thông tin");
  };

  return (
    <div className="sm:mt-5 mt-2 mb-5">
      {/* banner */}
      <div className="mb-5 space-y-3">
        <p className="font-medium">Ảnh bìa</p>
        <div
          className={cn(
            "relative aspect-[3/1] overflow-hidden lg:rounded-lg border",
            !user.banner && "border-field"
          )}
        >
          {user.banner ? (
            <img src={user.banner} className="size-full" alt="" />
          ) : (
            <div className="size-full grid place-content-center">
              <p>Cập nhật ảnh bìa của bạn</p>
            </div>
          )}
          <label className="btn-secondary w-fit absolute bottom-2 right-2 py-1 ps-2.5 pe-4 border cursor-pointer">
            <PencilChangeImageIcon />
            Đổi ảnh bìa
            <input
              type="file"
              hidden
              onChange={handleSelectBanner}
              onClick={(e) => {
                e.target.value = "";
              }}
            />
          </label>
        </div>
      </div>
      {/* avatar */}
      <div className="mb-5 space-y-3">
        <p className="font-medium">Ảnh đại diện</p>
        <div className="relative bg-background border-4 rounded-full p-1 w-fit transition">
          <Avatar className={`size-[120px]`}>
            <AvatarImage src={user.avatar} />
            <AvatarFallback className="text-[40px] transition">
              {combineIntoAvatarName(user.firstName, user.lastName)}
            </AvatarFallback>
          </Avatar>
          <label className="btn-secondary w-fit absolute bottom-0 right-0 p-1 rounded-full shadow border cursor-pointer">
            <input
              type="file"
              hidden
              onChange={handleSelectAvatar}
              onClick={(e) => {
                e.target.value = "";
              }}
            />
            <PencilChangeImageIcon />
          </label>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* bio */}
        <TextBox
          label="Tiểu sử"
          texboxRef={bioRef}
          onInput={handleOnInput}
          placeholder="Viết gì đó giới thiệu về bản thân"
          className={cn("custom-input")}
          parentClassName={dirtyFields.bio && "border-bottom-faded"}
        />
        {/* name */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Tên"
            name="firstName"
            register={register}
            errors={errors}
            validateOptions={{ required: "Tên không được để trống" }}
            className={dirtyFields.firstName && "border-bottom-faded"}
          />

          <Input
            label="Họ"
            name="lastName"
            register={register}
            errors={errors}
            validateOptions={{ required: "Họ không được để trống" }}
            className={dirtyFields.lastName && "border-bottom-faded"}
          />
        </div>
        {/* gender */}
        <Select
          label="Giới tính"
          name="gender"
          register={register}
          errors={errors}
          options={{
            0: "Nam",
            1: "Nữ",
            2: "Khác",
            3: "Không muốn tiết lộ",
          }}
          icon={<ChevronDown />}
          className={dirtyFields.gender && "border-bottom-faded"}
        />
        {/* birth */}
        <div>
          <p className="mb-4 font-medium">Ngày sinh</p>
          <div className="grid grid-cols-3 gap-4">
            <JumpingSelect
              label="Ngày"
              name="day"
              register={register}
              errors={errors}
              options={dayOptions}
              icon={<ChevronDown />}
              disabled={true}
            />
            <JumpingSelect
              label="Tháng"
              name="month"
              register={register}
              errors={errors}
              options={monthOptions}
              icon={<ChevronDown />}
              disabled={true}
            />
            <JumpingSelect
              label="Năm"
              name="year"
              register={register}
              errors={errors}
              options={yearOptions}
              icon={<ChevronDown />}
              disabled={true}
            />
          </div>
        </div>
        {/* address */}
        <div>
          <p className="mb-4 font-medium">Địa chỉ</p>
          <div className="grid grid-cols-2 gap-4">
            <JumpingSelect
              label="Quốc gia"
              name="country"
              register={register}
              errors={errors}
              options={allCountries}
              icon={<ChevronDown />}
              className={dirtyFields.country && "border-bottom-faded"}
            />

            <JumpingSelect
              label="Tỉnh/thành phố"
              name="province"
              register={register}
              errors={errors}
              options={allProvinces.VN}
              icon={<ChevronDown />}
              className={dirtyFields.province && "border-bottom-faded"}
            />
          </div>
        </div>
        {/* button control hủy, cập nhật */}
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            className="btn-secondary py-2.5"
            onClick={() => navigate("/profile")}
          >
            Hủy bỏ
          </button>

          <button
            className={cn(
              "btn-primary py-2.5",
              (!isValid || !isDirty) && "disable-btn"
            )}
            type="submit"
          >
            Lưu thay đổi
          </button>
        </div>
      </form>
    </div>
  );
}
