"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Breadcrumb } from "./Breadcrumb";
import { getBreadcrumbData } from "./breadcrumbData";

interface PageHeaderProps {
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ 
  className 
}) => {
  const pathname = usePathname();
  const breadcrumbItems = getBreadcrumbData(pathname);

  return (
    <div className={className}>
      <Breadcrumb items={breadcrumbItems} />
    </div>
  );
};
