import { Boxes, BriefcaseBusiness, Download, School } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import useFetch from "@/hooks/use-fetch";
import { updateApplicationStatus } from "@/api/apiApplications";
import { BarLoader } from "react-spinners";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const ApplicationCard = ({ application, isCandidate = false }) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = application?.resume;
    link.target = "_blank";
    link.click();
  };

  const handleStatusChange = (status) => {
    fnHiringStatus(status);
  };

  const {
    loading: loadingHiringStatus,
    fn: fnHiringStatus,
  } = useFetch(updateApplicationStatus, {
    job_id: application?.job_id,
  });

  return (
    <Card className="w-full max-w-xl mx-auto">
      {loadingHiringStatus && <BarLoader width={"100%"} color="#36d7b7" />}

      {/* Header */}
      <CardHeader>
        <CardTitle
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 font-bold text-base sm:text-lg lg:text-xl"
        >
          {isCandidate
            ? `${application?.job?.title} at ${application?.job?.company?.name}`
            : application?.name}
          <Download
            size={18}
            className="bg-white text-black rounded-full h-8 w-8 p-1.5 cursor-pointer self-end sm:self-auto"
            onClick={handleDownload}
          />
        </CardTitle>
      </CardHeader>

      {/* Content */}
      <CardContent className="flex flex-col gap-4 flex-1 text-sm sm:text-base lg:text-lg">
        <div className="flex flex-col md:flex-row md:flex-wrap gap-3 justify-between">
          <div className="flex gap-2 items-center">
            <BriefcaseBusiness size={15} /> {application?.experience} years of experience
          </div>

          <div className="flex gap-2 items-center">
            <School size={15} /> {application?.education}
          </div>

          <div className="flex gap-2 items-center">
            <Boxes size={15} /> Skills: {application?.skills}
          </div>
        </div>

        <hr />
      </CardContent>

      {/* Footer */}
      <CardFooter className="flex flex-col sm:flex-row justify-between gap-2 text-xs sm:text-sm lg:text-base">
        <span>{new Date(application?.created_at).toLocaleString()}</span>
        {isCandidate ? (
          <span className="capitalize font-bold">Status: {application?.status}</span>
        ) : (
          <Select onValueChange={handleStatusChange} defaultValue={application.status}>
            <SelectTrigger className="w-full sm:w-52">
              <SelectValue placeholder="Application Status" />
            </SelectTrigger>
            <SelectContent
              position="popper"
              sideOffset={5}
              className="bg-slate-800 border border-slate-600 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] overflow-hidden p-1"
            >
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="interviewing">Interviewing</SelectItem>
              <SelectItem value="hired">Hired</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        )}
      </CardFooter>
    </Card>
  );
};

export default ApplicationCard;