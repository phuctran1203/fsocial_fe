import React, { useState, useEffect } from "react";
import Button from "./Button";
import { toast } from "sonner";
import { usePopupStore } from "@/store/popupStore";
import { LoadingIcon } from "./Icon";
import { getTermOfService } from "@/api/termOfServiceApi";
import { complaint } from "@/api/complaintApi";
import { ownerAccountStore } from "@/store/ownerAccountStore";

export default function ReportModal({ id }) {
  const hidePopup = usePopupStore((state) => state.hidePopup);
  const user = ownerAccountStore.getState().user;
  const [selectedReason, setSelectedReason] = useState("Có dấu hiệu lừa đảo");
  const [reportOptions, setReportOptions] = useState([]);

  const fetchTermOfService = async () => {
    try {
      const response = await getTermOfService();
      return response.data; 
    } catch (error) {
      console.error("Error fetching terms of service:", error);
      return []; 
    }
  };

  const [submitClicked, setSubmitClicked] = useState(false);

  const submitReport = async () => {
    setSubmitClicked(true);

    //complaint
    const data = {
      postId: id,
      userId: user.userId,
      complaintType: "Bài viết",
      termOfServiceId: selectedReason,
    };
    console.log(data);

    const res = await complaint(data);

    setTimeout(() => {
      toast.success("Đã gửi báo cáo");
      hidePopup();
    }, 1000);
  };

  useEffect(() => {
    const loadReportOptions = async () => {
      const data = await fetchTermOfService(); 
      setReportOptions(data); 
    };

    loadReportOptions();
  }, []);

  return (
    <div className="relative flex-grow flex flex-col sm:w-[550px] sm:min-h-[50dvh] sm:h-fit sm:max-h-[90dvh] w-screen h-[100dvh]">
      <div className="px-4 flex-grow space-y-3 pt-3 overflow-y-auto">
        {reportOptions.map((option) => (
          <label
            key={option.id}
            className="flex items-center space-x-2 p-3 border rounded hover:bg-gray-3light cursor-pointer transition"
          >
            <input
              type="radio"
              name="reportReason"
              value={option.name}
              checked={selectedReason === option.id}
              onChange={() => setSelectedReason(option.id)}
            />
            <span>{option.name}</span>
          </label>
        ))}
      </div>

      <div className="sticky bottom-0 p-3 bg-background">
        <Button
          className={`btn-primary py-2.5 ${submitClicked && "disable-btn"}`}
          onClick={submitReport}
        >
          {submitClicked ? <LoadingIcon /> : "Báo cáo"}
        </Button>
      </div>
    </div>
  );
}
