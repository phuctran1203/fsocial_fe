import ButtonGroup from "@/components/ButtonGroup";
import {
  ReadIcon,
  RemoveIcon,
  SearchInApiIcon,
  UnReadIcon,
} from "@/components/Icon";
import Search from "@/components/Search";
import Table from "@/components/Table";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// , "/post/**", "/timeline/**", "/profile/**"
export default function Complaint() {
  const [searchValue, setSearchValue] = useState("");

  const buttonItems = ["Tất cả", "Bài viết", "Người dùng"];
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState("Tất cả");
  const headers = [
    "Người báo cáo",
    "Loại báo cáo",
    "Người dùng/Bài viết bị báo cáo",
    "Nội dung báo cáo",
    "Ngày báo cáo",
    "Hành động",
  ];
  const fetchComplant = () => {
    const currenData = [
      {
        status: false,
        id: "lạdlfka",
        userComplaint: "Cang Ngô 123",
        complaintType: "Bài viết",
        complaint: "http://localhost:3000/postId?=bai-viet-hoi-nhay-cam-hihi",
        content: "Bài viết hơi kì",
        dataTime: "11/02/2025",
        userName: "cangngo",
      },
      {
        status: false,
        id: "lạdlfkaư",
        userComplaint: "Cang Ngô",
        complaintType: "Người dùng",
        complaint: "http://localhost:3000/postId?=bai-viet-hoi-nhay-cam-hihi",
        content: "Nội dung nhạy cảm",
        dataTime: "11/02/2025",
        userName: "cangngo",
      },
      {
        status: false,
        id: "lạdlfkea",
        userComplaint: "Cang Ngô",
        complaintType: "Người dùng",
        complaint: "http://localhost:3000/postId?=bai-viet-hoi-nhay-cam-hihi",
        content: "Nội dung nhạy cảm",
        dataTime: "11/02/2025",
        userName: "cangngo",
      },
      {
        status: false,
        id: "lạdlưfka",
        userComplaint: "Cang Ngô",
        complaintType: "Người dùng",
        complaint: "http://localhost:3000/postId?=bai-viet-hoi-nhay-cam-hihi",
        content: "Nội dung nhạy cảm",
        dataTime: "11/02/2025",
        userName: "cangngo",
      },
      {
        status: false,
        id: "lạdlfqka",
        userComplaint: "Cang Ngô",
        complaintType: "Bài viết",
        complaint: "http://localhost:3000/postId?=bai-viet-hoi-nhay-cam-hihi",
        content: "Nội dung nhạy cảm",
        dataTime: "11/02/2025",
        userName: "cangngo",
      },
      {
        status: false,
        id: "lạdlfska",
        userComplaint: "Cang Ngô",
        complaintType: "Bài viết",
        complaint: "http://localhost:3000/postId?=bai-viet-hoi-nhay-cam-hihi",
        content: "Nội dung nhạy cảm",
        dataTime: "11/02/2025",
        userName: "cangngo",
      },
      {
        status: false,
        id: "lạdlfkfa",
        userComplaint: "Cang Ngô",
        complaintType: "Bài viết",
        complaint: "http://localhost:3000/postId?=bai-viet-hoi-nhay-cam-hihi",
        content: "Nội dung nhạy cảm",
        dataTime: "11/02/2025",
        userName: "cangngo",
      },
      {
        status: false,
        id: "lạdlfkca",
        userComplaint: "Cang Ngô",
        complaintType: "Bài viết",
        complaint: "http://localhost:3000/postId?=bai-viet-hoi-nhay-cam-hihi",
        content: "Nội dung nhạy cảm",
        dataTime: "11/02/2025",
        userName: "cangngo",
      },

      {
        status: false,
        id: "lạdlfxka",
        userComplaint: "Cang Ngô",
        complaintType: "Bài viết",
        complaint: "http://localhost:3000/postId?=bai-viet-hoi-nhay-cam-hihi",
        content: "Nội dung nhạy cảm",
        dataTime: "11/02/2025",
        userName: "cangngo",
      },
      {
        status: false,
        id: "lạdlzfka",
        userComplaint: "Cang Ngô",
        complaintType: "Bài viết",
        complaint: "http://localhost:3000/postId?=bai-viet-hoi-nhay-cam-hihi",
        content: "Nội dung nhạy cảm",
        dataTime: "11/02/2025",
        userName: "cangngo",
      },
      {
        status: false,
        id: "lạdvlfka",
        userComplaint: "Cang Ngô",
        complaintType: "Bài viết",
        complaint: "http://localhost:3000/postId?=bai-viet-hoi-nhay-cam-hihi",
        content: "Nội dung nhạy cảm",
        dataTime: "11/02/2025",
        userName: "cangngo",
      },
      {
        status: false,
        id: "lạdlfkba",
        userComplaint: "Cang Ngô",
        complaintType: "Bài viết",
        complaint: "http://localhost:3000/postId?=bai-viet-hoi-nhay-cam-hihi",
        content: "Nội dung nhạy cảm",
        dataTime: "11/02/2025",
        userName: "cangngo",
      },
      {
        status: false,
        id: "lạdlfka",
        userComplaint: "Cang Ngô",
        complaintType: "Bài viết",
        complaint: "http://localhost:3000/postId?=bai-viet-hoi-nhay-cam-hihi",
        content: "Nội dung nhạy cảm",
        dataTime: "11/02/2025",
        userName: "cangngo",
      },
    ];
    return currenData;
  };
  useEffect(() => {
    const fetch = fetchComplant();
    setData(fetch);
    setFilteredData(fetch);
  }, []);

  useEffect(() => {
    const result = data.filter((item) =>
      Object.values(item).some((val) =>
        val?.toString().toLowerCase().includes(searchValue.toLowerCase())
      )
    );
    setFilteredData(result);
  }, [searchValue, data]);

  const handleSearch = (value) => {
    setSearchValue(value);
  };

  const handleSelected = (value) => {
    const currentSelected = buttonItems[value];
    console.log(currentSelected.toLowerCase());

    if (currentSelected.toLowerCase() != "tất cả") {
      setFilteredData(
        data.filter((item) => {
          return (
            item.complaintType.toLowerCase() ===
            currentSelected.toLocaleLowerCase()
          );
        })
      );
    } else {
      setFilteredData(data);
    }
    setSelected(currentSelected);
  };

  const handleReadComplaint = (id) => {
    setData(
      filteredData.map((item) => {
        if (item.id === id) item.status = true;
        return {
          ...item,
        };
      })
    );
  };

  const handleRemoveComplaint = (id) => {
    setData(
      filteredData.filter((item) => {
        if (item.id !== id)
          return {
            ...item,
          };
      })
    );
  };

  const renderRow = (item) => {
    return (
      <>
        <td className=" text-[#404040]">
          <div className="text-black">{item.userComplaint}</div>
          <div className="text-gray">{item.userName}</div>
        </td>
        <td>{item.complaintType}</td>
        <td className="text-primary hover:cursor-pointer">
          <Link to={item.complaint}>{item.complaint}</Link>
        </td>
        <td>{item.content}</td>
        <td>{item.dataTime}</td>
        <td className="flex">
          <div onClick={() => handleRemoveComplaint(item.id)}>
            <RemoveIcon />
          </div>
          <div onClick={() => handleReadComplaint(item.id)}>
            {item.status ? <ReadIcon /> : <UnReadIcon />}
          </div>
        </td>
      </>
    );
  };
  return (
    <div>
      <div className="flex flex-col h-[77px] pt-5 pl-6">
        <span className="text-lg">Quản lý người dùng</span>
        <span className="text-sm text-gray">
          Hành động đối với tài khoản người dùng
        </span>
      </div>
      <div className="flex justify-between items-center h-[68px] px-4">
        <ButtonGroup onClick={(e) => handleSelected(e)} items={buttonItems} />
        <div className="flex w-[455px] justify-between">
          <Search
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={"Tìm kiếm"}
          />
          <SearchInApiIcon />
        </div>
      </div>
      <div>
        <Table
          loading={loading}
          data={filteredData}
          renderRow={renderRow}
          headers={headers}
        />
      </div>
      <div></div>
    </div>
  );
}
