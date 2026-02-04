import { getSingleJob, updateHiringStatus } from "@/api/apiJobs";
import ApplicationCard from "@/components/application-card";
import ApplyJobDrawer from "@/components/apply-job";
import { Select, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import { SelectContent } from "@radix-ui/react-select";
import { Briefcase, DoorClosed, DoorOpen, MapPinIcon } from "lucide-react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";

const JobPage = () => {

    const {isLoaded, user} = useUser();
    const {id} = useParams();

    const {
        loading:loadingJob,
        data:job,
        fn:fnJob,
    } = useFetch(getSingleJob, {
        job_id:id,
    });

    const{loading:loadingHiringStatus, fn:fnHiringStatus} = useFetch(
        updateHiringStatus,
        {
            job_id:id,
        }
    );

    const handleStatusChange = (value) => {
        const isOpen = value === "open";
        fnHiringStatus(isOpen).then(() => fnJob());
    };

    useEffect(() => {
        if (isLoaded) {
            fnJob();
        }
    }, [isLoaded]);

    if(!isLoaded || loadingJob){
        return(
            <BarLoader className="mb-4" width={"100%"} color="#36d7b7"/>
        );
    }
  
    return (
        <div className="flex flex-col gap-8 mt-5 px-4 sm:px-0">
            {/* Logo and Title - Fixed for mobile */}
            <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
                <div className="order-2 md:order-1 flex-1">
                    <h1 className="gradient-title font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                        {job?.title}
                    </h1>
                </div>
                <div className="order-1 md:order-2 flex justify-center md:justify-end">
                    <img 
                        src={job?.company?.logo_url} 
                        className="h-16 sm:h-20 md:h-12 w-auto object-contain" 
                        alt={job?.title}
                    />
                </div>
            </div>

            {/* Mobile-friendly layout for location, status, and applicants */}
            <div className="flex flex-col gap-3">
                {/* First row: Location and Open/Closed status */}
                <div className="flex justify-between items-center flex-wrap gap-2">
                    <div className="flex gap-2 items-center">
                        <MapPinIcon size={18} className="flex-shrink-0" />
                        <span className="text-sm sm:text-base">{job?.location}</span>
                    </div>
                    <div className="flex gap-2 items-center">
                        {job?.isOpen ? (
                            <>
                                <DoorOpen size={18} className="flex-shrink-0" /> 
                                <span className="text-sm sm:text-base">Open</span>
                            </>
                        ) : (
                            <>
                                <DoorClosed size={18} className="flex-shrink-0" /> 
                                <span className="text-sm sm:text-base">Closed</span>
                            </>
                        )}
                    </div>
                </div>

                {/* Second row: Applicants */}
                <div className="flex gap-2 items-center">
                    <Briefcase size={18} className="flex-shrink-0" /> 
                    <span className="text-sm sm:text-base">
                        {job?.applications?.length} Applicant{job?.applications?.length !== 1 ? 's' : ''}
                    </span>
                </div>
            </div>

            {/* Hiring Status */}
            {loadingHiringStatus && <BarLoader width={"100%"} color="#36d7b7"/>}

            {job?.recruiter_id === user?.id &&(
                <Select onValueChange={handleStatusChange}>
                    <SelectTrigger className={`w-full ${job?.isOpen ? "bg-green-950" : "bg-red-950"}`}>
                        <SelectValue 
                        placeholder={
                            "Hiring Status " + (job?.isOpen ? "(Open)" : "(Closed)")
                            }
                            />
                    </SelectTrigger>
                    <SelectContent 
                                position="popper" 
                                sideOffset={5} 
                                className="bg-slate-800 border border-slate-600 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] overflow-hidden p-1">
                            <SelectItem 
                                value="open" 
                                className="px-4 py-3 rounded-lg text-green-300 hover:bg-green-900/40 focus:bg-green-900/40 cursor-pointer">
                                Open
                            </SelectItem>
                            <SelectItem 
                                value="closed" 
                                className="px-4 py-3 rounded-lg text-red-300 hover:bg-red-900/40 focus:bg-red-900/40 cursor-pointer">
                                Closed
                            </SelectItem>
                    </SelectContent>
                </Select>
            )}
            
            <h2 className="text-2xl sm:text-3xl font-bold">About the job</h2>
            <p className="sm:text-lg">{job?.description}</p>
            
            <h2 className="text-2xl sm:text-3xl font-bold">
                What we are looking for
            </h2>
            <div className="bg-transparent sm:text-lg">
                {job?.requirements.split('\n').map((req, index) => (
                    req.trim() && (
                        <div key={index} className="flex gap-2 mb-2">
                            <span>•</span>
                            <span>{req.replace(/^-\s*/, '')}</span>
                        </div>
                    )
                ))}
            </div>
            {/*render applications*/}

            {job?.recruiter_id !== user?.id && (
                <ApplyJobDrawer 
                job={job} 
                user={user} 
                fetchJob={fnJob}
                applied={job?.applications?.find((ap) => ap.candidate_id === user.id)}
                />
            )}

            {job?.applications?.length > 0 && job?.recruiter_id === user?.id &&(
            <div className="flex flex-col gap-2">
                <h2 className="text-2xl sm:text-3xl font-bold">Applications</h2>
                {job?.applications.map((application) => {
                    return(
                        <ApplicationCard
                        key={application.id} 
                        application={application} />
                    );
                })}
            </div>           
            )}
        </div>
    );
};

export default JobPage;