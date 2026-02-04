import { useUser } from "@clerk/clerk-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Heart, MapPinIcon, Trash2Icon } from "lucide-react";
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
        fn: fnDeleteJob,
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
        <Card className="flex flex-col w-full max-w-md mx-auto">
            {loadingDeleteJob && (
                <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
            )}
            <CardHeader>
                <CardTitle className="flex justify-between items-center font-bold text-base sm:text-lg lg:text-xl">
                    {job.title}
                    {isMyJob && (
                        <Trash2Icon
                            fill="red"
                            size={18}
                            className="text-red-300 cursor-pointer"
                            onClick={handleDeleteJob}
                        />
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 flex-1 text-sm sm:text-base lg:text-lg">
                <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-4">
                    {job.company?.logo_url && (
                        <img
                            src={job.company.logo_url}
                            className="h-8 sm:h-10 object-contain"
                        />
                    )}
                    <div className="flex gap-2 items-center text-gray-700">
                        <MapPinIcon size={15} /> {job.location}
                    </div>
                </div>
                <hr />
                <p className="line-clamp-2">{job.description.substring(0, job.description.indexOf("."))}</p>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-2">
                <Link to={`/job/${job.id}`} className="flex-1">
                    <Button variant="secondary" className="w-full">
                        More Details
                    </Button>
                </Link>

                {!isMyJob && (
                    <Button
                        variant="outline"
                        className="w-full sm:w-20 flex items-center justify-center"
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