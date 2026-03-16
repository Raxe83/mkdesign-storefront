'use client'

import { DynamicIcon, IconName } from "lucide-react/dynamic";
import { FC } from "react";

type IconProps = {
  name: IconName;
  color?: string;
  size?: number;
};

const DynamicIconComponent: FC<IconProps> = ({
  name,
  color = "black",
  size = 24,
}) => {
  return <DynamicIcon name={name} color={color} size={size} />;
};

export default DynamicIconComponent;
