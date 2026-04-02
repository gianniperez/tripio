import React from "react";
import { Icon } from "@/components/ui/Icon";
import { PageHeaderProps } from "./PageHeader.types";

export const PageHeader = ({ title, description, mainIcon }: PageHeaderProps) => {
  return (
    <header className="relative top-0 z-20 flex flex-col pt-6 pb-4 px-4 border-b border-gray-100/50 animate-in fade-in slide-in-from-top-4 duration-500">
      {/* {mainIcon && (
        <div className="-z-10 absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-primary/20">
          <Icon name={mainIcon} size={120} fill />
        </div>
      )} */}
      <div className="flex flex-col items-left text-left">
        <h1 className="text-3xl font-black text-primary leading-none flex items-left gap-2">
          {title}
        </h1>
        {description && <p className="text-sm font-medium text-main mt-1">{description}</p>}
      </div>
    </header>
  );
};
