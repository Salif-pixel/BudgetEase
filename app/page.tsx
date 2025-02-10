
import * as React from "react";
import Header from "@/src/components/Landing/Header";
import {Hero} from "@/src/components/Landing/Hero";
import {Bento} from "@/src/components/Landing/Bento";
import HeroGeometric from "@/src/components/Landing/Elevate";
import Dashboard from "@/src/components/Landing/dashboard";




export default function Home() {

  return (
 <div>
     <Header/>
     <Bento/>
     <Dashboard/>
     <Hero/>
     <HeroGeometric/>
 </div>
     );
}
