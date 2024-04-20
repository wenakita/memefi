import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { GlobeIcon } from "@radix-ui/react-icons";
interface AlertsProps {
  title: string;
  description: string;
  variant?: string; // Assuming variant is optional
}

const Alerts: React.FC<AlertsProps> = (props) => {
  const { title, description } = props;
  return (
    <Alert className={`rounded-xl bg-black border-slate-500`}>
      <GlobeIcon className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
};

export default Alerts;
