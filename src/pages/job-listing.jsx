import { getCompanies } from "@/api/apiCompanies";
import { getJobs } from "@/api/apiJobs";
import JobCard from "@/components/job-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import { State } from "country-state-city";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";

const JobListing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [company_id, setComapny_id] = useState("");

  const { isLoaded } = useUser();

  const {
    fn: fnJobs,
    data: jobs,
    loading: loadingJobs,
  } = useFetch(getJobs, { location, company_id, searchQuery });

  const {
    fn: fnCompanies,
    data: companies,
  } = useFetch(getCompanies);

  useEffect(() => {
    if (isLoaded) {
      fnCompanies();
    }
  }, [isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      fnJobs();
    }
  }, [isLoaded, location, company_id, searchQuery]);

  useEffect(() => {
    if (jobs) {
      console.log("Jobs data:", jobs);
    }
  }, [jobs]);

  const handleSearch = (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);
    const query = formData.get("search-query");
    if (query) setSearchQuery(query);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setComapny_id("");
    setLocation("");
  };

  if (!isLoaded) {
    return (
      <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <h1 className="gradient-title font-extrabold 
        text-4xl sm:text-6xl lg:text-7xl 
        text-center pb-8">
        Latest Jobs
      </h1>

      {/* Search Bar */}
      <form 
        onSubmit={handleSearch} 
        className="flex flex-col sm:flex-row w-full gap-2 items-center mb-3"
      >
        <Input 
          type="text"
          placeholder="Search Jobs by Title.."
          name="search-query"
          className="h-12 flex-1 px-4 text-md w-full sm:w-auto"
        />
        <Button 
          type="submit" 
          className="h-12 w-full sm:w-28" 
          variant="blue"
        >
          Search
        </Button>
      </form>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        <Select value={location} onValueChange={(value) => setLocation(value)}>
          <SelectTrigger className="w-full sm:w-1/3">
            <SelectValue placeholder="Filter by Location" />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            <SelectGroup>
              {State.getStatesOfCountry("IN").map(({ name }) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select value={company_id} onValueChange={(value) => setComapny_id(value)}>
          <SelectTrigger className="w-full sm:w-1/3">
            <SelectValue placeholder="Filter by Companies" />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            <SelectGroup>
              {companies?.map(({ name, id }) => (
                <SelectItem key={id} value={id}>
                  {name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button 
          onClick={clearFilters} 
          variant="destructive" 
          className="w-full sm:w-1/3"
        >
          Clear Filters
        </Button>
      </div>

      {/* Loader */}
      {loadingJobs && (
        <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
      )}

      {/* Job Cards */}
      {loadingJobs === false && (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs?.length ? (
            jobs.map((job) => (
              <JobCard 
                key={job.id} 
                job={job}
                savedInit={job?.saved?.length > 0}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500">
              No Jobs Found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobListing;