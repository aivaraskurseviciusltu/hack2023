import * as React from "react";
import { ReactComponent as Enemy } from "./icons/Enemy.svg";
import { ReactComponent as Explosion } from "./icons/Explosion.svg";
import { ReactComponent as Help } from "./icons/Help.svg";
import { ReactComponent as Pickup } from "./icons/Pickup.svg";
import { ReactComponent as Resources } from "./icons/Resources.svg";
import { ReactComponent as ShelterNoCount } from "./icons/ShelterNoCount.svg";

const pinStyle = {
  cursor: "pointer",
  fill: "#d00",
  stroke: "none",
};

const CURRENT_LOCATION = `M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3
  c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9
  C20.1,15.8,20.2,15.8,20.2,15.7z`;

function Pin({ size = 60, iconType }) {
  const getIcon = () => {
    switch (iconType) {
      case "Enemy":
        return <Enemy height={size} />;
      case "Explosion":
        return <Explosion height={size} />;
      case "Help":
        return <Help height={size} />;
      case "Pickup":
        return <Pickup height={size} />;
      case "Resources":
        return <Resources height={size} />;
      case "ShelterNoCount":
        return <ShelterNoCount height={size} />;
      default:
        return (
          <svg height={20} viewBox="0 0 24 24" style={pinStyle}>
            <path d={CURRENT_LOCATION} />
          </svg>
        );
    }
  };
  console.log(getIcon());
  return getIcon();
}

export default React.memo(Pin);
