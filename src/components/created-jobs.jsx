import { getMyJobs } from "@/api/apiJobs";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { BarLoader } from "react-spinners";
import JobCard from "./job-card";

const CreatedJobs = () => {

    const {user} = useUser();

    const{
        loading: loadingCreatedJobs,
        data: createdJobs,
        fn: fnCreatedJobs,
    } = useFetch(getMyJobs, {
        recruiter_id: user.id,
    });

    useEffect(() => {
        fnCreatedJobs();
    }, []);

    if(loadingCreatedJobs){
        return(
            <BarLoader className="mb-4" width={"100%"} color="#36d7b7"/>
        );
    }

    return(
        <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {createdJobs?.length ?(
                    createdJobs.map((job)=>{
                        return <JobCard key={job.id} job={job}
                        onJobSaved={fnCreatedJobs}
                        isMyJob
                        />
                    })
                ):(
                    <div className="col-span-full text-center text-gray-500 text-sm sm:text-base lg:text-lg">
                        No Jobs Found
                    </div>
                )}
            </div>
        </div>
    );
}

export default CreatedJobs;