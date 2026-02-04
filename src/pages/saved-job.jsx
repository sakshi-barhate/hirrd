import { getSavedJobs } from "@/api/apiJobs";
import JobCard from "@/components/job-card";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { BarLoader } from "react-spinners";

const SavedJobs = () => {
  const { isLoaded } = useUser();

  const {
    loading: loadingSavedJobs,
    data: savedJobs,
    fn: fnSavedJobs,
  } = useFetch(getSavedJobs);

  useEffect(() => {
    if (isLoaded) fnSavedJobs();
  }, [isLoaded]);

  if (!isLoaded || loadingSavedJobs) {
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
        Saved Jobs
      </h1>

      {/* Saved Jobs Grid */}
      {loadingSavedJobs === false && (
        <div
          className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {savedJobs?.length ? (
            savedJobs.map((saved) => (
              <JobCard
                key={saved.id}
                job={saved?.job}
                savedInit={true}
                onJobSaved={fnSavedJobs}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-400 text-sm sm:text-base">
              No Saved Jobs Found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SavedJobs;