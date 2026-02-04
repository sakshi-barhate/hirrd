import { Link, useSearchParams } from "react-router-dom";
import { Button } from "./ui/button";
import { SignedIn, SignedOut, SignIn, UserButton, useUser } from "@clerk/clerk-react";
import { BriefcaseBusiness, Heart, PenBox } from "lucide-react";
import { useEffect, useState } from "react";

const Header = () => {
    const [showSignIn, setShowSignIn] = useState(false);

    const [search, setSearch] = useSearchParams();
    const { user } = useUser();

    useEffect(() => {
        if (search.get("sign-in")) setShowSignIn(true);
    }, [search]);

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            setShowSignIn(false);
            setSearch({});
        }
    };

    return (
        <>
            <nav className="py-4 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
                <Link>
                    <img src="/logo.png" className="h-16 sm:h-20 w-auto object-contain" />
                </Link>

                <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-center">
                    <SignedOut>
                        <Button
                            variant="outline"
                            onClick={() => setShowSignIn(true)}
                            className="w-full sm:w-auto"
                        >
                            Login
                        </Button>
                    </SignedOut>
                    <SignedIn>
                        {user?.unsafeMetadata?.role === "recruiter" && (
                            <Link to="/post-job" className="w-full sm:w-auto">
                                <Button
                                    variant="destructive"
                                    className="rounded-full w-full sm:w-auto flex items-center justify-center"
                                >
                                    <PenBox size={20} className="mr-2" />
                                    Post a Job
                                </Button>
                            </Link>
                        )}

                        <UserButton
                            appearance={{
                                elements: {
                                    avatarBox: "w-10 h-10",
                                },
                            }}
                        >
                            <UserButton.MenuItems>
                                <UserButton.Link
                                    label="My Jobs"
                                    labelIcon={<BriefcaseBusiness size={15} />}
                                    href="/my-jobs"
                                />
                                <UserButton.Link
                                    label="Saved Jobs"
                                    labelIcon={<Heart size={15} />}
                                    href="/saved-jobs"
                                />
                            </UserButton.MenuItems>
                        </UserButton>
                    </SignedIn>
                </div>
            </nav>

            {showSignIn && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
                    onClick={handleOverlayClick}
                >
                    <SignIn
                        signUpForceRedirectUrl="/onboarding"
                        fallbackRedirectUrl="/onboarding"
                    />
                </div>
            )}
        </>
    );
};

export default Header;