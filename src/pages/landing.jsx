import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Link } from "react-router-dom";
import companies from "../data/companies.json";
import faqs from "../data/faq.json";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const LandingPage = () => {
  return (
    <main className="flex flex-col gap-10 sm:gap-20 py-10 sm:py-20 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="text-center">
        <h1 className="flex flex-col items-center justify-center gradient-title 
          text-3xl sm:text-5xl lg:text-7xl font-extrabold tracking-tighter py-4">
          Find Your Dream Job{" "}
          <span className="flex items-center gap-2 sm:gap-6 mt-2">
            And Get{" "}
            <img
              src="/logo.png"
              alt="Hirrd Logo"
              className="h-12 sm:h-20 lg:h-28 w-auto object-contain"
            />
          </span>
        </h1>
        <p className="text-gray-300 mt-2 sm:mt-4 text-sm sm:text-lg lg:text-xl">
          Explore thousands of job listings or find the perfect candidate
        </p>
      </section>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
        <Link to="jobs" className="w-full sm:w-auto">
          <Button variant="blue" size="xl" className="w-full sm:w-40">
            Find Jobs
          </Button>
        </Link>
        <Link to="post-job" className="w-full sm:w-auto">
          <Button size="xl" variant="destructive" className="w-full sm:w-40">
            Post a Job
          </Button>
        </Link>
      </div>

      {/* Company Carousel */}
      <Carousel plugins={[Autoplay({ delay: 2000 })]} className="w-full py-10">
        <CarouselContent className="flex gap-5 sm:gap-10 lg:gap-20 items-center">
          {companies.map(({ name, id, path }) => (
            <CarouselItem key={id} className="basis-1/2 sm:basis-1/3 lg:basis-1/6 flex justify-center">
              <img
                src={path}
                alt={name}
                className="h-8 sm:h-12 lg:h-16 object-contain"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Banner */}
      <img
        src="/banner.jpeg"
        alt="Banner"
        className="w-full h-40 sm:h-64 lg:h-96 object-cover rounded-lg shadow-md"
      />

      {/* Info Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl lg:text-2xl">For Job Seekers</CardTitle>
          </CardHeader>
          <CardContent className="text-sm sm:text-base lg:text-lg">
            Search and apply for jobs, track applications, and more.
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl lg:text-2xl">For Employers</CardTitle>
          </CardHeader>
          <CardContent className="text-sm sm:text-base lg:text-lg">
            Post jobs, manage applications, and find the best candidates.
          </CardContent>
        </Card>
      </section>

      {/* FAQ Accordion */}
      <Accordion type="single" collapsible defaultValue="item-1" className="w-full max-w-3xl mx-auto">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index + 1}`}>
            <AccordionTrigger className="text-sm sm:text-base lg:text-lg font-semibold">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-xs sm:text-sm lg:text-base text-gray-300">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </main>
  );
};

export default LandingPage;