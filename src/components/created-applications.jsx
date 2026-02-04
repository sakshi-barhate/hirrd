import { getApplications } from "@/api/apiApplications";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { BarLoader } from "react-spinners";
import ApplicationCard from "./application-card";

const CreatedApplications = () => {
  const { user } = useUser();

  const {
    loading: loadingApplications,
    data: applications,
    fn: fnApplications,
  } = useFetch(getApplications, {
    user_id: user.id,
  });

  useEffect(() => {
    fnApplications();
  }, []);

  if (loadingApplications) {
    return (
      <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {applications && applications.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {applications.map((application) => {
            return (
              <ApplicationCard
                key={application.id}
                application={application}
                isCandidate
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm sm:text-base lg:text-lg">
            No applications found.
          </p>
        </div>
      )}
    </div>
  );
};

export default CreatedApplications;