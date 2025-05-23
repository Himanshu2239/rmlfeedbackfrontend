
'use client'

import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast, { Toaster } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";



const headers = [
  { title: "HR INPUT", colspan: 9 },
  // { title: "KRA", colspan: 1 },
  { title: "KPI 1", colspan: 2 },
  { title: "KPI 2", colspan: 2 },
  { title: "KPI 3", colspan: 2 },
  { title: "KPI 4", colspan: 2 },
  { title: "KPI 5", colspan: 2 },
  { title: "RH/HOD INPUT", colspan: 14 }
];

const subHeaders = [
  "SL No",
  "Employee ID",
  "Employee Name",
  "Business Unit",
  "Department",
  "Designation",
  "Date of Joining",
  "Reporting / Functional Head",
  "KRA",
  "Target",
  "Achievement",
  "Target",
  "Achievement",
  "Target",
  "Achievement",
  "Target",
  "Achievement",
  "Target",
  "Achievement",
  // "Target",
  "Overall KPI Achievement (%)",
  "Knowledge & Expertise (1-5)",
  "Attitude & Approach (1-5)",
  "Initiative & Proactivity (1-5)",
  "Teamwork & Collaboration (1-5)",
  "Adaptability & Learning (1-5)",
  "Communication Skills (1-5)",
  "Attendance & Punctuality (1-5)",
  "Areas for Improvement",
  // "Training Recommendations",
  "Confirmation Status",
  // "Rationale",
  "Remarks"
];

const data = [
  {
    id: 1,
    fields: Array(33).fill("").map((_, i) => [
      "79", "RML033072", "Jayanta Pal", "Rashmi Metaliks Limited", "Technician", "Technician", "10/7/2024",
      "Subrat Kumar Patra(RML022390)", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", ""
    ][i] || "")
  },
  {
    id: 2,
    fields: Array(33).fill("").map((_, i) => [
      "81", "RML033075", "Bayavaru Vijay Kumar", "Rashmi Metaliks Limited", "Senior Fitter", "Senior Fitter", "10/9/2024",
      "Subrat Kumar Patra(RML022390)", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", ""
    ][i] || "")
  }
];

export default function FeedbackTable() {
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tableFetchData, setTableFetchData] = useState([]);
  const [isVisibleDownload, setIsVisibleDownload] = useState(false);


  useEffect(() => {
    const fetchEmployees = async () => {
      try {

        const userDetails = JSON.parse(localStorage.getItem("userDetails"));
        // console.log("userDetails", userDetails);
        const headId = userDetails.empId;

        if(headId === 'RDL000791')
         setIsVisibleDownload(true);
        // console.log("headId", headId);
        if (!headId) return;

        const savedSessionData = sessionStorage.getItem(`feedback_${headId}`);
        if (savedSessionData) {
          setTableData(JSON.parse(savedSessionData));
          setTableFetchData(JSON.parse(savedSessionData));
          // setTableFetchData(formatted);
          return;
        }

        const res = await fetch("https://feedbackrml.vercel.app/employee/getEmployeesByReportingHeadId", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ headId }),
        });

        const result = await res.json();
        // console.log("result", result);
        const employees = result.data;

        // Transform the employee data into tableData format
        const formatted = employees.map((emp, index) => ({
          id: index + 1,
          fields: [
            `${index + 1}`, // SL No
            emp.employeeId || "",
            emp.employeeName || "",
            emp.businessUnit || "",
            emp.department || "",
            emp.designation || "",
            emp.dateOfJoining ? new Date(emp.dateOfJoining).toLocaleDateString("en-GB") : "",
            emp.reportingHead || "",
            "", // KRA
            "", "", "", "", "", "", "", "", "", "", // KPI 1–5
            "", // Overall KPI Achievement (%)
            "", "", "", "", "", "", "", // Ratings
            "", // Areas for Improvement
            // "", // Training Recommendations
            "", // Confirmation Status
            // "", // Rationale
            "", // Remarks
          ],
        }));

        // console.log("formattedArr", formatted);

        setTableData(formatted);
        setTableFetchData(formatted);

      } catch (error) {
        console.error("Failed to fetch employee data:", error);
      }
    };

    fetchEmployees();
  }, []);





  const handleChange = (rowId, index, value) => {
    setTableData((prev) =>
      prev.map((row) =>
        row.id === rowId
          ? {
            ...row,
            fields: row.fields.map((field, i) => (i === index ? value : field))
          }
          : row
      )
    );
  };
 

  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem("userDetails"));
    const headId = userDetails?.empId;
    if (headId && tableData.length > 0) {
      sessionStorage.setItem(`feedback_${headId}`, JSON.stringify(tableData));
    }
  }, [tableData]);

  // const handleSubmit = () => {
  //   console.log("Submitted Data:", tableData);
  //   alert("Data submitted! Check console for details.");
  // };


  const handleSubmit = async () => {

    // Validate all fields are filled
    const incompleteRows = tableData.filter(row =>
      row.fields.some((field, index) => index > 7 && field.trim() === "")
    );

    if (incompleteRows.length > 0) {
      toast.error("Please fill in all fields before submitting.");
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading("Submitting...");

    try {
      const res = await fetch("https://feedbackrml.vercel.app/employee/addFeedBackMasterData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: tableData }),
      });

      const result = await res.json();

      if (res.ok) {
        // alert("Data submitted successfully!");
        toast.success("Data submitted successfully!", { id: toastId });
        // console.log("Submitted Data:", result);
      } else {
        // alert("Submission failed. Please try again.");
        toast.error("Submission failed. Please try again.", { id: toastId });
        console.error("Error:", result);
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Something went wrong!", { id: toastId });

      // alert("Something went wrong!");
    } finally {
      setIsLoading(false);
      console.log("tableFetchData", tableFetchData)
      setTableData(tableFetchData);
    }
  };

  


  const ratingIndices = [
    subHeaders.indexOf("Knowledge & Expertise (1-5)"),
    subHeaders.indexOf("Attitude & Approach (1-5)"),
    subHeaders.indexOf("Initiative & Proactivity (1-5)"),
    subHeaders.indexOf("Teamwork & Collaboration (1-5)"),
    subHeaders.indexOf("Adaptability & Learning (1-5)"),
    subHeaders.indexOf("Communication Skills (1-5)"),
    subHeaders.indexOf("Attendance & Punctuality (1-5)")
  ];

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login"; // or your login route
  };


  return (
    <div className="relative">
      <Toaster position="top-right"
        toastOptions={{
          style: {
            marginTop: "20px",
            padding: "12px",
            fontSize: "16px",
          },
        }}
      />
      {/* Fixed Header with Logout */}
      <div className="fixed top-0 left-0 w-full z-50 bg-white shadow flex items-center justify-between px-6 py-3 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-blue-900">Feedback Form</h1>
        {isVisibleDownload && <button
          onClick={() => window.open("https://feedbackrml.vercel.app/employee/downloadExcelReport", "_blank")}
          className="px-4 py-2 bg-green-600 text-white rounded cursor-pointer"
        >
          Feedback Report
        </button>}
        {isVisibleDownload && <button
          onClick={() => window.open("https://feedbackrml.vercel.app/employee/downloadNotSubmittedExcelReport", "_blank")}
          className="px-4 py-2 bg-red-600 text-white rounded cursor-pointer"
        >
           Pending Report
        </button>}
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-md text-[16px] cursor-pointer"
        >
          Logout
        </button>
      </div>
      {/* Main Content */}
      <div className={`${isLoading ? "mt-5" : "mt-20"} m-4`}>
        {isLoading && <Loader2 className="h-10 relative top-95 m-auto w-10 animate-spin" />}
        <Card
          //  className="overflow-auto w-full max-h-[80vh]"
          className={`overflow-auto w-full max-h-[80vh] transition-opacity duration-300 ${isLoading ? "pointer-events-none opacity-50" : ""
            }`}
        >
          <CardContent className="p-2">
            <motion.table
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="min-w-[2000px] border border-gray-300 text-sm text-left text-gray-700"
            >
              <thead>
                <tr className="bg-blue-900 text-white">
                  {headers.map((header, idx) => (
                    <th
                      key={idx}
                      colSpan={header.colspan}
                      className="px-3 py-2 border border-white text-nowrap text-center"
                    >
                      {header.title}
                    </th>
                  ))}
                </tr>
                <tr className="bg-blue-800 text-white">
                  {subHeaders.map((header, idx) => (
                    <th key={idx} className="px-3 py-2 border border-white text-nowrap text-center">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.map((row) => (
                  <tr key={row.id} className="even:bg-gray-100">
                    {row.fields.map((cell, idx) => (
                      <td key={idx} className="border px-2 py-1 min-w-[120px]">
                        {idx <= 7 ? (
                          <div className="text-sm px-1 py-0.5">{cell}</div>
                        ) : idx === 28 ? (
                          <select
                            value={cell}
                            onChange={(e) => handleChange(row.id, idx, e.target.value)}
                            className="w-full text-sm border rounded-md px-2 py-1"
                          >
                            <option value="">Select</option>
                            <option value="To be confirmed">To be confirmed</option>
                            <option value="To be extend">To be extend</option>
                          </select>
                        ) : ratingIndices.includes(idx) ? (
                          <Input
                            type="number"
                            min={1}
                            max={5}
                            value={cell}
                            className="w-full text-sm"
                            onChange={(e) => handleChange(row.id, idx, e.target.value)}
                          />
                        ) : (
                          <Textarea
                            value={cell}
                            className="min-h-[6.4rem] min-w-[14rem] resize rounded-md border border-gray-300 p-2 text-sm"
                            // onInput="this.style.height = 'auto'; this.style.height = this.scrollHeight + 'px';"
                            placeholder="Enter text..."
                            onChange={(e) => handleChange(row.id, idx, e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </motion.table>
          </CardContent>
        </Card>
        <div className="flex justify-center mt-2">
          <Button className="w-24 bg-green-800 text-xl hover:bg-green-900 cursor-pointer" onClick={handleSubmit} disabled={isLoading}>Submit</Button>
        </div>
      </div>
    </div>
  );
}


