import { useUser } from "@clerk/clerk-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Heart, MapPinIcon, Trash2Icon, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { deleteJob, saveJob } from "@/api/apiJobs";
import { useEffect, useState } from "react";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";

const JobCard = ({
    job,
    isMyJob = false,
    savedInit = false,
    onJobSaved = () => {},
}) => {
    const [saved, setSaved] = useState(savedInit);

    const {
        fn: fnsavedJob,
        data: savedJob,
        loading: loadingSavedJob,
    } = useFetch(saveJob, {
        alreadySaved: saved,
    });

    const { user } = useUser();

    const handleSaveJob = async () => {
        await fnsavedJob({
            user_id: user.id,
            job_id: job.id,
        });
        onJobSaved();
    };

    const {
        loading: loadingDeleteJob,
        fn: fnDeleteJob
    } = useFetch(deleteJob, {
        job_id: job.id,
    });

    const handleDeleteJob = async () => {
        await fnDeleteJob();
        onJobSaved();
    };

    useEffect(() => {
        if (savedJob !== undefined) setSaved(savedJob?.length > 0);
    }, [savedJob]);

    return (
        <Card className="flex flex-col hover:shadow-lg transition-shadow">
            {loadingDeleteJob && (
                <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
            )}
            
            <CardHeader className="pb-3">
                <CardTitle className="flex justify-between items-start gap-2">
                    <span className="font-bold text-lg sm:text-xl line-clamp-2 flex-1">
                        {job.title}
                    </span>
                    {isMyJob && (
                        <Trash2Icon
                            fill="red"
                            size={20}
                            className="text-red-300 cursor-pointer hover:scale-110 transition-transform flex-shrink-0 mt-1"
                            onClick={handleDeleteJob}
                        />
                    )}
                </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col gap-4 flex-1 pt-0">
                {/* Company Logo & Location Row */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    {/* Company Logo */}
                    {job.company?.logo_url ? (
                        <img 
                            src={job.company.logo_url} 
                            alt={job.company?.name || "Company"} 
                            className="h-8 sm:h-10 object-contain self-start"
                        />
                    ) : (
                        <div className="flex items-center gap-2 text-gray-500">
                            <Briefcase size={16} />
                            <span className="text-sm">{job.company?.name || "Company"}</span>
                        </div>
                    )}

                    {/* Location */}
                    <div className="flex gap-2 items-center text-gray-600 text-sm sm:text-base">
                        <MapPinIcon size={16} className="flex-shrink-0" />
                        <span className="truncate">{job.location}</span>
                    </div>
                </div>

                <hr className="border-gray-200" />

                {/* Job Description */}
                <p className="text-sm sm:text-base text-gray-700 line-clamp-2">
                    {job.description.substring(0, job.description.indexOf(".")) || 
                     job.description.substring(0, 150)}
                </p>
            </CardContent>

            <CardFooter className="flex gap-2 pt-4">
                {/* More Details Button */}
                <Link to={`/job/${job.id}`} className="flex-1">
                    <Button 
                        variant="secondary" 
                        className="w-full h-10 sm:h-11 text-sm sm:text-base font-medium"
                    >
                        More Details
                    </Button>
                </Link>

                {/* Save/Heart Button */}
                {!isMyJob && (
                    <Button
                        variant="outline"
                        className="w-10 h-10 sm:w-11 sm:h-11 p-0 flex-shrink-0"
                        onClick={handleSaveJob}
                        disabled={loadingSavedJob}
                    >
                        {saved ? (
                            <Heart size={20} stroke="red" fill="red" />
                        ) : (
                            <Heart size={20} />
                        )}
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
};

export default JobCard;