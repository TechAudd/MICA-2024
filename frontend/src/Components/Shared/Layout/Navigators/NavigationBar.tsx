import React from "react";
import navImage from "../../../../Assets/images/IEEE_Conference_website_strip.webp_ietcint.jpg";

const NavigationBar: React.FC = () => {
  return (
    <nav className="flex justify-center items-center">
      <img className="w-full h-full " src={navImage} />
    </nav>
  );
};

export default NavigationBar;
