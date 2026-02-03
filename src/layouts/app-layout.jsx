import Header from "@/components/header";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
    return (
    <div>
        <div className="grid-background"></div>
        <main className="min-h-screen container mx-auto px-16">
            <Header/>
            <Outlet/>
        </main>
        <div className="p-10 text-center bg-gray-800 mt-10">
            Made by Sakshi
        </div>
    </div>
    );
};

export default AppLayout;