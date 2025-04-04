"use client";

import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Header from "../../components/Header";

import Navigation, { VIEW_TABS } from "../../components/Navigation";
import ViewManager from "../../components/views/ViewManager";

const Home: NextPage = () => {
  const [activeTab, setActiveTab] = useState(VIEW_TABS[0]);

  return (
    <>
      <Header />

      <div className="container mx-auto pt-10">
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      <ViewManager activeTab={activeTab} />
    </>
  );
};

export default Home;
