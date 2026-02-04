import CreatedApplications from "@/components/created-applications";
import CreatedJobs from "@/components/created-jobs";
import { useUser } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";

const MyJobs = () => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Page Title */}
      <h1
        className="gradient-title font-extrabold 
        text-3xl sm:text-5xl lg:text-7xl 
        text-center pb-6 sm:pb-8"
      >
        {user?.unsafeMetadata?.role === "candidate"
          ? "My Applications"
          : "My Jobs"}
      </h1>

      {/* Content Section */}
      <div className="flex flex-col gap-6 sm:gap-10">
        {user?.unsafeMetadata?.role === "candidate" ? (
          <div className="w-full">
            <CreatedApplications />
          </div>
        ) : (
          <div className="w-full">
            <CreatedJobs />
          </div>
        )}
      </div>
    </div>
  );
};

export default MyJobs;