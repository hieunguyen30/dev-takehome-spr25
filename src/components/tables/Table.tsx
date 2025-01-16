import React, { useState, useEffect } from "react";
import { RequestStatus } from "@/lib/types/request";
import Dropdown from "@/components/atoms/Dropdown";
import Pagination from "@/components/molecules/Pagination";
import { PAGINATION_PAGE_SIZE } from "@/lib/constants/config";

const Table = () => {
  const [itemRequests, setItemRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [isDesktop, setIsDesktop] = useState<boolean>(false);

  useEffect(() => {
    fetchData(pageNumber, statusFilter);
  }, [pageNumber, statusFilter]);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchData = async (page: number, status: string) => {
    setLoading(true);
    try {
      const url = `http://localhost:3000/api/request?status=${
        status === "all" ? "" : status
      }&page=${page}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch item requests");
      }
      const { data, totalCount } = await response.json();
      setItemRequests(data);
      setTotalRecords(totalCount);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleBlur = () => {
    setOpenDropdownId(null);
  };
  const handleStatusChange = async (id: string, newStatus: RequestStatus) => {
    const updatedRequests = itemRequests.map((request) =>
      request.id === id ? { ...request, status: newStatus } : request
    );
    setItemRequests(updatedRequests);

    try {
      const response = await fetch("http://localhost:3000/api/request", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      setOpenDropdownId(null);

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      fetchData(pageNumber, statusFilter);
    } catch (error: any) {
      const revertedRequests = itemRequests.map((request) =>
        request.id === id ? { ...request, status: request.status } : request
      );
      setItemRequests(revertedRequests);

      setError(error.message);
    }
  };

  const handleTabChange = (status: string) => {
    setStatusFilter(status);
    setPageNumber(1);
    setOpenDropdownId(null);
  };

  const handleDropdownToggle = (id: string) => {
    setOpenDropdownId((prev) => (prev === id ? null : id));
  };

  const displayedRequests = [...itemRequests];
  if (isDesktop) {
    while (displayedRequests.length < 6) {
      displayedRequests.push({
        _id: `placeholder-${displayedRequests.length}`,
        isPlaceholder: true,
      });
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <section className="container mx-auto">
      <h2 className="text-lg font-medium py-[1.25rem] px-6">Item Requests</h2>
      <div className="hidden md:block ">
        <div className="flex gap-1.5 h-[2.625rem] pl-[1.063rem] w-full overflow-x-auto overflow-visible">
          {["all", "pending", "approved", "completed", "rejected"].map(
            (status) => (
              <button
                key={status}
                onClick={() => handleTabChange(status)}
                className={`py-2 px-4 md:text-sm text-xs font-medium ${
                  statusFilter === status
                    ? "bg-[#0070FF] text-[white]"
                    : "bg-[#F2F2F2] text-[#666666] hover:bg-[#EFF6FF]"
                } rounded-t ${
                  status === "pending"
                    ? "w-[7.688rem]"
                    : status === "approved"
                    ? "w-[8.438rem]"
                    : status === "completed"
                    ? "w-[7.563rem]"
                    : status === "rejected"
                    ? "w-[6.063rem]"
                    : "w-[3.5rem]"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            )
          )}
        </div>

        <div className="mt-0 overflow-x-auto hidden md:block">
          <table className="min-w-full border border-[#EAECF0] divide-y divide-gray-200">
            <thead className="bg-[#FCFCFD]">
              <tr>
                <th className="py-[0.8125rem] px-6 text-xs font-medium text-left text-[#667085] w-[16.375rem]">
                  Name
                </th>
                <th className="py-[0.8125rem] px-6 text-xs font-medium text-left text-[#667085] w-[22.0625rem]">
                  Item Requested
                </th>
                <th className="py-[0.8125rem] px-6 text-xs font-medium text-left text-[#667085] w-[12.5rem]">
                  Created
                </th>
                <th className="py-[0.8125rem] px-6 text-xs font-medium text-left text-[#667085] w-[12.5rem]">
                  Updated
                </th>
                <th className="py-[0.8125rem] px-6 text-xs font-medium text-left text-[#667085] w-[11.875rem]">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayedRequests.map((request) =>
                request.isPlaceholder ? (
                  <tr key={request._id} className="opacity-50">
                    <td className="py-3 px-6 text-sm text-[#667085]">&nbsp;</td>
                    <td className="py-3 px-6 text-sm text-[#667085]">&nbsp;</td>
                    <td className="py-3 px-6 text-sm text-[#667085]">&nbsp;</td>
                    <td className="py-3 px-6 text-sm text-[#667085]">&nbsp;</td>
                    <td className="py-[0.3125rem] px-6 text-sm">&nbsp;</td>
                  </tr>
                ) : (
                  <tr key={request._id}>
                    <td className="py-3 px-6 text-sm text-[#667085]">
                      {request.requestorName}
                    </td>
                    <td className="py-3 px-6 text-sm text-[#667085]">
                      {request.itemRequested}
                    </td>
                    <td className="py-3 px-6 text-sm text-[#667085]">
                      {new Date(request.requestCreatedDate).toLocaleDateString(
                        "en-US"
                      )}
                    </td>
                    <td className="py-3 px-6 text-sm text-[#667085]">
                      {request.lastEditedDate
                        ? new Date(request.lastEditedDate).toLocaleDateString(
                            "en-US"
                          )
                        : new Date(
                            request.requestCreatedDate
                          ).toLocaleDateString("en-US")}
                    </td>
                    <td className="py-[0.3125rem] px-6 text-sm">
                      <Dropdown
                        currentStatus={request.status}
                        onChange={(newStatus) =>
                          handleStatusChange(request._id, newStatus)
                        }
                        isOpen={openDropdownId === request._id}
                        onToggle={() => handleDropdownToggle(request._id)}
                        onBlur={handleBlur}
                      />
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* for mobile */}
      <div className="w-full md:hidden">
        <select
          onChange={(e) => handleTabChange(e.target.value)}
          value={statusFilter}
          className="py-2 px-4 text-sm font-medium bg-[#F2F2F2] text-[#666666] rounded-md w-full max-w-full ml-[10px] mb-[10px]"
          style={{ width: "40%", maxWidth: "40%", boxSizing: "border-box" }}
        >
          {["all", "pending", "approved", "completed", "rejected"].map(
            (status) => (
              <option key={status} value={status} className={"text-[#666666"}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            )
          )}
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:hidden">
        {displayedRequests.map((request) =>
          request.isPlaceholder ? (
            <div
              key={request._id}
              className="bg-white space-y-3 p-4 rounded-lg shadow opacity-50"
            >
              <div className="h-6 bg-gray-200"></div>
            </div>
          ) : (
            <div
              key={request._id}
              className="bg-white space-y-3 p-4 rounded-lg shadow"
            >
              <div className="text-[#667085] text-sm">
                {request.requestorName}
              </div>
              <div className="font-medium text-lg text-[#667085]">
                {request.itemRequested}
              </div>
              <div className="flex justify-left gap-4 text-sm text-[#667085]">
                <span>
                  Created:{" "}
                  {new Date(request.requestCreatedDate).toLocaleDateString(
                    "en-US"
                  )}
                </span>
                <span>
                  Edited:{" "}
                  {request.lastEditedDate
                    ? new Date(request.lastEditedDate).toLocaleDateString(
                        "en-US"
                      )
                    : new Date(request.requestCreatedDate).toLocaleDateString(
                        "en-US"
                      )}
                </span>
              </div>
              <Dropdown
                currentStatus={request.status}
                onChange={(newStatus) =>
                  handleStatusChange(request._id, newStatus)
                }
                isOpen={openDropdownId === request._id}
                onToggle={() => handleDropdownToggle(request._id)}
                onBlur={handleBlur}
              />
            </div>
          )
        )}
      </div>
      <div className="flex justify-end">
        <Pagination
          pageNumber={pageNumber}
          pageSize={PAGINATION_PAGE_SIZE}
          totalRecords={totalRecords}
          onPageChange={setPageNumber}
        />
      </div>
    </section>
  );
};

export default Table;
